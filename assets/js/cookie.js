document.addEventListener("DOMContentLoaded", () => {
  const bar = document.querySelector(".cookie");
  const btn = document.querySelector(".js-cookie-close");
  const KEY = "cookieConsentAccepted";

  if (!bar || !btn) return;

  // すでに同意済みなら最初から非表示
  if (localStorage.getItem(KEY) === "1") {
    bar.style.display = "none";
    return;
  }

  const slideOut = () => {
    bar.classList.add("is-leave");

    const onEnd = (e) => {
      if (e.target !== bar) return;
      bar.removeEventListener("transitionend", onEnd);
      bar.style.display = "none";
    };

    // transition が無い（reduce等）場合の保険
    const hasTransition = getComputedStyle(bar).transitionDuration !== "0s";
    if (hasTransition) {
      bar.addEventListener("transitionend", onEnd, { once: true });
    } else {
      bar.style.display = "none";
    }
  };

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.setItem(KEY, "1");
    slideOut();
  });
});
