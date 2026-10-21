# Junseo Ha

A bilingual personal portfolio with a word-by-word, LLM-style entrance. Built with semantic HTML, CSS, and optional vanilla JavaScript; no frameworks, dependencies, or build step. English lives at `/`, Korean at `/ko/`, with a language switch in the header.

## Preview

Serve the repository root with any static HTTP server, for example:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. Root-relative asset URLs match the custom-domain hosting configuration.

## Edit

Update content and structured data in both `index.html` and `ko/index.html`, styles in `styles.css`, and the entrance interaction in `stream.js`. Keep `portfolio.txt` and `ko/portfolio.txt` in sync with their respective pages. Update the summary in `llms.txt` when projects, roles, education, or contact details change.

Both language versions contain the complete portfolio in the initial HTML, including translated metadata, navigation, image controls, dates, and accessible labels. Native language links work without JavaScript; the optional script preserves the current section when switching. Keep matching section IDs and reciprocal `hreflang` links when editing, and localize any new interactive text in `stream.js`.

The layout adapts to mobile and desktop and includes keyboard focus styles, section navigation, a skip link, and a print stylesheet. The animation completes in under five seconds, reserves text layout, and supports showing all text or replaying it. Scrolling keeps the animation running. Keyboard focus, navigation, and browser find reveal everything immediately. Reduced-motion visitors, direct section links, and visitors without JavaScript see the full content without animation. There is no LLM API call or generated résumé content.

The introduction’s “Generate an image” control sits at the top right, with “Replay text” in the outer introduction container beside the fish illustration. The replay control stays available when the portrait is open and restores the text before replaying it. It replaces the introduction with the supplied portrait at `assets/junseo-ha.jpg`, using a short crossfade, loading shimmer, and blur-to-clear reveal. “Hide image” restores the introduction. Contact links remain available in a floating right-side panel on desktop (1100px and wider) that gently trails scrolling and settles back to center, respecting reduced-motion preferences, or an inline panel below the introduction on smaller screens. A shared grid preserves the introduction’s space; its hidden links leave keyboard navigation. Native HTML disclosure and CSS support the same swap without JavaScript. Reduced-motion visitors skip the effects, and printing always includes the introduction. No image-generation API is called.

## Crawlers and automated readers

All substantive portfolio content and links are in the initial HTML response. Reading requires no JavaScript, scrolling, chatbot prompts, account, or clicks. The animation only changes visual opacity; text stays in the DOM and accessibility tree throughout.

- `portfolio.txt` and `ko/portfolio.txt`: complete English and Korean plain-text portfolios, linked from their pages and alternate metadata.
- `robots.txt`: allows crawling and points to the sitemap.
- `sitemap.xml`: identifies both canonical language pages and their language alternatives.
- `llms.txt`: optional discovery guide for automated readers; support varies by crawler.
- `index.html` and `ko/index.html`: canonical URLs, language alternatives, localized descriptions, Open Graph metadata, and Schema.org `ProfilePage` / `Person` JSON-LD.

The canonical origin is `https://junununseo.com/`, matching `CNAME`. Update those URLs together if the domain changes. Crawlers still decide whether and when to index the site; serving these files does not guarantee indexing.

Portfolio content is based on the updated English résumé, including ROK Navy experience and Anchorive (March–June 2026). The original résumé is not included.

## Hosting

The live site is [junununseo.com](https://junununseo.com/). GitHub Pages already builds and deploys the repository root automatically when `main` changes. `CNAME` retains the custom domain; no separate hosting service or build workflow is needed.

Completed portfolio updates should be checked, committed, and published to `main` by default, unless local-only work is explicitly requested. Include the latest remote changes before publishing and use a normal fast-forward push. Wait for the matching **pages build and deployment** run to succeed, then verify the live site. Editing local files alone does not update the public URL. GitHub Pages deployment and caching introduce a short delay after a push.

Before committing, run `python3 scripts/version-assets.py` to refresh content-based asset URL versions in both language pages. Updated CSS, JavaScript, and the favicon then get fresh URLs instead of reusing an earlier cached version. `.nojekyll` keeps publication static, with no Jekyll processing.
