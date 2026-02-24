// import React, { useState, useEffect } from 'react';
// import {
//   Droplets,
//   Zap,
//   Wind,
//   RotateCcw,
//   ChevronDown,
//   BookOpen,
//   CheckCircle,
//   FlaskConical,
//   Leaf,
//   Sun,
//   Moon,
//   Beaker,
//   Clock,
//   Award,
//   Lightbulb,
//   ArrowRight,
//   Sparkles,
//   Volume2,
//   VolumeX
// } from 'lucide-react';
// import { useSoundEffects } from '/lib/UseSoundEffect';
// // './hooks/useSoundEffects1';
// // Types
// type LeafStep = 0 | 1 | 2;

// interface StepCardProps {
//   number: number;
//   title: string;
//   icon: React.ReactNode;
//   isActive: boolean;
//   expandedStep: number;
//   onToggle: (step: number) => void;
//   children: React.ReactNode;
// }

// // Step Card Component with TypeScript
// const StepCard: React.FC<StepCardProps> = ({
//   number,
//   title,
//   icon,
//   isActive,
//   expandedStep,
//   onToggle,
//   children
// }) => (
//   <div
//     className={`rounded-2xl transition-all duration-500 border-2 overflow-hidden ${
//       isActive
//         ? 'bg-gradient-to-br from-slate-700/80 to-slate-800/80 border-cyan-500/50 shadow-xl shadow-cyan-500/20 scale-[1.02]'
//         : 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 shadow-lg hover:border-slate-600/50'
//     }`}
//   >
//     <button
//       onClick={() => onToggle(expandedStep === number ? 0 : number)}
//       className={`w-full flex items-center gap-4 p-6 hover:opacity-80 transition-all ${
//         isActive ? 'bg-white/10' : 'hover:bg-slate-700/20'
//       }`}
//     >
//       <div
//         className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold flex-shrink-0 transition-all duration-300 ${
//           isActive
//             ? 'bg-gradient-to-br from-cyan-500/40 to-blue-500/40 shadow-lg shadow-cyan-500/30 text-cyan-300 scale-110'
//             : 'bg-slate-700/50 text-slate-400'
//         }`}
//       >
//         {icon}
//       </div>
//       <div className="text-left flex-1">
//         <div
//           className={`text-xs font-bold uppercase tracking-wider mb-1 ${
//             isActive ? 'text-cyan-300' : 'text-slate-400'
//           }`}
//         >
//           Step {number}
//         </div>
//         <h3
//           className={`text-xl font-bold ${
//             isActive ? 'text-white' : 'text-slate-200'
//           }`}
//         >
//           {title}
//         </h3>
//       </div>
//       <ChevronDown
//         className={`w-6 h-6 transition-all duration-300 flex-shrink-0 ${
//           expandedStep === number ? 'rotate-180' : ''
//         } ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}
//       />
//     </button>

//     <div
//       className={`overflow-hidden transition-all duration-500 ease-in-out ${
//         expandedStep === number ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
//       }`}
//     >
//       <div
//         className={`p-6 border-t ${
//           isActive ? 'border-cyan-500/20' : 'border-slate-700/50'
//         }`}
//       >
//         {children}
//       </div>
//     </div>
//   </div>
// );

// // Animated Beaker Component
// const AnimatedBeaker: React.FC<{ color: string; isActive: boolean }> = ({ color, isActive }) => (
//   <div className="relative w-20 h-24 mx-auto">
//     <div
//       className={`absolute bottom-0 w-full h-16 rounded-b-xl border-4 ${
//         isActive ? 'border-white/50' : 'border-slate-500/50'
//       }`}
//     >
//       <div
//         className={`absolute bottom-0 w-full rounded-b-lg transition-all duration-1000 ${
//           color
//         } ${
//           isActive ? 'h-12' : 'h-0'
//         }`}
//       />
//       {isActive && (
//         <>
//           <div className="absolute bottom-2 left-1/4 w-2 h-2 bg-white/50 rounded-full animate-bounce" />
//           <div className="absolute bottom-4 left-1/2 w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
//           <div className="absolute bottom-3 right-1/4 w-1 h-1 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
//         </>
//       )}
//     </div>
//   </div>
// );

// // Leaf Component with Animation
// const AnimatedLeaf: React.FC<{ step: LeafStep; label: string; isControl?: boolean }> = ({
//   step,
//   label,
//   isControl = false
// }) => {
//   const getLeafStyle = () => {
//     if (isControl) {
//       return step === 0
//         ? 'bg-gradient-to-br from-slate-500 to-slate-600'
//         : 'bg-gradient-to-br from-amber-600 to-orange-700';
//     }
//     switch (step) {
//       case 0:
//         return 'bg-gradient-to-br from-green-500 to-emerald-600';
//       case 1:
//         return 'bg-gradient-to-br from-slate-200 to-slate-300';
//       case 2:
//         return 'bg-gradient-to-br from-blue-600 to-indigo-800';
//       default:
//         return 'bg-gradient-to-br from-green-500 to-emerald-600';
//     }
//   };

//   const getLeafEmoji = () => {
//     if (isControl) {
//       return step === 0 ? '🍂' : '🌑';
//     }
//     switch (step) {
//       case 0:
//         return '🌿';
//       case 1:
//         return '📄';
//       case 2:
//         return '💙';
//       default:
//         return '🌿';
//     }
//   };

//   const getStatusText = () => {
//     if (isControl) {
//       return step === 0 ? 'WAITING...' : 'BROWN (No Starch)';
//     }
//     switch (step) {
//       case 0:
//         return 'GREEN (Chlorophyll)';
//       case 1:
//         return 'WHITE (Decolorized)';
//       case 2:
//         return 'BLUE-BLACK (Starch +)';
//       default:
//         return 'GREEN';
//     }
//   };

//   const getStatusColor = () => {
//     if (isControl) {
//       return step === 0 ? 'text-slate-400' : 'text-orange-400';
//     }
//     switch (step) {
//       case 0:
//         return 'text-green-400';
//       case 1:
//         return 'text-slate-300';
//       case 2:
//         return 'text-blue-400';
//       default:
//         return 'text-green-400';
//     }
//   };

//   return (
//     <div className="text-center group">
//       <h4 className="text-lg font-bold text-slate-200 mb-4 flex items-center justify-center gap-2">
//         {isControl ? <Moon className="w-5 h-5 text-slate-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
//         {label}
//       </h4>

//       <div
//         className={`relative w-48 h-36 mx-auto rounded-2xl border-4 shadow-2xl overflow-hidden transition-all duration-1000 flex items-center justify-center text-5xl transform hover:scale-105 ${
//           getLeafStyle()
//         } ${
//           step === 2 && !isControl
//             ? 'border-blue-400/50 shadow-blue-500/50 animate-pulse'
//             : 'border-white/30'
//         }`}
//       >
//         {getLeafEmoji()}
//         {step === 2 && !isControl && (
//           <Sparkles className="absolute top-2 right-2 w-6 h-6 text-yellow-300 animate-spin" />
//         )}
//       </div>

//       <div
//         className={`mt-4 p-4 bg-slate-900/50 rounded-xl border transition-all duration-500 ${
//           step === 2 && !isControl
//             ? 'border-blue-500/50 shadow-lg shadow-blue-500/20'
//             : 'border-slate-700'
//         }`}
//       >
//         <div className={`text-lg font-bold ${getStatusColor()}`}>
//           {getStatusText()}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main Component
// // export const App: React.FC = () => {
// export default function starchTestLab() {
//   // Sound effects hook
//   const {
//     playSuccessSound,
//     playBoilingSound,
//     playDropSound,
//     playSparkleSound,
//     playWhooshSound,
//     playClickSound
//   } = useSoundEffects();

//   // Experiment States
//   const [experimentalLeafStep, setExperimentalLeafStep] = useState<LeafStep>(0);
//   const [controlLeafStep, setControlLeafStep] = useState<0 | 1>(0);
//   const [deStarted, setDeStarted] = useState(false);

//   // Timing
//   const [timeBoiling, setTimeBoiling] = useState(0);
//   const [timeIodine, setTimeIodine] = useState(0);

//   // Results
//   const [experimentComplete, setExperimentComplete] = useState(false);

//   // UI
//   const [expandedStep, setExpandedStep] = useState(0);
//   const [soundEnabled, setSoundEnabled] = useState(true);

//   // ===== EXPERIMENTAL LEAF DECOLORIZATION =====
//   useEffect(() => {
//     let interval: ReturnType<typeof setInterval>;

//     if (deStarted && experimentalLeafStep === 0) {
//       interval = setInterval(() => {
//         setTimeBoiling((prev) => prev + 1);

//         if (timeBoiling >= 5) {
//           if (soundEnabled) {
//             playSuccessSound();
//             playWhooshSound();
//           }
//           setExperimentalLeafStep(1);
//           setTimeBoiling(0);
//         }
//       }, 1000);
//     }

//     return () => clearInterval(interval);
//   }, [deStarted, experimentalLeafStep, timeBoiling, soundEnabled, playSuccessSound, playWhooshSound]);

//   // ===== EXPERIMENTAL LEAF IODINE TEST =====
//   useEffect(() => {
//     let interval: ReturnType<typeof setInterval>;

//     if (experimentalLeafStep === 1 && timeIodine > 0) {
//       interval = setInterval(() => {
//         setTimeIodine((prev) => prev + 1);

//         if (timeIodine >= 3) {
//           if (soundEnabled) {
//             playSparkleSound();
//             playSuccessSound();
//           }
//           setExperimentalLeafStep(2);
//           setTimeIodine(0);
//           setExperimentComplete(true);
//         }
//       }, 1000);
//     }

//     return () => clearInterval(interval);
//   }, [experimentalLeafStep, timeIodine, soundEnabled, playSparkleSound, playSuccessSound]);

//   const startDecolorization = () => {
//     if (soundEnabled) {
//       playClickSound();
//       playBoilingSound();
//     }
//     setDeStarted(true);
//     setExpandedStep(2);
//   };

//   const addIodineExperimental = () => {
//     if (experimentalLeafStep === 1) {
//       if (soundEnabled) {
//         playDropSound();
//         playWhooshSound();
//       }
//       setTimeIodine(1);
//       setExpandedStep(3);
//     }
//   };

//   const testControlLeaf = () => {
//     if (soundEnabled) {
//       playClickSound();
//     }
//     setControlLeafStep(1);
//   };

//   const reset = () => {
//     if (soundEnabled) {
//       playWhooshSound();
//     }
//     setExperimentalLeafStep(0);
//     setControlLeafStep(0);
//     setDeStarted(false);
//     setTimeBoiling(0);
//     setTimeIodine(0);
//     setExperimentComplete(false);
//     setExpandedStep(0);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 p-4 md:p-8 lg:p-12">
//       {/* Background Animation */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
//         <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
//         <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
//       </div>

//       <div className="max-w-7xl mx-auto relative z-10">
//         {/* Sound Toggle Button */}
//         <div className="fixed top-4 right-4 z-50">
//           <button
//             onClick={() => {
//               playClickSound();
//               setSoundEnabled(!soundEnabled);
//             }}
//             className={`p-3 rounded-full transition-all shadow-lg hover:scale-110 ${
//               soundEnabled
//                 ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-cyan-500/30'
//                 : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
//             }`}
//             title={soundEnabled ? 'Turn off sounds' : 'Turn on sounds'}
//           >
//             {soundEnabled ? (
//               <Volume2 className="w-5 h-5" />
//             ) : (
//               <VolumeX className="w-5 h-5" />
//             )}
//           </button>
//         </div>

//         {/* ===== HEADER ===== */}
//         <div className="text-center mb-12 md:mb-16">
//           <div className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-full px-6 py-3 mb-6 backdrop-blur-sm hover:scale-105 transition-transform">
//             <FlaskConical className="w-5 h-5 text-cyan-400" />
//             <span className="text-cyan-300 font-bold text-sm tracking-wider">
//               BIOLOGY LAB EXPERIMENT
//             </span>
//           </div>

//           <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-300 to-blue-400 mb-4">
//             STARCH TEST
//           </h1>
//           <p className="text-xl text-slate-300 mb-2 flex items-center justify-center gap-2">
//             <BookOpen className="w-5 h-5" /> Class 10 Biology - Life Processes
//           </p>
//           <p className="text-lg text-slate-400 mb-8">
//             Iodine Test - Detection of Starch in Leaves
//           </p>

//           <div className="max-w-3xl mx-auto bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur transform hover:scale-[1.02] transition-transform">
//             <div className="flex items-start gap-4">
//               <Lightbulb className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
//               <div className="text-left">
//                 <p className="text-slate-200 leading-relaxed mb-3">
//                   <strong className="text-cyan-300">Objective:</strong> To detect the presence of starch in green leaves that have undergone photosynthesis, and to prove that starch is the storage form of glucose produced during photosynthesis.
//                 </p>
//                 <p className="text-slate-300 text-sm">
//                   <strong className="text-cyan-300">Principle:</strong> Iodine solution (I₂-KI) reacts with amylose in starch to form a{' '}
//                   <span className="text-blue-400 font-bold">blue-black complex</span>. This color change is diagnostic for starch detection.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ===== MAIN EXPERIMENT ===== */}
//         <div className="grid lg:grid-cols-3 gap-6 md:gap-8 mb-12">
//           {/* LEFT: PROCEDURE STEPS */}
//           <div className="space-y-4">
//             {/* Step 1 */}
//             <StepCard
//               number={1}
//               title="Boil Leaf in Water"
//               icon={<Droplets className="w-6 h-6" />}
//               isActive={deStarted}
//               expandedStep={expandedStep}
//               onToggle={setExpandedStep}
//             >
//               <div className="space-y-4">
//                 <div className="flex items-center gap-3 text-slate-300 text-sm leading-relaxed">
//                   <Beaker className="w-5 h-5 text-cyan-400 flex-shrink-0" />
//                   <p>Place the experimental leaf in boiling water for 30 seconds. This kills the cells and disrupts membranes.</p>
//                 </div>
//                 <AnimatedBeaker color="bg-blue-500/50" isActive={deStarted} />
//                 <button
//                   onClick={startDecolorization}
//                   disabled={deStarted}
//                   className={`w-full py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
//                     deStarted
//                       ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
//                       : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/30'
//                   }`}
//                 >
//                   {deStarted ? (
//                     <><Clock className="w-4 h-4 animate-spin" /> Boiling ({timeBoiling}s / 5s)</>
//                   ) : (
//                     <>Start Boiling <ArrowRight className="w-4 h-4" /></>
//                   )}
//                 </button>
//               </div>
//             </StepCard>

//             {/* Step 2 */}
//             <StepCard
//               number={2}
//               title="Decolorize with Ethanol"
//               icon={<FlaskConical className="w-6 h-6" />}
//               isActive={experimentalLeafStep >= 1}
//               expandedStep={expandedStep}
//               onToggle={setExpandedStep}
//             >
//               <div className="space-y-4">
//                 <div className="flex items-center gap-3 text-slate-300 text-sm leading-relaxed">
//                   <Wind className="w-5 h-5 text-purple-400 flex-shrink-0" />
//                   <p>Place the boiled leaf in boiling ethanol. Ethanol dissolves and removes chlorophyll, turning the leaf white.</p>
//                 </div>
//                 <div
//                   className={`py-4 px-4 rounded-xl font-bold text-center transition-all ${
//                     experimentalLeafStep >= 1
//                       ? 'bg-gradient-to-r from-emerald-500/30 to-green-500/30 border border-emerald-500/50 text-emerald-300'
//                       : 'bg-slate-700/50 text-slate-500'
//                   }`}
//                 >
//                   {experimentalLeafStep >= 1 ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <CheckCircle className="w-5 h-5" /> Leaf Decolorized (WHITE)
//                     </span>
//                   ) : (
//                     'Waiting for decolorization...'
//                   )}
//                 </div>
//               </div>
//             </StepCard>

//             {/* Step 3 */}
//             <StepCard
//               number={3}
//               title="Add Iodine Solution"
//               icon={<Zap className="w-6 h-6" />}
//               isActive={experimentalLeafStep >= 1}
//               expandedStep={expandedStep}
//               onToggle={setExpandedStep}
//             >
//               <div className="space-y-4">
//                 <div className="flex items-center gap-3 text-slate-300 text-sm leading-relaxed">
//                   <Droplets className="w-5 h-5 text-orange-400 flex-shrink-0" />
//                   <p>Rinse leaf with cold water, spread on white tile, and add iodine solution. Wait for color development.</p>
//                 </div>
//                 <button
//                   onClick={addIodineExperimental}
//                   disabled={experimentalLeafStep !== 1}
//                   className={`w-full py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
//                     experimentalLeafStep >= 2
//                       ? 'bg-gradient-to-r from-purple-500/30 to-blue-500/30 text-purple-300 border border-purple-500/50'
//                       : experimentalLeafStep === 1
//                       ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-lg shadow-orange-500/30'
//                       : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
//                   }`}
//                 >
//                   {experimentalLeafStep >= 2 ? (
//                     <><CheckCircle className="w-4 h-4" /> Iodine Added</>
//                   ) : experimentalLeafStep === 1 ? (
//                     <>Add Iodine <Droplets className="w-4 h-4" /></>
//                   ) : (
//                     'Complete Step 2 first'
//                   )}
//                 </button>
//               </div>
//             </StepCard>

//             {/* Step 4 - Control */}
//             <StepCard
//               number={4}
//               title="Test Control Leaf"
//               icon={<Leaf className="w-6 h-6" />}
//               isActive={controlLeafStep > 0}
//               expandedStep={expandedStep}
//               onToggle={setExpandedStep}
//             >
//               <div className="space-y-4">
//                 <div className="flex items-center gap-3 text-slate-300 text-sm leading-relaxed">
//                   <Moon className="w-5 h-5 text-slate-400 flex-shrink-0" />
//                   <p>Test a leaf that was kept in darkness (no photosynthesis). After decolorization and iodine treatment, it remains brown.</p>
//                 </div>
//                 <button
//                   onClick={testControlLeaf}
//                   disabled={controlLeafStep > 0}
//                   className={`w-full py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
//                     controlLeafStep > 0
//                       ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50'
//                       : 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white'
//                   }`}
//                 >
//                   {controlLeafStep > 0 ? (
//                     <><CheckCircle className="w-4 h-4" /> Control Tested</>
//                   ) : (
//                     <>Test Control Leaf <ArrowRight className="w-4 h-4" /></>
//                   )}
//                 </button>
//               </div>
//             </StepCard>
//           </div>

//           {/* CENTER: LEAF VISUALIZATION */}
//           <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-xl">
//             <h3 className="text-xl font-bold text-white mb-8 text-center flex items-center justify-center gap-2">
//               <Leaf className="w-6 h-6 text-green-400" />
//               Leaf Color Changes
//             </h3>

//             <div className="space-y-8 md:space-y-12">
//               <AnimatedLeaf step={experimentalLeafStep} label="Experimental Leaf" />
//               <AnimatedLeaf step={controlLeafStep} label="Control Leaf" isControl />
//             </div>
//           </div>

//           {/* RIGHT: MEASUREMENTS & CHEMISTRY */}
//           <div className="space-y-4 md:space-y-6">
//             {/* Chemical Equation */}
//             <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-slate-700/50 rounded-2xl p-6 shadow-lg hover:border-cyan-500/30 transition-all">
//               <h4 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
//                 <FlaskConical className="w-5 h-5 text-cyan-400" />
//                 Iodine-Starch Reaction
//               </h4>

//               <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700 mb-4">
//                 <div className="font-mono text-sm text-slate-300 leading-relaxed text-center space-y-2">
//                   <div className="text-cyan-300">Starch (Amylose) + I₂</div>
//                   <div className="text-white">↓</div>
//                   <div className="text-xl font-bold text-blue-400">
//                     Starch-Iodine Complex
//                   </div>
//                   <div className="text-blue-300 font-bold text-lg">(Blue-Black)</div>
//                 </div>
//               </div>

//               <div className="text-xs text-slate-300 leading-relaxed">
//                 <p className="font-bold text-cyan-300 mb-2">Mechanism:</p>
//                 <ul className="space-y-1 ml-2">
//                   <li>• Iodine molecules slip into helix of amylose</li>
//                   <li>• Forms charge-transfer complex</li>
//                   <li>• Blue-black color = starch presence</li>
//                 </ul>
//               </div>
//             </div>

//             {/* Photosynthesis Equation */}
//             <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-slate-700/50 rounded-2xl p-6 shadow-lg hover:border-green-500/30 transition-all">
//               <h4 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
//                 <Sun className="w-5 h-5 text-yellow-400" />
//                 Photosynthesis Process
//               </h4>

//               <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
//                 <div className="font-mono text-xs text-slate-300 leading-relaxed text-center space-y-1">
//                   <div>
//                     6CO₂ + 6H₂O +{' '}
//                     <span className="text-yellow-400 font-bold">Light Energy</span>
//                   </div>
//                   <div className="text-white">↓</div>
//                   <div>
//                     <span className="text-cyan-400 font-bold">C₆H₁₂O₆</span> + 6O₂
//                   </div>
//                   <div className="text-slate-400 mt-2">(Glucose)</div>
//                 </div>
//               </div>

//               <div className="text-xs text-slate-300 mt-4">
//                 <p className="font-bold text-green-300 mb-2">Storage:</p>
//                 <ul className="space-y-1 ml-2">
//                   <li>• Glucose → Starch (polymerization)</li>
//                   <li>• Stored in chloroplasts as granules</li>
//                   <li>• Insoluble = safe energy reserve</li>
//                 </ul>
//               </div>
//             </div>

//             {/* Time Trackers */}
//             {deStarted && (
//               <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-slate-700/50 rounded-2xl p-6 shadow-lg">
//                 <h4 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
//                   <Clock className="w-5 h-5 text-cyan-400" />
//                   Experiment Timer
//                 </h4>
//                 <div className="space-y-3">
//                   <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
//                     <div className="flex justify-between items-center">
//                       <span className="text-xs text-slate-400">Boiling</span>
//                       <span className="text-2xl font-black text-blue-400">
//                         {timeBoiling}s / 5s
//                       </span>
//                     </div>
//                     <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
//                       <div
//                         className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
//                         style={{ width: `${Math.min((timeBoiling / 5) * 100, 100)}%` }}
//                       />
//                     </div>
//                   </div>
//                   {experimentalLeafStep >= 1 && (
//                     <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
//                       <div className="flex justify-between items-center">
//                         <span className="text-xs text-slate-400">Iodine</span>
//                         <span className="text-2xl font-black text-purple-400">
//                           {timeIodine}s / 3s
//                         </span>
//                       </div>
//                       <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
//                         <div
//                           className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
//                           style={{ width: `${Math.min((timeIodine / 3) * 100, 100)}%` }}
//                         />
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ===== RESULTS & CONCLUSION ===== */}
//         {experimentComplete && (
//           <div className="space-y-6 md:space-y-8 mb-12 animate-fade-in">
//             {/* Result Summary */}
//             <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-2 border-cyan-500/50 rounded-3xl p-6 md:p-10 shadow-2xl">
//               <div className="flex flex-col md:flex-row items-start gap-6">
//                 <Award className="w-12 h-12 text-cyan-400 flex-shrink-0" />
//                 <div className="flex-1">
//                   <h3 className="text-2xl md:text-3xl font-black text-white mb-6">
//                     EXPERIMENT RESULTS
//                   </h3>

//                   <div className="grid md:grid-cols-2 gap-4 md:gap-6">
//                     <div className="bg-slate-900/50 rounded-xl p-4 md:p-5 border border-cyan-500/30">
//                       <div className="flex items-center gap-2 mb-3">
//                         <Sun className="w-5 h-5 text-yellow-400" />
//                         <p className="font-bold text-cyan-300">Experimental Leaf</p>
//                       </div>
//                       <p className="text-white text-lg mb-2">
//                         Turned{' '}
//                         <span className="font-bold text-blue-400">BLUE-BLACK</span>
//                       </p>
//                       <p className="text-sm text-slate-400 flex items-center gap-1">
//                         <CheckCircle className="w-4 h-4 text-green-400" /> Starch present
//                       </p>
//                     </div>

//                     <div className="bg-slate-900/50 rounded-xl p-4 md:p-5 border border-orange-500/30">
//                       <div className="flex items-center gap-2 mb-3">
//                         <Moon className="w-5 h-5 text-slate-400" />
//                         <p className="font-bold text-orange-300">Control Leaf</p>
//                       </div>
//                       <p className="text-white text-lg mb-2">
//                         Remained{' '}
//                         <span className="font-bold text-orange-400">BROWN</span>
//                       </p>
//                       <p className="text-sm text-slate-400 flex items-center gap-1">
//                         <CheckCircle className="w-4 h-4 text-red-400" /> No starch
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Conclusion Box */}
//             <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-2 border-green-500/50 rounded-3xl p-6 md:p-10 shadow-2xl">
//               <h3 className="text-2xl md:text-3xl font-black text-white mb-6 flex items-center gap-3">
//                 <CheckCircle className="w-10 h-10 text-green-400" /> CONCLUSION
//               </h3>

//               <div className="grid md:grid-cols-2 gap-4 md:gap-6 text-slate-200">
//                 <div className="bg-slate-900/50 rounded-xl p-5 border-l-4 border-green-400 hover:bg-slate-900/70 transition-colors">
//                   <p className="font-bold text-green-300 mb-2">Main Finding:</p>
//                   <p className="text-white font-semibold">
//                     Glucose produced during photosynthesis is stored as starch in leaves.
//                   </p>
//                 </div>

//                 <div className="bg-slate-900/50 rounded-xl p-5 border-l-4 border-blue-400 hover:bg-slate-900/70 transition-colors">
//                   <p className="font-bold text-blue-300 mb-2">Evidence:</p>
//                   <p className="text-sm text-slate-300">
//                     Blue-black color proves starch is present in light-exposed leaves.
//                   </p>
//                 </div>

//                 <div className="bg-slate-900/50 rounded-xl p-5 border-l-4 border-purple-400 hover:bg-slate-900/70 transition-colors">
//                   <p className="font-bold text-purple-300 mb-2">Why Starch?</p>
//                   <p className="text-sm text-slate-300">
//                     Glucose is soluble; starch is the insoluble storage form.
//                   </p>
//                 </div>

//                 <div className="bg-slate-900/50 rounded-xl p-5 border-l-4 border-cyan-400 hover:bg-slate-900/70 transition-colors">
//                   <p className="font-bold text-cyan-300 mb-2">Control Group:</p>
//                   <p className="text-sm text-slate-300">
//                     Dark-kept leaves show no starch = light is essential for photosynthesis.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Comparison Table */}
//             <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-xl overflow-x-auto">
//               <h3 className="text-xl md:text-2xl font-bold text-white mb-6">
//                 Experimental vs Control Comparison
//               </h3>

//               <div className="min-w-full rounded-xl border border-slate-700 overflow-hidden">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border-b border-slate-700">
//                       <th className="p-4 text-left text-cyan-400 font-bold">Condition</th>
//                       <th className="p-4 text-center text-cyan-400 font-bold">Light</th>
//                       <th className="p-4 text-center text-cyan-400 font-bold">Photosynthesis</th>
//                       <th className="p-4 text-center text-cyan-400 font-bold">Starch</th>
//                       <th className="p-4 text-left text-cyan-400 font-bold">Result</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-700">
//                     <tr className="hover:bg-slate-900/30 bg-green-900/10 transition-colors">
//                       <td className="p-4 text-slate-200 font-bold">Experimental</td>
//                       <td className="p-4 text-center text-green-400">✓ Full Light</td>
//                       <td className="p-4 text-center text-green-400 font-bold">✓ YES</td>
//                       <td className="p-4 text-center text-green-400 font-bold">✓ YES</td>
//                       <td className="p-4">
//                         <span className="px-3 py-1.5 bg-blue-500 text-white font-bold rounded-lg text-xs">
//                           BLUE-BLACK
//                         </span>
//                       </td>
//                     </tr>
//                     <tr className="hover:bg-slate-900/30 transition-colors">
//                       <td className="p-4 text-slate-200 font-bold">Control</td>
//                       <td className="p-4 text-center text-slate-400">✗ Darkness</td>
//                       <td className="p-4 text-center text-orange-400 font-bold">✗ NO</td>
//                       <td className="p-4 text-center text-orange-400 font-bold">✗ NO</td>
//                       <td className="p-4">
//                         <span className="px-3 py-1.5 bg-orange-500 text-white font-bold rounded-lg text-xs">
//                           BROWN
//                         </span>
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Key Learning Points */}
//             <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-xl">
//               <h3 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
//                 <Lightbulb className="w-6 h-6 text-yellow-400" />
//                 Key Learning Points
//               </h3>

//               <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700 hover:border-cyan-500/50 transition-colors">
//                   <p className="font-bold text-cyan-300 mb-2">📚 Starch Structure</p>
//                   <p className="text-xs text-slate-300">
//                     Polymer of glucose units (C₆H₁₂O₆)ₙ
//                   </p>
//                 </div>
//                 <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700 hover:border-purple-500/50 transition-colors">
//                   <p className="font-bold text-purple-300 mb-2">🔬 Iodine Test</p>
//                   <p className="text-xs text-slate-300">
//                     Qualitative test for starch presence
//                   </p>
//                 </div>
//                 <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700 hover:border-green-500/50 transition-colors">
//                   <p className="font-bold text-green-300 mb-2">💡 Decolorization</p>
//                   <p className="text-xs text-slate-300">
//                     Ethanol removes chlorophyll for clear results
//                   </p>
//                 </div>
//                 <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700 hover:border-yellow-500/50 transition-colors">
//                   <p className="font-bold text-yellow-300 mb-2">🌿 Plant Storage</p>
//                   <p className="text-xs text-slate-300">
//                     Starch stored in leaves, roots, stems, seeds
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ===== RESET BUTTON ===== */}
//         <div className="flex justify-center">
//           <button
//             onClick={reset}
//             className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-bold py-4 px-8 md:px-10 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-3 text-lg hover:scale-105"
//           >
//             <RotateCcw className="w-5 h-5" /> Reset Experiment
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
