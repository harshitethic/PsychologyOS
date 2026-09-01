import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { FeedbackClient } from "@/components/FeedbackClient";

export default async function FeedbackPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const feedback = await db.feedback.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="main feedback-page">
      <div className="eyebrow">STUDENT FEEDBACK</div>
      <h1 className="h1">Tell us what needs fixing.</h1>
      <p className="muted">Bugs, missing content, confusing UI or ideas. Send it straight to the admin.</p>
      <FeedbackClient initial={feedback.map(f => ({
        id:f.id, message:f.message, status:f.status, adminReply:f.adminReply,
        createdAt:f.createdAt.toISOString(), repliedAt:f.repliedAt?.toISOString() || null
      }))}/>
    </main>
  );
}
