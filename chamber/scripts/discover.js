import { itemsOfInterest } from '../data/items.mjs';

document.addEventListener('DOMContentLoaded', () => {
    displayVisitorMessage();
    renderCards(itemsOfInterest);
});

// Visitor Message logic using localStorage
function displayVisitorMessage() {
    const messageContainer = document.getElementById('visit-message');
    if (!messageContainer) return;

    const lastVisit = localStorage.getItem('lastVisitDate');
    const now = Date.now();
    const msInDay = 86400000; // 1000 * 60 * 60 * 24

    if (!lastVisit) {
        messageContainer.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const timeDifference = now - parseInt(lastVisit, 10);

        if (timeDifference < msInDay) {
            messageContainer.textContent = "Back so soon! Awesome!";
        } else {
            const daysBetween = Math.floor(timeDifference / msInDay);
            const dayWord = daysBetween === 1 ? "day" : "days";
            messageContainer.textContent = `You last visited ${daysBetween} ${dayWord} ago.`;
        }
    }

    // Store current visit timestamp
    localStorage.setItem('lastVisitDate', now.toString());
}

// Dynamically render 8 cards
function renderCards(items) {
    const container = document.getElementById('discover-grid');
    if (!container) return;

    container.innerHTML = '';

    items.forEach((item, index) => {
        const card = document.createElement('article');
        card.classList.add('discover-card');
        card.style.gridArea = `card${index + 1}`; // Assigns card1, card2, ..., card8

        card.innerHTML = `
      <h2>${item.name}</h2>
      <figure>
        <img src="${item.image}" alt="${item.name}" width="600" height="400" loading="lazy">
      </figure>
      <address>${item.address}</address>
      <p>${item.description}</p>
      <button class="learn-more-btn" type="button">Learn More</button>
    `;

        container.appendChild(card);
    });
}
