// Hand-rolled "list + thumbnail" project carousel (Featured Projects).
// Behavior is unchanged from the original implementation — only reorganized
// into a module with named constants, and autoplay is skipped for users who
// have asked for reduced motion (manual prev/next still work either way).

import { CAROUSEL } from '../constants.js';
import { prefersReducedMotion } from '../utils.js';

export function initCarousel() {
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');
    const carousel = document.querySelector('.carousel');

    if (!carousel || !nextBtn || !prevBtn) return;

    const slider = carousel.querySelector('.list');
    const thumbs = carousel.querySelector('.thumbnail');

    let autoNextTimer;

    function resetAutoNext() {
        clearTimeout(autoNextTimer);
        if (prefersReducedMotion()) return;
        autoNextTimer = setTimeout(() => nextBtn.click(), CAROUSEL.AUTO_ADVANCE_MS);
    }

    function rotateItems(direction) {
        const slides = [...slider.children];
        const thumbItems = [...thumbs.children];

        carousel.classList.add(direction);

        if (direction === 'next') {
            slider.appendChild(slides[0]);
            thumbs.appendChild(thumbItems[0]);
        } else {
            slider.prepend(slides.at(-1));
            thumbs.prepend(thumbItems.at(-1));
        }

        setTimeout(() => {
            carousel.classList.remove(direction);
            nextBtn.style.pointerEvents = prevBtn.style.pointerEvents = 'auto';
        }, CAROUSEL.ANIM_DURATION_MS);

        resetAutoNext();
    }

    nextBtn.addEventListener('click', () => {
        nextBtn.style.pointerEvents = prevBtn.style.pointerEvents = 'none';
        rotateItems('next');
    });

    prevBtn.addEventListener('click', () => {
        nextBtn.style.pointerEvents = prevBtn.style.pointerEvents = 'none';
        rotateItems('prev');
    });

    resetAutoNext();
}
