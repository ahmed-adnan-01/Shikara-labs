import { useEffect, useMemo, useRef, useState } from "react";
import type { DragEvent } from "react";
import {
  Activity,
  Beaker,
  BookOpen,
  FlaskConical,
  Info,
  Music,
  RefreshCcw,
  Shield,
  Sparkles,
  Timer,
  Trash2,
  Trophy,
  Volume2,
  VolumeX,
  Wand2
} from "lucide-react";

const SOLUTIONS = {
  Lemon: { pH: 2, color: "#ff4d4d", nature: "Acidic", emoji: "🍋" },
  Vinegar: { pH: 3, color: "#ff6666", nature: "Acidic", emoji: "🍶" },
  Milk: { pH: 6, color: "#b3ffb3", nature: "Slightly Acidic", emoji: "🥛" },
  Water: { pH: 7, color: "#66ff66", nature: "Neutral", emoji: "💧" },
  BakingSoda: {
    pH: 9,
    color: "#66b3ff",
    nature: "Basic",
    emoji: "🧂"
  },
  Soap: { pH: 10, color: "#3399ff", nature: "Basic", emoji: "🧼" },
  WashingSoda: {
    pH: 11,
    color: "#1a75ff",
    nature: "Strongly Basic",
    emoji: "🧽"
  }
} as const;

const PAPER_TYPES = [
  { name: "Red Paper", baseColor: "#ffd6d6" },
  { name: "Yellow Paper", baseColor: "#fff6cc" },
  { name: "Blue Paper", baseColor: "#d7ddff" }
] as const;

type SolutionName = keyof typeof SOLUTIONS;

type Observation = {
  name: SolutionName;
  pH: number;
  nature: string;
  paperType: string;
  color: string;
  timestamp: number;
};

const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

export default function PHVirtuallab() {

  const [selectedPaperType, setSelectedPaperType] = useState<string>(
    PAPER_TYPES[0].name
  );
  const [paperColor, setPaperColor] = useState<string>(
    PAPER_TYPES[0].baseColor
  );
  const [result, setResult] = useState<(typeof SOLUTIONS)[SolutionName] & {
    solution: SolutionName;
  } | null>(null);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [draggedSolution, setDraggedSolution] = useState<SolutionName | null>(
    null
  );
  const [isDropZoneActive, setIsDropZoneActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ambientEnabled, setAmbientEnabled] = useState(true);
  const [sessionStart] = useState(() => new Date());
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientNodesRef = useRef<{
    oscillator: OscillatorNode;
    gain: GainNode;
  } | null>(null);

  const selectedPaperBase = useMemo(
    () =>
      PAPER_TYPES.find((paper) => paper.name === selectedPaperType)
        ?.baseColor ?? PAPER_TYPES[0].baseColor,
    [selectedPaperType]
  );

  const stats = useMemo(() => {
    const total = observations.length;
    const acidic = observations.filter((obs) => obs.pH < 7).length;
    const neutral = observations.filter((obs) => obs.pH === 7).length;
    const basic = observations.filter((obs) => obs.pH > 7).length;
    const avgPH = total
      ? observations.reduce((sum, obs) => sum + obs.pH, 0) / total
      : 0;
    const uniqueSolutions = new Set(observations.map((obs) => obs.name)).size;
    const latest = observations[observations.length - 1];

    return {
      total,
      acidic,
      neutral,
      basic,
      avgPH,
      uniqueSolutions,
      latest
    };
  }, [observations]);

  const level = Math.min(5, Math.floor(stats.total / 3) + 1);
  const progressToNext = Math.min(100, ((stats.total % 3) / 3) * 100);

  const achievements = [
    {
      title: "First Dip",
      description: "Record your first observation",
      unlocked: stats.total >= 1
    },
    {
      title: "Acid Hunter",
      description: "Log three acidic samples",
      unlocked: stats.acidic >= 3
    },
    {
      title: "Base Explorer",
      description: "Log three basic samples",
      unlocked: stats.basic >= 3
    },
    {
      title: "Full Spectrum",
      description: "Test five unique solutions",
      unlocked: stats.uniqueSolutions >= 5
    }
  ];

  const blendColors = (color1: string, color2: string) => {
    const toChannel = (hex: string) => parseInt(hex, 16);
    const toHex = (channel: number) =>
      channel.toString(16).padStart(2, "0");

    const r1 = toChannel(color1.slice(1, 3));
    const g1 = toChannel(color1.slice(3, 5));
    const b1 = toChannel(color1.slice(5, 7));

    const r2 = toChannel(color2.slice(1, 3));
    const g2 = toChannel(color2.slice(3, 5));
    const b2 = toChannel(color2.slice(5, 7));

    const r = Math.round((r1 + r2) / 2);
    const g = Math.round((g1 + g2) / 2);
    const b = Math.round((b1 + b2) / 2);

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const ensureAudioContext = () => {
    if (typeof window === "undefined") return null;
    if (!audioContextRef.current) {
      const AudioContextConstructor =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextConstructor) return null;
      audioContextRef.current = new AudioContextConstructor();
    }
    if (audioContextRef.current.state === "suspended") {
      void audioContextRef.current.resume();
    }
    return audioContextRef.current;
  };

  const stopAmbient = () => {
    if (!ambientNodesRef.current) return;
    ambientNodesRef.current.gain.gain.setTargetAtTime(0.0001, 0, 0.05);
    ambientNodesRef.current.oscillator.stop();
    ambientNodesRef.current = null;
  };

  const startAmbient = () => {
    const ctx = ensureAudioContext();
    if (!ctx || ambientNodesRef.current) return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.value = 180;
    gain.gain.value = 0.0001;

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    gain.gain.exponentialRampToValueAtTime(0.04, now + 0.4);
    oscillator.start(now);

    ambientNodesRef.current = { oscillator, gain };
  };

  const playTone = (type: "dip" | "reset" | "clear") => {
    if (!soundEnabled) return;
    const ctx = ensureAudioContext();
    if (!ctx) return;

    const settings = {
      dip: { frequency: 660, duration: 0.18 },
      reset: { frequency: 420, duration: 0.14 },
      clear: { frequency: 320, duration: 0.2 }
    } as const;

    const { frequency, duration } = settings[type];
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gainNode.gain.value = 0.0001;

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;
    gainNode.gain.exponentialRampToValueAtTime(0.15, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration);
  };

  const resetExperiment = () => {
    setPaperColor(selectedPaperBase);
    setResult(null);
    setDraggedSolution(null);
    playTone("reset");
  };

  const clearAllObservations = () => {
    setObservations([]);
    resetExperiment();
    playTone("clear");
  };

  const dipPaper = (solutionName: SolutionName) => {
    const sol = SOLUTIONS[solutionName];
    const blendedColor = blendColors(selectedPaperBase, sol.color);

    setPaperColor(blendedColor);
    setResult({ ...sol, solution: solutionName });

    setObservations((prev) => [
      ...prev,
      {
        name: solutionName,
        pH: sol.pH,
        nature: sol.nature,
        paperType: selectedPaperType,
        color: blendedColor,
        timestamp: Date.now()
      }
    ]);

    setDraggedSolution(null);
    playTone("dip");
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDropZoneActive(false);

    if (draggedSolution) {
      dipPaper(draggedSolution);
    }
  };

  useEffect(() => {
    if (ambientEnabled && soundEnabled) {
      startAmbient();
    } else {
      stopAmbient();
    }

    return () => {
      stopAmbient();
    };
  }, [ambientEnabled, soundEnabled]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative overflow-hidden">
        <div className="absolute -top-20 right-[-6rem] h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute top-24 left-[-5rem] h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-[40%] h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-20 pt-8 sm:px-8">
          <header className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <Beaker className="h-6 w-6 text-blue-300" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Virtual Chemistry Lab
                  </p>
                  <h1 className="text-3xl font-semibold sm:text-4xl">
                    pH Paper Control Room
                  </h1>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300">
                  <Timer className="h-4 w-4" />
                  Session started {sessionStart.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </div>
                <button
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200 transition hover:bg-white/10"
                >
                  {soundEnabled ? (
                    <Volume2 className="h-4 w-4 text-emerald-300" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-red-300" />
                  )}
                  {soundEnabled ? "Sound on" : "Sound off"}
                </button>
                <button
                  onClick={() => setAmbientEnabled((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200 transition hover:bg-white/10"
                >
                  <Music className="h-4 w-4 text-purple-300" />
                  {ambientEnabled ? "Ambient on" : "Ambient off"}
                </button>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 shadow-lg shadow-blue-500/10">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-purple-300" />
                  <span className="text-sm text-slate-200">
                    Interactive experiment workflow
                  </span>
                </div>
                <p className="mt-4 text-lg font-semibold">
                  Drag, dip, and document your observations in real time.
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Explore how different solutions shift pH paper colors and build a
                  visual record of acidity and basicity.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Total tests
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {stats.total}
                </p>
                <p className="text-sm text-slate-300">Observations logged</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Average pH
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {stats.total ? stats.avgPH.toFixed(1) : "--"}
                </p>
                <p className="text-sm text-slate-300">Across all samples</p>
              </div>
            </div>
          </header>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_1.95fr]">
            <section className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-blue-500/10">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Solution Shelf</h2>
                    <p className="text-sm text-slate-300">
                      Drag and drop a solution on the paper strip.
                    </p>
                  </div>
                  <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-200">
                    Drag me
                  </span>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {Object.entries(SOLUTIONS).map(([name, data]) => (
                    <div
                      key={name}
                      draggable
                      onDragStart={() => setDraggedSolution(name as SolutionName)}
                      className={`group relative overflow-hidden rounded-2xl border bg-slate-900/40 p-4 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 ${
                        draggedSolution === name
                          ? "border-blue-400/70"
                          : "border-white/10"
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition group-hover:opacity-100" />
                      <div className="relative flex items-center justify-between">
                        <span className="text-2xl">{data.emoji}</span>
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70">
                          pH {data.pH}
                        </span>
                      </div>
                      <div className="relative">
                        <h3 className="mt-3 text-sm font-semibold text-white">
                          {name}
                        </h3>
                        <p className="text-xs text-slate-300">{data.nature}</p>
                      </div>
                      <div className="relative mt-3 h-2 w-full rounded-full bg-white/10">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            backgroundColor: data.color,
                            width: `${Math.min(100, data.pH * 9)}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-300" />
                  <h3 className="text-base font-semibold">Lab Safety</h3>
                </div>
                <ul className="mt-4 space-y-3 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400"></span>
                    Rinse the paper between tests to avoid contamination.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400"></span>
                    Observe color changes under bright light for accuracy.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400"></span>
                    Neutral samples should leave the strip closest to base.
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-300" />
                  <h3 className="text-base font-semibold">Achievements</h3>
                </div>
                <div className="mt-4 space-y-3">
                  {achievements.map((badge) => (
                    <div
                      key={badge.title}
                      className={`rounded-2xl border px-4 py-3 text-sm transition ${
                        badge.unlocked
                          ? "border-yellow-400/40 bg-yellow-500/10 text-yellow-100"
                          : "border-white/10 bg-white/5 text-slate-400"
                      }`}
                    >
                      <p className="font-semibold">{badge.title}</p>
                      <p className="text-xs">{badge.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Choose pH Paper</h2>
                    <p className="text-sm text-slate-300">
                      Each paper has a different base color.
                    </p>
                  </div>
                  <FlaskConical className="h-5 w-5 text-purple-300" />
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {PAPER_TYPES.map((paper) => (
                    <button
                      key={paper.name}
                      onClick={() => {
                        setSelectedPaperType(paper.name);
                        setPaperColor(paper.baseColor);
                        setResult(null);
                      }}
                      className={`rounded-2xl border px-4 py-5 text-left text-slate-900 transition duration-200 hover:-translate-y-1 hover:shadow-lg ${
                        selectedPaperType === paper.name
                          ? "border-blue-400 shadow-lg shadow-blue-500/20"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: paper.baseColor }}
                    >
                      <p className="text-sm font-semibold text-slate-900">
                        {paper.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-700">
                        Base tone preview
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Wand2 className="h-4 w-4 text-blue-300" />
                  Experiment steps
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {[
                    "Pick a paper",
                    "Drag a solution",
                    "Record the change"
                  ].map((step, index) => (
                    <div
                      key={step}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <p className="text-xs text-slate-400">Step {index + 1}</p>
                      <p className="text-sm font-semibold text-white">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDropZoneActive(true);
                }}
                onDragLeave={() => setIsDropZoneActive(false)}
                onDrop={handleDrop}
                className={`rounded-3xl border-2 border-dashed bg-gradient-to-br from-white/5 via-white/10 to-white/5 p-8 transition duration-200 ${
                  isDropZoneActive
                    ? "border-blue-400 shadow-lg shadow-blue-500/30"
                    : "border-white/20"
                }`}
              >
                <div className="flex flex-col items-center gap-6 text-center">
                  <div className="space-y-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Test Zone
                    </p>
                    <div className="flex items-center justify-center gap-6">
                      <div className="flex flex-col items-center gap-2">
                        <div className="rounded-2xl border border-white/20 bg-white/5 px-4 py-2 text-xs text-slate-300">
                          Before
                        </div>
                        <div
                          className="h-14 w-24 rounded-2xl border-2 border-white/30"
                          style={{ backgroundColor: selectedPaperBase }}
                        />
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="rounded-2xl border border-white/20 bg-white/5 px-4 py-2 text-xs text-slate-300">
                          After
                        </div>
                        <div
                          className="h-16 w-32 rounded-2xl border-4 border-white/40 shadow-inner"
                          style={{ backgroundColor: paperColor }}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-slate-300">
                      Drop any solution here to dip the strip.
                    </p>
                  </div>

                  {result ? (
                    <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-left">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                            Latest Result
                          </p>
                          <h3 className="mt-2 text-2xl font-semibold">
                            {result.solution} {result.emoji}
                          </h3>
                          <p className="text-sm text-slate-300">
                            {result.nature} solution
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
                          <p className="text-xs text-slate-400">Observed pH</p>
                          <p className="text-2xl font-semibold text-blue-200">
                            {result.pH}
                          </p>
                        </div>
                      </div>
                      <div className="mt-5 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <p className="text-xs text-slate-400">Nature</p>
                          <p className="text-sm font-semibold text-white">
                            {result.nature}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <p className="text-xs text-slate-400">Paper type</p>
                          <p className="text-sm font-semibold text-white">
                            {selectedPaperType}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <p className="text-xs text-slate-400">Blended color</p>
                          <p className="text-sm font-semibold text-white">
                            {paperColor.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-5 rounded-2xl border border-blue-400/30 bg-blue-500/10 p-4 text-sm text-slate-200">
                        Conclusion: {result.solution} is
                        <span className="font-semibold">
                          {" "}
                          {result.nature.toLowerCase()}
                        </span>
                        {" "}in nature with a pH of {result.pH}.
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-4xl">🧪</p>
                      <p className="text-base font-semibold">
                        Drag a solution to begin testing.
                      </p>
                      <p className="text-sm text-slate-300">
                        Your latest reading will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={resetExperiment}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Reset Paper
                </button>
                <button
                  onClick={clearAllObservations}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-500/80 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All Observations
                </button>
              </div>
            </section>
          </div>

          <section className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Observation Table</h2>
                  <p className="text-sm text-slate-300">
                    Track every dip and compare results.
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-200">
                  {observations.length} entries
                </span>
              </div>
              <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/10 text-xs uppercase tracking-wider text-slate-300">
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Solution</th>
                      <th className="px-4 py-3">pH</th>
                      <th className="px-4 py-3">Nature</th>
                      <th className="px-4 py-3">Paper</th>
                      <th className="px-4 py-3">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {observations.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-8 text-center text-sm text-slate-400"
                        >
                          No observations yet. Drag a solution to get started.
                        </td>
                      </tr>
                    ) : (
                      observations.map((obs, index) => (
                        <tr
                          key={`${obs.name}-${index}`}
                          className="border-t border-white/5"
                        >
                          <td className="px-4 py-3 text-slate-300">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {SOLUTIONS[obs.name].emoji}
                              </span>
                              <span className="text-slate-200">{obs.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-semibold text-blue-200">
                            {obs.pH}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                obs.pH < 7
                                  ? "bg-red-500/20 text-red-200"
                                  : obs.pH === 7
                                  ? "bg-emerald-500/20 text-emerald-200"
                                  : "bg-blue-500/20 text-blue-200"
                              }`}
                            >
                              {obs.nature}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-300">
                            {obs.paperType}
                          </td>
                          <td className="px-4 py-3 text-slate-400">
                            {formatTime(obs.timestamp)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-300" />
                  <h2 className="text-lg font-semibold">Lab Analytics</h2>
                </div>
                <p className="text-sm text-slate-300">
                  Your progress and sample distribution.
                </p>
                <div className="mt-5 space-y-4">
                  {[
                    { label: "Acidic", value: stats.acidic, color: "bg-red-500" },
                    {
                      label: "Neutral",
                      value: stats.neutral,
                      color: "bg-emerald-500"
                    },
                    { label: "Basic", value: stats.basic, color: "bg-blue-500" }
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span>{item.label}</span>
                        <span>{item.value}</span>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-white/10">
                        <div
                          className={`h-2 rounded-full ${item.color}`}
                          style={{
                            width: stats.total
                              ? `${(item.value / stats.total) * 100}%`
                              : "0%"
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-slate-400">Lab Level {level}</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-500"
                      style={{ width: `${progressToNext}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    {3 - (stats.total % 3 || 3)} samples to next level
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-300" />
                  <h2 className="text-lg font-semibold">Lab Notebook</h2>
                </div>
                <p className="text-sm text-slate-300">
                  Recent notes from the bench.
                </p>
                <div className="mt-4 space-y-3">
                  {observations.length === 0 ? (
                    <p className="text-sm text-slate-400">
                      Dip a solution to start recording notes.
                    </p>
                  ) : (
                    observations
                      .slice(-3)
                      .reverse()
                      .map((obs, index) => (
                        <div
                          key={`${obs.name}-${obs.timestamp}-${index}`}
                          className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white">
                              {obs.name}
                            </span>
                            <span className="text-xs text-slate-400">
                              {formatTime(obs.timestamp)}
                            </span>
                          </div>
                          <p className="mt-2 text-xs text-slate-300">
                            pH {obs.pH} • {obs.nature} on {obs.paperType}
                          </p>
                          <div className="mt-3 flex items-center gap-2">
                            <span
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: obs.color }}
                            />
                            <span className="text-xs text-slate-400">
                              {obs.color.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-lg font-semibold">pH Scale</h2>
                <p className="text-sm text-slate-300">
                  Quick reference for acidity & basicity.
                </p>
                <div className="mt-5 grid grid-cols-5 gap-3">
                  {Array.from({ length: 15 }, (_, index) => index).map((ph) => (
                    <div
                      key={ph}
                      className="flex h-10 w-full items-center justify-center rounded-xl text-xs font-semibold"
                      style={{
                        backgroundColor: `hsl(${(14 - ph) * 12}, 85%, 50%)`
                      }}
                    >
                      {ph}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-300" />
                  <h2 className="text-lg font-semibold">Status Snapshot</h2>
                </div>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <span>Unique solutions</span>
                    <span className="font-semibold text-white">
                      {stats.uniqueSolutions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <span>Latest solution</span>
                    <span className="font-semibold text-white">
                      {stats.latest ? stats.latest.name : "--"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <span>Most recent time</span>
                    <span className="font-semibold text-white">
                      {stats.latest ? formatTime(stats.latest.timestamp) : "--"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
