"use client";
import { useState } from "react";

export function SemesterView({ route, children }: { route: React.ReactNode; children: React.ReactNode }) {
  const [mode, setMode] = useState<"branches" | "route">("branches");
  return <>
    <div className="semester-mode-toggle">
      <button className={mode==="branches" ? "selected" : ""} onClick={()=>setMode("branches")}>Your semester branches</button>
      <span>/</span>
      <button className={mode==="route" ? "selected" : ""} onClick={()=>setMode("route")}>Recommended study route</button>
    </div>
    {mode==="branches" ? children : route}
  </>;
}
