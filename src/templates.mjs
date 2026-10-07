import { site, integrations } from './data/site.mjs';
import { services } from './data/services.mjs';
import { cities } from './data/cities.mjs';

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const abs = (path) => site.url + path;

export const BUSINESS_ID = `${site.url}/#business`;

export function businessSchema() {
  return {
    '@type': ['HousePainter', 'LocalBusiness'],
    '@id': BUSINESS_ID,
    name: site.name,
    url: site.url + '/',
    logo: abs('/assets/img/logo-dark.png'),
    image: abs('/assets/img/og-image.jpg'),
    telephone: '+1-416-786-1621',
    email: site.email,
    description: site.description,
    priceRange: site.priceRange,
    currenciesAccepted: 'CAD',
    slogan: site.tagline,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Toronto',
      addressRegion: 'ON',
      addressCountry: 'CA',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 43.6532, longitude: -79.3832 },
    areaServed: cities.map((c) => ({
      '@type': 'City',
      name: `${c.name}, ON`,
      url: abs(`/service-areas/${c.slug}/`),
    })),
    openingHoursSpecification: site.hours
      .filter((h) => h.schema)
      .map((h) => {
        const [days, time] = h.schema.split(' ');
        const [opens, closes] = time.split('-');
        const map = { Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday', Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday' };
        const keys = Object.keys(map);
        const [a, b] = days.split('-');
        const list = b ? keys.slice(keys.indexOf(a), keys.indexOf(b) + 1) : [a];
        return { '@type': 'OpeningHoursSpecification', dayOfWeek: list.map((k) => map[k]), opens, closes };
      }),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-416-786-1621',
      email: site.email,
      contactType: 'customer service',
      areaServed: 'CA-ON',
      availableLanguage: ['English'],
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Painting services',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name, url: abs(`/services/${s.slug}/`) },
      })),
    },
    sameAs: site.social.map((s) => s.url),
  };
}

export function breadcrumbSchema(crumbs) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

export function faqSchema(faqs) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

const fonts =
  'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700;800&display=swap';

const SOCIAL_ICONS = {
  Instagram: '<path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 4.7a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2zm0 8.4a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6zm5.3-9.8a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z"/>',
  TikTok: '<path d="M16.6 2h-3.3v13.4a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.2a6.3 6.3 0 1 0 5.3 6.2V8.6a7.8 7.8 0 0 0 4.4 1.4V6.7a4.4 4.4 0 0 1-4.4-4.7z"/>',
  Facebook: '<path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/>',
};

export function socialLinks(extraClass = '') {
  if (!site.social.length) return '';
  return `<ul class="socials ${extraClass}">${site.social
    .map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener me" aria-label="${esc(site.name)} on ${esc(s.name)}" title="${esc(s.name)} ${esc(s.handle || '')}"><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">${SOCIAL_ICONS[s.name] || ''}</svg><span>${esc(s.name)}</span></a></li>`)
    .join('')}</ul>`;
}

function header(path) {
  const cur = (p) => (path === p ? ' aria-current="page"' : '');
  return `
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="topbar"><div class="wrap">
    <span>📞 <a href="tel:${site.phoneHref}"><strong>${site.phone}</strong></a> <span class="hide-sm">· ✉️ <a href="mailto:${site.email}">${site.email}</a></span></span>
    <span><a href="/free-quote/">✨ Free AI estimate in 60 seconds →</a></span>
  </div></div>
  <nav class="wrap nav" aria-label="Main">
    <a class="logo" href="/" aria-label="${site.name} home"><img src="/assets/img/logo-white-480.webp" alt="${site.name} logo" width="480" height="127"></a>
    <ul class="nav-links">
      <li class="has-dropdown">
        <button type="button" aria-expanded="false" aria-haspopup="true">Services ▾</button>
        <div class="dropdown">
          ${services.map((s) => `<a href="/services/${s.slug}/"${cur(`/services/${s.slug}/`)}>${s.icon} ${esc(s.name)}</a>`).join('')}
          <a class="all" href="/services/">All painting services →</a>
        </div>
      </li>
      <li class="has-dropdown">
        <button type="button" aria-expanded="false" aria-haspopup="true">Service Areas ▾</button>
        <div class="dropdown">
          ${cities.map((c) => `<a href="/service-areas/${c.slug}/"${cur(`/service-areas/${c.slug}/`)}>📍 ${esc(c.name)}</a>`).join('')}
          <a class="all" href="/service-areas/">Map of all service areas →</a>
        </div>
      </li>
      <li><a href="/free-quote/"${cur('/free-quote/')}>Free Quote</a></li>
      <li><a href="/book/"${cur('/book/')}>Book</a></li>
      <li><a href="/about/"${cur('/about/')}>About</a></li>
      <li><a href="/blog/"${cur('/blog/')}>Blog</a></li>
      <li><a href="/contact/"${cur('/contact/')}>Contact</a></li>
    </ul>
    <div class="nav-cta">
      <a class="phone" href="tel:${site.phoneHref}">${site.phone}</a>
      <a class="btn" href="/free-quote/">Free Quote</a>
      <button class="burger" type="button" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>
  </nav>
</header>`;
}

function footer() {
  return `
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-contact">
        <img src="/assets/img/logo-white-480.webp" alt="${site.name}" width="240" height="64" loading="lazy" style="width:240px;margin-bottom:22px">
        <p class="muted">Interior, exterior, cabinet, condo & commercial painting across Toronto and the GTA. ${esc(site.tagline)}</p>
        <p class="big"><a href="tel:${site.phoneHref}">${site.phone}</a></p>
        <p><a href="mailto:${site.email}">${site.email}</a></p>
        <ul>${site.hours.map((h) => `<li class="muted">${h.days}: ${h.time}</li>`).join('')}</ul>
        ${socialLinks()}
      </div>
      <div>
        <h3>Services</h3>
        <ul>${services.map((s) => `<li><a href="/services/${s.slug}/">${esc(s.name)}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h3>Service Areas</h3>
        <ul>${cities.map((c) => `<li><a href="/service-areas/${c.slug}/">Painters in ${esc(c.name)}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h3>Company</h3>
        <ul>
          <li><a href="/free-quote/">Free AI Estimate</a></li>
          <li><a href="/book/">Book an Appointment</a></li>
          <li><a href="/contact/">Contact Us</a></li>
          <li><a href="/about/">About Coatform</a></li>
          <li><a href="/faq/">FAQ</a></li>
          <li><a href="/blog/">Painting Blog</a></li>
          <li><a href="/warranty/">Warranty</a></li>
          <li><a href="/refund-policy/">Refunds & Cancellations</a></li>
          <li><a href="/terms/">Terms & Conditions</a></li>
          <li><a href="/privacy/">Privacy Policy</a></li>
          <li><a href="/accessibility/">Accessibility</a></li>
          <li><a href="/sitemap/">Sitemap</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-word" aria-hidden="true">COATFORM</div>
    <div class="footer-bottom">
      <span>© <span id="year">${new Date().getFullYear()}</span> ${site.legalName}. Painting Toronto, Mississauga, Brampton, Vaughan, Markham, Oakville, Hamilton & the GTA.</span>
      <ul><li><a href="/terms/">Terms</a></li><li><a href="/privacy/">Privacy</a></li><li><a href="/warranty/">Warranty</a></li><li><a href="/refund-policy/">Refunds</a></li></ul>
    </div>
  </div>
</footer>
<div class="mobile-cta">
  <a class="btn btn--ghost" href="tel:${site.phoneHref}">📞 Call now</a>
  <a class="btn" href="/free-quote/">Free Quote</a>
</div>`;
}

export function crumbsHtml(crumbs) {
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${crumbs
    .map((c, i) => (i === crumbs.length - 1 ? `<li aria-current="page">${esc(c.name)}</li>` : `<li><a href="${c.path}">${esc(c.name)}</a></li>`))
    .join('')}</ol></nav>`;
}

/**
 * Wrap page content in the full HTML document with all SEO tags.
 */
export function layout({ title, description, path, body, schema = [], crumbs, noindex = false, scripts = '', ogType = 'website' }) {
  const url = abs(path);
  const graph = [businessSchema(), {
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    url: site.url + '/',
    name: site.name,
    inLanguage: 'en-CA',
    publisher: { '@id': BUSINESS_ID },
  }, {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: 'en-CA',
    isPartOf: { '@id': `${site.url}/#website` },
    about: { '@id': BUSINESS_ID },
  }];
  if (crumbs) graph.push(breadcrumbSchema(crumbs));
  graph.push(...schema);

  const ga = integrations.googleAnalyticsId
    ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${integrations.googleAnalyticsId}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${integrations.googleAnalyticsId}');</script>`
    : '';

  return `<!doctype html>
<html lang="en-CA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'}">
<link rel="alternate" hreflang="en-CA" href="${url}">
<link rel="alternate" hreflang="x-default" href="${url}">
<meta name="geo.region" content="CA-ON">
<meta name="geo.placename" content="Toronto">
<meta name="geo.position" content="43.6532;-79.3832">
<meta name="ICBM" content="43.6532, -79.3832">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${site.name}">
<meta property="og:locale" content="en_CA">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${abs('/assets/img/og-image.jpg')}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${site.name} — Toronto & GTA painters">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${abs('/assets/img/og-image.jpg')}">
<meta name="theme-color" content="#0d0d0d">
<meta name="format-detection" content="telephone=yes">
${integrations.googleSiteVerification ? `<meta name="google-site-verification" content="${integrations.googleSiteVerification}">` : ''}
${integrations.bingSiteVerification ? `<meta name="msvalidate.01" content="${integrations.bingSiteVerification}">` : ''}
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon-32.png">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fonts}">
<link rel="preload" as="image" href="/assets/img/logo-white-480.webp">
<link rel="stylesheet" href="/assets/css/style.css?v=${BUILD}">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>
<script>window.CF=${JSON.stringify({ phone: site.phone, phoneHref: site.phoneHref, email: site.email, formEndpoint: site.formEndpoint })};</script>
${ga}
</head>
<body>
${header(path)}
<main id="main">
${body}
</main>
${footer()}
<script src="/assets/js/main.js?v=${BUILD}" defer></script>
${scripts}
</body>
</html>`;
}

export const BUILD = Date.now().toString(36);

// ---------- shared blocks ----------

export function ctaBand(heading = 'Ready for a fresh coat?') {
  return `
<section class="section--tight"><div class="wrap">
  <div class="cta-band reveal">
    <p class="eyebrow" style="color:#fff">Free quotes · No pressure</p>
    <h2>${heading}</h2>
    <p style="max-width:52ch;font-size:1.1rem">Call or text us now — a real person picks up. Or get a rough AI estimate online in about 60 seconds.</p>
    <a class="phone-xl" href="tel:${site.phoneHref}">${site.phone}</a>
    <div class="row">
      <a class="btn btn--dark btn--lg" href="/free-quote/">Get my free estimate</a>
      <a class="btn btn--light btn--lg" href="/book/">Book an appointment</a>
      <a class="btn btn--ghost btn--lg" style="color:#fff;box-shadow:inset 0 0 0 2px rgba(255,255,255,.5)" href="mailto:${site.email}">${site.email}</a>
    </div>
  </div>
</div></section>`;
}

export function faqBlock(faqs, heading = 'Questions? Answered.', cream = true) {
  return `
<section class="section ${cream ? 'section--cream' : ''}"><div class="wrap split">
  <div>
    <p class="eyebrow">FAQ</p>
    <h2>${heading}</h2>
    <p class="lede">Still curious? Call <a href="tel:${site.phoneHref}"><strong>${site.phone}</strong></a> or email <a href="mailto:${site.email}">${site.email}</a>.</p>
  </div>
  <div class="faq">
    ${faqs.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}
  </div>
</div></section>`;
}

export function serviceCard(s, cityName) {
  return `<a class="card reveal" href="/services/${s.slug}/">
    <div class="icon" aria-hidden="true">${s.icon}</div>
    <h3>${esc(s.name)}${cityName ? ` <span class="sr-only">in ${esc(cityName)}</span>` : ''}</h3>
    <p>${esc(s.short)}</p>
    <span class="arrow">Explore →</span>
  </a>`;
}

const cityOptions = (selected) =>
  cities.map((c) => `<option${c.name === selected ? ' selected' : ''}>${esc(c.name)}</option>`).join('') + '<option>Other GTA city</option>';
const serviceOptions = (selected) =>
  services.map((s) => `<option${s.name === selected ? ' selected' : ''}>${esc(s.name)}</option>`).join('') + '<option>Not sure yet</option>';

export function quickForm({ city = '', service = '', light = true, title = 'Get a free quote', id = 'quick' } = {}) {
  return `
<form class="form ${light ? 'form-light' : ''}" data-lead data-subject="Quick quote request${city ? ` — ${esc(city)}` : ''}" novalidate id="${id}">
  <div>
    <h2 style="font-size:1.9rem;margin-bottom:6px">${title}</h2>
    <p class="muted" style="margin:0">We reply within 1 business day. Prefer to talk? <a href="tel:${site.phoneHref}"><strong>${site.phone}</strong></a></p>
  </div>
  <input class="hp" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">
  <div class="field"><label for="${id}-name">Full name <span class="req">*</span></label><input id="${id}-name" name="name" autocomplete="name" required></div>
  <div class="form-row">
    <div class="field"><label for="${id}-phone">Phone <span class="req">*</span></label><input id="${id}-phone" name="phone" type="tel" autocomplete="tel" required></div>
    <div class="field"><label for="${id}-email">Email <span class="req">*</span></label><input id="${id}-email" name="email" type="email" autocomplete="email" required></div>
  </div>
  <div class="form-row">
    <div class="field"><label for="${id}-service">Service</label><select id="${id}-service" name="service">${serviceOptions(service)}</select></div>
    <div class="field"><label for="${id}-city">City</label><select id="${id}-city" name="city">${cityOptions(city)}</select></div>
  </div>
  <div class="field"><label for="${id}-msg">Tell us about your project</label><textarea id="${id}-msg" name="message" rows="3" placeholder="e.g. 3 bedrooms + hallway, walls & ceilings, want it done before the 15th"></textarea></div>
  <label class="consent"><input type="checkbox" name="consent" value="yes" required> I agree to be contacted by Coatform Painting about my request and accept the <a href="/privacy/">Privacy Policy</a>.</label>
  <button class="btn btn--lg btn--block" type="submit">Send my request →</button>
  <div class="form-status" role="status" aria-live="polite"></div>
</form>`;
}

// Live Google Map (embed — no API key needed, always loads).
export function mapEmbed({ q, zoom = 11, label, sm = false }) {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=${zoom}&output=embed`;
  return `<div class="map${sm ? ' map--sm' : ''} reveal" role="region" aria-label="${esc(label)}"><iframe src="${src}" title="${esc(label)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>`;
}

export { cityOptions, serviceOptions };
