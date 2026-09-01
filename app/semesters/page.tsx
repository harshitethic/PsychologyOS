import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
export default async function Semesters(){
 const user=await getSessionUser();if(!user)redirect("/login");
 const course=await db.course.findFirst({include:{years:{include:{semesters:{include:{subjects:{include:{units:{include:{topics:true}}}}}}}}}});
 return <main className="main"><div className="eyebrow">Curriculum</div><h1 className="h1">{course?.name||"B.Sc. Clinical Psychology"}</h1><p className="muted">A structured academic workspace for B.Sc. Psychology & Clinical Psychology students.</p>
 <div className="grid grid3" style={{marginTop:24}}>{course?.years.flatMap(y=>y.semesters).map(s=><Link className="card" key={s.id} href={`/semesters/${s.number}`}><div className="eyebrow">Year {Math.ceil(s.number/2)} · Semester {s.number}</div><h2 className="h2" style={{marginTop:10}}>Semester {s.number}</h2><p className="muted">{s.subjects.length} subjects · {s.subjects.reduce((a,x)=>a+x.units.reduce((b,u)=>b+u.topics.length,0),0)} topics</p></Link>)}</div>
 </main>
}
