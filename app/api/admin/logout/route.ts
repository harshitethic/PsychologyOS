import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/adminAuth";

export async function POST() {
  await clearAdminSession();
  return NextResponse.redirect(new URL("/admin", "http://localhost:3000"));
}
