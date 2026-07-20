(function () {
  "use strict";

  const PRELOADER_FAILSAFE_MS = 4000;
  let preloaderFailsafeId = null;

  function clearPreloaderFailsafe() {
    if (preloaderFailsafeId !== null) {
      window.clearTimeout(preloaderFailsafeId);
      preloaderFailsafeId = null;
    }
  }

  function hidePreloader(immediate) {
    const preloader = document.getElementById("preloader");
    clearPreloaderFailsafe();

    if (!preloader) {
      return;
    }

    if (immediate) {
      preloader.style.display = "none";
      preloader.style.opacity = "0";
      preloader.style.visibility = "hidden";
      preloader.style.pointerEvents = "none";
      return;
    }

    preloader.classList.add("is-hidden");

    window.setTimeout(() => {
      preloader.style.display = "none";
    }, 650);
  }

  function startPreloaderFailsafe() {
    clearPreloaderFailsafe();
    preloaderFailsafeId = window.setTimeout(() => {
      hidePreloader(false);
    }, PRELOADER_FAILSAFE_MS);
  }

  
  
  startPreloaderFailsafe();

  const hasGsap = typeof window.gsap !== "undefined";
  const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";

  if (hasGsap && hasScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
  }

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

      document.addEventListener("mousemove", (event) => {
        if (tick) {
          return;
        }

        tick = true;
        window.requestAnimationFrame(() => {
          cursorGlow.style.transform = `translate3d(${event.clientX - 130}px, ${event.clientY - 130}px, 0)`;
          cursorGlow.style.opacity = "1";
          tick = false;
        });
      });

      document.addEventListener("mouseleave", () => {
        cursorGlow.style.opacity = "0";
      });
    }

    if (!hasGsap) {
      hidePreloader(false);
      return;
    }

    try {
      const mainTimeline = window.gsap.timeline();

      mainTimeline
        .to(".preloader-progress", {
          scaleX: 1,
          duration: 1.2,
          ease: "power2.inOut",
        })
        .to(".preloader-content", {
          opacity: 0,
          y: -20,
          duration: 0.4,
          ease: "power2.in",
        })
        .to("#preloader", {
          yPercent: -100,
          duration: 0.8,
          ease: "power4.inOut",
        })
        .set("#preloader", { display: "none" })
        .call(clearPreloaderFailsafe)
        .from(
          ".site-header",
          {
            y: -50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "transform,opacity",
          },
          "-=0.4",
        );

      if (document.querySelector(".hero")) {
        mainTimeline
          .from(
            ".hero .eyebrow",
            {
              y: 30,
              opacity: 0,
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.6",
          )
          .from(
            ".hero h1",
            {
              y: 40,
              opacity: 0,
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.7",
          )
          .from(
            ".hero-text",
            {
              y: 30,
              opacity: 0,
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.7",
          )
          .from(
            ".hero-actions .btn",
            {
              y: 25,
              opacity: 0,
              stagger: 0.15,
              duration: 0.7,
              ease: "power3.out",
            },
            "-=0.7",
          )
          .from(
            ".profile-card",
            {
              scale: 0.95,
              opacity: 0,
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.8",
          );
      }

      if (document.querySelector(".page-hero")) {
        mainTimeline
          .from(
            ".page-hero .eyebrow",
            {
              y: 25,
              opacity: 0,
              duration: 0.7,
              ease: "power3.out",
            },
            "-=0.6",
          )
          .from(
            ".page-hero h1",
            {
              y: 30,
              opacity: 0,
              duration: 0.7,
              ease: "power3.out",
            },
            "-=0.65",
          )
          .from(
            ".page-hero p",
            {
              y: 20,
              opacity: 0,
              duration: 0.7,
              ease: "power3.out",
            },
            "-=0.7",
          );
      }

      if (hasScrollTrigger) {
        if (document.querySelector(".stats")) {
          window.gsap.from(".stats-grid div", {
            scrollTrigger: {
              trigger: ".stats",
              start: "top 85%",
            },
            y: 30,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: "power2.out",
          });
        }

        if (document.querySelector("#projects")) {
          window.gsap.from(".project-card", {
            scrollTrigger: {
              trigger: "#projects",
              start: "top 80%",
            },
            y: 50,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power3.out",
          });
        }

        if (document.querySelector("#skills")) {
          window.gsap.from(".skills-grid > div", {
            scrollTrigger: {
              trigger: "#skills",
              start: "top 80%",
            },
            y: 40,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power3.out",
          });
        }

        if (document.querySelector("#seo")) {
          window.gsap.from(".seo-grid > div", {
            scrollTrigger: {
              trigger: "#seo",
              start: "top 80%",
            },
            y: 40,
            opacity: 0,
            stagger: 0.2,
            duration: 0.8,
            ease: "power3.out",
          });
        }

        if (document.querySelector("#experience")) {
          window.gsap.from(".timeline li", {
            scrollTrigger: {
              trigger: "#experience",
              start: "top 80%",
            },
            x: -40,
            opacity: 0,
            stagger: 0.2,
            duration: 0.8,
            ease: "power2.out",
          });
        }
      }

      document.querySelectorAll("a").forEach((link) => {
        const href = link.getAttribute("href");
        const target = link.getAttribute("target");

        if (
          href &&
          !href.startsWith("#") &&
          !href.startsWith("mailto:") &&
          !href.startsWith("tel:") &&
          target !== "_blank" &&
          (href.endsWith(".html") ||
            href.includes(".html#") ||
            href === "index.html")
        ) {
          link.addEventListener("click", (event) => {
            const preloader = document.getElementById("preloader");

            if (!preloader) {
              return;
            }

            event.preventDefault();
            preloader.classList.remove("is-hidden");
            preloader.style.visibility = "visible";
            preloader.style.pointerEvents = "auto";

            window.gsap.set(preloader, {
              display: "flex",
              opacity: 1,
              yPercent: 100,
            });
            window.gsap.set(".preloader-content", { opacity: 1, y: 0 });
            window.gsap.set(".preloader-progress", { scaleX: 1 });

            window.gsap.to(preloader, {
              yPercent: 0,
              duration: 0.6,
              ease: "power3.inOut",
              onComplete: () => {
                window.location.href = href;
              },
            });
          });
        }
      });
    } catch (error) {
      console.error("Animation initialization failed:", error);
      hidePreloader(false);
    }
  });

  
  
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      hidePreloader(true);

      const links = document.querySelector(".nav-links");
      const toggle = document.querySelector(".menu-toggle");

      if (links) {
        links.classList.remove("open");
      }

      if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
      }
    }
  });
})();
