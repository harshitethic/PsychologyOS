"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronDown, Clock3, FileQuestion } from "lucide-react";

type Exam = {
  id: string;
  title: string;
  durationMin: number;
  semester: { number: number };
  _count: { questions: number };
};

export function MockExamBrowser({ exams }: { exams: Exam[] }) {
  const groups = useMemo(() => {
    const map = new Map<number, Exam[]>();
    for (const exam of exams) {
      const list = map.get(exam.semester.number) ?? [];
      list.push(exam);
      map.set(exam.semester.number, list);
    }
    return [...map.entries()].sort((a,b) => a[0] - b[0]);
  }, [exams]);

  const [open, setOpen] = useState<number | null>(groups[0]?.[0] ?? null);

  return (
    <div className="exam-room">
      <div className="exam-room-hero">
        <div>
          <div className="eyebrow">PRACTICE ROOM</div>
          <h2>Choose your semester first.</h2>
          <p>Then pick a paper. Every paper is 45 questions with a 15-minute timer.</p>
        </div>
        <div className="exam-room-badge"><strong>{exams.length}</strong><span>papers</span></div>
      </div>

      <div className="exam-semester-list">
        {groups.map(([semester, papers]) => {
          const isOpen = open === semester;
          return (
            <section className={`exam-semester ${isOpen ? "open" : ""}`} key={semester}>
              <button className="exam-semester-head" onClick={() => setOpen(isOpen ? null : semester)}>
                <span className="exam-semester-number">{String(semester).padStart(2,"0")}</span>
                <span className="exam-semester-title">
                  <small>SEMESTER</small>
                  <strong>Semester {semester}</strong>
                  <em>{papers.length} mock papers</em>
                </span>
                <ChevronDown size={19} />
              </button>

              {isOpen && (
                <div className="exam-paper-grid">
                  {papers.map((paper, index) => (
                    <article className="simple-exam-card" key={paper.id}>
                      <div className="simple-exam-top">
                        <span>Paper {index + 1}</span>
                        <span className="paper-level">{index === 0 ? "Starter" : index === papers.length - 1 ? "Final" : "Practice"}</span>
                      </div>
                      <h3>Mock Paper {index + 1}</h3>
                      <div className="simple-exam-meta">
                        <span><FileQuestion size={14}/>{paper._count.questions} questions</span>
                        <span><Clock3 size={14}/>{paper.durationMin} min</span>
                      </div>
                      <Link href={`/exams/${paper.id}`} className="btn simple-exam-button">Start paper →</Link>
                    </article>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
