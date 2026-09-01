import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { ProfileClient } from "@/components/ProfileClient";

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return <main className="main">
    <div className="eyebrow">YOUR PROFILE</div>
    <h1 className="h1">Student profile.</h1>
    <p className="muted">Username, course and year are what other students can see.</p>
    <ProfileClient user={{name:user.name,username:user.username,email:user.email,course:user.course,year:user.year}}/>
  </main>;
}
