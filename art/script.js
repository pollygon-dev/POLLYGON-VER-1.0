(function() {
    // State management
    let currentModal = null;
    let highestZIndex = 1000;
    const modalStates = new Map();
    let isDragging = false;
    let initialX;
    let initialY;
    let currentX;
    let currentY;

    // Modal mapping
    const modalMap = {
        'Gallery': 'galleryModal',
        'Commissions': 'commissionsModal',
        'Tracker': 'trackerModal'
    };

    // Modal Functions
    function centerModal(modal) {
        if (!modal || !modal.style) return;
        
        const state = modalStates.get(modal.id);
        if (!state) return;

        if (state.isFullscreen) {
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.transform = 'none';
            return;
        }

        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
    }

    function bringToFront(modal) {
        if (!modal || !modal.style) return;
        highestZIndex++;
        modal.style.zIndex = highestZIndex;
    }

    function closeModal(modal) {
        if (!modal) return;
        
        modal.classList.remove('show');
        
        const modalTitle = Object.keys(modalMap).find(key => modalMap[key] === modal.id);
        if (modalTitle) {
            const taskbarItem = Array.from(document.querySelectorAll('.taskbar-item'))
                .find(item => item.querySelector('span')?.textContent.trim() === modalTitle);
            if (taskbarItem) {
                taskbarItem.classList.remove('active');
            }
        }

        const state = modalStates.get(modal.id);
        if (state?.isFullscreen) {
            toggleFullscreen(modal);
        }
    }

    function setupModal(modal) {
        if (!modal) return;
        
        const modalHeader = modal.querySelector('.modal-header');
        const closeButton = modal.querySelector('.close-button');
        const minimizeButton = modal.querySelector('.minimize-button');
        const fullscreenButton = modal.querySelector('.fullscreen-button');

        modalHeader?.addEventListener('mousedown', (e) => {
            dragStart(e, modal);
            bringToFront(modal);
        });

        modal.addEventListener('mousedown', () => bringToFront(modal));
        closeButton?.addEventListener('click', () => closeModal(modal));
        minimizeButton?.addEventListener('click', () => minimizeModal(modal));
        fullscreenButton?.addEventListener('click', () => toggleFullscreen(modal));

        modalStates.set(modal.id, {
            isFullscreen: false,
            prevState: null
        });

        // Watch for show class changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class' && 
                    mutation.target.classList.contains('show')) {
                    centerModal(mutation.target);
                }
            });
        });
        
        observer.observe(modal, { attributes: true });
    }

    function dragStart(e, modal) {
        if (!modal || e.target.closest('.modal-controls')) return;
        
        const state = modalStates.get(modal.id);
        if (!state || state.isFullscreen) return;

        currentModal = modal;
        
        const transform = window.getComputedStyle(modal).transform;
        const matrix = new DOMMatrix(transform);
        
        initialX = e.clientX - matrix.m41;
        initialY = e.clientY - matrix.m42;
        
        if (e.target.closest('.modal-header')) {
            isDragging = true;
            modal.style.transition = 'none';
        }
    }

    function drag(e) {
        if (!isDragging || !currentModal || !currentModal.style) return;
        e.preventDefault();
        
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        
        currentModal.style.transform = `translate(${currentX}px, ${currentY}px)`;
    }

    function dragEnd() {
        if (!currentModal) return;
        
        isDragging = false;
        if (currentModal.style) {
            currentModal.style.transition = 'transform 0.3s ease';
        }
        currentModal = null;
    }

    function toggleFullscreen(modal) {
        if (!modal || !modal.style) return;
        
        const state = modalStates.get(modal.id);
        if (!state) return;

        state.isFullscreen = !state.isFullscreen;
        
        if (state.isFullscreen) {
            state.prevState = {
                width: modal.offsetWidth,
                height: modal.offsetHeight,
                transform: modal.style.transform
            };
            
            modal.classList.add('fullscreen');
            modal.style.transform = 'none';
        } else {
            modal.classList.remove('fullscreen');
            
            if (state.prevState) {
                modal.style.width = `${state.prevState.width}px`;
                modal.style.height = `${state.prevState.height}px`;
                
                if (state.prevState.transform) {
                    modal.style.transform = state.prevState.transform;
                } else {
                    centerModal(modal);
                }
            }
        }

        const fullscreenButton = modal.querySelector('.fullscreen-button');
        if (fullscreenButton) {
            fullscreenButton.innerHTML = state.isFullscreen ? 
                '<i class="fas fa-compress"></i>' : 
                '<i class="fas fa-expand"></i>';
        }
    }

    function minimizeModal(modal) {
        if (!modal) return;
        
        modal.classList.remove('show');
        
        const modalTitle = Object.keys(modalMap).find(key => modalMap[key] === modal.id);
        if (modalTitle) {
            const taskbarItem = Array.from(document.querySelectorAll('.taskbar-item'))
                .find(item => item.querySelector('span')?.textContent.trim() === modalTitle);
            if (taskbarItem) {
                taskbarItem.classList.remove('active');
            }
        }

        const state = modalStates.get(modal.id);
        if (state?.isFullscreen) {
            toggleFullscreen(modal);
        }
    }

    function addTaskbarItem(title, icon) {
        const taskbarItems = document.querySelector('.taskbar-items');
        if (!taskbarItems) return;

        const existingItem = Array.from(taskbarItems.children)
            .find(item => item.querySelector('span')?.textContent.trim() === title);
        
        if (existingItem) {
            const modalId = modalMap[title];
            const modal = document.getElementById(modalId);
            if (modal) {
                if (modal.classList.contains('show')) {
                    minimizeModal(modal);
                } else {
                    modal.classList.add('show');
                    bringToFront(modal);
                    existingItem.classList.add('active');
                }
            }
            return existingItem;
        }

        const taskbarItem = document.createElement('button');
        taskbarItem.className = 'taskbar-item active';
        taskbarItem.innerHTML = `
            <i class="${icon}"></i>
            <span>${title}</span>
        `;
        
        taskbarItems.appendChild(taskbarItem);

        taskbarItem.addEventListener('click', () => {
            const modalId = modalMap[title];
            const modal = document.getElementById(modalId);
            if (!modal) return;
            
            if (modal.classList.contains('show')) {
                minimizeModal(modal);
            } else {
                modal.classList.add('show');
                taskbarItem.classList.add('active');
                bringToFront(modal);
                centerModal(modal);
            }
        });

        return taskbarItem;
    }

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            bringToFront(modal);
            centerModal(modal);
        }
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize UI elements
        const startButton = document.querySelector('.taskbar-start');
        const startMenu = document.querySelector('.start-menu');
        const navIcons = document.querySelectorAll('.nav-icon');
        const startMenuItems = document.querySelectorAll('.start-menu-item');

        // Set up start menu
        if (startButton && startMenu) {
            startButton.addEventListener('click', (e) => {
                e.stopPropagation();
                startMenu.classList.toggle('show');
            });

            document.addEventListener('click', (e) => {
                if (!startMenu.contains(e.target) && !startButton.contains(e.target)) {
                    startMenu.classList.remove('show');
                }
            });
        }

        // Initialize modals
        document.querySelectorAll('.modal').forEach(modal => {
            if (!modal) return;
            setupModal(modal);
        });

        // Handle nav icon clicks
        navIcons.forEach(icon => {
            icon.addEventListener('click', () => {
                const modalId = icon.dataset.modal;
                if (modalId) {
                    openModal(modalId);
                    const title = icon.textContent.trim();
                    const iconEl = icon.querySelector('i');
                    const iconClass = iconEl ? iconEl.className : '';
                    addTaskbarItem(title, iconClass);
                }
            });
        });

        // Handle start menu item clicks
        startMenuItems.forEach(item => {
            item.addEventListener('click', () => {
                const modalId = item.dataset.modal;
                if (modalId) {
                    openModal(modalId);
                    const title = item.querySelector('span').textContent.trim();
                    const iconEl = item.querySelector('i');
                    const iconClass = iconEl ? iconEl.className : '';
                    addTaskbarItem(title, iconClass);
                    startMenu.classList.remove('show');
                }
            });
        });

        // Set up global event listeners
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        // Initialize clock
        function updateTime() {
            const timestamp = document.querySelector('.timestamp');
            if (!timestamp) return;
            
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            timestamp.textContent = `${hours}:${minutes}`;
        }

        updateTime();
        setInterval(updateTime, 60000);

        // Export necessary functions
        window.closeModal = closeModal;
    });
})();