(function () {
  "use strict";

  function getOverlay() {
    return document.getElementById("bftLoadingOverlay");
  }

  function show(message) {
    const overlay = getOverlay();
    if (!overlay) return;
    const label = overlay.querySelector(".bft-loading-label");
    if (label && message) label.textContent = message;
    overlay.classList.remove("is-hidden");
    overlay.setAttribute("aria-hidden", "false");
  }

  function hide() {
    const overlay = getOverlay();
    if (!overlay) return;
    overlay.classList.add("is-hidden");
    overlay.setAttribute("aria-hidden", "true");
  }

  window.BFT_LOADING = { show, hide };
})();