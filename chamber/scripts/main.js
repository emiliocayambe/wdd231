// Configuration for OpenWeatherMap API
const apiKey = '123bf8c4b15e36962b278fe95d4b861b';
const lat = -2.1894;
const lon = -79.8891;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

// 1. Weather API Functionality
async function getWeather() {
    try {
        const response = await fetch(forecastUrl);
        if (!response.ok) throw new Error("API failed");
        const data = await response.json();

        // Current Weather
        const current = data.list[0];
        const iconElement = document.getElementById('weather-icon');
        const tempElement = document.getElementById('temp');
        const descElement = document.getElementById('desc');

        if (iconElement) {
            iconElement.src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;
            iconElement.alt = current.weather[0].description;
        }
        if (tempElement) tempElement.innerHTML = `${Math.round(current.main.temp)}&deg;C`;
        if (descElement) descElement.textContent = current.weather[0].description;

        // Forecast 3 days
        const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00"));
        const forecastContainer = document.getElementById('forecast-grid');

        if (forecastContainer) {
            forecastContainer.innerHTML = '';
            dailyForecasts.slice(0, 3).forEach(day => {
                let dayName = new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "long" });
                forecastContainer.innerHTML += `
                    <div class="forecast-box">
                        <strong>${dayName}</strong>
                        <p>${Math.round(day.main.temp)}&deg;C</p>
                    </div>`;
            });
        }
    } catch (error) { console.error("Weather error:", error); }
}

// 2. Spotlights Functionality - Fetch and Filter Data
async function getMembers() {
    try {
        const response = await fetch('data/members.json');
        const data = await response.json();

        // Filter: Membership Level >= 2 (Silver/Gold), then randomize 3
        const randomSpotlights = data
            .filter(m => m.membershipLevel >= 2)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

        displaySpotlights(randomSpotlights);
    } catch (e) { console.error("Error fetching members:", e); }
}

// 3. Render Spotlights - Uses class 'home-member-card' to avoid CSS conflicts
function displaySpotlights(members) {
    const gridContainer = document.querySelector('.spotlight-grid');
    if (gridContainer) {
        gridContainer.innerHTML = '';

        members.forEach(member => {
            let card = document.createElement('section');
            card.className = 'home-member-card';

            card.innerHTML = `
                <img src="images/${member.image}" alt="${member.name} logo" width="100">
                <h3>${member.name}</h3>
                <p class="tagline">"${member.tagline}"</p>
                <hr>
                <div class="card-info">
                    <p>${member.address}</p>
                    <p>${member.phone}</p>
                    <p><a href="${member.website}" target="_blank" rel="noopener noreferrer">Visit Website</a></p>
                </div>
            `;
            gridContainer.appendChild(card);
        });
    }
}

// 4. Global Navigation Menu (Hamburger Toggle)
function setupNavigation() {
    const menuButton = document.getElementById('menu-button');
    const navMenu = document.getElementById('primary-nav');

    if (menuButton && navMenu) {
        menuButton.addEventListener('click', () => {
            menuButton.classList.toggle('open');
            navMenu.classList.toggle('open');
        });
    }
}

// 5. Global Footer Dates (Year and Last Modified)
function updateFooterDates() {
    const yearSpan = document.getElementById('current-year');
    const lastModifiedSpan = document.getElementById('last-modified-date');

    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    if (lastModifiedSpan) {
        lastModifiedSpan.textContent = document.lastModified;
    }
}

// 6. Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Global features (run on every page)
    setupNavigation();
    updateFooterDates();

    // Conditional features (run only if the DOM elements exist)
    if (document.getElementById('weather-info')) getWeather();
    if (document.getElementById('spotlights-container')) getMembers();
});