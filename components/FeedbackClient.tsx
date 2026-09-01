"use client";
import { useState } from "react";

export function FeedbackClient({ initial }:{initial:any[]}) {
  const [items,setItems]=useState(initial);
  const [message,setMessage]=useState("");
  const [type,setType]=useState("Bug");
  const [busy,setBusy]=useState(false);
  const [notice,setNotice]=useState("");

  async function send(){
    if(!message.trim()||busy)return;
    setBusy(true);setNotice("");
    const r=await fetch("/api/feedback",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:`[${type}] ${message}`})});
    const j=await r.json();
    if(!r.ok){setNotice(j.error||"Could not send feedback.");setBusy(false);return;}
    setItems(v=>[{...j.feedback,createdAt:new Date(j.feedback.createdAt).toISOString()},...v]);
    setMessage("");setNotice("Sent to admin.");setBusy(false);
  }

  return <div className="feedback-grid">
    <section className="feedback-form card">
      <div className="eyebrow">SEND TO ADMIN</div><h2 className="h2">What should we change?</h2>
      <select className="input" value={type} onChange={e=>setType(e.target.value)}>
        <option>Bug</option><option>Content</option><option>UI / design</option><option>Suggestion</option><option>Other</option>
      </select>
      <textarea value={message} onChange={e=>setMessage(e.target.value)} maxLength={2000} placeholder="Be specific. Tell us what happened and what you expected."/>
      <div className="feedback-footer"><span>{message.length}/2000</span><button className="btn" disabled={busy||!message.trim()} onClick={()=>void send()}>{busy?"Sending…":"Send feedback →"}</button></div>
      {notice&&<p className="muted">{notice}</p>}
    </section>
    <section className="feedback-history"><div className="eyebrow">YOUR REPORTS</div>
      {items.length===0?<div className="card empty-state"><h3>No feedback yet.</h3><p>Say something when you find a problem.</p></div>:
      items.map((item:any)=><article className="card feedback-item" key={item.id}>
        <div className="between"><span className={`status status-${item.status.toLowerCase()}`}>{item.status}</span><small>{item.createdAt.slice(0,10)}</small></div>
        <p>{item.message}</p>
        {item.adminReply&&<div className="admin-reply"><div className="eyebrow">ADMIN REPLY</div><p>{item.adminReply}</p></div>}
      </article>)}
    </section>
  </div>;
}
