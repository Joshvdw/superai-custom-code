// NEW SLIDER VERSION
let contentSwiper, photoSwiper;
let previousActiveRealIndex;

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
    touchRatio: 1.5,
    freeMode: false,
    longSwipes: false,
    slidesPerGroup: 1,
    resistanceRatio: 0,
    touchMoveStopPropagation: true,
    breakpoints: {
      480: { allowTouchMove: true, slidesPerView: "auto" },
    },
    on: {
      init: function (swiper) {
        if (window.innerWidth > 767) {
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
    threshold: 10,
    touchRatio: 1.5,
    freeMode: false,
    longSwipes: false,
    slidesPerGroup: 1,
    resistanceRatio: 0,
    touchMoveStopPropagation: true,
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
        allowTouchMove: true,
        slidesPerView: "auto",
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
            "opacity 0.5s cubic-bezier(0.65, 0, 0.35, 1)";
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

  photoSwiper.controller.control = contentSwiper;
  contentSwiper.controller.control = photoSwiper;

  // add cubic-bezier easing function to the swiper wrapper
  if (window.innerWidth > 767) {
    document.querySelectorAll(".swiper-wrapper").forEach((wrapper) => {
      wrapper.style.transitionTimingFunction = "cubic-bezier(0.65, 0, 0.35, 1)";
    });
  }
  window.addEventListener("resize", () => {
    document.querySelectorAll(".swiper-wrapper").forEach((wrapper) => {
      if (window.innerWidth <= 767) {
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

window.addEventListener("DOMContentLoaded", initializeSwipers);
