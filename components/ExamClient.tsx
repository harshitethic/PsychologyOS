"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export function ExamClient({ exam }: { exam: any }) {
  const [left, setLeft] = useState(exam.durationMin * 60);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const total = exam.questions.length;

  function submit() {
    if (submitting || submitted) return;
    let result = 0;
    exam.questions.forEach((q: any) => {
      if (answers[q.id] === q.mcq.answerIndex) result += 1;
    });
    setScore(result);
    setSubmitted(true);
    setSubmitting(true);

    fetch("/api/mock-attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examId: exam.id,
        results: exam.questions.map((q: any) => ({
          mcqId: q.mcq.id,
          selected: answers[q.id] ?? -1,
        })),
      }),
    }).finally(() => setSubmitting(false));
  }

  useEffect(() => {
    if (submitted) return;

    const timer = window.setInterval(() => {
      setLeft((value: number) => {
        if (value <= 1) {
          window.clearInterval(timer);
          submit();
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [submitted]);

  const answered = useMemo(() => Object.keys(answers).length, [answers]);
  const minutes = Math.floor(left / 60);
  const seconds = String(left % 60).padStart(2, "0");

  if (submitted) {
    const percentage = total ? Math.round((score / total) * 100) : 0;

    return (
      <div className="exam-result-page">
        <div className="result-card">
          <div className="eyebrow">EXAM COMPLETE</div>
          <div className="exam-result-score">{score}<span>/{total}</span></div>
          <div className="exam-result-percent">{percentage}%</div>
          <p>{percentage >= 80 ? "Strong work. Keep the weak areas in revision." : "Do not reread everything. Review the topics you missed and test again."}</p>
          <div className="row">
            <Link className="btn" href="/analytics">Open analytics →</Link>
            <Link className="btn secondary" href="/exams">Back to papers</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-session">
      <div className="exam-sticky-head">
        <div>
          <div className="eyebrow">15 MINUTE MOCK</div>
          <h1 className="h1">{exam.title}</h1>
          <p className="muted">{answered}/{total} answered</p>
        </div>
        <div className={`exam-timer ${left <= 60 ? "danger" : ""}`}>
          {minutes}:{seconds}
        </div>
      </div>

      <div className="exam-question-list">
        {exam.questions.map((q: any, i: number) => (
          <section className="exam-question-card" key={q.id}>
            <div className="exam-question-top">
              <div className="eyebrow">QUESTION {i + 1} / {total}</div>
              {answers[q.id] !== undefined && <span className="answered-dot">Answered</span>}
            </div>
            <h2>{q.mcq.question}</h2>

            <div className="exam-options">
              {q.mcq.options.map((option: string, j: number) => (
                <button
                  key={`${q.id}-${j}`}
                  className={answers[q.id] === j ? "exam-option selected" : "exam-option"}
                  onClick={() => setAnswers((current) => ({ ...current, [q.id]: j }))}
                >
                  <span>{String.fromCharCode(65 + j)}</span>
                  {option}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="exam-submit-bar">
        <div>
          <strong>{answered} / {total}</strong>
          <span> answered</span>
        </div>
        <button className="btn" onClick={submit}>Submit exam →</button>
      </div>
    </div>
  );
}
