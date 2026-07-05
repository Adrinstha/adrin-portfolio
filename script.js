(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector(".menu-toggle");
    const links = document.querySelector(".nav-links");

    if (toggle && links) {
      toggle.addEventListener("click", () => {
        const isOpen = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", isOpen.toString());
      });

      links.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          links.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }
    const cursorGlow = document.querySelector(".cursor-glow");

    if (cursorGlow) {
      let tick = false;
      document.addEventListener("mousemove", (e) => {
        if (!tick) {
          window.requestAnimationFrame(() => {
            cursorGlow.style.transform = `translate3d(${e.clientX - 130}px, ${e.clientY - 130}px, 0)`;
            cursorGlow.style.opacity = "1";
            tick = false;
          });
          tick = true;
        }
      });

      document.addEventListener("mouseleave", () => {
        cursorGlow.style.opacity = "0";
      });
    }
  });
})();
