/**
 * ============================================
 * MANI PORTFOLIO — script.js
 * Features:
 *  - Page loader
 *  - Sticky navbar + scroll spy
 *  - Mobile menu toggle
 *  - Dark / Light theme toggle
 *  - Typing animation
 *  - Scroll reveal animations
 *  - Animated stat counters
 *  - Animated skill bars
 *  - Contact form simulation
 *  - Back-to-top button
 *  - Smooth scroll for all anchor links
 * ============================================
 */

'use strict';

/* ───────────────────────────────────────────────
   1. UTILITY HELPERS
──────────────────────────────────────────────── */

/** Query selector shorthand */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/** Wait for the DOM to be ready */
const onReady = (fn) => {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
};

/* ───────────────────────────────────────────────
   2. PAGE LOADER
──────────────────────────────────────────────── */
function initLoader() {
  const loader = $('#loader');
  if (!loader) return;

  // Hide loader after 1.6 s (animation completes)
  setTimeout(() => {
    loader.classList.add('done');
    // Remove from DOM after transition so it doesn't block anything
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  }, 1600);
}

/* ───────────────────────────────────────────────
   3. STICKY NAVBAR + ACTIVE LINK SCROLL SPY
──────────────────────────────────────────────── */
function initNavbar() {
  const navbar = $('#navbar');
  const navLinks = $$('.nav-link');
  const sections = $$('section[id]');

  if (!navbar) return;

  // Sticky background on scroll
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
    toggleBackToTop();
  }

  // Highlight nav link for the current visible section
  function updateActiveLink() {
    let currentId = '';

    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) currentId = section.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === currentId);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

/* ───────────────────────────────────────────────
   4. MOBILE MENU TOGGLE
──────────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger = $('#hamburger');
  const navLinks = $('#nav-links');
  const overlay = $('#mobile-overlay');

  if (!hamburger || !navLinks) return;

  function openMenu() {
    hamburger.classList.add('open');
    navLinks.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // Close menu when a nav link is clicked
  $$('.nav-link').forEach(link => link.addEventListener('click', closeMenu));
}

/* ───────────────────────────────────────────────
   5. DARK / LIGHT THEME TOGGLE
──────────────────────────────────────────────── */
function initThemeToggle() {
  const toggle = $('#theme-toggle');
  const themeIcon = toggle?.querySelector('.theme-icon');
  const body = document.body;

  if (!toggle) return;

  // Load saved preference
  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(saved);

  toggle.addEventListener('click', () => {
    const current = body.classList.contains('dark-mode') ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('portfolio-theme', next);
  });

  function applyTheme(theme) {
    if (theme === 'light') {
      body.classList.replace('dark-mode', 'light-mode');
      if (themeIcon) themeIcon.textContent = '☀️';
    } else {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
      if (themeIcon) themeIcon.textContent = '🌙';
    }
  }
}

/* ───────────────────────────────────────────────
   6. TYPING ANIMATION
──────────────────────────────────────────────── */
function initTypingAnimation() {
  const el = $('#typing-text');
  if (!el) return;

  const phrases = [
    'Frontend Developer',
    'Java Enthusiast',
    'Problem Solver',
    'UI/UX Thinker',
    'Software Engineer',
    'Startup Builder',
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  const TYPING_SPEED = 80;
  const DELETING_SPEED = 45;
  const PAUSE_AFTER = 1800;
  const PAUSE_BEFORE = 400;

  function type() {
    if (isPaused) return;

    const current = phrases[phraseIndex];

    if (!isDeleting) {
      // Typing forward
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        // Finished typing — pause then start deleting
        isPaused = true;
        setTimeout(() => { isPaused = false; isDeleting = true; }, PAUSE_AFTER);
      }
    } else {
      // Deleting
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        isPaused = true;
        setTimeout(() => { isPaused = false; }, PAUSE_BEFORE);
      }
    }

    setTimeout(type, isDeleting ? DELETING_SPEED : TYPING_SPEED);
  }

  // Small initial delay so it starts after loader
  setTimeout(type, 1800);
}

/* ───────────────────────────────────────────────
   7. SCROLL REVEAL ANIMATIONS
──────────────────────────────────────────────── */
function initScrollReveal() {
  const elements = $$('.reveal-up, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // only animate once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ───────────────────────────────────────────────
   8. ANIMATED STAT COUNTERS
──────────────────────────────────────────────── */
function initStatCounters() {
  const counters = $$('.stat-number[data-target]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1600; // ms
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out quad
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}

/* ───────────────────────────────────────────────
   9. ANIMATED SKILL BARS
──────────────────────────────────────────────── */
function initSkillBars() {
  const fills = $$('.skill-fill[data-width]');
  if (!fills.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          // Small delay so reveal animation completes first
          setTimeout(() => {
            target.style.width = target.dataset.width + '%';
          }, 200);
          observer.unobserve(target);
        }
      });
    },
    { threshold: 0.3 }
  );

  fills.forEach(el => observer.observe(el));
}

/* ───────────────────────────────────────────────
   10. CONTACT FORM SIMULATION
──────────────────────────────────────────────── */
function initContactForm() {
  const form = $('#contact-form');
  const success = $('#form-success');
  const submit = $('#form-submit');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name = $('#cf-name').value.trim();
    const email = $('#cf-email').value.trim();
    const message = $('#cf-message').value.trim();

    if (!name || !email || !message) {
      shakeButton(submit);
      return;
    }

    if (!isValidEmail(email)) {
      shakeButton(submit);
      $('#cf-email').focus();
      return;
    }

    // Simulate sending
    submit.disabled = true;
    submit.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".3"/>
        <path d="M21 12a9 9 0 00-9-9"/>
      </svg>
      Sending...
    `;

    setTimeout(() => {
      form.reset();
      submit.disabled = false;
      submit.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Send Message
      `;
      if (success) {
        success.classList.add('show');
        setTimeout(() => success.classList.remove('show'), 5000);
      }
    }, 1800);
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function shakeButton(btn) {
    btn.style.animation = 'none';
    btn.offsetHeight; // force reflow
    btn.style.animation = 'shake 0.4s ease';
    btn.addEventListener('animationend', () => { btn.style.animation = ''; }, { once: true });
  }

  // Inject shake keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-6px)}
      40%{transform:translateX(6px)}
      60%{transform:translateX(-4px)}
      80%{transform:translateX(4px)}
    }
    @keyframes spin {
      to{transform:rotate(360deg)}
    }
    .spin { animation: spin 0.8s linear infinite; }
  `;
  document.head.appendChild(style);
}

/* ───────────────────────────────────────────────
   11. BACK-TO-TOP BUTTON
──────────────────────────────────────────────── */
function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/** Show/hide back-to-top (called from scroll handler) */
function toggleBackToTop() {
  const btn = $('#back-to-top');
  if (btn) btn.classList.toggle('show', window.scrollY > 400);
}

/* ───────────────────────────────────────────────
   12. SMOOTH SCROLL FOR ALL ANCHOR LINKS
──────────────────────────────────────────────── */
function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    const navHeight = $('#navbar')?.offsetHeight || 70;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top, behavior: 'smooth' });
  });
}

/* ───────────────────────────────────────────────
   13. HERO SECTION PARALLAX (subtle)
──────────────────────────────────────────────── */
function initParallax() {
  const orbs = $$('.orb');
  if (!orbs.length) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        orbs[0]?.style.setProperty('transform', `translate(${y * 0.03}px, ${y * 0.05}px) scale(1)`);
        orbs[1]?.style.setProperty('transform', `translate(${-y * 0.02}px, ${-y * 0.04}px) scale(1)`);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ───────────────────────────────────────────────
   14. CARD TILT EFFECT (desktop only)
──────────────────────────────────────────────── */
function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return; // skip on touch

  const cards = $$('.project-card, .highlight-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -5;
      const rotateY = ((x - cx) / cx) * 5;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ───────────────────────────────────────────────
   15. ACTIVE NAV LINK UNDERLINE INDICATOR
──────────────────────────────────────────────── */
function initNavIndicator() {
  // Visual feedback: clicking nav links adds a micro-flash
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      $$('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

/* ───────────────────────────────────────────────
   16. INIT ALL
──────────────────────────────────────────────── */
onReady(() => {
  initLoader();
  initNavbar();
  initMobileMenu();
  initThemeToggle();
  initTypingAnimation();
  initScrollReveal();
  initStatCounters();
  initSkillBars();
  initContactForm();
  initBackToTop();
  initSmoothScroll();
  initParallax();
  initCardTilt();
  initNavIndicator();

  // Console easter egg for curious developers 🥚
  console.log('%c👋 Hey there, curious developer!', 'color:#8b5cf6;font-size:1.1rem;font-weight:700;');
  console.log('%cMani\'s portfolio is built with pure HTML, CSS & JavaScript.', 'color:#9ca3af;');
  console.log('%cWant to connect? → mani@email.com', 'color:#06b6d4;font-weight:600;');
});
