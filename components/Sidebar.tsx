"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Brain, BarChart3, ClipboardCheck, LogOut, UserRound, Bot, Users, MessageSquareText } from "lucide-react";

export function Sidebar({user}:{user:any}){
  const path=usePathname();
  const links=[
    {href:"/dashboard",label:"Dashboard",Icon:LayoutDashboard},
    {href:"/semesters",label:"Study",Icon:BookOpen},
    {href:"/ai",label:"AI Tutor",Icon:Bot},
    {href:"/community",label:"Talk to people",Icon:Users},
    {href:"/revision",label:"Revision",Icon:Brain},
    {href:"/exams",label:"Mock Exams",Icon:ClipboardCheck},
    {href:"/analytics",label:"Analytics",Icon:BarChart3},
    {href:"/psychologists",label:"Psychologists",Icon:UserRound},
    {href:"/feedback",label:"Feedback",Icon:MessageSquareText},
  ];
  return <>
    <aside className="sidebar">
      <div className="brand">psychology<span>OS</span></div>
      <div className="nav">{links.map(({href,label,Icon})=><Link key={href} href={href} className={path===href||path.startsWith(`${href}/`)?"active":""}><Icon size={16}/>{label}</Link>)}</div>
      <div className="sidebar-user">
        <Link href="/profile" className="sidebar-user-card"><div className="sidebar-user-avatar">{user.username.slice(0,1).toUpperCase()}</div><div><strong>{user.name}</strong><span>@{user.username}</span></div></Link>
        <div className="muted sidebar-user-meta">{user.course||"Set course"}{user.year?` · Year ${user.year}`:""}</div>
        <div className="progress"><i style={{width:`${Math.min(100,(user.xp%500)/5)}%`}}/></div>
        <div className="muted" style={{fontSize:11,marginTop:6}}>{user.xp} XP · Level {user.level}</div>
        <form action="/api/logout" method="post"><button className="btn secondary sidebar-logout"><LogOut size={14}/> Logout</button></form>
      </div>
    </aside>
    <nav className="mobile-nav">
      {[
        links[0], links[1], links[2], links[3], links[4], links[6],
      ].map(({href,label,Icon})=>(
        <Link key={href} href={href} className={path===href||path.startsWith(`${href}/`)?"active":""}>
          <Icon size={19}/>
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  </>;
}
