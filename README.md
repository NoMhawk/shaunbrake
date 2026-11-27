# SB Construction South West

Website for SB Construction South West (Shaun Brake), a building, roofing and extensions business in Evercreech, Somerset: https://shaunbrake.com

Plain HTML and CSS in `site/`, with no build step. Cloudflare Pages serves `site/` from the `main` branch, so every push goes live.

```
python -m http.server 8083 --directory site   # preview at http://localhost:8083
```

Rebuilt on 27 Nov 2026 from the old WordPress site (Fasthosts hosting). Project rules, hosting and email details: [CLAUDE.md](CLAUDE.md).
