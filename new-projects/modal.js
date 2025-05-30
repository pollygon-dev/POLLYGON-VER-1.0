// =====================
// modal.js
// =====================

// Modal State Management
let openModals = [];
let currentDetailModal = null;
const MODAL_SPACING = 40;
let isClosing = false;

// Add necessary styles
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .project-detail-modal {
    min-width: 500px !important;
    max-width: 500px !important;
    height: 80vh;
    background: var(--darker-pink);
  }

  .project-detail-content {
    padding: 10px;
  }

  .project-detail-content h4 {
    color: var(--neon-pink);
    margin: 20px 0 10px 0;
    text-shadow: var(--glow-text);
  }

  .project-detail-content p {
    margin-bottom: 15px;
    line-height: 1.6;
  }

  .project-item {
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .project-item:hover {
    transform: translateX(5px);
    box-shadow: 0 0 15px rgba(255, 106, 213, 0.3);
  }

  .modal-dragging {
    user-select: none;
    cursor: grabbing !important;
  }

  .modal-header {
    cursor: grab;
  }
`;
document.head.appendChild(styleSheet);

// Modal Creation and Setup
function createModal(modalContent) {
  // Check if modal already exists
  if (openModals.some(m => m.title === modalContent.title)) return;

  // Get content from HTML
  const contentElement = document.getElementById(modalContent.contentId);
  const modalContentHtml = contentElement ? contentElement.innerHTML : 'Content not found';

  // Create modal structure
  const modal = document.createElement('div');
  modal.className = 'cyberpunk-modal modal-animate';
  modal.innerHTML = `
    <div class="modal-header">
      <h3 class="modal-title">${modalContent.title}</h3>
      <button class="modal-close">×</button>
    </div>
    <div class="modal-content">${modalContentHtml}</div>
  `;

  document.body.appendChild(modal);
  positionNewModal(modal);
  
  // Animation delay
  setTimeout(() => {
    modal.classList.add('modal-visible');
  }, 50);

  // Setup interactions
  setupDraggable(modal);
  setupCloseButton(modal);

  // Track modal
  openModals.push({
    title: modalContent.title,
    modal: modal
  });

  // Initialize project items in this modal
  initializeProjectItems(modal);

  return modal;
}

// Modal Positioning Logic
function positionNewModal(modal) {
  const gameContainer = document.querySelector('#dialogue-container');
  const gameRect = gameContainer.getBoundingClientRect();
  const modalRect = modal.getBoundingClientRect();
  const margin = 20;
  
  // Calculate available space
  const availableRight = window.innerWidth - (gameRect.right + margin);
  const availableLeft = gameRect.left - margin;
  
  if (openModals.length === 0) {
    // First modal position - try right side first
    if (availableRight >= modalRect.width) {
      // Enough space on right
      modal.style.position = 'fixed';
      modal.style.top = `${Math.max(margin, gameRect.top)}px`;
      modal.style.left = `${gameRect.right + margin}px`;
    } else if (availableLeft >= modalRect.width) {
      // Try left side
      modal.style.position = 'fixed';
      modal.style.top = `${Math.max(margin, gameRect.top)}px`;
      modal.style.left = `${Math.max(margin, gameRect.left - modalRect.width - margin)}px`;
    } else {
      // No space on sides, position at top
      modal.style.position = 'fixed';
      modal.style.top = `${margin}px`;
      modal.style.left = `${margin}px`;
    }
  } else {
    const lastModal = openModals[openModals.length - 1].modal;
    const lastRect = lastModal.getBoundingClientRect();
    
    // Check if there's room below current modal
    const spaceBelow = window.innerHeight - (lastRect.bottom + MODAL_SPACING);
    
    if (spaceBelow >= modalRect.height) {
      // Stack below if there's room
      modal.style.position = 'fixed';
      modal.style.top = `${lastRect.bottom + MODAL_SPACING}px`;
      modal.style.left = `${lastRect.left}px`;
    } else {
      // Try new column to the left
      const newLeft = lastRect.left - modalRect.width - MODAL_SPACING;
      if (newLeft >= margin) {
        modal.style.position = 'fixed';
        modal.style.top = `${Math.max(margin, gameRect.top)}px`;
        modal.style.left = `${newLeft}px`;
      } else {
        // No room left, start new column from right
        modal.style.position = 'fixed';
        modal.style.top = `${Math.max(margin, gameRect.top)}px`;
        modal.style.left = `${Math.min(
          window.innerWidth - modalRect.width - margin,
          gameRect.right + margin
        )}px`;
      }
    }
  }

  // Final position check - ensure modal is always visible
  const finalRect = modal.getBoundingClientRect();
  
  // Adjust if modal extends below viewport
  if (finalRect.bottom > window.innerHeight - margin) {
    modal.style.top = `${Math.max(margin, window.innerHeight - finalRect.height - margin)}px`;
  }
  
  // Adjust if modal extends right of viewport
  if (finalRect.right > window.innerWidth - margin) {
    modal.style.left = `${Math.max(margin, window.innerWidth - finalRect.width - margin)}px`;
  }
  
  return modal;
}

// Enhanced Draggable Functionality
function setupDraggable(modal) {
  const header = modal.querySelector('.modal-header');
  let isDragging = false;
  let startX, startY, initialX, initialY;
  let transform = { x: 0, y: 0 };

  function getMousePosition(e) {
    return {
      x: e.clientX,
      y: e.clientY
    };
  }

  function startDragging(e) {
    if (e.target.classList.contains('modal-close')) return;
    
    const pos = getMousePosition(e);
    startX = pos.x - transform.x;
    startY = pos.y - transform.y;
    isDragging = true;
    
    modal.classList.add('modal-dragging');
    
    // Get computed transform
    const style = window.getComputedStyle(modal);
    const matrix = new DOMMatrix(style.transform);
    transform = {
      x: matrix.m41,
      y: matrix.m42
    };
  }

  function drag(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    const pos = getMousePosition(e);
    
    // Calculate new position
    transform.x = pos.x - startX;
    transform.y = pos.y - startY;
    
    modal.style.transform = `translate(${transform.x}px, ${transform.y}px)`;
  }

  function stopDragging() {
    isDragging = false;
    modal.classList.remove('modal-dragging');
  }

  header.addEventListener('mousedown', startDragging);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDragging);
  
  // Clean up
  modal.addEventListener('remove', () => {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDragging);
  });
}

// Close Button Setup
function setupCloseButton(modal) {
  modal.querySelector('.modal-close').addEventListener('click', () => {
    if (isClosing) return;
    isClosing = true;
    
    modal.classList.remove('modal-visible');
    setTimeout(() => {
      openModals = openModals.filter(m => m.modal !== modal);
      modal.remove();
      if (!areAllModalsOpen()) {
        showDialogue(MESSAGES.MODAL_CLOSED);
      }
      isClosing = false;
    }, 300);
  });
}

// Initialize Project Items
function initializeProjectItems(container = document) {
  const projectItems = container.querySelectorAll('.project-item');
  projectItems.forEach(item => {
    item.addEventListener('click', () => {
      const detailId = item.getAttribute('data-detail');
      const title = item.querySelector('h3').textContent;
      if (detailId) {
        createProjectDetailModal(detailId, title);
      }
    });
  });
}

// Project Detail Modal
function createProjectDetailModal(detailId, title) {
  // Remove existing detail modal if any
  if (currentDetailModal) {
    currentDetailModal.remove();
  }

  const detailContent = document.getElementById(detailId);
  if (!detailContent) return;

  // Create modal structure
  const modal = document.createElement('div');
  modal.className = 'cyberpunk-modal project-detail-modal modal-animate';
  modal.innerHTML = `
    <div class="modal-header">
      <h3 class="modal-title">${title}</h3>
      <button class="modal-close">×</button>
    </div>
    <div class="modal-content">
      ${detailContent.innerHTML}
    </div>
  `;

  document.body.appendChild(modal);

  // Position modal responsively
  const gameContainer = document.querySelector('#dialogue-container');
  const gameRect = gameContainer.getBoundingClientRect();
  const modalRect = modal.getBoundingClientRect();
  const margin = 20;
  
  // Try to position on left first
  let leftPosition = gameRect.left - modalRect.width - margin;
  
  // If not enough space on left, try right side
  if (leftPosition < margin) {
    leftPosition = Math.min(
      gameRect.right + margin,
      window.innerWidth - modalRect.width - margin
    );
  }

  // If still no good position, put it where it will be visible
  if (leftPosition < margin) {
    leftPosition = margin;
  }

  modal.style.position = 'fixed';
  modal.style.top = `${Math.max(margin, gameRect.top - 150)}px`; // moves it 100px higher
  modal.style.left = `${leftPosition}px`;
  
  // Show modal with animation
  setTimeout(() => {
    modal.classList.add('modal-visible');
  }, 50);

  // Setup interactions
  setupDraggable(modal);
  setupCloseButton(modal);

  currentDetailModal = modal;
  return modal;
}

// Window resize handler
window.addEventListener('resize', () => {
  // Reposition all open modals
  openModals.forEach(modalObj => {
    const modalRect = modalObj.modal.getBoundingClientRect();
    const margin = 20;
    
    // Ensure modal stays within viewport
    if (modalRect.right > window.innerWidth - margin) {
      modalObj.modal.style.left = `${Math.max(margin, window.innerWidth - modalRect.width - margin)}px`;
    }
    if (modalRect.bottom > window.innerHeight - margin) {
      modalObj.modal.style.top = `${Math.max(margin, window.innerHeight - modalRect.height - margin)}px`;
    }
  });
  
  // Reposition detail modal if exists
  if (currentDetailModal) {
    const modalRect = currentDetailModal.getBoundingClientRect();
    const margin = 20;
    
    if (modalRect.right > window.innerWidth - margin) {
      currentDetailModal.style.left = `${Math.max(margin, window.innerWidth - modalRect.width - margin)}px`;
    }
    if (modalRect.bottom > window.innerHeight - margin) {
      currentDetailModal.style.top = `${Math.max(margin, window.innerHeight - modalRect.height - margin)}px`;
    }
  }
});

// Utility Functions
function areAllModalsOpen() {
  return openModals.length >= 3;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeProjectItems();
});