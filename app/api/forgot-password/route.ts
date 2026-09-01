import {NextResponse} from "next/server";
import {db} from "@/lib/prisma";
import {hash} from "bcryptjs";

export async function POST(req:Request){
  const {identifier,newPassword}=await req.json();
  if(!identifier||!newPassword||String(newPassword).length<8)return NextResponse.json({error:"Enter a username/email and a password of at least 8 characters."},{status:400});
  const value=String(identifier);
  const u=await db.user.findFirst({where:{OR:[{email:value.toLowerCase()},{username:value}]}});
  if(!u)return NextResponse.json({error:"No account found for that username/email."},{status:404});
  await db.user.update({where:{id:u.id},data:{passwordHash:await hash(String(newPassword),12)}});
  return NextResponse.json({message:"Password updated. You can now log in."});
}
