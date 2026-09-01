"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
export default function Search(){const [q,setQ]=useState("");const [r,setR]=useState<any[]>([]);useEffect(()=>{if(!q){setR([]);return}const id=setTimeout(()=>fetch("/api/search?q="+encodeURIComponent(q)).then(x=>x.json()).then(setR),200);return()=>clearTimeout(id)},[q]);return <main className="main"><div className="eyebrow">⌘ K</div><h1 className="h1">Search.</h1><input autoFocus className="input" placeholder="Pavlov, memory, neurons..." value={q} onChange={e=>setQ(e.target.value)}/><div className="list" style={{marginTop:18}}>{r.map(x=><Link href={`/topics/${x.slug}`} key={x.slug}><b>{x.title}</b><div className="muted">{x.subject}</div></Link>)}</div></main>}
