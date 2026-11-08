const $=s=>document.querySelector(s);
let follow=[];try{follow=JSON.parse(localStorage.getItem('rc_follow')||'[]')}catch(e){}
const save=()=>{try{localStorage.setItem('rc_follow',JSON.stringify(follow))}catch(e){}};
const fmt=d=>new Date(d).toLocaleDateString('es-PE',{day:'numeric',month:'long',year:'numeric'});
const empty=t=>`<div class="empty">${t}</div>`;
function ev(it,kind){const on=follow.includes(it.id);
return `<article class="card">${it.img?`<img src="${it.img}" alt="${it.titulo}">`:''}<div class="tag">${it.cat||kind}</div><h3>${it.titulo}</h3><small>${it.fecha?fmt(it.fecha):''}${it.lugar?' · '+it.lugar:''}</small>
<div class="cd ${on?'on':''}" data-t="${it.fecha||''}"><div>0<span>días</span></div><div>0<span>horas</span></div><div>0<span>min</span></div><div>0<span>seg</span></div></div>
<button class="btn f ${on?'on':''}" data-id="${it.id}">${on?'✓ Siguiendo':'+ Seguir'}</button></article>`}
function draw(){
$('#gF').innerHTML=FUT.length?FUT.map(i=>ev(i,'Presentación')).join(''):empty('Pronto anunciaremos nuestras próximas presentaciones.');
$('#gC').innerHTML=CONV.length?CONV.map(i=>ev(i,'Convocatoria')).join(''):empty('Aquí aparecerán las imágenes de nuestras convocatorias.');
}
document.addEventListener('click',e=>{const b=e.target.closest('.btn.f');if(!b)return;const id=b.dataset.id;
follow=follow.includes(id)?follow.filter(x=>x!==id):[...follow,id];save();draw();tick()});
function tick(){document.querySelectorAll('.cd.on').forEach(c=>{const t=new Date(c.dataset.t)-Date.now();
const v=t>0?[Math.floor(t/864e5),Math.floor(t/36e5)%24,Math.floor(t/6e4)%60,Math.floor(t/1e3)%60]:null;
if(!v){c.innerHTML='<div style="flex:1">¡Es hoy o ya pasó!</div>';return}
[...c.children].forEach((d,i)=>d.firstChild.nodeValue=v[i])})}
setInterval(tick,1000);
// Trayectoria con pestañas y filtro
const TIPOS=['Presentaciones','Concursos','Premios ganados','Reconocimientos'];
const INFO={'Presentaciones':['💃','Aquí están nuestras presentaciones','Cada escenario donde llevamos nuestras raíces.'],'Concursos':['🏆','Aquí están nuestros concursos','Los concursos en los que hemos participado.'],'Premios ganados':['🥇','Aquí están nuestros premios','Los triunfos que celebramos como familia.'],'Reconocimientos':['🎖️','Aquí están nuestros reconocimientos','Las distinciones que nos han otorgado.']};
let tipo=TIPOS[0];const CAT={};TIPOS.forEach(t=>CAT[t]='Todos');
function tray(){
$('#tabs').innerHTML=TIPOS.map(t=>`<button class="tb ${t===tipo?'on':''}" data-tp="${t}"><i>${INFO[t][0]}</i><b>${t}</b><small>${TRAY.filter(x=>x.tipo===t).length} publicados</small></button>`).join('');
$('#panel').innerHTML=`<h3>${INFO[tipo][1]}</h3><p>${INFO[tipo][2]} Filtra por categoría:</p><div class="chips">${['Todos',...CATS].map(c=>`<button class="chip ${c===CAT[tipo]?'on':''}" data-ct="${c}">${c}</button>`).join('')}</div><div class="grid" id="gT"></div>`;
const cat=CAT[tipo];const L=TRAY.filter(i=>i.tipo===tipo&&(cat==='Todos'||i.cat===cat));
$('#gT').innerHTML=L.length?L.map(i=>`<article class="card">${i.img?`<img src="${i.img}" alt="${i.titulo}">`:''}<div class="tag">${i.cat}</div><h3>${i.titulo}</h3><small>${i.fecha?fmt(i.fecha):''}${i.lugar?' · '+i.lugar:''}</small></article>`).join(''):empty('Aquí compartiremos nuestras '+tipo.toLowerCase()+(cat!=='Todos'?' de '+cat:'')+'.');}
$('#trayectoria').addEventListener('click',e=>{const a=e.target.closest('[data-tp]'),b=e.target.closest('[data-ct]');if(a)tipo=a.dataset.tp;if(b)CAT[tipo]=b.dataset.ct;if(a||b)tray()});
// Calendario de ensayos
const D=['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'],ON=[0,2,4];
$('#cal').innerHTML=D.map((d,i)=>`<div class="day ${ON.includes(i)?'on':''}"><b>${d}</b>${ON.includes(i)?'<span>7:30 – 9:30</span>':''}</div>`).join('');
// Cumpleaños
function cump(){const y=new Date().getFullYear(),n=new Date(new Date().toDateString());
const L=CUMP.map(c=>{let d=new Date(y+'-'+c.d+'T00:00');if(d<n)d=new Date((y+1)+'-'+c.d+'T00:00');return{...c,dt:d}}).sort((a,b)=>a.dt-b.dt);
$('#gB').innerHTML=L.length?L.map(c=>`<article class="card"><div class="tag">🎂 Cumpleaños</div><h3>${c.n}</h3><small>${c.dt.toLocaleDateString('es-PE',{day:'numeric',month:'long'})}</small></article>`).join(''):empty('Pronto verás aquí los cumpleaños de nuestros fraternos.');}
draw();tray();cump();tick();
// Animación al hacer scroll
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12});
document.querySelectorAll('.rv').forEach(e=>io.observe(e));
addEventListener('scroll',()=>{const s=document.querySelector('.sun');if(s)s.style.top=(-120+scrollY*.25)+'px'},{passive:true});
