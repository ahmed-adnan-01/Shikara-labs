import React, { useEffect, useState } from "react";
import {
  BarChart2,
  BookOpen,
  ChevronDown,
  Droplets,
  FlaskConical,
  Leaf,
  RotateCcw,
  Sun,
  Wind,
} from "lucide-react";

interface Particle {
  id: number;
  x: number;
  type: "O2" | "glucose";
}

type ReactionStep = "step1" | "step2" | "step3" | null;

type TabId = "lab" | "theory" | "data";

export default function PhotosynthesisVirtualLab() {
  const [activeTab, setActiveTab] = useState<TabId>("lab");
  const [lightOn, setLightOn] = useState(false);
  const [waterOn, setWaterOn] = useState(false);
  const [co2On, setCo2On] = useState(false);
  const [lightAbsorbed, setLightAbsorbed] = useState(0);
  const [oxygenReleased, setOxygenReleased] = useState(0);
  const [energyProduced, setEnergyProduced] = useState(0);
  const [glucoseFormed, setGlucoseFormed] = useState(0);
  const [starchStored, setStarchStored] = useState(0);
  const [expandedStep, setExpandedStep] = useState<0 | 1 | 2 | 3 | 4>(1);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [activeReaction, setActiveReaction] = useState<ReactionStep>(null);
  const [tick, setTick] = useState(0);

  // Global animation ticker
  useEffect(() => {
    const t = window.setInterval(() => setTick((p) => p + 1), 80);
    return () => window.clearInterval(t);
  }, []);

  // Step 1 – Light Absorption
  useEffect(() => {
    let iv: number | undefined;
    if (lightOn) {
      setActiveReaction("step1");
      iv = window.setInterval(() => setLightAbsorbed((p) => p + 1), 600);
    } else {
      setLightAbsorbed(0);
      setActiveReaction(null);
    }
    return () => {
      if (iv !== undefined) window.clearInterval(iv);
    };
  }, [lightOn]);

  // Step 2 – Light Reactions
  useEffect(() => {
    let iv: number | undefined;
    if (lightOn && waterOn) {
      setActiveReaction("step2");
      iv = window.setInterval(() => {
        setOxygenReleased((p) => p + 1);
        setEnergyProduced((p) => Math.min(p + 2.5, 100));
        setParticles((prev) =>
          [
            ...prev,
            ...Array.from({ length: 2 }, () => ({
              id: Math.random(),
              x: 20 + Math.random() * 60,
              type: "O2" as const,
            })),
          ].slice(-24)
        );
      }, 700);
    }
    return () => {
      if (iv !== undefined) window.clearInterval(iv);
    };
  }, [lightOn, waterOn]);

  // Step 3 – Dark Reactions
  useEffect(() => {
    let iv: number | undefined;
    if (energyProduced > 30 && co2On) {
      setActiveReaction("step3");
      iv = window.setInterval(() => {
        setGlucoseFormed((p) => p + 0.6);
        setEnergyProduced((p) => Math.max(p - 1.2, 0));
        setParticles((prev) =>
          [
            ...prev,
            {
              id: Math.random(),
              x: 70 + Math.random() * 30,
              type: "glucose" as const,
            },
          ].slice(-24)
        );
      }, 900);
    }
    return () => {
      if (iv !== undefined) window.clearInterval(iv);
    };
  }, [energyProduced, co2On]);

  // Step 4 – Storage (derive starch from new glucose)
  useEffect(() => {
    if (glucoseFormed > 0) setStarchStored((p) => p + glucoseFormed * 0.08);
  }, [glucoseFormed]);

  const reset = () => {
    setLightOn(false);
    setWaterOn(false);
    setCo2On(false);
    setLightAbsorbed(0);
    setOxygenReleased(0);
    setEnergyProduced(0);
    setGlucoseFormed(0);
    setStarchStored(0);
    setParticles([]);
    setActiveReaction(null);
    setExpandedStep(1);
  };

  const leafGreen = activeReaction ? "#22C55E" : "#94A3B8";

  return (
    <div className="min-h-screen bg-slate-50">
      <PhotosynthesisStyles />

      <div className="root">
        {/* HEADER */}
        <header className="header">
          <div className="brand">
            <div className="brand-icon">
              <Leaf size={20} color="#fff" />
            </div>
            <div>
              <div className="brand-name">Photosynthesis Lab</div>
              <div className="brand-sub">Virtual Biology Simulator</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <nav className="nav">
              {[
                { id: "lab" as TabId, icon: <FlaskConical size={13} />, label: "Lab" },
                { id: "theory" as TabId, icon: <BookOpen size={13} />, label: "Theory" },
                { id: "data" as TabId, icon: <BarChart2 size={13} />, label: "Data" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`nav-btn ${activeTab === t.id ? "active" : ""}`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </nav>
            <button
              className="reset-btn"
              type="button"
              onClick={reset}
              aria-label="Reset lab"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </header>

        <div className="main">
          {activeTab === "lab" && (
            <LabTab
              lightOn={lightOn}
              waterOn={waterOn}
              co2On={co2On}
              lightAbsorbed={lightAbsorbed}
              oxygenReleased={oxygenReleased}
              energyProduced={energyProduced}
              glucoseFormed={glucoseFormed}
              starchStored={starchStored}
              expandedStep={expandedStep}
              setExpandedStep={setExpandedStep}
              setLightOn={setLightOn}
              setWaterOn={setWaterOn}
              setCo2On={setCo2On}
              particles={particles}
              activeReaction={activeReaction}
              tick={tick}
              leafGreen={leafGreen}
            />
          )}

          {activeTab === "theory" && <TheoryTab />}

          {activeTab === "data" && (
            <DataTab
              lightAbsorbed={lightAbsorbed}
              oxygenReleased={oxygenReleased}
              energyProduced={energyProduced}
              glucoseFormed={glucoseFormed}
              starchStored={starchStored}
              activeReaction={activeReaction}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function PhotosynthesisStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      button { font-family: inherit; cursor: pointer; border: none; background: none; }

      .root { font-family: 'Plus Jakarta Sans', sans-serif; min-height: 100vh; background: radial-gradient(circle at top left,#e0f2fe,#eef2ff 40%,#f8fafc 70%); }

      .header {
        background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 40%, #0EA5E9 100%);
        padding: 0 32px; height: 72px;
        display: flex; align-items: center; justify-content: space-between;
        position: sticky; top: 0; z-index: 50;
        box-shadow: 0 6px 30px rgba(15,23,42,0.35);
        backdrop-filter: blur(16px);
      }
      .brand { display: flex; align-items: center; gap: 14px; }
      .brand-icon {
        width: 42px; height: 42px; border-radius: 12px;
        background: rgba(255,255,255,0.16);
        border: 1.5px solid rgba(255,255,255,0.35);
        display: flex; align-items: center; justify-content: center;
      }
      .brand-name { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 700; color: #fff; letter-spacing: -0.5px; }
      .brand-sub  { font-size: 11px; color: rgba(241,245,249,0.9); font-weight: 500; margin-top: 2px; }
      .nav { display: flex; gap: 2px; background: rgba(15,23,42,0.45); border-radius: 12px; padding: 4px; }
      .nav-btn {
        display: flex; align-items: center; gap: 6px;
        padding: 7px 16px; border-radius: 999px;
        font-size: 13px; font-weight: 700; color: rgba(226,232,240,0.86);
        transition: all .18s;
      }
      .nav-btn:hover { background: rgba(248,250,252,0.12); color: #fff; }
      .nav-btn.active { background: #fff; color: #4F46E5; box-shadow: 0 8px 20px rgba(15,23,42,0.25); }
      .reset-btn {
        width: 38px; height: 38px; border-radius: 999px;
        background: rgba(15,23,42,0.38);
        border: 1.5px solid rgba(248,250,252,0.35);
        display: flex; align-items: center; justify-content: center;
        color: #fff; transition: all .18s;
      }
      .reset-btn:hover { background: rgba(15,23,42,0.7); transform: translateY(-1px); }

      .main { max-width: 1120px; margin: 0 auto; padding: 28px 24px 40px; }

      .panel { background: rgba(255,255,255,0.98); border-radius: 20px; border: 1.5px solid #E2E8F0; box-shadow: 0 18px 70px rgba(15,23,42,0.08); overflow: hidden; }

      .section-title {
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px; font-weight: 700; color: #4F46E5;
        text-transform: uppercase; letter-spacing: .14em; margin-bottom: 16px;
      }

      .eq-banner {
        background: linear-gradient(135deg, #EEF2FF, #F0FDF4);
        border: 1.5px solid #C7D2FE; border-radius: 20px;
        padding: 20px 28px; margin-bottom: 24px;
        display: flex; align-items: center; justify-content: center;
        gap: 12px; flex-wrap: wrap;
      }
      .eq-part { font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 700; }
      .eq-arrow { color: #94A3B8; font-size: 20px; }

      .step-card {
        border-radius: 18px; border: 1.5px solid;
        overflow: hidden; margin-bottom: 12px;
        transition: box-shadow .2s, transform .18s;
      }
      .step-card.active { box-shadow: 0 14px 40px rgba(15,23,42,0.15); transform: translateY(-1px); }
      .step-header {
        width: 100%; display: flex; align-items: center; gap: 14px;
        padding: 16px 20px; text-align: left; transition: background .15s;
      }
      .step-header:hover { filter: brightness(.98); }
      .step-num {
        width: 42px; height: 42px; border-radius: 12px;
        display: flex; align-items: center; justify-content: center;
        font-family: 'JetBrains Mono', monospace;
        font-size: 16px; font-weight: 800; flex-shrink: 0;
      }
      .step-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .12em; margin-bottom: 2px; }
      .step-title { font-size: 17px; font-weight: 800; }
      .step-body { border-top: 1.5px solid; padding: 20px; background: rgba(248,250,252,0.9); }

      .toggle-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
      .toggle-label { font-size: 14px; font-weight: 700; color: #1E293B; display: flex; align-items: center; gap: 8px; }
      .toggle-track {
        width: 52px; height: 28px; border-radius: 999px;
        border: 1.5px solid; display: flex; align-items: center;
        padding: 3px; cursor: pointer; transition: all .2s;
        position: relative;
      }
      .toggle-thumb {
        width: 20px; height: 20px; border-radius: 999px; background: #fff;
        box-shadow: 0 1px 4px rgba(0,0,0,.25);
        transition: transform .2s;
        flex-shrink: 0;
      }

      .meter-wrap { margin-top: 10px; }
      .meter-label { display: flex; justify-content: space-between; margin-bottom: 4px; }
      .meter-key   { font-size: 11px; font-weight: 700; color: #94A3B8; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: .08em; }
      .meter-val   { font-size: 11px; font-weight: 800; font-family: 'JetBrains Mono', monospace; }
      .meter-track { height: 9px; background: #F1F5F9; border-radius: 999px; overflow: hidden; }
      .meter-fill  { height: 100%; border-radius: 999px; transition: width .3s; }

      .stat-card {
        border-radius: 14px; padding: 16px; border: 1.5px solid; text-align: center;
      }
      .stat-value { font-family: 'JetBrains Mono', monospace; font-size: 28px; font-weight: 800; line-height: 1; margin-bottom: 4px; }
      .stat-unit  { font-size: 11px; color: #94A3B8; font-weight: 600; text-transform: uppercase; letter-spacing: .14em; }

      .viz-area {
        background: radial-gradient(circle at top, #F0FDF4 0%, #ECFDF5 55%, #F0F9FF 100%);
        border: 1.5px solid #BBF7D0; border-radius: 24px;
        padding: 28px; margin-bottom: 20px; position: relative;
        overflow: hidden; min-height: 320px;
      }
      .viz-area::after {
        content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
        background: linear-gradient(to right, #4F46E5, #10B981, #0EA5E9);
        border-radius: 0 0 20px 20px;
      }

      @keyframes lightRay {
        0%,100% { opacity: .25; transform: scaleY(1); }
        50%      { opacity: .65; transform: scaleY(1.08); }
      }
      .light-ray {
        position: absolute; width: 3px; border-radius: 99px;
        background: linear-gradient(to bottom, #FDE047, rgba(253,224,71,0));
        top: 0; height: 220px;
        animation: lightRay 1.4s ease-in-out infinite;
      }

      @keyframes floatUp {
        0%   { transform: translateY(0)     scale(1);   opacity: .9; }
        100% { transform: translateY(-180px) scale(.4);  opacity: 0; }
      }
      .particle {
        position: absolute; border-radius: 999px;
        animation: floatUp 2.2s ease-out forwards;
      }

      .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
      .theory-row {
        display: flex; gap: 12px; align-items: flex-start;
        padding: 14px; border-radius: 12px; margin-bottom: 10px; border: 1.5px solid;
      }
      .theory-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .theory-label { font-size: 13px; font-weight: 800; margin-bottom: 3px; }
      .theory-desc  { font-size: 12px; color: #64748B; line-height: 1.55; }

      .eq-box {
        background: #F8FAFF; border: 1.5px solid #E8EEFF; border-radius: 12px;
        padding: 16px; text-align: center; margin-bottom: 14px;
      }
      .eq-main { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: #1E293B; line-height: 2; }

      .data-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 20px; }
      .data-card {
        background: #fff; border-radius: 16px; border: 1.5px solid #E8EEFF;
        padding: 18px 16px; text-align: center;
        box-shadow: 0 10px 30px rgba(15,23,42,.06);
      }
      .data-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: .14em; margin-bottom: 8px; }
      .data-val   { font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 800; line-height: 1; }
      .data-unit  { font-size: 11px; color: #94A3B8; margin-top: 4px; }

      @media (max-width: 960px) {
        .main { padding-inline: 16px; }
        .two-col { grid-template-columns: 1fr; }
      }

      @media (max-width: 900px) {
        .header { padding-inline: 16px; }
        .main { padding-top: 20px; }
      }
    `}</style>
  );
}

interface LabTabProps {
  lightOn: boolean;
  waterOn: boolean;
  co2On: boolean;
  lightAbsorbed: number;
  oxygenReleased: number;
  energyProduced: number;
  glucoseFormed: number;
  starchStored: number;
  expandedStep: 0 | 1 | 2 | 3 | 4;
  setExpandedStep: (step: 0 | 1 | 2 | 3 | 4) => void;
  setLightOn: React.Dispatch<React.SetStateAction<boolean>>;
  setWaterOn: React.Dispatch<React.SetStateAction<boolean>>;
  setCo2On: React.Dispatch<React.SetStateAction<boolean>>;
  particles: Particle[];
  activeReaction: ReactionStep;
  tick: number;
  leafGreen: string;
}

function LabTab(props: LabTabProps) {
  const {
    lightOn,
    waterOn,
    co2On,
    lightAbsorbed,
    oxygenReleased,
    energyProduced,
    glucoseFormed,
    starchStored,
    expandedStep,
    setExpandedStep,
    setLightOn,
    setWaterOn,
    setCo2On,
    particles,
    activeReaction,
    tick,
    leafGreen,
  } = props;

  return (
    <>
      <div className="eq-banner">
        <span className="eq-part" style={{ color: "#3B82F6" }}>
          6CO₂
        </span>
        <span style={{ color: "#94A3B8", fontSize: 18 }}>+</span>
        <span className="eq-part" style={{ color: "#06B6D4" }}>
          6H₂O
        </span>
        <span style={{ color: "#94A3B8", fontSize: 18 }}>+</span>
        <span className="eq-part" style={{ color: "#F59E0B" }}>
          Light
        </span>
        <span className="eq-arrow">→</span>
        <span className="eq-part" style={{ color: "#10B981" }}>
          C₆H₁₂O₆
        </span>
        <span style={{ color: "#94A3B8", fontSize: 18 }}>+</span>
        <span className="eq-part" style={{ color: "#0EA5E9" }}>
          6O₂
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,340px) minmax(0,1fr)",
          gap: 20,
        }}
      >
        <div>
          <StepCard
            number={1}
            title="Light Absorption"
            color="#F59E0B"
            bg="#FFFBEB"
            border="#FDE68A"
            activeBg="#FEF3C7"
            isActive={lightAbsorbed > 0}
            expanded={expandedStep === 1}
            onToggle={() => setExpandedStep(expandedStep === 1 ? 0 : 1)}
          >
            <p
              style={{
                fontSize: 12,
                color: "#64748B",
                lineHeight: 1.6,
                marginBottom: 14,
              }}
            >
              Chlorophyll in the leaf captures sunlight. The light energy drives
              the photosynthesis reactions inside the chloroplast.
            </p>
            <Toggle
              on={lightOn}
              onToggle={() => setLightOn((p) => !p)}
              label="Sunlight"
              color="#F59E0B"
              icon={<Sun size={14} />}
            />
            <div className="meter-wrap">
              <div className="meter-label">
                <span className="meter-key">Light absorbed</span>
                <span className="meter-val" style={{ color: "#F59E0B" }}>
                  {lightAbsorbed}
                </span>
              </div>
              <div className="meter-track">
                <div
                  className="meter-fill"
                  style={{
                    width: `${Math.min(lightAbsorbed * 4, 100)}%`,
                    background:
                      "linear-gradient(to right,#FDE047,#F59E0B)",
                  }}
                />
              </div>
            </div>
          </StepCard>

          <StepCard
            number={2}
            title="Light Reactions"
            color="#06B6D4"
            bg="#F0FDFA"
            border="#99F6E4"
            activeBg="#CCFBF1"
            isActive={oxygenReleased > 0}
            expanded={expandedStep === 2}
            onToggle={() => setExpandedStep(expandedStep === 2 ? 0 : 2)}
          >
            <p
              style={{
                fontSize: 12,
                color: "#64748B",
                lineHeight: 1.6,
                marginBottom: 14,
              }}
            >
              Water molecules are split using light energy (photolysis). Oxygen
              is released as a byproduct and ATP + NADPH are produced.
            </p>
            <Toggle
              on={waterOn}
              onToggle={() => setWaterOn((p) => !p)}
              label="Water (H₂O)"
              color="#06B6D4"
              icon={<Droplets size={14} />}
              disabled={!lightOn}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginTop: 12,
              }}
            >
              <div
                className="stat-card"
                style={{ background: "#F0FDFA", borderColor: "#99F6E4" }}
              >
                <div className="stat-value" style={{ color: "#0891B2" }}>
                  {oxygenReleased}
                </div>
                <div className="stat-unit">O₂ released</div>
              </div>
              <div
                className="stat-card"
                style={{ background: "#FFFBEB", borderColor: "#FDE68A" }}
              >
                <div className="stat-value" style={{ color: "#D97706" }}>
                  {energyProduced.toFixed(0)}%
                </div>
                <div className="stat-unit">ATP energy</div>
              </div>
            </div>
          </StepCard>

          <StepCard
            number={3}
            title="Dark Reactions (Calvin Cycle)"
            color="#10B981"
            bg="#F0FDF4"
            border="#BBF7D0"
            activeBg="#D1FAE5"
            isActive={glucoseFormed > 0}
            expanded={expandedStep === 3}
            onToggle={() => setExpandedStep(expandedStep === 3 ? 0 : 3)}
          >
            <p
              style={{
                fontSize: 12,
                color: "#64748B",
                lineHeight: 1.6,
                marginBottom: 14,
              }}
            >
              CO₂ is fixed using ATP energy in the Calvin Cycle to produce
              glucose. Light is not directly needed here.
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: energyProduced > 30 ? "#D1FAE5" : "#F1F5F9",
                border: `1.5px solid ${
                  energyProduced > 30 ? "#6EE7B7" : "#E2E8F0"
                }`,
                borderRadius: 10,
                padding: "8px 12px",
                marginBottom: 12,
                fontSize: 11,
                fontWeight: 700,
                color: energyProduced > 30 ? "#059669" : "#94A3B8",
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              {energyProduced > 30
                ? `ATP ready: ${Math.floor(energyProduced)}%`
                : `Need more ATP — currently ${Math.floor(energyProduced)}%`}
            </div>
            <Toggle
              on={co2On}
              onToggle={() => setCo2On((p) => !p)}
              label="CO₂ Supply"
              color="#10B981"
              icon={<Wind size={14} />}
              disabled={energyProduced <= 30}
            />
            <div className="meter-wrap" style={{ marginTop: 12 }}>
              <div className="meter-label">
                <span className="meter-key">Glucose formed</span>
                <span className="meter-val" style={{ color: "#10B981" }}>
                  {glucoseFormed.toFixed(1)}
                </span>
              </div>
              <div className="meter-track">
                <div
                  className="meter-fill"
                  style={{
                    width: `${Math.min(glucoseFormed * 10, 100)}%`,
                    background:
                      "linear-gradient(to right,#34D399,#10B981)",
                  }}
                />
              </div>
            </div>
          </StepCard>

          <StepCard
            number={4}
            title="Food Storage"
            color="#8B5CF6"
            bg="#F5F3FF"
            border="#DDD6FE"
            activeBg="#EDE9FE"
            isActive={starchStored > 0}
            expanded={expandedStep === 4}
            onToggle={() => setExpandedStep(expandedStep === 4 ? 0 : 4)}
          >
            <p
              style={{
                fontSize: 12,
                color: "#64748B",
                lineHeight: 1.6,
                marginBottom: 14,
              }}
            >
              Glucose is converted to starch for storage. The plant uses stored
              food for growth, respiration, and repair.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <div
                className="stat-card"
                style={{ background: "#F0FDF4", borderColor: "#BBF7D0" }}
              >
                <div className="stat-value" style={{ color: "#10B981" }}>
                  {glucoseFormed.toFixed(1)}
                </div>
                <div className="stat-unit">Glucose units</div>
              </div>
              <div
                className="stat-card"
                style={{ background: "#F5F3FF", borderColor: "#DDD6FE" }}
              >
                <div className="stat-value" style={{ color: "#8B5CF6" }}>
                  {starchStored.toFixed(1)}
                </div>
                <div className="stat-unit">Starch stored</div>
              </div>
            </div>
            <div className="meter-wrap" style={{ marginTop: 12 }}>
              <div className="meter-label">
                <span className="meter-key">Storage</span>
                <span className="meter-val" style={{ color: "#8B5CF6" }}>
                  {Math.min(starchStored * 2, 100).toFixed(0)}%
                </span>
              </div>
              <div className="meter-track">
                <div
                  className="meter-fill"
                  style={{
                    width: `${Math.min(starchStored * 2, 100)}%`,
                    background:
                      "linear-gradient(to right,#A78BFA,#8B5CF6)",
                  }}
                />
              </div>
            </div>
          </StepCard>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="viz-area">
            {lightOn && (
              <div style={{ position: "absolute", top: 16, right: 24 }}>
                <svg width="60" height="60" viewBox="0 0 60 60">
                  <circle cx="30" cy="30" r="14" fill="#FDE047" opacity={0.95} />
                  {Array.from({ length: 8 }, (_, i) => {
                    const a = (i / 8) * Math.PI * 2;
                    const x1 = 30 + Math.cos(a) * 17;
                    const y1 = 30 + Math.sin(a) * 17;
                    const x2 = 30 + Math.cos(a) * 26;
                    const y2 = 30 + Math.sin(a) * 26;
                    return (
                      <line
                        // eslint-disable-next-line react/no-array-index-key
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#FDE047"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        opacity={0.8}
                      />
                    );
                  })}
                  <circle
                    cx="30"
                    cy="30"
                    r="22"
                    fill="none"
                    stroke="#FDE047"
                    strokeWidth={1}
                    opacity={0.3}
                  />
                </svg>
              </div>
            )}

            {lightOn &&
              [22, 38, 54].map((left, i) => (
                <div
                  key={left}
                  className="light-ray"
                  style={{ left: `${left}%`, animationDelay: `${i * 0.45}s` }}
                />
              ))}

            {particles
              .filter((p) => p.type === "O2")
              .slice(0, 10)
              .map((p) => (
                <div
                  key={p.id}
                  className="particle"
                  style={{
                    left: `${p.x}%`,
                    bottom: 90,
                    width: 10,
                    height: 10,
                    background: "#06B6D4",
                    boxShadow: "0 0 6px #06B6D4",
                  }}
                />
              ))}

            {particles
              .filter((p) => p.type === "glucose")
              .slice(0, 5)
              .map((p) => (
                <div
                  key={p.id}
                  className="particle"
                  style={{
                    left: `${p.x}%`,
                    bottom: 90,
                    width: 10,
                    height: 10,
                    background: "#10B981",
                    boxShadow: "0 0 6px #10B981",
                  }}
                />
              ))}

            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <LeafSVG active={!!activeReaction} glowColor={leafGreen} tick={tick} />

              <div style={{ textAlign: "center", marginTop: 8 }}>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 13,
                    fontWeight: 800,
                    color: activeReaction ? "#059669" : "#94A3B8",
                    background: activeReaction ? "#D1FAE5" : "#F1F5F9",
                    border: `1.5px solid ${
                      activeReaction ? "#6EE7B7" : "#E2E8F0"
                    }`,
                    borderRadius: 999,
                    padding: "5px 16px",
                    display: "inline-block",
                  }}
                >
                  {!lightOn && !waterOn && !co2On &&
                    "Ready — enable inputs to start"}
                  {lightOn && !waterOn && "Step 1: Absorbing light energy"}
                  {lightOn && waterOn && oxygenReleased === 0 &&
                    "Step 2: Splitting water…"}
                  {oxygenReleased > 0 && glucoseFormed === 0 &&
                    "Step 2: O₂ releasing, ATP building"}
                  {glucoseFormed > 0 && starchStored < 1 &&
                    "Step 3: Calvin cycle active"}
                  {starchStored >= 1 && "Step 4: Storing glucose as starch"}
                </div>
              </div>
            </div>

            {waterOn && <WaterDrops tick={tick} />}
            {co2On && energyProduced > 30 && <CO2Molecules tick={tick} />}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0,1fr))",
              gap: 10,
            }}
          >
            {[
              {
                label: "O₂ Released",
                val: oxygenReleased,
                unit: "molecules",
                color: "#06B6D4",
                bg: "#F0FDFA",
                border: "#99F6E4",
              },
              {
                label: "ATP Energy",
                val: `${energyProduced.toFixed(0)}%`,
                unit: "charged",
                color: "#F59E0B",
                bg: "#FFFBEB",
                border: "#FDE68A",
              },
              {
                label: "Glucose Formed",
                val: glucoseFormed.toFixed(1),
                unit: "units",
                color: "#10B981",
                bg: "#F0FDF4",
                border: "#BBF7D0",
              },
              {
                label: "Starch Stored",
                val: starchStored.toFixed(1),
                unit: "units",
                color: "#8B5CF6",
                bg: "#F5F3FF",
                border: "#DDD6FE",
              },
            ].map((m) => (
              <div
                key={m.label}
                style={{
                  background: m.bg,
                  borderRadius: 14,
                  border: `1.5px solid ${m.border}`,
                  padding: "12px 10px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 9,
                    fontWeight: 800,
                    color: "#94A3B8",
                    textTransform: "uppercase",
                    letterSpacing: ".05em",
                    marginBottom: 5,
                  }}
                >
                  {m.label}
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 20,
                    fontWeight: 800,
                    color: m.color,
                    lineHeight: 1,
                  }}
                >
                  {m.val}
                </div>
                <div style={{ fontSize: 9, color: "#94A3B8", marginTop: 3 }}>
                  {m.unit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function TheoryTab() {
  return (
    <div className="two-col">
      <div className="panel" style={{ padding: 24 }}>
        <div className="section-title">Photosynthesis Overview</div>
        <div className="eq-box">
          <div className="eq-main">
            <span style={{ color: "#3B82F6" }}>6CO₂</span>
            {" + "}
            <span style={{ color: "#06B6D4" }}>6H₂O</span>
            {" + "}
            <span style={{ color: "#F59E0B" }}>Light</span>
            {" → "}
            <span style={{ color: "#10B981" }}>C₆H₁₂O₆</span>
            {" + "}
            <span style={{ color: "#0EA5E9" }}>6O₂</span>
          </div>
        </div>
        {[
          {
            color: "#F59E0B",
            bg: "#FFFBEB",
            border: "#FDE68A",
            label: "Step 1 — Light Absorption",
            desc: "Chlorophyll pigments in the thylakoid membrane absorb sunlight, primarily red and blue wavelengths.",
          },
          {
            color: "#06B6D4",
            bg: "#F0FDFA",
            border: "#99F6E4",
            label: "Step 2 — Light Reactions (Photolysis)",
            desc: "Water is split by light energy into H⁺, electrons, and O₂. ATP and NADPH are produced to power the Calvin Cycle.",
          },
          {
            color: "#10B981",
            bg: "#F0FDF4",
            border: "#BBF7D0",
            label: "Step 3 — Dark Reactions (Calvin Cycle)",
            desc: "CO₂ is fixed into organic molecules using ATP and NADPH. Three turns of the cycle produce one molecule of G3P, which becomes glucose.",
          },
          {
            color: "#8B5CF6",
            bg: "#F5F3FF",
            border: "#DDD6FE",
            label: "Step 4 — Food Storage",
            desc: "Excess glucose is polymerised into starch for storage in leaves, seeds, and roots for later use by the plant.",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="theory-row"
            style={{ background: item.bg, borderColor: item.border }}
          >
            <div
              className="theory-icon"
              style={{ background: `${item.color}22` }}
            >
              <div
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: 999,
                  background: item.color,
                  boxShadow: `0 0 8px ${item.color}80`,
                }}
              />
            </div>
            <div>
              <div className="theory-label" style={{ color: item.color }}>
                {item.label}
              </div>
              <div className="theory-desc">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="panel" style={{ padding: 24 }}>
        <div className="section-title">Key Concepts</div>
        {[
          {
            color: "#4F46E5",
            bg: "#EEF2FF",
            border: "#C7D2FE",
            label: "Chloroplast Structure",
            desc: "Photosynthesis occurs in chloroplasts. Light reactions take place in the thylakoid membranes; dark reactions occur in the stroma.",
          },
          {
            color: "#10B981",
            bg: "#F0FDF4",
            border: "#BBF7D0",
            label: "Chlorophyll",
            desc: "The green pigment that absorbs red (~680nm) and blue (~450nm) light. It reflects green light, giving leaves their colour.",
          },
          {
            color: "#F59E0B",
            bg: "#FFFBEB",
            border: "#FDE68A",
            label: "Limiting Factors",
            desc: "Rate of photosynthesis is limited by whichever resource is in shortest supply: light intensity, CO₂ concentration, or temperature.",
          },
          {
            color: "#EF4444",
            bg: "#FEF2F2",
            border: "#FECACA",
            label: "Importance",
            desc: "Photosynthesis is the foundation of almost all food chains on Earth. It converts solar energy into chemical energy stored in glucose.",
          },
          {
            color: "#0EA5E9",
            bg: "#F0F9FF",
            border: "#BAE6FD",
            label: "Oxygen Production",
            desc: "All atmospheric oxygen (21%) is a byproduct of billions of years of photosynthesis. Each glucose molecule releases 6 O₂ molecules.",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="theory-row"
            style={{ background: item.bg, borderColor: item.border }}
          >
            <div
              className="theory-icon"
              style={{ background: `${item.color}22` }}
            >
              <div
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: 999,
                  background: item.color,
                  boxShadow: `0 0 8px ${item.color}80`,
                }}
              />
            </div>
            <div>
              <div className="theory-label" style={{ color: item.color }}>
                {item.label}
              </div>
              <div className="theory-desc">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DataTabProps {
  lightAbsorbed: number;
  oxygenReleased: number;
  energyProduced: number;
  glucoseFormed: number;
  starchStored: number;
  activeReaction: ReactionStep;
}

function DataTab({
  lightAbsorbed,
  oxygenReleased,
  energyProduced,
  glucoseFormed,
  starchStored,
  activeReaction,
}: DataTabProps) {
  return (
    <div className="panel" style={{ padding: 26 }}>
      <div className="section-title">Live Measurements</div>
      <div className="data-grid">
        {[
          {
            label: "Light Absorbed",
            val: lightAbsorbed,
            unit: "photons",
            color: "#F59E0B",
          },
          {
            label: "O₂ Released",
            val: oxygenReleased,
            unit: "molecules",
            color: "#06B6D4",
          },
          {
            label: "ATP Energy",
            val: `${energyProduced.toFixed(1)}%`,
            unit: "charged",
            color: "#F97316",
          },
          {
            label: "Glucose",
            val: glucoseFormed.toFixed(1),
            unit: "units",
            color: "#10B981",
          },
          {
            label: "Starch Stored",
            val: starchStored.toFixed(1),
            unit: "units",
            color: "#8B5CF6",
          },
          {
            label: "Status",
            val: activeReaction ? "ACTIVE" : "IDLE",
            unit: activeReaction || "no reaction",
            color: activeReaction ? "#10B981" : "#94A3B8",
          },
        ].map((m) => (
          <div key={m.label} className="data-card">
            <div className="data-label">{m.label}</div>
            <div className="data-val" style={{ color: m.color }}>
              {m.val}
            </div>
            <div className="data-unit">{m.unit}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          {
            label: "ATP Energy Level",
            val: energyProduced,
            max: 100,
            color: "#F59E0B",
          },
          {
            label: "Glucose Formation",
            val: Math.min(glucoseFormed * 10, 100),
            max: 100,
            color: "#10B981",
          },
          {
            label: "Starch Storage",
            val: Math.min(starchStored * 2, 100),
            max: 100,
            color: "#8B5CF6",
          },
        ].map((b) => (
          <div key={b.label}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <span
                style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}
              >
                {b.label}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 11,
                  fontWeight: 800,
                  color: b.color,
                }}
              >
                {b.val.toFixed(1)}%
              </span>
            </div>
            <div
              style={{
                background: "#F1F5F9",
                borderRadius: 999,
                height: 10,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 999,
                  width: `${(b.val / b.max) * 100}%`,
                  background: b.color,
                  transition: "width .3s",
                  boxShadow:
                    b.val > 5 ? `0 0 8px ${b.color}60` : "none",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface StepCardProps {
  number: number;
  title: string;
  color: string;
  bg: string;
  border: string;
  activeBg: string;
  isActive: boolean;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function StepCard({
  number,
  title,
  color,
  bg,
  border,
  activeBg,
  isActive,
  expanded,
  onToggle,
  children,
}: StepCardProps) {
  return (
    <div
      className={`step-card ${isActive ? "active" : ""}`}
      style={{
        borderColor: isActive ? color : border,
        background: isActive ? activeBg : bg,
      }}
    >
      <button
        className="step-header"
        style={{ background: "transparent" }}
        onClick={onToggle}
        type="button"
      >
        <div
          className="step-num"
          style={{
            background: isActive ? color : "#F1F5F9",
            color: isActive ? "#fff" : "#94A3B8",
          }}
        >
          {number}
        </div>
        <div style={{ flex: 1 }}>
          <div
            className="step-label"
            style={{ color: isActive ? color : "#94A3B8" }}
          >
            Step {number}
          </div>
          <div
            className="step-title"
            style={{ color: isActive ? "#1E293B" : "#64748B" }}
          >
            {title}
          </div>
        </div>
        <ChevronDown
          size={18}
          color={isActive ? color : "#CBD5E1"}
          style={{
            transform: expanded ? "rotate(180deg)" : "none",
            transition: "transform .2s",
            flexShrink: 0,
          }}
        />
      </button>
      {expanded && (
        <div
          className="step-body"
          style={{ borderColor: isActive ? `${color}40` : "#F0F4FF" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface ToggleProps {
  on: boolean;
  onToggle: () => void;
  label: string;
  color: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

function Toggle({ on, onToggle, label, color, icon, disabled = false }: ToggleProps) {
  return (
    <div className="toggle-row" style={{ opacity: disabled ? 0.45 : 1 }}>
      <div className="toggle-label" style={{ color: on ? color : "#64748B" }}>
        <span style={{ color: on ? color : "#94A3B8" }}>{icon}</span>
        {label}
      </div>
      <button
        className="toggle-track"
        disabled={disabled}
        onClick={onToggle}
        type="button"
        style={{
          background: on ? color : "#F1F5F9",
          borderColor: on ? color : "#E2E8F0",
          justifyContent: on ? "flex-end" : "flex-start",
        }}
      >
        <div className="toggle-thumb" />
      </button>
    </div>
  );
}

interface LeafSVGProps {
  active: boolean;
  glowColor: string;
  tick: number;
}

function LeafSVG({ active, glowColor, tick }: LeafSVGProps) {
  const scale = active ? 1 + Math.sin(tick * 0.18) * 0.03 : 1;
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      style={{
        transform: `scale(${scale})`,
        transition: "transform .1s",
        filter: active
          ? `drop-shadow(0 0 18px ${glowColor}90)`
          : "drop-shadow(0 10px 20px rgba(15,23,42,0.25))",
      }}
    >
      <defs>
        <radialGradient id="leafGrad" cx="40%" cy="35%">
          <stop offset="0%" stopColor={active ? "#4ADE80" : "#94A3B8"} />
          <stop offset="100%" stopColor={active ? "#16A34A" : "#64748B"} />
        </radialGradient>
      </defs>
      <path
        d="M60 100 C30 90, 10 65, 15 35 C20 10, 55 5, 75 20 C95 35, 95 70, 60 100 Z"
        fill="url(#leafGrad)"
        opacity={0.95}
      />
      <path
        d="M60 100 C58 80, 52 55, 40 30"
        stroke={active ? "#14532D" : "#475569"}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
      {[
        [50, 75, 35, 65],
        [55, 60, 38, 50],
        [52, 45, 36, 35],
        [58, 80, 72, 70],
        [56, 65, 70, 55],
      ].map(([x1, y1, x2, y2], i) => (
        <line
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={active ? "#16A34A40" : "#47556940"}
          strokeWidth={1.2}
        />
      ))}
      {active &&
        [
          [45, 55],
          [55, 45],
          [65, 60],
          [48, 70],
          [62, 75],
        ].map(([cx, cy], i) => (
          <circle
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            cx={cx}
            cy={cy}
            r={3}
            fill="#4ADE80"
            opacity={0.6 + Math.sin(tick * 0.2 + i) * 0.3}
          />
        ))}
    </svg>
  );
}

interface WaterDropsProps {
  tick: number;
}

function WaterDrops({ tick }: WaterDropsProps) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        left: 16,
        display: "flex",
        gap: 8,
        alignItems: "flex-end",
      }}
    >
      {[0, 1, 2].map((i) => {
        const y = Math.sin(tick * 0.15 + i * 1.2) * 6;
        return (
          <svg
            key={i}
            width="18"
            height="24"
            viewBox="0 0 18 24"
            style={{ transform: `translateY(${y}px)`, transition: "transform .1s" }}
          >
            <path
              d="M9 2 C9 2, 2 12, 2 16 C2 20.4, 5.1 23, 9 23 C12.9 23, 16 20.4, 16 16 C16 12, 9 2, 9 2Z"
              fill="#06B6D4"
              opacity={0.85}
            />
            <ellipse cx="6.5" cy="14" rx="2" ry="3.5" fill="white" opacity={0.3} />
          </svg>
        );
      })}
      <span
        style={{
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: 9,
          fontWeight: 700,
          color: "#0891B2",
        }}
      >
        H₂O
      </span>
    </div>
  );
}

interface CO2MoleculesProps {
  tick: number;
}

function CO2Molecules({ tick }: CO2MoleculesProps) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        right: 16,
        display: "flex",
        gap: 10,
        alignItems: "flex-end",
      }}
    >
      {[0, 1].map((i) => {
        const y = Math.cos(tick * 0.12 + i * 2) * 5;
        return (
          <svg
            key={i}
            width="42"
            height="20"
            viewBox="0 0 42 20"
            style={{ transform: `translateY(${y}px)`, transition: "transform .1s" }}
          >
            <circle cx="6" cy="10" r="6" fill="#94A3B8" opacity={0.85} />
            <circle cx="21" cy="10" r="7" fill="#64748B" opacity={0.9} />
            <circle cx="36" cy="10" r="6" fill="#94A3B8" opacity={0.85} />
            <text
              x="6"
              y="14"
              textAnchor="middle"
              style={{ fontSize: 7, fontWeight: 800, fill: "#fff" }}
            >
              O
            </text>
            <text
              x="21"
              y="14"
              textAnchor="middle"
              style={{ fontSize: 7, fontWeight: 800, fill: "#fff" }}
            >
              C
            </text>
            <text
              x="36"
              y="14"
              textAnchor="middle"
              style={{ fontSize: 7, fontWeight: 800, fill: "#fff" }}
            >
              O
            </text>
          </svg>
        );
      })}
      <span
        style={{
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: 9,
          fontWeight: 700,
          color: "#64748B",
        }}
      >
        CO₂
      </span>
    </div>
  );
}
