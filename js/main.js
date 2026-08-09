// Cookie consent + Google Analytics (gtag.js only loads after explicit consent)
(function () {
  const GA_ID = 'G-GKBR42WWZ7';
  const CONSENT_KEY = 'gc_cookie_consent';

  function loadGA() {
    if (window.gcGaLoaded) return;
    window.gcGaLoaded = true;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }

  function showBanner() {
    if (document.querySelector('.cookie-banner')) return;
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Préférences cookies');
    const depthPrefix = (location.pathname.includes('/services/') || location.pathname.includes('/knowledge-lab/')) ? '../' : '';
    banner.innerHTML =
      '<p>Nous utilisons des cookies essentiels au fonctionnement du site et, avec votre accord, Google Analytics pour comprendre comment le site est utilisé. <a href="' +
      depthPrefix +
      'politique-cookies.html">En savoir plus</a>.</p>' +
      '<div class="cookie-banner-actions">' +
      '<button type="button" class="btn btn-ghost" data-cookie-action="decline">Refuser</button>' +
      '<button type="button" class="btn btn-primary" data-cookie-action="accept">Accepter</button>' +
      '</div>';
    document.body.appendChild(banner);
    banner.querySelector('[data-cookie-action="accept"]').addEventListener('click', () => {
      localStorage.setItem(CONSENT_KEY, 'accepted');
      banner.remove();
      loadGA();
    });
    banner.querySelector('[data-cookie-action="decline"]').addEventListener('click', () => {
      localStorage.setItem(CONSENT_KEY, 'declined');
      banner.remove();
    });
  }

  const consent = localStorage.getItem(CONSENT_KEY);
  if (consent === 'accepted') {
    loadGA();
  } else if (consent !== 'declined') {
    showBanner();
  }

  window.gcReopenCookieBanner = function () {
    const existing = document.querySelector('.cookie-banner');
    if (existing) existing.remove();
    showBanner();
  };
})();

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const cookiePrefsBtn = document.getElementById('cookie-prefs-btn');
  if (cookiePrefsBtn) {
    cookiePrefsBtn.addEventListener('click', () => window.gcReopenCookieBanner());
  }

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-desktop');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // Draw clarity-line elements when they enter viewport
  const lines = document.querySelectorAll('.clarity-line');
  if ('IntersectionObserver' in window && lines.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('drawn');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    lines.forEach((line) => observer.observe(line));
  } else {
    lines.forEach((line) => line.classList.add('drawn'));
  }

  // Parallax + growing glow for hero gradient blobs (blobs sharpen and brighten as you scroll into the hero)
  const blobs = document.querySelectorAll('.hero-blob');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (blobs.length && !prefersReducedMotion) {
    const speeds = [0.85, 0.4, 0.6];
    const baseOpacities = [0.5, 0.42, 0.38];

    let ticking = false;
    const updateParallax = () => {
      const y = window.scrollY;
      const progress = Math.min(1, y / 240);
      blobs.forEach((el, i) => {
        const py = y * speeds[i % speeds.length];
        const px = py * 0.45;
        el.style.translate = `${px.toFixed(1)}px ${py.toFixed(1)}px`;
        const opacity = Math.min(0.9, baseOpacities[i % baseOpacities.length] + progress * 0.32);
        const blur = Math.max(40, 70 - progress * 26);
        el.style.opacity = opacity.toFixed(2);
        el.style.filter = `blur(${blur.toFixed(0)}px)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }
});
