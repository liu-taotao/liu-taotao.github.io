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
            throw new Error('文档未找到');
        }
        return response.text();
    })
    .then(text => {
        document.getElementById('markdown-content').innerHTML = marked.parse(text);
    })
    .catch(error => {
        document.getElementById('markdown-content').innerHTML = 
            `<h2>错误</h2><p>无法加载文档: ${error.message}</p><p>请确认文件是否存在: ${docPath}</p>`;
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
    'vilasr.md',
    'thought.md',
    'mind.md',
    'pm.md',
    'self.md',
    'vacalith.md'
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