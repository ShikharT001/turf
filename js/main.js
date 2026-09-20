/* ═════════════════════════════════════════
   main.js — Miscellaneous interactions,
   contact form, nav, and global setup
═════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Contact form ──────────────────────────────────────
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        showToast('✉️ Your message has been sent successfully!', 'success');

        setTimeout(() => {
          btn.innerHTML = original;
          btn.disabled = false;
          btn.style.background = '';
          contactForm.reset();
        }, 3000);
      }, 1500);
    });
  }

  // ── Newsletter form ───────────────────────────────────
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.querySelector('button').addEventListener('click', () => {
      const input = newsletterForm.querySelector('input');
      if (!input.value.trim() || !input.value.includes('@')) {
        showToast('⚠️ Please enter a valid email', 'warning');
        return;
      }
      showToast('🎉 Subscribed! Welcome to GreenField.', 'success');
      input.value = '';
    });
  }

  // ── Gallery hover lift ───────────────────────────────
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const title = item.dataset.title;
      showToast(`📸 ${title}`, 'default');
    });
  });

  // ── Hero 3D card parallax ─────────────────────────────
  const heroCard = document.getElementById('hero3dCard');
  if (heroCard) {
    document.addEventListener('mousemove', e => {
      const mx = (e.clientX / window.innerWidth - 0.5) * 20;
      const my = (e.clientY / window.innerHeight - 0.5) * 15;
      heroCard.style.transform = `perspective(1200px) rotateY(${mx}deg) rotateX(${-my}deg)`;
    });
    document.addEventListener('mouseleave', () => {
      heroCard.style.transform = '';
    });
  }

  // ── Smooth section reveal with stagger ───────────────
  const staggerContainers = [
    '.sports-grid',
    '.facilities-bento',
    '.pricing-grid',
    '.gallery-grid',
    '.contact-cards'
  ];

  staggerContainers.forEach(sel => {
    const container = document.querySelector(sel);
    if (!container) return;
    container.classList.add('reveal-stagger');
    Array.from(container.children).forEach((child, i) => {
      child.style.setProperty('--delay', `${i * 0.08}s`);
      child.classList.add('reveal-up');
    });
  });

  // ── Sport card booking links ──────────────────────────
  document.querySelectorAll('[data-sport]').forEach(el => {
    el.addEventListener('click', () => {
      const sport = el.dataset.sport;
      // Pre-select sport in booking section
      const radio = document.querySelector(`input[name="sport"][value="${sport}"]`);
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change'));
      }
    });
  });

  // ── Bento card hover glow ────────────────────────────
  document.querySelectorAll('.bento-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.15), rgba(255,255,255,0.07) 50%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

  // ── WhatsApp float tooltip ────────────────────────────
  const waBtn = document.querySelector('.whatsapp-float');
  if (waBtn) {
    // Re-init cursor hover
    waBtn.addEventListener('mouseenter', () => {
      document.querySelector('.cursor-dot')?.classList.add('hovered');
      document.querySelector('.cursor-outline')?.classList.add('hovered');
    });
    waBtn.addEventListener('mouseleave', () => {
      document.querySelector('.cursor-dot')?.classList.remove('hovered');
      document.querySelector('.cursor-outline')?.classList.remove('hovered');
    });
  }

  // ── Smooth anchor nav scroll ─────────────────────────
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const navLinksEl = document.getElementById('navLinks');
      navLinksEl.classList.remove('open');
      document.getElementById('hamburger').classList.remove('open');
      document.getElementById('navbar').classList.remove('menu-open');
    });
  });

  // ── Page title update on scroll ───────────────────────
  const sections = {
    home: 'GreenField Turf | Premium Sports Facility',
    about: 'About Us | GreenField Turf',
    facilities: 'Facilities | GreenField Turf',
    booking: 'Book a Slot | GreenField Turf',
    reviews: 'Reviews | GreenField Turf',
    contact: 'Contact | GreenField Turf'
  };
  const titleObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && sections[entry.target.id]) {
        document.title = sections[entry.target.id];
      }
    });
  }, { threshold: 0.5 });

  Object.keys(sections).forEach(id => {
    const el = document.getElementById(id);
    if (el) titleObserver.observe(el);
  });

  // ── Rating bars animation on scroll ──────────────────
  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.bar-fill').forEach(bar => {
          bar.style.animation = 'barGrow 1s ease both';
        });
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const ratingBars = document.querySelector('.rating-bars');
  if (ratingBars) barObserver.observe(ratingBars);

  // ── Keyboard navigation ───────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.getElementById('navLinks').classList.remove('open');
      document.getElementById('hamburger').classList.remove('open');
    }
  });

  console.log('%cGreenField Turf 🌿', 'color: #22c55e; font-size: 24px; font-weight: bold;');
  console.log('%cPremium Sports Facility Website', 'color: #4ade80; font-size: 14px;');
});
