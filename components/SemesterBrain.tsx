
"use client";
import { motion } from "framer-motion";

export function SemesterBrain({ semester, subjectCount, topicCount, completedCount }: any) {
  const pct = Math.round((completedCount / Math.max(topicCount, 1)) * 100);
  const pts = [
    [19, 35], [31, 20], [43, 42], [55, 22], [67, 38], [78, 57], [62, 70], [44, 72], [28, 63]
  ];
  return (
    <div className="semester-brain-card">
      <div className="semester-brain-copy">
        <div className="eyebrow">Semester cortex · Year {Math.ceil(semester / 2)}</div>
        <h1 className="semester-title">Semester {semester}</h1>
        <p>Every subject is a branch. Every topic is a node. Build understanding instead of collecting PDFs.</p>
        <div className="semester-stats">
          <div><strong>{subjectCount}</strong><span>subjects</span></div>
          <div><strong>{topicCount}</strong><span>study topics</span></div>
          <div><strong>{pct}%</strong><span>complete</span></div>
        </div>
        <div className="semester-progress"><i style={{width:`${pct}%`}} /></div>
      </div>
      <div className="semester-brain-art" aria-hidden="true">
        <svg viewBox="0 0 100 100" className="brain-svg">
          {pts.slice(0, -1).map((p, i) => {
            const q = pts[i + 1];
            return <line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} />;
          })}
          <line x1="43" y1="42" x2="78" y2="57" />
          <line x1="31" y1="20" x2="67" y2="38" />
          {pts.map(([x,y], i) => (
            <motion.circle key={i} cx={x} cy={y} r={i === 4 ? 2.8 : 1.9}
              animate={{r:[i===4?2.8:1.9, i===4?3.6:2.4, i===4?2.8:1.9], opacity:[.65,1,.65]}}
              transition={{duration:2.8+i*.12, repeat:Infinity}} />
          ))}
          <path className="brain-outline" d="M17 52 C12 37 21 25 36 26 C39 15 52 10 61 18 C74 16 84 27 80 39 C91 47 83 65 71 66 C67 79 51 84 43 75 C31 83 17 73 22 62 C17 59 16 56 17 52Z"/>
        </svg>
        <div className="brain-art-caption">KNOWLEDGE<br/>NETWORK</div>
      </div>
    </div>
  );
}
