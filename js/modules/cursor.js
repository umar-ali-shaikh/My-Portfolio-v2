// Custom mouse-follower dot. Gated behind a pointer/hover check so it never
// runs (or leaves a stray dot sitting on screen) on touch devices, which have
// no meaningful "mousemove" concept.

export function initCursor() {
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasFinePointer) return;

    const dot = document.querySelector('.portfolio-dot');
    if (!dot) return;

    document.addEventListener('mousemove', (event) => {
        dot.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    });
}
