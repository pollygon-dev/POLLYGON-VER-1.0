/*################################################################################
##################################################################################
##########                                                             ###########
##########                                                             ###########
##########        Windows Template by                                  ###########
##########            https://html5-templates.com/                      ###########
##########                                                             ###########
##########        All rights reserved.                                 ###########
##########                                                             ###########
##########        Enhanced by POLLYGON with Desktop Logo System        ###########
##########                                                             ###########
##################################################################################
################################################################################*/

/**
 * POLLYGON Desktop Window Management System
 * Enhanced with Desktop Logo functionality
 */

class DesktopLogo {
    constructor() {
        this.logo = null;
        
        // Configuration
        this.config = {
            logoSize: { width: 200, height: 100 },
            position: { bottom: 70, right: 20 } // Above taskbar
        };

        this.init();
    }

    init() {
        this.createLogo();
    }

    createLogo() {
        this.logo = document.createElement('div');
        this.logo.id = 'desktop-logo';
        this.logo.innerHTML = `<img src="newpollygon2.png" alt="POLLYGON Logo" />`;

        Object.assign(this.logo.style, {
            position: 'fixed',
            bottom: this.config.position.bottom + 'px',
            right: this.config.position.right + 'px',
            width: this.config.logoSize.width + 'px',
            height: this.config.logoSize.height + 'px',
            zIndex: '500',
            opacity: '0.8',
            pointerEvents: 'none',
            userSelect: 'none'
        });

        const img = this.logo.querySelector('img');
        Object.assign(img.style, {
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
        });

        document.getElementById('desktop').appendChild(this.logo);
        console.log('Desktop logo created');
    }

    destroy() {
        if (this.logo) this.logo.remove();
    }
}

// Enhanced Window Manager with Logo Integration
class WindowManager {
    constructor() {
        this.windowIndex = 0;
        this.minimizedStates = new Map();
        this.windowStates = new Map();
        this.activeWindow = null;
        this.startMenuOpen = false;
        this.desktopLogo = null;
        
        this.elements = {
            taskbar: null,
            startButton: null,
            startMenu: null,
            timeDisplay: null
        };

        this.config = {
            zIndexBase: 1000,
            animationDuration: 200,
            clockUpdateInterval: 1000
        };

        this.init();
    }

    init() {
        try {
            this.cacheElements();
            // Skip window setup - using legacy system
            // this.setupWindows();
            // Skip event listeners - using legacy system  
            // this.attachEventListeners();
            this.initializeClock();
            this.adjustResponsiveWindows();
            
            // Initialize desktop logo
            this.desktopLogo = new DesktopLogo();
            
            console.log('Enhanced WindowManager initialized successfully');
        } catch (error) {
            console.error('WindowManager initialization failed:', error);
        }
    }

    cacheElements() {
        this.elements.taskbar = document.getElementById('taskbar');
        this.elements.startButton = document.getElementById('startButton');
        this.elements.startMenu = document.getElementById('startMenu');
        this.elements.timeDisplay = document.getElementById('time');

        if (!this.elements.taskbar) {
            throw new Error('Taskbar element not found');
        }
    }

    setupWindows() {
        // Skip automatic setup since legacy jQuery code handles this
        console.log('Using legacy window setup for compatibility');
    }

    initializeWindow(windowElement, index) {
        try {
            const windowId = `window${index}`;
            const title = windowElement.getAttribute('data-title') || `Window ${index}`;

            windowElement.setAttribute('data-id', index);
            windowElement.setAttribute('id', windowId);
            windowElement.style.zIndex = this.config.zIndexBase;

            this.windowStates.set(index, {
                element: windowElement,
                title: title,
                isMinimized: windowElement.classList.contains('closed'),
                originalDimensions: this.getWindowDimensions(windowElement),
                originalPosition: this.getWindowPosition(windowElement)
            });

            this.wrapWindowContent(windowElement, title);
            this.createTaskbarPanel(index, title);

            this.windowIndex = index + 1;
        } catch (error) {
            console.error(`Failed to initialize window ${index}:`, error);
        }
    }

    getWindowDimensions(windowElement) {
        return {
            width: windowElement.offsetWidth || 640,
            height: windowElement.offsetHeight || 480
        };
    }

    getWindowPosition(windowElement) {
        const style = window.getComputedStyle(windowElement);
        return {
            top: style.top,
            left: style.left
        };
    }

    wrapWindowContent(windowElement, title) {
        const existingContent = windowElement.innerHTML;
        
        windowElement.innerHTML = `
            <div class="windowHeader">
                <strong>${this.escapeHtml(title)}</strong>
                <span title="Minimize" class="winminimize" role="button" aria-label="Minimize window">
                    <span></span>
                </span>
                <span title="Maximize" class="winmaximize" role="button" aria-label="Maximize window">
                    <span></span><span></span>
                </span>
                <span title="Close" class="winclose" role="button" aria-label="Close window">×</span>
            </div>
            <div class="wincontent">${existingContent}</div>
        `;
    }

    createTaskbarPanel(windowId, title) {
        if (!this.elements.taskbar) return;

        const panel = document.createElement('div');
        panel.className = 'taskbarPanel';
        panel.id = `minimPanel${windowId}`;
        panel.setAttribute('data-id', windowId);
        panel.setAttribute('role', 'button');
        panel.setAttribute('aria-label', `Switch to ${title}`);
        panel.textContent = title;

        const windowState = this.windowStates.get(windowId);
        if (windowState?.isMinimized) {
            panel.classList.add('closed');
        }

        this.elements.taskbar.appendChild(panel);
    }

    attachEventListeners() {
        this.attachWindowEvents();
        this.attachTaskbarEvents();
        this.attachStartMenuEvents();
        this.attachKeyboardEvents();
        this.attachResizeEvents();
    }

    attachWindowEvents() {
        document.addEventListener('click', (e) => {
            const window = e.target.closest('.window');
            if (window) {
                const windowId = parseInt(window.getAttribute('data-id'));
                this.setActiveWindow(windowId);
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.matches('.winclose')) {
                e.preventDefault();
                const windowId = this.getWindowIdFromElement(e.target);
                this.closeWindow(windowId);
            } else if (e.target.matches('.winminimize')) {
                e.preventDefault();
                const windowId = this.getWindowIdFromElement(e.target);
                this.minimizeWindow(windowId);
            } else if (e.target.matches('.winmaximize')) {
                e.preventDefault();
                const windowId = this.getWindowIdFromElement(e.target);
                this.toggleMaximize(windowId);
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.matches('.openWindow') || e.target.closest('.openWindow')) {
                e.preventDefault();
                const link = e.target.matches('.openWindow') ? e.target : e.target.closest('.openWindow');
                const windowId = parseInt(link.getAttribute('data-id'));
                this.openWindow(windowId);
            }
        });
    }

    attachTaskbarEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.taskbarPanel')) {
                e.preventDefault();
                const windowId = parseInt(e.target.getAttribute('data-id'));
                this.handleTaskbarClick(windowId);
            }
        });
    }

    attachStartMenuEvents() {
        if (this.elements.startButton) {
            this.elements.startButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleStartMenu();
            });
        }

        document.addEventListener('click', (e) => {
            if (this.startMenuOpen && 
                !this.elements.startMenu?.contains(e.target) && 
                !this.elements.startButton?.contains(e.target)) {
                this.closeStartMenu();
            }
        });
    }

    attachKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'Tab') {
                e.preventDefault();
                this.switchToNextWindow();
            }
            
            if (e.key === 'Escape' && this.startMenuOpen) {
                this.closeStartMenu();
            }
        });
    }

    attachResizeEvents() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.adjustResponsiveWindows();
            }, 250);
        });
    }

    getWindowIdFromElement(element) {
        const window = element.closest('.window');
        return window ? parseInt(window.getAttribute('data-id')) : null;
    }

    setActiveWindow(windowId) {
        if (windowId === null || windowId === undefined) return;

        try {
            document.querySelectorAll('.window').forEach(win => {
                win.classList.remove('activeWindow');
                const currentZ = parseInt(win.style.zIndex) || this.config.zIndexBase;
                if (currentZ > 0) {
                    win.style.zIndex = currentZ - 1;
                }
            });

            document.querySelectorAll('.taskbarPanel').forEach(panel => {
                panel.classList.remove('activeTab');
            });

            const activeWindow = document.getElementById(`window${windowId}`);
            const activePanel = document.getElementById(`minimPanel${windowId}`);

            if (activeWindow) {
                activeWindow.classList.add('activeWindow');
                activeWindow.style.zIndex = this.config.zIndexBase;
                this.activeWindow = windowId;
            }

            if (activePanel) {
                activePanel.classList.add('activeTab');
            }
        } catch (error) {
            console.error(`Failed to set active window ${windowId}:`, error);
        }
    }

    openWindow(windowId) {
        const windowState = this.windowStates.get(windowId);
        if (!windowState) return;

        const windowElement = windowState.element;
        const panelElement = document.getElementById(`minimPanel${windowId}`);

        if (windowElement.classList.contains('minimizedWindow')) {
            this.restoreMinimizedWindow(windowId);
        } else {
            windowElement.classList.remove('closed');
            if (panelElement) {
                panelElement.classList.remove('closed');
            }
            this.setActiveWindow(windowId);
        }
    }

    closeWindow(windowId) {
        const windowState = this.windowStates.get(windowId);
        if (!windowState) return;

        const windowElement = windowState.element;
        const panelElement = document.getElementById(`minimPanel${windowId}`);

        windowElement.classList.add('closed');
        if (panelElement) {
            panelElement.classList.add('closed');
        }

        if (this.activeWindow === windowId) {
            this.switchToNextWindow();
        }
    }

    minimizeWindow(windowId) {
        const windowState = this.windowStates.get(windowId);
        if (!windowState) return;

        const windowElement = windowState.element;
        const panelElement = document.getElementById(`minimPanel${windowId}`);

        this.minimizedStates.set(windowId, {
            top: windowElement.style.top || windowState.originalPosition.top,
            left: windowElement.style.left || windowState.originalPosition.left
        });

        this.animateToTaskbar(windowElement, () => {
            windowElement.classList.add('minimizedWindow');
            if (panelElement) {
                panelElement.classList.add('minimizedTab');
                panelElement.classList.remove('activeTab');
            }
        });

        if (this.activeWindow === windowId) {
            this.switchToNextWindow();
        }
    }

    restoreMinimizedWindow(windowId) {
        const windowState = this.windowStates.get(windowId);
        const minimizedState = this.minimizedStates.get(windowId);
        
        if (!windowState || !minimizedState) return;

        const windowElement = windowState.element;
        const panelElement = document.getElementById(`minimPanel${windowId}`);

        windowElement.classList.remove('minimizedWindow');
        if (panelElement) {
            panelElement.classList.remove('minimizedTab');
        }

        this.animateFromTaskbar(windowElement, minimizedState.top, minimizedState.left);
        this.setActiveWindow(windowId);
    }

    toggleMaximize(windowId) {
        const windowState = this.windowStates.get(windowId);
        if (!windowState) return;

        const windowElement = windowState.element;
        const contentElement = windowElement.querySelector('.wincontent');

        if (windowElement.classList.contains('fullSizeWindow')) {
            windowElement.classList.remove('fullSizeWindow');
            if (contentElement) {
                const original = windowState.originalDimensions;
                contentElement.style.width = `${original.width}px`;
                contentElement.style.height = `${original.height}px`;
            }
        } else {
            windowElement.classList.add('fullSizeWindow');
            if (contentElement) {
                windowState.originalDimensions = {
                    width: contentElement.offsetWidth,
                    height: contentElement.offsetHeight
                };
                this.adjustFullScreenSize(contentElement);
            }
        }
    }

    handleTaskbarClick(windowId) {
        const panelElement = document.getElementById(`minimPanel${windowId}`);
        if (!panelElement) return;

        if (panelElement.classList.contains('activeTab')) {
            this.minimizeWindow(windowId);
        } else if (panelElement.classList.contains('minimizedTab')) {
            this.restoreMinimizedWindow(windowId);
        } else {
            this.setActiveWindow(windowId);
        }
    }

    switchToNextWindow() {
        const availableWindows = Array.from(this.windowStates.entries())
            .filter(([id, state]) => !state.element.classList.contains('closed'))
            .map(([id]) => id);

        if (availableWindows.length === 0) return;

        const currentIndex = availableWindows.indexOf(this.activeWindow);
        const nextIndex = (currentIndex + 1) % availableWindows.length;
        const nextWindowId = availableWindows[nextIndex];

        this.setActiveWindow(nextWindowId);
    }

    toggleStartMenu() {
        if (this.startMenuOpen) {
            this.closeStartMenu();
        } else {
            this.openStartMenu();
        }
    }

    openStartMenu() {
        if (!this.elements.startMenu || !this.elements.startButton) return;

        this.elements.startMenu.classList.add('active');
        this.elements.startButton.classList.add('active');
        this.startMenuOpen = true;
    }

    closeStartMenu() {
        if (!this.elements.startMenu || !this.elements.startButton) return;

        this.elements.startMenu.classList.remove('active');
        this.elements.startButton.classList.remove('active');
        this.startMenuOpen = false;
    }

    animateToTaskbar(element, callback) {
        const taskbarRect = this.elements.taskbar?.getBoundingClientRect();
        if (!taskbarRect) {
            callback();
            return;
        }

        element.style.transition = `all ${this.config.animationDuration}ms ease-in-out`;
        element.style.top = `${taskbarRect.top}px`;
        element.style.left = '0px';

        setTimeout(() => {
            element.style.transition = '';
            callback();
        }, this.config.animationDuration);
    }

    animateFromTaskbar(element, top, left) {
        element.style.transition = `all ${this.config.animationDuration}ms ease-in-out`;
        element.style.top = top;
        element.style.left = left;

        setTimeout(() => {
            element.style.transition = '';
        }, this.config.animationDuration);
    }

    adjustResponsiveWindows() {
        const fullSizeWindows = document.querySelectorAll('.fullSizeWindow .wincontent');
        fullSizeWindows.forEach(content => {
            this.adjustFullScreenSize(content);
        });
    }

    adjustFullScreenSize(contentElement) {
        if (!contentElement) return;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const taskbarHeight = this.elements.taskbar?.offsetHeight || 45;

        contentElement.style.width = `${windowWidth - 32}px`;
        contentElement.style.height = `${windowHeight - 98 - taskbarHeight}px`;
    }

    initializeClock() {
        this.updateClock();
        setInterval(() => this.updateClock(), this.config.clockUpdateInterval);
    }

    updateClock() {
        if (!this.elements.timeDisplay) return;

        try {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const hour12 = hours % 12 || 12;
            const timeString = `${hour12}:${minutes.toString().padStart(2, '0')}${ampm}`;
            
            this.elements.timeDisplay.textContent = timeString;
        } catch (error) {
            console.error('Clock update failed:', error);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    destroy() {
        if (this.clockInterval) {
            clearInterval(this.clockInterval);
        }
        if (this.desktopLogo) {
            this.desktopLogo.destroy();
        }
        this.windowStates.clear();
        this.minimizedStates.clear();
    }
}

// Legacy variables for backward compatibility
var windowIndex = 0,
minimizedWidth = new Array,
minimizedHeight = new Array,
windowTopPos = new Array,
windowLeftPos = new Array,
panel,
windowId;

// Legacy functions for backward compatibility
function adjustFullScreenSize() {
    if (window.windowManager) {
        window.windowManager.adjustResponsiveWindows();
    } else {
        $(".fullSizeWindow .wincontent").css("width", (window.innerWidth - 32));
        $(".fullSizeWindow .wincontent").css("height", (window.innerHeight - 98));
    }
}

function makeWindowActive(thisid) {
    if (window.windowManager) {
        window.windowManager.setActiveWindow(thisid);
    } else {
        $(".window").each(function() {      
            $(this).css('z-index', $(this).css('z-index') - 1);
        });
        $("#window" + thisid).css('z-index',1000);
        $(".window").removeClass("activeWindow");
        $("#window" + thisid).addClass("activeWindow");
        
        $(".taskbarPanel").removeClass('activeTab');
        $("#minimPanel" + thisid).addClass("activeTab");
    }
}

function minimizeWindow(windowId) {
    if (window.windowManager) {
        window.windowManager.minimizeWindow(windowId);
    } else {
        windowTopPos[windowId] = $("#window" + windowId).css("top");
        windowLeftPos[windowId] = $("#window" + windowId).css("left");
        
        $("#window" + windowId).animate({
            top: 800,
            left: 0
        }, 200, function() {
            $("#window" + windowId).addClass('minimizedWindow');
            $("#minimPanel" + windowId).addClass('minimizedTab');
            $("#minimPanel" + windowId).removeClass('activeTab');
        });
    }
}

function openWindow(windowId) {
    if (window.windowManager) {
        window.windowManager.openWindow(windowId);
    } else {
        if ($('#window' + windowId).hasClass("minimizedWindow")) {
            openMinimized(windowId);
        } else {    
            makeWindowActive(windowId);
            $("#window" + windowId).removeClass("closed");
            $("#minimPanel" + windowId).removeClass("closed");
        }
    }
}

function closeWindow(windowId) {
    if (window.windowManager) {
        window.windowManager.closeWindow(windowId);
    } else {
        $("#window" + windowId).addClass("closed");
        $("#minimPanel" + windowId).addClass("closed");
    }
}

// Legacy function name for backward compatibility
function closeWindwow(windowId) {
    closeWindow(windowId);
}

function openMinimized(windowId) {
    if (window.windowManager) {
        window.windowManager.restoreMinimizedWindow(windowId);
    } else {
        $('#window' + windowId).removeClass("minimizedWindow");
        $('#minimPanel' + windowId).removeClass("minimizedTab");
        makeWindowActive(windowId);
            
        $('#window' + windowId).animate({
            top: windowTopPos[windowId],
            left: windowLeftPos[windowId]
        }, 200, function() {
        });
    }
}

// Initialize everything when DOM is ready
$(document).ready(function(){
    // Initialize legacy window system first for compatibility
    $(".window").each(function() {      
        $(this).css('z-index',1000)
        $(this).attr('data-id', windowIndex);
        minimizedWidth[windowIndex] = $(this).width();
        minimizedHeight[windowIndex] = $(this).height();
        windowTopPos[windowIndex] = $(this).css("top");
        windowLeftPos[windowIndex] = $(this).css("left");
        $("#taskbar").append('<div class="taskbarPanel" id="minimPanel' + windowIndex + '" data-id="' + windowIndex + '">' + $(this).attr("data-title") + '</div>');
        if ($(this).hasClass("closed")) {    $("#minimPanel" + windowIndex).addClass('closed');    }        
        $(this).attr('id', 'window' + (windowIndex++));
        $(this).wrapInner('<div class="wincontent"></div>');
        $(this).prepend('<div class="windowHeader"><strong>' + $(this).attr("data-title") + '</strong><span title="Minimize" class="winminimize"><span></span></span><span title="Maximize" class="winmaximize"><span></span><span></span></span><span title="Close" class="winclose">x</span></div>');
    });
    
    $("#minimPanel" + (windowIndex-1)).addClass('activeTab');
    $("#window" + (windowIndex-1)).addClass('activeWindow');

    // Attach event listeners for window controls
    $(".window").mousedown(function(){
        makeWindowActive($(this).attr("data-id"));
    });
    
    $(".winclose").click(function(){
        closeWindwow($(this).parent().parent().attr("data-id"));
    });    

    $(".winminimize").click(function(){
        minimizeWindow($(this).parent().parent().attr("data-id"));
    });    
    
    $(".taskbarPanel").click(function(){
        windowId = $(this).attr("data-id");
        if ($(this).hasClass("activeTab")) {
            minimizeWindow($(this).attr("data-id"));
        } else {
            if ($(this).hasClass("minimizedTab")) {
                openMinimized(windowId);
            } else {
                makeWindowActive(windowId);
            }
        }
    });    
    
    $(".openWindow").click(function(){
        openWindow($(this).attr("data-id"));
    });
    
    $(".winmaximize").click(function(){
        if ($(this).parent().parent().hasClass('fullSizeWindow')) {
            $(this).parent().parent().removeClass('fullSizeWindow');
            $(this).parent().parent().children(".wincontent").height(minimizedHeight[$(this).parent().parent().attr("data-id")]);    
            $(this).parent().parent().children(".wincontent").width(minimizedWidth[$(this).parent().parent().attr("data-id")]);
        } else {
            $(this).parent().parent().addClass('fullSizeWindow');
            minimizedHeight[$(this).parent().parent().attr('data-id')] = $(this).parent().parent().children(".wincontent").height();
            minimizedWidth[$(this).parent().parent().attr('data-id')] = $(this).parent().parent().children(".wincontent").width();
            adjustFullScreenSize();
        }
    });

    // Initialize logo-only window manager after legacy setup
    window.desktopLogo = new DesktopLogo();
    
    // Legacy jQuery UI setup (if available)
    if ($.ui) {
        try {
            $(".wincontent").resizable();
            $(".window").draggable({ 
                cancel: ".wincontent"
            });
        } catch (error) {
            console.log('jQuery UI features not available');
        }
    }
    
    adjustFullScreenSize();
});

// Start menu functionality
$("#startButton").click(function(e) {
    e.stopPropagation();
    $(this).toggleClass('active');
    $("#startMenu").toggleClass('active');
});

// Close start menu when clicking outside
$(document).click(function(e) {
    if (!$("#startMenu").is(e.target) && 
        !$("#startButton").is(e.target) && 
        $("#startMenu").has(e.target).length === 0) {
        $("#startMenu").removeClass('active');
        $("#startButton").removeClass('active');
    }
});

// Update clock
function updateClock() {
    try {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hour12 = hours % 12 || 12;
        const timeString = `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        
        const timeElement = document.getElementById('time');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    } catch (error) {
        console.error('Clock update failed:', error);
    }
}

setInterval(updateClock, 1000);
updateClock();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.windowManager) {
        window.windowManager.destroy();
    }
});