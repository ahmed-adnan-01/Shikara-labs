import { useEffect, useRef, useState, useCallback } from "react";
import {
  Zap, FlaskConical, BookOpen, BarChart2, RotateCcw, Volume2, VolumeX,
  Settings, Gamepad2, History, Sun, Moon, Trophy,
  Music, Download, Timer, Target, Sparkles, Info, Lightbulb,
  Waves
} from "lucide-react";

// Types
interface Magnet {
  x: number;
  y: number;
  w: number;
  h: number;
  drag: boolean;
  type: "bar" | "horseshoe" | "ring";
}

interface Coil {
  x: number;
  y: number;
  radius: number;
  turns: number;
  material: string;
}

interface BulbPosition {
  x: number;
  y: number;
  r: number;
}

interface HistoryPoint {
  time: number;
  current: number;
  fluxRate: number;
  distance: number;
}

interface Achievement {
  id: string;
  name: string;
  desc: string;
  icon: string;
  unlocked: boolean;
}

export default function FaradaySimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [activeTab, setActiveTab] = useState("lab");
  const [bulbOn, setBulbOn] = useState(false);
  const [distance, setDistance] = useState("--");
  const [current, setCurrent] = useState("0.00");
  const [fluxRate, setFluxRate] = useState("0.00");
  const [brightness, setBrightness] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [coilTurns, setCoilTurns] = useState(5);
  const [magnetStrength, setMagnetStrength] = useState(1.0);
  const [magnetType, setMagnetType] = useState<"bar" | "horseshoe" | "ring">("bar");
  const [coilMaterial, setCoilMaterial] = useState("copper");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [particlesEnabled, setParticlesEnabled] = useState(true);
  const [fieldLinesEnabled, setFieldLinesEnabled] = useState(true);
//   const [gameMode, setGameMode] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameTime, setGameTime] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [gameHighScore, setGameHighScore] = useState(() => {
    const saved = localStorage.getItem("faraday-highscore");
    return saved ? parseInt(saved) : 0;
  });
  const [darkMode, setDarkMode] = useState(true);
  const [slowMotion, setSlowMotion] = useState(false);
  const [presetDemo, setPresetDemo] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<HistoryPoint[]>([]);
  const [oscilloscopeData, setOscilloscopeData] = useState<number[]>(new Array(100).fill(0));
  const [magnetInsideCoil, setMagnetInsideCoil] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: "first_light", name: "First Light", desc: "Light the bulb for the first time", icon: "💡", unlocked: false },
    { id: "max_bright", name: "Blinding Speed", desc: "Reach maximum brightness", icon: "☀️", unlocked: false },
    { id: "inside_coil", name: "Through the Loop", desc: "Pass the magnet through the coil", icon: "🔄", unlocked: false },
    { id: "game_master", name: "Induction Master", desc: "Score over 500 in game mode", icon: "🏆", unlocked: false },
    { id: "experimenter", name: "Mad Scientist", desc: "Try all magnet types", icon: "🧪", unlocked: false },
    { id: "historian", name: "Time Traveler", desc: "View the History tab", icon: "📜", unlocked: false },
    { id: "theorist", name: "Physics Nerd", desc: "Read all theory sections", icon: "📚", unlocked: false },
    { id: "data_analyst", name: "Data Scientist", desc: "Export data to CSV", icon: "📊", unlocked: false },
  ]);

  const coilMaterialData: Record<string, { conductivity: number; color: string; name: string }> = {
    copper: { conductivity: 1.0, color: "#D97706", name: "Copper" },
    aluminum: { conductivity: 0.6, color: "#9CA3AF", name: "Aluminum" },
    gold: { conductivity: 0.7, color: "#FCD34D", name: "Gold" },
    silver: { conductivity: 1.05, color: "#E5E7EB", name: "Silver" },
    iron: { conductivity: 0.17, color: "#78716C", name: "Iron" },
  };

  const unlockAchievement = useCallback((id: string) => {
    setAchievements(prev => prev.map(a => a.id === id && !a.unlocked ? { ...a, unlocked: true } : a));
  }, []);

  // Initialize audio context
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  // Play whoosh sound
  const playWhoosh = useCallback((isEnter: boolean) => {
    if (!soundEnabled) return;
    const ctx = initAudio();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const startFreq = isEnter ? 300 : 800;
    const endFreq = isEnter ? 800 : 300;
    const now = ctx.currentTime;

    osc.type = "sine";
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.15);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.start(now);
    osc.stop(now + 0.25);
  }, [soundEnabled, initAudio]);

  // Play spark sound
  const playSpark = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = initAudio();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.12);
  }, [soundEnabled, initAudio]);

  // Export data to CSV
  const exportData = useCallback(() => {
    if (historyData.length === 0) return;
    unlockAchievement("data_analyst");
    const csv = "Time (s),Current (A),Flux Rate (Wb/s),Distance (cm)\n" +
      historyData.map(d => `${d.time.toFixed(2)},${d.current.toFixed(3)},${d.fluxRate.toFixed(3)},${d.distance.toFixed(1)}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "faraday-simulation-data.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [historyData, unlockAchievement]);

  // Game timer
  useEffect(() => {
    if (!gameActive || gameTime <= 0) return;
    const timer = setInterval(() => {
      setGameTime(t => {
        if (t <= 1) {
          setGameActive(false);
          if (gameScore > gameHighScore) {
            setGameHighScore(gameScore);
            localStorage.setItem("faraday-highscore", gameScore.toString());
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameActive, gameTime, gameScore, gameHighScore]);

  // Start game
  const startGame = useCallback(() => {
    setGameActive(true);
    setGameTime(60);
    setGameScore(0);
  }, []);

  // Run preset demo
  const runPresetDemo = useCallback((demoName: string) => {
    setPresetDemo(demoName);
    setTimeout(() => setPresetDemo(null), demoName === "through" ? 3000 : 5000);
  }, []);

  // Canvas simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    const coil: Coil = { x: W * 0.44, y: H / 2, radius: 72, turns: coilTurns, material: coilMaterial };
    const bulbPos: BulbPosition = { x: W * 0.80, y: H / 2, r: 30 };
    const mag: Magnet = { x: 60, y: H / 2 - 25, w: magnetType === "ring" ? 50 : 66, h: magnetType === "ring" ? 50 : 50, drag: false, type: magnetType };

    // Demo magnet position
    let demoStartTime = 0;
    // let demoMagX = mag.x;/
    // let demoMagY = mag.y;

    // Particles
    const particles: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number }[] = [];

    // Current flow dots
    const flowDots: { pos: number; speed: number }[] = [];
    for (let i = 0; i < 8; i++) {
      flowDots.push({ pos: i / 8, speed: 0.02 + Math.random() * 0.02 });
    }

    let prevFlux = 0;
    let smoothed = 0;
    let bright = 0;
    let raf: number | null = null;
    let wasInside = false;
    let startTime = Date.now();

    const flux = () => {
      const dx = mag.x + mag.w / 2 - coil.x;
      const dy = mag.y + mag.h / 2 - coil.y;
      return (10000 * magnetStrength) / (dx * dx + dy * dy + 1);
    };

    const isInsideCoil = () => {
      const cx = coil.x;
      const cy = coil.y;
      const mx = mag.x + mag.w / 2;
      const my = mag.y + mag.h / 2;
      const dist = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2);
      return dist < coil.radius + 20;
    };

    // Draw functions
    const drawGrid = () => {
      ctx.strokeStyle = darkMode ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.06)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
    };

    const drawWires = () => {
      const cx = coil.x + coil.radius + 6;
      const cy = coil.y;
      const bx = bulbPos.x;
      const by = bulbPos.y;
      const br = bulbPos.r;
      const off = 22;

      const materialColor = coilMaterialData[coilMaterial].color;
      const wireColor = bright > 0.05
        ? `rgba(251,191,36,${0.6 + bright * 0.4})`
        : materialColor;

      ctx.strokeStyle = wireColor;
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Top wire
      ctx.beginPath();
      ctx.moveTo(cx, cy - off);
      ctx.lineTo(cx + 30, cy - off);
      ctx.lineTo(cx + 30, by - br - 14);
      ctx.lineTo(bx, by - br - 14);
      ctx.lineTo(bx, by - br);
      ctx.stroke();

      // Bottom wire
      ctx.beginPath();
      ctx.moveTo(bx, by + br);
      ctx.lineTo(bx, by + br + 14);
      ctx.lineTo(cx + 30, by + br + 14);
      ctx.lineTo(cx + 30, cy + off);
      ctx.lineTo(cx, cy + off);
      ctx.stroke();

      // Current flow animation
      if (bright > 0.08) {
        const time = Date.now() / 1000;
        ctx.fillStyle = `rgba(251,191,36,${bright * 0.9})`;
        flowDots.forEach(dot => {
          const progress = (dot.pos + time * dot.speed * (bright * 5)) % 1;
          let px, py;
          if (progress < 0.25) {
            const p = progress / 0.25;
            px = cx + (30) * p;
            py = cy - off;
          } else if (progress < 0.5) {
            const p = (progress - 0.25) / 0.25;
            px = cx + 30;
            py = cy - off + ((by - br - 14) - (cy - off)) * p;
          } else if (progress < 0.75) {
            const p = (progress - 0.5) / 0.25;
            px = cx + 30 + (bx - (cx + 30)) * p;
            py = by - br - 14;
          } else {
            const p = (progress - 0.75) / 0.25;
            px = bx;
            py = by - br + (2 * br + 28) * p;
          }
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Terminals
      ctx.fillStyle = "#B45309";
      [cy - off, cy + off].forEach(y => {
        ctx.beginPath();
        ctx.arc(cx, y, 5, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawCoil = () => {
      const cx = coil.x, cy = coil.y;
      const matColor = coilMaterialData[coilMaterial].color;

      // Core rod
      ctx.strokeStyle = darkMode ? "#64748B" : "#94A3B8";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx - coil.radius - 10, cy);
      ctx.lineTo(cx + coil.radius + 10, cy);
      ctx.stroke();

      // Windings
      coil.turns = coilTurns;
      for (let i = 0; i < coil.turns; i++) {
        const oy = (i - coil.turns / 2 + 0.5) * 10;

        // Back half
        ctx.strokeStyle = darkMode ? "#78350F" : "#92400E";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(cx, cy + oy, coil.radius, coil.radius * 0.28, 0, Math.PI, Math.PI * 2);
        ctx.stroke();

        // Front half
        ctx.strokeStyle = matColor;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.ellipse(cx, cy + oy, coil.radius, coil.radius * 0.28, 0, 0, Math.PI);
        ctx.stroke();
      }

      // Current arrows
      if (bright > 0.08) {
        const t = Date.now() / 180;
        ctx.fillStyle = `rgba(251,191,36,${bright * 0.9})`;
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2 + t;
          const ax = cx + Math.cos(a) * coil.radius;
          const ay = cy + Math.sin(a) * coil.radius * 0.28;
          ctx.save();
          ctx.translate(ax, ay);
          ctx.rotate(a + Math.PI / 2);
          ctx.beginPath();
          ctx.moveTo(0, -7); ctx.lineTo(-5, 2); ctx.lineTo(5, 2);
          ctx.closePath(); ctx.fill();
          ctx.restore();
        }
      }
    };

    const drawBulb = () => {
      const { x, y, r } = bulbPos;

      // Outer glow
      if (bright > 0.05) {
        const g = ctx.createRadialGradient(x, y - 4, 0, x, y, r * 2.2);
        g.addColorStop(0, `rgba(253,224,71,${bright * 0.4})`);
        g.addColorStop(0.5, `rgba(251,191,36,${bright * 0.18})`);
        g.addColorStop(1, "rgba(251,191,36,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Base
      ctx.fillStyle = darkMode ? "#475569" : "#64748B";
      ctx.fillRect(x - 9, y + r - 4, 18, 20);
      ctx.fillStyle = darkMode ? "#334155" : "#475569";
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(x - 9, y + r - 4 + i * 5, 18, 2);
      }

      // Contact nub
      ctx.fillStyle = "#334155";
      ctx.beginPath();
      ctx.arc(x, y + r + 16, 6, 0, Math.PI * 2);
      ctx.fill();

      // Glass bulb
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);

      if (bright > 0.05) {
        ctx.shadowBlur = 24 * bright;
        ctx.shadowColor = `rgba(253,224,71,${bright * 0.8})`;
        const g = ctx.createRadialGradient(x, y - 6, 0, x, y, r);
        g.addColorStop(0, `rgba(255,255,220,${bright * 0.98})`);
        g.addColorStop(0.4, `rgba(253,224,71,${bright * 0.85})`);
        g.addColorStop(1, `rgba(234,179,8,${bright * 0.6})`);
        ctx.fillStyle = g;
      } else {
        const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
        g.addColorStop(0, darkMode ? "rgba(226,232,240,0.35)" : "rgba(226,232,240,0.55)");
        g.addColorStop(0.7, darkMode ? "rgba(203,213,225,0.25)" : "rgba(203,213,225,0.35)");
        g.addColorStop(1, darkMode ? "rgba(148,163,184,0.1)" : "rgba(148,163,184,0.2)");
        ctx.fillStyle = g;
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      // Glass rim
      ctx.strokeStyle = bright > 0.05
        ? `rgba(253,224,71,${0.7 + bright * 0.3})`
        : darkMode ? "rgba(148,163,184,0.3)" : "rgba(148,163,184,0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Filament
      ctx.strokeStyle = bright > 0.05
        ? `rgba(255,255,200,${0.9 + bright * 0.1})`
        : darkMode ? "rgba(100,116,139,0.5)" : "rgba(100,116,139,0.7)";
      ctx.lineWidth = bright > 0.05 ? 2.5 : 1.8;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x - r * 0.12, y + r * 0.35);
      ctx.lineTo(x - r * 0.12, y - r * 0.45);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + r * 0.12, y + r * 0.35);
      ctx.lineTo(x + r * 0.12, y - r * 0.45);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - r * 0.12, y - r * 0.2);
      ctx.bezierCurveTo(x - r * 0.06, y - r * 0.35, x + r * 0.06, y - r * 0.35, x + r * 0.12, y - r * 0.2);
      ctx.stroke();

      // Specular highlight
      if (!bright) {
        const hl = ctx.createRadialGradient(x - r * 0.38, y - r * 0.38, 0, x - r * 0.38, y - r * 0.38, r * 0.4);
        hl.addColorStop(0, "rgba(255,255,255,0.5)");
        hl.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = hl;
        ctx.beginPath();
        ctx.arc(x - r * 0.38, y - r * 0.38, r * 0.28, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawMagnet = () => {
      let x = mag.x, y = mag.y, w = mag.w, h = mag.h;
      const cx = x + w / 2, cy = y + h / 2;

      // Field lines
      if (fieldLinesEnabled) {
        ctx.save();
        ctx.strokeStyle = magnetStrength > 1 ? "rgba(139,92,246,0.3)" : "rgba(99,102,241,0.22)";
        ctx.lineWidth = 1.2;
        for (let i = 0; i < 5; i++) {
          const oy = (i - 2) * 12;
          ctx.beginPath();
          ctx.moveTo(x + w, cy + oy);
          ctx.quadraticCurveTo(cx + w * 1.4 * magnetStrength, cy + oy + 28, x, cy + oy);
          ctx.stroke();
        }
        ctx.restore();
      }

      if (mag.type === "bar") {
        // Bar magnet
        const gN = ctx.createLinearGradient(x, y, x + w / 2, y);
        gN.addColorStop(0, "#DC2626"); gN.addColorStop(1, "#EF4444");
        ctx.fillStyle = gN;
        ctx.beginPath();
        ctx.roundRect(x, y, w / 2, h, [8, 0, 0, 8]);
        ctx.fill();

        const gS = ctx.createLinearGradient(x + w / 2, y, x + w, y);
        gS.addColorStop(0, "#3B82F6"); gS.addColorStop(1, "#1D4ED8");
        ctx.fillStyle = gS;
        ctx.beginPath();
        ctx.roundRect(x + w / 2, y, w / 2, h, [0, 8, 8, 0]);
        ctx.fill();

        // Border
        ctx.strokeStyle = darkMode ? "rgba(30,41,59,0.6)" : "rgba(30,41,59,0.4)";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 8);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y + h);
        ctx.stroke();

        // Labels
        ctx.font = "bold 18px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#fff";
        ctx.fillText("N", x + w / 4, cy);
        ctx.fillText("S", x + 3 * w / 4, cy);

      } else if (mag.type === "horseshoe") {
        // Horseshoe magnet
        ctx.strokeStyle = "#DC2626";
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x + 10, y + 10);
        ctx.lineTo(x + 10, y + h - 10);
        ctx.lineTo(x + w - 10, y + h - 10);
        ctx.lineTo(x + w - 10, y + 10);
        ctx.stroke();

        // Fill
        ctx.strokeStyle = "#3B82F6";
        ctx.lineWidth = 6;
        ctx.stroke();

        // Labels
        ctx.font = "bold 14px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#fff";
        ctx.fillText("N", x + 10, y + 5);
        ctx.fillText("S", x + w - 10, y + 5);

      } else {
        // Ring magnet
        const ringGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, w / 2);
        ringGrad.addColorStop(0, "#DC2626");
        ringGrad.addColorStop(0.5, "#7C3AED");
        ringGrad.addColorStop(1, "#3B82F6");
        ctx.fillStyle = ringGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, w / 2, 0, Math.PI * 2);
        ctx.fill();

        // Inner hole
        ctx.fillStyle = darkMode ? "#1E293B" : "#F8FAFF";
        ctx.beginPath();
        ctx.arc(cx, cy, w / 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Drag hint
      ctx.font = "10px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = darkMode ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.7)";
      ctx.fillText("DRAG", cx, y + h + 12);
    };

    const drawParticles = () => {
      if (!particlesEnabled) return;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = p.life / p.maxLife;
        ctx.fillStyle = `rgba(251,191,36,${alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * alpha, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const spawnParticles = (x: number, y: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 30 + Math.random() * 20,
          maxLife: 50
        });
      }
    };

    // Main loop
    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      drawGrid();

      // Handle preset demos
      if (presetDemo) {
        const t = (Date.now() - demoStartTime) / 1000;
        if (presetDemo === "through") {
          mag.x = 50 + Math.sin(t * 2) * 200;
          mag.y = H / 2 - 25;
        } else if (presetDemo === "fast") {
          mag.x = 50 + Math.sin(t * 5) * 250;
          mag.y = H / 2 - 25;
        } else if (presetDemo === "approach") {
          mag.x = 400 - Math.abs(Math.sin(t * 0.8)) * 350;
          mag.y = H / 2 - 25;
        }
      } else {
        demoStartTime = Date.now();
      }

      const f = flux();
      const df = Math.abs(f - prevFlux);
      smoothed = smoothed * 0.7 + df * 0.3;
      const ind = smoothed * 2 * coilMaterialData[coilMaterial].conductivity;

      const tgt = ind > 0.3 ? Math.min(1, ind / 15) : 0;
      const speed = slowMotion ? 0.05 : (tgt > bright ? 0.15 : 0.105);
      bright += (tgt - bright) * speed;
      prevFlux = f;

      const isOn = bright > 0.05;
      const dx = mag.x + mag.w / 2 - coil.x;
      const dy = mag.y + mag.h / 2 - coil.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const distCm = Math.max(0, (dist - coil.radius) / 10).toFixed(1);

      const inside = isInsideCoil();

      // Sound triggers
      if (inside && !wasInside) {
        playWhoosh(true);
        playSpark();
        if (particlesEnabled) spawnParticles(coil.x, coil.y, 20);
        unlockAchievement("inside_coil");
      } else if (!inside && wasInside) {
        playWhoosh(false);
        if (particlesEnabled) spawnParticles(coil.x, coil.y, 10);
      }
      wasInside = inside;

      // First light achievement
      if (isOn && !bulbOn) {
        unlockAchievement("first_light");
      }

      // Max brightness achievement
      if (bright > 0.95) {
        unlockAchievement("max_bright");
      }

      // Game scoring
      if (gameActive && isOn) {
        setGameScore(s => s + Math.floor(bright * 10));
      }

      setBulbOn(isOn);
      setBrightness(bright);
      setDistance(distCm);
      setCurrent((ind / 4).toFixed(2));
      setFluxRate(smoothed.toFixed(2));
      setMagnetInsideCoil(inside);

      // Update oscilloscope
      setOscilloscopeData(prev => {
        const newData = [...prev.slice(1), ind / 4];
        return newData;
      });

      // Update history (every 500ms)
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed % 0.5 < 0.02) {
        setHistoryData(prev => {
          if (prev.length > 200) prev = prev.slice(-200);
          return [...prev, {
            time: elapsed,
            current: ind / 4,
            fluxRate: smoothed,
            distance: parseFloat(distCm)
          }];
        });
      }

      drawWires();
      drawCoil();
      drawBulb();
      drawMagnet();
      drawParticles();

      raf = requestAnimationFrame(loop);
    };

    // Event handlers
    const onDown = (e: MouseEvent) => {
      initAudio();
      const r = canvas.getBoundingClientRect();
      const mx = (e.clientX - r.left) * (W / r.width);
      const my = (e.clientY - r.top) * (H / r.height);
      if (mx > mag.x && mx < mag.x + mag.w && my > mag.y && my < mag.y + mag.h) {
        mag.drag = true;
        canvas.style.cursor = "grabbing";
      }
    };

    const onMove = (e: MouseEvent) => {
      if (!mag.drag) return;
      const r = canvas.getBoundingClientRect();
      const sx = W / r.width, sy = H / r.height;
      mag.x = Math.max(0, Math.min(W - mag.w, (e.clientX - r.left) * sx - mag.w / 2));
      mag.y = Math.max(0, Math.min(H - mag.h - 20, (e.clientY - r.top) * sy - mag.h / 2));
    };

    const onUp = () => { mag.drag = false; canvas.style.cursor = "grab"; };

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      initAudio();
      const t = e.touches[0];
      const r = canvas.getBoundingClientRect();
      const mx = (t.clientX - r.left) * (W / r.width);
      const my = (t.clientY - r.top) * (H / r.height);
      if (mx > mag.x && mx < mag.x + mag.w && my > mag.y && my < mag.y + mag.h)
        mag.drag = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!mag.drag) return;
      const t = e.touches[0];
      const r = canvas.getBoundingClientRect();
      const sx = W / r.width, sy = H / r.height;
      mag.x = Math.max(0, Math.min(W - mag.w, (t.clientX - r.left) * sx - mag.w / 2));
      mag.y = Math.max(0, Math.min(H - mag.h - 20, (t.clientY - r.top) * sy - mag.h / 2));
    };

    const onTouchEnd = () => { mag.drag = false; };

    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseup", onUp);
    canvas.addEventListener("mouseleave", onUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);

    canvas.style.cursor = "grab";
    loop();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("mouseleave", onUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [
    coilTurns, magnetStrength, magnetType, coilMaterial, soundEnabled, particlesEnabled,
    fieldLinesEnabled, darkMode, slowMotion, presetDemo, gameActive,
    initAudio, playWhoosh, playSpark, unlockAchievement
  ]);

  // Reset function
  const resetSim = () => {
    window.location.reload();
  };

  return (
    <div className={` mt-8 min-h-screen font-sans transition-colors duration-300 ${darkMode ? "bg-slate-900" : "bg-slate-50"}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 px-4 md:px-8 h-16 flex items-center justify-between ${darkMode ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500" : "bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400"} shadow-lg`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? "bg-white/20 border border-white/30" : "bg-white/30 border border-white/40"}`}>
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-mono text-lg font-bold text-white tracking-tight">Faraday's Law Lab</h1>
            <p className="text-xs text-white/70">Interactive Physics Simulator</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg transition-all ${soundEnabled ? "bg-white/20 text-white" : "bg-white/10 text-white/50"} hover:bg-white/30`}
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all"
            title={darkMode ? "Light Mode" : "Dark Mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Achievements */}
          <button
            onClick={() => setShowAchievements(!showAchievements)}
            className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all relative"
            title="Achievements"
          >
            <Trophy size={18} />
            {achievements.filter(a => a.unlocked).length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-xs font-bold rounded-full text-yellow-900 flex items-center justify-center">
                {achievements.filter(a => a.unlocked).length}
              </span>
            )}
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all"
            title="Settings"
          >
            <Settings size={18} />
          </button>

          {/* Reset */}
          <button
            onClick={resetSim}
            className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all"
            title="Reset Simulation"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`px-4 py-3 ${darkMode ? "bg-slate-800 border-b border-slate-700" : "bg-white border-b border-slate-200"} shadow-md`}>
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Coil Turns */}
            <div>
              <label className={`text-xs font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"} uppercase tracking-wide`}>Coil Turns</label>
              <input
                type="range" min="1" max="10" value={coilTurns}
                onChange={e => setCoilTurns(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <span className={`text-sm font-bold ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>{coilTurns} turns</span>
            </div>

            {/* Magnet Strength */}
            <div>
              <label className={`text-xs font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"} uppercase tracking-wide`}>Magnet Strength</label>
              <input
                type="range" min="0.5" max="3" step="0.5" value={magnetStrength}
                onChange={e => setMagnetStrength(parseFloat(e.target.value))}
                className="w-full accent-purple-500"
              />
              <span className={`text-sm font-bold ${darkMode ? "text-purple-400" : "text-purple-600"}`}>{magnetStrength}x</span>
            </div>

            {/* Magnet Type */}
            <div>
              <label className={`text-xs font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"} uppercase tracking-wide`}>Magnet Type</label>
              <div className="flex gap-1 mt-1">
                {(["bar", "horseshoe", "ring"] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => { setMagnetType(type); unlockAchievement("experimenter"); }}
                    className={`flex-1 px-2 py-1 rounded text-xs font-semibold transition-all ${
                      magnetType === type
                        ? "bg-indigo-500 text-white"
                        : darkMode ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Coil Material */}
            <div>
              <label className={`text-xs font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"} uppercase tracking-wide`}>Coil Material</label>
              <select
                value={coilMaterial}
                onChange={e => setCoilMaterial(e.target.value)}
                className={`w-full mt-1 px-2 py-1 rounded text-sm font-semibold ${darkMode ? "bg-slate-700 text-slate-200 border-slate-600" : "bg-slate-100 text-slate-700 border-slate-300"} border`}
              >
                {Object.entries(coilMaterialData).map(([key, val]) => (
                  <option key={key} value={key}>{val.name} ({(val.conductivity * 100).toFixed(0)}%)</option>
                ))}
              </select>
            </div>

            {/* Toggles */}
            <div className="col-span-2 md:col-span-4 flex gap-4 mt-2">
              <label className={`flex items-center gap-2 text-sm ${darkMode ? "text-slate-300" : "text-slate-600"} cursor-pointer`}>
                <input type="checkbox" checked={particlesEnabled} onChange={e => setParticlesEnabled(e.target.checked)} className="accent-indigo-500" />
                <Sparkles size={14} /> Particles
              </label>
              <label className={`flex items-center gap-2 text-sm ${darkMode ? "text-slate-300" : "text-slate-600"} cursor-pointer`}>
                <input type="checkbox" checked={fieldLinesEnabled} onChange={e => setFieldLinesEnabled(e.target.checked)} className="accent-indigo-500" />
                <Waves size={14} /> Field Lines
              </label>
              <label className={`flex items-center gap-2 text-sm ${darkMode ? "text-slate-300" : "text-slate-600"} cursor-pointer`}>
                <input type="checkbox" checked={slowMotion} onChange={e => setSlowMotion(e.target.checked)} className="accent-indigo-500" />
                <Timer size={14} /> Slow Motion
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Achievements Panel */}
      {showAchievements && (
        <div className={`px-4 py-3 ${darkMode ? "bg-slate-800/95 border-b border-slate-700" : "bg-white/95 border-b border-slate-200"}`}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-bold ${darkMode ? "text-slate-200" : "text-slate-700"} flex items-center gap-2`}>
                <Trophy size={16} className="text-yellow-500" />
                Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {achievements.map(ach => (
                <div
                  key={ach.id}
                  className={`p-3 rounded-lg border ${
                    ach.unlocked
                      ? "bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-500/50"
                      : darkMode ? "bg-slate-700/50 border-slate-600 opacity-50" : "bg-slate-100 border-slate-200 opacity-50"
                  }`}
                >
                  <div className="text-2xl mb-1">{ach.icon}</div>
                  <div className={`text-xs font-bold ${ach.unlocked ? "text-yellow-400" : darkMode ? "text-slate-400" : "text-slate-500"}`}>{ach.name}</div>
                  <div className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{ach.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={`flex justify-center p-2 ${darkMode ? "bg-slate-800/50" : "bg-white/50"} backdrop-blur`}>
        <div className={`flex gap-1 p-1 rounded-xl ${darkMode ? "bg-slate-800" : "bg-slate-200"}`}>
          {[
            { id: "lab", icon: <FlaskConical size={16} />, label: "Simulation" },
            { id: "game", icon: <Gamepad2 size={16} />, label: "Game Mode" },
            { id: "theory", icon: <BookOpen size={16} />, label: "Theory" },
            { id: "data", icon: <BarChart2 size={16} />, label: "Readings" },
            { id: "history", icon: <History size={16} />, label: "History" },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => { setActiveTab(t.id); if (t.id === "history") unlockAchievement("historian"); if (t.id === "theory") unlockAchievement("theorist"); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === t.id
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                  : darkMode ? "text-slate-400 hover:text-slate-200 hover:bg-slate-700" : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 md:p-6">

        {/* Simulation Tab */}
        {activeTab === "lab" && (
          <>
            {/* Canvas */}
            <div className={`rounded-2xl overflow-hidden border-2 ${darkMode ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"} shadow-xl mb-4`}>
              <canvas ref={canvasRef} width={900} height={400} className="w-full h-auto" />
            </div>

            {/* Status Badge */}
            {magnetInsideCoil && (
              <div className="flex justify-center mb-4">
                <div className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-full text-sm animate-pulse shadow-lg">
                  🧲 Magnet Inside Coil! ⚡
                </div>
              </div>
            )}

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className={`p-4 rounded-xl border-2 transition-all ${bulbOn ? "bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border-amber-500/50 shadow-lg shadow-amber-500/20" : darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb size={16} className={bulbOn ? "text-amber-500" : darkMode ? "text-slate-500" : "text-slate-400"} />
                  <span className={`text-xs font-bold uppercase tracking-wider ${bulbOn ? "text-amber-600" : darkMode ? "text-slate-500" : "text-slate-400"}`}>Bulb Status</span>
                </div>
                <div className={`text-2xl font-mono font-bold ${bulbOn ? "text-amber-500" : darkMode ? "text-slate-500" : "text-slate-400"}`}>
                  {bulbOn ? "ON" : "OFF"}
                </div>
                <div className="mt-2 h-2 rounded-full overflow-hidden bg-slate-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all"
                    style={{ width: `${brightness * 100}%` }}
                  />
                </div>
              </div>

              <div className={`p-4 rounded-xl border-2 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Target size={16} className="text-indigo-500" />
                  <span className={`text-xs font-bold uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Distance</span>
                </div>
                <div className="text-2xl font-mono font-bold text-indigo-500">{distance}</div>
                <div className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>cm from coil</div>
              </div>

              <div className={`p-4 rounded-xl border-2 ${parseFloat(current) > 0.05 ? "bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/50" : darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={16} className={parseFloat(current) > 0.05 ? "text-indigo-500" : darkMode ? "text-slate-500" : "text-slate-400"} />
                  <span className={`text-xs font-bold uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Induced Current</span>
                </div>
                <div className={`text-2xl font-mono font-bold ${parseFloat(current) > 0.05 ? "text-indigo-500" : darkMode ? "text-slate-500" : "text-slate-400"}`}>{current}</div>
                <div className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Amperes (A)</div>
              </div>

              <div className={`p-4 rounded-xl border-2 ${parseFloat(fluxRate) > 0.05 ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50" : darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Waves size={16} className={parseFloat(fluxRate) > 0.05 ? "text-purple-500" : darkMode ? "text-slate-500" : "text-slate-400"} />
                  <span className={`text-xs font-bold uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Flux Rate</span>
                </div>
                <div className={`text-2xl font-mono font-bold ${parseFloat(fluxRate) > 0.05 ? "text-purple-500" : darkMode ? "text-slate-500" : "text-slate-400"}`}>{fluxRate}</div>
                <div className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Wb/s</div>
              </div>
            </div>

            {/* Preset Demos */}
            <div className={`p-4 rounded-xl border-2 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} mb-4`}>
              <h3 className={`text-sm font-bold ${darkMode ? "text-slate-200" : "text-slate-700"} mb-3 flex items-center gap-2`}>
                <Music size={16} className="text-indigo-500" /> Preset Demos
              </h3>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => runPresetDemo("through")}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-all shadow-md"
                >
                  🧲 Pass Through Coil
                </button>
                <button
                  onClick={() => runPresetDemo("fast")}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-all shadow-md"
                >
                  ⚡ Fast Oscillation
                </button>
                <button
                  onClick={() => runPresetDemo("approach")}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-all shadow-md"
                >
                  🎯 Approach & Retreat
                </button>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-3">
              <div className={`p-4 rounded-xl border-2 ${darkMode ? "bg-indigo-900/30 border-indigo-700" : "bg-indigo-50 border-indigo-200"}`}>
                <h3 className={`text-sm font-bold ${darkMode ? "text-indigo-400" : "text-indigo-700"} mb-2 flex items-center gap-2`}>
                  <Info size={16} /> How to Use
                </h3>
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"} leading-relaxed`}>
                  Drag the <strong>N-S magnet</strong> toward or through the copper coil. The bulb lights up <em>only while the magnet is moving</em> — a stationary magnet produces no current, regardless of its position. Try different settings above!
                </p>
              </div>
              <div className={`p-4 rounded-xl border-2 ${darkMode ? "bg-amber-900/30 border-amber-700" : "bg-amber-50 border-amber-200"}`}>
                <h3 className={`text-sm font-bold ${darkMode ? "text-amber-400" : "text-amber-700"} mb-2 flex items-center gap-2`}>
                  <Zap size={16} /> Faraday's Law
                </h3>
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"} leading-relaxed`}>
                  <strong className="font-mono">ε = −dΦ/dt</strong> — The induced EMF equals the negative rate of change of magnetic flux. Move the magnet faster to generate a stronger current and brighter light.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Game Mode Tab */}
        {activeTab === "game" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-2xl border-2 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <h2 className={`text-xl font-bold ${darkMode ? "text-slate-200" : "text-slate-800"} mb-4 flex items-center gap-2`}>
                <Gamepad2 className="text-purple-500" /> Induction Challenge
              </h2>
              <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"} mb-4`}>
                Keep the bulb lit by moving the magnet! Score points based on brightness. <strong>60 seconds on the clock!</strong>
              </p>

              {gameActive ? (
                <div className="text-center">
                  <div className={`text-6xl font-bold font-mono ${darkMode ? "text-purple-400" : "text-purple-600"} mb-2`}>{gameTime}</div>
                  <div className={`text-lg ${darkMode ? "text-slate-400" : "text-slate-500"}`}>seconds remaining</div>
                  <div className={`text-4xl font-bold font-mono mt-4 ${darkMode ? "text-amber-400" : "text-amber-600"}`}>{gameScore}</div>
                  <div className={`text-sm ${darkMode ? "text-slate-500" : "text-slate-400"}`}>current score</div>
                </div>
              ) : (
                <div className="text-center">
                  {gameTime === 0 && (
                    <div className={`mb-4 p-4 rounded-xl ${darkMode ? "bg-purple-900/30 border border-purple-700" : "bg-purple-50 border border-purple-200"}`}>
                      <div className={`text-sm ${darkMode ? "text-purple-400" : "text-purple-600"} mb-1`}>Game Over!</div>
                      <div className={`text-3xl font-bold ${darkMode ? "text-purple-300" : "text-purple-700"}`}>Score: {gameScore}</div>
                      {gameScore >= gameHighScore && gameScore > 0 && (
                        <div className="text-amber-500 font-bold mt-2">🏆 New High Score!</div>
                      )}
                      {/* {gameScore > 500 && unlockAchievement("game_master")} */}
                    </div>
                  )}
                  <button
                    onClick={startGame}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-purple-500/30"
                  >
                    🎮 Start Game
                  </button>
                  <div className={`mt-4 text-sm ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                    High Score: <span className="font-bold text-amber-500">{gameHighScore}</span>
                  </div>
                </div>
              )}
            </div>

            <div className={`p-6 rounded-2xl border-2 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <h3 className={`text-lg font-bold ${darkMode ? "text-slate-200" : "text-slate-800"} mb-4`}>🎯 Tips & Tricks</h3>
              <ul className={`space-y-3 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500">•</span>
                  Move the magnet <strong>quickly</strong> through the coil for maximum points
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">•</span>
                  Keep the magnet <strong>moving constantly</strong> - stationary magnets give zero points
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-500">•</span>
                  Try <strong>oscillating back and forth</strong> through the coil center
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  Increase coil turns in settings for <strong>higher induction</strong>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500">•</span>
                  Use <strong>silver coil material</strong> for maximum conductivity
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Theory Tab */}
        {activeTab === "theory" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-2xl border-2 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <h2 className={`text-lg font-bold ${darkMode ? "text-slate-200" : "text-slate-800"} mb-4 font-mono uppercase tracking-wider text-indigo-500`}>Faraday's Law of Induction</h2>

              <div className={`p-4 rounded-xl mb-4 text-center ${darkMode ? "bg-slate-700" : "bg-slate-100"}`}>
                <div className="text-2xl font-mono font-bold text-indigo-500 mb-1">ε = −dΦ<sub>B</sub>/dt</div>
                <div className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Induced EMF = negative rate of change of magnetic flux</div>
              </div>

              {[
                { color: "indigo", label: "Electromagnetic Induction", desc: "A changing magnetic flux through a conducting loop induces an electromotive force (EMF), which drives a current if the circuit is closed." },
                { color: "purple", label: "Lenz's Law", desc: "The negative sign in Faraday's law reflects Lenz's Law: the induced current opposes the change in flux that caused it (conservation of energy)." },
                { color: "cyan", label: "Magnetic Flux (Φ)", desc: "Φ = B·A·cos(θ) — Flux depends on field strength B, coil area A, and the angle θ between the field and normal to the coil surface." },
                { color: "emerald", label: "Key Insight", desc: "Current flows ONLY when flux is changing. A stationary magnet, no matter how strong or close, produces zero induced current." },
              ].map((item, i) => (
                <div key={i} className={`p-4 rounded-xl mb-3 ${darkMode ? `bg-${item.color}-900/30 border border-${item.color}-700` : `bg-${item.color}-50 border border-${item.color}-200`}`} style={{ background: darkMode ? `rgba(99,102,241,${0.1 + i * 0.05})` : undefined, borderColor: darkMode ? "rgba(99,102,241,0.3)" : undefined }}>
                  <div className={`text-sm font-bold text-${item.color}-500 mb-1`}>{item.label}</div>
                  <div className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{item.desc}</div>
                </div>
              ))}
            </div>

            <div className={`p-6 rounded-2xl border-2 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <h2 className={`text-lg font-bold ${darkMode ? "text-slate-200" : "text-slate-800"} mb-4 font-mono uppercase tracking-wider text-purple-500`}>Real-World Applications</h2>
              {[
                { color: "red", label: "Electric Generators", desc: "Power stations spin coils inside magnetic fields. Changing flux continuously induces AC current that powers our homes and factories." },
                { color: "amber", label: "Transformers", desc: "Alternating current in the primary coil creates a changing flux, inducing a voltage in the secondary coil to step voltage up or down." },
                { color: "purple", label: "Wireless Charging", desc: "Inductive charging pads use changing magnetic fields to transfer energy wirelessly to smartphone batteries via Faraday's principle." },
                { color: "emerald", label: "Metal Detectors", desc: "A changing magnetic field induces eddy currents in nearby metal objects, which are detected as a change in the detector's own flux." },
                { color: "cyan", label: "MRI Machines", desc: "Rapidly changing magnetic gradients induce signals in protons within the body, allowing detailed imaging without harmful radiation." },
              ].map((item, i) => (
                <div key={i} className={`p-3 rounded-xl mb-2 ${darkMode ? "bg-slate-700/50" : "bg-slate-50"}`}>
                  <div className={`text-sm font-bold ${darkMode ? "text-" + item.color + "-400" : "text-" + item.color + "-600"} mb-1`}>{item.label}</div>
                  <div className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data/Readings Tab */}
        {activeTab === "data" && (
          <div className={`p-6 rounded-2xl border-2 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-bold ${darkMode ? "text-slate-200" : "text-slate-800"}`}>📊 Live Data & Oscilloscope</h2>
              <button
                onClick={exportData}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-all"
              >
                <Download size={16} /> Export CSV
              </button>
            </div>

            {/* Oscilloscope */}
            <div className={`p-4 rounded-xl mb-6 ${darkMode ? "bg-slate-900" : "bg-slate-100"}`}>
              <h3 className={`text-sm font-bold ${darkMode ? "text-slate-300" : "text-slate-600"} mb-3`}>📈 Oscilloscope View</h3>
              <div className="h-32 flex items-end gap-px">
                {oscilloscopeData.map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t transition-all"
                    style={{ height: `${Math.min(100, val * 25)}%`, minHeight: "2px" }}
                  />
                ))}
              </div>
            </div>

            {/* Gauge Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <GaugeBar value={parseFloat(current)} max={4} color="indigo" unit="A" label={`${current} A`} title="Induced Current" darkMode={darkMode} />
              <GaugeBar value={parseFloat(fluxRate)} max={8} color="purple" unit="Wb/s" label={`${fluxRate} Wb/s`} title="Flux Rate" darkMode={darkMode} />
              <GaugeBar value={brightness} max={1} color="amber" unit="%" label={`${(brightness * 100).toFixed(0)}%`} title="Brightness" darkMode={darkMode} />
              <GaugeBar value={Math.min(20, parseFloat(distance) || 0)} max={20} color="cyan" unit="cm" label={`${distance} cm`} title="Distance" darkMode={darkMode} reverse />
            </div>

            {/* Observation */}
            <div className={`mt-6 p-4 rounded-xl ${darkMode ? "bg-indigo-900/30 border border-indigo-700" : "bg-indigo-50 border border-indigo-200"}`}>
              <div className={`text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2`}>Observation</div>
              <div className={`text-sm ${darkMode ? "text-indigo-300" : "text-indigo-700"}`}>
                {bulbOn
                  ? `Magnet is moving — induced current: ${current} A, flux change: ${fluxRate} Wb/s. The bulb is lit at ${(brightness * 100).toFixed(0)}% brightness.`
                  : "Magnet is stationary or too far. No flux change detected — induced current is zero and the bulb is off. Move the magnet to generate current."}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className={`p-6 rounded-2xl border-2 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
            <h2 className={`text-lg font-bold ${darkMode ? "text-slate-200" : "text-slate-800"} mb-6`}>📜 Historical Context: Michael Faraday</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className={`p-4 rounded-xl mb-4 ${darkMode ? "bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-700" : "bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200"}`}>
                  <h3 className={`text-lg font-bold ${darkMode ? "text-amber-400" : "text-amber-700"} mb-2`}>🧑‍🔧 The Experiment (1831)</h3>
                  <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"} leading-relaxed`}>
                    Michael Faraday discovered electromagnetic induction by wrapping two coils around an iron ring. When he connected one coil to a battery, he observed a transient current in the second coil — but only when connecting or disconnecting the power. This revealed that <strong>changing</strong> magnetic fields create electric currents.
                  </p>
                </div>

                <div className={`p-4 rounded-xl ${darkMode ? "bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-700" : "bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200"}`}>
                  <h3 className={`text-lg font-bold ${darkMode ? "text-purple-400" : "text-purple-700"} mb-2`}>💡 The Insight</h3>
                  <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"} leading-relaxed`}>
                    Faraday realized that electricity and magnetism are two sides of the same coin. His "lines of force" concept laid the groundwork for Maxwell's equations and all modern electromagnetic theory. <strong>Without Faraday's discovery, there would be no electricity as we know it.</strong>
                  </p>
                </div>
              </div>

              <div>
                <div className={`p-4 rounded-xl mb-4 ${darkMode ? "bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-700" : "bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200"}`}>
                  <h3 className={`text-lg font-bold ${darkMode ? "text-cyan-400" : "text-cyan-700"} mb-2`}>⚙️ The Technology Born</h3>
                  <ul className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"} space-y-2`}>
                    <li>🔌 <strong>1831</strong> - First electric generator (Faraday's disk)</li>
                    <li>🔧 <strong>1832</strong> - First electric motor (Pouillet)</li>
                    <li>🏭 <strong>1870s</strong> - Commercial power generation begins</li>
                    <li>📡 <strong>1887</strong> - Radio waves discovered (Hertz)</li>
                    <li>📺 <strong>1900s</strong> - Television, radar, wireless communication</li>
                  </ul>
                </div>

                <div className={`p-4 rounded-xl ${darkMode ? "bg-gradient-to-br from-emerald-900/30 to-green-900/30 border border-emerald-700" : "bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200"}`}>
                  <h3 className={`text-lg font-bold ${darkMode ? "text-emerald-400" : "text-emerald-700"} mb-2`}>🎯 Fun Facts</h3>
                  <ul className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"} space-y-2`}>
                    <li>📚 Faraday had <strong>no formal education</strong> — he was self-taught!</li>
                    <li>💬 He coined the terms "ion," "electrode," "cathode," "anode"</li>
                    <li>🏆 Einstein had a photo of Faraday on his wall</li>
                    <li>🎟️ The <em>farad</em> (capacitance unit) is named after him</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className={`mt-8 py-6 text-center border-t ${darkMode ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400"}`}>
        <p className="text-sm">Faraday's Law Lab - Interactive Physics Simulation</p>
        <p className="text-xs mt-1">Drag the magnet to generate electricity! ⚡</p>
      </footer>
    </div>
  );
}

// Gauge Bar Component
function GaugeBar({ value, max, color, unit, label, title, reverse = false, darkMode }: {
  value: number; max: number; color: string; unit: string; label: string; title: string; reverse?: boolean; darkMode: boolean;
}) {
  const pct = Math.min(100, (value / max) * 100);
  const colorMap: Record<string, string> = {
    indigo: "from-indigo-400 to-purple-500",
    purple: "from-purple-400 to-pink-500",
    amber: "from-amber-400 to-orange-500",
    cyan: "from-cyan-400 to-blue-500",
  };
  return (
    <div className={`p-4 rounded-xl border-2 ${darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"}`}>
      <div className="flex justify-between items-center mb-2">
        <span className={`text-xs font-bold uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{title}</span>
        <span className={`text-xs font-mono ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{unit}</span>
      </div>
      <div className={`text-2xl font-mono font-bold text-${color}-500 mb-2`}>{label}</div>
      <div className={`h-3 rounded-full overflow-hidden ${darkMode ? "bg-slate-600" : "bg-slate-200"}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorMap[color] || colorMap.indigo} transition-all`}
          style={{ width: `${reverse ? 100 - pct : pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>0</span>
        <span className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{max}</span>
      </div>
    </div>
  );
}
