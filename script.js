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

    // ==========================================
    // AUTO SCROLL FEATURE
    // ==========================================
    const autoscrollBtn = document.getElementById('autoscroll-btn');
    let isAutoScrolling = false;
    let scrollAnimId = null;
    const scrollSpeed = 1.0; // pixels per frame (~60px/sec at 60fps)

    function stepScroll() {
        if (!isAutoScrolling) return;

        window.scrollBy(0, scrollSpeed);

        // Stop if reached the end of the page
        if ((window.innerHeight + window.pageYOffset) >= document.documentElement.scrollHeight - 5) {
            stopAutoScroll();
            return;
        }

        scrollAnimId = requestAnimationFrame(stepScroll);
    }

    function startAutoScroll() {
        isAutoScrolling = true;
        autoscrollBtn.classList.add('scrolling');
        autoscrollBtn.innerHTML = '<span class="scroll-icon">⏸</span> <span class="scroll-text">Berhenti</span>';
        scrollAnimId = requestAnimationFrame(stepScroll);
    }

    function stopAutoScroll() {
        isAutoScrolling = false;
        if (scrollAnimId) {
            cancelAnimationFrame(scrollAnimId);
            scrollAnimId = null;
        }
        autoscrollBtn.classList.remove('scrolling');
        autoscrollBtn.innerHTML = '<span class="scroll-icon">📜</span> <span class="scroll-text">Auto Scroll</span>';
    }

    if (autoscrollBtn) {
        autoscrollBtn.addEventListener('click', function() {
            if (isAutoScrolling) {
                stopAutoScroll();
            } else {
                startAutoScroll();
            }
        });
    }

    // ==========================================
    // LIGHTBOX / ZOOM MODAL FEATURE
    // ==========================================
    const imageModal = document.getElementById('image-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDate = document.getElementById('modal-date');
    const modalClose = document.getElementById('modal-close');
    const modalPrev = document.getElementById('modal-prev');
    const modalNext = document.getElementById('modal-next');

    const timelineItems = document.querySelectorAll('.timeline-item');
    const gallery = [];

    timelineItems.forEach((item, index) => {
        const img = item.querySelector('.image-box img');
        const titleEl = item.querySelector('.timeline-content h3');
        const dateEl = item.querySelector('.timeline-content .date');

        if (img) {
            gallery.push({
                src: img.getAttribute('src'),
                title: titleEl ? titleEl.textContent.trim() : '',
                date: dateEl ? dateEl.textContent.trim() : ''
            });

            const imgBox = item.querySelector('.image-box');
            if (imgBox) {
                imgBox.addEventListener('click', function() {
                    openModal(index);
                });
            }
        }
    });

    let currentGalleryIndex = 0;

    function openModal(index) {
        if (!gallery[index]) return;

        // Pause auto-scroll when inspecting a zoomed photo
        if (isAutoScrolling) {
            stopAutoScroll();
        }

        currentGalleryIndex = index;
        updateModalContent();

        imageModal.classList.add('active');
        imageModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        imageModal.classList.remove('active');
        imageModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function updateModalContent() {
        const item = gallery[currentGalleryIndex];
        if (!item) return;

        modalImg.style.opacity = '0';
        modalImg.src = item.src;
        modalTitle.textContent = item.title;
        modalDate.textContent = item.date;

        modalImg.onload = function() {
            modalImg.style.opacity = '1';
        };
        setTimeout(() => {
            modalImg.style.opacity = '1';
        }, 50);
    }

    function showNextImage() {
        currentGalleryIndex = (currentGalleryIndex + 1) % gallery.length;
        updateModalContent();
    }

    function showPrevImage() {
        currentGalleryIndex = (currentGalleryIndex - 1 + gallery.length) % gallery.length;
        updateModalContent();
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    if (modalNext) modalNext.addEventListener('click', showNextImage);
    if (modalPrev) modalPrev.addEventListener('click', showPrevImage);

    // Keyboard support
    document.addEventListener('keydown', function(e) {
        if (!imageModal.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        }
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    imageModal.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    imageModal.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        const threshold = 50;
        if (touchEndX < touchStartX - threshold) {
            showNextImage(); // swipe left -> next
        } else if (touchEndX > touchStartX + threshold) {
            showPrevImage(); // swipe right -> prev
        }
    }, { passive: true });
});

