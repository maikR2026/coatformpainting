// Single source of truth for business details. Change it here and rebuild.
export const site = {
  name: 'Coatform Painting',
  legalName: 'Coatform Painting',
  url: 'https://coatformpainting.ca',
  phone: '416-786-1621',
  phoneHref: '+14167861621',
  email: 'info@coatformpainting.ca',
  // Forms are delivered to this inbox via FormSubmit (https://formsubmit.co).
  // The first submission sends a one-time activation email to this address.
  formEndpoint: 'https://formsubmit.co/ajax/info@coatformpainting.ca',
  region: 'Toronto & the Greater Toronto Area',
  tagline: 'Fresh coats. Clean lines. Zero stress.',
  description:
    'Coatform Painting is a Toronto & GTA painting company for interior, exterior, cabinet, condo and commercial painting. Free quotes, instant AI estimates and a written warranty. Call 416-786-1621.',
  hours: [
    { days: 'Monday – Friday', time: '7:00 AM – 7:00 PM', schema: 'Mo-Fr 07:00-19:00' },
    { days: 'Saturday', time: '8:00 AM – 5:00 PM', schema: 'Sa 08:00-17:00' },
    { days: 'Sunday', time: 'By appointment', schema: null },
  ],
  priceRange: '$$',
  brand: {
    copper: '#AF582F',
    ink: '#0D0D0D',
    cream: '#F3ECE2',
  },
  // Add your real profile URLs here once they exist (Google Business Profile,
  // Instagram, TikTok, HomeStars, Facebook...). They are output in the schema
  // "sameAs" list and in the footer.
  social: [
    // { name: 'Instagram', url: 'https://instagram.com/coatformpainting' },
    // { name: 'TikTok', url: 'https://tiktok.com/@coatformpainting' },
    // { name: 'Google', url: 'https://g.page/...' },
  ],
};

// Optional integrations — paste IDs here and rebuild.
export const integrations = {
  googleAnalyticsId: '', // e.g. 'G-XXXXXXXXXX'
  googleSiteVerification: '', // from Google Search Console
  bingSiteVerification: '', // from Bing Webmaster Tools
};
