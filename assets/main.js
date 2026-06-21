const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const briefModal = document.querySelector("[data-brief-modal]");
const briefOpeners = document.querySelectorAll("[data-open-brief]");
const briefClosers = document.querySelectorAll("[data-close-brief]");
let lastBriefTrigger = null;

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const openBriefModal = (trigger) => {
  if (!briefModal) return;
  lastBriefTrigger = trigger || document.activeElement;
  briefModal.classList.add("is-open");
  briefModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  briefModal.querySelector(".form-row input, .form-row textarea, .form-row select")?.focus();
};

const closeBriefModal = () => {
  if (!briefModal) return;
  briefModal.classList.remove("is-open");
  briefModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (lastBriefTrigger instanceof HTMLElement) {
    lastBriefTrigger.focus();
  }
};

briefOpeners.forEach((opener) => {
  opener.addEventListener("click", (event) => {
    event.preventDefault();
    nav?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    openBriefModal(opener);
  });
});

briefClosers.forEach((closer) => {
  closer.addEventListener("click", closeBriefModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && briefModal?.classList.contains("is-open")) {
    closeBriefModal();
  }
});

const revealTargets = [
  ".page-hero",
  ".intro-section",
  ".services .section-heading",
  ".services-page-section .section-heading",
  ".services-method-section .section-heading",
  ".services-stack-band",
  ".service-detail-section",
  ".service-outcome-section .section-heading",
  ".service-outcome-grid",
  ".service-fit-section .section-heading",
  ".service-fit-grid",
  ".about-story-section",
  ".about-process-section .section-heading",
  ".about-proof-band",
  ".portfolio-cta-band",
  ".services-panel",
  ".service-grid",
  ".services-detail-grid",
  ".method-grid",
  ".work .section-heading",
  ".work-grid",
  ".work-footer",
  ".technology .section-heading",
  ".logo-cloud",
  ".process .section-heading",
  ".process-list",
  ".about-principles"
];

document.querySelectorAll(revealTargets.join(",")).forEach((element) => {
  element.classList.add("reveal");
});

document.querySelectorAll(".service-grid, .services-detail-grid, .method-grid, .service-outcome-grid, .service-fit-grid, .about-principles, .about-proof-band, .work-grid, .logo-cloud, .process-list").forEach((group) => {
  group.classList.add("reveal-stagger");
  Array.from(group.children).forEach((child, index) => {
    child.style.setProperty("--stagger-index", index);
  });
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.14 });

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  document.querySelectorAll(".reveal").forEach((element) => {
    element.classList.add("is-visible");
  });
}

const sections = Array.from(document.querySelectorAll("main section[id]"));
const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));

if ("IntersectionObserver" in window && sections.length && navLinks.length) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const activeLink = navLinks.find((link) => link.getAttribute("href") === `#${entry.target.id}`);
      navLinks.forEach((link) => link.classList.toggle("is-active", link === activeLink));
    });
  }, { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 });

  sections.forEach((section) => navObserver.observe(section));
}

let scrollTicking = false;

const updateScrollEffects = () => {
  const scrollY = window.scrollY || 0;

  if (!motionQuery.matches) {
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const ratio = Math.min(scrollY / maxScroll, 1);
    const clampedHeroScroll = Math.min(scrollY, 900);

    document.documentElement.style.setProperty("--glow-left", `${16 + ratio * 24}%`);
    document.documentElement.style.setProperty("--glow-right", `${88 - ratio * 18}%`);
    document.documentElement.style.setProperty("--stage-drift-x", `${clampedHeroScroll * -0.04}px`);
    document.documentElement.style.setProperty("--stage-drift-y", `${clampedHeroScroll * 0.02}px`);
    document.documentElement.style.setProperty("--parallax-card", `${clampedHeroScroll * -0.018}px`);
    document.documentElement.style.setProperty("--parallax-grid", `${clampedHeroScroll * -0.012}px`);
    document.documentElement.style.setProperty("--parallax-screen-one", `${clampedHeroScroll * -0.024}px`);
    document.documentElement.style.setProperty("--parallax-screen-two", `${clampedHeroScroll * -0.04}px`);
  }

  if (header) {
    header.classList.toggle("is-scrolled", scrollY > 12);
  }

  scrollTicking = false;
};

const requestScrollUpdate = () => {
  if (scrollTicking) return;
  scrollTicking = true;
  window.requestAnimationFrame(updateScrollEffects);
};

updateScrollEffects();
window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);

const cookieStorageKey = "fxnstudio_cookie_consent";
const cookieBanner = document.createElement("section");
cookieBanner.className = "cookie-banner";
cookieBanner.setAttribute("aria-label", "Cookie notice");
cookieBanner.innerHTML = `
  <span class="cookie-banner__label">Cookie Notice</span>
  <h2>Cookies keep this site useful.</h2>
  <p>FXN Studio uses essential cookies and may use analytics cookies to understand website performance. You can accept all cookies or keep only essential cookies. Read the <a href="/cookie-information/">Cookie Information</a>.</p>
  <div class="cookie-banner__actions">
    <button class="button button-primary" type="button" data-cookie-choice="accepted">Accept all</button>
    <button class="button cookie-banner__secondary" type="button" data-cookie-choice="essential">Essential only</button>
  </div>
`;

const setCookieConsent = (choice) => {
  try {
    window.localStorage.setItem(cookieStorageKey, JSON.stringify({
      choice,
      savedAt: new Date().toISOString()
    }));
  } catch (error) {
    document.cookie = `${cookieStorageKey}=${choice}; path=/; max-age=31536000; SameSite=Lax`;
  }
  cookieBanner.classList.remove("is-visible");
};

const getCookieConsent = () => {
  try {
    return window.localStorage.getItem(cookieStorageKey);
  } catch (error) {
    return document.cookie.split("; ").find((item) => item.startsWith(`${cookieStorageKey}=`));
  }
};

if (!getCookieConsent()) {
  document.body.appendChild(cookieBanner);
  window.requestAnimationFrame(() => {
    cookieBanner.classList.add("is-visible");
  });

  cookieBanner.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("[data-cookie-choice]");
    if (!button) return;
    setCookieConsent(button.getAttribute("data-cookie-choice"));
  });
}

const form = document.querySelector("[data-contact-form]");
const status = document.querySelector("[data-form-status]");

if (form && status) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const button = form.querySelector("button[type='submit']");
    const initialText = button.textContent;
    button.disabled = true;
    button.textContent = "Sending...";
    status.textContent = "";
    status.className = "form-status";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString()
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.error) {
        throw new Error(data.error || "Message could not be sent.");
      }

      form.reset();
      status.textContent = "Message received. FXN Studio will reply within 1-2 business days.";
      status.classList.add("is-success");
    } catch (error) {
      status.textContent = (error && error.message) || "Something went wrong. Please email contact@fxnstudio.com.";
      status.classList.add("is-error");
    } finally {
      button.disabled = false;
      button.textContent = initialText;
    }
  });
}
