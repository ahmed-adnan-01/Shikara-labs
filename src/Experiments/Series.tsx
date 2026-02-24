import React, { useState } from "react";

type CircuitType = "series" | "parallel";
type Stage = "hypothesis" | "running" | "results";
type FeedbackType = "error" | "success" | "close" | "warning" | "hint";

interface Feedback {
  type: FeedbackType;
  message: string;
}

interface Result {
  prediction: number;
  equivalentResistance: number;
  current: string;
  percentError: string;
}

export default function Series() {
  const [r1, setR1] = useState<number>(2);
  const [r2, setR2] = useState<number>(3);
  const [voltage, setVoltage] = useState<number>(5);
  const [type, setType] = useState<CircuitType>("series");
  const [prediction, setPrediction] = useState<string>("");
  const [result, setResult] = useState<Result | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [stage, setStage] = useState<Stage>("hypothesis");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const runExperiment = (): void => {
    if (!prediction.trim()) {
      setFeedback({ type: "error", message: "⚠️ Make a prediction first!" });
      return;
    }
    setStage("running");
    setIsRunning(true);
    setFeedback(null);

    let equivalentResistance: number;
    if (type === "series") {
      equivalentResistance = r1 + r2;
    } else {
      equivalentResistance = (r1 * r2) / (r1 + r2);
    }

    const current = voltage / equivalentResistance;

    setTimeout(() => {
      const predictedValue = parseFloat(prediction);
      const actual = parseFloat(equivalentResistance.toFixed(2));
      const percentError = (Math.abs(predictedValue - actual) / actual) * 100;

      let feedbackMsg = "";
      let feedbackType: FeedbackType;

      if (percentError < 5) {
        feedbackMsg = "🎯 Excellent prediction! You understand the formula.";
        feedbackType = "success";
      } else if (percentError < 15) {
        feedbackMsg = "✓ Close! Small calculation or rounding error.";
        feedbackType = "close";
      } else if (percentError < 30) {
        feedbackMsg = "⚠️ Off by a fair bit. Review your formula.";
        feedbackType = "warning";
      } else {
        feedbackMsg = "❌ Let's revisit the circuit rules for this configuration.";
        feedbackType = "error";
      }

      setResult({
        prediction: predictedValue,
        equivalentResistance: actual,
        current: current.toFixed(3),
        percentError: percentError.toFixed(1),
      });
      setFeedback({ type: feedbackType, message: feedbackMsg });
      setStage("results");
      setIsRunning(false);
    }, 1500);
  };

  const reset = (): void => {
    setPrediction("");
    setResult(null);
    setFeedback(null);
    setStage("hypothesis");
  };

  const getHint = (): void => {
    if (type === "series") {
      setFeedback({
        type: "hint",
        message: "💡 Hint: In series, resistances add together. R_total = R₁ + R₂",
      });
    } else {
      setFeedback({
        type: "hint",
        message: "💡 Hint: In parallel, use 1/R_total = 1/R₁ + 1/R₂, then flip it.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🧪 Virtual Physics Lab</h1>
          <h2 className="text-xl text-blue-300">Equivalent Resistance Experiment</h2>
          <p className="text-slate-400 mt-1">
            Think like a scientist: Predict → Test → Compare
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Controls & Prediction */}
          <div className="space-y-4">
            {/* Connection Type Selector */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
              <h3 className="text-white font-semibold mb-3">🔌 Circuit Connection</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => { setType("series"); reset(); }}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    type === "series"
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                      : "bg-white/10 text-slate-300 hover:bg-white/20"
                  }`}
                >
                  📏 Series
                </button>
                <button
                  onClick={() => { setType("parallel"); reset(); }}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    type === "parallel"
                      ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30"
                      : "bg-white/10 text-slate-300 hover:bg-white/20"
                  }`}
                >
                  ↕️ Parallel
                </button>
              </div>
            </div>

            {/* Input Controls */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 space-y-3">
              <div>
                <label className="text-slate-300 text-sm mb-1 block">⚡ R₁ Resistance (Ω)</label>
                <input
                  type="number"
                  value={r1}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setR1(Number(e.target.value)); reset(); }}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-mono text-lg"
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm mb-1 block">🧲 R₂ Resistance (Ω)</label>
                <input
                  type="number"
                  value={r2}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setR2(Number(e.target.value)); reset(); }}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-mono text-lg"
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm mb-1 block">🔋 Battery Voltage (V)</label>
                <input
                  type="number"
                  value={voltage}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setVoltage(Number(e.target.value)); reset(); }}
                  className="w-full p-3 border-2 border-yellow-300 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all font-mono text-lg bg-gradient-to-r from-yellow-50 to-orange-50"
                />
              </div>
            </div>

            {/* Prediction Stage */}
            {stage === "hypothesis" && (
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-purple-400/40">
                <h3 className="text-white font-semibold mb-2">🎯 Your Prediction</h3>
                <p className="text-slate-400 text-sm mb-3">
                  Before testing, predict the equivalent resistance using the{" "}
                  {type === "series"
                    ? "series formula (R₁ + R₂)"
                    : "parallel formula (1/R_eq = 1/R₁ + 1/R₂)"}
                </p>
                <input
                  type="number"
                  placeholder="Enter predicted R_eq in Ω"
                  value={prediction}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrediction(e.target.value)}
                  className="w-full p-4 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 font-mono text-lg mb-4"
                />
                <div className="flex gap-3">
                  <button
                    onClick={getHint}
                    className="px-4 py-2 bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 rounded-lg hover:bg-yellow-500/30 transition-all"
                  >
                    💡 Need a Hint?
                  </button>
                  <button
                    onClick={runExperiment}
                    disabled={isRunning}
                    className="flex-1 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 transition-all"
                  >
                    {isRunning ? "Testing..." : "🔬 Test Prediction"}
                  </button>
                </div>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <div
                className={`p-4 rounded-xl border font-medium ${
                  feedback.type === "success"
                    ? "bg-green-500/20 border-green-500/40 text-green-300"
                    : feedback.type === "close"
                    ? "bg-blue-500/20 border-blue-500/40 text-blue-300"
                    : feedback.type === "warning"
                    ? "bg-yellow-500/20 border-yellow-500/40 text-yellow-300"
                    : feedback.type === "hint"
                    ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                    : "bg-red-500/20 border-red-500/40 text-red-300"
                }`}
              >
                {feedback.message}
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                <h3 className="text-white font-semibold mb-3">📊 Results Analysis</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-slate-400 text-xs mb-1">Your Prediction</div>
                    <div className="text-white font-mono text-xl">{result.prediction} Ω</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-slate-400 text-xs mb-1">Actual Result</div>
                    <div className="text-green-400 font-mono text-xl">{result.equivalentResistance} Ω</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-slate-400 text-xs mb-1">Error</div>
                    <div className="text-yellow-400 font-mono text-xl">{result.percentError}%</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-slate-400 text-xs mb-1">Current Flow</div>
                    <div className="text-blue-400 font-mono text-xl">{result.current} A</div>
                  </div>
                </div>
                <button
                  onClick={reset}
                  className="w-full py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-all"
                >
                  🔄 Try Again
                </button>
              </div>
            )}
          </div>

          {/* Right: Circuit Visualization */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
              <svg viewBox="0 0 300 200" className="w-full" xmlns="http://www.w3.org/2000/svg">
                {/* Battery */}
                <rect x="10" y="80" width="30" height="50" rx="4" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
                <text x="25" y="108" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                  +{voltage}V
                </text>

                {/* Top wire */}
                <line x1="40" y1="90" x2="260" y2="90" stroke="#60a5fa" strokeWidth="2.5" />
                {/* Bottom wire */}
                <line x1="40" y1="120" x2="260" y2="120" stroke="#60a5fa" strokeWidth="2.5" />

                {type === "series" ? (
                  <>
                    {/* R1 */}
                    <rect x="80" y="78" width="50" height="24" rx="4" fill="#3b82f6" stroke="#60a5fa" strokeWidth="1.5" />
                    <text x="105" y="94" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                      R₁={r1}Ω
                    </text>
                    {/* R2 */}
                    <rect x="170" y="78" width="50" height="24" rx="4" fill="#8b5cf6" stroke="#a78bfa" strokeWidth="1.5" />
                    <text x="195" y="94" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                      R₂={r2}Ω
                    </text>
                    {/* Right close wire */}
                    <line x1="260" y1="90" x2="260" y2="120" stroke="#60a5fa" strokeWidth="2.5" />
                  </>
                ) : (
                  <>
                    {/* Parallel branches */}
                    <line x1="100" y1="90" x2="100" y2="78" stroke="#60a5fa" strokeWidth="2" />
                    <line x1="100" y1="120" x2="100" y2="132" stroke="#60a5fa" strokeWidth="2" />
                    <line x1="200" y1="90" x2="200" y2="78" stroke="#60a5fa" strokeWidth="2" />
                    <line x1="200" y1="120" x2="200" y2="132" stroke="#60a5fa" strokeWidth="2" />

                    {/* Top branch R1 */}
                    <line x1="100" y1="78" x2="200" y2="78" stroke="#60a5fa" strokeWidth="1.5" />
                    <rect x="130" y="70" width="40" height="18" rx="3" fill="#3b82f6" stroke="#60a5fa" strokeWidth="1.5" />
                    <text x="150" y="83" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
                      R₁={r1}Ω
                    </text>

                    {/* Bottom branch R2 */}
                    <line x1="100" y1="132" x2="200" y2="132" stroke="#60a5fa" strokeWidth="1.5" />
                    <rect x="130" y="124" width="40" height="18" rx="3" fill="#8b5cf6" stroke="#a78bfa" strokeWidth="1.5" />
                    <text x="150" y="137" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
                      R₂={r2}Ω
                    </text>

                    <line x1="260" y1="90" x2="260" y2="120" stroke="#60a5fa" strokeWidth="2.5" />
                  </>
                )}

                {/* Label */}
                <text x="150" y="175" textAnchor="middle" fill="#94a3b8" fontSize="11">
                  {type.toUpperCase()}
                </text>
              </svg>
            </div>

            {/* How It Works */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
              <h3 className="text-white font-semibold mb-3">📖 How It Works</h3>
              {type === "series" ? (
                <div className="space-y-2 text-sm">
                  <div className="bg-blue-500/20 text-blue-300 p-2 rounded font-mono">
                    Formula: R_eq = R₁ + R₂
                  </div>
                  <p className="text-slate-400">Why? Current flows through both resistors one after another.</p>
                  <p className="text-slate-400">Pattern: Adding resistances increases total resistance.</p>
                  <p className="text-slate-500 text-xs">ℹ️ Try R₁=2, R₂=3: Prediction should be 5 Ω</p>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="bg-purple-500/20 text-purple-300 p-2 rounded font-mono">
                    Formula: 1/R_eq = 1/R₁ + 1/R₂
                  </div>
                  <p className="text-slate-400">Why? Current splits between two parallel paths.</p>
                  <p className="text-slate-400">Pattern: Parallel resistances are ALWAYS less than the smallest resistor.</p>
                  <p className="text-slate-500 text-xs">ℹ️ Try R₁=2, R₂=3: Prediction should be ~1.2 Ω</p>
                </div>
              )}
            </div>

            {/* Scientific Method */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
              <h3 className="text-white font-semibold mb-3">📋 The Scientific Method</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { num: "1", label: "Observe", desc: "Pick your circuit type & values" },
                  { num: "2", label: "Hypothesize", desc: "Calculate & predict the result" },
                  { num: "3", label: "Test", desc: "Run the experiment" },
                  { num: "4", label: "Compare", desc: "Did your prediction match?" },
                ].map((step) => (
                  <div key={step.num} className="bg-white/5 rounded-lg p-3">
                    <div className="text-blue-400 font-bold text-lg">{step.num}. {step.label}</div>
                    <div className="text-slate-400 text-xs mt-1">{step.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}