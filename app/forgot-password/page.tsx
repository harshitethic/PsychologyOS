"use client";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setErr("");
    setMsg("");
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, answer, newPassword }),
      });
      const result = await response.json();
      if (!response.ok) {
        setErr(result.error || "Could not reset password.");
        return;
      }
      setMsg(result.message);
    } catch {
      setErr("Account recovery is unavailable. Please try again.");
    }
  }

  return <main className="auth-page"><div className="auth-card">
    <div className="brand">psychology<span>OS</span></div>
    <div className="eyebrow">ACCOUNT RECOVERY</div>
    <h1 className="h1">Reset your password.</h1>
    <p className="muted">
      This local build has no email recovery service. You must provide the
      recovery answer saved when you created your account.
    </p>
    <form onSubmit={submit} className="form-stack">
      <label>Username or email
        <input suppressHydrationWarning className="input" value={identifier}
          onChange={event => setIdentifier(event.target.value)} required autoComplete="username"/>
      </label>
      <label>Recovery answer
        <input suppressHydrationWarning className="input" type="password" value={answer}
          onChange={event => setAnswer(event.target.value)} required autoComplete="off"/>
      </label>
      <label>New password
        <input suppressHydrationWarning className="input" type="password" value={newPassword}
          onChange={event => setNewPassword(event.target.value)} minLength={8} maxLength={256}
          required autoComplete="new-password"/>
      </label>
      {err && <p className="error-text">{err}</p>}
      {msg && <p className="success-text">{msg}</p>}
      <button className="btn">Reset password →</button>
    </form>
    <div className="auth-links"><Link href="/login">Back to login</Link></div>
  </div></main>;
}
