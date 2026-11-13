/* ==========================================================================
   AANGAN RASOI — MAIN JAVASCRIPT
   Navigation, Theme Toggle, RTL Toggle, Interactive Daily Menu,
   Plan Switcher, Form Validation & Student Dashboard Interactions
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. THEME TOGGLE (LIGHT / DARK) WITH LOCALSTORAGE PERSISTENCE
     ------------------------------------------------------------------------ */
  const THEME_KEY = 'aangan_rasoi_theme';
  const DIR_KEY = 'aangan_rasoi_direction';
  const rootEl = document.documentElement;

  function getInitialTheme() {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) {
      /* ignore storage errors */
    }
    return 'light';
  }

  function applyTheme(theme) {
    rootEl.setAttribute('data-theme', theme);
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach((btn) => {
      btn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
      btn.setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  applyTheme(getInitialTheme());

  /* ------------------------------------------------------------------------
     1B. RTL TOGGLE WITH LOCALSTORAGE PERSISTENCE (EXACT STYLE WITH THEME BTN)
     ------------------------------------------------------------------------ */
  function getInitialDir() {
    try {
      const saved = localStorage.getItem(DIR_KEY);
      if (saved === 'rtl' || saved === 'ltr') return saved;
    } catch (e) {
      /* ignore */
    }
    return 'ltr';
  }

  function applyDir(dir) {
    rootEl.setAttribute('dir', dir);
    const rtlToggles = document.querySelectorAll('.rtl-toggle');
    rtlToggles.forEach((btn) => {
      /* As required: ONLY "RTL" text inside button */
      btn.textContent = 'RTL';
      if (dir === 'rtl') {
        btn.classList.add('active');
        btn.setAttribute('aria-label', 'Switch to LTR direction');
        btn.setAttribute('title', 'Switch to LTR direction');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-label', 'Switch to RTL direction');
        btn.setAttribute('title', 'Switch to RTL direction');
      }
    });
  }

  applyDir(getInitialDir());

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(rootEl.getAttribute('data-theme') || 'light');
    applyDir(rootEl.getAttribute('dir') || 'ltr');

    /* Theme Toggle Event */
    const themeButtons = document.querySelectorAll('.theme-toggle');
    themeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const current = rootEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch (e) {
          /* ignore */
        }
      });
    });

    /* RTL Toggle Event */
    const rtlButtons = document.querySelectorAll('.rtl-toggle');
    rtlButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const current = rootEl.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr';
        const next = current === 'rtl' ? 'ltr' : 'rtl';
        applyDir(next);
        try {
          localStorage.setItem(DIR_KEY, next);
        } catch (e) {
          /* ignore */
        }
      });
    });

    /* ----------------------------------------------------------------------
       2. STICKY HEADER & MOBILE NAVIGATION + HOME DROPDOWN
       ---------------------------------------------------------------------- */
    const header = document.querySelector('.site-header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const dropdownItems = document.querySelectorAll('.nav-item.dropdown');

    function handleScroll() {
      if (!header) return;
      if (window.scrollY > 12) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    function closeMobileMenu() {
      if (!mobileMenuBtn || !navMenu) return;
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    if (mobileMenuBtn && navMenu) {
      mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
          closeMobileMenu();
        } else {
          mobileMenuBtn.setAttribute('aria-expanded', 'true');
          navMenu.classList.add('is-open');
        }
      });
    }

    dropdownItems.forEach((item) => {
      const toggle = item.querySelector('.dropdown-toggle');
      if (!toggle) return;

      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = item.classList.contains('open');
        dropdownItems.forEach((other) => {
          other.classList.remove('open');
          const otherBtn = other.querySelector('.dropdown-toggle');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          toggle.setAttribute('aria-expanded', 'true');
        }
      });
    });

    document.addEventListener('click', (e) => {
      dropdownItems.forEach((item) => {
        if (!item.contains(e.target)) {
          item.classList.remove('open');
          const btn = item.querySelector('.dropdown-toggle');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });

      if (
        navMenu &&
        navMenu.classList.contains('is-open') &&
        !navMenu.contains(e.target) &&
        mobileMenuBtn &&
        !mobileMenuBtn.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdownItems.forEach((item) => {
          item.classList.remove('open');
          const btn = item.querySelector('.dropdown-toggle');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
        closeMobileMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1120) {
        closeMobileMenu();
      }
    });

    /* ----------------------------------------------------------------------
       3. INTERACTIVE DAILY MENU SWITCHER (HOME 1 & HOME 2 & DASHBOARD)
       ---------------------------------------------------------------------- */
    const menuData = {
      monday: {
        label: 'Monday — Fresh Start Homely Spread',
        breakfast: {
          title: 'Indori Poha, Jalebi & Masala Chai',
          items: [
            'Fluffy Kanda-Batata Poha with roasted peanuts & fresh coriander',
            '2 Boiled Eggs or Sprouted Moong Chaat (protein option)',
            'Steaming Adrak-Elaichi Chai or Hot Filter Coffee'
          ],
          note: 'Unlimited Poha & Chai refill'
        },
        lunch: {
          title: 'Punjabi Rajma Masala & Jeera Rice Thali',
          items: [
            'Slow-simmered Jammu Rajma in home-ground tomato-ginger gravy',
            'Seasonal Aloo Gobi Adraki + 4 Hot Tawa Phulkas with desi ghee',
            'Steamed Basmati Jeera Rice, Boondi Raita & Kachumber Salad'
          ],
          note: 'Unlimited Rice, Dal/Gravy & Rotis'
        },
        snacks: {
          title: 'Crispy Veg Cutlet & Ginger Kulhad Tea',
          items: [
            '2 Golden Beetroot & Potato Cutlets (air-fried / low oil)',
            'Fresh Pudina-Coriander Green Chutney & Tamarind Dip',
            'Hot Ginger Cardamom Tea or Lemon Iced Tea'
          ],
          note: 'Prepared fresh at 4:45 PM'
        },
        dinner: {
          title: 'Lasooni Dal Tadka, Matar Paneer & Phulkas',
          items: [
            'Homestyle Yellow Toor-Moong Dal with desi ghee garlic tempering',
            'Fresh Matar Paneer (or Egg Curry for Non-Veg subscribers)',
            '4 Soft Whole-Wheat Chapatis, Steamed Rice & Warm Seviyan Kheer'
          ],
          note: 'Light on oil, zero baking soda'
        }
      },
      wednesday: {
        label: 'Wednesday — Mid-Week Student Favorites',
        breakfast: {
          title: 'Crisp Masala Dosa, Idli & Sambar',
          items: [
            'Golden Roast Aloo Masala Dosa + 2 Fluffy Steamed Idlis',
            'Drumstick-Pumpkin Ratna Sambar & Fresh Coconut Chutney',
            'Banana / Seasonal Fruit + Filter Coffee or Masala Tea'
          ],
          note: 'Freshly fermented stone-ground batter'
        },
        lunch: {
          title: 'Amritsari Chole, Bhature / Phulka & Chaas',
          items: [
            'Pindi Chole cooked with whole spices & amla (no artificial color)',
            'Jeera Pulao, Fresh Mix Veg Poriyal & Whole-Wheat Rotis',
            'Chilled Roasted-Cumin Buttermilk (Chaas) & Onion-Lemon Salad'
          ],
          note: 'Includes 1 glass spiced Chaas'
        },
        snacks: {
          title: 'Baked Samosa Chaat & Masala Chai',
          items: [
            'Punjabi Aloo-Peas Samosa topped with curd & chutneys',
            'Roasted Makhana-Peanut Namkeen bowl',
            'Steaming Kulhad Masala Chai'
          ],
          note: 'Hot off the kitchen counter'
        },
        dinner: {
          title: 'Palak Paneer / Methi Chicken & Dal Fry',
          items: [
            'Iron-rich Homestyle Palak Paneer (or Homestyle Chicken Curry)',
            'Dhaba-style Chana Dal Fry + 4 Soft Phulka Rotis',
            'Steamed Rice, Cucumber Salad & Homemade Curd'
          ],
          note: 'Separate Veg & Non-Veg vessels & counters'
        }
      },
      friday: {
        label: 'Friday — Comfort & Regional Classics',
        breakfast: {
          title: 'Stuffed Aloo-Pyaz Paratha & Fresh Curd',
          items: [
            '2 Whole-Wheat Stuffed Aloo-Methi Parathas cooked on iron tawa',
            'Thick Homemade Dahi, White Butter & Homemade Mango Pickle',
            'Hot Masala Chai or Warm Haldi Milk'
          ],
          note: '100% Chakki-milled MP Sharbati Atta'
        },
        lunch: {
          title: 'Gujarati Kadhi Pakora, Bhindi Fry & Dal Khichdi',
          items: [
            'Comforting Besan Kadhi with soft methi pakoras',
            'Crispy Kurkuri Bhindi Masala + Toor Dal Tadka',
            'Ghee Phulkas, Steamed Rice, Roasted Papad & Beetroot Salad'
          ],
          note: 'Student comfort favorite'
        },
        snacks: {
          title: 'Sweet Corn Bhel & Elaichi Tea',
          items: [
            'Steamed Butter Sweet Corn tossed with tomato, cucumber & lime',
            '2 Multi-grain Bakery Cookies',
            'Hot Cardamom Tea or Cold Coffee'
          ],
          note: 'Light, energizing pre-study snack'
        },
        dinner: {
          title: 'Veg Dum Biryani / Egg Biryani & Mirchi Salan',
          items: [
            'Aromatic Long-Grain Basmati Subz Dum Biryani (or Egg/Chicken Biryani)',
            'Hyderabadi Peanut-Sesame Salan & Thick Vegetable Raita',
            'Warm Moong Dal Halwa or Gulab Jamun (1 pc)'
          ],
          note: 'Friday Night Special Dinner'
        }
      },
      sunday: {
        label: 'Sunday — Feast Day & Homely Indulgence',
        breakfast: {
          title: 'Puri Bhaji, Sooji Halwa & Masala Chai',
          items: [
            'Fluffy Whole-Wheat Puris with Hing-Jeera Aloo Tamatar Sabzi',
            'Warm Kesar Sooji Halwa garnished with almonds',
            'Steaming Kulhad Chai & Fresh Cut Papaya'
          ],
          note: 'Relaxed Sunday timing till 10:00 AM'
        },
        lunch: {
          title: 'Grand Sunday Feast Thali (Paneer / Chicken Special)',
          items: [
            'Paneer Lababdar (or Homestyle Sunday Chicken Masala)',
            'Dal Makhani (slow-cooked 6 hours), Veg Pulao & Garlic Naan / Rotis',
            'Pineapple Raita, Green Salad, Papad & Rasmalai / Gulab Jamun'
          ],
          note: 'Included in all Full-Day & Lunch plans'
        },
        snacks: {
          title: 'Mumbai Vada Pav / Veg Sandwich & Chai',
          items: [
            'Freshly grilled Chutney Veg Sandwich or Warm Batata Vada Pav',
            'Dry Garlic Chutney & Green Coriander Dip',
            'Hot Adrak Chai'
          ],
          note: 'Served 5:00 PM – 6:15 PM'
        },
        dinner: {
          title: 'Light Sunday Comfort: Moong Dal Khichdi & Kadhi',
          items: [
            'Digestive Ghee Tadka Moong Dal Khichdi after a heavy afternoon feast',
            'Aloo Methi Tuk, Gujarati Kadhi & Phulka Rotis',
            'Roasted Papad, Homemade Pickle & Warm Milk'
          ],
          note: 'Easy on the stomach before Monday classes'
        }
      }
    };

    const dayButtons = document.querySelectorAll('[data-menu-day]');
    if (dayButtons.length > 0) {
      dayButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const dayKey = btn.getAttribute('data-menu-day');
          const dayInfo = menuData[dayKey];
          if (!dayInfo) return;

          dayButtons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');

          const dayLabelEl = document.getElementById('active-menu-day-label');
          if (dayLabelEl) dayLabelEl.textContent = dayInfo.label;

          ['breakfast', 'lunch', 'snacks', 'dinner'].forEach((slot) => {
            const card = document.querySelector(`[data-meal-slot="${slot}"]`);
            if (!card || !dayInfo[slot]) return;
            const titleEl = card.querySelector('.meal-slot-title');
            const listEl = card.querySelector('.meal-items-list');
            const noteEl = card.querySelector('.meal-slot-note');

            if (titleEl) titleEl.textContent = dayInfo[slot].title;
            if (listEl) {
              listEl.innerHTML = dayInfo[slot].items
                .map((item) => `<li>${item}</li>`)
                .join('');
            }
            if (noteEl) noteEl.textContent = dayInfo[slot].note;
          });
        });
      });
    }

    /* ----------------------------------------------------------------------
       4. MEAL PLAN BILLING & DIETARY SWITCHER
       ---------------------------------------------------------------------- */
    const billingBtns = document.querySelectorAll('[data-billing-cycle]');
    const dietFilterBtns = document.querySelectorAll('[data-diet-filter]');

    let currentCycle = 'monthly';
    let currentDiet = 'veg';

    function updatePricingCards() {
      const cards = document.querySelectorAll('[data-plan-card]');
      cards.forEach((card) => {
        const priceAmountEl = card.querySelector('.price-amount');
        const pricePeriodEl = card.querySelector('.price-period');
        const dietBadgeEl = card.querySelector('[data-plan-diet-badge]');
        const ctaLink = card.querySelector('[data-plan-cta]');

        if (!priceAmountEl) return;

        const key = `${currentCycle}-${currentDiet}`;
        const priceVal = card.getAttribute(`data-price-${key}`);
        const periodLabel =
          currentCycle === 'weekly' ? '/ week (7 days)' : '/ month (30 days)';

        if (priceVal) {
          priceAmountEl.textContent = priceVal;
        }
        if (pricePeriodEl) {
          pricePeriodEl.textContent = periodLabel;
        }

        if (dietBadgeEl) {
          if (currentDiet === 'nonveg') {
            dietBadgeEl.className = 'diet-badge diet-badge-nonveg';
            dietBadgeEl.innerHTML =
              '<span class="fssai-dot"></span> Veg + Egg / Non-Veg (4x/wk)';
          } else {
            dietBadgeEl.className = 'diet-badge diet-badge-veg';
            dietBadgeEl.innerHTML = '<span class="fssai-dot"></span> 100% Pure Vegetarian';
          }
        }

        if (ctaLink) {
          const planSlug = card.getAttribute('data-plan-card');
          ctaLink.setAttribute(
            'href',
            `contact.html?plan=${encodeURIComponent(planSlug)}&cycle=${encodeURIComponent(
              currentCycle
            )}&diet=${encodeURIComponent(currentDiet)}#enquiry-form`
          );
        }
      });
    }

    billingBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        currentCycle = btn.getAttribute('data-billing-cycle') || 'monthly';
        billingBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        updatePricingCards();
      });
    });

    dietFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        currentDiet = btn.getAttribute('data-diet-filter') || 'veg';
        dietFilterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        updatePricingCards();
      });
    });

    /* ----------------------------------------------------------------------
       5. FAQ ACCORDION
       ---------------------------------------------------------------------- */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
      const btn = item.querySelector('.faq-question');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach((other) => {
          other.classList.remove('open');
          const otherBtn = other.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    /* ----------------------------------------------------------------------
       6. URL QUERY PRE-FILL FOR CONTACT & SIGN UP FORMS
       ---------------------------------------------------------------------- */
    const params = new URLSearchParams(window.location.search);
    const planParam = params.get('plan');
    const dietParam = params.get('diet');

    if (planParam) {
      const planSelect = document.querySelector('select[name="preferred_plan"]');
      if (planSelect) {
        const matchingOption = Array.from(planSelect.options).find(
          (opt) => opt.value === planParam
        );
        if (matchingOption) planSelect.value = planParam;
      }
    }

    if (dietParam) {
      const dietRadio = document.querySelector(
        `input[name="dietary_preference"][value="${dietParam}"]`
      );
      if (dietRadio) dietRadio.checked = true;
    }

    /* ----------------------------------------------------------------------
       7. PASSWORD VISIBILITY TOGGLES & FORGOT PASSWORD DRAWER
       ---------------------------------------------------------------------- */
    const passToggles = document.querySelectorAll('.password-toggle-btn');
    passToggles.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (!input) return;
        const isPassword = input.getAttribute('type') === 'password';
        input.setAttribute('type', isPassword ? 'text' : 'password');
        btn.textContent = isPassword ? 'Hide' : 'Show';
      });
    });

    const forgotLink = document.getElementById('forgot-password-trigger');
    const forgotBox = document.getElementById('forgot-password-box');
    const forgotResetBtn = document.getElementById('forgot-reset-submit');
    if (forgotLink && forgotBox) {
      forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        const isHidden = forgotBox.style.display === 'none' || !forgotBox.style.display;
        forgotBox.style.display = isHidden ? 'block' : 'none';
      });
    }
    if (forgotResetBtn) {
      forgotResetBtn.addEventListener('click', () => {
        const resetInput = document.getElementById('reset-contact-input');
        const resetMsg = document.getElementById('reset-status-msg');
        if (!resetInput || !resetMsg) return;
        if (!resetInput.value.trim()) {
          resetMsg.style.display = 'block';
          resetMsg.style.color = '#C93B2B';
          resetMsg.textContent = 'Please enter your registered student email or 10-digit phone number.';
          return;
        }
        resetMsg.style.display = 'block';
        resetMsg.style.color = 'var(--veg-color)';
        resetMsg.textContent = `Password reset instructions have been sent to ${resetInput.value.trim()}. (Sample UI Confirmation)`;
      });
    }

    /* ----------------------------------------------------------------------
       8. SOCIAL LOGIN FEEDBACK (GOOGLE & APPLE)
       ---------------------------------------------------------------------- */
    const socialButtons = document.querySelectorAll('.btn-social');
    socialButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const provider = btn.textContent.trim();
        const parentCard = btn.closest('.auth-card');
        const statusBanner = parentCard ? parentCard.querySelector('.form-status-banner') : null;
        if (statusBanner) {
          statusBanner.innerHTML = `
            <div>
              <strong>${provider} Authentication Initialized (Frontend UI Demo)</strong><br />
              Connecting securely to your college student account.
            </div>
          `;
          statusBanner.classList.add('success');
          statusBanner.style.display = 'flex';
        }
      });
    });

    /* ----------------------------------------------------------------------
       9. FORM VALIDATION & SUBMISSION FEEDBACK (CONTACT, LOGIN, SIGN UP)
       ---------------------------------------------------------------------- */
    const forms = document.querySelectorAll('[data-validate-form]');
    forms.forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const requiredInputs = form.querySelectorAll('[required]');
        requiredInputs.forEach((input) => {
          const group = input.closest('.form-group');
          let fieldValid = true;
          const val = input.value.trim();

          if (input.type === 'checkbox') {
            fieldValid = input.checked;
          } else if (!val) {
            fieldValid = false;
          } else if (input.type === 'email') {
            fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
          } else if (input.getAttribute('data-phone') === 'true' || input.type === 'tel') {
            fieldValid = /^[0-9+\-\s()]{10,15}$/.test(val);
          } else if (input.getAttribute('minlength')) {
            fieldValid = val.length >= parseInt(input.getAttribute('minlength'), 10);
          }

          if (!fieldValid) {
            isValid = false;
            input.classList.add('is-invalid');
            if (group) group.classList.add('has-error');
          } else {
            input.classList.remove('is-invalid');
            if (group) group.classList.remove('has-error');
          }
        });

        /* Confirm Password check on Sign Up form */
        const passInput = form.querySelector('input[name="password"]');
        const confirmInput = form.querySelector('input[name="confirm_password"]');
        if (passInput && confirmInput) {
          const confirmGroup = confirmInput.closest('.form-group');
          if (
            !confirmInput.value ||
            confirmInput.value !== passInput.value ||
            passInput.value.length < 6
          ) {
            isValid = false;
            confirmInput.classList.add('is-invalid');
            if (confirmGroup) confirmGroup.classList.add('has-error');
          } else {
            confirmInput.classList.remove('is-invalid');
            if (confirmGroup) confirmGroup.classList.remove('has-error');
          }
        }

        const statusBanner = form.querySelector('.form-status-banner');
        if (!isValid) {
          if (statusBanner) {
            statusBanner.classList.remove('success');
            statusBanner.style.display = 'none';
          }
          const firstInvalid = form.querySelector('.is-invalid');
          if (firstInvalid) firstInvalid.focus();
          return;
        }

        if (statusBanner) {
          const formType = form.getAttribute('data-validate-form');
          let messageHTML = '';

          if (formType === 'contact-enquiry') {
            const nameVal = (form.querySelector('[name="student_name"]')?.value || 'Student').trim();
            const planSelect = form.querySelector('[name="preferred_plan"]');
            const planText = planSelect
              ? planSelect.options[planSelect.selectedIndex]?.text
              : 'Selected Meal Plan';
            messageHTML = `
              <div>
                <strong>Meal Enquiry Received, ${nameVal}!</strong><br/>
                We have noted your interest in the <em>${planText}</em>. Our Mess Manager will reach out on your phone/WhatsApp within 2 hours to schedule your kitchen tour and trial meal. (No payment required online).
              </div>
            `;
            form.reset();
          } else if (formType === 'login-form') {
            const userVal = (form.querySelector('[name="identifier"]')?.value || 'Student').trim();
            messageHTML = `
              <div>
                <strong>Welcome back, ${userVal}!</strong><br/>
                Login successful. Redirecting to your <a href="dashboard.html" style="text-decoration: underline; font-weight: 700;">Student Dashboard</a>...
              </div>
            `;
            setTimeout(() => {
              window.location.href = 'dashboard.html';
            }, 1200);
          } else if (formType === 'signup-form') {
            const nameVal = (form.querySelector('[name="student_name"]')?.value || 'Student').trim();
            messageHTML = `
              <div>
                <strong>Student Profile Created for ${nameVal}!</strong><br/>
                Your account is ready. Redirecting to your <a href="dashboard.html" style="text-decoration: underline; font-weight: 700;">Student Dashboard</a>...
              </div>
            `;
            setTimeout(() => {
              window.location.href = 'dashboard.html';
            }, 1400);
          }

          statusBanner.innerHTML = messageHTML;
          statusBanner.classList.add('success');
          statusBanner.style.display = 'flex';
          statusBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });

      /* Clear field error on input */
      form.querySelectorAll('input, select, textarea').forEach((field) => {
        field.addEventListener('input', () => {
          field.classList.remove('is-invalid');
          const group = field.closest('.form-group');
          if (group) group.classList.remove('has-error');
        });
      });
    });

    /* ----------------------------------------------------------------------
       10. STUDENT DASHBOARD INTERACTIONS (TABS, SIDEBAR & PAYMENTS)
       ---------------------------------------------------------------------- */
    const dashSidebarToggles = document.querySelectorAll(
      '.dashboard-hamburger-btn, .dashboard-mobile-sidebar-toggle, .dashboard-mobile-toggle, #dashboard-mobile-toggle'
    );
    const dashSidebar = document.querySelector('.dashboard-sidebar');
    const dashBackdrop = document.getElementById('dashboard-backdrop');
    const dashSidebarClose = document.getElementById('dashboard-sidebar-close');

    function openDashboardMenu() {
      if (!dashSidebar) return;
      dashSidebar.classList.add('is-open');
      if (dashBackdrop) dashBackdrop.classList.add('active');
    }

    function closeDashboardMenu() {
      if (!dashSidebar) return;
      dashSidebar.classList.remove('is-open');
      if (dashBackdrop) dashBackdrop.classList.remove('active');
    }

    if (dashSidebarToggles.length > 0 && dashSidebar) {
      dashSidebarToggles.forEach((tBtn) => {
        tBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (dashSidebar.classList.contains('is-open')) {
            closeDashboardMenu();
          } else {
            openDashboardMenu();
          }
        });
      });

      if (dashSidebarClose) {
        dashSidebarClose.addEventListener('click', (e) => {
          e.stopPropagation();
          closeDashboardMenu();
        });
      }

      if (dashBackdrop) {
        dashBackdrop.addEventListener('click', () => {
          closeDashboardMenu();
        });
      }

      /* Close sidebar on click outside on mobile & tablet (<= 1024px) */
      document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && dashSidebar.classList.contains('is-open')) {
          if (!dashSidebar.contains(e.target)) {
            closeDashboardMenu();
          }
        }
      });
    }

    const dashNavButtons = document.querySelectorAll('.dashboard-nav-btn');
    const dashSections = document.querySelectorAll('.dashboard-view-panel');
    dashNavButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-view-target');
        if (!targetId) return;

        dashNavButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        dashSections.forEach((sec) => {
          if (sec.id === targetId) {
            sec.style.display = 'block';
            sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            sec.style.display = 'none';
          }
        });

        if (dashSidebar && window.innerWidth <= 1024) {
          closeDashboardMenu();
        }
      });
    });

    /* Dashboard Meal Pause Form */
    const pauseForm = document.getElementById('meal-pause-form');
    if (pauseForm) {
      pauseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const startVal = document.getElementById('pause-start-date')?.value;
        const endVal = document.getElementById('pause-end-date')?.value;
        const reasonVal = document.getElementById('pause-reason')?.value || 'Vacation/Home Visit';
        const banner = document.getElementById('pause-status-banner');

        if (!startVal || !endVal) {
          if (banner) {
            banner.style.display = 'block';
            banner.style.color = '#C93B2B';
            banner.textContent = 'Please select both departure and return dates.';
          }
          return;
        }

        if (banner) {
          banner.style.display = 'flex';
          banner.className = 'form-status-banner success';
          banner.innerHTML = `
            <div>
              <strong>Meal Pause Logged Successfully!</strong><br />
              Your meals are paused from <strong>${startVal}</strong> to <strong>${endVal}</strong> (${reasonVal}).
              These unused meal days have been credited to your next billing cycle.
            </div>
          `;
          pauseForm.reset();
        }
      });
    }

    /* Dashboard Fee Payment Form */
    const feePayForm = document.getElementById('fee-payment-form');
    if (feePayForm) {
      feePayForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const method = document.querySelector('input[name="payment_method"]:checked')?.value || 'UPI';
        const banner = document.getElementById('fee-status-banner');
        if (banner) {
          banner.style.display = 'flex';
          banner.className = 'form-status-banner success';
          banner.innerHTML = `
            <div>
              <strong>Mess Fee Payment Successful via ${method}!</strong><br />
              Transaction Ref: <em>AR-TXN-2026-${Math.floor(100000 + Math.random() * 900000)}</em>.
              Your student meal pass has been renewed for the next 30 days. An invoice has been generated below.
            </div>
          `;
          const dueStatus = document.getElementById('fee-due-status');
          if (dueStatus) {
            dueStatus.textContent = '₹0 (Paid)';
            dueStatus.style.color = 'var(--veg-color)';
          }
        }
      });
    }

    /* Dashboard Plan Upgrade / Change */
    const planChangeForm = document.getElementById('plan-change-form');
    if (planChangeForm) {
      planChangeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newPlan = document.getElementById('change-plan-select')?.value;
        const banner = document.getElementById('plan-change-banner');
        if (banner) {
          banner.style.display = 'flex';
          banner.className = 'form-status-banner success';
          banner.innerHTML = `
            <div>
              <strong>Meal Plan Change Requested!</strong><br />
              Your request to switch to <em>${newPlan}</em> will take effect starting next Monday.
              Our Mess Desk has updated your student profile.
            </div>
          `;
        }
      });
    }
  });
})();
