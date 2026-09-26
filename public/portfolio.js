// ── CUSTOM CURSOR ──
function initCursor() {
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    const spotlight = document.getElementById('spotlight');

    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let ringX = 0;
    let ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Smooth follow for dot
        dotX += (mouseX - dotX) * 0.25;
        dotY += (mouseY - dotY) * 0.25;

        // Smooth follow for ring (slower)
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        if (cursorDot) {
            cursorDot.style.left = dotX + 'px';
            cursorDot.style.top = dotY + 'px';
        }

        if (cursorRing) {
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
        }

        if (spotlight) {
            spotlight.style.left = mouseX + 'px';
            spotlight.style.top = mouseY + 'px';
        }
    });

    // Hover effect on interactive elements
    const interactive = document.querySelectorAll('a, button, .btn, input, textarea');
    interactive.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        if (cursorDot) cursorDot.style.opacity = '0';
        if (cursorRing) cursorRing.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        if (cursorDot) cursorDot.style.opacity = '1';
        if (cursorRing) cursorRing.style.opacity = '1';
    });
}

// ── PRELOADER ──
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const preBar = document.getElementById('pre-bar');

    if (!preBar) return;

    let progress = 0;
    const increment = () => {
        progress += Math.random() * 30;
        if (progress > 90) progress = 90;
        preBar.style.width = progress + '%';
    };

    const progressInterval = setInterval(increment, 500);

    window.addEventListener('load', () => {
        clearInterval(progressInterval);
        preBar.style.width = '100%';
        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('done');
            }
        }, 600);
    });

    // Fallback: complete preloader after 4 seconds if page hasn't fully loaded
    setTimeout(() => {
        clearInterval(progressInterval);
        preBar.style.width = '100%';
        if (!preloader.classList.contains('done')) {
            preloader.classList.add('done');
        }
    }, 4000);
}

// ── SMOOTH SCROLL NAVIGATION ──
// ── HERO NAME ANIMATION ──
function animateHeroName() {
    const heroName = document.getElementById('hero-name');
    if (!heroName) return;

    const text = 'Md Mojahid';
    heroName.innerHTML = '';

    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.animationDelay = (index * 0.05) + 's';
        heroName.appendChild(span);
    });
}

// ── TYPEWRITER EFFECT ──
function typewriter() {
    const typewriterEl = document.getElementById('typewriter');
    if (!typewriterEl) return;

    const text = 'Full-Stack Developer & AI Builder';
    let index = 0;
    typewriterEl.textContent = '';

    const type = () => {
        if (index < text.length) {
            typewriterEl.textContent += text.charAt(index);
            index++;
            setTimeout(type, 40);
        }
    };

    setTimeout(type, 500);
}

// ── CANVAS BACKGROUND PARTICLES ──
function initCanvasBackground() {
    const canvas = document.getElementById('canvas-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 1.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.fillStyle = `rgba(255, 107, 0, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    const animate = () => {
        ctx.fillStyle = 'rgba(8, 8, 8, 0.02)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ── SECTION TITLE REVEALS ──
function observeSectionTitles() {
    const titles = document.querySelectorAll('.section-title');
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                titleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    titles.forEach(title => {
        titleObserver.observe(title);
    });
}

// ── PROCESS SECTION REVEAL ──
function observeProcessSection() {
    const processSection = document.getElementById('process');
    if (!processSection) return;

    const processObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                processObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    processObserver.observe(processSection);
}

// ── SMOOTH SCROLL NAVIGATION ──
const links = document.querySelectorAll('a[href^="#"]');

links.forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ── NAV SCROLL DETECTION ──
window.addEventListener('scroll', () => {
    const nav = document.getElementById('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// ── PAGE INITIALIZATION ──
window.initPortfolio = () => {
    if (window.__portfolioInitialized) return;
    window.__portfolioInitialized = true;
    initCursor();
    initPreloader();
    animateHeroName();
    typewriter();
    initCanvasBackground();
    observeSectionTitles();
    observeProcessSection();

    // ── SCROLL REVEAL ANIMATIONS ──
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ── ANIMATE SKILL BARS ──
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width') || '50';
                bar.style.width = width + '%';
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });

    // ── COUNT UP STATS ──
    const statNums = document.querySelectorAll('.stat-num');
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                if (!entry.target.hasAttribute('data-target')) {
                    statObserver.unobserve(entry.target);
                    return;
                }
                const target = parseInt(entry.target.getAttribute('data-target')) || 0;
                let current = 0;
                const increment = target / 20;

                const counter = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        entry.target.textContent = target;
                        clearInterval(counter);
                        entry.target.classList.add('counted');
                    } else {
                        entry.target.textContent = Math.floor(current);
                    }
                }, 50);

                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNums.forEach(num => {
        statObserver.observe(num);
    });

    // ── EMAIL COPY FUNCTIONALITY ──
    const emailCopy = document.getElementById('email-copy');
    if (emailCopy) {
        emailCopy.addEventListener('click', () => {
            const email = emailCopy.getAttribute('data-email') || 'mojahid.dev.sihf@gmail.com';
            navigator.clipboard.writeText(email).then(() => {
                const toast = document.getElementById('toast');
                if (toast) {
                    toast.classList.add('show');
                    setTimeout(() => {
                        toast.classList.remove('show');
                    }, 2000);
                }
            });
        });
    }

    // ── HAMBURGER MENU ──
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('open');
        });
    }

    const mobLinks = document.querySelectorAll('.mob-link');
    mobLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
        });
    });
};


