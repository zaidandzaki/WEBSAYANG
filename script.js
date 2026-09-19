// Initialize Animations on Scroll (AOS)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic'
    });

    // Music Player Logic
    const musicBtn = document.getElementById('music-btn');
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false;

    // Set lower volume for background music so it's not too loud
    bgMusic.volume = 0.4;

    musicBtn.addEventListener('click', function() {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.innerHTML = '🎵 Putar Lagu';
            musicBtn.style.backgroundColor = '#f67280';
            isPlaying = false;
        } else {
            const playPromise = bgMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    musicBtn.innerHTML = '⏸ Jeda Lagu';
                    musicBtn.style.backgroundColor = '#c06c84';
                    isPlaying = true;
                })
                .catch(error => {
                    console.log("Audio play failed:", error);
                    alert("Ops! Sepertinya file musik belum ada.\n\nUntuk menambahkan lagu:\n1. Siapkan lagu format .mp3 favorit kalian.\n2. Ubah namanya jadi 'lagu-kita.mp3'\n3. Taruh di dalam folder WEBSAYANG ini.");
                });
            }
        }
    });
});

