import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles, Torus, Text } from "@react-three/drei";
import * as THREE from "three";
import { Volume2, VolumeX, Share2, Copy, RotateCcw, Zap, Skull, Send, ChevronDown } from "lucide-react";
import "./styles.css";

const QUESTIONS = [
  { q:"Daily screen time?", options:["Under 2h","2–5h","5–8h","8h+","Don't ask 💀"], score:[8,22,48,76,95], tag:"SCREEN TIME" },
  { q:"How many hours do you sleep?", options:["8+","6–8","4–6","2–4","Sleep is optional"], score:[5,20,45,72,92], tag:"SLEEP DEBT" },
  { q:"How many times have you said “I'LL START TOMORROW”?", options:["Never","Sometimes","Daily","Every week","Tomorrow is my religion"], score:[3,20,48,72,94], tag:"PROCRASTINATION" },
  { q:"How broke are you?", options:["Financially stable","A little cooked","Wallet crying","Bank app jumpscare","Bro is funding vibes"], score:[8,28,52,78,96], tag:"FINANCIAL DAMAGE" },
  { q:"How often do you open Instagram without knowing why?", options:["Rarely","Sometimes","Too often","Muscle memory","I live here"], score:[6,25,52,78,93], tag:"SCROLL DAMAGE" },
  { q:"How often do you leave people on seen?", options:["Never","Rarely","Sometimes","Frequently","Seen is my love language"], score:[5,18,40,68,90], tag:"SOCIAL DAMAGE" },
  { q:"How many assignments are fighting for their lives?", options:["None","1–2","3–4","5+","They formed a union"], score:[4,24,48,76,97], tag:"ACADEMIC CHAOS" },
  { q:"How often do you say “bas 5 minute aur”?", options:["Never","Sometimes","Daily","Every session","5 minutes = 2 hours"], score:[3,20,50,75,95], tag:"DELULU" },
  { q:"How much of your life is actually under control?", options:["Most of it","Decent","Barely","What's control?","The simulation drives me"], score:[8,28,52,78,96], tag:"AUKAAT" }
];

const REACTIONS = [
  "BC... that's concerning.",
  "Bro 💀",
  "Yeah we're gonna need a specialist.",
  "Your phone needs therapy.",
  "Productivity has left the chat.",
  "WTF 💀",
  "BS detected.",
  "BC WHAT ARE YOU DOING?",
  "Damn bro.",
  "Common sense.exe stopped responding.",
  "This is getting unnecessarily personal.",
  "The scanner is sweating."
];

const ROASTS = [
  "Bro is {p}% cooked. At this point you're not living, you're just buffering.",
  "BC your screen time has more consistency than your career.",
  "Your productivity score is so low even procrastination is impressed.",
  "Bro said “tomorrow” so many times tomorrow filed a complaint.",
  "Touch grass. Immediately.",
  "Your common sense has left the group chat.",
  "You don't need motivation. You need a factory reset.",
  "Your routine has more plot twists than a Netflix finale.",
  "The scanner didn't roast you. The numbers did.",
  "Bro is running on vibes, caffeine and questionable decisions.",
  "Your phone knows more about your life than you do.",
  "At this point your alarm clock is just decorative.",
  "Your future self has submitted a complaint.",
  "You have achieved premium-level bakchodi.",
  "The good news: you're self-aware. The bad news: that's the good news."
];

function calc(answers){
  const avg = answers.reduce((a,b)=>a+b,0) / answers.length;
  const cooked = Math.round(avg);
  const variance = (answers[0]||40) - (answers[2]||40);
  const clamp = n => Math.max(3, Math.min(99, Math.round(n)));
  return {
    cooked,
    bakchodi: clamp(cooked + 6 + variance*.08),
    delulu: clamp(cooked - 3 + (answers[7]||40)*.12),
    aukaat: clamp(100-cooked + (answers[8]||40)*.08),
    nalayak: clamp(cooked + 3),
    grass: clamp(105-cooked),
    common: clamp(104-cooked),
    money: clamp(cooked + (answers[3]||40)*.14),
    productivity: clamp(100-cooked + (answers[2]||40)*.08),
    luck: clamp(58 + (50-cooked)*.42),
    social: clamp(100-(answers[5]||40)*.65)
  };
}

function Scanner({ chaos=0 }){
  const group = useRef();
  useFrame((_,d)=>{
    if(group.current){
      group.current.rotation.y += d*(0.35+chaos*.006);
      group.current.rotation.x = Math.sin(performance.now()/1600)*.06;
    }
  });
  const mobile = typeof window !== "undefined" && window.innerWidth < 700;
  return <group ref={group}>
    <Torus args={[2.45,0.075,12,64]} rotation={[Math.PI/2,0,0]}><meshBasicMaterial color="#ff2bd6"/></Torus>
    <Torus args={[2.0,0.035,10,48]} rotation={[Math.PI/2,0,0]}><meshBasicMaterial color="#5cf6ff"/></Torus>
    <mesh rotation={[Math.PI/2,0,0]}>
      <ringGeometry args={[1.05,1.12,64]} />
      <meshBasicMaterial color="#fff" transparent opacity={0.35}/>
    </mesh>
    <Text position={[0,0,0]} fontSize={mobile?0.34:0.48} color="#fff" anchorX="center" anchorY="middle">COOKED</Text>
    <Text position={[0,-0.5,0]} fontSize={0.16} color="#5cf6ff" anchorX="center" anchorY="middle">DIAGNOSTIC CORE</Text>
    <Sparkles count={mobile?45:110} scale={6} size={1.8} speed={0.5+chaos*.02} color="#ff2bd6"/>
  </group>
}

function Scanner3D({ chaos=0 }){
  return <div className="scanner3d">
    <Canvas camera={{position:[0,0,7],fov:48}} dpr={[1, typeof window !== "undefined" && window.innerWidth < 700 ? 1.15 : 1.6]}>
      <ambientLight intensity={1.2}/>
      <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.55}>
        <Scanner chaos={chaos}/>
      </Float>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false}/>
    </Canvas>
  </div>
}

function Meter({label,value, danger=false}){
  return <div className="meter">
    <div className="meter-top"><span>{label}</span><b>{value}%</b></div>
    <div className="bar"><motion.div animate={{width:`${value}%`}} transition={{duration:1,ease:"easeOut"}} className={danger?"bar-fill danger":"bar-fill"}/></div>
  </div>
}

function App(){
  const [name,setName]=useState("FAIZAN");
  const [started,setStarted]=useState(false);
  const [answers,setAnswers]=useState([]);
  const [reaction,setReaction]=useState("");
  const [result,setResult]=useState(null);
  const [roastMode,setRoastMode]=useState(1);
  const [sound,setSound]=useState(false);
  const [secret,setSecret]=useState(false);
  const audioRef=useRef(null);
  const {scrollYProgress}=useScroll();
  const chaos=useSpring(scrollYProgress,{stiffness:80,damping:20});
  const scannerScale=useTransform(chaos,[0,1],[1,1.35]);

  useEffect(()=>{ audioRef.current = new (window.AudioContext || window.webkitAudioContext)?.(); },[]);

  const beep=(freq=520,duration=.07)=>{
    if(!sound || !audioRef.current) return;
    const ctx=audioRef.current; const o=ctx.createOscillator(); const g=ctx.createGain();
    o.frequency.value=freq; o.type="square"; g.gain.setValueAtTime(.045,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+duration);
    o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+duration);
  };

  const begin=()=>{ setStarted(true); setAnswers([]); setResult(null); setReaction(""); beep(700,.12); setTimeout(()=>document.getElementById("game")?.scrollIntoView({behavior:"smooth"}),80); };
  const choose=(score)=>{
    const next=[...answers,score]; beep(420+score*3,.08);
    setReaction(REACTIONS[Math.floor(Math.random()*REACTIONS.length)]);
    setAnswers(next);
    if(next.length>=QUESTIONS.length){
      setTimeout(()=>{ setResult(calc(next)); document.getElementById("result")?.scrollIntoView({behavior:"smooth"}); },650);
    }
  };
  const current=QUESTIONS[answers.length];
  const roast=useMemo(()=>{
    if(!result) return "";
    let r=ROASTS[(result.cooked+roastMode*3)%ROASTS.length];
    return r.replace("{p}",result.cooked);
  },[result,roastMode]);

  const makeStory=async()=>{
    if(!result) return;
    const c=document.createElement("canvas"); c.width=1080; c.height=1920;
    const x=c.getContext("2d");
    const grad=x.createLinearGradient(0,0,1080,1920); grad.addColorStop(0,"#07070b"); grad.addColorStop(.5,"#16091d"); grad.addColorStop(1,"#030305");
    x.fillStyle=grad;x.fillRect(0,0,c.width,c.height);
    for(let i=0;i<90;i++){x.fillStyle=`hsla(${180+i*2},100%,70%,${Math.random()*.35})`;x.beginPath();x.arc(Math.random()*1080,Math.random()*1920,Math.random()*4,0,Math.PI*2);x.fill();}
    x.strokeStyle="#ff2bd6";x.lineWidth=6;x.strokeRect(55,55,970,1810);
    x.fillStyle="#fff";x.font="900 88px Arial";x.fillText("HOW COOKED",85,190);x.fillText("AM I? 💀",85,290);
    x.fillStyle="#5cf6ff";x.font="700 42px monospace";x.fillText(name.toUpperCase(),90,385);
    x.fillStyle="#fff";x.font="900 260px Arial";x.fillText(`${result.cooked}%`,75,700);
    x.font="900 80px Arial";x.fillText("COOKED 💀",85,805);
    x.font="700 34px monospace";x.fillStyle="#ddd";
    [`BAKCHODI ${result.bakchodi}%`,`DELULU ${result.delulu}%`,`PRODUCTIVITY ${result.productivity}%`].forEach((t,i)=>x.fillText(t,90,930+i*70));
    x.fillStyle="#ff2bd6";x.font="700 38px Arial";x.fillText("FINAL VERDICT",90,1210);
    x.fillStyle="#fff";x.font="700 40px Arial"; const words=roast.match(/.{1,32}(?:\\s|$)/g)||[roast]; words.slice(0,5).forEach((t,i)=>x.fillText(t.trim(),90,1280+i*58));
    x.fillStyle="#5cf6ff";x.font="700 30px monospace";x.fillText("HOWCOOKED.APP  •  SHARE YOUR DAMAGE",90,1785);
    const blob=await new Promise(res=>c.toBlob(res,"image/png"));
    if(navigator.share){ try{await navigator.share({title:"HOW COOKED AM I? 💀",text:`${name} is ${result.cooked}% cooked 💀`,files:blob?[new File([blob],"how-cooked.png",{type:"image/png"})]:[]});}catch{} }
    else { const a=document.createElement("a");a.download="how-cooked-result.png";a.href=URL.createObjectURL(blob);a.click(); }
  };

  const shareText=()=>{
    if(!result)return;
    const text=`${name} is ${result.cooked}% cooked 💀\\nThink you can beat that?`;
    if(navigator.share) navigator.share({title:"HOW COOKED AM I? 💀",text}).catch(()=>{});
    else navigator.clipboard?.writeText(text);
  };

  const copy=()=>{ if(!result)return; navigator.clipboard?.writeText(`${name} — ${result.cooked}% COOKED 💀\\n${roast}`); };

  const restart=()=>{setAnswers([]);setResult(null);setStarted(false);setSecret(false);window.scrollTo({top:0,behavior:"smooth"});};

  return <div className="app">
    <div className="noise"/>
    <header className="topbar"><div className="logo">HC<span>//</span>AI</div><button className="sound" onClick={()=>setSound(!sound)}>{sound?<Volume2 size={16}/>:<VolumeX size={16}/>} SOUND</button></header>

    <section className="hero">
      <div className="hero-copy">
        <motion.div initial={{opacity:0,y:25}} animate={{opacity:1,y:0}} className="eyebrow">SYSTEM DIAGNOSTIC // HUMAN v2.6</motion.div>
        <h1>HOW<br/><em>COOKED</em><br/>ARE YOU<span>?</span></h1>
        <p>Let's investigate your questionable life decisions.</p>
        <div className="hero-actions">
          {!started && <button className="primary" onClick={begin}><Zap size={19}/> CHECK MY AUKAAT</button>}
          <span className="micro">NO LOGIN. NO BULLSHIT. JUST DAMAGE.</span>
        </div>
      </div>
      <motion.div className="hero-scanner" style={{scale:scannerScale}}><Scanner3D chaos={0}/></motion.div>
      <div className="warnings">
        <span>⚠ WARNING</span><span>BAD DECISIONS DETECTED</span><span>TOUCH GRASS REQUIRED</span><span>PRODUCTIVITY.exe NOT FOUND</span>
      </div>
      <div className="scrollhint"><ChevronDown size={18}/> SCROLL INTO THE DAMAGE</div>
    </section>

    {started && <section id="game" className="game">
      <div className="section-label">LIVE INTERROGATION // {String(answers.length+1).padStart(2,"0")}/{QUESTIONS.length}</div>
      {!result ? <AnimatePresence mode="wait">
        <motion.div key={answers.length} initial={{opacity:0,x:35}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-35}} className="question-card">
          <div className="q-tag">{current.tag}</div>
          <h2>{current.q}</h2>
          <div className="options">{current.options.map((o,i)=><button key={o} onClick={()=>choose(current.score[i])}><span>0{i+1}</span>{o}</button>)}</div>
          <div className="reaction">{reaction || "The scanner is waiting... choose wisely."}</div>
        </motion.div>
      </AnimatePresence> : <div/>}
    </section>}

    {result && <section id="result" className="result">
      <div className="result-black">
        <div className="analyzing"><span>ANALYZING...</span><span>CHECKING COMMON SENSE...</span><span>CHECKING AUKAAT...</span><b>OH FUCK.</b></div>
      </div>
      <motion.div initial={{opacity:0,scale:.8,y:80}} animate={{opacity:1,scale:1,y:0}} className="result-card">
        <div className="result-grid">
          <div>
            <div className="section-label">SUBJECT // {name}</div>
            <div className="big-score">{result.cooked}<small>%</small></div>
            <div className="cooked">COOKED 💀</div>
            <p className="verdict">WE FOUND THE PROBLEM.</p>
          </div>
          <div className="roast-box"><span>FINAL VERDICT:</span><p>{roast}</p></div>
        </div>
        <div className="meters">
          <Meter label="BAKCHODI INDEX" value={result.bakchodi} danger/>
          <Meter label="DELULU LEVEL" value={result.delulu}/>
          <Meter label="AUKAAT SCORE" value={result.aukaat}/>
          <Meter label="NALAYAK SCORE" value={result.nalayak} danger/>
          <Meter label="TOUCH GRASS" value={result.grass}/>
          <Meter label="COMMON SENSE" value={result.common}/>
          <Meter label="FINANCIAL DAMAGE" value={result.money} danger/>
          <Meter label="PRODUCTIVITY" value={result.productivity}/>
          <Meter label="LUCK" value={result.luck}/>
          <Meter label="SOCIAL BATTERY" value={result.social}/>
        </div>
        <div className="roast-buttons">
          <button onClick={()=>setRoastMode(v=>v+1)}><Skull size={18}/> ROAST ME</button>
          <button onClick={()=>setRoastMode(v=>v+5)}><Skull size={18}/> ROAST ME HARDER</button>
          <button onClick={()=>setRoastMode(v=>v+11)}><Skull size={18}/> DESTROY MY EGO</button>
        </div>
        <div className="share-panel">
          <div><b>THINK YOU'RE LESS COOKED?</b><p>Send this damage to someone who needs a reality check.</p></div>
          <button className="primary" onClick={shareText}><Send size={18}/> SEND TO A FRIEND 💀</button>
        </div>
        <div className="result-actions">
          <button className="primary" onClick={makeStory}><Share2 size={18}/> SHARE MY DAMAGE</button>
          <button onClick={copy}><Copy size={17}/> COPY RESULT</button>
          <button onClick={restart}><RotateCcw size={17}/> TRY AGAIN</button>
        </div>
      </motion.div>
    </section>}

    {result && !secret && <button className="secret-trigger" onClick={()=>setSecret(true)}>?</button>}
    <AnimatePresence>{secret && <motion.div className="secret-overlay" initial={{opacity:0}} animate={{opacity:1}}><motion.div initial={{scale:.8}} animate={{scale:1}} className="secret-card"><div className="eyebrow">SECRET ENDING UNLOCKED</div><h2>MAA KO KYA BOLOGE? 💀</h2><p>Would you survive if your mother saw your screen time?</p><div><button onClick={()=>setSecret(false)}>YES</button><button onClick={()=>setSecret(false)}>NO</button><button onClick={()=>setSecret(false)}>BC PLEASE DON'T</button></div></motion.div></motion.div>}</AnimatePresence>

    <footer><span>HOW COOKED AM I? 💀</span><span>MADE FOR CHAOS // 2026</span></footer>
  </div>
}

createRoot(document.getElementById("root")).render(<App />);
