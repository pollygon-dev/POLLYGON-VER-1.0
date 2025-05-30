// Get all modal buttons and modals
const modalButtons = document.querySelectorAll('.modal-button');
const modals = document.querySelectorAll('.modal-overlay');

// Function to open modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

// Function to close modal
function closeModal(modal) {
    modal.classList.remove('active');
}

// Add click listeners to all modal buttons
modalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal');
        openModal(modalId);
    });
});

// Add click listeners to all modal close buttons and overlay
modals.forEach(modal => {
    // Close button handler
    const closeButton = modal.querySelector('.close');
    closeButton.addEventListener('click', () => {
        closeModal(modal);
    });

    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
});