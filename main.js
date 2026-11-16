// Dr. Neha Vashisth Clinic — Production JS
// Animations · OPD Status · FAQ · Form · WhatsApp Modal

document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  updateLiveClinicStatus();
  setInterval(updateLiveClinicStatus, 60000);
  initDateConstraints();
  initFAQ();
  initMobileNav();
  initHeaderElevation();
  initScrollSpy();
  initReviewLikes();
  initCounterAnimation();
  initSpecialtyHover();
});

/* ══════════════════════════════════════════
   1. AOS — Animate On Scroll
══════════════════════════════════════════ */
function initAOS() {
  if (typeof AOS === 'undefined') return;
  const isMobile = window.innerWidth < 480;
  AOS.init({
    duration: isMobile ? 0 : 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: isMobile ? 0 : 50,
    disable: false
  });
}

/* ══════════════════════════════════════════
   2. LIVE OPD STATUS BADGE (IST)
══════════════════════════════════════════ */
function updateLiveClinicStatus() {
  const el = document.getElementById('clinicStatusBadge');
  if (!el) return;

  const now = new Date();
  const ist = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + 19800000);
  const day = ist.getDay(); // 0=Sun
  const t = ist.getHours() * 60 + ist.getMinutes();

  let text, dotCls, pingCls;

  if (day === 0) {
    // Sunday: 9 AM–12 PM
    if (t >= 540 && t < 720) {
      text = 'Sunday OPD Open Now'; dotCls = 'bg-emerald-500'; pingCls = 'bg-emerald-400';
    } else if (t < 540) {
      text = 'Sunday OPD opens at 9 AM'; dotCls = 'bg-amber-500'; pingCls = 'bg-amber-400';
    } else {
      text = 'Next OPD: Monday 4:00 PM'; dotCls = 'bg-slate-400'; pingCls = 'bg-slate-300';
    }
  } else {
    // Mon–Sat: 4 PM–9 PM (960–1260 min), Video 9 AM–5 PM (540–1020)
    if (t >= 960 && t < 1260) {
      text = 'In-Clinic OPD Open Now'; dotCls = 'bg-emerald-500'; pingCls = 'bg-emerald-400';
    } else if (t >= 540 && t < 960) {
      text = 'Video Consult Active \u2022 OPD Opens 4 PM'; dotCls = 'bg-teal-500'; pingCls = 'bg-teal-400';
    } else if (t < 540) {
      text = 'Clinic Opens Today at 4 PM'; dotCls = 'bg-amber-500'; pingCls = 'bg-amber-400';
    } else {
      text = day === 6 ? 'Next: Sunday OPD 9 AM' : 'Next OPD Tomorrow 4 PM';
      dotCls = 'bg-slate-400'; pingCls = 'bg-slate-300';
    }
  }

  el.innerHTML = `
    <span class="relative flex h-2 w-2 flex-shrink-0">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${pingCls} opacity-75"></span>
      <span class="relative inline-flex rounded-full h-2 w-2 ${dotCls}"></span>
    </span>
    <span class="font-bold text-slate-800">${text}</span>
    <span class="text-slate-300 hidden sm:inline">&bull;</span>
    <span class="text-clinic-700 font-bold hidden sm:inline">Imli Phatak, Jaipur</span>
  `;
}

/* ══════════════════════════════════════════
   3. COUNTER ANIMATION (Stats: 10+, 5.0, 61+)
══════════════════════════════════════════ */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.getAttribute('data-counter'));
      const suffix = el.getAttribute('data-suffix') || '';
      const decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals')) : 0;
      const duration = 1200;
      const steps = 50;
      let current = 0;
      const increment = target / steps;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current = increment * step;
        if (step >= steps) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = decimals > 0 ? current.toFixed(decimals) + suffix : Math.floor(current) + suffix;
      }, duration / steps);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ══════════════════════════════════════════
   4. SPECIALTY CARD HOVER (stagger entrance)
══════════════════════════════════════════ */
function initSpecialtyHover() {
  const cards = document.querySelectorAll('.specialty-card');
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 60}ms`;
  });
}

/* ══════════════════════════════════════════
   5. DATE CONSTRAINTS
══════════════════════════════════════════ */
function initDateConstraints() {
  const dateInput = document.getElementById('appointmentDate');
  const slotSelect = document.getElementById('appointmentSlot');
  if (!dateInput || !slotSelect) return;

  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
  if (!dateInput.value) dateInput.value = today;

  const updateSlots = () => {
    if (!dateInput.value) return;
    const [y, m, d] = dateInput.value.split('-');
    const picked = new Date(y, m - 1, d);
    const isSunday = picked.getDay() === 0;
    for (let i = 0; i < slotSelect.options.length; i++) {
      const v = slotSelect.options[i].value;
      if (isSunday && (v.includes('Sunday') || v.includes('9:00 AM'))) {
        slotSelect.selectedIndex = i; break;
      } else if (!isSunday && v.includes('4:00 PM')) {
        slotSelect.selectedIndex = i; break;
      }
    }
  };

  dateInput.addEventListener('change', updateSlots);
  updateSlots();
}

/* ══════════════════════════════════════════
   6. FAQ ACCORDION
══════════════════════════════════════════ */
function initFAQ() {
  const btns = document.querySelectorAll('.faq-btn');
  btns.forEach((btn, idx) => {
    const body = btn.nextElementSibling;
    const icon = btn.querySelector('.faq-icon');

    if (idx === 0) {
      body.classList.remove('hidden');
      btn.classList.add('open');
      if (icon) icon.style.transform = 'rotate(180deg)';
    }

    btn.addEventListener('click', () => {
      const isHidden = body.classList.contains('hidden');

      // Close all
      document.querySelectorAll('.faq-body').forEach(b => b.classList.add('hidden'));
      document.querySelectorAll('.faq-btn').forEach(b => {
        b.classList.remove('open');
        const ic = b.querySelector('.faq-icon');
        if (ic) ic.style.transform = 'rotate(0deg)';
      });

      if (isHidden) {
        body.classList.remove('hidden');
        btn.classList.add('open');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

/* ══════════════════════════════════════════
   7. MOBILE NAV
══════════════════════════════════════════ */
function initMobileNav() {
  const toggle = document.getElementById('mobileMenuToggle');
  const nav = document.getElementById('mobileNav');
  const icon = document.getElementById('navIcon');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', e => {
    e.stopPropagation();
    if (nav.classList.contains('hidden')) {
      nav.classList.remove('hidden');
      if (icon) { icon.classList.replace('fa-bars', 'fa-xmark'); }
    } else {
      closeNav();
    }
  });

  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !toggle.contains(e.target) && !nav.classList.contains('hidden')) closeNav();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeNav(); closeBookingModal(); closePosterModal(); }
  });
}

function closeNav() {
  const nav = document.getElementById('mobileNav');
  const icon = document.getElementById('navIcon');
  if (nav) nav.classList.add('hidden');
  if (icon) { icon.classList.replace('fa-xmark', 'fa-bars'); }
}

/* ══════════════════════════════════════════
   8. HEADER SCROLL ELEVATION
══════════════════════════════════════════ */
function initHeaderElevation() {
  const header = document.querySelector('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('header-scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ══════════════════════════════════════════
   9. SCROLL SPY
══════════════════════════════════════════ */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  if (!sections.length || !links.length) return;

  window.addEventListener('scroll', () => {
    const pos = window.scrollY + 130;
    let current = '';
    sections.forEach(s => {
      if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) current = s.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });
}

/* ══════════════════════════════════════════
   10. REVIEW LIKE BUTTONS & VIEW MORE TOGGLE
══════════════════════════════════════════ */
function initReviewLikes() {
  document.querySelectorAll('.review-like-btn').forEach(btn => {
    let liked = false;
    let count = parseInt(btn.getAttribute('data-likes') || '1', 10);
    const countSpan = btn.querySelector('.like-count');
    const icon = btn.querySelector('i');

    btn.addEventListener('click', () => {
      liked = !liked;
      count += liked ? 1 : -1;
      btn.classList.toggle('text-blue-600', liked);
      btn.classList.toggle('font-bold', liked);
      if (icon) {
        icon.classList.toggle('fa-regular', !liked);
        icon.classList.toggle('fa-solid', liked);
        if (liked) { icon.classList.add('pop-anim'); setTimeout(() => icon.classList.remove('pop-anim'), 400); }
      }
      if (countSpan) countSpan.textContent = count > 0 ? ` (${count})` : '';
    });
  });
}

// Toggle "View More Reviews" (Show 2 initially, expand to 6)
function toggleMoreReviews() {
  const extraReviews = document.querySelectorAll('.extra-review');
  const btnText = document.getElementById('toggleReviewsText');
  const btnIcon = document.getElementById('toggleReviewsIcon');
  if (!extraReviews.length) return;

  const isHidden = extraReviews[0].classList.contains('hidden');

  extraReviews.forEach((card, index) => {
    if (isHidden) {
      card.classList.remove('hidden');
      card.classList.add('fade-in-up');
      card.style.animationDelay = `${index * 80}ms`;
    } else {
      card.classList.add('hidden');
      card.classList.remove('fade-in-up');
      card.style.animationDelay = '0ms';
    }
  });

  if (isHidden) {
    if (btnText) btnText.textContent = 'Show Less Reviews';
    if (btnIcon) btnIcon.style.transform = 'rotate(180deg)';
  } else {
    if (btnText) btnText.textContent = 'View More Patient Reviews (4 More)';
    if (btnIcon) btnIcon.style.transform = 'rotate(0deg)';

    // Smooth scroll back to reviews section header so user doesn't get lost
    const reviewsSec = document.getElementById('reviews');
    if (reviewsSec) {
      reviewsSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

/* ══════════════════════════════════════════
   11. APPOINTMENT FORM
══════════════════════════════════════════ */
function handleFormSubmit(e) {
  e.preventDefault();
  const name    = document.getElementById('patientName').value.trim();
  const phone   = document.getElementById('patientPhone').value.trim();
  const mode    = document.getElementById('consultMode').value;
  const service = document.getElementById('serviceSelect').value;
  const date    = document.getElementById('appointmentDate').value;
  const slot    = document.getElementById('appointmentSlot').value;
  const notes   = (document.getElementById('patientNotes') || {}).value || '';

  if (phone.replace(/\D/g, '').length < 10) {
    document.getElementById('patientPhone').focus();
    document.getElementById('patientPhone').classList.add('border-red-500');
    setTimeout(() => document.getElementById('patientPhone').classList.remove('border-red-500'), 2000);
    return;
  }

  const tokenId = 'NV-' + Math.floor(100000 + Math.random() * 900000);

  // Save to localStorage
  const bookings = JSON.parse(localStorage.getItem('dr_neha_bookings') || '[]');
  bookings.unshift({ tokenId, name, phone, mode, service, date, slot, notes, bookedAt: new Date().toLocaleString() });
  localStorage.setItem('dr_neha_bookings', JSON.stringify(bookings));

  // Populate modal
  document.getElementById('modalTokenId').textContent = tokenId;
  document.getElementById('modalPatientName').textContent = name;
  document.getElementById('modalPhone').textContent = phone;
  document.getElementById('modalDate').textContent = date;
  document.getElementById('modalSlot').textContent = slot;
  document.getElementById('modalService').textContent = service;
  document.getElementById('modalMode').textContent = mode;

  // WhatsApp URL
  const waMsg = encodeURIComponent(
    `Hello Dr. Neha Vashisth Clinic,\n\nAppointment Request:\n` +
    `\u2022 Token: ${tokenId}\n\u2022 Name: ${name}\n\u2022 Phone: ${phone}\n` +
    `\u2022 Mode: ${mode}\n\u2022 Reason: ${service}\n` +
    `\u2022 Date: ${date}\n\u2022 Slot: ${slot}\n` +
    (notes ? `\u2022 Notes: ${notes}\n` : '') +
    `\nPlease confirm my appointment. Thank you.`
  );
  const waBtn = document.getElementById('modalWhatsAppBtn');
  if (waBtn) waBtn.href = `https://wa.me/918905567784?text=${waMsg}`;

  // Show modal
  const modal = document.getElementById('appointmentModal');
  if (modal) { modal.classList.remove('hidden'); modal.classList.add('flex'); }

  // Reset form
  e.target.reset();
  initDateConstraints();
}

function closeBookingModal() {
  const modal = document.getElementById('appointmentModal');
  if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
}

function printAppointmentSlip() { window.print(); }

/* ══════════════════════════════════════════
   12. POSTER LIGHTBOX
══════════════════════════════════════════ */
function openPosterModal() {
  const modal = document.getElementById('posterModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.classList.add('overflow-hidden');
  }
}

function closePosterModal() {
  const modal = document.getElementById('posterModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
  }
}
