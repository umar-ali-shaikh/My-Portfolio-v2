// Small shared helpers used by more than one module.

export function debounce(fn, wait = 200) {
    let timer;
    return function debounced(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), wait);
    };
}

export function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
