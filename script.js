// ═══════════════════════════════════════════════════════════════════
// Tao Liu — Personal Portfolio v2
// Particles · Bubbles · 3D Tilt · Cursor Glow
// ═══════════════════════════════════════════════════════════════════

// ── DOM refs ──
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.getElementById('theme-toggle');
const scrollProgress = document.getElementById('scroll-progress');
const cursorGlow = document.getElementById('cursor-glow');
const particleCanvas = document.getElementById('particle-canvas');

// ═══════════════════════════════════════════════════════════════════
// THEME
// ═══════════════════════════════════════════════════════════════════
function getTheme(){ return localStorage.getItem('theme') || 'dark' }
function setTheme(t){
  document.documentElement.setAttribute('data-theme',t);
  localStorage.setItem('theme',t);
  if(themeToggle){
    const i=themeToggle.querySelector('i');
    if(t==='light'){ i.className='fas fa-sun'; themeToggle.setAttribute('aria-label','Switch to dark mode') }
    else{ i.className='fas fa-moon'; themeToggle.setAttribute('aria-label','Switch to light mode') }
  }
}
setTheme(getTheme());
if(themeToggle) themeToggle.addEventListener('click',()=>{
  setTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark')
});

// ═══════════════════════════════════════════════════════════════════
// MOBILE NAV
// ═══════════════════════════════════════════════════════════════════
navToggle.addEventListener('click',()=>{navMenu.classList.toggle('active');navToggle.classList.toggle('active')});
navLinks.forEach(l=>l.addEventListener('click',()=>{navMenu.classList.remove('active');navToggle.classList.remove('active')}));
navLinks.forEach(l=>l.addEventListener('click',e=>{
  const h=l.getAttribute('href');if(!h||h.startsWith('http'))return;
  e.preventDefault();const t=document.querySelector(h);
  if(t)window.scrollTo({top:t.offsetTop-70,behavior:'smooth'})
}));

// ═══════════════════════════════════════════════════════════════════
// SCROLL: navbar + active link + progress bar
// ═══════════════════════════════════════════════════════════════════
function updateScroll(){
  const y=window.scrollY;
  // navbar shrink
  if(y>60) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
  // active nav
  const sp=y+120;
  navLinks.forEach(l=>{
    const h=l.getAttribute('href');if(!h||h.startsWith('http'))return;
    const s=document.querySelector(h);
    if(s&&sp>=s.offsetTop&&sp<s.offsetTop+s.offsetHeight){navLinks.forEach(x=>x.classList.remove('active'));l.classList.add('active')}
  });
  // progress bar
  if(scrollProgress){
    const docH=document.documentElement.scrollHeight-window.innerHeight;
    scrollProgress.style.width=docH>0?(y/docH)*100+'%':'0%';
  }
  // back-to-top
  if(backToTopBtn) backToTopBtn.classList.toggle('visible',y>400);
}

// ═══════════════════════════════════════════════════════════════════
// SCROLL ANIMATIONS
// ═══════════════════════════════════════════════════════════════════
const scrollObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('animate')})
},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});

function initScrollAnimations(){
  document.querySelectorAll('.scroll-animate,.award-item,.publication-article').forEach((el,i)=>{
    if(!el.classList.contains('scroll-animate'))el.classList.add('scroll-animate');
    el.style.transitionDelay=`${(i%2)*60}ms`;
    scrollObserver.observe(el);
  });
}

// ═══════════════════════════════════════════════════════════════════
// TYPEWRITER
// ═══════════════════════════════════════════════════════════════════
function typeWriter(el,text,speed=100){
  let i=0;el.innerHTML='';
  function t(){if(i<text.length){el.innerHTML+=text.charAt(i);i++;setTimeout(t,speed)}}
  t();
}

// ═══════════════════════════════════════════════════════════════════
// BACK TO TOP
// ═══════════════════════════════════════════════════════════════════
let backToTopBtn;
function createBackToTop(){
  const b=document.createElement('button');
  b.innerHTML='<i class="fas fa-arrow-up"></i>';b.classList.add('back-to-top');
  b.setAttribute('aria-label','Back to top');document.body.appendChild(b);
  b.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  return b;
}

// ═══════════════════════════════════════════════════════════════════
// COPY EMAIL + TOAST
// ═══════════════════════════════════════════════════════════════════
function copyEmail(){
  navigator.clipboard.writeText('brainytao@gmail.com').then(()=>showToast('📋 Email copied!'));
}
function showToast(msg,dur=3000){
  const t=document.createElement('div');t.textContent=msg;
  t.style.cssText=`position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:var(--accent);color:#fff;padding:12px 24px;border-radius:var(--radius-full);z-index:9999;font-family:var(--font-sans);font-size:0.88rem;font-weight:500;opacity:0;transition:opacity 0.3s;box-shadow:0 4px 24px var(--accent-glow);pointer-events:none`;
  document.body.appendChild(t);
  requestAnimationFrame(()=>{t.style.opacity='1'});
  setTimeout(()=>{t.style.opacity='0';setTimeout(()=>{if(t.parentNode)document.body.removeChild(t)},300)},dur);
}

// ═══════════════════════════════════════════════════════════════════
// DINO EASTER EGG
// ═══════════════════════════════════════════════════════════════════
function initDino(){
  const d=document.getElementById('footer-dino');if(!d)return;
  let c=0;
  d.addEventListener('click',()=>{
    c++;createSparkles(d);
    if(c>=5){showToast('🦖 Rawr! You found the easter egg!',4000);c=0}
  });
}
function createSparkles(el){
  const r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
  const colors=['#7c6ff7','#00cec9','#fd79a8','#ffd700','#fff'];
  for(let i=0;i<12;i++){
    const s=document.createElement('div'),angle=Math.PI*2*i/12,dist=30+Math.random()*20;
    s.style.cssText=`position:fixed;left:${cx}px;top:${cy}px;width:6px;height:6px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:50%;pointer-events:none;z-index:9999;opacity:1;transition:all 0.6s cubic-bezier(0.4,0,0.2,1)`;
    document.body.appendChild(s);
    requestAnimationFrame(()=>{s.style.transform=`translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px) scale(0)`;s.style.opacity='0'});
    setTimeout(()=>{if(s.parentNode)document.body.removeChild(s)},650);
  }
}

// ═══════════════════════════════════════════════════════════════════
// CURSOR GLOW
// ═══════════════════════════════════════════════════════════════════
function initCursorGlow(){
  if(!cursorGlow)return;
  let visible=false;
  document.addEventListener('mousemove',e=>{
    cursorGlow.style.left=e.clientX+'px';cursorGlow.style.top=e.clientY+'px';
    if(!visible){cursorGlow.classList.add('visible');visible=true}
  });
  document.addEventListener('mouseleave',()=>{cursorGlow.classList.remove('visible');visible=false});
}

// ═══════════════════════════════════════════════════════════════════
// 3D TILT ON CARDS
// ═══════════════════════════════════════════════════════════════════
function initTilt(){
  document.querySelectorAll('.publication-article').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const rect=card.getBoundingClientRect();
      const x=e.clientX-rect.left,y=e.clientY-rect.top;
      const cx=rect.width/2,cy=rect.height/2;
      const rx=((y-cy)/cy)*-6,ry=((x-cx)/cx)*6;
      card.style.transform=`perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave',()=>{
      card.style.transform='perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

// ═══════════════════════════════════════════════════════════════════
// BOUNCING BUBBLES (upgraded: slower, softer)
// ═══════════════════════════════════════════════════════════════════
const imageSources=[
  './mark/docs/jpg/index.jpg','./mark/docs/jpg/kaka.jpg','./mark/docs/jpg/tree.png',
  './mark/docs/jpg/thisme.jpg','./mark/docs/jpg/body.png','./mark/docs/jpg/maybe.png',
  './mark/docs/jpg/gray.jpg','./mark/docs/jpg/paintwo.png','./mark/docs/jpg/subway.png',
  './mark/docs/jpg/红鞋.jpg','./mark/docs/jpg/茶杯头.webp','./mark/docs/jpg/sub.jpg',
  './mark/docs/jpg/city.png','./mark/docs/jpg/painone.png','./mark/docs/jpg/杯子.jpg',
  './mark/docs/jpg/ball.jpg','./mark/docs/jpg/lanch.jpg','./mark/docs/jpg/face.jpg',
  './mark/docs/jpg/cha.jpg','./mark/docs/jpg/train.jpg','./mark/docs/jpg/ted.jpg',
];
function initBubbles(){
  const container=document.getElementById('bouncing-balls-container');
  if(!container)return;
  const balls=[];
  imageSources.forEach(src=>{
    const ball=document.createElement('div');ball.className='bouncing-ball';
    ball.style.backgroundImage=`url(${src})`;
    const size=Math.random()*60+50;
    ball.style.width=size+'px';ball.style.height=size+'px';
    const x=Math.random()*(window.innerWidth-size),y=Math.random()*(window.innerHeight-size);
    const vx=(Math.random()-0.5)*2.2,vy=(Math.random()-0.5)*2.2;
    ball.style.transform=`translate(${x}px,${y}px)`;
    container.appendChild(ball);
    balls.push({el:ball,x,y,vx,vy,size});
  });
  function animate(){
    const w=window.innerWidth,h=window.innerHeight;
    balls.forEach(b=>{
      b.x+=b.vx;b.y+=b.vy;
      if(b.x<=0||b.x+b.size>=w)b.vx=-b.vx,b.x=Math.max(0,Math.min(w-b.size,b.x));
      if(b.y<=0||b.y+b.size>=h)b.vy=-b.vy,b.y=Math.max(0,Math.min(h-b.size,b.y));
      b.el.style.transform=`translate(${b.x}px,${b.y}px)`;
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// ═══════════════════════════════════════════════════════════════════
// PARTICLE NETWORK CANVAS
// ═══════════════════════════════════════════════════════════════════
function initParticles(){
  const canvas=particleCanvas;if(!canvas)return;
  const ctx=canvas.getContext('2d');
  let w,h,particles=[],mouse={x:null,y:null,radius:120};
  const PARTICLE_COUNT=80;

  function resize(){w=canvas.width=window.innerWidth;h=canvas.height=window.innerHeight}
  resize();window.addEventListener('resize',resize);

  for(let i=0;i<PARTICLE_COUNT;i++){
    particles.push({
      x:Math.random()*w,y:Math.random()*h,
      vx:(Math.random()-0.5)*0.5,vy:(Math.random()-0.5)*0.5,
      r:Math.random()*1.8+0.8
    });
  }

  document.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY});
  document.addEventListener('mouseleave',()=>{mouse.x=null;mouse.y=null});

  function draw(){
    ctx.clearRect(0,0,w,h);
    particles.forEach((p,i)=>{
      // Move
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>w)p.vx=-p.vx;if(p.y<0||p.y>h)p.vy=-p.vy;
      // Mouse repulsion
      if(mouse.x!==null){
        const dx=mouse.x-p.x,dy=mouse.y-p.y,dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<mouse.radius){
          const force=(mouse.radius-dist)/mouse.radius;
          p.x-=dx*force*0.03;p.y-=dy*force*0.03;
        }
      }
      // Draw particle
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba(124,111,247,0.45)';ctx.fill();
      // Draw connections
      for(let j=i+1;j<PARTICLE_COUNT;j++){
        const q=particles[j];
        const dx=p.x-q.x,dy=p.y-q.y,dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<130){
          ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);
          ctx.strokeStyle=`rgba(124,111,247,${0.08*(1-dist/130)})`;
          ctx.lineWidth=0.5;ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ═══════════════════════════════════════════════════════════════════
// DEBOUNCE
// ═══════════════════════════════════════════════════════════════════
function debounce(fn,ms){let t;return function(...a){clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}}

// ═══════════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded',()=>{
  initScrollAnimations();
  backToTopBtn=createBackToTop();
  initCursorGlow();
  initTilt();
  initBubbles();
  initParticles();
  initDino();

  // Typewriter
  const sub=document.querySelector('.hero-subtitle');
  if(sub){const txt=sub.textContent;setTimeout(()=>typeWriter(sub,txt,50),600)}

  // Email copy
  const em=document.querySelector('a[href^="mailto:"]');
  if(em)em.addEventListener('click',e=>{e.preventDefault();copyEmail()});

  // Scroll listener
  window.addEventListener('scroll',debounce(updateScroll,8),{passive:true});
  updateScroll();
});
