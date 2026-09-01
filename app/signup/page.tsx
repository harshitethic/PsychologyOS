import Link from "next/link";
export default function Signup(){return <main className="auth"><div className="card form"><div className="eyebrow">Psychology OS</div><h1 className="h2" style={{fontSize:34}}>Build your student profile.</h1><p className="muted">No paid authentication provider. Your password is hashed.</p><form action="/api/signup" method="post" className="grid">
<label>Name<input suppressHydrationWarning className="input" name="name" required/></label>
<label>Username<input suppressHydrationWarning className="input" name="username" required/></label>
<label>Email<input suppressHydrationWarning className="input" name="email" type="email" required/></label>
<label>Password<input suppressHydrationWarning className="input" name="password" type="password" minLength={8} required/></label>
<label>Security question<input suppressHydrationWarning className="input" name="question" value="Who do you love the most?" readOnly/></label>
<label>Security answer<input suppressHydrationWarning className="input" name="answer" required/></label>
<button className="btn">Create account</button>
<p className="muted" style={{fontSize:13}}>Already have one? <Link href="/login"><u>Log in</u></Link></p>
</form></div></main>}
