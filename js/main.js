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

  // Parallax for hero gradient blobs
  const blobs = document.querySelectorAll('.hero-blob');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (blobs.length && !prefersReducedMotion) {
    const speeds = [0.18, -0.12, 0.28];
    let ticking = false;
    const updateParallax = () => {
      const y = window.scrollY;
      blobs.forEach((el, i) => {
        el.style.setProperty('--py', (y * speeds[i % speeds.length]).toFixed(1) + 'px');
        el.style.setProperty('--px', (y * speeds[i % speeds.length] * 0.3).toFixed(1) + 'px');
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
