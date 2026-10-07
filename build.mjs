// Static site generator for coatformpainting.ca — run `node build.mjs`.
// Output goes to ./site (deploy that folder). No framework, no runtime deps.
import { mkdirSync, writeFileSync, rmSync, cpSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { site } from './src/data/site.mjs';
import { services, serviceGroups } from './src/data/services.mjs';
import { cities } from './src/data/cities.mjs';
import { posts } from './src/data/posts.mjs';
import { legalPages } from './src/pages/legal.mjs';
import { SERVICES as ESTIMATOR_SERVICES } from './src/assets/js/pricing.js';
import {
  layout, esc, abs, crumbsHtml, ctaBand, faqBlock, serviceCard, quickForm, faqSchema, BUSINESS_ID, cityOptions, serviceOptions, mapEmbed, socialLinks,
} from './src/templates.mjs';

const OUT = 'site';
const pages = []; // for sitemap.xml

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

function emit(path, html, { priority = 0.7, changefreq = 'monthly', sitemap = true } = {}) {
  const file = path.endsWith('/') ? join(OUT, path, 'index.html') : join(OUT, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  if (sitemap) pages.push({ path, priority, changefreq });
}

const home = { name: 'Home', path: '/' };
const generalFaqs = [
  { q: 'Do you offer free painting quotes?', a: `Yes — always. Get a rough AI estimate online in about 60 seconds, or call ${site.phone} to book a free in-person or video assessment for an exact written quote.` },
  { q: 'Is the online AI estimate my final price?', a: `No. The online estimate is a ROUGH estimate only, based on what you enter. Your final price is confirmed in a written quote after we see the project. Call ${site.phone} for an exact price.` },
  { q: 'Can I supply my own paint?', a: 'Yes. Just tell us in the quote form. If you provide the paint, we remove the paint cost from your price. We will confirm the type and quantity needed ahead of time.' },
  { q: 'What paint brands do you use?', a: 'We mainly use premium, low-VOC paints from trusted brands like Benjamin Moore and Sherwin-Williams, and we match the product to the surface — cabinets, trim, ceilings, bathrooms and exteriors all need different coatings.' },
  { q: 'Which areas do you serve?', a: `We paint homes and businesses across Toronto and the GTA, including ${cities.map((c) => c.name).join(', ')}.` },
  { q: 'Do you offer a warranty?', a: 'Yes. Every project comes with a written workmanship warranty — up to 3 years on interior painting. See our Warranty page for full details.' },
  { q: 'Do I need to be home while you paint?', a: 'Not necessarily. Many clients give us access and carry on with their day. We send updates and do a final walkthrough with you at the end.' },
  { q: 'How do I prepare for my painting project?', a: 'Remove valuables, small décor and wall hangings and make sure we can access the rooms. We take care of moving and covering furniture, protecting floors and cleaning up.' },
];

const trendSwatches = [
  { hex: '#A85D3B', name: 'Terracotta Glow', note: 'warm, earthy, main-character energy' },
  { hex: '#8C9A7B', name: 'Sage Reset', note: 'calm green that goes with everything' },
  { hex: '#F1E8DA', name: 'Warm Linen White', note: 'the new “clean girl” white' },
  { hex: '#2F3A45', name: 'Midnight Ink', note: 'moody, cozy, very expensive-looking' },
  { hex: '#D9B8A6', name: 'Clay Blush', note: 'soft pink-beige that glows at golden hour' },
  { hex: '#5B4A3F', name: 'Espresso Shot', note: 'deep brown for colour-drenched dens' },
];

// =========================================================== HOME
{
  const featured = ['interior-painting', 'exterior-painting', 'cabinet-painting', 'condo-painting', 'commercial-painting', 'popcorn-ceiling-removal', 'deck-fence-staining', 'accent-walls'];
  const body = `
<section class="hero"><div class="wrap hero-grid">
  <div>
    <p class="eyebrow">Toronto & GTA house painters</p>
    <h1>Painting that makes your place <span class="serif">hit different.</span></h1>
    <p class="lede">Coatform Painting is the Toronto & GTA painting company for interior, exterior, cabinet, condo and commercial painting. Crisp lines, premium paint, zero mess — and a written warranty.</p>
    <div class="hero-ctas">
      <a class="btn btn--lg" href="/free-quote/">✨ Get my free AI estimate</a>
      <a class="btn btn--ghost btn--lg" href="/book/">Book an appointment</a>
    </div>
    <ul class="trust">
      <li>✅ Free quotes</li><li>🛡️ Written warranty</li><li>🧼 Spotless clean-up</li><li>🌿 Low-VOC paints</li><li>📍 16 GTA cities</li>
    </ul>
  </div>
  <div class="hero-card reveal">
    <div class="sticker">Free<br>quote<br>✦</div>
    ${quickForm({ title: 'Get a free quote', id: 'hero' })}
  </div>
</div></section>

<div class="marquee" aria-hidden="true"><div class="marquee-track">
  ${[...services, ...services].map((s) => `<span>${esc(s.name)}</span>`).join('')}
</div></div>

<section class="section"><div class="wrap">
  <div class="section-head">
    <h2>Every surface. <span class="serif copper">Every vibe.</span></h2>
    <p class="muted">From a single accent wall to a full commercial repaint — ${services.length} painting services, one crew that actually shows up.</p>
  </div>
  <div class="bento">
    ${featured.map((slug) => serviceCard(services.find((s) => s.slug === slug))).join('')}
  </div>
  <p class="center" style="margin-top:40px"><a class="btn btn--ghost btn--lg" href="/services/">See all ${services.length} services →</a></p>
</div></section>

<section class="section section--cream"><div class="wrap">
  <div class="section-head">
    <h2>Why the GTA is switching to <span class="serif" style="color:var(--copper)">Coatform</span></h2>
    <p class="muted">Painting should be the easiest part of your reno. We made it that way.</p>
  </div>
  <div class="grid grid-4">
    <div class="stat reveal"><strong>60s</strong>Rough AI estimate online, any time of day.</div>
    <div class="stat reveal"><strong>2 coats</strong>Minimum on every finish — no thin, patchy walls.</div>
    <div class="stat reveal"><strong>0 mess</strong>Furniture moved, floors covered, daily clean-up.</div>
    <div class="stat reveal"><strong>3 yrs</strong>Written interior workmanship warranty.</div>
  </div>
  <div class="grid grid-3" style="margin-top:60px">
    <div class="card reveal"><div class="icon">🎯</div><h3>Prep like perfectionists</h3><p>Patching, sanding, caulking and priming done right — the secret behind paint that lasts.</p></div>
    <div class="card reveal"><div class="icon">💬</div><h3>Actually responsive</h3><p>Real humans answer at ${site.phone}. Clear quotes, clear timelines, updates by text.</p></div>
    <div class="card reveal"><div class="icon">🎨</div><h3>Free colour help</h3><p>Not sure about colours? Free colour consultation with every project.</p></div>
  </div>
</div></section>

<section class="section"><div class="wrap">
  <div class="section-head"><h2>How it works</h2><p class="muted">Four steps from “ugh, these walls” to “wait, is this the same house?”</p></div>
  <div class="grid grid-4 steps">
    <div class="step reveal"><h3>Get your estimate</h3><p class="muted">Use the free AI estimator or call ${site.phone}.</p></div>
    <div class="step reveal"><h3>Walkthrough</h3><p class="muted">We see the space in person or by video and send a written quote.</p></div>
    <div class="step reveal"><h3>We paint</h3><p class="muted">Protected floors, crisp lines, premium paint, daily clean-up.</p></div>
    <div class="step reveal"><h3>Final check</h3><p class="muted">We walk through it together and touch up anything before we leave.</p></div>
  </div>
</div></section>

<div class="marquee marquee--copper" aria-hidden="true"><div class="marquee-track">
  ${[...cities, ...cities].map((c) => `<span>${esc(c.name)}</span>`).join('')}
</div></div>

<section class="section"><div class="wrap">
  <div class="section-head">
    <h2>Painting the whole <span class="serif copper">GTA</span></h2>
    <p class="muted">Tap a pin to see local painting services in your city. Don’t see yours? Call us — we probably cover it.</p>
  </div>
  ${mapEmbed({ q: 'Greater Toronto Area, ON, Canada', zoom: 8, label: 'Map of Coatform Painting service areas across the GTA' })}
  <ul class="pill-list" style="margin-top:28px">
    ${cities.map((c) => `<li><a href="/service-areas/${c.slug}/">📍 ${esc(c.name)} painters</a></li>`).join('')}
  </ul>
</div></section>

<section class="section--tight"><div class="wrap">
  <div class="panel panel--copper reveal" style="display:grid;grid-template-columns:1.2fr .8fr;gap:30px;align-items:center" id="ai-promo">
    <div>
      <span class="ai-tag">✨ AI powered</span>
      <h2 style="margin-top:16px">What will it cost? Find out in 60 seconds.</h2>
      <p style="font-size:1.1rem;max-width:48ch">Answer a few quick questions (including whether you’re supplying the paint) and our AI estimator gives you a rough price range instantly. Free. No pressure.</p>
    </div>
    <div><a class="btn btn--dark btn--lg btn--block" href="/free-quote/">Start my free estimate →</a><p style="font-size:.85rem;margin-top:12px;opacity:.85">Rough estimate only — not a final quote. Final pricing confirmed after a walkthrough.</p></div>
  </div>
</div></section>

<section class="section"><div class="wrap">
  <div class="section-head"><h2>Colours we’re <span class="serif copper">obsessed</span> with</h2><p class="muted">Need inspo? These shades are all over GTA homes right now. Ask us about free colour consultation.</p></div>
  <div class="grid grid-3">
    ${trendSwatches.map((s) => `<div class="swatch-card reveal" style="background:${s.hex};color:${['#2F3A45', '#5B4A3F', '#A85D3B'].includes(s.hex) ? '#fff' : '#111'}">${s.name}<small>${s.note}</small></div>`).join('')}
  </div>
</div></section>

${faqBlock(generalFaqs.slice(0, 6))}
${ctaBand('Let’s make your walls the main character.')}`;

  emit('/', layout({
    title: 'Coatform Painting | Toronto & GTA Painters — Free Quotes',
    description: 'Toronto & GTA painters for interior, exterior, cabinet, condo & commercial painting. Free quotes, instant AI estimates, written warranty. 416-786-1621.',
    path: '/',
    body,
    schema: [faqSchema(generalFaqs.slice(0, 6))],
  }), { priority: 1.0, changefreq: 'weekly' });
}

// =========================================================== SERVICES INDEX
{
  const crumbs = [home, { name: 'Services', path: '/services/' }];
  const body = `
<section class="page-hero"><div class="wrap">
  ${crumbsHtml(crumbs)}
  <p class="eyebrow">What we do</p>
  <h1>Painting services in Toronto & the GTA</h1>
  <p class="lede">${services.length} services, one standard: flawless. Residential, exterior, commercial and specialty painting — all backed by our written warranty.</p>
  <div class="hero-ctas"><a class="btn btn--lg" href="/free-quote/">Get a free estimate</a><a class="btn btn--ghost btn--lg" href="tel:${site.phoneHref}">Call ${site.phone}</a></div>
</div></section>
${serviceGroups.map((g) => `
<section class="section--tight"><div class="wrap">
  <h2 style="font-size:clamp(1.6rem,3vw,2.4rem)">${g} painting</h2>
  <div class="grid grid-3">${services.filter((s) => s.group === g).map((s) => serviceCard(s)).join('')}</div>
</div></section>`).join('')}
${ctaBand()}`;
  emit('/services/', layout({
    title: 'Painting Services Toronto & GTA | Coatform Painting',
    description: `${services.length} painting services across Toronto & the GTA: interior, exterior, cabinets, condos, commercial, deck staining, popcorn ceilings & more.`,
    path: '/services/',
    body,
    crumbs,
    schema: [{
      '@type': 'ItemList',
      itemListElement: services.map((s, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/services/${s.slug}/`), name: s.name })),
    }],
  }), { priority: 0.9 });
}

// =========================================================== SERVICE PAGES
for (const s of services) {
  const path = `/services/${s.slug}/`;
  const crumbs = [home, { name: 'Services', path: '/services/' }, { name: s.name, path }];
  const related = services.filter((x) => x.slug !== s.slug && x.group === s.group).slice(0, 3);
  while (related.length < 3) {
    const extra = services.find((x) => x.slug !== s.slug && !related.includes(x));
    related.push(extra);
  }
  const faqs = [...s.faqs, generalFaqs[1], generalFaqs[2]];
  const body = `
<section class="page-hero"><div class="wrap">
  ${crumbsHtml(crumbs)}
  <p class="eyebrow">${s.icon} ${esc(s.group)} service</p>
  <h1>${esc(s.h1)}</h1>
  <p class="lede">${esc(s.lede)}</p>
  <div class="hero-ctas"><a class="btn btn--lg" href="/free-quote/?service=${s.slug}">Get my free estimate</a><a class="btn btn--ghost btn--lg" href="tel:${site.phoneHref}">📞 ${site.phone}</a></div>
</div></section>

<section class="section--tight"><div class="wrap split">
  <div class="prose">
    ${s.body.map((p) => `<p>${esc(p)}</p>`).join('')}
    <h2>What’s included</h2>
    <ul class="check-list">${s.includes.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
    <h2>How much does ${esc(s.name.toLowerCase())} cost?</h2>
    <div class="panel" style="margin:20px 0">
      <p class="big" style="margin-bottom:8px">${esc(s.price)}</p>
      <p class="muted" style="margin:0">Typical GTA ranges for guidance only. Every project is different — <a href="/free-quote/?service=${s.slug}">get a rough AI estimate</a> in 60 seconds, or call <a href="tel:${site.phoneHref}"><strong>${site.phone}</strong></a> for an exact written quote.</p>
    </div>
    <h2>Our process</h2>
    <ol>
      <li><strong>Free estimate</strong> — online, by phone or in person.</li>
      <li><strong>Written quote</strong> with a clear scope, timeline and price.</li>
      <li><strong>Protect & prep</strong> — floors, furniture and fixtures covered; surfaces repaired and primed.</li>
      <li><strong>Paint</strong> — premium products, two coats minimum, sharp lines.</li>
      <li><strong>Walkthrough</strong> — touch-ups, clean-up and your <a href="/warranty/">written warranty</a>.</li>
    </ol>
    <h2>${esc(s.name)} near you</h2>
    <p>We offer ${esc(s.name.toLowerCase())} throughout Toronto and the GTA:</p>
    <ul class="pill-list">${cities.map((c) => `<li><a href="/service-areas/${c.slug}/">${esc(s.name)} in ${esc(c.name)}</a></li>`).join('')}</ul>
  </div>
  <aside class="sticky-side">
    <div class="panel panel--cream">${quickForm({ service: s.name, title: `Quote for ${s.name.toLowerCase()}`, id: 'svc' })}</div>
  </aside>
</div></section>

<section class="section--tight"><div class="wrap">
  <h2 style="font-size:clamp(1.6rem,3vw,2.4rem)">Related services</h2>
  <div class="grid grid-3">${related.map((r) => serviceCard(r)).join('')}</div>
</div></section>
${faqBlock(faqs, `${esc(s.name)} FAQ`)}
${ctaBand()}`;

  emit(path, layout({
    title: s.title,
    description: s.metaDescription,
    path,
    body,
    crumbs,
    schema: [
      {
        '@type': 'Service',
        '@id': `${abs(path)}#service`,
        name: s.name,
        serviceType: s.name,
        description: s.metaDescription,
        provider: { '@id': BUSINESS_ID },
        areaServed: cities.map((c) => ({ '@type': 'City', name: `${c.name}, ON` })),
        url: abs(path),
        offers: { '@type': 'Offer', priceCurrency: 'CAD', description: s.price, availability: 'https://schema.org/InStock' },
      },
      faqSchema(faqs),
    ],
  }), { priority: 0.9 });
}

// =========================================================== SERVICE AREAS INDEX
{
  const crumbs = [home, { name: 'Service Areas', path: '/service-areas/' }];
  const body = `
<section class="page-hero"><div class="wrap">
  ${crumbsHtml(crumbs)}
  <p class="eyebrow">Where we paint</p>
  <h1>Painting service areas across the GTA</h1>
  <p class="lede">From Barrie to Hamilton, Kitchener to Pickering — Coatform Painting covers ${cities.length} cities across Toronto, the GTA and Southern Ontario. Explore the live map or pick your city.</p>
</div></section>
<section class="section--tight"><div class="wrap">
  ${mapEmbed({ q: 'Greater Toronto Area, ON, Canada', zoom: 8, label: 'Live map of all Coatform Painting service areas' })}
</div></section>
<section class="section--tight"><div class="wrap">
  <div class="grid grid-4">
    ${cities.map((c) => `<a class="card reveal" href="/service-areas/${c.slug}/"><div class="icon">📍</div><h3>${esc(c.name)}</h3><p>${esc(c.region)} · ${c.neighbourhoods.slice(0, 3).map(esc).join(', ')} & more</p><span class="arrow">Painters in ${esc(c.name)} →</span></a>`).join('')}
  </div>
</div></section>
${ctaBand('Don’t see your city? We probably still cover it.')}`;
  emit('/service-areas/', layout({
    title: 'Service Areas | Painters in Toronto & the GTA | Coatform',
    description: `Painters serving Toronto, Mississauga, Brampton, Vaughan, Markham, Oakville, Hamilton & ${cities.length - 7} more GTA cities. See our live service map.`,
    path: '/service-areas/',
    body,
    crumbs,
    schema: [{
      '@type': 'ItemList',
      itemListElement: cities.map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/service-areas/${c.slug}/`), name: `Painters in ${c.name}` })),
    }],
  }), { priority: 0.9 });
}

// =========================================================== CITY PAGES
function cityTitle(c) {
  const t = `Painters in ${c.name}, ON | House Painting | Coatform`;
  return t.length <= 60 ? t : `${c.name} Painters | Coatform Painting`;
}
function cityDescription(c) {
  for (let n = 2; n >= 0; n--) {
    const near = n ? ` in ${c.neighbourhoods.slice(0, n).join(', ')} & more` : '';
    const d = `${c.name} painters for interior, exterior, cabinet & commercial painting${near}. Free AI estimate or call ${site.phone}.`;
    if (d.length <= 158 || n === 0) return d;
  }
}
for (const c of cities) {
  const path = `/service-areas/${c.slug}/`;
  const crumbs = [home, { name: 'Service Areas', path: '/service-areas/' }, { name: c.name, path }];
  const popular = c.popular.map((slug) => services.find((s) => s.slug === slug));
  const others = services.filter((s) => !c.popular.includes(s.slug));
  const nearby = c.nearby.map((slug) => cities.find((x) => x.slug === slug));
  const faqs = [
    c.faq,
    { q: `How much does painting cost in ${c.name}?`, a: `Most rooms in ${c.name} cost roughly $450–$900 to paint, and full-home interiors typically range from $3–$6 per sq ft of floor area. Exteriors usually range from $4,500–$14,000. Get a free rough AI estimate online, or call ${site.phone} for an exact written quote.` },
    { q: `Do you offer free quotes in ${c.name}?`, a: `Yes. Quotes are always free in ${c.name} and across the GTA. Use our online estimator, book an appointment, or call ${site.phone}.` },
    { q: `What painting services do you offer in ${c.name}?`, a: `In ${c.name} we offer ${services.map((s) => s.name.toLowerCase()).join(', ')}.` },
    generalFaqs[2],
  ];
  const body = `
<section class="page-hero"><div class="wrap">
  ${crumbsHtml(crumbs)}
  <p class="eyebrow">📍 ${esc(c.name)}, Ontario · ${esc(c.region)}</p>
  <h1>Painters in ${esc(c.name)}, ON</h1>
  <p class="lede">${esc(c.intro)}</p>
  <div class="hero-ctas"><a class="btn btn--lg" href="/free-quote/?city=${encodeURIComponent(c.name)}">Free ${esc(c.name)} estimate</a><a class="btn btn--ghost btn--lg" href="tel:${site.phoneHref}">📞 ${site.phone}</a></div>
</div></section>

<section class="section--tight"><div class="wrap">
  ${mapEmbed({ q: `${c.name}, ON, Canada`, zoom: c.zoom, label: `Map of ${c.name}, Ontario painting service area`, sm: true })}
</div></section>

<section class="section--tight"><div class="wrap split">
  <div class="prose">
    <h2>House painting in ${esc(c.name)}</h2>
    <p>${esc(c.homes)}</p>
    <p>${esc(c.local)}</p>
    <h2>Neighbourhoods we paint in ${esc(c.name)}</h2>
    <ul class="pill-list">${c.neighbourhoods.map((n) => `<li><span>${esc(n)}</span></li>`).join('')}</ul>
    <h2>Why ${esc(c.name)} homeowners choose Coatform</h2>
    <ul class="check-list">
      <li>Free, fast quotes — including an instant online AI estimate</li>
      <li>Premium low-VOC paints from brands like Benjamin Moore & Sherwin-Williams</li>
      <li>Thorough prep: patching, sanding, caulking & priming</li>
      <li>Furniture and floors protected, spotless daily clean-up</li>
      <li>Written workmanship <a href="/warranty/">warranty</a></li>
      <li>Clear communication from quote to final walkthrough</li>
    </ul>
  </div>
  <aside class="sticky-side">
    <div class="panel panel--cream">${quickForm({ city: c.name, title: `Free ${c.name} quote`, id: 'city' })}</div>
  </aside>
</div></section>

<section class="section--tight"><div class="wrap">
  <h2 style="font-size:clamp(1.6rem,3vw,2.6rem)">Most popular painting services in ${esc(c.name)}</h2>
  <div class="grid grid-3">${popular.map((s) => serviceCard(s, c.name)).join('')}</div>
  <h3 style="margin-top:50px">More services in ${esc(c.name)}</h3>
  <ul class="pill-list">${others.map((s) => `<li><a href="/services/${s.slug}/">${esc(s.name)}</a></li>`).join('')}</ul>
</div></section>

<section class="section--tight"><div class="wrap">
  <h2 style="font-size:clamp(1.6rem,3vw,2.4rem)">Nearby service areas</h2>
  <ul class="pill-list">${nearby.map((n) => `<li><a href="/service-areas/${n.slug}/">📍 Painters in ${esc(n.name)}</a></li>`).join('')}<li><a href="/service-areas/">All service areas →</a></li></ul>
</div></section>
${faqBlock(faqs, `${esc(c.name)} painting FAQ`)}
${ctaBand(`Ready to paint in ${esc(c.name)}?`)}`;

  emit(path, layout({
    title: cityTitle(c),
    description: cityDescription(c),
    path,
    body,
    crumbs,
    schema: [
      {
        '@type': 'Service',
        '@id': `${abs(path)}#service`,
        name: `Painting services in ${c.name}, ON`,
        serviceType: 'House painting',
        provider: { '@id': BUSINESS_ID },
        areaServed: {
          '@type': 'City',
          name: c.name,
          containedInPlace: { '@type': 'AdministrativeArea', name: 'Ontario, Canada' },
          geo: { '@type': 'GeoCoordinates', latitude: c.lat, longitude: c.lng },
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `Painting services in ${c.name}`,
          itemListElement: services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: `${s.name} in ${c.name}`, url: abs(`/services/${s.slug}/`) } })),
        },
      },
      faqSchema(faqs),
    ],
  }), { priority: 0.9 });
}

// =========================================================== FREE QUOTE (AI estimator)
{
  const path = '/free-quote/';
  const crumbs = [home, { name: 'Free Quote', path }];
  const opts = Object.entries(ESTIMATOR_SERVICES).map(([k, v]) => `<option value="${k}">${esc(v.label)}</option>`).join('');
  const chip = (name, value, label, type = 'radio', checked = false, required = false) =>
    `<label class="chip"><input type="${type}" name="${name}" value="${esc(value)}"${checked ? ' checked' : ''}${required ? ' required' : ''}><span>${label}</span></label>`;
  const body = `
<section class="page-hero"><div class="wrap">
  ${crumbsHtml(crumbs)}
  <span class="ai-tag">✨ AI-powered estimator</span>
  <h1 style="margin-top:18px">Free painting estimate in <span class="serif copper">60 seconds</span></h1>
  <p class="lede">Answer a few quick questions and get an instant <strong>rough</strong> price range. It’s free, there’s no obligation, and a real person follows up only if you want us to.</p>
</div></section>

<section class="section--tight"><div class="wrap split">
  <div>
    <form id="estimator" class="form panel" novalidate>
      <div class="step-dots" aria-hidden="true"><span class="on"></span><span></span><span></span><span></span></div>
      <input class="hp" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">

      <div class="form-step active" data-step="1">
        <h2 style="font-size:1.8rem;margin:0">1. What are we painting?</h2>
        <div class="field"><label for="q-service">Service <span class="req">*</span></label><select id="q-service" name="service" required>${opts}</select></div>
        <fieldset class="field"><legend>Property type <span class="req">*</span></legend><div class="chips">
          ${['Detached house', 'Semi-detached', 'Townhouse', 'Condo / apartment', 'Commercial', 'Other'].map((t, i) => chip('propertyType', t, t, 'radio', i === 0)).join('')}
        </div></fieldset>
        <div class="field"><label for="q-city">City <span class="req">*</span></label><select id="q-city" name="city" required>${cityOptions('')}</select></div>
        <div class="form-nav"><span></span><button class="btn" type="button" data-next>Next →</button></div>
      </div>

      <div class="form-step" data-step="2">
        <h2 style="font-size:1.8rem;margin:0">2. Project details</h2>
        <div class="form-row">
          <div class="field" data-for="rooms"><label for="q-rooms"><span data-label-rooms>Number of rooms</span> <span class="hint">(bedroom, living room, hallway = 1 each)</span></label><input id="q-rooms" name="rooms" type="number" min="0" max="60" inputmode="numeric" placeholder="e.g. 4"></div>
          <div class="field" data-for="sqft"><label for="q-sqft"><span data-label-sqft>Approx. square footage</span> <span class="hint">(if you know it)</span></label><input id="q-sqft" name="sqft" type="number" min="0" inputmode="numeric" placeholder="e.g. 1800"></div>
          <div class="field" data-for="pieces"><label for="q-pieces">Cabinet doors + drawer fronts</label><input id="q-pieces" name="pieces" type="number" min="0" max="300" inputmode="numeric" placeholder="e.g. 32"></div>
          <div class="field" data-for="linearFt"><label for="q-linear"><span data-label-linear>Linear feet</span></label><input id="q-linear" name="linearFt" type="number" min="0" inputmode="numeric" placeholder="e.g. 120"></div>
          <div class="field" data-for="doors"><label for="q-doors">Number of doors to paint</label><input id="q-doors" name="doors" type="number" min="0" max="200" inputmode="numeric" placeholder="0"></div>
        </div>
        <fieldset class="field" data-for="surfaces"><legend>What should we paint?</legend><div class="chips">
          ${chip('walls', 'true', 'Walls', 'checkbox', true)}${chip('ceilings', 'true', 'Ceilings', 'checkbox')}${chip('trim', 'true', 'Baseboards & trim', 'checkbox')}
        </div></fieldset>
        <fieldset class="field" data-for="ceilingHeight"><legend>Ceiling height</legend><div class="chips">
          ${chip('ceilingHeight', '8', 'Standard (8 ft)', 'radio', true)}${chip('ceilingHeight', '9', '9 ft')}${chip('ceilingHeight', '10', '10 ft+ / vaulted')}
        </div></fieldset>
        <fieldset class="field" data-for="stories"><legend>Storeys</legend><div class="chips">
          ${chip('stories', '1', 'Bungalow / 1')}${chip('stories', '2', '2 storey', 'radio', true)}${chip('stories', '3', '3+ storey')}
        </div></fieldset>
        <fieldset class="field"><legend>Surface condition</legend><div class="chips">
          ${chip('condition', 'good', 'Good shape', 'radio', true)}${chip('condition', 'minor', 'Some holes / cracks')}${chip('condition', 'major', 'Lots of repairs / peeling')}
        </div></fieldset>
        <fieldset class="field" data-for="colourChange"><legend>Colour change</legend><div class="chips">
          ${chip('colourChange', 'similar', 'Similar colour', 'radio', true)}${chip('colourChange', 'dramatic', 'Big change (e.g. dark → light)')}
        </div></fieldset>
        <fieldset class="field" data-for="furnished"><legend>Will the space be furnished?</legend><div class="chips">
          ${chip('furnished', 'yes', 'Yes, furnished', 'radio', true)}${chip('furnished', 'no', 'No, empty')}
        </div></fieldset>
        <div class="form-nav"><button class="btn btn--ghost" type="button" data-prev>← Back</button><button class="btn" type="button" data-next>Next →</button></div>
      </div>

      <div class="form-step" data-step="3">
        <h2 style="font-size:1.8rem;margin:0">3. Paint & timing</h2>
        <fieldset class="field"><legend class="big">Are you providing the paint? <span class="req">*</span></legend><div class="chips">
          ${chip('paintProvided', 'no', '🎨 No — Coatform supplies the paint', 'radio', false, true)}${chip('paintProvided', 'yes', '🪣 Yes — I’m providing the paint', 'radio', false, true)}
        </div></fieldset>
        <fieldset class="field" data-for="paintGrade"><legend>Paint quality</legend><div class="chips">
          ${chip('paintGrade', 'standard', 'Standard')}${chip('paintGrade', 'premium', 'Premium (recommended)', 'radio', true)}${chip('paintGrade', 'ultra', 'Ultra-premium')}
        </div></fieldset>
        <fieldset class="field"><legend>When do you want it done?</legend><div class="chips">
          ${chip('timeline', 'asap', 'ASAP (within 2 weeks)')}${chip('timeline', 'month', 'Within a month', 'radio', true)}${chip('timeline', 'flexible', 'Flexible / just planning')}
        </div></fieldset>
        <div class="field"><label for="q-details">Anything else? <span class="hint">(rooms, colours, repairs, deadlines…)</span></label><textarea id="q-details" name="details" maxlength="1500" placeholder="e.g. Main floor + 3 bedrooms. Going from beige to warm white. Some nail holes in the hallway."></textarea></div>
        <div class="form-nav"><button class="btn btn--ghost" type="button" data-prev>← Back</button><button class="btn" type="button" data-next>Next →</button></div>
      </div>

      <div class="form-step" data-step="4">
        <h2 style="font-size:1.8rem;margin:0">4. Where should we send it?</h2>
        <div class="field"><label for="q-name">Full name <span class="req">*</span></label><input id="q-name" name="name" autocomplete="name" required></div>
        <div class="form-row">
          <div class="field"><label for="q-phone">Phone <span class="req">*</span></label><input id="q-phone" name="phone" type="tel" autocomplete="tel" required></div>
          <div class="field"><label for="q-email">Email <span class="req">*</span></label><input id="q-email" name="email" type="email" autocomplete="email" required></div>
        </div>
        <div class="field"><label for="q-address">Property address or postal code <span class="hint">(optional)</span></label><input id="q-address" name="address" autocomplete="street-address"></div>
        <fieldset class="field"><legend>Best way to reach you</legend><div class="chips">
          ${chip('contactMethod', 'Call', 'Call', 'radio', true)}${chip('contactMethod', 'Text', 'Text')}${chip('contactMethod', 'Email', 'Email')}
        </div></fieldset>
        <label class="consent"><input type="checkbox" name="consent" value="yes" required> I understand this is a <strong>rough estimate, not a final quote</strong>, and I agree to be contacted by Coatform Painting about my project (see <a href="/privacy/">Privacy Policy</a>).</label>
        <div class="form-nav"><button class="btn btn--ghost" type="button" data-prev>← Back</button><button class="btn btn--lg" type="submit">✨ Get my estimate</button></div>
      </div>
      <div class="form-status" role="status" aria-live="polite"></div>
    </form>
    <div id="estimate-result" aria-live="polite"></div>
  </div>
  <aside class="sticky-side">
    <div class="panel panel--copper">
      <h2 style="font-size:1.8rem">Rather talk to a human?</h2>
      <p>Call or text for an exact quote:</p>
      <a href="tel:${site.phoneHref}" style="font:800 2.2rem/1 var(--font-display);text-decoration:none;letter-spacing:-.03em">${site.phone}</a>
      <p style="margin-top:16px"><a href="mailto:${site.email}">${site.email}</a></p>
    </div>
    <div class="panel" style="margin-top:18px">
      <h3>Good to know</h3>
      <ul class="check-list" style="font-size:.95rem">
        <li>Online estimates are <strong>rough</strong> — final pricing comes after a quick walkthrough.</li>
        <li>Supplying your own paint lowers the price.</li>
        <li>Quotes are always free, no obligation.</li>
      </ul>
    </div>
  </aside>
</div></section>`;
  emit(path, layout({
    title: 'Free Painting Estimate | AI Painting Cost Calculator Toronto',
    description: 'Free rough painting estimate in 60 seconds with our AI painting cost calculator for Toronto & the GTA. Interior, exterior, cabinets & more.',
    path,
    body,
    crumbs,
    scripts: '<script type="module" src="/assets/js/quote.js?v=' + Date.now().toString(36) + '"></script>',
  }), { priority: 0.95 });
}

// =========================================================== BOOK APPOINTMENT
{
  const path = '/book/';
  const crumbs = [home, { name: 'Book an Appointment', path }];
  const chip = (name, value, type = 'radio', checked = false, required = false) =>
    `<label class="chip"><input type="${type}" name="${name}" value="${esc(value)}"${checked ? ' checked' : ''}${required ? ' required' : ''}><span>${esc(value)}</span></label>`;
  const today = new Date().toISOString().slice(0, 10);
  const body = `
<section class="page-hero"><div class="wrap">
  ${crumbsHtml(crumbs)}
  <p class="eyebrow">Free in-home or video assessment</p>
  <h1>Book your free painting appointment</h1>
  <p class="lede">Pick a time that works for you. We’ll confirm by phone or text within 1 business day.</p>
</div></section>
<section class="section--tight"><div class="wrap split">
  <form class="form panel" data-lead data-subject="📅 New appointment request" novalidate
    data-success="You’re booked in! 🎉 We’ll confirm your appointment within 1 business day. Need it sooner? Call <a href='tel:${site.phoneHref}'>${site.phone}</a>.">
    <input class="hp" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">
    <h2 style="font-size:1.6rem;margin:0">Your details</h2>
    <div class="form-row">
      <div class="field"><label for="b-name">Full name <span class="req">*</span></label><input id="b-name" name="name" autocomplete="name" required></div>
      <div class="field"><label for="b-phone">Phone <span class="req">*</span></label><input id="b-phone" name="phone" type="tel" autocomplete="tel" required></div>
    </div>
    <div class="form-row">
      <div class="field"><label for="b-email">Email <span class="req">*</span></label><input id="b-email" name="email" type="email" autocomplete="email" required></div>
      <div class="field"><label for="b-city">City <span class="req">*</span></label><select id="b-city" name="city" required>${cityOptions('')}</select></div>
    </div>
    <div class="form-row">
      <div class="field"><label for="b-address">Property address <span class="req">*</span></label><input id="b-address" name="address" autocomplete="street-address" required></div>
      <div class="field"><label for="b-postal">Postal code</label><input id="b-postal" name="postalCode" autocomplete="postal-code" placeholder="M5V 2T6"></div>
    </div>

    <h2 style="font-size:1.6rem;margin:10px 0 0">The project</h2>
    <fieldset class="field"><legend>Services needed <span class="req">*</span> <span class="hint">(pick all that apply)</span></legend><div class="chips">
      ${services.map((s) => chip('services', s.name, 'checkbox')).join('')}
    </div></fieldset>
    <fieldset class="field"><legend>Property type <span class="req">*</span></legend><div class="chips">
      ${['Detached house', 'Semi-detached', 'Townhouse', 'Condo / apartment', 'Commercial', 'Other'].map((t, i) => chip('propertyType', t, 'radio', i === 0)).join('')}
    </div></fieldset>
    <div class="form-row">
      <div class="field"><label for="b-size">Approx. size / rooms</label><input id="b-size" name="projectSize" placeholder="e.g. 4 rooms, or 2,000 sq ft"></div>
      <div class="field"><label for="b-start">When do you want to start?</label><select id="b-start" name="startTimeline"><option>ASAP</option><option selected>Within 2–4 weeks</option><option>1–3 months</option><option>Just planning / getting prices</option></select></div>
    </div>
    <fieldset class="field"><legend>Are you providing the paint? <span class="req">*</span></legend><div class="chips">
      ${chip('paintProvided', 'No — Coatform supplies paint', 'radio', false, true)}${chip('paintProvided', 'Yes — I am providing paint', 'radio', false, true)}${chip('paintProvided', 'Not sure yet', 'radio', false, true)}
    </div></fieldset>
    <div class="field"><label for="b-budget">Budget range <span class="hint">(optional, helps us plan)</span></label><select id="b-budget" name="budget"><option value="">Prefer not to say</option><option>Under $1,000</option><option>$1,000 – $3,000</option><option>$3,000 – $7,500</option><option>$7,500 – $15,000</option><option>$15,000+</option></select></div>

    <h2 style="font-size:1.6rem;margin:10px 0 0">Your appointment</h2>
    <fieldset class="field"><legend>Appointment type <span class="req">*</span></legend><div class="chips">
      ${chip('appointmentType', 'In-person walkthrough', 'radio', true)}${chip('appointmentType', 'Video call (FaceTime / WhatsApp)')}${chip('appointmentType', 'Phone call')}
    </div></fieldset>
    <div class="form-row">
      <div class="field"><label for="b-date">Preferred date <span class="req">*</span></label><input id="b-date" name="preferredDate" type="date" min="${today}" required></div>
      <div class="field"><label for="b-time">Preferred time <span class="req">*</span></label><select id="b-time" name="preferredTime" required><option value="">Choose…</option><option>Morning (8–11 AM)</option><option>Midday (11 AM–2 PM)</option><option>Afternoon (2–5 PM)</option><option>Evening (5–7 PM)</option></select></div>
    </div>
    <div class="field"><label for="b-alt">Backup date <span class="hint">(optional)</span></label><input id="b-alt" name="alternateDate" type="date" min="${today}"></div>
    <div class="field"><label for="b-notes">Project notes</label><textarea id="b-notes" name="notes" placeholder="Rooms, colours, repairs, parking or access notes, pets…"></textarea></div>
    <div class="field"><label for="b-hear">How did you hear about us?</label><select id="b-hear" name="referral"><option value="">Select…</option><option>Google search</option><option>Google Maps</option><option>Instagram</option><option>TikTok</option><option>Facebook</option><option>Friend / family</option><option>Saw a job sign / truck</option><option>Other</option></select></div>
    <label class="consent"><input type="checkbox" name="consent" value="yes" required> I agree to be contacted by Coatform Painting about my appointment and accept the <a href="/privacy/">Privacy Policy</a> and <a href="/terms/">Terms</a>.</label>
    <button class="btn btn--lg btn--block" type="submit">📅 Request my appointment</button>
    <div class="form-status" role="status" aria-live="polite"></div>
  </form>
  <aside class="sticky-side">
    <div class="panel panel--copper">
      <h2 style="font-size:1.7rem">Faster by phone?</h2>
      <a href="tel:${site.phoneHref}" style="font:800 2.2rem/1 var(--font-display);text-decoration:none;letter-spacing:-.03em">${site.phone}</a>
      <p style="margin-top:14px"><a href="mailto:${site.email}">${site.email}</a></p>
    </div>
    <div class="panel" style="margin-top:18px">
      <h3>What happens next</h3>
      <ol class="muted" style="padding-left:1.2em;margin:0"><li>We confirm your time by phone/text.</li><li>We walk through the project with you (15–30 min).</li><li>You get a clear written quote, usually within 24–48 hours.</li></ol>
    </div>
  </aside>
</div></section>`;
  emit(path, layout({
    title: 'Book a Free Painting Appointment | Coatform Painting Toronto & GTA',
    description: 'Book a free in-home or video painting assessment with Coatform Painting in Toronto & the GTA. Pick your date and time online or call 416-786-1621.',
    path, body, crumbs,
    scripts: `<script>document.querySelector('form[data-lead]').addEventListener('submit',e=>{const f=e.currentTarget;if(!f.querySelector('input[name=services]:checked')){e.stopImmediatePropagation();e.preventDefault();const s=f.querySelector('.form-status');s.className='form-status err';s.textContent='Please choose at least one service.';s.scrollIntoView({block:'center'});}},true);</script>`,
  }), { priority: 0.9 });
}

// =========================================================== CONTACT
{
  const path = '/contact/';
  const crumbs = [home, { name: 'Contact', path }];
  const body = `
<section class="page-hero"><div class="wrap">
  ${crumbsHtml(crumbs)}
  <p class="eyebrow">Say hi 👋</p>
  <h1>Contact Coatform Painting</h1>
  <p class="lede">Questions, quotes or quick touch-ups — we’d love to hear from you.</p>
</div></section>
<section class="section--tight"><div class="wrap">
  <div class="grid grid-3 contact-cards">
    <a class="card reveal" href="tel:${site.phoneHref}"><div class="icon">📞</div><p>Call or text</p><strong>${site.phone}</strong></a>
    <a class="card reveal" href="mailto:${site.email}"><div class="icon">✉️</div><p>Email</p><strong>${site.email}</strong></a>
    <a class="card reveal" href="/free-quote/"><div class="icon">✨</div><p>Instant estimate</p><strong>Free AI quote →</strong></a>
  </div>
</div></section>
<section class="section--tight"><div class="wrap split">
  <div class="panel panel--cream">
    <form class="form form-light" data-lead data-subject="New contact message" novalidate>
      <input class="hp" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">
      <h2 style="font-size:1.8rem;margin:0">Send us a message</h2>
      <div class="form-row">
        <div class="field"><label for="c-name">Name <span class="req">*</span></label><input id="c-name" name="name" autocomplete="name" required></div>
        <div class="field"><label for="c-phone">Phone <span class="req">*</span></label><input id="c-phone" name="phone" type="tel" autocomplete="tel" required></div>
      </div>
      <div class="form-row">
        <div class="field"><label for="c-email">Email <span class="req">*</span></label><input id="c-email" name="email" type="email" autocomplete="email" required></div>
        <div class="field"><label for="c-city">City</label><select id="c-city" name="city">${cityOptions('')}</select></div>
      </div>
      <div class="field"><label for="c-service">Topic</label><select id="c-service" name="service">${serviceOptions('')}<option>Warranty claim</option><option>Careers</option><option>Other</option></select></div>
      <div class="field"><label for="c-msg">Message <span class="req">*</span></label><textarea id="c-msg" name="message" required></textarea></div>
      <label class="consent"><input type="checkbox" name="consent" value="yes" required> I agree to be contacted by Coatform Painting and accept the <a href="/privacy/">Privacy Policy</a>.</label>
      <button class="btn btn--lg btn--block" type="submit">Send message →</button>
      <div class="form-status" role="status" aria-live="polite"></div>
    </form>
  </div>
  <aside>
    <div class="panel">
      <h2 style="font-size:1.6rem">Hours</h2>
      <ul class="check-list">${site.hours.map((h) => `<li><strong>${h.days}:</strong> ${h.time}</li>`).join('')}</ul>
      <h2 style="font-size:1.6rem;margin-top:30px">Service area</h2>
      <p class="muted">Toronto & the GTA — <a href="/service-areas/">see all ${cities.length} cities</a>.</p>
      <h2 style="font-size:1.6rem;margin-top:30px">Follow our work</h2>
      <p class="muted">Before & afters, colour inspo and behind-the-scenes.</p>
      ${socialLinks()}
    </div>
  </aside>
</div></section>
<section class="section--tight"><div class="wrap">
  ${mapEmbed({ q: 'Greater Toronto Area, ON, Canada', zoom: 8, label: 'Map of Coatform Painting service areas across the GTA' })}
</div></section>`;
  emit(path, layout({
    title: 'Contact Coatform Painting | 416-786-1621 | Toronto & GTA Painters',
    description: `Contact Coatform Painting: call or text ${site.phone} or email ${site.email}. Painters serving Toronto & the GTA.`,
    path, body, crumbs,
    schema: [{ '@type': 'ContactPage', url: abs(path), mainEntity: { '@id': BUSINESS_ID } }],
  }), { priority: 0.8 });
}

// =========================================================== ABOUT
{
  const path = '/about/';
  const crumbs = [home, { name: 'About', path }];
  const body = `
<section class="page-hero"><div class="wrap">
  ${crumbsHtml(crumbs)}
  <p class="eyebrow">About us</p>
  <h1>Painting, but make it <span class="serif copper">easy.</span></h1>
  <p class="lede">Coatform Painting is a Toronto & GTA painting company built on a simple idea: hiring a painter should feel as good as the finished walls look.</p>
</div></section>
<section class="section--tight"><div class="wrap split">
  <div class="prose">
    <h2>Our story</h2>
    <p>We started Coatform because too many homeowners told us the same thing: painters who don’t call back, vague quotes, rushed prep, and paint on the floors. We built a company that fixes all of that — transparent pricing, instant online estimates, respectful crews and finishes that actually last.</p>
    <p>The name says it: <strong>coat</strong> — the premium paint we put on your walls — and <strong>form</strong> — the craft, prep and precision behind every line.</p>
    <h2>Our promise to you</h2>
    <ul class="check-list">
      <li><strong>Clear pricing.</strong> Rough estimate online, exact written quote after a walkthrough. No surprise charges — changes are always approved in writing first.</li>
      <li><strong>Real prep.</strong> Patch, sand, caulk, prime. Every time.</li>
      <li><strong>Respect for your home.</strong> Floors and furniture protected, daily tidy-ups, spotless finish.</li>
      <li><strong>Communication.</strong> You always know when we’re coming and what’s next.</li>
      <li><strong>We stand behind it.</strong> Written <a href="/warranty/">workmanship warranty</a> on every job.</li>
    </ul>
    <h2>Where we work</h2>
    <p>We paint homes and businesses across ${cities.map((c) => `<a href="/service-areas/${c.slug}/">${esc(c.name)}</a>`).join(', ')}.</p>
  </div>
  <aside class="sticky-side"><div class="panel panel--cream">${quickForm({ id: 'about' })}</div></aside>
</div></section>
${ctaBand()}`;
  emit(path, layout({
    title: 'About Coatform Painting | Toronto & GTA Painting Company',
    description: 'Meet Coatform Painting — a Toronto & GTA painting company focused on transparent pricing, real prep, respectful crews and a written warranty.',
    path, body, crumbs,
    schema: [{ '@type': 'AboutPage', url: abs(path), mainEntity: { '@id': BUSINESS_ID } }],
  }), { priority: 0.7 });
}

// =========================================================== FAQ
{
  const path = '/faq/';
  const crumbs = [home, { name: 'FAQ', path }];
  const all = [...generalFaqs, ...services.flatMap((s) => s.faqs.slice(0, 1))];
  const body = `
<section class="page-hero"><div class="wrap">
  ${crumbsHtml(crumbs)}
  <p class="eyebrow">FAQ</p>
  <h1>Painting questions, answered</h1>
  <p class="lede">Everything you want to know about pricing, prep, paint, timing and our warranty.</p>
</div></section>
<section class="section--tight"><div class="wrap">
  <div class="faq">${all.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div>
</div></section>
${ctaBand('Still have questions?')}`;
  emit(path, layout({
    title: 'Painting FAQ | Costs, Prep, Paint & Warranty | Coatform Painting',
    description: 'Answers to common painting questions: costs in Toronto, how long it takes, supplying your own paint, prep, warranty and more.',
    path, body, crumbs, schema: [faqSchema(all)],
  }), { priority: 0.7 });
}

// =========================================================== BLOG
{
  const crumbs = [home, { name: 'Blog', path: '/blog/' }];
  const body = `
<section class="page-hero"><div class="wrap">
  ${crumbsHtml(crumbs)}
  <p class="eyebrow">The Coatform blog</p>
  <h1>Paint tips, prices & inspo</h1>
  <p class="lede">Straight answers from GTA painters — costs, timing, colours and how to make paint last.</p>
</div></section>
<section class="section--tight"><div class="wrap"><div class="grid grid-3">
  ${posts.map((p) => `<a class="card reveal" href="/blog/${p.slug}/"><p class="eyebrow" style="margin-bottom:10px">${new Date(p.date + 'T12:00:00').toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })}</p><h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p><span class="arrow">Read →</span></a>`).join('')}
</div></div></section>
${ctaBand()}`;
  emit('/blog/', layout({
    title: 'Painting Blog | Costs, Tips & Colour Ideas | Coatform Painting',
    description: 'Painting costs in Toronto, exterior timing, cabinet tips and colour inspiration from the Coatform Painting team.',
    path: '/blog/', body, crumbs,
  }), { priority: 0.6, changefreq: 'weekly' });

  for (const p of posts) {
    const path = `/blog/${p.slug}/`;
    const pc = [...crumbs, { name: p.title, path }];
    const body = `
<section class="page-hero"><div class="wrap">
  ${crumbsHtml(pc)}
  <p class="eyebrow">${new Date(p.date + 'T12:00:00').toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
  <h1 style="font-size:clamp(2.2rem,5.5vw,4rem);max-width:22ch">${esc(p.title)}</h1>
</div></section>
<section class="section--tight"><div class="wrap split">
  <article class="prose">${p.html}</article>
  <aside class="sticky-side"><div class="panel panel--cream">${quickForm({ id: 'post' })}</div></aside>
</div></section>
${ctaBand()}`;
    emit(path, layout({
      title: p.metaTitle,
      description: p.description,
      path, body, crumbs: pc, ogType: 'article',
      schema: [{
        '@type': 'BlogPosting',
        headline: p.title,
        description: p.description,
        datePublished: p.date,
        dateModified: p.date,
        mainEntityOfPage: abs(path),
        image: abs('/assets/img/og-image.jpg'),
        author: { '@type': 'Organization', name: site.name, url: site.url + '/' },
        publisher: { '@id': BUSINESS_ID },
      }],
    }), { priority: 0.6 });
  }
}

// =========================================================== LEGAL
for (const l of legalPages) {
  const path = `/${l.slug}/`;
  const crumbs = [home, { name: l.h1, path }];
  const body = `
<section class="page-hero"><div class="wrap">
  ${crumbsHtml(crumbs)}
  <p class="eyebrow">Legal</p>
  <h1>${esc(l.h1)}</h1>
  <p class="lede">${esc(l.lede)}</p>
</div></section>
<section class="section section--cream legal"><div class="wrap"><div class="prose">${l.html}</div></div></section>`;
  emit(path, layout({ title: l.title, description: l.description, path, body, crumbs }), { priority: 0.3, changefreq: 'yearly' });
}

// =========================================================== HTML SITEMAP
{
  const path = '/sitemap/';
  const crumbs = [home, { name: 'Sitemap', path }];
  const body = `
<section class="page-hero"><div class="wrap">${crumbsHtml(crumbs)}<h1>Sitemap</h1></div></section>
<section class="section--tight"><div class="wrap grid grid-3">
  <div><h2 style="font-size:1.6rem">Main</h2><ul class="prose">
    <li><a href="/">Home</a></li><li><a href="/free-quote/">Free AI Estimate</a></li><li><a href="/book/">Book an Appointment</a></li><li><a href="/contact/">Contact</a></li><li><a href="/about/">About</a></li><li><a href="/faq/">FAQ</a></li><li><a href="/blog/">Blog</a></li>
    ${posts.map((p) => `<li><a href="/blog/${p.slug}/">${esc(p.title)}</a></li>`).join('')}
    ${legalPages.map((l) => `<li><a href="/${l.slug}/">${esc(l.h1)}</a></li>`).join('')}
  </ul></div>
  <div><h2 style="font-size:1.6rem">Services</h2><ul class="prose"><li><a href="/services/">All services</a></li>${services.map((s) => `<li><a href="/services/${s.slug}/">${esc(s.name)}</a></li>`).join('')}</ul></div>
  <div><h2 style="font-size:1.6rem">Service areas</h2><ul class="prose"><li><a href="/service-areas/">All service areas</a></li>${cities.map((c) => `<li><a href="/service-areas/${c.slug}/">Painters in ${esc(c.name)}</a></li>`).join('')}</ul></div>
</div></section>`;
  emit(path, layout({ title: 'Sitemap | Coatform Painting', description: 'All pages on the Coatform Painting website.', path, body, crumbs }), { priority: 0.2, changefreq: 'monthly' });
}

// =========================================================== 404
emit('/404.html', layout({
  title: 'Page not found | Coatform Painting',
  description: 'This page could not be found.',
  path: '/404.html',
  noindex: true,
  body: `<section class="page-hero notfound"><div class="wrap center"><h1>404</h1><p class="lede" style="margin-inline:auto">This wall is blank. Let’s get you somewhere fresher.</p><div class="hero-ctas" style="justify-content:center"><a class="btn btn--lg" href="/">Home</a><a class="btn btn--ghost btn--lg" href="/free-quote/">Free estimate</a></div></div></section>`,
}), { sitemap: false });

// =========================================================== static files
cpSync('src/assets', join(OUT, 'assets'), { recursive: true });
cpSync('src/favicon.ico', join(OUT, 'favicon.ico'));
const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${abs(p.path)}</loc><lastmod>${today}</lastmod><changefreq>${p.changefreq}</changefreq><priority>${p.priority.toFixed(1)}</priority></url>`).join('\n')}
</urlset>
`);

writeFileSync(join(OUT, 'robots.txt'), `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${site.url}/sitemap.xml
`);

writeFileSync(join(OUT, 'site.webmanifest'), JSON.stringify({
  name: site.name,
  short_name: 'Coatform',
  start_url: '/',
  display: 'standalone',
  background_color: '#0d0d0d',
  theme_color: '#0d0d0d',
  icons: [
    { src: '/assets/img/favicon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/assets/img/favicon-512.png', sizes: '512x512', type: 'image/png' },
  ],
}, null, 2));

// llms.txt — a plain summary for AI search assistants (ChatGPT, Perplexity, Google AI Overviews)
writeFileSync(join(OUT, 'llms.txt'), `# ${site.name}

> ${site.description}

- Phone: ${site.phone}
- Email: ${site.email}
- Website: ${site.url}
- Free AI estimate: ${site.url}/free-quote/
- Book an appointment: ${site.url}/book/

## Services
${services.map((s) => `- [${s.name}](${abs(`/services/${s.slug}/`)}): ${s.short}`).join('\n')}

## Service areas (Ontario, Canada)
${cities.map((c) => `- [Painters in ${c.name}](${abs(`/service-areas/${c.slug}/`)})`).join('\n')}

## Policies
${legalPages.map((l) => `- [${l.h1}](${abs(`/${l.slug}/`)})`).join('\n')}
`);

console.log(`Built ${pages.length + 1} pages into ./${OUT}`);
