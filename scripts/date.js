// get the current year and display it in the footer
const year = new Date().getFullYear();
document.getElementById('currentyear').textContent = year;

// get the last modified date of the document and display it in the footer
const lastModified = document.lastModified;
document.getElementById('lastModified').textContent = "Last Modification: " + lastModified;