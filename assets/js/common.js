document.addEventListener("DOMContentLoaded", () => {
  const selectors = document.querySelectorAll(".js-setting-selector");
  const popup = document.querySelector(".js-global-popup");
  const popupContents = popup?.querySelectorAll(".js-popup-content") || [];
  const popupClose = popup?.querySelector(".js-global-popup-close");

  // ポップアップを閉じる処理（アニメーション後にis-activeを外す）
  const closePopup = () => {
    if (!popup) return;
    if (!popup.classList.contains("is-open")) return;

    popup.classList.remove("is-open");

    const onTransitionEnd = () => {
      popupContents.forEach((c) => c.classList.remove("is-active"));
      popup.removeEventListener("transitionend", onTransitionEnd);
    };
    popup.addEventListener("transitionend", onTransitionEnd);
  };

  selectors.forEach((selector) => {
    const toggleBtn = selector.querySelector(".js-setting-toggle");
    const dropdown = selector.querySelector(".js-setting-dropdown");

    toggleBtn?.addEventListener("click", (e) => {
      e.stopPropagation();

      const isPC = window.innerWidth >= 767;
      const type = toggleBtn.dataset.popupType;

      if (isPC) {
        // PC：ドロップダウン制御（classのみで）
        selectors.forEach((s) => {
          if (s !== selector) {
            s.querySelector(".js-setting-dropdown")?.classList.remove("is-active");
            s.querySelector(".js-setting-toggle")?.classList.remove("is-open");
          }
        });

        dropdown?.classList.toggle("is-active");
        toggleBtn.classList.toggle("is-open");
        return;
      }

      // SP：ポップアップ表示処理
      if (type && popup) {
        popupContents.forEach((c) => c.classList.remove("is-active"));
        const target = popup.querySelector(`.js-popup-content[data-type="${type}"]`);
        if (target) {
          target.classList.add("is-active");
          popup.classList.add("is-open");

          // SPなので位置調整不要
          popup.style.top = "";
          popup.style.left = "";
        }
      }
    });

    // PC：ドロップダウン内の項目をクリック時
    dropdown?.querySelectorAll("li").forEach((item) => {
      item.addEventListener("click", () => {
        console.log("Selected:", item.textContent.trim());
        dropdown.classList.remove("is-active");
        toggleBtn.classList.remove("is-open");
      });
    });
  });

  // 外部クリックで閉じる（PC：ドロップダウン、SP：ポップアップ）
  document.addEventListener("click", (e) => {
    const isPC = window.innerWidth >= 767;

    if (isPC) {
      selectors.forEach((selector) => {
        if (!selector.contains(e.target)) {
          selector.querySelector(".js-setting-dropdown")?.classList.remove("is-active");
          selector.querySelector(".js-setting-toggle")?.classList.remove("is-open");
        }
      });
    }

    // ポップアップが開いていて外をクリックした場合は閉じる
    if (!isPC && popup?.classList.contains("is-open") && !popup.contains(e.target)) {
      closePopup();
    }
  });

  // クローズボタンでポップアップを閉じる
  popupClose?.addEventListener("click", () => {
    closePopup();
  });
});
