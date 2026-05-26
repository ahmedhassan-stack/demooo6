/**
 * ALFARIS GENERAL CONTRACTING
 * Main JavaScript — Navigation, Animations, Interactions
 */

'use strict';

/* ─── PAGE LOADER ─────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.querySelector('.page-loader');
    if (loader) loader.classList.add('hidden');
  }, 1200);
});

/* ─── NAVBAR ──────────────────────────────────────────────── */
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu__link');

// Scroll behavior
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  if (scrollY > 60) {
    navbar?.classList.add('navbar--scrolled');
    navbar?.classList.remove('navbar--transparent');
  } else {
    navbar?.classList.remove('navbar--scrolled');
    navbar?.classList.add('navbar--transparent');
  }

  lastScroll = scrollY;

  // Back to top visibility
  const backTop = document.querySelector('.back-top');
  if (backTop) {
    backTop.classList.toggle('visible', scrollY > 500);
  }
});

// Initialize transparent state
if (navbar) navbar.classList.add('navbar--transparent');

// Hamburger menu
hamburger?.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  mobileMenu?.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile menu on link click
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close on overlay click
mobileMenu?.addEventListener('click', (e) => {
  if (e.target === mobileMenu) {
    hamburger?.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// Active page highlight
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.navbar__link, .mobile-menu__link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* ─── SCROLL REVEAL ───────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ─── ANIMATED COUNTERS ───────────────────────────────────── */
function animateCounter(el, target, suffix = '') {
  const duration = 2000;
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  let step = 0;

  const timer = setInterval(() => {
    step++;
    current = Math.min(Math.round(increment * step), target);
    el.textContent = current.toLocaleString('ar-EG') + suffix;
    if (step >= steps) clearInterval(timer);
  }, duration / steps);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('[data-counter]').forEach(el => {
  counterObserver.observe(el);
});

/* ─── HERO BG PARALLAX ────────────────────────────────────── */
const heroBg = document.querySelector('.hero__bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.3}px)`;
  }, { passive: true });
}

/* ─── TESTIMONIALS SLIDER ─────────────────────────────────── */
const track = document.querySelector('.testimonials-track');
const prevBtn = document.querySelector('.slider-btn--prev');
const nextBtn = document.querySelector('.slider-btn--next');
const dots = document.querySelectorAll('.slider-dot');

if (track) {
  let currentIndex = 0;
  const cards = track.querySelectorAll('.testimonial-card');
  const visibleCount = () => window.innerWidth < 640 ? 1 : window.innerWidth < 1000 ? 2 : 3;
  const maxIndex = () => Math.max(0, cards.length - visibleCount());

  function goToSlide(idx) {
    currentIndex = Math.max(0, Math.min(idx, maxIndex()));
    const cardWidth = cards[0]?.offsetWidth + parseInt(getComputedStyle(track).gap) || 0;
    track.style.transform = `translateX(${currentIndex * cardWidth}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  }

  prevBtn?.addEventListener('click', () => goToSlide(currentIndex + 1));
  nextBtn?.addEventListener('click', () => goToSlide(currentIndex - 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goToSlide(i)));

  // Auto-play
  let autoSlide = setInterval(() => {
    const next = currentIndex >= maxIndex() ? 0 : currentIndex + 1;
    goToSlide(next);
  }, 5000);

  track.addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => {
      const next = currentIndex >= maxIndex() ? 0 : currentIndex + 1;
      goToSlide(next);
    }, 5000);
  });

  window.addEventListener('resize', () => goToSlide(currentIndex));
}

/* ─── PROJECT FILTER ──────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const masonryItems = document.querySelectorAll('.masonry-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    masonryItems.forEach(item => {
      if (filter === 'all' || item.dataset.cat === filter) {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        item.classList.remove('masonry-item--hidden');
        requestAnimationFrame(() => {
          item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        });
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        setTimeout(() => {
          item.classList.add('masonry-item--hidden');
        }, 350);
      }
    });
  });
});

/* ─── FAQ ACCORDION ───────────────────────────────────────── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
    });

    // Open clicked if was closed
    if (!isOpen) item.classList.add('open');
  });
});

/* ─── BACK TO TOP ─────────────────────────────────────────── */
document.querySelector('.back-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── SMOOTH ANCHOR SCROLLING ─────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10);
      window.scrollTo({
        top: target.offsetTop - offset,
        behavior: 'smooth',
      });
    }
  });
});

/* ─── HERO BG KENBURN ON LOAD ─────────────────────────────── */
window.addEventListener('load', () => {
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    heroBg.style.transform = 'scale(1)';
  }
});

/* ─── NEWSLETTER FORM HANDLER ─────────────────────────────── */
document.querySelectorAll('.footer__newsletter-form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    const btn = form.querySelector('button');
    if (input?.value.trim()) {
      btn.textContent = 'تم الاشتراك ✓';
      btn.style.background = '#2a7a2a';
      input.value = '';
      setTimeout(() => {
        btn.textContent = 'اشتراك';
        btn.style.background = '';
      }, 3000);
    }
  });
});

/* ─── CONTACT FORM HANDLER ────────────────────────────────── */
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    btn.textContent = '...جاري الإرسال';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'تم إرسال رسالتك بنجاح ✓';
      btn.style.background = 'linear-gradient(135deg, #2a7a2a, #3a9a3a)';
      contactForm.reset();

      setTimeout(() => {
        btn.textContent = 'إرسال الرسالة';
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    }, 1500);
  });
}

/* ─── STAGGER REVEAL ON GRIDS ─────────────────────────────── */
document.querySelectorAll('.services-grid, .why-grid, .values-grid, .team-grid').forEach(grid => {
  const children = grid.querySelectorAll(':scope > *');
  children.forEach((child, i) => {
    child.classList.add('reveal');
    child.classList.add(`reveal-delay-${Math.min(i + 1, 5)}`);
    revealObserver.observe(child);
  });
});

/* ─── CURSOR EFFECT ON SERVICE CARDS ──────────────────────── */
document.querySelectorAll('.service-card, .project-card, .why-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 3;
    const rotateY = ((x - centerX) / centerX) * -3;

    card.style.transform = `translateY(-6px) perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ─── RESIZE HANDLER ──────────────────────────────────────── */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Recalculate anything needed
  }, 200);
});
