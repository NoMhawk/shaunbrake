#!/usr/bin/env node
// Search-result and link-preview checks for the hand-edited pages in site/.
// Run before every push: node scripts/check.js
// Exits with code 1 if anything Google or link previews need is missing.
// Adapted from the "Search-result appearance" and "Icon files" checks in soakaway/scripts/check.js.
const fs = require('fs');
const path = require('path');

const URL = 'https://shaunbrake.com';
const SITE = path.join(__dirname, '..', 'site');
const errors = [];
const files = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : files.push(p); } })(SITE);
const htmlFiles = files.filter(f => f.endsWith('.html'));
const urlOf = (f) => { const rel = '/' + path.relative(SITE, f).replace(/\\/g, '/'); return rel.endsWith('/index.html') ? rel.slice(0, -10) : rel; };
const exists = (u) => {
  const clean = u.split('#')[0].split('?')[0];
  const p = path.join(SITE, clean);
  return (fs.existsSync(p) && fs.statSync(p).isFile()) || fs.existsSync(path.join(p, 'index.html'));
};

// Search-result appearance: icon, share image and site name tags on every page.
for (const f of htmlFiles) {
  const u = urlOf(f);
  const html = fs.readFileSync(f, 'utf8');
  const noindex = u === '/404.html' || /<meta name="robots" content="[^"]*noindex/.test(html);
  if (!/<link rel="icon" href="\/favicon\.ico" sizes="48x48">/.test(html)) errors.push(`${u}: no /favicon.ico icon link (Google shows this in results)`);
  if (!/<link rel="apple-touch-icon" href="\/[^"]+\.png">/.test(html)) errors.push(`${u}: no apple-touch-icon`);
  if (!/<link rel="manifest" href="\/site\.webmanifest">/.test(html)) errors.push(`${u}: no web manifest link`);
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => {
    try { return JSON.parse(m[1]); } catch (e) { errors.push(`${u}: bad JSON-LD (${e.message})`); return {}; }
  });
  if (noindex) continue; // 404 and thank-you get the icons only
  for (const k of ['og:title', 'og:description', 'og:image', 'og:url', 'og:site_name', 'og:type', 'og:locale']) if (!html.includes(`property="${k}"`)) errors.push(`${u}: no ${k}`);
  for (const k of ['twitter:card', 'twitter:image']) if (!html.includes(`name="${k}"`)) errors.push(`${u}: no ${k}`);
  const ogImg = (html.match(/property="og:image" content="([^"]+)"/) || [])[1];
  if (ogImg && (!ogImg.startsWith(URL + '/') || !exists(ogImg.slice(URL.length)))) errors.push(`${u}: og:image ${ogImg} is not a file on this site`);
  if (u === '/') {
    const logo = ld.map(b => b.logo).find(Boolean);
    const logoUrl = logo && (logo.url || logo);
    if (!logoUrl) errors.push(`/: business schema has no logo`);
    else if (!/\.(png|jpe?g|webp)$/.test(logoUrl) || !exists(logoUrl.replace(URL, ''))) errors.push(`/: schema logo ${logoUrl} must be a PNG/JPG/WebP file on this site`);
    if (!ld.some(b => b['@type'] === 'WebSite' && b.name)) errors.push(`/: no WebSite schema with a name (sets the site name in Google results)`);
  }
}

// Icon files: sizes Google and browsers need.
const pngSize = (f) => { const b = fs.readFileSync(f); return b.readUInt32BE(0) === 0x89504e47 ? [b.readUInt32BE(16), b.readUInt32BE(20)] : null; };
const needPng = (rel, check, why) => {
  const f = path.join(SITE, rel);
  if (!fs.existsSync(f)) return errors.push(`${rel}: missing (${why})`);
  const sz = pngSize(f);
  if (!sz) return errors.push(`${rel}: not a PNG`);
  if (!check(sz[0], sz[1])) errors.push(`${rel}: ${sz[0]}x${sz[1]} is the wrong size (${why})`);
};
const ico = path.join(SITE, 'favicon.ico');
if (!fs.existsSync(ico)) errors.push('/favicon.ico: missing (Google and browsers ask for it)');
else {
  const b = fs.readFileSync(ico), n = b.readUInt16LE(4), sizes = [];
  for (let i = 0; i < n; i++) sizes.push(b[6 + i * 16] || 256);
  if (!sizes.some(s => s % 48 === 0)) errors.push(`/favicon.ico: has ${sizes.join(', ')} px; Google needs a multiple of 48 px`);
}
needPng('apple-touch-icon.png', (w, h) => w === 180 && h === 180, 'should be 180x180');
needPng('icon-192.png', (w, h) => w === 192 && h === 192, 'manifest icon 192x192');
needPng('icon-512.png', (w, h) => w === 512 && h === 512, 'manifest icon 512x512');
needPng('logo-512.png', (w, h) => w === h && w >= 112, 'Google logo: square, at least 112 px');
needPng('og-image.png', (w, h) => w >= 1200 && h >= 630, 'share image: at least 1200x630');
try { const mf = JSON.parse(fs.readFileSync(path.join(SITE, 'site.webmanifest'), 'utf8')); for (const i of mf.icons || []) if (!exists(i.src)) errors.push(`site.webmanifest: icon ${i.src} missing`); }
catch (e) { errors.push(`site.webmanifest: missing or bad JSON (${e.message})`); }
const robots = fs.existsSync(path.join(SITE, 'robots.txt')) ? fs.readFileSync(path.join(SITE, 'robots.txt'), 'utf8') : '';
for (const p of ['/favicon.ico', '/logo-512.png', '/og-image.png']) if (new RegExp(`^Disallow:\\s*${p.replace('.', '\\.')}`, 'mi').test(robots)) errors.push(`robots.txt blocks ${p}`);

console.log(`Checked ${htmlFiles.length} HTML files for search-result appearance.`);
errors.forEach(e => console.log('ERROR ' + e));
console.log(`${errors.length} errors.`);
process.exit(errors.length ? 1 : 0);
