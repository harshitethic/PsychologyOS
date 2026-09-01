import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { MockExamBrowser } from "@/components/MockExamBrowser";

export default async function Exams() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const exams = await db.mockExam.findMany({
    include: { _count: { select: { questions: true } }, semester: true },
    orderBy: [{ semester: { number: "asc" } }, { title: "asc" }],
  });

  return (
    <main className="main">
      <div className="eyebrow">ASSESSMENT</div>
      <h1 className="h1">Mock exams.</h1>
      <p className="muted">Simple, timed practice. Pick a semester and start a 45-question paper.</p>
      <MockExamBrowser exams={exams} />
    </main>
  );
}
