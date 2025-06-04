// Debug function to track window lifecycle
function debugLog(message) {
    console.log(`[WindowManager] ${message}`);
}

// Complete Window Management System
const WindowSystem = {
    windows: [],
    activeWindow: null,
    zIndexCounter: 50,
    mobileInitialized: false,
    iframeWindows: ['about', 'shrines', 'blog', 'projects', 'art', 'links'],

    isMobileDevice() {
        return window.innerWidth <= 768;
    },

    initializeMobileSupport() {
        if (this.mobileInitialized) return;
        
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });

        this.mobileInitialized = true;
    },

    getWindowSize(type) {
        if (this.isMobileDevice()) {
            return {
                width: window.innerWidth * 0.92,
                height: window.innerHeight - 120
            };
        }

        const sizes = {
            welcome: { width: 600, height: 400 },
            webcam: { width: 800, height: 450 },
            about: { width: 1863, height: 1090 },
            shrines: { width: 1380, height: 950 },
            blog: { width: 2215, height: 1135 },
            projects: { width: 1580, height: 1050 },
            ocs: { width: 1555, height: 1080 },
            art: { width: 2255, height: 1125 },
            links: { width: 500, height: 600 },
            snake: { width: 480, height: 560 },
            tetris: { width: 480, height: 700 },
            paint: { width: 1165, height: 890 },
            webcam: { width: 832, height: 515 }
        };
        return sizes[type] || { width: 500, height: 600 };
    },

    getWindowPosition(size, type) {
        if (this.isMobileDevice()) {
            return {
                x: (window.innerWidth - size.width) / 2,
                y: 60
            };
        }

        const taskbarHeight = document.getElementById('taskbar')?.offsetHeight || 0;
        const centerX = (window.innerWidth - size.width) / 2;
        const centerY = (window.innerHeight - size.height) / 2;

        // Special positioning for initial windows
        if (type === 'welcome') {
            return {
                x: centerX - (size.width / 2),  // Offset to the left
                y: centerY + (taskbarHeight / 2)  // Slightly below center
            };
        }
        
        if (type === 'webcam') {
            return {
                x: centerX + (size.width / 2),  // Offset to the right
                y: centerY - (taskbarHeight * 2)  // Slightly above center
            };
        }

        // Default positioning for other windows
        const openWindows = this.windows.length;
        return {
            x: 50 + (openWindows * 20),
            y: taskbarHeight + 20 + (openWindows * 20)
        };
    },

    updateLogoVisibility() {
        const hasMaximizedWindow = this.windows.some(w => w.maximized);
        document.body.classList.toggle('has-maximized-window', hasMaximizedWindow);
    },

    createWindow(type) {
        // Check for existing window
        const existingWindow = this.windows.find(w => w.type === type);
        if (existingWindow) {
            if (existingWindow.minimized) {
                this.restoreWindow(existingWindow.id);
            } else {
                this.setActiveWindow(existingWindow.id);
            }
            return existingWindow.id;
        }

        if (type === 'guestbook') {
            return null;
        }

        const windowId = `window-${Math.random().toString(36).substr(2, 9)}`;
        const size = this.getWindowSize(type);
        const position = this.getWindowPosition(size, type);

        // Get appropriate template based on device type
        const templateId = this.isMobileDevice() ? `${type}-mobile` : type;
        const template = document.getElementById(templateId);
        // Fallback to desktop template if mobile template doesn't exist
        const fallbackTemplate = document.getElementById(type);
        
        // Create base content string
        let contentHTML = '<div class="p-4">Content not found</div>';
        
        // For iframe windows, wrap the template content with a preloader
        if (this.iframeWindows.includes(type) && (template || fallbackTemplate)) {
            const iframeContent = (template || fallbackTemplate).innerHTML;
            contentHTML = `
                <div class="relative h-full">
                    <div class="preloader absolute inset-0">
                        <div class="loader-container">
                            <div class="loader">
                                <div class="cube-face front"></div>
                                <div class="cube-face back"></div>
                                <div class="cube-face right"></div>
                                <div class="cube-face left"></div>
                                <div class="cube-face top"></div>
                                <div class="cube-face bottom"></div>
                            </div>
                            <div class="loader-text">Loading...</div>
                            <div class="progress">
                                <div class="progress-bar"></div>
                            </div>
                        </div>
                    </div>
                    ${iframeContent}
                </div>
            `;
        } else if (template || fallbackTemplate) {
            contentHTML = template ? template.innerHTML : fallbackTemplate.innerHTML;
        }

        const isMobile = this.isMobileDevice();
        
        // Create window HTML
        const windowHTML = `
            <div id="${windowId}" class="window ${isMobile ? 'mobile-window' : ''}" data-type="${type}"
                 style="width: ${size.width}px;
                        height: ${size.height}px;
                        z-index: ${this.zIndexCounter++};">
                <div class="window-header">
                    <div class="window-title">
                        <i class="fas fa-${this.getIconForType(type)}"></i>
                        ${this.getTitleForType(type)}
                    </div>
                    <div class="window-controls">
                        ${isMobile ? `
                            <button class="control close" onclick="WindowSystem.closeWindow('${windowId}')">
                                <i class="fas fa-times"></i>
                            </button>
                        ` : `
                            <button class="control minimize" onclick="WindowSystem.minimizeWindow('${windowId}')">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button class="control maximize" onclick="WindowSystem.toggleMaximize('${windowId}')">
                                <i class="fas fa-square"></i>
                            </button>
                            <button class="control close" onclick="WindowSystem.closeWindow('${windowId}')">
                                <i class="fas fa-times"></i>
                            </button>
                        `}
                    </div>
                </div>
                <div class="window-content">
                    ${contentHTML}
                </div>
                ${!isMobile && type !== 'webcam' ? '<div class="window-resize-handle"></div>' : ''}
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', windowHTML);
        const windowElement = document.getElementById(windowId);

        // For iframe windows, add load handler to remove preloader
        if (this.iframeWindows.includes(type)) {
            const iframe = windowElement.querySelector('iframe');
            const preloader = windowElement.querySelector('.preloader');
            if (iframe && preloader) {
                iframe.style.opacity = '0';
                iframe.style.transition = 'opacity 0.3s ease';
                iframe.onload = () => {
                    preloader.style.opacity = '0';
                    iframe.style.opacity = '1';
                    setTimeout(() => preloader.remove(), 300);
                };
            }
        }

        if (isMobile) {
            this.initializeMobileSupport();
            this.initializeMobileWindowHandlers(windowElement);
            requestAnimationFrame(() => {
                this.centerWindowOnMobile(windowElement);
                windowElement.classList.add('window-opening');
            });
        } else {
            windowElement.style.left = `${position.x}px`;
            windowElement.style.top = `${position.y}px`;
            this.makeWindowDraggable(windowElement);
            this.makeWindowResizable(windowElement);
            this.addToTaskbar(windowId, type);
        }

        // Initialize specific window types
        if (type === 'snake') {
            const container = document.createElement('div');
            container.id = 'snake-root';
            windowElement.querySelector('.window-content').appendChild(container);
            
            if (window.initSnakeGame) {
                window.initSnakeGame(windowId);
            } else {
                console.error('Snake game initialization function not found');
            }
        } else if (type === 'paint') {
            if (typeof window.initPaintApp === 'function') {
                window.initPaintApp(windowId);
            } else {
                console.error('Paint app initialization function not found');
            } 
        }else if (type === 'tetris') {   // Add this new section
            const container = document.createElement('div');
            container.id = 'tetris-root';
            windowElement.querySelector('.window-content').appendChild(container);
            
            if (window.initTetrisGame) {
                window.initTetrisGame(windowId);
            } else {
                console.error('Tetris game initialization function not found');
            }
         } else if (type === 'webcam') {
            if (typeof window.initWebcamWindow === 'function') {
                window.initWebcamWindow(windowId);
            }
        }

        this.setActiveWindow(windowId);
        
        this.windows.push({
            id: windowId,
            type: type,
            minimized: false,
            maximized: false
        });

        return windowId;
    },

    closeWindow(windowId) {
        const windowElement = document.getElementById(windowId);
        const windowData = this.windows.find(w => w.id === windowId);
        if (!windowElement) return;

        if (this.isMobileDevice()) {
            windowElement.classList.add('window-closing');
            setTimeout(() => {
                windowElement.remove();
                this.windows = this.windows.filter(w => w.id !== windowId);
            }, 300);
        } else {
            windowElement.classList.add('closing');
            setTimeout(() => {
                // Clean up specific window types
                if (windowData && windowData.type === 'snake') {
                    window.cleanupSnakeGame(windowId);
                } else if (windowData && windowData.type === 'paint') {
                    window.cleanupPaintApp(windowId);
                }else if (windowData && windowData.type === 'tetris') {  // Add this
                    window.cleanupTetrisGame(windowId);
                } else if (windowData && windowData.type === 'webcam') {
                    window.cleanupWebcamWindow?.(windowId);
                }
                
                windowElement.remove();
                this.removeFromTaskbar(windowId);
                this.windows = this.windows.filter(w => w.id !== windowId);
                
                if (this.activeWindow === windowId) {
                    const lastWindow = this.windows[this.windows.length - 1];
                    if (lastWindow) {
                        this.setActiveWindow(lastWindow.id);
                    } else {
                        this.activeWindow = null;
                    }
                }
                
                this.updateLogoVisibility();
            }, 200);
        }
    },

    minimizeWindow(windowId) {
        const windowElement = document.getElementById(windowId);
        const windowData = this.windows.find(w => w.id === windowId);
        
        if (windowElement && windowData) {
            windowElement.classList.add('minimizing');
            setTimeout(() => {
                windowElement.style.display = 'none';
                windowElement.classList.remove('minimizing');
            }, 200);
            windowData.minimized = true;
            
            const taskbarItem = document.querySelector(`.taskbar-item[data-window="${windowId}"]`);
            if (taskbarItem) {
                taskbarItem.classList.add('minimized');
            }
            
            if (this.activeWindow === windowId) {
                const visibleWindow = this.windows.find(w => !w.minimized);
                if (visibleWindow) {
                    this.setActiveWindow(visibleWindow.id);
                }
            }
            this.updateLogoVisibility();
        }
    },

    restoreWindow(windowId) {
        const windowElement = document.getElementById(windowId);
        const windowData = this.windows.find(w => w.id === windowId);
        
        if (windowElement && windowData) {
            windowElement.style.display = 'flex';
            windowData.minimized = false;
            
            const taskbarItem = document.querySelector(`.taskbar-item[data-window="${windowId}"]`);
            if (taskbarItem) {
                taskbarItem.classList.remove('minimized');
            }
            
            this.setActiveWindow(windowId);
            this.updateLogoVisibility();
        }
    },

    toggleMaximize(windowId) {
        const windowElement = document.getElementById(windowId);
        const windowData = this.windows.find(w => w.id === windowId);
        
        if (!windowElement || !windowData) return;

        const taskbarHeight = document.getElementById('taskbar')?.offsetHeight || 0;

        if (windowData.maximized) {
            windowElement.style.transition = 'all 0.3s ease';
            
            if (windowData.prevState) {
                windowElement.style.left = windowData.prevState.left;
                windowElement.style.top = windowData.prevState.top;
                windowElement.style.width = windowData.prevState.width;
                windowElement.style.height = windowData.prevState.height;
            }
            
            windowElement.classList.remove('maximized');
            windowData.maximized = false;
            
            // Restore window controls visibility
            const maxButton = windowElement.querySelector('.control.maximize i');
            if (maxButton) {
                maxButton.className = 'fas fa-square';
            }
        } else {
            windowData.prevState = {
                left: windowElement.style.left,
                top: windowElement.style.top,
                width: windowElement.style.width,
                height: windowElement.style.height
            };

            windowElement.style.transition = 'all 0.3s ease';
            windowElement.style.left = '0';
            windowElement.style.top = `${taskbarHeight}px`;
            windowElement.style.width = '100%';
            windowElement.style.height = `calc(100vh - ${taskbarHeight}px)`;
            
            windowElement.classList.add('maximized');
            windowData.maximized = true;
            
            // Update maximize button icon
            const maxButton = windowElement.querySelector('.control.maximize i');
            if (maxButton) {
                maxButton.className = 'fas fa-clone';
            }
        }

        this.setActiveWindow(windowId);
        this.updateLogoVisibility();

        setTimeout(() => {
            windowElement.style.transition = '';
        }, 300);
    },

    makeWindowResizable(windowElement) {
        // Don't make webcam window resizable
        if (windowElement.getAttribute('data-type') === 'webcam') return;

        const resizeHandle = windowElement.querySelector('.window-resize-handle');
        if (!resizeHandle) return;

        let isResizing = false;
        let startX, startY, startWidth, startHeight;

        const resizeStart = (e) => {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = windowElement.offsetWidth;
            startHeight = windowElement.offsetHeight;
            this.setActiveWindow(windowElement.id);
            
            windowElement.style.willChange = 'width, height';
            windowElement.style.transition = 'none';
            
            e.preventDefault();
        };

        const resize = (e) => {
            if (!isResizing) return;
            
            requestAnimationFrame(() => {
                const width = startWidth + (e.clientX - startX);
                const height = startHeight + (e.clientY - startY);
                if (width >= 300) windowElement.style.width = `${width}px`;
                if (height >= 200) windowElement.style.height = `${height}px`;
            });
        };

        const resizeEnd = () => {
            isResizing = false;
            windowElement.style.willChange = 'auto';
            windowElement.style.transition = '';
        };

        resizeHandle.addEventListener('mousedown', resizeStart);
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', resizeEnd);
    },

    makeWindowDraggable(windowElement) {
        const header = windowElement.querySelector('.window-header');
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        const dragStart = (e) => {
            if (e.target.closest('.window-controls')) return;
            
            const windowData = this.windows.find(w => w.id === windowElement.id);
            if (windowData?.maximized) return;

            isDragging = true;
            this.setActiveWindow(windowElement.id);
            
            startX = e.clientX;
            startY = e.clientY;
            
            const computedStyle = window.getComputedStyle(windowElement);
            startLeft = parseInt(computedStyle.left);
            startTop = parseInt(computedStyle.top);
            
            windowElement.style.willChange = 'transform';
            windowElement.style.transition = 'none';
        };

        const drag = (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            requestAnimationFrame(() => {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                
                windowElement.style.left = `${startLeft + dx}px`;
                windowElement.style.top = `${startTop + dy}px`;
            });
        };

        const dragEnd = () => {
            isDragging = false;
            windowElement.style.willChange = 'auto';
            windowElement.style.transition = '';
        };

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
    },

    initializeMobileWindowHandlers(windowElement) {
        let touchStartY = 0;
        let touchStartTime = 0;
        let isScrolling = false;
        
        windowElement.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
            isScrolling = false;
        }, { passive: true });

        windowElement.addEventListener('touchmove', (e) => {
            const touchY = e.touches[0].clientY;
            const deltaY = touchY - touchStartY;
            const content = windowElement.querySelector('.window-content');

            if (content.scrollTop > 0 || (content.scrollTop === 0 && deltaY < 0)) {
                isScrolling = true;
                return;
            }

            if (!isScrolling && Math.abs(deltaY) > 10) {
                e.preventDefault();
                windowElement.style.transform = `translateX(-50%) translateY(${deltaY}px)`;
            }
        }, { passive: false });

        windowElement.addEventListener('touchend', (e) => {
            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;
            const deltaY = e.changedTouches[0].clientY - touchStartY;

            if (Math.abs(deltaY) < 100 && touchDuration < 300) {
                windowElement.style.transform = 'translateX(-50%)';
                return;
            }

            if (deltaY > 100) {
                this.closeWindow(windowElement.id);
            } else {
                windowElement.style.transform = 'translateX(-50%)';
            }
        }, { passive: true });
    },

    setActiveWindow(windowId) {
        this.windows.forEach(w => {
            const el = document.getElementById(w.id);
            if (el) {
                el.classList.remove('active');
                const taskbarItem = document.querySelector(`.taskbar-item[data-window="${w.id}"]`);
                if (taskbarItem) {
                    taskbarItem.classList.remove('active');
                }
            }
        });

        const windowElement = document.getElementById(windowId);
        if (windowElement) {
            windowElement.classList.add('active');
            if (!windowElement.classList.contains('maximized')) {
                windowElement.style.zIndex = this.zIndexCounter++;
            }
            this.activeWindow = windowId;
            
            const taskbarItem = document.querySelector(`.taskbar-item[data-window="${windowId}"]`);
            if (taskbarItem) {
                taskbarItem.classList.add('active');
            }
        }
    },

    centerWindowOnMobile(windowElement) {
        if (!this.isMobileDevice()) return;
        
        const width = Math.min(window.innerWidth * 0.92, 500);
        windowElement.style.width = `${width}px`;
        windowElement.style.left = '50%';
        windowElement.style.transform = 'translateX(-50%)';
        windowElement.style.top = '60px';
    },

    addToTaskbar(windowId, type) {
        const taskbar = document.getElementById('active-windows');
        if (!taskbar) return;
        
        const taskbarItem = document.createElement('div');
        taskbarItem.className = 'taskbar-item';
        taskbarItem.setAttribute('data-window', windowId);
        taskbarItem.innerHTML = `
            <i class="fas fa-${this.getIconForType(type)}"></i>
            <span>${this.getTitleForType(type)}</span>
        `;
        
        taskbarItem.addEventListener('click', () => {
            const windowData = this.windows.find(w => w.id === windowId);
            if (windowData) {
                if (windowData.minimized) {
                    this.restoreWindow(windowId);
                } else if (this.activeWindow === windowId) {
                    this.minimizeWindow(windowId);
                } else {
                    this.setActiveWindow(windowId);
                }
            }
        });
        
        taskbar.appendChild(taskbarItem);
    },

    removeFromTaskbar(windowId) {
        document.querySelector(`.taskbar-item[data-window="${windowId}"]`)?.remove();
    },

    getIconForType(type) {
        const icons = {
            welcome: 'comment',
            about: 'cloud',
            shrines: 'heart',
            blog: 'tv',
            projects: 'computer',
            ocs: 'user',
            art: 'palette',
            links: 'phone',
            guestbook: 'book',
            webcam: 'camera',
            snake: 'gamepad',
            paint: 'paint-brush'
        };
        return icons[type] || 'window-maximize';
    },
    
    getTitleForType(type) {
        const titles = {
            welcome: 'Welcome.txt',
            about: 'About me',
            shrines: 'Shrines',
            blog: 'Blog',
            projects: 'Projects',
            ocs: 'OCs',
            art: 'Art',
            links: 'Links',
            guestbook: 'Guestbook',
            webcam: 'Webcam',
            snake: 'Snake Game',
            paint: 'Paint'
        };
        return titles[type] || type.charAt(0).toUpperCase() + type.slice(1);
    },

    cleanupSnakeGame(windowId) {
        const container = document.querySelector(`#${windowId} #snake-root`);
        if (container) {
            ReactDOM.unmountComponentAtNode(container);
        }
    },

    handleWindowResize() {
        const isMobile = this.isMobileDevice();
        document.body.classList.toggle('is-mobile', isMobile);
        
        this.windows.forEach(windowData => {
            const element = document.getElementById(windowData.id);
            if (element && isMobile) {
                this.centerWindowOnMobile(element);
            }
        });
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    debugLog('Initializing WindowSystem');
    
    // Mobile nav buttons
    document.querySelectorAll('.mobile-nav-item').forEach(btn => {
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            const type = btn.querySelector('span')?.textContent?.toLowerCase();
            if (type) {
                handleMobileNavClick(type);
            }
        }, { passive: false });
    });

    // Define the global handleWindowResize function
    window.handleWindowResize = () => WindowSystem.handleWindowResize();

    // Set up resize event listener with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(window.handleWindowResize, 250);
    });
});

// Make these functions globally available
window.WindowSystem = WindowSystem;
window.handleMobileNavClick = handleMobileNavClick;

// Handle mobile navigation click
function handleMobileNavClick(type) {
    if (!WindowSystem.isMobileDevice()) return;

    const existingWindow = WindowSystem.windows.find(w => w.type === type);
    
    if (existingWindow) {
        const windowElement = document.getElementById(existingWindow.id);
        if (windowElement.classList.contains('window-minimized')) {
            windowElement.classList.remove('window-minimized');
        } else {
            WindowSystem.closeWindow(existingWindow.id);
        }
    } else {
        WindowSystem.createWindow(type);
    }
}

export { WindowSystem, handleMobileNavClick };