import {redirect,notFound} from "next/navigation";
import {getSessionUser} from "@/lib/auth";
import {db} from "@/lib/prisma";
import {ExamClient} from "@/components/ExamClient";
export default async function Exam({params}:{params:Promise<{id:string}>}){const u=await getSessionUser();if(!u)redirect("/login");const {id}=await params;const exam=await db.mockExam.findUnique({where:{id},include:{questions:{orderBy:{order:"asc"},include:{mcq:true}}}});if(!exam)notFound();return <main className="main"><ExamClient exam={exam}/></main>}
