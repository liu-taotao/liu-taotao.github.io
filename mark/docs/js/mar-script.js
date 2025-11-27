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