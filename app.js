// NEW SLIDER VERSION
let contentSwiper, photoSwiper;
let isSyncing = false;
let previousActiveRealIndex;

function initializeSwipers() {
  if (contentSwiper) contentSwiper.destroy();
  if (photoSwiper) photoSwiper.destroy();

  contentSwiper = new Swiper(".swiper.is-content", {
    speed: 800,
    loop: true,
    slidesPerView: 1,
    allowTouchMove: true,
    effect: "slide",
    breakpoints: {
      480: { allowTouchMove: false },
    },
    on: {
      init: function (swiper) {
        swiper.slides.forEach((slide) => (slide.style.opacity = 0));
        swiper.slides[swiper.activeIndex].style.opacity = 1;
      },
    },
  });

  photoSwiper = new Swiper(".swiper.is-photos", {
    speed: 800,
    loop: true,
    slidesPerView: 1,
    spaceBetween: 20,
    allowTouchMove: true,
    pagination: {
      el: ".pagination-container",
      clickable: true,
      renderBullet: function (index, className) {
        return `<span class="${className}"></span>`;
      },
    },
    navigation: {
      nextEl: ".swiper_arrow.is-right",
      prevEl: ".swiper_arrow.is-left",
    },
    controller: { control: contentSwiper },
    breakpoints: {
      480: {
        allowTouchMove: false,
        slidesPerView: 2,
      },
    },
    on: {
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
            "opacity 0.8s cubic-bezier(0.65, 0, 0.35, 1)";
          requestAnimationFrame(() => {
            fadeElement.style.opacity = 1;
          });
        }
      },
      beforeTransitionStart(swiper) {
        previousActiveRealIndex = swiper.realIndex;
      },
    },
  });

  photoSwiper.on("slideChange", (swiper) => {
    if (!isSyncing) {
      isSyncing = true;
      contentSwiper.slideTo(swiper.realIndex, swiper.params.speed);
      isSyncing = false;
    }
  });

  // add cubic-bezier easing function to the swiper wrapper
  document.querySelectorAll(".swiper-wrapper").forEach((wrapper) => {
    wrapper.style.transitionTimingFunction = "cubic-bezier(0.65, 0, 0.35, 1)";
  });

  // Improve transition performance
  document
    .querySelectorAll(".swiper.is-content .swiper-slide")
    .forEach((slide) => {
      slide.style.willChange = "opacity"; // Improve transition performance
    });
}

window.addEventListener("DOMContentLoaded", initializeSwipers);

// // Add cubic-bezier easing function
// function cubicBezier(t, p1, p2, p3, p4) {
//   const t1 = 1 - t;
//   return (
//     Math.pow(t1, 3) * p1 +
//     3 * Math.pow(t1, 2) * t * p2 +
//     3 * t1 * Math.pow(t, 2) * p3 +
//     Math.pow(t, 3) * p4
//   );
// }
