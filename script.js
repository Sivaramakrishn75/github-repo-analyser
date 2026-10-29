const SPORTS=[
{id:'ath',name:'Athletics',icon:'🏃',type:'Outdoor',mode:'Solo',cap:60,time:'Sat 7:00 AM',venue:'Running Track',c:'#19a974'},
{id:'bad',name:'Badminton',icon:'🏸',type:'Indoor',mode:'Solo',cap:32,time:'Sat 10:00 AM',venue:'Indoor Hall',c:'#e6399b'},
{id:'tt',name:'Table Tennis',icon:'🏓',type:'Indoor',mode:'Solo',cap:24,time:'Sat 10:00 AM',venue:'Indoor Hall',c:'#7a3cff'},
{id:'bas',name:'Basketball',icon:'🏀',type:'Outdoor',mode:'Team',cap:30,time:'Sat 4:00 PM',venue:'Court 1',c:'#ff7a1a'},
{id:'cri',name:'Cricket',icon:'🏏',type:'Outdoor',mode:'Team',cap:44,time:'Sat 5:00 PM',venue:'Main Ground',c:'#0fa3b1'},
{id:'kab',name:'Kabaddi',icon:'🤼',type:'Outdoor',mode:'Team',cap:36,time:'Sun 7:00 AM',venue:'Mud Court',c:'#d1495b'},
{id:'che',name:'Chess',icon:'♟️',type:'Indoor',mode:'Solo',cap:40,time:'Sun 11:00 AM',venue:'Common Room',c:'#3d405b'},
{id:'car',name:'Carrom',icon:'🎯',type:'Indoor',mode:'Solo',cap:20,time:'Sun 2:00 PM',venue:'Common Room',c:'#c9a100'},
{id:'vol',name:'Volleyball',icon:'🏐',type:'Outdoor',mode:'Team',cap:30,time:'Sun 4:00 PM',venue:'Court 2',c:'#2b59ff'},
{id:'foo',name:'Football',icon:'⚽',type:'Outdoor',mode:'Team',cap:40,time:'Sun 5:00 PM',venue:'Football Field',c:'#16a34a'}];
const BLOCKS=['Block A','Block B','Block C','Block D','Block E','Block F'];
const DEADLINE=new Date('2026-11-20T23:59:00'),MAXS=3,PIN='1234';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const regs=()=>JSON.parse(localStorage.getItem('hg_regs')||'[]');
const save=r=>localStorage.setItem('hg_regs',JSON.stringify(r));
const sp=id=>SPORTS.find(s=>s.id===id);
const taken=id=>regs().filter(r=>r.sport===id&&r.status==='Confirmed').length;
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400)}
function cancelReg(id){let r=regs(),x=r.find(a=>a.id===id);if(!x)return;r=r.filter(a=>a.id!==id);
 if(x.status==='Confirmed'){const w=r.find(a=>a.sport===x.sport&&a.status==='Waitlist');if(w)w.status='Confirmed'}
 save(r)}

/* ---------- Register page ---------- */
function home(){
 let filter='All';
 const F=['All','Indoor','Outdoor','Team','Solo'];
 $('#chips').innerHTML=F.map(f=>`<button class="chip${f==='All'?' on':''}">${f}</button>`).join('');
 $('#chips').onclick=e=>{if(!e.target.matches('.chip'))return;filter=e.target.textContent;$$('#chips .chip').forEach(c=>c.classList.toggle('on',c===e.target));grid()};
 function grid(){
  $('#grid').innerHTML=SPORTS.filter(s=>filter==='All'||s.type===filter||s.mode===filter).map(s=>{
   const left=s.cap-taken(s.id);
   return `<div class="card" style="--c:${s.c}"><div class="ic">${s.icon}</div><h3>${s.name}</h3>
   <div><span class="tag">${s.type}</span><span class="tag">${s.mode}</span></div>
   <div class="meta">🕒 ${s.time}<br>📍 ${s.venue}</div>
   <div class="bar"><i style="width:${(s.cap-left)/s.cap*100}%"></i></div>
   <div class="meta">${left>0?left+' spots left':'Full – waitlist open'}</div>
   <button class="btn" data-id="${s.id}">${left>0?'Register':'Join waitlist'}</button></div>`}).join('')}
 $('#grid').onclick=e=>{const b=e.target.closest('button[data-id]');if(b)form(b.dataset.id)};
 function form(id){
  const s=sp(id),last=localStorage.getItem('hg_last')||'';
  $('#dbody').innerHTML=`<h2>${s.icon} ${s.name}</h2><p class="meta">${s.time} · ${s.venue}</p>
  <form id="f" novalidate>
  <label for="n">Full name</label><input id="n" required>
  <div class="row"><div><label for="r">Roll number</label><input id="r" value="${esc(last)}" required></div>
  <div><label for="p">Phone (10 digits)</label><input id="p" inputmode="numeric" maxlength="10" required></div></div>
  <div class="row"><div><label for="b">Hostel block</label><select id="b">${BLOCKS.map(b=>`<option>${b}</option>`).join('')}</select></div>
  <div><label for="m">Room no.</label><input id="m" required></div></div>
  <div class="row"><div><label for="l">Skill level</label><select id="l"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
  <div><label for="e">Emergency contact</label><input id="e" inputmode="numeric" maxlength="10" placeholder="10 digits" required></div></div>
  ${s.mode==='Team'?'<label for="t">Team name (or "Looking for team")</label><input id="t" required>':''}
  <label class="chk"><input type="checkbox" id="ok"> I am medically fit to play and I will follow the sports rules.</label>
  <div class="err" id="err" role="alert"></div>
  <div class="actions"><button class="btn" type="submit">Register now</button><button class="btn ghost" type="button" id="x">Cancel</button></div></form>`;
  $('#x').onclick=()=>$('#dlg').close();
  $('#f').onsubmit=ev=>{ev.preventDefault();submit(s)};
  $('#dlg').showModal()}
 function submit(s){
  const v=i=>$('#'+i).value.trim(),err=m=>{$('#err').textContent=m};
  const roll=v('r').toUpperCase(),all=regs(),mine=all.filter(a=>a.roll===roll);
  if(!v('n')||!roll||!v('m')||($('#t')&&!v('t')))return err('Please fill in every field.');
  if(!/^\d{10}$/.test(v('p'))||!/^\d{10}$/.test(v('e')))return err('Phone numbers must be exactly 10 digits.');
  if(!$('#ok').checked)return err('Please tick the fitness declaration.');
  if(mine.some(a=>a.sport===s.id))return err('You are already registered for '+s.name+'.');
  if(mine.length>=MAXS)return err('You can join at most '+MAXS+' sports. Cancel one from your dashboard first.');
  const clash=mine.find(a=>sp(a.sport).time===s.time);
  if(clash)return err(sp(clash.sport).name+' is at the same time ('+s.time+'). Pick a different sport.');
  const status=taken(s.id)<s.cap?'Confirmed':'Waitlist',id='HG'+Math.random().toString(36).slice(2,7).toUpperCase();
  all.push({id,sport:s.id,name:v('n'),roll,phone:v('p'),block:v('b'),room:v('m'),level:v('l'),emergency:v('e'),team:$('#t')?v('t'):'',status,date:new Date().toLocaleDateString()});
  save(all);localStorage.setItem('hg_last',roll);
  $('#dbody').innerHTML=`<div class="ticket"><div style="font-size:3rem">${status==='Confirmed'?'🎉':'⏳'}</div>
  <h2>${status==='Confirmed'?'You are in!':'You are on the waitlist'}</h2>
  <p>${s.name} · ${s.time} · ${s.venue}</p><p class="id">${id}</p>
  <p class="meta">${status==='Confirmed'?'Show this ID at the venue.':'We will confirm you if a spot opens up.'}</p>
  <div class="actions" style="justify-content:center"><a class="btn" href="dashboard.html">My dashboard</a><button class="btn ghost" id="x">Close</button></div></div>`;
  $('#x').onclick=()=>{$('#dlg').close();grid()};grid()}
 grid();
 function tick(){let d=Math.max(0,DEADLINE-new Date()),u=[['Days',864e5],['Hrs',36e5],['Min',6e4]];
  $('#count').innerHTML=u.map(([n,k])=>{const x=Math.floor(d/k);d-=x*k;return `<div><b>${x}</b><small>${n}</small></div>`}).join('')}
 tick();setInterval(tick,30000)}

/* ---------- Dashboard page ---------- */
function dash(){
 $('#tabs').onclick=e=>{const t=e.target.dataset.t;if(!t)return;
  $$('#tabs .chip').forEach(c=>c.classList.toggle('on',c===e.target));
  $$('.panel').forEach(p=>p.classList.toggle('on',p.id===t));draw()};
 function mine(){
  const roll=$('#roll').value.trim().toUpperCase(),L=$('#mylist');
  if(!roll){L.innerHTML='<p class="empty">Enter your roll number to see your sports.</p>';return}
  localStorage.setItem('hg_last',roll);
  const r=regs().filter(a=>a.roll===roll);
  L.innerHTML=r.length?r.map(a=>{const s=sp(a.sport);return `<div class="pass" style="--c:${s.c}" id="p${a.id}">
   <div><h3>${s.icon} ${s.name} <span class="st ${a.status==='Waitlist'?'w':''}">${a.status}</span></h3>
   <div class="meta">${esc(a.name)} · ${esc(a.block)}, Room ${esc(a.room)} · ${esc(a.level)}${a.team?' · Team: '+esc(a.team):''}<br>🕒 ${s.time} · 📍 ${s.venue} · ID <b>${a.id}</b></div></div>
   <div class="actions"><button class="btn sm" data-print="${a.id}">Print pass</button><button class="btn sm alt" data-cancel="${a.id}">Cancel</button></div></div>`}).join('')
  :'<p class="empty">No registrations for this roll number yet. <a href="index.html">Pick a sport</a></p>'}
 $('#find').onclick=mine;$('#roll').onkeydown=e=>{if(e.key==='Enter')mine()};
 document.addEventListener('click',e=>{
  const c=e.target.dataset.cancel,p=e.target.dataset.print,d=e.target.dataset.del;
  if(c&&confirm('Cancel this registration?')){cancelReg(c);toast('Registration cancelled');mine()}
  if(p){const el=$('#p'+p);el.classList.add('printing');print();el.classList.remove('printing')}
  if(d&&confirm('Remove this entry?')){cancelReg(d);admin()}});
 function sched(){
  $('#stable').innerHTML='<tr><th>Sport</th><th>When</th><th>Where</th><th>Type</th><th>Spots left</th></tr>'+
  SPORTS.map(s=>`<tr><td>${s.icon} ${s.name}</td><td>${s.time}</td><td>${s.venue}</td><td>${s.type}, ${s.mode}</td><td>${Math.max(0,s.cap-taken(s.id))}/${s.cap}</td></tr>`).join('')}
 function cup(){
  const r=regs().filter(a=>a.status==='Confirmed'),pts=BLOCKS.map(b=>[b,r.filter(a=>a.block===b).length*10]).sort((a,b)=>b[1]-a[1]),max=Math.max(10,pts[0][1]);
  $('#lb').innerHTML=pts.map(([b,p],i)=>`<div class="lb"><b>${['🥇','🥈','🥉'][i]||i+1}</b><span style="width:80px">${b}</span><div class="bar"><i style="width:${p/max*100}%"></i></div><b>${p}</b></div>`).join('')}
 function admin(){
  const r=regs(),A=$('#adm');
  if(!A.dataset.open){A.innerHTML='<p class="empty">Enter the PIN to view all registrations. Demo PIN: 1234</p>';return}
  A.innerHTML=`<div class="stats"><div><b>${r.length}</b>Total</div><div><b>${r.filter(a=>a.status==='Confirmed').length}</b>Confirmed</div><div><b>${r.filter(a=>a.status==='Waitlist').length}</b>Waitlist</div></div>
  <div class="actions" style="margin-bottom:12px"><button class="btn sm" id="csv">Download CSV</button></div>
  <div class="scroll"><table><tr><th>ID</th><th>Name</th><th>Roll</th><th>Block/Room</th><th>Phone</th><th>Sport</th><th>Status</th><th></th></tr>
  ${r.map(a=>`<tr><td>${a.id}</td><td>${esc(a.name)}</td><td>${esc(a.roll)}</td><td>${esc(a.block)}/${esc(a.room)}</td><td>${a.phone}</td><td>${sp(a.sport).name}</td><td>${a.status}</td><td><button class="btn sm alt" data-del="${a.id}">Remove</button></td></tr>`).join('')||'<tr><td colspan="8" class="empty">No registrations yet</td></tr>'}</table></div>`;
  const b=$('#csv');if(b)b.onclick=()=>{const q=x=>'"'+String(x).replace(/"/g,'""')+'"';
   const csv=['ID,Name,Roll,Block,Room,Phone,Emergency,Sport,Level,Team,Status,Date'].concat(r.map(a=>[a.id,a.name,a.roll,a.block,a.room,a.phone,a.emergency,sp(a.sport).name,a.level,a.team,a.status,a.date].map(q).join(','))).join('\n');
   const l=document.createElement('a');l.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));l.download='hostel-games-registrations.csv';l.click()}}
 $('#unlock').onclick=()=>{if($('#pin').value===PIN){$('#adm').dataset.open=1;admin()}else toast('Wrong PIN')};
 function draw(){mine();sched();cup();admin()}
 $('#roll').value=localStorage.getItem('hg_last')||'';draw()}
document.body.dataset.page==='home'?home():dash();
