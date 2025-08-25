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
