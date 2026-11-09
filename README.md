# Elite Epoxy Solutions — website draft

Preview branch: `build/show-me-style-site`. This is a static, multi-page Netlify-compatible site modeled on the navigation hierarchy of Show Me Epoxy.

## Included
- About, Services (5 initial reference categories), Areas (6 provisional inquiry markets), Floor Types (4 categories), Resources (Gallery, Colors, Calculator, FAQs, Blog), Contact.
- 104 original Elite project photos plus `logo-white.png`; no Show Me Epoxy photos or visualizer.
- Responsive mobile and desktop layouts using the Elite logo blue/gray styling.
- Netlify Forms-compatible contact and calculator inquiries.
- Preliminary price calculator with **unapproved placeholder prices**.

## PRE-LAUNCH CHECKLIST (IMPORTANT)
1. Confirm exact services from the owner's supplied service screenshot and remove any unmatched reference services.
2. Confirm company contact telephone, actual service radius, public business address policy, business email, warranties and project claims.
3. Replace illustrative calculator rates in `assets/site.js` (`rates`, `minimum`) with approved rates and validate results.
4. Verify site forms actually submit to intended lead recipient. Configure Netlify email/form notifications or CRM integration.
5. Confirm hosting and actual domain, then add canonical URLs, valid sitemap.xml and Analytics/Search Console.
6. Replace `noindex,nofollow` across HTML and `robots.txt` Disallow rule **only after approval**, otherwise search engines should not index the preview.
7. Review copy with business owner including specialty offerings such as countertops.
8. Verify the Google Business Profile link, location and phone number.
9. Run link, accessibility, mobile, performance and form integration tests before going live.

## Deployment
Point Netlify to the repository root, no build command, publish directory `.`. The files are static HTML/CSS/JS.

## Content notes
Photos are intentionally used as references without claiming they belong to a specific service/city. The color swatches are conceptual inspiration, not verified stocked blends.
