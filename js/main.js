/**
 * GEE33 Website Scripts
 * Your Edge, Engineered.
 */

(function() {
  'use strict';

  // ============================================================================
  // CUSTOM CURSOR
  // ============================================================================
  const initCursor = () => {
    const ring = document.getElementById('cursorRing');
    const dot = document.getElementById('cursorDot');
    
    if (!ring || !dot) return;
    
    // Check if touch device
    if ('ontouchstart' in window) {
      ring.style.display = 'none';
      dot.style.display = 'none';
      return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let dotX = 0;
    let dotY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animateCursor = () => {
      // Smooth follow with different speeds
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      dotX += (mouseX - dotX) * 0.25;
      dotY += (mouseY - dotY) * 0.25;

      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      dot.style.left = dotX + 'px';
      dot.style.top = dotY + 'px';

      requestAnimationFrame(animateCursor);
    };

    animateCursor();

    // Hover states
    const hoverTargets = 'a, button, .work-item, .why-card, .service-card, [data-cursor-hover]';
    
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) {
        ring.classList.add('hovering');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) {
        ring.classList.remove('hovering');
      }
    });
  };

  // ============================================================================
  // NAVIGATION
  // ============================================================================
  const initNav = () => {
    const nav = document.getElementById('nav');
    if (!nav) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      
      // Add scrolled class
      nav.classList.toggle('scrolled', currentScroll > 60);
      
      // Optional: Hide nav on scroll down, show on scroll up
      // if (currentScroll > lastScroll && currentScroll > 200) {
      //   nav.style.transform = 'translateY(-100%)';
      // } else {
      //   nav.style.transform = 'translateY(0)';
      // }
      
      lastScroll = currentScroll;
    }, { passive: true });

    // Mobile nav toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
      });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
          const offset = nav.offsetHeight + 20;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Close mobile nav if open
          if (navLinks) navLinks.classList.remove('active');
          if (navToggle) navToggle.classList.remove('active');
        }
      });
    });
  };

  // ============================================================================
  // BACKGROUND ORB ANIMATIONS
  // ============================================================================
  const initBackgroundOrbs = () => {
    const orb1 = document.getElementById('orb1');
    const orb2 = document.getElementById('orb2');
    const orb3 = document.getElementById('orb3');
    
    if (!orb1 || !orb2 || !orb3) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animateOrbs = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      
      // Calculate mouse offset from center
      const orbMouseX = (mouseX - vw / 2) * 0.02;
      const orbMouseY = (mouseY - vh / 2) * 0.01;
      
      // Orb 1: Follows mouse slightly, moves down with scroll
      orb1.style.transform = `translate(${orbMouseX}px, ${scrollY * 0.25 + orbMouseY}px)`;
      
      // Orb 2: Opposite mouse movement, different scroll speed
      orb2.style.transform = `translate(${-orbMouseX * 0.8}px, ${scrollY * 0.12 - vh * 0.2}px)`;
      
      // Orb 3: Subtle movement
      orb3.style.transform = `translateY(${scrollY * 0.08}px)`;

      requestAnimationFrame(animateOrbs);
    };

    animateOrbs();
  };

  // ============================================================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================================================
  const initRevealAnimations = () => {
    const reveals = document.querySelectorAll('[data-reveal], .reveal');
    
    if (!reveals.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Stagger children if they exist
          const children = entry.target.querySelectorAll('[data-reveal-child]');
          children.forEach((child, index) => {
            child.style.transitionDelay = `${index * 0.1}s`;
            child.classList.add('visible');
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    reveals.forEach(el => observer.observe(el));
  };

  // ============================================================================
  // FORM HANDLING
  // ============================================================================
  const initForms = () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
          </svg>
          Sending...
        `;
        
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
          // Simulate API call - replace with actual endpoint
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Success state
          submitBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Sent!
          `;
          
          form.reset();
          
          // Reset button after delay
          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
          }, 3000);
          
        } catch (error) {
          // Error state
          submitBtn.innerHTML = 'Error - Try again';
          submitBtn.disabled = false;
          
          setTimeout(() => {
            submitBtn.innerHTML = originalText;
          }, 3000);
        }
      });
    });
  };

  // ============================================================================
  // WORK ITEM HOVER EFFECTS
  // ============================================================================
  const initWorkItems = () => {
    const workItems = document.querySelectorAll('.work-item');
    
    workItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        // Add any additional hover effects here
      });
      
      item.addEventListener('mouseleave', () => {
        // Reset effects
      });
    });
  };

  // ============================================================================
  // COUNTER ANIMATION
  // ============================================================================
  const initCounters = () => {
    const counters = document.querySelectorAll('[data-counter]');
    
    if (!counters.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const animateCounter = (element, target, suffix = '') => {
      const duration = 2000;
      const start = 0;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * (target - start) + start);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target + suffix;
        }
      };

      requestAnimationFrame(updateCounter);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.counter, 10);
          const suffix = entry.target.dataset.suffix || '';
          animateCounter(entry.target, target, suffix);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
  };

  // ============================================================================
  // MAGNETIC BUTTON EFFECT
  // ============================================================================
  const initMagneticButtons = () => {
    const buttons = document.querySelectorAll('[data-magnetic]');
    
    buttons.forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
      });
    });
  };

  // ============================================================================
  // LAZY LOADING IMAGES
  // ============================================================================
  const initLazyLoading = () => {
    const images = document.querySelectorAll('img[data-src]');
    
    if (!images.length) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });

    images.forEach(img => imageObserver.observe(img));
  };

  // ============================================================================
  // PRELOADER
  // ============================================================================
  const initPreloader = () => {
    const preloader = document.querySelector('.preloader');
    
    if (!preloader) return;

    window.addEventListener('load', () => {
      preloader.classList.add('loaded');
      
      setTimeout(() => {
        preloader.remove();
      }, 500);
    });
  };

  // ============================================================================
  // INITIALIZE ALL
  // ============================================================================
  const init = () => {
    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAll);
    } else {
      initAll();
    }
  };

  const initAll = () => {
    initCursor();
    initNav();
    initBackgroundOrbs();
    initRevealAnimations();
    initForms();
    initWorkItems();
    initCounters();
    initMagneticButtons();
    initLazyLoading();
    initPreloader();
    
    // Log init
    console.log('🚀 GEE33 Website Initialized');
  };

  // Start
  init();

})();
