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
    const thumbItems = [...thumbs.children];

    let autoNextTimer;

    function resetAutoNext() {
        clearTimeout(autoNextTimer);
        if (prefersReducedMotion()) return;
        autoNextTimer = setTimeout(() => nextBtn.click(), CAROUSEL.AUTO_ADVANCE_MS);
    }

    // Reorders slider+thumbnail DOM in lockstep, with no animation — used to
    // silently cover the intermediate steps of a multi-slide thumbnail jump
    // so only the final step plays the transition.
    function silentRotate(direction) {
        const slides = [...slider.children];
        const thumbs_ = [...thumbs.children];
        if (direction === 'next') {
            slider.appendChild(slides[0]);
            thumbs.appendChild(thumbs_[0]);
        } else {
            slider.prepend(slides.at(-1));
            thumbs.prepend(thumbs_.at(-1));
        }
    }

    function rotateItems(direction) {
        carousel.classList.add(direction);
        silentRotate(direction);

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

    // Jump straight to whichever slide a given thumbnail represents, via the
    // shortest direction. The thumbnail strip is authored one position ahead
    // of .list (see the HTML comment above .thumbnail) so the currently
    // active slide's own thumbnail never sits at the front of the row —
    // thumbnail index 0 is always the *next* slide. So thumbnail index `i`
    // needs `i + 1` forward rotations to become active; wrapping all the way
    // around (i + 1 === total) means it already IS the active slide.
    // Only the last rotation is animated — the rest happen instantly so a
    // multi-slide jump still reads as one clean transition.
    function goToThumbnail(thumb) {
        if (nextBtn.style.pointerEvents === 'none') return;

        const index = [...thumbs.children].indexOf(thumb);
        if (index < 0) return;

        const total = thumbs.children.length;
        const forwardSteps = (index + 1) % total;
        if (forwardSteps === 0) return;

        const backwardSteps = total - forwardSteps;
        const direction = forwardSteps <= backwardSteps ? 'next' : 'prev';
        const steps = Math.min(forwardSteps, backwardSteps);

        nextBtn.style.pointerEvents = prevBtn.style.pointerEvents = 'none';
        for (let i = 0; i < steps - 1; i++) silentRotate(direction);
        rotateItems(direction);
    }

    thumbItems.forEach((thumb) => {
        thumb.addEventListener('click', () => goToThumbnail(thumb));
    });

    resetAutoNext();
}
