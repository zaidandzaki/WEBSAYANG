// Initialize Animations on Scroll (AOS)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic'
    });

    // Music Playlist Logic
    const playlist = [
        { title: "Saat Bahagia - Ungu ft. Andien", src: "Ungu feat. Andien - Saat Bahagia Official Music Video.mp3" },
        { title: "Percayalah - Afgan & Raisa", src: "Afgan & Raisa - Percayalah _ Official Music Video - (320 Kbps).mp3" },
        { title: "Panah Asmara - Afgan", src: "Afgan - Panah Asmara.mp3" },
        { title: "Sempurna - Andra And The Backbone", src: "Andra And The Backbone - Sempurna (Official Music Video).mp3" },
        { title: "Siapkah Kau Tuk Jatuh Cinta - HIVI", src: "HIVI - Siapkah Kau Tuk Jatuh Cinta Lagi (Official Lyric Video).mp3" },
        { title: "Lebih Indah - Adera", src: "Lebih Indah - Adera (Official Video).mp3" },
        { title: "Semenjak Ada Dirimu - Yovie, HIVI", src: "Yovie Widianto, HIVI - Semenjak Ada Dirimu (Official Music Video).mp3" }
    ];

    let currentTrackIndex = 0;
    const musicBtn = document.getElementById('music-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const bgMusic = document.getElementById('bg-music');
    const songInfo = document.getElementById('song-info');
    let isPlaying = false;

    // Set lower volume for background music
    bgMusic.volume = 0.45;

    function loadTrack(index) {
        currentTrackIndex = index;
        bgMusic.src = playlist[currentTrackIndex].src;
        if (songInfo) {
            songInfo.textContent = playlist[currentTrackIndex].title;
        }
    }

    function playTrack() {
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                musicBtn.innerHTML = '⏸ Jeda Musik';
                musicBtn.style.backgroundColor = '#c06c84';
            }).catch(error => {
                console.log("Audio play failed:", error);
            });
        }
    }

    function pauseTrack() {
        bgMusic.pause();
        isPlaying = false;
        musicBtn.innerHTML = '🎵 Putar Musik';
        musicBtn.style.backgroundColor = '#f67280';
    }

    musicBtn.addEventListener('click', function() {
        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    });

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
            loadTrack(currentTrackIndex);
            playTrack();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
            loadTrack(currentTrackIndex);
            playTrack();
        });
    }

    // Auto next when a song ends
    bgMusic.addEventListener('ended', function() {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
        playTrack();
    });

    // Initial track setup
    loadTrack(0);
});

