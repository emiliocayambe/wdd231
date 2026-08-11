/**
 * services.js — Dynamic catalog, category filters, and accessible modal
 * Chatsqui API Solutions | WDD 231 Final Project
 */

const DATA_URL = "data/services.json";
const grid = document.getElementById("services-grid");
const filterBar = document.getElementById("filter-bar");
const modal = document.getElementById("service-modal");
const modalBody = document.getElementById("modal-body");
const modalCloseBtn = document.getElementById("modal-close");

/** @type {Array<Object>} */
let allServices = [];
let lastFocusedTrigger = null;
let focusableElements = [];
let firstFocusable = null;
let lastFocusable = null;

document.addEventListener("DOMContentLoaded", () => {
  loadServices();
  setupModalControls();
});

/**
 * Fetch services.json with async/await and try...catch
 */
async function loadServices() {
  if (!grid) return;

  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    allServices = await response.json();
    buildFilterButtons(allServices);
    renderServices(allServices);
  } catch (error) {
    console.error("Unable to load services:", error);
    grid.innerHTML =
      '<p class="error-message" role="alert">Unable to load the services catalog right now. Please refresh the page or try again later.</p>';
  }
}

/**
 * Build category filter buttons from unique category values
 * @param {Array<Object>} services
 */
function buildFilterButtons(services) {
  if (!filterBar) return;

  const categories = [
    "All",
    ...new Set(services.map((service) => service.category)),
  ];

  filterBar.innerHTML = "";

  categories.forEach((category, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-btn${index === 0 ? " active" : ""}`;
    button.dataset.category = category;
    button.setAttribute("aria-pressed", index === 0 ? "true" : "false");
    button.textContent = category;

    button.addEventListener("click", () => {
      filterBar.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      const filtered =
        category === "All"
          ? allServices
          : allServices.filter((service) => service.category === category);

      renderServices(filtered);
    });

    filterBar.appendChild(button);
  });
}

/**
 * Dynamically render service cards into the grid
 * @param {Array<Object>} services
 */
function renderServices(services) {
  if (!grid) return;

  grid.innerHTML = "";

  if (!services.length) {
    grid.innerHTML =
      '<p class="error-message" role="status">No services match this category.</p>';
    return;
  }

  services.forEach((service) => {
    const card = document.createElement("article");
    card.className = "service-card";
    card.innerHTML = `
      <div class="card-icon" aria-hidden="true">${getIconSvg(service.icon)}</div>
      <h3>${escapeHtml(service.name)}</h3>
      <div class="service-meta">
        <span class="badge">${escapeHtml(service.category)}</span>
        <span class="price">$${Number(service.price).toLocaleString("en-US")}</span>
      </div>
      <p>${escapeHtml(service.description)}</p>
      <button type="button" class="btn btn-teal details-btn" data-id="${service.id}">
        View Details
      </button>
    `;

    const detailsBtn = card.querySelector(".details-btn");
    detailsBtn.addEventListener("click", () => openServiceModal(service, detailsBtn));

    grid.appendChild(card);
  });
}

/**
 * Populate and open the accessible <dialog> modal
 * @param {Object} service
 * @param {HTMLElement} trigger
 */
function openServiceModal(service, trigger) {
  if (!modal || !modalBody) return;

  lastFocusedTrigger = trigger;

  const featuresList = (service.features || [])
    .map((feature) => `<li>${escapeHtml(feature)}</li>`)
    .join("");

  modalBody.innerHTML = `
    <div class="service-meta">
      <span class="badge">${escapeHtml(service.category)}</span>
      <span class="price">$${Number(service.price).toLocaleString("en-US")}</span>
    </div>
    <p>${escapeHtml(service.description)}</p>
    <h3>Included Features</h3>
    <ul class="modal-features">
      ${featuresList}
    </ul>
    <p><strong>Module ID:</strong> ${escapeHtml(String(service.id))}</p>
  `;

  const titleEl = document.getElementById("modal-title");
  if (titleEl) {
    titleEl.textContent = service.name;
  }

  modal.showModal();
  trapFocus(modal);

  if (modalCloseBtn) {
    modalCloseBtn.focus();
  }
}

/**
 * Wire close button, backdrop click, and Escape handling
 */
function setupModalControls() {
  if (!modal) return;

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", () => {
      modal.close();
    });
  }

  modal.addEventListener("click", (event) => {
    const rect = modal.getBoundingClientRect();
    const clickedBackdrop =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (clickedBackdrop) {
      modal.close();
    }
  });

  modal.addEventListener("close", () => {
    releaseFocusTrap();
    if (lastFocusedTrigger) {
      lastFocusedTrigger.focus();
      lastFocusedTrigger = null;
    }
  });
}

/**
 * Simple focus trap while the dialog is open
 * @param {HTMLElement} container
 */
function trapFocus(container) {
  const selector =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  focusableElements = Array.from(container.querySelectorAll(selector)).filter(
    (el) => !el.hasAttribute("disabled") && el.getAttribute("tabindex") !== "-1"
  );

  firstFocusable = focusableElements[0] || null;
  lastFocusable = focusableElements[focusableElements.length - 1] || null;

  container.addEventListener("keydown", handleFocusTrap);
}

function releaseFocusTrap() {
  if (modal) {
    modal.removeEventListener("keydown", handleFocusTrap);
  }
  focusableElements = [];
  firstFocusable = null;
  lastFocusable = null;
}

/**
 * Keep Tab / Shift+Tab cycling inside the modal
 * @param {KeyboardEvent} event
 */
function handleFocusTrap(event) {
  if (event.key !== "Tab" || !firstFocusable || !lastFocusable) return;

  if (event.shiftKey) {
    if (document.activeElement === firstFocusable) {
      event.preventDefault();
      lastFocusable.focus();
    }
  } else if (document.activeElement === lastFocusable) {
    event.preventDefault();
    firstFocusable.focus();
  }
}

/**
 * Map icon keys to lightweight inline SVG (no icon libraries)
 * @param {string} iconKey
 * @returns {string}
 */
function getIconSvg(iconKey) {
  const icons = {
    cloud:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.5 1.5A4 4 0 0 0 6 19z"/></svg>',
    inbox:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
    users:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    template:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>',
    bell:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    sync:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
    chart:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    shield:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    broadcast:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49"/><path d="M7.76 16.24a6 6 0 0 1 0-8.49"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M4.93 19.07a10 10 0 0 1 0-14.14"/></svg>',
    bot:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>',
    media:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
    webhook:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c0-2.21 1.79-4 4-4"/><path d="m6 13 2.5-2.5"/><path d="M10.5 7.5 13 5a4 4 0 1 1 5.66 5.66l-1.5 1.5"/><path d="M14 16.5 16.5 19a4 4 0 1 0 0-5.66"/></svg>',
    payment:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
    catalog:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    sla:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    lab:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 3h6"/><path d="M10 9V3"/><path d="M14 9V3"/><path d="M5 21h14"/><path d="m8 9 1 3 3 9 3-9 1-3"/></svg>',
    quality:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="12 2 15 8.5 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 9 8.5 12 2"/></svg>',
    lock:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  };

  return icons[iconKey] || icons.cloud;
}

/**
 * Escape user-facing strings before injecting into HTML
 * @param {string} value
 * @returns {string}
 */
function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
