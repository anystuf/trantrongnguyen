const menuButton = document.getElementById('menuButton');
const navLinks = document.getElementById('navLinks');
function closeMenu(){navLinks.classList.remove('open');menuButton.setAttribute('aria-expanded','false');}
menuButton.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));});
navLinks.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&navLinks.classList.contains('open')){closeMenu();menuButton.focus();}});
document.addEventListener('click',event=>{if(!event.target.closest('.nav'))closeMenu();});
const cards=[...document.querySelectorAll('.project-card')];
const filters=[...document.querySelectorAll('.filter-tab')];
function filterProjects(filter){filters.forEach(button=>{const active=button.dataset.filter===filter;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});cards.forEach(card=>card.hidden=filter!=='all'&&card.dataset.category!==filter);document.getElementById('projectCount').textContent=`${cards.filter(card=>!card.hidden).length} projects · Explore the work below`;}
filters.forEach(button=>button.addEventListener('click',()=>filterProjects(button.dataset.filter)));
filterProjects('all');
const preference=matchMedia('(prefers-reduced-motion: reduce)');
const motionButton=document.getElementById('motionToggle');
let motion=!preference.matches;
try{const saved=localStorage.getItem('portfolio-motion');if(saved!==null)motion=saved==='on'&&!preference.matches;}catch{}
function updateMotion(){document.documentElement.dataset.motion=motion?'on':'off';motionButton.textContent=`Motion: ${motion?'on':'off'}`;motionButton.setAttribute('aria-pressed',String(motion));}
updateMotion();motionButton.addEventListener('click',()=>{motion=!motion;updateMotion();try{localStorage.setItem('portfolio-motion',motion?'on':'off');}catch{}});
preference.addEventListener('change',event=>{if(event.matches){motion=false;updateMotion();}});
const portrait=document.querySelector('.portrait-card');
portrait.addEventListener('pointermove',event=>{if(!motion||event.pointerType!=='mouse')return;const rect=portrait.getBoundingClientRect();portrait.style.setProperty('--tilt',`${((event.clientX-rect.left)/rect.width-.5)*8}deg`);});
portrait.addEventListener('pointerleave',()=>portrait.style.setProperty('--tilt','0deg'));
let audioContext;
document.querySelectorAll('.guitar-string').forEach(button=>button.addEventListener('click',async()=>{
  const status=document.getElementById('soundStatus');
  try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw new Error('unsupported');audioContext??=new Audio();await audioContext.resume();const t=audioContext.currentTime;const gain=audioContext.createGain();gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.12,t+.012);gain.gain.exponentialRampToValueAtTime(.001,t+1.5);gain.connect(audioContext.destination);const oscillator=audioContext.createOscillator();oscillator.type='triangle';oscillator.frequency.value=Number(button.dataset.frequency);oscillator.connect(gain);oscillator.start(t);oscillator.stop(t+1.5);oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};status.textContent=`Playing ${button.dataset.note} · synthesized string`;button.classList.add('plucked');setTimeout(()=>button.classList.remove('plucked'),250);}catch{status.textContent='Audio is unavailable in this browser. Try another browser to play the strings.';}
}));
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;navLinks.querySelectorAll('a').forEach(link=>{if(link.hash===`#${entry.target.id}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});});},{rootMargin:'-15% 0px -60% 0px'});document.querySelectorAll('main section[id]').forEach(section=>observer.observe(section));}

const demoDialog=document.getElementById('demoDialog');
const demoPlayer=document.getElementById('demoPlayer');
let demoOpener;
document.querySelectorAll('.demo-launch').forEach(link=>link.addEventListener('click',event=>{
  const demo=window.portfolioDemos?.find(item=>item.id===link.dataset.demo);
  if(!demo||typeof demoDialog?.showModal!=='function')return;
  event.preventDefault();
  document.querySelectorAll('video').forEach(video=>video.pause());
  demoOpener=link;
  document.getElementById('demoTitle').textContent=demo.title;
  document.getElementById('demoDescription').textContent=demo.note;
  document.getElementById('demoError').hidden=true;
  document.getElementById('demoDirect').href=demo.src;
  demoPlayer.poster=demo.poster;
  demoPlayer.src=demo.src;
  demoPlayer.setAttribute('aria-label',demo.title);
  demoDialog.showModal();
  document.body.classList.add('screening-open');
  document.getElementById('closeDemo').focus();
  demoPlayer.play().catch(()=>{});
}));
document.getElementById('closeDemo')?.addEventListener('click',()=>demoDialog.close());
demoDialog?.addEventListener('click',event=>{if(event.target!==demoDialog)return;const box=demoDialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)demoDialog.close();});
demoDialog?.addEventListener('close',()=>{demoPlayer.pause();demoPlayer.removeAttribute('src');demoPlayer.load();document.body.classList.remove('screening-open');demoOpener?.focus();});
demoPlayer?.addEventListener('error',()=>{if(demoPlayer.hasAttribute('src'))document.getElementById('demoError').hidden=false;});
