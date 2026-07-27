// Shared timing/sizing constants used across modules.

export const MARQUEE = {
    SKILLS_SPEED: 100,
    FOOTER_SPEED: 50,
};

export const CAROUSEL = {
    AUTO_ADVANCE_MS: 7000,
    ANIM_DURATION_MS: 3000,
};

// Must stay in sync with the fixed .my-resume-section .item box model in style.css
// (height: 600px !important, plus the 50px gap between stacked cards).
export const RESUME_CARD = {
    HEIGHT: 600,
    GAP: 50,
    EXTRA_GAP: 100,
    // Scroll distance dedicated to each card-to-card transition. Deliberately
    // NOT derived from window.innerHeight — the original formula
    // (contentHeight - viewportHeight) balloons as the viewport gets shorter
    // (DevTools docked open, or just a small/mobile screen), turning a short
    // window into a huge amount of "dead" scroll before the next card
    // arrives. A fixed per-transition distance keeps the scroll feel
    // consistent everywhere.
    SCROLL_PER_TRANSITION: 400,
    // GSAP scrub smoothing (seconds of "catch-up" easing between scroll
    // position and animation playback). Higher = smoother/more fluid,
    // lower = more tightly locked to the scrollbar (can feel twitchy).
    SCRUB_SECONDS: 1.5,
};

export const RESIZE_DEBOUNCE_MS = 200;
