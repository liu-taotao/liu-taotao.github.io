// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const researchInterestCards = document.querySelectorAll('.research-interest-card');
const publicationCategories = document.querySelectorAll('.publication-category');

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

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // 检查是否为外部链接
        if (href.startsWith('http') || href.startsWith('https')) {
            return; // 不阻止外部链接的默认行为
        }

        e.preventDefault(); // 阻止内部锚点链接的默认行为
        const targetSection = document.querySelector(href);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link highlighting
function updateActiveNavLink() {
    const scrollPos = window.scrollY + 100; // Offset for better UX
    
    navLinks.forEach(link => {
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const sectionTop = targetSection.offsetTop;
            const sectionBottom = sectionTop + targetSection.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}

// Research interest card switching
researchInterestCards.forEach(card => {
    card.addEventListener('click', (e) => {
        // Don't trigger card switch if clicking on a link
        if (e.target.closest('.research-link')) {
            return;
        }
        
        const targetCategory = card.getAttribute('data-category');
        
        // Update active card
        researchInterestCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        // Show target category, hide others
        publicationCategories.forEach(category => {
            if (category.id === targetCategory) {
                category.classList.add('active');
            } else {
                category.classList.remove('active');
            }
        });
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Add scroll animation to elements
function addScrollAnimations() {
    const animateElements = document.querySelectorAll('.research-interest-card, .award-item, .publication-item, .teaching-item');
    animateElements.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
}

// Navbar background on scroll
function updateNavbarBackground() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}

// Typing animation for hero subtitle
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Count animation for statistics (if any)
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const increment = target / 100;
        let current = 0;
        
        const updateCount = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCount);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCount();
    });
}

// Parallax effect for hero section
function parallaxHero() {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
}

// Search functionality for publications (optional enhancement)
function searchPublications(query) {
    const publications = document.querySelectorAll('.publication-item');
    const searchTerm = query.toLowerCase();
    
    publications.forEach(pub => {
        const title = pub.querySelector('.pub-title').textContent.toLowerCase();
        const authors = pub.querySelector('.pub-authors').textContent.toLowerCase();
        const venue = pub.querySelector('.pub-venue').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || authors.includes(searchTerm) || venue.includes(searchTerm)) {
            pub.style.display = 'block';
        } else {
            pub.style.display = 'none';
        }
    });
}

// Back to top button
function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.classList.add('back-to-top');
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--secondary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
    `;
    
    document.body.appendChild(backToTop);
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    return backToTop;
}

// Show/hide back to top button
function toggleBackToTopButton(button) {
    if (window.scrollY > 300) {
        button.style.opacity = '1';
        button.style.visibility = 'visible';
    } else {
        button.style.opacity = '0';
        button.style.visibility = 'hidden';
    }
}

// Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Copy email to clipboard
function copyEmail() {
    const email = 'brainytao@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
        // Show toast notification
        showToast('Email copied to clipboard!');
    });
}

// Toast notification
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-color);
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 100);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, duration);
}

// Theme toggle (dark/light mode) - optional enhancement
function createThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.classList.add('theme-toggle');
    themeToggle.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(44, 62, 80, 0.3);
    `;
    
    document.body.appendChild(themeToggle);
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-theme')) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    });
}

// Event Listeners
window.addEventListener('scroll', () => {
    updateActiveNavLink();
    updateNavbarBackground();
    // parallaxHero(); // Uncomment for parallax effect
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addScrollAnimations();
    
    // Create back to top button
    const backToTopBtn = createBackToTopButton();
    window.addEventListener('scroll', () => toggleBackToTopButton(backToTopBtn));
    
    // Optional: Create theme toggle
    // createThemeToggle();
    
    // Optional: Lazy load images
    lazyLoadImages();
    
    // Optional: Type writer effect for hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.textContent;
        setTimeout(() => typeWriter(heroSubtitle, text, 50), 1000);
    }
    
    // Add click event to email social link for copying
    const emailLink = document.querySelector('a[href^="mailto:"]');
    if (emailLink) {
        emailLink.addEventListener('click', (e) => {
            e.preventDefault();
            copyEmail();
        });
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll-heavy functions
const debouncedScroll = debounce(() => {
    updateActiveNavLink();
    updateNavbarBackground();
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Smooth reveal animations for sections
const revealSections = () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.8) {
            section.classList.add('section-visible');
        }
    });
};

window.addEventListener('scroll', revealSections);

// Preloader (optional)
function createPreloader() {
    const preloader = document.createElement('div');
    preloader.classList.add('preloader');
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        opacity: 1;
        transition: opacity 0.5s ease;
    `;
    
    document.body.appendChild(preloader);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(preloader);
            }, 500);
        }, 1000);
    });
}

// Uncomment to enable preloader
// createPreloader(); 

// 金色五角星下落效果
document.addEventListener('DOMContentLoaded', function() {
    const starsContainer = document.getElementById('stars-container');

    function createStar() {
        const star = document.createElement('div');
        star.classList.add('meteor'); // 改为 meteor 类

        // 随机位置（X 轴）
        const left = Math.random() * 100;
        star.style.left = `${left}%`;

        // 随机动画时长 (1-3秒 更符合流星)
        const duration = Math.random() * 2 + 1;
        star.style.animationDuration = `${duration}s`;

        // 随机延迟（可选，让流星错开）
        star.style.animationDelay = `${Math.random() * 2}s`;

        starsContainer.appendChild(star);

        // 动画结束后移除
        setTimeout(() => {
            if (star.parentNode) {
                star.parentNode.removeChild(star);
            }
        }, duration * 1000);
    }
    
    // 定期创建星星 (每300毫秒创建一个)
    setInterval(createStar, 300);
});

// 图片列表（请根据实际文件名修改）
const imageSources = [
  './mark/docs/jpg/index.jpg',
  './mark/docs/jpg/kaka.jpg',
  './mark/docs/jpg/tree.png',
  './mark/docs/jpg/thisme.jpg',
  './mark/docs/jpg/body.png',
  './mark/docs/jpg/maybe.png',
  './mark/docs/jpg/ted.jpg',
  './mark/docs/jpg/paintwo.png',
  './mark/docs/jpg/subway.png',
  './mark/docs/jpg/红鞋.jpg',
  './mark/docs/jpg/茶杯头.webp',
  './mark/docs/jpg/sub.jpg',
  './mark/docs/jpg/city.png',
  './mark/docs/jpg/painone.png',
  './mark/docs/jpg/杯子.jpg',
  './mark/docs/jpg/ball.jpg',
  './mark/docs/jpg/lanch.jpg',
  './mark/docs/jpg/face.jpg',
  './mark/docs/jpg/cha.jpg',
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
  
  // 立即应用初始位置
  ball.style.transform = `translate(${x}px, ${y}px)`;
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