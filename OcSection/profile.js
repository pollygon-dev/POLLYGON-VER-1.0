// Element Icons
const ELEMENT_ICONS = {
    fire: './elements/2.png',
    water: './elements/3.png',
    earth: './elements/4.png',
    wind: './elements/5.png',
    light: './elements/6.png',
    dark: './elements/7.png'
};

// Lightbox functionality
class Lightbox {
    constructor() {
        this.lightbox = document.getElementById('galleryLightbox');
        this.lightboxImg = this.lightbox.querySelector('.lightbox-image');
        this.lightboxCaption = this.lightbox.querySelector('.lightbox-caption');
        this.currentIndex = 0;
        this.images = [];

        // Bind methods
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.handleKeyboard = this.handleKeyboard.bind(this);

        this.init();
    }

    init() {
        // Set up gallery clicks
        const galleryImages = document.querySelectorAll('.gallery img');
        this.images = Array.from(galleryImages);
        
        this.images.forEach((img, index) => {
            img.addEventListener('click', () => this.open(index));
        });

        // Set up lightbox controls
        this.lightbox.querySelector('.lightbox-close').addEventListener('click', this.close);
        this.lightbox.querySelector('.next').addEventListener('click', this.next);
        this.lightbox.querySelector('.prev').addEventListener('click', this.previous);

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboard);
    }

    open(index) {
        this.currentIndex = index;
        const img = this.images[index];
        this.lightboxImg.src = img.src;
        this.lightboxCaption.textContent = img.alt;
        this.lightbox.classList.add('active');
    }

    close() {
        this.lightbox.classList.remove('active');
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.open(this.currentIndex);
    }

    previous() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.open(this.currentIndex);
    }

    handleKeyboard(e) {
        if (!this.lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                this.close();
                break;
            case 'ArrowRight':
                this.next();
                break;
            case 'ArrowLeft':
                this.previous();
                break;
        }
    }
}

// Story Modal functionality
class StoryModal {
    constructor() {
        this.openBtns = document.querySelectorAll('.open-modal-btn');
        this.closeBtns = document.querySelectorAll('.close-modal-btn');
        this.activeModal = null;

        // Bind methods
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.handleKeyboard = this.handleKeyboard.bind(this);

        this.init();
    }

    init() {
        // Set up open buttons
        this.openBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const storyId = btn.getAttribute('data-story');
                this.open(storyId);
            });
        });

        // Set up close buttons
        this.closeBtns.forEach(btn => {
            btn.addEventListener('click', () => this.close());
        });

        // Keyboard events
        document.addEventListener('keydown', this.handleKeyboard);
    }

    open(storyId) {
        // Close any open modal first
        if (this.activeModal) {
            this.close();
        }

        // Find and open the requested modal
        const modal = document.querySelector(`.story-modal[data-story="${storyId}"]`);
        if (modal) {
            modal.classList.add('active');
            this.activeModal = modal;
        }
    }

    close() {
        if (this.activeModal) {
            this.activeModal.classList.remove('active');
            this.activeModal = null;
        }
    }

    handleKeyboard(e) {
        if (e.key === 'Escape' && this.activeModal) {
            this.close();
        }
    }
}

// Tab System
class TabSystem {
    constructor() {
        this.tabs = document.querySelectorAll('.tab');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.init();
    }

    init() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.tabs.forEach(t => t.classList.remove('active'));
                this.tabContents.forEach(content => content.classList.remove('active'));

                tab.classList.add('active');
                const tabId = tab.getAttribute('data-tab');
                document.getElementById(tabId)?.classList.add('active');
            });
        });
    }
}

// Element Icons Setup
class ElementIcons {
    constructor() {
        this.elementIcons = document.querySelectorAll('.element-icon .icon');
        this.init();
    }

    init() {
        this.elementIcons.forEach(icon => {
            const card = icon.closest('.character-card');
            const element = card?.classList.toString().match(/fire|water|earth|wind|light|dark/i)?.[0] || '';
            if (element && ELEMENT_ICONS[element.toLowerCase()]) {
                icon.style.backgroundImage = `url('${ELEMENT_ICONS[element.toLowerCase()]}')`;
                icon.style.backgroundSize = 'contain';
                icon.style.backgroundRepeat = 'no-repeat';
                icon.style.backgroundPosition = 'center';
                icon.style.border = 'none';
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    new Lightbox();
    new StoryModal();
    new TabSystem();
    new ElementIcons();
});