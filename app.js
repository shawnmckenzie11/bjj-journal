const KEY="bjjj.v2",MARKS={"+":"+ Applied it","~":"~ Recognized it, didn't execute","!":"! Missed it / needs work"};
const CLASS=["Fundamentals","Gi","No-gi","Open mat","Drilling","Competition"],POS=["Closed guard","Open guard","Half guard","Side control","Mount","Back","Turtle","Standing"],ROLE=["Top","Bottom","Neutral"];
const FAILS=["Got flattened","Lost frames","Posture broken","Base too narrow","Grips stripped","Hips not moving","Gassed / muscled it","Late reaction"];
const $=s=>document.querySelector(s),esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const pn=n=>P.find(p=>p.n==n),today=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],DOW=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const dt=(iso,long)=>{const [y,m,d]=iso.split("-").map(Number),x=new Date(y,m-1,d);return (long?DOW[x.getDay()]+", ":"")+MON[m-1]+" "+d};
const MSHORT={"+":"+ Applied","~":"~ Recognized","!":"! Missed"};
const uid=()=>Math.random().toString(36).slice(2,10);
let S=load(),tab="today",draft=null;
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.entries){s.partners=s.partners||[];return s}}catch(e){}return{entries:examples(),recent:[],partners:[],seeded:true}}
function save(){localStorage.setItem(KEY,JSON.stringify(S))}
function sorted(){return [...S.entries].sort((a,b)=>b.date.localeCompare(a.date)||(b.ts||0)-(a.ts||0))}
function examples(){const e=(date,focus,mark,note,x)=>Object.assign({id:uid(),date,example:true,focus,mark,note,ts:Date.parse(date)},x);return[
e("2026-10-20",10,"!","Held in side control for a second, broke down when he walked his hips up. Arms went straight.",{moments:[{pos:"sc.bottom",n:10,m:"!"},{pos:"sc.bottom",n:10,m:"!"}],cls:["Fundamentals"],tech:"Side control escape to guard",steps:["Frame neck + hip","Bridge","Shrimp","Knee in"],corr:"Frame before shrimp, not after",ps:{10:{m:"!",why:"Pushed instead of using forearm structure"},30:{m:"~",why:"Knew I should shrimp, didn't"}},al:{b:3,p:2,s:2},sp:{partner:"Blue belt",start:"Side control",role:"Bottom",worked:"",failed:"Got stuck under side control",missed:"Shrimp space after bridge",trans:"",lessons:"Frame first",fails:["Lost frames","Got flattened"]},rf:{q:"Where should the far hand frame?"},target:{n:10,obj:"From side bottom, set neck + hip frames before any shrimp.",cue:"Frame first, move second",sit:"Side control bottom in rolls",succ:"Made space at least twice"}}),
e("2026-10-23",10,"~","Frames held twice vs white belts; vs heavier blue belt the frame collapsed when my elbow flared.",{moments:[{pos:"sc.bottom",n:10,m:"~"},{pos:"mt.bottom",n:10,m:"!"}],cls:["Gi"],tech:"Upa from mount",steps:["Trap arm","Trap foot","Bridge over shoulder"],corr:"Bridge to the trapped side",ps:{10:{m:"~",why:"Frames up but elbow flared"},19:{m:"+",why:"Got the arm trap"}},al:{b:3,p:3,s:3},sp:{partner:"Same white belt",start:"Mount",role:"Bottom",worked:"Upa once",failed:"Frames on chest",missed:"",trans:"Upa to closed guard top",lessons:"",fails:["Lost frames"]},retro:{att:"Yes",work:"Partly",learned:"Elbow tight makes the frame"},target:{n:4,obj:"In closed guard top, keep knees wide and hands on hips while opening the guard.",cue:"Wide knees, hands on hips",sit:"Closed guard top rounds",succ:"Not swept during guard opening"}}),
e("2026-10-27",4,"+","Wide knees held when he tried the scissor sweep. Broke down when I reached to the mat.",{moments:[{pos:"cg.top",n:4,m:"+"}],cls:["Fundamentals"],tech:"Closed guard opening (standing)",steps:["Posture","Hands on hips","Stand","Break"],corr:"Don't reach for the mat",ps:{4:{m:"+",why:"Stayed upright vs sweep"},16:{m:"~",why:"He broke my posture once"}},al:{b:4,p:3,s:3},sp:{partner:"New white belt",start:"Closed guard",role:"Top",worked:"Stayed on top",failed:"",missed:"Could have pinned the hip",trans:"",lessons:"Base is legs, not hands",fails:["Posture broken"]},retro:{att:"Yes",work:"Yes",learned:"Hands on hips = no posting"},target:{n:25,obj:"Pin one hip to the mat before opening closed guard.",cue:"Pin the hip",sit:"Closed guard top",succ:"Guard opened with pin twice"}})]}
// ---------- render
function go(t){tab=t;render();scrollTo(0,0)}
function render(){document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("on",b.dataset.t==tab));$("main").innerHTML=tab=="today"?vToday():tab=="principles"?vPrinciples():vHistory();bind()}
function lastTarget(excludeId){const e=sorted().find(e=>e.target&&e.target.n&&e.id!==excludeId&&e.date<=(draft?draft.date:today()));return e?{...e.target,from:e.date,fromId:e.id}:null}
function ensureDraft(){if(!draft){draft=S.entries.find(e=>e.date==today()&&!e.example)?structuredClone(S.entries.find(e=>e.date==today()&&!e.example)):{id:uid(),date:today(),ps:{},al:{},sp:{fails:[]},rf:{},retro:{},cls:[],steps:[]}}}
const GRID=[["cg","Closed guard",1],["hg","Half guard",1],["mt","Mount",1],["sc","Side control",1],["bk","Back",1],["st","Standing",0]];
const posName=k=>{const [g,s]=k.split(".");const r=GRID.find(x=>x[0]==g);return r[1]+(s?" "+s:"")};
let selPos=null;
function vToday(){ensureDraft();const d=draft,ed=S.entries.some(e=>e.id==d.id),lt=lastTarget(d.id);d.moments=d.moments||[];let h=`<p class="mute small tight">${dt(d.date,1)} · ${ed?"editing"+(d.example?" example":""):"fill in after class"}</p>`;
if(!d.focus){if(lt)h+=`<div class="box"><p class="mute small">Still working on (from ${dt(lt.from)})</p><h2 style="margin-top:4px">${esc(pn(lt.n).name)}</h2><p>${esc(lt.obj)}</p><p class="mute small">Cue: ${esc(lt.cue)}</p></div><div class="two"><button class="pri" data-a="keep">Keep</button><button data-a="pick">Swap</button></div>`;
else h+=`<div style="height:30vh"></div><button class="pri full" style="min-height:64px" data-a="pick">Pick today's focus</button>`;return h+tail(d,ed)}
const p=pn(d.focus);h+=`<div class="hrow"><button class="plainbtn" data-card="${p.n}">${esc(p.name)} today</button><button class="link small" data-a="pick">Swap</button></div>`;
if(lt&&lt.n==d.focus)h+=`<p class="small mute tight">${esc(lt.obj)} · Cue: ${esc(lt.cue)}</p>`;
h+=`<div class="grid">${GRID.flatMap(([k,l,s])=>s?[k+".top",k+".bottom"]:[k]).map(k=>`<button class="cell${selPos==k?" sel":""}" data-pos="${k}">${esc(posName(k))}</button>`).join("")}<span class="gh small mute">Optional: position, then mark</span></div>
<div class="hs" id="withrow"><span class="small mute wl">Rolled with</span>${S.partners.slice().sort((a,b)=>(b.last||0)-(a.last||0)).map(p=>`<button class="chip pc${(d.with||[]).includes(p.name)?" sel":""}" data-with="${esc(p.name)}">${esc(p.name)}</button>${(d.with||[]).includes(p.name)?`<button class="nb" data-pnote="${esc(p.name)}" aria-label="${esc(p.name)}'s note card" title="${esc(p.name)}'s note card">✎ note</button>`:""}`).join("")}${addingP?`<input id="pname" class="pin" placeholder="Name" aria-label="Partner name"><button class="chip" data-a="paddok">Add</button>`:`<button class="chip" data-a="padd">+ name</button>`}</div>
<div class="hs" id="moms">${d.moments.map((m,i)=>`<button class="mom" data-rm="${i}" aria-label="Remove">${esc(posName(m.pos))} · ${MSHORT[m.m]}${(m.with||[]).length?" · "+m.with.map(esc).join(", "):""} ×</button>`).join("")}</div>
<div class="seg">${Object.entries(MARKS).map(([k,v])=>`<button class="mark${d.mark==k?" sel":""}" data-mark="${k}">${v}</button>`).join("")}</div>
<label for="note" class="small tight">Where did it hold, and where did it break down?</label><textarea id="note" data-f="note">${esc(d.note)}</textarea>
<details id="more"><summary>More notes</summary>${full(d,lt)}</details>
<button class="pri full" data-a="save">Save</button><p id="saved" class="mute small" aria-live="polite"></p>`;
return h+tail(d,ed)}
function tail(d,ed){return ed?`<p><button class="link" data-a="new">Start a new entry for today</button> <button class="link" data-a="del">${delArm?"Tap again to delete":"Delete this entry"}</button></p>`:""}
let delArm=false;
const chips=(f,opts,sel,multi)=>`<div class="chips">${opts.map(o=>`<button class="chip${(multi?(sel||[]).includes(o):sel==o)?" sel":""}" data-chip="${f}" data-v="${esc(o)}" data-multi="${multi?1:0}">${esc(o)}</button>`).join("")}</div>`;
const fld=(f,lab,val,ta)=>`<label>${lab}</label>${ta?`<textarea data-f="${f}">${esc(val)}</textarea>`:`<input data-f="${f}" value="${esc(val)}">`}`;
function logged(d){const s=new Set();if(d.focus&&(d.mark||(d.moments||[]).length))s.add(+d.focus);for(const n in d.ps||{})if(d.ps[n].m)s.add(+n);return[...s]}
function rankHtml(d){const L=logged(d);if(L.length<2)return"";const r=(d.rank||[]).filter(n=>L.includes(n));L.forEach(n=>{if(!r.includes(n))r.push(n)});d.rank=r;
return `<details open><summary>Rank today's principles</summary><p class="mute small">Drag to order: held best at the top, broke down most at the bottom.</p><ol id="rank" class="rank">${r.map(n=>`<li data-n="${n}"><span class="handle" aria-hidden="true">≡</span> ${esc(pn(n).name)}</li>`).join("")}</ol></details>`}
function full(d,lt){const r=d.retro||{},sp=d.sp||{},rf=d.rf||{},al=d.al||{},t=d.target||{};const ab=(k,l,hint)=>`<label>${l} <span class="mute small">(${hint})</span></label>${chips("al."+k,["1","2","3","4","5"],al[k]!=null?String(al[k]):null)}`;
return `<p class="mute small">All optional. Open only what you need.</p>
${lt&&lt.fromId!==d.id?`<details${r.att?" open":""}><summary>Last target: ${esc(pn(lt.n).name)}</summary><p class="small">${esc(lt.obj)}</p><label>Did I attempt it?</label>${chips("retro.att",["Yes","Partly","No"],r.att)}<label>Did it work?</label>${chips("retro.work",["Yes","Partly","No"],r.work)}${fld("retro.learned","What did I learn?",r.learned,1)}</details>`:""}
${rankHtml(d)}
<details><summary>Class overview</summary><label>Date</label><input type="date" data-f="date" value="${esc(d.date)}"><label>Class type</label>${chips("cls",CLASS,d.cls,1)}${fld("tech","Techniques taught",d.tech)}${fld("corr","Coach corrections",d.corr,1)}</details>
<details><summary>Technique, step by step</summary>${["Start position","Grips","Movement","Mechanics","Finish"].map((l,i)=>fld("steps."+i,(i+1)+". "+l,(d.steps||[])[i])).join("")}</details>
<details><summary>Principles I saw</summary><p class="mute small">Pick only the ones that showed up. Mark each: + applied · ~ recognized, not executed · ! missed.</p><input placeholder="Filter principles" id="pf">
<div class="chips" id="plist" style="margin-top:10px">${P.map(p=>`<button class="chip${d.ps[p.n]?" sel":""}" data-pp="${p.n}">${p.n} ${esc(p.name)}</button>`).join("")}</div>
${Object.keys(d.ps).map(n=>`<div class="box">${n} ${esc(pn(n).name)}${chips("ps."+n+".m",["+","~","!"],d.ps[n].m)}${fld("ps."+n+".why","Why it applied",d.ps[n].why)}</div>`).join("")}</details>
<details><summary>My alignment lens</summary><p class="mute small">Base / Structure / Posture is this journal's own lens, not Gracie terms. Related official principles: Base goes with Pyramid (4) and Kuzushi (11); Structure goes with Frame (10). Official Posture (16) is about disrupting the opponent's posture, not keeping your own.</p>
${ab("b","Base","Pyramid 4, Kuzushi 11")}${ab("s","Structure","Frame 10")}${ab("p","Posture, my own","not the same as official 16")}${fld("alnote","Balance, frames, leverage, connection",d.alnote,1)}</details>
<details><summary>Sparring retrospective</summary><p class="mute small">Overall impressions, no round-by-round needed.</p>${fld("sp.partner","Partner",sp.partner)}<label>Start position</label>${chips("sp.start",POS,sp.start)}<label>I was mostly</label>${chips("sp.role",ROLE,sp.role)}
${fld("sp.worked","What worked",sp.worked,1)}${fld("sp.failed","What failed",sp.failed,1)}<label>Recurring problems</label>${chips("sp.fails",FAILS,sp.fails,1)}${fld("sp.missed","Missed opportunities",sp.missed,1)}${fld("sp.trans","Transitions",sp.trans,1)}${fld("sp.lessons","Lessons",sp.lessons,1)}</details>
<details><summary>Reflection</summary>${fld("rf.worked","What worked",rf.worked,1)}${fld("rf.failed","What repeatedly failed",rf.failed,1)}${fld("rf.disc","What I discovered",rf.disc,1)}${fld("rf.q","Question for my coach",rf.q,1)}</details>
<details${t.n?" open":""}><summary>Next class target (one principle)</summary><p class="mute small">SMART: Specific behaviour · Measurable evidence · Achievable now · Relevant to my game · Time-bound to next class.</p>
<label>Principle</label><select data-f="target.n"><option value="">— choose one —</option>${P.map(p=>`<option value="${p.n}"${t.n==p.n?" selected":""}>${p.n} ${esc(p.name)}</option>`).join("")}</select>
${fld("target.obj","Objective (one sentence, specific behaviour)",t.obj)}${fld("target.cue","Physical cue",t.cue)}${fld("target.sit","Situation to apply it in",t.sit)}${fld("target.succ","What success looks like (measurable)",t.succ)}
<p class="mute small">Next class opens with this as the carry-over.</p></details>`}
function vPrinciples(){return `<h1>Principles</h1><p class="mute small">Names and one-line definitions from Gracie University's 32 Principles. Tap one for a recall card.</p><input id="psearch" placeholder="Search principles">
<div id="prows">${[1,2,3,4].map(pt=>`<h3 class="parth">Part ${pt}</h3>`+P.filter(p=>p.part==pt).map(p=>`<button class="row" data-card="${p.n}" data-s="${esc((p.n+" "+p.name).toLowerCase())}">${p.n}. ${esc(p.name)}</button>`).join("")).join("")}</div>
<h2 style="margin-top:40px">Principle chains</h2><p class="mute small">Starter chains for a white belt. These aren't from Gracie, so check them with your coach.</p>
<input id="csearch" placeholder="Search chains (position, principle, mistake)"><div style="margin-top:10px">${chips("cfilter",["All",...new Set(CH.map(c=>c.cat))],cf)}</div><div id="clist">${chainList()}</div>`}
let cf="All",cq="";
function chainList(){return CH.filter(c=>(cf=="All"||c.cat==cf)&&(!cq||JSON.stringify(c).toLowerCase().includes(cq)||c.ps.some(n=>pn(n).name.toLowerCase().includes(cq)))).map(c=>`<details class="chain"><summary><span>${esc(c.start)}: ${c.ps.map(n=>esc(pn(n).name)).join(", then ")}. Outcome: ${esc(c.out)}</span></summary>
<h3>Mechanics</h3><ol>${c.mech.map(m=>`<li>${esc(m)}</li>`).join("")}</ol><h3>How each principle contributes</h3>${c.ps.map(n=>`<p>${n} ${esc(pn(n).name)}: ${esc(c.how[n])}</p>`).join("")}
<h3>Common mistakes</h3><ul>${c.mist.map(m=>`<li>${esc(m)}</li>`).join("")}</ul><h3>SMART target</h3><p>${esc(c.t.obj)}<br><span class="mute small">Cue: ${esc(c.t.cue)} · Situation: ${esc(c.t.sit)} · Success: ${esc(c.t.succ)}</span></p>
<button class="full" data-adopt="${c.id}">Use as my next target</button></details>`).join("")||`<p class="mute">No chains match.</p>`}
let hq="",hp="",addingP=false,lpFired=false;
function partnerView(){const p=S.partners.find(x=>x.name==hp);if(!p)return"";const c={};S.entries.forEach(e=>(e.moments||[]).forEach(m=>{if((m.with||[]).includes(hp)||(!(m.with||[]).length&&(e.with||[]).includes(hp))){const k=posName(m.pos);c[k]=c[k]||{};c[k][m.m]=(c[k][m.m]||0)+1}}));
return `<div class="box" id="pview"><p>Rolled with ${esc(p.name)}, by position</p>${Object.keys(c).sort().map(k=>`<p class="small">${esc(k)}: ${["!","~","+"].filter(x=>c[k][x]).map(x=>c[k][x]+" "+MW[x]).join(", ")}</p>`).join("")||'<p class="small mute">No moments tagged yet.</p>'}
<button class="full" data-pnote="${esc(p.name)}">${esc(p.name)}'s note card</button></div>`}
function vHistory(){const es=sorted().filter(e=>!hp||(e.with||[]).includes(hp)||(e.moments||[]).some(m=>(m.with||[]).includes(hp))).filter(e=>!hq||JSON.stringify(e).toLowerCase().includes(hq)||(e.focus&&pn(e.focus).name.toLowerCase().includes(hq)));
const nex=S.entries.filter(e=>e.example).length;return `<h1>History</h1>${nex&&!S.hideEx?`<p class="small exnote">These ${nex} are examples. <button class="link small" data-a="rmex">Remove them</button> <button class="link small" data-a="hideex">Dismiss</button></p>`:""}<input id="hsearch" placeholder="Search entries" value="${esc(hq)}">${S.partners.length?`<details id="pd"${hp?" open":""}><summary>Partners</summary>${S.partners.map(p=>`<div class="prow"><button class="chip${hp==p.name?" sel":""}" data-pfilt="${esc(p.name)}">${esc(p.name)}</button></div>`).join("")}${hp?`<button class="link small" data-pfilt="">Show all entries</button>`:""}</details>${partnerView()}`:""}
<div>${es.map(e=>`<button class="row" data-open="${e.id}">${dt(e.date)} · ${e.focus?esc(pn(e.focus).name):"No focus"}${e.mark?" · "+MSHORT[e.mark]:""}${(()=>{const w=[...new Set([...(e.with||[]),...(e.moments||[]).flatMap(m=>m.with||[])])];return w.length?" · Rolled with "+w.map(esc).join(", "):""})()}${e.example?" · Example":""}<br><span class="mute small">${esc(trunc(e.note))}</span></button>`).join("")||'<p class="mute">No entries match.</p>'}</div>
<details id="sumd"><summary>Summary</summary><div class="sum">${summary()}</div></details><p class="lastrow"><button class="link small" data-a="settings">Settings · Export / Import</button></p>`}
const MW={"+":"applied","~":"recognized","!":"missed"};
const cnt3=o=>["!","~","+"].filter(k=>o[k]).map(k=>o[k]+" "+MW[k]).join(", "),line3=o=>`${o["+"]||0} applied · ${o["~"]||0} recognized · ${o["!"]||0} missed`,pl=(n,w)=>n+" "+w+(n==1?"":"s");
// Single source of truth for counting. Unit = a "mark": each logged moment counts once;
// a principle's day mark (focus mark or "Principles I saw" mark) counts once only if that principle has no moments that day.
const trunc=t=>{t=t||"";const l=t.split("\n")[0];return l.length>90?l.slice(0,89).trimEnd()+"…":l+(t.includes("\n")&&t.trim()!=l.trim()?" …":"")};
function marksOf(e){const out=(e.moments||[]).filter(m=>m.n&&m.m).map(m=>({n:+m.n,pos:m.pos,m:m.m})),has=new Set(out.map(x=>x.n)),day={};
for(const n in e.ps||{})if(e.ps[n].m)day[n]=e.ps[n].m;if(e.focus&&e.mark&&!day[e.focus])day[e.focus]=e.mark;for(const n in day)if(!has.has(+n))out.push({n:+n,pos:null,m:day[n]});return out}
function summary(){const es=S.entries;if(!es.length)return'<p class="mute">Nothing logged yet.</p>';const per={},pp={};
es.forEach(e=>marksOf(e).forEach(x=>{per[x.n]=per[x.n]||{t:0};per[x.n].t++;per[x.n][x.m]=(per[x.n][x.m]||0)+1;const k=(x.pos?posName(x.pos):"No position")+" · "+pn(x.n).name;pp[k]=pp[k]||{};pp[k][x.m]=(pp[k][x.m]||0)+1}));
const nm=n=>pn(n).name,top=Object.keys(per).sort((a,b)=>per[b].t-per[a].t);
const W=v=>v<=2?"shaky":v==3?"holding":"solid",al=sorted().filter(e=>e.al&&e.al.b).reverse(),hf=Math.ceil(al.length/2),mode=(arr,k)=>{const c={};arr.forEach(e=>{if(e.al[k]){const w=W(+e.al[k]);c[w]=(c[w]||0)+1}});return Object.keys(c).sort((a,b)=>c[b]-c[a])[0]||"not rated"};
const alt=al.length<2?"not enough entries yet":[["b","Base"],["s","Structure"],["p","Posture"]].map(([k,l])=>`${l} ${mode(al.slice(0,hf),k)} to ${mode(al.slice(hf),k)}`).join(", ");
const fl={};es.forEach(e=>(e.sp?.fails||[]).forEach(f=>fl[f]=(fl[f]||0)+1));const rec=Object.keys(fl).filter(f=>fl[f]>1).sort((a,b)=>fl[b]-fl[a]);
const rare=top.filter(n=>!per[n]["+"]).map(nm);
const tg=sorted().filter(e=>e.target&&e.target.n).map(e=>{const nx=sorted().filter(x=>x.date>e.date).pop();const ra=nx&&nx.retro&&nx.retro.att,TW={Yes:"worked",Partly:"partly worked",No:"didn't work"};const r=ra?(ra=="No"?"Didn't try it":(ra=="Yes"?"Tried it":"Partly tried it")+(nx.retro.work?" · "+TW[nx.retro.work]:"")):"Still open";return `<p class="small">${dt(e.date)}: ${esc(nm(e.target.n))} — ${esc(e.target.obj)} <span class="mute">${r}</span></p>`}).join("");
return `<p class="mute small">Counts are marks: each logged moment counts once; a day mark counts only when that principle has no moments that day.</p><h3>Logged most</h3>${top.map(n=>`<p class="small">${nm(n)}: ${line3(per[n])}</p>`).join("")}
<h3>By position</h3>${Object.keys(pp).sort().map(k=>`<p class="small">${esc(k)}: ${cnt3(pp[k])}</p>`).join("")||'<p class="small mute">No moments logged yet.</p>'}
<p>Alignment, then vs now: ${alt}</p>
<p>Recurring problems: ${rec.map(f=>`${f} (${pl(fl[f],"time")})`).join(", ")||"none repeated yet"}</p>
<p>Recognized but not applied yet: ${rare.map(esc).join(", ")||"none"}</p><h3>Targets</h3>${tg||'<p class="mute">None yet.</p>'}`}
// ---------- sheets
function sheet(html){$("#sheet").innerHTML='<div class="grab"></div>'+html;$("#sbg").style.display="block";requestAnimationFrame(()=>$("#sheet").classList.add("open"));bindSheet()}
function closeSheet(){$("#sheet").classList.remove("open");$("#sbg").style.display="none"}
function card(n){const p=pn(n),c=p.coach,keys={cg:"Closed guard",mount:"Mount",side:"Side control",stand:"Standing"};
sheet(`<p class="mute small">Principle ${p.n} · Part ${p.part}</p><h1>${esc(p.name)}</h1><p>Recall first: what does it mean, and where will it show up in today's rolls?</p>
<div id="rev" hidden><div class="box"><p>${esc(p.line)}</p><p class="mute small">Gracie University wording · <a href="${p.src}" target="_blank" rel="noopener">Part ${p.part}</a>${p.verified?"":" · unverified"}</p></div>
<details><summary>Coach examples</summary><p class="mute small">Sensei's examples for pre-class reading (not Gracie wording)</p>${Object.keys(keys).map(k=>`<p>${keys[k]}: ${c[k]?esc(c[k].replace(/^[^:]+:\s*/,"")):'<span class="mute">not added yet</span>'}</p>`).join("")}</details></div>
<button class="full" id="revbtn">Reveal</button><button class="pri full" data-focus="${p.n}">Make this today's focus</button>`)}
function picker(){const rec=S.recent.filter(n=>pn(n)),rest=P.filter(p=>!rec.includes(p.n));
sheet(`<h1>Pick today's focus</h1><input id="pk" placeholder="Search the 32"><div id="pkl">${[...rec.map(pn),...rest].map((p,i)=>`<button class="row" data-pick="${p.n}" data-s="${esc((p.n+" "+p.name).toLowerCase())}">${p.n}. ${esc(p.name)}${i<rec.length?' <span class="mute small">recent</span>':''}</button>`).join("")}</div>`)}
function settings(){sheet(`<h1>Settings</h1><button class="pri full" id="exp">Export JSON</button><label>Import JSON</label><input type="file" id="imp" accept="application/json,.json"><p class="mute small">Import replaces current data.</p>
<button class="full" id="rmex">Remove example entries</button><h2>Shorthand</h2><p>+ applied · ~ recognized, not executed · ! missed / needs work. These marks and the Base/Posture/Structure lens are this journal's own, not Gracie terms.</p>
<h2>About</h2><p class="small">Principle names, numbers and one-line definitions are from Gracie University's “The 32 Principles of Jiu-Jitsu” (Ryron & Rener Gracie), checked 3 Nov 2026 against:</p><ul class="small">${[1,2,3,4].map(i=>`<li><a href="${SRC[i]}">Part ${i} (Principles ${i*8-7}–${i*8})</a></li>`).join("")}</ul>
<p class="small">All 32 were verified, so no gaps. Note: this is the 32 Principles course, a separate curriculum from Gracie Combatives. Coach examples come from Sensei. Principle chains are the journal's own starter content.</p>`)}
// ---------- bind
function setPath(o,path,v){const k=path.split(".");let t=o;for(let i=0;i<k.length-1;i++){t[k[i]]=t[k[i]]??(/^\d+$/.test(k[i+1])&&k[0]=="steps"?[]:{});t=t[k[i]]}t[k.at(-1)]=v}
function getPath(o,path){return path.split(".").reduce((t,k)=>t?.[k],o)}
function bind(){const m=$("main");
m.querySelectorAll("[data-f]").forEach(el=>el.addEventListener("input",()=>setPath(draft,el.dataset.f,el.dataset.f=="target.n"?(+el.value||null):el.value)));
m.querySelectorAll("[data-al]").forEach(el=>el.addEventListener("input",()=>{draft.al[el.dataset.al]=+el.value;$("#v_"+el.dataset.al).textContent=el.value}));
const f=(id,fn)=>{const e=$(id);if(e)e.addEventListener("input",()=>fn(e.value.toLowerCase()))};
f("#pf",q=>m.querySelectorAll("[data-pp]").forEach(b=>b.hidden=!b.textContent.toLowerCase().includes(q)));
f("#psearch",q=>m.querySelectorAll("#prows .row").forEach(b=>b.hidden=!b.dataset.s.includes(q)));
f("#csearch",q=>{cq=q;$("#clist").innerHTML=chainList()});
const rk=$("#rank");if(rk){let dr=null;rk.addEventListener("pointerdown",e=>{const li=e.target.closest("li");if(!li)return;dr=li;li.classList.add("drag");rk.setPointerCapture(e.pointerId);e.preventDefault()});
rk.addEventListener("pointermove",e=>{if(!dr)return;const over=[...rk.children].find(li=>li!==dr&&(()=>{const r=li.getBoundingClientRect();return e.clientY>r.top&&e.clientY<r.bottom})());if(over){const r=over.getBoundingClientRect();rk.insertBefore(dr,e.clientY<r.top+r.height/2?over:over.nextSibling)}});
const end=()=>{if(!dr)return;dr.classList.remove("drag");dr=null;draft.rank=[...rk.children].map(li=>+li.dataset.n)};rk.addEventListener("pointerup",end);rk.addEventListener("pointercancel",end)}
f("#hsearch",q=>{hq=q;render();const i=$("#hsearch");i.focus();i.setSelectionRange(q.length,q.length)})}
document.addEventListener("click",e=>{const b=e.target.closest("button");if(!b||b.closest("#sheet")&&!b.dataset.focus&&!b.dataset.pick)return;const d=b.dataset;
if(d.t)return go(d.t);if(d.card)return card(d.card);
if(d.a=="rmex"){S.entries=S.entries.filter(x=>!x.example);save();return render()}if(d.a=="hideex"){S.hideEx=true;save();return render()}if(d.a=="pick")return picker();if(d.a=="settings")return settings();
if(d.a=="keep"){draft.focus=lastTarget(draft.id).n;bump(draft.focus);return render()}
if(d.with){if(lpFired){lpFired=false;return}const w=draft.with||[];draft.with=w.includes(d.with)?w.filter(x=>x!=d.with):[...w,d.with];return rr()}if(d.pnote){return pcard(d.pnote)}if(d.pfilt!=null){hp=hp==d.pfilt?"":d.pfilt;return render()}
if(d.a=="padd"){addingP=true;rr();$("#pname").focus();return}
if(d.a=="paddok"){const v=$("#pname").value.trim();addingP=false;if(v){let p=S.partners.find(x=>x.name.toLowerCase()==v.toLowerCase());if(!p){p={name:v,note:"",last:Date.now()};S.partners.push(p)}else p.last=Date.now();draft.with=draft.with||[];if(!draft.with.includes(p.name))draft.with.push(p.name);save()}return rr()}

if(d.pos){selPos=selPos==d.pos?null:d.pos;return rr()}if(d.rm!=null){draft.moments.splice(+d.rm,1);return rr()}if(d.mark){if(selPos){draft.moments.push({pos:selPos,n:draft.focus,m:d.mark,with:[...(draft.with||[])]});(draft.with||[]).forEach(n=>{const p=S.partners.find(x=>x.name==n);if(p)p.last=Date.now()});save();selPos=null;if(!draft.mark)draft.mark=d.mark}else draft.mark=draft.mark==d.mark?null:d.mark;return rr()}
if(d.a=="save"){draft.ts=Date.now();const i=S.entries.findIndex(x=>x.id==draft.id);if(i>=0)S.entries[i]=structuredClone(draft);else S.entries.push(structuredClone(draft));save();render();const s=$("#saved");if(s)s.textContent="Saved.";return}
if(d.a=="new"){draft={id:uid(),date:today(),ps:{},al:{},sp:{fails:[]},rf:{},retro:{},cls:[],steps:[]};delArm=false;return render()}
if(d.a=="del"){if(!delArm){delArm=true;return render()}S.entries=S.entries.filter(x=>x.id!=draft.id);save();delArm=false;draft=null;return go("history")}
if(d.chip){const k=d.chip,v=d.v;if(k=="cfilter"){cf=v;return render()}
if(d.multi=="1"){const a=getPath(draft,k)||[];setPath(draft,k,a.includes(v)?a.filter(x=>x!=v):[...a,v])}else setPath(draft,k,getPath(draft,k)==v?null:v);
if(/^ps\.\d+\.m$/.test(k))return rr();b.parentNode.querySelectorAll(".chip").forEach(c=>c.classList.toggle("sel",d.multi=="1"?(getPath(draft,k)||[]).includes(c.dataset.v):getPath(draft,k)==c.dataset.v));return}
if(d.pp){if(draft.ps[d.pp])delete draft.ps[d.pp];else draft.ps[d.pp]={m:null,why:""};return rr()}
if(d.adopt){const c=CH.find(x=>x.id==d.adopt);ensureDraft();draft.target={n:c.ps[0],...c.t};go("today");document.querySelectorAll("details").forEach(x=>{if(x.textContent.startsWith("Next class target"))x.open=true});return}
if(d.open){draft=structuredClone(S.entries.find(x=>x.id==d.open));delArm=false;return go("today")}
if(d.focus||d.pick){const n=+(d.focus||d.pick);ensureDraft();draft.focus=n;bump(n);if(d.pick){render();return card(n)}closeSheet();return go("today")}});
function rr(){const open={};document.querySelectorAll("details").forEach(x=>open[x.querySelector("summary").textContent]=x.open);const y=scrollY;render();document.querySelectorAll("details").forEach(x=>{const k=x.querySelector("summary").textContent;if(k in open)x.open=open[k]});scrollTo(0,y)}
function pcard(name){const p=S.partners.find(x=>x.name==name);if(!p)return;p.note=typeof p.note=="object"&&p.note?p.note:{size:"",game:"",catch:p.note||""};
sheet(`<h1>${esc(p.name)}</h1><p class="mute small">All optional.</p><label for="pn_size">Size</label><input id="pn_size" value="${esc(p.note.size)}"><label for="pn_game">Game</label><input id="pn_game" value="${esc(p.note.game)}"><label for="pn_catch">What they catch me with</label><input id="pn_catch" value="${esc(p.note.catch)}"><button class="pri full" id="pnsave">Save note</button>`);
$("#pnsave").onclick=()=>{p.note={size:$("#pn_size").value,game:$("#pn_game").value,catch:$("#pn_catch").value};save();closeSheet();render()}}
// long-press a Rolled with chip to open its note card
(()=>{let t=null;document.addEventListener("pointerdown",e=>{const b=e.target.closest("[data-with]");if(!b)return;t=setTimeout(()=>{lpFired=true;pcard(b.dataset.with)},550)});["pointerup","pointercancel","pointermove"].forEach(ev=>document.addEventListener(ev,e=>{if(ev=="pointermove"&&Math.abs(e.movementY)+Math.abs(e.movementX)<3)return;clearTimeout(t)}));document.addEventListener("contextmenu",e=>{if(e.target.closest("[data-with]"))e.preventDefault()})})();
function bump(n){S.recent=[n,...S.recent.filter(x=>x!=n)].slice(0,6);save()}
function bindSheet(){const s=$("#sheet"),q=id=>s.querySelector(id);
if(q("#revbtn"))q("#revbtn").onclick=()=>{q("#rev").hidden=false;q("#revbtn").remove()};
if(q("#pk"))q("#pk").oninput=e=>s.querySelectorAll("[data-pick]").forEach(b=>b.hidden=!b.dataset.s.includes(e.target.value.toLowerCase()));
if(q("#exp"))q("#exp").onclick=()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(S,null,1)],{type:"application/json"}));a.download="bjj-journal-"+today()+".json";a.click()};
if(q("#imp"))q("#imp").onchange=e=>{const r=new FileReader();r.onload=()=>{try{const o=JSON.parse(r.result);if(!o.entries)throw 0;S=o;S.recent=S.recent||[];S.partners=S.partners||[];save();draft=null;closeSheet();render()}catch(x){alert("That file isn't a journal export.")}};r.readAsText(e.target.files[0])};
if(q("#rmex"))q("#rmex").onclick=()=>{S.entries=S.entries.filter(x=>!x.example);save();closeSheet();render()}}
// swipe down to close
(()=>{let y0=null;document.addEventListener("touchstart",e=>{const s=e.target.closest("#sheet");y0=s&&s.scrollTop<=0?e.touches[0].clientY:null},{passive:true});
document.addEventListener("touchend",e=>{if(y0!=null&&e.changedTouches[0].clientY-y0>80)closeSheet();y0=null})})();
$("#sbg").onclick=closeSheet;if(S.seeded){delete S.seeded;save()}render();
