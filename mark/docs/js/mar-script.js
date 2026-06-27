// ═══════════════════════════════════════════════════════════════════
// Tao Liu — Article Viewer v2
// TOC · Lightbox · Code Highlighting · Reading Progress
// ═══════════════════════════════════════════════════════════════════

// ── Theme ──
function getTheme(){ return localStorage.getItem('theme')||'dark' }
function setTheme(t){
  document.documentElement.setAttribute('data-theme',t);
  localStorage.setItem('theme',t);
  const tg=document.getElementById('theme-toggle');
  if(tg){const i=tg.querySelector('i');i.className=t==='light'?'fas fa-sun':'fas fa-moon'}
}
setTheme(getTheme());
const themeToggle=document.getElementById('theme-toggle');
if(themeToggle)themeToggle.addEventListener('click',()=>{
  setTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark');
});

// ── URL helper ──
function getUrlParameter(name){
  name=name.replace(/[\[]/,'\\[').replace(/[\]]/,'\\]');
  var regex=new RegExp('[\\?&]'+name+'=([^&#]*)');
  var results=regex.exec(window.location.search);
  return results===null?'':decodeURIComponent(results[1].replace(/\+/g,' '));
}

// ── Docs list ──
const docsList=[
  'vilasr.md','begin.md','fun.md','heart.md','thought.md',
  'mind.md','pm.md','self.md','vacalith.md','pain.md','movie.md','head.md','amazing.md','cool.md'
];
const docFile=getUrlParameter('doc')||'vilasr.md';
const currentIdx=docsList.indexOf(docFile);

// ── Doc title mapping ──
const docTitles={
  'vilasr.md':'The initial stage',
  'begin.md':'Every story has a beginning',
  'fun.md':'I dream of happiness',
  'heart.md':'Thoughts evolve',
  'thought.md':'My thoughts changed',
  'mind.md':'What is the true story',
  'pm.md':'Curious about PM',
  'self.md':'Introduce myself',
  'vacalith.md':'Daily loop',
  'pain.md':'A painful story',
  'movie.md':'My favorite movie',
  'head.md':'Using my head',
  'amazing.md':'amazing story',
  'cool.md':'a draining storyline'
};

// ── Update Prev/Next button titles ──
function updateNavButtons(){
  const prevTitle=document.getElementById('prev-title');
  const nextTitle=document.getElementById('next-title');
  if(currentIdx>0)prevTitle.textContent=docTitles[docsList[currentIdx-1]]||docsList[currentIdx-1];
  else prevTitle.textContent='—';
  if(currentIdx<docsList.length-1)nextTitle.textContent=docTitles[docsList[currentIdx+1]]||docsList[currentIdx+1];
  else nextTitle.textContent='—';
}

// ═══════════════════════════════════════════════════════════════════
// BUILD TABLE OF CONTENTS
// ═══════════════════════════════════════════════════════════════════
function buildTOC(){
  const content=document.getElementById('markdown-content');
  const tocList=document.getElementById('toc-list');
  if(!content||!tocList)return;

  const headings=content.querySelectorAll('h1,h2,h3');
  if(headings.length===0){tocList.innerHTML='<li class="toc-item"><span class="toc-link" style="color:var(--text-muted);cursor:default">No headings</span></li>';return}

  tocList.innerHTML='';
  headings.forEach((h,i)=>{
    // Add ID to heading for anchor linking
    const id='heading-'+i;
    h.id=id;

    const li=document.createElement('li');li.className='toc-item';
    const a=document.createElement('a');
    a.className='toc-link';
    if(h.tagName==='H3')a.classList.add('toc-h3');
    a.href='#'+id;
    a.textContent=h.textContent.trim();
    a.addEventListener('click',e=>{
      e.preventDefault();
      h.scrollIntoView({behavior:'smooth',block:'start'});
    });
    li.appendChild(a);tocList.appendChild(li);
  });
}

// ── TOC active heading highlight ──
function initTOCHighlight(){
  const tocLinks=document.querySelectorAll('.toc-link');
  if(tocLinks.length===0)return;
  const headings=document.querySelectorAll('#markdown-content h1[id],#markdown-content h2[id],#markdown-content h3[id]');

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting)return;
      const id=e.target.id;
      tocLinks.forEach(l=>l.classList.remove('active'));
      const match=document.querySelector(`.toc-link[href="#${id}"]`);
      if(match)match.classList.add('active');
    });
  },{threshold:0.3,rootMargin:'-60px 0px -40% 0px'});

  headings.forEach(h=>observer.observe(h));
}

// ═══════════════════════════════════════════════════════════════════
// IMAGE LIGHTBOX
// ═══════════════════════════════════════════════════════════════════
function initLightbox(){
  const overlay=document.getElementById('lightbox-overlay');
  const img=document.getElementById('lightbox-img');
  if(!overlay||!img)return;

  // Attach click to all images in markdown content
  const content=document.getElementById('markdown-content');
  if(!content)return;

  content.addEventListener('click',e=>{
    const target=e.target;
    if(target.tagName==='IMG'){
      img.src=target.src;
      img.alt=target.alt||'Enlarged view';
      overlay.classList.add('open');
      document.body.style.overflow='hidden';
    }
  });

  // Close: click overlay or X button or ESC
  overlay.addEventListener('click',e=>{
    if(e.target===overlay||e.target.classList.contains('lightbox-close')){
      overlay.classList.remove('open');
      document.body.style.overflow='';
    }
  });
  document.getElementById('lightbox-close').addEventListener('click',()=>{
    overlay.classList.remove('open');
    document.body.style.overflow='';
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&overlay.classList.contains('open')){
      overlay.classList.remove('open');
      document.body.style.overflow='';
    }
  });
}

// ═══════════════════════════════════════════════════════════════════
// READING PROGRESS
// ═══════════════════════════════════════════════════════════════════
function initReadingProgress(){
  const bar=document.getElementById('scroll-progress');
  if(!bar)return;
  window.addEventListener('scroll',()=>{
    const h=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.width=h>0?(window.scrollY/h)*100+'%':'0%';
  },{passive:true});
}

// ═══════════════════════════════════════════════════════════════════
// LOAD & RENDER MARKDOWN
// ═══════════════════════════════════════════════════════════════════
const docPath=`./docs/story/${docFile}`;
fetch(docPath)
  .then(r=>{if(!r.ok)throw new Error('File not found');return r.text()})
  .then(text=>{
    document.getElementById('markdown-content').innerHTML=marked.parse(text);
    // Post-render setup
    buildTOC();
    initTOCHighlight();
    initLightbox();
    updateNavButtons();
    // Highlight code blocks
    if(window.hljs)hljs.highlightAll();
  })
  .catch(err=>{
    document.getElementById('markdown-content').innerHTML=
      `<h1>Oops</h1><p>The article vanished: ${err.message}</p><p>Path: ${docPath}</p>`;
    updateNavButtons();
  });

// ═══════════════════════════════════════════════════════════════════
// MOBILE NAV
// ═══════════════════════════════════════════════════════════════════
const navToggle=document.querySelector('.nav-toggle');
const navMenu=document.querySelector('.nav-menu');
navToggle.addEventListener('click',()=>{navMenu.classList.toggle('active');navToggle.classList.toggle('active')});
document.querySelectorAll('.nav-link').forEach(l=>{
  l.addEventListener('click',()=>{navMenu.classList.remove('active');navToggle.classList.remove('active')});
});

// ── Back button ──
document.querySelector('.back-to-left').addEventListener('click',()=>{
  window.location.href='../index.html#Record';
});

// ═══════════════════════════════════════════════════════════════════
// PREV / NEXT NAVIGATION
// ═══════════════════════════════════════════════════════════════════
document.getElementById('prev-doc').addEventListener('click',()=>{
  if(currentIdx>0)window.location.href=`?doc=${docsList[currentIdx-1]}`;
  else alert('Already the first article!');
});
document.getElementById('next-doc').addEventListener('click',()=>{
  if(currentIdx<docsList.length-1)window.location.href=`?doc=${docsList[currentIdx+1]}`;
  else alert('Already the last article!');
});

// ═══════════════════════════════════════════════════════════════════
// VALINE COMMENTS
// ═══════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded',()=>{
  const commentDoc=getUrlParameter('doc')||'vilasr.md';
  new Valine({
    el:'#valine',appId:'a1y0WgrUeaPJfMKW0PYTsInm-gzGzoHsz',appKey:'xmlWz9A1uOYxyaf9NJf5iGOK',
    avatar:'retrod',lang:'zh-cn',placeholder:'Your comment ...',pageSize:10,
    visitor:true,recordIP:true,highlight:true,
    emojiCDN:'https://cdn.jsdelivr.net/npm/emoji-datasource-google@5.0.1/img/google/64/',
    emojiMaps:{},path:`./docs/story/${commentDoc}`
  });
});

// ═══════════════════════════════════════════════════════════════════
// DINO EASTER EGG
// ═══════════════════════════════════════════════════════════════════
function initDino(){
  const d=document.getElementById('footer-dino');if(!d)return;
  let c=0;
  d.addEventListener('click',()=>{
    c++;
    const r=d.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
    const colors=['#7c6ff7','#00cec9','#fd79a8','#ffd700','#fff'];
    for(let i=0;i<12;i++){
      const s=document.createElement('div'),angle=Math.PI*2*i/12,dist=30+Math.random()*20;
      s.style.cssText=`position:fixed;left:${cx}px;top:${cy}px;width:6px;height:6px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:50%;pointer-events:none;z-index:9999;opacity:1;transition:all 0.6s cubic-bezier(0.4,0,0.2,1)`;
      document.body.appendChild(s);
      requestAnimationFrame(()=>{s.style.transform=`translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px) scale(0)`;s.style.opacity='0'});
      setTimeout(()=>{if(s.parentNode)document.body.removeChild(s)},650);
    }
    if(c>=5){
      const t=document.createElement('div');t.textContent='🦖 Rawr! You found the easter egg!';
      t.style.cssText='position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:var(--accent);color:#fff;padding:12px 24px;border-radius:9999px;z-index:9999;font-family:var(--font-sans);font-size:0.88rem;font-weight:500;opacity:0;transition:opacity 0.3s;box-shadow:0 4px 24px var(--accent-glow);pointer-events:none';
      document.body.appendChild(t);requestAnimationFrame(()=>{t.style.opacity='1'});
      setTimeout(()=>{t.style.opacity='0';setTimeout(()=>{if(t.parentNode)document.body.removeChild(t)},300)},4000);
      c=0;
    }
  });
}

// ═══════════════════════════════════════════════════════════════════
// BOUNCING BUBBLES (elegant, slow)
// ═══════════════════════════════════════════════════════════════════
const imageSources=[
  './docs/jpg/index.jpg','./docs/jpg/kaka.jpg','./docs/jpg/tree.png',
  './docs/jpg/thisme.jpg','./docs/jpg/body.png','./docs/jpg/maybe.png',
  './docs/jpg/gray.jpg','./docs/jpg/paintwo.png','./docs/jpg/subway.png',
  './docs/jpg/红鞋.jpg','./docs/jpg/茶杯头.webp','./docs/jpg/sub.jpg',
  './docs/jpg/city.png','./docs/jpg/painone.png','./docs/jpg/杯子.jpg',
  './docs/jpg/ball.jpg','./docs/jpg/lanch.jpg','./docs/jpg/face.jpg',
  './docs/jpg/cha.jpg','./docs/jpg/train.jpg','./docs/jpg/ted.jpg',
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

// ── Init ──
document.addEventListener('DOMContentLoaded',()=>{
  initReadingProgress();
  initDino();
  initBubbles();
  updateNavButtons();
});
