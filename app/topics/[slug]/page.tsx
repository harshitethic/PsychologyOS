import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { TopicClient } from "@/components/TopicClient";

export default async function Topic({params}:{params:Promise<{slug:string}>}){
 const user=await getSessionUser();if(!user)redirect("/login");const {slug}=await params;
 const topic=await db.topic.findUnique({where:{slug},include:{mcqs:{orderBy:{question:"asc"}},flashcards:true,subject:{include:{semester:true}}}});
 if(!topic)notFound();
 const siblings=await db.topic.findMany({where:{unitId:topic.unitId??undefined},orderBy:{id:"asc"},select:{slug:true,title:true}});
 const i=siblings.findIndex(x=>x.slug===topic.slug),next=i>=0?siblings[i+1]:undefined;
 return <main className="main"><div className="topic-hero"><div><div className="eyebrow">SEMESTER {topic.subject.semester.number} · {topic.subject.name}</div><h1 className="h1">{topic.title}</h1><p className="topic-deck">{topic.description}</p></div><div className="mini-brain"><span/><span/><span/><i/><i/><i/></div></div><TopicClient topic={topic} mcqs={topic.mcqs} flashcards={topic.flashcards} nextTopicSlug={next?.slug} nextTopicTitle={next?.title}/></main>
}
