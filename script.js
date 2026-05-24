const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const tabs = document.querySelectorAll("[data-menu-target]");
const panels = document.querySelectorAll("[data-menu-panel]");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.menuTarget;

    tabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.menuPanel === target;
      panel.classList.toggle("active", isActive);
      panel.hidden = !isActive;
    });
  });
});

const lightboxTriggers = Array.from(document.querySelectorAll(".lightbox-trigger"));
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxCaption = document.querySelector(".lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");
const lightboxPlaceholder = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
let activeLightboxIndex = 0;
let lastFocusedGalleryItem = null;

const updateLightbox = (index) => {
  if (!lightboxImage || !lightboxCaption || lightboxTriggers.length === 0) {
    return;
  }

  activeLightboxIndex = (index + lightboxTriggers.length) % lightboxTriggers.length;
  const item = lightboxTriggers[activeLightboxIndex];
  const image = item.querySelector("img");
  const caption = item.dataset.caption || image?.alt || "";

  lightboxImage.src = item.dataset.full || image?.src || "";
  lightboxImage.alt = image?.alt || caption;
  lightboxCaption.textContent = caption;
};

const openLightbox = (index, trigger) => {
  if (!lightbox) {
    return;
  }

  lastFocusedGalleryItem = trigger;
  updateLightbox(index);
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
  lightboxClose?.focus();
};

const closeLightbox = () => {
  if (!lightbox || lightbox.hidden) {
    return;
  }

  lightbox.hidden = true;
  document.body.classList.remove("lightbox-open");
  lightboxImage.src = lightboxPlaceholder;
  lastFocusedGalleryItem?.focus();
};

lightboxTriggers.forEach((trigger, index) => {
  trigger.addEventListener("click", () => openLightbox(index, trigger));
  trigger.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(index, trigger);
    }
  });
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrev?.addEventListener("click", () => updateLightbox(activeLightboxIndex - 1));
lightboxNext?.addEventListener("click", () => updateLightbox(activeLightboxIndex + 1));

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!lightbox || lightbox.hidden) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    updateLightbox(activeLightboxIndex - 1);
  }

  if (event.key === "ArrowRight") {
    updateLightbox(activeLightboxIndex + 1);
  }
});
