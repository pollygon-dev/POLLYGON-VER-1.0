// Music Player Controls
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");
let volume_icon = document.querySelector(".volume-btn i");
let mute_btn = document.querySelector(".volume-btn");

let track_index = 0;
let isPlaying = false;
let isMuted = false;
let previousVolume = 1;
let updateTimer;

// Create new audio element
let curr_track = document.createElement('audio');

// Define the tracks that have to be played
let track_list = [
    {
        name: "arlequin",
        artist: "THE ANDS",
        path: "music/arlequin.mp3"  // Replace with your audio file path
    },
    {
        name: "Polaris",
        artist: "Fujifabric",
        path: "music/polaris.mp3"  // Replace with your audio file path
    },
    // Add more tracks as needed
];

function loadTrack(track_index) {
    clearInterval(updateTimer);
    resetValues();

    curr_track.src = track_list[track_index].path;
    curr_track.load();

    track_name.textContent = track_list[track_index].name;
    track_artist.textContent = track_list[track_index].artist;

    updateTimer = setInterval(seekUpdate, 1000);
    curr_track.addEventListener("ended", nextTrack);
}

function resetValues() {
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}

function playpauseTrack() {
    if (!isPlaying) playTrack();
    else pauseTrack();
}

function playTrack() {
    curr_track.play();
    isPlaying = true;
    playpause_btn.innerHTML = '<i class="fas fa-pause"></i>';
}

function pauseTrack() {
    curr_track.pause();
    isPlaying = false;
    playpause_btn.innerHTML = '<i class="fas fa-play"></i>';
}

function nextTrack() {
    if (track_index < track_list.length - 1)
        track_index += 1;
    else track_index = 0;
    loadTrack(track_index);
    playTrack();
}

function prevTrack() {
    if (track_index > 0)
        track_index -= 1;
    else track_index = track_list.length - 1;
    loadTrack(track_index);
    playTrack();
}

function seekTo() {
    let seekto = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekto;
}

function setVolume() {
    curr_track.volume = volume_slider.value / 100;
    updateVolumeIcon();
}

function handleMuteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleMute();
}

function toggleMute() {
    isMuted = !isMuted;
    if (isMuted) {
        previousVolume = curr_track.volume;
        curr_track.volume = 0;
        volume_slider.value = 0;
        volume_icon.className = "fas fa-volume-mute";
    } else {
        curr_track.volume = previousVolume;
        volume_slider.value = previousVolume * 100;
        updateVolumeIcon();
    }
}

function updateVolumeIcon() {
    if (curr_track.volume === 0) {
        volume_icon.className = "fas fa-volume-mute";
    } else if (curr_track.volume >= 0.7) {
        volume_icon.className = "fas fa-volume-up";
    } else if (curr_track.volume >= 0.1) {
        volume_icon.className = "fas fa-volume-down";
    } else {
        volume_icon.className = "fas fa-volume-off";
    }
}

function seekUpdate() {
    let seekPosition = 0;

    if (!isNaN(curr_track.duration)) {
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);
        seek_slider.value = seekPosition;

        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
        if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
}

// GIF handling function
function handleGifLoad() {
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

// Initialize everything after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load first track
    loadTrack(track_index);

    // Add event listeners for music player
    playpause_btn.addEventListener('click', playpauseTrack);
    next_btn.addEventListener('click', nextTrack);
    prev_btn.addEventListener('click', prevTrack);
    seek_slider.addEventListener('change', seekTo);
    volume_slider.addEventListener('input', setVolume);
    
    // Add mute button event listeners
    if (mute_btn) {
        mute_btn.addEventListener('click', handleMuteClick);
        // Also handle clicks on the icon
        mute_btn.querySelector('i').addEventListener('click', handleMuteClick);
    }

    // Initialize GIF handling
    handleGifLoad();

    // Set initial volume
    setVolume();

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
});