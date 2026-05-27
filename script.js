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
สุขสันต์วันเกิดนะ! 💖

I wanted to surprise you with something a bit different this year... hope the zombie didn't scare you too much! 😜
ปีนี้เค้าอยากจะเซอร์ไพรส์เธอในแบบที่ต่างออกไปหน่อย... หวังว่าซอมบี้จะไม่ทำให้เธอตกใจกลัวจนเกินไปนะ! 😜

You bring so much light, warmth, and laughter into my life. Every single day with you is a gift, and today we celebrate YOU.
เธอพาแสงสว่าง ความอบอุ่น และเสียงหัวเราะเข้ามาในชีวิตเค้า ทุกๆ วันที่มีเธออยู่คือของขวัญที่พิเศษที่สุด และวันนี้คือวันเฉลิมฉลองของเธอ

Now, even not talking to you for one day feels like 1 week... 🥺⏳
ตอนนี้แค่ไม่ได้คุยกับเธอแค่วันเดียว ก็รู้สึกยาวนานเหมือนเป็นอาทิตย์เลยนะ... 🥺⏳

May this year bring you endless happiness, beautiful adventures, and the realization of all your dreams. You deserve the absolute best.
ขอให้ปีนี้ของเธอเต็มไปด้วยความสุขที่ไม่มีวันสิ้นสุด การผจญภัยที่งดงาม และขอให้ความฝันของเธอเป็นจริงในทุกๆ เรื่อง เธอคู่ควรกับสิ่งที่ดีที่สุดในโลก

Keep shining bright, beautiful! ✨
เปล่งประกายสดใสต่อไปนะคนสวย! ✨

With love, always. 💕
รักเสมอและตลอดไป 💕`;


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

    // Preload assets/scream.mp3
    fetch('assets/scream.mp3')
        .then(res => res.arrayBuffer())
        .then(buf => globalAudioCtx.decodeAudioData(buf))
        .then(decoded => {
            screamBuffer = decoded;
            console.log('😱 Jumpscare scream sound preloaded and decoded!');
        })
        .catch(err => {
            console.warn('Failed to load/decode assets/scream.mp3:', err);
        });

    // Preload assets/happy_birthday_music_box.mp3
    fetch('assets/happy_birthday_music_box.mp3')
        .then(res => res.arrayBuffer())
        .then(buf => globalAudioCtx.decodeAudioData(buf))
        .then(decoded => {
            birthdayMusicBuffer = decoded;
            console.log('🎵 Happy Birthday music box preloaded and decoded!');
        })
        .catch(err => {
            console.warn('Failed to load/decode assets/happy_birthday_music_box.mp3:', err);
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
       POLAROID MYSTERIOUS PORTAL REVEAL
       ----------------------------------------------------------- */
    let portal1Opened = false;
    let portal2Opened = false;

    function playCardPortalSound() {
        try {
            initGlobalAudioContext();
            if (!globalAudioCtx) return;
            const ctx = globalAudioCtx;
            const now = ctx.currentTime;
            
            // 1. Rising whistle sweep
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'triangle';
            osc1.frequency.setValueAtTime(300, now);
            osc1.frequency.exponentialRampToValueAtTime(1200, now + 0.45);
            
            gain1.gain.setValueAtTime(0, now);
            gain1.gain.linearRampToValueAtTime(0.08, now + 0.04);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
            
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.45);
            
            // 2. Twinkling chime arpeggio (C Major Pentatonic)
            const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
            notes.forEach((freq, idx) => {
                const time = now + idx * 0.06;
                const oscChime = ctx.createOscillator();
                const gainChime = ctx.createGain();
                oscChime.type = 'sine';
                oscChime.frequency.setValueAtTime(freq, time);
                
                gainChime.gain.setValueAtTime(0, time);
                gainChime.gain.linearRampToValueAtTime(0.05, time + 0.005);
                gainChime.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
                
                oscChime.connect(gainChime);
                gainChime.connect(ctx.destination);
                oscChime.start(time);
                oscChime.stop(time + 0.35);
            });

            // 3. Funny boing/pop sound at the end
            const boingTime = now + 0.35;
            const oscBoing = ctx.createOscillator();
            const gainBoing = ctx.createGain();
            oscBoing.type = 'sine';
            oscBoing.frequency.setValueAtTime(150, boingTime);
            oscBoing.frequency.exponentialRampToValueAtTime(550, boingTime + 0.15);
            oscBoing.frequency.exponentialRampToValueAtTime(120, boingTime + 0.3);
            
            gainBoing.gain.setValueAtTime(0, boingTime);
            gainBoing.gain.linearRampToValueAtTime(0.12, boingTime + 0.05);
            gainBoing.gain.exponentialRampToValueAtTime(0.001, boingTime + 0.3);
            
            oscBoing.connect(gainBoing);
            gainBoing.connect(ctx.destination);
            oscBoing.start(boingTime);
            oscBoing.stop(boingTime + 0.3);
        } catch (e) {}
    }

    function spawnPortalSparkles(el) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        
        // Dynamic emojis flying out of the portal
        const emojis = ['🌀', '✨', '💖', '🌸', '🦄', '🍿', '🎈', '🍭', '⭐', '🌈'];
        const count = 30;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            particle.style.position = 'fixed';
            particle.style.fontSize = `${Math.random() * 1.4 + 1.2}rem`;
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '999';
            particle.style.left = cx + 'px';
            particle.style.top = cy + 'px';
            
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 150 + 50;
            const tx = Math.cos(angle) * dist;
            const ty = Math.sin(angle) * dist;
            
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            
            particle.style.animation = `emojiPortalFly 1.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards`;
            
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 1500);
        }
    }

    function animateRevealFilter(displacementId, filterId, duration = 1200) {
        const disp = document.getElementById(displacementId);
        const filter = document.getElementById(filterId);
        const turb = filter ? filter.querySelector('feTurbulence') : null;
        if (!disp) return;
        
        const startTime = performance.now();
        const startScale = 150;
        
        function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeProgress = 1 - Math.pow(1 - progress, 3); // cubic ease-out
            const currentScale = startScale * (1 - easeProgress);
            
            disp.setAttribute('scale', currentScale);
            
            if (turb && progress < 1) {
                const shift = (Math.random() - 0.5) * 0.012;
                turb.setAttribute('baseFrequency', (0.05 + shift).toFixed(4));
            }
            
            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                disp.setAttribute('scale', 0);
                if (turb) turb.setAttribute('baseFrequency', '0.05');
            }
        }
        requestAnimationFrame(tick);
    }

    let tearInterval = null;
    function startCryingTears() {
        if (tearInterval) return;
        const emojiEl = document.getElementById('crying-emoji');
        if (!emojiEl) return;
        
        const sobInterval = setInterval(() => {
            if (!tearInterval) {
                clearInterval(sobInterval);
                return;
            }
            try {
                initGlobalAudioContext();
                if (!globalAudioCtx) return;
                const ctx = globalAudioCtx;
                const now = ctx.currentTime;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(320, now);
                osc.frequency.linearRampToValueAtTime(150, now + 0.35);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.35);
            } catch (e) {}
        }, 1200);

        tearInterval = setInterval(() => {
            const bodyRect = document.body.getBoundingClientRect();
            const rect = emojiEl.getBoundingClientRect();
            const emojiX = rect.left - bodyRect.left + rect.width / 2;
            const emojiY = rect.top - bodyRect.top + rect.height * 0.65;
            
            spawnTear(emojiX - 8, emojiY);
            spawnTear(emojiX + 8, emojiY);
        }, 300);
    }

    function spawnTear(startX, startY) {
        const tear = document.createElement('div');
        tear.className = 'tear-drop';
        
        const jitterX = (Math.random() - 0.5) * 5;
        tear.style.left = `${startX + jitterX}px`;
        tear.style.top = `${startY}px`;
        
        const fallDist = 120 + Math.random() * 40;
        tear.style.setProperty('--ty', `${fallDist}px`);
        
        document.body.appendChild(tear);
        setTimeout(() => tear.remove(), 1200);
    }

    function checkBothPortalsOpened() {
        if (portal1Opened && portal2Opened) {
            const galleryMsg = document.getElementById('gallery-message');
            if (galleryMsg) {
                galleryMsg.classList.remove('gallery-msg-hidden');
                galleryMsg.classList.add('gallery-msg-visible');
                
                setTimeout(() => {
                    startCryingTears();
                }, 1000);
            }
        }
    }

    const portal1 = document.getElementById('portal-1');
    const portal2 = document.getElementById('portal-2');

    if (portal1) {
        portal1.addEventListener('click', () => {
            if (portal1Opened) return;
            portal1Opened = true;
            
            const parentCard = portal1.closest('.polaroid-card');
            if (parentCard) {
                const wrapper = parentCard.querySelector('.polaroid-img-wrapper');
                if (wrapper) {
                    wrapper.classList.add('img-shake');
                    setTimeout(() => wrapper.classList.remove('img-shake'), 800);
                }
            }
            
            portal1.classList.add('portal-dissolve');
            
            const img = portal1.previousElementSibling;
            if (img) {
                img.classList.add('displace-active-1');
                animateRevealFilter('displacement-1', 'magic-filter-1');
            }
            
            playCardPortalSound();
            spawnPortalSparkles(portal1);
            checkBothPortalsOpened();
        });
    }

    if (portal2) {
        portal2.addEventListener('click', () => {
            if (portal2Opened) return;
            portal2Opened = true;
            
            const parentCard = portal2.closest('.polaroid-card');
            if (parentCard) {
                const wrapper = parentCard.querySelector('.polaroid-img-wrapper');
                if (wrapper) {
                    wrapper.classList.add('img-shake');
                    setTimeout(() => wrapper.classList.remove('img-shake'), 800);
                }
            }
            
            portal2.classList.add('portal-dissolve');
            
            const img = portal2.previousElementSibling;
            if (img) {
                img.classList.add('displace-active-2');
                animateRevealFilter('displacement-2', 'magic-filter-2');
            }
            
            playCardPortalSound();
            spawnPortalSparkles(portal2);
            checkBothPortalsOpened();
        });
    }

    /* -----------------------------------------------------------
       CLUB 18 INTERACTION (BOUNCER ID CHECK GAME)
       ----------------------------------------------------------- */
    const showIdBtn = document.getElementById('show-id-btn');
    const forgeIdBtn = document.getElementById('forge-id-btn');
    const submitFakeIdBtn = document.getElementById('submit-fake-id-btn');
    const bouncerSpeech = document.getElementById('bouncer-speech');
    const zombieIdCard = document.getElementById('zombie-id-card');
    const idAgeVal = document.getElementById('id-age-val');
    const idPhoto = document.getElementById('id-photo');
    const fakeStamp = document.getElementById('fake-stamp');
    const scannerPanel = document.getElementById('biometric-scanner-panel');
    const scannerLaser = document.getElementById('scanner-laser');
    const scannerStatus = document.getElementById('scanner-status');
    const scannerProgressFill = document.getElementById('scanner-progress-fill');
    const fingerprintBtn = document.getElementById('fingerprint-btn');
    const jailBarsOverlay = document.getElementById('jail-bars-overlay');

    let club18State = 0; // 0: init, 1: id shown (underage), 2: forged, 3: scanning, 4: complete/jail
    let isScanning = false;
    let scanProgress = 0;
    let scanInterval = null;

    // Synth sounds for scanner/police
    function playScanSound(progress) {
        try {
            initGlobalAudioContext();
            if (!globalAudioCtx) return;
            const now = globalAudioCtx.currentTime;
            const osc = globalAudioCtx.createOscillator();
            const gain = globalAudioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400 + progress * 6, now);
            gain.gain.setValueAtTime(0.02, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.connect(gain);
            gain.connect(globalAudioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.08);
        } catch (e) {}
    }

    function playSirenSound() {
        try {
            initGlobalAudioContext();
            if (!globalAudioCtx) return;
            const now = globalAudioCtx.currentTime;
            for (let i = 0; i < 6; i++) {
                const time = now + i * 0.3;
                const osc = globalAudioCtx.createOscillator();
                const gain = globalAudioCtx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(i % 2 === 0 ? 650 : 800, time);
                gain.gain.setValueAtTime(0, time);
                gain.gain.linearRampToValueAtTime(0.04, time + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);
                osc.connect(gain);
                gain.connect(globalAudioCtx.destination);
                osc.start(time);
                osc.stop(time + 0.28);
            }
        } catch (e) {}
    }

    function playClangSound() {
        try {
            initGlobalAudioContext();
            if (!globalAudioCtx) return;
            const now = globalAudioCtx.currentTime;
            const osc1 = globalAudioCtx.createOscillator();
            const osc2 = globalAudioCtx.createOscillator();
            const gain = globalAudioCtx.createGain();
            
            osc1.type = 'square';
            osc1.frequency.setValueAtTime(90, now);
            osc1.frequency.exponentialRampToValueAtTime(30, now + 0.6);
            
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(350, now);
            osc2.frequency.exponentialRampToValueAtTime(150, now + 0.4);
            
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
            
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(globalAudioCtx.destination);
            
            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 0.6);
            osc2.stop(now + 0.6);
        } catch (e) {}
    }

    let bouncerTypewriterTimeout = null;
    let bouncerSpeechText = "";
    let isTyping = false;
    let currentOnDone = null;
    let canTapToAdvance = false;
    let dialogueStep = 0;

    function bouncerTypewrite(text, onDone = null) {
        if (bouncerTypewriterTimeout) {
            clearTimeout(bouncerTypewriterTimeout);
        }
        isTyping = true;
        bouncerSpeechText = text;
        bouncerSpeech.innerHTML = "";
        currentOnDone = onDone;

        const parts = text.split('|');
        const engText = parts[0].trim();
        const thaiText = parts[1] ? parts[1].trim() : "";

        let i = 0;
        const tick = () => {
            if (i < engText.length) {
                bouncerSpeech.innerHTML += engText[i] === '\n' ? '<br>' : engText[i];
                if (engText[i] !== ' ' && engText[i] !== '\n') {
                    cuteSynth.playTick();
                }
                i++;
                bouncerTypewriterTimeout = setTimeout(tick, 30);
            } else {
                isTyping = false;
                if (thaiText) {
                    bouncerSpeech.innerHTML += `<br><span class="thai-bubble-text">${thaiText}</span>`;
                }
                if (onDone) onDone();
            }
        };
        tick();
    }

    bouncerSpeech.addEventListener('click', () => {
        if (isTyping) {
            // Speed up and finish typing immediately
            if (bouncerTypewriterTimeout) {
                clearTimeout(bouncerTypewriterTimeout);
            }
            isTyping = false;
            const parts = bouncerSpeechText.split('|');
            const engText = parts[0].trim();
            const thaiText = parts[1] ? parts[1].trim() : "";
            bouncerSpeech.innerHTML = engText;
            if (thaiText) {
                bouncerSpeech.innerHTML += `<br><span class="thai-bubble-text">${thaiText}</span>`;
            }
            if (currentOnDone) {
                const callback = currentOnDone;
                currentOnDone = null;
                callback();
            }
            return;
        }
        
        if (canTapToAdvance) {
            canTapToAdvance = false;
            advanceDialogue();
        }
    });

    function showTapIndicator() {
        const hint = document.createElement('span');
        hint.className = 'bouncer-bubble-tap-hint';
        hint.innerHTML = 'Tap bubble to continue... ➔';
        bouncerSpeech.appendChild(hint);
        canTapToAdvance = true;
    }

    function advanceDialogue() {
        cuteSynth.playPop();
        
        if (dialogueStep === 1) {
            dialogueStep = 2;
            bouncerTypewrite("Hold on... 17? Underage minor! ❌ Access Denied! | เดี๋ยวก่อน... อายุ 17 เองเหรอ? ยังไม่บรรลุนิติภาวะนี่นา! ❌ ปฏิเสธการเข้า!", () => {
                showTapIndicator();
            });
        } else if (dialogueStep === 2) {
            dialogueStep = 3;
            bouncerTypewrite("Wait... your birthday is 27 May? Today is 27 May! That means you turn 18 today! 🎂✨ | เดี๋ยวนะ... วันเกิดเธอคือวันที่ 27 พฤษภาคมเหรอ? วันนี้ก็วันที่ 27 พฤษภาคมนี่! แสดงว่าเธออายุครบ 18 วันนี้น่ะสิ! 🎂✨", () => {
                forgeIdBtn.classList.remove('js-hidden');
            });
        } else if (dialogueStep === 4) {
            dialogueStep = 5;
            bouncerTypewrite("Wait, let me see... 18 Today! Is it really you? 🧐 | ขอดูหน่อยสิ... อายุ 18 วันนี้! ใช่เธอจริงเหรอเนี่ย? 🧐", () => {
                showTapIndicator();
            });
        } else if (dialogueStep === 5) {
            dialogueStep = 6;
            bouncerTypewrite("I must verify your biometric signature. Scan your fingerprint! 🕵️‍♂️ | เค้าต้องตรวจสอบลายนิ้วมือเพื่อยืนยันตัวตนนะ สแกนลายนิ้วมือสิ! 🕵️‍♂️", () => {
                submitFakeIdBtn.classList.remove('js-hidden');
            });
        } else if (dialogueStep === 7) {
            dialogueStep = 8;
            bouncerTypewrite("Wow! The scan is 100% correct! You are officially 18! Happy Birthday! Welcome to Club 18! 🥳🎉 | ว้าว! ผลสแกนถูกต้อง 100% เลย! ตอนนี้เธออายุ 18 อย่างเป็นทางการแล้วนะ! สุขสันต์วันเกิด! ยินดีต้อนรับสู่คลับ 18 จ้า! 🥳🎉", () => {
                showTapIndicator();
            });
        } else if (dialogueStep === 8) {
            dialogueStep = 9;
            bouncerTypewrite("But wait! You think you can just walk in? You belong in jail... 👮‍♂️ | แต่เดี๋ยวก่อน! คิดว่าจะเดินเข้าไปง่ายๆ เหรอ? เธอต้องติดคุกต่างหากล่ะ... 👮‍♂️", () => {
                showTapIndicator();
            });
        } else if (dialogueStep === 9) {
            dialogueStep = 10;
            bouncerTypewrite("Jailed... for stealing my heart! 👮‍♂️😝❤️ | โดนจำคุก... ข้อหาขโมยหัวใจของเค้าไป! 👮‍♂️😝❤️", () => {
                triggerJailOfLove();
            });
        }
    }

    function playVerifyChime() {
        try {
            initGlobalAudioContext();
            if (!globalAudioCtx) return;
            const now = globalAudioCtx.currentTime;
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major Pentatonic chord
            notes.forEach((freq, idx) => {
                const time = now + idx * 0.08;
                const osc = globalAudioCtx.createOscillator();
                const gain = globalAudioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, time);
                gain.gain.setValueAtTime(0, time);
                gain.gain.linearRampToValueAtTime(0.08, time + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
                osc.connect(gain);
                gain.connect(globalAudioCtx.destination);
                osc.start(time);
                osc.stop(time + 0.4);
            });
        } catch (e) {}
    }

    showIdBtn.addEventListener('click', () => {
        if (club18State !== 0) return;
        cuteSynth.playPop();

        showIdBtn.classList.add('js-hidden');
        zombieIdCard.style.transform = 'rotate(-5deg) scale(0.95)';
        
        club18State = 1;
        dialogueStep = 1;
        advanceDialogue();
    });

    forgeIdBtn.addEventListener('click', () => {
        if (club18State !== 1) return;
        cuteSynth.playMoney();

        zombieIdCard.classList.add('forged-id');
        idAgeVal.classList.add('forged-active');
        fakeStamp.classList.remove('js-hidden');
        idPhoto.src = 'assets/club18_adult.png';
        zombieIdCard.style.transform = 'rotate(2deg) scale(1.02)';

        forgeIdBtn.classList.add('js-hidden');
        
        club18State = 2;
        dialogueStep = 4;
        advanceDialogue();
    });

    submitFakeIdBtn.addEventListener('click', () => {
        if (club18State !== 2) return;
        cuteSynth.playPop();

        submitFakeIdBtn.classList.add('js-hidden');
        zombieIdCard.style.transform = 'scale(0.8) translateY(-20px)';
        zombieIdCard.style.opacity = '0.5';

        club18State = 3;
        bouncerTypewrite("Place your finger on the scanner and hold it! ☝️ | วางนิ้วของเธอลงบนเครื่องสแกนแล้วกดค้างไว้เลย! ☝️", () => {
            setTimeout(() => {
                scannerPanel.classList.remove('js-hidden');
            }, 300);
        });
    });

    const startScan = (e) => {
        if (club18State !== 3 || isScanning) return;
        e.preventDefault();
        isScanning = true;
        
        scannerLaser.style.display = 'block';
        scannerStatus.textContent = "SCANNING...";
        scannerStatus.classList.add('scanning');
        fingerprintBtn.classList.add('btn-active');

        scanInterval = setInterval(() => {
            scanProgress += 2.5;
            if (scanProgress >= 100) {
                scanProgress = 100;
                scannerProgressFill.style.width = '100%';
                stopScan(true);
            } else {
                scannerProgressFill.style.width = scanProgress + '%';
                if (Math.floor(scanProgress) % 10 === 0) {
                    playScanSound(scanProgress);
                }
            }
        }, 100);
    };

    const stopScan = (completed = false) => {
        if (!isScanning) return;
        isScanning = false;
        clearInterval(scanInterval);
        fingerprintBtn.classList.remove('btn-active');

        if (completed) {
            scannerLaser.style.display = 'none';
            scannerStatus.classList.remove('scanning');
            scannerStatus.classList.add('verified');
            scannerStatus.textContent = "VERIFIED: 18 YEARS OLD! ✅";
            
            playVerifyChime();
            
            setTimeout(() => {
                dialogueStep = 7;
                advanceDialogue();
            }, 2500);
        } else {
            scannerLaser.style.display = 'none';
            scannerStatus.classList.remove('scanning');
            scannerStatus.textContent = "HOLD TO VERIFY";
            scanProgress = 0;
            scannerProgressFill.style.width = '0%';
        }
    };

    fingerprintBtn.addEventListener('mousedown', startScan);
    fingerprintBtn.addEventListener('touchstart', startScan, {passive: false});
    window.addEventListener('mouseup', () => stopScan(false));
    window.addEventListener('touchend', () => stopScan(false));

    function triggerJailOfLove() {
        club18State = 4;
        
        playClangSound();
        cuteSynth.playPop();
        
        jailBarsOverlay.className = 'jail-bars-slammed';
        
        // Spawn party confetti
        spawnVIPConfetti();

        setTimeout(() => {
            scrollIndMoney.classList.remove('scroll-ind-hidden');
            scrollIndMoney.classList.add('scroll-ind-visible');
        }, 4500);
    }

    function spawnVIPConfetti() {
        const rect = jailBarsOverlay.getBoundingClientRect();
        const bodyRect = document.body.getBoundingClientRect();
        const cx = rect.left - bodyRect.left + rect.width / 2;
        const cy = rect.top - bodyRect.top + rect.height / 2;
        const colors = ['#ffd1dc', '#ff477e', '#ffb3c1', '#ffd166', '#06d6a0', '#a18cd1', '#fbc2eb'];
        
        for (let i = 0; i < 40; i++) {
            const dot = document.createElement('div');
            dot.classList.add('sparkle-particle');
            const size = Math.random() * 8 + 4;
            dot.style.width = dot.style.height = size + 'px';
            dot.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Coordinates relative to body
            dot.style.left = cx + 'px';
            dot.style.top = cy + 'px';
            
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 160 + 40;
            dot.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
            dot.style.setProperty('--ty', `${Math.sin(angle) * dist - 80}px`);
            
            document.body.appendChild(dot);
            setTimeout(() => dot.remove(), 1500);
        }
    }

    /* -----------------------------------------------------------
       CHOCOLATE / MONEY SENDING INTERACTION
       ----------------------------------------------------------- */
    const boyChar = document.getElementById('boy-char');
    const girlChar = document.getElementById('girl-char');
    const moneyContainer = document.getElementById('money-container');
    const moneyMessage = document.getElementById('money-message');
    const scrollIndDish = document.getElementById('scroll-indicator-dish');
    const scrollInd2 = document.getElementById('scroll-indicator-2');
    const scrollIndTease = document.getElementById('scroll-indicator-tease');
    const scrollIndHate = document.getElementById('scroll-indicator-hate');
    const teaseSection = document.getElementById('tease-section');
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
                dishPopupText.innerHTML = "You never told me 😭<br><span class='thai-bubble-text'>เธอไม่เคยบอกเค้าเลยนะ 😭</span>";
                dishPopupBtn.textContent = "Try again";
            } else {
                normalDishClicks++;
                if (normalDishClicks === 1) {
                    dishPopupText.innerHTML = "Its your favorite one so you won't get it today then 😝<br><span class='thai-bubble-text'>นี่ของโปรดเธอใช่ไหมล่ะ งั้นวันนี้อดกินไปละกันนะ 😝</span>";
                    dishPopupBtn.textContent = "Try again";
                } else if (normalDishClicks === 2) {
                    dishPopupText.innerHTML = "Congrats, you wont get this one as well 😜<br><span class='thai-bubble-text'>ยินดีด้วยจ้าา จานนี้ก็อดกินเหมือนกันนะ 😜</span>";
                    dishPopupBtn.textContent = "Pick again";
                } else {
                    dishPopupText.innerHTML = "FIRST BUY ME CHOCOLATE 😝😋<br><span class='thai-bubble-text'>ไปซื้อช็อคโกแลตมาให้เค้าก่อนเลยยย 😝😋</span>";
                    dishPopupBtn.textContent = "Fine...";

                    // Reveal the tease section scroll indicator and display the tease section!
                    setTimeout(() => {
                        if (scrollIndTease) {
                            scrollIndTease.classList.remove('scroll-ind-hidden');
                            scrollIndTease.classList.add('scroll-ind-visible');
                        }
                        
                        if (teaseSection) {
                            teaseSection.style.display = 'flex';
                            setTimeout(() => {
                                teaseSection.classList.remove('tease-section-hidden');
                                teaseSection.classList.add('tease-section-visible');
                            }, 50);
                        }
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
       TEASE SECTION GAME LOGIC
       ----------------------------------------------------------- */
    // Boy elements
    const grumpyProgressFill = document.getElementById('grumpy-progress-fill');
    const boyAgeText = document.getElementById('boy-age-text');
    const bSpeech = document.getElementById('tease-boy-speech');
    const overlayGlasses = document.querySelector('.overlay-glasses');
    const overlayCane = document.querySelector('.overlay-cane');
    const overlayBeard = document.querySelector('.overlay-beard');

    // Girl elements
    const meanProgressFill = document.getElementById('mean-progress-fill');
    const girlMeanText = document.getElementById('girl-mean-text');
    const gSpeech = document.getElementById('tease-girl-speech');
    const overlayHorns = document.querySelector('.overlay-horns');
    const overlayPitchfork = document.querySelector('.overlay-pitchfork');
    const overlayCrown = document.querySelector('.overlay-crown');

    // Action deck buttons
    const teaseBtnShe1 = document.getElementById('tease-btn-she-1');
    const teaseBtnShe2 = document.getElementById('tease-btn-she-2');
    const teaseBtnShe3 = document.getElementById('tease-btn-she-3');
    const teaseBtnHe1 = document.getElementById('tease-btn-he-1');
    const teaseBtnHe2 = document.getElementById('tease-btn-he-2');
    const teaseBtnHe3 = document.getElementById('tease-btn-he-3');
    const truceBtn = document.getElementById('truce-btn');
    const truceMessageCard = document.getElementById('truce-message-card');

    let teaseStep = 0; // 0 to 6 representing conversation state
    let isTeaseTyping = false;
    let teaseTypewriterTimeout = null;

    function playGiggleSound() {
        try {
            initGlobalAudioContext();
            if (!globalAudioCtx) return;
            const ctx = globalAudioCtx;
            const now = ctx.currentTime;
            // Short high-pitched giggling notes
            const notes = [659.25, 783.99, 659.25, 783.99, 987.77];
            notes.forEach((freq, idx) => {
                const time = now + idx * 0.08;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, time);
                gain.gain.setValueAtTime(0.04, time);
                gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(time);
                osc.stop(time + 0.1);
            });
        } catch (e) {}
    }

    function playGrumpySound() {
        try {
            initGlobalAudioContext();
            if (!globalAudioCtx) return;
            const ctx = globalAudioCtx;
            const now = ctx.currentTime;
            // Funny flat/grumpy complaining slides
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(90, now + 0.4);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.4);
        } catch (e) {}
    }

    const isTeaseTest = new URLSearchParams(window.location.search).get('test') === 'true';
    const teaseDelay = isTeaseTest ? 10 : 1000;

    function teaseTypewrite(bubbleEl, text, onDone) {
        if (teaseTypewriterTimeout) {
            clearTimeout(teaseTypewriterTimeout);
        }
        
        const parts = text.split('|');
        const engText = parts[0].trim();
        const thaiText = parts[1] ? parts[1].trim() : "";

        bubbleEl.classList.remove('js-hidden');

        if (isTeaseTest) {
            bubbleEl.innerHTML = engText;
            if (thaiText) {
                bubbleEl.innerHTML += `<br><span class="thai-bubble-text">${thaiText}</span>`;
            }
            bubbleEl.classList.add('tease-bubble-visible');
            isTeaseTyping = false;
            if (onDone) onDone();
            return;
        }

        isTeaseTyping = true;
        bubbleEl.innerHTML = "";
        bubbleEl.classList.add('tease-bubble-visible');
        
        let i = 0;
        const tick = () => {
            if (i < engText.length) {
                bubbleEl.innerHTML += engText[i] === '\n' ? '<br>' : engText[i];
                if (engText[i] !== ' ' && engText[i] !== '\n') {
                    cuteSynth.playTick();
                }
                i++;
                teaseTypewriterTimeout = setTimeout(tick, 30);
            } else {
                isTeaseTyping = false;
                if (thaiText) {
                    bubbleEl.innerHTML += `<br><span class="thai-bubble-text">${thaiText}</span>`;
                }
                if (onDone) onDone();
            }
        };
        tick();
    }

    // Step 1: She Teases #1 "Hey Old Man! 👴👓"
    teaseBtnShe1.addEventListener('click', () => {
        if (teaseStep !== 0 || isTeaseTyping) return;
        teaseBtnShe1.disabled = true;
        playGiggleSound();
        
        // Hide boy bubble
        bSpeech.classList.remove('tease-bubble-visible');
        bSpeech.classList.add('js-hidden');

        // Giggles, overlays glasses, updates Age and meter
        teaseTypewrite(gSpeech, "Hey old man! Did you forget your reading glasses again? 👵👓 | นี่ตาแก่! ลืมแว่นอ่านหนังสืออีกแล้วเหรอจ๊ะ? 👵👓", () => {
            overlayGlasses.classList.remove('js-hidden');
            grumpyProgressFill.style.width = '33%';
            boyAgeText.innerHTML = "40 (Spectacled) <span class='thai-status'>40 (เริ่มใส่แว่น)</span>";
            
            setTimeout(() => {
                teaseBtnShe1.classList.add('js-hidden');
                teaseBtnHe1.classList.remove('js-hidden');
                teaseStep = 1;
            }, teaseDelay);
        });
    });

    // Step 2: He Reacts #1 "You're so mean! 😭"
    teaseBtnHe1.addEventListener('click', () => {
        if (teaseStep !== 1 || isTeaseTyping) return;
        teaseBtnHe1.disabled = true;
        playGrumpySound();
        
        // Hide girl bubble
        gSpeech.classList.remove('tease-bubble-visible');
        gSpeech.classList.add('js-hidden');

        teaseTypewrite(bSpeech, "You're so mean to me! Why do you always say that? 😭 | เธอใจร้ายกับเค้าจัง! ทำไมชอบว่าเค้าแบบนี้ตลอดเลยอ่ะ? 😭", () => {
            overlayHorns.classList.remove('js-hidden');
            meanProgressFill.style.width = '33%';
            girlMeanText.innerHTML = "Mischievous 😈 <span class='thai-status'>ซุกซน 😈</span>";
            
            setTimeout(() => {
                teaseBtnHe1.classList.add('js-hidden');
                teaseBtnShe2.classList.remove('js-hidden');
                teaseStep = 2;
            }, teaseDelay);
        });
    });

    // Step 3: She Teases #2 "Grandpa nap time! ⏰🛏️"
    teaseBtnShe2.addEventListener('click', () => {
        if (teaseStep !== 2 || isTeaseTyping) return;
        teaseBtnShe2.disabled = true;
        playGiggleSound();
        
        bSpeech.classList.remove('tease-bubble-visible');
        bSpeech.classList.add('js-hidden');

        teaseTypewrite(gSpeech, "Grandpa, it's 2 PM! Time for your afternoon nap and warm milk! ⏰🛏️🥛 | คุณปู่ขา บ่ายสองแล้วนะ! ได้เวลานอนกลางวันกับกินนมอุ่นๆ แล้วค่ะ! ⏰🛏️🥛", () => {
            overlayCane.classList.remove('js-hidden');
            grumpyProgressFill.style.width = '66%';
            boyAgeText.innerHTML = "65 (Needs Cane) <span class='thai-status'>65 (ต้องใช้ไม้เท้า)</span>";
            
            setTimeout(() => {
                teaseBtnShe2.classList.add('js-hidden');
                teaseBtnHe2.classList.remove('js-hidden');
                teaseStep = 3;
            }, teaseDelay);
        });
    });

    // Step 4: He Reacts #2 "No chocolates for you! 🍫❌"
    teaseBtnHe2.addEventListener('click', () => {
        if (teaseStep !== 3 || isTeaseTyping) return;
        teaseBtnHe2.disabled = true;
        playGrumpySound();
        
        gSpeech.classList.remove('tease-bubble-visible');
        gSpeech.classList.add('js-hidden');

        teaseTypewrite(bSpeech, "Fine! You're so mean! No chocolates or Thai food for you today! 🍫❌ | ก็ได้! ยัยคนใจร้าย! วันนี้อดกินช็อคโกแลตกับอาหารไทยไปเลยนะ! 🍫❌", () => {
            overlayPitchfork.classList.remove('js-hidden');
            meanProgressFill.style.width = '66%';
            girlMeanText.innerHTML = "Evil Zombie 🧟‍♀️ <span class='thai-status'>ซอมบี้ตัวร้าย 🧟‍♀️</span>";
            
            setTimeout(() => {
                teaseBtnHe2.classList.add('js-hidden');
                teaseBtnShe3.classList.remove('js-hidden');
                teaseStep = 4;
            }, teaseDelay);
        });
    });

    // Step 5: She Teases #3 "Is that a gray hair? 👵"
    teaseBtnShe3.addEventListener('click', () => {
        if (teaseStep !== 4 || isTeaseTyping) return;
        teaseBtnShe3.disabled = true;
        playGiggleSound();
        
        bSpeech.classList.remove('tease-bubble-visible');
        bSpeech.classList.add('js-hidden');

        teaseTypewrite(gSpeech, "Wait, is that a gray hair? Let me pluck it for you, grandpappy! 👵✨ | เอ๊ะ นั่นผมหงอกหรือเปล่าน่ะ? มามะ คุณปู่ เดี๋ยวหนูถอนให้นะ! 👵✨", () => {
            overlayBeard.classList.remove('js-hidden');
            grumpyProgressFill.style.width = '100%';
            boyAgeText.innerHTML = "80 (Full Grandpa!) <span class='thai-status'>80 (คุณปู่เต็มตัว!)</span>";
            
            setTimeout(() => {
                teaseBtnShe3.classList.add('js-hidden');
                teaseBtnHe3.classList.remove('js-hidden');
                teaseStep = 5;
            }, teaseDelay);
        });
    });

    // Step 6: He Reacts #3 "Meanest girl ever! 💔"
    teaseBtnHe3.addEventListener('click', () => {
        if (teaseStep !== 5 || isTeaseTyping) return;
        teaseBtnHe3.disabled = true;
        playGrumpySound();
        
        gSpeech.classList.remove('tease-bubble-visible');
        gSpeech.classList.add('js-hidden');

        teaseTypewrite(bSpeech, "You are officially the meanest girl in the entire universe! 💔🌍 | เธอคือยัยคนใจร้ายที่สุดในจักรวาลอย่างเป็นทางการเลย! 💔🌍", () => {
            overlayCrown.classList.remove('js-hidden');
            meanProgressFill.style.width = '100%';
            girlMeanText.innerHTML = "Unstoppable Devil 👑😈 <span class='thai-status'>ปีศาจที่ไม่มีใครหยุดได้ 👑😈</span>";
            
            setTimeout(() => {
                teaseBtnHe3.classList.add('js-hidden');
                truceBtn.classList.remove('js-hidden');
                teaseStep = 6;
            }, teaseDelay);
        });
    });

    // Step 7: Declare Truce click
    truceBtn.addEventListener('click', () => {
        if (teaseStep !== 6) return;
        truceBtn.disabled = true;
        
        playVerifyChime();
        
        gSpeech.classList.remove('tease-bubble-visible');
        gSpeech.classList.add('js-hidden');
        bSpeech.classList.remove('tease-bubble-visible');
        bSpeech.classList.add('js-hidden');

        const container = teaseSection.querySelector('.tease-game-container');
        if (container) {
            container.classList.add('truce-active');
        }

        document.querySelectorAll('.tease-overlay').forEach(overlay => {
            overlay.style.opacity = '0';
        });

        spawnTruceHearts();

        setTimeout(() => {
            truceMessageCard.classList.remove('truce-card-hidden');
            truceMessageCard.classList.add('truce-card-visible');
            truceMessageCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            setTimeout(() => {
                if (hateSection) {
                    hateSection.style.display = 'flex';
                    setTimeout(() => {
                        hateSection.classList.remove('hate-section-hidden');
                        hateSection.classList.add('hate-section-visible');
                    }, 50);
                }
                const scrollHate = document.getElementById('scroll-indicator-hate');
                if (scrollHate) {
                    scrollHate.classList.remove('scroll-ind-hidden');
                    scrollHate.classList.add('scroll-ind-visible');
                }
            }, isTeaseTest ? 10 : 1500);
        }, isTeaseTest ? 10 : 1200);
    });

    function spawnTruceHearts() {
        const colors = ['#ff477e', '#ff85a7', '#ffb3c1', '#fbc2eb', '#e91e63'];
        const container = teaseSection.querySelector('.tease-game-container');
        const rect = container.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        
        for (let i = 0; i < 30; i++) {
            const heart = document.createElement('div');
            heart.textContent = '❤️';
            heart.style.position = 'fixed';
            heart.style.fontSize = `${Math.random() * 1.0 + 1.0}rem`;
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '999';
            heart.style.left = cx + 'px';
            heart.style.top = cy + 'px';
            
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 180 + 40;
            const tx = Math.cos(angle) * dist;
            const ty = Math.sin(angle) * dist;
            
            heart.style.setProperty('--tx', `${tx}px`);
            heart.style.setProperty('--ty', `${ty}px`);
            
            heart.style.animation = `emojiPortalFly 1.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards`;
            
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 1500);
        }
    }

    /* -----------------------------------------------------------
       I HATE YOU 3000 SECTION INTERACTION (REVAMPED)
       ----------------------------------------------------------- */
    let hateState = 0; // 0 to 9 for dialogue lines, 10 for finale
    const dialogueScript = [
        { text: "can I ask you something | เค้าขอถามอะไรหน่อยได้ไหม", speaker: "girl" },
        { text: "no.! 😡 | ไม่.! 😡", speaker: "boy" },
        { text: "doesn't matter I'll still ask | ไม่รู้ล่ะ ยังไงเค้าก็จะถามอยู่ดี", speaker: "girl" },
        { text: "I knew it... 😂 | คิดไว้แล้วเชียว... 😂", speaker: "boy" },
        { text: "so tell me when is your Birthday? | บอกหน่อยสิว่าวันเกิดเธอวันไหน?", speaker: "girl" },
        { text: "Its on 1 July, 2004 | วันที่ 1 กรกฎาคม 2004 ครับ", speaker: "boy" },
        { text: "will you wish me and give me surprise? | แล้วเธอจะอวยพรวันเกิดและมีเซอร์ไพรส์ให้เค้าไหม?", speaker: "boy" },
        { text: "noooo.! 😝 | ไม่อ่ะะะ.! 😝", speaker: "girl" },
        { text: "I Hate Youuuuuuu | เค้าเกลียดเธอออออออ", speaker: "boy" },
        { text: "I hate Youuu 3000 | เค้าเกลียดเธอ 3000 เลย", speaker: "girl" }
    ];

    const deckContainer = document.getElementById('dialogue-deck-container');
    const deckHint = document.getElementById('deck-hint');
    const activeCard = document.getElementById('active-dialogue-card');
    const cardText = activeCard.querySelector('.card-text');
    const finaleHeart = document.getElementById('finale-heart');

    function loadNextCard() {
        if (hateState >= dialogueScript.length) {
            triggerFinale();
            return;
        }
        
        const line = dialogueScript[hateState];
        const parts = line.text.split('|');
        const engText = parts[0].trim();
        const thaiText = parts[1] ? parts[1].trim() : "";
        cardText.innerHTML = `${engText}${thaiText ? `<br><span class="thai-card-text">${thaiText}</span>` : ""}`;
        
        activeCard.className = 'dialogue-card'; // reset classes
        if (line.speaker === 'girl') {
            activeCard.classList.add('card-theme-girl');
        } else {
            activeCard.classList.add('card-theme-boy');
        }
        
        activeCard.classList.remove('js-hidden');
        deckHint.classList.remove('js-hidden');
        
        // Reset position
        activeCard.style.removeProperty('left');
        activeCard.style.removeProperty('top');
        activeCard.style.transform = 'none';
        cardOffsetX = 0;
        cardOffsetY = 0;
    }
    let isDraggingDialog = false;
    let dragStartX = 0, dragStartY = 0;
    let cardOffsetX = 0, cardOffsetY = 0;

    loadNextCard();

    function startDialogDrag(e) {
        if (hateState >= dialogueScript.length) return;
        
        isDraggingDialog = true;
        deckHint.style.display = 'none';
        
        activeCard.style.transition = 'none';
        activeCard.classList.add('card-dragging');
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        dragStartX = clientX - cardOffsetX;
        dragStartY = clientY - cardOffsetY;
    }

    function moveDialogDrag(e) {
        if (!isDraggingDialog) return;
        e.preventDefault(); // prevent scrolling
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        cardOffsetX = clientX - dragStartX;
        cardOffsetY = clientY - dragStartY;
        
        activeCard.style.transform = `translate(${cardOffsetX}px, ${cardOffsetY}px) scale(1.05) rotate(2deg)`;
    }

    function endDialogDrag(e) {
        if (!isDraggingDialog) return;
        isDraggingDialog = false;
        activeCard.classList.remove('card-dragging');
        activeCard.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s';
        
        const cardRect = activeCard.getBoundingClientRect();
        const boyRect = hateBoyChar.getBoundingClientRect();
        const girlRect = hateGirlChar.getBoundingClientRect();
        
        const currentLine = dialogueScript[hateState];
        
        let droppedOnBoy = checkOverlap(cardRect, boyRect);
        let droppedOnGirl = checkOverlap(cardRect, girlRect);
        
        if (currentLine.speaker === 'boy' && droppedOnBoy) {
            handleSuccessfulDrop('boy');
        } else if (currentLine.speaker === 'girl' && droppedOnGirl) {
            handleSuccessfulDrop('girl');
        } else {
            handleWrongDrop();
        }
    }

    function checkOverlap(rect1, rect2) {
        const expand = 30; // generous hitbox
        return !(rect1.right < rect2.left - expand || 
                 rect1.left > rect2.right + expand || 
                 rect1.bottom < rect2.top - expand || 
                 rect1.top > rect2.bottom + expand);
    }

    function handleWrongDrop() {
        cuteSynth.playPop(); 
        activeCard.classList.add('card-wrong-shake');
        
        cardOffsetX = 0;
        cardOffsetY = 0;
        activeCard.style.transform = 'none';
        
        setTimeout(() => {
            activeCard.classList.remove('card-wrong-shake');
        }, 400);
    }

    function handleSuccessfulDrop(speaker) {
        cuteSynth.playMoney(); 
        
        activeCard.classList.add('js-hidden');
        
        const line = dialogueScript[hateState];
        const parts = line.text.split('|');
        const engText = parts[0].trim();
        const thaiText = parts[1] ? parts[1].trim() : "";
        const formattedMsg = `${engText}${thaiText ? `<br><span class="thai-bubble-text">${thaiText}</span>` : ""}`;

        if (speaker === 'boy') {
            hateBoyMsg.innerHTML = formattedMsg;
            hateBoyMsg.classList.add('hate-msg-visible');
            hateGirlMsg.classList.remove('hate-msg-visible');
            
            hateBoyChar.style.transform = 'scale(1.1)';
            setTimeout(() => hateBoyChar.style.transform = 'scale(1)', 200);
            createConfettiBurst(hateBoyChar);
        } else {
            hateGirlMsg.innerHTML = formattedMsg;
            hateGirlMsg.classList.add('hate-msg-visible');
            hateBoyMsg.classList.remove('hate-msg-visible');
            
            hateGirlChar.style.transform = 'scale(1.1)';
            setTimeout(() => hateGirlChar.style.transform = 'scale(1)', 200);
            createConfettiBurst(hateGirlChar);
        }
        
        hateState++;
        
        setTimeout(() => {
            if (speaker === 'boy') hateBoyMsg.classList.remove('hate-msg-visible');
            if (speaker === 'girl') hateGirlMsg.classList.remove('hate-msg-visible');
            loadNextCard();
        }, 2000);
    }

    activeCard.addEventListener('mousedown', startDialogDrag);
    activeCard.addEventListener('touchstart', startDialogDrag, {passive: false});
    document.addEventListener('mousemove', moveDialogDrag);
    document.addEventListener('touchmove', moveDialogDrag, {passive: false});
    document.addEventListener('mouseup', endDialogDrag);
    document.addEventListener('touchend', endDialogDrag);

    function createConfettiBurst(targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'confetti-particle';
            
            const colors = ['#ff477e', '#ff9a9e', '#fecfef', '#a18cd1', '#fbc2eb'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 100;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            particle.style.animation = `particlePop 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards`;
            
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 800);
        }
    }

    function triggerFinale() {
        deckContainer.classList.add('js-hidden');
        cuteSynth.playPop();
        
        finaleHeart.classList.remove('js-hidden');
        finaleHeart.classList.add('finale-heart-anim');
        
        setTimeout(() => {
            scrollInd2.classList.remove('scroll-ind-hidden');
            scrollInd2.classList.add('scroll-ind-visible');
            scrollInd2.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 1500);
    }


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
        const bodyRect = document.body.getBoundingClientRect();
        // Coordinates relative to body
        const cx = rect.left - bodyRect.left + rect.width / 2;
        const cy = rect.top - bodyRect.top + rect.height / 2;
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
            
            dot.style.left = cx + 'px';
            dot.style.top = cy + 'px';

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
        club18State = 4;
        moneyTriggered = true;
        hateState = 4;

        // Restore candle stage state
        if (candleContent) candleContent.classList.add('js-hidden');
        if (wishContent) {
            wishContent.classList.remove('js-hidden');
            wishContent.style.opacity = '1';
        }

        // Restore Polaroid Portal Reveal states
        portal1Opened = true;
        portal2Opened = true;
        const p1 = document.getElementById('portal-1');
        const p2 = document.getElementById('portal-2');
        if (p1) p1.classList.add('portal-dissolve');
        if (p2) p2.classList.add('portal-dissolve');
        const img1 = p1 ? p1.previousElementSibling : null;
        const img2 = p2 ? p2.previousElementSibling : null;
        if (img1) img1.classList.add('displace-active-1');
        if (img2) img2.classList.add('displace-active-2');
        const gMsg = document.getElementById('gallery-message');
        if (gMsg) {
            gMsg.classList.remove('gallery-msg-hidden');
            gMsg.classList.add('gallery-msg-visible');
            setTimeout(() => {
                startCryingTears();
            }, 500);
        }

        // Restore Club 18 stage state (VIP Love Jail active)
        const bouncerSpeech = document.getElementById('bouncer-speech');
        const showIdBtn = document.getElementById('show-id-btn');
        const idAgeVal = document.getElementById('id-age-val');
        const idPhoto = document.getElementById('id-photo');
        const fakeStamp = document.getElementById('fake-stamp');
        const jailBarsOverlay = document.getElementById('jail-bars-overlay');
        const biometricScannerPanel = document.getElementById('biometric-scanner-panel');
        
        if (bouncerSpeech) bouncerSpeech.innerHTML = "Jailed... for stealing my heart! 👮‍♂️😝❤️<br><span class='thai-bubble-text'>โดนจำคุก... ข้อหาขโมยหัวใจของเค้าไป! 👮‍♂️😝❤️</span>";
        if (idAgeVal) {
            idAgeVal.textContent = "17";
            idAgeVal.classList.add('forged-active');
        }
        if (fakeStamp) fakeStamp.classList.remove('js-hidden');
        if (idPhoto) idPhoto.src = 'assets/club18_adult.png';
        if (jailBarsOverlay) {
            jailBarsOverlay.className = 'jail-bars-slammed';
        }
        if (biometricScannerPanel) {
            biometricScannerPanel.classList.add('js-hidden');
        }
        if (showIdBtn) showIdBtn.style.display = 'none';
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

        // Restore Tease stage state
        teaseStep = 6;
        if (teaseSection) {
            teaseSection.style.display = 'flex';
            teaseSection.classList.remove('tease-section-hidden');
            teaseSection.classList.add('tease-section-visible');
            const teaseContainer = teaseSection.querySelector('.tease-game-container');
            if (teaseContainer) {
                teaseContainer.classList.add('truce-active');
            }
        }
        if (grumpyProgressFill) grumpyProgressFill.style.width = '100%';
        if (meanProgressFill) meanProgressFill.style.width = '100%';
        if (boyAgeText) boyAgeText.innerHTML = "80 (Full Grandpa!) <span class='thai-status'>80 (คุณปู่เต็มตัว!)</span>";
        if (girlMeanText) girlMeanText.innerHTML = "Unstoppable Devil 👑😈 <span class='thai-status'>ปีศาจที่ไม่มีใครหยุดได้ 👑😈</span>";
        if (truceMessageCard) {
            truceMessageCard.classList.remove('truce-card-hidden');
            truceMessageCard.classList.add('truce-card-visible');
        }
        
        // Hide all buttons in action deck
        if (teaseBtnShe1) teaseBtnShe1.classList.add('js-hidden');
        if (teaseBtnShe2) teaseBtnShe2.classList.add('js-hidden');
        if (teaseBtnShe3) teaseBtnShe3.classList.add('js-hidden');
        if (teaseBtnHe1) teaseBtnHe1.classList.add('js-hidden');
        if (teaseBtnHe2) teaseBtnHe2.classList.add('js-hidden');
        if (teaseBtnHe3) teaseBtnHe3.classList.add('js-hidden');
        if (truceBtn) truceBtn.classList.add('js-hidden');
        
        // Hide overlays like in normal truce
        document.querySelectorAll('.tease-overlay').forEach(overlay => {
            overlay.style.opacity = '0';
        });
        
        // Hide speech bubbles
        if (gSpeech) {
            gSpeech.classList.remove('tease-bubble-visible');
            gSpeech.classList.add('js-hidden');
        }
        if (bSpeech) {
            bSpeech.classList.remove('tease-bubble-visible');
            bSpeech.classList.add('js-hidden');
        }

        if (scrollIndTease) {
            scrollIndTease.classList.remove('scroll-ind-hidden');
            scrollIndTease.classList.add('scroll-ind-visible');
        }
        if (scrollIndHate) {
            scrollIndHate.classList.remove('scroll-ind-hidden');
            scrollIndHate.classList.add('scroll-ind-visible');
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
            hateGirlMsg.innerHTML = "are you dead?<br><span class='thai-bubble-text'>ตายหรือยังเนี่ย?</span>";
            hateGirlMsg.classList.add('hate-msg-visible');
        }
        if (hateBoyMsg) {
            hateBoyMsg.innerHTML = "I Hate You 3000 💔<br><span class='thai-bubble-text'>เค้าเกลียดเธอ 3000 เลย 💔</span>";
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
