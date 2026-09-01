"use client";
import { useState } from "react";

export function ProfileClient({user}:{user:any}) {
  const [course,setCourse]=useState(user.course||"");
  const [year,setYear]=useState(user.year?.toString()||"");
  const [notice,setNotice]=useState("");
  const [busy,setBusy]=useState(false);

  async function save(){
    setBusy(true);setNotice("");
    const r=await fetch("/api/profile",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({course,year})});
    const j=await r.json();
    setNotice(r.ok?"Profile updated.":j.error||"Could not update.");
    setBusy(false);
  }

  return <div className="profile-grid">
    <section className="card profile-card">
      <div className="avatar">{user.username.slice(0,1).toUpperCase()}</div>
      <h2>{user.name}</h2><p className="muted">@{user.username}</p><p className="muted">{user.email}</p>
    </section>
    <section className="card profile-edit">
      <div className="eyebrow">COMMUNITY DETAILS</div><h2 className="h2">Your student card</h2>
      <label>Course<input className="input" value={course} onChange={e=>setCourse(e.target.value)} placeholder="B.Sc. Psychology"/></label>
      <label>Year<input className="input" type="number" min={1} max={8} value={year} onChange={e=>setYear(e.target.value)} placeholder="1"/></label>
      <p className="muted profile-private-note">The community shows your username plus optional course/year. Your email stays private.</p>
      <button className="btn" onClick={()=>void save()} disabled={busy}>{busy?"Saving…":"Save profile →"}</button>
      {notice&&<p className="muted">{notice}</p>}
    </section>
  </div>;
}
