/**
 * contact.js — Contact form enhancements
 * Sets a hidden ISO timestamp before submission
 */

document.addEventListener("DOMContentLoaded", () => {
  const timestampField = document.getElementById("contact-timestamp");

  if (timestampField) {
    timestampField.value = new Date().toISOString();
  }

  const form = document.getElementById("contact-form");
  if (!form) return;

  // Refresh timestamp at submit so the recorded moment is accurate
  form.addEventListener("submit", () => {
    if (timestampField) {
      timestampField.value = new Date().toISOString();
    }
  });
});
