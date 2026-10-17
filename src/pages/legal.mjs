import { site } from '../data/site.mjs';

// NOTE: These policies are a solid starting point written for an Ontario
// painting contractor. Have them reviewed by your lawyer/insurer and adjust
// the numbers (warranty years, deposit %, cancellation windows) to match how
// you actually run the business.
const UPDATED = 'October 6, 2026';
const contact = `<p><strong>Coatform Painting</strong><br>Phone: <a href="tel:${site.phoneHref}">${site.phone}</a><br>Email: <a href="mailto:${site.email}">${site.email}</a></p>`;

export const legalPages = [
  {
    slug: 'terms',
    title: 'Terms & Conditions | Coatform Painting',
    description: 'The terms and conditions for using the Coatform Painting website and hiring Coatform Painting for painting services in Toronto & the GTA.',
    h1: 'Terms & Conditions',
    lede: 'The plain-English rules for using our website and working with us.',
    html: `
<p><em>Last updated: ${UPDATED}</em></p>
<div class="key"><strong>TL;DR:</strong> Online and AI estimates are <strong>ROUGH ESTIMATES ONLY — NOT FINAL QUOTES.</strong> Your <strong>final price</strong> is confirmed in a <strong>written quote</strong> after we see your project. Questions? Call <a href="tel:${site.phoneHref}"><strong>${site.phone}</strong></a>.</div>
<h2>1. Who we are</h2>
<p>These Terms & Conditions ("Terms") apply to the website at ${site.url} (the "Site") and to painting and related services provided by Coatform Painting ("Coatform", "we", "us", "our") in Ontario, Canada. By using the Site or booking our services you agree to these Terms.</p>
<h2>2. Online estimates are not quotes</h2>
<p>Our Site includes a free estimator that may use artificial intelligence ("AI") together with our standard pricing to generate a price range. <span class="big">Any online or AI-generated estimate is a ROUGH ESTIMATE for budgeting purposes only.</span> It is <strong>not</strong> a quote, offer, contract or guarantee of price. It is based only on the information you enter and cannot account for things like surface condition, repairs, access, colour coverage or hidden damage.</p>
<p>A <strong>final, binding price</strong> is only provided in a <strong>written quote</strong> from Coatform after an in-person or video assessment. To get an accurate price, call <a href="tel:${site.phoneHref}">${site.phone}</a>.</p>
<h2>3. Written quotes</h2>
<ul>
  <li>Written quotes are valid for <strong>30 days</strong> from the date issued unless stated otherwise.</li>
  <li>The quote describes the <strong>scope of work</strong> (surfaces, rooms, number of coats, products). Anything not listed is not included.</li>
  <li>If the work required differs significantly from what was visible or described (for example hidden water damage, failing previous coatings or extra repairs), we will tell you before doing extra work and provide a <strong>written change order</strong> for your approval.</li>
</ul>
<h2>4. Booking, deposits & payment</h2>
<ul>
  <li>A <strong>deposit</strong> (normally up to <strong>30%</strong> of the quoted price) may be required to reserve your start date and purchase materials.</li>
  <li>For larger projects we may invoice progress payments at agreed milestones.</li>
  <li>The <strong>balance is due on completion</strong>, after the final walkthrough.</li>
  <li>We accept e-Transfer, cheque, credit card and other methods listed on your quote. All prices are in Canadian dollars and <strong>HST is extra</strong> unless stated.</li>
  <li>Overdue balances may be charged interest of 2% per month (26.8% per year) after 30 days.</li>
</ul>
<h2>5. Your responsibilities</h2>
<ul>
  <li>Provide safe access to the work areas, plus access to water and electricity.</li>
  <li>Remove valuables, fragile items, artwork, wall-mounted TVs and personal items from work areas. We move and cover furniture, but we are not responsible for items that should reasonably have been removed.</li>
  <li>Keep children and pets away from work areas during the project.</li>
  <li>Approve colours in writing (email or text is fine) before work starts. Colours on screens and small chips can look different on your walls — <strong>we are not responsible for colour choices once approved</strong>, though we are always happy to help you choose.</li>
  <li>Tell us about any known issues such as moisture, mould, previous water damage, or lead-based paint or asbestos in the home.</li>
</ul>
<h2>6. Customer-supplied paint</h2>
<p>If you supply your own paint or materials, we will apply them according to the manufacturer's instructions, but <strong>we cannot warranty the performance of customer-supplied products</strong> (coverage, durability, colour accuracy or defects). Extra coats or labour caused by low-quality or insufficient product may be billed as extra. Our workmanship warranty still applies to our labour.</p>
<h2>7. Older homes: lead paint & asbestos</h2>
<p>Homes built before about 1980 may contain lead-based paint, and textured ceilings or materials installed before the mid-1980s may contain asbestos. Where these may be present we may recommend testing before work begins. We will not knowingly disturb hazardous materials without appropriate testing and precautions. Testing and abatement costs are not included unless written in your quote.</p>
<h2>8. Weather & scheduling</h2>
<p>Exterior work depends on suitable weather (generally above 10°C and dry). We may reschedule for rain, extreme heat, cold or high humidity to protect the quality of your finish. Start dates are estimates and can shift because of weather, earlier projects or material availability; we will keep you updated.</p>
<h2>9. Clean-up & completion</h2>
<p>We clean up daily and remove our materials on completion. Before final payment we do a <strong>walkthrough with you</strong> and fix any reasonable touch-ups you point out. Minor imperfections only visible from very close range or under unusual lighting are not considered defects.</p>
<h2>10. Photos</h2>
<p>We may take before-and-after photos of our work (never of you, your family or personal items) for our portfolio and social media. No address or identifying details are shared. Tell us if you prefer that we don't, and we won't.</p>
<h2>11. Warranty, refunds & cancellations</h2>
<p>Please see our <a href="/warranty/">Warranty</a> and <a href="/refund-policy/">Refund & Cancellation Policy</a>, which form part of these Terms.</p>
<h2>12. Limitation of liability</h2>
<p>To the extent permitted by law, our total liability for any claim relating to a project is limited to the amount you paid for that project. We are not liable for indirect or consequential losses. Nothing in these Terms limits any rights you have under Ontario's consumer protection laws that cannot be waived.</p>
<h2>13. Website use</h2>
<p>Website content is for general information. We try to keep it accurate but do not guarantee it is complete or current. Do not misuse the Site, submit false information, or attempt to interfere with its operation. Logos, text and design on this Site belong to Coatform Painting.</p>
<h2>14. Governing law</h2>
<p>These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada that apply there.</p>
<h2>15. Changes</h2>
<p>We may update these Terms from time to time. The version posted on the Site applies from the "Last updated" date. The Terms in force when you sign a written quote apply to that project.</p>
<h2>16. Contact</h2>
${contact}`,
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy | Coatform Painting',
    description: 'How Coatform Painting collects, uses and protects your personal information under Canadian privacy law (PIPEDA) and Canada’s Anti-Spam Legislation (CASL).',
    h1: 'Privacy Policy',
    lede: 'Your info is yours. Here is exactly what we collect, why, and how we protect it.',
    html: `
<p><em>Last updated: ${UPDATED}</em></p>
<div class="key"><strong>We never sell your personal information.</strong> We only use it to respond to your request, provide your quote and complete your project.</div>
<h2>1. Scope</h2>
<p>This Privacy Policy explains how Coatform Painting ("we", "us") handles personal information collected through ${site.url}, by phone, email, text and during our work, in line with Canada's <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA).</p>
<h2>2. What we collect</h2>
<ul>
  <li><strong>Contact details:</strong> name, phone number, email address, property address and city.</li>
  <li><strong>Project details:</strong> services needed, property type and size, room counts, condition, preferred dates, budget, whether you supply paint, notes and any photos you send us.</li>
  <li><strong>Technical data:</strong> basic information your browser sends automatically (such as IP address, device and browser type, pages visited). If we enable analytics, this is collected in aggregate.</li>
</ul>
<h2>3. Why we use it</h2>
<ul>
  <li>To respond to your enquiry, prepare <strong>estimates and quotes</strong>, schedule appointments and complete your project.</li>
  <li>To send invoices, warranty information and service-related messages.</li>
  <li>To improve our website and services.</li>
  <li>To send occasional offers or tips <strong>only if you consent</strong>. Every marketing message includes an easy way to unsubscribe, as required by Canada's Anti-Spam Legislation (CASL).</li>
</ul>
<h2>4. Service providers we use</h2>
<p>We share information only with providers that help us run the business, and only what they need:</p>
<ul>
  <li><strong>Form delivery:</strong> website forms are delivered to our inbox by a third-party form-processing service (FormSubmit).</li>
  <li><strong>AI estimator:</strong> the project details you enter in the free estimator (not your name, phone or email) are sent to an AI provider (Anthropic) to generate a rough price range.</li>
  <li><strong>Website hosting, maps and fonts:</strong> our host, OpenStreetMap/CARTO map tiles and Google Fonts receive standard technical data (like your IP address) when pages load.</li>
  <li><strong>Email, accounting and payment providers</strong> used to run our business.</li>
</ul>
<p>Some providers may store or process data outside Canada (for example in the United States), where it may be subject to local laws.</p>
<h2>5. Cookies</h2>
<p>Our site does not use advertising cookies. If we enable analytics (such as Google Analytics), it may use cookies to understand how visitors use the site. You can block or delete cookies in your browser settings.</p>
<h2>6. How long we keep it</h2>
<p>We keep enquiry information for up to 2 years, and customer and job records for up to 7 years for tax, accounting and warranty purposes, then securely delete them.</p>
<h2>7. Security</h2>
<p>We use reasonable safeguards — secure (HTTPS) connections, password-protected accounts and limited access — to protect your information. No method of transmission is 100% secure, but we take it seriously.</p>
<h2>8. Your rights</h2>
<p>You can ask to <strong>access, correct or delete</strong> your personal information, or withdraw consent to marketing at any time, by contacting us. We will respond within 30 days. If you have concerns, you may also contact the Office of the Privacy Commissioner of Canada.</p>
<h2>9. Children</h2>
<p>Our services and website are intended for adults. We do not knowingly collect information from children.</p>
<h2>10. Contact our privacy officer</h2>
${contact}`,
  },
  {
    slug: 'warranty',
    title: 'Painting Warranty | Coatform Painting Toronto & GTA',
    description: 'Coatform Painting’s written workmanship warranty: what is covered, how long, and how to make a claim. Interior, exterior, cabinet and staining coverage.',
    h1: 'Our Workmanship Warranty',
    lede: 'We stand behind every coat. If our workmanship fails, we come back and fix it — free.',
    html: `
<p><em>Last updated: ${UPDATED}</em></p>
<div class="key"><strong>If paint we applied peels, blisters or flakes because of our workmanship during the warranty period, we will fix it at NO COST for labour or materials.</strong></div>
<h2>Warranty periods</h2>
<table style="width:100%;border-collapse:collapse;font-size:1.05rem">
<tbody>
<tr><td style="padding:12px 0;border-bottom:1px solid rgba(0,0,0,.1)"><strong>Interior painting</strong> (walls, ceilings, trim)</td><td style="text-align:right;border-bottom:1px solid rgba(0,0,0,.1)"><span class="big">3 years</span></td></tr>
<tr><td style="padding:12px 0;border-bottom:1px solid rgba(0,0,0,.1)"><strong>Exterior painting</strong> (siding, trim, masonry)</td><td style="text-align:right;border-bottom:1px solid rgba(0,0,0,.1)"><span class="big">2 years</span></td></tr>
<tr><td style="padding:12px 0;border-bottom:1px solid rgba(0,0,0,.1)"><strong>Cabinets, doors & railings</strong></td><td style="text-align:right;border-bottom:1px solid rgba(0,0,0,.1)"><span class="big">2 years</span></td></tr>
<tr><td style="padding:12px 0;border-bottom:1px solid rgba(0,0,0,.1)"><strong>Deck & fence staining</strong> (horizontal surfaces)</td><td style="text-align:right;border-bottom:1px solid rgba(0,0,0,.1)"><span class="big">1 year</span></td></tr>
<tr><td style="padding:12px 0;border-bottom:1px solid rgba(0,0,0,.1)"><strong>Epoxy floors, drywall & plaster repairs</strong></td><td style="text-align:right;border-bottom:1px solid rgba(0,0,0,.1)"><span class="big">1 year</span></td></tr>
</tbody></table>
<p>The warranty period starts on the date your project is completed and is for the property owner who hired us.</p>
<h2>What is covered</h2>
<ul>
  <li><strong>Peeling, blistering, flaking or chipping</strong> of paint we applied caused by our preparation or application.</li>
  <li><strong>Labour and materials</strong> needed to repair the affected area.</li>
</ul>
<h2>What is not covered</h2>
<ul>
  <li>Normal wear and tear, scuffs, impacts, scratches, abuse or improper cleaning (harsh chemicals or abrasive scrubbing).</li>
  <li>Damage caused by <strong>moisture, leaks, condensation, mould, structural movement, settling cracks</strong>, ice damming, failed caulking by others or other building issues.</li>
  <li>Natural fading, chalking or colour change from sun exposure, and normal wear of stain on decks and other walking surfaces.</li>
  <li>Surfaces you asked us not to prep, prime or repair as recommended, or existing coatings that fail underneath our paint.</li>
  <li><strong>Performance of customer-supplied paint</strong> or materials (our workmanship is still covered).</li>
  <li>Areas later painted, repaired or altered by others.</li>
  <li>Rust bleed or tannin bleed on surfaces where spot treatment was declined.</li>
</ul>
<h2>How to make a claim</h2>
<ol>
  <li>Call <a href="tel:${site.phoneHref}"><strong>${site.phone}</strong></a> or email <a href="mailto:${site.email}">${site.email}</a> with your name, address, the date of your project and photos of the issue.</li>
  <li>We will review it and, if needed, inspect in person within a reasonable time.</li>
  <li>Covered repairs are scheduled at a mutually convenient time (exterior repairs during suitable weather).</li>
</ol>
<p>Our warranty is in addition to any rights you have under Ontario law. Paint manufacturers may also provide their own product warranties.</p>
<h2>Questions?</h2>
${contact}`,
  },
  {
    slug: 'refund-policy',
    title: 'Refund & Cancellation Policy | Coatform Painting',
    description: 'Coatform Painting’s refund, deposit and cancellation policy for painting projects in Toronto & the GTA, including rescheduling and satisfaction guarantee.',
    h1: 'Refund & Cancellation Policy',
    lede: 'Clear, fair and no surprises — here is how deposits, cancellations and refunds work.',
    html: `
<p><em>Last updated: ${UPDATED}</em></p>
<div class="key"><strong>Cancel at least 7 days before your start date and get a FULL deposit refund</strong> (minus any special-order materials already purchased for your job).</div>
<h2>1. Free estimates</h2>
<p>Online AI estimates, in-person assessments and written quotes are <strong>always free</strong> and there is no obligation to hire us.</p>
<h2>2. Deposits</h2>
<p>A deposit (normally up to 30%) reserves your start date and covers materials. It is applied in full to your final invoice.</p>
<h2>3. Cancelling your project</h2>
<ul>
  <li><strong>7 or more days before the start date:</strong> full refund of your deposit, less the cost of any custom-tinted paint or special-order materials already purchased (those materials are yours to keep).</li>
  <li><strong>2 to 6 days before the start date:</strong> refund of your deposit less materials purchased and a cancellation fee of up to 10% of the quoted price.</li>
  <li><strong>Less than 48 hours before the start date, or after work starts:</strong> you pay for work completed to date, materials purchased, plus a cancellation fee of up to 15% of the remaining balance.</li>
</ul>
<div class="key"><strong>Ontario cooling-off period:</strong> if your agreement is a "direct agreement" (for example, signed at your home) under Ontario's <em>Consumer Protection Act</em>, you may cancel it for any reason within <strong>10 days</strong> after receiving your written copy, and receive a full refund as required by law.</div>
<h2>4. Rescheduling</h2>
<p>Life happens. You can <strong>reschedule free of charge</strong> with at least 48 hours' notice. We may reschedule because of weather (especially exterior work), safety concerns or circumstances beyond our control; your deposit stays fully credited to your project.</p>
<h2>5. Satisfaction & touch-ups</h2>
<p>Before final payment, we walk through the project with you. If anything isn't right, <strong>we fix it before we leave</strong>. We do not offer cash refunds for completed work, but if a genuine workmanship issue appears later, it is covered by our <a href="/warranty/">Warranty</a>.</p>
<h2>6. Disputes</h2>
<p>If you are unhappy, please contact us first — we will do our best to make it right quickly.</p>
<h2>7. How refunds are paid</h2>
<p>Approved refunds are paid using the original payment method (or e-Transfer) within <strong>15 business days</strong>.</p>
<h2>Contact</h2>
${contact}`,
  },
  {
    slug: 'accessibility',
    title: 'Accessibility Statement | Coatform Painting',
    description: 'Coatform Painting is committed to accessibility for people with disabilities, in line with the Accessibility for Ontarians with Disabilities Act (AODA).',
    h1: 'Accessibility Statement',
    lede: 'Everyone deserves a great experience — online and in their home.',
    html: `
<p><em>Last updated: ${UPDATED}</em></p>
<p>Coatform Painting is committed to providing services in a way that respects the dignity and independence of people with disabilities, consistent with the <em>Accessibility for Ontarians with Disabilities Act</em> (AODA).</p>
<h2>Our website</h2>
<p>We aim to meet the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>. Our site supports keyboard navigation, screen readers, visible focus states, readable colour contrast and reduced-motion preferences.</p>
<h2>Our services</h2>
<ul>
  <li>We are happy to communicate by phone, text or email — whichever works best for you.</li>
  <li>Support persons and service animals are always welcome.</li>
  <li>We can provide quotes, policies and invoices in alternative formats on request.</li>
</ul>
<h2>Feedback</h2>
<p>If something on our website is hard to use, or you need an accommodation, please tell us and we will respond promptly.</p>
${contact}`,
  },
];
