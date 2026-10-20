/**
 * BREW & BLOOM — Specialty Café Website
 * Vanilla JavaScript Implementation
 * Features: Mobile drawer navigation, Scrollspy, Menu filtering,
 * Form validation & receipt confirmation, Gallery lightbox, Story modal,
 * Scroll-triggered animations, Back-to-top, Dynamic copyright year.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Cache DOM Elements
     -------------------------------------------------------------------------- */
  const header = document.getElementById('header');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerLinks = document.querySelectorAll('.drawer-nav-link, .drawer-cta');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Menu Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');
  const menuCounter = document.getElementById('menu-counter');

  // Reservation Form
  const resForm = document.getElementById('reservation-form');
  const resConfirmation = document.getElementById('reservation-confirmation');
  const resetResBtn = document.getElementById('reset-res-btn');
  const resDateInput = document.getElementById('res-date');

  // Lightbox Modal
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const galleryItems = document.querySelectorAll('.gallery-item');

  // Story Modal
  const storyModalOverlay = document.getElementById('story-modal-overlay');
  const openStoryBtn = document.getElementById('open-story-modal-btn');
  const closeStoryBtn = document.getElementById('story-modal-close');
  const modalReserveBtn = document.getElementById('modal-reserve-btn');

  // Utilities
  const backToTopBtn = document.getElementById('back-to-top-btn');
  const floatingBackToTopBtn = document.getElementById('floating-back-to-top');
  const currentYearSpan = document.getElementById('current-year');

  /* --------------------------------------------------------------------------
     2. Dynamic Copyright Year
     -------------------------------------------------------------------------- */
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     3. Sticky Header Elevation & Floating Back-To-Top on Scroll
     -------------------------------------------------------------------------- */
  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;

    // Header elevation
    if (scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Floating back to top button visibility
    if (floatingBackToTopBtn) {
      if (scrollY > 350) {
        floatingBackToTopBtn.classList.add('visible');
      } else {
        floatingBackToTopBtn.classList.remove('visible');
      }
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* --------------------------------------------------------------------------
     4. Mobile Drawer Navigation & Accessibility
     -------------------------------------------------------------------------- */
  const openMobileDrawer = () => {
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('active');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    drawerBackdrop.classList.add('active');
    drawerBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeMobileDrawer = () => {
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('active');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    drawerBackdrop.classList.remove('active');
    drawerBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeMobileDrawer);
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeMobileDrawer);
  }

  // Close drawer when any mobile link is clicked
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileDrawer();
    });
  });

  /* --------------------------------------------------------------------------
     5. Scrollspy for Active Nav Link Indication
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');

  const updateScrollspy = () => {
    const scrollPosition = (window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0) + 120; // Offset for header

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Update Desktop Nav
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });

        // Update Mobile Drawer Nav
        document.querySelectorAll('.drawer-nav-link').forEach(drawerLink => {
          drawerLink.classList.remove('active');
          if (drawerLink.getAttribute('href') === `#${sectionId}`) {
            drawerLink.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateScrollspy, { passive: true });
  updateScrollspy();

  /* --------------------------------------------------------------------------
     6. Interactive Digital Menu Category Filtering
     -------------------------------------------------------------------------- */
  const categoryNames = {
    'all': 'handcrafted items',
    'hot-coffee': 'Hot Coffee selections',
    'iced-drinks': 'Iced Drink refreshers',
    'tea-refreshers': 'Tea & Refresher selections',
    'bakery-desserts': 'Bakery & Dessert treats'
  };

  if (filterBtns.length > 0 && menuCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetCategory = btn.getAttribute('data-category');

        // Update active tab styles & ARIA attributes
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // Filter cards with smooth staggered entrance animation
        let visibleCount = 0;
        menuCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (targetCategory === 'all' || cardCategory === targetCategory) {
            card.classList.remove('hidden');
            card.classList.remove('animating-in');
            void card.offsetWidth; // Force reflow to restart animation
            card.style.animationDelay = `${visibleCount * 0.045}s`;
            card.classList.add('animating-in');
            visibleCount++;
          } else {
            card.classList.add('hidden');
            card.classList.remove('animating-in');
            card.style.animationDelay = '';
          }
        });

        // Update counter label
        if (menuCounter) {
          const categoryLabel = categoryNames[targetCategory] || 'items';
          menuCounter.textContent = `Showing ${visibleCount} ${categoryLabel}`;
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     7. Table Reservation Form Validation & Confirmation
     -------------------------------------------------------------------------- */
  // Disallow reservation dates in the past by setting min attribute to today
  if (resDateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    resDateInput.min = `${yyyy}-${mm}-${dd}`;
    resDateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  // Field validation helpers
  const showError = (inputId, errorId, message) => {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(errorId);
    if (input) {
      input.classList.remove('is-invalid');
      void input.offsetWidth; // Force reflow to re-trigger shake animation
      input.classList.add('is-invalid');
    }
    if (errorEl) errorEl.textContent = message;
  };

  const clearError = (inputId, errorId) => {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(errorId);
    if (input) input.classList.remove('is-invalid');
    if (errorEl) errorEl.textContent = '';
  };

  // Real-time clearance of errors upon user input
  const formFieldMap = [
    { inputId: 'res-name', errorId: 'name-error' },
    { inputId: 'res-email', errorId: 'email-error' },
    { inputId: 'res-phone', errorId: 'phone-error' },
    { inputId: 'res-date', errorId: 'date-error' },
    { inputId: 'res-time', errorId: 'time-error' },
    { inputId: 'res-guests', errorId: 'guests-error' }
  ];

  formFieldMap.forEach(field => {
    const el = document.getElementById(field.inputId);
    if (el) {
      el.addEventListener('input', () => clearError(field.inputId, field.errorId));
      el.addEventListener('change', () => clearError(field.inputId, field.errorId));
    }
  });

  if (resForm) {
    resForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // 1. Validate Name
      const nameInput = document.getElementById('res-name');
      const nameVal = nameInput ? nameInput.value.trim() : '';
      if (!nameVal || nameVal.length < 2) {
        showError('res-name', 'name-error', 'Please provide your full name (minimum 2 characters).');
        isValid = false;
      } else {
        clearError('res-name', 'name-error');
      }

      // 2. Validate Email
      const emailInput = document.getElementById('res-email');
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailVal || !emailRegex.test(emailVal)) {
        showError('res-email', 'email-error', 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearError('res-email', 'email-error');
      }

      // 3. Validate Phone (min 10 digits/characters)
      const phoneInput = document.getElementById('res-phone');
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      const phoneDigits = phoneVal.replace(/[^0-9]/g, '');
      if (!phoneVal || phoneDigits.length < 10) {
        showError('res-phone', 'phone-error', 'Please enter a valid phone number (at least 10 digits).');
        isValid = false;
      } else {
        clearError('res-phone', 'phone-error');
      }

      // 4. Validate Guests (1 to 12)
      const guestsInput = document.getElementById('res-guests');
      const guestsVal = guestsInput ? parseInt(guestsInput.value, 10) : 0;
      if (!guestsVal || isNaN(guestsVal) || guestsVal < 1 || guestsVal > 12) {
        showError('res-guests', 'guests-error', 'Please select a party size between 1 and 12 guests.');
        isValid = false;
      } else {
        clearError('res-guests', 'guests-error');
      }

      // 5. Validate Date (not in the past)
      const dateInput = document.getElementById('res-date');
      const dateVal = dateInput ? dateInput.value : '';
      if (!dateVal) {
        showError('res-date', 'date-error', 'Please choose a reservation date.');
        isValid = false;
      } else {
        const selectedDate = new Date(dateVal + 'T00:00:00');
        const todayZero = new Date();
        todayZero.setHours(0, 0, 0, 0);

        if (selectedDate < todayZero) {
          showError('res-date', 'date-error', 'Reservation date cannot be in the past.');
          isValid = false;
        } else {
          clearError('res-date', 'date-error');
        }
      }

      // 6. Validate Preferred Time
      const timeInput = document.getElementById('res-time');
      const timeVal = timeInput ? timeInput.value : '';
      if (!timeVal) {
        showError('res-time', 'time-error', 'Please select a preferred seating time.');
        isValid = false;
      } else {
        clearError('res-time', 'time-error');
      }

      // Optional Notes
      const notesInput = document.getElementById('res-notes');
      const notesVal = notesInput ? notesInput.value.trim() : '';

      // If form is valid, show confirmation receipt card
      if (isValid) {
        // Populate Confirmation Card
        const confGuestName = document.getElementById('conf-guest-name');
        const confDate = document.getElementById('conf-date');
        const confTime = document.getElementById('conf-time');
        const confGuests = document.getElementById('conf-guests');
        const confContact = document.getElementById('conf-contact');
        const confNotes = document.getElementById('conf-notes');
        const confNotesRow = document.getElementById('conf-notes-row');

        if (confGuestName) confGuestName.textContent = nameVal;
        if (confDate) {
          const formattedDate = new Date(dateVal + 'T00:00:00').toLocaleDateString('en-IN', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
          confDate.textContent = formattedDate;
        }
        if (confTime) confTime.textContent = timeVal;
        if (confGuests) confGuests.textContent = `${guestsVal} ${guestsVal === 1 ? 'Guest' : 'Guests'}`;
        if (confContact) confContact.textContent = `${phoneVal} • ${emailVal}`;

        if (notesVal && confNotes && confNotesRow) {
          confNotes.textContent = notesVal;
          confNotesRow.style.display = 'flex';
        } else if (confNotesRow) {
          confNotesRow.style.display = 'none';
        }

        // Toggle Views
        resForm.style.display = 'none';
        if (resConfirmation) {
          resConfirmation.style.display = 'block';
          resConfirmation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  }

  // Reset reservation form button
  if (resetResBtn) {
    resetResBtn.addEventListener('click', () => {
      if (resForm) {
        resForm.reset();
        // Restore today's date
        if (resDateInput) {
          const today = new Date();
          const yyyy = today.getFullYear();
          const mm = String(today.getMonth() + 1).padStart(2, '0');
          const dd = String(today.getDate()).padStart(2, '0');
          resDateInput.value = `${yyyy}-${mm}-${dd}`;
        }
        resForm.style.display = 'flex';
      }
      if (resConfirmation) {
        resConfirmation.style.display = 'none';
      }
    });
  }

  /* --------------------------------------------------------------------------
     8. Photographic Gallery Lightbox Modal
     -------------------------------------------------------------------------- */
  const openLightbox = (imgSrc, captionText) => {
    if (lightboxModal && lightboxImage && lightboxCaption) {
      lightboxImage.src = imgSrc;
      lightboxImage.alt = captionText || 'Café Gallery Image';
      lightboxCaption.textContent = captionText || '';
      lightboxModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      lightboxCloseBtn.focus();
    }
  };

  const closeLightbox = () => {
    if (lightboxModal) {
      lightboxModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  };

  galleryItems.forEach(item => {
    const handleGalleryOpen = () => {
      const img = item.querySelector('img');
      const caption = item.getAttribute('data-caption') || (item.querySelector('.gallery-caption-title') ? item.querySelector('.gallery-caption-title').textContent : '');
      if (img) {
        openLightbox(img.src, caption);
      }
    };

    item.addEventListener('click', handleGalleryOpen);

    // Keyboard support (Enter & Space)
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleGalleryOpen();
      }
    });
  });

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  /* --------------------------------------------------------------------------
     9. Our Story Philosophy Modal
     -------------------------------------------------------------------------- */
  const openStoryModal = () => {
    if (storyModalOverlay) {
      storyModalOverlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      if (closeStoryBtn) closeStoryBtn.focus();
    }
  };

  const closeStoryModal = () => {
    if (storyModalOverlay) {
      storyModalOverlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  };

  if (openStoryBtn) {
    openStoryBtn.addEventListener('click', openStoryModal);
  }

  if (closeStoryBtn) {
    closeStoryBtn.addEventListener('click', closeStoryModal);
  }

  if (modalReserveBtn) {
    modalReserveBtn.addEventListener('click', closeStoryModal);
  }

  if (storyModalOverlay) {
    storyModalOverlay.addEventListener('click', (e) => {
      if (e.target === storyModalOverlay) {
        closeStoryModal();
      }
    });
  }

  /* --------------------------------------------------------------------------
     10. Global Keyboard Accessibility (Escape Key to close modals/drawer)
     -------------------------------------------------------------------------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightboxModal && lightboxModal.style.display === 'flex') {
        closeLightbox();
      }
      if (storyModalOverlay && storyModalOverlay.style.display === 'flex') {
        closeStoryModal();
      }
      if (mobileDrawer && mobileDrawer.classList.contains('active')) {
        closeMobileDrawer();
      }
    }
  });

  /* --------------------------------------------------------------------------
     11. Back to Top Buttons (Footer & Floating)
     -------------------------------------------------------------------------- */
  const smoothScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', smoothScrollToTop);
  }

  if (floatingBackToTopBtn) {
    floatingBackToTopBtn.addEventListener('click', smoothScrollToTop);
  }

  /* --------------------------------------------------------------------------
     12. Scroll-Triggered Reveal Animations (IntersectionObserver)
     -------------------------------------------------------------------------- */
  // Only activate observer if supported and user hasn't requested reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    // Add class so CSS knows observer is ready and elements can be transitioned in
    document.body.classList.add('js-observer-ready');

    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right');

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target); // Reveal once
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }
});
