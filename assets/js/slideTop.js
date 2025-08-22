// document.addEventListener("DOMContentLoaded", () => {
//   const popup = document.querySelector(".js-global-popup");
//   const popupContents = popup.querySelectorAll(".js-popup-content");
//   const popupClose = popup.querySelector(".js-global-popup-close");

//   document.querySelectorAll(".js-setting-toggle").forEach((button) => {
//     button.addEventListener("click", (e) => {
//       e.stopPropagation();
//       const type = button.dataset.popupType;

//       // すべての中身を非表示
//       popupContents.forEach((c) => c.classList.remove("is-active"));

//       // 対象の中身だけ表示
//       const target = popup.querySelector(`.js-popup-content[data-type="${type}"]`);
//       if (target) {
//         target.classList.add("is-active");
//         popup.classList.add("is-open");
//       }

//       // PCの場合は絶対位置で調整（必要なら）
//       if (window.innerWidth >= 767) {
//         const rect = button.getBoundingClientRect();
//         popup.style.top = `${rect.bottom + window.scrollY}px`;
//         popup.style.left = `${rect.left + window.scrollX}px`;
//       }
//     });
//   });

//   // 外部クリックで閉じる
//   document.addEventListener("click", (e) => {
//     if (!popup.contains(e.target)) {
//       popup.classList.remove("is-open");
//       popupContents.forEach((c) => c.classList.remove("is-active"));
//     }
//   });
//   if (popupClose) {
//     popupClose.addEventListener("click", () => {
//       popup.classList.remove("is-open");
//       popupContents.forEach((c) => c.classList.remove("is-active")); // ←これが必要！
//     });
//   }
// });
