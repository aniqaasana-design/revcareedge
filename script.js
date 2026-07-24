/**
 * RevCare Edge - Interactive & Motion Script
 * Optimized Premium Frontend Architecture
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- ACCESSIBILITY CHECK ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof gsap !== 'undefined';
  const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';
  const enableHeavyMotion = false;

  // --- ELEMENT SELECTORS ---
  const mainHeader = document.getElementById('mainHeader');
  const navbar = document.getElementById('navbar');
  const servicesMenuBtn = document.getElementById('servicesMenuBtn') || document.getElementById('megaMenuBtn');
  const servicesMenuPanel = document.getElementById('servicesMenuPanel') || document.getElementById('megaMenuPanel');
  const specialtiesMenuBtn = document.getElementById('specialtiesMenuBtn');
  const specialtiesMenuPanel = document.getElementById('specialtiesMenuPanel');
  
  // Mobile selectors
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const hamburgerIcon = document.getElementById('hamburgerIcon');
  const closeIcon = document.getElementById('closeIcon');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerOverlay = document.getElementById('mobileDrawerOverlay');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileAccordionBtn = document.getElementById('mobileAccordionBtn');
  const mobileAccordionContent = document.getElementById('mobileAccordionContent');
  const mobileSpecialtiesAccordionBtn = document.getElementById('mobileSpecialtiesAccordionBtn');
  const mobileSpecialtiesAccordionContent = document.getElementById('mobileSpecialtiesAccordionContent');

  // Keep wheel scrolling native so mouse and trackpad input stay responsive.
  if (hasGsap) {
    gsap.ticker.lagSmoothing(500, 33);
  }

  // ── Animation back-navigation guard ────────────────────────────────────────
  // Skip animations ONLY when the user pressed Back/Forward (back_forward),
  // NOT on normal page loads or refreshes.
  // performance.navigation.type gives us exactly this without sessionStorage.
  const _navEntry = performance.getEntriesByType('navigation')[0];
  const isBackNavigation = _navEntry ? _navEntry.type === 'back_forward' : false;

  // bfcache restore — browser revives a frozen page snapshot without re-running
  // JS, but pageshow still fires. Reveal everything instantly.
  window.addEventListener('pageshow', (evt) => {
    if (evt.persisted) {
      document.documentElement.classList.add('no-anim');
      revealMotionElements();
    }
  });
  // ──────────────────────────────────────────────────────────────────────────

  // --- INJECT MENU ITEM CONTEXTUAL ICONS DYNAMICALLY ---
  function getIconPaths(text) {
    if (!text) return '';
    const t = text.toLowerCase().trim();
    if (t.includes("behavioral health")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-4.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2Z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-4.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2Z"></path>';
    }
    if (t.includes("psychiatry")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2a3 3 0 0 0-3 3v2a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM12 10a3 3 0 0 0-3 3v2a3 3 0 0 0 6 0v-2a3 3 0 0 0-3-3zM12 18a3 3 0 0 0-3 3v1h6v-1a3 3 0 0 0-3-3z"></path>';
    }
    if (t.includes("psychology")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>';
    }
    if (t.includes("addiction")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>';
    }
    if (t.includes("family practice")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="9 22 9 12 15 12 15 22"></polyline>';
    }
    if (t.includes("internal medicine")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 15v1a6 6 0 0 0 6 6h2a4 4 0 0 0 4-4v-3"></path><circle cx="20" cy="10" r="2"></circle>';
    }
    if (t.includes("primary care")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11h.01M12 15h.01M8 11h.01M8 15h.01M16 11h.01M16 15h.01"></path>';
    }
    if (t.includes("pediatrics")) {
      return '<circle cx="12" cy="12" r="10"></circle><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v2"></path>';
    }
    if (t.includes("women's health") || t.includes("ob-gyn")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 12h-4l-3 9L9 3l-3 9H2"></path>';
    }
    if (t.includes("cardiology")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>';
    }
    if (t.includes("neurology")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-4.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2Z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-4.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2Z"></path>';
    }
    if (t.includes("gastroenterology")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>';
    }
    if (t.includes("oncology")) {
      return '<circle cx="12" cy="8" r="7"></circle><polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>';
    }
    if (t.includes("orthopedics")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6.5 17.5L17.5 6.5"></path><circle cx="5" cy="19" r="2"></circle><circle cx="19" cy="5" r="2"></circle><circle cx="8" cy="16" r="2"></circle><circle cx="16" cy="8" r="2"></circle>';
    }
    if (t.includes("dermatology")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z"></path>';
    }
    if (t.includes("nephrology")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z"></path>';
    }
    if (t.includes("pulmonology")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.5 8.5c0 1.5-1.5 3-3.5 3s-3-1.5-3-3c0-3 3-5 3-5s3 2 3 5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.5 8.5c0 1.5 1.5 3 3.5 3s3-1.5 3-3c0-3-3-5-3-5s-3 2-3 5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v10"></path>';
    }
    if (t.includes("endocrinology")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 12h-4l-3 9L9 3l-3 9H2"></path>';
    }
    if (t.includes("rheumatology")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 15h-2v2h2v-2zm0-4h-2v2h2v-2zm0-4h-2v2h2V7zm-4 8h-2v2h2v-2zm0-4h-2v2h2v-2zm0-4h-2v2h2V7z"></path>';
    }
    if (t.includes("general surgery")) {
      return '<circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="9.8" y1="8.2" x2="20" y2="18.4"></line><line x1="9.8" y1="15.8" x2="20" y2="5.6"></line>';
    }
    if (t.includes("vascular surgery")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 12h-4l-3 9L9 3l-3 9H2"></path>';
    }
    if (t.includes("plastic surgery")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v18M3 12h18M12 3l9 9-9 9-9-9 9-9z"></path>';
    }
    if (t.includes("anesthesiology")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m18 2 4 4M17 7l3-3M19 9.5 14.5 5M11 11l4-4M12 12 7.5 7.5M9.5 14.5 5 10M6 16l-4 4M3 21l3-3M16 8l-8 8"></path>';
    }
    if (t.includes("radiology")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"></path><circle cx="12" cy="12" r="3"></circle>';
    }
    if (t.includes("pathology")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18h8M3 22h18M12 18a4 4 0 0 0-4-4V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8a4 4 0 0 0-4 4z"></path>';
    }
    if (t.includes("physical therapy")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6.5 6.5h11M6.5 17.5h11M12 3v18"></path>';
    }
    if (t.includes("occupational therapy")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>';
    }
    if (t.includes("chiropractic")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2a3 3 0 0 0-3 3v2a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM12 10a3 3 0 0 0-3 3v2a3 3 0 0 0 6 0v-2a3 3 0 0 0-3-3zM12 18a3 3 0 0 0-3 3v1h6v-1a3 3 0 0 0-3-3z"></path>';
    }
    if (t.includes("acupuncture")) {
      return '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>';
    }
    if (t.includes("hospice care")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>';
    }
    if (t.includes("palliative care")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>';
    }
    if (t.includes("dme")) {
      return '<polyline stroke-linecap="round" stroke-linejoin="round" points="16.5 9.4 7.5 4.21 12 2.1 21 7.3"></polyline><polygon stroke-linecap="round" stroke-linejoin="round" points="12 22 .88 15.6 .88 5.2 12 11.6 12 22"></polygon><polygon stroke-linecap="round" stroke-linejoin="round" points="23.12 5.2 23.12 15.6 12 22 12 11.6 23.12 5.2"></polygon>';
    }
    if (t.includes("pharmacy")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12.5 12.5l3-3a4.95 4.95 0 0 0-7-7l-3 3a4.95 4.95 0 0 0 7 7zm-5-5l5 5"></path>';
    }

    // Services
    if (t.includes("in-network")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2a8 8 0 0 0-8 8c0 1.5.4 3 1.2 4.3L3 22l7.7-1.2A8 8 0 1 0 12 2z"></path>';
    }
    if (t.includes("analysis")) {
      return '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>';
    }
    if (t.includes("dental")) {
      return '<circle cx="12" cy="12" r="10"></circle><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line>';
    }
    if (t.includes("coding")) {
      return '<polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="16 18 22 12 16 6"></polyline><polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="8 6 2 12 8 18"></polyline>';
    }
    if (t.includes("denial") || t.includes("ar &")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="14 2 14 8 20 8"></polyline><line x1="9.5" y1="12.5" x2="14.5" y2="17.5"></line><line x1="14.5" y1="12.5" x2="9.5" y2="17.5"></line>';
    }
    if (t.includes("initial credentialing")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z"></path><polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="9 12 11 14 15 10"></polyline>';
    }
    if (t.includes("re-credentialing")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>';
    }
    if (t.includes("caqh")) {
      return '<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path><path stroke-linecap="round" stroke-linejoin="round" d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path>';
    }
    if (t.includes("licensing")) {
      return '<rect stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x="3" y="4" width="18" height="16" rx="2"></rect><circle cx="9" cy="10" r="2"></circle><path stroke-linecap="round" stroke-linejoin="round" d="M15 8h2M15 12h2M7 16c0-1 1-2 5-2"></path>';
    }
    if (t.includes("manager")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path stroke-linecap="round" stroke-linejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path stroke-linecap="round" stroke-linejoin="round" d="M16 3.13a4 4 0 0 1 0 7.75"></path>';
    }
    if (t.includes("assistant")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path stroke-linecap="round" stroke-linejoin="round" d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>';
    }
    if (t.includes("help desk")) {
      return '<circle cx="12" cy="12" r="10"></circle><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>';
    }
    if (t.includes("bookkeeping")) {
      return '<rect stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="18"></line><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01"></path>';
    }
    if (t.includes("reporting")) {
      return '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>';
    }
    if (t.includes("tracking")) {
      return '<polyline stroke-linecap="round" stroke-linejoin="round" points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline stroke-linecap="round" stroke-linejoin="round" points="17 6 23 6 23 12"></polyline>';
    }
    if (t.includes("website") || t.includes("development")) {
      return '<rect stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>';
    }
    if (t.includes("seo")) {
      return '<circle cx="8" cy="8" r="6"></circle><line x1="18" y1="18" x2="12.24" y2="12.24"></line><polyline stroke-linecap="round" stroke-linejoin="round" points="17 9 22 9 22 14"></polyline>';
    }
    if (t.includes("marketing")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 8a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 6s-3 3-3 6 3 6 3 6V6z"></path>';
    }
    if (t.includes("branding")) {
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.32832 19.4697 6 19 6 18C6 16.8954 6.89543 16 8 16C9.10457 16 10 16.8954 10 18C10 20.2091 10.8954 22 12 22Z"></path><circle cx="7.5" cy="10.5" r="1.5"></circle><circle cx="11.5" cy="7.5" r="1.5"></circle><circle cx="16.5" cy="9.5" r="1.5"></circle>';
    }

    return '<polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="20 6 9 17 4 12"></polyline>';
  }

  function getMenuIconName(text) {
    const t = (text || '').toLowerCase().trim();

    // ── OUR SERVICES dropdown ─────────────────────────────────────────────────
    // Medical Billing column
    if (t.includes('in-network') || t.includes('out-of-network')) return 'fa6-solid:network-wired';
    if (t.includes('free practice analysis') || t.includes('practice analysis')) return 'fa6-solid:magnifying-glass-chart';
    if (t.includes('behavioral') || t.includes('mental') || t.includes('psychi') || t.includes('psycho')) return 'medical-icon:mental-health';
    if (t.includes('dental')) return 'medical-icon:dental';
    if (t.includes('coding')) return 'material-symbols:clinical-notes';
    if (t.includes('denial') || t.startsWith('ar ') || t === 'ar & denial management') return 'fa6-solid:triangle-exclamation';
    if (t.includes('billing') || t.includes('claim') || t.includes('rcm')) return 'medical-icon:billing';

    // Credentialing column
    if (t.includes('initial credential')) return 'fa6-solid:user-check';
    if (t.includes('re-credential') || t.includes('recredential')) return 'fa6-solid:arrows-rotate';
    if (t.includes('caqh')) return 'fa6-solid:database';
    if (t.includes('licensing') || t.includes('credential')) return 'fa6-solid:id-card-clip';

    // Practice Management column
    if (t.includes('practice manager')) return 'fa6-solid:user-tie';
    if (t.includes('virtual assistant') || t.includes('assistant')) return 'fa6-solid:robot';
    if (t.includes('patient help desk') || t.includes('help desk') || t.includes('desk')) return 'fa6-solid:headset';
    if (t.includes('manager') || t.includes('support')) return 'fa6-solid:headset';

    // Bookkeeping column
    if (t.includes('bookkeeping')) return 'fa6-solid:book';
    if (t.includes('financial report') || t.includes('report')) return 'fa6-solid:chart-bar';
    if (t.includes('revenue tracking') || t.includes('tracking')) return 'fa6-solid:chart-line';
    if (t.includes('payment')) return 'fa6-solid:file-invoice-dollar';

    // Digital Marketing column
    if (t.includes('website') || t.includes('web development')) return 'fa6-solid:laptop-code';
    if (t.includes('seo')) return 'fa6-solid:magnifying-glass';
    if (t.includes('digital marketing')) return 'fa6-solid:bullhorn';
    if (t.includes('branding')) return 'fa6-solid:palette';
    if (t.includes('marketing')) return 'fa6-solid:bullhorn';

    // ── SPECIALTIES dropdown ──────────────────────────────────────────────────
    // Behavioral & Mental
    if (t.includes('addiction')) return 'fa6-solid:pills';

    // Primary & Specialty
    if (t.includes('family practice') || t.includes('family')) return 'medical-icon:family-practice';
    if (t.includes('internal medicine')) return 'medical-icon:internal-medicine';
    if (t.includes('primary care')) return 'medical-icon:first-aid';
    if (t.includes('pediatrics')) return 'medical-icon:pediatrics';
    if (t.includes('women') || t.includes('ob-gyn')) return 'medical-icon:womens-health';

    // Medical Specialties
    if (t.includes('cardiology')) return 'medical-icon:cardiology';
    if (t.includes('neuro')) return 'medical-icon:neurology';
    if (t.includes('gastro')) return 'material-symbols:gastroenterology';
    if (t.includes('oncology')) return 'medical-icon:oncology';
    if (t.includes('orthopedics')) return 'material-symbols:orthopedics';
    if (t.includes('dermatology')) return 'medical-icon:dermatology';
    if (t.includes('nephrology') || t.includes('kidney')) return 'medical-icon:kidney';
    if (t.includes('pulmonology') || t.includes('respiratory')) return 'medical-icon:respiratory';
    if (t.includes('endocrinology')) return 'material-symbols:endocrinology';
    if (t.includes('rheumatology')) return 'material-symbols:rheumatology';

    // Surgical & Diagnostic
    if (t.includes('plastic surgery')) return 'fa6-solid:wand-magic-sparkles';
    if (t.includes('vascular surgery') || t.includes('vascular')) return 'fa6-solid:heart-pulse';
    if (t.includes('general surgery') || t.includes('surgery')) return 'medical-icon:surgery';
    if (t.includes('anesthes')) return 'medical-icon:anesthesia';
    if (t.includes('radiology')) return 'medical-icon:radiology';
    if (t.includes('pathology')) return 'medical-icon:pathology';

    // Therapy & Support
    if (t.includes('physical therapy')) return 'medical-icon:physical-therapy';
    if (t.includes('occupational therapy')) return 'fa6-solid:hand-holding-medical';
    if (t.includes('chiropractic')) return 'fa6-solid:bone';
    if (t.includes('acupuncture')) return 'medical-icon:alternative-complementary';
    if (t.includes('hospice') || t.includes('palliative')) return 'fa6-solid:hand-holding-heart';
    if (t.includes('dme')) return 'medical-icon:accessibility';
    if (t.includes('pharmacy')) return 'medical-icon:pharmacy';

    // Default fallback
    return 'fa6-solid:circle-check';
  }

  const desktopMenuLinks = document.querySelectorAll('#servicesMenuPanel ul li a, #specialtiesMenuPanel ul li a');
  desktopMenuLinks.forEach(link => {
    const dot = link.querySelector('span:first-child:not(:last-child)');
    if (dot) {
      dot.remove();
    }
    const textLabel = link.querySelector('span:last-child');
    const text = textLabel ? textLabel.textContent : link.textContent;
    const icon = document.createElement('iconify-icon');
    icon.setAttribute('icon', getMenuIconName(text));
    icon.setAttribute('aria-hidden', 'true');
    icon.className = 'menu-item-icon w-[14px] h-[14px] text-brand-green group-hover/link:scale-110 transition-all duration-200 mr-2.5 flex-shrink-0';
    link.insertBefore(icon, link.firstChild);
  });

  const mobileMenuLinks = document.querySelectorAll('#mobileAccordionContent ul li a, #mobileSpecialtiesAccordionContent ul li a');
  mobileMenuLinks.forEach(link => {
    link.classList.remove('block');
    link.classList.add('flex', 'items-center', 'group/link');
    
    const text = link.textContent.trim();
    link.innerHTML = '<span>' + text + '</span>';
    
    const icon = document.createElement('iconify-icon');
    icon.setAttribute('icon', getMenuIconName(text));
    icon.setAttribute('aria-hidden', 'true');
    icon.className = 'menu-item-icon w-[14px] h-[14px] text-brand-green group-hover/link:scale-110 transition-all duration-200 mr-2.5 flex-shrink-0';
    link.insertBefore(icon, link.firstChild);
  });

  // --- NAVBAR SCROLL STATE WITH RAF THROTTLING ---
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(() => {
        if (navbar) {
          if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
        }
        scrollTicking = false;
      });
    }
  }, { passive: true });

  // --- MEGA-MENU DESKTOP INTERACTIONS WITH HOVER INTENT ---
  const dropdownPairs = [
    { btn: servicesMenuBtn, panel: servicesMenuPanel },
    { btn: specialtiesMenuBtn, panel: specialtiesMenuPanel }
  ];

  dropdownPairs.forEach(({ btn, panel }) => {
    if (!btn || !panel) return;

    let openTimeout = null;
    let closeTimeout = null;

    function show() {
      if (closeTimeout) clearTimeout(closeTimeout);
      if (openTimeout) clearTimeout(openTimeout);
      
      openTimeout = setTimeout(() => {
        // Close other dropdowns first (Mutex behavior)
        dropdownPairs.forEach(p => {
          if (p.panel && p.panel !== panel) {
            p.panel.classList.remove('active');
          }
          if (p.btn && p.btn !== btn) {
            p.btn.setAttribute('aria-expanded', 'false');
          }
        });
        panel.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }, 150); // 150ms Hover Intent Delay to prevent flickering on quick sweep
    }

    function hide() {
      if (openTimeout) clearTimeout(openTimeout);
      if (closeTimeout) clearTimeout(closeTimeout);
      
      closeTimeout = setTimeout(() => {
        panel.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      }, 200); // Allow cursor to transition smoothly between trigger and panel
    }

    btn.addEventListener('mouseenter', show);
    btn.addEventListener('mouseleave', hide);
    panel.addEventListener('mouseenter', () => {
      if (closeTimeout) clearTimeout(closeTimeout);
    });
    panel.addEventListener('mouseleave', hide);

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = panel.classList.contains('active');
      if (isActive) {
        panel.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        show();
      }
    });

    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && !btn.contains(e.target)) {
        panel.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // --- MOBILE NAVIGATION DRAWER WITH FOCUS TRAP ---
  let drawerOpen = false;
  const focusableElementsSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex="0"]';
  let firstFocusableElement = null;
  let lastFocusableElement = null;

  function trapFocus(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    }
  }

  function openMobileNav() {
    drawerOpen = true;
    if (mobileDrawer) {
      mobileDrawer.classList.remove('translate-x-full');
      mobileDrawer.setAttribute('aria-hidden', 'false');
    }
    
    // Toggle overlay
    if (mobileDrawerOverlay) {
      mobileDrawerOverlay.classList.remove('hidden');
      void mobileDrawerOverlay.offsetWidth; // Force browser layout reflow
      mobileDrawerOverlay.classList.add('opacity-100');
    }

    if (hamburgerIcon) hamburgerIcon.classList.add('hidden');
    if (closeIcon) closeIcon.classList.remove('hidden');
    document.body.classList.add('overflow-hidden-mobile');
    if (menuToggleBtn) menuToggleBtn.setAttribute('aria-expanded', 'true');

    // Hide main floating navbar wrapper
    if (mainHeader) {
      mainHeader.classList.add('hidden');
    }

    // Set up Focus Trap
    if (mobileDrawer) {
      const focusables = mobileDrawer.querySelectorAll(focusableElementsSelector);
      if (focusables.length > 0) {
        firstFocusableElement = focusables[0];
        lastFocusableElement = focusables[focusables.length - 1];
        firstFocusableElement.focus();
        mobileDrawer.addEventListener('keydown', trapFocus);
      }
    }
  }

  function closeMobileNav() {
    drawerOpen = false;
    if (mobileDrawer) {
      mobileDrawer.classList.add('translate-x-full');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      mobileDrawer.removeEventListener('keydown', trapFocus);
    }
    
    // Toggle overlay
    if (mobileDrawerOverlay) {
      mobileDrawerOverlay.classList.remove('opacity-100');
      setTimeout(() => {
        if (!drawerOpen) mobileDrawerOverlay.classList.add('hidden');
      }, 300);
    }

    if (hamburgerIcon) hamburgerIcon.classList.remove('hidden');
    if (closeIcon) closeIcon.classList.add('hidden');
    document.body.classList.remove('overflow-hidden-mobile');
    
    // Return focus to hamburger
    if (menuToggleBtn) {
      menuToggleBtn.setAttribute('aria-expanded', 'false');
      menuToggleBtn.focus();
    }

    // Restore main floating navbar wrapper
    if (mainHeader) {
      mainHeader.classList.remove('hidden');
    }
  }

  if (menuToggleBtn && mobileDrawer) {
    menuToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (drawerOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  // Close when clicking the backdrop overlay or the drawer close button
  if (mobileDrawerOverlay) {
    mobileDrawerOverlay.addEventListener('click', closeMobileNav);
  }
  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeMobileNav);
  }

  // --- MOBILE ACCORDIONS (Mutex behavior) ---
  const accordions = [
    {
      btn: mobileAccordionBtn,
      content: mobileAccordionContent
    },
    {
      btn: mobileSpecialtiesAccordionBtn,
      content: mobileSpecialtiesAccordionContent
    }
  ];

  accordions.forEach(({ btn, content }) => {
    if (!btn || !content) return;

    const chevron = btn.querySelector('.accordion-chevron');

    btn.addEventListener('click', () => {
      const isExpanded = content.classList.contains('active');
      
      if (isExpanded) {
        content.style.maxHeight = '0px';
        content.classList.remove('active');
        if (chevron) chevron.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        // Collapse other accordions first (Mutex behavior)
        accordions.forEach(other => {
          if (other.content && other.content !== content) {
            other.content.style.maxHeight = '0px';
            other.content.classList.remove('active');
          }
          if (other.btn && other.btn !== btn) {
            other.btn.setAttribute('aria-expanded', 'false');
            const otherChevron = other.btn.querySelector('.accordion-chevron');
            if (otherChevron) otherChevron.classList.remove('active');
          }
        });

        content.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        if (chevron) chevron.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // --- PARALLAX ORBS EFFECT (MOUSE-MOVE WITH RAF) ---
  if (enableHeavyMotion && hasGsap && !prefersReducedMotion && window.innerWidth >= 1024) {
    let mouseX = 0;
    let mouseY = 0;
    let parallaxQueued = false;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!parallaxQueued) {
        parallaxQueued = true;
        requestAnimationFrame(updateParallaxOrbs);
      }
    });

    function updateParallaxOrbs() {
      const moveX = (mouseX - window.innerWidth / 2) * 0.015;
      const moveY = (mouseY - window.innerHeight / 2) * 0.015;
      const orbs = document.querySelectorAll('.bubble-orb');
      
      if (orbs.length > 0) {
        orbs.forEach((orb, index) => {
          // Vary the speed coefficient for each orb so it creates a multi-layered depth feel
          const coefficients = [0.6, -0.4, 0.8, -0.5, 1.2, -0.7];
          const coeff = coefficients[index % coefficients.length];
          
          gsap.to(orb, {
            x: moveX * coeff,
            y: moveY * coeff,
            duration: 1.2,
            ease: 'power2.out',
            force3D: true,
            overwrite: 'auto'
          });
        });
      }
      parallaxQueued = false;
    }
  }

  // --- MAGNETIC BUTTONS (GSAP QUICKTO) ---
  if (enableHeavyMotion && hasGsap && !prefersReducedMotion && window.innerWidth >= 1024) {
    const magneticBtns = document.querySelectorAll('.btn-orange-glow');
    magneticBtns.forEach(btn => {
      btn.style.position = 'relative';
      btn.style.zIndex = '10';

      const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });

      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const moveX = (e.clientX - centerX) * 0.35;
        const moveY = (e.clientY - centerY) * 0.35;
        
        xTo(moveX);
        yTo(moveY);
      });

      btn.addEventListener('mouseleave', () => {
        xTo(0);
        yTo(0);
      });
    });
  }

  // --- 3D CARD TILTS WITH LIGHT GLARE OVERLAY & RAF THROTTLING ---
  if (enableHeavyMotion && hasGsap && !prefersReducedMotion && window.innerWidth >= 1024) {
    const cards = document.querySelectorAll('.glass-card, .offer-card, .specialty-card');
    cards.forEach(card => {
      card.style.position = 'relative';
      card.style.overflow = 'hidden';

      // Inject Glare overlay dynamically if not already present
      let glare = card.querySelector('.glare-overlay');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'glare-overlay';
        card.appendChild(glare);
      }

      let tiltTicking = false;
      let mouseEvent = null;

      card.addEventListener('mousemove', (e) => {
        mouseEvent = e;
        if (!tiltTicking) {
          tiltTicking = true;
          requestAnimationFrame(updateTilt);
        }
      });

      function updateTilt() {
        if (!mouseEvent) {
          tiltTicking = false;
          return;
        }

        const rect = card.getBoundingClientRect();
        const mouseX = mouseEvent.clientX - rect.left;
        const mouseY = mouseEvent.clientY - rect.top;

        // Normalized relative coords (-1 to 1)
        const normX = (mouseX / rect.width) * 2 - 1;
        const normY = (mouseY / rect.height) * 2 - 1;

        // Subtle tilt angles (max 6deg)
        const tiltX = -normY * 6;
        const tiltY = normX * 6;

        gsap.to(card, {
          rotateX: tiltX,
          rotateY: tiltY,
          transformPerspective: 1000,
          duration: 0.4,
          ease: 'power3.out',
          overwrite: 'auto'
        });

        // Sync cursor glare position inside the custom CSS variables
        glare.style.setProperty('--mouse-x', `${mouseX}px`);
        glare.style.setProperty('--mouse-y', `${mouseY}px`);
        glare.style.opacity = '1';

        tiltTicking = false;
      }

      card.addEventListener('mouseleave', () => {
        mouseEvent = null;
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'power3.out',
          overwrite: 'auto'
        });
        glare.style.opacity = '0';
      });
    });
  }

  // --- RECURSIVE TEXT SPLITTING UTILITY FOR PREMIUM REVEALS ---
  function wrapTextInSpans(element) {
    if (!element) return;
    
    const childNodes = Array.from(element.childNodes);
    childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue;
        const words = text.split(/(\s+)/); // Preserving spaces
        const fragment = document.createDocumentFragment();
        
        words.forEach(word => {
          if (word.trim() === '') {
            fragment.appendChild(document.createTextNode(word));
          } else {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word-span inline-block whitespace-nowrap';
            
            const chars = word.split('');
            chars.forEach(char => {
              const charSpan = document.createElement('span');
              charSpan.className = 'char-span inline-block overflow-hidden relative';
              
              const innerSpan = document.createElement('span');
              innerSpan.className = 'char-inner inline-block';
              innerSpan.textContent = char;
              innerSpan.style.opacity = '0';
              innerSpan.style.transform = 'translateY(105%)';
              
              charSpan.appendChild(innerSpan);
              wordSpan.appendChild(charSpan);
            });
            fragment.appendChild(wordSpan);
          }
        });
        node.parentNode.replaceChild(fragment, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        wrapTextInSpans(node);
      }
    });
  }

  function revealMotionElements() {
    // Add no-anim so CSS-pre-hidden hero elements are instantly revealed
    document.documentElement.classList.add('no-anim');

    document.querySelectorAll([
      '#mainHeader',
      '#navbar',
      '.wave-bg',
      '#heroBadge',
      '#heroHeadline',
      '#heroSubheadline',
      '#heroCtaBlock',
      '#heroTrustCards',
      '.bubble-orb',
      '#what-we-offer [style*="opacity: 0"]',
      '#why-us [style*="opacity: 0"]',
      '#processSection [style*="opacity: 0"]',
      '#specialtiesTeaser [style*="opacity: 0"]',
      '#testimonials [style*="opacity: 0"]',
      '#contactHeroBanner',
      '#contactHero3DIcon',
      '#analysisFormCard',
      '#contactInfoCardsContainer [style*="opacity: 0"]',
      '#faqSectionHeader [style*="opacity: 0"]',
      '#faqContainer .faq-item'
    ].join(',')).forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });

    document.querySelectorAll('.process-line, .mobile-process-line, #processConnectorLine, #processVerticalLine').forEach(line => {
      line.style.strokeDashoffset = '0';
      line.style.transform = 'none';
    });

    const sweep = document.querySelector('.highlight-sweep');
    if (sweep) sweep.classList.add('active');
  }

  function animateElement(el, options = {}) {
    if (!el || el.dataset.motionDone === 'true') return;
    const {
      from = 'translateY(22px)',
      delay = 0,
      duration = 620,
      easing = 'cubic-bezier(0.22, 1, 0.36, 1)',
      clearTransform = false
    } = options;

    el.dataset.motionDone = 'true';
    el.style.willChange = 'transform, opacity';

    const run = () => {
      // Frame 1: lock in the starting invisible state (element already opacity:0
      // from CSS pre-hide or primeScrollElements — this frame is never painted
      // visibly different from the previous state, so there is no flash).
      requestAnimationFrame(() => {
        el.style.transition = 'none';
        el.style.opacity = '0';
        el.style.transform = from;
        // Frame 2: begin the transition
        requestAnimationFrame(() => {
          el.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;
          el.style.opacity = '1';
          el.style.transform = 'none';
          window.setTimeout(() => {
            if (clearTransform) el.style.transform = '';
            el.style.willChange = 'auto';
          }, duration + 80);
        });
      });
    };

    if (delay > 0) {
      window.setTimeout(run, delay);
    } else {
      run();
    }
  }

  function animateLine(el, axis, delay = 0) {
    if (!el || el.dataset.motionDone === 'true') return;
    el.dataset.motionDone = 'true';
    el.style.willChange = 'transform';

    const run = () => {
      requestAnimationFrame(() => {
        el.style.transition = 'none';
        el.style.transform = axis === 'x' ? 'scaleX(0)' : 'scaleY(0)';
        el.style.transformOrigin = axis === 'x' ? 'left center' : 'center top';
        requestAnimationFrame(() => {
          el.style.transition = 'transform 1050ms cubic-bezier(0.22, 1, 0.36, 1)';
          el.style.transform = axis === 'x' ? 'scaleX(1)' : 'scaleY(1)';
          window.setTimeout(() => {
            el.style.willChange = 'auto';
          }, 1130);
        });
      });
    };

    if (delay > 0) {
      window.setTimeout(run, delay);
    } else {
      run();
    }
  }

  function observeOnce(trigger, callback, rootMargin = '0px 0px -8% 0px') {
    if (!trigger) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        callback();
        observer.unobserve(trigger);
      });
    }, { threshold: 0.08, rootMargin });
    observer.observe(trigger);
  }

  function staggerElements(elements, options = {}) {
    Array.from(elements).forEach((el, index) => {
      animateElement(el, {
        from: options.from || 'translateY(20px)',
        delay: (options.delay || 0) + index * (options.stagger || 80),
        duration: options.duration || 600,
        clearTransform: options.clearTransform || false
      });
    });
  }

  function initLightweightMotion() {
    // Skip animations when: user prefers reduced motion OR pressed Back/Forward.
    // Normal loads and refreshes always play animations.
    if (prefersReducedMotion || isBackNavigation) {
      document.documentElement.classList.add('no-anim');
      revealMotionElements();
      return;
    }

    const heroHeadline = document.getElementById('heroHeadline');
    if (heroHeadline && !heroHeadline.dataset.splitDone) {
      heroHeadline.dataset.splitDone = 'true';
      wrapTextInSpans(heroHeadline);
    }

    // Pre-hide all scroll-animated elements immediately (they're below the fold
    // at this point, so setting opacity:0 causes zero visible flash).
    // Without this, IntersectionObserver fires AFTER elements enter the viewport,
    // making them go visible → invisible → animate (the "blink").
    document.querySelectorAll([
      '#what-we-offer .max-w-7xl > span',
      '#what-we-offer .max-w-7xl > h2',
      '#what-we-offer .max-w-7xl > p',
      '#what-we-offer .offer-card',
      '#what-we-offer .offer-cta',
      '#whyUsArrowBtn, #whyUsEyebrow, #whyUsHeadline, #whyUsSubheadline',
      '#why-us .flow-row .flow-shape',
      '#why-us .flow-row .flow-text',
      '#whyUsFooter',
      '#specialtiesTeaser .max-w-3xl > *',
      '#specialtiesTeaser .specialty-card',
      '#specialtiesTeaser .inline-flex',
      '#blog .blog-section-header > *',
      '#blog .blog-card',
      '.blog-hero .blog-chip, .blog-hero h1, .blog-hero p',
      '.blog-section .blog-section-header > *',
      '.blog-section .blog-card',
      '.blog-post-header > *',
      '.blog-post-cover',
      '.blog-article-content',
      '.blog-post-sidebar',
      '#testimonials .max-w-6xl:first-child > *',
      '#testimonials .testimonials-swiper',
      '#contactHeroBanner',
      '#contactHero3DIcon',
      '#analysisFormCard',
      '#contactInfoCardsContainer .contact-info-card',
      '#faqSectionHeader > *',
      '#faqContainer .faq-item',
      '.category-section .category-header',
      '.category-section .specialty-card',
      '#processSection .max-w-3xl > *'
    ].join(',')).forEach(el => {
      if (!el.dataset.motionDone) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(22px)';
      }
    });

    animateElement(mainHeader, { from: 'translateY(-58px)', duration: 680 });

    const wave = document.querySelector('.wave-bg');
    if (wave) animateElement(wave, { from: 'translateY(54px) scale(1.12)', duration: 1200, delay: 80 });

    staggerElements(document.querySelectorAll('.bubble-orb'), {
      from: 'scale(0.72)',
      delay: 180,
      stagger: 70,
      duration: 780,
      clearTransform: true
    });

    animateElement(document.getElementById('heroBadge'), { from: 'translateY(18px) scale(0.96)', delay: 280 });

    const charInners = document.querySelectorAll('#heroHeadline .char-inner');
    if (charInners.length) {
      // Parent is CSS-pre-hidden — reveal it so char-inner children are visible.
      // Chars themselves start at opacity:0 (set in wrapTextInSpans), so no flash.
      heroHeadline.style.opacity = '1';
      heroHeadline.style.transform = 'none';
      heroHeadline.dataset.motionDone = 'true';

      charInners.forEach((char, index) => {
        // double-rAF: set initial state in frame 1, animate in frame 2 — no flash
        const startDelay = 360 + index * 12;
        window.setTimeout(() => {
          requestAnimationFrame(() => {
            char.style.transition = 'none';
            char.style.opacity = '0';
            char.style.transform = 'translateY(105%)';
            requestAnimationFrame(() => {
              char.style.transition = 'opacity 620ms cubic-bezier(0.22, 1, 0.36, 1), transform 720ms cubic-bezier(0.22, 1, 0.36, 1)';
              char.style.opacity = '1';
              char.style.transform = 'translateY(0)';
            });
          });
        }, startDelay);
      });
    } else {
      animateElement(heroHeadline, { from: 'translateY(35px)', delay: 360, duration: 760 });
    }

    animateElement(document.getElementById('heroSubheadline'), { from: 'translateY(20px)', delay: 650 });
    animateElement(document.getElementById('heroCtaBlock'), { from: 'translateY(16px)', delay: 760 });
    animateElement(document.getElementById('heroTrustCards'), { from: 'translateY(22px) scale(0.98)', delay: 860 });

    const sweep = document.querySelector('.highlight-sweep');
    if (sweep) window.setTimeout(() => sweep.classList.add('active'), 980);

    const revealGroups = [
      { trigger: document.getElementById('what-we-offer'), items: '#what-we-offer .max-w-7xl > span, #what-we-offer .max-w-7xl > h2, #what-we-offer .max-w-7xl > p, #what-we-offer .offer-card, #what-we-offer .offer-cta', stagger: 70 },
      { trigger: document.getElementById('why-us'), items: '#whyUsArrowBtn, #whyUsEyebrow, #whyUsHeadline, #whyUsSubheadline, #why-us .flow-row .flow-shape, #why-us .flow-row .flow-text, #whyUsFooter', stagger: 65 },
      { trigger: document.getElementById('specialtiesTeaser'), items: '#specialtiesTeaser .max-w-3xl > *, #specialtiesTeaser .specialty-card, #specialtiesTeaser .inline-flex', stagger: 55 },
      { trigger: document.getElementById('blog'), items: '#blog .blog-section-header > *, #blog .blog-card', stagger: 70 },
      { trigger: document.querySelector('.blog-hero'), items: '.blog-hero .blog-chip, .blog-hero h1, .blog-hero p', stagger: 90 },
      { trigger: document.querySelector('.blog-section'), items: '.blog-section .blog-section-header > *, .blog-section .blog-card', stagger: 70 },
      { trigger: document.querySelector('.blog-post-header'), items: '.blog-post-header > *, .blog-post-cover, .blog-article-content, .blog-post-sidebar', stagger: 85 },
      { trigger: document.getElementById('testimonials'), items: '#testimonials .max-w-6xl:first-child > *, #testimonials .testimonials-swiper', stagger: 85 },
      { trigger: document.getElementById('contactHeroBanner'), items: '#contactHeroBanner, #contactHero3DIcon', stagger: 90 },
      { trigger: document.getElementById('analysisFormCard'), items: '#analysisFormCard, #contactInfoCardsContainer .contact-info-card', stagger: 90 },
      { trigger: document.getElementById('faqSectionHeader'), items: '#faqSectionHeader > *, #faqContainer .faq-item', stagger: 70 }
    ];

    revealGroups.forEach(group => {
      if (!group.trigger) return;
      observeOnce(group.trigger, () => {
        staggerElements(document.querySelectorAll(group.items), {
          from: 'translateY(22px)',
          stagger: group.stagger || 70
        });
      });
    });

    document.querySelectorAll('.category-section').forEach(section => {
      observeOnce(section, () => {
        const header = section.querySelector('.category-header');
        if (header) animateElement(header, { from: 'translateY(16px)' });
        staggerElements(section.querySelectorAll('.specialty-card'), {
          from: 'translateY(16px) scale(0.97)',
          delay: 80,
          stagger: 45,
          duration: 520
        });
      });
    });

    const processSection = document.getElementById('processSection');
    observeOnce(processSection, () => {
      staggerElements(document.querySelectorAll('#processSection .max-w-3xl > *'), { stagger: 85 });
      animateLine(document.getElementById('processConnectorLine'), 'x', 180);
      animateLine(document.getElementById('processVerticalLine'), 'y', 180);
      staggerElements(document.querySelectorAll('.process-step-desktop .process-circle, .process-step-mobile .process-circle'), {
        from: 'scale(0)',
        delay: 260,
        stagger: 130,
        duration: 520
      });
      staggerElements(document.querySelectorAll('.process-step-desktop .process-text, .process-step-mobile .process-text'), {
        from: 'translateY(15px)',
        delay: 420,
        stagger: 120,
        duration: 520
      });
    }, '0px 0px -18% 0px');
  }

  // --- ENTRANCE ANIMATIONS (WITH GSAP OR CSS FALLBACK) ---
  if (!enableHeavyMotion || !hasGsap || !hasScrollTrigger) {
    initLightweightMotion();
  } else {
    if (prefersReducedMotion) {
      revealMotionElements();
    } else {
      // Register ScrollTrigger plugin
      gsap.registerPlugin(ScrollTrigger);
      gsap.set('.specialty-card, .offer-card', { opacity: 1, clearProps: 'transform' });

      // Perform character wrapping for premium reveal animation
      const heroHeadline = document.getElementById('heroHeadline');
      if (heroHeadline) {
        wrapTextInSpans(heroHeadline);
      }

      const tl = gsap.timeline({
        defaults: {
          ease: 'power3.out',
          duration: 0.8
        }
      });

      // 1. Fixed Header fades and slides down
      tl.from('#mainHeader', {
        y: -60,
        opacity: 0,
        duration: 0.7
      });

      // 2. Wave background fades and flows in
      if (document.querySelector('.wave-bg')) {
        tl.from('.wave-bg', {
          opacity: 0,
          scale: 1.25,
          y: 80,
          duration: 1.8,
          ease: 'power3.out'
        }, '-=0.7');
      }

      // 3. Trust badge fades and pops up slightly
      if (document.getElementById('heroBadge')) {
        tl.from('#heroBadge', {
          y: 20,
          opacity: 0,
          scale: 0.95,
          duration: 0.5
        }, '-=1.2');
      }

      // 4. Staggered character reveal in headline
      const charInners = document.querySelectorAll('#heroHeadline .char-inner');
      if (charInners.length > 0) {
        tl.to(charInners, {
          y: '0%',
          opacity: 1,
          stagger: 0.012,
          duration: 0.85,
          ease: 'power3.out'
        }, '-=0.95');
      } else {
        tl.from('#heroHeadline', {
          y: 35,
          opacity: 0,
          duration: 0.7
        }, '-=0.9');
      }

      // 5. Subheadline entrance
      if (document.getElementById('heroSubheadline')) {
        tl.from('#heroSubheadline', {
          y: 20,
          opacity: 0,
          duration: 0.5
        }, '-=0.5');
      }

      // 6. CTA buttons entrance
      if (document.getElementById('heroCtaBlock')) {
        tl.from('#heroCtaBlock', {
          y: 15,
          opacity: 0,
          duration: 0.5
        }, '-=0.4');
      }

      // 7. Entry for trust cards container
      if (document.getElementById('heroTrustCards')) {
        tl.from('#heroTrustCards', {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'back.out(1.3)'
        }, '-=0.4');
      }

      // 8. Bubble orbs scale and fade in
      const orbs = document.querySelectorAll('.bubble-orb');
      if (orbs.length > 0) {
        tl.from(orbs, {
          scale: 0,
          opacity: 0,
          stagger: 0.08,
          duration: 1.0,
          ease: 'back.out(1.5)'
        }, '-=0.6');
      }

      // 9. Why Us Section entrance animations (ScrollTrigger)
      if (document.getElementById('why-us')) {
        const introTl = gsap.timeline({
          scrollTrigger: {
            trigger: '#why-us',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });

        introTl.from('#whyUsArrowBtn', {
          scale: 0,
          opacity: 0,
          duration: 0.6,
          ease: 'back.out(1.7)'
        })
        .from('#whyUsEyebrow', {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out'
        }, '-=0.4')
        .from('#whyUsHeadline', {
          y: 25,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.4')
        .call(() => {
          const sweep = document.querySelector('.highlight-sweep');
          if (sweep) sweep.classList.add('active');
        }, null, '-=0.2')
        .from('#whyUsSubheadline', {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out'
        }, '-=0.3')
        .from('#whyUsFooter', {
          opacity: 0,
          y: 10,
          duration: 0.5
        }, '-=0.3');

        // B. Flow rows entrance animations
        document.querySelectorAll('.flow-row').forEach((row) => {
          const shape = row.querySelector('.flow-shape');
          const text = row.querySelector('.flow-text');
          if (!shape || !text) return;
          
          const rowTl = gsap.timeline({
            scrollTrigger: {
              trigger: row,
              start: 'top 90%',
              toggleActions: 'play none none none'
            }
          });

          // Check if reversed on desktop
          const isReversedOnDesktop = row.classList.contains('lg:flex-row-reverse');
          const isDesktop = window.innerWidth >= 1024;
          
          let textX = -40; // Slide from left
          if (isReversedOnDesktop && isDesktop) {
            textX = 40; // Slide from right
          }

          rowTl.from(shape, {
            scale: 0.8,
            opacity: 0,
            duration: 0.6,
            ease: 'back.out(1.5)'
          })
          .from(text, {
            x: textX,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out'
          }, '-=0.45');
        });

        // C. Scroll-Linked Parallax for flow-shapes (3D layer depth)
        const flowShapes = document.querySelectorAll('#why-us .flow-shape');
        if (flowShapes.length > 0) {
          flowShapes.forEach(shape => {
            gsap.fromTo(shape, {
              yPercent: -10
            }, {
              scrollTrigger: {
                trigger: shape,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.5
              },
              yPercent: 10,
              ease: 'none'
            });
          });
        }
      }

      // --- OUR PROCESS SECTION ENTRANCE & PARALLAX ---
      if (document.getElementById('processSection')) {
        const mm = gsap.matchMedia();

        // Desktop (≥1024px)
        mm.add('(min-width: 1024px)', () => {
          const tlProc = gsap.timeline({
            scrollTrigger: {
              trigger: '#processSection',
              start: 'top 70%',
              toggleActions: 'play none none none'
            }
          });

          // 1. Header intro
          tlProc.fromTo('#processSection .max-w-3xl > *', {
            y: 25,
            opacity: 0
          }, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out'
          });

          // 2. Draw line
          const line = document.getElementById('processConnectorLine');
          if (line) {
            tlProc.to(line, {
              scaleX: 1,
              duration: 1.5,
              ease: 'power1.inOut'
            }, '-=0.2');
          }

          // 3. Stagger circles pop in
          const circles = document.querySelectorAll('.process-step-desktop .process-circle');
          if (circles.length > 0) {
            tlProc.fromTo(circles, {
              scale: 0,
              opacity: 0
            }, {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              stagger: 0.2,
              ease: 'back.out(1.7)'
            }, '-=1.4');
          }

          // 4. Stagger text blocks fade in
          const texts = document.querySelectorAll('.process-step-desktop .process-text');
          if (texts.length > 0) {
            tlProc.fromTo(texts, {
              y: 15,
              opacity: 0
            }, {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.2,
              ease: 'power2.out'
            }, '-=1.2');
          }

          // 5. Parallax Scroll effect on steps
          const steps = document.querySelectorAll('#processSection .process-step-desktop');
          if (steps.length > 0) {
            steps.forEach((step, idx) => {
              gsap.fromTo(step, {
                yPercent: idx % 2 === 0 ? -6 : 6
              }, {
                scrollTrigger: {
                  trigger: '#processSection',
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.5
                },
                yPercent: idx % 2 === 0 ? 6 : -6,
                ease: 'none'
              });
            });
          }
        });

        // Mobile (<1024px)
        mm.add('(max-width: 1023px)', () => {
          const tlProc = gsap.timeline({
            scrollTrigger: {
              trigger: '#processSection',
              start: 'top 75%',
              toggleActions: 'play none none none'
            }
          });

          // 1. Header intro
          tlProc.fromTo('#processSection .max-w-3xl > *', {
            y: 25,
            opacity: 0
          }, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out'
          });

          // 2. Draw line
          const lineM = document.getElementById('processVerticalLine');
          if (lineM) {
            tlProc.to(lineM, {
              scaleY: 1,
              duration: 1.5,
              ease: 'power1.inOut'
            }, '-=0.2');
          }

          // 3. Stagger mobile circles pop in
          const circlesM = document.querySelectorAll('.process-step-mobile .process-circle');
          if (circlesM.length > 0) {
            tlProc.fromTo(circlesM, {
              scale: 0,
              opacity: 0
            }, {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              stagger: 0.2,
              ease: 'back.out(1.7)'
            }, '-=1.4');
          }

          // 4. Stagger mobile text blocks
          const textsM = document.querySelectorAll('.process-step-mobile .process-text');
          if (textsM.length > 0) {
            tlProc.fromTo(textsM, {
              y: 15,
              opacity: 0
            }, {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.2,
              ease: 'power2.out'
            }, '-=1.2');
          }
        });
      }

      // --- WHAT WE OFFER SECTION SCROLL TRIGGER (HOMEPAGE) ---
      if (document.getElementById('what-we-offer')) {
        gsap.timeline({
          scrollTrigger: {
            trigger: '#what-we-offer',
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        })
        .fromTo('#what-we-offer .max-w-7xl > span, #what-we-offer .max-w-7xl > h2, #what-we-offer .max-w-7xl > p', {
          y: 30, opacity: 0
        }, {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out'
        })
        .set('#what-we-offer .offer-card', { opacity: 1, clearProps: 'transform' }, '-=0.25')
        .from('#what-we-offer .offer-card', {
          scale: 0.97, y: 12, duration: 0.45, stagger: 0.05, ease: 'power2.out'
        }, '-=0.2')
        .fromTo('#what-we-offer .offer-cta', {
          y: 15, opacity: 0
        }, {
          y: 0, opacity: 1, duration: 0.4, ease: 'power2.out'
        }, '-=0.2');
      }

      // --- SPECIALTIES HOMEPAGE TEASER SCROLL TRIGGER ---
      if (document.getElementById('specialtiesTeaser')) {
        const header = document.querySelector('#specialtiesTeaser .max-w-3xl');
        const cards = document.querySelectorAll('#specialtiesTeaser .specialty-card');
        const footerLink = document.querySelector('#specialtiesTeaser .inline-flex');
        
        const teaserTl = gsap.timeline({
          scrollTrigger: {
            trigger: '#specialtiesTeaser',
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        });

        if (header) {
          teaserTl.fromTo(header.children, {
            y: 30, opacity: 0
          }, {
            y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out'
          });
        }

        if (cards.length > 0) {
          gsap.set(cards, { opacity: 1, clearProps: 'transform' });
          teaserTl.from(cards, {
            scale: 0.96, y: 12, duration: 0.45, stagger: 0.05, ease: 'power2.out'
          }, '-=0.25');
        }

        if (footerLink) {
          teaserTl.fromTo(footerLink, {
            y: 15, opacity: 0
          }, {
            y: 0, opacity: 1, duration: 0.4, ease: 'power2.out'
          }, '-=0.2');
        }
      }

      // --- FULL SERVICES/SPECIALTIES CATEGORIES PAGE ENTRANCES ---
      const categorySections = document.querySelectorAll('.category-section');
      if (categorySections.length > 0) {
        categorySections.forEach(section => {
          const header = section.querySelector('.category-header');
          const cards = section.querySelectorAll('.specialty-card');
          if (!header || cards.length === 0) return;
          
          gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          })
          .fromTo(header, {
            y: 15, opacity: 0
          }, {
            y: 0, opacity: 1, duration: 0.5, ease: 'power2.out'
          })
          .set(cards, { opacity: 1, clearProps: 'transform' }, '-=0.15')
          .from(cards, {
            scale: 0.96, y: 12, duration: 0.45, stagger: 0.04, ease: 'power2.out'
          }, '-=0.2');
        });
      }

      // --- TESTIMONIALS SECTION ENTRANCE ---
      if (document.getElementById('testimonials')) {
        ScrollTrigger.create({
          trigger: '#testimonials',
          start: 'top 82%',
          once: true,
          onEnter: () => {
            gsap.from('#testimonials .max-w-6xl:first-child > *', {
              y: 24,
              opacity: 0,
              duration: 0.55,
              stagger: 0.12,
              ease: 'power2.out'
            });

            gsap.from('#testimonials .testimonials-swiper', {
              y: 20,
              duration: 0.6,
              ease: 'power2.out',
              clearProps: 'transform'
            });
          }
        });
      }

      // --- CONTACT & FAQ SECTION SCROLL TRIGGERS ---
      if (document.getElementById('contact') || document.getElementById('contact-section')) {
        const contactTriggerElement = document.getElementById('contact') || document.getElementById('contact-section');
        
        // 0. Contact Hero Banner Entrance
        const contactBanner = document.getElementById('contactHeroBanner');
        if (contactBanner) {
          gsap.fromTo(contactBanner, {
            y: 40, opacity: 0
          }, {
            scrollTrigger: {
              trigger: contactBanner,
              start: 'top 92%',
              toggleActions: 'play none none none'
            },
            y: 0, opacity: 1, duration: 0.8, ease: 'power2.out'
          });
        }

        // 3D Phone Icon Pop/Scale In
        const icon3d = document.getElementById('contactHero3DIcon');
        if (icon3d && contactBanner) {
          gsap.fromTo(icon3d, {
            scale: 0.7, opacity: 0
          }, {
            scrollTrigger: {
              trigger: contactBanner,
              start: 'top 90%',
              toggleActions: 'play none none none'
            },
            scale: 1, opacity: 1, duration: 1, delay: 0.2, ease: 'back.out(1.7)'
          });
        }

        // 1. Form Card Entrance
        const formCard = document.getElementById('analysisFormCard');
        if (formCard) {
          gsap.fromTo(formCard, {
            y: 40, opacity: 0
          }, {
            scrollTrigger: {
              trigger: formCard,
              start: 'top 88%',
              toggleActions: 'play none none none'
            },
            y: 0, opacity: 1, duration: 0.8, ease: 'power2.out'
          });
        }

        // 2. Wave Parallax Scroll Effect
        const waveDesk = document.getElementById('parallax-wave-desktop');
        if (waveDesk && formCard) {
          gsap.fromTo(waveDesk, {
            yPercent: -20
          }, {
            scrollTrigger: {
              trigger: formCard,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5
            },
            yPercent: 20,
            force3D: true,
            ease: 'none'
          });
        }

        const waveMob = document.getElementById('parallax-wave-mobile');
        if (waveMob && formCard) {
          gsap.fromTo(waveMob, {
            yPercent: -20
          }, {
            scrollTrigger: {
              trigger: formCard,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5
            },
            yPercent: 20,
            force3D: true,
            ease: 'none'
          });
        }

        // 3. Info Cards Stagger
        const infoCards = document.getElementById('contactInfoCardsContainer');
        if (infoCards) {
          gsap.fromTo('#contactInfoCardsContainer .contact-info-card', {
            y: 30, opacity: 0
          }, {
            scrollTrigger: {
              trigger: infoCards,
              start: 'top 88%',
              toggleActions: 'play none none none'
            },
            y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out'
          });
        }

        // 4. FAQ Section Header & Accordions
        const faqHeader = document.getElementById('faqSectionHeader');
        if (faqHeader) {
          gsap.fromTo('#faqSectionHeader > *', {
            y: 20, opacity: 0
          }, {
            scrollTrigger: {
              trigger: faqHeader,
              start: 'top 90%',
              toggleActions: 'play none none none'
            },
            y: 0, opacity: 1, duration: 0.5, stagger: 0.15, ease: 'power2.out'
          });
        }

        const faqContainer = document.getElementById('faqContainer');
        if (faqContainer) {
          gsap.fromTo('#faqContainer .faq-item', {
            y: 20, opacity: 0
          }, {
            scrollTrigger: {
              trigger: faqContainer,
              start: 'top 88%',
              toggleActions: 'play none none none'
            },
            y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out'
          });
        }
      }

      // --- FAQ ACCORDION INTERACTION ---
      const faqColumns = document.querySelectorAll('.faq-column');
      if (faqColumns.length > 0) {
        faqColumns.forEach(column => {
          const items = column.querySelectorAll('.faq-item');
          items.forEach(item => {
            const trigger = item.querySelector('.faq-trigger');
            const content = item.querySelector('.faq-content');

            if (trigger && content) {
              trigger.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Collapse all other items in the same column
                items.forEach(otherItem => {
                  otherItem.classList.remove('active');
                  const otherContent = otherItem.querySelector('.faq-content');
                  if (otherContent) {
                    otherContent.style.gridTemplateRows = '0fr';
                  }
                });

                // Toggle clicked item
                if (!isActive) {
                  item.classList.add('active');
                  content.style.gridTemplateRows = '1fr';
                }
              });
            }
          });
        });
      }

    }
  }

  function initFaqAccordion() {
    const faqContainers = document.querySelectorAll('#faqContainer');
    faqContainers.forEach(container => {
      if (container.dataset.ready === 'true') return;
      container.dataset.ready = 'true';
      const items = container.querySelectorAll('.faq-item');
      items.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');
        if (!trigger || !content) return;

        trigger.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          items.forEach(otherItem => {
            otherItem.classList.remove('active');
            const otherContent = otherItem.querySelector('.faq-content');
            if (otherContent) otherContent.style.gridTemplateRows = '0fr';
          });

          if (!isActive) {
            item.classList.add('active');
            content.style.gridTemplateRows = '1fr';
          }
        });
      });
    });
  }

  function initLightweightTestimonials() {
    const swiperContainer = document.querySelector('.testimonials-swiper');
    if (!swiperContainer || typeof Swiper === 'undefined' || swiperContainer.dataset.ready === 'true') return;
    swiperContainer.dataset.ready = 'true';

    const testimonialsSwiper = new Swiper('.testimonials-swiper', {
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      loop: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      pagination: {
        el: '.testimonials-swiper .swiper-pagination',
        clickable: true
      },
      speed: 520
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (testimonialsSwiper.autoplay) testimonialsSwiper.autoplay.start();
        } else if (testimonialsSwiper.autoplay) {
          testimonialsSwiper.autoplay.stop();
        }
      });
    }, { threshold: 0.1 });

    observer.observe(swiperContainer);
  }

  initFaqAccordion();
  initLightweightTestimonials();

  // ===== ANALYSIS FORM SUBMISSION (Redesigned Form) =====
  document.querySelectorAll('#billingAnalysisForm').forEach(function(analysisForm) {
    analysisForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      var submitBtn = analysisForm.querySelector('button[type="submit"]');
      var formStatus = analysisForm.querySelector('#formStatus');
      
      var originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Submitting...';
      submitBtn.disabled = true;
      
      formStatus.classList.add('hidden');
      formStatus.classList.remove('bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800');

      var formData = new FormData(analysisForm);
      var data = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        website: formData.get('website') || ''
      };

      try {
        var response = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        var result;
        var contentType = response.headers.get('content-type') || '';
        if (contentType.indexOf('application/json') !== -1) {
          result = await response.json();
        } else {
          var text = await response.text();
          throw new Error(text || 'Invalid server response');
        }

        if (result.success) {
          formStatus.textContent = 'Thank you! We will contact you within 24 hours.';
          formStatus.classList.remove('hidden', 'bg-red-100', 'text-red-800');
          formStatus.classList.add('bg-green-100', 'text-green-800');
          formStatus.setAttribute('tabindex', '-1');
          formStatus.focus();
          analysisForm.reset();
        } else {
          throw new Error(result.error || 'An error occurred. Please try again.');
        }
      } catch (err) {
        console.error('Form submission error:', err);
        formStatus.textContent = err.message || 'An error occurred. Please try again.';
        formStatus.classList.remove('hidden', 'bg-green-100', 'text-green-800');
        formStatus.classList.add('bg-red-100', 'text-red-800');
      } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  });
});
