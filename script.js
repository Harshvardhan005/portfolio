/* ============================================================
   HARSHVARDHAN K  —  Portfolio Scripts
   Preloader · Cursor · Nav · Typewriter · Reveal ·
   Counter · Magnetic · Smooth-scroll · Photo fallback
   ============================================================ */

'use strict';

/* ── helpers ─────────────────────────────────────────── */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const ease = (t) => 1 - Math.pow(1 - t, 3); // ease-out cubic

/* ══════════════════════════════════════════════════════
   1. PRELOADER
   ══════════════════════════════════════════════════════ */
(function preloader() {
  const loader   = qs('#preloader');
  const MIN_MS   = 1700;          // minimum display time
  const startAt  = Date.now();

  function revealPage() {
    const wait = Math.max(0, MIN_MS - (Date.now() - startAt));
    setTimeout(() => {
      loader.classList.add('gone');
      /* animate hero text in */
      qsa('.ai').forEach(el => el.classList.add('in'));
      /* start typewriter after a beat */
      setTimeout(typewriter, 650);
    }, wait);
  }

  if (document.readyState === 'complete') {
    revealPage();
  } else {
    window.addEventListener('load', revealPage, { once: true });
    /* hard fallback */
    setTimeout(revealPage, 4500);
  }
})();

/* ══════════════════════════════════════════════════════
   2. CUSTOM CURSOR  (desktop / pointer only)
   ══════════════════════════════════════════════════════ */
(function cursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot  = qs('#cur-dot');
  const ring = qs('#cur-ring');
  if (!dot || !ring) return;

  let mx = -200, my = -200;
  let rx = -200, ry = -200;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  (function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  })();

  /* hover class on interactive elements */
  const targets = 'a, button, .sk-chip, .card, .yt-card, .yt-filter-btn, .yt-play-btn, .yt-act-btn, .yt-expand-btn, .contact-email, .soc-btn';
  qsa(targets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('ch'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('ch'));
  });
})();

/* ══════════════════════════════════════════════════════
   3. NAVIGATION  (scroll state + mobile menu)
   ══════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════
   3. NAVIGATION  (scroll state + mobile menu)
   ══════════════════════════════════════════════════════ */
(function nav() {
  const navEl  = qs('#nav');
  const burger = qs('#burger');
  const mobNav = qs('#mob-nav');
  let open = false;

  /* scroll state */
  window.addEventListener('scroll', () => {
    navEl.classList.toggle('scrolled', window.scrollY > 44);
  }, { passive: true });

  /* toggle mobile menu */
  function setMenu(state) {
    open = state;
    burger.setAttribute('aria-expanded', String(state));
    mobNav.setAttribute('aria-hidden', String(!state));
    mobNav.classList.toggle('open', state);
    burger.setAttribute('aria-label', state ? 'Close navigation menu' : 'Open navigation menu');
    document.body.style.overflow = state ? 'hidden' : '';
  }

  burger.addEventListener('click', () => setMenu(!open));

  qsa('.mob-link, .mob-soc-icon, .mob-email-link').forEach(l => {
    l.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) setMenu(false);
  });
})();

/* ══════════════════════════════════════════════════════
   4. TYPEWRITER  — cycles through role titles
   ══════════════════════════════════════════════════════ */
function typewriter() {
  const el = qs('#role-text');
  if (!el) return;

  const roles   = ['Video Editor', 'Content Creator', 'Reel Maker'];
  let rIdx = 0, cIdx = 0, deleting = false;

  function tick() {
    const role = roles[rIdx];
    if (!deleting) {
      cIdx++;
      el.textContent = role.slice(0, cIdx);
      if (cIdx === role.length) {
        deleting = true;
        return setTimeout(tick, 2400);
      }
    } else {
      cIdx--;
      el.textContent = role.slice(0, cIdx);
      if (cIdx === 0) {
        deleting = false;
        rIdx = (rIdx + 1) % roles.length;
        return setTimeout(tick, 420);
      }
    }
    setTimeout(tick, deleting ? 52 : 92);
  }
  tick();
}

/* ══════════════════════════════════════════════════════
   5. SCROLL REVEAL  (IntersectionObserver)
   ══════════════════════════════════════════════════════ */
(function scrollReveal() {
  const isMobile = window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');

      // Trigger high-end luminous shimmer sweep on cards when revealed
      if (entry.target.classList.contains('card') || entry.target.classList.contains('yt-card')) {
        entry.target.classList.add('shimmer-active');
        setTimeout(() => entry.target.classList.remove('shimmer-active'), 1400);
      }

      obs.unobserve(entry.target);
    });
  }, {
    threshold: isMobile ? 0.05 : 0.12,
    rootMargin: isMobile ? '0px 0px -15px 0px' : '0px 0px -40px 0px'
  });

  qsa('.reveal').forEach(el => obs.observe(el));
})();

/* ══════════════════════════════════════════════════════
   6. COUNTER ANIMATION  (for stats)
   ══════════════════════════════════════════════════════ */
(function counters() {
  const isMobile = window.innerWidth <= 768;
  const cObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.done) return;
      el.dataset.done = '1';
      cObs.unobserve(el);

      const target   = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const startT   = performance.now();

      (function update(now) {
        const t      = Math.min((now - startT) / duration, 1);
        el.textContent = Math.round(ease(t) * target);
        if (t < 1) {
          requestAnimationFrame(update);
        } else {
          el.closest('.stat-val')?.classList.add('counted');
        }
      })(startT);
    });
  }, { threshold: isMobile ? 0.2 : 0.55 });

  qsa('.stat-n').forEach(el => cObs.observe(el));
})();

/* ══════════════════════════════════════════════════════
   7. MAGNETIC BUTTONS  (subtle attraction on hover)
   ══════════════════════════════════════════════════════ */
(function magnetic() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const targets = '.btn, .soc-btn, .top-link, .nav-brand, .yt-play-btn, .yt-expand-btn';
  qsa(targets).forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r  = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * 0.22;
      const dy = (e.clientY - r.top  - r.height / 2) * 0.22;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
})();

/* ══════════════════════════════════════════════════════
   7.5 INTERACTIVE 3D CARD TILT (desktop)
   ══════════════════════════════════════════════════════ */
(function cardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  qsa('.card, .yt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (card.querySelector('.yt-thumb-wrap.is-playing')) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const rotX = ((y - midY) / midY) * -5;
      const rotY = ((x - midX) / midX) * 5;
      card.style.transition = 'transform 0.12s ease-out, border-color .35s, box-shadow .45s';
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      if (card.querySelector('.yt-thumb-wrap.is-playing')) return;
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color .35s, box-shadow .45s';
      card.style.transform = '';
    });
  });
})();

/* ══════════════════════════════════════════════════════
   7.6 MOBILE TACTILE TOUCH & 3D INTERACTION
   ══════════════════════════════════════════════════════ */
(function mobileInteractions() {
  const touchTargets = qsa('.btn, .soc-btn, .sk-chip, .card, .yt-card, .yt-filter-btn, .yt-play-btn, .yt-act-btn, .yt-expand-btn, .top-link, .burger, .mob-link');

  touchTargets.forEach(el => {
    el.addEventListener('touchstart', () => {
      el.classList.add('touch-press');
    }, { passive: true });

    el.addEventListener('touchend', () => {
      setTimeout(() => el.classList.remove('touch-press'), 160);
    }, { passive: true });

    el.addEventListener('touchcancel', () => {
      el.classList.remove('touch-press');
    }, { passive: true });
  });

  /* Mobile card tactile 3D touch response */
  const cards = qsa('.card, .yt-card');
  cards.forEach(card => {
    let isTouching = false;

    card.addEventListener('touchstart', (e) => {
      if (card.querySelector('.yt-thumb-wrap.is-playing')) return;
      if (e.touches.length !== 1) return;
      isTouching = true;
      const touch = e.touches[0];
      const rect = card.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const rotX = ((y - midY) / midY) * -3.5;
      const rotY = ((x - midX) / midX) * 3.5;

      card.style.transition = 'transform 0.15s ease-out, box-shadow 0.25s';
      card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(0.985)`;
    }, { passive: true });

    card.addEventListener('touchmove', (e) => {
      if (!isTouching || card.querySelector('.yt-thumb-wrap.is-playing')) return;
      const touch = e.touches[0];
      const rect = card.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      if (x < -20 || x > rect.width + 20 || y < -20 || y > rect.height + 20) {
        card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s';
        card.style.transform = '';
        isTouching = false;
        return;
      }

      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const rotX = ((y - midY) / midY) * -3;
      const rotY = ((x - midX) / midX) * 3;
      card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(0.985)`;
    }, { passive: true });

    const resetCard = () => {
      if (!isTouching) return;
      isTouching = false;
      card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s';
      card.style.transform = '';
    };

    card.addEventListener('touchend', resetCard, { passive: true });
    card.addEventListener('touchcancel', resetCard, { passive: true });
  });
})();

/* ══════════════════════════════════════════════════════
   8. SMOOTH SCROLL  (offset for fixed nav)
   ══════════════════════════════════════════════════════ */
(function smoothScroll() {
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = qs(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
        10
      ) || 68;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ══════════════════════════════════════════════════════
   9. PROFILE PHOTO FALLBACK
      If assets/photo.jpg doesn't load, show initials
   ══════════════════════════════════════════════════════ */
(function photoFallback() {
  const img   = qs('#profile-img');
  const frame = qs('#photo-frame');
  if (!img || !frame) return;

  img.addEventListener('error', () => {
    img.remove();
    frame.classList.add('err');
    const div = document.createElement('div');
    div.className = 'photo-initials';
    div.setAttribute('aria-hidden', 'true');
    div.textContent = 'HV';
    frame.appendChild(div);
  });
})();

/* ══════════════════════════════════════════════════════
   10. ACTIVE NAV HIGHLIGHT  (highlights current section)
   ══════════════════════════════════════════════════════ */
(function activeNav() {
  const sections = qsa('section[id]');
  const links    = qsa('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    links.forEach(l => {
      const active = l.getAttribute('href') === `#${current}`;
      l.style.color = active ? 'var(--txt)' : '';
    });
  }, { passive: true });
})();

/* ══════════════════════════════════════════════════════
   11. YOUTUBE VIDEO SHOWCASE & THEATER MODAL
   ══════════════════════════════════════════════════════ */
(function ytShowcase() {
  const modal          = qs('#yt-modal');
  const modalBackdrop  = qs('#yt-modal-backdrop');
  const modalClose     = qs('#yt-modal-close');
  const modalSlot      = qs('#yt-modal-player-slot');
  const modalTitle     = qs('#yt-modal-title');
  const modalClient    = qs('#yt-modal-client');
  const modalYtBtn     = qs('#yt-modal-yt-btn');
  const filterBtns     = qsa('.yt-filter-btn');
  const cards          = qsa('.yt-card');

  /* Helper to stop all playing inline videos */
  function stopAllInline() {
    qsa('.yt-thumb-wrap.is-playing').forEach(wrap => {
      wrap.classList.remove('is-playing');
      const slot = wrap.querySelector('.yt-player-slot');
      if (slot) slot.innerHTML = '';
      const card = wrap.closest('.yt-card');
      if (card) card.style.transform = '';
    });
  }

  /* Play inline inside card */
  function playInline(wrap) {
    if (!wrap) return;
    const videoId = wrap.dataset.videoId;
    if (!videoId) return;

    /* Stop other playing videos first */
    qsa('.yt-thumb-wrap.is-playing').forEach(other => {
      if (other !== wrap) {
        other.classList.remove('is-playing');
        const s = other.querySelector('.yt-player-slot');
        if (s) s.innerHTML = '';
      }
    });

    const slot = wrap.querySelector('.yt-player-slot');
    if (!slot) return;

    wrap.classList.add('is-playing');
    slot.innerHTML = `
      <iframe
        class="yt-iframe"
        src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1"
        title="${wrap.dataset.title || 'YouTube Video'}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen>
      </iframe>
    `;
  }

  /* Open in Theater Lightbox Modal */
  function openModal(wrap) {
    if (!wrap || !modal) return;
    const videoId = wrap.dataset.videoId;
    const title   = wrap.dataset.title || 'YouTube Video';
    const client  = wrap.dataset.client || '';
    if (!videoId) return;

    /* Stop any active inline video so audio doesn't overlap */
    stopAllInline();

    if (modalTitle)  modalTitle.textContent  = title;
    if (modalClient) modalClient.textContent = client;
    if (modalYtBtn)  modalYtBtn.href         = `https://www.youtube.com/watch?v=${videoId}`;

    if (modalSlot) {
      modalSlot.innerHTML = `
        <iframe
          class="yt-iframe"
          src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1"
          title="${title}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen>
        </iframe>
      `;
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  /* Close Modal */
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    if (modalSlot) modalSlot.innerHTML = '';
    document.body.style.overflow = '';
  }

  if (modalClose)    modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });

  /* Card events */
  cards.forEach(card => {
    const wrap       = card.querySelector('.yt-thumb-wrap');
    const playBtn    = card.querySelector('.yt-play-btn');
    const actPlayBtn = card.querySelector('.yt-act-btn--play');
    const expandBtn  = card.querySelector('.yt-expand-btn');

    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playInline(wrap);
      });
    }

    if (actPlayBtn) {
      actPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playInline(wrap);
      });
    }

    if (wrap) {
      wrap.addEventListener('click', (e) => {
        if (wrap.classList.contains('is-playing')) return;
        if (e.target.closest('.yt-expand-btn')) return;
        playInline(wrap);
      });
    }

    if (expandBtn) {
      expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(wrap);
      });
    }
  });

  /* Category Filtering */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const cat = card.dataset.category;
        const matches = (filter === 'all' || cat === filter);
        if (matches) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96) translateY(12px)';
          setTimeout(() => {
            card.style.transition = 'opacity .4s var(--ease), transform .4s var(--ease)';
            card.style.opacity = '1';
            card.style.transform = '';
          }, 40);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ══════════════════════════════════════════════════════
   12. SCROLL PROGRESS BAR
   ══════════════════════════════════════════════════════ */
(function scrollProgressBar() {
  const bar = qs('#scroll-progress');
  if (!bar) return;

  function update() {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (docH <= 0) return;
    const progress = Math.min(100, Math.max(0, (window.scrollY / docH) * 100));
    bar.style.width = `${progress}%`;
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
})();

