import { useState } from "react";
import { RotateCcw, Info, X, FlaskConical, BookOpen, BarChart2, Beaker, Droplets, Sparkles, Microscope, ChevronRight, FlaskRound } from "lucide-react";

// --- Types ---
interface Reaction {
  color: string;
  glow: string;
  text: string;
}

interface TypeConfig {
  label: string;
  bg: string;
  fg: string;
  border: string;
  gradient: string;
}

interface Solution {
  id: string;
  name: string;
  formula: string;
  type: "acid" | "base" | "salt" | "neutral";
  ph: number;
  accent: string;
  light: string;
  description: string;
}

interface Indicator {
  id: string;
  name: string;
  range: string;
  description: string;
  reactions: {
    acid: Reaction;
    base: Reaction;
    neutral: Reaction;
    salt: Reaction;
  };
}

interface TestResult {
  id: number;
  solution: string;
  formula: string;
  indicator: string;
  reaction: Reaction;
  phValue: number;
  type: string;
  timestamp: string;
}

// --- Data ---
const solutions: Solution[] = [
  { id: "hcl", name: "Hydrochloric Acid", formula: "HCl", type: "acid", ph: 1, accent: "#FF4757", light: "#FFF0F1", description: "Strong acid commonly found in gastric acid" },
  { id: "acetic", name: "Acetic Acid", formula: "CH₃COOH", type: "acid", ph: 3, accent: "#FF6B35", light: "#FFF3EE", description: "Weak acid found in vinegar" },
  { id: "naoh", name: "Sodium Hydroxide", formula: "NaOH", type: "base", ph: 13, accent: "#3B82F6", light: "#EFF6FF", description: "Strong base also known as lye or caustic soda" },
  { id: "nh3", name: "Ammonia Solution", formula: "NH₃", type: "base", ph: 11, accent: "#8B5CF6", light: "#F5F3FF", description: "Weak base used in cleaning products" },
  { id: "nacl", name: "Sodium Chloride", formula: "NaCl", type: "salt", ph: 7, accent: "#10B981", light: "#ECFDF5", description: "Common table salt, neutral pH" },
  { id: "na2co3", name: "Sodium Carbonate", formula: "Na₂CO₃", type: "salt", ph: 11.2, accent: "#14B8A6", light: "#F0FDFA", description: "Washing soda, basic salt" },
  { id: "water", name: "Distilled Water", formula: "H₂O", type: "neutral", ph: 7, accent: "#0EA5E9", light: "#F0F9FF", description: "Pure water with neutral pH" },
];

const indicators: Indicator[] = [
  {
    id: "litmus", name: "Litmus Paper", range: "pH 4.5 – 8.3", description: "Classic indicator that changes between red and blue",
    reactions: {
      acid: { color: "#EF4444", glow: "rgba(239,68,68,0.5)", text: "Red" },
      base: { color: "#3B82F6", glow: "rgba(59,130,246,0.5)", text: "Blue" },
      neutral: { color: "#8B5CF6", glow: "rgba(139,92,246,0.5)", text: "Purple" },
      salt: { color: "#8B5CF6", glow: "rgba(139,92,246,0.5)", text: "Purple" },
    },
  },
  {
    id: "phenol", name: "Phenolphthalein", range: "pH 8.2 – 10", description: "Colorless in acid, pink in base",
    reactions: {
      acid: { color: "#E2E8F0", glow: "rgba(226,232,240,0.4)", text: "Colorless" },
      base: { color: "#EC4899", glow: "rgba(236,72,153,0.5)", text: "Pink" },
      neutral: { color: "#E2E8F0", glow: "rgba(226,232,240,0.4)", text: "Colorless" },
      salt: { color: "#E2E8F0", glow: "rgba(226,232,240,0.4)", text: "Colorless" },
    },
  },
  {
    id: "methyl", name: "Methyl Orange", range: "pH 3.1 – 4.4", description: "Red in acid, yellow in base",
    reactions: {
      acid: { color: "#EF4444", glow: "rgba(239,68,68,0.5)", text: "Red" },
      base: { color: "#FBBF24", glow: "rgba(251,191,36,0.5)", text: "Yellow" },
      neutral: { color: "#F97316", glow: "rgba(249,115,22,0.5)", text: "Orange" },
      salt: { color: "#F97316", glow: "rgba(249,115,22,0.5)", text: "Orange" },
    },
  },
  {
    id: "congo", name: "Congo Red", range: "pH 3.0 – 5.0", description: "Blue in acid, red in base",
    reactions: {
      acid: { color: "#1D4ED8", glow: "rgba(29,78,216,0.5)", text: "Blue" },
      base: { color: "#DC2626", glow: "rgba(220,38,38,0.5)", text: "Red" },
      neutral: { color: "#92400E", glow: "rgba(146,64,14,0.5)", text: "Brown" },
      salt: { color: "#92400E", glow: "rgba(146,64,14,0.5)", text: "Brown" },
    },
  },
  {
    id: "universal", name: "Universal Indicator", range: "pH 0 – 14", description: "Shows full spectrum of colors",
    reactions: {
      acid: { color: "#EF4444", glow: "rgba(239,68,68,0.5)", text: "Red" },
      base: { color: "#7C3AED", glow: "rgba(124,58,237,0.5)", text: "Violet" },
      neutral: { color: "#10B981", glow: "rgba(16,185,129,0.5)", text: "Green" },
      salt: { color: "#F59E0B", glow: "rgba(245,158,11,0.5)", text: "Amber" },
    },
  },
];

const typeConfig: Record<string, TypeConfig> = {
  acid: { label: "Acid", bg: "#FEE2E2", fg: "#B91C1C", border: "#FECACA", gradient: "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)" },
  base: { label: "Base", bg: "#DBEAFE", fg: "#1D4ED8", border: "#BFDBFE", gradient: "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)" },
  salt: { label: "Salt", bg: "#D1FAE5", fg: "#065F46", border: "#A7F3D0", gradient: "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)" },
  neutral: { label: "Neutral", bg: "#E0F2FE", fg: "#0369A1", border: "#BAE6FD", gradient: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)" },
};

// --- Components ---
function TestTube({ test, typeConfig }: { test: TestResult; typeConfig: Record<string, TypeConfig> }) {
  const { reaction, phValue, indicator, type } = test;
  const tc = typeConfig[type] ?? typeConfig.neutral;
  const uid = test.id;

  return (
    <div className="tube-wrap">
      <svg width="60" height="180" viewBox="0 0 60 180" xmlns="http://www.w3.org/2000/svg" className="tube-svg">
        <defs>
          <linearGradient id={`liq-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={reaction.color} stopOpacity="0.85"/>
            <stop offset="50%" stopColor={reaction.color} stopOpacity="0.95"/>
            <stop offset="100%" stopColor={reaction.color} stopOpacity="1"/>
          </linearGradient>
          <linearGradient id={`gls-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.6"/>
            <stop offset="40%" stopColor="#fff" stopOpacity="0.1"/>
            <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.3"/>
          </linearGradient>
          <filter id={`glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
          <clipPath id={`cp-${uid}`}>
            <path d="M15 12 L15 140 Q15 168 30 168 Q45 168 45 140 L45 12 Z"/>
          </clipPath>
        </defs>

        {/* Glass tube outline */}
        <path d="M14 10 L14 140 Q14 170 30 170 Q46 170 46 140 L46 10 Z"
          fill="rgba(255,255,255,0.05)"
          stroke="rgba(203,213,225,0.8)" strokeWidth="2"/>

        {/* Liquid */}
        <rect x="15" y="70" width="30" height="98"
          fill={`url(#liq-${uid})`} clipPath={`url(#cp-${uid})`}/>

        {/* Meniscus */}
        <ellipse cx="30" cy="70" rx="15" ry="4"
          fill={reaction.color} opacity="0.9"
          clipPath={`url(#cp-${uid})`}/>

        {/* Bottom glow */}
        <ellipse cx="30" cy="162" rx="10" ry="5"
          fill={reaction.color} opacity="0.6"
          filter={`url(#glow-${uid})`}
          clipPath={`url(#cp-${uid})`}/>

        {/* Glass reflection overlay */}
        <path d="M15 12 L15 140 Q15 168 30 168 Q45 168 45 140 L45 12 Z"
          fill={`url(#gls-${uid})`}/>

        {/* Highlight stripe */}
        <rect x="18" y="18" width="6" height="100" rx="3"
          fill="white" opacity="0.25" clipPath={`url(#cp-${uid})`}/>

        {/* Secondary highlight */}
        <rect x="40" y="30" width="3" height="60" rx="1.5"
          fill="white" opacity="0.15" clipPath={`url(#cp-${uid})`}/>

        {/* Rim */}
        <rect x="10" y="4" width="40" height="14" rx="7"
          fill="rgba(226,232,240,0.9)" stroke="rgba(203,213,225,0.8)" strokeWidth="1.5"/>
        <rect x="12" y="6" width="36" height="8" rx="4"
          fill="rgba(255,255,255,0.7)"/>

        {/* Rim color tint */}
        <rect x="10" y="4" width="40" height="5" rx="7"
          fill={reaction.color} opacity="0.3"/>
      </svg>

      <div className="tube-info">
        <div className="tube-color" style={{ color: reaction.color, textShadow: `0 0 12px ${reaction.glow}` }}>
          {reaction.text}
        </div>
        <div className="tube-indicator">{indicator}</div>
        <div className="tube-ph-badge" style={{ background: tc.gradient, color: tc.fg, borderColor: tc.border }}>
          pH {phValue}
        </div>
      </div>
    </div>
  );
}

function ParticleBackground() {
  return (
    <div className="particles">
      {[...Array(20)].map((_, i) => (
        <div key={i} className="particle" style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 20}s`,
          animationDuration: `${15 + Math.random() * 10}s`,
        }}/>
      ))}
    </div>
  );
}

// --- Main App ---
export default function AcidBaseLabPro() {

  const [selectedSolution, setSelectedSolution] = useState<string | null>(null);
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null);
  const [testTubes, setTestTubes] = useState<TestResult[]>([]);
  const [activeTab, setActiveTab] = useState("lab");
  const [showInfo, setShowInfo] = useState(false);
  const [history, setHistory] = useState<TestResult[]>([]);
  const [animating, setAnimating] = useState(false);
  const [pouring, setPouring] = useState(false);

  const performTest = () => {
    if (!selectedSolution || !selectedIndicator || animating) return;
    setAnimating(true);
    setPouring(true);

    const solution = solutions.find(s => s.id === selectedSolution);
    const indicator = indicators.find(i => i.id === selectedIndicator);
    if (!solution || !indicator) return;

    const reaction = indicator.reactions[solution.type];
    const result: TestResult = {
      id: Date.now(),
      solution: solution.name,
      formula: solution.formula,
      indicator: indicator.name,
      reaction,
      phValue: solution.ph,
      type: solution.type,
      timestamp: new Date().toLocaleTimeString(),
    };

    setTimeout(() => {
      setTestTubes(p => [...p, result]);
      setHistory(p => [result, ...p]);
      setAnimating(false);
      setPouring(false);
    }, 1200);
  };

  const clearLab = () => {
    setTestTubes([]);
    setSelectedSolution(null);
    setSelectedIndicator(null);
  };

  const selectedSolData = solutions.find(s => s.id === selectedSolution);
  const selectedIndData = indicators.find(i => i.id === selectedIndicator);

  return (
    <div className="app">
      <ParticleBackground />
      
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="brand">
            <div className="brand-icon">
              <div className="brand-icon-inner">
                <FlaskConical size={22} />
              </div>
            </div>
            <div className="brand-text">
              <h1>Acid-Base Lab</h1>
              <span> Chemistry </span>
            </div>
          </div>

          <nav className="nav">
            {[
              { id: "lab", icon: Beaker, label: "Laboratory" },
              { id: "theory", icon: BookOpen, label: "Theory" },
              { id: "data", icon: BarChart2, label: `History (${history.length})` },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`nav-btn ${activeTab === t.id ? "active" : ""}`}
              >
                <t.icon size={16} />
                <span>{t.label}</span>
              </button>
            ))}
          </nav>

          <button className="info-btn" onClick={() => setShowInfo(true)}>
            <Info size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {/* Lab Tab */}
        {activeTab === "lab" && (
          <div className="lab-layout">
            {/* Left Panel - Controls */}
            <div className="controls-panel">
              {/* Solution Selection */}
              <div className="card solution-card">
                <div className="card-header">
                  <div className="step-badge step-1">
                    <span>1</span>
                  </div>
                  <h3>Select Solution</h3>
                </div>
                <div className="card-body">
                  <div className="solutions-grid">
                    {solutions.map(sol => {
                      const tc = typeConfig[sol.type];
                      const isSelected = selectedSolution === sol.id;
                      return (
                        <button
                          key={sol.id}
                          className={`solution-btn ${isSelected ? "selected" : ""}`}
                          onClick={() => setSelectedSolution(sol.id)}
                          style={{ "--accent": sol.accent, "--light": sol.light } as React.CSSProperties}
                        >
                          <div className="solution-icon" style={{ background: sol.light }}>
                            <Droplets size={16} style={{ color: sol.accent }} />
                          </div>
                          <div className="solution-info">
                            <span className="solution-name">{sol.name}</span>
                            <span className="solution-formula">{sol.formula}</span>
                          </div>
                          <span className="type-tag" style={{ background: tc.bg, color: tc.fg, borderColor: tc.border }}>
                            {tc.label}
                          </span>
                          {isSelected && <div className="selection-indicator" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Indicator Selection */}
              <div className="card indicator-card">
                <div className="card-header">
                  <div className="step-badge step-2">
                    <span>2</span>
                  </div>
                  <h3>Select Indicator</h3>
                </div>
                <div className="card-body">
                  <div className="indicators-list">
                    {indicators.map(ind => {
                      const isSelected = selectedIndicator === ind.id;
                      return (
                        <button
                          key={ind.id}
                          className={`indicator-btn ${isSelected ? "selected" : ""}`}
                          onClick={() => setSelectedIndicator(ind.id)}
                        >
                          <div className="indicator-info">
                            <span className="indicator-name">{ind.name}</span>
                            <span className="indicator-range">{ind.range}</span>
                          </div>
                          <div className="indicator-preview">
                            {Object.values(ind.reactions).map((r, i) => (
                              <div key={i} className="color-dot" style={{ background: r.color }} />
                            ))}
                          </div>
                          {isSelected && <div className="selection-indicator" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="actions">
                <button
                  className={`btn-primary ${pouring ? "pouring" : ""}`}
                  onClick={performTest}
                  disabled={!selectedSolution || !selectedIndicator || animating}
                >
                  {pouring ? (
                    <>
                      <div className="pour-animation">
                        <div className="drop" />
                      </div>
                      <span>Mixing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>Run Experiment</span>
                    </>
                  )}
                </button>
                <button className="btn-secondary" onClick={clearLab}>
                  <RotateCcw size={16} />
                  <span>Clear All</span>
                </button>
              </div>
            </div>

            {/* Right Panel - Test Tube Rack */}
            <div className="rack-panel">
              <div className="rack-header">
                <div className="rack-title-section">
                  <Microscope size={24} className="rack-icon" />
                  <div>
                    <h2>Test Tube Rack</h2>
                    <p>{testTubes.length === 0 ? "Ready for experiments" : `${testTubes.length} experiment${testTubes.length > 1 ? "s" : ""} completed`}</p>
                  </div>
                </div>
                {testTubes.length > 0 && (
                  <div className="test-count">
                    <span>{testTubes.length}</span>
                    <small>tests</small>
                  </div>
                )}
              </div>

              <div className="rack-body">
                {testTubes.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-illustration">
                      <div className="floating-flask">
                        <FlaskRound size={48} />
                      </div>
                      <div className="bubbles">
                        <span /><span /><span />
                      </div>
                    </div>
                    <h3>Start Your Experiment</h3>
                    <p>Select a solution and indicator, then click <strong>Run Experiment</strong> to see the reaction</p>
                  </div>
                ) : (
                  <>
                    <div className="rack-stand">
                      <div className="stand-holes">
                        {testTubes.map((_, i) => (
                          <div key={i} className="hole" />
                        ))}
                      </div>
                    </div>
                    <div className="tubes-container">
                      {testTubes.map(test => (
                        <TestTube key={test.id} test={test} typeConfig={typeConfig} />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Current Selection Preview */}
              {(selectedSolData || selectedIndData) && (
                <div className="preview-bar">
                  {selectedSolData && (
                    <div className="preview-item">
                      <span className="preview-label">Solution</span>
                      <span className="preview-value" style={{ color: selectedSolData.accent }}>
                        {selectedSolData.name}
                      </span>
                    </div>
                  )}
                  {selectedIndData && (
                    <div className="preview-item">
                      <span className="preview-label">Indicator</span>
                      <span className="preview-value" style={{ color: "#7C3AED" }}>
                        {selectedIndData.name}
                      </span>
                    </div>
                  )}
                  <ChevronRight size={20} className="preview-arrow" />
                  <div className="preview-item preview-result">
                    <span className="preview-label">Expected</span>
                    {selectedSolData && selectedIndData ? (
                      <span
                        className="preview-value"
                        style={{ color: selectedIndData.reactions[selectedSolData.type].color }}
                      >
                        {selectedIndData.reactions[selectedSolData.type].text}
                      </span>
                    ) : (
                      <span className="preview-value placeholder">?</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Theory Tab */}
        {activeTab === "theory" && (
          <div className="theory-layout">
            <div className="theory-card ph-scale-card">
              <div className="theory-header">
                <FlaskConical size={24} />
                <h2>The pH Scale</h2>
              </div>
              <div className="ph-visual">
                <div className="ph-gradient" />
                <div className="ph-markers">
                  {[0, 2, 4, 6, 7, 8, 10, 12, 14].map(n => (
                    <div key={n} className={`ph-marker ${n === 7 ? "neutral" : ""}`}>
                      <span>{n}</span>
                      {n === 7 && <small>Neutral</small>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="ph-types">
                {[
                  { icon: "🍋", label: "Acids", range: "0-6", color: "#EF4444", desc: "Donate H⁺ ions, taste sour, turn litmus red" },
                  { icon: "💧", label: "Neutral", range: "7", color: "#10B981", desc: "Equal H⁺ and OH⁻ concentration" },
                  { icon: "🧼", label: "Bases", range: "8-14", color: "#3B82F6", desc: "Accept H⁺ ions, feel slippery, turn litmus blue" },
                ].map(type => (
                  <div key={type.label} className="ph-type-card" style={{ borderColor: type.color }}>
                    <span className="type-icon">{type.icon}</span>
                    <div>
                      <h4 style={{ color: type.color }}>{type.label}</h4>
                      <span className="type-range">pH {type.range}</span>
                      <p>{type.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="theory-card indicators-card">
              <div className="theory-header">
                <Droplets size={24} />
                <h2>Indicator Guide</h2>
              </div>
              <div className="indicators-grid">
                {indicators.map(ind => (
                  <div key={ind.id} className="indicator-detail-card">
                    <div className="indicator-header">
                      <h4>{ind.name}</h4>
                      <span className="range-badge">{ind.range}</span>
                    </div>
                    <p className="indicator-desc">{ind.description}</p>
                    <div className="reaction-swatches">
                      {Object.entries(ind.reactions).map(([type, reaction]) => (
                        <div key={type} className="swatch">
                          <div className="swatch-color" style={{ background: reaction.color, boxShadow: `0 4px 12px ${reaction.glow}` }} />
                          <span className="swatch-type">{type}</span>
                          <span className="swatch-text">{reaction.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Data Tab */}
        {activeTab === "data" && (
          <div className="data-panel">
            <div className="data-header">
              <BarChart2 size={24} />
              <h2>Experiment History</h2>
            </div>
            {history.length === 0 ? (
              <div className="empty-data">
                <FlaskConical size={64} />
                <h3>No experiments yet</h3>
                <p>Run some experiments in the Lab to see your results here</p>
              </div>
            ) : (
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Solution</th>
                      <th>Indicator</th>
                      <th>pH</th>
                      <th>Type</th>
                      <th>Result</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((test, i) => {
                      const tc = typeConfig[test.type];
                      return (
                        <tr key={test.id}>
                          <td className="index-cell">{history.length - i}</td>
                          <td className="solution-cell">
                            <span className="solution-name-cell">{test.solution}</span>
                            <span className="formula-cell">{test.formula}</span>
                          </td>
                          <td>{test.indicator}</td>
                          <td>
                            <span className="ph-badge" style={{
                              background: test.phValue < 7 ? "#FEE2E2" : test.phValue > 7 ? "#DBEAFE" : "#D1FAE5",
                              color: test.phValue < 7 ? "#B91C1C" : test.phValue > 7 ? "#1D4ED8" : "#065F46"
                            }}>
                              {test.phValue}
                            </span>
                          </td>
                          <td>
                            <span className="type-cell-badge" style={{ background: tc.bg, color: tc.fg }}>
                              {tc.label}
                            </span>
                          </td>
                          <td>
                            <div className="result-cell">
                              <div className="result-color" style={{ background: test.reaction.color, boxShadow: `0 2px 8px ${test.reaction.glow}` }} />
                              <span>{test.reaction.text}</span>
                            </div>
                          </td>
                          <td className="time-cell">{test.timestamp}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Info Modal */}
      {showInfo && (
        <div className="modal-overlay" onClick={() => setShowInfo(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon">
                <Sparkles size={24} />
              </div>
              <h2>Welcome to Acid-Base Lab</h2>
              <button className="modal-close" onClick={() => setShowInfo(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {[
                { icon: "🎯", title: "Learning Objective", text: "Master pH indicators and understand how different substances react with chemical indicators", color: "#4F46E5" },
                { icon: "🔬", title: "How to Use", text: "Select a solution and indicator, then run the experiment to observe color changes", color: "#7C3AED" },
                { icon: "⚠️", title: "Safety First", text: "In real labs, always wear protective equipment when handling chemicals", color: "#EF4444" },
              ].map((item, i) => (
                <div key={i} className="info-card" style={{ borderLeftColor: item.color }}>
                  <span className="info-icon">{item.icon}</span>
                  <div>
                    <h4 style={{ color: item.color }}>{item.title}</h4>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setShowInfo(false)}>
                Start Experimenting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        :root {
          --primary: #4F46E5;
          --primary-light: #818CF8;
          --secondary: #7C3AED;
          --accent: #0EA5E9;
          --bg: #0F172A;
          --surface: #1E293B;
          --surface-light: #334155;
          --text: #F8FAFC;
          --text-muted: #94A3B8;
          --border: rgba(148, 163, 184, 0.2);
          --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          --glow: 0 0 40px rgba(79, 70, 229, 0.3);
        }

        .app {
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          position: relative;
          overflow-x: hidden;
        }

        /* Particle Background */
        .particles {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: var(--primary-light);
          border-radius: 50%;
          opacity: 0.3;
          animation: float linear infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
        }

        /* Header */
        .header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .brand-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(79, 70, 229, 0.4);
        }

        .brand-icon-inner {
          color: white;
        }

        .brand-text h1 {
          font-size: 1.25rem;
          font-weight: 800;
          background: linear-gradient(135deg, #fff, var(--primary-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .brand-text span {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .nav {
          display: flex;
          gap: 0.5rem;
          background: var(--surface);
          padding: 0.375rem;
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-muted);
          transition: all 0.2s;
          border: none;
          background: transparent;
          cursor: pointer;
        }

        .nav-btn:hover {
          color: var(--text);
          background: var(--surface-light);
        }

        .nav-btn.active {
          color: white;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          box-shadow: 0 4px 16px rgba(79, 70, 229, 0.4);
        }

        .info-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .info-btn:hover {
          color: var(--text);
          border-color: var(--primary-light);
          box-shadow: 0 0 20px rgba(79, 70, 229, 0.2);
        }

        /* Main */
        .main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          position: relative;
          z-index: 1;
        }

        /* Lab Layout */
        .lab-layout {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 2rem;
        }

        /* Cards */
        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
        }

        .card-header {
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.875rem;
          border-bottom: 1px solid var(--border);
        }

        .step-badge {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
        }

        .step-1 {
          background: linear-gradient(135deg, #FF4757, #FF6B35);
          color: white;
        }

        .step-2 {
          background: linear-gradient(135deg, #7C3AED, #0EA5E9);
          color: white;
        }

        .card-header h3 {
          font-size: 1rem;
          font-weight: 700;
        }

        .card-body {
          padding: 1rem;
        }

        /* Solutions Grid */
        .solutions-grid {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 320px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        .solutions-grid::-webkit-scrollbar {
          width: 4px;
        }

        .solutions-grid::-webkit-scrollbar-thumb {
          background: var(--surface-light);
          border-radius: 99px;
        }

        .solution-btn {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.875rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          text-align: left;
          color: var(--text);
        }

        .solution-btn:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: var(--accent);
          transform: translateX(4px);
        }

        .solution-btn.selected {
          background: rgba(79, 70, 229, 0.15);
          border-color: var(--primary);
          box-shadow: 0 0 20px rgba(79, 70, 229, 0.2);
        }

        .selection-indicator {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 60%;
          background: var(--primary);
          border-radius: 0 3px 3px 0;
        }

        .solution-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .solution-info {
          flex: 1;
          min-width: 0;
        }

        .solution-name {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.125rem;
        }

        .solution-formula {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .type-tag {
          font-size: 0.6875rem;
          font-weight: 700;
          padding: 0.25rem 0.625rem;
          border-radius: 99px;
          border: 1px solid;
          white-space: nowrap;
        }

        /* Indicators */
        .indicators-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .indicator-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.875rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          text-align: left;
          color: var(--text);
        }

        .indicator-btn:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: var(--secondary);
        }

        .indicator-btn.selected {
          background: rgba(124, 58, 237, 0.15);
          border-color: var(--secondary);
          box-shadow: 0 0 20px rgba(124, 58, 237, 0.2);
        }

        .indicator-name {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.125rem;
        }

        .indicator-range {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .indicator-preview {
          display: flex;
          gap: 0.25rem;
        }

        .color-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid var(--surface);
        }

        /* Actions */
        .actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          border: none;
          border-radius: 14px;
          color: white;
          font-size: 0.9375rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 8px 32px rgba(79, 70, 229, 0.4);
          position: relative;
          overflow: hidden;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(79, 70, 229, 0.5);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-primary.pouring {
          background: linear-gradient(135deg, var(--secondary), var(--accent));
        }

        .pour-animation {
          position: relative;
          width: 20px;
          height: 20px;
        }

        .drop {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          animation: drop 0.6s ease-in-out infinite;
        }

        @keyframes drop {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, 100%) scale(0.5); opacity: 0; }
        }

        .btn-secondary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          color: var(--text-muted);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          border-color: var(--text-muted);
          color: var(--text);
        }

        /* Rack Panel */
        .rack-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          min-height: 600px;
        }

        .rack-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--border);
        }

        .rack-title-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .rack-icon {
          color: var(--primary-light);
        }

        .rack-title-section h2 {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .rack-title-section p {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .test-count {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(124, 58, 237, 0.2));
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 0.5rem 1rem;
        }

        .test-count span {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--primary-light);
        }

        .test-count small {
          font-size: 0.625rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .rack-body {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        /* Empty State */
        .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 3rem;
        }

        .empty-illustration {
          position: relative;
          margin-bottom: 2rem;
        }

        .floating-flask {
          color: var(--surface-light);
          animation: float-flask 3s ease-in-out infinite;
        }

        @keyframes float-flask {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .bubbles {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }

        .bubbles span {
          position: absolute;
          width: 8px;
          height: 8px;
          background: var(--primary-light);
          border-radius: 50%;
          opacity: 0;
          animation: bubble 2s ease-in-out infinite;
        }

        .bubbles span:nth-child(1) { left: -20px; animation-delay: 0s; }
        .bubbles span:nth-child(2) { left: 0; animation-delay: 0.5s; }
        .bubbles span:nth-child(3) { left: 20px; animation-delay: 1s; }

        @keyframes bubble {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-40px) scale(1); opacity: 0; }
        }

        .empty-state h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: var(--text-muted);
          max-width: 300px;
          line-height: 1.6;
        }

        .empty-state strong {
          color: var(--primary-light);
        }

        /* Rack Stand */
        .rack-stand {
          background: linear-gradient(180deg, var(--surface-light) 0%, var(--surface) 100%);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1rem;
          border: 1px solid var(--border);
        }

        .stand-holes {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
        }

        .hole {
          width: 60px;
          height: 8px;
          background: var(--bg);
          border-radius: 99px;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        /* Tubes */
        .tubes-container {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          justify-content: center;
          align-items: flex-end;
          padding: 1rem 0;
        }

        .tube-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          animation: tube-appear 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }

        @keyframes tube-appear {
          0% { opacity: 0; transform: translateY(-30px) scale(0.8); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .tube-svg {
          filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
        }

        .tube-info {
          text-align: center;
        }

        .tube-color {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .tube-indicator {
          font-size: 0.6875rem;
          color: var(--text-muted);
          margin-bottom: 0.375rem;
        }

        .tube-ph-badge {
          font-size: 0.625rem;
          font-weight: 700;
          padding: 0.25rem 0.625rem;
          border-radius: 99px;
          border: 1px solid;
        }

        /* Preview Bar */
        .preview-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          background: rgba(79, 70, 229, 0.1);
          border: 1px solid var(--border);
          border-radius: 14px;
          margin-top: auto;
        }

        .preview-item {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .preview-label {
          font-size: 0.625rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          font-weight: 600;
        }

        .preview-value {
          font-size: 0.875rem;
          font-weight: 700;
        }

        .preview-value.placeholder {
          color: var(--text-muted);
        }

        .preview-arrow {
          color: var(--text-muted);
          margin: 0 0.5rem;
        }

        .preview-result {
          margin-left: auto;
          text-align: right;
        }

        /* Theory Tab */
        .theory-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .theory-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 1.5rem;
        }

        .theory-header {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          margin-bottom: 1.5rem;
          color: var(--primary-light);
        }

        .theory-header h2 {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text);
        }

        .ph-visual {
          margin-bottom: 1.5rem;
        }

        .ph-gradient {
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(to right, 
            #EF4444 0%, 
            #F97316 14%, 
            #FBBF24 28%, 
            #10B981 50%, 
            #0EA5E9 64%, 
            #3B82F6 78%, 
            #7C3AED 100%
          );
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .ph-markers {
          display: flex;
          justify-content: space-between;
          margin-top: 0.75rem;
          padding: 0 0.5rem;
        }

        .ph-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .ph-marker span {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .ph-marker.neutral span {
          color: var(--primary-light);
          font-size: 0.875rem;
        }

        .ph-marker small {
          font-size: 0.625rem;
          color: var(--text-muted);
        }

        .ph-types {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .ph-type-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          border-left: 3px solid;
        }

        .type-icon {
          font-size: 1.5rem;
        }

        .ph-type-card h4 {
          font-size: 0.9375rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .type-range {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .ph-type-card p {
          font-size: 0.8125rem;
          color: var(--text-muted);
          margin-top: 0.375rem;
          line-height: 1.5;
        }

        .indicators-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 520px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        .indicator-detail-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 1rem;
        }

        .indicator-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .indicator-header h4 {
          font-size: 0.9375rem;
          font-weight: 700;
        }

        .range-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--secondary);
          background: rgba(124, 58, 237, 0.15);
          padding: 0.25rem 0.625rem;
          border-radius: 6px;
        }

        .indicator-desc {
          font-size: 0.8125rem;
          color: var(--text-muted);
          margin-bottom: 0.875rem;
        }

        .reaction-swatches {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
        }

        .swatch {
          text-align: center;
        }

        .swatch-color {
          height: 28px;
          border-radius: 8px;
          margin-bottom: 0.375rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .swatch-type {
          display: block;
          font-size: 0.625rem;
          text-transform: capitalize;
          color: var(--text-muted);
          margin-bottom: 0.125rem;
        }

        .swatch-text {
          display: block;
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--text);
        }

        /* Data Tab */
        .data-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 1.5rem;
        }

        .data-header {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          margin-bottom: 1.5rem;
          color: var(--primary-light);
        }

        .data-header h2 {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text);
        }

        .empty-data {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--surface-light);
        }

        .empty-data h3 {
          color: var(--text-muted);
          margin: 1rem 0 0.5rem;
          font-size: 1.125rem;
        }

        .empty-data p {
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .data-table-wrapper {
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }

        .data-table th {
          text-align: left;
          padding: 1rem;
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid var(--border);
        }

        .data-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border);
          color: var(--text);
        }

        .data-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .index-cell {
          font-family: 'JetBrains Mono', monospace;
          color: var(--text-muted);
          font-weight: 600;
        }

        .solution-cell {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .solution-name-cell {
          font-weight: 600;
        }

        .formula-cell {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .ph-badge {
          display: inline-block;
          padding: 0.25rem 0.625rem;
          border-radius: 6px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          font-size: 0.8125rem;
        }

        .type-cell-badge {
          display: inline-block;
          padding: 0.25rem 0.625rem;
          border-radius: 99px;
          font-size: 0.6875rem;
          font-weight: 700;
        }

        .result-cell {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }

        .result-color {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .time-cell {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          z-index: 1000;
          animation: fade-in 0.2s ease;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px;
          max-width: 480px;
          width: 100%;
          box-shadow: var(--shadow);
          animation: slide-up 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
          position: relative;
        }

        .modal-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .modal-header h2 {
          font-size: 1.125rem;
          font-weight: 700;
          flex: 1;
        }

        .modal-close {
          position: absolute;
          right: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .modal-close:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text);
        }

        .modal-body {
          padding: 1.5rem;
        }

        .info-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          border-left: 3px solid;
          margin-bottom: 0.75rem;
        }

        .info-icon {
          font-size: 1.25rem;
        }

        .info-card h4 {
          font-size: 0.875rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .info-card p {
          font-size: 0.8125rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .modal-footer {
          padding: 0 1.5rem 1.5rem;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .lab-layout {
            grid-template-columns: 340px 1fr;
          }
        }

        @media (max-width: 1024px) {
          .lab-layout {
            grid-template-columns: 1fr;
          }
          
          .theory-layout {
            grid-template-columns: 1fr;
          }
          
          .header-content {
            flex-wrap: wrap;
            gap: 1rem;
          }
          
          .nav {
            order: 3;
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 640px) {
          .main {
            padding: 1rem;
          }
          
          .nav-btn span {
            display: none;
          }
          
          .nav-btn {
            padding: 0.625rem;
          }
          
          .preview-bar {
            flex-wrap: wrap;
          }
          
          .preview-arrow {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
