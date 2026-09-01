import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/prisma";
import { setSession } from "@/lib/auth";
export async function POST(req:Request){
 const f=await req.formData(); const name=String(f.get("name")||"").trim(), username=String(f.get("username")||"").trim().toLowerCase(), email=String(f.get("email")||"").trim().toLowerCase(), password=String(f.get("password")||""), answer=String(f.get("answer")||"");
 if(!name||!username||!email||password.length<8||!answer) return NextResponse.redirect(new URL("/signup?error=invalid",req.url));
 const exists=await db.user.findFirst({where:{OR:[{email},{username}]}});
 if(exists) return NextResponse.redirect(new URL("/signup?error=exists",req.url));
 const user=await db.user.create({data:{name,username,email,passwordHash:await bcrypt.hash(password,12),securityHash:await bcrypt.hash(answer.toLowerCase(),12)}});
 await setSession(user.id);
 return NextResponse.redirect(new URL("/dashboard",req.url));
}
