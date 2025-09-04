(() => {
  const OPEN_ATTR = "data-modal-open";
  const CLOSE_ATTR = "data-modal-close";
  const SHEET_BP = 767; // SP判定

  const qs = (sel) => document.querySelector(sel);
  const getModal = (target) => (target?.startsWith("#") ? qs(target) : document.getElementById(target));

  // --- スクロールロック（iOS対応：body固定方式） ---
  const lockScroll = () => {
    if (document.documentElement.dataset.scrollLock === "1") return; // 多重ロック防止
    const y = window.scrollY || 0;
    document.documentElement.dataset.scrollLock = "1";
    document.documentElement.dataset.scrollY = String(y);
    document.documentElement.classList.add("is-modal-open");
    document.body.classList.add("is-modal-open");
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  };
  const unlockScroll = () => {
    if (document.documentElement.dataset.scrollLock !== "1") return;
    const y = parseInt(document.documentElement.dataset.scrollY || "0", 10) || 0;
    // 解除（順番大事）
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    document.documentElement.classList.remove("is-modal-open");
    document.body.classList.remove("is-modal-open");
    window.scrollTo(0, y);
    delete document.documentElement.dataset.scrollLock;
    delete document.documentElement.dataset.scrollY;
  };

  const isSpSheet = (modal) => modal?.classList.contains("global-modal--sp-sheet") && window.innerWidth <= SHEET_BP;

  const openModal = (sel) => {
    const modal = getModal(sel);
    if (!modal) return;
    modal.classList.remove("is-leave"); // 念のため
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    lockScroll();
  };

  const closeModal = (modal) => {
    if (!modal) return;

    // --- SPボトムシート：閉じ切ってから非表示 ---
    if (isSpSheet(modal) && modal.classList.contains("is-open")) {
      if (modal.classList.contains("is-leave")) return; // 二重実行防止
      modal.classList.add("is-leave");

      const dialog = modal.querySelector(".global-modal__dialog");

      const finish = () => {
        modal.classList.remove("is-open", "is-leave");
        modal.setAttribute("aria-hidden", "true");
        if (!document.querySelector(".global-modal.is-open")) {
          unlockScroll(); // ← ここが重要
        }
        dialog?.removeEventListener("transitionend", onEnd);
        clearTimeout(fallback);
      };

      const onEnd = (e) => {
        if (e.target === dialog && e.propertyName === "transform") finish();
      };
      dialog?.addEventListener("transitionend", onEnd);

      // 保険（CSS 0.38s より少し長め）
      const fallback = setTimeout(finish, 700);
      return;
    }

    // --- 通常モーダル（中央フェード） ---
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    if (!document.querySelector(".global-modal.is-open")) {
      unlockScroll(); // ← 通常モーダルでも必ず解除
    }
  };

  // クリック委譲（開く/閉じる）
  document.addEventListener("click", (e) => {
    const opener = e.target.closest(`[${OPEN_ATTR}]`);
    if (opener) {
      e.preventDefault();
      openModal(opener.getAttribute(OPEN_ATTR));
      return;
    }
    const closer = e.target.closest(`[${CLOSE_ATTR}]`);
    if (closer) {
      const modal = e.target.closest(".global-modal") || document.querySelector(".global-modal.is-open");
      closeModal(modal);
    }
  });

  // ESC で閉じる
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const modal = document.querySelector(".global-modal.is-open");
      if (modal) closeModal(modal);
    }
  });
})();
