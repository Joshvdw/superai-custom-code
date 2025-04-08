let contentSwiper, photoSwiper;
let isSyncing = false;
let previousActiveRealIndex; // Track the real index of the outgoing slide

function initializeSwipers() {
  if (contentSwiper) contentSwiper.destroy();
  if (photoSwiper) photoSwiper.destroy();

  contentSwiper = new Swiper(".swiper.is-content", {
    speed: 800,
    loop: true,
    slidesPerView: 1,
    allowTouchMove: false,
    // resistanceRatio: 0,
    effect: "slide",
  });

  photoSwiper = new Swiper(".swiper.is-photos", {
    speed: 800,
    loop: true,
    parallax: true,
    slidesPerView: 2,
    spaceBetween: 10,
    allowTouchMove: false,
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
    on: {
      slideChange(swiper) {
        document
          .querySelectorAll(".testimonials_logo")
          .forEach((el) => (el.style.opacity = 0));
        const activeSlide = swiper.slides[swiper.activeIndex];
        const fadeElement = activeSlide.querySelector(".testimonials_logo");
        if (fadeElement) {
          fadeElement.style.transition =
            "opacity 0.8s cubic-bezier(0.65, 0, 0.35, 1)";
          requestAnimationFrame(() => {
            fadeElement.style.opacity = 1;
          });
        }
      },

      beforeTransitionStart(swiper) {
        // Capture real index before transition starts
        previousActiveRealIndex = swiper.realIndex;
      },

      // progress(swiper) {
      //   swiper.slides.forEach((slide) => {
      //     const parallaxEl = slide.querySelector(".testimonial_bg-img");
      //     if (!parallaxEl) return;

      //     const slideProgress = slide.progress;
      //     const moveAmount = 5;
      //     let translateX = 0;

      //     // Add a slight delay to the progress
      //     const delayedProgress = Math.max(0, slideProgress - 0.2);

      //     // Apply easing to the delayed progress value
      //     const easedProgress = cubicBezier(delayedProgress, 0.65, 0, 0.35, 1);

      //     // Use real index to identify outgoing slide
      //     const slideRealIndex = parseInt(
      //       slide.getAttribute("data-swiper-slide-index"),
      //       10
      //     );
      //     if (slideRealIndex === previousActiveRealIndex) {
      //       // Reverse direction for outgoing slide
      //       translateX = -moveAmount * easedProgress;
      //     } else {
      //       // Normal direction for incoming slides
      //       translateX = moveAmount * (1 + easedProgress);
      //     }

      //     parallaxEl.style.transform = `translateX(${translateX}px)`;
      //   });
      // },

      // setTransition(swiper, transition) {
      //   swiper.slides.forEach((slide) => {
      //     const parallaxEl = slide.querySelector(".testimonial_bg-img");
      //     if (parallaxEl) {
      //       parallaxEl.style.transition = `transform ${transition}ms`;
      //     }
      //   });
      // },
    },
  });

  photoSwiper.on("slideChange", (swiper) => {
    if (!isSyncing) {
      isSyncing = true;
      contentSwiper.slideTo(swiper.realIndex, swiper.params.speed);
      isSyncing = false;
    }
  });

  document.querySelectorAll(".swiper-wrapper").forEach((wrapper) => {
    wrapper.style.transitionTimingFunction = "cubic-bezier(0.65, 0, 0.35, 1)";
  });
}

window.addEventListener("DOMContentLoaded", initializeSwipers);

// Add cubic-bezier easing function
function cubicBezier(t, p1, p2, p3, p4) {
  const t1 = 1 - t;
  return (
    Math.pow(t1, 3) * p1 +
    3 * Math.pow(t1, 2) * t * p2 +
    3 * t1 * Math.pow(t, 2) * p3 +
    Math.pow(t, 3) * p4
  );
}
