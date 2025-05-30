document.addEventListener('DOMContentLoaded', function() {
    // Gallery Component
    const GallerySection = () => {
        const [selectedImage, setSelectedImage] = React.useState(null);
        const [activeTab, setActiveTab] = React.useState('ALL');
        const [isModalVisible, setIsModalVisible] = React.useState(false);
    
        // Gallery data structure
        const galleryData = {
            '2024': [
                {
                    id: '2024-1',
                    src: "all/2024/alice.png",
                    alt: "Alice",
                    title: "Alice, the knight of a forgotten kingdom",
                    description: "A Bust of my OC, Alice.",
                    date: "2024"
                },
                {
                    id: '2024-2',
                    src: "all/2024/hal.png",
                    alt: "Hal",
                    title: "Hal",
                    description: "A half-body of my OC, Hal.",
                    date: "2024"
                },
                {
                    id: '2024-3',
                    src: "all/2024/deadringer.png",
                    alt: "Dead Ringer",
                    title: "Dead Ringer",
                    description: "Fanart of Towa from Slow Damage. The reference for this art piece is NewDad's Madra album cover.",
                    date: "2024"
                },
                {
                    id: '2024-4',
                    src: "all/2024/lulu.png",
                    alt: "Lulu",
                    title: "Lulu",
                    description: "Fanart of Lulu from Brave Bang Bravern!",
                    date: "2024"
                },
                {
                    id: '2024-5',
                    src: "all/2024/luluuma.png",
                    alt: "Lulu - Uma Pyoi!",
                    title: "Lulu - Uma Pyoi!",
                    description: "Fanart of Lulu from Brave Bang Bravern! wearing the uniform from Uma Musume.",
                    date: "2024"
                },
                {
                    id: '2024-6',
                    src: "all/2024/cag.png",
                    alt: "Cagliostro",
                    title: "Cagliostro",
                    description: "Fanart of Cagliostro from Granblue Fantasy. She is a gift for a friend's birthday!",
                    date: "2024"
                }
            ],
            '2023': [
                {
                    id: '2023-1',
                    src: "all/2023/kdjj.png",
                    alt: "Kim Dokja",
                    title: "Kim Dokja",
                    description: "Fanart of Kim Dokja from Omniscient Reader. This is the first piece I made while experimenting with the pixelated artstyle!",
                    date: "2023"
                },
                {
                    id: '2023-2',
                    src: "all/2023/kdj.png",
                    alt: "Kim Dokja Chibi",
                    title: "Kim Dokja Chibi",
                    description: "Chibi fanart of Kim Dokja from Omniscient Reader.",
                    date: "2023"
                },
                {
                    id: '2023-3',
                    src: "all/2023/newemil.png",
                    alt: "Emil",
                    title: "Emil",
                    description: "A bust-up of my OC, Emil.",
                    date: "2023"
                },
                {
                    id: '2023-4',
                    src: "all/2023/emilfbref.png",
                    alt: "Emil Chibi",
                    title: "Emil Chibi",
                    description: "A chibi full-body of my OC, Emil.",
                    date: "2023"
                },
                {
                    id: '2023-5',
                    src: "all/2023/leb.png",
                    alt: "Lebkuchen",
                    title: "Lebkuchen",
                    description: "Fanart of Lebkuchen from Little Goody Two Shoes. (Please play the game!)",
                    date: "2023"
                },
                {
                    id: '2023-6',
                    src: "all/2023/yoojin.png",
                    alt: "Han Yoojin",
                    title: "Han Yoojin",
                    description: "A redraw of my older fanart of Han Yoojin from My S-Class Hunters.",
                    date: "2023"
                },
                {
                    id: '2023-7',
                    src: "all/2023/aphelios.png",
                    alt: "HEARTSTEEL Aphelios",
                    title: "HEARTSTEEL Aphelios",
                    description: "A fanart of HEARTSTEEL Aphelios, a redraw from the 'Paranoia' MV.",
                    date: "2023"
                },
                {
                    id: '2023-8',
                    src: "all/2023/ezreal.png",
                    alt: "HEARTSTEEL Ezreal",
                    title: "HEARTSTEEL Ezreal",
                    description: "A fanart of HEARTSTEEL Ezreal, a redraw from the 'Paranoia' MV.",
                    date: "2023"
                },
                {
                    id: '2023-9',
                    src: "all/2023/IL.png",
                    alt: "Dan Heng: IL Chibi",
                    title: "Dan Heng: IL Chibi",
                    description: "A Chibi Fanart of Dan Heng: Imbibitor Lunae from Honkai: Star Rail",
                    date: "2023"
                },
                {
                    id: '2023-10',
                    src: "all/2023/arencaelan.png",
                    alt: "To a new dawn",
                    title: "To a new dawn",
                    description: "A piece featuring my two OCs, Aren and Caelan.",
                    date: "2023"
                }
            ],
            '2022': [
                {
                    id: '2022-1',
                    src: "all/2022/gorls.png",
                    alt: "Sunset",
                    title: "Sunset",
                    description: "Art featuring my two ocs, Courier and Lyris.",
                    date: "2022"
                },
                {
                    id: '2022-2',
                    src: "all/2022/passenger.png",
                    alt: "SesaPasse gaming",
                    title: "SesaPasse gaming",
                    description: "Fanart of Sesa and Passenger from Arknights.",
                    date: "2022"
                },
                {
                    id: '2022-3',
                    src: "all/2022/kimdokja.png",
                    alt: "Kim Dokja Redraw",
                    title: "Kim Dokja Redraw",
                    description: "Redraw of a panel from the Omniscient Reader manhwa.",
                    date: "2022"
                },
                {
                    id: '2022-4',
                    src: "all/2022/yoojoonghyuk.png",
                    alt: "Yoo Joonghyuk Redraw",
                    title: "Yoo Joonghyuk Redraw",
                    description: "Redraw of a panel from the Omniscient Reader manhwa.",
                    date: "2022"
                },
                {
                    id: '2022-5',
                    src: "all/2022/brighteralicelol.png",
                    alt: "Alice",
                    title: "Alice",
                    description: "Drawing of my OC, Alice.",
                    date: "2022"
                },
                {
                    id: '2022-6',
                    src: "all/2022/finaltestament.png",
                    alt: "Testament",
                    title: "Testament",
                    description: "Fanart of Testament from Guilty Gear.",
                    date: "2022"
                },
                {
                    id: '2022-7',
                    src: "all/2022/melinacold.png",
                    alt: "Melina",
                    title: "Melina",
                    description: "Redraw of a screencap of Melina from Elden Ring.",
                    date: "2022"
                }
            ],
            '2021': [
                {
                    id: '2021-1',
                    src: "all/2021/caleflower.png",
                    alt: "Cale",
                    title: "Cale",
                    description: "Fanart of Cale from Trash of the Count's Family.",
                    date: "2021"
                },
                {
                    id: '2021-2',
                    src: "all/2021/choihanwoh.png",
                    alt: "Choi Han",
                    title: "Choi Han",
                    description: "Fanart of Choi Han from Trash of the Count's Family.",
                    date: "2021"
                },
                {
                    id: '2021-3',
                    src: "all/2021/choikel.png",
                    alt: "April Shower",
                    title: "April Shower",
                    description: "Fanart of Choi Han and Cale from Trash of the Count's Family.",
                    date: "2021"
                },
                {
                    id: '2021-4',
                    src: "all/2021/farmingwo.png",
                    alt: "His Dream",
                    title: "His Dream",
                    description: "Fanart of Choi Han and Cale from Trash of the Count's Family.",
                    date: "2021"
                },
                {
                    id: '2021-5',
                    src: "all/2021/nekomancerwo.png",
                    alt: "Nekomancer KDJ",
                    title: "Nekomancer KDJ",
                    description: "Fanart of Kim Dokja from Omniscient Reader wearing the Nekomancer class outfit from Granblue Fantasy.",
                    date: "2021"
                }
            ]
        };

        // Monitor visibility changes of the gallery modal
        React.useEffect(() => {
            const galleryModal = document.getElementById('galleryModal');
            if (galleryModal) {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.attributeName === 'class') {
                            setIsModalVisible(galleryModal.classList.contains('show'));
                        }
                    });
                });
                observer.observe(galleryModal, { attributes: true });
                
                // Initial state
                setIsModalVisible(galleryModal.classList.contains('show'));
            }
        }, []);

        // Get all years for tabs
        const years = ['ALL', ...Object.keys(galleryData).sort((a, b) => b.localeCompare(a))];

        // Get filtered images based on active tab
        const getFilteredImages = () => {
            if (activeTab === 'ALL') {
                return Object.values(galleryData).flat();
            }
            return galleryData[activeTab] || [];
        };

        // Create lightbox
        const createLightbox = (image) => {
            const lightboxPortal = document.getElementById('lightbox-portal');
            if (!lightboxPortal) return;

            const overlay = document.createElement('div');
            overlay.className = 'lightbox-overlay';
            
            const container = document.createElement('div');
            container.className = 'lightbox-container';
            
            const img = document.createElement('img');
            img.className = 'lightbox-image';
            img.src = image.src;
            img.alt = image.alt;
            
            const closeButton = document.createElement('button');
            closeButton.className = 'lightbox-close';
            closeButton.innerHTML = '×';
            
            const info = document.createElement('div');
            info.className = 'lightbox-info';
            info.innerHTML = `
                <h3>${image.title}</h3>
                <p>${image.description}</p>
                <span class="date">${image.date}</span>
            `;
            
            container.appendChild(img);
            container.appendChild(closeButton);
            container.appendChild(info);
            overlay.appendChild(container);
            
            const closeLightbox = () => {
                overlay.style.opacity = '0';
                setTimeout(() => lightboxPortal.removeChild(overlay), 200);
            };

            closeButton.onclick = closeLightbox;
            overlay.onclick = (e) => {
                if (e.target === overlay) closeLightbox();
            };

            lightboxPortal.appendChild(overlay);
            requestAnimationFrame(() => overlay.style.opacity = '1');
        };

        if (!isModalVisible) return null;

        return React.createElement('div', { className: 'gallery-container' },
            // Tabs Navigation
            React.createElement('div', { className: 'gallery-tabs' },
                years.map(year => 
                    React.createElement('button', {
                        key: year,
                        className: `gallery-tab ${activeTab === year ? 'active' : ''}`,
                        onClick: () => setActiveTab(year)
                    }, year)
                )
            ),

            // Gallery Grid
            React.createElement('div', { className: 'gallery-grid' },
                getFilteredImages().map(image => 
                    React.createElement('div', {
                        key: image.id,
                        className: 'gallery-item',
                        onClick: () => createLightbox(image)
                    },
                        React.createElement('img', {
                            src: image.src,
                            alt: image.alt,
                            loading: 'lazy'
                        }),
                        React.createElement('div', { className: 'gallery-item-info' },
                            React.createElement('h3', { className: 'gallery-item-title' }, 
                                image.title
                            ),
                            React.createElement('div', { className: 'gallery-item-date' }, 
                                image.date
                            )
                        )
                    )
                )
            )
        );
    };

    // Initialize the gallery
    const galleryRoot = document.getElementById('gallery-root');
    if (galleryRoot) {
        const root = ReactDOM.createRoot(galleryRoot);
        root.render(React.createElement(GallerySection));
    }
});