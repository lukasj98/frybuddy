const navToggle = document.querySelector(".nav__toggle");
const navLinks = document.querySelector(".nav__links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const screenshotTrack = document.getElementById("screenshot-track");
const carouselDots = document.getElementById("carousel-dots");
const prevBtn = document.querySelector(".carousel-btn--prev");
const nextBtn = document.querySelector(".carousel-btn--next");

if (screenshotTrack && carouselDots) {
  const slides = Array.from(screenshotTrack.querySelectorAll(".screenshot-slide"));
  let activeIndex = 0;

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `Screenshot ${index + 1}`);
    dot.addEventListener("click", () => scrollToSlide(index));
    carouselDots.appendChild(dot);
  });

  const dots = Array.from(carouselDots.querySelectorAll(".carousel-dot"));

  function updateCarouselState() {
    const slideWidth = slides[0]?.offsetWidth ?? 0;
    const gap = 16;
    activeIndex = slideWidth
      ? Math.round(screenshotTrack.scrollLeft / (slideWidth + gap))
      : 0;
    activeIndex = Math.max(0, Math.min(activeIndex, slides.length - 1));

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
    });

    if (prevBtn) prevBtn.disabled = activeIndex === 0;
    if (nextBtn) nextBtn.disabled = activeIndex === slides.length - 1;
  }

  function scrollToSlide(index) {
    const slide = slides[index];
    if (!slide) return;

    screenshotTrack.scrollTo({
      left: slide.offsetLeft - screenshotTrack.offsetLeft,
      behavior: "smooth",
    });
  }

  screenshotTrack.addEventListener("scroll", () => {
    window.requestAnimationFrame(updateCarouselState);
  }, { passive: true });

  prevBtn?.addEventListener("click", () => scrollToSlide(activeIndex - 1));
  nextBtn?.addEventListener("click", () => scrollToSlide(activeIndex + 1));

  updateCarouselState();
}
