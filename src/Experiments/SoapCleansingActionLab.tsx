import { useState } from "react";
import { 
  RotateCcw, FlaskConical, BookOpen, BarChart2, Zap, Info, 
  Droplets, CheckCircle2, AlertCircle, Volume2, VolumeX 
} from "lucide-react";
import { cn } from "@/utils/cn";

// Types
type Tab = "lab" | "theory" | "log" | "quiz";
type TubeType = "soft" | "hard";
type ChemicalType = "soap" | "detergent";

interface TubeState {
  hasLiquid: boolean;
  chemicalAdded: ChemicalType | null;
  shaken: boolean;
  resultShown: boolean;
}

interface Observation {
  id: number;
  text: string;
  time: string;
}

// Audio Service using Web Audio API
const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

const playSound = (type: 'click' | 'splash' | 'shake' | 'bubble' | 'success' | 'reset' | 'scum', muted: boolean) => {
  if (muted || !audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  switch (type) {
    case 'click':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;
    case 'splash':
      const bufferSize = audioCtx.sampleRate * 0.2;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = audioCtx.createGain();
      noise.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);
      noiseGain.gain.setValueAtTime(0.08, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      noise.start(now);
      noise.stop(now + 0.2);
      break;
    case 'shake':
      osc.type = 'square';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.1);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;
    case 'bubble':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(1500, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;
    case 'success':
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.connect(g);
        g.connect(audioCtx.destination);
        o.frequency.setValueAtTime(freq, now + i * 0.08);
        g.gain.setValueAtTime(0.06, now + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.2);
        o.start(now + i * 0.08);
        o.stop(now + i * 0.08 + 0.2);
      });
      break;
    case 'reset':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.3);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
    case 'scum':
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(60, now + 0.3);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
  }
};

export default function SoapCleansingActionLab() {
  const [activeTab, setActiveTab] = useState<Tab>("lab");
  const [isMuted, setIsMuted] = useState(false);
  
  const [tubeSoft, setTubeSoft] = useState<TubeState>({ hasLiquid: true, chemicalAdded: null, shaken: false, resultShown: false });
  const [tubeHard, setTubeHard] = useState<TubeState>({ hasLiquid: true, chemicalAdded: null, shaken: false, resultShown: false });
  
  const [draggedItem, setDraggedItem] = useState<ChemicalType | null>(null);
  const [dragOverTube, setDragOverTube] = useState<TubeType | null>(null);
  const [observations, setObservations] = useState<Observation[]>([]);

  const triggerSound = (type: 'click' | 'splash' | 'shake' | 'bubble' | 'success' | 'reset' | 'scum') => playSound(type, isMuted);

  const addObs = (text: string) => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setObservations(p => [{ id: Date.now() + Math.random(), text, time }, ...p]);
  };

  const handleChemicalDrop = (tubeType: TubeType) => {
    if (!draggedItem) return;
    addChemicalToTube(tubeType, draggedItem);
    setDraggedItem(null);
    setDragOverTube(null);
  };

  const addChemicalToTube = (tubeType: TubeType, chem: ChemicalType) => {
    const target = tubeType === 'soft' ? tubeSoft : tubeHard;
    const setTarget = tubeType === 'soft' ? setTubeSoft : setTubeHard;

    if (!target.chemicalAdded) {
      triggerSound('splash');
      setTarget(prev => ({ ...prev, chemicalAdded: chem }));
      addObs(`${chem.charAt(0).toUpperCase() + chem.slice(1)} solution added to ${tubeType.charAt(0).toUpperCase() + tubeType.slice(1)} Water test tube`);
    }
  };

  const shakeTestTube = (tubeType: TubeType) => {
    const target = tubeType === 'soft' ? tubeSoft : tubeHard;
    const setTarget = tubeType === 'soft' ? setTubeSoft : setTubeHard;

    if (target.chemicalAdded && !target.shaken) {
      addObs(`Shaking ${tubeType} water sample with ${target.chemicalAdded}...`);
      setTarget(prev => ({ ...prev, shaken: true }));
      
      const interval = setInterval(() => triggerSound('shake'), 120);
      
      setTimeout(() => {
        clearInterval(interval);
        
        // Logic for result
        // Soap + Hard = Scum
        // Detergent + Hard = Lather
        // Anything + Soft = Lather
        const isScum = tubeType === 'hard' && target.chemicalAdded === 'soap';
        
        if (isScum) {
          triggerSound('scum');
          addObs(`Observation (${tubeType}): Very little lather. White scum formation detected.`);
        } else {
          triggerSound('bubble');
          triggerSound('success');
          addObs(`Observation (${tubeType}): Rich, stable lather formed easily. No scum detected.`);
        }
        
        setTarget(prev => ({ ...prev, shaken: false, resultShown: true }));
      }, 1800);
    }
  };

  const resetLab = () => {
    triggerSound('reset');
    setTubeSoft({ hasLiquid: true, chemicalAdded: null, shaken: false, resultShown: false });
    setTubeHard({ hasLiquid: true, chemicalAdded: null, shaken: false, resultShown: false });
    setDraggedItem(null);
    setDragOverTube(null);
    setObservations([]);
    addObs("Lab reset. New samples calibrated.");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Soap Action Lab
              </h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Virtual Science Experiment</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => {
                const nextMute = !isMuted;
                setIsMuted(nextMute);
                if (!nextMute) playSound('click', false);
              }}
              className={cn(
                "p-2 h-10 rounded-xl transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-tight",
                isMuted ? "bg-slate-100 text-slate-400" : "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100"
              )}
              title={isMuted ? "Unmute sounds" : "Mute sounds"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden lg:inline">{isMuted ? "Audio Off" : "Audio On"}</span>
            </button>

            <nav className="hidden md:flex bg-slate-100 p-1 rounded-xl">
              <TabButton active={activeTab === 'lab'} onClick={() => { triggerSound('click'); setActiveTab('lab'); }} icon={<FlaskConical className="w-4 h-4" />} label="Lab" />
              <TabButton active={activeTab === 'theory'} onClick={() => { triggerSound('click'); setActiveTab('theory'); }} icon={<BookOpen className="w-4 h-4" />} label="Theory" />
              <TabButton active={activeTab === 'quiz'} onClick={() => { triggerSound('click'); setActiveTab('quiz'); }} icon={<Zap className="w-4 h-4" />} label="Quiz" />
              <TabButton active={activeTab === 'log'} onClick={() => { triggerSound('click'); setActiveTab('log'); }} icon={<BarChart2 className="w-4 h-4" />} label="Log" />
            </nav>
            <button
              onClick={resetLab}
              className="p-2 h-10 w-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-600"
              title="Reset Experiment"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'lab' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Lab Area */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-indigo-500/5 overflow-hidden min-h-[500px] flex flex-col relative">
                <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-600 uppercase tracking-widest">Laboratory Workspace</h2>
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  </div>
                </div>

                <div className="flex-1 p-8 relative flex flex-col items-center justify-center bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px]">
                  {/* Test Tubes Container */}
                  <div className="flex justify-around w-full max-w-2xl mb-24 relative z-10">
                    {/* Soft Water Tube */}
                    <TubeColumn
                      type="soft"
                      label="Soft Water"
                      subLabel="Distilled"
                      waterColor="#f0f9ff"
                      tubeState={tubeSoft}
                      isDragOver={dragOverTube === 'soft'}
                      onDrop={() => handleChemicalDrop('soft')}
                      onDragOver={() => setDragOverTube('soft')}
                      onDragLeave={() => setDragOverTube(null)}
                      onShake={() => shakeTestTube('soft')}
                      addChemical={(chem) => addChemicalToTube('soft', chem)}
                    />

                    {/* Hard Water Tube */}
                    <TubeColumn
                      type="hard"
                      label="Hard Water"
                      subLabel="Mineral Rich"
                      waterColor="#fffbeb"
                      tubeState={tubeHard}
                      isDragOver={dragOverTube === 'hard'}
                      onDrop={() => handleChemicalDrop('hard')}
                      onDragOver={() => setDragOverTube('hard')}
                      onDragLeave={() => setDragOverTube(null)}
                      onShake={() => shakeTestTube('hard')}
                      addChemical={(chem) => addChemicalToTube('hard', chem)}
                    />
                  </div>

                  {/* Bench surface */}
                  <div className="absolute bottom-16 left-12 right-12 h-5 bg-gradient-to-b from-slate-200 to-slate-300 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-b border-slate-400/20" />

                  {/* Chemical Sources */}
                  <div className="flex items-end gap-12 z-20">
                    {/* Soap */}
                    <div className="flex flex-col items-center gap-4">
                      <div
                        draggable
                        onDragStart={() => { triggerSound('click'); setDraggedItem("soap"); }}
                        onDragEnd={() => setDraggedItem(null)}
                        className={cn(
                          "cursor-grab active:cursor-grabbing transition-all hover:scale-110 group",
                          draggedItem === "soap" && "opacity-50 scale-95"
                        )}
                      >
                        <div className="relative">
                          <SoapBottleSVG color="#4f46e5" label="SOAP" />
                          <div className="absolute -inset-2 bg-indigo-500/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 blur-xl" />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-slate-700">Soap</p>
                      </div>
                    </div>

                    {/* Detergent */}
                    <div className="flex flex-col items-center gap-4">
                      <div
                        draggable
                        onDragStart={() => { triggerSound('click'); setDraggedItem("detergent"); }}
                        onDragEnd={() => setDraggedItem(null)}
                        className={cn(
                          "cursor-grab active:cursor-grabbing transition-all hover:scale-110 group",
                          draggedItem === "detergent" && "opacity-50 scale-95"
                        )}
                      >
                        <div className="relative">
                          <SoapBottleSVG color="#0891b2" label="DETG" sub="SYNTHETIC" />
                          <div className="absolute -inset-2 bg-cyan-500/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 blur-xl" />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-slate-700">Detergent</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-[0.2em] bg-indigo-50 px-3 py-1 rounded-full inline-block">Drag chemicals to test tubes</p>
                  </div>
                </div>
              </div>

              {/* Comparison Results Card */}
              {tubeSoft.resultShown && tubeHard.resultShown && (
                <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-900/20 animate-in fade-in slide-in-from-bottom-6 duration-700 border border-slate-800">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-indigo-500/20 p-2 rounded-xl border border-indigo-500/30">
                      <CheckCircle2 className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Lab Conclusion</h3>
                      <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">Scientific Finding</p>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-8 border-l-2 border-indigo-500 pl-4 py-1">
                    The experiment confirms that soap is highly effective in <span className="text-indigo-400 font-bold underline decoration-indigo-400/30 underline-offset-4">soft water</span>, 
                    forming stable micelles and rich lather. In <span className="text-amber-400 font-bold underline decoration-amber-400/30 underline-offset-4">hard water</span>, soap is consumed 
                    in a precipitation reaction with Calcium/Magnesium ions, forming sticky scum instead of lather.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 hover:bg-slate-800 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Soft Sample</p>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Lather Index:</span>
                          <span className="font-bold text-emerald-400">9.5 / 10</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Scum Formation:</span>
                          <span className="font-bold text-slate-500">None</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 hover:bg-slate-800 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">Hard Sample</p>
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Lather Index:</span>
                          <span className="font-bold text-amber-500">1.2 / 10</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Scum Formation:</span>
                          <span className="font-bold text-amber-400">Significant</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar: Log & Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
                <div className="flex items-center gap-2 mb-6 relative">
                  <div className="bg-indigo-50 p-2 rounded-lg">
                    <Info className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="font-bold text-slate-800">Your Task</h3>
                </div>
                <ul className="space-y-4 text-sm text-slate-600 relative">
                  {[
                    "Add Soap Solution to both samples.",
                    "Shake both tubes to initiate reactions.",
                    "Observe lather vs scum formation."
                  ].map((task, i) => (
                    <li key={i} className="flex gap-3 items-start group">
                      <span className="flex-shrink-0 w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                        {i + 1}
                      </span>
                      <p className="pt-0.5 leading-relaxed font-medium">{task}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-[450px] flex flex-col">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-slate-800">Experiment Log</h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active</span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                  {observations.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 opacity-50">
                      <div className="bg-slate-100 p-4 rounded-2xl">
                        <Droplets className="w-10 h-10 text-slate-300" />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-widest">No activity recorded</p>
                    </div>
                  ) : (
                    observations.map(obs => (
                      <div key={obs.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 animate-in fade-in slide-in-from-top-3 duration-500 hover:border-indigo-100 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-50 px-2 py-0.5 rounded-full">{obs.time}</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-semibold">{obs.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'theory' && <TheoryView triggerSound={triggerSound} />}
        {activeTab === 'quiz' && <QuizView triggerSound={triggerSound} />}
        {activeTab === 'log' && <DetailedLog observations={observations} />}
      </main>

      {/* Styles */}
      <style>{`
        @keyframes shake-tube {
          0%, 100% { transform: rotate(0deg) translateX(0); }
          25% { transform: rotate(-6deg) translateX(-6px); }
          75% { transform: rotate(6deg) translateX(6px); }
        }
        .animate-shake {
          animation: shake-tube 0.1s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}

function QuizView({ triggerSound }: { triggerSound: (t: any) => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const questions = [
    {
      question: "Which ions are primarily responsible for water hardness?",
      options: ["Sodium & Potassium", "Calcium & Magnesium", "Iron & Copper", "Carbon & Hydrogen"],
      answer: 1,
    },
    {
      question: "What is the white precipitate formed by soap in hard water called?",
      options: ["Lather", "Micelle", "Scum", "Emulsion"],
      answer: 2,
    },
    {
      question: "Why do detergents work better than soaps in hard water?",
      options: ["They are more expensive", "They contain more perfume", "They don't form insoluble salts with Ca/Mg ions", "They are made of animal fats"],
      answer: 2,
    },
    {
      question: "What part of the soap molecule 'hates' water?",
      options: ["Hydrophilic head", "Hydrophobic tail", "Sodium ion", "Carbonate group"],
      answer: 1,
    },
  ];

  const handleAnswer = (index: number) => {
    if (index === questions[currentQuestion].answer) {
      setScore(score + 1);
      triggerSound('success');
    } else {
      triggerSound('scum');
    }

    const next = currentQuestion + 1;
    if (next < questions.length) {
      setCurrentQuestion(next);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-2xl shadow-indigo-100">
        {!showScore ? (
          <>
            <div className="flex justify-between items-center mb-10">
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full uppercase tracking-widest">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-500" 
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-10 leading-tight">
              {questions[currentQuestion].question}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {questions[currentQuestion].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className="p-6 rounded-3xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/50 text-left transition-all duration-300 group flex items-center gap-4"
                >
                  <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-black text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="font-bold text-slate-700">{opt}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-10">
            <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-indigo-200">
              <Zap className="w-12 h-12" />
            </div>
            <h3 className="text-3xl font-black text-slate-800 mb-2">Knowledge Check Complete!</h3>
            <p className="text-slate-500 font-medium mb-10 tracking-tight">Your scientific accuracy score:</p>
            <div className="text-6xl font-black text-indigo-600 mb-10">
              {score} / {questions.length}
            </div>
            <button
              onClick={() => {
                setCurrentQuestion(0);
                setScore(0);
                setShowScore(false);
                triggerSound('reset');
              }}
              className="bg-indigo-600 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
            >
              RETAKE QUIZ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Components
function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300",
        active 
          ? "bg-white text-indigo-600 shadow-md shadow-slate-200/50 transform scale-105" 
          : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

interface TubeColumnProps {
  type: TubeType;
  label: string;
  subLabel: string;
  waterColor: string;
  tubeState: TubeState;
  isDragOver: boolean;
  onDrop: () => void;
  onDragOver: () => void;
  onDragLeave: () => void;
  onShake: () => void;
  addChemical: (chem: ChemicalType) => void;
}

function TubeColumn({
  label, subLabel, waterColor, tubeState, isDragOver,
  onDrop, onDragOver, onDragLeave, onShake, type
}: TubeColumnProps) {
  const { chemicalAdded, shaken, resultShown } = tubeState;
  
  // Scum only if it's hard water and SOAP. 
  // Detergent + Hard water = Lather.
  const isScum = type === 'hard' && chemicalAdded === 'soap' && resultShown;

  return (
    <div className="flex flex-col items-center">
      <div
        onDragOver={(e) => { e.preventDefault(); onDragOver(); }}
        onDragLeave={onDragLeave}
        onDrop={(e) => { e.preventDefault(); onDrop(); }}
        className={cn(
          "relative transition-all duration-500 rounded-full p-6",
          isDragOver && "bg-emerald-500/10 scale-110 shadow-2xl shadow-emerald-500/20",
          shaken && "animate-shake"
        )}
      >
        <TestTubeSVG
          waterColor={waterColor}
          chemicalAdded={chemicalAdded}
          showResult={resultShown}
          resultType={type}
        />
        {isDragOver && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold py-1.5 px-4 rounded-full animate-bounce shadow-lg shadow-emerald-200 whitespace-nowrap z-30">
            RELEASE HERE
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <h4 className="text-sm font-extrabold text-slate-800 tracking-tight">{label}</h4>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{subLabel}</p>
      </div>

      <div className="mt-8 w-36">
        {!chemicalAdded ? (
          <div className="text-[10px] text-center text-slate-400 font-bold py-3 px-3 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            Add chemical
          </div>
        ) : !resultShown && !shaken ? (
          <button
            onClick={onShake}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black py-3 px-4 rounded-2xl shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2 group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Zap className="w-3.5 h-3.5 group-hover:fill-current relative" />
            <span className="relative">SHAKE SAMPLE</span>
          </button>
        ) : resultShown ? (
          <div className={cn(
            "text-[10px] text-center font-black py-3 px-3 rounded-2xl flex items-center justify-center gap-2 border-2 transform scale-105 shadow-lg",
            !isScum 
              ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100" 
              : "bg-amber-50 text-amber-700 border-amber-100 shadow-amber-100"
          )}>
            {!isScum ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {!isScum ? 'LATHER FORMED' : 'SCUM FORMED'}
          </div>
        ) : (
          <div className="text-[10px] text-center text-indigo-600 font-black py-3 bg-indigo-50 rounded-2xl border-2 border-indigo-100 animate-pulse tracking-widest">
            ANALYZING...
          </div>
        )}
      </div>
    </div>
  );
}

function TestTubeSVG({ waterColor, chemicalAdded, showResult, resultType }: { waterColor: string; chemicalAdded: ChemicalType | null; showResult: boolean; resultType: TubeType }) {
  return (
    <svg width="70" height="210" viewBox="0 0 70 210" className="drop-shadow-2xl">
      <defs>
        <linearGradient id={`liquid-${resultType}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={chemicalAdded ? (resultType === 'soft' ? "#dbeafe" : "#e5e7eb") : waterColor} />
          <stop offset="100%" stopColor={waterColor} />
        </linearGradient>
        <filter id="glass-shine">
          <feGaussianBlur stdDeviation="1" result="blur" />
        </filter>
      </defs>

      {/* Tube Body Shadow */}
      <path d="M12 7 L12 170 Q12 195 35 195 Q58 195 58 170 L58 7" fill="black" fillOpacity="0.05" transform="translate(4, 4)" />

      {/* Tube Body */}
      <path
        d="M10 5 L10 170 Q10 195 35 195 Q60 195 60 170 L60 5"
        fill="white"
        fillOpacity="0.1"
        stroke="#e2e8f0"
        strokeWidth="2.5"
      />

      {/* Liquid */}
      <path
        d="M11.5 100 L11.5 170 Q11.5 193.5 35 193.5 Q58.5 193.5 58.5 170 L58.5 100 Q35 94 11.5 100"
        fill={`url(#liquid-${resultType})`}
        fillOpacity="0.9"
      />

      {/* Result: Lather (Success) */}
      {showResult && !(resultType === 'hard' && chemicalAdded === 'soap') && (
        <g className="animate-in fade-in duration-1000 slide-in-from-top-4">
          <ellipse cx="35" cy="94" rx="22" ry="10" fill="white" fillOpacity="0.95" />
          <ellipse cx="35" cy="84" rx="18" ry="14" fill="white" fillOpacity="0.9" />
          <ellipse cx="35" cy="74" rx="14" ry="10" fill="white" fillOpacity="0.8" />
          <ellipse cx="35" cy="66" rx="10" ry="8" fill="white" fillOpacity="0.6" />
          {[...Array(8)].map((_, i) => (
            <circle key={i} cx={20 + i * 4} cy={60 - (i % 3) * 6} r={1.5 + (i % 3)} fill="white" fillOpacity="0.4">
              <animate attributeName="cy" values={`${60 - (i % 3) * 6};${50 - (i % 3) * 6}`} dur={`${1 + i * 0.2}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      )}

      {/* Result: Scum (Hard Water + Soap) */}
      {showResult && resultType === 'hard' && chemicalAdded === 'soap' && (
        <g className="animate-in fade-in duration-1000">
          <ellipse cx="35" cy="98" rx="22" ry="4" fill="#f8fafc" fillOpacity="0.95" />
          {[...Array(12)].map((_, i) => (
            <circle key={i} cx={18 + i * 3} cy={185 - (i % 4) * 3} r={1.8} fill="#f1f5f9" />
          ))}
          <path d="M15 180 L55 180 L52 192 L18 192 Z" fill="#f1f5f9" fillOpacity="0.9" />
        </g>
      )}

      {/* Measurement marks */}
      {[50, 80, 110, 140, 170].map(y => (
        <line key={y} x1="50" y1={y} x2="60" y2={y} stroke="#cbd5e1" strokeWidth="1.5" opacity="0.6" />
      ))}

      {/* Reflections */}
      <rect x="18" y="15" width="4" height="130" rx="2" fill="white" fillOpacity="0.3" filter="url(#glass-shine)" />
      <rect x="52" y="30" width="2" height="60" rx="1" fill="white" fillOpacity="0.2" />

      {/* Lip */}
      <rect x="5" y="2" width="60" height="8" rx="4" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1.5" />
      <ellipse cx="35" cy="4" rx="28" ry="3" fill="white" fillOpacity="0.4" />
    </svg>
  );
}

function SoapBottleSVG({ color = "#4f46e5", label = "SOAP", sub = "SOLUTION" }: { color?: string; label?: string; sub?: string }) {
  return (
    <svg width="70" height="110" viewBox="0 0 70 110" className="drop-shadow-xl">
      <path
        d="M12 35 Q12 28 20 28 L50 28 Q58 28 58 35 L58 95 Q58 102 35 102 Q12 102 12 95 Z"
        fill={color}
      />
      <path d="M12 55 Q35 50 58 55 L58 95 Q58 102 35 102 Q12 102 12 95 Z" fill="white" fillOpacity="0.15" />

      <rect x="18" y="52" width="34" height="28" rx="6" fill="white" />
      <text x="35" y="66" textAnchor="middle" fontSize="9" fontWeight="900" fill={color} fontFamily="sans-serif">{label}</text>
      <text x="35" y="74" textAnchor="middle" fontSize="4" fontWeight="bold" fill={color} opacity="0.7" fontFamily="sans-serif" letterSpacing="0.5">{sub}</text>

      <rect x="28" y="10" width="14" height="22" rx="3" fill="#312e81" />
      <rect x="25" y="25" width="20" height="6" rx="3" fill="#1e1b4b" />
      
      <path d="M22 15 L48 15 L48 10 Q48 5 40 5 L22 5 Z" fill="#1e1b4b" />
      <rect x="42" y="12" width="12" height="4" rx="2" fill="#1e1b4b" />

      <rect x="16" y="38" width="5" height="45" rx="2.5" fill="white" fillOpacity="0.2" />
    </svg>
  );
}

function TheoryView({ triggerSound }: { triggerSound: (t: any) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-700" />
        <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3 relative">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100">
            <BookOpen className="w-5 h-5" />
          </div>
          Chemical Mechanics
        </h3>

        <div className="space-y-8 relative">
          <section className="hover:bg-slate-50 p-4 rounded-2xl transition-colors duration-300 cursor-default" onMouseEnter={() => triggerSound('click')}>
            <h4 className="font-black text-indigo-600 text-[10px] uppercase tracking-[0.2em] mb-3">Molecular Interaction</h4>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              Soap is chemically defined as the salt of a fatty acid. When introduced to hard water, soap molecules 
              instantly react with <span className="text-indigo-900 font-bold">Ca²⁺</span> and <span className="text-indigo-900 font-bold">Mg²⁺</span> 
              ions to precipitate out as an insoluble solid.
            </p>
            <div className="mt-6 bg-slate-900 p-5 rounded-2xl border border-slate-800 font-mono text-[11px] text-indigo-300 shadow-xl overflow-x-auto">
              <span className="text-slate-500">// Precipitation Equation</span><br/>
              2C₁₇H₃₅COONa + Ca²⁺ &rarr; <span className="text-white font-bold">(C₁₇H₃₅COO)₂Ca&darr;</span> + 2Na⁺<br/>
              <span className="text-slate-500 text-[9px] uppercase tracking-wider mt-2 block">Soap + Calcium &rarr; Insoluble Scum</span>
            </div>
          </section>

          <section className="hover:bg-slate-50 p-4 rounded-2xl transition-colors duration-300 cursor-default" onMouseEnter={() => triggerSound('click')}>
            <h4 className="font-black text-indigo-600 text-[10px] uppercase tracking-[0.2em] mb-3">Experimental Definition of Scum</h4>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              Scum is the white, curd-like substance that coats surfaces. It is chemically "wasted" soap that 
              can no longer participate in cleaning until all mineral ions are neutralised.
            </p>
          </section>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)]" />
          <h3 className="text-xl font-black mb-8 relative">Micelle Architecture</h3>
          <div className="flex justify-center mb-8 relative group-hover:scale-110 transition-transform duration-500">
            <MicelleDiagram />
          </div>
          <p className="text-indigo-50 text-sm leading-relaxed font-medium relative opacity-90">
            Cleaning occurs through <span className="text-white font-black italic underline underline-offset-4 decoration-white/30">micelle formation</span>. 
            The hydrophobic tails trap dirt, while the hydrophilic heads allow the structure to be washed away in water.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mb-16 -mr-16 blur-3xl" />
          <h4 className="font-black text-slate-800 mb-6 text-sm uppercase tracking-widest relative">Sample Comparison</h4>
          <div className="space-y-6 relative">
            <div className="flex items-start gap-4 p-4 rounded-2xl border border-slate-50 hover:border-emerald-100 transition-colors" onMouseEnter={() => triggerSound('bubble')}>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 font-bold shrink-0 shadow-sm shadow-emerald-100">S</div>
              <div>
                <p className="text-sm font-black text-slate-800 tracking-tight">Soft Water Sample</p>
                <p className="text-xs text-slate-500 leading-relaxed mt-1 font-medium">Free of mineral ions. Enables immediate lathering and maximum cleaning efficiency.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-2xl border border-slate-50 hover:border-amber-100 transition-colors" onMouseEnter={() => triggerSound('scum')}>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 font-bold shrink-0 shadow-sm shadow-amber-100">H</div>
              <div>
                <p className="text-sm font-black text-slate-800 tracking-tight">Hard Water Sample</p>
                <p className="text-xs text-slate-500 leading-relaxed mt-1 font-medium">Contains Magnesium/Calcium. Forces soap to react chemically before lather can form.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MicelleDiagram() {
  return (
    <svg width="140" height="140" viewBox="0 0 100 100">
      <defs>
        <radialGradient id="dirt-grad">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#78350f" />
        </radialGradient>
      </defs>
      {/* Central Dirt */}
      <circle cx="50" cy="50" r="14" fill="url(#dirt-grad)" shadow-lg />
      <text x="50" y="53" textAnchor="middle" fontSize="6" fill="white" fontWeight="900" fontFamily="sans-serif">DIRT OIL</text>

      {/* Soap Molecules */}
      {[...Array(14)].map((_, i) => {
        const angle = (i * (360/14)) * (Math.PI / 180);
        const x1 = 50 + Math.cos(angle) * 16;
        const y1 = 50 + Math.sin(angle) * 16;
        const x2 = 50 + Math.cos(angle) * 38;
        const y2 = 50 + Math.sin(angle) * 38;
        const hX = 50 + Math.cos(angle) * 44;
        const hY = 50 + Math.sin(angle) * 44;

        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            <circle cx={hX} cy={hY} r="4.5" fill="#38bdf8" stroke="white" strokeWidth="1" />
          </g>
        );
      })}

      {/* Indicator lines */}
      <path d="M75 15 L55 35" stroke="white" strokeWidth="0.5" strokeDasharray="2" opacity="0.5" />
      <text x="78" y="12" fontSize="5" fill="white" fontWeight="bold">Hydrophilic Head (Polar)</text>

      <path d="M15 85 L35 65" stroke="white" strokeWidth="0.5" strokeDasharray="2" opacity="0.5" />
      <text x="5" y="92" fontSize="5" fill="white" fontWeight="bold">Hydrophobic Tail (Non-Polar)</text>
    </svg>
  );
}

function DetailedLog({ observations }: { observations: Observation[] }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden animate-in fade-in duration-500">
      <div className="px-8 py-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Session Analysis</h3>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Experimental Record</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
             <p className="text-xs font-black text-indigo-600 uppercase">{observations.length} Actions</p>
             <p className="text-[10px] text-slate-400 font-bold uppercase">Recorded</p>
          </div>
          <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100 text-white">
            <BarChart2 className="w-6 h-6" />
          </div>
        </div>
      </div>
      <div className="p-8">
        {observations.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400">
            <div className="bg-slate-50 p-8 rounded-[40px] mb-6">
              <FlaskConical className="w-16 h-16 mb-4 opacity-10 text-indigo-600" />
            </div>
            <p className="font-black text-slate-300 uppercase tracking-widest text-sm">No laboratory data available</p>
            <p className="text-xs text-slate-400 mt-2 font-medium">Please perform experiments to generate analytical data.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] border-b border-slate-100">
                  <th className="pb-6 pl-4">Timestamp</th>
                  <th className="pb-6">Analytical Description</th>
                  <th className="pb-6 pr-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {observations.map(obs => (
                  <tr key={obs.id} className="group hover:bg-indigo-50/30 transition-all duration-300">
                    <td className="py-5 pl-4 font-mono text-indigo-400 text-xs w-40">{obs.time}</td>
                    <td className="py-5 text-slate-700 font-bold text-sm tracking-tight">{obs.text}</td>
                    <td className="py-5 pr-4 text-right">
                      <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-wider">Verified</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
