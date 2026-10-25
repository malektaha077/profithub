const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

document.querySelector("#year").textContent = new Date().getFullYear();

const sections = document.querySelectorAll("main section[id]");
const links = document.querySelectorAll(".nav-link");
window.addEventListener("scroll", () => {
  let current = "home";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 140) current = section.id;
  });
  links.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}, { passive: true });


// Keep project previews inside Profithub instead of opening a new browser tab.
const demoModal = document.querySelector("#demoModal");
const demoFrame = document.querySelector("#demoFrame");
const demoTitle = document.querySelector("#demoTitle");
const demoBack = document.querySelector("#demoBack");
const demoClose = document.querySelector("#demoClose");
let lastFocusedProject = null;
const demoNames = {
  "demos/carverse.html": "Carverse",
  "demos/nexora.html": "Nexora",
  "demos/portfolio.html": "Portfolio Website",
  "demos/business.html": "Business Website"
};

function closeDemo() {
  if (!demoModal || demoModal.getAttribute("aria-hidden") === "true") return;
  demoModal.classList.remove("is-open");
  demoModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("demo-open");
  demoFrame.src = "about:blank";
  if (lastFocusedProject) lastFocusedProject.focus({ preventScroll: true });
}

function openDemo(card) {
  const path = card.dataset.demo;
  if (!path || !demoModal || !demoFrame) return;
  lastFocusedProject = card;
  demoTitle.textContent = demoNames[path] || "Project preview";
  demoFrame.title = `${demoTitle.textContent} project preview`;
  demoFrame.src = path;
  demoModal.classList.add("is-open");
  demoModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("demo-open");
  demoClose.focus({ preventScroll: true });
}

document.querySelectorAll(".project-card[data-demo]").forEach((card) => {
  card.addEventListener("click", (event) => {
    // Preserve normal browser behavior for open-in-new-tab shortcuts.
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    openDemo(card);
  });
});

demoBack?.addEventListener("click", closeDemo);
demoClose?.addEventListener("click", closeDemo);
demoModal?.addEventListener("click", (event) => {
  if (event.target === demoModal) closeDemo();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeDemo();
});

// Links inside demos that lead back to the main site should close the preview
// and take the visitor to the matching Profithub section.
demoFrame?.addEventListener("load", () => {
  try {
    const frameDoc = demoFrame.contentDocument;
    if (!frameDoc) return;
    frameDoc.querySelectorAll('a[href*="index.html"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href") || "";
        event.preventDefault();
        closeDemo();
        const hash = href.includes("#") ? href.slice(href.indexOf("#")) : "#portfolio";
        const target = document.querySelector(hash);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        else window.location.hash = hash;
      });
    });
  } catch (_) {
    // If the browser blocks frame access, the modal's Back to projects button still works.
  }
});
