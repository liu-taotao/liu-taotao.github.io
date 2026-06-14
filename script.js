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

function showEarth(){
  if(earthActive||(typeof THREE==='undefined'))return;
  earthActive=true;earthStartTime=performance.now();
  earthOverlay=document.createElement('div');earthOverlay.className='earth-overlay';
  earthOverlay.innerHTML=`<div class="earth-container"><canvas class="earth-canvas" id="earth-canvas"></canvas></div>`;
  document.body.appendChild(earthOverlay);
  requestAnimationFrame(()=>{
    earthOverlay.classList.add('active');
    initEarthScene();
    earthAutoTimer=setTimeout(()=>{dismissEarth()},6500);
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
    // Globe spin
    globeGroup.rotation.y+=0.005;
    // Core glow pulse
    if(coreGlow){const p=1+Math.sin(elapsed*3.5)*0.25;coreGlow.scale.setScalar(p);coreGlow.material.opacity=0.55+Math.sin(elapsed*3.5)*0.2}
    // Orbit particles
    if(orbitParticles){orbitParticles.rotation.y+=0.003;orbitParticles.rotation.x+=0.0015}
    // Atmo shell time uniform
    const atmoShell=globeGroup.children.find(c=>c.name==='atmoShell');
    if(atmoShell)atmoShell.material.uniforms.uTime.value=elapsed;

    // ── Airplane: straight flight across full viewport ──
    const flightStart=0.4,flightDur=3.2;
    const tF=Math.max(0,Math.min(1,(elapsed-flightStart)/flightDur));
    const te=tF<0.5?2*tF*tF:1-Math.pow(-2*tF+2,2)/2;
    const viewW=7*earthCamera.aspect;
    const ax=(te-0.5)*viewW;
    const ay=1.45+Math.sin(te*Math.PI)*0.45;
    airplaneGroup.position.set(ax,ay,-1.2);
    // No banking — just slight pitch for "climbing" then "descending"
    airplaneGroup.rotation.z=-0.05+Math.cos(te*Math.PI)*0.08;
    if(airplanePropeller)airplanePropeller.rotation.z+=0.35;

    // ── Ribbon cape follows airplane tail ──
    ribbonGroup.position.copy(airplaneGroup.position);
    ribbonGroup.position.x-=0.8; // behind airplane tail
    ribbonGroup.position.y-=0.15;
    ribbonGroup.rotation.copy(airplaneGroup.rotation);
    // Animate ribbon vertices — flowing wave, like Monkey King's cape
    if(ribbonGeo){
      const pos=ribbonGeo.attributes.position;
      for(let i=0;i<pos.count;i++){
        const x=pos.getX(i); // -L/2 to +L/2; +L/2 = attachment, -L/2 = free tip
        const normX=(x+1.6)/3.2; // 0 at free tip, 1 at attachment
        const distFromAttach=1-normX; // 1 at tip, 0 at attachment
        const wave=Math.sin(x*7.5-elapsed*14)*0.09*Math.pow(distFromAttach,1.6);
        const wave2=Math.cos(x*5.2-elapsed*10.5)*0.06*Math.pow(distFromAttach,1.3);
        const wave3=Math.sin(x*3.8-elapsed*7.2)*0.04*distFromAttach;
        pos.setZ(i,wave+wave2+wave3);
        pos.setY(i,Math.sin(x*5.8-elapsed*11)*0.035*distFromAttach);
      }
      ribbonGeo.attributes.position.needsUpdate=true;
    }

    // Fade out
    const fadeS=4.8,fadeE=5.8;
    if(elapsed>fadeS)earthOverlay.style.opacity=1-Math.max(0,Math.min(1,(elapsed-fadeS)/(fadeE-fadeS)));

    earthRenderer.render(earthScene,earthCamera);
    earthRAF=requestAnimationFrame(render);
  }
  render();
}

function dismissEarth(){
  earthActive=false;clearTimeout(earthAutoTimer);
  if(earthRAF){cancelAnimationFrame(earthRAF);earthRAF=null}
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
