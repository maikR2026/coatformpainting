// Coatform Painting — site behaviour (nav, reveal animations, lead forms)
(() => {
  const cfg = window.CF || {};

  // ---- mobile nav ----
  const header = document.querySelector('.site-header');
  const burger = document.querySelector('.burger');
  if (burger) {
    burger.addEventListener('click', () => {
      const open = header.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }
  document.querySelectorAll('.has-dropdown > button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const li = btn.parentElement;
      const open = li.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.has-dropdown.open').forEach((li) => li.classList.remove('open'));
    if (header && header.classList.contains('nav-open')) burger.click();
  });

  // ---- reveal on scroll ----
  const els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
  } else {
    els.forEach((el) => el.classList.add('in'));
  }

  // ---- Founding 50 counter: count up and fill the bar when it scrolls into view ----
  const promo = document.querySelector('.promo-meter');
  if (promo) {
    const num = promo.querySelector('[data-count]');
    const target = Number(num.dataset.count);
    const run = () => {
      promo.classList.add('go');
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const t0 = performance.now();
      const tick = (t) => {
        const k = Math.min(1, (t - t0) / 1200);
        num.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      const pio = new IntersectionObserver(([en]) => { if (en.isIntersecting) { run(); pio.disconnect(); } }, { threshold: 0.4 });
      pio.observe(promo);
    } else run();
  }

  // ---- lead forms (booking / contact) ----
  window.CFsendLead = async function sendLead(data, subject) {
    const payload = {
      _subject: subject,
      _template: 'table',
      _captcha: 'false',
      page: location.href,
      submitted: new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' }),
      ...data,
    };
    const res = await fetch(cfg.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Form send failed');
    return res.json().catch(() => ({}));
  };

  window.CFformData = function formData(form) {
    const out = {};
    new FormData(form).forEach((v, k) => {
      if (k === '_honey') return;
      out[k] = out[k] ? `${out[k]}, ${v}` : v;
    });
    return out;
  };

  document.querySelectorAll('form[data-lead]').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = form.querySelector('.form-status');
      const btn = form.querySelector('[type=submit]');
      if (form._honey && form._honey.value) return;
      if (!form.reportValidity()) return;
      const label = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span class="loader"></span> Sending…';
      try {
        await window.CFsendLead(window.CFformData(form), form.dataset.subject || 'New website lead');
        status.className = 'form-status ok';
        status.innerHTML = form.dataset.success || `Got it! 🎉 We'll reach out within 1 business day. Need us sooner? Call <a href="tel:${cfg.phoneHref}">${cfg.phone}</a>.`;
        form.reset();
        if (window.gtag) window.gtag('event', 'generate_lead', { form: form.dataset.subject });
      } catch {
        status.className = 'form-status err';
        status.innerHTML = `Something went wrong sending your request. Please call <a href="tel:${cfg.phoneHref}">${cfg.phone}</a> or email <a href="mailto:${cfg.email}">${cfg.email}</a>.`;
      } finally {
        btn.disabled = false;
        btn.innerHTML = label;
        status.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
