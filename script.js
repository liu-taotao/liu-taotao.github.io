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
// MOBILE NAV (legacy article page only)
// ═══════════════════════════════════════════════════════════════════
if(navToggle&&navMenu){
  navToggle.addEventListener('click',()=>{navMenu.classList.toggle('active');navToggle.classList.toggle('active')});
  navLinks.forEach(l=>l.addEventListener('click',()=>{navMenu.classList.remove('active');navToggle.classList.remove('active')}));
  navLinks.forEach(l=>l.addEventListener('click',e=>{
    const h=l.getAttribute('href');if(!h||h.startsWith('http'))return;
    e.preventDefault();const t=document.querySelector(h);
    if(t)window.scrollTo({top:t.offsetTop-70,behavior:'smooth'})
  }));
}

// ═══════════════════════════════════════════════════════════════════
// SCROLL: navbar + active link + progress bar
// ═══════════════════════════════════════════════════════════════════
function updateScroll(){
  const y=window.scrollY;
  // navbar shrink
  if(navbar){if(y>60) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');}
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
// FIREWORK SYSTEM — Full-screen celebration
// ═══════════════════════════════════════════════════════════════════
let fwCanvas,fwCtx,fwRockets=[],fwParticles=[],fwSparkles=[],fwRAF=null,fwRunning=false,fwFadeTimer=null,fwEarthTimer=null;
const FW_COLORS=[
  '#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff922b',
  '#e599f7','#ff8787','#74c0fc','#f06595','#ffe066',
  '#20c997','#cc5de8','#ffa94d','#69db7c','#f783ac',
  '#fab005','#748ffc','#38d9a9','#ff6b9d','#a9e34b'
];
function initFireworkCanvas(){
  fwCanvas=document.createElement('canvas');fwCanvas.id='firework-canvas';
  document.body.appendChild(fwCanvas);
  fwCtx=fwCanvas.getContext('2d');
  function resize(){fwCanvas.width=window.innerWidth;fwCanvas.height=window.innerHeight}
  resize();window.addEventListener('resize',resize);
}
function launchFireworks(){
  if(fwRunning)return;
  if(earthActive)dismissEarth();
  clearTimeout(fwEarthTimer);
  fwRunning=true;fwRockets=[];fwParticles=[];fwSparkles=[];
  clearTimeout(fwFadeTimer);
  fwCanvas.classList.remove('fade-out');fwCanvas.classList.add('active');
  // Staggered launch: 10 rockets over 1.5s, then a second wave
  for(let i=0;i<10;i++){
    setTimeout(()=>{if(fwRunning)spawnRocket()},i*150);
  }
  setTimeout(()=>{
    for(let i=0;i<6;i++){
      setTimeout(()=>{if(fwRunning)spawnRocket()},i*180);
    }
  },1600);
  // Auto-stop after enough time for all particles to fade
  fwFadeTimer=setTimeout(()=>{startFadeOut()},5500);
  if(!fwRAF)fwRAF=requestAnimationFrame(animateFireworks);
}
function spawnRocket(){
  const x=Math.random()*fwCanvas.width*0.8+fwCanvas.width*0.1;
  const y=fwCanvas.height;
  const targetY=Math.random()*fwCanvas.height*0.35+fwCanvas.height*0.05;
  fwRockets.push({
    x,y,targetY,vy:-(Math.random()*5+9),
    color:FW_COLORS[Math.floor(Math.random()*FW_COLORS.length)],
    trail:[],trailTimer:0
  });
}
function explodeRocket(r){
  const count=130+Math.floor(Math.random()*50);
  for(let i=0;i<count;i++){
    const angle=Math.PI*2*i/count+(Math.random()-0.5)*0.3;
    const speed=Math.random()*7+2.5;
    const color=FW_COLORS[Math.floor(Math.random()*FW_COLORS.length)];
    fwParticles.push({
      x:r.x,y:r.y,
      vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,
      color,alpha:1,size:Math.random()*3+1.2,
      gravity:0.03+Math.random()*0.04,
      decay:0.006+Math.random()*0.014
    });
  }
  // Secondary sparkle ring
  for(let i=0;i<40;i++){
    const angle=Math.random()*Math.PI*2;
    const speed=Math.random()*3+1;
    fwSparkles.push({
      x:r.x,y:r.y,
      vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,
      color:r.color,alpha:1,size:Math.random()*1.8+0.6,
      gravity:0.015,decay:0.012+Math.random()*0.02,blink:0
    });
  }
}
function animateFireworks(){
  if(!fwRunning&&fwRockets.length===0&&fwParticles.length===0&&fwSparkles.length===0){
    fwRAF=null;return;
  }
  fwCtx.clearRect(0,0,fwCanvas.width,fwCanvas.height);
  // ── Rockets ──
  for(let i=fwRockets.length-1;i>=0;i--){
    const r=fwRockets[i];r.y+=r.vy;r.trailTimer++;
    if(r.trailTimer%2===0)r.trail.push({x:r.x,y:r.y,alpha:0.9});
    if(r.trail.length>18)r.trail.shift();
    // Draw trail
    for(let j=0;j<r.trail.length;j++){
      const t=r.trail[j],a=t.alpha*(j/r.trail.length);
      fwCtx.beginPath();fwCtx.arc(t.x,t.y,1.6,0,Math.PI*2);
      fwCtx.fillStyle=`rgba(255,255,220,${a*0.7})`;fwCtx.fill();
      t.alpha-=0.04;
    }
    // Rocket head glow
    fwCtx.beginPath();fwCtx.arc(r.x,r.y,2.8,0,Math.PI*2);
    fwCtx.fillStyle=r.color;
    fwCtx.shadowColor=r.color;fwCtx.shadowBlur=14;fwCtx.fill();
    fwCtx.shadowBlur=0;
    if(r.y<=r.targetY){explodeRocket(r);fwRockets.splice(i,1)}
    else if(r.y>fwCanvas.height+60)fwRockets.splice(i,1);
  }
  // ── Particles ──
  for(let i=fwParticles.length-1;i>=0;i--){
    const p=fwParticles[i];
    p.x+=p.vx;p.y+=p.vy;p.vy+=p.gravity;p.alpha-=p.decay;p.size*=0.998;
    if(p.alpha<=0||p.y>fwCanvas.height+40){fwParticles.splice(i,1);continue}
    fwCtx.beginPath();fwCtx.arc(p.x,p.y,p.size,0,Math.PI*2);
    fwCtx.fillStyle=p.color;
    fwCtx.globalAlpha=p.alpha;
    fwCtx.shadowColor=p.color;fwCtx.shadowBlur=5;fwCtx.fill();
  }
  fwCtx.globalAlpha=1;fwCtx.shadowBlur=0;
  // ── Sparkles (twinkling) ──
  for(let i=fwSparkles.length-1;i>=0;i--){
    const s=fwSparkles[i];
    s.x+=s.vx;s.y+=s.vy;s.vy+=s.gravity;s.alpha-=s.decay;s.blink+=0.15;
    if(s.alpha<=0){fwSparkles.splice(i,1);continue}
    const blinkAlpha=s.alpha*(0.5+0.5*Math.abs(Math.sin(s.blink)));
    fwCtx.beginPath();fwCtx.arc(s.x,s.y,s.size,0,Math.PI*2);
    fwCtx.fillStyle=s.color;
    fwCtx.globalAlpha=blinkAlpha;
    fwCtx.shadowColor=s.color;fwCtx.shadowBlur=8;fwCtx.fill();
  }
  fwCtx.globalAlpha=1;fwCtx.shadowBlur=0;
  fwRAF=requestAnimationFrame(animateFireworks);
}
function startFadeOut(){
  fwRunning=false;
  fwCanvas.classList.add('fade-out');
  fwCanvas.classList.remove('active');
  // Show 3D Earth after fireworks fully fade (1.5s CSS transition + buffer)
  fwEarthTimer=setTimeout(()=>{showEarth()},1800);
}

// ═══════════════════════════════════════════════════════════════════
// POST-FIREWORKS SCENE — Futuristic globe · Airplane · Flowing cape
// ═══════════════════════════════════════════════════════════════════
let earthActive=false,earthOverlay=null,earthRenderer=null,earthScene=null;
let earthCamera=null,globeGroup=null,columnMesh=null,coreGlow=null,orbitParticles=null;
let airplaneGroup=null,airplanePropeller=null,ribbonGroup=null,ribbonMesh=null,ribbonGeo=null;
let earthRAF=null,earthAutoTimer=null,earthStartTime=0;
let orbitAngle=0,shatterTriggered=false,lastSatPos=null;
let meteorStartTime=0,meteorFragments=[],meteorTrails=null,meteorGlowLight=null;
let sparkParticles=null,shockwaveRing=null,beamGroup=null,flashLight=null,meteorPhase=0;
const ORBIT_RADIUS=2.5,ORBIT_TILT=0.5,ORBIT_SPEED=1.3;

function showEarth(){
  if(earthActive||(typeof THREE==='undefined'))return;
  earthActive=true;earthStartTime=performance.now();
  // Reset orbit & meteor state
  orbitAngle=0;shatterTriggered=false;lastSatPos=null;meteorStartTime=0;
  meteorFragments=[];meteorTrails=null;meteorGlowLight=null;
  sparkParticles=null;shockwaveRing=null;beamGroup=null;flashLight=null;meteorPhase=0;
  earthOverlay=document.createElement('div');earthOverlay.className='earth-overlay';
  earthOverlay.innerHTML=`<div class="earth-container"><canvas class="earth-canvas" id="earth-canvas"></canvas></div>`;
  document.body.appendChild(earthOverlay);
  requestAnimationFrame(()=>{
    earthOverlay.classList.add('active');
    initEarthScene();
    earthAutoTimer=setTimeout(()=>{dismissEarth()},10000);
  });
}

// ── Ribbon cape texture (bold, clear name) ──
function buildRibbonTexture(){
  const c=document.createElement('canvas');c.width=1024;c.height=180;
  const ctx=c.getContext('2d');
  // Bright fabric background for contrast
  ctx.fillStyle='#fffef9';
  ctx.fillRect(0,0,1024,180);
  // Fabric weave lines
  ctx.strokeStyle='rgba(180,160,120,0.18)';
  for(let i=0;i<1024;i+=5){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,180);ctx.stroke()}
  // Outer border
  ctx.strokeStyle='#b8956a';ctx.lineWidth=4;
  ctx.strokeRect(8,8,1008,164);
  // Inner decorative border
  ctx.strokeStyle='#d4c3a8';ctx.lineWidth=2;
  ctx.strokeRect(16,16,992,148);
  // Corner accents
  ctx.fillStyle='#b8956a';
  [20,980].forEach(cx=>{[20,140].forEach(cy=>{ctx.beginPath();ctx.arc(cx+4,cy+4,6,0,Math.PI*2);ctx.fill()})});
  // Name text — LARGE & BOLD
  ctx.fillStyle='#1a1008';
  ctx.font='900 52px "Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif';
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText('TAO  LIU',512,70);
  ctx.font='900 44px "Microsoft YaHei","PingFang SC","Noto Sans SC","SimHei",sans-serif';
  ctx.fillText('刘  涛',512,138);
  return new THREE.CanvasTexture(c);
}

// ── Airplane ──
function buildAirplane(){
  const g=new THREE.Group();
  const mw=new THREE.MeshStandardMaterial({color:0xfafaf5,roughness:0.2,metalness:0.05});
  const mr=new THREE.MeshStandardMaterial({color:0xe8453c,roughness:0.2,metalness:0.1});
  const mb=new THREE.MeshStandardMaterial({color:0x2563eb,roughness:0.2,metalness:0.1});
  const mg=new THREE.MeshStandardMaterial({color:0xbcccd8,roughness:0.1,metalness:0.7});
  // Fuselage
  const body=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.12,0.7,12,4),mw);body.rotation.x=Math.PI/2;g.add(body);
  // Nose
  const nose=new THREE.Mesh(new THREE.SphereGeometry(0.12,10,6,0,Math.PI*2,0,Math.PI/2),mr);nose.rotation.x=-Math.PI/2;nose.position.z=0.35;g.add(nose);
  // Wings
  const wings=new THREE.Mesh(new THREE.BoxGeometry(0.55,0.045,0.15),mb);wings.position.set(0,0.02,-0.03);g.add(wings);
  // Tail
  const tailW=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.04,0.09),mb);tailW.position.set(0,0.06,-0.3);g.add(tailW);
  const fin=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.15,0.09),mr);fin.position.set(0,0.11,-0.3);g.add(fin);
  // Struts
  const sG=new THREE.CylinderGeometry(0.022,0.022,0.12,6);
  [-0.09,0.09].forEach(x=>{const s=new THREE.Mesh(sG,mg);s.position.set(x,-0.11,0.02);g.add(s)});
  // Propeller
  const hub=new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.045,0.045,8),mg);hub.rotation.x=Math.PI/2;hub.position.z=0.4;g.add(hub);
  const propG=new THREE.Group();propG.position.z=0.44;
  const bG=new THREE.BoxGeometry(0.24,0.022,0.06);
  propG.add(new THREE.Mesh(bG,mg));
  const b2=new THREE.Mesh(bG,mg);b2.rotation.z=Math.PI/2;propG.add(b2);
  g.add(propG);
  return {group:g,propGroup:propG};
}

// ═════════════════════════════════════════════════════════════════
// FUTURISTIC COLUMN GLOBE (GitHub-style + glow core)
// ═════════════════════════════════════════════════════════════════
function buildColumnGlobe(R){
  const group=new THREE.Group();
  const COUNT=900;
  const boxG=new THREE.BoxGeometry(1,1,1);
  const boxM=new THREE.MeshStandardMaterial({roughness:0.6,metalness:0.08});
  columnMesh=new THREE.InstancedMesh(boxG,boxM,COUNT);

  const dummy=new THREE.Object3D();
  const up=new THREE.Vector3(0,1,0);
  const normal=new THREE.Vector3();
  const quat=new THREE.Quaternion();
  // Rainbow HSL → RGB helper
  function hslToColor(h,s,l){
    const a=s*Math.min(l,1-l);
    const f=n=>(n+h/30)%12;
    const k=n=>l-a*Math.max(Math.min(f(n)-3,9-f(n),1),-1);
    return new THREE.Color(k(0),k(8),k(4));
  }

  for(let i=0;i<COUNT;i++){
    const phi=Math.acos(1-2*(i+0.5)/COUNT);
    const theta=Math.PI*(1+Math.sqrt(5))*i;
    const x=Math.sin(phi)*Math.cos(theta);
    const y=Math.cos(phi);
    const z=Math.sin(phi)*Math.sin(theta);
    const n1=(Math.sin(x*7.7)*Math.cos(z*8.3)*0.5+0.5);
    const n2=(Math.sin(y*10.1+x*5.7)*0.5+0.5);
    const n3=(Math.cos((x+z)*5.3+y*7.1)*0.5+0.5);
    const n4=(Math.sin(x*12.7+z*11.9)*Math.cos(y*9.1)*0.5+0.5);
    let noise=Math.pow(n1*0.35+n2*0.25+n3*0.25+n4*0.15,1.5);
    const h=0.02+noise*0.24;
    // Hue from angular position (rainbow wraps around the globe)
    const hue=(theta%(Math.PI*2))/(Math.PI*2)*360; // 0–360°
    const saturation=0.55+noise*0.45;               // taller = more saturated
    const lightness=0.12+noise*0.42;                 // taller = brighter
    const col=hslToColor(hue,saturation,lightness);
    normal.set(x,y,z).normalize();
    dummy.position.set(x*(R+h/2),y*(R+h/2),z*(R+h/2));
    quat.setFromUnitVectors(up,normal);
    dummy.setRotationFromQuaternion(quat);
    dummy.scale.set(0.045,h,0.045);
    dummy.updateMatrix();
    columnMesh.setMatrixAt(i,dummy.matrix);
    columnMesh.setColorAt(i,col);
  }
  columnMesh.instanceMatrix.needsUpdate=true;
  if(columnMesh.instanceColor)columnMesh.instanceColor.needsUpdate=true;
  group.add(columnMesh);

  // Dark core sphere
  group.add(new THREE.Mesh(
    new THREE.SphereGeometry(R*0.96,48,48),
    new THREE.MeshStandardMaterial({color:0x0d1117,roughness:0.85})
  ));

  // ── Glow core (bright pulsing center) ──
  coreGlow=new THREE.Mesh(
    new THREE.SphereGeometry(R*0.25,32,32),
    new THREE.MeshBasicMaterial({color:0xfffbe6,transparent:true,opacity:0.7})
  );
  group.add(coreGlow);

  // Inner glow layer (white, lets rainbow columns pop)
  group.add(new THREE.Mesh(
    new THREE.SphereGeometry(R*0.45,32,32),
    new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.15})
  ));

  // Outer atmospheric glow
  const atmoG=new THREE.SphereGeometry(R*1.15,48,48);
  const atmoM=new THREE.ShaderMaterial({
    uniforms:{uTime:{value:0}},
    vertexShader:`varying vec3 vNormal;varying vec3 vPos;void main(){vNormal=normalize(normalMatrix*normal);vPos=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader:`varying vec3 vNormal;varying vec3 vPos;void main(){float rim=1.0-abs(dot(vNormal,vec3(0.0,0.0,1.0)));float glow=pow(rim,3.5)*0.35;float hue=rim*0.3+uTime*0.08;vec3 rainbow=0.5+0.5*cos(6.28318*(hue+vec3(0.0,0.33,0.67)));gl_FragColor=vec4(rainbow,glow);}`,
    transparent:true,depthWrite:false,side:THREE.FrontSide
  });
  const atmoShell=new THREE.Mesh(atmoG,atmoM);atmoShell.name='atmoShell';
  group.add(atmoShell);

  // Orbiting light particles
  const pCount=150;
  const pGeo=new THREE.BufferGeometry();
  const pPos=new Float32Array(pCount*3);
  for(let i=0;i<pCount;i++){
    const phi2=Math.random()*Math.PI*2;
    const theta2=Math.random()*Math.PI;
    const r2=R*1.08+Math.random()*R*0.18;
    pPos[i*3]=r2*Math.sin(theta2)*Math.cos(phi2);
    pPos[i*3+1]=r2*Math.sin(theta2)*Math.sin(phi2);
    pPos[i*3+2]=r2*Math.cos(theta2);
  }
  pGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3));
  orbitParticles=new THREE.Points(pGeo,
    new THREE.PointsMaterial({color:0xffffff,size:0.015,transparent:true,opacity:0.6,blending:THREE.AdditiveBlending,depthWrite:false})
  );
  group.add(orbitParticles);

  return group;
}

// ── Flowing ribbon cape ──
function buildRibbonCape(){
  const L=3.2,H=0.42,SEG=100; // taller for readable text
  ribbonGeo=new THREE.PlaneGeometry(L,H,SEG,1);
  const tex=buildRibbonTexture();tex.wrapS=THREE.ClampToEdgeWrapping;tex.wrapT=THREE.ClampToEdgeWrapping;
  tex.minFilter=THREE.LinearMipmapLinearFilter;tex.magFilter=THREE.LinearFilter;
  ribbonMesh=new THREE.Mesh(ribbonGeo,
    new THREE.MeshStandardMaterial({map:tex,side:THREE.DoubleSide,roughness:0.45,metalness:0,transparent:true,emissive:0x111111,emissiveIntensity:0.15})
  );
  const g=new THREE.Group();
  // Ribbon extends backward (-X) from attachment point
  ribbonMesh.position.set(-L/2,-0.15,0);
  g.add(ribbonMesh);
  return g;
}

// ═════════════════════════════════════════════════════════════════
// INIT SCENE
// ═════════════════════════════════════════════════════════════════
function initEarthScene(){
  if(typeof THREE==='undefined')return;
  const canvas=document.getElementById('earth-canvas');if(!canvas)return;
  const W=window.innerWidth,H=window.innerHeight;
  earthRenderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  earthRenderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  earthRenderer.setSize(W,H,false);
  canvas.style.width=W+'px';canvas.style.height=H+'px';

  earthScene=new THREE.Scene();
  earthCamera=new THREE.PerspectiveCamera(48,W/H,0.1,100);
  earthCamera.position.set(0,0.3,7);earthCamera.lookAt(0,-0.3,0);

  // Lighting
  earthScene.add(new THREE.AmbientLight(0xfff5ee,1.5));
  const key=new THREE.DirectionalLight(0xffffff,2.8);key.position.set(5,4,5);earthScene.add(key);
  const fill=new THREE.DirectionalLight(0x8899cc,0.5);fill.position.set(-3,-1,-3);earthScene.add(fill);

  // ── Globe (bottom-center) ──
  globeGroup=buildColumnGlobe(1.0);
  globeGroup.position.set(0,-1.5,0);
  earthScene.add(globeGroup);

  // ── Airplane ──
  airplaneGroup=new THREE.Group();
  const ap=buildAirplane();
  airplaneGroup.add(ap.group);airplanePropeller=ap.propGroup;
  airplaneGroup.scale.set(2.2,2.2,2.2);
  earthScene.add(airplaneGroup);

  // ── Ribbon cape ──
  ribbonGroup=buildRibbonCape();earthScene.add(ribbonGroup);

  // ── Render ──
  function render(){
    if(!earthActive)return;
    const elapsed=(performance.now()-earthStartTime)*0.001;
    const dt=Math.min(elapsed-(render._lastElapsed||elapsed),0.1);
    render._lastElapsed=elapsed;

    // Globe spin
    globeGroup.rotation.y+=0.005;
    // Core glow pulse
    if(coreGlow){const p=1+Math.sin(elapsed*3.5)*0.25;coreGlow.scale.setScalar(p);coreGlow.material.opacity=0.55+Math.sin(elapsed*3.5)*0.2}
    // Orbit particles
    if(orbitParticles){orbitParticles.rotation.y+=0.003;orbitParticles.rotation.x+=0.0015}
    // Atmo shell time uniform
    const atmoShell=globeGroup.children.find(c=>c.name==='atmoShell');
    if(atmoShell)atmoShell.material.uniforms.uTime.value=elapsed;

    // ── Phase timing ──
    const orbitStart=0.4, orbitDuration=5.0; // one full orbit in 5s
    const shatterTime=orbitStart+orbitDuration; // ~5.4s
    const shatterDuration=2.0;

    const orbitElapsed=Math.max(0,elapsed-orbitStart);
    orbitAngle=orbitElapsed*ORBIT_SPEED; // continuous angle

    // ── PHASE: Satellite Orbit ──
    if(elapsed<shatterTime&&!shatterTriggered){
      const ocx=0,ocy=-1.5,ocz=0;
      const sx=ocx+ORBIT_RADIUS*Math.cos(orbitAngle);
      const sy=ocy+ORBIT_RADIUS*Math.sin(orbitAngle)*Math.cos(ORBIT_TILT);
      const sz=ocz+ORBIT_RADIUS*Math.sin(orbitAngle)*Math.sin(ORBIT_TILT);
      airplaneGroup.position.set(sx,sy,sz);

      // Satellite faces tangent (direction of motion)
      const tx=-ORBIT_RADIUS*Math.sin(orbitAngle);
      const ty=ORBIT_RADIUS*Math.cos(orbitAngle)*Math.cos(ORBIT_TILT);
      const tz=ORBIT_RADIUS*Math.cos(orbitAngle)*Math.sin(ORBIT_TILT);
      airplaneGroup.lookAt(sx+tx,sy+ty,sz+tz);
      // Bank slightly into the turn
      airplaneGroup.rotateZ(-0.3);

      if(airplanePropeller)airplanePropeller.rotation.z+=0.35;

      // Ribbon trails behind satellite (opposite to tangent)
      ribbonGroup.position.set(sx-tx*0.12,sy-ty*0.12-0.15,sz-tz*0.12);
      ribbonGroup.rotation.copy(airplaneGroup.rotation);
      if(ribbonGeo){
        const pos=ribbonGeo.attributes.position;
        for(let i=0;i<pos.count;i++){
          const x=pos.getX(i);
          const normX=(x+1.6)/3.2;
          const distFromAttach=1-normX;
          const wave=Math.sin(x*7.5-elapsed*14)*0.09*Math.pow(distFromAttach,1.6);
          const wave2=Math.cos(x*5.2-elapsed*10.5)*0.06*Math.pow(distFromAttach,1.3);
          const wave3=Math.sin(x*3.8-elapsed*7.2)*0.04*distFromAttach;
          pos.setZ(i,wave+wave2+wave3);
          pos.setY(i,Math.sin(x*5.8-elapsed*11)*0.035*distFromAttach);
        }
        ribbonGeo.attributes.position.needsUpdate=true;
      }
      // Store last position for shatter
      lastSatPos={x:sx,y:sy,z:sz};
    }

    // ── PHASE: Trigger Meteor Shatter ──
    if(elapsed>=shatterTime&&!shatterTriggered){
      shatterTriggered=true;
      meteorStartTime=elapsed;
      meteorPhase=0;
      airplaneGroup.visible=false;
      ribbonGroup.visible=false;
      if(lastSatPos)initMeteorShatter(lastSatPos);
      // Camera shake impulse
      if(earthCamera)earthCamera.position.x+=(Math.random()-0.5)*0.15;
    }

    // ── PHASE: Meteor Animation ──
    if(shatterTriggered){
      const metElapsed=elapsed-meteorStartTime;
      // Camera shake during initial burst
      if(earthCamera&&metElapsed<0.6){
        const shake=0.12*(1-metElapsed/0.6);
        earthCamera.position.x+=(Math.random()-0.5)*shake;
        earthCamera.position.y+=(Math.random()-0.5)*shake*0.7;
      }else if(earthCamera&&metElapsed<0.7){
        // settle camera
        earthCamera.position.x+=(0-0.3-earthCamera.position.x)*0.1;
      }
      // Globe fades out during meteor stream
      if(metElapsed>0.5&&globeGroup){
        const globeFade=Math.max(0,1-(metElapsed-0.5)/1.2);
        globeGroup.children.forEach(c=>{
          if(c.material){
            if(Array.isArray(c.material))c.material.forEach(m=>{m.transparent=true;m.opacity=globeFade});
            else{c.material.transparent=true;c.material.opacity=globeFade}
          }
        });
      }
      updateMeteorShatter(dt,metElapsed);
    }

    // Fade out entire overlay
    const fadeS=shatterTime+2.8,fadeE=fadeS+1.2;
    if(elapsed>fadeS)earthOverlay.style.opacity=1-Math.max(0,Math.min(1,(elapsed-fadeS)/(fadeE-fadeS)));

    earthRenderer.render(earthScene,earthCamera);
    earthRAF=requestAnimationFrame(render);
  }
  render._lastElapsed=0;
  render();
}

// ── METEOR SHATTER SYSTEM (灵笼2-inspired: explosive breakup + streaming debris) ──
const GLOBE_CENTER=new THREE.Vector3(0,-1.5,0);
const GLOBE_RADIUS=1.0;
const METEOR_COLORS=[0xfffbe6,0xfff3cd,0xffe066,0xffb833,0xff922b,0xff6b3a,0xff4d2e,0xe8590c,0xd9480f];

function initMeteorShatter(originPos){
  meteorFragments=[];meteorPhase=0;
  const origin=new THREE.Vector3(originPos.x,originPos.y,originPos.z);

  // ═══════════════════════════════════════════════════
  // 1. FLASH LIGHT — blinding initial burst
  // ═══════════════════════════════════════════════════
  flashLight=new THREE.PointLight(0xffffff,25,8);
  flashLight.position.copy(origin);
  earthScene.add(flashLight);

  // ═══════════════════════════════════════════════════
  // 2. ENERGY BEAMS — radiating sword-light streaks (灵笼 style)
  // ═══════════════════════════════════════════════════
  beamGroup=new THREE.Group();
  const beamCount=14;
  for(let i=0;i<beamCount;i++){
    const phi=Math.random()*Math.PI*2;
    const theta=Math.random()*Math.PI;
    const dir=new THREE.Vector3(
      Math.sin(theta)*Math.cos(phi),
      Math.sin(theta)*Math.sin(phi),
      Math.cos(theta)
    ).normalize();
    const len=1.5+Math.random()*2.5;
    const beamGeo=new THREE.CylinderGeometry(0.015,0.003,len,6,1);
    const beamMat=new THREE.MeshBasicMaterial({
      color:0xffffff,transparent:true,opacity:0.9
    });
    const beam=new THREE.Mesh(beamGeo,beamMat);
    beam.position.copy(origin.clone().add(dir.clone().multiplyScalar(len/2)));
    // Orient beam along direction
    const up=new THREE.Vector3(0,1,0);
    const quat=new THREE.Quaternion().setFromUnitVectors(up,dir);
    beam.setRotationFromQuaternion(quat);
    beam.userData={dir,life:0.15+Math.random()*0.3,origOpacity:0.9};
    beamGroup.add(beam);
  }
  earthScene.add(beamGroup);

  // ═══════════════════════════════════════════════════
  // 3. DEBRIS CHUNKS — 80 fragments of varying sizes
  // ═══════════════════════════════════════════════════
  for(let i=0;i<80;i++){
    const scatterDir=new THREE.Vector3(
      (Math.random()-0.5)*2,(Math.random()-0.5)*2,(Math.random()-0.5)*2
    ).normalize();
    const toGlobe=new THREE.Vector3().copy(GLOBE_CENTER).sub(origin).normalize();
    // Initial velocity: explosive outward + toward globe component
    const vel=scatterDir.clone().multiplyScalar(3+Math.random()*8)
      .add(toGlobe.clone().multiplyScalar(0.5+Math.random()*3));
    const size=0.02+Math.random()*0.14;
    // Mix of sphere and irregular-ish shapes
    const geoType=Math.random();
    let geo;
    if(geoType<0.3)geo=new THREE.IcosahedronGeometry(size,0);
    else if(geoType<0.6)geo=new THREE.OctahedronGeometry(size,0);
    else geo=new THREE.SphereGeometry(size,5,3);
    const mat=new THREE.MeshBasicMaterial({
      color:METEOR_COLORS[Math.floor(Math.random()*METEOR_COLORS.length)],
      transparent:true,opacity:1
    });
    const mesh=new THREE.Mesh(geo,mat);
    mesh.position.copy(origin);
    // Random initial rotation
    mesh.rotation.set(Math.random()*Math.PI*2,Math.random()*Math.PI*2,Math.random()*Math.PI*2);
    mesh.userData={rotSpeed:{x:(Math.random()-0.5)*12,y:(Math.random()-0.5)*12,z:(Math.random()-0.5)*12}};
    earthScene.add(mesh);
    // 30% of large fragments will split mid-flight
    const willSplit=size>0.08&&Math.random()<0.35;
    meteorFragments.push({mesh,vel,life:1.2+Math.random()*2.0,trail:[],size,willSplit,splitTime:0.3+Math.random()*0.7,hasSplit:false});
  }

  // ═══════════════════════════════════════════════════
  // 4. SPARK PARTICLES — 300 tiny glowing points
  // ═══════════════════════════════════════════════════
  const sparkCount=300;
  const sparkGeo=new THREE.BufferGeometry();
  const sparkPos=new Float32Array(sparkCount*3);
  const sparkCol=new Float32Array(sparkCount*3);
  const sparkData=[];
  for(let i=0;i<sparkCount;i++){
    const dir=new THREE.Vector3((Math.random()-0.5)*2,(Math.random()-0.5)*2,(Math.random()-0.5)*2).normalize();
    const speed=4+Math.random()*14;
    sparkData.push({
      pos:origin.clone(),
      vel:dir.clone().multiplyScalar(speed),
      life:0.3+Math.random()*1.5,
      color:METEOR_COLORS[Math.floor(Math.random()*METEOR_COLORS.length)]
    });
    sparkPos[i*3]=origin.x;sparkPos[i*3+1]=origin.y;sparkPos[i*3+2]=origin.z;
    const c=new THREE.Color(sparkData[i].color);
    sparkCol[i*3]=c.r;sparkCol[i*3+1]=c.g;sparkCol[i*3+2]=c.b;
  }
  sparkGeo.setAttribute('position',new THREE.BufferAttribute(sparkPos,3));
  sparkGeo.setAttribute('color',new THREE.BufferAttribute(sparkCol,3));
  sparkParticles=new THREE.Points(sparkGeo,
    new THREE.PointsMaterial({size:0.04,vertexColors:true,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:0.9})
  );
  sparkParticles.userData={data:sparkData};
  earthScene.add(sparkParticles);

  // ═══════════════════════════════════════════════════
  // 5. SHOCKWAVE RING — expanding ring of particles
  // ═══════════════════════════════════════════════════
  const ringCount=180;
  const ringGeo=new THREE.BufferGeometry();
  const ringPos=new Float32Array(ringCount*3);
  const ringCol=new Float32Array(ringCount*3);
  for(let i=0;i<ringCount;i++){
    const angle=(i/ringCount)*Math.PI*2;
    const tiltAngle=(Math.random()-0.5)*0.6;
    ringPos[i*3]=Math.cos(angle)*0.1;
    ringPos[i*3+1]=Math.sin(angle)*Math.sin(tiltAngle)*0.1;
    ringPos[i*3+2]=Math.sin(angle)*Math.cos(tiltAngle)*0.1;
    ringCol[i*3]=1;ringCol[i*3+1]=0.9;ringCol[i*3+2]=0.7;
  }
  ringGeo.setAttribute('position',new THREE.BufferAttribute(ringPos,3));
  ringGeo.setAttribute('color',new THREE.BufferAttribute(ringCol,3));
  shockwaveRing=new THREE.Points(ringGeo,
    new THREE.PointsMaterial({size:0.06,vertexColors:true,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:0.8})
  );
  shockwaveRing.position.copy(origin);
  shockwaveRing.userData={radius:0.1,maxRadius:5,ringPos,ringCount};
  earthScene.add(shockwaveRing);

  // ═══════════════════════════════════════════════════
  // 6. TRAIL POINTS — large pool for all debris trails
  // ═══════════════════════════════════════════════════
  const trailPool=80*16;
  const trailGeo=new THREE.BufferGeometry();
  const trailP=new Float32Array(trailPool*3);
  const trailC=new Float32Array(trailPool*3);
  trailGeo.setAttribute('position',new THREE.BufferAttribute(trailP,3));
  trailGeo.setAttribute('color',new THREE.BufferAttribute(trailC,3));
  meteorTrails=new THREE.Points(trailGeo,
    new THREE.PointsMaterial({size:0.03,vertexColors:true,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:0.8})
  );
  earthScene.add(meteorTrails);

  // ═══════════════════════════════════════════════════
  // 7. GLOW LIGHT — warm ambient glow following debris
  // ═══════════════════════════════════════════════════
  meteorGlowLight=new THREE.PointLight(0xff8830,6,6);
  meteorGlowLight.position.copy(origin);
  earthScene.add(meteorGlowLight);
}

function spawnSecondaryFragments(parentFrag){
  // A large fragment splits into 3-5 smaller ones
  const count=3+Math.floor(Math.random()*3);
  const pos=parentFrag.mesh.position.clone();
  for(let i=0;i<count;i++){
    const dir=new THREE.Vector3((Math.random()-0.5)*2,(Math.random()-0.5)*2,(Math.random()-0.5)*2).normalize();
    const speed=1+Math.random()*5;
    const size=parentFrag.size*0.25+Math.random()*parentFrag.size*0.3;
    const geo=new THREE.SphereGeometry(size,4,3);
    const mat=new THREE.MeshBasicMaterial({
      color:METEOR_COLORS[Math.floor(Math.random()*METEOR_COLORS.length)],
      transparent:true,opacity:1
    });
    const mesh=new THREE.Mesh(geo,mat);
    mesh.position.copy(pos);
    mesh.userData={rotSpeed:{x:(Math.random()-0.5)*15,y:(Math.random()-0.5)*15,z:(Math.random()-0.5)*15}};
    earthScene.add(mesh);
    meteorFragments.push({
      mesh,
      vel:dir.clone().multiplyScalar(speed).add(parentFrag.vel.clone().multiplyScalar(0.4)),
      life:0.5+Math.random()*1.0,
      trail:[],
      size,
      willSplit:false,splitTime:0,hasSplit:true
    });
  }
}

function updateMeteorShatter(dt,metElapsed){
  if(!dt||dt<=0)dt=0.016;

  // ── Phase transitions ──
  if(metElapsed<0.25)meteorPhase=0; // flash + beams
  else if(metElapsed<2.5)meteorPhase=1; // debris stream
  else meteorPhase=2; // final fade

  // ═══════════════════════════════════════════════════
  // FLASH LIGHT — decay rapidly
  // ═══════════════════════════════════════════════════
  if(flashLight){
    const decay=Math.exp(-metElapsed*8);
    flashLight.intensity=25*decay;
    if(metElapsed>0.5||flashLight.intensity<0.3){
      earthScene.remove(flashLight);flashLight=null;
    }
  }

  // ═══════════════════════════════════════════════════
  // ENERGY BEAMS — fade and stretch outward
  // ═══════════════════════════════════════════════════
  if(beamGroup){
    let anyAlive=false;
    beamGroup.children.forEach(beam=>{
      beam.userData.life-=dt;
      if(beam.userData.life>0){
        anyAlive=true;
        beam.material.opacity=beam.userData.origOpacity*(beam.userData.life/0.45);
        // Stretch beam outward
        const scl=1+metElapsed*6;
        beam.scale.set(1,scl,1);
      }else{
        beam.material.opacity=0;
        beam.visible=false;
      }
    });
    if(!anyAlive&&metElapsed>0.6){
      beamGroup.children.forEach(b=>{b.geometry.dispose();b.material.dispose()});
      earthScene.remove(beamGroup);beamGroup=null;
    }
  }

  // ═══════════════════════════════════════════════════
  // SHOCKWAVE RING — expand outward
  // ═══════════════════════════════════════════════════
  if(shockwaveRing){
    const ud=shockwaveRing.userData;
    ud.radius+=dt*7;
    const ringPos=ud.ringPos;
    for(let i=0;i<ud.ringCount;i++){
      const angle=(i/ud.ringCount)*Math.PI*2;
      const tiltAngle=(Math.random()-0.5)*0.6;
      ringPos[i*3]=Math.cos(angle)*ud.radius;
      ringPos[i*3+1]=Math.sin(angle)*Math.sin(tiltAngle)*ud.radius;
      ringPos[i*3+2]=Math.sin(angle)*Math.cos(tiltAngle)*ud.radius;
    }
    shockwaveRing.geometry.attributes.position.needsUpdate=true;
    shockwaveRing.material.opacity=Math.max(0,0.8*(1-ud.radius/ud.maxRadius));
    if(ud.radius>ud.maxRadius){
      shockwaveRing.geometry.dispose();shockwaveRing.material.dispose();
      earthScene.remove(shockwaveRing);shockwaveRing=null;
    }
  }

  // ═══════════════════════════════════════════════════
  // SPARK PARTICLES
  // ═══════════════════════════════════════════════════
  if(sparkParticles){
    const data=sparkParticles.userData.data;
    const posArr=sparkParticles.geometry.attributes.position.array;
    const colArr=sparkParticles.geometry.attributes.color.array;
    let alive=0;
    for(let i=0;i<data.length;i++){
      const s=data[i];
      s.life-=dt;
      if(s.life<=0){posArr[i*3]=posArr[i*3+1]=posArr[i*3+2]=-999;continue}
      alive++;
      const toGlobe=new THREE.Vector3().copy(GLOBE_CENTER).sub(s.pos).normalize();
      s.vel.add(toGlobe.clone().multiplyScalar(1.5*dt));
      s.pos.x+=s.vel.x*dt;s.pos.y+=s.vel.y*dt;s.pos.z+=s.vel.z*dt;
      posArr[i*3]=s.pos.x;posArr[i*3+1]=s.pos.y;posArr[i*3+2]=s.pos.z;
      const lifeRatio=s.life/(0.3+1.5);
      colArr[i*3]=1;colArr[i*3+1]=0.5*lifeRatio;colArr[i*3+2]=0.1*lifeRatio;
    }
    sparkParticles.geometry.attributes.position.needsUpdate=true;
    sparkParticles.geometry.attributes.color.needsUpdate=true;
    if(alive===0&&metElapsed>1.0){
      sparkParticles.geometry.dispose();sparkParticles.material.dispose();
      earthScene.remove(sparkParticles);sparkParticles=null;
    }
  }

  // ═══════════════════════════════════════════════════
  // DEBRIS FRAGMENTS — main show
  // ═══════════════════════════════════════════════════
  for(let i=meteorFragments.length-1;i>=0;i--){
    const frag=meteorFragments[i];
    frag.life-=dt;
    const toGlobe=new THREE.Vector3().copy(GLOBE_CENTER).sub(frag.mesh.position).normalize();
    const dist=frag.mesh.position.distanceTo(GLOBE_CENTER);

    // Gravity toward globe (stronger when closer)
    const gravStr=3.5/(dist*dist+0.2);
    frag.vel.add(toGlobe.clone().multiplyScalar(gravStr*dt));

    // Slight drag in "atmosphere"
    if(dist<GLOBE_RADIUS+1.5)frag.vel.multiplyScalar(0.992);
    else frag.vel.multiplyScalar(0.998);

    // Update position
    frag.mesh.position.x+=frag.vel.x*dt;
    frag.mesh.position.y+=frag.vel.y*dt;
    frag.mesh.position.z+=frag.vel.z*dt;

    // Spin
    if(frag.mesh.userData.rotSpeed){
      frag.mesh.rotation.x+=frag.mesh.userData.rotSpeed.x*dt;
      frag.mesh.rotation.y+=frag.mesh.userData.rotSpeed.y*dt;
      frag.mesh.rotation.z+=frag.mesh.userData.rotSpeed.z*dt;
    }

    // Trail
    frag.trail.push(frag.mesh.position.clone());
    if(frag.trail.length>16)frag.trail.shift();

    // Secondary split
    if(frag.willSplit&&!frag.hasSplit&&metElapsed>frag.splitTime){
      spawnSecondaryFragments(frag);
      frag.hasSplit=true;
      // Fade out parent
      frag.life=Math.min(frag.life,0.3);
    }

    // Heat glow based on speed and proximity
    const newDist=frag.mesh.position.distanceTo(GLOBE_CENTER);
    const speed=Math.sqrt(frag.vel.x*frag.vel.x+frag.vel.y*frag.vel.y+frag.vel.z*frag.vel.z);
    const heat=Math.min(1,Math.max(0,(speed-1)/8)+Math.max(0,(2.5-newDist)/2));
    // Color: white-hot → yellow → orange → red
    const h=0.12-heat*0.11;
    const s=1;
    const l=0.45+heat*0.55;
    frag.mesh.material.color.setHSL(h,s,l);

    // Opacity from life
    frag.mesh.material.opacity=Math.min(1,frag.life*2.5);

    // Shrink when close to globe or near death
    const nearGlobe=Math.max(0,GLOBE_RADIUS+0.2-newDist);
    const shrink=Math.max(0.15,1-nearGlobe/0.8-frag.life*0.3);
    frag.mesh.scale.setScalar(Math.min(1.5,shrink*1.2));

    // Remove
    if(newDist<GLOBE_RADIUS+0.06||frag.life<=0){
      earthScene.remove(frag.mesh);
      frag.mesh.geometry.dispose();
      frag.mesh.material.dispose();
      meteorFragments.splice(i,1);
    }
  }

  // ═══════════════════════════════════════════════════
  // TRAIL POINTS — update from fragment trails
  // ═══════════════════════════════════════════════════
  if(meteorTrails&&meteorTrails.geometry){
    const posArr=meteorTrails.geometry.attributes.position.array;
    const colArr=meteorTrails.geometry.attributes.color.array;
    const maxPts=posArr.length/3;
    let idx=0;
    for(const frag of meteorFragments){
      for(let j=0;j<frag.trail.length&&idx<maxPts;j++){
        const t=frag.trail[j];
        const alpha=j/frag.trail.length;
        posArr[idx*3]=t.x;posArr[idx*3+1]=t.y;posArr[idx*3+2]=t.z;
        // Trail colors: white at head → orange → dark red at tail
        colArr[idx*3]=1;
        colArr[idx*3+1]=0.55*alpha;
        colArr[idx*3+2]=0.08*alpha*alpha;
        idx++;
      }
    }
    // Clear remaining
    for(let i=idx;i<maxPts;i++){
      posArr[i*3]=posArr[i*3+1]=posArr[i*3+2]=-999;
      colArr[i*3]=colArr[i*3+1]=colArr[i*3+2]=0;
    }
    meteorTrails.geometry.attributes.position.needsUpdate=true;
    meteorTrails.geometry.attributes.color.needsUpdate=true;
    // Fade trails in final phase
    if(meteorPhase===2)meteorTrails.material.opacity=Math.max(0,0.8-(metElapsed-2.5)/1.2*0.8);
  }

  // ═══════════════════════════════════════════════════
  // GLOW LIGHT — follow debris centroid
  // ═══════════════════════════════════════════════════
  if(meteorGlowLight){
    if(meteorFragments.length>0){
      let cx=0,cy=0,cz=0;
      meteorFragments.forEach(f=>{cx+=f.mesh.position.x;cy+=f.mesh.position.y;cz+=f.mesh.position.z});
      const n=meteorFragments.length;
      meteorGlowLight.position.lerp(new THREE.Vector3(cx/n,cy/n,cz/n),0.3);
      meteorGlowLight.intensity=3+meteorFragments.length*0.06;
      meteorGlowLight.color.setHSL(0.1,1,0.4+meteorFragments.length*0.01);
    }else{
      meteorGlowLight.intensity*=0.88;
      if(meteorGlowLight.intensity<0.2){
        earthScene.remove(meteorGlowLight);meteorGlowLight=null;
      }
    }
  }
}

function dismissEarth(){
  earthActive=false;clearTimeout(earthAutoTimer);
  if(earthRAF){cancelAnimationFrame(earthRAF);earthRAF=null}
  // Clean up meteor fragments
  if(meteorFragments.length>0){
    meteorFragments.forEach(f=>{
      if(f.mesh){if(f.mesh.parent)earthScene&&earthScene.remove(f.mesh);f.mesh.geometry&&f.mesh.geometry.dispose();f.mesh.material&&f.mesh.material.dispose()}
    });
    meteorFragments=[];
  }
  if(meteorTrails){if(earthScene)earthScene.remove(meteorTrails);meteorTrails.geometry&&meteorTrails.geometry.dispose();meteorTrails.material&&meteorTrails.material.dispose();meteorTrails=null}
  if(meteorGlowLight){if(earthScene)earthScene.remove(meteorGlowLight);meteorGlowLight=null}
  if(flashLight){if(earthScene)earthScene.remove(flashLight);flashLight=null}
  if(sparkParticles){if(earthScene)earthScene.remove(sparkParticles);sparkParticles.geometry&&sparkParticles.geometry.dispose();sparkParticles.material&&sparkParticles.material.dispose();sparkParticles=null}
  if(shockwaveRing){if(earthScene)earthScene.remove(shockwaveRing);shockwaveRing.geometry&&shockwaveRing.geometry.dispose();shockwaveRing.material&&shockwaveRing.material.dispose();shockwaveRing=null}
  if(beamGroup){beamGroup.children.forEach(b=>{b.geometry&&b.geometry.dispose();b.material&&b.material.dispose()});if(earthScene)earthScene.remove(beamGroup);beamGroup=null}
  shatterTriggered=false;orbitAngle=0;lastSatPos=null;meteorPhase=0;meteorStartTime=0;
  if(earthRenderer){earthRenderer.dispose();earthRenderer=null}
  if(earthScene){earthScene.clear();earthScene=null}
  globeGroup=null;columnMesh=null;coreGlow=null;orbitParticles=null;
  airplaneGroup=null;airplanePropeller=null;ribbonGroup=null;ribbonMesh=null;ribbonGeo=null;earthCamera=null;
  if(earthOverlay){
    earthOverlay.classList.remove('active');
    setTimeout(()=>{if(earthOverlay&&earthOverlay.parentNode)document.body.removeChild(earthOverlay);earthOverlay=null},500);
  }
}

// ═══════════════════════════════════════════════════════════════════
// DINO EASTER EGG
// ═══════════════════════════════════════════════════════════════════
function initDino(){
  const d=document.getElementById('footer-dino');if(!d)return;
  let c=0;
  d.addEventListener('click',()=>{
    c++;
    // Full-screen firework celebration on every click
    launchFireworks();
    if(c>=5){showToast('🦖 Rawr! You found the easter egg! 🎆',4000);c=0}
  });
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
  './mark/docs/jpg/flower2.png','./mark/docs/jpg/blue_sky.png','./mark/docs/jpg/fly.jpg',
  './mark/docs/jpg/bird_nest2.jpg','./mark/docs/jpg/bird_nest.jpg','./mark/docs/jpg/bird_nest3.jpg',
  './mark/docs/jpg/cycle.jpg','./mark/docs/jpg/cat.jpg','./mark/docs/jpg/tiananmen.png',
  './mark/docs/jpg/way.jpg','./mark/docs/jpg/map1.jpg','./mark/docs/jpg/bag.jpg',
  './mark/docs/jpg/lake.jpg','./mark/docs/jpg/shanghai.jpg','./mark/docs/jpg/supermarket.jpg',
  './mark/docs/jpg/shanghai2.jpg','./mark/docs/jpg/baijiahu2.jpg','./mark/docs/jpg/banana.jpg',
  './mark/docs/jpg/shanghai3.jpg','./mark/docs/jpg/baijiahu1.jpg','./mark/docs/jpg/me3.jpg',
  './mark/docs/jpg/me5.jpg','./mark/docs/jpg/qied.jpg','./mark/docs/jpg/shubiao.jpg',
  './mark/docs/jpg/sub6.jpg','./mark/docs/jpg/sub8.jpg','./mark/docs/jpg/selfziji.jpg',
  './mark/docs/jpg/selfziji1.jpg','./mark/docs/jpg/haibian.jpg','./mark/docs/jpg/haibian2.jpg',
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
// ARTICLE COVER IMAGES — pull the first photo from each markdown
// ═══════════════════════════════════════════════════════════════════
function extractFirstImage(text){
  const html=text.match(/<img[^>]+src=["']([^"']+)["']/i);
  if(html)return html[1].trim();
  const md=text.match(/!\[[^\]]*\]\(([^)\s]+)/);
  if(md)return md[1].trim();
  return null;
}
function toRootImgPath(src){
  if(!src)return '';
  if(/^(https?:|data:|\/)/i.test(src))return src;
  // Markdown image paths are written relative to mark/ (e.g. ./docs/jpg/x.jpg)
  return 'mark/'+src.replace(/^\.\//,'');
}
const ARTICLES=[
  {num:'01', doc:'vilasr.md',  title:"The initial stage was filled with frustration and confusion", date:'2020–2021', excerpt:'All beginnings are like this.'},
  {num:'02', doc:'vacalith.md',title:"I'm stuck in the same daily loop. Where's the happiness?", date:'2022–2024', excerpt:"It's time to draw this chapter to a close"},
  {num:'08', doc:'begin.md',   title:'Every story has to have a beginning', date:'2023–2024', excerpt:'A funny story'},
  {num:'03', doc:'thought.md', title:'My thoughts have gradually changed', date:'2024–2025', excerpt:"Learning is a necessary part of life's journey"},
  {num:'06', doc:'fun.md',     title:'I dream of happiness like this', date:'2025–09-27', excerpt:'This is what I picture for my future'},
  {num:'09', doc:'head.md',    title:'Finally starting to use my head', date:'2025–10-13', excerpt:"A story that's not funny at all"},
  {num:'10', doc:'heart.md',   title:'Thoughts evolve alongside life experiences', date:'2025–12-09', excerpt:'I like not being too anxious'},
  {num:'07', doc:'pm.md',      title:"I've become curious about project management", date:'2025-12-23', excerpt:"I've always been curious about what project management really is"},
  {num:'04', doc:'self.md',    title:'The time has come for me to finally introduce myself', date:'2025–12-31', excerpt:"After some thought, I'd still like to do a self-introduction"},
  {num:'05', doc:'mind.md',    title:'What is the true story, after all?', date:'2026-01-15', excerpt:'My little story'},
  {num:'11', doc:'movie.md',   title:'My favorite movie', date:'2025-12-08', excerpt:'My favorite movie'},
  {num:'16', doc:'move.md',    title:"The most important thing right now", date:'2026-08-11', excerpt:'I keep circling back to the same question: how do I get there? Lately, it all feels more like a wish list than a plan.'},
  {num:'12', doc:'pain.md',    title:'a painful story', date:'2026-01-26', excerpt:'a painful story'},
  {num:'13', doc:'amazing.md', title:'a totally crazy story', date:'2026-06-07', excerpt:'A truly incredible story'},
  {num:'14', doc:'cool.md',    title:'a draining storyline', date:'2026-06-27', excerpt:'This has truly been an exhausting and extreme journey'},
  {num:'15', doc:'badday.md',  title:"I'm always thinking—I've got so many dreams I want to make real", date:'2026-07-08', excerpt:'I keep circling back to the same question: how do I get there? Lately, it all feels more like a wish list than a plan.'},
  {num:'17', doc:'life.md',  title:"While the result is certainly important, the process is equally significant.", date:'2026-09-13', excerpt:' Never give up.'},
  {num:'18', doc:'different.md',  title:"This is a unique story.", date:'2026-09-23', excerpt:'So many words linger in my mind, yet I struggle to put them into speech. But I believe these things ought to be said.'},
];
const FEATURED_DOCS=['badday.md','cool.md','amazing.md','pain.md'];
const LATEST_DOCS=['vilasr.md', 'vacalith.md', 'begin.md', 'thought.md','fun.md', 'head.md','movie.md', 'heart.md','pm.md',
                  'self.md', 'mind.md','pain.md','amazing.md','cool.md','badday.md','move.md','life.md', 'different.md'];
const articleByDoc=doc=>ARTICLES.find(a=>a.doc===doc);
function docUrl(doc){return 'mark/mar.html?doc='+doc}

function buildRow(a,{featured=false,first=false}={}){
  const li=document.createElement('li');
  li.className='homepage-row homepage-row-with-image'+(featured?' homepage-row-featured':'')+(first?' homepage-row-featured-1':'');

  const imgLink=document.createElement('a');
  imgLink.className='homepage-row-image';
  imgLink.href=docUrl(a.doc);
  imgLink.target='_blank';
  imgLink.rel='noopener noreferrer';
  imgLink.setAttribute('aria-hidden','true');
  li.appendChild(imgLink);

  const body=document.createElement('div');
  body.className='homepage-row-body';

  const title=document.createElement('a');
  title.className='homepage-row-title';
  title.href=docUrl(a.doc);
  title.target='_blank';
  title.rel='noopener noreferrer';
  title.textContent=a.title;
  body.appendChild(title);

  const meta=document.createElement('div');
  meta.className='homepage-row-meta';
  const num=document.createElement('span');
  num.className='homepage-row-num';
  num.textContent=a.num||'';
  meta.appendChild(num);
  const type=document.createElement('a');
  type.className='homepage-row-type';
  type.href=docUrl(a.doc);
  type.target='_blank';
  type.textContent='Thought';
  meta.appendChild(type);
  const sep=document.createElement('span');
  sep.className='homepage-row-separator';
  sep.setAttribute('aria-hidden','true');
  sep.textContent='/';
  meta.appendChild(sep);
  const date=document.createElement('time');
  date.className='homepage-row-date';
  date.textContent=a.date;
  meta.appendChild(date);
  body.appendChild(meta);

  const summary=document.createElement('p');
  summary.className='homepage-row-summary';
  summary.textContent=a.excerpt;
  body.appendChild(summary);

  li.appendChild(body);
  return li;
}

function renderArticles(){
  const featuredEl=document.getElementById('featured-feed');
  const restEl=document.getElementById('rest-feed');
  const latestEl=document.getElementById('sidebar-latest');
  if(!featuredEl||!restEl||!latestEl)return;

  FEATURED_DOCS.forEach((doc,i)=>{
    const a=articleByDoc(doc);if(!a)return;
    featuredEl.appendChild(buildRow(a,{featured:true,first:i===0}));
  });

  ARTICLES.filter(a=>!FEATURED_DOCS.includes(a.doc)).forEach(a=>{
    restEl.appendChild(buildRow(a));
  });

  LATEST_DOCS.forEach(doc=>{
    const a=articleByDoc(doc);if(!a)return;
    const li=document.createElement('li');
    const title=document.createElement('a');
    title.href=docUrl(a.doc);
    title.target='_blank';
    title.rel='noopener noreferrer';
    title.textContent=a.title;
    li.appendChild(title);
    const date=document.createElement('a');
    date.className='homepage-sidebar-date';
    date.href=docUrl(a.doc);
    date.target='_blank';
    date.textContent=a.date.split(' ').slice(-2).join(' ');
    li.appendChild(date);
    latestEl.appendChild(li);
  });

  // Inject cover images from each markdown's first photo
  document.querySelectorAll('#featured-feed .homepage-row, #rest-feed .homepage-row').forEach(row=>{
    const title=row.querySelector('.homepage-row-title');
    const imgLink=row.querySelector('.homepage-row-image');
    if(!title)return;
    const doc=(title.getAttribute('href').match(/doc=([^&]+)/)||[])[1];
    if(!doc)return;
    fetch('mark/docs/story/'+doc)
      .then(r=>{if(!r.ok)throw new Error('not found');return r.text()})
      .then(text=>{
        const src=extractFirstImage(text);
        if(!src){row.classList.remove('homepage-row-with-image');if(imgLink)imgLink.remove();return}
        const img=document.createElement('img');
        img.src=toRootImgPath(src);
        img.alt='';
        img.loading='lazy';
        if(imgLink)imgLink.appendChild(img);
      })
      .catch(()=>{row.classList.remove('homepage-row-with-image');if(imgLink)imgLink.remove();});
  });
}

// ═══════════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded',()=>{
  initScrollAnimations();
  renderArticles();
  backToTopBtn=createBackToTop();
  initCursorGlow();
  initTilt();
  initBubbles();
  initParticles();
  initFireworkCanvas();
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
