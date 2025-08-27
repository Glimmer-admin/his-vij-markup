// メインビジュアルしたのおすすめリストのswiper
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

// メインビジュアルのswiper
document.addEventListener("DOMContentLoaded", function () {
  new Swiper(".js-mainvisual-slide", {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 0,
    pagination: {
      el: ".mainvisual-swiper-pagination",
      clickable: true,
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

// メインビジュアルテキスト入力欄の挙動実装
document.addEventListener("DOMContentLoaded", () => {
  const forms = Array.from(document.querySelectorAll(".js-mainvisual-search-form"));

  // ---------- helpers ----------
  function openForm(form) {
    const { content, input } = form._mv || {};
    if (!content || !input) return;
    content.classList.add("is-open");
    content.setAttribute("aria-hidden", "false");
    input.setAttribute("aria-expanded", "true");
  }
  function closeForm(form) {
    const { content, input } = form._mv || {};
    if (!content || !input) return;
    content.classList.remove("is-open");
    content.setAttribute("aria-hidden", "true");
    input.setAttribute("aria-expanded", "false");
  }
  function syncNowSpan(form) {
    const { nowSpan, nowDefaultText, input } = form._mv || {};
    if (!nowSpan || !input) return;
    const q = input.value.trim();
    nowSpan.textContent = q || nowDefaultText;
  }
  function updatePanel(form) {
    const { content, input } = form._mv || {};
    if (!content || !input) return;
    content.dataset.state = input.value.trim().length === 0 ? "popular" : "candidate";
    syncNowSpan(form);
  }
  // ★同期先 input へ値をミラー
  function syncMirror(form) {
    const { input, mirror } = form._mv || {};
    if (!input || !mirror) return;
    mirror.value = input.value;
    // フレームワーク連携が必要なら input イベントを発火
    mirror.dispatchEvent(new Event("input", { bubbles: true }));
  }

  // ---------- init per form ----------
  forms.forEach((form) => {
    const input = form.querySelector(".js-mainvisual-search-input") || form.querySelector(".js-global-popup .js-mainvisual-search-input"); // どちらでも
    const content = form.querySelector(".js-mainvisual-search-content");
    const popular = form.querySelector(".js-mainvisual-search-popular");
    const candidate = form.querySelector(".js-mainvisual-search-candidate");
    if (!input || !content || !popular || !candidate) return; // 構造不足はスキップ

    const nowSpan = content.querySelector('a[href="js-mainvisual-search-now"] span');
    const nowDefaultText = nowSpan?.textContent?.trim() || "";

    // ★同期先（フォーム内→全体の順で探索）
    const mirror = form.querySelector(".js-mainvisual-search-result, input.js-mainvisual-search-result") || document.querySelector(".js-mainvisual-search-result, input.js-mainvisual-search-result");

    // 参照をフォームに紐づけて保存
    form._mv = { input, content, popular, candidate, nowSpan, nowDefaultText, mirror };

    // イベント（このフォームだけに作用）
    input.addEventListener("focus", () => {
      openForm(form);
      updatePanel(form);
    });
    input.addEventListener("click", () => {
      openForm(form);
      updatePanel(form);
    });
    input.addEventListener("input", () => {
      openForm(form);
      updatePanel(form);
      syncMirror(form);
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeForm(form);
    });

    content.addEventListener("click", (e) => {
      const a = e.target.closest(".js-mainvisual-search-popular a, .js-mainvisual-search-candidate a");
      if (!a) return;
      e.preventDefault();
      const text = (a.querySelector("span")?.textContent || a.textContent || "").replace(/\s+/g, " ").trim().replace(/^#/, "");
      if (a.getAttribute("href") !== "js-mainvisual-search-now") {
        input.value = text;
      }
      openForm(form);
      updatePanel(form);
      syncMirror(form); // ★候補/人気クリック時も同期
    });

    // 初期状態
    if (!content.dataset.state) content.dataset.state = "popular";
    updatePanel(form);
    syncMirror(form); // ★初期同期（必要なら）
  });

  // 外側クリック：どのフォームにも対応
  document.addEventListener("click", (e) => {
    forms.forEach((form) => {
      if (!form.contains(e.target)) closeForm(form);
    });
  });
});
