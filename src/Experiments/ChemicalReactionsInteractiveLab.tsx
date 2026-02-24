import { useState } from "react";
import { Flame, Trash2, Plus, RotateCcw, Microscope, FlaskConical, BookOpen, BarChart2, Zap } from "lucide-react";

const chemicals: Record<string, any> = {
  magnesium:       { name: "Magnesium (Mg)",           category: "combination",        color: "#C0C0C0", state: "Solid",    accent: "#94A3B8" },
  oxygen:          { name: "Oxygen (O₂)",               category: "combination",        color: "#BAE6FD", state: "Gas",      accent: "#38BDF8" },
  zinc:            { name: "Zinc (Zn)",                 category: "displacement",       color: "#D1D5DB", state: "Solid",    accent: "#9CA3AF" },
  copperSulfate:   { name: "Copper Sulfate (CuSO₄)",   category: "displacement",       color: "#3B82F6", state: "Solution", accent: "#3B82F6" },
  sodiumSulfate:   { name: "Sodium Sulfate (Na₂SO₄)",  category: "doubleDisplacement", color: "#FEF9C3", state: "Solution", accent: "#EAB308" },
  bariumChloride:  { name: "Barium Chloride (BaCl₂)",  category: "doubleDisplacement", color: "#CFFAFE", state: "Solution", accent: "#06B6D4" },
};

const reactionDatabase: Record<string, any> = {
  combination: {
    title: "Combination Reaction",
    equation: "2Mg + O₂ → 2MgO",
    type: "Synthesis / Exothermic",
    reactants: ["magnesium", "oxygen"],
    productColor: "#FEF9C3",
    productName: "Magnesium Oxide (MgO)",
    heatRequired: true,
    chemicalInfo: "Magnesium burns in oxygen with intense white brightness. Highly exothermic — temperature reaches ~3100°C.",
    observations: [
      "Bright white light emitted from the reaction",
      "Temperature rises dramatically to ~3100°C",
      "White ash of magnesium oxide forms",
      "Oxygen is consumed from surroundings",
      "Crackling sound may be heard",
    ],
  },
  displacement: {
    title: "Single Displacement Reaction",
    equation: "Zn + CuSO₄ → ZnSO₄ + Cu",
    type: "Single Displacement",
    reactants: ["zinc", "copperSulfate"],
    productColor: "#B45309",
    productName: "Zinc Sulfate (ZnSO₄) + Copper (Cu)",
    heatRequired: false,
    chemicalInfo: "Zinc is more reactive than copper and displaces it from copper sulfate solution.",
    observations: [
      "Solution colour changes from blue to colourless",
      "Reddish-brown copper deposits appear on zinc",
      "Precipitate settles at the bottom",
      "Temperature increases slightly",
      "Shiny copper layer visible on zinc surface",
    ],
  },
  doubleDisplacement: {
    title: "Double Displacement Reaction",
    equation: "Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl",
    type: "Double Displacement / Precipitation",
    reactants: ["sodiumSulfate", "bariumChloride"],
    productColor: "#F1F5F9",
    productName: "Barium Sulfate (BaSO₄) + Sodium Chloride (NaCl)",
    heatRequired: false,
    chemicalInfo: "Barium sulfate forms as an insoluble white precipitate when barium and sulfate ions combine.",
    observations: [
      "Thick white precipitate forms immediately",
      "Precipitate clouds the entire solution",
      "White solid settles to the bottom",
      "Solution becomes clear above precipitate",
      "Precipitate is insoluble in water",
    ],
  },
};

const modeConfig: Record<string, any> = {
  combination:        { label: "Combination",        color: "#EF4444", light: "#FEF2F2", border: "#FECACA" },
  displacement:       { label: "Displacement",       color: "#F59E0B", light: "#FFFBEB", border: "#FDE68A" },
  doubleDisplacement: { label: "Double Displacement",color: "#8B5CF6", light: "#F5F3FF", border: "#DDD6FE" },
};

export default function ChemicalReactionsInteractiveLabhem() {

  const [selectedMode, setSelectedMode] = useState("combination");
  const [beakers, setBeakers] = useState<any[]>([
    { id: 1, chemical: null, volume: 0, temperature: 20, color: "#FFFFFF", label: "Empty" },
    { id: 2, chemical: null, volume: 0, temperature: 20, color: "#FFFFFF", label: "Empty" },
  ]);
  const [selectedBeaker, setSelectedBeaker] = useState<number | null>(null);
  const [draggedChemical, setDraggedChemical] = useState<string | null>(null);
  const [dragOverBeaker, setDragOverBeaker] = useState<number | null>(null);
  const [reaction, setReaction] = useState<any>(null);
  const [observations, setObservations] = useState<any[]>([]);
  const [heatApplied, setHeatApplied] = useState<Record<number, boolean>>({});
  const [isReacting, setIsReacting] = useState(false);
  const [reactionPhase, setReactionPhase] = useState(0);
  const [activeTab, setActiveTab] = useState("lab");

  const currentReactionData = reactionDatabase[selectedMode];
  const availableChemicals = Object.entries(chemicals).filter(([, c]) => c.category === selectedMode);

  const addObs = (text: string) => setObservations(p => [{ id: Date.now() + Math.random(), text }, ...p]);

  const addChemicalToBeaker = (beakerId: number, chemKey: string) => {
    const chem = chemicals[chemKey];
    setBeakers(b => b.map(bk => bk.id === beakerId
      ? { ...bk, chemical: chemKey, volume: 50, color: chem.color, label: chem.name }
      : bk));
    addObs(`Added ${chem.name} to Beaker ${beakerId}`);
  };

  const applyHeat = (beakerId: number) => {
    setHeatApplied(h => ({ ...h, [beakerId]: true }));
    setBeakers(b => b.map(bk => bk.id === beakerId ? { ...bk, temperature: 150 } : bk));
    addObs(`Heat applied to Beaker ${beakerId} — Temperature: 150°C`);
  };

  const clearBeaker = (beakerId: number) => {
    setBeakers(b => b.map(bk => bk.id === beakerId
      ? { ...bk, chemical: null, volume: 0, temperature: 20, color: "#FFFFFF", label: "Empty" }
      : bk));
    setHeatApplied(h => ({ ...h, [beakerId]: false }));
    addObs(`Beaker ${beakerId} cleared`);
  };

  const deleteBeaker = (beakerId: number) => setBeakers(b => b.filter(bk => bk.id !== beakerId));

  const performReaction = () => {
    if (isReacting) return;
    const b1 = beakers[0]; const b2 = beakers[1];
    if (!b1?.chemical) { alert("Add a chemical to Beaker 1 first."); return; }
    if (!b2?.chemical) { alert("Add a chemical to Beaker 2 first."); return; }
    
    const reactantKeys = [b1.chemical, b2.chemical];
    const requiredKeys = currentReactionData.reactants;

    const hasAllReactants = requiredKeys.every((key: string) => reactantKeys.includes(key));

    if (!hasAllReactants) {
      const names = currentReactionData.reactants.map((r: string) => chemicals[r].name).join(" + ");
      alert(`Wrong chemicals! Required: ${names}`); return;
    }

    if (currentReactionData.heatRequired && !heatApplied[b1.id] && !heatApplied[b2.id]) {
      alert("This reaction requires heat! Apply heat to a beaker first."); return;
    }

    setIsReacting(true);
    addObs("Reaction started — mixing chemicals…");

    [0,1,2].forEach((i) => {
      setTimeout(() => {
        setReactionPhase(i + 1);
        addObs(currentReactionData.observations[i]);
      }, (i + 1) * 900);
    });

    setTimeout(() => {
      setBeakers(prev => prev.map((bk, idx) =>
        idx === 0
          ? { ...bk, chemical: "product", color: currentReactionData.productColor, label: currentReactionData.productName, volume: 60 }
          : idx === 1
          ? { ...bk, chemical: null, volume: 0, color: "#FFFFFF", label: "Empty" }
          : bk
      ));
      setReaction(currentReactionData);
      addObs(currentReactionData.observations[3]);
      addObs(currentReactionData.observations[4]);
      addObs("Reaction complete — products formed.");
      setIsReacting(false);
      setReactionPhase(0);
    }, 3600);
  };

  const resetLab = () => {
    setBeakers([
      { id: 1, chemical: null, volume: 0, temperature: 20, color: "#FFFFFF", label: "Empty" },
      { id: 2, chemical: null, volume: 0, temperature: 20, color: "#FFFFFF", label: "Empty" },
    ]);
    setObservations([]);
    setReaction(null);
    setHeatApplied({});
    setSelectedBeaker(null);
    setIsReacting(false);
    setReactionPhase(0);
  };

  const mc = modeConfig[selectedMode];

  return (
    <div className="root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: inherit; cursor: pointer; border: none; background: none; }

        .root { font-family: 'Plus Jakarta Sans', sans-serif; min-height: 100vh; background: #F8FAFF; }

        /* ── HEADER ── */
        .header {
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 40%, #0EA5E9 100%);
          padding: 0 32px; height: 72px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 50;
          box-shadow: 0 4px 24px rgba(79,70,229,0.35);
        }
        .brand { display: flex; align-items: center; gap: 14px; }
        .brand-icon {
          width: 42px; height: 42px; border-radius: 12px;
          background: rgba(255,255,255,0.2);
          border: 1.5px solid rgba(255,255,255,0.35);
          display: flex; align-items: center; justify-content: center;
        }
        .brand-name { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 700; color: #fff; letter-spacing: -0.5px; }
        .brand-sub  { font-size: 11px; color: rgba(255,255,255,0.65); font-weight: 500; margin-top: 2px; }
        .nav { display: flex; gap: 2px; background: rgba(0,0,0,0.2); border-radius: 12px; padding: 4px; }
        .nav-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 16px; border-radius: 9px;
          font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.65);
          transition: all .18s;
        }
        .nav-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }
        .nav-btn.active { background: #fff; color: #4F46E5; }

        /* ── MAIN ── */
        .main { max-width: 1180px; margin: 0 auto; padding: 28px 24px; }
        .lab-grid { display: grid; grid-template-columns: 290px 1fr; gap: 20px; align-items: start; }

        /* ── PANEL ── */
        .panel { background: #fff; border-radius: 20px; border: 1.5px solid #E8EEFF; box-shadow: 0 2px 16px rgba(79,70,229,0.06); overflow: hidden; }
        .panel-head { padding: 14px 18px; display: flex; align-items: center; gap: 10px; border-bottom: 1.5px solid #F0F4FF; }
        .panel-title { font-size: 13px; font-weight: 800; color: #1E293B; }

        /* ── MODE SELECTOR ── */
        .mode-bar { display: flex; gap: 10px; margin-bottom: 20px; }
        .mode-btn {
          flex: 1; padding: 12px 10px; border-radius: 14px;
          border: 2px solid; font-weight: 700; font-size: 13px;
          transition: all .18s; text-align: center;
        }

        /* ── CHEMICAL CARD ── */
        .chem-card {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 12px;
          border: 1.5px solid #F1F5F9; background: #FAFBFF;
          cursor: grab; user-select: none;
          transition: all .15s; width: 100%;
          text-align: left;
        }
        .chem-card:hover { border-color: #C7D2FE; background: #F0F4FF; transform: translateX(2px); }
        .chem-card.selected-target { border-color: #4F46E5; background: #EEF2FF; }
        .chem-dot { width: 12px; height: 12px; border-radius: 999px; border: 1.5px solid rgba(0,0,0,.1); flex-shrink: 0; }
        .chem-name { font-size: 12.5px; font-weight: 700; color: #1E293B; }
        .chem-state { font-size: 10.5px; color: #94A3B8; font-weight: 600; margin-top: 1px; font-family: 'JetBrains Mono', monospace; }

        /* ── HOW TO USE ── */
        .how-card { background: #F0F4FF; border-radius: 12px; padding: 14px; border: 1.5px solid #C7D2FE; }
        .how-title { font-size: 11px; font-weight: 800; color: #4F46E5; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 8px; }
        .how-item { font-size: 11.5px; color: #475569; margin-bottom: 5px; display: flex; gap: 6px; align-items: flex-start; }
        .how-dot { width: 5px; height: 5px; border-radius: 999px; background: #4F46E5; flex-shrink: 0; margin-top: 5px; }

        /* ── REACTION INFO ── */
        .rxn-info {
          border-radius: 16px; padding: 16px 18px; margin-bottom: 18px;
          border: 1.5px solid; display: flex; gap: 16px; align-items: flex-start;
        }
        .rxn-equation {
          font-family: 'JetBrains Mono', monospace;
          font-size: 15px; font-weight: 700; margin-bottom: 4px;
        }
        .rxn-type { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; opacity: .7; margin-bottom: 6px; }
        .rxn-desc { font-size: 12px; color: #475569; line-height: 1.6; }
        .heat-required {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 800;
          color: #EA580C; background: #FFF7ED; border: 1.5px solid #FED7AA;
          padding: 4px 10px; border-radius: 999px; margin-top: 8px;
        }

        /* ── WORKSPACE ── */
        .workspace {
          background: linear-gradient(160deg, #F8FAFF 0%, #F0F4FF 100%);
          border: 1.5px solid #E8EEFF; border-radius: 20px;
          padding: 28px; min-height: 400px;
          position: relative; overflow: hidden;
          margin-bottom: 16px;
        }
        .workspace::before {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(to right, #4F46E5, #7C3AED, #0EA5E9);
          border-radius: 0 0 20px 20px;
        }
        .beakers-row { display: flex; gap: 32px; flex-wrap: wrap; align-items: flex-end; }

        /* ── BEAKER ── */
        .beaker-wrap { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .beaker-svg-wrap {
          cursor: pointer; position: relative;
          transition: filter .2s;
        }
        .beaker-svg-wrap:hover { filter: brightness(1.03); }
        .beaker-label { font-size: 12px; font-weight: 700; color: #1E293B; text-align: center; max-width: 120px; }
        .beaker-meta { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #94A3B8; font-weight: 600; text-align: center; }
        .beaker-actions { display: flex; gap: 6px; }
        .bk-btn {
          width: 30px; height: 30px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; transition: all .15s;
          border: 1.5px solid;
        }
        .bk-btn-heat { color: #EA580C; border-color: #FED7AA; background: #FFF7ED; }
        .bk-btn-heat:hover { background: #FEF3C7; border-color: #F59E0B; }
        .bk-btn-heat:disabled { opacity: .4; cursor: not-allowed; }
        .bk-btn-clear { color: #64748B; border-color: #E2E8F0; background: #F8FAFC; }
        .bk-btn-clear:hover { background: #F1F5F9; border-color: #CBD5E1; }
        .bk-btn-del { color: #EF4444; border-color: #FECACA; background: #FEF2F2; }
        .bk-btn-del:hover { background: #FEE2E2; border-color: #EF4444; }

        /* ── REACTING OVERLAY ── */
        .reacting-overlay {
          position: absolute; inset: 0;
          background: rgba(248,250,255,0.88);
          border-radius: 20px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 14px;
          backdrop-filter: blur(4px);
        }
        .spin-ring {
          width: 52px; height: 52px; border-radius: 999px;
          border: 4px solid #C7D2FE;
          border-top-color: #4F46E5;
          animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .reacting-label { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; color: #4F46E5; }
        .reacting-phase { font-size: 11px; color: #94A3B8; font-family: 'JetBrains Mono', monospace; }

        /* ── CTA BUTTONS ── */
        .btn-react {
          width: 100%; padding: 14px; border-radius: 14px;
          background: linear-gradient(135deg, #4F46E5, #7C3AED);
          color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800; font-size: 15px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all .18s;
          box-shadow: 0 6px 20px rgba(79,70,229,0.35);
        }
        .btn-react:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(79,70,229,.45); }
        .btn-react:disabled { opacity: .4; cursor: not-allowed; }

        .btn-row { display: flex; gap: 10px; margin-top: 12px; }
        .btn-add {
          flex: 1; padding: 10px; border-radius: 12px;
          border: 1.5px solid #C7D2FE; background: #EEF2FF; color: #4F46E5;
          font-weight: 700; font-size: 13px;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: all .15s;
        }
        .btn-add:hover { background: #E0E7FF; border-color: #4F46E5; }
        .btn-reset {
          padding: 10px 16px; border-radius: 12px;
          border: 1.5px solid #E2E8F0; background: #fff; color: #64748B;
          font-weight: 700; font-size: 13px;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: all .15s;
        }
        .btn-reset:hover { border-color: #CBD5E1; background: #F8FAFC; }

        /* ── OBSERVATIONS ── */
        .obs-list { max-height: 320px; overflow-y: auto; padding-right: 2px; }
        .obs-list::-webkit-scrollbar { width: 3px; }
        .obs-list::-webkit-scrollbar-thumb { background: #C7D2FE; border-radius: 99px; }
        .obs-item {
          display: flex; gap: 10px; align-items: flex-start;
          padding: 10px 12px; border-radius: 10px;
          background: #FAFBFF; border: 1.5px solid #F0F4FF;
          margin-bottom: 6px;
          animation: fadeIn .3s ease both;
        }
        @keyframes fadeIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:none; } }
        .obs-dot { width: 7px; height: 7px; border-radius: 999px; background: #4F46E5; flex-shrink: 0; margin-top: 5px; }
        .obs-text { font-size: 12px; color: #374151; font-weight: 500; line-height: 1.5; }

        /* ── RESULT CARD ── */
        .result-card {
          border-radius: 16px; padding: 18px;
          border: 1.5px solid; overflow: hidden; position: relative;
        }
        .result-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 8px; }
        .result-product { font-size: 14px; font-weight: 800; color: #1E293B; margin-bottom: 4px; }
        .result-equation { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #64748B; }

        /* ── SECTION TITLE ── */
        .section-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px; font-weight: 700; color: #4F46E5;
          text-transform: uppercase; letter-spacing: .06em; margin-bottom: 14px;
        }

        /* ── THEORY TAB ── */
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .theory-row {
          display: flex; gap: 12px; align-items: flex-start;
          padding: 14px; border-radius: 12px; margin-bottom: 10px; border: 1.5px solid;
        }
        .theory-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .theory-label { font-size: 13px; font-weight: 800; margin-bottom: 3px; }
        .theory-desc  { font-size: 11.5px; color: #64748B; line-height: 1.55; }
      `}</style>

      {/* ── HEADER ── */}
      <header className="header">
        <div className="brand">
          <div className="brand-icon">
            <Microscope size={20} color="#fff" />
          </div>
          <div>
            <div className="brand-name">Chemical Reactions Lab</div>
            <div className="brand-sub">Virtual Chemistry Simulator</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <nav className="nav">
            {[
              { id:"lab",    icon:<FlaskConical size={13}/>, label:"Lab"     },
              { id:"theory", icon:<BookOpen     size={13}/>, label:"Theory"  },
              { id:"data",   icon:<BarChart2    size={13}/>, label:`Observations (${observations.length})` },
            ].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`nav-btn ${activeTab===t.id?"active":""}`}>
                {t.icon}{t.label}
              </button>
            ))}
          </nav>
          <button onClick={resetLab} style={{
            width:38, height:38, borderRadius:10,
            background:"rgba(255,255,255,0.15)",
            border:"1.5px solid rgba(255,255,255,.3)",
            display:"flex", alignItems:"center", justifyContent:"center",
            color:"#fff", transition:"all .18s",
          }}>
            <RotateCcw size={15}/>
          </button>
        </div>
      </header>

      <div className="main">

        {/* ══ LAB TAB ══ */}
        {activeTab === "lab" && (
          <>
            {/* Mode selector */}
            <div className="mode-bar">
              {Object.entries(modeConfig).map(([mode, cfg]) => {
                const active = selectedMode === mode;
                return (
                  <button key={mode}
                    className="mode-btn"
                    style={{
                      borderColor: active ? cfg.color : "#E2E8F0",
                      background:  active ? cfg.light : "#fff",
                      color:       active ? cfg.color : "#64748B",
                    }}
                    onClick={() => { setSelectedMode(mode); resetLab(); }}>
                    {cfg.label}
                  </button>
                );
              })}
            </div>

            <div className="lab-grid">

              {/* ── LEFT: Chemicals ── */}
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div className="panel">
                  <div className="panel-head">
                    <div style={{ width:22, height:22, borderRadius:7, background:"linear-gradient(135deg,#FF4757,#FF6B35)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontSize:10, fontWeight:900, color:"#fff" }}>1</span>
                    </div>
                    <span className="panel-title">Available Chemicals</span>
                  </div>
                  <div style={{ padding:14, display:"flex", flexDirection:"column", gap:8 }}>
                    {availableChemicals.map(([key, chem]) => (
                      <button key={key}
                        className={`chem-card ${selectedBeaker ? "selected-target" : ""}`}
                        draggable
                        onDragStart={() => setDraggedChemical(key)}
                        onDragEnd={() => setDraggedChemical(null)}
                        onClick={() => selectedBeaker && addChemicalToBeaker(selectedBeaker, key)}>
                        <div className="chem-dot" style={{ background:chem.color, boxShadow:`0 0 6px ${chem.accent}50` }}/>
                        <div>
                          <div className="chem-name">{chem.name}</div>
                          <div className="chem-state">{chem.state}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-head">
                    <div style={{ width:22, height:22, borderRadius:7, background:"linear-gradient(135deg,#7C3AED,#0EA5E9)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontSize:10, fontWeight:900, color:"#fff" }}>2</span>
                    </div>
                    <span className="panel-title">How to Use</span>
                  </div>
                  <div style={{ padding:14 }}>
                    <div className="how-card">
                      <div className="how-title">Instructions</div>
                      {[
                        "Click a beaker to select it, then click a chemical to add it",
                        "Or drag a chemical and drop it into a beaker",
                        "Apply heat if the reaction requires it",
                        "Click \"Run Reaction\" to observe results",
                      ].map((t, i) => (
                        <div key={i} className="how-item">
                          <div className="how-dot"/>
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── RIGHT: Workspace ── */}
              <div>
                {/* Reaction info banner */}
                <div className="rxn-info" style={{ background:mc.light, borderColor:mc.border }}>
                  <div style={{ flex:1 }}>
                    <div className="rxn-type" style={{ color:mc.color }}>{currentReactionData.type}</div>
                    <div className="rxn-equation" style={{ color:mc.color }}>{currentReactionData.equation}</div>
                    <div className="rxn-desc">{currentReactionData.chemicalInfo}</div>
                    {currentReactionData.heatRequired && (
                      <div className="heat-required">
                        <Flame size={12}/> Heat Required
                      </div>
                    )}
                  </div>
                </div>

                {/* Workspace */}
                <div className="workspace">
                  <div className="beakers-row">
                    {beakers.map(beaker => (
                      <BeakerComponent
                        key={beaker.id}
                        beaker={beaker}
                        isSelected={selectedBeaker === beaker.id}
                        isDragOver={dragOverBeaker === beaker.id}
                        heatApplied={!!heatApplied[beaker.id]}
                        canDelete={beakers.length > 1}
                        onSelect={() => setSelectedBeaker(beaker.id)}
                        onDragOver={(e: any) => { e.preventDefault(); setDragOverBeaker(beaker.id); }}
                        onDragLeave={() => setDragOverBeaker(null)}
                        onDrop={(e: any) => { e.preventDefault(); if (draggedChemical) { addChemicalToBeaker(beaker.id, draggedChemical); setDraggedChemical(null); setDragOverBeaker(null); }}}
                        onHeat={() => applyHeat(beaker.id)}
                        onClear={() => clearBeaker(beaker.id)}
                        onDelete={() => deleteBeaker(beaker.id)}
                      />
                    ))}
                  </div>

                  {isReacting && (
                    <div className="reacting-overlay">
                      <div className="spin-ring"/>
                      <div className="reacting-label">Reaction in Progress</div>
                      <div className="reacting-phase">Phase {reactionPhase} / 3</div>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <button className="btn-react" onClick={performReaction} disabled={isReacting}>
                  {isReacting ? "Running…" : <><Zap size={16}/> Run Reaction</>}
                </button>

                <div className="btn-row">
                  {beakers.length < 3 && (
                    <button className="btn-add" onClick={() => {
                      setBeakers(p => [...p, {
                        id: Math.max(...p.map(b => b.id), 0) + 1,
                        chemical: null, volume: 0, temperature: 20, color: "#FFFFFF", label: "Empty",
                      }]);
                    }}>
                      <Plus size={14}/> Add Beaker
                    </button>
                  )}
                  <button className="btn-reset" onClick={resetLab}>
                    <RotateCcw size={13}/> Reset Lab
                  </button>
                </div>

                {/* Result card */}
                {reaction && (
                  <div className="result-card" style={{ background:mc.light, borderColor:mc.border, marginTop:16 }}>
                    <div className="result-title" style={{ color:mc.color }}>Reaction Complete</div>
                    <div className="result-product">{reaction.productName}</div>
                    <div className="result-equation">{reaction.equation}</div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ══ THEORY TAB ══ */}
        {activeTab === "theory" && (
          <div className="two-col">
            <div className="panel" style={{ padding:24 }}>
              <div className="section-title">Types of Chemical Reactions</div>
              {[
                { color:"#EF4444", bg:"#FEF2F2", border:"#FECACA", label:"Combination (Synthesis)",
                  desc:"Two or more substances combine to form a single product. e.g. 2Mg + O₂ → 2MgO" },
                { color:"#F59E0B", bg:"#FFFBEB", border:"#FDE68A", label:"Single Displacement",
                  desc:"A more reactive element displaces a less reactive one from its compound. e.g. Zn + CuSO₄ → ZnSO₄ + Cu" },
                { color:"#8B5CF6", bg:"#F5F3FF", border:"#DDD6FE", label:"Double Displacement",
                  desc:"Ions of two compounds exchange places to form two new compounds. Often produces a precipitate." },
                { color:"#10B981", bg:"#ECFDF5", border:"#A7F3D0", label:"Decomposition",
                  desc:"A single compound breaks down into two or more simpler substances, usually with energy input." },
                { color:"#0EA5E9", bg:"#F0F9FF", border:"#BAE6FD", label:"Redox Reactions",
                  desc:"Involve transfer of electrons between substances. One species is oxidised, another is reduced." },
              ].map(item => (
                <div key={item.label} className="theory-row" style={{ background:item.bg, borderColor:item.border }}>
                  <div className="theory-icon" style={{ background:item.color + "20" }}>
                    <div style={{ width:14, height:14, borderRadius:999, background:item.color, boxShadow:`0 0 8px ${item.color}80` }}/>
                  </div>
                  <div>
                    <div className="theory-label" style={{ color:item.color }}>{item.label}</div>
                    <div className="theory-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="panel" style={{ padding:24 }}>
              <div className="section-title">Reactivity Series</div>
              <div style={{ background:"#F8FAFF", borderRadius:14, padding:16, border:"1.5px solid #E8EEFF", marginBottom:16 }}>
                {[
                  { el:"Potassium (K)",   rx:"Most Reactive",  color:"#EF4444" },
                  { el:"Sodium (Na)",     rx:"Very Reactive",  color:"#F97316" },
                  { el:"Calcium (Ca)",    rx:"Reactive",       color:"#F59E0B" },
                  { el:"Magnesium (Mg)", rx:"Reactive",        color:"#EAB308" },
                  { el:"Zinc (Zn)",       rx:"Moderate",       color:"#10B981" },
                  { el:"Iron (Fe)",       rx:"Moderate",       color:"#14B8A6" },
                  { el:"Copper (Cu)",     rx:"Low",            color:"#3B82F6" },
                  { el:"Silver (Ag)",     rx:"Very Low",       color:"#8B5CF6" },
                  { el:"Gold (Au)",       rx:"Least Reactive", color:"#6366F1" },
                ].map((item, i) => (
                  <div key={item.el} style={{
                    display:"flex", alignItems:"center", gap:10,
                    padding:"7px 10px", borderRadius:9,
                    background: i%2===0 ? "#F0F4FF" : "transparent",
                    marginBottom:3,
                  }}>
                    <div style={{ width:10, height:10, borderRadius:999, background:item.color, flexShrink:0 }}/>
                    <span style={{ fontSize:12.5, fontWeight:700, color:"#1E293B", flex:1 }}>{item.el}</span>
                    <span style={{ fontSize:11, fontWeight:600, color:item.color }}>{item.rx}</span>
                  </div>
                ))}
              </div>
              <div style={{ background:"#EEF2FF", borderRadius:12, padding:14, border:"1.5px solid #C7D2FE" }}>
                <div style={{ fontSize:11, fontWeight:800, color:"#4F46E5", textTransform:"uppercase", letterSpacing:".05em", marginBottom:6 }}>Key Rule</div>
                <p style={{ fontSize:12, color:"#475569", lineHeight:1.6 }}>
                  A metal higher in the reactivity series will displace a metal lower in the series from its salt solution.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ══ DATA TAB ══ */}
        {activeTab === "data" && (
          <div className="panel" style={{ padding:26 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <div className="section-title" style={{ marginBottom:0 }}>Observation Log</div>
              {observations.length > 0 && (
                <button onClick={() => setObservations([])} className="btn-reset" style={{ padding:"6px 12px", fontSize:12 }}>
                  <RotateCcw size={11}/> Clear
                </button>
              )}
            </div>
            {observations.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 0", color:"#CBD5E1" }}>
                <FlaskConical size={40} color="#E2E8F0" style={{ margin:"0 auto 12px" }}/>
                <div style={{ fontWeight:700, fontSize:15, color:"#94A3B8" }}>No observations yet</div>
                <div style={{ fontSize:12, marginTop:6, color:"#CBD5E1" }}>Run experiments in the Lab tab to see observations here.</div>
              </div>
            ) : (
              <div className="obs-list">
                {observations.map(obs => (
                  <div key={obs.id} className="obs-item">
                    <div className="obs-dot"/>
                    <div className="obs-text">{obs.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── BEAKER SVG COMPONENT ── */
function BeakerComponent({ beaker, isSelected, isDragOver, heatApplied, canDelete, onSelect, onDragOver, onDragLeave, onDrop, onHeat, onClear, onDelete }: any) {
  const uid = beaker.id;
  const hasLiquid = beaker.volume > 0;

  return (
    <div className="beaker-wrap">
      <div
        className="beaker-svg-wrap"
        onClick={onSelect}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <svg width="110" height="180" viewBox="0 0 110 180" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`liq-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={beaker.color} stopOpacity="0.75"/>
              <stop offset="100%" stopColor={beaker.color} stopOpacity="0.96"/>
            </linearGradient>
            <linearGradient id={`glass-${uid}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#fff" stopOpacity="0.5"/>
              <stop offset="30%"  stopColor="#fff" stopOpacity="0.05"/>
              <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.18"/>
            </linearGradient>
            <filter id={`sel-${uid}`}>
              <feDropShadow dx="0" dy="0" stdDeviation="6"
                floodColor={isSelected ? "#4F46E5" : isDragOver ? "#7C3AED" : "transparent"}
                floodOpacity="0.7"/>
            </filter>
            <clipPath id={`bk-clip-${uid}`}>
              <path d="M18 14 L14 168 Q14 176 55 176 Q96 176 96 168 L92 14 Z"/>
            </clipPath>
          </defs>

          {/* Beaker glass body */}
          <path d="M17 13 L13 168 Q13 177 55 177 Q97 177 97 168 L93 13 Z"
            fill="rgba(240,245,255,0.18)"
            stroke="#CBD5E1" strokeWidth="2.5"
            filter={`url(#sel-${uid})`}/>

          {/* Liquid */}
          {hasLiquid && (
            <>
              <rect x="14" y="78" width="82" height="98"
                fill={`url(#liq-${uid})`} clipPath={`url(#bk-clip-${uid})`}/>
              <ellipse cx="55" cy="78" rx="41" ry="5"
                fill={beaker.color} opacity="0.85"
                clipPath={`url(#bk-clip-${uid})`}/>
              {/* liquid surface shimmer */}
              <ellipse cx="35" cy="78" rx="10" ry="2"
                fill="white" opacity="0.25"
                clipPath={`url(#bk-clip-${uid})`}/>
            </>
          )}

          {/* Heat glow */}
          {heatApplied && (
            <rect x="14" y="130" width="82" height="46"
              fill="url(#heatGrad)" opacity="0.4"
              clipPath={`url(#bk-clip-${uid})`}>
              <animate attributeName="opacity" values="0.3;0.6;0.3" dur="1.2s" repeatCount="indefinite"/>
            </rect>
          )}
          <defs>
            <linearGradient id="heatGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#F97316" stopOpacity="1"/>
              <stop offset="100%" stopColor="#FCD34D" stopOpacity="0"/>
            </linearGradient>
          </defs>

          {/* Glass overlay */}
          <path d="M18 14 L14 168 Q14 176 55 176 Q96 176 96 168 L92 14 Z"
            fill={`url(#glass-${uid})`}/>

          {/* Left shine */}
          <rect x="22" y="18" width="7" height="120" rx="3.5"
            fill="white" opacity="0.25" clipPath={`url(#bk-clip-${uid})`}/>

          {/* Measurement lines */}
          {[40, 70, 100, 130].map(y => (
            <line key={y} x1="93" y1={y} x2="85" y2={y}
              stroke="#CBD5E1" strokeWidth="1" opacity="0.5"/>
          ))}

          {/* Spout */}
          <path d="M91 13 L100 6 L104 13" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5"/>

          {/* Rim */}
          <rect x="12" y="6" width="86" height="13" rx="5"
            fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5"/>
          <rect x="15" y="7.5" width="80" height="8" rx="4"
            fill="white" opacity="0.6"/>

          {/* Selected indicator ring */}
          {(isSelected || isDragOver) && (
            <path d="M17 13 L13 168 Q13 177 55 177 Q97 177 97 168 L93 13 Z"
              fill="none"
              stroke={isSelected ? "#4F46E5" : "#7C3AED"}
              strokeWidth="2.5" strokeDasharray="8 4" opacity="0.7"/>
          )}
        </svg>
      </div>

      <div className="beaker-label">{beaker.label}</div>
      <div className="beaker-meta">Beaker {beaker.id} · {beaker.temperature}°C</div>
      <div className="beaker-actions">
        <button className="bk-btn bk-btn-heat" onClick={e => { e.stopPropagation(); onHeat(); }} disabled={heatApplied} title="Apply Heat">
          <Flame size={13}/>
        </button>
        <button className="bk-btn bk-btn-clear" onClick={e => { e.stopPropagation(); onClear(); }} title="Clear">
          <RotateCcw size={13}/>
        </button>
        {canDelete && (
          <button className="bk-btn bk-btn-del" onClick={e => { e.stopPropagation(); onDelete(); }} title="Remove Beaker">
            <Trash2 size={13}/>
          </button>
        )}
      </div>
    </div>
  );
}
