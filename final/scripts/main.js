/**
 * main.js — Shared site behaviors for Chatsqui API Solutions
 * Handles: hamburger navigation, footer year, last modified, visit banner
 */

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  updateFooterMeta();
  displayVisitMessage();
});

/**
 * Mobile hamburger toggle with aria-expanded for accessibility
 */
function setupNavigation() {
  const menuButton = document.getElementById("menu-button");
  const primaryNav = document.getElementById("primary-nav");

  if (!menuButton || !primaryNav) return;

  menuButton.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.classList.toggle("open", isOpen);
  });

  // Close menu after activating a nav link (mobile UX)
  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 1024px)").matches) {
        primaryNav.classList.remove("open");
        menuButton.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  });
}

/**
 * Inject dynamic copyright year and document lastModified timestamp
 */
function updateFooterMeta() {
  const yearEl = document.getElementById("year");
  const lastModifiedEl = document.getElementById("lastModified");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  if (lastModifiedEl) {
    lastModifiedEl.textContent = document.lastModified;
  }
}

/**
 * Local storage visit-interval banner (Discover-page pattern)
 * Targets #visit-message when present on the page
 */
function displayVisitMessage() {
  const messageContainer = document.getElementById("visit-message");
  if (!messageContainer) return;

  const storageKey = "chatsquiLastVisit";
  const lastVisit = localStorage.getItem(storageKey);
  const now = Date.now();
  const msInDay = 86400000;

  if (!lastVisit) {
    messageContainer.textContent =
      "Welcome to Chatsqui API Solutions! Let us know if you have any questions.";
  } else {
    const timeDifference = now - Number.parseInt(lastVisit, 10);

    if (timeDifference < msInDay) {
      messageContainer.textContent = "Back so soon! Awesome!";
    } else {
      const daysBetween = Math.floor(timeDifference / msInDay);
      const dayWord = daysBetween === 1 ? "day" : "days";
      messageContainer.textContent = `You last visited ${daysBetween} ${dayWord} ago.`;
    }
  }

  localStorage.setItem(storageKey, String(now));
}
