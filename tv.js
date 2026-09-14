// ═══════════════════════════════════════════════════════════════════
// Retro TV module — plays a slideshow of every photo in mark/docs/jpg/
// Self-contained: no dependency on script.js
// ═══════════════════════════════════════════════════════════════════

// Every image file in mark/docs/jpg/ (the folder's photos).
const TV_PHOTOS = [
  './mark/docs/jpg/aidc.jpg',
  './mark/docs/jpg/bag.jpg',
  './mark/docs/jpg/baijiahu2.jpg',
  './mark/docs/jpg/baijiahui1.jpg',
  './mark/docs/jpg/ball.jpg',
  './mark/docs/jpg/banana.jpg',
  './mark/docs/jpg/bird.png',
  './mark/docs/jpg/bird_nest.jpg',
  './mark/docs/jpg/bird_nest2.jpg',
  './mark/docs/jpg/bird_nest3.jpg',
  './mark/docs/jpg/blue_sky.png',
  './mark/docs/jpg/body.png',
  './mark/docs/jpg/cat.jpg',
  './mark/docs/jpg/cha.jpg',
  './mark/docs/jpg/city.png',
  './mark/docs/jpg/contact-CYwNOxWg.gif',
  './mark/docs/jpg/cycle.jpg',
  './mark/docs/jpg/face.jpg',
  './mark/docs/jpg/flower.png',
  './mark/docs/jpg/flower2.png',
  './mark/docs/jpg/fly.jpg',
  './mark/docs/jpg/gray.jpg',
  './mark/docs/jpg/header-mirror.png',
  './mark/docs/jpg/image.png',
  './mark/docs/jpg/index.jpg',
  './mark/docs/jpg/kaka.jpg',
  './mark/docs/jpg/lake.jpg',
  './mark/docs/jpg/lanch.jpg',
  './mark/docs/jpg/map1.jpg',
  './mark/docs/jpg/maybe.png',
  './mark/docs/jpg/mi.jpg',
  './mark/docs/jpg/name.jpg',
  './mark/docs/jpg/painone.png',
  './mark/docs/jpg/paintwo.png',
  './mark/docs/jpg/pay.png',
  './mark/docs/jpg/road.jpg',
  './mark/docs/jpg/shanghai.jpg',
  './mark/docs/jpg/shanghai2.jpg',
  './mark/docs/jpg/shanghai3.jpg',
  './mark/docs/jpg/sub.jpg',
  './mark/docs/jpg/subway.png',
  './mark/docs/jpg/supermarket.jpg',
  './mark/docs/jpg/ted.jpg',
  './mark/docs/jpg/thisme.jpg',
  './mark/docs/jpg/tiananmen.png',
  './mark/docs/jpg/train.jpg',
  './mark/docs/jpg/tree.png',
  './mark/docs/jpg/way.jpg',
  './mark/docs/jpg/way2.jpg',
  './mark/docs/jpg/杯子.jpg',
  './mark/docs/jpg/红鞋.jpg',
  './mark/docs/jpg/茶杯头.webp',
  './mark/docs/jpg/me3.jpg',
  './mark/docs/jpg/me5.jpg',
  './mark/docs/jpg/qied.jpg',
  './mark/docs/jpg/shubiao.jpg',
  './mark/docs/jpg/sub6.jpg',
  './mark/docs/jpg/sub8.webp'
];

(function initTV(){
  const tv = document.getElementById('tv-module');
  const screen = document.getElementById('tv-screen-inner');
  if(!tv || !screen) return;

  // Build one slide per photo (starts loading immediately).
  const slides = TV_PHOTOS.map(src => {
    const img = document.createElement('img');
    img.className = 'tv-slide';
    img.src = src;
    img.alt = '';
    img.decoding = 'async';
    screen.appendChild(img);
    return img;
  });
  if(slides.length === 0) return;

  const DURATION = 4000; // ms per photo
  let index = 0;
  let timer = null;
  let on = true;

  function show(i){
    slides.forEach((s, j) => s.classList.toggle('active', j === i));
  }

  function next(){
    index = (index + 1) % slides.length;
    show(index);
  }

  show(0);
  timer = setInterval(next, DURATION);

  // Click (scene or power button) toggles power on/off.
  function setPower(state){
    on = state;
    tv.classList.toggle('is-power-on', on);
    tv.classList.toggle('is-power-off', !on);
    if(on){
      show(index);
      if(!timer) timer = setInterval(next, DURATION);
    } else {
      clearInterval(timer);
      timer = null;
    }
  }

  tv.addEventListener('click', () => setPower(!on));
  const powerBtn = tv.querySelector('.tv-power');
  if(powerBtn){
    powerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setPower(!on);
    });
  }
})();
