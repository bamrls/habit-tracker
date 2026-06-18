// ============================================================
//  HABIT TRACKER v3.0 — Todas as melhorias
// ============================================================
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = "https://bkkcouzchpiibtynupor.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJra2NvdXpjaHBpaWJ0eW51cG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1ODYxNzYsImV4cCI6MjA5NjE2MjE3Nn0.PhU1vH4tJvf3A-lvVbO7-TLQKl7GNlSYvMSKzHDMqCg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: { persistSession:true, storageKey:"babihabit-session", storage:window.localStorage, autoRefreshToken:true, detectSessionInUrl:true }
});

const SEP = "|";
const makeKey  = (habitId, date) => `${habitId}${SEP}${date}`;
const splitKey = (key) => { const idx=key.indexOf(SEP); return [key.slice(0,idx), key.slice(idx+1)]; };

// ── PALETAS DE CORES ────────────────────────────────────────
const COLOR_PALETTES = {
  "Pastel": [
    {name:"Menta",   bg:"#e0f5f0",accent:"#6ecfbb"},{name:"Rosa",   bg:"#fde8ec",accent:"#f4a0b4"},
    {name:"Lavanda", bg:"#ede8fb",accent:"#b39ddb"},{name:"Azul",   bg:"#e3f0fb",accent:"#90c4e8"},
    {name:"Pêssego", bg:"#fdeee3",accent:"#f5b88a"},{name:"Amarelo",bg:"#fdf8e1",accent:"#f5d87a"},
    {name:"Verde",   bg:"#e4f5e1",accent:"#88cc80"},{name:"Terroso",bg:"#f5ede3",accent:"#c4956a"},
  ],
  "Macaron": [
    {name:"c1",bg:"#fde8ec",accent:"#f9afc0"},{name:"c2",bg:"#fde8f5",accent:"#f5a0d0"},
    {name:"c3",bg:"#f0e8fd",accent:"#c8a0f0"},{name:"c4",bg:"#e8eafd",accent:"#a0aaef"},
    {name:"c5",bg:"#e8f5fd",accent:"#a0d0f5"},{name:"c6",bg:"#e8fdf0",accent:"#a0efcc"},
    {name:"c7",bg:"#f5fde8",accent:"#ccef9f"},{name:"c8",bg:"#fdf5e8",accent:"#f5d89f"},
    {name:"c9",bg:"#fde8e8",accent:"#f5a0a0"},{name:"c10",bg:"#fdf0e8",accent:"#f5c09f"},
    {name:"c11",bg:"#e8f0fd",accent:"#9fc0f5"},{name:"c12",bg:"#e8fdfd",accent:"#9fefef"},
  ],
  "Dopamina": [
    {name:"d1",bg:"#ffe0e6",accent:"#ff4d6d"},{name:"d2",bg:"#ffe0f0",accent:"#ff4db8"},
    {name:"d3",bg:"#f0e0ff",accent:"#a64dff"},{name:"d4",bg:"#e0e8ff",accent:"#4d79ff"},
    {name:"d5",bg:"#e0f8ff",accent:"#00ccff"},{name:"d6",bg:"#e0ffe8",accent:"#00e64d"},
    {name:"d7",bg:"#f8ffe0",accent:"#ccff00"},{name:"d8",bg:"#fff8e0",accent:"#ffcc00"},
    {name:"d9",bg:"#ffe8e0",accent:"#ff6600"},{name:"d10",bg:"#ffe0e0",accent:"#ff3300"},
    {name:"d11",bg:"#e0ffee",accent:"#00ff88"},{name:"d12",bg:"#e8e0ff",accent:"#6600ff"},
  ],
  "Morandi": [
    {name:"m1",bg:"#f0ecec",accent:"#c4a4a4"},{name:"m2",bg:"#f0eeec",accent:"#c4b4a4"},
    {name:"m3",bg:"#ecf0ec",accent:"#a4c4a4"},{name:"m4",bg:"#eceeee",accent:"#a4bcbc"},
    {name:"m5",bg:"#eceef0",accent:"#a4aec4"},{name:"m6",bg:"#eeeef0",accent:"#b4b4c4"},
    {name:"m7",bg:"#f0ecee",accent:"#c4a4b4"},{name:"m8",bg:"#f0f0ec",accent:"#c4c4a4"},
    {name:"m9",bg:"#ece8e8",accent:"#b49898"},{name:"m10",bg:"#e8ece8",accent:"#98b498"},
    {name:"m11",bg:"#e8ecec",accent:"#98b4b4"},{name:"m12",bg:"#eceaec",accent:"#b0a0b4"},
  ],
  "Vintage": [
    {name:"v1",bg:"#f5e8e0",accent:"#c07040"},{name:"v2",bg:"#f5ede0",accent:"#c09050"},
    {name:"v3",bg:"#f0f0e0",accent:"#a0a050"},{name:"v4",bg:"#e8f0e8",accent:"#608060"},
    {name:"v5",bg:"#e0e8f0",accent:"#406080"},{name:"v6",bg:"#e8e0f0",accent:"#604080"},
    {name:"v7",bg:"#f0e0e8",accent:"#804060"},{name:"v8",bg:"#f5ece0",accent:"#b07840"},
    {name:"v9",bg:"#eef0e0",accent:"#788040"},{name:"v10",bg:"#e0eff0",accent:"#407888"},
    {name:"v11",bg:"#f0e8e0",accent:"#a06848"},{name:"v12",bg:"#eae8f0",accent:"#686898"},
  ],
};
const CARD_COLORS = COLOR_PALETTES["Pastel"];

// ── ÍCONES POR CATEGORIA ────────────────────────────────────
const ICON_CATEGORIES = {
  "Esportes": [
    "🏹","🏊","🥊","🏈","🏄","⛵","🏂","⛷️","⚾","🎳","⚽","🛹","🤸","🏀","🏓","⚽","🏐","🤼","🧗","🏃",
    "🧘","🏋️","🚴","🏇","🤾","🥋","🏌️","🎿","🤽","🚣","🥇","🏆","🥅","⛳","🎯","🏸","🤺","🪂","🛶","🥌"
  ],
  "Comida": [
    "🍆","🍒","🥛","☕","🍽️","🎂","🥗","🍓","🍣","🥩","🍇","🫖","🥦","🧁","🍎","🍌","🥤","🍱","🥝","🫐",
    "🍅","🍞","🍳","🥕","🧃","🍉","🥑","🫙","🍵","🥘","🧇","🥞","🍜","🥫","🫕","🍲","🥚","🧄","🧅","🍋"
  ],
  "Vida": [
    "🛡️","⏰","➕","🔨","💰","💧","🎁","🎓","🪶","✈️","❤️","💼","📷","🧮","☂️","⭐","✏️","💳","📄","☁️",
    "🚗","🐦","💜","🦴","🐷","📖","🐾","⚡","👑","🍀","🔔","📅","📸","✂️","🎵","🏠","🛌","🪷","🦷","💊",
    "👗","🎧","🧴","🍁","🙏","💻","📞","🪄","⛪","🌲","🚭","📰","🎮","👂","👃","🚑","🧘","💆","🪞","🫁"
  ],
  "Outros": [
    "💹","🎧","🦸","📁","🏷️","📜","✂️","🛡️","🪷","🧍","🐱","🌿","✅","🆕","🤲","🎓","🍁","🌐","🕶️","🚀",
    "🚚","📘","💼","🧮","🌳","😊","🧩","📌","👍","🔌","👥","🎡","🎮","👻","⬆️","💓","📍","👔","⚡","🚑",
    "🦢","💻","🔓","🔍","🏠","🕶️","📆","🌍","🎬","📊","🧬","🔬","🎨","🎭","🎪","🏛️","🗼","🌉","🎠","🎢"
  ],
};

const EMOJIS = Object.values(ICON_CATEGORIES).flat();

const PERIOD_LABELS    = ["A qualquer momento","Manhã","Tarde","Noite"];
const DAY_LABELS       = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const DAY_LABELS_SHORT = ["D","S","T","Q","Q","S","S"];

const MOODS = [
  {label:"Horrível",emoji:"😵",color:"#e07070"},
  {label:"Excelente",emoji:"😄",color:"#f5a030"},
  {label:"Mau",      emoji:"😞",color:"#9b6bb5"},
  {label:"Ótimo",    emoji:"😊",color:"#d4c030"},
  {label:"Pobre",    emoji:"😑",color:"#6070c0"},
  {label:"Bom",      emoji:"🙂",color:"#50b070"},
  {label:"Neutro",   emoji:"😐",color:"#50a8cc"},
];

function today() {
  const d=new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function weekDays() {
  const base=new Date(), mon=new Date(base);
  mon.setDate(base.getDate()-base.getDay());
  return Array.from({length:7},(_,i)=>{const d=new Date(mon);d.setDate(mon.getDate()+i);return d;});
}
function daysInMonth(year,month){return new Date(year,month+1,0).getDate();}

function normalizeHabit(h) {
  return {
    ...h,
    startDate: h.startDate??h.start_date??today(),
    endDate:   h.endDate??h.end_date??null,
    chartType: h.chartType??h.chart_type??"bar",
    color: typeof h.color==="string"?JSON.parse(h.color):(h.color??CARD_COLORS[0]),
    days:  typeof h.days==="string"?JSON.parse(h.days):(h.days??[0,1,2,3,4,5,6]),
    hidden: h.hidden??false,
  };
}

const makeDefaults = () => [
  {id:`h_${Date.now()}_1`,name:"Café",      emoji:"☕",color:CARD_COLORS[0],goal:1,unit:"vez",period:0,days:[0,1,2,3,4,5,6],type:"build",startDate:today(),endDate:null,memo:false,reminders:false,hidden:false},
  {id:`h_${Date.now()}_2`,name:"Beber água",emoji:"💧",color:CARD_COLORS[3],goal:3,unit:"lt", period:0,days:[0,1,2,3,4,5,6],type:"build",startDate:today(),endDate:null,memo:false,reminders:false,hidden:false},
  {id:`h_${Date.now()}_3`,name:"Estudar",   emoji:"🎓",color:CARD_COLORS[7],goal:1,unit:"vez",period:0,days:[0,1,2,3,4,5,6],type:"build",startDate:today(),endDate:null,memo:false,reminders:false,hidden:false},
  {id:`h_${Date.now()}_4`,name:"Treino",    emoji:"💪",color:CARD_COLORS[0],goal:1,unit:"vez",period:0,days:[0,1,2,3,4,5,6],type:"build",startDate:today(),endDate:null,memo:false,reminders:false,hidden:false},
];

// ═══════════════════════════════════════════════════════════
//  HOOK useCloud
// ═══════════════════════════════════════════════════════════
function useCloud(userId) {
  const [habits,      setHabitsState]      = useState([]);
  const [completions, setCompletionsState] = useState({});
  const [moods,       setMoodsState]       = useState({});
  const [memos,       setMemosState]       = useState({});
  const [loading,     setLoading]          = useState(true);

  useEffect(()=>{
    if(!userId){setLoading(false);return;}
    (async()=>{
      setLoading(true);
      try {
        const [{data:hData,error:hErr},{data:cData,error:cErr},{data:mData,error:mErr}] = await Promise.all([
          supabase.from("habits").select("*").eq("user_id",userId).order("position"),
          supabase.from("completions").select("*").eq("user_id",userId),
          supabase.from("moods").select("*").eq("user_id",userId),
        ]);
        if(hErr) console.error("habits:",hErr);
        if(cErr) console.error("completions:",cErr);
        if(mErr) console.error("moods:",mErr);

        if(hData&&hData.length>0) setHabitsState(hData.map(normalizeHabit));
        else { const d=makeDefaults(); await _saveHabits(d,userId); setHabitsState(d); }

        if(cData){ const map={}; cData.forEach(r=>{map[makeKey(r.habit_id,r.date)]=r.count;}); setCompletionsState(map); }
        if(mData){ const map={}; mData.forEach(r=>{map[r.date]=r.mood;}); setMoodsState(map); }

        // Carregar memos do localStorage
        try { const saved=localStorage.getItem(`memos_${userId}`); if(saved) setMemosState(JSON.parse(saved)); } catch{}
      } catch(e){ console.error(e); }
      setLoading(false);
    })();
  },[userId]);

  async function _saveHabits(list,uid=userId) {
    if(!uid) return;
    const rows=list.map((h,i)=>({
      id:h.id, user_id:uid, name:h.name??"", emoji:h.emoji??"⭐",
      color:JSON.stringify(h.color??CARD_COLORS[0]), goal:h.goal??1, unit:h.unit??"vez",
      period:h.period??0, days:JSON.stringify(h.days??[0,1,2,3,4,5,6]),
      type:h.type??"build", start_date:h.startDate??today(), end_date:h.endDate??null,
      description:h.desc??"", group_name:h.group??"", reminders:h.reminders??false,
      memo:h.memo??false, chart_type:h.chartType??"bar", position:i, hidden:h.hidden??false,
    }));
    const {error}=await supabase.from("habits").upsert(rows,{onConflict:"id"});
    if(error) console.error("save habits:",error);
  }

  async function setHabits(updater) {
    const next=typeof updater==="function"?updater(habits):updater;
    setHabitsState(next); await _saveHabits(next);
  }

  async function setCompletions(updater) {
    const next=typeof updater==="function"?updater(completions):updater;
    setCompletionsState(next);
    const changed=Object.keys(next).filter(k=>next[k]!==completions[k]);
    if(!changed.length) return;
    const rows=changed.map(k=>{const [habit_id,date]=splitKey(k);return{user_id:userId,habit_id,date,count:next[k]};});
    const {error}=await supabase.from("completions").upsert(rows,{onConflict:"user_id,habit_id,date"});
    if(error) console.error("save completions:",error);
  }

  async function setMoods(updater) {
    const next=typeof updater==="function"?updater(moods):updater;
    setMoodsState(next);
    const changed=Object.keys(next).filter(d=>next[d]!==moods[d]);
    if(!changed.length) return;
    const rows=changed.map(date=>({user_id:userId,date,mood:next[date]}));
    const {error}=await supabase.from("moods").upsert(rows,{onConflict:"user_id,date"});
    if(error) console.error("save moods:",error);
  }

  function setMemos(updater) {
    const next=typeof updater==="function"?updater(memos):updater;
    setMemosState(next);
    try{localStorage.setItem(`memos_${userId}`,JSON.stringify(next));}catch{}
  }

  return {habits,setHabits,completions,setCompletions,moods,setMoods,memos,setMemos,loading};
}

// ═══════════════════════════════════════════════════════════
//  AUTH SCREEN
// ═══════════════════════════════════════════════════════════
function AuthScreen({onLogin}) {
  const [mode,setMode]=useState("login");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  const [done,setDone]=useState(false);

  async function handleSubmit() {
    if(!email||!password){setError("Preencha e-mail e senha.");return;}
    if(password.length<6){setError("Senha mínima: 6 caracteres.");return;}
    setLoading(true);setError("");
    try {
      if(mode==="signup"){
        const{error:e}=await supabase.auth.signUp({email,password});
        if(e) throw e; setDone(true);
      } else {
        const{data,error:e}=await supabase.auth.signInWithPassword({email,password});
        if(e) throw e; onLogin(data.session);
      }
    } catch(e) {
      const msgs={"Invalid login credentials":"E-mail ou senha incorretos.","User already registered":"E-mail já cadastrado.","Email not confirmed":"Confirme seu e-mail antes de entrar."};
      setError(msgs[e.message]||e.message);
    }
    setLoading(false);
  }

  const inp={width:"100%",border:"none",borderBottom:"2px solid #f0e8e0",padding:"12px 0",fontSize:15,background:"transparent",outline:"none",color:"#2d2d2d",boxSizing:"border-box",marginBottom:16};

  if(done) return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#f7f4f1",padding:32,fontFamily:"'Nunito',sans-serif"}}>
      <div style={{fontSize:56,marginBottom:16}}>📬</div>
      <h2 style={{fontWeight:800,fontSize:22,color:"#2d2d2d",marginBottom:8}}>Confirme seu e-mail</h2>
      <p style={{color:"#888",textAlign:"center",lineHeight:1.6}}>Enviamos um link para <strong>{email}</strong>.<br/>Clique nele e volte para fazer login.</p>
      <button onClick={()=>{setDone(false);setMode("login");}} style={{marginTop:24,borderRadius:24,border:"none",background:"#f4a0b4",color:"white",fontWeight:700,padding:"12px 32px",cursor:"pointer",fontSize:15}}>Ir para Login</button>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#f7f4f1",padding:24,fontFamily:"'Nunito',sans-serif"}}>
      <div style={{marginBottom:32,textAlign:"center"}}>
        <div style={{fontSize:52,marginBottom:8}}>🌸</div>
        <h1 style={{fontWeight:900,fontSize:28,color:"#2d2d2d",margin:0}}>Habit Tracker</h1>
        <p style={{color:"#aaa",margin:"6px 0 0",fontSize:14}}>Seus hábitos, na nuvem, sempre.</p>
      </div>
      <div style={{background:"white",borderRadius:28,padding:28,width:"100%",maxWidth:380,boxShadow:"0 8px 32px rgba(0,0,0,0.08)"}}>
        <div style={{display:"flex",background:"#f5f0ed",borderRadius:16,overflow:"hidden",marginBottom:24}}>
          {["login","signup"].map(m=>(
            <button key={m} onClick={()=>{setMode(m);setError("");}} style={{flex:1,border:"none",padding:"12px 0",fontWeight:700,fontSize:14,background:mode===m?"#f4a0b4":"transparent",color:mode===m?"white":"#aaa",cursor:"pointer",borderRadius:16,transition:"all 0.2s"}}>
              {m==="login"?"Entrar":"Cadastrar"}
            </button>
          ))}
        </div>
        <input type="email"    placeholder="E-mail"                    value={email}    onChange={e=>setEmail(e.target.value)}    style={inp}/>
        <input type="password" placeholder="Senha (mín. 6 caracteres)" value={password} onChange={e=>setPassword(e.target.value)} style={inp} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
        {error&&<p style={{color:"#e07070",fontSize:13,marginBottom:12,fontWeight:600}}>{error}</p>}
        <button onClick={handleSubmit} disabled={loading} style={{width:"100%",padding:"14px 0",border:"none",borderRadius:24,background:"linear-gradient(135deg,#f4a0b4,#f9c784)",color:"white",fontWeight:800,fontSize:15,cursor:loading?"default":"pointer",opacity:loading?0.7:1,boxShadow:"0 6px 20px rgba(244,160,180,0.4)"}}>
          {loading?"Aguarde...":(mode==="login"?"Entrar 🚀":"Criar conta 🌱")}
        </button>
        {mode==="login"&&(
          <button onClick={async()=>{if(!email){setError("Digite seu e-mail acima.");return;}await supabase.auth.resetPasswordForEmail(email);setError("Link enviado para "+email);}} style={{marginTop:16,width:"100%",background:"none",border:"none",color:"#aaa",fontSize:13,cursor:"pointer",textDecoration:"underline"}}>
            Esqueci minha senha
          </button>
        )}
      </div>
      <p style={{marginTop:20,color:"#ccc",fontSize:11}}>Dados armazenados com segurança no Supabase 🔒</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  APP PRINCIPAL
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [session,setSession]         = useState(undefined);
  const [tab,setTab]                 = useState("hoje");
  const [selectedDate,setSelectedDate] = useState(today());
  const [showMood,setShowMood]       = useState(false);
  const [showAdd,setShowAdd]         = useState(false);
  const [editHabit,setEditHabit]     = useState(null);
  const [filterOpen,setFilterOpen]   = useState(false);
  const [filterStatus,setFilterStatus] = useState("Todos");
  const [filterPeriod,setFilterPeriod] = useState("Todos");
  const [swipeActions,setSwipeActions] = useState(null);
  const [dragMode,setDragMode]       = useState(false);
  const [dragIdx,setDragIdx]         = useState(null);
  const [statsHabit,setStatsHabit]   = useState("all");
  const [matrizView,setMatrizView]   = useState("Semanal");
  const [detailHabit,setDetailHabit] = useState(null);
  const [showHidden,setShowHidden]   = useState(false);
  const [checkinMode,setCheckinMode] = useState("swipe"); // "swipe" | "tap"
  const dragOver = useRef(null);

  const userId=session?.user?.id;
  const {habits,setHabits,completions,setCompletions,moods,setMoods,memos,setMemos,loading}=useCloud(userId);

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>setSession(data.session??null));
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));
    return()=>subscription.unsubscribe();
  },[]);

  if(session===undefined) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f7f4f1",flexDirection:"column",gap:16,fontFamily:"'Nunito',sans-serif"}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{fontSize:48,animation:"spin 1.5s linear infinite"}}>🌸</div>
      <p style={{color:"#aaa",fontWeight:600}}>Carregando...</p>
    </div>
  );

  if(!session) return <AuthScreen onLogin={s=>setSession(s)}/>;

  const getCount=(hid,date)=>completions[makeKey(hid,date)]||0;
  const increment=(hid,date,goal)=>{
    const cur=getCount(hid,date);
    setCompletions(c=>({...c,[makeKey(hid,date)]:cur<goal?cur+1:0}));
  };

  const week=weekDays(), now=new Date(), curMonth=now.getMonth(), curYear=now.getFullYear();

  const visibleHabits = habits.filter(h=>!h.hidden);
  const hiddenHabits = habits.filter(h=>h.hidden);
  const todayHabits = (showHidden ? hiddenHabits : visibleHabits).filter(h=>{
    const d=new Date(selectedDate+"T00:00:00");
    if(!Array.isArray(h.days)||!h.days.includes(d.getDay())) return false;
    if(h.endDate&&h.endDate<selectedDate) return false;
    if(filterPeriod!=="Todos"&&h.period!==PERIOD_LABELS.indexOf(filterPeriod)) return false;
    if(filterStatus==="Cumpridos")     return getCount(h.id,selectedDate)>=h.goal;
    if(filterStatus==="Não Cumpridos") return getCount(h.id,selectedDate)<h.goal;
    return true;
  });

  function getMonthRate(){
    if(!habits.length) return 0;
    let total=0,done=0;
    for(let d=1;d<=now.getDate();d++){
      const dk=dateKey(new Date(curYear,curMonth,d));
      habits.filter(h=>!h.hidden).forEach(h=>{total++;if(getCount(h.id,dk)>=h.goal)done++;});
    }
    return total?Math.round(done/total*100):0;
  }
  function getBestStreak(){
    if(!habits.length) return 0;
    const byDate={};
    Object.keys(completions).forEach(k=>{const[hid,dt]=splitKey(k);if(!byDate[dt])byDate[dt]={};byDate[dt][hid]=completions[k];});
    let best=0,cur=0;
    Object.keys(byDate).sort().forEach(dt=>{
      const activeHabits=habits.filter(h=>!h.hidden);
      const allDone=activeHabits.every(h=>(byDate[dt][h.id]||0)>=h.goal);
      allDone?(cur++,best=Math.max(best,cur)):(cur=0);
    });
    return best;
  }
  function getPerfectDays(){
    const byDate={};
    Object.keys(completions).forEach(k=>{const[hid,dt]=splitKey(k);if(byDate[dt]===undefined)byDate[dt]=true;const h=habits.find(x=>x.id===hid);if(h&&(completions[k]||0)<h.goal)byDate[dt]=false;});
    return Object.values(byDate).filter(Boolean).length;
  }
  const getTotalCompleted=()=>Object.values(completions).filter(v=>v>0).length;
  const monthRate=getMonthRate();

  const handleDragStart=(idx)=>setDragIdx(idx);
  const handleDragEnter=(idx)=>{dragOver.current=idx;};
  const handleDragEnd=()=>{
    if(dragIdx===null||dragOver.current===null){setDragIdx(null);return;}
    const newH=[...habits];const[moved]=newH.splice(dragIdx,1);newH.splice(dragOver.current,0,moved);
    setHabits(newH);setDragIdx(null);dragOver.current=null;
  };

  async function handleSignOut(){await supabase.auth.signOut();setSession(null);}

  function hideHabit(id){setHabits(hs=>hs.map(h=>h.id===id?{...h,hidden:!h.hidden}:h));setSwipeActions(null);}
  function unhideHabit(id){setHabits(hs=>hs.map(h=>h.id===id?{...h,hidden:false}:h));}
  function deleteHabit(id){setHabits(hs=>hs.filter(h=>h.id!==id));setDetailHabit(null);}

  return (
    <div style={{fontFamily:"'Nunito','Segoe UI',sans-serif",background:"#f7f4f1",minHeight:"100vh",maxWidth:430,margin:"0 auto",position:"relative",display:"flex",flexDirection:"column"}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}} @keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {loading&&(
        <div style={{position:"fixed",inset:0,background:"rgba(247,244,241,0.94)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12}}>
          <div style={{fontSize:42,animation:"spin 1.5s linear infinite"}}>🌸</div>
          <p style={{color:"#aaa",fontWeight:700,fontSize:14}}>Sincronizando...</p>
        </div>
      )}

      <div style={{flex:1,overflowY:"auto",paddingBottom:90}}>
        {tab==="hoje"&&<TodayScreen habits={visibleHabits} hiddenHabits={hiddenHabits} todayHabits={todayHabits} selectedDate={selectedDate} setSelectedDate={setSelectedDate} week={week} getCount={getCount} increment={increment} filterStatus={filterStatus} filterPeriod={filterPeriod} filterOpen={filterOpen} setFilterOpen={setFilterOpen} setFilterStatus={setFilterStatus} setFilterPeriod={setFilterPeriod} swipeActions={swipeActions} setSwipeActions={setSwipeActions} dragMode={dragMode} setDragMode={setDragMode} setHabits={setHabits} handleDragStart={handleDragStart} handleDragEnter={handleDragEnter} handleDragEnd={handleDragEnd} dragIdx={dragIdx} setEditHabit={h=>{setEditHabit(h);setShowAdd(true);}} moods={moods} onHide={hideHabit} onOpenDetail={setDetailHabit} showHidden={showHidden} setShowHidden={setShowHidden} hiddenCount={habits.filter(h=>h.hidden).length} checkinMode={checkinMode}/>}
        {tab==="stats"&&<StatsScreen habits={habits.filter(h=>!h.hidden)} completions={completions} getCount={getCount} statsHabit={statsHabit} setStatsHabit={setStatsHabit} monthRate={monthRate} bestStreak={getBestStreak()} perfectDays={getPerfectDays()} totalCompleted={getTotalCompleted()} curYear={curYear} curMonth={curMonth} daysInCurMonth={daysInMonth(curYear,curMonth)} now={now}/>}
        {tab==="matriz"&&<MatrizScreen habits={habits.filter(h=>!h.hidden)} completions={completions} getCount={getCount} matrizView={matrizView} setMatrizView={setMatrizView} monthRate={monthRate} bestStreak={getBestStreak()} totalCompleted={getTotalCompleted()} now={now}/>}
        {tab==="config"&&<ConfigScreen habits={habits} setHabits={setHabits} setEditHabit={h=>{setEditHabit(h);setShowAdd(true);}} userEmail={session.user.email} onSignOut={handleSignOut} onUnhide={unhideHabit} checkinMode={checkinMode} setCheckinMode={setCheckinMode}/>}
      </div>

      <BottomNav tab={tab} setTab={setTab} onAdd={()=>{setEditHabit(null);setShowAdd(true);}}/>

      {tab==="hoje"&&!showMood&&!showAdd&&!detailHabit&&(
        <button onClick={()=>setShowMood(true)} style={{position:"fixed",bottom:100,right:20,width:54,height:54,borderRadius:27,background:"linear-gradient(135deg,#f9c784,#f4a0b4)",border:"none",fontSize:24,cursor:"pointer",boxShadow:"0 4px 16px rgba(244,160,180,0.4)",zIndex:50,display:"flex",alignItems:"center",justifyContent:"center"}}>
          😊<span style={{position:"absolute",bottom:2,right:2,fontSize:12,background:"#f4a0b4",borderRadius:8,padding:"0 3px",color:"white",fontWeight:700}}>+</span>
        </button>
      )}

      {showMood&&<MoodModal moods={moods} setMoods={setMoods} onClose={()=>setShowMood(false)} date={selectedDate}/>}
      {showAdd&&<HabitForm habit={editHabit} habits={habits} setHabits={setHabits} onClose={()=>{setShowAdd(false);setEditHabit(null);}} COLOR_PALETTES={COLOR_PALETTES} ICON_CATEGORIES={ICON_CATEGORIES}/>}
      {detailHabit&&<HabitDetail habit={detailHabit} getCount={getCount} setCompletions={setCompletions} completions={completions} selectedDate={selectedDate} memos={memos} setMemos={setMemos} onClose={()=>setDetailHabit(null)} onEdit={()=>{setEditHabit(detailHabit);setDetailHabit(null);setShowAdd(true);}} onDelete={()=>deleteHabit(detailHabit.id)} onHide={()=>{hideHabit(detailHabit.id);setDetailHabit(null);}} habits={habits.filter(h=>!h.hidden)} now={now}/>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  HABIT DETAIL SCREEN
// ═══════════════════════════════════════════════════════════
function HabitDetail({habit,getCount,setCompletions,completions,selectedDate,memos,setMemos,onClose,onEdit,onDelete,onHide,habits,now}) {
  const count=getCount(habit.id,selectedDate);
  const done=count>=habit.goal;
  const pct=Math.min(1,count/habit.goal);
  const [activeTab,setActiveTab]=useState("counter");
  const [showMenu,setShowMenu]=useState(false);
  const [showDeleteConfirm,setShowDeleteConfirm]=useState(false);
  const [showNumpad,setShowNumpad]=useState(false);
  const [numpadVal,setNumpadVal]=useState(String(count));
  const [showMemoField,setShowMemoField]=useState(false);
  const [showDisableMemoConfirm,setShowDisableMemoConfirm]=useState(false);
  const memoKey=`${habit.id}_${selectedDate}`;
  const currentMemo=memos[memoKey]||"";

  function setCount(val){
    const v=Math.max(0,Math.min(val,habit.goal*10));
    setCompletions(c=>({...c,[makeKey(habit.id,selectedDate)]:v}));
  }

  // Mostra campo memo automaticamente ao completar se memo ativo
  useEffect(()=>{
    if(done&&habit.memo) setShowMemoField(true);
  },[done,habit.memo]);

  // Estatísticas do hábito
  const curMonth=now.getMonth(), curYear=now.getFullYear();
  const totalDays=daysInMonth(curYear,curMonth);
  const monthDays=Array.from({length:totalDays},(_,i)=>i+1);
  const completedThisMonth=monthDays.filter(d=>getCount(habit.id,`${curYear}-${String(curMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`)>=habit.goal).length;
  const pctMonth=totalDays?Math.round(completedThisMonth/now.getDate()*100):0;

  // Streak atual
  let streak=0;
  for(let i=0;i<365;i++){
    const d=new Date(now); d.setDate(now.getDate()-i);
    if(getCount(habit.id,dateKey(d))>=habit.goal) streak++;
    else break;
  }

  // All time completed for this habit
  const allTimeCompleted = Object.keys(completions).filter(k=>{
    const [hid]=k.split("|"); return hid===habit.id && (completions[k]||0)>=habit.goal;
  }).length;
  // Best streak for this habit
  let bestStreakHabit=0, curS=0;
  for(let i=364;i>=0;i--){
    const d=new Date(now); d.setDate(now.getDate()-i);
    if(getCount(habit.id,dateKey(d))>=habit.goal) curS++;
    else curS=0;
    bestStreakHabit=Math.max(bestStreakHabit,curS);
  }
  const r=90,cx=110,cy=110,circ=2*Math.PI*r;
  const offset=circ*(1-pct);

  return (
    <div style={{position:"fixed",inset:0,background:habit.color.bg,zIndex:200,display:"flex",flexDirection:"column",fontFamily:"'Nunito',sans-serif"}}>
      {/* Header */}
      <div style={{padding:"18px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#666"}}>‹</button>
        <h2 style={{margin:0,fontSize:18,fontWeight:800,color:"#2d2d2d"}}>{habit.emoji} {habit.name}</h2>
        <button onClick={()=>setShowMenu(!showMenu)} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#666",position:"relative"}}>
          ···
          {showMenu&&(
            <div style={{position:"absolute",right:0,top:32,background:"white",borderRadius:16,boxShadow:"0 8px 32px rgba(0,0,0,0.15)",minWidth:160,zIndex:10,overflow:"hidden"}}>
              <button onClick={()=>{setShowMenu(false);onEdit();}} style={{display:"block",width:"100%",padding:"14px 20px",border:"none",background:"none",textAlign:"left",fontSize:14,fontWeight:600,cursor:"pointer",color:"#2d2d2d"}}>✏️ Editar</button>
              <button onClick={()=>{setShowMenu(false);onHide();}} style={{display:"block",width:"100%",padding:"14px 20px",border:"none",background:"none",textAlign:"left",fontSize:14,fontWeight:600,cursor:"pointer",color:"#888"}}>🙈 Ocultar</button>
              <button onClick={()=>{setShowMenu(false);setShowDeleteConfirm(true);}} style={{display:"block",width:"100%",padding:"14px 20px",border:"none",background:"none",textAlign:"left",fontSize:14,fontWeight:600,cursor:"pointer",color:"#e07070"}}>🗑 Excluir</button>
            </div>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",borderBottom:"1px solid rgba(0,0,0,0.08)",padding:"0 20px"}}>
        {["counter","stats"].map(t=>(
          <button key={t} onClick={()=>setActiveTab(t)} style={{flex:1,border:"none",background:"none",padding:"10px 0",fontWeight:activeTab===t?700:500,fontSize:13,color:activeTab===t?"#2d2d2d":"#aaa",cursor:"pointer",borderBottom:activeTab===t?`2px solid ${habit.color.accent}`:"2px solid transparent"}}>
            {t==="counter"?"📊 Contador":"📈 Estatísticas"}
          </button>
        ))}
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"24px 20px"}}>
        {activeTab==="counter"&&(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            {/* Círculo de progresso */}
            <div style={{position:"relative",marginBottom:24}}>
              <svg width={220} height={220} viewBox="0 0 220 220">
                <circle cx={cx} cy={cy} r={r} fill="none" stroke={habit.color.accent+"40"} strokeWidth={18}/>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke={habit.color.accent} strokeWidth={18} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90,110,110)" style={{transition:"stroke-dashoffset 0.4s ease"}}/>
                <text x="50%" y="42%" textAnchor="middle" dominantBaseline="middle" fontSize={38} fontWeight={800} fill="#2d2d2d">{count}</text>
                <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" fontSize={13} fill="#aaa">/{habit.goal} {habit.unit}</text>
                <text x="50%" y="72%" textAnchor="middle" dominantBaseline="middle" fontSize={20}>{habit.emoji}</text>
              </svg>
              {/* Botão + dentro */}
              <button onClick={()=>setCount(count+1)} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",width:36,height:36,borderRadius:18,background:"white",border:`2px solid ${habit.color.accent}`,color:habit.color.accent,fontSize:20,cursor:"pointer",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.1)"}}>+</button>
            </div>

            {/* Botões de ação */}
            <div style={{display:"flex",gap:12,width:"100%",maxWidth:300}}>
              <button onClick={()=>{setNumpadVal(String(count));setShowNumpad(true);}} style={{flex:1,padding:"14px 0",borderRadius:24,border:"none",background:habit.color.accent,color:"white",fontWeight:700,fontSize:15,cursor:"pointer",boxShadow:`0 4px 16px ${habit.color.accent}66`}}>
                Adicionar
              </button>
              <button onClick={()=>setCount(0)} style={{width:52,height:52,borderRadius:26,border:"none",background:"white",color:"#aaa",fontSize:20,cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.08)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                ↺
              </button>
            </div>

            {/* Campo de memorando */}
            {habit.memo&&(
              <div style={{width:"100%",maxWidth:360,marginTop:24,background:"white",borderRadius:20,padding:16,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <span style={{fontWeight:700,fontSize:13,color:"#2d2d2d"}}>📝 Memorando</span>
                  <button onClick={()=>setShowDisableMemoConfirm(true)} style={{background:"none",border:"none",fontSize:11,color:"#aaa",cursor:"pointer",textDecoration:"underline"}}>Desativar</button>
                </div>
                <textarea
                  value={currentMemo}
                  onChange={e=>setMemos(m=>({...m,[memoKey]:e.target.value}))}
                  placeholder="Insira seu memorando aqui"
                  style={{width:"100%",minHeight:100,border:"none",background:"#f7f4f1",borderRadius:12,padding:12,fontSize:14,resize:"none",outline:"none",boxSizing:"border-box",fontFamily:"'Nunito',sans-serif"}}
                />
                <div style={{display:"flex",gap:8,marginTop:8}}>
                  {["😊","🙂","😐","😟","😢"].map(e=>(
                    <span key={e} onClick={()=>setMemos(m=>({...m,[memoKey]:(currentMemo||"")+" "+e}))} style={{fontSize:22,cursor:"pointer"}}>{e}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab==="stats"&&(
          <div>
            {/* Calendário mensal */}
            <div style={{background:"white",borderRadius:20,padding:18,marginBottom:14,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                <span style={{fontWeight:700,fontSize:15,color:"#2d2d2d"}}>06/{curYear}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:6}}>
                {["S","T","Q","Q","S","S","D"].map((d,i)=><div key={i} style={{textAlign:"center",fontSize:10,color:"#ccc",fontWeight:700}}>{d}</div>)}
                {Array(new Date(curYear,curMonth,1).getDay()).fill(null).map((_,i)=><div key={i}/>)}
                {monthDays.map(d=>{
                  const dk=`${curYear}-${String(curMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
                  const isDone=getCount(habit.id,dk)>=habit.goal;
                  const isFuture=new Date(curYear,curMonth,d)>now;
                  const isToday=d===now.getDate()&&curMonth===now.getMonth()&&curYear===now.getFullYear();
                  return <div key={d} style={{aspectRatio:"1",borderRadius:"50%",background:isFuture?"transparent":isDone?habit.color.accent:"transparent",border:isToday?`2px solid ${habit.color.accent}`:isDone?"none":"1px solid #eee",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:isDone?"white":isFuture?"#ddd":"#666",fontWeight:isToday?700:400}}>{d}</div>;
                })}
              </div>
            </div>

            {/* Status Anual estilo GitHub */}
            <div style={{background:"white",borderRadius:20,padding:18,marginBottom:14,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <p style={{margin:"0 0 10px",fontWeight:700,fontSize:14,color:"#2d2d2d"}}>Status Anual {curYear}</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                {Array.from({length:365},(_,i)=>{
                  const d=new Date(curYear,0,1); d.setDate(d.getDate()+i);
                  const done=getCount(habit.id,dateKey(d))>=habit.goal;
                  const isFuture=d>now;
                  return <div key={i} style={{width:9,height:9,borderRadius:2,background:isFuture?"#f0ece8":done?habit.color.accent:habit.color.bg}}/>;
                })}
              </div>
            </div>

            {/* 4 métricas estilo referência */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
              {[
                {icon:"📊",label:`Sucesso em ${["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"][curMonth]}`,value:completedThisMonth,unit:"Dia",color:"#90c4e8",bg:"#e8f0fb"},
                {icon:"✅",label:"Sucesso total",value:allTimeCompleted,unit:"Dia",color:"#88cc80",bg:"#e8f5ef"},
                {icon:"🔥",label:"Série Atual",value:streak,unit:"Dia",color:"#b39ddb",bg:"#ede8fb"},
                {icon:"🏆",label:"Melhor Sequência",value:bestStreakHabit,unit:"Dia",color:"#f9c784",bg:"#fdf8e1"},
              ].map((s,i)=>(
                <div key={i} style={{background:"white",borderRadius:18,padding:"16px 14px",boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
                  <div style={{width:40,height:40,borderRadius:12,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:10}}>{s.icon}</div>
                  <div style={{fontSize:26,fontWeight:800,color:"#2d2d2d"}}>{s.value}<span style={{fontSize:11,fontWeight:600,color:"#aaa"}}> {s.unit}</span></div>
                  <div style={{fontSize:11,color:"#aaa",marginTop:4}}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Notas */}
            <div style={{background:"white",borderRadius:20,padding:16,boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontWeight:700,fontSize:14,color:"#2d2d2d"}}>Notas</span>
              </div>
              {Object.keys(memos).filter(k=>k.startsWith(habit.id+"_")).length===0
                ? <p style={{textAlign:"center",color:"#ccc",fontSize:13}}>Ainda não há memorandos.</p>
                : Object.keys(memos).filter(k=>k.startsWith(habit.id+"_")).sort().reverse().map(k=>{
                    const date=k.split("_").slice(1).join("_");
                    return memos[k]?(
                      <div key={k} style={{borderBottom:"1px solid #f5f0ed",padding:"8px 0"}}>
                        <div style={{fontSize:11,color:"#aaa",marginBottom:4}}>{date}</div>
                        <div style={{fontSize:13,color:"#2d2d2d"}}>{memos[k]}</div>
                      </div>
                    ):null;
                  })
              }
            </div>
          </div>
        )}
      </div>

      {/* Numpad modal */}
      {showNumpad&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:300,display:"flex",alignItems:"flex-end"}}>
          <div style={{background:"white",borderRadius:"24px 24px 0 0",padding:24,width:"100%",animation:"slideUp 0.3s ease"}}>
            <p style={{textAlign:"center",fontWeight:700,fontSize:16,margin:"0 0 16px",color:"#2d2d2d"}}>Inserir valor</p>
            <div style={{background:"#f5f5f5",borderRadius:16,padding:"12px 20px",fontSize:32,fontWeight:800,textAlign:"center",marginBottom:16,color:"#2d2d2d"}}>{numpadVal||"0"}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {["1","2","3","4","5","6","7","8","9","⌫","0","OK"].map(k=>(
                <button key={k} onClick={()=>{
                  if(k==="⌫") setNumpadVal(v=>v.slice(0,-1)||"0");
                  else if(k==="OK"){setCount(parseInt(numpadVal)||0);setShowNumpad(false);}
                  else setNumpadVal(v=>v==="0"?k:v+k);
                }} style={{padding:"18px 0",borderRadius:16,border:"none",background:k==="OK"?habit.color.accent:"#f0f0f0",color:k==="OK"?"white":"#2d2d2d",fontSize:20,fontWeight:700,cursor:"pointer"}}>
                  {k}
                </button>
              ))}
            </div>
            <button onClick={()=>setShowNumpad(false)} style={{width:"100%",marginTop:12,padding:"14px 0",borderRadius:16,border:"none",background:"#f0f0f0",color:"#888",fontWeight:700,cursor:"pointer"}}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Confirmar desativar memo */}
      {showDisableMemoConfirm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div style={{background:"white",borderRadius:24,padding:28,width:"100%",maxWidth:340,textAlign:"center"}}>
            <div style={{width:56,height:56,borderRadius:28,background:"#e8f5ef",margin:"0 auto 16px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>📅</div>
            <h3 style={{margin:"0 0 8px",fontWeight:800,fontSize:16,color:"#2d2d2d"}}>Tem certeza de que deseja desativar o memo automático para {habit.name}?</h3>
            <p style={{margin:"0 0 20px",fontSize:13,color:"#aaa"}}>Você pode ativar novamente o memorando automático editando um hábito.</p>
            <div style={{display:"flex",gap:12}}>
              <button onClick={()=>setShowDisableMemoConfirm(false)} style={{flex:1,padding:"12px 0",borderRadius:20,border:"none",background:"#f5f0ed",color:"#888",fontWeight:700,cursor:"pointer"}}>Cancelar</button>
              <button onClick={()=>{/* desativar memo no hábito - simplificado */setShowDisableMemoConfirm(false);}} style={{flex:1,padding:"12px 0",borderRadius:20,border:"none",background:"#f4a0b4",color:"white",fontWeight:700,cursor:"pointer"}}>Desligar</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmar exclusão */}
      {showDeleteConfirm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div style={{background:"white",borderRadius:24,padding:28,width:"100%",maxWidth:340,textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:12}}>🗑</div>
            <h3 style={{margin:"0 0 8px",fontWeight:800,fontSize:16,color:"#2d2d2d"}}>Excluir "{habit.name}"?</h3>
            <p style={{margin:"0 0 20px",fontSize:13,color:"#aaa"}}>Esta ação não pode ser desfeita.</p>
            <div style={{display:"flex",gap:12}}>
              <button onClick={()=>setShowDeleteConfirm(false)} style={{flex:1,padding:"12px 0",borderRadius:20,border:"none",background:"#f5f0ed",color:"#888",fontWeight:700,cursor:"pointer"}}>Cancelar</button>
              <button onClick={onDelete} style={{flex:1,padding:"12px 0",borderRadius:20,border:"none",background:"#e07070",color:"white",fontWeight:700,cursor:"pointer"}}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  TODAY SCREEN
// ═══════════════════════════════════════════════════════════
function TodayScreen({habits,hiddenHabits,todayHabits,selectedDate,setSelectedDate,week,getCount,increment,filterStatus,filterPeriod,filterOpen,setFilterOpen,setFilterStatus,setFilterPeriod,swipeActions,setSwipeActions,dragMode,setDragMode,setHabits,handleDragStart,handleDragEnter,handleDragEnd,dragIdx,setEditHabit,moods,onHide,onOpenDetail,showHidden,setShowHidden,hiddenCount,checkinMode}) {
  const todayKey=today();
  const todayMood=moods[selectedDate];
  const dayNames=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

  return (
    <div>
      <div style={{padding:"18px 20px 8px",background:"white",borderBottom:"1px solid #f0ece8",position:"sticky",top:0,zIndex:20}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <button onClick={()=>setFilterOpen(!filterOpen)} style={{background:"linear-gradient(135deg,#f4a0b4,#f9c784)",border:"none",borderRadius:20,padding:"8px 16px",color:"white",fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
            {filterStatus==="Todos"&&filterPeriod==="Todos"?"Todos":"Filtros"} <span style={{fontSize:11}}>▾</span>
          </button>
          <h1 style={{margin:0,fontSize:20,fontWeight:800,color:"#2d2d2d"}}>Hoje</h1>
          <div style={{width:40,height:40,borderRadius:20,background:"linear-gradient(135deg,#fde8a0,#f9c784)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,cursor:"pointer",position:"relative"}}>
            {todayMood?MOODS.find(m=>m.label===todayMood)?.emoji||"😊":"😊"}
            {todayMood&&<span style={{position:"absolute",bottom:0,right:0,width:14,height:14,background:"#f4a0b4",borderRadius:7,fontSize:8,display:"flex",alignItems:"center",justifyContent:"center",color:"white"}}>✓</span>}
          </div>
        </div>
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4}}>
          {week.map(d=>{
            const dk=dateKey(d),isToday=dk===todayKey,isSel=dk===selectedDate;
            return (
              <div key={dk} onClick={()=>setSelectedDate(dk)} style={{minWidth:44,display:"flex",flexDirection:"column",alignItems:"center",cursor:"pointer"}}>
                <span style={{fontSize:11,color:isSel?"#f4a0b4":"#aaa",fontWeight:600,marginBottom:4}}>{dayNames[d.getDay()]}</span>
                <div style={{width:38,height:38,borderRadius:19,border:isSel?"2px solid #f4a0b4":"2px solid #f0e8e8",background:isSel?"#fde8ec":"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:isSel?"#f4a0b4":isToday?"#f4a0b4":"#888",fontWeight:isSel||isToday?700:400,fontSize:15,transition:"all 0.2s"}}>
                  {d.getDate()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {filterOpen&&(
        <div style={{background:"white",margin:"8px 16px 0",borderRadius:16,padding:16,boxShadow:"0 8px 24px rgba(0,0,0,0.08)"}}>
          <p style={{margin:"0 0 8px",fontWeight:700,fontSize:13,color:"#888"}}>Status</p>
          <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
            {["Todos","Cumpridos","Não Cumpridos"].map(s=>(
              <button key={s} onClick={()=>setFilterStatus(s)} style={{borderRadius:20,border:"none",padding:"6px 14px",background:filterStatus===s?"#f4a0b4":"#f5f0ed",color:filterStatus===s?"white":"#888",fontWeight:600,fontSize:12,cursor:"pointer"}}>{s}</button>
            ))}
          </div>
          <p style={{margin:"0 0 8px",fontWeight:700,fontSize:13,color:"#888"}}>Período</p>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {["Todos","Manhã","Tarde","Noite"].map(p=>(
              <button key={p} onClick={()=>setFilterPeriod(p)} style={{borderRadius:20,border:"none",padding:"6px 14px",background:filterPeriod===p?"#b39ddb":"#f5f0ed",color:filterPeriod===p?"white":"#888",fontWeight:600,fontSize:12,cursor:"pointer"}}>{p}</button>
            ))}
          </div>
        </div>
      )}

      {habits.length>1&&(
        <div style={{display:"flex",justifyContent:"space-between",padding:"8px 20px 0",alignItems:"center"}}>
          <button onClick={()=>setShowHidden(!showHidden)} style={{background:showHidden?"#f4a0b4":"#f0ece8",border:"none",borderRadius:16,padding:"5px 14px",fontSize:12,fontWeight:700,color:showHidden?"white":"#888",cursor:"pointer"}}>
            {showHidden?"✕ Fechar ocultos":`🙈 Ocultos (${hiddenCount})`}
          </button>
          <button onClick={()=>setDragMode(!dragMode)} style={{background:dragMode?"#b39ddb":"#f0ece8",border:"none",borderRadius:16,padding:"5px 14px",fontSize:12,fontWeight:700,color:dragMode?"white":"#888",cursor:"pointer"}}>
            {dragMode?"✓ Concluir":"⠿ Reordenar"}
          </button>
        </div>
      )}

      <div style={{padding:"12px 16px"}}>
        {todayHabits.length===0&&(
          <div style={{textAlign:"center",padding:"40px 20px",color:"#ccc"}}>
            <div style={{fontSize:40,marginBottom:8}}>🌟</div>
            <p style={{fontWeight:600}}>{showHidden?"Nenhum hábito oculto!":"Nenhum hábito para hoje!"}</p>
            <p style={{fontSize:13}}>Adicione novos hábitos com o botão +</p>
          </div>
        )}
        {!showHidden && todayHabits.map((h,idx)=>(
          <HabitCard key={h.id} habit={h} count={getCount(h.id,selectedDate)} onIncrement={()=>increment(h.id,selectedDate,h.goal)} onSkip={()=>setSwipeActions(null)} onHide={()=>onHide(h.id)} showActions={swipeActions===h.id} setShowActions={v=>setSwipeActions(v?h.id:null)} dragMode={dragMode} onDragStart={()=>handleDragStart(idx)} onDragEnter={()=>handleDragEnter(idx)} onDragEnd={handleDragEnd} isDragging={dragIdx===idx} onEdit={()=>setEditHabit(h)} onOpenDetail={()=>onOpenDetail(h)} showHidden={false} onUndo={()=>increment(h.id,selectedDate,0)} checkinMode={checkinMode}/>
        ))}
        {showHidden && (
          <>
            {hiddenHabits.length===0 ? (
              <div style={{textAlign:"center",padding:"24px 20px",color:"#ccc"}}>
                <div style={{fontSize:32,marginBottom:8}}>👁</div>
                <p style={{fontWeight:600,fontSize:14}}>Nenhum hábito oculto</p>
              </div>
            ) : hiddenHabits.map((h,idx)=>(
              <div key={h.id} style={{marginBottom:10}}>
                <div style={{background:"#f5f0ed",borderRadius:18,padding:"14px 16px",display:"flex",alignItems:"center",opacity:0.7}}>
                  <span style={{fontSize:24,marginRight:12}}>{h.emoji}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:14,color:"#888"}}>{h.name}</div>
                    <div style={{fontSize:11,color:"#aaa"}}>Oculto</div>
                  </div>
                  <button onClick={()=>onHide(h.id)} style={{background:"#e8f5ef",border:"none",borderRadius:12,padding:"8px 14px",fontSize:12,fontWeight:700,color:"#50b070",cursor:"pointer"}}>
                    👁 Mostrar
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function HabitCard({habit,count,onIncrement,onSkip,onHide,onEdit,showActions,setShowActions,dragMode,onDragStart,onDragEnter,onDragEnd,isDragging,onOpenDetail,showHidden,onUndo,checkinMode}) {
  const done=count>=habit.goal;
  const pct=Math.min(1,count/habit.goal);
  const touchStart=useRef(null);
  const touchStartY=useRef(null);
  const [slideX,setSlideX]=useState(0);
  const lastTap=useRef(0);
  const THRESHOLD=70;

  function handleClick(e){
    if(dragMode) return;
    const now=Date.now();
    const diff=now-lastTap.current;
    lastTap.current=now;
    if(diff<350){
      // double tap → open detail
      setShowActions(false);
      onOpenDetail();
    } else {
      // single tap → toggle quick actions
      setShowActions(!showActions);
    }
  }

  function handleTouchStart(e){
    touchStart.current=e.touches[0].clientX;
    touchStartY.current=e.touches[0].clientY;
    setSlideX(0);
  }
  function handleTouchMove(e){
    if(!touchStart.current)return;
    const dx=e.touches[0].clientX-touchStart.current;
    const dy=Math.abs(e.touches[0].clientY-touchStartY.current);
    if(dy>20){touchStart.current=null;setSlideX(0);return;}
    setSlideX(Math.max(-140,Math.min(140,dx)));
  }
  function handleTouchEnd(){
    if(!touchStart.current){setSlideX(0);return;}
    if(slideX>THRESHOLD && checkinMode==="swipe") onIncrement();
    else if(slideX<-THRESHOLD) setShowActions(true);
    touchStart.current=null;
    setSlideX(0);
  }

  const showRightHint=slideX>20&&checkinMode==="swipe";
  const showLeftHint=slideX<-20;

  return (
    <div style={{marginBottom:10,position:"relative",borderRadius:18}}>
      {/* Swipe hints */}
      {showRightHint&&(
        <div style={{position:"absolute",inset:0,background:habit.color.accent,display:"flex",alignItems:"center",paddingLeft:24,borderRadius:18,zIndex:1}}>
          <span style={{fontSize:18,color:"white",fontWeight:700}}>✓ Concluir</span>
        </div>
      )}
      {showLeftHint&&(
        <div style={{position:"absolute",inset:0,background:"#f0ece8",display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:24,borderRadius:18,zIndex:1}}>
          <span style={{fontSize:13,color:"#888",fontWeight:700}}>Opções ›</span>
        </div>
      )}

      {/* Card */}
      <div
        draggable={dragMode}
        onDragStart={dragMode?onDragStart:undefined}
        onDragEnter={dragMode?onDragEnter:undefined}
        onDragEnd={dragMode?onDragEnd:undefined}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        style={{
          background:done?habit.color.accent:habit.color.bg,
          borderRadius:18,padding:"14px 16px",display:"flex",alignItems:"center",
          cursor:dragMode?"grab":"pointer",
          transition:slideX===0?"transform 0.3s, box-shadow 0.2s":"none",
          transform:`translateX(${slideX}px)`,
          opacity:isDragging?0.5:1,
          boxShadow:done?"0 4px 16px rgba(0,0,0,0.10)":"0 2px 8px rgba(0,0,0,0.05)",
          position:"relative",userSelect:"none",zIndex:2,
        }}
      >
        {pct>0&&!done&&<div style={{position:"absolute",left:0,top:0,bottom:0,width:`${pct*100}%`,background:habit.color.accent,opacity:0.2,borderRadius:18,transition:"width 0.3s"}}/>}
        <span style={{fontSize:26,marginRight:12,position:"relative"}}>{habit.emoji}</span>
        <div style={{flex:1,position:"relative",minWidth:0}}>
          <div style={{fontWeight:700,fontSize:15,color:done?"white":"#2d2d2d",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{habit.name}</div>
          {habit.goal>1&&<div style={{fontSize:12,color:done?"rgba(255,255,255,0.75)":"#aaa",marginTop:1}}>{count}/{habit.goal} {habit.unit}</div>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
          <span style={{fontSize:12,fontWeight:700,color:done?"rgba(255,255,255,0.85)":"#bbb"}}>{count}/{habit.goal}</span>
          {done
            ? <div onClick={e=>{e.stopPropagation();onUndo&&onUndo();}} style={{width:32,height:32,borderRadius:16,background:"rgba(255,255,255,0.35)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,cursor:"pointer"}}>✓</div>
            : <div onClick={e=>{e.stopPropagation();onIncrement();}} style={{width:32,height:32,borderRadius:16,border:`2px solid ${habit.color.accent}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:habit.color.accent,background:"white",cursor:"pointer",fontWeight:700}}>+</div>
          }
        </div>
        {dragMode&&<div style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:18,color:"rgba(0,0,0,0.2)"}}>⠿</div>}
      </div>

      {/* Quick actions panel — 1 clique */}
      {showActions&&!dragMode&&(
        <div style={{display:"flex",gap:8,padding:"8px 4px 2px",animation:"fadeIn 0.15s ease"}}>
          <button onClick={e=>{e.stopPropagation();onOpenDetail();setShowActions(false);}} style={{flex:1,padding:"10px 8px",borderRadius:14,border:"none",background:"#e8f0fb",color:"#4a7abf",fontWeight:700,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
            📊 Detalhes
          </button>
          <button onClick={e=>{e.stopPropagation();onEdit();setShowActions(false);}} style={{flex:1,padding:"10px 8px",borderRadius:14,border:"none",background:"#f5ede3",color:"#c4956a",fontWeight:700,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
            ✏️ Editar
          </button>
          <button onClick={e=>{e.stopPropagation();onSkip();setShowActions(false);}} style={{flex:1,padding:"10px 8px",borderRadius:14,border:"none",background:"#fdf8e1",color:"#b89a00",fontWeight:700,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
            ⏭ Pular
          </button>
          <button onClick={e=>{e.stopPropagation();onHide();setShowActions(false);}} style={{flex:1,padding:"10px 8px",borderRadius:14,border:"none",background:"#f0ece8",color:"#888",fontWeight:700,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
            {showHidden?"👁":"🙈"}
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  MOOD MODAL
// ═══════════════════════════════════════════════════════════
function MoodModal({moods,setMoods,onClose,date}) {
  const cur=moods[date];
  const positions=[{top:"8%",left:"25%"},{top:"8%",right:"8%"},{top:"34%",left:"2%"},{top:"34%",right:"2%"},{top:"60%",left:"6%"},{top:"60%",right:"6%"},{top:"72%",left:"36%"}];
  return (
    <div style={{position:"fixed",inset:0,background:"#f5f5f7",zIndex:100,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <div style={{position:"relative",width:340,height:460}}>
        <div style={{position:"absolute",top:"40%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",zIndex:1}}>
          <h2 style={{fontWeight:800,fontSize:24,color:"#2d2d2d",lineHeight:1.3,margin:0}}>Como você se<br/>sente agora?</h2>
        </div>
        {MOODS.map((m,i)=>{
          const isCur=cur===m.label;
          return (
            <div key={m.label} onClick={()=>{setMoods(mm=>({...mm,[date]:m.label}));setTimeout(onClose,400);}} style={{position:"absolute",...(positions[i]||{}),display:"flex",flexDirection:"column",alignItems:"center",cursor:"pointer",transition:"transform 0.2s",transform:isCur?"scale(1.1)":"scale(1)"}}>
              <div style={{width:80,height:80,borderRadius:40,background:m.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,boxShadow:isCur?`0 8px 24px ${m.color}88`:"0 4px 12px rgba(0,0,0,0.1)",border:isCur?"3px solid white":"none"}}>{m.emoji}</div>
              <span style={{marginTop:6,fontSize:13,fontWeight:700,color:"#444"}}>{m.label}</span>
            </div>
          );
        })}
      </div>
      <button onClick={onClose} style={{marginTop:24,width:56,height:56,borderRadius:28,background:"white",border:"2px solid #ddd",fontSize:22,cursor:"pointer"}}>✕</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  HABIT FORM — com paletas de cor e categorias de ícone
// ═══════════════════════════════════════════════════════════
function HabitForm({habit,habits,setHabits,onClose,COLOR_PALETTES,ICON_CATEGORIES}) {
  const isEdit=!!habit;
  const [name,setName]         = useState(habit?.name??"");
  const [desc,setDesc]         = useState(habit?.desc??"");
  const [emoji,setEmoji]       = useState(habit?.emoji??"⭐");
  const [color,setColor]       = useState(habit?.color??Object.values(COLOR_PALETTES)[0][0]);
  const [group,setGroup]       = useState(habit?.group??"");
  const [type,setType]         = useState(habit?.type??"build");
  const [goal,setGoal]         = useState(habit?.goal??1);
  const [unit,setUnit]         = useState(habit?.unit??"vez");
  const [period,setPeriod]     = useState(habit?.period??0);
  const [days,setDays]         = useState(habit?.days??[0,1,2,3,4,5,6]);
  const [reminders,setReminders] = useState(habit?.reminders??false);
  const [memo,setMemo]         = useState(habit?.memo??false);
  const [chartType,setChartType] = useState(habit?.chartType??"bar");
  const [startDate,setStartDate] = useState(habit?.startDate??today());
  const [endDate,setEndDate]   = useState(habit?.endDate??null);
  const [showIconPicker,setShowIconPicker] = useState(false);
  const [showColorPicker,setShowColorPicker] = useState(false);
  const [iconCat,setIconCat]   = useState(Object.keys(ICON_CATEGORIES)[0]);
  const [colorPalette,setColorPalette] = useState(Object.keys(COLOR_PALETTES)[0]);

  const toggleDay=d=>setDays(ds=>ds.includes(d)?ds.filter(x=>x!==d):[...ds,d].sort());

  function save() {
    if(!name.trim()) return;
    const h={id:habit?.id||`h_${Date.now()}`,name:name.trim(),desc,emoji,color,group,type,goal:Number(goal),unit,period,days,reminders,memo,chartType,startDate,endDate,hidden:habit?.hidden??false};
    setHabits(isEdit?hs=>hs.map(x=>x.id===h.id?h:x):hs=>[...hs,h]);
    onClose();
  }

  const card={background:"white",borderRadius:20,padding:"16px 18px",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.04)"};
  const row={display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #f5f0ed"};
  const lbl={fontWeight:700,fontSize:14,color:"#2d2d2d"};

  return (
    <div style={{position:"fixed",inset:0,background:"#f5ede3",zIndex:100,overflowY:"auto",paddingBottom:100}}>
      <div style={{padding:"18px 20px",display:"flex",alignItems:"center",gap:12,background:"#f5ede3",position:"sticky",top:0,zIndex:10}}>
        <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#c4956a"}}>‹</button>
        <h2 style={{margin:0,fontSize:18,fontWeight:800,color:"#2d2d2d"}}>{emoji} {name||"Novo Hábito"}</h2>
      </div>
      <div style={{padding:"0 16px"}}>
        <div style={card}>
          <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
            <div onClick={()=>{setShowIconPicker(!showIconPicker);setShowColorPicker(false);}} style={{width:64,height:64,borderRadius:16,border:"2px dashed #e0d0c0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,cursor:"pointer",background:"#fdf8f3"}}>{emoji}</div>
            <div style={{flex:1}}>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nome do Hábito" style={{width:"100%",border:"none",borderBottom:"2px solid #f0e8e0",padding:"6px 0",fontSize:16,fontWeight:700,background:"transparent",outline:"none",color:"#2d2d2d",boxSizing:"border-box"}}/>
              <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Descrição (Opcional)" style={{width:"100%",border:"none",padding:"6px 0",fontSize:13,background:"transparent",outline:"none",color:"#aaa",marginTop:4,boxSizing:"border-box"}}/>
            </div>
          </div>

          {/* Seletor de ícone */}
          {showIconPicker&&(
            <div style={{marginTop:12,background:"#fdf8f3",borderRadius:16,padding:12}}>
              <div style={{display:"flex",gap:8,overflowX:"auto",marginBottom:12,paddingBottom:4}}>
                {Object.keys(ICON_CATEGORIES).map(cat=>(
                  <button key={cat} onClick={()=>setIconCat(cat)} style={{borderRadius:20,border:"none",padding:"6px 14px",background:iconCat===cat?"#c4956a":"#f0ece8",color:iconCat===cat?"white":"#888",fontWeight:600,fontSize:12,cursor:"pointer",whiteSpace:"nowrap"}}>{cat}</button>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:8}}>
                {ICON_CATEGORIES[iconCat].map(e=>(
                  <span key={e} onClick={()=>{setEmoji(e);setShowIconPicker(false);}} style={{fontSize:24,cursor:"pointer",padding:4,borderRadius:10,background:emoji===e?"#f5ede3":"transparent",textAlign:"center",display:"block"}}>{e}</span>
                ))}
              </div>
            </div>
          )}

          <div style={row}>
            <span style={lbl}>Cor</span>
            <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>{setShowColorPicker(!showColorPicker);setShowIconPicker(false);}}>
              <div style={{width:32,height:18,borderRadius:9,background:color.accent}}/><span style={{color:"#aaa",fontSize:13}}>›</span>
            </div>
          </div>

          {/* Seletor de cor com paletas */}
          {showColorPicker&&(
            <div style={{background:"#fdf8f3",borderRadius:16,padding:12,marginBottom:8}}>
              <div style={{display:"flex",gap:8,overflowX:"auto",marginBottom:12,paddingBottom:4}}>
                {Object.keys(COLOR_PALETTES).map(p=>(
                  <button key={p} onClick={()=>setColorPalette(p)} style={{borderRadius:20,border:"none",padding:"6px 14px",background:colorPalette===p?"#c4956a":"#f0ece8",color:colorPalette===p?"white":"#888",fontWeight:600,fontSize:12,cursor:"pointer",whiteSpace:"nowrap"}}>{p}</button>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8}}>
                {COLOR_PALETTES[colorPalette].map((c,i)=>(
                  <div key={i} onClick={()=>{setColor(c);setShowColorPicker(false);}} style={{width:"100%",aspectRatio:"1",borderRadius:"50%",background:c.accent,cursor:"pointer",border:color.name===c.name?"3px solid #333":"3px solid transparent",boxSizing:"border-box"}}/>
                ))}
              </div>
            </div>
          )}

          <div style={{...row,borderBottom:"none"}}>
            <span style={lbl}>Grupo</span>
            <input value={group} onChange={e=>setGroup(e.target.value)} placeholder="(Opcional)" style={{border:"none",textAlign:"right",background:"transparent",outline:"none",color:"#aaa",fontSize:13}}/>
          </div>
        </div>

        <div style={card}>
          <span style={lbl}>Tipo de Hábito</span>
          <div style={{display:"flex",background:"#f5ede3",borderRadius:14,overflow:"hidden",marginTop:12}}>
            <button onClick={()=>setType("build")} style={{flex:1,padding:"12px 0",border:"none",borderRadius:12,background:type==="build"?"#c4956a":"transparent",color:type==="build"?"white":"#aaa",fontWeight:700,fontSize:14,cursor:"pointer"}}>Construir</button>
            <button onClick={()=>setType("quit")}  style={{flex:1,padding:"12px 0",border:"none",borderRadius:12,background:type==="quit"?"#f4a0b4":"transparent",color:type==="quit"?"white":"#aaa",fontWeight:700,fontSize:14,cursor:"pointer"}}>Sair</button>
          </div>
        </div>

        <div style={card}>
          <div style={row}><span style={lbl}>Período de...</span><span style={{color:"#aaa",fontSize:13}}>Dia Inteiro ›</span></div>
          <div style={row}>
            <span style={lbl}>Valor da Meta</span>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <input type="number" min={1} value={goal} onChange={e=>setGoal(e.target.value)} style={{width:50,textAlign:"center",border:"none",background:"#f5ede3",borderRadius:10,padding:"6px 0",fontWeight:700,fontSize:14,color:"#2d2d2d",outline:"none"}}/>
              <input value={unit} onChange={e=>setUnit(e.target.value)} style={{width:50,textAlign:"center",border:"none",background:"#f5ede3",borderRadius:10,padding:"6px 4px",fontSize:13,color:"#888",outline:"none"}}/>
              <span style={{color:"#aaa",fontSize:13}}>/Dia</span>
            </div>
          </div>
          <div style={row}><span style={lbl}>Dias de Tarefa</span><span style={{color:"#aaa",fontSize:13}}>{days.length===7?"Todos os Dias":`${days.length} dias`} ›</span></div>
          <div style={{display:"flex",gap:6,marginTop:4,marginBottom:4}}>
            {DAY_LABELS.map((d,i)=><div key={i} onClick={()=>toggleDay(i)} style={{flex:1,textAlign:"center",padding:"8px 0",borderRadius:12,background:days.includes(i)?"#c4956a":"#f5ede3",color:days.includes(i)?"white":"#aaa",fontWeight:700,fontSize:11,cursor:"pointer"}}>{d.slice(0,1)}</div>)}
          </div>
          <p style={{margin:"4px 0 0",fontSize:11,color:"#c4956a"}}>*Complete {goal} {unit} todos os dias selecionados</p>
        </div>

        <div style={card}>
          <p style={{...lbl,marginBottom:12,marginTop:0}}>Intervalo de Tempo</p>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {PERIOD_LABELS.map((l,i)=><button key={l} onClick={()=>setPeriod(i)} style={{borderRadius:20,border:"none",padding:"8px 14px",background:period===i?"#c4956a":"#f5ede3",color:period===i?"white":"#888",fontWeight:700,fontSize:13,cursor:"pointer"}}>{l}</button>)}
          </div>
        </div>

        <div style={card}>
          <Toggle label="Lembretes"                        value={reminders} onChange={setReminders}/>
          <Toggle label="Mostrar memorando após conclusão" value={memo}      onChange={setMemo}/>
          <div style={{...row,borderBottom:"none"}}>
            <span style={lbl}>Tipo de Gráfico</span>
            <div style={{display:"flex",gap:6}}>
              <button onClick={()=>setChartType("bar")}  style={{width:40,height:32,borderRadius:10,border:"none",background:chartType==="bar"?"#c4956a":"#f5ede3",color:chartType==="bar"?"white":"#888",fontSize:16,cursor:"pointer"}}>📊</button>
              <button onClick={()=>setChartType("line")} style={{width:40,height:32,borderRadius:10,border:"none",background:chartType==="line"?"#c4956a":"#f5ede3",color:chartType==="line"?"white":"#888",fontSize:16,cursor:"pointer"}}>📈</button>
            </div>
          </div>
        </div>

        <div style={card}>
          <p style={{...lbl,marginBottom:12,marginTop:0}}>Término do Hábito</p>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontSize:12,color:"#aaa"}}>Data de Início</span>
            <span style={{fontSize:12,color:"#aaa"}}>Data de Término</span>
          </div>
          <div style={{display:"flex",gap:12}}>
            <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} style={{flex:1,border:"none",background:"#c4956a",borderRadius:20,padding:"10px 14px",color:"white",fontWeight:700,fontSize:13,outline:"none",cursor:"pointer"}}/>
            <div style={{flex:1,display:"flex",gap:6}}>
              <button onClick={()=>setEndDate(null)} style={{flex:1,border:"none",background:!endDate?"#c4956a":"#f5ede3",borderRadius:20,padding:"10px 8px",color:!endDate?"white":"#888",fontWeight:700,fontSize:12,cursor:"pointer"}}>Sem Fim</button>
              <input type="date" value={endDate||""} onChange={e=>setEndDate(e.target.value||null)} style={{flex:1,border:"none",background:endDate?"#c4956a":"#f5ede3",borderRadius:20,padding:"10px 8px",color:endDate?"white":"#888",fontWeight:700,fontSize:12,outline:"none",cursor:"pointer"}}/>
            </div>
          </div>
        </div>
      </div>
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,padding:"16px",background:"linear-gradient(to top,#f5ede3,transparent)",boxSizing:"border-box"}}>
        <button onClick={save} disabled={!name.trim()} style={{width:"100%",padding:"16px 0",border:"none",borderRadius:28,background:"linear-gradient(135deg,#c4956a,#d4a57a)",color:"white",fontWeight:800,fontSize:16,cursor:name.trim()?"pointer":"default",opacity:name.trim()?1:0.5,boxShadow:"0 8px 24px rgba(196,149,106,0.4)"}}>
          Salvar
        </button>
      </div>
    </div>
  );
}

function Toggle({label,value,onChange}) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #f5f0ed"}}>
      <span style={{fontWeight:700,fontSize:14,color:"#2d2d2d"}}>{label}</span>
      <div onClick={()=>onChange(!value)} style={{width:48,height:28,borderRadius:14,background:value?"#c4956a":"#ddd",position:"relative",cursor:"pointer",transition:"background 0.2s"}}>
        <div style={{position:"absolute",top:3,left:value?22:3,width:22,height:22,borderRadius:11,background:"white",transition:"left 0.2s",boxShadow:"0 2px 6px rgba(0,0,0,0.15)"}}/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  STATS SCREEN
// ═══════════════════════════════════════════════════════════
function StatsScreen({habits,getCount,statsHabit,setStatsHabit,monthRate,bestStreak,perfectDays,totalCompleted,curYear,curMonth,now}) {
  const [calMonth,setCalMonth]=useState(curMonth);
  const [calYear,setCalYear]=useState(curYear);
  const totalDays=daysInMonth(calYear,calMonth);
  const firstDay=new Date(calYear,calMonth,1).getDay();
  const cells=[...Array(firstDay).fill(null),...Array.from({length:totalDays},(_,i)=>i+1)];
  const avgDaily=habits.length&&now.getDate()>0?(totalCompleted/now.getDate()).toFixed(1):0;

  function getDayPct(y,m,d){
    const dk=`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const rel=statsHabit==="all"?habits:habits.filter(h=>h.id===statsHabit);
    if(!rel.length) return 0;
    return rel.filter(h=>getCount(h.id,dk)>=h.goal).length/rel.length;
  }

  return (
    <div style={{padding:"20px 16px"}}>
      <div style={{display:"flex",gap:10,overflowX:"auto",marginBottom:20,paddingBottom:4}}>
        <div onClick={()=>setStatsHabit("all")} style={{minWidth:40,height:40,borderRadius:20,background:statsHabit==="all"?"#f4a0b4":"#f0ece8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,cursor:"pointer",fontWeight:700,padding:"0 10px"}}>Tds</div>
        {habits.map(h=>(<div key={h.id} onClick={()=>setStatsHabit(h.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",cursor:"pointer",gap:3}}><div style={{minWidth:40,height:40,borderRadius:20,background:statsHabit===h.id?h.color.accent:h.color.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,padding:"0 8px"}}>{h.emoji}</div><span style={{fontSize:9,color:statsHabit===h.id?"#f4a0b4":"#aaa",fontWeight:600,maxWidth:48,textAlign:"center",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.name}</span></div>))}
      </div>
      <div style={{background:"white",borderRadius:24,padding:20,marginBottom:16,boxShadow:"0 4px 16px rgba(0,0,0,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <button onClick={()=>{if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1);}} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#888"}}>‹</button>
          <span style={{fontWeight:700,fontSize:16,color:"#2d2d2d"}}>{String(calMonth+1).padStart(2,"0")}/{calYear}</span>
          <button onClick={()=>{if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1);}} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#888"}}>›</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:8}}>
          {["S","T","Q","Q","S","S","D"].map((d,i)=><div key={i} style={{textAlign:"center",fontWeight:700,fontSize:12,color:"#ccc"}}>{d}</div>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
          {cells.map((d,i)=>{
            if(!d) return<div key={i}/>;
            const pct=getDayPct(calYear,calMonth,d);
            const isToday=d===now.getDate()&&calMonth===curMonth&&calYear===curYear;
            const isFuture=new Date(calYear,calMonth,d)>now;
            return<div key={i} style={{aspectRatio:"1",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:20,background:isFuture?"transparent":pct>=1?"#f4a0b4":pct>0?"#fde8ec":"transparent",border:isToday?"2px solid #f4a0b4":"2px solid transparent",fontSize:12,fontWeight:isToday?700:400,color:isFuture?"#ddd":pct>=1?"#c06080":"#2d2d2d"}}>{d}</div>;
          })}
        </div>
      </div>
      <div style={{background:"white",borderRadius:24,padding:28,marginBottom:16,textAlign:"center",boxShadow:"0 4px 16px rgba(0,0,0,0.06)"}}>
        <CircleProgress pct={monthRate}/>
        <p style={{margin:"12px 0 0",fontSize:13,color:"#aaa"}}>Taxa Mensal</p>
      </div>
      <div style={{background:"white",borderRadius:24,padding:20,marginBottom:16,boxShadow:"0 4px 16px rgba(0,0,0,0.06)"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
          <StatBlock emoji="🏆" value={bestStreak}     label="Melhores Sequências" color="#f9c784"/>
          <StatBlock emoji="📅" value={perfectDays}    label="Dias Perfeitos"      color="#90c4e8"/>
          <StatBlock emoji="✅" value={totalCompleted} label="Hábitos Concluídos"  color="#88cc80"/>
          <StatBlock emoji="📈" value={avgDaily}       label="Média Diária"        color="#b39ddb"/>
        </div>
      </div>
      <div style={{background:"white",borderRadius:24,padding:20,boxShadow:"0 4px 16px rgba(0,0,0,0.06)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <span style={{fontWeight:700,fontSize:15,color:"#2d2d2d"}}>Concluído hoje</span>
          <span style={{fontSize:13,color:"#f4a0b4",fontWeight:700}}>Mais ›</span>
        </div>
        {habits.filter(h=>getCount(h.id,today())>=h.goal).length===0
          ?<p style={{textAlign:"center",color:"#ccc",fontSize:13}}>Sem dados de hábitos</p>
          :habits.filter(h=>getCount(h.id,today())>=h.goal).map(h=>(
            <div key={h.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid #f5f0ed"}}>
              <span style={{fontSize:20}}>{h.emoji}</span>
              <span style={{fontWeight:600,fontSize:14,flex:1,color:"#2d2d2d"}}>{h.name}</span>
              <span style={{fontSize:12,color:"#88cc80",fontWeight:700}}>✓ Concluído</span>
            </div>
          ))
        }
      </div>
    </div>
  );
}

function CircleProgress({pct}) {
  const r=70,cx=80,cy=80,circ=2*Math.PI*r,offset=circ*(1-pct/100);
  return (
    <svg width={160} height={160} viewBox="0 0 160 160" style={{display:"block",margin:"0 auto"}}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#fde8ec" strokeWidth={14}/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f4a0b4" strokeWidth={14} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90,80,80)" style={{transition:"stroke-dashoffset 0.8s ease"}}/>
      <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" fontSize={28} fontWeight={800} fill="#2d2d2d">{pct}%</text>
    </svg>
  );
}
function StatBlock({emoji,value,label,color}) {
  return (
    <div style={{textAlign:"center"}}>
      <div style={{width:48,height:48,borderRadius:24,background:color+"33",margin:"0 auto 8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{emoji}</div>
      <div style={{fontSize:28,fontWeight:800,color:"#2d2d2d"}}>{value}<span style={{fontSize:12,fontWeight:600,color:"#aaa"}}> Dia</span></div>
      <div style={{fontSize:12,color:"#aaa",fontWeight:600,marginTop:2}}>{label}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  MATRIZ SCREEN
// ═══════════════════════════════════════════════════════════
function MatrizScreen({habits,getCount,matrizView,setMatrizView,monthRate,bestStreak,totalCompleted,now}) {
  const views=["Semanal","Mensal","Anual"];
  const week=weekDays();
  const curMonth=now.getMonth(),curYear=now.getFullYear();
  const totalDays=daysInMonth(curYear,curMonth);
  const monthDays=Array.from({length:totalDays},(_,i)=>i+1);

  return (
    <div>
      <div style={{display:"flex",borderBottom:"2px solid #f0ece8",background:"white",padding:"16px 20px 0"}}>
        {views.map(v=>(
          <button key={v} onClick={()=>setMatrizView(v)} style={{flex:1,border:"none",background:"none",fontWeight:matrizView===v?800:500,fontSize:14,color:matrizView===v?"#2d2d2d":"#aaa",padding:"8px 0",position:"relative",cursor:"pointer"}}>
            {v}{matrizView===v&&<div style={{position:"absolute",bottom:-2,left:"20%",right:"20%",height:3,background:"#f4a0b4",borderRadius:2}}/>}
          </button>
        ))}
      </div>
      <div style={{padding:"16px"}}>
        <div style={{background:"linear-gradient(135deg,#e8f8f0,#fde8ec)",borderRadius:24,padding:20,marginBottom:16,position:"relative",overflow:"hidden"}}>
          <div style={{textAlign:"center"}}><span style={{fontSize:24}}>☀️ </span><span style={{fontSize:22,fontWeight:800,color:"#f4a0b4",fontStyle:"italic"}}>Habit Tracker</span><span style={{fontSize:20}}> 🌙</span></div>
          <div style={{textAlign:"center",marginTop:8}}><span style={{background:"#fff9a0",borderRadius:20,padding:"4px 16px",fontWeight:700,fontSize:14,color:"#2d2d2d"}}>{matrizView==="Anual"?curYear:`${String(curMonth+1).padStart(2,"0")}/${curYear}`}</span></div>
        </div>

        {matrizView==="Semanal"&&(
          <>
            <div style={{background:"white",borderRadius:20,overflow:"hidden",marginBottom:16,boxShadow:"0 4px 16px rgba(0,0,0,0.06)"}}>
              <div style={{display:"grid",gridTemplateColumns:"100px repeat(7,1fr) 40px",background:"#fafafa",padding:"10px 12px",borderBottom:"1px solid #f0ece8"}}>
                <div/>{week.map((d,i)=><div key={i} style={{textAlign:"center",fontSize:12,fontWeight:700,color:"#888"}}>{DAY_LABELS_SHORT[d.getDay()]}</div>)}<div/>
              </div>
              {habits.map(h=>(
                <div key={h.id} style={{display:"grid",gridTemplateColumns:"100px repeat(7,1fr) 40px",padding:"8px 12px",borderBottom:"1px solid #f5f0ed",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,overflow:"hidden"}}><span style={{fontSize:14}}>{h.emoji}</span><span style={{fontSize:11,fontWeight:600,color:"#666",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{h.name}</span></div>
                  {week.map((d,di)=>{const dk=dateKey(d);const done=getCount(h.id,dk)>=h.goal;const isFuture=d>now;return<div key={di} style={{display:"flex",justifyContent:"center"}}><div style={{width:24,height:24,borderRadius:8,background:isFuture?"#f5f0ed":done?h.color.accent:h.color.bg}}/></div>;})}
                  <div style={{fontSize:11,textAlign:"center",fontWeight:700}}>{week.filter(d=>d<=now&&getCount(h.id,dateKey(d))>=h.goal).length===7?"🏆":""}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:12,overflowX:"auto"}}>
              {[{val:`${monthRate}%`,label:"Taxa Mensal",color:"#f4a0b4"},{val:`${bestStreak}d`,label:"Melhor Sequência",color:"#90c4e8"},{val:totalCompleted,label:"Total Concluídos",color:"#88cc80"}].map((s,i)=>(
                <div key={i} style={{background:"white",borderRadius:16,padding:"12px 16px",textAlign:"center",minWidth:90,flex:1,boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                  <div style={{fontSize:20,fontWeight:800,color:s.color}}>{s.val}</div>
                  <div style={{fontSize:10,color:"#aaa",fontWeight:600,marginTop:2}}>{s.label}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {matrizView==="Mensal"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {habits.map(h=>{
              const completed=monthDays.filter(d=>getCount(h.id,`${curYear}-${String(curMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`)>=h.goal);
              const pct=Math.round(completed.length/totalDays*100);
              return(
                <div key={h.id} style={{background:"white",borderRadius:20,padding:"14px 12px",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                  <div style={{textAlign:"center",fontWeight:700,fontSize:13,color:"#2d2d2d",marginBottom:8}}>{h.emoji} {h.name}</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
                    {monthDays.map(d=>{const dk=`${curYear}-${String(curMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;const done=getCount(h.id,dk)>=h.goal;const isFuture=new Date(curYear,curMonth,d)>now;return<div key={d} style={{aspectRatio:"1",borderRadius:5,background:isFuture?"#f5f0ed":done?h.color.accent:h.color.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,color:done?"white":"#aaa",fontWeight:700}}>{d}</div>;})}
                  </div>
                  <div style={{display:"flex",gap:8,marginTop:8,justifyContent:"center"}}>
                    <span style={{fontSize:11,fontWeight:700,color:h.color.accent}}>📊 {pct}%</span>
                    <span style={{fontSize:11,fontWeight:700,color:"#f9c784"}}>🧩 {completed.length}d</span>
                  </div>
                  {pct===100&&<div style={{textAlign:"center",fontSize:10,color:"#88cc80",fontWeight:700,marginTop:4}}>— PERFECT —</div>}
                </div>
              );
            })}
          </div>
        )}

        {matrizView==="Anual"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {habits.map(h=>{
              const allDays=Array.from({length:365},(_,i)=>{const d=new Date(curYear,0,1);d.setDate(d.getDate()+i);return d;});
              const cnt=allDays.filter(d=>getCount(h.id,dateKey(d))>=h.goal).length;
              const pct=Math.round(cnt/365*100);
              return(
                <div key={h.id} style={{background:"white",borderRadius:20,padding:"14px 12px",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <span style={{fontWeight:700,fontSize:13,color:"#2d2d2d"}}>{h.emoji} {h.name}</span>
                    <div style={{display:"flex",gap:8}}><span style={{fontSize:12,color:h.color.accent,fontWeight:700}}>📊 {pct}%</span><span style={{fontSize:12,color:"#f9c784",fontWeight:700}}>🧩 {cnt}D</span></div>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:2}}>
                    {allDays.map((d,i)=>{const done=getCount(h.id,dateKey(d))>=h.goal;const isFuture=d>now;return<div key={i} style={{width:8,height:8,borderRadius:2,background:isFuture?"#f0ece8":done?h.color.accent:h.color.bg}}/>;})}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  CONFIG SCREEN
// ═══════════════════════════════════════════════════════════
function ConfigScreen({habits,setHabits,setEditHabit,userEmail,onSignOut,onUnhide,checkinMode,setCheckinMode}) {
  const hidden=habits.filter(h=>h.hidden);
  return (
    <div style={{padding:20}}>
      <div style={{background:"linear-gradient(135deg,#fde8ec,#f5ede3)",borderRadius:20,padding:20,marginBottom:16,display:"flex",alignItems:"center",gap:14}}>
        <div style={{width:52,height:52,borderRadius:26,background:"linear-gradient(135deg,#f4a0b4,#f9c784)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>🌸</div>
        <div style={{flex:1}}>
          <p style={{margin:0,fontWeight:700,fontSize:15,color:"#2d2d2d"}}>Olá! 👋</p>
          <p style={{margin:"3px 0 0",fontSize:12,color:"#aaa"}}>{userEmail}</p>
        </div>
        <button onClick={onSignOut} style={{background:"#fde8ec",border:"none",borderRadius:16,padding:"8px 14px",fontSize:12,fontWeight:700,color:"#f4a0b4",cursor:"pointer"}}>Sair 🚪</button>
      </div>

      <h2 style={{fontWeight:800,fontSize:18,marginBottom:16,color:"#2d2d2d"}}>⚙️ Configurações</h2>

      <div style={{background:"white",borderRadius:20,overflow:"hidden",marginBottom:16,boxShadow:"0 4px 16px rgba(0,0,0,0.06)"}}>
        <div style={{padding:"14px 18px",borderBottom:"1px solid #f5f0ed"}}><span style={{fontWeight:700,fontSize:15,color:"#2d2d2d"}}>Meus Hábitos</span></div>
        {habits.filter(h=>!h.hidden).length===0&&<p style={{textAlign:"center",color:"#ccc",padding:20,fontSize:13}}>Nenhum hábito criado ainda</p>}
        {habits.filter(h=>!h.hidden).map((h,i,arr)=>(
          <div key={h.id} style={{display:"flex",alignItems:"center",padding:"12px 18px",borderBottom:i<arr.length-1?"1px solid #f5f0ed":"none"}}>
            <div style={{width:36,height:36,borderRadius:12,background:h.color.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginRight:12}}>{h.emoji}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:14,color:"#2d2d2d"}}>{h.name}</div>
              <div style={{fontSize:11,color:"#aaa"}}>{h.goal} {h.unit}/dia · {h.days?.length===7?"Todos os dias":`${h.days?.length||0} dias/semana`}</div>
            </div>
            <button onClick={()=>setEditHabit(h)} style={{background:"#f5f0ed",border:"none",borderRadius:12,padding:"8px 14px",fontSize:12,fontWeight:700,color:"#888",cursor:"pointer",marginRight:8}}>Editar</button>
            <button onClick={()=>setHabits(hs=>hs.filter(x=>x.id!==h.id))} style={{background:"#fde8ec",border:"none",borderRadius:12,padding:"8px 14px",fontSize:12,fontWeight:700,color:"#f4a0b4",cursor:"pointer"}}>🗑</button>
          </div>
        ))}
      </div>

      {hidden.length>0&&(
        <div style={{background:"white",borderRadius:20,overflow:"hidden",marginBottom:16,boxShadow:"0 4px 16px rgba(0,0,0,0.06)"}}>
          <div style={{padding:"14px 18px",borderBottom:"1px solid #f5f0ed"}}><span style={{fontWeight:700,fontSize:15,color:"#888"}}>🙈 Hábitos Ocultos ({hidden.length})</span></div>
          {hidden.map((h,i)=>(
            <div key={h.id} style={{display:"flex",alignItems:"center",padding:"12px 18px",borderBottom:i<hidden.length-1?"1px solid #f5f0ed":"none",opacity:0.7}}>
              <div style={{width:36,height:36,borderRadius:12,background:h.color.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginRight:12}}>{h.emoji}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14,color:"#2d2d2d"}}>{h.name}</div>
              </div>
              <button onClick={()=>onUnhide(h.id)} style={{background:"#e8f5ef",border:"none",borderRadius:12,padding:"8px 14px",fontSize:12,fontWeight:700,color:"#50b070",cursor:"pointer",marginRight:8}}>👁 Mostrar</button>
              <button onClick={()=>setHabits(hs=>hs.filter(x=>x.id!==h.id))} style={{background:"#fde8ec",border:"none",borderRadius:12,padding:"8px 14px",fontSize:12,fontWeight:700,color:"#f4a0b4",cursor:"pointer"}}>🗑</button>
            </div>
          ))}
        </div>
      )}

      {/* Método de Check-in */}
      <div style={{background:"white",borderRadius:20,overflow:"hidden",marginBottom:16,boxShadow:"0 4px 16px rgba(0,0,0,0.06)"}}>
        <div style={{padding:"14px 18px",borderBottom:"1px solid #f5f0ed"}}>
          <span style={{fontWeight:700,fontSize:15,color:"#2d2d2d"}}>⚡ Método de Check-in</span>
        </div>
        <div style={{padding:"12px 16px",display:"flex",gap:10}}>
          <div onClick={()=>setCheckinMode("swipe")} style={{flex:1,borderRadius:16,border:`2px solid ${checkinMode==="swipe"?"#f4a0b4":"#f0ece8"}`,padding:"14px 12px",cursor:"pointer",background:checkinMode==="swipe"?"#fde8ec":"white",transition:"all 0.2s"}}>
            <div style={{fontSize:22,marginBottom:6}}>👉</div>
            <div style={{fontWeight:700,fontSize:13,color:checkinMode==="swipe"?"#f4a0b4":"#2d2d2d"}}>Deslize para a direita</div>
            <div style={{fontSize:11,color:"#aaa",marginTop:4}}>Arraste o card para concluir</div>
            {checkinMode==="swipe"&&<div style={{marginTop:8,fontSize:11,color:"#f4a0b4",fontWeight:700}}>✓ Selecionado</div>}
          </div>
          <div onClick={()=>setCheckinMode("tap")} style={{flex:1,borderRadius:16,border:`2px solid ${checkinMode==="tap"?"#f4a0b4":"#f0ece8"}`,padding:"14px 12px",cursor:"pointer",background:checkinMode==="tap"?"#fde8ec":"white",transition:"all 0.2s"}}>
            <div style={{fontSize:22,marginBottom:6}}>👆</div>
            <div style={{fontWeight:700,fontSize:13,color:checkinMode==="tap"?"#f4a0b4":"#2d2d2d"}}>Toque para concluir</div>
            <div style={{fontSize:11,color:"#aaa",marginTop:4}}>Clique no botão + do card</div>
            {checkinMode==="tap"&&<div style={{marginTop:8,fontSize:11,color:"#f4a0b4",fontWeight:700}}>✓ Selecionado</div>}
          </div>
        </div>
        <div style={{padding:"0 16px 14px",fontSize:11,color:"#aaa"}}>
          💡 Em ambos os modos, arraste para a <strong>esquerda</strong> para ver opções do hábito
        </div>
      </div>

      <div style={{background:"white",borderRadius:20,padding:20,boxShadow:"0 4px 16px rgba(0,0,0,0.06)"}}>
        <h3 style={{margin:"0 0 12px",fontWeight:700,fontSize:15,color:"#2d2d2d"}}>Sobre o App</h3>
        <p style={{margin:0,fontSize:13,color:"#aaa",lineHeight:1.6}}>Habit Tracker · Versão 3.1<br/>React + Supabase (Auth + PostgreSQL)<br/>Dados sincronizados na nuvem 🔒🌸</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  BOTTOM NAV
// ═══════════════════════════════════════════════════════════
function BottomNav({tab,setTab,onAdd}) {
  const items=[
    {id:"hoje",  emoji:"🏠",label:"Hoje"},
    {id:"stats", emoji:"📊",label:"Stats"},
    {id:"add",   emoji:"+", label:"Novo",isAdd:true},
    {id:"matriz",emoji:"📋",label:"Matriz"},
    {id:"config",emoji:"⚙️",label:"Config"},
  ];
  return (
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"rgba(255,255,255,0.95)",backdropFilter:"blur(12px)",borderTop:"1px solid #f0ece8",padding:"8px 16px 20px",boxSizing:"border-box",zIndex:90}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-around"}}>
        {items.map(item=>{
          if(item.isAdd) return<button key="add" onClick={onAdd} style={{width:56,height:56,borderRadius:28,background:"linear-gradient(135deg,#f4a0b4,#f9c784)",border:"none",fontSize:26,color:"white",cursor:"pointer",boxShadow:"0 6px 20px rgba(244,160,180,0.5)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,transform:"translateY(-8px)"}}>+</button>;
          const active=tab===item.id;
          return<button key={item.id} onClick={()=>setTab(item.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:active?"#fde8ec":"transparent",border:"none",borderRadius:16,padding:"8px 14px",cursor:"pointer",transition:"all 0.2s"}}><span style={{fontSize:20}}>{item.emoji}</span><span style={{fontSize:10,fontWeight:700,color:active?"#f4a0b4":"#aaa"}}>{item.label}</span></button>;
        })}
      </div>
    </div>
  );
}