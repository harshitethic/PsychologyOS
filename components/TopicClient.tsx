"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { MindMap } from "@/components/MindMap";
import { StudyDiagram } from "@/components/StudyDiagram";


function StudyNotes({ text }: { text: string }) {
  const blocks = String(text ?? "")
    .split(/\n\s*\n/)
    .map((value) => value.trim())
    .filter(Boolean);

  return (
    <div className="study-notes-flow">
      {blocks.map((block, index) => {
        const headingMatch = block.match(/^##\s+(.+)\n?([\s\S]*)$/);
        if (!headingMatch) {
          return (
            <p className="study-note-paragraph" key={index}>
              {block}
            </p>
          );
        }

        const title = headingMatch[1].trim();
        const body = headingMatch[2].trim();
        const lower = title.toLowerCase();

        let tone = "plain";
        if (lower.includes("example")) tone = "example";
        if (lower.includes("exam")) tone = "exam";
        if (lower.includes("oversimpl") || lower.includes("mistake") || lower.includes("trap")) tone = "warning";
        if (lower.includes("final") || lower.includes("memory")) tone = "memory";
        if (lower.includes("start here") || lower.includes("one minute")) tone = "intro";

        return (
          <section className={`study-note-block ${tone}`} key={index}>
            <div className="study-note-heading">
              <span className="study-note-pin" />
              <h3>{title}</h3>
            </div>
            <div className="study-note-body">
              {body.split(/\n/).map((line: string, lineIndex: number) => (
                <p key={lineIndex}>{line}</p>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function TopicClient({
  topic,
  mcqs,
  flashcards,
  nextTopicSlug,
  nextTopicTitle,
}: {
  topic: any;
  mcqs: any[];
  flashcards: any[];
  nextTopicSlug?: string;
  nextTopicTitle?: string;
}) {
  const [tab, setTab] = useState<"learn" | "map" | "cards" | "quiz">("learn");
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentQuestion = mcqs[questionIndex];
  const scorePercent = mcqs.length ? Math.round((score / mcqs.length) * 100) : 0;

  async function answerQuestion(index: number) {
    if (selected !== null || !currentQuestion) return;
    setSelected(index);
    const correct = index === currentQuestion.answerIndex;
    if (correct) setScore((v) => v + 1);

    try {
      await fetch("/api/mcq-attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mcqId: currentQuestion.id, selected: index }),
      });
    } catch {
      // Keep the UI usable if persistence temporarily fails.
    }
  }

  function nextQuestion() {
    if (questionIndex >= mcqs.length - 1) setFinished(true);
    else {
      setQuestionIndex((v) => v + 1);
      setSelected(null);
    }
  }

  function retryQuiz() {
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  return (
    <div className="topic-workspace">
      <div className="topic-tabs">
        <button className={tab === "learn" ? "active" : ""} onClick={() => setTab("learn")}>▣ Learn</button>
        <button className={tab === "map" ? "active" : ""} onClick={() => setTab("map")}>◌ Mind map</button>
        <button className={tab === "cards" ? "active" : ""} onClick={() => setTab("cards")}>✧ Flashcards</button>
        <button className={tab === "quiz" ? "active" : ""} onClick={() => setTab("quiz")}>› 10 MCQs</button>
      </div>

      {tab === "learn" && (
        <div className="notebook">
          <section className="notebook-section">
            <div className="eyebrow">01 · OBJECTIVES</div>
            <h2>What you should be able to do</h2>
            <ul className="objective-list"><li>Explain the topic precisely, identify its major components, apply it to an example, and distinguish it from closely related ideas.</li></ul>
          </section>

          <section className="notebook-section">
            <div className="eyebrow">02 · IN ONE MINUTE</div>
            <h2>Quick explanation</h2>
            <p className="lead-note">{topic.quickExplanation}</p>
            <StudyDiagram title={topic.title} />
          </section>

          <section className="notebook-section">
            <div className="eyebrow">03 · UNIVERSITY NOTES</div>
            <h2>Detailed notes</h2>
            <StudyNotes text={String(topic.detailedNotes ?? "")} />
          </section>

          <div className="notebook-grid">
            <section className="note-card">
              <div className="eyebrow">KEY TERMS</div><h3>Words to own</h3>
              <div className="term-cloud">{(Array.isArray(topic.keyTerms) ? topic.keyTerms : []).map((x: string) => <span key={x}>{x}</span>)}</div>
            </section>
            <section className="note-card">
              <div className="eyebrow">EXAMPLES</div><h3>Make it concrete</h3>
              <ul>{(Array.isArray(topic.examples) ? topic.examples : []).map((x: string) => <li key={x}>{x}</li>)}</ul>
            </section>
            <section className="note-card">
              <div className="eyebrow">EXAM FOCUS</div><h3>What can get tested</h3><p>{topic.examFocus}</p>
            </section>
            <section className="note-card mistake">
              <div className="eyebrow">COMMON MISTAKES</div><h3>Don&apos;t lose marks here</h3><p>{topic.commonMistakes}</p>
            </section>
          </div>

          <section className="notebook-section">
            <div className="eyebrow">04 · LAST PAGE</div><h2>Quick revision</h2>
            <div className="revision-strip"><strong>Remember</strong> {topic.quickRevision}</div>
          </section>

          <div className="ai-note">
            <div><div className="eyebrow">OPTIONAL LOCAL TUTOR</div><h3>Ask this topic anything.</h3><p>Use the local AI tutor for explanations, examples and self-quizzing.</p></div>
            <Link className="btn" href={`/ai?topic=${encodeURIComponent(topic.slug)}`}>Open AI tutor →</Link>
          </div>
        </div>
      )}

      {tab === "map" && <MindMap topic={topic} />}

      {tab === "cards" && (
        <div className="flashcard-stage">
          <div className="flashcard-topline">
            <div><div className="eyebrow">MEMORY DRILL</div><h2>Flashcards</h2></div>
            <span className="flashcard-count">{flashcards.length ? cardIndex + 1 : 0} / {flashcards.length}</span>
          </div>
          {flashcards.length ? (
            <>
              <div className="flashcard-stage-card">
                <motion.div className="uno-inner" animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.45 }} onClick={() => setFlipped(v => !v)}>
                  <div className="uno-card-face uno-front"><div className="uno-border">
                    <div className="uno-corner tl">{String(cardIndex + 1).padStart(2, "0")}</div>
                    <div className="uno-corner br">{String(cardIndex + 1).padStart(2, "0")}</div>
                    <div className="uno-oval" /><div className="uno-label">RECALL</div>
                    <div className="uno-text">{flashcards[cardIndex].front}</div><div className="uno-flip-hint">Click to reveal the answer</div>
                  </div></div>
                  <div className="uno-card-face uno-back"><div className="uno-border">
                    <div className="uno-corner tl">{String(cardIndex + 1).padStart(2, "0")}</div>
                    <div className="uno-corner br">{String(cardIndex + 1).padStart(2, "0")}</div>
                    <div className="uno-oval answer-oval" /><div className="uno-label">ANSWER</div>
                    <div className="uno-text">{flashcards[cardIndex].back}</div><div className="uno-flip-hint">Click to flip back</div>
                  </div></div>
                </motion.div>
              </div>
              <div className="flashcard-actions">
                <button className="btn secondary" disabled={cardIndex === 0} onClick={() => { setCardIndex(v => v - 1); setFlipped(false); }}>Previous</button>
                <button className="btn" disabled={cardIndex === flashcards.length - 1} onClick={() => { setCardIndex(v => v + 1); setFlipped(false); }}>Next card <ChevronRight size={15}/></button>
              </div>
            </>
          ) : <div className="card">No flashcards yet.</div>}
        </div>
      )}

      {tab === "quiz" && (
        <div className="quiz-stage">
          <div className="quiz-progress-head"><div><div className="eyebrow">TEST YOURSELF</div><h2>{finished ? "Quiz complete." : `Question ${questionIndex + 1} of ${mcqs.length}`}</h2></div></div>
          {finished ? (
            <motion.div className="result-card" initial={{opacity:0,y:15}} animate={{opacity:1,y:0}}>
              <div className="result-ring"><span>{scorePercent}%</span></div>
              <div className="eyebrow">RESULT</div><h2>{score} / {mcqs.length}</h2>
              <p>{scorePercent >= 90 ? "Excellent. Keep this topic in spaced revision." : scorePercent >= 70 ? "Solid. Keep it in your revision queue." : "Review the notes before moving on."}</p>
              <button className="btn secondary" onClick={retryQuiz}><RotateCcw size={14}/> Retry quiz</button>
            </motion.div>
          ) : currentQuestion ? (
            <div className="quiz-card">
              <div className="quiz-question">{currentQuestion.question}</div>
              <div className="quiz-options">
                {(currentQuestion.options ?? []).map((option: string, index: number) => {
                  let state = "";
                  if (selected !== null) state = index === currentQuestion.answerIndex ? "correct" : index === selected ? "wrong" : "";
                  return <button key={`${option}-${index}`} className={`quiz-option-modern ${state}`} onClick={() => answerQuestion(index)}><span>{String.fromCharCode(65 + index)}</span>{option}</button>;
                })}
              </div>
              {selected !== null && <motion.div className="quiz-feedback" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
                <strong>{selected === currentQuestion.answerIndex ? "Correct." : "Not quite."}</strong>
                <p>{currentQuestion.explanation}</p>
                <button className="btn" onClick={nextQuestion}>{questionIndex === mcqs.length - 1 ? "Finish quiz" : "Next question"} <ChevronRight size={14}/></button>
              </motion.div>}
            </div>
          ) : <div className="card">No quiz questions yet.</div>}
        </div>
      )}

      <div className="topic-next-bar">
        <div><div className="eyebrow">NEXT TOPIC</div><strong>{nextTopicTitle || "Revision queue"}</strong></div>
        {nextTopicSlug
          ? <Link className="btn" href={`/topics/${nextTopicSlug}`}>Next topic →</Link>
          : <Link className="btn secondary" href="/revision">Go to revision →</Link>}
      </div>
    </div>
  );
}
