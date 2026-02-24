import { useState, useCallback, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import {
  Trash2,
  Zap,
  Activity,
  Radio,
  Power,
  Download,
  RotateCcw,
  BookOpen,
  FlaskConical,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Gauge,
  TrendingUp,
} from "lucide-react";
import { CircuitDiagram } from "./CircuitDiagram";
import { ResistorColorBands } from "./ResistorColorBands";
import { GaugeMeter } from "./GaugeMeter";

interface Reading {
  V: number;
  I: number;
  R: number;
  P: number;
  id: number;
}

type ChartView = "vi" | "power" | "scatter";

export function OhmsLawVirtualLab() {
  const [voltage, setVoltage] = useState<number>(12);
  const [circuitResistor, setCircuitResistor] = useState<number | null>(null);
  const [data, setData] = useState<Reading[]>([]);
  const [draggedResistor, setDraggedResistor] = useState<number | null>(null);
  const [chartView, setChartView] = useState<ChartView>("vi");
  const [showTheory, setShowTheory] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [readingCounter, setReadingCounter] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null);

  const resistorOptions = [1, 2, 5, 10, 15, 20, 25, 30, 50];

  const current = useMemo(
    () => (circuitResistor ? parseFloat((voltage / circuitResistor).toFixed(4)) : 0),
    [voltage, circuitResistor]
  );

  const power = useMemo(
    () => (circuitResistor ? parseFloat((voltage * current).toFixed(4)) : 0),
    [voltage, current, circuitResistor]
  );

  const efficiency = useMemo(() => {
    if (!circuitResistor) return 0;
    return Math.max(0, 100 - (power > 50 ? 50 : power));
  }, [power, circuitResistor]);

  const warningLevel = useMemo(() => {
    if (power > 100) return "critical";
    if (power > 50) return "warning";
    if (current > 10) return "warning";
    return "normal";
  }, [power, current]);

  const handleDragStart = useCallback((resistorValue: number) => {
    setDraggedResistor(resistorValue);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      if (draggedResistor !== null) {
        setCircuitResistor(draggedResistor);
        setDraggedResistor(null);
      }
    },
    [draggedResistor]
  );

  const addReading = useCallback(() => {
    if (circuitResistor) {
      const id = readingCounter + 1;
      setReadingCounter(id);
      const newReading: Reading = {
        V: voltage,
        I: parseFloat(current.toFixed(4)),
        R: circuitResistor,
        P: parseFloat(power.toFixed(4)),
        id,
      };
      setData((prev) => [...prev, newReading]);
      setHighlightedRow(id);
      setTimeout(() => setHighlightedRow(null), 1500);
    }
  }, [circuitResistor, voltage, current, power, readingCounter]);

  const removeResistor = useCallback(() => {
    setCircuitResistor(null);
  }, []);

  const clearData = useCallback(() => {
    setData([]);
    setReadingCounter(0);
  }, []);

  const deleteReading = useCallback((id: number) => {
    setData((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const exportCSV = useCallback(() => {
    if (data.length === 0) return;
    const header = "Reading,Voltage(V),Resistance(Ω),Current(A),Power(W)\n";
    const rows = data.map((d, i) => `${i + 1},${d.V},${d.R},${d.I},${d.P}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ohms_law_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const selectResistor = useCallback((value: number) => {
    setCircuitResistor(value);
  }, []);

  const chartData = useMemo(() => {
    return data.map((d, i) => ({ ...d, index: i + 1 }));
  }, [data]);

  return (
    <div className=" mt-12 min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 p-3 md:p-6 selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center py-5 md:py-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <FlaskConical className="text-white" size={24} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-950 animate-pulse" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 tracking-tight">
                Ohm's Law 
              </h1>
              <p className="text-gray-500 text-xs md:text-sm font-medium tracking-wide uppercase">
                Physics Simulator/              </p>
            </div>
          </div>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Build circuits, measure electrical properties, and explore the relationship between
            voltage, current, and resistance in real time.
          </p>
        </header>

        {/* Theory Expandable */}
        <div className="mb-6">
          <button
            onClick={() => setShowTheory(!showTheory)}
            className="w-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl px-5 py-3 flex items-center justify-between text-left hover:from-indigo-500/15 hover:to-purple-500/15 transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookOpen size={20} className="text-indigo-400" />
              <span className="font-semibold text-indigo-300">Theory & Formulas</span>
            </div>
            {showTheory ? (
              <ChevronUp size={20} className="text-indigo-400" />
            ) : (
              <ChevronDown size={20} className="text-indigo-400" />
            )}
          </button>
          {showTheory && (
            <div className="mt-2 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 grid grid-cols-1 md:grid-cols-3 gap-4 animate-[fadeIn_0.3s_ease-out]">
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                  <Zap size={16} /> Ohm's Law
                </h3>
                <p className="text-3xl font-black text-white mb-1">V = I × R</p>
                <p className="text-gray-400 text-sm">
                  Voltage equals current times resistance
                </p>
              </div>
              <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                  <Activity size={16} /> Current
                </h3>
                <p className="text-3xl font-black text-white mb-1">I = V / R</p>
                <p className="text-gray-400 text-sm">
                  Current is inversely proportional to resistance
                </p>
              </div>
              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                  <Power size={16} /> Power
                </h3>
                <p className="text-3xl font-black text-white mb-1">P = V × I</p>
                <p className="text-gray-400 text-sm">
                  Power equals voltage times current (in Watts)
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Panel */}
          <div className="lg:col-span-4 space-y-5">
            {/* Power Supply */}
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl shadow-2xl p-5 border border-slate-700/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20">
                  <Zap className="text-cyan-400" size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Power Supply</h2>
                  <p className="text-xs text-gray-500">Adjustable DC voltage source</p>
                </div>
              </div>

              <div className="mb-5">
                <div className="flex items-baseline justify-between mb-3">
                  <label className="font-semibold text-gray-300 text-sm flex items-center gap-2">
                    <Power size={14} /> Voltage Output
                  </label>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-cyan-400 tabular-nums">{voltage}</span>
                    <span className="text-lg text-cyan-500/70 font-bold">V</span>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={voltage}
                    onChange={(e) => setVoltage(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-cyan-500 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-500/50 [&::-webkit-slider-thumb]:appearance-none"
                  />
                  <div
                    className="absolute top-0 left-0 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full pointer-events-none"
                    style={{ width: `${((voltage - 1) / 29) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 mt-1.5 font-medium">
                  <span>1V</span>
                  <span>10V</span>
                  <span>20V</span>
                  <span>30V</span>
                </div>
              </div>

              {/* Quick voltage presets */}
              <div className="flex gap-2 flex-wrap">
                {[3, 5, 9, 12, 24].map((v) => (
                  <button
                    key={v}
                    onClick={() => setVoltage(v)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      voltage === v
                        ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                        : "bg-slate-700/50 text-gray-400 hover:bg-slate-700 hover:text-gray-300 border border-slate-600/50"
                    }`}
                  >
                    {v}V
                  </button>
                ))}
              </div>
            </div>

            {/* Resistor Bin */}
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl shadow-2xl p-5 border border-slate-700/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20">
                  <Radio className="text-amber-400" size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Component Bin</h2>
                  <p className="text-xs text-gray-500">Drag or click to connect</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {resistorOptions.map((resistor) => (
                  <div
                    key={resistor}
                    draggable
                    onDragStart={() => handleDragStart(resistor)}
                    onClick={() => selectResistor(resistor)}
                    className={`group relative bg-gradient-to-br from-slate-700/80 to-slate-800/80 hover:from-amber-500/20 hover:to-orange-500/20 transition-all duration-200 cursor-grab active:cursor-grabbing p-3 rounded-xl text-center border ${
                      circuitResistor === resistor
                        ? "border-amber-400 ring-1 ring-amber-400/30 bg-amber-500/10"
                        : "border-slate-600/50 hover:border-amber-500/50"
                    }`}
                  >
                    <ResistorColorBands value={resistor} size="sm" />
                    <div className="text-base font-bold text-white mt-1">{resistor}Ω</div>
                    <div className="text-[10px] text-gray-500 group-hover:text-amber-400 transition-colors">
                      {circuitResistor === resistor ? "active" : "drag/click"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            {showTips && (
              <div className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl p-4 border border-emerald-500/20 relative">
                <button
                  onClick={() => setShowTips(false)}
                  className="absolute top-2 right-3 text-gray-500 hover:text-gray-300 text-lg"
                >
                  ×
                </button>
                <div className="flex items-start gap-3">
                  <Lightbulb size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-emerald-300 font-semibold text-sm mb-1">Pro Tips</p>
                    <ul className="text-gray-400 text-xs space-y-1 list-disc ml-3">
                      <li>Try keeping voltage constant while changing resistors</li>
                      <li>Record multiple readings to see the V-I relationship</li>
                      <li>Watch how power increases with lower resistance</li>
                      <li>Export your data as CSV for lab reports</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-8 space-y-5">
            {/* Circuit + Gauges Row */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
              {/* Circuit Diagram */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`md:col-span-3 rounded-2xl shadow-2xl p-4 border-2 min-h-[280px] flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden ${
                  isDragOver
                    ? "border-amber-400 bg-amber-500/5 scale-[1.01]"
                    : circuitResistor
                    ? "border-cyan-500/30 bg-gradient-to-br from-slate-800/90 to-slate-900/90"
                    : "border-slate-700/50 border-dashed bg-gradient-to-br from-slate-800/50 to-slate-900/50"
                }`}
              >
                {circuitResistor && (
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400" />
                )}

                {/* Warning banner */}
                {warningLevel !== "normal" && circuitResistor && (
                  <div
                    className={`absolute top-2 left-2 right-2 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 z-10 ${
                      warningLevel === "critical"
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}
                  >
                    ⚠️ {warningLevel === "critical" ? "High power dissipation!" : "Elevated current levels"}
                  </div>
                )}

                <div className="w-full max-w-sm">
                  <CircuitDiagram
                    voltage={voltage}
                    current={current}
                    resistance={circuitResistor}
                    isActive={!!circuitResistor}
                  />
                </div>

                {circuitResistor && (
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-500">
                      {circuitResistor}Ω connected
                    </span>
                    <button
                      onClick={removeResistor}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors border border-red-500/20 text-xs font-medium"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                )}

                {!circuitResistor && !isDragOver && (
                  <div className="text-center mt-2">
                    <p className="text-gray-500 text-sm">Drag or click a resistor to connect</p>
                  </div>
                )}
                {isDragOver && (
                  <div className="text-center mt-2">
                    <p className="text-amber-400 text-sm font-semibold animate-pulse">Release to connect!</p>
                  </div>
                )}
              </div>

              {/* Gauge Panel */}
              <div className="md:col-span-2 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl shadow-2xl p-4 border border-slate-700/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400" />
                <div className="flex items-center gap-2 mb-3">
                  <Gauge size={16} className="text-gray-400" />
                  <h3 className="text-sm font-bold text-gray-300">Instrument Panel</h3>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <GaugeMeter value={voltage} max={30} label="Voltage" unit="V" color="#22d3ee" glowColor="#67e8f9" />
                  <GaugeMeter value={current} max={30} label="Current" unit="A" color="#4ade80" glowColor="#86efac" />
                  <GaugeMeter value={circuitResistor || 0} max={50} label="Resistance" unit="Ω" color="#a78bfa" glowColor="#c4b5fd" />
                  <GaugeMeter value={power} max={900} label="Power" unit="W" color="#f87171" glowColor="#fca5a5" />
                </div>
              </div>
            </div>

            {/* Live Readings Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-4 rounded-xl border border-blue-500/20 relative overflow-hidden group hover:border-blue-500/40 transition-colors">
                <div className="absolute -right-3 -top-3 w-16 h-16 bg-blue-500/5 rounded-full" />
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Zap size={14} className="text-blue-400" />
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Voltage</p>
                </div>
                <p className="text-3xl font-black text-blue-400 tabular-nums">{voltage}<span className="text-lg ml-0.5 opacity-60">V</span></p>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 p-4 rounded-xl border border-green-500/20 relative overflow-hidden group hover:border-green-500/40 transition-colors">
                <div className="absolute -right-3 -top-3 w-16 h-16 bg-green-500/5 rounded-full" />
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Activity size={14} className="text-green-400" />
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Current</p>
                </div>
                <p className="text-3xl font-black text-green-400 tabular-nums">{current.toFixed(2)}<span className="text-lg ml-0.5 opacity-60">A</span></p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 p-4 rounded-xl border border-purple-500/20 relative overflow-hidden group hover:border-purple-500/40 transition-colors">
                <div className="absolute -right-3 -top-3 w-16 h-16 bg-purple-500/5 rounded-full" />
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Radio size={14} className="text-purple-400" />
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Resistance</p>
                </div>
                <p className="text-3xl font-black text-purple-400 tabular-nums">{circuitResistor || 0}<span className="text-lg ml-0.5 opacity-60">Ω</span></p>
              </div>
              <div className={`bg-gradient-to-br p-4 rounded-xl border relative overflow-hidden group transition-colors ${
                warningLevel === "critical"
                  ? "from-red-500/20 to-red-600/10 border-red-500/40"
                  : warningLevel === "warning"
                  ? "from-yellow-500/15 to-orange-600/5 border-yellow-500/30"
                  : "from-red-500/10 to-red-600/5 border-red-500/20 hover:border-red-500/40"
              }`}>
                <div className="absolute -right-3 -top-3 w-16 h-16 bg-red-500/5 rounded-full" />
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Power size={14} className="text-red-400" />
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Power</p>
                </div>
                <p className="text-3xl font-black text-red-400 tabular-nums">{power.toFixed(2)}<span className="text-lg ml-0.5 opacity-60">W</span></p>
              </div>
            </div>

            {/* Efficiency Bar */}
            {circuitResistor && (
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Circuit Status</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    warningLevel === "critical" ? "bg-red-500/20 text-red-400" :
                    warningLevel === "warning" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-green-500/20 text-green-400"
                  }`}>
                    {warningLevel === "critical" ? "⚡ Overload" : warningLevel === "warning" ? "⚠ Caution" : "✓ Normal"}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      efficiency > 70 ? "bg-gradient-to-r from-green-500 to-emerald-400" :
                      efficiency > 40 ? "bg-gradient-to-r from-yellow-500 to-amber-400" :
                      "bg-gradient-to-r from-red-500 to-orange-400"
                    }`}
                    style={{ width: `${efficiency}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1.5 text-[10px] text-gray-500">
                  <span>High Load</span>
                  <span>Efficiency: {efficiency.toFixed(0)}%</span>
                  <span>Low Load</span>
                </div>
              </div>
            )}

            {/* Record Button */}
            <div className="flex gap-3">
              <button
                onClick={addReading}
                disabled={!circuitResistor}
                className={`flex-1 py-3.5 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
                  circuitResistor
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 hover:shadow-xl hover:shadow-cyan-500/20 text-white active:scale-[0.98]"
                    : "bg-slate-800 text-gray-600 cursor-not-allowed border border-slate-700"
                }`}
              >
                <TrendingUp size={18} />
                <span>Record Measurement</span>
              </button>
              {data.length > 0 && (
                <>
                  <button
                    onClick={exportCSV}
                    className="px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 border border-slate-700 transition-colors flex items-center gap-2 text-sm font-medium"
                    title="Export CSV"
                  >
                    <Download size={16} />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                  <button
                    onClick={clearData}
                    className="px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-slate-700 hover:border-red-500/30 transition-colors flex items-center gap-2 text-sm font-medium"
                    title="Clear all data"
                  >
                    <RotateCcw size={16} />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Data Section */}
        {data.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mt-5">
            {/* Table */}
            <div className="lg:col-span-2 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl shadow-2xl p-5 border border-slate-700/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500" />
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity size={18} className="text-cyan-400" />
                  Measurements
                  <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full font-medium">
                    {data.length}
                  </span>
                </h2>
              </div>
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto scrollbar-thin">
                <table className="w-full text-sm">
                  <thead className="bg-slate-800/80 sticky top-0 z-10">
                    <tr>
                      <th className="p-2.5 text-left text-gray-500 text-xs font-semibold">#</th>
                      <th className="p-2.5 text-left text-blue-400 text-xs font-semibold">V</th>
                      <th className="p-2.5 text-left text-purple-400 text-xs font-semibold">R (Ω)</th>
                      <th className="p-2.5 text-left text-green-400 text-xs font-semibold">I (A)</th>
                      <th className="p-2.5 text-left text-red-400 text-xs font-semibold">P (W)</th>
                      <th className="p-2.5 text-center text-gray-500 text-xs font-semibold w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((d, i) => (
                      <tr
                        key={d.id}
                        className={`border-t border-slate-800 transition-all duration-500 ${
                          highlightedRow === d.id
                            ? "bg-cyan-500/10"
                            : i % 2 === 0
                            ? "bg-slate-900/30"
                            : "bg-slate-800/20"
                        } hover:bg-slate-700/30`}
                      >
                        <td className="p-2.5 text-gray-500 font-medium">{i + 1}</td>
                        <td className="p-2.5 text-blue-300 font-mono">{d.V}</td>
                        <td className="p-2.5 text-purple-300 font-mono">{d.R}</td>
                        <td className="p-2.5 text-green-300 font-mono">{d.I.toFixed(2)}</td>
                        <td className="p-2.5 text-red-300 font-mono">{d.P.toFixed(2)}</td>
                        <td className="p-2.5 text-center">
                          <button
                            onClick={() => deleteReading(d.id)}
                            className="text-gray-600 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-500/10"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Chart */}
            <div className="lg:col-span-3 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl shadow-2xl p-5 border border-slate-700/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500" />
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp size={18} className="text-purple-400" />
                  Data Visualization
                </h2>
                <div className="flex gap-1 bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                  <button
                    onClick={() => setChartView("vi")}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      chartView === "vi" ? "bg-blue-500 text-white shadow" : "text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    V vs I
                  </button>
                  <button
                    onClick={() => setChartView("power")}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      chartView === "power" ? "bg-red-500 text-white shadow" : "text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    Power
                  </button>
                  <button
                    onClick={() => setChartView("scatter")}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      chartView === "scatter" ? "bg-purple-500 text-white shadow" : "text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    Scatter
                  </button>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {chartView === "vi" ? (
                    <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis
                        dataKey="I"
                        label={{ value: "Current (A)", position: "insideBottom", offset: -15, fill: "#64748b", fontSize: 12 }}
                        stroke="#334155"
                        tick={{ fill: "#64748b", fontSize: 10 }}
                      />
                      <YAxis
                        label={{ value: "Voltage (V)", angle: -90, position: "insideLeft", offset: 5, fill: "#64748b", fontSize: 12 }}
                        stroke="#334155"
                        tick={{ fill: "#64748b", fontSize: 10 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#1e293b",
                          borderRadius: "12px",
                          padding: "12px",
                          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                        }}
                        itemStyle={{ color: "#e2e8f0" }}
                        labelStyle={{ color: "#94a3b8", fontWeight: "bold" }}
                        formatter={(value: number | undefined) => (value ?? 0).toFixed(2)}
                      />
                      <Legend wrapperStyle={{ color: "#94a3b8" }} />
                      <Line
                        type="monotone"
                        dataKey="V"
                        stroke="#60a5fa"
                        strokeWidth={3}
                        name="Voltage (V)"
                        dot={{ stroke: "#93c5fd", strokeWidth: 2, r: 5, fill: "#1e3a5f" }}
                        activeDot={{ r: 7, stroke: "#fff", strokeWidth: 2 }}
                        animationDuration={500}
                      />
                    </LineChart>
                  ) : chartView === "power" ? (
                    <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis
                        dataKey="index"
                        label={{ value: "Reading #", position: "insideBottom", offset: -15, fill: "#64748b", fontSize: 12 }}
                        stroke="#334155"
                        tick={{ fill: "#64748b", fontSize: 10 }}
                      />
                      <YAxis
                        stroke="#334155"
                        tick={{ fill: "#64748b", fontSize: 10 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#1e293b",
                          borderRadius: "12px",
                          padding: "12px",
                          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                        }}
                        itemStyle={{ color: "#e2e8f0" }}
                        formatter={(value: number | undefined) => (value ?? 0).toFixed(2)}
                      />
                      <Legend wrapperStyle={{ color: "#94a3b8" }} />
                      <Bar dataKey="P" name="Power (W)" fill="#f87171" radius={[6, 6, 0, 0]} animationDuration={500} />
                      <Bar dataKey="I" name="Current (A)" fill="#4ade80" radius={[6, 6, 0, 0]} animationDuration={500} />
                    </BarChart>
                  ) : (
                    <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis
                        dataKey="R"
                        name="Resistance"
                        unit="Ω"
                        stroke="#334155"
                        tick={{ fill: "#64748b", fontSize: 10 }}
                        label={{ value: "Resistance (Ω)", position: "insideBottom", offset: -15, fill: "#64748b", fontSize: 12 }}
                      />
                      <YAxis
                        dataKey="I"
                        name="Current"
                        unit="A"
                        stroke="#334155"
                        tick={{ fill: "#64748b", fontSize: 10 }}
                        label={{ value: "Current (A)", angle: -90, position: "insideLeft", offset: 5, fill: "#64748b", fontSize: 12 }}
                      />
                      <ZAxis dataKey="P" range={[50, 300]} name="Power" unit="W" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#1e293b",
                          borderRadius: "12px",
                          padding: "12px",
                          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                        }}
                        itemStyle={{ color: "#e2e8f0" }}
                        cursor={{ strokeDasharray: "3 3" }}
                        formatter={(value: number | undefined) => (value ?? 0).toFixed(2)}
                      />
                      <Scatter
                        name="Measurements"
                        data={chartData}
                        fill="#a78bfa"
                        animationDuration={500}
                      />
                    </ScatterChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center py-8 mt-4">
          <div className="flex items-center justify-center gap-3 text-gray-600 text-xs">
            <FlaskConical size={14} />
            <span>Ohm's Law Virtual Lab • Interactive Physics Education Tool</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
