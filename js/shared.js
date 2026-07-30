/* ==========================================================================
   FitTrack — shared.js
   Runs on every page. Automatically marks the correct navbar link as active
   based on the current URL, so each page doesn't need a hardcoded class.
   ========================================================================== */
"use strict";

(function highlightActiveNav() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".navbar__link").forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("navbar__link--active", href === current);
  });
})();
