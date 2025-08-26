document.addEventListener("DOMContentLoaded", function () {
  const appealSwiper = new Swiper(".js-appeal-slide", {
    loop: true,
    // モバイル（〜767px）のデフォルト
    slidesPerView: 1.2,
    spaceBetween: 10,
    breakpoints: {
      480: {
        slidesPerView: 1.6,
        spaceBetween: 14,
      },
      600: {
        slidesPerView: 1.8,
        spaceBetween: 14,
      },
      700: {
        slidesPerView: 2.1,
        spaceBetween: 14,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
});

document.addEventListener("DOMContentLoaded", function () {
  new Swiper(".js-mainvisual-slide", {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 0,
    pagination: {
      el: ".mainvisual-swiper-pagination",
      clickable: true,
      // ドットを <button> で生成（Enter/Spaceで操作可）
      renderBullet: (index, className) => {
        const n = index + 1;
        return `<button type="button" class="${className}" aria-label="スライド${n}へ"></button>`;
      },
    },
    navigation: {
      prevEl: ".mainvisual-swiper-button-prev",
      nextEl: ".mainvisual-swiper-button-next",
    },
  });
});
