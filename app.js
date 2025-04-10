// NEW SLIDER VERSION
const MOBILE_BREAKPOINT = 480;
const TABLET_BREAKPOINT = 767;

let contentSwiper, photoSwiper;
let lastWidth = window.innerWidth;

function initializeSwipers() {
  if (contentSwiper) contentSwiper.destroy();
  if (photoSwiper) photoSwiper.destroy();

  contentSwiper = new Swiper(".swiper.is-content", {
    speed: 500,
    loop: true,
    slidesPerView: 1,
    spaceBetween: 20,
    allowTouchMove: true,
    effect: "slide",
    threshold: 10,
    touchRatio: 1,
    freeMode: false,
    longSwipes: false,
    slidesPerGroup: 1,
    resistanceRatio: 0,
    touchMoveStopPropagation: true,
    navigation: {
      nextEl: ".swiper_arrow.is-right.is-content",
      prevEl: ".swiper_arrow.is-left.is-content",
    },
    // desktop only
    breakpoints: {
      480: {
        allowTouchMove: false,
        slidesPerView: "auto",
      },
    },
    on: {
      // text content fades on desktop
      init: function (swiper) {
        if (window.innerWidth > TABLET_BREAKPOINT) {
          swiper.slides.forEach((slide) => (slide.style.opacity = 0));
        }
        swiper.slides[swiper.activeIndex].style.opacity = 1;
      },
    },
  });

  photoSwiper = new Swiper(".swiper.is-photos", {
    speed: 500,
    loop: true,
    slidesPerView: 1,
    spaceBetween: 20,
    allowTouchMove: true,
    effect: "slide",
    threshold: 10,
    touchRatio: 1,
    freeMode: false,
    longSwipes: false,
    slidesPerGroup: 1,
    resistanceRatio: 0,
    touchMoveStopPropagation: true,
    // add pagination on mobile
    pagination: {
      el: ".pagination-container",
      clickable: true,
      renderBullet: function (index, className) {
        return `<span class="${className}"></span>`;
      },
    },
    navigation: {
      nextEl: ".swiper_arrow.is-right.is-photos",
      prevEl: ".swiper_arrow.is-left.is-photos",
    },
    // desktop only
    breakpoints: {
      480: {
        allowTouchMove: false,
        slidesPerView: "auto",
      },
    },
    on: {
      init() {
        // Simulate click on arrows on desktop
        if (window.innerWidth > MOBILE_BREAKPOINT) {
          arrowClickHandler();
        }
      },
      // fade in border and testimonial logo on slide change
      slideChange(swiper) {
        document
          .querySelectorAll(".testimonial_border-img")
          .forEach((el) => (el.style.opacity = 0));
        const activeSlide = swiper.slides[swiper.activeIndex];
        const fadeElement = activeSlide.querySelector(
          ".testimonial_border-img"
        );
        if (fadeElement) {
          fadeElement.style.transition =
            "opacity 0.5s cubic-bezier(0.65, 0, 0.35, 1)";
          requestAnimationFrame(() => {
            fadeElement.style.opacity = 1;
          });
        }
      },
      // Reset opacity safegaurd bug fix
      slideChangeTransitionStart: function () {
        setTimeout(() => {
          document
            .querySelectorAll(
              ".swiper-slide.is-photos:not(.swiper-slide-active) .testimonial_border-img"
            )
            .forEach((element) => {
              element.style.opacity = 0;
            });
        }, 50);
      },
    },
  });

  // sync swipers on mobile to enable touch support
  if (window.innerWidth < MOBILE_BREAKPOINT) {
    photoSwiper.controller.control = contentSwiper;
    contentSwiper.controller.control = photoSwiper;
  }

  // add cubic-bezier easing function to the swiper wrapper on desktop
  if (window.innerWidth > TABLET_BREAKPOINT) {
    document.querySelectorAll(".swiper-wrapper").forEach((wrapper) => {
      wrapper.style.transitionTimingFunction = "cubic-bezier(0.65, 0, 0.35, 1)";
    });
  }

  // remove cubic-bezier easing on small screens
  window.addEventListener("resize", () => {
    document.querySelectorAll(".swiper-wrapper").forEach((wrapper) => {
      if (window.innerWidth <= TABLET_BREAKPOINT) {
        wrapper.style.transitionTimingFunction = "";
      } else {
        wrapper.style.transitionTimingFunction =
          "cubic-bezier(0.65, 0, 0.35, 1)";
      }
    });
  });

  // Improve transition performance
  document
    .querySelectorAll(".swiper.is-content .swiper-slide")
    .forEach((slide) => {
      slide.style.willChange = "opacity";
    });
}

// arrow click logic
function arrowClickHandler() {
  const photoNextArrow = document.querySelector(
    ".swiper_arrow.is-right.is-photos"
  );
  const photoPrevArrow = document.querySelector(
    ".swiper_arrow.is-left.is-photos"
  );
  const contentNextArrow = document.querySelector(
    ".swiper_arrow.is-right.is-content"
  );
  const contentPrevArrow = document.querySelector(
    ".swiper_arrow.is-left.is-content"
  );

  // Remove existing event listeners if they exist
  if (photoNextArrow && contentNextArrow) {
    const newNextHandler = () => contentNextArrow.click();
    photoNextArrow.removeEventListener("click", newNextHandler);
    photoNextArrow.addEventListener("click", newNextHandler);
  }
  if (photoPrevArrow && contentPrevArrow) {
    const newPrevHandler = () => contentPrevArrow.click();
    photoPrevArrow.removeEventListener("click", newPrevHandler);
    photoPrevArrow.addEventListener("click", newPrevHandler);
  }
}

// Simple resize handler to reinitialize on breakpoint changes
window.addEventListener("resize", () => {
  const currentWidth = window.innerWidth;
  const crossedMobileBreakpoint =
    (lastWidth <= MOBILE_BREAKPOINT && currentWidth > MOBILE_BREAKPOINT) ||
    (lastWidth > MOBILE_BREAKPOINT && currentWidth <= MOBILE_BREAKPOINT);
  const crossedTabletBreakpoint =
    (lastWidth <= TABLET_BREAKPOINT && currentWidth > TABLET_BREAKPOINT) ||
    (lastWidth > TABLET_BREAKPOINT && currentWidth <= TABLET_BREAKPOINT);

  if (crossedMobileBreakpoint || crossedTabletBreakpoint) {
    initializeSwipers();
  }
  lastWidth = currentWidth;
});

window.addEventListener("DOMContentLoaded", initializeSwipers);
