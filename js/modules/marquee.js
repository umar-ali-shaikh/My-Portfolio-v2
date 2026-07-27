// Infinite-scrolling marquee (skills ticker + footer "Get In Touch" strips).
//
// Previously this measured content width and started the tween immediately
// at script-parse time — before images/fonts had necessarily finished
// loading, which could leave the loop's midpoint measured against the wrong
// content width (a visible jump once things settled). Building on `load`
// and rebuilding on resize keeps the loop point honest.

import { debounce, prefersReducedMotion } from '../utils.js';
import { RESIZE_DEBOUNCE_MS } from '../constants.js';

function measureAndBuild(track, itemSelector, speed, reverse) {
    const items = gsap.utils.toArray(itemSelector);
    if (!items.length) return null;

    const totalWidth = items.reduce((sum, item) => sum + item.offsetWidth + 50, 0);
    const fromX = reverse ? -(totalWidth / 2) : 0;
    const toX = reverse ? 0 : -(totalWidth / 2);

    gsap.set(track, { x: fromX });

    return gsap.to(track, {
        x: toX,
        duration: speed,
        ease: 'linear',
        repeat: -1,
    });
}

function createMarquee({ trackSelector, itemSelector, speed, reverse = false }) {
    const track = document.querySelector(trackSelector);
    if (!track) return { rebuild() {} };

    let tween = null;

    function rebuild() {
        tween?.kill();
        gsap.set(track, { clearProps: 'x' });

        if (prefersReducedMotion()) return;
        tween = measureAndBuild(track, itemSelector, speed, reverse);
    }

    return { rebuild };
}

export function initMarquees() {
    const marquees = [
        {
            trackSelector: '.animated-skills-hlp .animated-skills',
            itemSelector: '.animated-skills-wrapper',
            speed: 100,
        },
        {
            trackSelector: '.animated-contactslide .animated-skills-hlp-cross1 .animated-skills',
            itemSelector: '.animated-skills-hlp-cross1 .animated-skills-wrapper',
            speed: 50,
        },
        {
            trackSelector: '.animated-contactslide .animated-skills-hlp-cross2 .animated-skills',
            itemSelector: '.animated-skills-hlp-cross2 .animated-skills-wrapper',
            speed: 50,
            reverse: true,
        },
    ].map(createMarquee);

    const rebuildAll = () => marquees.forEach((m) => m.rebuild());

    window.addEventListener('load', rebuildAll);
    window.addEventListener('resize', debounce(rebuildAll, RESIZE_DEBOUNCE_MS));
}
