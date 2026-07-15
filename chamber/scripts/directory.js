// ==========================================================================
// 1. NAVIGATION & HAMBURGER MENU (Safe for Desktop)
// ==========================================================================
const menuButton = document.querySelector('#menu-button');
const primaryNav = document.querySelector('#primary-nav');

if (menuButton && primaryNav) {
    menuButton.addEventListener('click', () => {
        // Toggle class to animate hamburger icon
        menuButton.classList.toggle('open');

        // Toggle class to show/hide the menu on mobile
        primaryNav.classList.toggle('open');
    });

    // Clean up function: If the window is resized to desktop width,
    // we make sure to clean up any left-over mobile classes.
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) { // 1024px matches our larger.css min-width
            menuButton.classList.remove('open');
            primaryNav.classList.remove('open');
        }
    });
}
//=========================================================================
// 2. FOOTER DYNAMIC DATES
// ==========================================================================
// Set the current year
const currentYearSpan = document.querySelector('#current-year');
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

// Set the last modified date
const lastModifiedSpan = document.querySelector('#last-modified-date');
if (lastModifiedSpan) {
    lastModifiedSpan.textContent = document.lastModified;
}

// ==========================================================================
// 3. FETCH AND RENDER MEMBERS DATA
// ==========================================================================
// Relative path to your JSON data
const jsonPath = 'data/members.json';
const membersContainer = document.querySelector('#members-container');

/**
 * Asynchronously fetches member data from the JSON file
 */
async function getMembersData() {
    try {
        const response = await fetch(jsonPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayMembers(data);
    } catch (error) {
        console.error('Error fetching member data:', error);
        if (membersContainer) {
            membersContainer.innerHTML = `<p class="error-message">Unable to load members directory at this time. Please try again later.</p>`;
        }
    }
}

/**
 * Dynamically builds HTML markup for each member and injects it into the DOM
 * @param {Array} members - Array of member objects
 */
function displayMembers(members) {
    if (!membersContainer) return;

    // Clear any existing content (or placeholders)
    membersContainer.innerHTML = '';

    members.forEach((member) => {
        // Create card element
        const card = document.createElement('section');
        card.classList.add('member-card');

        // Determine CSS class based on membership level (1=member, 2=silver, 3=gold)
        let membershipClass = 'regular-member';
        let membershipLabel = 'Member';

        if (member.membershipLevel === 3) {
            membershipClass = 'gold-member';
            membershipLabel = 'Gold Partner';
        } else if (member.membershipLevel === 2) {
            membershipClass = 'silver-member';
            membershipLabel = 'Silver Partner';
        }

        card.classList.add(membershipClass);

        // Build internal HTML structure
        card.innerHTML = `
            <img src="images/${member.image}" alt="${member.name} Logo" loading="lazy" width="150" height="100">
            <h3>${member.name}</h3>
            <p class="tagline">"${member.tagline}"</p>
            <p class="membership-badge ${membershipClass}">${membershipLabel}</p>
            <hr>
            <p class="address"><strong>Address:</strong> ${member.address}</p>
            <p class="phone"><strong>Phone:</strong> ${member.phone}</p>
            <p class="website"><a href="${member.website}" target="_blank" rel="noopener noreferrer">Visit Website</a></p>
        `;

        // Append card to container
        membersContainer.appendChild(card);
    });
}

// Initialize fetching
getMembersData();

// ==========================================================================
// 4. GRID VS LIST VIEW TOGGLING
// ==========================================================================
const gridViewBtn = document.querySelector('#grid-view-btn');
const listViewBtn = document.querySelector('#list-view-btn');

if (gridViewBtn && listViewBtn && membersContainer) {

    // Toggle to Grid View
    gridViewBtn.addEventListener('click', () => {
        membersContainer.classList.add('grid-view');
        membersContainer.classList.remove('list-view');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    });

    // Toggle to List View
    listViewBtn.addEventListener('click', () => {
        membersContainer.classList.add('list-view');
        membersContainer.classList.remove('grid-view');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    });
}