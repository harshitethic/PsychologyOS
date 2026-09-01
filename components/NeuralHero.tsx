"use client";
import { motion } from "framer-motion";

export function NeuralHero(){
  return <div className="hero-orbit-art" aria-hidden="true">
    <div className="home-orbit o1"/><div className="home-orbit o2"/><div className="home-orbit o3"/>
    {[1,2,3,4,5,6].map(n=><motion.i key={n} className={`home-neuron n${n}`} animate={{y:[0,-7,0],x:[0,n%2?3:-3,0]}} transition={{duration:3+n*.25,repeat:Infinity,ease:"easeInOut"}}/>)}
  </div>
}
