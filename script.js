
/* =========================================================
   ARIN STUDIO
   Main JavaScript
   ========================================================= */

(() => {
  "use strict";

  /* 01. Helpers */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const hasGSAP =
    typeof window.gsap !== "undefined" &&
    typeof window.ScrollTrigger !== "undefined";

  const isFinePointer = window.matchMedia(
    "(pointer: fine)"
  ).matches;

  /* 02. Page setup */

  const year = $("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* 03. Preloader */

  const preloader = $(".preloader");
  let preloaderRemoved = false;

  function finishLoading() {
    if (!preloader || preloaderRemoved) return;

    preloaderRemoved = true;
    preloader.classList.add("done");
    document.body.classList.remove("loading");

    window.setTimeout(() => {
      preloader.remove();
    }, 1100);
  }

  if (preloader) {
    if (document.readyState === "complete") {
      window.setTimeout(finishLoading, reduceMotion ? 0 : 350);
    } else {
      window.addEventListener(
        "load",
        () => {
          window.setTimeout(finishLoading, reduceMotion ? 0 : 350);
        },
        { once: true }
      );
    }

    // Safety fallback if external resources load slowly.
    window.setTimeout(finishLoading, 3000);
  }

  /* 04. Mobile navigation */

  const nav = $(".nav");
  const menuToggle = $(".menu-toggle");
  const navLinks = $$(".nav-links a");

  function closeMenu() {
    if (!nav || !menuToggle) return;

    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "Menu +";
  }

  if (nav && menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.textContent = isOpen ? "Close −" : "Menu +";
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target)) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 700) {
        closeMenu();
      }
    });
  }

  /* 05. Portfolio filters */

  const filterButtons = $$(".filter");
  const projects = $$(".project");

  function filterProjects(category) {
    projects.forEach((project) => {
      const matches =
        category === "all" ||
        project.dataset.category === category;

      project.classList.toggle("hidden", !matches);
    });

    filterButtons.forEach((button) => {
      const active = button.dataset.filter === category;

      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    // Refresh scroll measurements after the layout changes.
    if (window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterProjects(button.dataset.filter || "all");
    });
  });

  /* 06. Contact form */

  const form = $("#enquiry-form");
  const formMessage = $("#form-message");

  // Replace this with the photographer's real email address.
  const CONTACT_EMAIL = "hello@arinstudio.example";

  if (form && formMessage) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      const data = new FormData(form);

      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const service = String(data.get("service") || "").trim();
      const message = String(data.get("message") || "").trim();

      if (!name || !email || !service) {
        formMessage.textContent =
          "Please complete all required fields.";

        formMessage.classList.add("visible");
        return;
      }

      const subject = encodeURIComponent(
        `Photography enquiry from ${name}`
      );

      const body = encodeURIComponent(
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Service: ${service}\n\n` +
        `Message:\n${message || "Not provided"}`
      );

      formMessage.textContent =
        "Your email app will open with your enquiry. Review the draft and send it to complete your enquiry.";

      formMessage.classList.add("visible");

      window.location.href =
        `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    });
  }

  /* 07. Back-to-top button */

  const backTop = $(".back-top");

  if (backTop) {
    backTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });
  }

  
  /* 09. Accessible, non-animated fallback */

  function showEverything() {
    $$(".reveal").forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "none";
    });

    $$(".image-reveal").forEach((element) => {
      element.style.clipPath = "none";

      const image = $("img", element);

      if (image) {
        image.style.transform = "none";
      }
    });

    $$(".hero-title .line > span").forEach((element) => {
      element.style.transform = "none";
    });

    $$("[data-count]").forEach((element) => {
      element.textContent = `${element.dataset.count}+`;
    });
  }

  if (reduceMotion || !hasGSAP) {
    showEverything();
    return;
  }


/* Cinematic wedding film player */

const weddingFilm = document.querySelector("#wedding-film");
const filmOverlay = document.querySelector("#film-overlay");
const filmPlay = document.querySelector("#film-play");
const filmSound = document.querySelector("#film-sound");

if (weddingFilm && filmOverlay && filmPlay && filmSound) {
  filmPlay.addEventListener("click", async () => {
    try {
      weddingFilm.muted = false;
      weddingFilm.volume = 0.8;
      await weddingFilm.play();

      filmOverlay.classList.add("is-hidden");
      filmSound.hidden = false;
      filmSound.textContent = "Sound on";
      filmSound.setAttribute("aria-pressed", "true");
    } catch (error) {
      filmOverlay.classList.remove("is-hidden");
      filmPlay.setAttribute("aria-label", "Play wedding film with sound");
      console.error("Wedding film could not start:", error);
    }
  });

  filmSound.addEventListener("click", () => {
    weddingFilm.muted = !weddingFilm.muted;

    filmSound.textContent = weddingFilm.muted
      ? "Sound off"
      : "Sound on";

    filmSound.setAttribute(
      "aria-pressed",
      String(!weddingFilm.muted)
    );
  });

  weddingFilm.addEventListener("ended", () => {
    filmOverlay.classList.remove("is-hidden");
    filmSound.hidden = true;
    filmPlay.setAttribute("aria-label", "Replay wedding film");
  });

  weddingFilm.addEventListener("error", () => {
    filmOverlay.classList.remove("is-hidden");
    filmPlay.setAttribute(
      "aria-label",
      "Wedding film unavailable. Check the video file."
    );
  });
}

  
  /* 10. GSAP setup */

  try {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    gsap.registerPlugin(ScrollTrigger);

    /* 11. Smooth scrolling with Lenis */

    let lenis = null;

    if (typeof window.Lenis === "function") {
      lenis = new window.Lenis({
        duration: 1.05,
        easing: (time) =>
          Math.min(1, 1.001 - Math.pow(2, -10 * time)),
        smoothWheel: true,
      });

      lenis.on("scroll", ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    }

    /* 12. Hero entrance */

    gsap.to(".hero-title .line > span", {
      y: 0,
      duration: 1.2,
      stagger: 0.16,
      ease: "power4.out",
      delay: 0.45,
    });

    gsap.to(".hero-photo-wrap", {
      rotation: 0,
      scale: 1,
      duration: 1.6,
      ease: "power3.out",
      delay: 0.3,
    });

    gsap.to(".hero-photo", {
      scale: 1,
      yPercent: -8,
      duration: 1.8,
      ease: "power2.out",
      delay: 0.2,
    });

    gsap.to(".hero-photo-wrap", {
      yPercent: 18,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    gsap.to(".hero-title", {
      yPercent: -22,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    /* 13. Text reveals */

    gsap.utils.toArray(".reveal").forEach((element) => {
      gsap.fromTo(
        element,
        {
          y: 36,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true,
          },
        }
      );
    });

    /* 14. Image reveals and image movement */

    gsap.utils.toArray(".image-reveal").forEach((element) => {
      gsap.to(element, {
        clipPath: "inset(0 0 0% 0)",
        duration: 1.15,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: element,
          start: "top 82%",
          once: true,
        },
      });

      const image = $("img", element);

      if (image) {
        gsap.to(image, {
          scale: 1,
          yPercent: -5,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 82%",
            once: true,
          },
        });
      }
    });

    /* 15. Parallax */

    gsap.utils.toArray(".parallax").forEach((element) => {
      gsap.to(element, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    });

    /* 16. Number counters */

    gsap.utils.toArray("[data-count]").forEach((element) => {
      const target = Number(element.dataset.count);

      ScrollTrigger.create({
        trigger: element,
        start: "top 90%",
        once: true,

        onEnter: () => {
          const counter = { value: 0 };

          gsap.to(counter, {
            value: target,
            duration: 1.6,
            ease: "power2.out",

            onUpdate: () => {
              element.textContent =
                `${Math.round(counter.value)}+`;
            },
          });
        },
      });
    });

    /* 17. Service list entrance */

    gsap.utils.toArray(".service").forEach((element, index) => {
      gsap.from(element, {
        x: index % 2 === 0 ? -35 : 35,
        autoAlpha: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
          once: true,
        },
      });
    });

    /* 18. Keep filtered layouts in sync */

    ScrollTrigger.refresh();

  } catch (error) {
    console.error("Arin Studio animations could not initialise:", error);

    // Keep the website usable even if animation setup fails.
    showEverything();
  }

})();
