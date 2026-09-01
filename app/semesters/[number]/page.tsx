import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { SemesterBrain } from "@/components/SemesterBrain";
import { SemesterView } from "@/components/SemesterView";

export default async function Semester({ params }: { params: Promise<{ number: string }> }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const { number } = await params;
  const n = Number(number);

  const include = {
    subjects: {
      include: {
        units: {
          include: {
            topics: { include: { progress: { where: { userId: user.id } } } }
          }
        }
      }
    }
  } as const;

  let semester = await db.semester.findFirst({
    where: user.course
      ? { number: n, year: { course: { name: user.course } } }
      : { number: n },
    orderBy: { yearId: "asc" },
    include
  });

  // A profile may have an old/custom course label. Never make a valid
  // semester disappear just because that label differs from the seed.
  if (!semester && user.course) {
    semester = await db.semester.findFirst({
      where: { number: n },
      orderBy: { yearId: "asc" },
      include
    });
  }


  if (!semester) {
    return <main className="main"><h1 className="h1">Semester not found</h1></main>;
  }

  const topicCount = semester.subjects.reduce(
    (sum, s) => sum + s.units.reduce((a, u) => a + u.topics.length, 0), 0
  );
  const completedCount = semester.subjects.reduce(
    (sum, s) => sum + s.units.reduce(
      (a, u) => a + u.topics.filter(t => t.progress[0]?.percent >= 100).length, 0
    ), 0
  );

  const route = [
    ["01", "Fundamentals first", "Start with the subject that gives you the language of psychology.", "/topics/fundamental-of-psychology-meaning-and-goals-of-psychology"],
    ["02", "Biology → behaviour", "Learn the nervous system before trying to explain behaviour biologically.", "/topics/biological-basis-of-behavior-neurons-and-glial-cells"],
    ["03", "Measure before you label", "Psychological assessment teaches you how scores become evidence.", "/topics/psychological-assessment-what-is-psychological-assessment"],
    ["04", "Practicum", "Convert definitions into observation, interviewing and professional documentation.", "/topics/practicum-1-behavioural-observation"],
    ["05", "Apply it", "Use wellness, cultural and economic perspectives to broaden your psychological thinking.", "#"],
    ["06", "Test + revise", "Finish a study block with flashcards, 10 MCQs and spaced revision.", "/revision"],
  ];

  return (
    <main className="main semester-page">
      <SemesterBrain
        semester={n}
        subjectCount={semester.subjects.length}
        topicCount={topicCount}
        completedCount={completedCount}
      />

      <div className="semester-note">
        <div>
          <div className="eyebrow">How to study</div>
          <strong>Do not read the semester top-to-bottom like a PDF.</strong>
        </div>
        <p>Learn a foundation topic → recall it without notes → take the 10-question quiz → mark weak points → return for spaced revision. The branch view below is your syllabus map; the route view is the recommended learning sequence.</p>
      </div>

      <SemesterView
        route={
          <section className="study-route-wrapper">
            <div className="semester-section-head">
              <div><div className="eyebrow">Recommended study route</div><h2 className="section-title">Learn in this order.</h2></div>
              <Link className="btn secondary" href="/revision">Review due topics →</Link>
            </div>
            <div className="study-route">
              {route.map(([n1, title, desc, href]) => (
                <Link href={href} className="route-card" key={n1}>
                  <span>{n1}</span>
                  <div><strong>{title}</strong><p>{desc}</p></div>
                </Link>
              ))}
            </div>
          </section>
        }
      >
        <section>
          <div className="semester-section-head official-head">
            <div><div className="eyebrow">Your semester branches</div><h2 className="section-title">Subjects → units → topics.</h2></div>
            <span className="pill">Study map</span>
          </div>
          <div className="subject-rail">
            {semester.subjects.map((s, index) => {
              const topics = s.units.flatMap(u => u.topics);
              const done = topics.filter(t => t.progress[0]?.percent >= 100).length;
              const pct = Math.round((done / Math.max(topics.length,1))*100);
              return (
                <section className="subject-brain-card" key={s.id}>
                  <div className="subject-badge">{String(index+1).padStart(2,"0")}</div>
                  <div className="subject-card-main">
                    <div className="between">
                      <div>
                        <div className="eyebrow">Curriculum subject</div>
                        <h2>{s.name}</h2>
                      </div>
                      <span className="pill">{topics.length} topics</span>
                    </div>
                    <div className="subject-progress-row">
                      <span>{done}/{topics.length} completed</span>
                      <div className="progress"><i style={{width:`${pct}%`}}/></div>
                      <b>{pct}%</b>
                    </div>
                    {s.units.map(u => (
                      <div className="unit-block" key={u.id}>
                        <div className="unit-head"><span className="unit-number">UNIT {u.number}</span><span>{u.title}</span></div>
                        <div className="topic-list-brain">
                          {u.topics.map(t => {
                            const tp = t.progress[0];
                            const tPct = tp?.percent || 0;
                            return (
                              <Link href={`/topics/${t.slug}`} key={t.id} className="topic-brain-row">
                                <span className={`topic-dot ${tPct >= 100 ? "done" : ""}`} />
                                <span className="topic-name">{t.title}</span>
                                <span className="topic-mini-progress">{tPct ? `${tPct}%` : "Start"}</span>
                                <span className="topic-arrow">↗</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </section>
      </SemesterView>
    </main>
  );
}
