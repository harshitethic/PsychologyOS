"use client";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPassword(){
  const [identifier,setIdentifier]=useState(""),[newPassword,setNewPassword]=useState(""),[msg,setMsg]=useState(""),[err,setErr]=useState("");
  async function submit(e:React.FormEvent){
    e.preventDefault();setErr("");setMsg("");
    const r=await fetch("/api/forgot-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({identifier,newPassword})});
    const j=await r.json();if(!r.ok){setErr(j.error||"Could not reset password.");return;}setMsg(j.message);
  }
  return <main className="auth-page"><div className="auth-card">
    <div className="brand">psychology<span>OS</span></div><div className="eyebrow">ACCOUNT RECOVERY</div>
    <h1 className="h1">Reset your password.</h1>
    <p className="muted">This local build has no email service, so password reset is handled locally.</p>
    <form onSubmit={submit} className="form-stack">
      <label>Username or email<input suppressHydrationWarning className="input" value={identifier} onChange={e=>setIdentifier(e.target.value)} required autoComplete="username"/></label>
      <label>New password<input suppressHydrationWarning className="input" type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} minLength={8} required autoComplete="new-password"/></label>
      {err&&<p className="error-text">{err}</p>}{msg&&<p className="success-text">{msg}</p>}
      <button className="btn">Reset password →</button>
    </form>
    <div className="auth-links"><Link href="/login">Back to login</Link></div>
  </div></main>
}
