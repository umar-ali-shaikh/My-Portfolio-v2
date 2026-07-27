// Page loader overlay + intro wave transition.
//
// Also opts the page out of the browser's automatic scroll restoration on
// reload/back-forward navigation, so the loader/wave intro always replays
// from the top. This replaces a `beforeunload` listener that did the same
// job by force-scrolling to (0,0) — any `beforeunload` listener disables the
// back/forward cache in Chromium and Firefox, so it's worth avoiding here.
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

export function initLoader() {
    window.scrollTo(0, 0);

    window.addEventListener('load', () => {
        const wave = document.querySelector('.wave-svg');
        const loader = document.getElementById('portfolioLoader');

        if (wave) wave.style.transform = 'translateY(-150vh)';
        setTimeout(() => loader?.classList.add('fade-out'), 2500);
    });
}
