export const GAME_TYPES = {
    quiz: { label: 'Trắc nghiệm', icon: 'fa-circle-question', color: 'text-indigo-500', bg: 'bg-indigo-100', border: 'border-indigo-500' },
    memory: { label: 'Ghép thẻ', icon: 'fa-table-cells', color: 'text-emerald-500', bg: 'bg-emerald-100', border: 'border-emerald-500' },
    sentence: { label: 'Điền từ', icon: 'fa-pen-nib', color: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-500' },
    scramble: { label: 'Sắp xếp từ', icon: 'fa-spell-check', color: 'text-purple-500', bg: 'bg-purple-100', border: 'border-purple-500' },
    flashcard: { label: 'Lật thẻ', icon: 'fa-layer-group', color: 'text-orange-500', bg: 'bg-orange-100', border: 'border-orange-500' }
};

export const getGameMeta = (type) => {
    return GAME_TYPES[type] || { label: type, icon: 'fa-gamepad', color: 'text-slate-500' };
};

export const playSound = (type) => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        if (type === 'success') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(500, now);
            osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);
        } else if (type === 'error') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(100, now + 0.2);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'info') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        }
    } catch (e) { console.error(e); }
};

export const fireConfetti = () => {
    // We need a canvas element in the DOM. 
    // If not exists, create one temporarily or expect App to have it.
    // Ideally, App.jsx should have <canvas id="confetti-canvas" ... />
    // But for a utility, we can append if missing.
    let canvas = document.getElementById('confetti-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'confetti-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: canvas.width / 2, y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10 - 5,
            c: `hsl(${Math.random() * 360}, 100%, 50%)`,
            size: Math.random() * 5 + 2
        });
    }

    let frame = 0;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
            p.x += p.vx; p.y += p.vy; p.vy += 0.2; // gravity
            ctx.fillStyle = p.c;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        });
        frame++;
        if (frame < 100) requestAnimationFrame(animate);
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    animate();
    playSound('success');
};
