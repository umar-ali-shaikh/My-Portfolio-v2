// Pinned "stacking cards" scroll animation for the My Resume section.
//
// Rewritten to fix five real bugs in the original implementation:
//   1. It called `ScrollTrigger.getAll().forEach(st => st.kill())` on every
//      run — killing every ScrollTrigger on the page, not just this one.
//   2. It re-ran the full setup on every single `resize` event with a bare
//      `setTimeout(fn, 100)` — no debounce, and no protection against mobile
//      browsers firing `resize` when the URL bar hides/shows during scroll
//      (a well-documented ScrollTrigger + mobile pitfall).
//   3. It had no `prefers-reduced-motion` fallback.
//   4. Its pinned scroll distance was `contentHeight - window.innerHeight` —
//      unbounded as the viewport gets shorter, so a docked DevTools panel or
//      a small/mobile screen turned the section into a huge amount of empty
//      "dead" scroll. Now a fixed distance per card transition.
//   5. The wrapper's height was set to the *scattered* stacking height (every
//      card's height + gaps, e.g. 2650px for 4 cards) — the space needed for
//      cards' starting positions before they animate in. But every card
//      animates to y:0 (fully overlapping) by the end of the sequence, so
//      once the pin releases, only the top ~600px (one card) actually has
//      visible content — the rest was pure empty background sitting in
//      normal document flow. That empty band was the "huge blank space
//      after the resume section" bug. The wrapper only needs to be one
//      card's height once settled; cards animate in via `position:absolute`
//      offsets that don't require the parent to be tall enough to contain
//      their un-arrived positions.
//
// This version scopes the whole thing through gsap.matchMedia() (so cleanup
// is automatic via context revert), only kills its own ScrollTrigger
// instance, debounces genuine resizes, and lays the cards out statically
// (no pin/scrub) for users who've asked for reduced motion.

import { RESUME_CARD, RESIZE_DEBOUNCE_MS } from '../constants.js';
import { debounce } from '../utils.js';

function layoutStatic(cards, wrapper) {
    gsap.set(cards, { clearProps: 'all' });
    wrapper.style.removeProperty('height');
}

function layoutPinned(resumeSection, wrapper, cards) {
    const { HEIGHT: cardHeight, GAP: gap, EXTRA_GAP: extraGap, SCROLL_PER_TRANSITION, SCRUB_SECONDS } = RESUME_CARD;
    let scrollTrigger = null;

    function build() {
        scrollTrigger?.kill();
        gsap.set(cards, { clearProps: 'all' });

        // Fixed, viewport-independent — see the comment on SCROLL_PER_TRANSITION.
        const scrollDistance = (cards.length - 1) * SCROLL_PER_TRANSITION;

        // Only needs to fit one settled card (see fix #5 above) — not the
        // full scattered stacking height.
        wrapper.style.height = cardHeight + 'px';

        cards.forEach((card, i) => {
            gsap.set(card, {
                position: 'absolute',
                left: '50%',
                top: 0,
                transform: 'translateX(-50%)',
                y: i === 0 ? 0 : i * (cardHeight + gap) + (i === 1 ? extraGap : 0),
            });
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: resumeSection,
                start: 'top top',
                end: '+=' + scrollDistance,
                scrub: SCRUB_SECONDS,
                pin: true,
                pinType: 'transform',
                invalidateOnRefresh: true,
                anticipatePin: 1,
            },
        });

        cards.forEach((card, i) => {
            if (i === 0) return;
            tl.to(cards[i - 1], { scale: 0.9, borderRadius: '12px', duration: 0.6 });
            tl.to(card, { y: 0, duration: 0.8, ease: 'power1.out' }, '<0.2');
        });

        scrollTrigger = tl.scrollTrigger;
    }

    build();
    const debouncedRebuild = debounce(build, RESIZE_DEBOUNCE_MS);
    window.addEventListener('resize', debouncedRebuild);

    // Returned to gsap.matchMedia as this context's cleanup function.
    return () => {
        window.removeEventListener('resize', debouncedRebuild);
        scrollTrigger?.kill();
    };
}

export function initResumeScroll() {
    const resumeSection = document.querySelector('.my-resume-section .scroll-section');
    if (!resumeSection) return;

    gsap.registerPlugin(ScrollTrigger);

    const wrapper = resumeSection.querySelector('.list');
    const cards = [...wrapper.querySelectorAll('.item')];
    if (!cards.length) return;

    // Mobile Safari/Chrome fire `resize` when the URL bar hides/shows during
    // scroll; this tells ScrollTrigger's own internal refresh to ignore that
    // noise instead of recalculating the pin on every scroll tick.
    ScrollTrigger.config({ ignoreMobileResize: true });

    gsap.matchMedia().add(
        {
            animated: '(prefers-reduced-motion: no-preference)',
            reduced: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
            if (context.conditions.reduced) {
                layoutStatic(cards, wrapper);
                return; // nothing to clean up
            }
            return layoutPinned(resumeSection, wrapper, cards);
        }
    );
}
