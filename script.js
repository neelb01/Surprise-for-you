/**
 * Dynamic Birthday Webpage — V2 Overhaul
 * 
 * Features:
 *  - Canvas-based horror fog with floating particles, lightning flashes
 *  - Unpredictable jumpscare with fake-out delay
 *  - Multi-phase scare: zoom-in, flash-cuts, screen distortion
 *  - Web Audio synthesized layered horror sound
 *  - Ambient random screen flicker on horror page
 *  - Fixed scroll parchment (no clipping)
 *  - Floating hearts canvas background
 * 
 * Customize the birthday message below!
 */

const BIRTHDAY_MESSAGE = `Happy Birthday! 💖

I wanted to surprise you with something a bit different this year... hope the zombie didn't scare you too much! 😜

You bring so much light, warmth, and laughter into my life. Every single day with you is a gift, and today we celebrate YOU.

May this year bring you endless happiness, beautiful adventures, and the realization of all your dreams. You deserve the absolute best.

Keep shining bright, beautiful! ✨

With love, always. 💕`;


/* =====================================================================
   HORROR FOG & PARTICLE CANVAS
   ===================================================================== */
class HorrorAtmosphere {
    constructor() {
        this.canvas = document.getElementById('horror-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.fogLayers = [];
        this.active = true;
        this.time = 0;
        this.lightningTimer = 0;
        this.lightningAlpha = 0;

        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.initParticles();
        this.initFog();
        this.startAmbientFlicker();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initParticles() {
        const count = 80;
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 0.5,
                speedX: (Math.random() - 0.5) * 0.4,
                speedY: -Math.random() * 0.6 - 0.1,
                opacity: Math.random() * 0.5 + 0.1,
                flicker: Math.random() * Math.PI * 2,
                flickerSpeed: Math.random() * 0.03 + 0.01,
                color: Math.random() > 0.7 ? [26, 255, 92] : [180, 255, 200]
            });
        }
    }

    initFog() {
        // Create large semi-transparent fog blobs
        this.fogLayers = [];
        for (let i = 0; i < 6; i++) {
            this.fogLayers.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height * 0.4 + Math.random() * this.canvas.height * 0.5,
                radius: Math.random() * 200 + 150,
                speedX: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.06 + 0.02,
                wobble: Math.random() * Math.PI * 2
            });
        }
    }

    startAmbientFlicker() {
        const overlay = document.getElementById('flicker-overlay');
        const doFlicker = () => {
            if (!this.active) return;
            overlay.classList.add('flash');
            setTimeout(() => overlay.classList.remove('flash'), 60 + Math.random() * 100);
            // Random interval 3-12 seconds
            setTimeout(doFlicker, 3000 + Math.random() * 9000);
        };
        setTimeout(doFlicker, 2000);
    }

    update() {
        this.time += 0.016;

        // Lightning
        this.lightningTimer -= 0.016;
        if (this.lightningTimer <= 0) {
            // Random lightning every 5-15 seconds
            this.lightningTimer = 5 + Math.random() * 10;
            this.lightningAlpha = 0.15 + Math.random() * 0.1;
        }
        this.lightningAlpha *= 0.92; // decay quickly

        // Particles
        for (const p of this.particles) {
            p.x += p.speedX + Math.sin(this.time + p.flicker) * 0.15;
            p.y += p.speedY;
            p.flicker += p.flickerSpeed;
            p.opacity = (Math.sin(p.flicker) * 0.3 + 0.5) * 0.5;

            // Wrap
            if (p.y < -10) { p.y = this.canvas.height + 10; p.x = Math.random() * this.canvas.width; }
            if (p.x < -10) p.x = this.canvas.width + 10;
            if (p.x > this.canvas.width + 10) p.x = -10;
        }

        // Fog
        for (const f of this.fogLayers) {
            f.x += f.speedX;
            f.wobble += 0.003;
            f.y += Math.sin(f.wobble) * 0.3;
            if (f.x < -f.radius) f.x = this.canvas.width + f.radius;
            if (f.x > this.canvas.width + f.radius) f.x = -f.radius;
        }
    }

    draw() {
        const { ctx, canvas } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Lightning flash
        if (this.lightningAlpha > 0.005) {
            ctx.fillStyle = `rgba(26, 255, 92, ${this.lightningAlpha})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Fog blobs
        for (const f of this.fogLayers) {
            const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius);
            grad.addColorStop(0, `rgba(15, 80, 30, ${f.opacity})`);
            grad.addColorStop(0.6, `rgba(10, 50, 20, ${f.opacity * 0.4})`);
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(f.x - f.radius, f.y - f.radius, f.radius * 2, f.radius * 2);
        }

        // Particles (embers / floating dust)
        for (const p of this.particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${p.opacity})`;
            ctx.fill();

            // Glow
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${p.opacity * 0.15})`;
            ctx.fill();
        }
    }

    animate() {
        if (!this.active) return;
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    stop() {
        this.active = false;
    }
}


/* =====================================================================
   GLOBAL AUDIO CONTEXT & PRELOADED BUFFERS
   ===================================================================== */
let globalAudioCtx = null;
let screamBuffer = null;
let birthdayMusicBuffer = null;
let birthdayMusicSource = null;
let birthdayMusicGainNode = null;

function initGlobalAudioContext() {
    if (!globalAudioCtx) {
        globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (globalAudioCtx.state === 'suspended') {
        globalAudioCtx.resume().catch(e => console.warn('Failed to resume globalAudioCtx:', e));
    }
}

// Preload audio assets into Web Audio buffers on page load
function preloadAudioAssets() {
    try {
        if (!globalAudioCtx) {
            globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    } catch (e) {
        console.warn('Web Audio API not supported or failed to init:', e);
        return;
    }

    // Preload scream.mp3
    fetch('assets/scream.mp3')
        .then(res => res.arrayBuffer())
        .then(buf => globalAudioCtx.decodeAudioData(buf))
        .then(decoded => {
            screamBuffer = decoded;
            console.log('😱 Jumpscare scream sound preloaded and decoded!');
        })
        .catch(err => {
            console.warn('Failed to load/decode scream.mp3:', err);
        });

    // Preload happy_birthday_music_box.mp3
    fetch('assets/happy_birthday_music_box.mp3')
        .then(res => res.arrayBuffer())
        .then(buf => globalAudioCtx.decodeAudioData(buf))
        .then(decoded => {
            birthdayMusicBuffer = decoded;
            console.log('🎵 Happy Birthday music box preloaded and decoded!');
        })
        .catch(err => {
            console.warn('Failed to load/decode happy_birthday_music_box.mp3:', err);
        });
}

// Call preload immediately on script execution
preloadAudioAssets();

// Unlocking AudioContext on first page-wide user gesture
const unlockAudioContext = () => {
    initGlobalAudioContext();
    if (globalAudioCtx) {
        if (globalAudioCtx.state === 'running') {
            document.removeEventListener('click', unlockAudioContext);
            document.removeEventListener('touchstart', unlockAudioContext);
            document.removeEventListener('keydown', unlockAudioContext);
            console.log('🔊 Global AudioContext unlocked and running!');
        } else {
            globalAudioCtx.resume().then(() => {
                if (globalAudioCtx.state === 'running') {
                    document.removeEventListener('click', unlockAudioContext);
                    document.removeEventListener('touchstart', unlockAudioContext);
                    document.removeEventListener('keydown', unlockAudioContext);
                    console.log('🔊 Global AudioContext unlocked and running!');
                }
            });
        }
    }
};
document.addEventListener('click', unlockAudioContext, { passive: true });
document.addEventListener('touchstart', unlockAudioContext, { passive: true });
document.addEventListener('keydown', unlockAudioContext, { passive: true });


/* =====================================================================
   HORROR SOUND SYNTHESIZER — Layered, Intense (Using Shared globalAudioCtx)
   ===================================================================== */
class HorrorSoundSynth {
    get ctx() {
        initGlobalAudioContext();
        return globalAudioCtx;
    }

    init() {
        initGlobalAudioContext();
    }

    // A short "fake click" thud sound (for the fake-out)
    playThud() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
    }

    // The real scary sound — multi-layered cacophony
    playScream() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const dur = 2.2;

        // Layer 1: Sub-bass rumble (dread)
        const rumble = this.ctx.createOscillator();
        rumble.type = 'sawtooth';
        rumble.frequency.setValueAtTime(60, now);
        rumble.frequency.linearRampToValueAtTime(20, now + dur);
        const rumbleG = this.ctx.createGain();
        rumbleG.gain.setValueAtTime(0.7, now);
        rumbleG.gain.exponentialRampToValueAtTime(0.001, now + dur);
        rumble.connect(rumbleG); rumbleG.connect(this.ctx.destination);

        // Layer 2: Piercing screech (main scare)
        const screech1 = this.ctx.createOscillator();
        screech1.type = 'sawtooth';
        screech1.frequency.setValueAtTime(2400, now);
        screech1.frequency.linearRampToValueAtTime(600, now + 0.15);
        screech1.frequency.linearRampToValueAtTime(1800, now + 0.3);
        screech1.frequency.linearRampToValueAtTime(400, now + 0.6);
        screech1.frequency.linearRampToValueAtTime(1200, now + 0.9);
        screech1.frequency.linearRampToValueAtTime(200, now + dur);

        const screech2 = this.ctx.createOscillator();
        screech2.type = 'square';
        screech2.frequency.setValueAtTime(2600, now);
        screech2.frequency.linearRampToValueAtTime(500, now + 0.2);
        screech2.frequency.linearRampToValueAtTime(1600, now + 0.5);
        screech2.frequency.linearRampToValueAtTime(300, now + dur);

        // Layer 3: Noise-like modulation
        const mod = this.ctx.createOscillator();
        mod.frequency.setValueAtTime(80, now);
        const modG = this.ctx.createGain();
        modG.gain.setValueAtTime(200, now);
        mod.connect(modG);
        modG.connect(screech1.frequency);
        modG.connect(screech2.frequency);

        // Distortion filter
        const dist = this.ctx.createBiquadFilter();
        dist.type = 'highpass';
        dist.frequency.setValueAtTime(600, now);
        dist.Q.setValueAtTime(8, now);

        const mainG = this.ctx.createGain();
        mainG.gain.setValueAtTime(0.9, now);
        mainG.gain.setValueAtTime(0.9, now + 0.5);
        mainG.gain.exponentialRampToValueAtTime(0.001, now + dur);

        screech1.connect(dist);
        screech2.connect(dist);
        dist.connect(mainG);
        mainG.connect(this.ctx.destination);

        // Layer 4: Reverse impact (low boom at start)
        const boom = this.ctx.createOscillator();
        boom.type = 'sine';
        boom.frequency.setValueAtTime(200, now);
        boom.frequency.exponentialRampToValueAtTime(20, now + 0.5);
        const boomG = this.ctx.createGain();
        boomG.gain.setValueAtTime(1.0, now);
        boomG.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        boom.connect(boomG); boomG.connect(this.ctx.destination);

        // Start everything
        [rumble, screech1, screech2, mod, boom].forEach(o => o.start(now));
        rumble.stop(now + dur);
        screech1.stop(now + dur);
        screech2.stop(now + dur);
        mod.stop(now + dur);
        boom.stop(now + 0.5);
    }
}

const synth = new HorrorSoundSynth();


/* =====================================================================
   CUTE SOUND SYNTHESIZER — Pops and UI sounds (Using Shared globalAudioCtx)
   ===================================================================== */
class CuteSoundSynth {
    get ctx() {
        initGlobalAudioContext();
        return globalAudioCtx;
    }

    init() {
        initGlobalAudioContext();
    }

    playPop() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
    }

    playMoney() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(2400, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
    }

    playTick() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1600, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.03);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.03);
    }
}

const cuteSynth = new CuteSoundSynth();


/* =====================================================================
   MUSIC BOX SYNTHESIZER — "Happy Birthday to You" (Starting Page)
   Plays preloaded MP3 buffer if available; falls back to oscillators.
   ===================================================================== */
const HAPPY_BIRTHDAY_MELODY = [
    { note: 'G4', dur: 0.5 }, { note: 'G4', dur: 0.5 }, { note: 'A4', dur: 1 }, { note: 'G4', dur: 1 }, { note: 'C5', dur: 1 }, { note: 'B4', dur: 2 },
    { note: 'G4', dur: 0.5 }, { note: 'G4', dur: 0.5 }, { note: 'A4', dur: 1 }, { note: 'G4', dur: 1 }, { note: 'D5', dur: 1 }, { note: 'C5', dur: 2 },
    { note: 'G4', dur: 0.5 }, { note: 'G4', dur: 0.5 }, { note: 'G5', dur: 1 }, { note: 'E5', dur: 1 }, { note: 'C5', dur: 1 }, { note: 'B4', dur: 1 }, { note: 'A4', dur: 2 },
    { note: 'F5', dur: 0.5 }, { note: 'F5', dur: 0.5 }, { note: 'E5', dur: 1 }, { note: 'C5', dur: 1 }, { note: 'D5', dur: 1 }, { note: 'C5', dur: 2 }
];

const NOTE_FREQS = {
    'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99
};

class MusicBoxSynth {
    constructor() {
        this.ctx = null;
        this.timeoutId = null;
        this.isPlaying = false;
        this.delayNode = null;
        this.delayFeedback = null;
        this.delayWet = null;
    }

    init() {
        initGlobalAudioContext();
        this.ctx = globalAudioCtx;

        if (!this.ctx) return;

        // Create a feedback delay line to act as a beautiful dreamy reverb/echo!
        if (!this.delayNode) {
            this.delayNode = this.ctx.createDelay(1.0);
            this.delayNode.delayTime.setValueAtTime(0.35, this.ctx.currentTime); // 350ms echo

            this.delayFeedback = this.ctx.createGain();
            this.delayFeedback.gain.setValueAtTime(0.4, this.ctx.currentTime); // feedback volume

            this.delayWet = this.ctx.createGain();
            this.delayWet.gain.setValueAtTime(0.25, this.ctx.currentTime); // wet mix volume

            // Connect feedback loop
            this.delayNode.connect(this.delayFeedback);
            this.delayFeedback.connect(this.delayNode);

            // Connect wet mix to destination
            this.delayNode.connect(this.delayWet);
            this.delayWet.connect(this.ctx.destination);
        }
    }

    playNote(freq, time, duration) {
        if (!this.ctx) return;
        
        // 1. Fundamental frequency (triangle oscillator for warm bell-like punch)
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(freq, time);
        
        // Slight detune for organic mechanical music box feel
        osc1.detune.setValueAtTime((Math.random() - 0.5) * 8, time);

        gain1.gain.setValueAtTime(0, time);
        gain1.gain.linearRampToValueAtTime(0.15, time + 0.01);
        gain1.gain.exponentialRampToValueAtTime(0.001, time + duration - 0.05);

        // 2. Second harmonic (sine chime, one octave higher)
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 2, time);
        
        gain2.gain.setValueAtTime(0, time);
        gain2.gain.linearRampToValueAtTime(0.07, time + 0.008);
        gain2.gain.exponentialRampToValueAtTime(0.001, time + 0.8); // longer decay for beautiful chime

        // 3. Third harmonic (sine chime, octave + fifth higher)
        const osc3 = this.ctx.createOscillator();
        const gain3 = this.ctx.createGain();
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(freq * 3, time);
        
        gain3.gain.setValueAtTime(0, time);
        gain3.gain.linearRampToValueAtTime(0.04, time + 0.01);
        gain3.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

        // Connect oscillators
        osc1.connect(gain1);
        osc2.connect(gain2);
        osc3.connect(gain3);

        // Master mix node
        const mix = this.ctx.createGain();
        gain1.connect(mix);
        gain2.connect(mix);
        gain3.connect(mix);

        // Route dry signal to output
        mix.connect(this.ctx.destination);
        
        // Route wet signal to delay line
        if (this.delayNode) {
            mix.connect(this.delayNode);
        }

        // Start / Stop
        osc1.start(time);
        osc1.stop(time + duration);
        
        osc2.start(time);
        osc2.stop(time + duration);
        
        osc3.start(time);
        osc3.stop(time + duration);
    }

    startMelody() {
        this.init();
        if (this.isPlaying) return;
        this.isPlaying = true;

        // Try playing real preloaded music box MP3 first
        if (this.ctx && birthdayMusicBuffer) {
            try {
                birthdayMusicSource = this.ctx.createBufferSource();
                birthdayMusicSource.buffer = birthdayMusicBuffer;
                birthdayMusicSource.loop = true;

                birthdayMusicGainNode = this.ctx.createGain();
                const now = this.ctx.currentTime;
                birthdayMusicGainNode.gain.setValueAtTime(0.001, now);
                birthdayMusicGainNode.gain.linearRampToValueAtTime(0.85, now + 1.2); // Smooth fade in

                birthdayMusicSource.connect(birthdayMusicGainNode);
                birthdayMusicGainNode.connect(this.ctx.destination);

                birthdayMusicSource.start(0);
                console.log('🎵 Beautiful Mechanical Music Box MP3 playing!');
                return;
            } catch (e) {
                console.warn('Real music box MP3 playback failed, falling back to synth:', e);
            }
        }

        // Fallback: Chiptune Synthesized Melody
        if (!this.ctx) return;
        let index = 0;
        const tempo = 80; 
        const beatDuration = 60 / tempo;

        const bassNotes = {
            0: 196.00, // G3
            6: 146.83, // D3
            12: 261.63, // C4
            19: 174.61  // F3
        };
        
        const nextNote = () => {
            if (!this.isPlaying) return;
            
            const item = HAPPY_BIRTHDAY_MELODY[index];
            const freq = NOTE_FREQS[item.note];
            const dur = item.dur * beatDuration;
            
            this.playNote(freq, this.ctx.currentTime, dur);

            if (bassNotes[index] !== undefined) {
                this.playNote(bassNotes[index] / 2, this.ctx.currentTime, dur * 2);
            }
            
            index = (index + 1) % HAPPY_BIRTHDAY_MELODY.length;
            this.timeoutId = setTimeout(nextNote, dur * 1000);
        };
        
        nextNote();
    }

    stop() {
        this.isPlaying = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        // Stop real MP3 buffer source if it is playing
        if (birthdayMusicSource) {
            try {
                if (this.ctx && birthdayMusicGainNode) {
                    const now = this.ctx.currentTime;
                    birthdayMusicGainNode.gain.setValueAtTime(birthdayMusicGainNode.gain.value, now);
                    birthdayMusicGainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                    
                    const sourceToStop = birthdayMusicSource;
                    setTimeout(() => {
                        try {
                            sourceToStop.stop();
                        } catch (e) {}
                    }, 150);
                } else {
                    birthdayMusicSource.stop();
                }
            } catch (e) {
                // Already stopped
            }
            birthdayMusicSource = null;
            birthdayMusicGainNode = null;
        }
    }
}

const musicBox = new MusicBoxSynth();


/* =====================================================================
   BIRTHDAY SONG — "Love Me Like You Do" by Ellie Goulding
   Uses HTML5 Audio with local MP3 file (assets/love_me_like_you_do.mp3)
   Bulletproof: warmed up during user gesture, loop 0:15→2:00
   Fallback: visible music button if autoplay blocked
   ===================================================================== */
const SONG_START = 15;       // start at 0:15
const SONG_END = 165;        // stop at 2:45
const SONG_MAX_VOL = 0.60;   // max volume (0-1)

let birthdaySong = null;
let songLoopTimer = null;
let songPlaying = false;
let audioWarmedUp = false;

// Create the audio element right away so it starts loading
try {
    birthdaySong = new Audio('assets/love_me_like_you_do.webm');
    birthdaySong.preload = 'auto';
    birthdaySong.volume = 0;
    birthdaySong.loop = false;
    console.log('🎵 Audio element created, preloading...');
} catch (e) {
    console.warn('Could not create Audio element:', e);
}

// Called during zombie click (user gesture) — this is CRITICAL
// Browsers only allow audio playback if initiated within a user gesture
function prepareBirthdaySong() {
    if (!birthdaySong) return;
    try {
        birthdaySong.volume = 0.001; // near-silent

        // Don't set currentTime here yet, as metadata might not be loaded, causing an InvalidStateError
        const playPromise = birthdaySong.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                audioWarmedUp = true;
                // Immediately pause — we just needed the browser to "allow" audio
                birthdaySong.pause();

                try {
                    birthdaySong.currentTime = SONG_START;
                } catch (e) { } // Ignore if still not ready

                birthdaySong.volume = 0;
                console.log('🎵 Audio warmed up successfully in user gesture!');
            }).catch((err) => {
                console.warn('🎵 Audio warm-up failed:', err);
            });
        }
    } catch (e) {
        console.warn('prepareBirthdaySong error:', e);
    }
}

// Called when birthday page loads — play for real
function startBirthdaySong() {
    if (songPlaying) return;
    if (!birthdaySong) return;

    const savedSongTime = localStorage.getItem('birthdaySongTime');
    if (savedSongTime !== null) {
        const parsedTime = parseFloat(savedSongTime);
        if (!isNaN(parsedTime) && parsedTime >= SONG_START && parsedTime <= SONG_END) {
            birthdaySong.currentTime = parsedTime;
            console.log('🎵 Resuming song from saved time:', birthdaySong.currentTime);
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
            console.log('🎵 Song is playing!');
            // Fade in
            fadeInSong();
            // Start loop monitor
            startSongLoopMonitor();
            // Hide the music button if it exists
            hideMusicButton();
        }).catch((err) => {
            console.warn('🎵 Autoplay blocked:', err);
            // Show a visible "tap to play music" button
            showMusicButton();
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
    }, 100); // 3 second fade-in (30 steps × 100ms)
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

// ── Fallback Music Button ──
// If autoplay is blocked, show a floating button so user can tap to play
function showMusicButton() {
    if (document.getElementById('music-fallback-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'music-fallback-btn';
    btn.innerHTML = '🎵';
    btn.title = 'Tap to play music';
    btn.style.cssText = `
        position: fixed; bottom: 30px; right: 30px;
        width: 60px; height: 60px; border-radius: 50%;
        background: linear-gradient(135deg, #ff477e, #ff9ebb);
        border: 3px solid #fff;
        font-size: 28px; cursor: pointer;
        z-index: 99999;
        box-shadow: 0 4px 20px rgba(255,71,126,0.5);
        animation: musicBtnPulse 1.5s infinite;
        display: flex; align-items: center; justify-content: center;
    `;
    // Add pulse animation
    if (!document.getElementById('music-btn-style')) {
        const style = document.createElement('style');
        style.id = 'music-btn-style';
        style.textContent = `
            @keyframes musicBtnPulse {
                0%, 100% { transform: scale(1); box-shadow: 0 4px 20px rgba(255,71,126,0.5); }
                50% { transform: scale(1.1); box-shadow: 0 4px 30px rgba(255,71,126,0.8); }
            }
        `;
        document.head.appendChild(style);
    }
    btn.addEventListener('click', () => {
        if (!birthdaySong) return;
        if (birthdaySong.currentTime < SONG_START || birthdaySong.currentTime > SONG_END) {
            birthdaySong.currentTime = SONG_START;
        }
        birthdaySong.volume = SONG_MAX_VOL;
        birthdaySong.play().then(() => {
            songPlaying = true;
            startSongLoopMonitor();
            hideMusicButton();
            console.log('🎵 Song started via button!');
        }).catch(e => console.warn('Still blocked:', e));
    });
    document.body.appendChild(btn);
}

function hideMusicButton() {
    const btn = document.getElementById('music-fallback-btn');
    if (btn) btn.remove();
}


/* =====================================================================
   FLOATING HEARTS CANVAS
   ===================================================================== */
class HeartsBackground {
    constructor() {
        this.canvas = document.getElementById('hearts-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.hearts = [];
        this.active = false;
        window.addEventListener('resize', () => this.resize());
    }

    start() {
        this.active = true;
        this.resize();
        this.initHearts();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initHearts() {
        const count = Math.min(Math.floor(window.innerWidth / 14), 65);
        this.hearts = [];
        for (let i = 0; i < count; i++) this.hearts.push(this.makeHeart(true));
    }

    makeHeart(randomY) {
        const colors = [
            'rgba(255,71,126,', 'rgba(255,112,150,',
            'rgba(255,158,187,', 'rgba(255,194,209,',
            'rgba(255,75,75,'
        ];
        return {
            x: Math.random() * this.canvas.width,
            y: randomY ? Math.random() * this.canvas.height : this.canvas.height + 40,
            size: Math.random() * 18 + 8,
            speed: Math.random() * 1.2 + 0.5,
            opacity: Math.random() * 0.55 + 0.2,
            wobble: Math.random() * 6.28,
            wobbleSpd: Math.random() * 0.02 + 0.008,
            rot: Math.random() * 0.4 - 0.2,
            scaleDir: Math.random() * 0.005 + 0.002,
            scale: Math.random() * 0.4 + 0.8,
            color: colors[Math.floor(Math.random() * colors.length)]
        };
    }

    drawHeart(h) {
        const { ctx } = this;
        const s = h.size;
        ctx.save();
        ctx.translate(h.x, h.y);
        ctx.rotate(h.rot);
        ctx.scale(h.scale, h.scale);
        ctx.fillStyle = h.color + h.opacity + ')';
        ctx.beginPath();
        ctx.moveTo(0, -s / 4);
        ctx.bezierCurveTo(-s / 2, -s / 1.5, -s, -s / 3, -s, s / 4);
        ctx.bezierCurveTo(-s, s / 1.2, -s / 4, s * 1.2, 0, s * 1.5);
        ctx.bezierCurveTo(s / 4, s * 1.2, s, s / 1.2, s, s / 4);
        ctx.bezierCurveTo(s, -s / 3, s / 2, -s / 1.5, 0, -s / 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    animate() {
        if (!this.active) return;
        const { ctx, canvas } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < this.hearts.length; i++) {
            const h = this.hearts[i];
            h.y -= h.speed;
            h.wobble += h.wobbleSpd;
            h.x += Math.sin(h.wobble) * 0.5;
            h.scale += h.scaleDir;
            if (h.scale > 1.2 || h.scale < 0.8) h.scaleDir = -h.scaleDir;
            if (h.y < -40) this.hearts[i] = this.makeHeart(false);
            this.drawHeart(h);
        }
        requestAnimationFrame(() => this.animate());
    }
}

/* =====================================================================
   CONFETTI RAIN CANVAS SYSTEM
   ===================================================================== */
class ConfettiRain {
    constructor() {
        this.canvas = document.getElementById('confetti-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.active = false;
        window.addEventListener('resize', () => this.resize());
    }

    start() {
        this.active = true;
        this.resize();
        this.initParticles();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initParticles() {
        const count = 180;
        this.particles = [];
        const colors = ['#ffd1dc', '#ff477e', '#ffb3c1', '#fdf6e2', '#ffd166', '#06d6a0', '#ff9ebb', '#ff5c8a', '#4cc9f0', '#7209b7'];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: -Math.random() * this.canvas.height - 20,
                width: Math.random() * 8 + 4,
                height: Math.random() * 16 + 8,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 2 + 2,
                speedX: (Math.random() - 0.5) * 1.5,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.1,
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: Math.random() * 0.05 + 0.02,
                type: Math.random() > 0.35 ? 'ribbon' : 'circle'
            });
        }
    }

    drawParticle(p) {
        const { ctx } = this;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.type === 'ribbon') {
            ctx.beginPath();
            ctx.moveTo(-p.width / 2, -p.height / 2);
            ctx.bezierCurveTo(
                -p.width / 2 + Math.sin(p.wobble) * 4, -p.height / 4,
                -p.width / 2 - Math.sin(p.wobble) * 4, p.height / 4,
                -p.width / 2, p.height / 2
            );
            ctx.lineTo(p.width / 2, p.height / 2);
            ctx.bezierCurveTo(
                p.width / 2 - Math.sin(p.wobble) * 4, p.height / 4,
                p.width / 2 + Math.sin(p.wobble) * 4, -p.height / 4,
                p.width / 2, -p.height / 2
            );
            ctx.closePath();
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.width, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    animate() {
        if (!this.active) return;
        const { ctx, canvas } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let activeCount = 0;

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            p.y += p.speedY;
            p.x += p.speedX + Math.sin(p.wobble) * 0.5;
            p.wobble += p.wobbleSpeed;
            p.rotation += p.rotationSpeed;

            this.drawParticle(p);

            if (p.y < canvas.height + 50) {
                activeCount++;
            }
        }

        if (activeCount > 0) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.stop();
        }
    }

    stop() {
        this.active = false;
        const { ctx, canvas } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}


/* =====================================================================
   MAIN INTERACTION CONTROLLER
   ===================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const zombieFrame = document.getElementById('zombie-frame');
    const horrorStage = document.getElementById('horror-stage');
    const cuteStage = document.getElementById('cute-stage');
    const jumpscareOvl = document.getElementById('jumpscare-overlay');
    const jumpscareImg = document.getElementById('jumpscare-img');
    const whiteFlash = document.getElementById('white-flash');
    const giftBox = document.getElementById('gift-box');
    const scrollWrapper = document.getElementById('scroll-wrapper');
    const scrollContent = document.getElementById('scroll-typed-content');
    const typingCursor = document.getElementById('typing-cursor');
    const horrorCanvas = document.getElementById('horror-canvas');

    const club18Teen = document.getElementById('club18-teen');
    const club18Adult = document.getElementById('club18-adult');
    const club18Jail = document.getElementById('club18-jail');
    const club18AdultTag = document.getElementById('club18-adult-tag');
    const club18JailMsg = document.getElementById('club18-jail-msg');
    const scrollIndMoney = document.getElementById('scroll-indicator-money');

    let scareTriggered = false;
    let boxOpened = false;

    // Start horror atmosphere
    const atmosphere = new HorrorAtmosphere();
    const heartSim = new HeartsBackground();

    // Preload the real scream sound
    const realScream = new Audio('assets/scream.mp3');
    realScream.volume = 1.0;

    /* -----------------------------------------------------------
       CANDLE INTERACTION (PHASE A → PHASE B)
       ----------------------------------------------------------- */
    let candleBlown = false;
    let blowingInProgress = false;
    const candleContent = document.getElementById('candle-content-wrapper');
    const wishContent = document.getElementById('wish-content-wrapper');
    const candleScene = document.getElementById('candle-scene');
    const candleFlame = document.getElementById('candle-flame');
    const confetti = new ConfettiRain();

    // Sound generator for blowing (Using Shared globalAudioCtx)
    function playBlowSound() {
        try {
            initGlobalAudioContext();
            if (!globalAudioCtx) return;
            const audioCtx = globalAudioCtx;
            const bufferSize = audioCtx.sampleRate * 0.8;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noiseNode = audioCtx.createBufferSource();
            noiseNode.buffer = buffer;
            const filterNode = audioCtx.createBiquadFilter();
            filterNode.type = 'bandpass';
            filterNode.frequency.setValueAtTime(450, audioCtx.currentTime);
            filterNode.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.8);
            filterNode.Q.setValueAtTime(3.0, audioCtx.currentTime);
            const gainNode = audioCtx.createGain();
            gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
            noiseNode.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            noiseNode.start();
            noiseNode.stop(audioCtx.currentTime + 0.8);
        } catch (e) {
            console.warn('Could not synthesize blow sound:', e);
        }
    }

    const handleCandleBlow = () => {
        if (candleBlown || blowingInProgress) return;
        blowingInProgress = true;

        playBlowSound();

        // Start playing the birthday song melody
        musicBox.startMelody();

        // Spawn wind puff 💨 emoji container
        const wind = document.createElement('div');
        wind.className = 'wind-puff';
        wind.textContent = '💨';
        candleScene.appendChild(wind);

        setTimeout(() => {
            candleFlame.classList.add('extinguished');
            wind.remove();
            cuteSynth.playPop();

            // Start confetti celebration strings/craft
            confetti.start();

            setTimeout(() => {
                candleContent.style.transition = 'opacity 0.6s ease';
                candleContent.style.opacity = '0';

                setTimeout(() => {
                    candleContent.classList.add('js-hidden');
                    
                    wishContent.classList.remove('js-hidden');
                    wishContent.style.opacity = '0';
                    wishContent.style.transition = 'opacity 0.8s ease';
                    void wishContent.offsetWidth;
                    wishContent.style.opacity = '1';
                    
                    candleBlown = true;
                    blowingInProgress = false;
                }, 600);
            }, 1800);

        }, 450);
    };

    candleScene.addEventListener('click', handleCandleBlow);
    document.getElementById('candle-prompt').addEventListener('click', handleCandleBlow);

    /* -----------------------------------------------------------
       ZOMBIE CLICK → INSTANT JUMPSCARE → TRANSITION
       ----------------------------------------------------------- */
    wishContent.addEventListener('click', () => {
        if (!candleBlown) return;
        if (scareTriggered) return;
        scareTriggered = true;

        // Stop the birthday song melody immediately
        musicBox.stop();

        // Hide wish content immediately
        wishContent.style.transition = 'filter 0.1s, opacity 0.1s';
        wishContent.style.opacity = '0';
        zombieFrame.style.transition = 'filter 0.1s, opacity 0.1s';
        zombieFrame.style.filter = 'brightness(0)';

        // Play real movie scream instantly with preloaded Web Audio buffer for zero latency
        let screamPlayed = false;
        if (globalAudioCtx && screamBuffer) {
            try {
                const source = globalAudioCtx.createBufferSource();
                source.buffer = screamBuffer;
                source.connect(globalAudioCtx.destination);
                source.start(0);
                screamPlayed = true;
                console.log('😱 Jumpscare sound played with zero latency via Web Audio API!');
            } catch (e) {
                console.warn('Web Audio scream playback failed:', e);
            }
        }

        if (!screamPlayed) {
            try {
                realScream.currentTime = 0;
                realScream.play().catch(e => {
                    console.warn('HTML5 Audio scream play blocked, playing synth fallback:', e);
                    synth.playScream();
                });
            } catch (e) {
                synth.playScream();
            }
        }

        // Prepare YouTube video immediately within user gesture to bypass autoplay policy
        prepareBirthdaySong();

        // Show jumpscare overlay immediately (no delay)
        jumpscareOvl.classList.remove('js-hidden');
        document.body.classList.add('scare-shake');

        // Rapid zoom-in effect on jumpscare image
        jumpscareImg.style.transition = 'none';
        jumpscareImg.style.transform = 'translate(-50%, -50%) scale(0.5)';
        jumpscareImg.style.opacity = '0';

        // Force reflow
        void jumpscareImg.offsetWidth;

        jumpscareImg.style.transition = 'transform 0.15s cubic-bezier(0.2, 0, 0.2, 1), opacity 0.08s';
        jumpscareImg.style.transform = 'translate(-50%, -50%) scale(1.15)';
        jumpscareImg.style.opacity = '1';

        // Flash-cut effect: rapidly toggle image inversion for panic
        let flashCount = 0;
        const flashInterval = setInterval(() => {
            flashCount++;
            if (flashCount > 15) {
                clearInterval(flashInterval);
                jumpscareImg.style.filter = 'none';
                return;
            }
            const invert = flashCount % 2 === 0;
            jumpscareImg.style.filter = invert
                ? 'invert(1) contrast(2) hue-rotate(180deg)'
                : `brightness(${0.6 + Math.random() * 0.8}) contrast(${1 + Math.random()})`;

            // Random scale shifts
            const s = 1 + Math.random() * 0.3;
            const tx = (Math.random() - 0.5) * 30;
            const ty = (Math.random() - 0.5) * 30;
            jumpscareImg.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${s})`;
        }, 80);

        // Background rapid strobe between red/black
        let strobeCount = 0;
        const strobeInterval = setInterval(() => {
            strobeCount++;
            if (strobeCount > 20) {
                clearInterval(strobeInterval);
                jumpscareOvl.style.backgroundColor = '#000';
                return;
            }
            jumpscareOvl.style.backgroundColor = strobeCount % 2 === 0
                ? '#000'
                : `rgb(${60 + Math.random() * 40}, 0, 0)`;
        }, 60);

        // ── End scare, transition to cute ──
        setTimeout(() => {
            document.body.classList.remove('scare-shake');

            // Hide scare
            jumpscareOvl.classList.add('js-hidden');
            jumpscareOvl.style.backgroundColor = '';
            jumpscareImg.style.filter = '';
            jumpscareImg.style.transform = 'translate(-50%, -50%) scale(1)';

            // White flash
            whiteFlash.classList.remove('js-hidden');

            // Stop horror atmosphere
            atmosphere.stop();
            horrorCanvas.style.display = 'none';

            // Switch stages
            horrorStage.classList.add('hidden-stage');
            horrorStage.classList.remove('active-stage');
            cuteStage.classList.remove('hidden-stage');
            cuteStage.classList.add('active-stage');
            document.body.style.background = '';

            // Stop the screaming sound
            try {
                realScream.pause();
                realScream.currentTime = 0;
            } catch (e) { }

            // Start hearts
            heartSim.start();
            animatePolaroids();

            // Show teen girl message popup after polaroids finish entering
            setTimeout(() => {
                const teenMsg = document.getElementById('club18-teen-msg');
                if (teenMsg) teenMsg.classList.add('club18-msg-visible');
            }, 1500);

            // 🎵 Play "Love Me Like You Do" immediately
            startBirthdaySong();

            // Remove white flash after it fades
            setTimeout(() => {
                whiteFlash.classList.add('js-hidden');
            }, 1300);

        }, 1800); // scare duration
    });

    /* -----------------------------------------------------------
       POLAROID STAGGERED ENTRY
       ----------------------------------------------------------- */
    function animatePolaroids() {
        const cards = document.querySelectorAll('.polaroid-card');
        cards.forEach((card, idx) => {
            card.style.opacity = '0';
            card.style.transform = `translateY(50px) rotate(${idx === 0 ? '-12deg' : '12deg'})`;
            card.style.transition = 'all 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = `translateY(0) rotate(${idx === 0 ? '-4deg' : '4deg'})`;
            }, 500 + idx * 350);
        });
    }

    /* -----------------------------------------------------------
       CLUB 18 INTERACTION
       ----------------------------------------------------------- */
    let club18State = 0; // 0: teen, 1: adult, 2: jail

    club18Teen.addEventListener('click', () => {
        if (club18State !== 0) return;
        club18State = 1;
        cuteSynth.playPop();

        // Hide "Tap me" on teen
        club18Teen.querySelector('.click-me-tag').style.display = 'none';

        // Hide teen message popup
        const teenMsg = document.getElementById('club18-teen-msg');
        if (teenMsg) teenMsg.classList.remove('club18-msg-visible');

        // Slide teen left
        club18Teen.style.transform = 'translateX(-120px)';
        club18Teen.classList.remove('club18-center');

        // Show adult
        setTimeout(() => {
            club18Adult.classList.remove('club18-hidden');
            club18Adult.style.transform = 'translateX(60px)';
            
            // Show adult message popup
            setTimeout(() => {
                const adultMsg = document.getElementById('club18-adult-msg');
                if (adultMsg) {
                    adultMsg.classList.add('club18-msg-visible');
                    cuteSynth.playPop();
                }
            }, 400);

            // Show click tag for adult
            setTimeout(() => {
                club18AdultTag.style.display = 'block';
            }, 600);
        }, 300);
    });

    club18Adult.addEventListener('click', () => {
        if (club18State !== 1) return;
        club18State = 2;
        cuteSynth.playPop();

        // Hide tag
        club18AdultTag.style.display = 'none';

        // Hide adult message popup
        const adultMsg = document.getElementById('club18-adult-msg');
        if (adultMsg) adultMsg.classList.remove('club18-msg-visible');

        // Slide teen further left
        club18Teen.style.transform = 'translateX(-180px)';
        // Slide adult left
        club18Adult.style.transform = 'translateX(-30px)';

        // Show jail girl
        setTimeout(() => {
            club18Jail.classList.remove('club18-hidden');
            club18Jail.style.transform = 'translateX(140px)';

            // Show popup message
            setTimeout(() => {
                club18JailMsg.classList.add('club18-msg-visible');
                cuteSynth.playPop();

                // Show scroll indicator to money section
                setTimeout(() => {
                    scrollIndMoney.classList.remove('scroll-ind-hidden');
                    scrollIndMoney.classList.add('scroll-ind-visible');
                }, 1000);
            }, 500);
        }, 300);
    });

    /* -----------------------------------------------------------
       CHOCOLATE / MONEY SENDING INTERACTION
       ----------------------------------------------------------- */
    const boyChar = document.getElementById('boy-char');
    const girlChar = document.getElementById('girl-char');
    const moneyContainer = document.getElementById('money-container');
    const moneyMessage = document.getElementById('money-message');
    const scrollIndDish = document.getElementById('scroll-indicator-dish');
    const scrollInd2 = document.getElementById('scroll-indicator-2');
    const scrollIndHate = document.getElementById('scroll-indicator-hate');
    const hateSection = document.getElementById('hate-section');
    const hateBoyChar = document.getElementById('hate-boy-char');
    const hateGirlChar = document.getElementById('hate-girl-char');
    const hateBoyMsg = document.getElementById('hate-boy-msg');
    const hateGirlMsg = document.getElementById('hate-girl-msg');
    const hateGirlTag = document.getElementById('hate-girl-tag');
    const hateMessageContainer = document.getElementById('hate-message-container');
    const hateVoiceWave = document.getElementById('hate-voice-wave');
    // (Separate falling scene elements removed)
    const clickTag = boyChar.querySelector('.click-me-tag');
    let moneyTriggered = false;

    boyChar.addEventListener('click', () => {
        if (moneyTriggered) return;
        moneyTriggered = true;

        // Play pop sound when clicked
        cuteSynth.playPop();

        // 1. Hide the "Tap me" tag
        clickTag.classList.add('tag-hidden');

        // 2. Move boy to left
        boyChar.classList.remove('boy-centered');
        boyChar.classList.add('boy-left');

        // 3. Reveal girl on right with a pop-in
        setTimeout(() => {
            girlChar.classList.remove('girl-hidden');
            girlChar.classList.add('girl-visible');
        }, 600);

        // 4. Start spawning money notes after both are in position
        setTimeout(() => {
            spawnMoneyNotes();
        }, 1200);

        // 5. Show sweet message after 5 seconds
        setTimeout(() => {
            moneyMessage.classList.remove('money-msg-hidden');
            moneyMessage.classList.add('money-msg-visible');
            moneyMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 6200);

        // 6. Show dish scroll indicator after 7.5 seconds
        setTimeout(() => {
            scrollIndDish.classList.remove('scroll-ind-hidden');
            scrollIndDish.classList.add('scroll-ind-visible');
        }, 8000);
    });

    function spawnMoneyNotes() {
        const moneyEmojis = ['💵', '💸', '💰', '💲', '🤑'];
        const stageW = document.getElementById('money-stage').offsetWidth;
        const stageH = document.getElementById('money-stage').offsetHeight;

        const startX = stageW * 0.18; // Boy's hands
        const endX = stageW * 0.78;   // Girl's hands
        const startY = stageH * 0.4;  // Chest height

        const totalNotes = 15;
        let spawned = 0;

        const spawnInterval = setInterval(() => {
            if (spawned >= totalNotes) {
                clearInterval(spawnInterval);
                return;
            }

            const note = document.createElement('div');
            note.classList.add('money-note');
            note.textContent = moneyEmojis[Math.floor(Math.random() * moneyEmojis.length)];

            // Randomize starting slightly
            const initX = startX + (Math.random() - 0.5) * 30;
            const initY = startY + (Math.random() - 0.5) * 30;
            const targetY = startY + (Math.random() - 0.5) * 60;

            // Animation config
            const duration = 1200 + Math.random() * 600; // 1.2s to 1.8s
            const startTime = performance.now();
            const amplitude = 40 + Math.random() * 50; // height of the curve
            const frequency = 1.5 + Math.random(); // number of waves
            const dir = Math.random() > 0.5 ? 1 : -1; // up or down curve

            // Random spin
            const startRot = Math.random() * 360;
            const rotSpeed = (Math.random() - 0.5) * 720; // total rotation

            moneyContainer.appendChild(note);

            // Play sound effect when note spawns
            if (spawned % 2 === 0) cuteSynth.playMoney();

            function animateNote(time) {
                const elapsed = time - startTime;
                let progress = elapsed / duration;

                if (progress >= 1) progress = 1;

                // Easing out for natural throw physics
                const easedProgress = progress * (2 - progress); // quadratic ease-out

                // Linear/eased X interpolation
                const currentX = initX + (endX - initX) * easedProgress;

                // Sine wave Y interpolation for smooth vertex curve
                const waveY = Math.sin(progress * Math.PI * frequency) * amplitude * dir;

                // Add an overall slight arch (parabola) to the Y axis
                const archY = Math.sin(progress * Math.PI) * -30; // arch up by 30px in the middle

                const currentY = initY + (targetY - initY) * progress + waveY + archY;

                const currentRot = startRot + rotSpeed * progress;
                const scale = 1 - Math.abs(0.5 - progress) * 0.5; // grows slightly in middle, shrinks at ends
                const opacity = progress > 0.8 ? (1 - progress) * 5 : 1; // fade out at very end

                note.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${currentRot}deg) scale(${scale})`;
                note.style.opacity = opacity;

                if (progress < 1) {
                    requestAnimationFrame(animateNote);
                } else {
                    note.remove();
                }
            }

            requestAnimationFrame(animateNote);
            spawned++;
        }, 200); // spawn faster
    }

    /* -----------------------------------------------------------
       FAVORITE DISH INTERACTION
       ----------------------------------------------------------- */
    const dishCards = document.querySelectorAll('.dish-card');
    const dishPopupOverlay = document.getElementById('dish-popup-overlay');
    const dishPopupText = document.getElementById('dish-popup-text');
    const dishPopupBtn = document.getElementById('dish-popup-btn');

    let normalDishClicks = 0;

    dishCards.forEach(card => {
        card.addEventListener('click', () => {
            cuteSynth.playPop();
            const type = card.getAttribute('data-dish');

            if (type === 'secret') {
                dishPopupText.innerHTML = "You never told me 😭";
                dishPopupBtn.textContent = "Try again";
            } else {
                normalDishClicks++;
                if (normalDishClicks === 1) {
                    dishPopupText.innerHTML = "Its your favorite one so you won't get it today then 😝";
                    dishPopupBtn.textContent = "Try again";
                } else if (normalDishClicks === 2) {
                    dishPopupText.innerHTML = "Congrats, you wont get this one as well 😜";
                    dishPopupBtn.textContent = "Pick again";
                } else {
                    dishPopupText.innerHTML = "FIRST BUY ME CHOCOLATE 😝😋";
                    dishPopupBtn.textContent = "Fine...";

                    // Reveal the hate section scroll indicator and display the hate section!
                    setTimeout(() => {
                        scrollIndHate.classList.remove('scroll-ind-hidden');
                        scrollIndHate.classList.add('scroll-ind-visible');
                        
                        // Reveal hate section with display flex and then transition
                        hateSection.style.display = 'flex';
                        setTimeout(() => {
                            hateSection.classList.remove('hate-section-hidden');
                            hateSection.classList.add('hate-section-visible');
                        }, 50);
                    }, 1000);
                }
            }
            dishPopupOverlay.classList.remove('dish-popup-hidden');
        });
    });

    dishPopupBtn.addEventListener('click', () => {
        cuteSynth.playPop();
        dishPopupOverlay.classList.add('dish-popup-hidden');
    });

    /* -----------------------------------------------------------
       I HATE YOU 3000 SECTION INTERACTION (REVAMPED)
       ----------------------------------------------------------- */
    let hateState = 0; // 0 to 6 for dialogue, 7 for swipe complete

    const hateBoyTag = document.getElementById('hate-boy-tag');
    // hateGirlTag is already selected
    const swiperMachine = document.getElementById('swiper-machine');
    const swipeCard = document.getElementById('swipe-card');
    const flyingPlane = document.getElementById('flying-plane');
    const droppedParcel = document.getElementById('dropped-parcel');
    const revealedTicket = document.getElementById('revealed-ticket');
    const parcelTag = document.getElementById('parcel-tag');

    function updateHateDialogue(msgText, isBoy, nextState) {
        cuteSynth.playPop();
        
        if (isBoy) {
            hateBoyMsg.textContent = msgText;
            hateBoyMsg.classList.add('hate-msg-visible');
            hateGirlMsg.classList.remove('hate-msg-visible');
            hateBoyTag.classList.add('js-hidden');
            if (nextState < 6) hateGirlTag.classList.remove('js-hidden');
        } else {
            hateGirlMsg.textContent = msgText;
            hateGirlMsg.classList.add('hate-msg-visible');
            hateBoyMsg.classList.remove('hate-msg-visible');
            hateGirlTag.classList.add('js-hidden');
            if (nextState < 6) hateBoyTag.classList.remove('js-hidden');
        }
        
        hateState = nextState;
        
        if (hateState === 6) {
            // Trigger swipe mini-game
            setTimeout(() => {
                hateGirlMsg.classList.remove('hate-msg-visible');
                swiperMachine.classList.remove('js-hidden');
                swipeCard.classList.remove('js-hidden');
                cuteSynth.playMoney(); // play sound to indicate mini-game start
            }, 2000);
        }
    }

    hateBoyChar.addEventListener('click', () => {
        if (hateState === 0) {
            updateHateDialogue("yuo're so delustional, no one will like to talk to you 📐 😜 ur so bad 👧 😭", true, 1);
        } else if (hateState === 2) {
            updateHateDialogue("noooo, no one is saying me to stay. I choose to stay because I like this", true, 3);
        } else if (hateState === 4) {
            updateHateDialogue("I even have a list to do", true, 5);
        }
    });

    hateGirlChar.addEventListener('click', () => {
        if (hateState === 1) {
            updateHateDialogue("what are you waiting for? I'm not forcing you to stay, if it doesn't work, then just go. I'll respect your decision", false, 2);
        } else if (hateState === 3) {
            updateHateDialogue("how sure are you? that you want to stay", false, 4);
        } else if (hateState === 5) {
            updateHateDialogue("what list?", false, 6);
        }
    });

    // --- Drag and Drop for Swipe Card ---
    let isDraggingCard = false;
    let cardStartX, cardStartY;
    
    function startCardDrag(e) {
        if (hateState !== 6) return;
        isDraggingCard = true;
        swipeCard.style.transition = 'none';
        
        // Hide the swipe hint on first interaction
        const hint = swipeCard.querySelector('.swipe-hint');
        if (hint) hint.style.display = 'none';
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const rect = swipeCard.getBoundingClientRect();
        
        cardStartX = clientX - rect.left;
        cardStartY = clientY - rect.top;
    }

    function moveCardDrag(e) {
        if (!isDraggingCard) return;
        e.preventDefault(); // prevent scrolling
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const stageRect = document.querySelector('.hate-stage-content').getBoundingClientRect();
        
        let newX = clientX - stageRect.left - cardStartX;
        let newY = clientY - stageRect.top - cardStartY;
        
        swipeCard.style.left = `${newX}px`;
        swipeCard.style.top = `${newY}px`;
        swipeCard.style.right = 'auto'; // override default CSS right
    }

    function endCardDrag(e) {
        if (!isDraggingCard) return;
        isDraggingCard = false;
        
        // Check collision with swiper machine
        const cardRect = swipeCard.getBoundingClientRect();
        const machineRect = swiperMachine.getBoundingClientRect();
        
        // Simple bounding box intersection check
        const overlapX = Math.max(0, Math.min(cardRect.right, machineRect.right) - Math.max(cardRect.left, machineRect.left));
        const overlapY = Math.max(0, Math.min(cardRect.bottom, machineRect.bottom) - Math.max(cardRect.top, machineRect.top));
        
        if (overlapX > 20 && overlapY > 20) {
            // Successful swipe!
            triggerPlaneSequence();
        } else {
            // Snap back
            swipeCard.style.transition = 'all 0.3s ease';
            swipeCard.style.left = 'auto';
            swipeCard.style.top = '100px';
            swipeCard.style.right = '35%';
        }
    }

    swipeCard.addEventListener('mousedown', startCardDrag);
    swipeCard.addEventListener('touchstart', startCardDrag, {passive: false});
    document.addEventListener('mousemove', moveCardDrag);
    document.addEventListener('touchmove', moveCardDrag, {passive: false});
    document.addEventListener('mouseup', endCardDrag);
    document.addEventListener('touchend', endCardDrag);

    function triggerPlaneSequence() {
        hateState = 7;
        cuteSynth.playPop(); // sound for successful swipe
        
        // Hide card and machine
        swipeCard.classList.add('js-hidden');
        swiperMachine.classList.add('js-hidden');
        
        // Start plane animation
        flyingPlane.classList.remove('js-hidden');
        flyingPlane.classList.add('plane-fly-anim');
        
        // Drop parcel halfway through plane animation
        setTimeout(() => {
            droppedParcel.classList.remove('js-hidden');
            droppedParcel.classList.add('parcel-drop-anim');
            synth.playThud(); // soft thud for parcel dropping
        }, 1000);
        
        // Clean up plane after it leaves
        setTimeout(() => {
            flyingPlane.classList.add('js-hidden');
        }, 2600);
    }

    // Parcel Click Logic
    droppedParcel.addEventListener('click', () => {
        if (hateState !== 7) return;
        hateState = 8;
        cuteSynth.playPop();
        
        // Hide parcel, reveal ticket
        droppedParcel.classList.add('js-hidden');
        revealedTicket.classList.remove('js-hidden');
        
        // Small delay for CSS transition to trigger
        setTimeout(() => {
            revealedTicket.classList.add('ticket-visible');
            
            // Show scroll indicator after 1.5s
            setTimeout(() => {
                scrollInd2.classList.remove('scroll-ind-hidden');
                scrollInd2.classList.add('scroll-ind-visible');
                scrollInd2.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1500);
        }, 50);
    });


    /* -----------------------------------------------------------
       GIFT BOX OPEN → SCROLL EXPAND → TYPEWRITER
       ----------------------------------------------------------- */
    giftBox.addEventListener('click', () => {
        if (boxOpened) return;
        boxOpened = true;

        cuteSynth.playPop(); // Play pop sound effect

        giftBox.classList.add('opened');
        giftBox.style.animation = 'none';

        // Confetti burst
        spawnConfetti(giftBox);

        setTimeout(() => {
            scrollWrapper.classList.remove('scroll-collapsed');
            scrollWrapper.classList.add('scroll-expanded');

            setTimeout(() => {
                scrollWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
                typewrite(scrollContent, BIRTHDAY_MESSAGE, 45, () => {
                    // Hide cursor when done
                    typingCursor.style.display = 'none';
                });
            }, 900);
        }, 700);
    });

    /* -----------------------------------------------------------
       CONFETTI SPAWNER
       ----------------------------------------------------------- */
    function spawnConfetti(el) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 3;
        const colors = ['#ffd1dc', '#ff477e', '#ffb3c1', '#fdf6e2', '#ffd166', '#06d6a0', '#ff9ebb', '#ff5c8a'];
        const count = 45;

        for (let i = 0; i < count; i++) {
            const dot = document.createElement('div');
            dot.classList.add('sparkle-particle');
            const size = Math.random() * 10 + 4;
            dot.style.width = dot.style.height = size + 'px';
            dot.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            dot.style.left = cx + 'px';
            dot.style.top = cy + 'px';

            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 180 + 60;
            dot.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
            dot.style.setProperty('--ty', `${Math.sin(angle) * dist - 100}px`);

            document.body.appendChild(dot);
            setTimeout(() => dot.remove(), 1500);
        }
    }

    /* -----------------------------------------------------------
       TYPEWRITER
       ----------------------------------------------------------- */
    function typewrite(el, text, speed, onDone) {
        let i = 0;
        el.innerHTML = '';
        const tick = () => {
            if (i < text.length) {
                el.innerHTML += text[i] === '\n' ? '<br>' : text[i];
                
                // Play typewriter tick sound effect for non-space characters
                if (text[i] !== ' ' && text[i] !== '\n') {
                    cuteSynth.playTick();
                }

                i++;

                // Auto-scroll the parchment into view as text grows
                if (i % 20 === 0) {
                    scrollWrapper.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }

                setTimeout(tick, speed);
            } else if (onDone) {
                onDone();
            }
        };
        tick();
    }

    /* -----------------------------------------------------------
       LAST BUT NOT THE LEAST (THAILAND TRAVEL) INTERACTION
       ----------------------------------------------------------- */
    const travelFriends = document.getElementById('travel-friends');
    const thailandScene = document.getElementById('thailand-scene');
    let portalOpened = false;

    // Synthesize a beautiful, twinkling magical portal sound (Web Audio API)
    function playPortalSound() {
        try {
            initGlobalAudioContext();
            if (!globalAudioCtx) return;
            const ctx = globalAudioCtx;
            const now = ctx.currentTime;
            
            // Sparkling chime arpeggio (C Major Pentatonic going up)
            const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51, 1567.98, 1760.00, 2093.00];
            notes.forEach((freq, idx) => {
                const time = now + idx * 0.07;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const filter = ctx.createBiquadFilter();
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, time);
                
                filter.type = 'highpass';
                filter.frequency.setValueAtTime(500, time);
                
                gain.gain.setValueAtTime(0, time);
                gain.gain.linearRampToValueAtTime(0.08, time + 0.004);
                gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
                
                osc.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);
                
                osc.start(time);
                osc.stop(time + 0.4);
            });

            // Deep rising magical portal swoop
            const oscSweep = ctx.createOscillator();
            const gainSweep = ctx.createGain();
            oscSweep.type = 'triangle';
            oscSweep.frequency.setValueAtTime(180, now);
            oscSweep.frequency.exponentialRampToValueAtTime(880, now + 1.2);

            gainSweep.gain.setValueAtTime(0, now);
            gainSweep.gain.linearRampToValueAtTime(0.18, now + 0.2);
            gainSweep.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

            oscSweep.connect(gainSweep);
            gainSweep.connect(ctx.destination);
            
            oscSweep.start(now);
            oscSweep.stop(now + 1.4);
        } catch (e) {
            console.warn('Portal sound synthesis failed:', e);
        }
    }

    // Spawn twinkling star shapes flying outwards
    function spawnSparkles(el) {
        const rect = el.getBoundingClientRect();
        // Coordinates relative to viewport + scroll
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const colors = ['#ffffff', '#ffd1dc', '#ff477e', '#ffecd2', '#fff4cc', '#e2f0d9', '#d0e1fd'];
        const count = 40;

        for (let i = 0; i < count; i++) {
            const dot = document.createElement('div');
            dot.classList.add('sparkle-particle');
            const size = Math.random() * 12 + 6;
            dot.style.width = dot.style.height = size + 'px';
            dot.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Star clip path shape
            dot.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
            
            dot.style.left = cx + window.scrollX + 'px';
            dot.style.top = cy + window.scrollY + 'px';

            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 220 + 80;
            dot.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
            dot.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);

            document.body.appendChild(dot);
            setTimeout(() => dot.remove(), 1400);
        }
    }

    travelFriends.addEventListener('click', () => {
        if (portalOpened) return;
        portalOpened = true;

        if (birthdaySong) {
            localStorage.setItem('birthdaySongTime', birthdaySong.currentTime);
            console.log('🎵 Saved song time before transition:', birthdaySong.currentTime);
            birthdaySong.pause();
        }

        playPortalSound();
        spawnSparkles(travelFriends);

        // Transition: shrink, spin, and fade out the friends characters
        travelFriends.style.transition = 'transform 1.2s cubic-bezier(0.6, -0.28, 0.735, 0.045), opacity 1.5s ease';
        travelFriends.style.transform = 'scale(0) rotate(-720deg)';
        travelFriends.style.opacity = '0';
        travelFriends.style.pointerEvents = 'none';

        // Activate fullscreen bubble portal overlay
        const overlay = document.getElementById('portal-transition-overlay');
        if (overlay) {
            overlay.classList.add('active');
        }

        // Navigate to thailand.html after transition completes
        setTimeout(() => {
            window.location.href = 'thailand.html';
        }, 1200);
    });

    // Check if returning from Thailand slideshow
    const urlParams = new URLSearchParams(window.location.search);
    const isFromThailand = urlParams.get('from') === 'thailand';

    // Clear stale state so refresh always starts fresh
    try { localStorage.removeItem('birthdayStageState'); } catch (e) {}

    // Clear saved song time unless returning from Thailand (where we want to resume)
    if (!isFromThailand) {
        try { localStorage.removeItem('birthdaySongTime'); } catch (e) {}
    }

    if (isFromThailand) {
        console.log('🔄 Restoring cute stage states (returning from Thailand)...');

        // Clean url query parameter instantly to prevent restarting loop on reload/refresh
        if (isFromThailand) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Disable browser automatic scroll restoration so it doesn't jump back to top on load
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        // Stop horror atmosphere
        atmosphere.stop();
        if (horrorCanvas) horrorCanvas.style.display = 'none';

        // Swap stages instantly
        horrorStage.classList.add('hidden-stage');
        horrorStage.classList.remove('active-stage');
        cuteStage.classList.remove('hidden-stage');
        cuteStage.classList.add('active-stage');
        document.body.style.background = 'var(--cute-bg)';

        // Set progression flags
        candleBlown = true;
        scareTriggered = true;
        boxOpened = false; // Closed initially so they can open it after returning!
        club18State = 2;
        moneyTriggered = true;
        hateState = 4;

        // Restore candle stage state
        if (candleContent) candleContent.classList.add('js-hidden');
        if (wishContent) {
            wishContent.classList.remove('js-hidden');
            wishContent.style.opacity = '1';
        }

        // Restore Club 18 stage state (jail girl visible, others pushed left)
        if (club18Teen) {
            club18Teen.style.transform = 'translateX(-180px)';
            club18Teen.classList.remove('club18-center');
            const teenTag = club18Teen.querySelector('.click-me-tag');
            if (teenTag) teenTag.style.display = 'none';
            const teenMsg = document.getElementById('club18-teen-msg');
            if (teenMsg) teenMsg.classList.remove('club18-msg-visible');
        }
        if (club18Adult) {
            club18Adult.classList.remove('club18-hidden');
            club18Adult.style.transform = 'translateX(-30px)';
            if (club18AdultTag) club18AdultTag.style.display = 'none';
            const adultMsg = document.getElementById('club18-adult-msg');
            if (adultMsg) adultMsg.classList.remove('club18-msg-visible');
        }
        if (club18Jail) {
            club18Jail.classList.remove('club18-hidden');
            club18Jail.style.transform = 'translateX(140px)';
        }
        if (club18JailMsg) {
            club18JailMsg.classList.add('club18-msg-visible');
        }
        if (scrollIndMoney) {
            scrollIndMoney.classList.remove('scroll-ind-hidden');
            scrollIndMoney.classList.add('scroll-ind-visible');
        }

        // Restore Money section stage state
        if (boyChar) {
            boyChar.classList.remove('boy-centered');
            boyChar.classList.add('boy-left');
            if (clickTag) clickTag.classList.add('tag-hidden');
        }
        if (girlChar) {
            girlChar.classList.remove('girl-hidden');
            girlChar.classList.add('girl-visible');
        }
        if (moneyMessage) {
            moneyMessage.classList.remove('money-msg-hidden');
            moneyMessage.classList.add('money-msg-visible');
        }
        if (scrollIndDish) {
            scrollIndDish.classList.remove('scroll-ind-hidden');
            scrollIndDish.classList.add('scroll-ind-visible');
        }

        // Restore Hate stage state
        if (hateSection) {
            hateSection.style.display = 'flex';
            hateSection.classList.remove('hate-section-hidden');
            hateSection.classList.add('hate-section-visible');
        }
        // Show unified hate stage
        const hateStage = document.getElementById('hate-stage');
        if (hateStage) {
            hateStage.classList.remove('js-hidden');
        }
        // Immediately place characters in their completed landing states
        if (hateBoyChar) {
            hateBoyChar.classList.remove('hate-boy-centered', 'hate-boy-left', 'hate-boy-walk-to-girl', 'hate-boy-push-anim', 'hate-boy-look-down');
            hateBoyChar.classList.add('boy-fallen-flat');
        }
        if (hateGirlChar) {
            hateGirlChar.classList.remove('hate-girl-hidden', 'hate-girl-visible', 'girl-fall-out');
            hateGirlChar.classList.add('girl-ground-state');
        }
        // Restore active dialogue speech bubbles
        if (hateGirlMsg) {
            hateGirlMsg.textContent = "are you dead?";
            hateGirlMsg.classList.add('hate-msg-visible');
        }
        if (hateBoyMsg) {
            hateBoyMsg.textContent = "I Hate You 3000 💔";
            hateBoyMsg.classList.add('hate-msg-visible');
        }
        // Restore dizzy stars above boy
        const dizzyStars = document.getElementById('dizzy-stars-ring');
        if (dizzyStars) {
            dizzyStars.classList.remove('js-hidden');
        }
        if (scrollInd2) {
            scrollInd2.classList.remove('scroll-ind-hidden');
            scrollInd2.classList.add('scroll-ind-visible');
        }

        // Ensure travel friends are fully visible and clickable again
        if (travelFriends) {
            travelFriends.style.transform = '';
            travelFriends.style.opacity = '';
            travelFriends.style.pointerEvents = 'auto';
            const clickTag = travelFriends.querySelector('.click-me-tag');
            if (clickTag) clickTag.style.display = 'block';
        }

        // Show scroll indicator to the final Mystery Gift surprise
        const scrollIndLast = document.getElementById('scroll-indicator-last');
        if (scrollIndLast) {
            scrollIndLast.classList.remove('scroll-ind-hidden');
            scrollIndLast.classList.add('scroll-ind-visible');
        }

        // Start cute floating hearts
        heartSim.start();

        // Start birthday song
        startBirthdaySong();

        // Scroll instantly and lock viewport directly to the To Do List section
        const lastSection = document.getElementById('last-section');
        if (lastSection) {
            const scrollIntoTodo = () => {
                lastSection.scrollIntoView({ behavior: 'auto', block: 'center' });
            };
            // Instant jump to avoid flashing the top of the page
            scrollIntoTodo();
            // Re-enforce scroll at staggered intervals to survive layout shifts from late-loading images
            [30, 100, 250, 500, 1000, 2000].forEach(delay => setTimeout(scrollIntoTodo, delay));
            // Also scroll on full window load (all images/assets loaded)
            window.addEventListener('load', scrollIntoTodo);
        }
    }
});
