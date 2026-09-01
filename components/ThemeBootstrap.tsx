"use client";
import { useEffect } from "react";

export default function ThemeBootstrap(){
  useEffect(()=>{
    const saved=localStorage.getItem("psy-theme");
    document.documentElement.dataset.theme=saved==="dark"?"dark":"";
  },[]);
  return null;
}
