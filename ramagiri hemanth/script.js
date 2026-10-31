/* ── GSAP CDN FALLBACKS ──────────────────────────────────────── */
function loadGSAPFromCDN() {
  const s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
  document.head.appendChild(s);
}
function loadScrollTriggerFromCDN() {
  const s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
  document.head.appendChild(s);
}

/* ── NAVBAR SCROLL ───────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  scrollTopBtn.classList.toggle('show', window.scrollY > 400);
  updateActiveNav();
});

/* ── ACTIVE NAV LINK ─────────────────────────────────────────── */
function updateActiveNav() {
  const sections = ['about', 'skills', 'projects', 'education', 'contact'];
  const links = document.querySelectorAll('.nav-links a');
  let current = '';

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) current = id;
  });

  links.forEach(a => {
    a.classList.toggle('active', a.getAttribute('data-section') === current);
  });
}

/* ── MOBILE MENU ─────────────────────────────────────────────── */
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const ham  = document.getElementById('hamburger');
  menu.classList.toggle('open');
  ham.classList.toggle('open');
}

/* ── TYPING ANIMATION ────────────────────────────────────────── */
const phrases = [
  'Full Stack Developer',
  'Java Developer',
  'React Developer',
  'Spring Boot Developer',
  'Problem Solver'
];

let phraseIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
  const phrase = phrases[phraseIdx];

  if (!deleting) {
    typedEl.textContent = phrase.slice(0, ++charIdx);
    if (charIdx === phrase.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
    setTimeout(type, 80);
  } else {
    typedEl.textContent = phrase.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(type, 400);
      return;
    }
    setTimeout(type, 45);
  }
}

setTimeout(type, 600);

/* ── SCROLL REVEAL (Intersection Observer) ───────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 0);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── SEND MESSAGE (demo) ─────────────────────────────────────── */
function handleSend() {
  const btn = event.currentTarget;
  btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
  btn.style.background = 'linear-gradient(135deg,#059669,#10b981)';
  setTimeout(() => {
    btn.innerHTML = 'Send Message <i class="fas fa-paper-plane" style="font-size:.85rem;"></i>';
    btn.style.background = '';
  }, 3000);
}

/* ── SMOOTH ANCHOR NAVIGATION ────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ══════════════════════════════════════════════════════════════
   GSAP ANIMATIONS — runs after all scripts load
══════════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ── HERO ENTRANCE ──────────────────────────────────────────── */
  gsap.fromTo('.hero-left .reveal',
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: .9, stagger: .12, ease: 'power3.out', delay: .2 }
  );

  gsap.fromTo('.hero-right.reveal',
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: .9 }
  );

  /* ── SCROLL REVEALS ─────────────────────────────────────────── */
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.utils.toArray('section:not(#hero) .reveal').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: .45, ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 95%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

  /* ════════════════════════════════════════════════════════════
     1. PROJECT CARDS — 3D mouse-tracking tilt + glow under card
     Matches the reference: card tilts toward cursor, purple
     shadow blooms beneath, image inside scales up slightly.
  ════════════════════════════════════════════════════════════ */
  document.querySelectorAll('.project-card').forEach(card => {
    const MAX_TILT = 14;       // max degrees of rotation
    const LIFT     = -12;      // px upward lift on hover
    let glowEl = null;

    // Create a persistent under-glow element per card
    const glow = document.createElement('div');
    glow.className = 'card-glow';
    card.appendChild(glow);
    glowEl = glow;

    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        z: 40,
        scale: 1.03,
        duration: .35,
        ease: 'power2.out'
      });
      gsap.to(glowEl, { opacity: 1, duration: .35 });
    });

    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = e.clientX - cx;
      const dy     = e.clientY - cy;
      const rotY   =  (dx / (rect.width  / 2)) * MAX_TILT;
      const rotX   = -(dy / (rect.height / 2)) * MAX_TILT;

      gsap.to(card, {
        rotationY: rotY,
        rotationX: rotX,
        y: LIFT,
        duration: .25,
        ease: 'power2.out',
        transformPerspective: 900,
        transformOrigin: 'center center'
      });

      // Shift the glow to follow the cursor
      const glowX = ((dx / rect.width)  + 0.5) * 100;
      const glowY = ((dy / rect.height) + 0.5) * 100;
      gsap.to(glowEl, {
        background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(123,46,255,.55) 0%, transparent 65%)`,
        duration: .2
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        y: 0,
        z: 0,
        scale: 1,
        duration: .55,
        ease: 'elastic.out(1, 0.55)'
      });
      gsap.to(glowEl, { opacity: 0, duration: .4 });
    });
  });

  /* ════════════════════════════════════════════════════════════
     2. SKILL CARDS — gentle 3D tilt (milder than project cards)
     + border lights up as a sweep of purple on hover
  ════════════════════════════════════════════════════════════ */
  document.querySelectorAll('.skill-card').forEach(card => {
    const MAX_TILT = 8;

    card.addEventListener('mouseenter', () => {
      gsap.to(card, { scale: 1.03, duration: .3, ease: 'power2.out' });
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const rotY =  ((e.clientX - cx) / (rect.width  / 2)) * MAX_TILT;
      const rotX = -((e.clientY - cy) / (rect.height / 2)) * MAX_TILT;

      gsap.to(card, {
        rotationY: rotY,
        rotationX: rotX,
        y: -6,
        duration: .2,
        ease: 'power2.out',
        transformPerspective: 800,
        transformOrigin: 'center center'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        y: 0,
        scale: 1,
        duration: .5,
        ease: 'elastic.out(1, 0.6)'
      });
    });
  });

  /* ════════════════════════════════════════════════════════════
     3. SKILL PILLS — springy pop on hover (bounce scale)
     matching the reference site's pill icon bounce
  ════════════════════════════════════════════════════════════ */
  document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('mouseenter', () => {
      gsap.fromTo(pill,
        { scale: 1 },
        { scale: 1.18, duration: .18, ease: 'back.out(2.5)', yoyo: false }
      );
      // Also wiggle the icon inside
      const icon = pill.querySelector('.pill-icon, i');
      if (icon) {
        gsap.fromTo(icon,
          { rotation: 0 },
          { rotation: -15, duration: .15, ease: 'power2.out',
            onComplete: () => gsap.to(icon, { rotation: 0, duration: .3, ease: 'elastic.out(1.5, 0.4)' })
          }
        );
      }
    });

    pill.addEventListener('mouseleave', () => {
      gsap.to(pill, { scale: 1, duration: .35, ease: 'elastic.out(1, 0.5)' });
    });
  });

  /* ════════════════════════════════════════════════════════════
     4. PROFILE IMAGE — 3D tilt follows cursor (matches the
     reference's "leaning into" hover effect on the circle photo)
  ════════════════════════════════════════════════════════════ */
  const profileWrap = document.querySelector('.profile-wrap');
  const profileImg  = document.querySelector('.profile-img-container');

  if (profileWrap && profileImg) {
    profileWrap.addEventListener('mousemove', (e) => {
      const rect = profileWrap.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const rotY =  ((e.clientX - cx) / (rect.width  / 2)) * 12;
      const rotX = -((e.clientY - cy) / (rect.height / 2)) * 12;

      gsap.to(profileImg, {
        rotationY: rotY,
        rotationX: rotX,
        scale: 1.06,
        duration: .3,
        ease: 'power2.out',
        transformPerspective: 700,
        transformOrigin: 'center center'
      });
    });

    profileWrap.addEventListener('mouseleave', () => {
      gsap.to(profileImg, {
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        duration: .6,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  }

  /* ════════════════════════════════════════════════════════════
     5. NAV LINKS — subtle letter float on hover
  ════════════════════════════════════════════════════════════ */
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('mouseenter', () => {
      gsap.to(link, { y: -2, duration: .2, ease: 'power2.out' });
    });
    link.addEventListener('mouseleave', () => {
      gsap.to(link, { y: 0, duration: .3, ease: 'elastic.out(1, 0.5)' });
    });
  });

  /* ════════════════════════════════════════════════════════════
     6. BUTTONS — magnetic pull toward cursor on hover
  ════════════════════════════════════════════════════════════ */
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx   = e.clientX - (rect.left + rect.width  / 2);
      const dy   = e.clientY - (rect.top  + rect.height / 2);

      gsap.to(btn, {
        x: dx * 0.22,
        y: dy * 0.22,
        duration: .3,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: .5, ease: 'elastic.out(1, 0.4)' });
    });
  });

  /* ════════════════════════════════════════════════════════════
     7. TIMELINE CARDS — slide in from alternating sides
     (staggered, triggers on scroll)
  ════════════════════════════════════════════════════════════ */
  if (typeof ScrollTrigger !== 'undefined') {
    document.querySelectorAll('.timeline-item').forEach((item, i) => {
      const fromLeft = i % 2 === 0;
      gsap.fromTo(item.querySelector('.timeline-card'),
        { opacity: 0, x: fromLeft ? -40 : 40 },
        {
          opacity: 1, x: 0, duration: .45, ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 95%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

  /* ════════════════════════════════════════════════════════════
     8. ABOUT MINI-CARDS — flip in on scroll (Y-axis flip)
  ════════════════════════════════════════════════════════════ */
  if (typeof ScrollTrigger !== 'undefined') {
    document.querySelectorAll('.about-cards-grid .skill-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, rotationY: -90, scale: 0.85 },
        {
          opacity: 1, rotationY: 0, scale: 1,
          duration: .45, ease: 'back.out(1.4)',
          delay: i * 0.07,
          transformPerspective: 600,
          scrollTrigger: {
            trigger: card,
            start: 'top 95%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

  /* ════════════════════════════════════════════════════════════
     9. SECTION TITLES — character stagger reveal on scroll
  ════════════════════════════════════════════════════════════ */
  if (typeof ScrollTrigger !== 'undefined') {
    document.querySelectorAll('.section-title').forEach(title => {
      gsap.fromTo(title,
        { opacity: 0, y: 20, letterSpacing: '8px' },
        {
          opacity: 1, y: 0, letterSpacing: '4px',
          duration: .45, ease: 'power3.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 95%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

});