import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { AITutorChat } from "@/components/AITutorChat";

export default async function AI({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const topic = params.topic || "psychology";
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  await db.aIConversation.deleteMany({
    where: { userId: user.id, createdAt: { lt: since } },
  });

  const history = await db.aIConversation.findMany({
    where: {
      userId: user.id,
      topicId: topic,
      createdAt: { gte: since },
    },
    orderBy: { createdAt: "asc" },
    select: { role: true, content: true, createdAt: true },
  });

  return (
    <main className="main ai-page">
      <div className="ai-page-intro">
        <div className="eyebrow">STUDY COMPANION</div>
        <h1 className="h1">Talk it through.</h1>
        <p className="muted">
          Ask questions the way you would ask a classmate. The tutor keeps this
          conversation for 7 days.
        </p>
      </div>

      <AITutorChat
        topic={topic}
        initial={history.map((item) => ({
          role: item.role as "user" | "assistant",
          content: item.content,
          createdAt: item.createdAt.toISOString(),
        }))}
      />
    </main>
  );
}
