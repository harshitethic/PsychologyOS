import Link from "next/link";
import {redirect} from "next/navigation";
import {getSessionUser} from "@/lib/auth";
import {db} from "@/lib/prisma";
export default async function Revision(){
 const u=await getSessionUser();if(!u)redirect("/login");
 const items=await db.revisionItem.findMany({where:{userId:u.id},include:{topic:true},orderBy:{dueAt:"asc"},take:20});
 return <main className="main"><div className="eyebrow">Spaced revision</div><h1 className="h1">Review today.</h1><p className="muted">New → Learning → Review → Strong. Revision is driven by actual quiz/flashcard activity, not fake streak pressure.</p><div className="grid grid2" style={{marginTop:24}}>{items.length?items.map(i=><Link className="card" href={`/topics/${i.topic.slug}`} key={i.id}><div className="between"><div><div className="eyebrow">{i.dueAt<=new Date()?"DUE":"UPCOMING"}</div><h2 className="h2">{i.topic.title}</h2></div><span>→</span></div><p className="muted">Interval {i.interval} day{i.interval===1?"":"s"} · ease {i.ease.toFixed(1)}</p></Link>):<div className="card"><h2 className="h2">Nothing is due yet.</h2><p className="muted">Take a topic quiz and the system will start building your revision queue.</p><Link className="btn" href="/semesters">Study a topic</Link></div>}</div></main>
}
