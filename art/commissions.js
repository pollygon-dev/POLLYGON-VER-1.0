document.addEventListener('DOMContentLoaded', function() {
    // Commission Form Copy Functionality
    const copyButton = document.querySelector('.copy-button');
    const formTemplate = document.querySelector('.form-template');

    if (copyButton && formTemplate) {
        copyButton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(formTemplate.textContent);
                const originalContent = copyButton.innerHTML;
                copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    copyButton.innerHTML = originalContent;
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
                copyButton.innerHTML = '<i class="fas fa-times"></i> Failed to copy';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy Form';
                }, 2000);
            }
        });
    }

    // Commission Navigation System
    function setupCommissionTabs() {
        const navItems = document.querySelectorAll('.commission-nav-item');
        const sections = document.querySelectorAll('.commission-section');

        function showSection(tabName) {
            // Hide all sections
            sections.forEach(section => {
                section.style.display = 'none';
            });

            // Show selected section
            let targetSection;
            switch(tabName) {
                case 'Prices':
                    targetSection = document.querySelector('.prices-section');
                    break;
                case 'Terms':
                    targetSection = document.querySelector('.terms-section');
                    break;
                case 'Order':
                    targetSection = document.querySelector('.order-section');
                    break;
            }

            if (targetSection) {
                targetSection.style.display = 'block';
            }
        }

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                // Show corresponding section
                const tabName = item.getAttribute('data-tab');
                showSection(tabName);
            });
        });

        // Show initial tab
        showSection('Prices');
    }

    // Commission Examples Lightbox
    function setupCommissionLightbox() {
        const lightboxPortal = document.getElementById('lightbox-portal') || 
            document.createElement('div');
        lightboxPortal.id = 'lightbox-portal';
        if (!document.body.contains(lightboxPortal)) {
            document.body.appendChild(lightboxPortal);
        }

        const examples = document.querySelectorAll('.example-image');
        examples.forEach(example => {
            const img = example.querySelector('img');
            if (!img) return;

            example.addEventListener('click', () => {
                const overlay = document.createElement('div');
                overlay.className = 'lightbox-overlay';
                
                const container = document.createElement('div');
                container.className = 'lightbox-container';
                
                const lightboxImg = document.createElement('img');
                lightboxImg.className = 'lightbox-image';
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                
                const closeBtn = document.createElement('button');
                closeBtn.className = 'lightbox-close';
                closeBtn.innerHTML = '×';
                
                container.appendChild(lightboxImg);
                container.appendChild(closeBtn);
                overlay.appendChild(container);
                lightboxPortal.appendChild(overlay);

                function closeLightbox() {
                    overlay.style.opacity = '0';
                    setTimeout(() => lightboxPortal.removeChild(overlay), 200);
                }

                closeBtn.onclick = closeLightbox;
                overlay.onclick = (e) => {
                    if (e.target === overlay) closeLightbox();
                };

                document.addEventListener('keydown', function handleEsc(e) {
                    if (e.key === 'Escape') {
                        closeLightbox();
                        document.removeEventListener('keydown', handleEsc);
                    }
                });

                // Fade in
                requestAnimationFrame(() => overlay.style.opacity = '1');
            });
        });
    }

    // Initialize everything
    setupCommissionTabs();
    setupCommissionLightbox();
});