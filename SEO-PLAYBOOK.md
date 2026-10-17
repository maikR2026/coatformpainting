# Coatform Painting: SEO Playbook to Rank #1 in Toronto & the GTA

The website handles **on-page SEO** for you: keywords, schema, speed, 34 local landing pages and internal links. Rankings for local service businesses also depend on things that happen **off the website**, and only you can do those. Work through this list in order.

## Week 1: Foundations (biggest impact)

1. **Google Business Profile (GBP).** This is the #1 factor for showing up in the "map pack."
   - Create or claim it at business.google.com. Category: **Painter**. Add secondary categories: *House painter*, *Commercial painter*, *Painting contractor*.
   - Set it up as a **service-area business** and add all 16 cities.
   - Use the exact same name, phone and website everywhere: **Coatform Painting · 416-786-1621 · https://coatformpainting.ca** (this consistency is called "NAP").
   - Add every service from the site, your hours, the logo, and **at least 20 real job photos**. Keep adding photos every week.
2. **Google Search Console.** Verify the domain, paste the code into `integrations.googleSiteVerification` in `src/data/site.mjs`, then submit `https://coatformpainting.ca/sitemap.xml`.
3. **Bing Webmaster Tools.** Import from Search Console (covers Bing, DuckDuckGo, Yahoo and ChatGPT search).
4. **Google Analytics 4.** Paste the ID into `integrations.googleAnalyticsId`. Form submissions are tracked as `generate_lead` events.
5. **Apple Business Connect.** Gets you onto Apple Maps and Siri.

## Weeks 2–4: Citations & backlinks

Create a listing on each of these with **identical NAP** and a link to the website. Each one is a backlink plus a trust signal:

- HomeStars (very important in Canada)
- Yelp.ca
- Better Business Bureau (BBB)
- Houzz
- Facebook Business Page
- Instagram and TikTok (add the URLs to `social` in `site.mjs`)
- Nextdoor Business
- YellowPages.ca
- 411.ca
- Canpages
- TrustedPros
- Angi / HomeAdvisor
- Bark
- Thumbtack
- Cylex Canada
- Hotfrog
- Foursquare
- Local chambers of commerce (Toronto Region Board of Trade, Mississauga Board of Trade, Vaughan Chamber, etc.)

**Higher-value backlinks:**

- Ask paint stores you buy from (Benjamin Moore and Sherwin-Williams dealers) about their "find a contractor" listings.
- Partner with realtors, home stagers, property managers, renovators and interior designers. Swap website links and referrals.
- Sponsor a local sports team, school event or charity. These usually come with a link from their website.
- Pitch "before & after" stories or trend pieces ("2027 colour trends in Toronto homes") to local blogs and outlets such as BlogTO, Toronto Life Home and Inside Halton.
- Write guest posts for real-estate and home-décor blogs.

## Ongoing: Reviews (the ranking fuel)

- Ask **every** happy customer for a Google review. Text them the link the same day you finish.
- Aim for 5+ new reviews a month, and reply to every one.
- Ask customers to mention the service and the city in their review (for example, "cabinet painting in Oakville"). Google picks up those keywords.
- **Never** buy reviews or post fake ones. Google removes them and can suspend your profile.

## Ongoing: Content

- Post one Google Business update per week (a photo of the job, the city and the service).
- Add a blog post every 2–4 weeks in `src/data/posts.mjs`. Ideas:
  - "Best white paint colours for Toronto condos"
  - "How to prepare your home for painters"
  - "Popcorn ceiling removal cost in Mississauga"
- Add real **project photos and case studies** to service and city pages. Images of real jobs are a strong local signal.
- Once you have real reviews, add a testimonials section to the site.

## What's already built into the site

- Keyword-targeted titles and descriptions on every page (for example, "Painters in Toronto, ON", "Kitchen Cabinet Painting & Refinishing Toronto")
- 16 city pages with **unique** local content, neighbourhoods, maps and city FAQs
- 18 service pages with pricing guides and FAQs, which can win "People also ask" spots
- JSON-LD structured data: `HousePainter` with `areaServed` for all 16 cities, plus `Service`, `FAQPage`, `BreadcrumbList` and `BlogPosting`
- Every city page links to every service, and every service page links to every city
- `sitemap.xml`, `robots.txt`, canonical tags, Open Graph images
- `llms.txt`, a plain-text summary that AI search tools (ChatGPT, Perplexity, Google AI Overviews) can read
- Fast loading: no framework, self-hosted map library, lazy assets
- A mobile-first layout with a sticky Call / Free Quote bar
