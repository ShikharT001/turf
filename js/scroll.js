/* ═════════════════════════════════════════
   scroll.js — Scroll effects, parallax,
   navbar, count-up animations
═════════════════════════════════════════ */

// ── Navbar scroll state ─────────────────────────────────
(function() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Navbar background
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link
    let current = '';
    sections.forEach(s => {
      const top = s.offsetTop - 120;
      if (window.scrollY >= top) current = s.id;
    });
    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  });

  // Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinksEl.classList.toggle('open');
    hamburger.classList.toggle('open');
    navbar.classList.toggle('menu-open');
  });
})();

// ── Scroll Reveal ───────────────────────────────────────
(function() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .bento-card, .pricing-card, .sport-card, .review-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.style.getPropertyValue('--delay') || '0s';
        setTimeout(() => {
          el.classList.add('visible');
        }, parseFloat(delay) * 1000);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => {
    if (!el.classList.contains('reveal-up') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
      el.classList.add('reveal-up');
    }
    observer.observe(el);
  });
})();

// ── Count-Up Animation ──────────────────────────────────
(function() {
  const nums = document.querySelectorAll('.stat-num[data-count]');

  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const duration = 1800;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(ease * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach(n => countObserver.observe(n));
})();

// ── Smooth scroll for anchor links ─────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Hero particle emitter ───────────────────────────────
(function() {
  const container = document.getElementById('particles');
  if (!container) return;

  function createParticle() {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 6 + 2;
    const x = Math.random() * window.innerWidth;
    const duration = Math.random() * 6 + 4;
    const drift = (Math.random() - 0.5) * 80;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      bottom: -${size}px;
      animation-duration: ${duration}s;
      --drift: ${drift}px;
      animation-delay: ${Math.random() * 3}s;
    `;
    container.appendChild(p);
    setTimeout(() => p.remove(), (duration + 3) * 1000);
  }

  setInterval(createParticle, 500);
})();

// ── Parallax on hero blobs ─────────────────────────────
(function() {
  const hero = document.querySelector('.hero');
  const blobs = document.querySelectorAll('.blob');
  if (!blobs.length) return;

  document.addEventListener('mousemove', e => {
    const mx = (e.clientX / window.innerWidth - 0.5) * 30;
    const my = (e.clientY / window.innerHeight - 0.5) * 20;
    blobs.forEach((blob, i) => {
      const factor = (i + 1) * 0.4;
      blob.style.transform = `translate(${mx * factor}px, ${my * factor}px)`;
    });
  });
})();

// ── Sport cards 3D tilt effect ─────────────────────────
document.querySelectorAll('.sport-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(800px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── Pricing toggle ─────────────────────────────────────
document.getElementById('priceToggle')?.addEventListener('change', function() {
  const weekday = document.querySelectorAll('.price.weekday');
  const weekend = document.querySelectorAll('.price.weekend');
  weekday.forEach(el => el.classList.toggle('hidden', this.checked));
  weekend.forEach(el => el.classList.toggle('hidden', !this.checked));
});

// ── Add blobs to hero ──────────────────────────────────
(function() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  [1, 2, 3].forEach(i => {
    const blob = document.createElement('div');
    blob.className = `blob blob-${i}`;
    hero.appendChild(blob);
  });
})();

// ── Mobile nav style ───────────────────────────────────
const style = document.createElement('style');
style.textContent = `
  @media (max-width: 768px) {
    .nav-links.open {
      display: flex;
      flex-direction: column;
      position: fixed;
      inset: 0;
      background: rgba(255,255,255,0.97);
      backdrop-filter: blur(20px);
      z-index: 999;
      justify-content: center;
      align-items: center;
      gap: 32px;
    }
    .nav-links.open .nav-link {
      font-size: 1.5rem;
      font-weight: 700;
    }
    .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    .hamburger.open span:nth-child(2) { opacity: 0; }
    .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
  }
`;
document.head.appendChild(style);
