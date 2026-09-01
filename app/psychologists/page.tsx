import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/prisma";

export default async function Psychologists() {
  const u = await getSessionUser();
  if (!u) redirect("/login");
  const ps = await db.psychologist.findMany({ orderBy:{name:"asc"} });

  return <main className="main">
    <div className="eyebrow">Reference library</div>
    <h1 className="h1">Psychologists.</h1>
    <p className="muted psychologist-intro">Not a hall of fame. A study index. Open a name mentally as a bundle: person → idea → evidence → criticism → related topics.</p>
    <div className="grid grid3" style={{marginTop:24}}>
      {ps.map(p => <article className="psych-card" key={p.id}>
        <div className="psych-avatar">{p.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</div>
        <div className="eyebrow">{p.era}</div>
        <h2>{p.name}</h2>
        <p className="psych-bio">{p.biography}</p>
        <div className="psych-section"><b>Major work</b><p>{p.majorWork}</p></div>
        <div className="psych-section"><b>Theories / concepts</b><p>{(Array.isArray(p.theories)?p.theories:[]).join(" · ")}</p></div>
        <div className="psych-section"><b>Related topics</b><p>{(Array.isArray(p.relatedTopics)?p.relatedTopics:[]).join(" · ")}</p></div>
      </article>)}
    </div>
  </main>
}
