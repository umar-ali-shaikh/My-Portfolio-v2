// Tracks which top-level sections are "active" — drives the mouse-dot /
// section-linked styling, and (for .footer-section specifically) a CSS
// rotateX(180deg) -> rotateX(0deg) reveal transition on approach.
//
// Previously this ran on every `scroll` event, calling getBoundingClientRect()
// for every section on every tick (a forced reflow on the scroll fast-path),
// with the class flipping on once ~150px of the section had already scrolled
// into view (`rect.top < winH - 150`).
//
// IntersectionObserver avoids the reflow cost, but its callback is
// asynchronous (fires on a later frame, not synchronously mid-scroll like the
// old listener). Reusing the same "~150px already visible" trigger point
// left too little lead time for the callback *and* the footer's 0.7s CSS
// transition to finish before the section was actually on screen — on a fast
// scroll the footer was still visibly upside-down when it came into view.
// A positive bottom rootMargin fixes this properly: it extends the
// observed area *below* the real viewport, so `.active` is added while the
// section is still off-screen, giving the transition real time to complete.
const ANTICIPATION_PX = 400;

export function initSectionObserver() {
    const sections = document.querySelectorAll('.sectionaddactive');
    if (!sections.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle('active', entry.isIntersecting);
            });
        },
        {
            rootMargin: `0px 0px ${ANTICIPATION_PX}px 0px`,
            threshold: 0,
        }
    );

    sections.forEach((section) => observer.observe(section));
}
