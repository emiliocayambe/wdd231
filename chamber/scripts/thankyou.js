document.addEventListener("DOMContentLoaded", () => {
    // 1. Get query parameters from the URL
    const params = new URLSearchParams(window.location.search);

    // 2. Map parameters to the HTML elements
    const fields = {
        "first": "first-display",
        "last": "last-display",
        "email": "email-display",
        "phone": "phone-display",
        "org-name": "org-display",
        "timestamp": "date-display"
    };

    // 3. Inject data into the page
    for (const [paramName, elementId] of Object.entries(fields)) {
        const value = params.get(paramName);
        const element = document.getElementById(elementId);

        if (element && value) {
            // Special handling for timestamp to make it readable
            if (paramName === "timestamp") {
                element.textContent = new Date(value).toLocaleString();
            } else {
                element.textContent = value;
            }
        }
    }
});