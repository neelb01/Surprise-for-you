/**
 * Thailand Slideshow and Interactive Ticket Controller
 * 
 * Features:
 *  - Custom CSS clip-path slide transition animations (circle, diagonal, doors, vortex, star)
 *  - Automated slideshow rotation with interaction-aware timer reset
 *  - Keyboard arrow keys navigation
 *  - Ambient particle drifting
 *  - Custom synthesized sound effects (Web Audio API) for slide swipe & portal return
 *  - Portal expansion navigation overlay to go back to birthday stage
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // BIRTHDAY SONG AUDIO SETUP
    // -------------------------------------------------------------
    let birthdaySong = null;
    let songPlaying = false;
    let songLoopTimer = null;
    const SONG_START = 15;
    const SONG_END = 165;
    const SONG_MAX_VOL = 0.60;

    try {
        birthdaySong = new Audio('assets/love_me_like_you_do.webm');
        birthdaySong.preload = 'auto';
        birthdaySong.volume = 0;
        birthdaySong.loop = false;
    } catch (e) {
        console.warn('Audio creation failed in Thailand page:', e);
    }

    function startBirthdaySong() {
        if (songPlaying) return;
        if (!birthdaySong) return;

        const savedSongTime = localStorage.getItem('birthdaySongTime');
        if (savedSongTime !== null) {
            const parsedTime = parseFloat(savedSongTime);
            if (!isNaN(parsedTime) && parsedTime >= SONG_START && parsedTime <= SONG_END) {
                birthdaySong.currentTime = parsedTime;
            } else {
                birthdaySong.currentTime = SONG_START;
            }
        } else {
            birthdaySong.currentTime = SONG_START;
        }

        birthdaySong.volume = 0;
        const playPromise = birthdaySong.play();
        if (playPromise) {
            playPromise.then(() => {
                songPlaying = true;
                fadeInSong();
                startSongLoopMonitor();
            }).catch((err) => {
                console.warn('Autoplay blocked in Thailand, waiting for user interaction:', err);
                const playOnGesture = () => {
                    if (songPlaying) return;
                    birthdaySong.play().then(() => {
                        songPlaying = true;
                        fadeInSong();
                        startSongLoopMonitor();
                        document.removeEventListener('click', playOnGesture);
                        document.removeEventListener('touchstart', playOnGesture);
                    }).catch(e => console.warn('Play blocked on gesture:', e));
                };
                document.addEventListener('click', playOnGesture);
                document.addEventListener('touchstart', playOnGesture);
            });
        }
    }

    function fadeInSong() {
        let vol = 0;
        const fadeSteps = 30;
        const fadeInterval = setInterval(() => {
            vol += SONG_MAX_VOL / fadeSteps;
            if (vol >= SONG_MAX_VOL) {
                birthdaySong.volume = SONG_MAX_VOL;
                clearInterval(fadeInterval);
            } else {
                birthdaySong.volume = vol;
            }
        }, 100);
    }

    function startSongLoopMonitor() {
        if (songLoopTimer) clearInterval(songLoopTimer);
        songLoopTimer = setInterval(() => {
            if (!birthdaySong || birthdaySong.paused) return;
            if (birthdaySong.currentTime >= SONG_END || birthdaySong.currentTime < SONG_START - 1) {
                birthdaySong.currentTime = SONG_START;
            }
            // Save current song time to localStorage so it persists on reload!
            localStorage.setItem('birthdaySongTime', birthdaySong.currentTime);
        }, 500);
    }

    // Start playing the song on load
    startBirthdaySong();

    // -------------------------------------------------------------
    // 1. PAGE ENTRANCE TRANSITION
    // -------------------------------------------------------------
    const portal = document.getElementById('portal-transition');
    if (portal) {
        // Tiny timeout to make sure initial "active" state is rendered
        // then remove it to trigger the shrinking bubble entrance effect
        setTimeout(() => {
            portal.classList.remove('active');
        }, 100);
    }

    // -------------------------------------------------------------
    // 2. SLIDESHOW STATE & DOM REFERENCES
    // -------------------------------------------------------------
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-dot');
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');

    let currentIdx = 0;
    let isTransitioning = false;
    let autoplayTimer = null;

    const transitionClasses = ['trans-circle', 'trans-diagonal', 'trans-doors', 'trans-vortex', 'trans-star'];

    // -------------------------------------------------------------
    // 3. SOUND SYNTHESIS (WEB AUDIO API)
    // -------------------------------------------------------------
    function playSlideSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const now = ctx.currentTime;
            
            // Sweep / whoosh sound
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(1100, now + 0.35);
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.04, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.35);
            
            // Twinkle chimes
            [987.77, 1318.51].forEach((freq, idx) => {
                const chimeTime = now + 0.08 + idx * 0.06;
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.type = 'sine';
                o.frequency.setValueAtTime(freq, chimeTime);
                
                g.gain.setValueAtTime(0, chimeTime);
                g.gain.linearRampToValueAtTime(0.025, chimeTime + 0.004);
                g.gain.exponentialRampToValueAtTime(0.001, chimeTime + 0.2);
                
                o.connect(g);
                g.connect(ctx.destination);
                o.start(chimeTime);
                o.stop(chimeTime + 0.2);
            });
        } catch (e) {
            console.warn('Audio synthesis failed:', e);
        }
    }

    function playPortalReturnSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const now = ctx.currentTime;
            
            // Descending chime arpeggio (C Major Pentatonic going down)
            const notes = [2093.00, 1760.00, 1567.98, 1318.51, 1174.66, 1046.50, 880.00, 783.99, 659.25, 587.33, 523.25];
            notes.forEach((freq, idx) => {
                const time = now + idx * 0.065;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const filter = ctx.createBiquadFilter();
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, time);
                
                filter.type = 'highpass';
                filter.frequency.setValueAtTime(450, time);
                
                gain.gain.setValueAtTime(0, time);
                gain.gain.linearRampToValueAtTime(0.07, time + 0.004);
                gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
                
                osc.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);
                
                osc.start(time);
                osc.stop(time + 0.35);
            });

            // Falling/rising portal whoosh
            const oscSweep = ctx.createOscillator();
            const gainSweep = ctx.createGain();
            oscSweep.type = 'triangle';
            oscSweep.frequency.setValueAtTime(550, now);
            oscSweep.frequency.exponentialRampToValueAtTime(140, now + 1.15);

            gainSweep.gain.setValueAtTime(0, now);
            gainSweep.gain.linearRampToValueAtTime(0.16, now + 0.2);
            gainSweep.gain.exponentialRampToValueAtTime(0.001, now + 1.35);

            oscSweep.connect(gainSweep);
            gainSweep.connect(ctx.destination);
            
            oscSweep.start(now);
            oscSweep.stop(now + 1.35);
        } catch (e) {
            console.warn('Portal return sound synthesis failed:', e);
        }
    }

    // -------------------------------------------------------------
    // 4. SLIDESHOW ROTATION CONTROLLER
    // -------------------------------------------------------------
    function changeSlide(nextIdx) {
        if (isTransitioning || nextIdx === currentIdx) return;
        isTransitioning = true;
        
        stopAutoplay();

        const currentSlide = slides[currentIdx];
        const nextSlide = slides[nextIdx];

        // Pick a random transition clip-path effect
        const randomTransition = transitionClasses[Math.floor(Math.random() * transitionClasses.length)];

        // Prep the next slide
        nextSlide.classList.remove(...transitionClasses);
        void nextSlide.offsetWidth; // force browser layout reflow

        // Bring the next slide in with higher z-index animation
        nextSlide.classList.add('active-slide', randomTransition);

        // Update dot indicators
        dots[currentIdx].classList.remove('active-dot');
        dots[nextIdx].classList.add('active-dot');

        playSlideSound();

        // After the transition duration matches CSS (1.2s)
        setTimeout(() => {
            // Clean up old active classes
            currentSlide.classList.remove('active-slide', ...transitionClasses);
            
            // Clean up transition class from the active one, keeping it active
            nextSlide.classList.remove(randomTransition);

            currentIdx = nextIdx;
            isTransitioning = false;
            
            startAutoplay();
        }, 1200);
    }

    function nextSlide() {
        const nextIdx = (currentIdx + 1) % slides.length;
        changeSlide(nextIdx);
    }

    function prevSlide() {
        const nextIdx = (currentIdx - 1 + slides.length) % slides.length;
        changeSlide(nextIdx);
    }

    // Autoplay routines
    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    // -------------------------------------------------------------
    // 5. EVENT LISTENERS
    // -------------------------------------------------------------
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.getAttribute('data-index'), 10);
            if (!isNaN(idx)) {
                changeSlide(idx);
            }
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });

    // Start slideshow loop
    startAutoplay();

    // -------------------------------------------------------------
    // 6. BOARDING PASS RETURN INTERACTION
    // -------------------------------------------------------------
    const boardingPass = document.getElementById('boarding-pass-btn');
    let isLeaving = false;

    if (boardingPass) {
        boardingPass.addEventListener('click', (e) => {
            if (isLeaving) return;
            isLeaving = true;

            stopAutoplay();
            playPortalReturnSound();

            if (portal) {
                portal.classList.add('active');
            }

            // Save the current song time before leaving!
            if (birthdaySong) {
                localStorage.setItem('birthdaySongTime', birthdaySong.currentTime);
                console.log('🎵 Saved song time from Thailand before return:', birthdaySong.currentTime);
                birthdaySong.pause();
            }

            // After transition bubble fills screen, redirect back
            setTimeout(() => {
                window.location.href = 'index.html?from=thailand';
            }, 1200);
        });
    }

    // -------------------------------------------------------------
    // 7. PARTICLES AND DECORATION EFFECT
    // -------------------------------------------------------------
    // Dynamically inject randomized ambient particles in the background
    const skyContainer = document.querySelector('.sky-particles');
    if (skyContainer) {
        const particleCount = 25;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = Math.random() * 8 + 4 + 'px';
            particle.style.height = particle.style.width;
            particle.style.borderRadius = '50%';
            particle.style.backgroundColor = 'rgba(255, 255, 255, 0.45)';
            particle.style.boxShadow = '0 0 8px rgba(255, 255, 255, 0.6)';
            
            // Random positions
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.top = Math.random() * 100 + 'vh';
            
            // CSS floating animations with randomized durations
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * -20;
            particle.style.animation = `floatParticle ${duration}s linear infinite`;
            particle.style.animationDelay = `${delay}s`;
            
            // Simple keyframe generator inside head for particles
            skyContainer.appendChild(particle);
        }
    }
});

// Inject keyframe animation dynamically for drifting background particles
const styleNode = document.createElement('style');
styleNode.innerHTML = `
@keyframes floatParticle {
    0% {
        transform: translateY(110vh) translateX(0) scale(1);
        opacity: 0;
    }
    10% {
        opacity: 0.7;
    }
    90% {
        opacity: 0.7;
    }
    100% {
        transform: translateY(-10vh) translateX(50px) scale(0.6);
        opacity: 0;
    }
}
`;
document.head.appendChild(styleNode);
