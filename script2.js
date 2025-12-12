/* ---------------------------------------------
   CUSTOM MOUSE DOT + SECTION ACTIVE TRACKING
---------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".sectionaddactive");
    const portfolioDot = document.querySelector(".portfolio-dot");

    // Mouse dot
    document.addEventListener("mousemove", e => {
        if (!portfolioDot) return;
        portfolioDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    // Section active
    function checkSection() {
        const winH = window.innerHeight;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            section.classList.toggle("active", rect.top < winH - 150 && rect.bottom > 0);
        });
    }

    window.addEventListener("scroll", checkSection, { passive: true });
    checkSection();
});


/* ---------------------------------------------
   LOADER + WAVE TRANSITION
---------------------------------------------- */
window.addEventListener("load", () => {
    const wave = document.querySelector('.wave-svg');
    const loader = document.getElementById('portfolioLoader');

    if (wave) wave.style.transform = 'translateY(-150vh)';
    setTimeout(() => loader?.classList.add('fade-out'), 2500);
});


/* ---------------------------------------------
   UNIVERSAL MARQUEE (Skills + Footer)
---------------------------------------------- */
function createMarquee(trackSelector, itemSelector, speed = 100, reverse = false) {
    const track = document.querySelector(trackSelector);
    if (!track) return;

    const items = gsap.utils.toArray(itemSelector);
    let totalWidth = items.reduce((sum, item) => sum + item.offsetWidth + 50, 0);

    const fromX = reverse ? -(totalWidth / 2) : 0;
    const toX = reverse ? 0 : -(totalWidth / 2);

    gsap.fromTo(track, { x: fromX }, {
        x: toX,
        duration: speed,
        ease: "linear",
        repeat: -1
    });
}

// MAIN SKILLS
createMarquee(".animated-skills-hlp .animated-skills", ".animated-skills-wrapper", 100);

// FOOTER SLIDER 1
createMarquee(".animated-contactslide .animated-skills-hlp-cross1 .animated-skills",
    ".animated-skills-hlp-cross1 .animated-skills-wrapper",
    50);

// FOOTER SLIDER 2 (Reverse)
createMarquee(".animated-contactslide .animated-skills-hlp-cross2 .animated-skills",
    ".animated-skills-hlp-cross2 .animated-skills-wrapper",
    50, true);




/* ---------------------------------------------
CUSTOM CAROUSEL (Optimized)
---------------------------------------------- */
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const carousel = document.querySelector('.carousel');

if (carousel && nextBtn && prevBtn) {

    const slider = carousel.querySelector('.list');
    const thumbs = carousel.querySelector('.thumbnail');

    let autoNextTimer;
    const TIME_AUTO = 7000;
    const TIME_ANIM = 3000;

    function resetAutoNext() {
        clearTimeout(autoNextTimer);
        autoNextTimer = setTimeout(() => nextBtn.click(), TIME_AUTO);
    }

    function rotateItems(type) {
        const slides = [...slider.children];
        const thumbItems = [...thumbs.children];

        carousel.classList.add(type);

        if (type === 'next') {
            slider.appendChild(slides[0]);
            thumbs.appendChild(thumbItems[0]);
        } else {
            slider.prepend(slides.at(-1));
            thumbs.prepend(thumbItems.at(-1));
        }

        setTimeout(() => {
            carousel.classList.remove(type);
            nextBtn.style.pointerEvents =
                prevBtn.style.pointerEvents = "auto";
        }, TIME_ANIM);

        resetAutoNext();
    }

    nextBtn.onclick = () => {
        nextBtn.style.pointerEvents = prevBtn.style.pointerEvents = "none";
        rotateItems("next");
    };

    prevBtn.onclick = () => {
        nextBtn.style.pointerEvents = prevBtn.style.pointerEvents = "none";
        rotateItems("prev");
    };

    resetAutoNext();
}


/* ---------------------------------------------
   SCROLL TOP ON LOAD + BACK TO TOP
---------------------------------------------- */
window.addEventListener("beforeunload", () => scrollTo(0, 0));

document.querySelector('.footer-top-arrow .footer-top-arrow-hlp')
    ?.addEventListener('click', () => scrollTo({ top: 0, behavior: "smooth" }));


/* ---------------------------------------------
RESUME SECTION SCROLL ANIMATION (Unified)
---------------------------------------------- */
/* ---------------------------------------------
   FIXED MOBILE + DESKTOP RESUME SCROLL ENGINE
---------------------------------------------- */
function initResume() {

    const resumeSection = document.querySelector(".my-resume-section .scroll-section");
    if (!resumeSection) return;

    const wrapper = resumeSection.querySelector(".list");
    const cards = [...wrapper.querySelectorAll(".item")];

    const cardHeight = 600;
    const gap = 50;
    const extraGap = 100;

    const safeHeight = window.innerHeight; // FIXED

    ScrollTrigger.getAll().forEach(st => st.kill());
    gsap.set(cards, { clearProps: "all" });

    // FIX: wrapper ko height set karo
    wrapper.style.height =
        (cards.length * cardHeight) + 
        ((cards.length - 1) * gap) + 
        extraGap + "px";

    // Set initial card positions
    cards.forEach((card, i) => {
        gsap.set(card, {
            position: "absolute",
            left: "50%",
            top: 0,
            transform: "translateX(-50%)",
            y: i === 0 ? 0 : i * (cardHeight + gap) + (i === 1 ? extraGap : 0)
        });
    });

    const endValue =
        (cards.length * cardHeight) + 
        ((cards.length - 1) * gap) + 
        extraGap - safeHeight;

    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: resumeSection,
            start: "top top",
            end: "+=" + endValue,
            scrub: 1,
            pin: true,
            pinType: "transform",  // SUPER IMPORTANT FIX
            invalidateOnRefresh: true,
            anticipatePin: 1
        }
    });

    // Animate cards
    cards.forEach((card, i) => {
        if (i === 0) return;

        tl.to(cards[i - 1], {
            scale: 0.9,
            borderRadius: "12px",
            duration: 0.6
        });

        tl.to(card, {
            y: 0,
            duration: 0.8,
            ease: "power1.out"
        }, "<0.2");
    });

    ScrollTrigger.refresh();
}

initResume();
window.addEventListener("resize", () => setTimeout(initResume, 100));
