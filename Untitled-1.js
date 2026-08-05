/* =========================================================
   SAMUEL.DEV — Landing Page
   JS: menú móvil, header al hacer scroll, reveal on scroll,
   contadores animados, mockup del hero, back-to-top,
   formulario de contacto vía WhatsApp.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header: sombra/fondo al hacer scroll ---------- */
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const scrolled = window.scrollY > 30;
    header.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('is-visible', window.scrollY > 480);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');

  function closeMobileNav() {
    mobileNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  /* ---------- Volver arriba ---------- */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Animación al aparecer en pantalla ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Contadores animados ---------- */
  const counters = document.querySelectorAll('.stat__number');

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  /* ---------- Mockup del hero: carrusel por tipo de negocio ---------- */
  const panels = document.querySelectorAll('.mock-panel');
  const dotsWrap = document.getElementById('browserDots');
  const urlLabel = document.getElementById('browserUrl');
  const urlMap = {
    restaurante: 'samuel.dev/restaurante',
    barberia: 'samuel.dev/barberia',
    hotel: 'samuel.dev/hotel',
    tienda: 'samuel.dev/tienda'
  };

  let activeIndex = 0;
  let mockTimer;

  if (panels.length && dotsWrap) {
    panels.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Mostrar ejemplo ' + (i + 1));
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', () => setActivePanel(i, true));
      dotsWrap.appendChild(dot);
    });

    function setActivePanel(index, userTriggered) {
      panels[activeIndex].classList.remove('is-active');
      dotsWrap.children[activeIndex].classList.remove('is-active');

      activeIndex = index;

      panels[activeIndex].classList.add('is-active');
      dotsWrap.children[activeIndex].classList.add('is-active');

      const key = panels[activeIndex].dataset.panel;
      if (urlLabel && urlMap[key]) {
        urlLabel.style.opacity = 0;
        setTimeout(() => {
          urlLabel.textContent = urlMap[key];
          urlLabel.style.opacity = 1;
        }, 150);
      }

      if (userTriggered) restartAutoplay();
    }

    function nextPanel() {
      setActivePanel((activeIndex + 1) % panels.length, false);
    }

    function restartAutoplay() {
      clearInterval(mockTimer);
      mockTimer = setInterval(nextPanel, 3200);
    }

    restartAutoplay();
  }

  /* ---------- Formulario de contacto → WhatsApp ---------- */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = contactForm.nombre.value.trim();
      const negocio = contactForm.negocio.value.trim();
      const mensaje = contactForm.mensaje.value.trim();

      let text = `Hola Samuel, soy ${nombre}.`;
      if (negocio) text += ` Tengo un negocio de tipo: ${negocio}.`;
      text += ` ${mensaje}`;

      const url = `https://wa.me/573116775666?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener');
    });
  }

});