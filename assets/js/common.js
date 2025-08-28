// =========BEGIN header関連 =========
/**
 * PCはドロップダウン、SPはモーダル
 * - 常にポップアップは1つだけ
 * - is-open（ポップアップ & トグル）/ is-active を安全に着脱
 * - SP時は開いている間、対応トグルにも is-open を付与
 */
document.addEventListener("DOMContentLoaded", () => {
  // ========= 共通ユーティリティ =========
  const isPC = () => window.innerWidth >= 768;

  const getTransitionMs = (el) => {
    const cs = getComputedStyle(el);
    const durs = cs.transitionDuration.split(",").map((s) => parseFloat(s) * 1000 || 0);
    const delays = cs.transitionDelay.split(",").map((s) => parseFloat(s) * 1000 || 0);
    return Math.max(0, ...durs.map((d, i) => d + (delays[i] || 0)));
  };

  const waitTransitionEnd = (el) =>
    new Promise((resolve) => {
      if (!el) return resolve();
      const timeout = getTransitionMs(el);
      if (timeout === 0) return resolve();

      let done = false;
      const onEnd = (e) => {
        if (e.target !== el) return;
        el.removeEventListener("transitionend", onEnd);
        if (!done) {
          done = true;
          resolve();
        }
      };
      el.addEventListener("transitionend", onEnd);

      setTimeout(() => {
        if (!done) {
          el.removeEventListener("transitionend", onEnd);
          resolve();
        }
      }, timeout + 80);
    });

  const forceReflow = (el) => el && el.offsetHeight;

  // 対応するトグル取得
  const getRelatedToggle = (popup) => popup?.closest(".js-setting-selector")?.querySelector(".js-setting-toggle") || null;

  // SP時のみトグルの is-open を同期
  const setToggleOpenSP = (popup, on) => {
    if (isPC()) return; // PCでは触らない（PCはドロップダウン制御）
    const toggle = getRelatedToggle(popup);
    if (!toggle) return;
    if (on) toggle.classList.add("is-open");
    else toggle.classList.remove("is-open");
  };

  // ========= コンテンツ切替（is-activeの安定化） =========
  const setActiveContent = async (popup, target) => {
    if (!popup || !target) return;
    if (popup.dataset.contentSwitching === "1") {
      await new Promise((r) => requestAnimationFrame(r));
    }
    popup.dataset.contentSwitching = "1";

    const contents = popup.querySelectorAll(".js-popup-content");
    contents.forEach((c) => c.classList.remove("is-active"));
    target.classList.add("is-active");

    delete popup.dataset.contentSwitching;
  };

  // ========= ポップアップ開閉（SP用） =========
  const closePopupAnimated = async (popup) => {
    if (!popup) return;
    const contents = popup.querySelectorAll(".js-popup-content");

    if (!popup.classList.contains("is-open") && !popup.dataset.state) return;

    if (popup.dataset.state === "opening") {
      await waitTransitionEnd(popup);
    }
    if (popup.dataset.state === "closing") {
      await waitTransitionEnd(popup);
      return;
    }

    popup.dataset.state = "closing";
    popup.classList.remove("is-open");
    await waitTransitionEnd(popup);

    // 完全に閉じたら中身リセット & トグル is-open も外す（SPのみ）
    contents.forEach((c) => c.classList.remove("is-active"));
    setToggleOpenSP(popup, false);
    delete popup.dataset.state;
  };

  const openPopupAnimated = async (popup, targetContent) => {
    if (!popup || !targetContent) return;

    if (popup.classList.contains("is-open")) {
      await closePopupAnimated(popup);
    }
    if (popup.dataset.state === "opening" || popup.dataset.state === "closing") {
      await waitTransitionEnd(popup);
    }

    popup.dataset.state = "opening";
    await setActiveContent(popup, targetContent);

    forceReflow(popup);
    popup.classList.add("is-open");
    popup.style.top = "";
    popup.style.left = "";

    // SP時はトグルにも is-open を付与
    setToggleOpenSP(popup, true);

    await waitTransitionEnd(popup);
    delete popup.dataset.state;
  };

  const closeAllPopupsAnimated = async (except = null) => {
    const all = Array.from(document.querySelectorAll(".js-global-popup"));
    for (const p of all) {
      if (p !== except && (p.classList.contains("is-open") || p.dataset.state)) {
        await closePopupAnimated(p);
      }
    }
  };

  // ========= セレクタ単位の初期化 =========
  const selectors = document.querySelectorAll(".js-setting-selector");

  selectors.forEach((selector) => {
    const toggleBtn = selector.querySelector(".js-setting-toggle");
    const dropdown = selector.querySelector(".js-setting-dropdown");
    const popup = selector.querySelector(".js-global-popup");
    const popupClose = popup?.querySelector(".js-global-popup-close");

    toggleBtn?.addEventListener("click", async (e) => {
      e.stopPropagation();

      if (isPC()) {
        // PC: 他のドロップダウン閉じ
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

      // SP: モーダル（ポップアップ）を開閉
      const type = toggleBtn.dataset.popupType;
      const target = type && popup ? popup.querySelector(`.js-popup-content[data-type="${type}"]`) : null;
      if (!target || !popup) return;

      // すでにこのポップアップが開いていて、かつ同じ type を表示中ならトグルとして閉じる動作
      const isSameTypeOpen = popup.classList.contains("is-open") && popup.querySelector(`.js-popup-content.is-active[data-type="${type}"]`);

      if (isSameTypeOpen) {
        await closePopupAnimated(popup);
        return;
      }

      await closeAllPopupsAnimated(popup); // 他を閉じる
      await openPopupAnimated(popup, target); // 自分を開く（SPトグルis-open付与は中で実施）
    });

    // PC: ドロップダウン内 li クリックで閉じる
    dropdown?.querySelectorAll("li").forEach((item) => {
      item.addEventListener("click", () => {
        dropdown.classList.remove("is-active");
        toggleBtn?.classList.remove("is-open");
      });
    });

    // SP: ポップアップ内リンクで閉じる（トグル is-open も外れる）
    popup?.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", async () => {
        await closePopupAnimated(popup);
      });
    });

    // SP: ×ボタン
    popupClose?.addEventListener("click", async () => {
      await closePopupAnimated(popup);
    });
  });

  // ========= 外部クリック =========
  document.addEventListener("click", async (e) => {
    if (isPC()) {
      // PC: セレクタ外クリックでドロップダウン閉じ
      document.querySelectorAll(".js-setting-selector").forEach((selector) => {
        if (!selector.contains(e.target)) {
          selector.querySelector(".js-setting-dropdown")?.classList.remove("is-active");
          selector.querySelector(".js-setting-toggle")?.classList.remove("is-open");
        }
      });
    } else {
      // SP: ポップアップ外クリックで全閉（トグル is-open も外れる）
      const opened = document.querySelector(".js-global-popup.is-open");
      if (opened && !opened.contains(e.target)) {
        await closeAllPopupsAnimated();
      }
    }
  });

  // ========= PC用：選択済み表示（is-selected） =========
  document.querySelectorAll(".js-setting-dropdown.js-setting-checked").forEach((dropdown) => {
    dropdown.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        dropdown.querySelectorAll("a").forEach((el) => el.classList.remove("is-selected"));
        link.classList.add("is-selected");
      });
    });
  });
});

// 968px以下になったら、幅の減少量に対して 0.5px/1px の割合で left を左へ寄せる
// 768〜968pxの間だけ適用（SPには影響させない）。SPにも効かせたいなら MIN=0 にしてね。
(() => {
  const MIN = 768; // 適用下限（SPに干渉させたくないので 768 に設定）
  const BASE = 968; // 基準幅（ここから下がるほど寄せる）
  const FACTOR = 0.25; // 1px縮むごとに 0.5px 寄せる

  const mq = window.matchMedia(`(min-width: ${MIN}px) and (max-width: ${BASE}px)`);
  const selector = ".header-setting__menu__detail";

  let rafId = 0;

  const apply = () => {
    rafId = 0;
    const vw = window.innerWidth; // 小数でもOK（ブラウザによっては整数）
    const shrink = Math.max(0, BASE - vw); // どれだけ 968px から小さくなったか
    const offset = shrink * FACTOR; // 0.5px/1px の割合でオフセット

    document.querySelectorAll(selector).forEach((dd) => {
      if (mq.matches) {
        // 例）vw=967 → shrink=1 → offset=0.5 → left: calc(50% - 0.5px)
        dd.style.left = `calc(50% - ${offset}px)`;
        dd.style.right = ""; // 念のためクリア
        dd.style.transform = "translateX(-50%)"; // 中央基準は維持
        // 必要ならはみ出し保険（任意）
        // dd.style.maxWidth = "calc(100vw - 24px)";
      } else {
        // レンジ外はデフォルト（中央寄せ）に戻す
        dd.style.left = "50%";
        dd.style.right = "";
        dd.style.transform = "translateX(-50%)";
        // dd.style.maxWidth = "";
      }
    });
  };

  const onResize = () => {
    if (!rafId) rafId = requestAnimationFrame(apply); // rAFで負荷を抑える
  };

  // 初期適用
  apply();

  // 幅レンジの出入りで即時再適用
  if (mq.addEventListener) mq.addEventListener("change", apply);
  else mq.addListener(apply); // 古いブラウザ用

  // リサイズ追従
  window.addEventListener("resize", onResize);
})();
// =========END header関連 =========

// topへスクロール
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".js-scroll-top").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
});
