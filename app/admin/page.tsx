import { getAdminSession } from "@/lib/adminAuth";
import { db } from "@/lib/prisma";
import { AdminClient } from "@/components/AdminClient";

export default async function AdminPage() {
  if (!(await getAdminSession())) return <AdminClient mode="login" />;

  const [users, feedback, totalTopics] = await Promise.all([
    db.user.findMany({
      orderBy: [{ banned: "asc" }, { xp: "desc" }, { createdAt: "asc" }],
      select: {
        id:true,name:true,username:true,email:true,passwordHash:true,securityHash:true,
        course:true,university:true,year:true,semester:true,xp:true,level:true,streak:true,
        banned:true,lastActiveAt:true,createdAt:true,updatedAt:true,
        progress:{select:{percent:true,bestScore:true,attempts:true}},
        _count:{select:{attempts:true,mockAttempts:true,communityMessages:true,feedback:true,aiConversations:true}}
      }
    }),
    db.feedback.findMany({orderBy:{createdAt:"desc"},include:{user:{select:{username:true}}}}),
    db.topic.count(),
  ]);

  const averageProgress=users.length?Math.round(users.reduce((sum,u)=>{
    const done=u.progress.filter(p=>p.percent>=100).length;
    return sum+(done/Math.max(totalTopics,1))*100;
  },0)/users.length):0;

  return <AdminClient mode="dashboard" data={{
    totalStudents:users.length,
    activeStudents:users.filter(u=>u.lastActiveAt&&Date.now()-u.lastActiveAt.getTime()<5*60*1000).length,
    bannedStudents:users.filter(u=>u.banned).length,
    totalTopics,averageProgress,
    students:users.map(u=>({
      id:u.id,name:u.name,username:u.username,email:u.email,passwordHash:u.passwordHash,securityHash:u.securityHash,
      course:u.course,university:u.university,year:u.year,semester:u.semester,xp:u.xp,level:u.level,streak:u.streak,banned:u.banned,
      lastActiveAt:u.lastActiveAt?.toISOString()||null,createdAt:u.createdAt.toISOString(),updatedAt:u.updatedAt.toISOString(),
      completed:u.progress.filter(p=>p.percent>=100).length,
      progressAverage:u.progress.length?Math.round(u.progress.reduce((a,p)=>a+p.percent,0)/u.progress.length):0,
      bestScore:u.progress.length?Math.max(...u.progress.map(p=>p.bestScore)):0,
      attempts:u._count.attempts,mockAttempts:u._count.mockAttempts,messages:u._count.communityMessages,
      feedbackCount:u._count.feedback,aiMessages:u._count.aiConversations
    })),
    feedback:feedback.map(f=>({id:f.id,user:f.user.username,message:f.message,status:f.status,adminReply:f.adminReply,createdAt:f.createdAt.toISOString()}))
  }} />;
}
