# SB Construction South West (shaunbrake.com): project guide

Website for SB Construction South West (Shaun Brake), building, roofing, extensions, carpentry, kitchens, bathrooms and groundworks, based in Evercreech, Somerset. Live at **https://shaunbrake.com**.

The site is plain static HTML and CSS. There is no build step: edit the files in `site/` directly.

## History
- Until Nov 2026 it was a WordPress site (Neve block theme, Contact Form 7 / WPForms, Complianz cookie banner) on Fasthosts WordPress hosting.
- On 27 Nov 2026 it was copied (`D:\storage\Claude\Move Domains\tools\mirror_site.py` plus the WordPress REST API) and rebuilt as static pages. The page wording, headings, photos and contact details are the WordPress ones, unchanged. Only the layout is new.
- sbconstructionsw.com (same business) 301-redirects to https://shaunbrake.com, keeping the path, so old sbconstructionsw.com paths land here.

## Folder layout
- `site/`: everything the browser gets.
  - Pages: `/` (home), `/bathrooms/`, `/carpentry/`, `/extensions/`, `/groundworks/`, `/kitchens/`, `/roofing/`, `/portfolio/`, `/contact-us/`, the area pages `/evercreech/`, `/shepton-mallet-builder/`, `/glastonbury/`, `/castle-cary/`, plus `/terms-and-conditions/`, `/privacy/` (new), `/thank-you/` (after the form, noindex), `404.html`.
  - `img/`: all photos (WordPress originals, shrunk to max 1400px), `logo-sb.png` (the blue SB logo).
  - `style.css`, `app.js` (mobile menu only).
  - `_redirects`: old WordPress and common addresses (e.g. `/contact`, `/cookie-policy-uk/`, `/wp-content/uploads/...` images) to their new homes.
  - `_headers`: Cloudflare security headers.
  - `sitemap.xml` and `robots.txt`: written by `python -I "D:\storage\Claude\Move Domains\tools\make_sitemap.py" site https://shaunbrake.com`. Re-run after adding a page.
- `.claude/launch.json`: "site" preview on port 8083. Or run `python -m http.server 8083 --directory site`.

Every page repeats the same header (logo, menu with a "What we do" drop-down, phone button) and footer (call-to-action band, contact details, services, areas). If you change one, change them all (a search and replace across `site/**/index.html`).

## Working style
- Plain English, short sentences, UK spelling.
- Don't change the business's wording, prices or contact details without asking Rich.
- Keep it simple: static HTML, no frameworks, no third-party scripts.

## Contact / quote form
- Web3Forms account `shaunbrake@richietaylor.net` (Free plan), form "SB Construction contact form", access key in the HTML (public, not a secret). Enquiries go to that address, then on to Rich (Rich chose this on 27 Nov 2026; Shaun doesn't receive them directly).
- On `/contact-us/` and at the bottom of the home page. Fields: name, contact number, email, details. Posts straight to **Web3Forms** (no script); after sending, visitors go to `/thank-you/`. A hidden `botcheck` box catches spam bots. A hidden `page` field says which page it was sent from.
- The privacy notice names Web3Forms and Cloudflare Web Analytics. Change it if either changes.

## Known issues (from the WordPress site, not changed)
- Typos in the business's own wording, e.g. "UNDER OUT BELTS", "WE SPECALIZE", "Groundsworks", "real stone times". Ask Rich before fixing.
- The portfolio photos all had one of two bathroom alt texts in WordPress; they now have the neutral "Finished project by SB Construction South West".
- Terms and conditions say "This website is owned and operated by Richard Taylor" (Complianz template). Its "download as PDF" section was removed (the PDF was a WordPress plugin).
- The area pages use some photos of the towns (Glastonbury Abbey, Kilver Court etc.) that came from elsewhere. Check their licences if that matters.
