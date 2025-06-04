function toggleStartMenu() {
    const template = document.getElementById('start-menu-template');
    if (!template) {
        console.error('Start menu template not found');
        return;
    }

    let existingMenu = document.querySelector('.start-menu');
    
    if (existingMenu) {
        existingMenu.remove();
    } else {
        // Create the menu container
        const menuContainer = document.createElement('div');
        menuContainer.className = 'start-menu';
        menuContainer.innerHTML = template.innerHTML;
        document.body.appendChild(menuContainer);

        // Add click handler for closing menu
        const handleOutsideClick = (e) => {
            if (!e.target.closest('.start-menu') && !e.target.closest('.menu-bar-item')) {
                menuContainer.remove();
                document.removeEventListener('click', handleOutsideClick);
            }
        };

        // Delay adding the click handler to prevent immediate closure
        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
        }, 100);
    }
}

window.toggleStartMenu = toggleStartMenu;