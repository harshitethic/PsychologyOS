"use client";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [identifier,setIdentifier]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  async function submit(e:React.FormEvent){
    e.preventDefault();setBusy(true);setError("");
    try{
      const r=await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({identifier,password})});
      const j=await r.json();
      if(!r.ok){setError(j.error||"Login failed.");return;}
      window.location.href="/dashboard";
    }catch{setError("Could not connect to the server.");}
    finally{setBusy(false);}
  }
  return <main className="auth-page"><div className="auth-card">
    <div className="brand">psychology<span>OS</span></div>
    <div className="eyebrow">WELCOME BACK</div>
    <h1 className="h1">Continue your study brain.</h1>
    <p className="muted">Sign in with your username or email.</p>
    <form onSubmit={submit} className="form-stack">
      <label>Username or email<input className="input" suppressHydrationWarning value={identifier} onChange={e=>setIdentifier(e.target.value)} required autoComplete="username"/></label>
      <label>Password<input className="input" suppressHydrationWarning value={password} onChange={e=>setPassword(e.target.value)} required type="password" autoComplete="current-password"/></label>
      {error&&<p className="error-text">{error}</p>}
      <button className="btn" disabled={busy}>{busy?"Signing in…":"Log in →"}</button>
    </form>
    <div className="auth-links"><Link href="/forgot-password">Forgot password?</Link><span>·</span><Link href="/signup">Create account</Link></div>
  </div></main>;
}
