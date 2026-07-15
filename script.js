(function () {
  "use strict";

  if (typeof gsap !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
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

    if (typeof gsap !== "undefined") {
      const mainTimeline = gsap.timeline();

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

        .from(
          ".site-header",
          {
            y: -50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
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

      if (document.querySelector(".stats")) {
        gsap.from(".stats-grid div", {
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
        gsap.from(".project-card", {
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
        gsap.from(".skills-grid > div", {
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
        gsap.from(".seo-grid > div", {
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
        gsap.from(".timeline li", {
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

      const localLinks = document.querySelectorAll("a");
      localLinks.forEach((link) => {
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
          link.addEventListener("click", (e) => {
            e.preventDefault();

            gsap.set("#preloader", { display: "flex", yPercent: 100 });
            gsap.set(".preloader-content", { opacity: 1, y: 0 });
            gsap.set(".preloader-progress", { scaleX: 1 });

            gsap.to("#preloader", {
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
    }
  });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });
})();
