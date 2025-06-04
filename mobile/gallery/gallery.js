// Initialize Feather Icons
feather.replace();

// Gallery Data
const galleryData = {
    '2024': [
        {
            id: '2024-1',
            title: "Alice, the knight of a forgotten kingdom",
            description: "A Bust of my OC, Alice.",
            image: "all/2024/alice.png",
            year: "2024"
        },
        {
            id: '2024-2',
            title: "Hal",
            description: "A half-body of my OC, Hal. His full name is Halrith.",
            image: "all/2024/hal.png",
            year: "2024"
        },
        {
            id: '2024-3',
            title: "Dead Ringer",
            description: "Fanart of Towa from Slow Damage. The reference for this art piece is NewDad's Madra album cover.",
            image: "all/2024/deadringer.png",
            year: "2024"
        },
        {
            id: '2024-4',
            title: "Lulu",
            description: "Fanart of Lulu from Brave Bang Bravern!, doing a fist bump to the air.",
            image: "all/2024/lulu.png",
            year: "2024"
        },
        {
            id: '2024-5',
            title: "Lulu - Uma Pyoi!",
            description: "Fanart of Lulu from Brave Bang Bravern! wearing the uniform from Uma Musume.",
            image: "all/2024/luluuma.png",
            year: "2024"
        },
        {
            id: '2024-6',
            title: "Cagliostro",
            description: "Fanart of Cagliostro from Granblue Fantasy. She is a gift for a friend's birthday!",
            image: "all/2024/cag.png",
            year: "2024"
        }
    ],
    '2023': [
        {
            id: '2023-1',
            title: "Kim Dokja",
            description: "Fanart of Kim Dokja from Omniscient Reader. This is the first piece I made while experimenting with the pixelated artstyle!",
            image: "all/2023/kdjj.png",
            year: "2023"
        },
        {
            id: '2023-2',
            title: "Kim Dokja Chibi",
            description: "Chibi fanart of Kim Dokja from Omniscient Reader.",
            image: "all/2023/kdj.png",
            year: "2023"
        },
        {
            id: '2023-3',
            title: "Emil",
            description: "A bust-up of my OC, Emil.",
            image: "all/2023/newemil.png",
            year: "2023"
        },
        {
            id: '2023-4',
            title: "Emil Chibi",
            description: "A chibi full-body of my OC, Emil.",
            image: "all/2023/emilfbref.png",
            year: "2023"
        },
        {
            id: '2023-5',
            title: "Lebkuchen",
            description: "Fanart of Lebkuchen from Little Goody Two Shoes. (Please play the game!)",
            image: "all/2023/leb.png",
            year: "2023"
        },
        {
            id: '2023-6',
            title: "Han Yoojin",
            description: "A redraw of my older fanart of Han Yoojin from My S-Class Hunters.",
            image: "all/2023/yoojin.png",
            year: "2023"
        },
        {
            id: '2023-7',
            title: "HEARTSTEEL Aphelios",
            description: "A fanart of HEARTSTEEL Aphelios, a redraw from the 'Paranoia' MV.",
            image: "all/2023/aphelios.png",
            year: "2023"
        },
        {
            id: '2023-8',
            title: "HEARTSTEEL Ezreal",
            description: "A fanart of HEARTSTEEL Ezreal, a redraw from the 'Paranoia' MV.",
            image: "all/2023/ezreal.png",
            year: "2023"
        },
        {
            id: '2023-9',
            title: "Dan Heng: IL Chibi",
            description: "A Chibi Fanart of Dan Heng: Imbibitor Lunae from Honkai: Star Rail",
            image: "all/2023/IL.png",
            year: "2023"
        },
        {
            id: '2023-10',
            title: "To a new dawn",
            description: "A piece featuring my two OCs, Aren and Caelan.",
            image: "all/2023/arencaelan.png",
            year: "2023"
        }
    ],
    '2022': [
        {
            id: '2022-1',
            title: "Sunset",
            description: "Art featuring my two ocs, Courier and Lyris.",
            image: "all/2022/gorls.png",
            year: "2022"
        },
        {
            id: '2022-2',
            title: "SesaPasse gaming",
            description: "Fanart of Sesa and Passenger from Arknights.",
            image: "all/2022/passenger.png",
            year: "2022"
        },
        {
            id: '2022-3',
            title: "Kim Dokja Redraw",
            description: "Redraw of a panel from the Omniscient Reader manhwa.",
            image: "all/2022/kimdokja.png",
            year: "2022"
        },
        {
            id: '2022-4',
            title: "Yoo Joonghyuk Redraw",
            description: "Redraw of a panel from the Omniscient Reader manhwa.",
            image: "all/2022/yoojoonghyuk.png",
            year: "2022"
        },
        {
            id: '2022-5',
            title: "Alice",
            description: "Drawing of my OC, Alice.",
            image: "all/2022/brighteralicelol.png",
            year: "2022"
        },
        {
            id: '2022-6',
            title: "Testament",
            description: "Fanart of Testament from Guilty Gear.",
            image: "all/2022/finaltestament.png",
            year: "2022"
        },
        {
            id: '2022-7',
            title: "Melina",
            description: "Redraw of a screencap of Melina from Elden Ring.",
            image: "all/2022/melinacold.png",
            year: "2022"
        }
    ],
    '2021': [
        {
            id: '2021-1',
            title: "Cale",
            description: "Fanart of Cale from Trash of the Count's Family.",
            image: "all/2021/caleflower.png",
            year: "2021"
        },
        {
            id: '2021-2',
            title: "Choi Han",
            description: "Fanart of Choi Han from Trash of the Count's Family.",
            image: "all/2021/choihanwoh.png",
            year: "2021"
        },
        {
            id: '2021-3',
            title: "April Shower",
            description: "Fanart of Choi Han and Cale from Trash of the Count's Family.",
            image: "all/2021/choikel.png",
            year: "2021"
        },
        {
            id: '2021-4',
            title: "His Dream",
            description: "Fanart of Choi Han and Cale from Trash of the Count's Family.",
            image: "all/2021/farmingwo.png",
            year: "2021"
        },
        {
            id: '2021-5',
            title: "Nekomancer KDJ",
            description: "Fanart of Kim Dokja from Omniscient Reader wearing the Nekomancer class outfit from Granblue Fantasy.",
            image: "all/2021/nekomancerwo.png",
            year: "2021"
        }
    ]
};

// Flatten gallery data and add categories
const artworks = Object.values(galleryData).flat().map(art => ({
    ...art,
    category: art.description.toLowerCase().includes('fanart') ? 'Fanart' : 
             art.description.toLowerCase().includes('oc') ? 'Original Character' : 
             'Artwork'
}));

const years = ['all', '2024', '2023', '2022', '2021'];
let selectedYear = 'all';

// Initialize year filter buttons
function initializeFilters() {
    const filterContainer = document.getElementById('yearFilter');
    filterContainer.innerHTML = ''; // Clear existing filters
    years.forEach((year, index) => {
        const button = document.createElement('button');
        button.className = `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                          transform hover:scale-105 animate-fadeIn
                          ${selectedYear === year ? 'bg-pink-200 text-pink-700 shadow-md' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`;
        button.style.animationDelay = `${index * 100}ms`;
        button.onclick = () => filterByYear(year);
        button.innerHTML = year === 'all' ? 'All Years ✨' : year;
        filterContainer.appendChild(button);
    });
}

// Filter artworks by year
function filterByYear(year) {
    selectedYear = year;
    updateGallery();
    updateFilterButtons();
}

// Update filter button styles
function updateFilterButtons() {
    const buttons = document.getElementById('yearFilter').children;
    Array.from(buttons).forEach(button => {
        const isSelected = button.textContent.includes(selectedYear) || 
                         (selectedYear === 'all' && button.textContent.includes('All Years'));
        button.className = `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                          transform hover:scale-105
                          ${isSelected ? 'bg-pink-200 text-pink-700 shadow-md' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`;
    });
}

// Create artwork card
function createArtworkCard(artwork, index) {
    return `
        <div class="artwork-card relative group cursor-pointer" 
             onclick="openLightbox('${artwork.id}')"
             style="animation-delay: ${index * 100}ms">
            <div class="bg-gradient-to-b from-blue-100 to-blue-200 rounded-2xl overflow-hidden shadow-md
                        transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-rotate-2 
                        group-hover:ring-4 ring-pink-200 ring-offset-4 ring-offset-white">
                <div class="absolute -right-1 -top-1 text-pink-300 transform group-hover:scale-110 transition-transform duration-300">
                    <i data-feather="bookmark" class="w-5 h-5 fill-current"></i>
                </div>
                <div class="relative h-48">
                    <img src="${artwork.image}" alt="${artwork.title}" 
                         class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700">
                    <div class="absolute inset-0 bg-gradient-to-t from-blue-200 via-blue-100/50 to-transparent"></div>
                    <div class="absolute top-2 right-2 transform group-hover:-rotate-3 transition-transform duration-300">
                        <div class="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-medium">
                            ${artwork.category}
                        </div>
                    </div>
                    <i data-feather="star" class="absolute bottom-2 left-2 text-yellow-300 w-3 h-3 animate-pulse"></i>
                </div>
                <div class="p-3 bg-white/80 backdrop-blur-sm">
                    <div class="font-medium text-blue-900 text-sm mb-0.5 transform group-hover:translate-x-1 transition-transform duration-300">
                        ${artwork.title}
                    </div>
                    <p class="text-xs text-blue-600 transform group-hover:translate-x-1 transition-transform duration-300 delay-75 line-clamp-2">
                        ${artwork.description}
                    </p>
                </div>
            </div>
        </div>
    `;
}

// Update gallery with filtered artworks
function updateGallery() {
    const filteredArtworks = selectedYear === 'all' 
        ? artworks 
        : artworks.filter(art => art.year === selectedYear);

    const galleryGrid = document.getElementById('galleryGrid');
    galleryGrid.innerHTML = filteredArtworks.map((artwork, index) => 
        createArtworkCard(artwork, index)
    ).join('');
    
    feather.replace();
}

// Lightbox functions
function openLightbox(artworkId) {
    const artwork = artworks.find(art => art.id === artworkId);
    if (!artwork) return;

    document.getElementById('lightboxImage').src = artwork.image;
    document.getElementById('lightboxTitle').textContent = artwork.title;
    document.getElementById('lightboxDescription').textContent = artwork.description;
    document.getElementById('lightboxCategory').textContent = artwork.category;
    document.getElementById('lightboxYear').textContent = `Year: ${artwork.year}`;
    
    document.getElementById('lightbox').classList.add('active');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
}

// Close lightbox when clicking outside the image
document.getElementById('lightbox').addEventListener('click', function(e) {
    if (e.target === this) {
        closeLightbox();
    }
});

// Close lightbox with escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('lightbox').classList.contains('active')) {
        closeLightbox();
    }
});

// Initialize gallery on load
document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    updateGallery();
});