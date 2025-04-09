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
    // controller: { control: photoSwiper },
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
    effect: "slide",
    threshold: 10,
    touchRatio: 1,
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
      nextEl: ".swiper_arrow.is-right.is-photos",
      prevEl: ".swiper_arrow.is-left.is-photos",
    },
    // controller: { control: contentSwiper },
    breakpoints: {
      480: {
        allowTouchMove: true,
        slidesPerView: "auto",
      },
    },
    on: {
      init() {
        adjustPhotoSwiperWidth();

        // Add click event listeners to photo swiper arrows
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

        if (photoNextArrow && contentNextArrow) {
          photoNextArrow.addEventListener("click", () => {
            contentNextArrow.click();
          });
        }

        if (photoPrevArrow && contentPrevArrow) {
          photoPrevArrow.addEventListener("click", () => {
            contentPrevArrow.click();
          });
        }
      },
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

  // Delay controller linking to avoid immediate triggering
  // setTimeout(() => {
  // if (photoSwiper.controller && contentSwiper) {
  // photoSwiper.controller.control = contentSwiper;
  // }
  // if (contentSwiper.controller && photoSwiper) {
  // contentSwiper.controller.control = photoSwiper;
  // }
  // }, 100); // Adjust the delay if necessary

  // Function to adjust the width for photoSwiper after initialization
  function adjustPhotoSwiperWidth() {
    document.querySelectorAll(".swiper-slide.is-photos").forEach((slide) => {
      slide.classList.add("force-width");
      // slide.style.width = "50%!important";
    });
  }

  // Ensuring the width is set correctly when resizing the window
  window.addEventListener("resize", () => {
    adjustPhotoSwiperWidth(); // Reapply 50% width on window resize
  });

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
