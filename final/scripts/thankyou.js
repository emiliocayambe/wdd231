/**
 * thankyou.js — Display GET form values from the contact form
 * Uses URLSearchParams for safe query-string extraction
 */

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  const fields = {
    fullname: "display-fullname",
    email: "display-email",
    phone: "display-phone",
    business: "display-business",
    category: "display-category",
    comments: "display-comments",
    timestamp: "display-timestamp",
  };

  let hasData = false;

  Object.entries(fields).forEach(([paramName, elementId]) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const rawValue = params.get(paramName);

    if (rawValue && rawValue.trim() !== "") {
      hasData = true;

      if (paramName === "timestamp") {
        const parsed = new Date(rawValue);
        element.textContent = Number.isNaN(parsed.getTime())
          ? rawValue
          : parsed.toLocaleString();
      } else {
        // textContent escapes HTML automatically (XSS-safe display)
        element.textContent = rawValue;
      }
    } else {
      element.textContent = "Not provided";
    }
  });

  const emptyNotice = document.getElementById("empty-submission");
  if (emptyNotice) {
    emptyNotice.hidden = hasData;
  }
});
