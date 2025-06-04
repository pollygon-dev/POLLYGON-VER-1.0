(function() {
    // State management
    let currentGalleryModal = null;
    let galleryModalHighestZIndex = 1000;
    const galleryModalStates = new Map();
    let galleryModalIsDragging = false;
    let galleryModalInitialX;
    let galleryModalInitialY;
    let galleryModalCurrentX;
    let galleryModalCurrentY;

    // Modal Functions
    function centerGalleryModal(galleryModal) {
        if (!galleryModal || !galleryModal.style) return;
        
        const galleryModalState = galleryModalStates.get(galleryModal.id);
        if (!galleryModalState) return;

        if (galleryModalState.isFullscreen) {
            galleryModal.style.top = '0';
            galleryModal.style.left = '0';
            galleryModal.style.transform = 'none';
            return;
        }

        galleryModal.style.top = '50%';
        galleryModal.style.left = '50%';
        galleryModal.style.transform = 'translate(-50%, -50%)';
    }

    function bringGalleryModalToFront(galleryModal) {
        if (!galleryModal || !galleryModal.style) return;
        galleryModalHighestZIndex++;
        galleryModal.style.zIndex = galleryModalHighestZIndex;
    }

    function updateGalleryTaskbarState(galleryModal, isVisible) {
        if (!galleryModal) return;
        
        const galleryModalTitle = galleryModal.querySelector('.modal-title')?.textContent;
        if (!galleryModalTitle) return;

        const galleryTaskbarItems = document.querySelectorAll('.taskbar-item');
        galleryTaskbarItems.forEach(item => {
            if (item.dataset.modalId === galleryModal.id) {
                item.classList.toggle('active', isVisible);
            }
        });
    }

    function closeGalleryModal(galleryModal) {
        if (!galleryModal) return;
        
        galleryModal.classList.remove('show');
        
        // Remove taskbar item completely when closing
        const galleryTaskbarItems = document.querySelectorAll('.taskbar-item');
        galleryTaskbarItems.forEach(item => {
            if (item.dataset.modalId === galleryModal.id) {
                item.remove();
            }
        });

        const galleryModalState = galleryModalStates.get(galleryModal.id);
        if (galleryModalState?.isFullscreen) {
            toggleGalleryModalFullscreen(galleryModal);
        }
    }

    function setupGalleryModal(galleryModal) {
        if (!galleryModal) return;
        
        const galleryModalHeader = galleryModal.querySelector('.modal-header');
        const galleryCloseButton = galleryModal.querySelector('.close-button');
        const galleryMinimizeButton = galleryModal.querySelector('.minimize-button');
        const galleryFullscreenButton = galleryModal.querySelector('.fullscreen-button');

        galleryModalHeader?.addEventListener('mousedown', (e) => {
            galleryModalDragStart(e, galleryModal);
            bringGalleryModalToFront(galleryModal);
        });

        galleryModal.addEventListener('mousedown', () => bringGalleryModalToFront(galleryModal));
        galleryCloseButton?.addEventListener('click', () => closeGalleryModal(galleryModal));
        galleryMinimizeButton?.addEventListener('click', () => minimizeGalleryModal(galleryModal));
        galleryFullscreenButton?.addEventListener('click', () => toggleGalleryModalFullscreen(galleryModal));

        galleryModalStates.set(galleryModal.id, {
            isFullscreen: false,
            prevState: null
        });

        // Watch for show class changes
        const galleryModalObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const isVisible = galleryModal.classList.contains('show');
                    updateGalleryTaskbarState(galleryModal, isVisible);
                    if (isVisible) {
                        centerGalleryModal(galleryModal);
                    }
                }
            });
        });
        
        galleryModalObserver.observe(galleryModal, { attributes: true });
    }

    function galleryModalDragStart(e, galleryModal) {
        if (!galleryModal || e.target.closest('.modal-controls')) return;
        
        const galleryModalState = galleryModalStates.get(galleryModal.id);
        if (!galleryModalState || galleryModalState.isFullscreen) return;

        currentGalleryModal = galleryModal;
        
        const galleryModalTransform = window.getComputedStyle(galleryModal).transform;
        const galleryModalMatrix = new DOMMatrix(galleryModalTransform);
        
        galleryModalInitialX = e.clientX - galleryModalMatrix.m41;
        galleryModalInitialY = e.clientY - galleryModalMatrix.m42;
        
        if (e.target.closest('.modal-header')) {
            galleryModalIsDragging = true;
            galleryModal.style.transition = 'none';
        }
    }

    function galleryModalDrag(e) {
        if (!galleryModalIsDragging || !currentGalleryModal || !currentGalleryModal.style) return;
        e.preventDefault();
        
        galleryModalCurrentX = e.clientX - galleryModalInitialX;
        galleryModalCurrentY = e.clientY - galleryModalInitialY;
        
        currentGalleryModal.style.transform = `translate(${galleryModalCurrentX}px, ${galleryModalCurrentY}px)`;
    }

    function galleryModalDragEnd() {
        if (!currentGalleryModal) return;
        
        galleryModalIsDragging = false;
        if (currentGalleryModal.style) {
            currentGalleryModal.style.transition = 'transform 0.3s ease';
        }
        currentGalleryModal = null;
    }

    function toggleGalleryModalFullscreen(galleryModal) {
        if (!galleryModal || !galleryModal.style) return;
        
        const galleryModalState = galleryModalStates.get(galleryModal.id);
        if (!galleryModalState) return;

        galleryModalState.isFullscreen = !galleryModalState.isFullscreen;
        
        if (galleryModalState.isFullscreen) {
            galleryModalState.prevState = {
                width: galleryModal.offsetWidth,
                height: galleryModal.offsetHeight,
                transform: galleryModal.style.transform
            };
            
            galleryModal.classList.add('fullscreen');
            galleryModal.style.transform = 'none';
        } else {
            galleryModal.classList.remove('fullscreen');
            
            if (galleryModalState.prevState) {
                galleryModal.style.width = `${galleryModalState.prevState.width}px`;
                galleryModal.style.height = `${galleryModalState.prevState.height}px`;
                
                if (galleryModalState.prevState.transform) {
                    galleryModal.style.transform = galleryModalState.prevState.transform;
                } else {
                    centerGalleryModal(galleryModal);
                }
            }
        }

        const galleryFullscreenButton = galleryModal.querySelector('.fullscreen-button');
        if (galleryFullscreenButton) {
            galleryFullscreenButton.innerHTML = galleryModalState.isFullscreen ? 
                '<i class="fas fa-compress"></i>' : 
                '<i class="fas fa-expand"></i>';
        }
    }

    function minimizeGalleryModal(galleryModal) {
        if (!galleryModal) return;
        
        galleryModal.classList.remove('show');
        updateGalleryTaskbarState(galleryModal, false);

        const galleryModalState = galleryModalStates.get(galleryModal.id);
        if (galleryModalState?.isFullscreen) {
            toggleGalleryModalFullscreen(galleryModal);
        }
    }

    function addGalleryTaskbarItem(galleryTitle, galleryIcon, galleryModalId) {
        const galleryTaskbarItems = document.querySelector('.taskbar-items');
        if (!galleryTaskbarItems) return;

        // Remove any existing taskbar items for this modal
        const galleryExistingItems = Array.from(galleryTaskbarItems.children)
            .filter(item => item.dataset.modalId === galleryModalId);
        galleryExistingItems.forEach(item => item.remove());

        const galleryTaskbarItem = document.createElement('button');
        galleryTaskbarItem.className = 'taskbar-item active';
        galleryTaskbarItem.innerHTML = `
            <i class="${galleryIcon}"></i>
            <span>${galleryTitle}</span>
        `;
        
        // Store the modal ID on the taskbar item
        galleryTaskbarItem.dataset.modalId = galleryModalId;
        
        galleryTaskbarItems.appendChild(galleryTaskbarItem);

        galleryTaskbarItem.addEventListener('click', () => {
            const galleryModal = document.getElementById(galleryModalId);
            if (!galleryModal) return;
            
            if (galleryModal.classList.contains('show')) {
                minimizeGalleryModal(galleryModal);
            } else {
                galleryModal.classList.add('show');
                bringGalleryModalToFront(galleryModal);
                centerGalleryModal(galleryModal);
                galleryTaskbarItem.classList.add('active');
            }
        });

        return galleryTaskbarItem;
    }

    function openGalleryModal(galleryModalId, galleryCustomTitle = null, galleryCustomIcon = null) {
        const galleryModal = document.getElementById(galleryModalId);
        if (!galleryModal) return;

        const galleryTitle = galleryCustomTitle || galleryModal.querySelector('.modal-title')?.textContent;
        const galleryIcon = galleryCustomIcon || document.querySelector(`[data-modal="${galleryModalId}"] i`)?.className || '';
        
        galleryModal.classList.add('show');
        bringGalleryModalToFront(galleryModal);
        centerGalleryModal(galleryModal);
        
        if (galleryTitle) {
            addGalleryTaskbarItem(galleryTitle, galleryIcon, galleryModalId);
        }
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize UI elements
        const galleryStartButton = document.querySelector('.taskbar-start');
        const galleryStartMenu = document.querySelector('.start-menu');
        const galleryNavIcons = document.querySelectorAll('.nav-icon');
        const galleryStartMenuItems = document.querySelectorAll('.start-menu-item');

        // Set up start menu
        if (galleryStartButton && galleryStartMenu) {
            galleryStartButton.addEventListener('click', (e) => {
                e.stopPropagation();
                galleryStartMenu.classList.toggle('show');
            });

            document.addEventListener('click', (e) => {
                if (!galleryStartMenu.contains(e.target) && !galleryStartButton.contains(e.target)) {
                    galleryStartMenu.classList.remove('show');
                }
            });
        }

        // Initialize modals
        document.querySelectorAll('.modal').forEach(galleryModal => {
            if (!galleryModal) return;
            setupGalleryModal(galleryModal);
        });

        // Handle nav icon clicks
        galleryNavIcons.forEach(galleryIcon => {
            galleryIcon.addEventListener('click', () => {
                const galleryModalId = galleryIcon.dataset.modal;
                if (galleryModalId) {
                    const galleryModal = document.getElementById(galleryModalId);
                    if (galleryModal) {
                        const galleryTitle = galleryModal.querySelector('.modal-title')?.textContent;
                        const galleryIconEl = galleryIcon.querySelector('i');
                        const galleryIconClass = galleryIconEl ? galleryIconEl.className : '';
                        openGalleryModal(galleryModalId, galleryTitle, galleryIconClass);
                    }
                }
            });
        });

        // Handle start menu item clicks
        galleryStartMenuItems.forEach(galleryItem => {
            galleryItem.addEventListener('click', () => {
                const galleryModalId = galleryItem.dataset.modal;
                if (galleryModalId) {
                    const galleryModal = document.getElementById(galleryModalId);
                    if (galleryModal) {
                        const galleryTitle = galleryModal.querySelector('.modal-title')?.textContent;
                        const galleryIconEl = galleryItem.querySelector('i');
                        const galleryIconClass = galleryIconEl ? galleryIconEl.className : '';
                        openGalleryModal(galleryModalId, galleryTitle, galleryIconClass);
                        galleryStartMenu.classList.remove('show');
                    }
                }
            });
        });

        // Set up global event listeners
        document.addEventListener('mousemove', galleryModalDrag);
        document.addEventListener('mouseup', galleryModalDragEnd);

        // Initialize clock
        function updateGalleryTime() {
            const galleryTimestamp = document.querySelector('.timestamp');
            if (!galleryTimestamp) return;
            
            const galleryNow = new Date();
            const galleryHours = String(galleryNow.getHours()).padStart(2, '0');
            const galleryMinutes = String(galleryNow.getMinutes()).padStart(2, '0');
            galleryTimestamp.textContent = `${galleryHours}:${galleryMinutes}`;
        }

        updateGalleryTime();
        setInterval(updateGalleryTime, 60000);

        // Export necessary functions
        window.closeGalleryModal = closeGalleryModal;
    });
})();