function createMobileAppDock() {
    console.log('Creating mobile dock...');
    
    function MacOSDock() {
        const [hoveredIndex, setHoveredIndex] = React.useState(null);
        const [apps, setApps] = React.useState([]);
        const [isDarkMode, setIsDarkMode] = React.useState(true);

        React.useEffect(() => {
            const desktopIcons = document.querySelectorAll('.desktop-icon');
            const excludedTypes = ['welcome', 'links', 'guestbook'];
            
            const dynamicApps = Array.from(desktopIcons)
                .map(icon => {
                    const nameElement = icon.querySelector('span');
                    const imgElement = icon.querySelector('img');
                    return {
                        imgSrc: imgElement?.src || '',
                        name: nameElement?.textContent || '',
                        type: nameElement?.textContent?.toLowerCase() || ''
                    };
                })
                .filter(app => app.imgSrc && app.name && !excludedTypes.includes(app.type));
            setApps(dynamicApps);

            // Watch for theme changes
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        setIsDarkMode(document.body.classList.contains('dark-theme'));
                    }
                });
            });

            observer.observe(document.body, {
                attributes: true,
                attributeFilter: ['class']
            });

            return () => observer.disconnect();
        }, []);

        const getIconScale = (index) => {
            if (hoveredIndex === null) return 1;
            const distance = Math.abs(hoveredIndex - index);
            if (distance === 0) return 1.5;
            if (distance === 1) return 1.2;
            if (distance === 2) return 1.1;
            return 1;
        };

        // Dock container with gradient background
        return React.createElement('div', {
            style: {
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }
        }, [
            // Background with gradient and blur
            React.createElement('div', {
                key: 'bg',
                style: {
                    position: 'absolute',
                    inset: 0,
                    background: isDarkMode 
                        ? 'linear-gradient(to top, rgba(28, 28, 28, 0.95), rgba(38, 38, 38, 0.8))'
                        : 'linear-gradient(to top, rgba(255, 192, 203, 0.9), rgba(255, 255, 255, 0.8))',
                    backdropFilter: 'blur(10px)',
                    borderTop: isDarkMode
                        ? '2px solid rgba(70, 70, 70, 0.5)'
                        : '2px solid rgba(255, 175, 215, 0.5)'
                }
            }),
            
            // Dock content
            React.createElement('div', {
                key: 'content',
                style: {
                    position: 'relative',
                    display: 'flex',
                    padding: '8px 16px 12px 16px',
                    gap: '24px',
                    zIndex: 1
                }
            }, apps.map((app, index) => 
                React.createElement('div', {
                    key: app.name,
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        transform: `scale(${getIconScale(index)})`,
                        transition: 'transform 0.2s ease',
                        transformOrigin: 'bottom center'
                    },
                    onMouseEnter: () => setHoveredIndex(index),
                    onMouseLeave: () => setHoveredIndex(null),
                    onTouchStart: () => setHoveredIndex(index),
                    onTouchEnd: () => {
                        setHoveredIndex(null);
                        window.handleMobileNavClick?.(app.type);
                    },
                    onClick: () => window.handleMobileNavClick?.(app.type)
                }, [
                    // Icon button
                    React.createElement('button', {
                        style: {
                            width: '48px',
                            height: '48px',
                            borderRadius: '16px',
                            background: isDarkMode
                                ? 'linear-gradient(to bottom right, rgba(50, 50, 50, 0.9), rgba(30, 30, 30, 0.2))'
                                : 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.9), rgba(255, 192, 203, 0.2))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: isDarkMode 
                                ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                                : '0 4px 12px rgba(255, 175, 215, 0.3)',
                            border: isDarkMode
                                ? '1px solid rgba(70, 70, 70, 0.5)'
                                : '1px solid rgba(255, 192, 203, 0.5)',
                            transition: 'all 0.2s ease'
                        }
                    }, 
                        React.createElement('img', {
                            src: app.imgSrc,
                            alt: app.name,
                            style: {
                                width: '24px',
                                height: '24px',
                                objectFit: 'contain'
                            }
                        })
                    ),
                    // Label
                    React.createElement('div', {
                        style: {
                            position: 'absolute',
                            top: '-30px',
                            background: isDarkMode ? '#2D2D2D' : '#916892',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            opacity: hoveredIndex === index ? 1 : 0,
                            transform: `scale(${hoveredIndex === index ? 1 : 0.9})`,
                            transition: 'all 0.2s ease',
                            pointerEvents: 'none',
                            boxShadow: isDarkMode
                                ? '0 4px 12px rgba(0, 0, 0, 0.4)'
                                : '0 4px 12px rgba(145, 104, 146, 0.3)',
                            whiteSpace: 'nowrap'
                        }
                    }, app.name)
                ])
            )),
            
            // Reflection effect
            React.createElement('div', {
                key: 'reflection',
                style: {
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: '32px',
                    background: isDarkMode
                        ? 'linear-gradient(to bottom, rgba(40, 40, 40, 0.3), transparent)'
                        : 'linear-gradient(to bottom, rgba(255, 192, 203, 0.3), transparent)',
                    transform: 'scaleY(-0.3) translateY(8px)',
                    opacity: 0.4,
                    pointerEvents: 'none'
                }
            })
        ]);
    }

    // Remove any existing dock
    const existingDock = document.getElementById('dock-container');
    if (existingDock) {
        existingDock.remove();
    }

    // Create new dock container
    const dockContainer = document.createElement('div');
    dockContainer.id = 'dock-container';
    document.body.appendChild(dockContainer);

    // Render the dock
    const root = React.createElement(MacOSDock);
    ReactDOM.render(root, dockContainer);
}

// Initialize dock on mobile
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 768) {
        createMobileAppDock();
        const oldMobileNav = document.querySelector('.mobile-nav');
        if (oldMobileNav) {
            oldMobileNav.remove();
        }
    }
});