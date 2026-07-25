// Function to handle modal and timestamp logic
document.addEventListener("DOMContentLoaded", () => {

    // 1. Set the hidden timestamp value
    const timestampField = document.querySelector("#join-timestamp");
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }

    // 2. Modal Logic: Open Modals
    const modalTriggers = document.querySelectorAll(".join-modal-trigger");
    modalTriggers.forEach(button => {
        button.addEventListener("click", () => {
            const modalId = button.getAttribute("data-modal");
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.showModal();
            }
        });
    });

    // 3. Modal Logic: Close Modals
    const closeButtons = document.querySelectorAll(".join-close-modal");
    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Find the closest dialog parent of the clicked button
            const modal = button.closest(".join-modal");
            if (modal) {
                modal.close();
            }
        });
    });
});