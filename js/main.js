// Entry point — loaded via <script type="module" src="js/main.js">.
// Each concern lives in its own module under js/modules/; this file just
// wires them up once the DOM is ready. GSAP + ScrollTrigger are loaded as
// classic blocking <script> tags before this module (see index.html), so
// they're guaranteed to be on `window` by the time these run.

import { initLoader } from './modules/loader.js';
import { initCursor } from './modules/cursor.js';
import { initMarquees } from './modules/marquee.js';
import { initCarousel } from './modules/carousel.js';
import { initSectionObserver } from './modules/sectionObserver.js';
import { initResumeScroll } from './modules/resumeScroll.js';

function init() {
    initLoader();
    initCursor();
    initMarquees();
    initCarousel();
    initSectionObserver();
    initResumeScroll();

    document
        .querySelector('.footer-top-arrow .footer-top-arrow-hlp')
        ?.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
