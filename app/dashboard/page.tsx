import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/prisma";

export default async function Dashboard(){
  const user=await getSessionUser();if(!user)redirect("/login");
  const total=await db.topic.count();
  const done=await db.topicProgress.count({where:{userId:user.id,percent:{gte:100}}});
  const due=await db.revisionItem.count({where:{userId:user.id,dueAt:{lte:new Date()}}});
  const attempts=await db.mCQAttempt.count({where:{userId:user.id}});
  const progress=total?Math.round(done/total*100):0;
  const recent=await db.topic.findMany({take:6,orderBy:{id:"desc"},include:{subject:true}});
  const steps=[
    ["01","Learn","Read one topic from zero.",`/semesters/${user.semester||1}`],
    ["02","Recall","Use flashcards without looking.",`/revision`],
    ["03","Connect","Open the mind map and explain the links.",`/semesters/${user.semester||1}`],
    ["04","Prove it","Take a quiz or timed mock.",`/exams`]
  ];
  return <main className="main dashboard-v2">
    <div className="dashboard-hero"><div><div className="eyebrow">STUDENT DASHBOARD</div><h1 className="dashboard-title">Good morning, {user.name.split(" ")[0]}.</h1><p className="dashboard-sub">No motivation theatre. Just the next useful thing.</p></div><div className="dashboard-brain"><img className="brain-image" src="/brain.png" alt="" aria-hidden="true"/></div></div>
    <section className="dashboard-focus card"><div><div className="eyebrow">YOUR NEXT MOVE</div><h2>Finish one topic properly.</h2><p>Understand it, see an example, connect it, then test yourself. Do not turn study into tab collecting.</p></div><div className="dashboard-focus-actions"><Link className="btn" href={`/semesters/${user.semester||1}`}>Continue study →</Link><Link className="btn secondary" href="/ai">Ask AI tutor</Link></div></section>
    <div className="grid grid4 dashboard-stats">
      <div className="card stat"><div className="eyebrow">COMPLETION</div><b>{progress}%</b><div className="mini-progress"><i style={{width:`${progress}%`}}/></div></div>
      <div className="card stat"><div className="eyebrow">TOPICS LEFT</div><b>{Math.max(0,total-done)}</b><span className="stat-note">{total} in curriculum</span></div>
      <div className="card stat"><div className="eyebrow">MCQ ATTEMPTS</div><b>{attempts}</b><span className="stat-note">Practice beats rereading</span></div>
      <div className="card stat"><div className="eyebrow">REVIEW TODAY</div><b>{due}</b><span className="stat-note">{due?"Ready to revise":"Nothing due"}</span></div>
    </div>
    <div className="dashboard-grid-2">
      <section className="card"><div className="between"><div><div className="eyebrow">CONTINUE LEARNING</div><h2 className="h2">Jump back in</h2></div><Link href="/semesters">All subjects →</Link></div><div className="dashboard-topic-list">{recent.map(t=><Link href={`/topics/${t.slug}`} key={t.id}><div><strong>{t.title}</strong><span>{t.subject.name}</span></div><span>→</span></Link>)}</div></section>
      <section className="card dashboard-route"><div className="eyebrow">THE STUDY LOOP</div><h2 className="h2">Use the app in this order.</h2><div className="route-steps">{steps.map(([n,title,text,href])=><Link key={n} href={href}><span>{n}</span><div><strong>{title}</strong><p>{text}</p></div><b>→</b></Link>)}</div></section>
    </div>
    <div className="dashboard-community"><section className="card community-promo"><div><div className="eyebrow">STUDENT COMMON ROOM</div><h2 className="h2">Stuck? Ask another student.</h2><p className="muted">Everyone who signs up gets access. Usernames first; course/year are optional.</p></div><Link className="btn" href="/community">Talk to people →</Link></section><section className="card open-source-promo"><div><div className="eyebrow">OPEN SOURCE</div><h2 className="h2">Built for college students.</h2><p className="muted">Open-source study software by @harshitethic.</p></div><a className="btn secondary" href="https://github.com/harshitethic" target="_blank" rel="noreferrer">GitHub →</a></section></div>
  </main>;
}
