import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NeuralHero } from "@/components/NeuralHero";

export default function Home(){
  return <main className="home-v2">
    <div className="home-v2-grid"/>
    <header className="home-header"><Link className="brand" href="/">psychology<span>OS</span></Link><div className="row"><ThemeToggle/><Link className="btn secondary" href="/login">Log in</Link><Link className="btn" href="/signup">Start learning</Link></div></header>
    <section className="home-hero-v2">
      <div className="home-copy"><div className="eyebrow">B.Sc. PSYCHOLOGY · OPEN SOURCE · FOR COLLEGE STUDENTS</div><h1>Study like a brain,<br/><span>not a PDF.</span></h1><p className="home-lead">Start from zero. See the idea. Work an example. Connect it on a mind map. Recall it with flashcards. Prove it with MCQs and mocks.</p><div className="row hero-actions"><Link className="btn" href="/signup">Build your study brain →</Link><Link className="btn secondary" href="/semesters">Explore the curriculum</Link></div><div className="study-loop"><span>learn</span><i>→</i><span>understand</span><i>→</i><span>recall</span><i>→</i><span>test</span><i>→</i><span>revise</span></div></div>
      <div className="home-brain"><img className="brain-image" src="/brain.png" alt="Anatomical brain illustration"/><NeuralHero/></div>
    </section>
    <section className="home-proof">{[["01","Learn from zero","Structured notes, worked examples, diagrams and exam traps."],["02","See connections","Mind maps show the relationships instead of making you memorize a list."],["03","Practice retrieval","Flashcards, MCQs and mocks expose what you actually remember."],["04","Study with people","A built-in student group for questions and study partners."]].map(([n,t,d])=><article key={n} className="home-proof-card"><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</section>
    <section className="home-bottom-grid"><article className="home-note"><div className="eyebrow">THE IDEA</div><h2>College notes should teach you, not just exist.</h2><p>Psychology OS is designed around the way students actually learn: understand first, retrieve later, test under pressure, then revisit weak areas.</p></article><article className="home-open"><div className="eyebrow">OPEN SOURCE · BUILT BY @HARSHITREX</div><h2>A study tool students can inspect and improve.</h2><p>Built openly for B.Sc. Psychology students. No paid authentication provider and no required paid AI API.</p><div className="row"><a className="btn" href="https://github.com/harshitethic" target="_blank" rel="noreferrer">GitHub →</a><Link className="btn secondary" href="/community">Join students</Link></div></article></section>
    <footer className="home-footer"><span>psychologyOS · open source · for college students</span><span>built by <a href="https://github.com/harshitethic" target="_blank" rel="noreferrer">@harshitethic</a></span></footer>
  </main>;
}
