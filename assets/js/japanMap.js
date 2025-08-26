// data-pref の取り出し（appeal側は属性名の表記ゆれにも対応）
const getPref = (el) => el?.dataset?.pref ?? el?.dataset?.prefAppeal ?? el?.getAttribute?.("data-pref-appeal");

const showAppeal = (pref) => {
  if (!pref) return;
  document.querySelectorAll(".js-pref-appeal").forEach((el) => {
    el.classList.toggle("is-show", getPref(el) === pref);
  });
};

// イベント委譲：SVG内の <path> に乗っても .js-pref-area を拾える
document.addEventListener("mouseover", (e) => {
  const anchor = e.target.closest(".js-pref-area");
  if (anchor) showAppeal(getPref(anchor));
});

// キーボード操作・タップでも反応させる
document.addEventListener("focusin", (e) => {
  const anchor = e.target.closest(".js-pref-area");
  if (anchor) showAppeal(getPref(anchor));
});
document.addEventListener(
  "touchstart",
  (e) => {
    const anchor = e.target.closest(".js-pref-area");
    if (anchor) showAppeal(getPref(anchor));
  },
  { passive: true }
);

document.addEventListener("DOMContentLoaded", () => {
  const qAll = (sel) => Array.from(document.querySelectorAll(sel));

  const findAreasByPref = (pref) => qAll(`.js-pref-area[data-pref="${pref}"]`);
  const findLabelsByPref = (pref) => qAll(`.js-pref-area-label[data-pref="${pref}"]`);

  const setSyncHover = (pref, on) => {
    findAreasByPref(pref).forEach((el) => el.classList.toggle("is-hover", on));
    findLabelsByPref(pref).forEach((el) => el.classList.toggle("is-hover", on));
  };

  const bind = (nodes) => {
    nodes.forEach((el) => {
      const pref = el.getAttribute("data-pref");
      // マウス
      el.addEventListener("mouseenter", () => setSyncHover(pref, true));
      el.addEventListener("mouseleave", () => setSyncHover(pref, false));
      // キーボード操作対応
      el.addEventListener("focusin", () => setSyncHover(pref, true));
      el.addEventListener("focusout", () => setSyncHover(pref, false));
    });
  };

  bind(qAll(".js-pref-area")); // 地図側 → ラベルに反映
  bind(qAll(".js-pref-area-label")); // ラベル側 → 地図に反映
});

document.addEventListener("DOMContentLoaded", () => {
  const labels = document.querySelectorAll(".js-pref-area-label");
  const appeals = document.querySelectorAll(".js-pref-appeal");

  labels.forEach((label) => {
    label.addEventListener("click", (e) => {
      e.preventDefault();
      const key = label.dataset.pref;
      console.log(key);

      appeals.forEach((ap) => {
        if (ap.dataset.prefAppeal === key) {
          ap.classList.add("is-show");
        } else {
          ap.classList.remove("is-show");
        }
      });
    });
  });
});
