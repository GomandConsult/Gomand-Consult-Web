// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
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
