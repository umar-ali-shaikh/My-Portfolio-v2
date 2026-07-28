# Umar Ali Shaikh — Portfolio

Personal portfolio for Umar Ali Shaikh, a Full Stack MERN developer expanding into AI engineering
and automation. Built as a static site — no framework, no build step.

Live: https://umaralishaikhv2.vercel.app/

## Stack

- HTML5, CSS3, vanilla JavaScript (ES modules)
- [GSAP](https://gsap.com/) + ScrollTrigger for scroll-driven animation
- Bootstrap 5 (layout utilities/grid only) and Font Awesome (icons), both via CDN
- No bundler, no package manager — everything runs directly in the browser

## Structure

```
index.html          Single-page site: hero, about, projects, resume, freelance, contact, footer
style.css            All styles
js/
  main.js            Entry point — wires up the modules below on DOMContentLoaded
  constants.js        Shared timing/sizing constants (marquee speed, carousel timing, resume card size)
  utils.js            Small shared helpers (debounce, prefers-reduced-motion check)
  modules/
    loader.js          Intro loading screen
    cursor.js           Custom cursor follower
    marquee.js          Infinite-scrolling ticker strips (skills, footer CTA)
    carousel.js         Featured Projects slider (list + clickable thumbnail strip)
    sectionObserver.js  IntersectionObserver-driven section active-states
    resumeScroll.js     GSAP ScrollTrigger pinned "stacking cards" resume section
image/               Project screenshots, logos, icons
assets/               Downloadable résumé (PDF)
robots.txt, sitemap.xml
```

## Running locally

Because `js/main.js` loads as an ES module (`<script type="module">`), open the site through a
local static server rather than a `file://` path:

```bash
npx serve .
# or
python -m http.server 5500
```

Then visit the printed localhost URL.

## Notable implementation details

- **Resume section** (`.my-resume-section`) is a GSAP ScrollTrigger–pinned stack of fixed-height
  cards (Info, Experience, Education, Skills). Reduced-motion users get the cards laid out
  statically instead of animated — see `js/modules/resumeScroll.js`.
- **Skills card** is grouped by category (Frontend, Backend, AI Engineering & Automation, Tools)
  with a self-contained inline SVG icon sprite, and scrolls internally if content exceeds the
  card's fixed height.
- **Featured Projects carousel** (`js/modules/carousel.js`) keeps a slide list and a thumbnail
  strip in sync. The thumbnail strip is intentionally offset by one position relative to the
  slides, so the first visible thumbnail is always the *next* project rather than a duplicate of
  the one currently showing. Clicking any thumbnail jumps straight to that slide via the shortest
  rotation direction.
