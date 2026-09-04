'use client';
import {useEffect,useState} from "react";
declare global{interface Window{Telegram:any}}
export default function Home(){
 const [user,setUser]=useState<any>(null),[tasks,setTasks]=useState<any[]>([]),[tab,setTab]=useState("home"),[gate,setGate]=useState<any>(null),[msg,setMsg]=useState("");
 async function boot(){const tg=window.Telegram?.WebApp; tg?.ready(); tg?.expand(); const initData=tg?.initData||""; if(!initData){setMsg("Open this app inside Telegram.");return}
 const r=await fetch("/api/me",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({initData})}); const j=await r.json(); if(!r.ok){setMsg(j.error);return} setUser(j.user);
 const t=await fetch("/api/tasks").then(x=>x.json()).catch(()=>({tasks:[]})); setTasks(t.tasks||[]);
 }
 useEffect(()=>{boot()},[]);
 async function claim(t:any){setMsg(""); setGate({id:t.id,n:10}); let n=10; const x=setInterval(()=>{n--;setGate({id:t.id,n});if(n<=0)clearInterval(x)},1000)}
 async function finish(t:any){const r=await fetch("/api/task",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({telegramId:user.telegram_id,taskId:t.id,gatePassed:true})});const j=await r.json();setMsg(j.error||"Task completed!");if(!j.error)setUser({...user,balance:Number(user.balance)+Number(t.reward)});setGate(null)}
 return <div className="wrap"><h1>💰 Reward Hub</h1>{msg&&<div className="card">{msg}</div>}
 {user&&<div className="card"><div className="muted">@{user.username||user.first_name}</div><div className="big">৳ {Number(user.balance).toFixed(2)}</div><div className="muted">Referral: {user.referral_code||("ref_"+user.telegram_id)}</div></div>}
 {tab==="home"&&<><h2>Tasks</h2>{tasks.map(t=><div className="card" key={t.id}><div className="row"><b>{t.title}</b><span className="pill">৳{t.reward}</span></div><p className="muted">{t.description}</p>{gate?.id===t.id?<>{<div className="adbox">Advertisement area<br/><small>Keep this ad area open while the timer runs.</small></div>}<div className="timer">{gate.n}s</div>{gate.n===0&&<button className="btn" onClick={()=>finish(t)}>Start / Claim Task</button>}</>:<button className="btn" onClick={()=>claim(t)}>View Ad & Start</button>}</div>)}</>}
 {tab==="ref"&&<div className="card"><h2>Refer & Earn</h2><p>Invite friends and earn the configured commission.</p><input readOnly value={user?`https://t.me/YourBot?startapp=ref_${user.telegram_id}`:""}/></div>}
 {tab==="withdraw"&&<Withdraw user={user} setUser={setUser} setMsg={setMsg}/>}
 {tab==="video"&&<div className="card"><h2>🎬 Video Ads</h2><div className="adbox">Place your supported rewarded-video provider here.</div><button className="btn" onClick={()=>setMsg("Video reward flow is ready for provider integration.")}>Watch Video</button></div>}
 {tab==="spin"&&<div className="card"><h2>🎡 Spin</h2><button className="btn" onClick={()=>setMsg("Spin endpoint can be enabled with an admin-configured reward.")}>Spin Now</button></div>}
 <div className="nav">{["home","ref","video","spin","withdraw"].map(x=><button className="btn secondary" onClick={()=>setTab(x)} key={x}>{x==="home"?"🏠":x==="ref"?"👥":x==="video"?"🎬":x==="spin"?"🎡":"💸"}</button>)}</div></div>
}
function Withdraw({user,setUser,setMsg}:any){
 const [method,setMethod]=useState("bKash"),[address,setAddress]=useState(""),[amount,setAmount]=useState("");
 async function submit(){const r=await fetch("/api/withdraw",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({telegramId:user.telegram_id,method,address,amount})});const j=await r.json();setMsg(j.error||"Withdrawal request submitted.");if(!j.error)setUser({...user,balance:Number(user.balance)-Number(amount)})}
 return <div className="card"><h2>💸 Withdraw</h2><div className="form"><select value={method} onChange={e=>setMethod(e.target.value)}><option>bKash</option><option>Nagad</option><option>USDT</option></select><input placeholder={method==="USDT"?"USDT wallet address":"Mobile number"} value={address} onChange={e=>setAddress(e.target.value)}/><input type="number" placeholder="Amount (BDT)" value={amount} onChange={e=>setAmount(e.target.value)}/><button className="btn" onClick={submit}>Request Withdrawal</button></div></div>
}
