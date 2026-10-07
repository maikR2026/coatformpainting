// Free-quote estimator: multi-step form -> AI estimate (with instant local fallback)
import { estimate, SERVICES, money } from './pricing.js';

const form = document.getElementById('estimator');
const out = document.getElementById('estimate-result');
const cfg = window.CF || {};
const steps = [...form.querySelectorAll('.form-step')];
const dots = [...form.querySelectorAll('.step-dots span')];
let current = 0;

// Which inputs matter for each service, plus custom labels
const FIELDS = {
  rooms: { show: ['rooms', 'sqft', 'doors', 'surfaces', 'ceilingHeight', 'colourChange', 'furnished'], labels: { sqft: 'Floor area (sq ft)' } },
  homeSqft: { show: ['sqft', 'stories', 'doors', 'colourChange'], labels: { sqft: 'Home size (sq ft)', doors: 'Exterior / garage doors' } },
  pieces: { show: ['pieces', 'colourChange'] },
  doors: { show: ['doors', 'linearFt', 'colourChange', 'furnished'], labels: { linear: 'Baseboards (linear ft)' } },
  walls: { show: ['rooms', 'ceilingHeight', 'colourChange'], labels: { rooms: 'Number of feature walls' } },
  staircases: { show: ['rooms', 'colourChange'], labels: { rooms: 'Number of staircases' } },
  sqft: { show: ['sqft', 'ceilingHeight', 'furnished'], labels: { sqft: 'Area (sq ft)' } },
  linearFt: { show: ['linearFt'], labels: { linear: 'Fence length (linear ft, one side)' } },
  areas: { show: ['rooms'], labels: { rooms: 'Number of repair areas' } },
};
const SQFT_LABELS = { deck: 'Deck size (sq ft)', popcorn: 'Ceiling area (sq ft)', epoxy: 'Floor area (sq ft)', commercial: 'Floor area (sq ft)', newconstruction: 'Floor area (sq ft)' };
const ROOM_LABELS = { wallpaper: 'Rooms with wallpaper' };
const DEFAULT_LABELS = { rooms: 'Number of rooms', sqft: 'Approx. square footage', linear: 'Linear feet' };

// service-page slug -> estimator key (for /free-quote/?service=...)
const FROM_SLUG = {
  'interior-painting': 'interior', 'exterior-painting': 'exterior', 'cabinet-painting': 'cabinets', 'condo-painting': 'condo',
  'commercial-painting': 'commercial', 'deck-fence-staining': 'deck', 'drywall-repair': 'drywall', 'popcorn-ceiling-removal': 'popcorn',
  'wallpaper-removal': 'wallpaper', 'trim-door-painting': 'trim', 'accent-walls': 'accent', 'stucco-brick-painting': 'masonry',
  'siding-painting': 'siding', 'epoxy-floor-coating': 'epoxy', 'staircase-railing-painting': 'staircase', 'real-estate-painting': 'realestate',
  'new-construction-painting': 'newconstruction', 'colour-consultation': 'interior',
};

function applyService() {
  const key = form.service.value;
  const svc = SERVICES[key];
  const conf = FIELDS[svc.unit] || FIELDS.rooms;
  form.querySelectorAll('[data-for]').forEach((el) => {
    el.hidden = !conf.show.includes(el.dataset.for);
  });
  const labels = { ...DEFAULT_LABELS, ...(conf.labels || {}) };
  if (SQFT_LABELS[key]) labels.sqft = SQFT_LABELS[key];
  if (ROOM_LABELS[key]) labels.rooms = ROOM_LABELS[key];
  form.querySelector('[data-label-rooms]').textContent = labels.rooms;
  form.querySelector('[data-label-sqft]').textContent = labels.sqft;
  form.querySelector('[data-label-linear]').textContent = labels.linear;
  form.querySelector('[data-for=rooms] .hint').hidden = labels.rooms !== DEFAULT_LABELS.rooms;

  // paint question only for services that use paint/stain
  const paintField = form.querySelector('input[name=paintProvided]').closest('fieldset');
  paintField.hidden = !svc.paint;
  form.querySelectorAll('input[name=paintProvided]').forEach((r) => (r.required = svc.paint));
  form.querySelector('[data-for=paintGrade]').hidden = !svc.paint || form.paintProvided.value === 'yes';
}

function show(i) {
  steps[current].classList.remove('active');
  current = i;
  steps[current].classList.add('active');
  dots.forEach((d, n) => d.classList.toggle('on', n <= current));
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const first = steps[current].querySelector('input:not([type=hidden]):not(.hp), select, textarea');
  if (first) setTimeout(() => first.focus({ preventScroll: true }), 300);
}

function stepValid(i) {
  const fields = [...steps[i].querySelectorAll('input, select, textarea')].filter((f) => !f.closest('[hidden]'));
  for (const f of fields) {
    if (!f.checkValidity()) {
      f.reportValidity();
      return false;
    }
  }
  return true;
}

form.addEventListener('click', (e) => {
  if (e.target.closest('[data-next]') && stepValid(current)) show(current + 1);
  if (e.target.closest('[data-prev]')) show(current - 1);
});
form.service.addEventListener('change', applyService);
form.addEventListener('change', (e) => {
  if (e.target.name === 'paintProvided') applyService();
});

// prefill from URL
const params = new URLSearchParams(location.search);
if (FROM_SLUG[params.get('service')]) form.service.value = FROM_SLUG[params.get('service')];
if (params.get('city')) {
  const opt = [...form.city.options].find((o) => o.text === params.get('city'));
  if (opt) form.city.value = opt.value;
}
applyService();

function collect() {
  const fd = new FormData(form);
  const d = {};
  fd.forEach((v, k) => { if (k !== '_honey') d[k] = v; });
  d.walls = fd.has('walls');
  d.ceilings = fd.has('ceilings');
  d.trim = fd.has('trim');
  if (!SERVICES[d.service].paint) d.paintProvided = 'no';
  return d;
}

async function aiEstimate(data) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 30000);
  try {
    const res = await fetch('/api/estimate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        service: data.service, propertyType: data.propertyType, city: data.city, rooms: data.rooms, sqft: data.sqft,
        pieces: data.pieces, linearFt: data.linearFt, doors: data.doors, stories: data.stories, ceilingHeight: data.ceilingHeight,
        walls: data.walls, ceilings: data.ceilings, trim: data.trim, condition: data.condition, colourChange: data.colourChange,
        paintProvided: data.paintProvided, paintGrade: data.paintGrade, furnished: data.furnished, timeline: data.timeline, details: data.details,
      }),
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    const r = await res.json();
    return Number.isFinite(r.low) && Number.isFinite(r.high) ? r : null;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

const escHtml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function render(r, data) {
  const isAI = r.source === 'ai';
  const items = (r.lineItems || []).map((x) => `<tr><td>${escHtml(x.label)}</td><td>${money(x.low)} – ${money(x.high)}</td></tr>`).join('');
  const list = (title, arr) => (arr && arr.length ? `<h3 style="font-size:1.1rem;margin-top:18px">${title}</h3><ul>${arr.map((a) => `<li>${escHtml(a)}</li>`).join('')}</ul>` : '');
  out.innerHTML = `
  <div class="estimate" tabindex="-1">
    <div class="rough-banner">⚠️ This is a ROUGH estimate — NOT a final quote</div>
    <span class="ai-tag">${isAI ? '✨ AI estimate' : '⚡ Instant estimate'}</span>
    <p style="margin:16px 0 0;font-weight:600">${escHtml(SERVICES[data.service].label)} · ${escHtml(data.city)} · ${data.paintProvided === 'yes' ? 'You’re supplying the paint' : 'Coatform supplies the paint'}</p>
    <div class="range">${money(r.low)} – ${money(r.high)} <small>+ HST</small></div>
    ${r.summary ? `<p>${escHtml(r.summary)}</p>` : ''}
    ${items ? `<table><tbody>${items}</tbody></table>` : ''}
    ${list('Adjustments applied', r.adjustments)}
    ${list('Assumptions', r.assumptions)}
    ${list('Tips', r.tips)}
    <div class="disclaimer">
      <strong class="big">This is a ROUGH ESTIMATE, not a final price.</strong>
      <p style="margin:0 0 6px">It’s based only on the answers you gave. Your <strong>final price</strong> depends on surface condition, repairs, access and colours, and is confirmed in a <strong>free written quote</strong> after a quick walkthrough.</p>
      <p style="margin:12px 0 0;font-weight:700">For a better look at your final price, call us:</p>
      <a class="call-big" href="tel:${cfg.phoneHref}">📞 ${cfg.phone}</a>
      <p style="margin:0">or email <a href="mailto:${cfg.email}" style="color:var(--copper);font-weight:700">${cfg.email}</a></p>
    </div>
    <div class="hero-ctas" style="margin-bottom:0">
      <a class="btn btn--lg" href="/book/">📅 Book a free walkthrough</a>
      <a class="btn btn--dark btn--lg" href="tel:${cfg.phoneHref}">Call for final price</a>
      <button class="btn btn--light btn--lg" type="button" id="restart" style="box-shadow:inset 0 0 0 2px rgba(0,0,0,.15)">↺ New estimate</button>
    </div>
    <p style="font-size:.85rem;color:var(--ink-muted);margin:18px 0 0">We’ve received your details and will follow up within 1 business day. Prices in CAD before HST. See our <a href="/terms/">Terms</a>.</p>
  </div>`;
  out.querySelector('.estimate').focus({ preventScroll: true });
  out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  out.querySelector('#restart').addEventListener('click', () => {
    out.innerHTML = '';
    form.hidden = false;
    show(0);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (form._honey.value) return;
  if (!stepValid(current)) return;
  const status = form.querySelector('.form-status');
  const btn = form.querySelector('[type=submit]');
  const label = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="loader"></span> Crunching numbers…';
  status.className = 'form-status';

  const data = collect();
  const local = { source: 'local', ...estimate(data) };
  const ai = await aiEstimate(data);
  const result = ai || local;

  form.hidden = true;
  btn.disabled = false;
  btn.innerHTML = label;
  render(result, data);

  // Email the lead + the estimate they saw. Don't block the result on this.
  window.CFsendLead?.({
    name: data.name, phone: data.phone, email: data.email, address: data.address, city: data.city,
    contactMethod: data.contactMethod, service: SERVICES[data.service].label, propertyType: data.propertyType,
    rooms: data.rooms, sqft: data.sqft, cabinetPieces: data.pieces, linearFt: data.linearFt, doors: data.doors, stories: data.stories,
    surfaces: ['walls', 'ceilings', 'trim'].filter((k) => data[k]).join(', '), ceilingHeight: data.ceilingHeight, condition: data.condition,
    colourChange: data.colourChange, furnished: data.furnished,
    paintProvided: data.paintProvided === 'yes' ? 'YES — customer supplies paint' : 'No — Coatform supplies paint',
    paintGrade: data.paintProvided === 'yes' ? 'n/a' : data.paintGrade, timeline: data.timeline, details: data.details,
    estimateShown: `${money(result.low)} – ${money(result.high)} (${result.source === 'ai' ? 'AI' : 'formula'})`,
    consent: data.consent,
  }, `💰 New estimate request — ${SERVICES[data.service].label} in ${data.city}`).catch(() => {});
  if (window.gtag) window.gtag('event', 'generate_lead', { form: 'estimator', value: result.low, currency: 'CAD' });
});
