/* =========================
   HELPERS
========================= */
function runIfSectionExists(selector, callback) {
    const section = document.querySelector(selector);
    if (!section) return;
    callback(section);
}

function isMobile() {
    return window.matchMedia("(max-width: 575px)").matches;
}

/* =========================
   GSAP MOBILE SAFE CONFIG
========================= */
if (window.gsap && window.ScrollTrigger && isMobile()) {
    gsap.config({ force3D: false });
    ScrollTrigger.config({ ignoreMobileResize: true });
}


/* =========================
   CUSTOM MOUSE DOT 
========================= */
document.addEventListener("DOMContentLoaded", () => {

    const dot = document.querySelector(".portfolio-dot");
    if (!dot) return;

    const OFFSET = -2;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    dot.style.position = "fixed";
    dot.style.pointerEvents = "none";

    /* ===============================
       MOUSE MOVE
    =============================== */
    document.addEventListener("mousemove", (e) => {
        targetX = e.clientX - OFFSET;
        targetY = e.clientY;
    });

    function animateDot() {
        currentX += (targetX - currentX) * 0.15;
        currentY += (targetY - currentY) * 0.15;

        dot.style.left = currentX + "px";
        dot.style.top = currentY + "px";

        requestAnimationFrame(animateDot);
    }
    animateDot();

    /* ===============================
       HOVER ON a, button, .portfolio-hover
    =============================== */
    document.addEventListener("mouseenter", (e) => {
        if (e.target.closest("a, button, .portfolio-hover")) {
            dot.classList.add("portfolio-dot-active");
        }
    }, true);

    document.addEventListener("mouseleave", (e) => {
        if (e.target.closest("a, button, .portfolio-hover")) {
            dot.classList.remove("portfolio-dot-active");
        }
    }, true);

});


// Section active
const sections = document.querySelectorAll(".sectionaddactive");

function checkSection() {
    const triggerPoint = window.innerHeight - 150;

    sections.forEach(section => {
        const { top, bottom } = section.getBoundingClientRect();
        section.classList.toggle("active", top < triggerPoint && bottom > 0);
    });
}

// Run on page load
checkSection();

// Run on scroll (optimized)
let ticking = false;
window.addEventListener("scroll", () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            checkSection();
            ticking = false;
        });
        ticking = true;
    }
});




/* =========================
   LOADER + WAVE
========================= */
window.addEventListener("load", () => {
    const wave = document.querySelector(".wave-svg");
    const loader = document.getElementById("portfolioLoader");

    if (wave) wave.style.transform = "translateY(-150vh)";
    setTimeout(() => loader?.classList.add("fade-out"), 2500);
});

/* =========================
   MARQUEE (SECTION BASED)
========================= */
function createControlledMarquee({
    sectionSelector,
    trackSelector,
    itemSelector,
    speed = 100,
    reverse = false
}) {
    const section = document.querySelector(sectionSelector);
    if (!section) return;

    const track = section.querySelector(trackSelector);
    if (!track) return;

    let tween = null;

    function startMarquee() {
        if (tween) return; // already running

        const items = gsap.utils.toArray(itemSelector, section);
        if (!items.length) return;

        const totalWidth = items.reduce(
            (sum, item) => sum + item.getBoundingClientRect().width + 50,
            0
        );

        tween = gsap.fromTo(
            track,
            { x: reverse ? -(totalWidth / 2) : 0 },
            {
                x: reverse ? 0 : -(totalWidth / 2),
                duration: speed,
                ease: "linear",
                repeat: -1
            }
        );
    }

    function stopMarquee() {
        if (!tween) return;

        tween.kill();
        tween = null;

        // 🔥 reset position
        gsap.set(track, { x: 0 });
    }

    // 👀 Observe section visibility
    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                startMarquee();
            } else {
                stopMarquee();
            }
        },
        {
            threshold: 0.3 // 30% visible
        }
    );

    observer.observe(section);
}


// Skills
createControlledMarquee({
    sectionSelector: ".animated-skills-hlp",
    trackSelector: ".animated-skills",
    itemSelector: ".animated-skills-wrapper",
    speed: 100
});

// Footer marquees
createControlledMarquee({
    sectionSelector: ".animated-skills-hlp-cross1",
    trackSelector: ".animated-skills",
    itemSelector: ".animated-skills-wrapper",
    speed: 50
});

createControlledMarquee({
    sectionSelector: ".animated-skills-hlp-cross2",
    trackSelector: ".animated-skills",
    itemSelector: ".animated-skills-wrapper",
    speed: 50,
    reverse: true
});


/* =========================
   CAROUSEL (RESPONSIVE + CLEANUP)
========================= */
runIfSectionExists(".carousel", () => {

    let cleanup;

    function init() {
        cleanup?.();
        cleanup = isMobile()
            ? initMobileCarousel()
            : initDesktopCarousel();
    }

    init();

    window.addEventListener("resize", () => {
        clearTimeout(window.__carouselResize);
        window.__carouselResize = setTimeout(init, 300);
    });
});

function initDesktopCarousel() {

    const carousel = document.querySelector(".carousel");
    const nextBtn = document.getElementById("next");
    const prevBtn = document.getElementById("prev");
    if (!carousel || !nextBtn || !prevBtn) return () => { };

    const slider = carousel.querySelector(".list");
    const thumbs = carousel.querySelector(".thumbnail");

    let autoNextTimer;
    const TIME_AUTO = 7000;
    const TIME_ANIM = window.innerWidth < 768 ? 1200 : 3000;

    function resetAutoNext() {
        clearTimeout(autoNextTimer);
        autoNextTimer = setTimeout(() => nextBtn.click(), TIME_AUTO);
    }

    function rotate(type) {
        const slides = [...slider.children];
        const thumbsItems = [...thumbs.children];

        carousel.classList.add(type);

        if (type === "next") {
            slider.append(slides[0]);
            thumbs.append(thumbsItems[0]);
        } else {
            slider.prepend(slides.at(-1));
            thumbs.prepend(thumbsItems.at(-1));
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
        rotate("next");
    };

    prevBtn.onclick = () => {
        nextBtn.style.pointerEvents = prevBtn.style.pointerEvents = "none";
        rotate("prev");
    };

    resetAutoNext();

    return () => {
        clearTimeout(autoNextTimer);
        nextBtn.onclick = null;
        prevBtn.onclick = null;
    };
}

function initMobileCarousel() {

    const carousel = document.querySelector(".carousel");
    if (!carousel) return () => { };

    const items = [...carousel.querySelectorAll(".list .item")];
    const next = document.getElementById("next");
    const prev = document.getElementById("prev");

    let index = 0;
    let animating = false;

    gsap.set(items, { opacity: 0, scale: 0.9 });
    gsap.set(items[0], { opacity: 1, scale: 1 });

    function show(i, dir = 1) {
        if (animating) return;
        animating = true;

        gsap.timeline({
            onComplete: () => {
                index = i;
                animating = false;
            }
        })
            .to(items[index], {
                x: -50 * dir,
                opacity: 0,
                scale: 0.95,
                duration: 0.4
            })
            .fromTo(
                items[i],
                { x: 50 * dir, opacity: 0, scale: 0.95 },
                { x: 0, opacity: 1, scale: 1, duration: 0.4 },
                "-=0.2"
            );
    }

    const nextH = () => show((index + 1) % items.length, 1);
    const prevH = () => show((index - 1 + items.length) % items.length, -1);

    next?.addEventListener("click", nextH);
    prev?.addEventListener("click", prevH);

    return () => {
        next?.removeEventListener("click", nextH);
        prev?.removeEventListener("click", prevH);
        gsap.killTweensOf(items);
    };
}

/* =========================
   RESUME SCROLL STACK
========================= */
gsap.registerPlugin(ScrollTrigger);

const resumeSection = document.querySelector(".my-resume-section .scroll-section");
const wrapper = resumeSection.querySelector(".list");
const items = wrapper.querySelectorAll(".item");
const gap = 50;        // default gap
const extraGap = 100;  // extra gap between 1st and 2nd item

// -----------------------------
// STEP 1️⃣ : Set parent height dynamically
// -----------------------------
function setSectionHeight() {
    let totalHeight = 0;
    items.forEach((item, index) => {
        totalHeight += item.offsetHeight + gap;
        if (index === 0) totalHeight += extraGap; // extra gap after first item
    });
    const isMobile = window.innerWidth < 768;
    const extra = isMobile ? -100 : 150;

    document.querySelector(".my-resume-section").style.height =
        totalHeight + extra + "px";

}
setSectionHeight();

// -----------------------------
// STEP 2️⃣ : Initial positioning of each .item
// -----------------------------
items.forEach((item, index) => {
    item.style.position = "absolute";
    item.style.top = "0";
    item.style.transform = "translateX(-50%)";

    if (index === 0) {
        gsap.set(item, { y: 0 });
        item.classList.add("active");
    } else {
        // add extra gap only for second item
        const extra = index === 1 ? extraGap : 0;
        gsap.set(item, { y: index * (item.offsetHeight + gap) + extra });
    }
});

// -----------------------------
// STEP 3️⃣ : Calculate Scroll End dynamically
// -----------------------------
function calcScrollEnd() {
    let total = 0;
    items.forEach((item, index) => {
        total += item.offsetHeight + gap;
        if (index === 0) total += extraGap; // extra gap after first item
    });
    return total - window.innerHeight;
}

// -----------------------------
// STEP 4️⃣ : ScrollTrigger Timeline
// -----------------------------
resumeSection.style.minHeight = "100vh";

const tl = gsap.timeline({
    scrollTrigger: {
        trigger: resumeSection,
        start: "top top",
        end: () => "+=" + calcScrollEnd(),
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: self => {
            const spacer = self.pinSpacer;
            if (spacer) {
                spacer.style.setProperty("padding-top", "0", "important");
                spacer.style.setProperty("margin-top", "0", "important");
                spacer.style.setProperty("padding-bottom", "0", "important");
                spacer.style.setProperty("margin-bottom", "0", "important");
            }
        },
    },
});

// -----------------------------
// STEP 5️⃣ : Animate each .item card
// -----------------------------
items.forEach((item, index) => {
    if (index === 0) return;
    const prev = items[index - 1];

    tl.to(prev, { scale: 0.9, borderRadius: "10px", duration: 0.8 }, "+=0");
    tl.to(
        item,
        {
            y: 0,
            duration: 1,
            ease: "power1.out",
            onStart: () => {
                items.forEach((i) => i.classList.remove("active"));
                item.classList.add("active");
                const video = item.querySelector("video");
                if (video) video.play();
            },
        },
        "<0.2"
    );
});

// -----------------------------
// STEP 6️⃣ : Recalculate on resize
// -----------------------------
window.addEventListener("resize", () => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    setSectionHeight();
    items.forEach((item, index) => {
        if (index === 0) {
            gsap.set(item, { y: 0 });
        } else {
            const extra = index === 1 ? extraGap : 0;
            gsap.set(item, { y: index * (item.offsetHeight + gap) + extra });
        }
    });

    ScrollTrigger.refresh();
});



/* =========================
   CONTACT POPUP + FORM
========================= */
const popup = document.getElementById("popupForm");
const closeBtn = document.getElementById("closeForm");

document.querySelectorAll("#openForm").forEach(btn =>
    btn.addEventListener("click", () => popup?.classList.add("active"))
);

closeBtn?.addEventListener("click", () =>
    popup?.classList.remove("active")
);

document.addEventListener("keydown", e => {
    if (e.key === "Escape") popup?.classList.remove("active");
});

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", async e => {
        e.preventDefault();

        try {
            const res = await fetch("send-mail.php", {
                method: "POST",
                body: new FormData(form)
            });
            const data = await res.json();
            showToast(data.message, data.status);

            if (data.status === "success") {
                form.reset();
                popup?.classList.remove("active");
            }
        } catch {
            showToast("Something went wrong!", "error");
        }
    });
});

function showToast(msg, type = "success") {
    const box = document.getElementById("customAlert");
    const text = document.getElementById("alertMessage");
    const inner = box?.querySelector(".toast-box");
    if (!box || !text || !inner) return;

    inner.className = "toast-box " + type;
    text.textContent = msg;
    box.classList.add("active");

    setTimeout(() => box.classList.remove("active"), 4000);
}


/* ---------------------------------------------
   SCROLL TOP ON LOAD + BACK TO TOP
---------------------------------------------- */
window.addEventListener("beforeunload", () => scrollTo(0, 0));

document.querySelector('.footer-top-arrow .footer-top-arrow-hlp')
    ?.addEventListener('click', () => scrollTo({ top: 0, behavior: "smooth" }));
