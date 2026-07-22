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

    if (hasGsap) {
      try {
        if (document.querySelector(".hero")) {
          window.gsap.set(
            ".hero .eyebrow, .hero h1, .hero-text, .hero-actions .btn, .profile-card",
            {
              opacity: 0,
              y: 35,
            },
          );
        }

        if (document.querySelector(".page-hero")) {
          window.gsap.set(".page-hero .eyebrow, .page-hero h1, .page-hero p", {
            opacity: 0,
            y: 35,
          });
        }

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
            .to(
              ".hero .eyebrow",
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                clearProps: "transform,opacity",
              },
              "-=0.5",
            )
            .to(
              ".hero h1",
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                clearProps: "transform,opacity",
              },
              "-=0.65",
            )
            .to(
              ".hero-text",
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                clearProps: "transform,opacity",
              },
              "-=0.65",
            )
            .to(
              ".hero-actions .btn",
              {
                y: 0,
                opacity: 1,
                stagger: 0.15,
                duration: 0.7,
                ease: "power3.out",
                clearProps: "transform,opacity",
              },
              "-=0.65",
            )
            .to(
              ".profile-card",
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                clearProps: "transform,opacity",
              },
              "-=0.7",
            );
        }

        if (document.querySelector(".page-hero")) {
          mainTimeline
            .to(
              ".page-hero .eyebrow",
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                clearProps: "transform,opacity",
              },
              "-=0.5",
            )
            .to(
              ".page-hero h1",
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                clearProps: "transform,opacity",
              },
              "-=0.65",
            )
            .to(
              ".page-hero p",
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                clearProps: "transform,opacity",
              },
              "-=0.65",
            );
        }

        if (hasScrollTrigger) {
          const statsEl = document.querySelector(".stats");
          if (statsEl && document.querySelector(".stats-grid div")) {
            window.gsap.from(".stats-grid div", {
              scrollTrigger: {
                trigger: statsEl,
                start: "top 85%",
              },
              y: 30,
              opacity: 0,
              stagger: 0.1,
              duration: 0.8,
              ease: "power2.out",
              clearProps: "transform,opacity",
            });
          }

          const projectGridEl = document.querySelector(".project-grid");
          if (
            projectGridEl &&
            document.querySelector(
              ".project-grid > .project-card:not([style*='display: none'])",
            )
          ) {
            window.gsap.from(
              ".project-grid > .project-card:not([style*='display: none'])",
              {
                scrollTrigger: {
                  trigger: projectGridEl,
                  start: "top 80%",
                },
                y: 35,
                opacity: 0,
                stagger: 0.12,
                duration: 0.7,
                ease: "power3.out",
                clearProps: "transform,opacity",
              },
            );
          }

          const contactGridEl = document.querySelector(".contact-layout-grid");
          if (contactGridEl && document.querySelector(".contact-layout-grid > div")) {
            window.gsap.from(".contact-layout-grid > div", {
              scrollTrigger: {
                trigger: contactGridEl,
                start: "top 85%",
              },
              y: 40,
              opacity: 0,
              stagger: 0.15,
              duration: 0.8,
              ease: "power3.out",
              clearProps: "transform,opacity",
            });

            if (document.querySelector(".contact-info-item")) {
              window.gsap.from(".contact-info-item", {
                scrollTrigger: {
                  trigger: document.querySelector(".contact-info-list") || contactGridEl,
                  start: "top 85%",
                },
                y: 25,
                opacity: 0,
                stagger: 0.1,
                duration: 0.6,
                ease: "power2.out",
                clearProps: "transform,opacity",
              });
            }
          }

          const contactCardEl = document.querySelector(".contact-card");
          if (contactCardEl && !document.querySelector(".contact-layout-grid")) {
            window.gsap.from(".contact-card", {
              scrollTrigger: {
                trigger: document.querySelector(".contact") || contactCardEl,
                start: "top 85%",
              },
              y: 40,
              opacity: 0,
              duration: 0.8,
              ease: "power3.out",
              clearProps: "transform,opacity",
            });
          }

          const principlesGridEl = document.querySelector(".principles-grid");
          if (principlesGridEl && document.querySelector(".principles-grid > div")) {
            window.gsap.from(".principles-grid > div", {
              scrollTrigger: {
                trigger: principlesGridEl,
                start: "top 80%",
              },
              y: 40,
              opacity: 0,
              stagger: 0.15,
              duration: 0.8,
              ease: "power3.out",
              clearProps: "transform,opacity",
            });
          }

          const writingTriggerEl =
            document.querySelector(".writing-grid") ||
            document.querySelector(".blog-list");
          if (
            writingTriggerEl &&
            document.querySelector(
              ".writing-grid > article, .blog-list > article, .blog-list > div",
            )
          ) {
            window.gsap.from(
              ".writing-grid > article, .blog-list > article, .blog-list > div",
              {
                scrollTrigger: {
                  trigger: writingTriggerEl,
                  start: "top 80%",
                },
                y: 40,
                opacity: 0,
                stagger: 0.15,
                duration: 0.8,
                ease: "power3.out",
                clearProps: "transform,opacity",
              },
            );
          }

          const expListEl = document.querySelector(".experience-list");
          if (expListEl && document.querySelector(".experience-card")) {
            window.gsap.from(".experience-card", {
              scrollTrigger: {
                trigger: expListEl,
                start: "top 80%",
              },
              y: 35,
              opacity: 0,
              stagger: 0.15,
              duration: 0.8,
              ease: "power3.out",
              clearProps: "transform,opacity",
            });
          }

          const resumeTimelineEl = document.querySelector(".resume-timeline");
          if (resumeTimelineEl && document.querySelector(".timeline-card")) {
            window.gsap.from(".timeline-card", {
              scrollTrigger: {
                trigger: resumeTimelineEl,
                start: "top 80%",
              },
              y: 35,
              opacity: 0,
              stagger: 0.15,
              duration: 0.8,
              ease: "power3.out",
              clearProps: "transform,opacity",
            });
          }

          const articleTarget = document.querySelector(
            ".article-container, .related-reading-box",
          );
          if (articleTarget) {
            window.gsap.from(".article-container, .related-reading-box", {
              scrollTrigger: {
                trigger: document.querySelector("main") || articleTarget,
                start: "top 75%",
              },
              y: 35,
              opacity: 0,
              stagger: 0.2,
              duration: 0.8,
              ease: "power3.out",
              clearProps: "transform,opacity",
            });
          }
        }

        document.querySelectorAll("a").forEach((link) => {
          const href = link.getAttribute("href");
          const target = link.getAttribute("target");

          const isInternalPage =
            href &&
            !href.startsWith("#") &&
            !href.startsWith("mailto:") &&
            !href.startsWith("tel:") &&
            !href.startsWith("javascript:") &&
            !href.endsWith(".pdf") &&
            !href.endsWith(".png") &&
            !href.endsWith(".jpg") &&
            target !== "_blank" &&
            ((!href.startsWith("http://") && !href.startsWith("https://")) ||
              href.startsWith(window.location.origin));

          if (isInternalPage) {
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

        const tabButtons = document.querySelectorAll(".project-tabs .tab-btn");
        const projectCards = document.querySelectorAll(
          ".project-grid .project-card",
        );

        if (tabButtons.length > 0 && projectCards.length > 0) {
          tabButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
              const filter = btn.getAttribute("data-filter");

              tabButtons.forEach((b) => b.classList.remove("active"));
              btn.classList.add("active");

              projectCards.forEach((card) => {
                const category = card.getAttribute("data-category");
                if (filter === "all" || category === filter) {
                  card.style.display = "block";
                  if (window.gsap) {
                    window.gsap.fromTo(
                      card,
                      { opacity: 0, y: 15 },
                      {
                        opacity: 1,
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out",
                        clearProps: "transform,opacity",
                      },
                    );
                  }
                } else {
                  card.style.display = "none";
                }
              });
            });
          });
        }

        const tabRecruiter = document.getElementById("tab-recruiter");
        const tabProject = document.getElementById("tab-project");
        const panelRecruiter = document.getElementById("panel-recruiter");
        const panelProject = document.getElementById("panel-project");

        if (tabRecruiter && tabProject && panelRecruiter && panelProject) {
          function switchContactTab(
            activeTab,
            activePanel,
            inactiveTab,
            inactivePanel,
          ) {
            activeTab.setAttribute("aria-selected", "true");
            inactiveTab.setAttribute("aria-selected", "false");
            activePanel.hidden = false;
            inactivePanel.hidden = true;
          }

          tabRecruiter.addEventListener("click", () => {
            switchContactTab(
              tabRecruiter,
              panelRecruiter,
              tabProject,
              panelProject,
            );
          });

          tabProject.addEventListener("click", () => {
            switchContactTab(
              tabProject,
              panelProject,
              tabRecruiter,
              panelRecruiter,
            );
          });
        }

        function setupContactForm(
          formId,
          hpId,
          mathId,
          errMathId,
          alertId,
          formType,
        ) {
          const form = document.getElementById(formId);
          if (!form) return;

          form.addEventListener("submit", (e) => {
            e.preventDefault();

            const hpInput = document.getElementById(hpId);
            const mathInput = document.getElementById(mathId);
            const errMath = document.getElementById(errMathId);
            const alertBox = document.getElementById(alertId);

            if (hpInput && hpInput.value.trim() !== "") {
              console.warn("Spam bot submission blocked.");
              if (alertBox) {
                alertBox.className = "form-status-alert error";
                alertBox.textContent =
                  "Submission rejected by anti-spam verification.";
                alertBox.style.display = "flex";
              }
              return;
            }

            let isValid = true;
            form
              .querySelectorAll(".is-invalid")
              .forEach((el) => el.classList.remove("is-invalid"));
            form.querySelectorAll(".field-error-msg").forEach((el) => {
              el.style.display = "none";
              el.textContent = "";
            });
            if (alertBox) alertBox.style.display = "none";

            const nameInput = form.querySelector('[name="name"]');
            const emailInput = form.querySelector('[name="email"]');
            const messageInput = form.querySelector('[name="message"]');
            const typeSelect = form.querySelector("select[required]");

            if (nameInput && !nameInput.value.trim()) {
              isValid = false;
              nameInput.classList.add("is-invalid");
              const err = form.querySelector("#err-" + nameInput.id);
              if (err) {
                err.textContent = "Please enter your name.";
                err.style.display = "block";
              }
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (
              emailInput &&
              (!emailInput.value.trim() ||
                !emailRegex.test(emailInput.value.trim()))
            ) {
              isValid = false;
              emailInput.classList.add("is-invalid");
              const err = form.querySelector("#err-" + emailInput.id);
              if (err) {
                err.textContent = "Please enter a valid email address.";
                err.style.display = "block";
              }
            }

            if (typeSelect && !typeSelect.value) {
              isValid = false;
              typeSelect.classList.add("is-invalid");
              const err = form.querySelector("#err-" + typeSelect.id);
              if (err) {
                err.textContent = "Please select an option.";
                err.style.display = "block";
              }
            }

            if (messageInput && !messageInput.value.trim()) {
              isValid = false;
              messageInput.classList.add("is-invalid");
              const err = form.querySelector("#err-" + messageInput.id);
              if (err) {
                err.textContent = "Please enter your message details.";
                err.style.display = "block";
              }
            }

            if (mathInput) {
              const mathAns = parseInt(mathInput.value.trim(), 10);
              if (isNaN(mathAns) || mathAns !== 7) {
                isValid = false;
                mathInput.classList.add("is-invalid");
                if (errMath) {
                  errMath.textContent =
                    "Incorrect security answer. Please solve 4 + 3 = 7.";
                  errMath.style.display = "block";
                }
              }
            }

            if (!isValid) return;

            const nameVal = nameInput ? nameInput.value.trim() : "";
            const emailVal = emailInput ? emailInput.value.trim() : "";
            const messageVal = messageInput ? messageInput.value.trim() : "";
            const typeVal = typeSelect ? typeSelect.value : "";

            let subject = "";
            let body = "";

            if (formType === "recruiter") {
              const companyInput = form.querySelector('[name="company"]');
              const companyVal = companyInput ? companyInput.value.trim() : "";
              subject = encodeURIComponent(
                `[Engineering Opportunity] ${typeVal} - ${companyVal || nameVal}`,
              );
              body = encodeURIComponent(
                `Hi Adrin,\n\nName: ${nameVal}\nWork Email: ${emailVal}\nCompany: ${companyVal || "N/A"}\nOpportunity Type: ${typeVal}\n\nMessage Details:\n${messageVal}\n\nSent from Portfolio Contact Page.`,
              );
            } else {
              const timelineSelect = form.querySelector('[name="timeline"]');
              const timelineVal = timelineSelect ? timelineSelect.value : "";
              subject = encodeURIComponent(
                `[Project Inquiry] ${typeVal} - ${nameVal}`,
              );
              body = encodeURIComponent(
                `Hi Adrin,\n\nName: ${nameVal}\nEmail: ${emailVal}\nProject Scope: ${typeVal}\nTimeline/Budget: ${timelineVal || "N/A"}\n\nProject Overview:\n${messageVal}\n\nSent from Portfolio Contact Page.`,
              );
            }

            if (alertBox) {
              alertBox.className = "form-status-alert success";
              alertBox.innerHTML = `<span>Thank you, <strong>${nameVal}</strong>! Your inquiry details are ready. Opening your mail app to send directly...</span>`;
              alertBox.style.display = "flex";
            }

            window.setTimeout(() => {
              window.location.href = `mailto:adrinshrestha16@gmail.com?subject=${subject}&body=${body}`;
              form.reset();
            }, 800);
          });
        }

        setupContactForm(
          "recruiter-form",
          "rec-hp-website",
          "rec-math-check",
          "err-rec-math",
          "rec-status-alert",
          "recruiter",
        );
        setupContactForm(
          "project-form",
          "proj-hp-website",
          "proj-math-check",
          "err-proj-math",
          "project-status-alert",
          "project",
        );
      } catch (error) {
        console.error("Animation initialization failed:", error);
        hidePreloader(false);
      }
    } else {
      hidePreloader(false);
    }

    function trackAnalyticsEvent(eventName, eventParams) {
      if (typeof window.gtag === "function") {
        window.gtag("event", eventName, eventParams);
      }
      if (typeof window.plausible === "function") {
        window.plausible(eventName, { props: eventParams });
      }
      window.dispatchEvent(
        new CustomEvent("adrin:analytics", {
          detail: { eventName, params: eventParams },
        }),
      );
      try {
        const storageKey = `metric_${eventName}`;
        const count =
          parseInt(sessionStorage.getItem(storageKey) || "0", 10) + 1;
        sessionStorage.setItem(storageKey, count.toString());
        console.log(
          `[Analytics Tracked] ${eventName}:`,
          eventParams,
          `(Session total: ${count})`,
        );
      } catch (e) {
        console.log(`[Analytics Tracked] ${eventName}:`, eventParams);
      }
    }

    function trackResumeView() {
      trackAnalyticsEvent("resume_view", {
        page_location: window.location.href,
        page_title: document.title,
        format: "HTML",
      });
    }

    function trackResumeDownload(sourceElement) {
      const linkUrl = sourceElement
        ? sourceElement.getAttribute("href")
        : "resume.pdf";
      const clickId = sourceElement
        ? sourceElement.id ||
          sourceElement.getAttribute("data-track") ||
          "pdf-link"
        : "resume-download";
      trackAnalyticsEvent("resume_download", {
        file_name: "Adrin_Shrestha_Resume.pdf",
        file_extension: "pdf",
        link_url: linkUrl,
        source_id: clickId,
        format: "PDF",
      });
    }

    const isResumePage =
      document.body.getAttribute("data-page") === "resume" ||
      window.location.pathname.endsWith("/resume") ||
      window.location.pathname.endsWith("/resume.html");

    if (isResumePage) {
      trackResumeView();
    }

    document.body.addEventListener("click", (event) => {
      const downloadTarget = event.target.closest(
        'a[href*="resume.pdf"], [data-track="resume-download"]',
      );
      if (downloadTarget) {
        trackResumeDownload(downloadTarget);
      }
    });

    function initFooterTime() {
      const timeEl = document.getElementById("footer-local-time");
      if (!timeEl) return;

      function updateTime() {
        try {
          const now = new Date();
          const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: "Asia/Kathmandu",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
          timeEl.textContent = `${formatter.format(now)} NPT`;
        } catch (e) {
          timeEl.textContent = "NPT (UTC+5:45)";
        }
      }

      updateTime();
      setInterval(updateTime, 30000);
    }

    initFooterTime();

    const backToTopBtn = document.getElementById("back-to-top");
    if (backToTopBtn) {
      backToTopBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
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
