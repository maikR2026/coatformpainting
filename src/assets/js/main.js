// Coatform Painting — site behaviour (nav, reveal animations, lead forms, maps)
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

  // ---- live maps (Leaflet + OpenStreetMap / CARTO tiles) ----
  const maps = document.querySelectorAll('[data-map]');
  if (maps.length && window.L && window.CF_CITIES) {
    maps.forEach((el) => {
      const opts = JSON.parse(el.dataset.map);
      const map = L.map(el, { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      const bounds = [];
      window.CF_CITIES.forEach((c) => {
        const main = opts.focus === c.slug;
        const icon = L.divIcon({ className: '', html: `<div class="pin${main ? ' pin--main' : ''}"></div>`, iconSize: main ? [30, 30] : [22, 22], iconAnchor: main ? [15, 30] : [11, 22], popupAnchor: [0, -26] });
        L.circle([c.lat, c.lng], {
          radius: main ? 9000 : 6000,
          color: '#e07a3f',
          weight: main ? 2 : 1,
          fillColor: '#e07a3f',
          fillOpacity: main ? 0.22 : 0.1,
        }).addTo(map);
        const marker = L.marker([c.lat, c.lng], { icon, title: `${c.name} painters`, keyboard: true }).addTo(map);
        marker.bindPopup(`<strong>${c.name}, ON</strong><br>Painting services in ${c.name}<br><a href="/service-areas/${c.slug}/">View ${c.name} page →</a>`);
        if (main) marker.openPopup();
        bounds.push([c.lat, c.lng]);
      });

      if (opts.center) map.setView(opts.center, opts.zoom || 11);
      else map.fitBounds(bounds, { padding: [30, 30] });

      // enable scroll-zoom only after the user interacts, so the page scroll isn't hijacked
      map.once('focus click', () => map.scrollWheelZoom.enable());
    });
  }

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
