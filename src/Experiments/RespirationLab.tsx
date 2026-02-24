import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Droplets, Wind, RotateCcw, ChevronDown, BookOpen, CheckCircle, FlaskConical, TestTube, Leaf, Zap, Award, ChevronRight, Sparkles, Clock, Activity, ArrowRight, Beaker, Volume2, VolumeX } from 'lucide-react';

// Types
type LimewaterStatus = 'clear' | 'slightly_milky' | 'milky' | 'white_precipitate';
type WaveType = 'sine' | 'square' | 'sawtooth' | 'triangle';

interface Particle {
  id: number;
  x: number;
  y: number;
  type: string;
}

// ===== AUDIO UTILITY HOOK =====
const useAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: WaveType = 'sine', volume: number = 0.3) => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log('Audio not supported');
    }
  }, [getAudioContext, isMuted]);

  // Sound effects library
  const sounds = {
    click: () => playTone(800, 0.1, 'sine', 0.2),
    success: () => {
      playTone(523, 0.15, 'sine', 0.3);
      setTimeout(() => playTone(659, 0.15, 'sine', 0.3), 100);
      setTimeout(() => playTone(784, 0.2, 'sine', 0.3), 200);
    },
    whoosh: () => playTone(200, 0.3, 'sawtooth', 0.2),
    bubble: () => playTone(400 + Math.random() * 200, 0.15, 'sine', 0.15),
    fizz: () => playTone(600, 0.4, 'sawtooth', 0.15),
    glow: () => {
      playTone(440, 0.3, 'sine', 0.2);
      setTimeout(() => playTone(554, 0.3, 'sine', 0.2), 100);
      setTimeout(() => playTone(659, 0.4, 'sine', 0.25), 200);
    },
    complete: () => {
      playTone(392, 0.2, 'sine', 0.3);
      setTimeout(() => playTone(523, 0.2, 'sine', 0.3), 150);
      setTimeout(() => playTone(659, 0.2, 'sine', 0.3), 300);
      setTimeout(() => playTone(784, 0.3, 'sine', 0.35), 450);
      setTimeout(() => playTone(1047, 0.4, 'sine', 0.4), 600);
    },
    error: () => {
      playTone(200, 0.2, 'square', 0.2);
      setTimeout(() => playTone(150, 0.3, 'square', 0.2), 100);
    },
    gas: () => playTone(100, 0.5, 'sawtooth', 0.1),
    precipitate: () => {
      playTone(800, 0.1, 'triangle', 0.2);
      setTimeout(() => playTone(600, 0.15, 'triangle', 0.2), 80);
      setTimeout(() => playTone(400, 0.2, 'triangle', 0.2), 160);
    },
    seal: () => {
      playTone(300, 0.15, 'sine', 0.25);
      setTimeout(() => playTone(400, 0.2, 'sine', 0.25), 80);
    },
    pour: () => {
      playTone(500, 0.25, 'sine', 0.2);
      setTimeout(() => playTone(600, 0.25, 'sine', 0.2), 100);
      setTimeout(() => playTone(700, 0.25, 'sine', 0.2), 200);
    },
    ping: () => playTone(1200, 0.1, 'sine', 0.2),
    sparkle: () => {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => playTone(800 + Math.random() * 400, 0.1, 'sine', 0.15), i * 60);
      }
    },
    whooshUp: () => {
      playTone(200, 0.1, 'sine', 0.2);
      setTimeout(() => playTone(400, 0.1, 'sine', 0.2), 50);
      setTimeout(() => playTone(600, 0.1, 'sine', 0.2), 100);
      setTimeout(() => playTone(800, 0.15, 'sine', 0.2), 150);
    }
  };

  return { sounds, isMuted, setIsMuted };
};

 export default function RespirationLab() {
  // Audio hook
  const { sounds, isMuted, setIsMuted } = useAudio();

  // Experiment State
  const [seedsActive, setSeedsActive] = useState<boolean>(false);
  const [flaskSealed, setFlaskSealed] = useState<boolean>(false);
  const [limewaterInserted, setLimewaterInserted] = useState<boolean>(false);
  
  // Measurements
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [co2Level, setCo2Level] = useState<number>(0);
  
  // Limewater State
  const [limewaterStatus, setLimewaterStatus] = useState<LimewaterStatus>('clear');
  const [calciumCarbonate, setCalciumCarbonate] = useState<number>(0);
  
  // Results
  const [experimentComplete, setExperimentComplete] = useState<boolean>(false);
  const [showConclusion, setShowConclusion] = useState<boolean>(false);
  
  // UI
  const [expandedStep, setExpandedStep] = useState<number>(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [bubbles, setBubbles] = useState<number[]>([]);

  // ===== MAIN RESPIRATION PROCESS =====
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let statusChanged = false;

    if (seedsActive && flaskSealed && limewaterInserted) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
        
        // Seeds produce CO2
        setCo2Level(prev => Math.min(prev + 0.8, 100));

        // Limewater turns milky when CO2 reacts
        // Ca(OH)2 + CO2 → CaCO3 (white precipitate) + H2O
        if (co2Level > 20 && limewaterStatus === 'clear' && !statusChanged) {
          setLimewaterStatus('slightly_milky');
          sounds.fizz();
          sounds.glow();
          statusChanged = true;
        }
        
        if (co2Level > 40 && limewaterStatus === 'slightly_milky') {
          setLimewaterStatus('milky');
          sounds.glow();
          sounds.bubble();
        }
        
        if (co2Level > 60 && limewaterStatus === 'milky') {
          setLimewaterStatus('white_precipitate');
          setExperimentComplete(true);
          sounds.complete();
          sounds.sparkle();
          sounds.precipitate();
        }

        // Calcium carbonate formation
        setCalciumCarbonate(prev => Math.min(prev + 0.15, 100));

        // White precipitate particles
        if (Math.random() > 0.7 && limewaterStatus !== 'clear') {
          const newParticles: Particle[] = Array.from({ length: 2 }).map(() => ({
            id: Math.random(),
            x: 40 + Math.random() * 20,
            y: Math.random() * 100,
            type: 'precipitate'
          }));
          setParticles(prev => [...prev, ...newParticles].slice(-20));
          if (Math.random() > 0.5) sounds.bubble();
        }

        // Bubbles animation
        if (Math.random() > 0.8) {
          setBubbles(prev => [...prev, Math.random()].slice(-5));
        }

        // CO2 gas sound effect
        if (Math.random() > 0.95 && co2Level > 10) {
          sounds.gas();
        }
      }, 800);
    }

    return () => clearInterval(interval);
  }, [seedsActive, flaskSealed, limewaterInserted, co2Level, limewaterStatus, sounds]);

  const startExperiment = (): void => {
    sounds.click();
    sounds.whooshUp();
    setSeedsActive(true);
    setFlaskSealed(false);
    setLimewaterInserted(false);
    setTimeElapsed(0);
    setCo2Level(0);
    setLimewaterStatus('clear');
    setCalciumCarbonate(0);
    setExperimentComplete(false);
    setShowConclusion(false);
  };

  const sealFlask = (): void => {
    if (seedsActive) {
      sounds.seal();
      setFlaskSealed(true);
    } else {
      sounds.error();
    }
  };

  const insertLimewater = (): void => {
    if (flaskSealed) {
      sounds.pour();
      setLimewaterInserted(true);
    } else {
      sounds.error();
    }
  };

  const showResults = (): void => {
    sounds.success();
    sounds.sparkle();
    setShowConclusion(true);
  };

  const reset = (): void => {
    sounds.click();
    setSeedsActive(false);
    setFlaskSealed(false);
    setLimewaterInserted(false);
    setTimeElapsed(0);
    setCo2Level(0);
    setLimewaterStatus('clear');
    setCalciumCarbonate(0);
    setExperimentComplete(false);
    setShowConclusion(false);
    setParticles([]);
    setExpandedStep(0);
    setBubbles([]);
  };

  const getLimewaterColor = (): string => {
    switch(limewaterStatus) {
      case 'clear': return 'from-cyan-300/90 via-blue-400/80 to-cyan-500/70';
      case 'slightly_milky': return 'from-cyan-200/80 via-slate-300/70 to-cyan-400/60';
      case 'milky': return 'from-slate-200/90 via-slate-300/80 to-slate-400/70';
      case 'white_precipitate': return 'from-white/95 via-gray-200/90 to-slate-300/80';
      default: return 'from-cyan-300/90 via-blue-400/80 to-cyan-500/70';
    }
  };

  const getLimewaterLabel = (): string => {
    switch(limewaterStatus) {
      case 'clear': return 'CLEAR';
      case 'slightly_milky': return 'SLIGHTLY MILKY';
      case 'milky': return 'MILKY WHITE';
      case 'white_precipitate': return 'WHITE PRECIPITATE';
      default: return 'CLEAR';
    }
  };

  // Step Card Component
  interface StepCardProps {
    number: number;
    title: string;
    icon: React.ReactNode;
    isActive: boolean;
    children: React.ReactNode;
  }

  const StepCard: React.FC<StepCardProps> = ({ number, title, icon, isActive, children }) => (
    <div className={`rounded-2xl transition-all border-2 overflow-hidden ${
      isActive
        ? 'bg-gradient-to-br from-emerald-900/40 via-teal-900/30 to-cyan-900/40 border-emerald-500/50 shadow-xl shadow-emerald-500/20'
        : 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 shadow-lg'
    }`}>
      <button
        onClick={() => setExpandedStep(expandedStep === number ? 0 : number)}
        className={`w-full flex items-center gap-4 p-5 hover:opacity-90 transition-all ${
          isActive ? 'bg-white/5' : 'hover:bg-slate-700/20'
        }`}
      >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-all ${
          isActive 
            ? 'bg-gradient-to-br from-emerald-500/30 to-teal-500/30 shadow-lg shadow-emerald-500/30 text-emerald-300' 
            : 'bg-slate-700/50 text-slate-400'
        }`}>
          {icon}
        </div>
        <div className="text-left flex-1">
          <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${
            isActive ? 'text-emerald-400' : 'text-slate-500'
          }`}>
            Step {number}
          </div>
          <h3 className={`text-lg font-bold ${
            isActive ? 'text-white' : 'text-slate-300'
          }`}>
            {title}
          </h3>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform flex-shrink-0 ${
          expandedStep === number ? 'rotate-180' : ''
        } ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
      </button>

      <div className={`overflow-hidden transition-all duration-500 ${
        expandedStep === number ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className={`p-5 border-t ${isActive ? 'border-emerald-500/20' : 'border-slate-700/50'}`}>
          {children}
        </div>
      </div>
    </div>
  );

  // Action Button Component
  interface ActionButtonProps {
    onClick: () => void;
    disabled: boolean;
    active: boolean;
    activeText: string;
    inactiveText: string;
    activeColor?: string;
  }

  const ActionButton: React.FC<ActionButtonProps> = ({ 
    onClick, 
    disabled, 
    active, 
    activeText, 
    inactiveText,
    activeColor = 'emerald'
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3.5 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
        active
          ? `bg-${activeColor}-500/20 text-${activeColor}-400 border border-${activeColor}-500/50 shadow-lg shadow-${activeColor}-500/20`
          : disabled
          ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed border border-slate-600/50'
          : 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white shadow-lg hover:shadow-xl border border-slate-500/30'
      }`}
      style={active ? {
        backgroundColor: activeColor === 'emerald' ? 'rgba(16, 185, 129, 0.2)' : 
                        activeColor === 'blue' ? 'rgba(59, 130, 246, 0.2)' :
                        'rgba(168, 85, 247, 0.2)',
        color: activeColor === 'emerald' ? '#34d399' : 
               activeColor === 'blue' ? '#60a5fa' :
               '#c084fc',
        borderColor: activeColor === 'emerald' ? 'rgba(16, 185, 129, 0.5)' : 
                     activeColor === 'blue' ? 'rgba(59, 130, 246, 0.5)' :
                     'rgba(168, 85, 247, 0.5)'
      } : {}}
    >
      {active ? <CheckCircle className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      {active ? activeText : inactiveText}
    </button>
  );

  // Stat Card Component
  interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    highlighted?: boolean;
    progress?: number;
  }

  const StatCard: React.FC<StatCardProps> = ({ icon, label, value, highlighted = false, progress }) => (
    <div className={`rounded-xl p-4 border transition-all duration-300 ${
      highlighted 
        ? 'bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-500/50 shadow-lg shadow-emerald-500/20' 
        : 'bg-slate-900/50 border-slate-700/50'
    }`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          highlighted ? 'bg-emerald-500/30 text-emerald-400' : 'bg-slate-700/50 text-slate-400'
        }`}>
          {icon}
        </div>
        <span className={`text-xs uppercase tracking-wider font-bold ${
          highlighted ? 'text-emerald-400' : 'text-slate-400'
        }`}>{label}</span>
      </div>
      <div className={`text-2xl font-black ${highlighted ? 'text-emerald-300' : 'text-white'}`}>
        {value}
      </div>
      {progress !== undefined && (
        <div className="mt-3 h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${highlighted ? 'bg-emerald-400' : 'bg-slate-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950/30 to-teal-950/20 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* ===== HEADER ===== */}
        <div className="text-center mb-12 relative">
          {/* Sound toggle button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`absolute top-0 right-0 p-3 rounded-xl transition-all duration-300 ${
              isMuted 
                ? 'bg-slate-800/50 text-slate-500 border border-slate-700/50 hover:bg-slate-700/50' 
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 shadow-lg shadow-emerald-500/20'
            }`}
            title={isMuted ? 'Turn sound on' : 'Turn sound off'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Decorative elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-20 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-500/40 rounded-full px-6 py-3 mb-6 backdrop-blur-sm shadow-lg shadow-emerald-500/10">
            <Leaf className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span className="text-emerald-300 font-bold text-sm tracking-wider">RESPIRATION EXPERIMENT</span>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 mb-4 drop-shadow-lg">
            RESPIRATION
          </h1>
          <p className="text-lg text-slate-300 mb-2 flex items-center justify-center gap-2">
            <BookOpen className="w-5 h-5 text-slate-400" /> Class 10 Biology - Life Processes
          </p>
          <p className="text-base text-slate-400 mb-8">Detection of CO₂ Release Using Limewater Test</p>
          
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="text-slate-200 leading-relaxed mb-3">
                  <strong className="text-emerald-400">Respiration</strong> is a metabolic process where glucose is broken down in the presence of oxygen to release energy. Living organisms respire to obtain energy for various life processes.
                </p>
                <p className="text-slate-300 text-sm">
                  <strong className="text-teal-400">Objective:</strong> To demonstrate that carbon dioxide is released during respiration in germinating seeds using the limewater test.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== MAIN EXPERIMENT ===== */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          
          {/* LEFT: SETUP STEPS */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <FlaskConical className="w-5 h-5 text-emerald-400" />
              Experiment Setup
            </h2>
            
            {/* Step 1 */}
            <StepCard
              number={1}
              title="Setup: Germinating Seeds"
              icon={<Leaf className="w-6 h-6" />}
              isActive={seedsActive}
            >
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                Take 25-30 germinating seeds that have been soaked for 24 hours. Place them in a conical flask. Germinating seeds show high respiration rates.
              </p>
              <ActionButton
                onClick={startExperiment}
                disabled={seedsActive}
                active={seedsActive}
                activeText="Seeds in Flask"
                inactiveText="Start with Seeds"
                activeColor="emerald"
              />
            </StepCard>

            {/* Step 2 */}
            <StepCard
              number={2}
              title="Setup: Seal Flask"
              icon={<div className="text-lg">🔒</div>}
              isActive={flaskSealed}
            >
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                Seal the flask with a cork or rubber stopper. Use Vaseline on the threads to ensure an airtight seal. This traps CO₂ inside.
              </p>
              <ActionButton
                onClick={sealFlask}
                disabled={!seedsActive || flaskSealed}
                active={flaskSealed}
                activeText="Flask Sealed"
                inactiveText="Seal Flask"
                activeColor="blue"
              />
            </StepCard>

            {/* Step 3 */}
            <StepCard
              number={3}
              title="Testing: Insert Limewater"
              icon={<TestTube className="w-6 h-6" />}
              isActive={limewaterInserted}
            >
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                Insert a test tube containing freshly prepared limewater through the cork. Use a delivery tube for contact with the gas inside the flask.
              </p>
              <ActionButton
                onClick={insertLimewater}
                disabled={!flaskSealed || limewaterInserted}
                active={limewaterInserted}
                activeText="Limewater Inserted"
                inactiveText="Insert Limewater"
                activeColor="purple"
              />
            </StepCard>

            {/* Step 4 */}
            {experimentComplete && (
              <StepCard
                number={4}
                title="Observe Results"
                icon={<Award className="w-6 h-6" />}
                isActive={experimentComplete}
              >
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                  Observe the change in limewater color. The white precipitate indicates the presence of carbon dioxide.
                </p>
                <button
                  onClick={showResults}
                  className="w-full py-3.5 px-4 rounded-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> View Conclusion
                </button>
              </StepCard>
            )}
          </div>

          {/* CENTER: APPARATUS VISUALIZATION */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
              <FlaskConical className="w-5 h-5 text-cyan-400" />
              Apparatus & Observation
            </h3>
            
            <div className="relative bg-gradient-to-b from-slate-900/50 to-emerald-950/30 rounded-xl overflow-hidden border-2 border-slate-700/50 p-6 flex flex-col items-center justify-between min-h-[400px]">
              
              {/* Conical Flask with Seeds */}
              <div className="text-center relative">
                <div className={`relative w-32 h-44 mx-auto bg-gradient-to-b from-slate-300/20 to-slate-400/30 rounded-b-[50px] border-4 border-slate-400/50 shadow-xl transition-all duration-500 ${
                  flaskSealed ? 'ring-4 ring-blue-400/40 ring-offset-2 ring-offset-slate-900' : ''
                }`}>
                  
                  {/* Seeds inside */}
                  {seedsActive && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-0.5">
                      {Array(8).fill(0).map((_, i) => (
                        <div
                          key={i}
                          className="w-2.5 h-2.5 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-lg animate-pulse"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                  )}

                  {/* CO2 particles floating */}
                  {flaskSealed && limewaterInserted && co2Level > 10 && (
                    <div className="absolute inset-0 overflow-hidden">
                      {Array(6).fill(0).map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce"
                          style={{
                            left: `${20 + Math.random() * 60}%`,
                            bottom: `${20 + Math.random() * 40}%`,
                            animationDelay: `${i * 0.2}s`,
                            animationDuration: '2s'
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Cork */}
                  {flaskSealed && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-gradient-to-b from-amber-600 to-amber-800 rounded-b-lg shadow-lg border border-amber-900">
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-400 rounded-full shadow-inner" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-3 font-medium">Conical Flask (Germinating Seeds)</p>
              </div>

              {/* Delivery Tube */}
              {flaskSealed && (
                <div className="flex items-center justify-center gap-3 my-4">
                  <div className="w-28 h-1.5 bg-gradient-to-r from-slate-500 via-slate-400 to-slate-500 rounded-full shadow-lg" />
                  <div className="flex items-center gap-1">
                    {co2Level > 10 && <Wind className="w-4 h-4 text-cyan-400 animate-pulse" />}
                    <span className="text-cyan-400 text-xs font-bold">CO₂</span>
                    <ArrowRight className="w-3 h-3 text-cyan-400" />
                  </div>
                </div>
              )}

              {/* Limewater Test Tube */}
              {limewaterInserted && (
                <div className="text-center">
                  <div className={`relative w-24 h-36 mx-auto bg-gradient-to-b ${getLimewaterColor()} rounded-2xl border-4 border-white/40 shadow-2xl overflow-hidden transition-all duration-700`}>
                    
                    {/* Liquid level indicator */}
                    <div className="absolute bottom-0 left-0 right-0 h-4/5 bg-gradient-to-t from-cyan-500/20 to-transparent" />
                    
                    {/* Bubbles animation */}
                    {bubbles.map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-white/50 rounded-full"
                        style={{
                          left: `${30 + Math.random() * 40}%`,
                          bottom: '10%',
                          animation: 'float-up 2s ease-out forwards'
                        }}
                      />
                    ))}

                    {/* Precipitate particles */}
                    {particles.filter(p => p.type === 'precipitate').slice(0, 10).map(p => (
                      <div
                        key={p.id}
                        className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-sm"
                        style={{
                          left: `${p.x}%`,
                          top: `${p.y}%`,
                          animation: 'particle-float 1.5s ease-out forwards'
                        }}
                      />
                    ))}

                    {/* Glow effect when precipitate forms */}
                    {limewaterStatus === 'white_precipitate' && (
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    )}
                  </div>
                  
                  <div className={`text-center mt-4 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-500 ${
                    limewaterStatus === 'clear' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' :
                    limewaterStatus === 'slightly_milky' ? 'bg-slate-400/20 text-slate-300 border border-slate-400/50' :
                    limewaterStatus === 'milky' ? 'bg-slate-300/30 text-slate-200 border border-slate-300/50' :
                    'bg-white/30 text-white border border-white/50 shadow-lg shadow-white/20'
                  }`}>
                    {getLimewaterLabel()}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-medium">Limewater Test Tube</p>
                </div>
              )}

              {/* Animations */}
              <style>{`
                @keyframes float-up {
                  0% { transform: translateY(0) scale(1); opacity: 0.8; }
                  100% { transform: translateY(-100px) scale(0.5); opacity: 0; }
                }
                @keyframes particle-float {
                  0% { transform: translateY(0) scale(1); opacity: 1; }
                  100% { transform: translateY(-30px) scale(0.8); opacity: 0.7; }
                }
              `}</style>

              {/* Status text */}
              <div className="text-center mt-6">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  limewaterInserted 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                    : 'bg-slate-800/50 text-slate-500 border border-slate-700/50'
                }`}>
                  {!seedsActive ? <span>👆 Add seeds to start</span> : 
                   !flaskSealed ? <span>🔒 Seal flask to trap CO₂</span> : 
                   !limewaterInserted ? <span>⚗️ Insert limewater to test</span> : 
                   experimentComplete ? <span>✅ Experiment complete!</span> :
                   <span>🔬 Observing reaction...</span>}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: LIVE MEASUREMENTS */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-cyan-400" />
              Live Measurements
            </h2>
            
            {/* Time & Status */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon={<Clock className="w-4 h-4" />}
                label="Time"
                value={`${timeElapsed}s`}
                highlighted={limewaterInserted}
              />
              <StatCard
                icon={<Activity className="w-4 h-4" />}
                label="CO₂ Level"
                value={`${co2Level.toFixed(0)}%`}
                highlighted={co2Level > 20}
                progress={Math.min(co2Level, 100)}
              />
            </div>

            {/* Limewater Reaction */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-slate-700/50 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Beaker className="w-5 h-5 text-purple-400" />
                <h4 className="text-lg font-bold text-white">Chemical Reaction</h4>
              </div>
              
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 mb-4">
                <div className="text-xs text-slate-400 mb-3 uppercase font-bold">Balanced Equation</div>
                <div className="font-mono text-sm text-slate-200 leading-relaxed text-center bg-gradient-to-r from-purple-900/20 via-slate-900/50 to-blue-900/20 rounded-lg p-3">
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <span className="text-cyan-400">Ca(OH)₂</span>
                    <span className="text-slate-400">+</span>
                    <span className="text-green-400">CO₂</span>
                    <span className="text-slate-400">→</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 flex-wrap mt-2">
                    <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded">CaCO₃↓</span>
                    <span className="text-slate-400">+</span>
                    <span className="text-blue-400">H₂O</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed space-y-2">
                <p className="font-bold text-slate-400">What happens:</p>
                <ul className="space-y-1.5 ml-2">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    <span>Limewater = Calcium hydroxide solution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    <span>CO₂ from seeds reacts with limewater</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    <span>Forms insoluble CaCO₃ (white precipitate)</span>
                  </li>
                </ul>
              </div>

              {limewaterStatus !== 'clear' && (
                <div className="mt-4 p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 rounded-xl text-sm text-emerald-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span><strong>CO₂ DETECTED!</strong> Limewater changed color</span>
                </div>
              )}
            </div>

            {/* CaCO3 Formation */}
            <StatCard
              icon={<Droplets className="w-4 h-4" />}
              label="CaCO₃ Precipitate"
              value={`${calciumCarbonate.toFixed(1)}%`}
              highlighted={calciumCarbonate > 20}
              progress={calciumCarbonate}
            />

            {/* Progress Indicator */}
            {limewaterInserted && !experimentComplete && (
              <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/40 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-amber-400">Experiment Progress</span>
                  <span className="text-xs text-amber-300">{Math.round((co2Level / 60) * 100)}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                    style={{ width: `${Math.min((co2Level / 60) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {experimentComplete && !showConclusion && (
              <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/40 rounded-xl p-4 text-center">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-emerald-300 font-bold">Experiment Complete!</p>
                <p className="text-slate-400 text-sm">Click "View Conclusion" above for results</p>
              </div>
            )}
          </div>
        </div>

        {/* ===== RESULTS & CONCLUSION ===== */}
        {showConclusion && (
          <div className="space-y-6 mb-12">
            
            {/* Result Box */}
            <div className="bg-gradient-to-r from-emerald-900/30 via-teal-900/30 to-cyan-900/30 border-2 border-emerald-500/50 rounded-3xl p-8 shadow-2xl shadow-emerald-500/10">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-black text-white mb-4 flex items-center gap-3">
                    RESULT
                    {limewaterStatus === 'white_precipitate' && <Sparkles className="w-6 h-6 text-yellow-400" />}
                  </h3>
                  <div className="text-lg text-slate-200 leading-relaxed space-y-4">
                    <div className="bg-slate-900/50 rounded-xl p-5 border border-emerald-500/30">
                      <p className="font-bold text-emerald-400 mb-2 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Observation:
                      </p>
                      <p>Limewater turned <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded">{getLimewaterLabel().toLowerCase()}</span>, due to the formation of <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded">calcium carbonate (CaCO₃)</span>.</p>
                    </div>
                    
                    <div className="bg-slate-900/50 rounded-xl p-5 border border-blue-500/30">
                      <p className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                        <FlaskConical className="w-4 h-4" /> Chemical Evidence:
                      </p>
                      <p>The white precipitate (CaCO₃) confirms that <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded">CO₂ was present</span> in the flask.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conclusion Box */}
            <div className="bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-purple-900/30 border-2 border-blue-500/50 rounded-3xl p-8 shadow-2xl shadow-blue-500/10">
              <h3 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-indigo-500/30 flex items-center justify-center">
                  <Award className="w-6 h-6 text-blue-400" />
                </div>
                CONCLUSION
              </h3>
              
              <div className="space-y-4 text-lg text-slate-200 leading-relaxed">
                <div className="bg-slate-900/50 rounded-xl p-5 border-l-4 border-emerald-400">
                  <p className="font-bold text-emerald-400 mb-2">🔹 Main Conclusion:</p>
                  <p className="text-white text-xl font-bold">
                    Carbon dioxide is released during respiration in germinating seeds.
                  </p>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-5 border-l-4 border-blue-400">
                  <p className="font-bold text-blue-400 mb-2">🔹 Scientific Explanation:</p>
                  <ul className="space-y-2 ml-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Germinating seeds are living organisms undergoing rapid growth</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>They respire to obtain energy for cellular activities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Aerobic respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy (ATP)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>The CO₂ produced is released into the flask atmosphere</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Limewater detects CO₂ by forming white precipitate</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-5 border-l-4 border-purple-400">
                  <p className="font-bold text-purple-400 mb-2">🔹 Why This Matters:</p>
                  <ul className="space-y-2 ml-2">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Respiration is essential for all living organisms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>It releases energy (ATP) for cellular functions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>CO₂ is a waste product that must be removed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>This practical confirms theoretical knowledge with real evidence</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Progress Table */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-slate-700/50 rounded-2xl p-6 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-cyan-400" />
                Experiment Summary
              </h3>
              
              <div className="overflow-x-auto rounded-xl border border-slate-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-900/80 border-b border-slate-700">
                      <th className="p-4 text-left text-cyan-400 font-bold">Observation</th>
                      <th className="p-4 text-center text-cyan-400 font-bold">Time</th>
                      <th className="p-4 text-left text-cyan-400 font-bold">Interpretation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    <tr className="hover:bg-slate-900/30 transition-colors">
                      <td className="p-4 text-slate-200">Initial: Clear limewater</td>
                      <td className="p-4 text-center text-slate-400">0-10 sec</td>
                      <td className="p-4 text-slate-300">No CO₂ in flask yet</td>
                    </tr>
                    <tr className="hover:bg-slate-900/30 transition-colors">
                      <td className="p-4 text-slate-200">Slightly milky appearance</td>
                      <td className="p-4 text-center text-slate-400">10-30 sec</td>
                      <td className="p-4 text-slate-300">CO₂ starting to accumulate</td>
                    </tr>
                    <tr className="hover:bg-slate-900/30 transition-colors">
                      <td className="p-4 text-slate-200">Milky white color</td>
                      <td className="p-4 text-center text-slate-400">30-50 sec</td>
                      <td className="p-4 text-slate-300">Significant CO₂ present</td>
                    </tr>
                    <tr className="bg-emerald-900/30 hover:bg-emerald-900/40 transition-colors">
                      <td className="p-4 text-slate-200 font-bold">White precipitate</td>
                      <td className="p-4 text-center text-emerald-400 font-bold">50+ sec</td>
                      <td className="p-4 text-emerald-300 font-bold">✓ RESPIRATION CONFIRMED</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key Learning Points */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-slate-700/50 rounded-2xl p-6 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                Key Learning Points
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 rounded-xl p-5 border border-emerald-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="w-5 h-5 text-emerald-400" />
                    <p className="font-bold text-emerald-300">Respiration Definition</p>
                  </div>
                  <p className="text-sm text-slate-300">Process where organisms break down glucose with oxygen to release energy</p>
                </div>
                <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-xl p-5 border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-blue-400" />
                    <p className="font-bold text-blue-300">Aerobic Respiration</p>
                  </div>
                  <p className="text-sm text-slate-300">Requires oxygen; produces CO₂, water, and large amount of energy</p>
                </div>
                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-5 border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <FlaskConical className="w-5 h-5 text-purple-400" />
                    <p className="font-bold text-purple-300">Limewater Test</p>
                  </div>
                  <p className="text-sm text-slate-300">Detects CO₂ by forming white precipitate of calcium carbonate</p>
                </div>
                <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-xl p-5 border border-amber-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <p className="font-bold text-amber-300">Living Proof</p>
                  </div>
                  <p className="text-sm text-slate-300">Germinating seeds prove that life processes require respiration</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== RESET BUTTON ===== */}
        <div className="flex justify-center">
          <button
            onClick={reset}
            className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700 hover:from-slate-600 hover:via-slate-700 hover:to-slate-600 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-3 text-lg border border-slate-600/50 hover:border-slate-500/50"
          >
            <RotateCcw className="w-5 h-5" /> Reset Experiment
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-slate-500 text-sm">
          <p>Designed for Class 10 Biology Practical • Life Processes</p>
        </div>
      </div>
    </div>
  );
};

