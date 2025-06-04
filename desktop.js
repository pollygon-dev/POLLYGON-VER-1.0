// GIF handling function
function handleDesktopGifLoad() {
    const gifContainers = document.querySelectorAll('.gif-container');
    
    gifContainers.forEach(container => {
        const img = container.querySelector('img');
        if (img) {
            img.addEventListener('load', function() {
                // Add loaded class for fade-in effect
                this.classList.add('loaded');
                
                // Calculate aspect ratios
                const containerRatio = 699 / 398;
                const imageRatio = this.naturalWidth / this.naturalHeight;
                
                // Determine if we should fit by width or height
                if (imageRatio > containerRatio) {
                    // Image is wider relative to container
                    this.style.width = '100%';
                    this.style.height = 'auto';
                } else {
                    // Image is taller relative to container
                    this.style.width = 'auto';
                    this.style.height = '100%';
                }
            });
            
            // Handle load errors
            img.addEventListener('error', function() {
                console.log('Error loading image');
                this.src = 'path-to-fallback-image.png'; // Optional: provide a fallback image
            });
        }
    });
}

// Desktop Logo Class - Using unique class name to avoid conflicts
class DesktopLogoManager {
    constructor() {
        this.logoElement = null;
        
        // Configuration
        this.logoConfig = {
            logoSize: { width: 200, height: 100 },
            position: { bottom: 70, right: 20 } // Above taskbar
        };

        this.initLogo();
    }

    initLogo() {
        this.createDesktopLogo();
        this.setupLogoResponsiveFeatures();
    }

    createDesktopLogo() {
        this.logoElement = document.createElement('div');
        this.logoElement.id = 'desktop-logo-element';
        this.logoElement.innerHTML = `<img src="newpollygon2.png" alt="POLLYGON Logo" />`;

        Object.assign(this.logoElement.style, {
            position: 'fixed',
            bottom: this.logoConfig.position.bottom + 'px',
            right: this.logoConfig.position.right + 'px',
            width: this.logoConfig.logoSize.width + 'px',
            height: this.logoConfig.logoSize.height + 'px',
            zIndex: '500',
            opacity: '0.8',
            pointerEvents: 'none',
            userSelect: 'none'
        });

        const logoImg = this.logoElement.querySelector('img');
        Object.assign(logoImg.style, {
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
        });

        document.getElementById('desktop').appendChild(this.logoElement);
        console.log('Desktop logo created');
    }

    setupLogoResponsiveFeatures() {
        // Adjust logo size based on screen size
        window.addEventListener('resize', () => {
            this.adjustDesktopLogoForScreen();
        });
        
        // Initial adjustment
        this.adjustDesktopLogoForScreen();
    }

    adjustDesktopLogoForScreen() {
        if (!this.logoElement) return;

        const screenWidth = window.innerWidth;
        let newLogoSize, newLogoPosition;

        if (screenWidth <= 479) {
            // Mobile
            newLogoSize = { width: 120, height: 60 };
            newLogoPosition = { bottom: 60, right: 10 };
        } else if (screenWidth <= 767) {
            // Tablet
            newLogoSize = { width: 160, height: 80 };
            newLogoPosition = { bottom: 60, right: 15 };
        } else {
            // Desktop
            newLogoSize = { width: 200, height: 100 };
            newLogoPosition = { bottom: 70, right: 20 };
        }

        // Update logo size and position
        Object.assign(this.logoElement.style, {
            width: newLogoSize.width + 'px',
            height: newLogoSize.height + 'px',
            bottom: newLogoPosition.bottom + 'px',
            right: newLogoPosition.right + 'px'
        });
    }

    destroyLogo() {
        if (this.logoElement) this.logoElement.remove();
    }
}

// Simple Responsive Box Manager - Using unique class name
class DesktopBoxManager {
    constructor() {
        this.initBoxManager();
    }

    initBoxManager() {
        this.setupBoxResponsiveListeners();
        this.adjustDesktopBoxesForScreen();
    }

    setupBoxResponsiveListeners() {
        let boxResizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(boxResizeTimeout);
            boxResizeTimeout = setTimeout(() => {
                this.adjustDesktopBoxesForScreen();
            }, 150);
        });
    }

    adjustDesktopBoxesForScreen() {
        const screenHeight = window.innerHeight;
        const screenWidth = window.innerWidth;
        
        // Adjust microblog max height
        const microblogContent = document.querySelector('.microblog-content');
        if (microblogContent) {
            let maxHeight;
            if (screenWidth <= 479) {
                maxHeight = Math.min(200, screenHeight - 180);
            } else if (screenWidth <= 767) {
                maxHeight = Math.min(300, screenHeight - 250);
            } else {
                maxHeight = screenHeight - 400;
            }
            microblogContent.style.maxHeight = `${maxHeight}px`;
        }

        // Adjust music player position
        const musicPlayerElement = document.querySelector('.music-player');
        if (musicPlayerElement) {
            const taskbarElement = document.getElementById('taskbar');
            const taskbarHeight = taskbarElement ? taskbarElement.offsetHeight : 45;
            musicPlayerElement.style.bottom = `${taskbarHeight + 5}px`;
        }
    }
}

// Initialize everything after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize GIF handling
    handleDesktopGifLoad();

    // Show/Hide functionality for windows
    const showMicroblog = document.querySelector('.show-microblog');
    const showPlayer = document.querySelector('.show-player');
    const showGif = document.querySelector('.show-gif');
    const microblogBox = document.querySelector('.microblog-box');
    const musicPlayer = document.querySelector('.music-player');
    const gifBox = document.querySelector('.gif-box');

    if (showMicroblog) {
        showMicroblog.addEventListener('click', function(e) {
            e.preventDefault();
            if (microblogBox.classList.contains('hidden')) {
                microblogBox.classList.remove('hidden');
                showMicroblog.classList.add('active');
            } else {
                microblogBox.classList.add('hidden');
                showMicroblog.classList.remove('active');
            }
        });
    }

    if (showPlayer) {
        showPlayer.addEventListener('click', function(e) {
            e.preventDefault();
            if (musicPlayer.classList.contains('hidden')) {
                musicPlayer.classList.remove('hidden');
                showPlayer.classList.add('active');
            } else {
                musicPlayer.classList.add('hidden');
                showPlayer.classList.remove('active');
            }
        });
    }

    if (showGif) {
        showGif.addEventListener('click', function(e) {
            e.preventDefault();
            if (gifBox.classList.contains('hidden')) {
                gifBox.classList.remove('hidden');
                showGif.classList.add('active');
            } else {
                gifBox.classList.add('hidden');
                showGif.classList.remove('active');
            }
        });
    }
    
    // Window control buttons
    document.querySelectorAll('.close-microblog, .close-player, .close-gif').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.closest('.microblog-box, .music-player, .gif-box');
            const type = parent.classList.contains('microblog-box') ? 'microblog' : 
                        parent.classList.contains('music-player') ? 'player' : 'gif';
            const relatedButton = type === 'microblog' ? showMicroblog : 
                                type === 'player' ? showPlayer : showGif;
            
            if (parent) {
                parent.classList.add('hidden');
                if (relatedButton) {
                    relatedButton.classList.remove('active');
                }
            }
        });
    });

    document.querySelectorAll('.minimize-microblog, .minimize-player, .minimize-gif').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.closest('.microblog-box, .music-player, .gif-box');
            const type = parent.classList.contains('microblog-box') ? 'microblog' : 
                        parent.classList.contains('music-player') ? 'player' : 'gif';
            const relatedButton = type === 'microblog' ? showMicroblog : 
                                type === 'player' ? showPlayer : showGif;
            
            if (parent) {
                parent.classList.add('hidden');
                if (relatedButton) {
                    relatedButton.classList.remove('active');
                }
            }
        });
    });

    document.querySelectorAll('.maximize-microblog, .maximize-player, .maximize-gif').forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
            });
        }
    });

    // Initialize desktop logo
    window.desktopLogoManager = new DesktopLogoManager();
    
    // Initialize responsive box manager
    window.desktopBoxManager = new DesktopBoxManager();

    console.log('Desktop environment with webdeck player initialized successfully');
});