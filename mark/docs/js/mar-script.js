// 获取URL参数
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// 获取要加载的文档
const docFile = getUrlParameter('doc') || 'vilasr.md';
const docPath = `./docs/story/${docFile}`;

// 获取并渲染markdown文件
fetch(docPath)
    .then(response => {
        if (!response.ok) {
            throw new Error('啊哦，出错了！');
        }
        return response.text();
    })
    .then(text => {
        document.getElementById('markdown-content').innerHTML = marked.parse(text);
    })
    .catch(error => {
        document.getElementById('markdown-content').innerHTML = 
            `<h2>Bingo</h2><p>文档消失了哦: ${error.message}</p><p>怎么办: ${docPath}</p>`;
    });
    
// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// 金色五角星下落效果
document.addEventListener('DOMContentLoaded', function() {
    const starsContainer = document.getElementById('stars-container');
    
    function createStar() {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // 创建五角星字符
        star.innerHTML = '★';
        
        // 随机大小 (10-20px)
        const size = Math.random() * 10 + 10;
        star.style.fontSize = `${size}px`;
        
        // 随机位置
        star.style.left = `${Math.random() * 100}%`;
        
        // 随机透明度
        star.style.opacity = Math.random() * 0.7 + 0.3;
        
        // 随机动画时长 (3-6秒)
        const duration = Math.random() * 3 + 3;
        star.style.animationDuration = `${duration}s`;
        
        starsContainer.appendChild(star);
        
        // 动画结束后移除星星
        setTimeout(() => {
            if (star.parentNode) {
                star.parentNode.removeChild(star);
            }
        }, duration * 1000);
    }
    
    // 定期创建星星 (每300毫秒创建一个)
    setInterval(createStar, 300);
});


// 返回按钮功能
document.querySelector('.back-to-left').addEventListener('click', function() {
    window.location.href = '../index.html#research'; // 跳转到 index.html 的 Life & Bliss 部分
});
// 初始化 Valine
document.addEventListener('DOMContentLoaded', function () {
    // 获取当前加载的文档路径
    const docFile = getUrlParameter('doc') || 'vilasr.md';
    const docPath = `./docs/story/${docFile}`;

    // 初始化 Valine
    new Valine({
        el: '#valine', // 指定留言容器
        appId: 'a1y0WgrUeaPJfMKW0PYTsInm-gzGzoHsz', 
        appKey: 'xmlWz9A1uOYxyaf9NJf5iGOK', 
        avatar: 'retrod', 
        lang: 'zh-cn', // 语言设置
        placeholder: '你的评论 ...', // 输入框占位符
        pageSize: 10, // 每页显示的评论数量
        visitor: true, // 是否启用访问量统计
        recordIP: true, // 是否记录用户 IP
        highlight: true, // 是否启用代码高亮
        emojiCDN: 'https://cdn.jsdelivr.net/npm/emoji-datasource-google@5.0.1/img/google/64/', // 表情 CDN 地址
        emojiMaps: { /* 表情映射 */ },
        path: docPath // 动态设置留言路径，确保每个 Markdown 文件有独立的留言区
    });
});

// 文档列表
const docsList = [
    'vilasr.md',
    'begin.md',
    'fun.md',
    'heart.md',
    'thought.md',
    'mind.md',
    'pm.md',
    'self.md',
    'vacalith.md',
    'pain.md',
    'movie.md',
    'head.md'
];
// 获取当前文档索引
const currentDocIndex = docsList.indexOf(docFile);
// 上一篇按钮
document.getElementById('prev-doc').addEventListener('click', () => {
    if (currentDocIndex > 0) {
        const prevDoc = docsList[currentDocIndex - 1];
        window.location.href = `?doc=${prevDoc}`;
    } else {
        alert('已经是第一篇文档！');
    }
});

// 下一篇按钮
document.getElementById('next-doc').addEventListener('click', () => {
    if (currentDocIndex < docsList.length - 1) {
        const nextDoc = docsList[currentDocIndex + 1];
        window.location.href = `?doc=${nextDoc}`;
    } else {
        alert('已经是最后一篇文档！');
    }
});

// 图片列表（请根据实际文件名修改）
const imageSources = [
  './docs/jpg/index.jpg',
  './docs/jpg/kaka.jpg',
  './docs/jpg/tree.png',
  './docs/jpg/thisme.jpg',
  './docs/jpg/body.png',
  './docs/jpg/maybe.png',
  './docs/jpg/ted.jpg',
  './docs/jpg/paintwo.png',
  './docs/jpg/subway.png',
  './docs/jpg/红鞋.jpg',
  './docs/jpg/茶杯头.webp',
  './docs/jpg/sub.jpg',
  './docs/jpg/city.png',
  './docs/jpg/painone.png',
  './docs/jpg/杯子.jpg',
  './docs/jpg/ball.jpg',
  './docs/jpg/lanch.jpg',
  './docs/jpg/face.jpg',
  './docs/jpg/cha.jpg',
];

// 创建球的数量
const ballCount = imageSources.length;

// 获取容器
const container = document.getElementById('bouncing-balls-container');
const balls = [];

// 初始化每个球
for (let i = 0; i < ballCount; i++) {
  const ball = document.createElement('div');
  ball.className = 'bouncing-ball';
  ball.style.backgroundImage = `url(${imageSources[i]})`;
  
  // 随机大小（40px ~ 100px）
  const size = Math.random() * 60 + 40;
  ball.style.width = `${size}px`;
  ball.style.height = `${size}px`;

  // 初始位置
  const x = Math.random() * (window.innerWidth - size);
  const y = Math.random() * (window.innerHeight - size);
//   ball.style.left = `${x}px`;
//   ball.style.top = `${y}px`;

  // 随机速度
  const vx = (Math.random() - 0.5) * 4;
  const vy = (Math.random() - 0.5) * 4;

  container.appendChild(ball);
  balls.push({
    element: ball,
    x: x,
    y: y,
    vx: vx,
    vy: vy,
    size: size
  });
}

// 动画循环
function animate() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  balls.forEach(ball => {
    // 更新位置
    ball.x += ball.vx;
    ball.y += ball.vy;

    // 边界反弹
    if (ball.x <= 0 || ball.x + ball.size >= w) {
      ball.vx = -ball.vx;
      ball.x = Math.max(0, Math.min(w - ball.size, ball.x));
    }
    if (ball.y <= 0 || ball.y + ball.size >= h) {
      ball.vy = -ball.vy;
      ball.y = Math.max(0, Math.min(h - ball.size, ball.y));
    }

    // 应用位置
    // ball.element.style.left = `${ball.x}px`;
    // ball.element.style.top = `${ball.y}px`;
    ball.element.style.transform = `translate(${ball.x}px, ${ball.y}px)`;
  });

  requestAnimationFrame(animate);
}

// 启动动画
animate();

// 响应窗口大小变化
window.addEventListener('resize', () => {
  // 可选：重置位置或重新计算边界
});