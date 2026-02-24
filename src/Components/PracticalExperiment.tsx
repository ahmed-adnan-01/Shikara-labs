import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import practicalsData from '@/data/practicals-data.json';
import { 
  Clock, BookOpen, TrendingUp, Zap, ChevronDown, ChevronRight, CheckCircle,
  Award, Lightbulb, Target, Beaker, BarChart3, HelpCircle, MessageSquare,
  Star, Calendar, Sparkles, Brain, Rocket
} from 'lucide-react';

// Icon mapping
const getIcon = (iconName: string) => {
  const icons: Record<string, any> = { 
    Clock, BookOpen, TrendingUp, Zap, Lightbulb, Target, Beaker, 
    BarChart3, Award, HelpCircle, MessageSquare, Star, Calendar, 
    Sparkles, Brain, Rocket, CheckCircle
  };
  return icons[iconName] || Clock;
};

// Collapsible Section
const CollapsibleSection = ({ title, children, defaultOpen = false, icon: Icon }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mb-4 border border-cyan-500/20 rounded-xl overflow-hidden bg-gray-900/40 backdrop-blur-sm hover:border-cyan-500/40 transition-all">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full px-6 py-4 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 flex justify-between items-center hover:from-cyan-600/20 hover:to-blue-600/20 transition-all">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-cyan-400" />}
          <h3 className="text-base font-semibold text-white text-left">{title}</h3>
        </div>
        <ChevronDown className={`text-gray-400 w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="px-6 py-5 bg-gray-900/20">{children}</div>}
    </div>
  );
};

// Stats Card
const StatsCard = ({ stat, index }: any) => {
  const gradients = ['from-cyan-500 to-blue-500', 'from-purple-500 to-pink-500', 'from-orange-500 to-red-500', 'from-green-500 to-emerald-500'];
  const Icon = getIcon(stat.icon);
  return (
    <div className="group bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/40 transition-all hover:scale-105">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradients[index % 4]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-sm text-gray-400 font-medium">{stat.label}</span>
      </div>
      <p className="text-3xl font-bold text-white">{stat.value}</p>
    </div>
  );
};

// Quiz Component
const QuizTab = ({ quiz }: any) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (qIdx: number, oIdx: number) => {
    setAnswers({ ...answers, [qIdx]: oIdx });
  };

  const score = quiz.questions.reduce((acc: number, q: any, idx: number) => 
    acc + (answers[idx] === q.correct ? 1 : 0), 0);
  const percentage = (score / quiz.questions.length) * 100;

  return (
    <div className="space-y-10">
      <div className="mb-10">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center">
            <Award className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{quiz.title}</h1>
            <p className="text-gray-400 text-lg">Test your knowledge and track your progress</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {quiz.questions.map((q: any, qIdx: number) => (
          <div key={qIdx} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center font-bold text-white">
                {qIdx + 1}
              </div>
              <h3 className="text-lg font-semibold text-white pt-2">{q.q}</h3>
            </div>
            <div className="space-y-3">
              {q.options.map((opt: string, oIdx: number) => (
                <button
                  key={oIdx}
                  onClick={() => handleAnswer(qIdx, oIdx)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    answers[qIdx] === oIdx
                      ? showResults
                        ? oIdx === q.correct ? 'bg-green-900/40 border-green-500' : 'bg-red-900/40 border-red-500'
                        : 'bg-cyan-900/40 border-cyan-500'
                      : 'bg-gray-900/40 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <span className="font-bold mr-3">{String.fromCharCode(65 + oIdx)}.</span>
                  {opt}
                </button>
              ))}
            </div>
            {showResults && (
              <div className="mt-6 p-6 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-lg">
                <div className="flex items-start gap-4">
                  <Lightbulb className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                  <div>
                    <p className="text-cyan-400 font-bold mb-2">Explanation:</p>
                    <p className="text-gray-300">{q.explain}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={() => setShowResults(!showResults)}
          className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-lg transition-all shadow-2xl"
        >
          {showResults ? '🔄 Hide Results' : '✓ Submit Quiz'}
        </button>
        {showResults && (
          <div className="mt-10 p-8 bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/40 rounded-xl max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center">
                <Award className="w-10 h-10 text-white" />
              </div>
              <div className="text-center">
                <p className="text-5xl font-black text-white mb-2">{score}/{quiz.questions.length}</p>
                <p className="text-gray-400 text-xl">Score: {percentage.toFixed(0)}%</p>
              </div>
            </div>
            <p className="text-gray-200 text-lg">
              {percentage === 100 ? '🎉 Perfect Score!' : percentage >= 70 ? '👍 Great job!' : '📚 Keep learning!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function PracticalExperiment() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [showStartModal, setShowStartModal] = useState(false);

  const practical = practicalsData.find(p => p.id === id);

  if (!practical) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
            <ChevronRight className="w-10 h-10 text-red-500 rotate-45" />
          </div>
          <h1 className="text-4xl font-bold text-red-400 mb-4">Experiment Not Found</h1>
          <p className="text-gray-400 text-lg">The requested experiment does not exist.</p>
          <Link to="/dashboard" className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-bold">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'theory', label: 'Theory', icon: Lightbulb },
    { id: 'procedure', label: 'Procedure', icon: Beaker },
    { id: 'observations', label: 'Observations', icon: BarChart3 },
    { id: 'quiz', label: 'Quiz', icon: Award },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* Navigation Tabs */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-lg border-b border-cyan-500/20">
        <div className="w-full px-4 py-3">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
          
          {/* ==================== OVERVIEW TAB ==================== */}
          {activeTab === 'overview' && (
            <div className="space-y-10">
              {/* Header */}
              <div className="mb-10">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-white uppercase tracking-wider">
                    {(practical as any).subject}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white uppercase tracking-wider">
                    Class {(practical as any).class}
                  </span>
                </div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">{practical.title}</h1>
                    <p className="text-gray-400 text-lg">{practical.subtitle}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">{practical.description}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {practical.stats.map((stat: any, idx: number) => (
                  <StatsCard key={idx} stat={stat} index={idx} />
                ))}
              </div>

              {/* Aim */}
              <section className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-xl p-8">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4 text-cyan-300">Aim of Experiment</h2>
                    <p className="text-gray-200 text-lg">{practical.aim}</p>
                    {(practical as any).allexp && (
                      <Link
                        to={(practical as any).allexp}
                        className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-lg font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:scale-105 transition-transform"
                      >
                        <Rocket className="w-4 h-4" />
                        Launch Virtual Simulation
                      </Link>
                    )}
                  </div>
                </div>
              </section>

              {/* Key Concepts */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Brain className="w-8 h-8 text-purple-400" />
                  <h2 className="text-3xl font-bold text-white">Key Concepts</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {practical.keyConcepts?.map((concept: any, idx: number) => (
                    <div key={idx} className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-cyan-500/20 rounded-xl p-7">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center font-bold text-white">
                          {idx + 1}
                        </div>
                        <h3 className="text-xl font-bold text-white pt-2">{concept.title}</h3>
                      </div>
                      <p className="text-cyan-400 font-semibold mb-3 text-sm">{concept.summary}</p>
                      <p className="text-gray-400">{concept.details}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Applications */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="w-8 h-8 text-yellow-400" />
                  <h2 className="text-3xl font-bold text-white">Real-World Applications</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {practical.applications?.map((app: any, idx: number) => (
                    <div key={idx} className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-yellow-500/20 rounded-xl p-6">
                      <Zap className="w-6 h-6 text-yellow-400 mb-4" />
                      <h3 className="text-lg font-bold text-white mb-3">{app.title}</h3>
                      <p className="text-gray-400 text-sm">{app.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Video Tutorial */}
              {(practical as any).video && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <Rocket className="w-8 h-8 text-cyan-400" />
                    <h2 className="text-3xl font-bold text-white">Video Tutorial</h2>
                  </div>
                  <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-cyan-500/20">
                    <iframe
                      className="w-full h-full"
                      src={(() => {
                        const url = (practical as any).video.url;
                        const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
                        if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
                        const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
                        if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}`;
                        return url;
                      })()}
                      title={(practical as any).video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </section>
              )}

              {/* Study Resources */}
              {(practical as any).studyResources && (practical as any).studyResources.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="w-8 h-8 text-cyan-400" />
                    <h2 className="text-3xl font-bold text-white">Study Resources</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {(practical as any).studyResources.map((resource: any, idx: number) => (
                      <div key={idx} className={`group relative bg-gradient-to-br ${resource.color} border ${resource.borderColor} rounded-xl p-6 hover:scale-[1.02] transition-all cursor-pointer shadow-lg hover:shadow-2xl overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative flex items-start gap-4">
                          <div className="text-4xl group-hover:scale-110 transition-transform">{resource.icon}</div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-100 transition-colors">{resource.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">{resource.desc}</p>
                            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm group-hover:gap-3 transition-all">
                              <span>Access Resource</span>
                              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Simulation Guide */}
              {(practical as any).simulationGuide && (practical as any).simulationGuide.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-8 h-8 text-purple-400" />
                    <h2 className="text-3xl font-bold text-white">Interactive Simulation Guide</h2>
                  </div>
                  <div className="space-y-4">
                    {(practical as any).simulationGuide.map((step: string, idx: number) => (
                      <div key={idx} className="group flex gap-5 items-start bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/40 hover:bg-gray-800/50 transition-all">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 border-4 border-gray-900 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                          <span className="text-white font-bold">{idx + 1}</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed pt-2 flex-1 whitespace-pre-line">{step}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* ==================== THEORY TAB ==================== */}
          {activeTab === 'theory' && (
            <div className="space-y-10">
              <div className="mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Lightbulb className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Theory & Concepts</h1>
                    <p className="text-gray-400 text-lg">Understand the fundamental principles</p>
                  </div>
                </div>
              </div>

              <section className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-cyan-500/20 rounded-xl p-8">
                <p className="text-gray-300 leading-relaxed text-lg">{practical.theory}</p>
              </section>

              <section className="bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-purple-900/30 border border-purple-500/30 rounded-xl p-12">
                <h2 className="text-3xl font-bold mb-8 text-purple-300 text-center">The Fundamental Equation</h2>
                <p className="text-5xl sm:text-6xl font-bold text-white text-center mb-10">{practical.equation}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                  {practical.equationDetails.map((detail: string, idx: number) => (
                    <div key={idx} className="bg-gray-900/60 backdrop-blur-sm border border-purple-500/20 rounded-lg p-5">
                      <p className="text-gray-200 text-center font-medium">{detail}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Key Concepts */}
              {practical.keyConcepts && practical.keyConcepts.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <Brain className="w-8 h-8 text-blue-400" />
                    <h2 className="text-3xl font-bold text-white">Key Concepts Explained</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {practical.keyConcepts.map((concept: any, idx: number) => (
                      <div key={idx} className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-purple-500/20 rounded-xl p-7">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center font-bold text-white flex-shrink-0">
                            {idx + 1}
                          </div>
                          <h3 className="text-xl font-bold text-white pt-2">{concept.title}</h3>
                        </div>
                        <p className="text-purple-400 font-semibold mb-3 text-sm">{concept.summary}</p>
                        <p className="text-gray-400 leading-relaxed">{concept.details}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Applications */}
              {practical.applications && practical.applications.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <Zap className="w-8 h-8 text-yellow-400" />
                    <h2 className="text-3xl font-bold text-white">Real-World Applications</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {practical.applications.map((app: any, idx: number) => (
                      <div key={idx} className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-yellow-500/20 rounded-xl p-6">
                        <Zap className="w-6 h-6 text-yellow-400 mb-4" />
                        <h3 className="text-lg font-bold text-white mb-3">{app.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{app.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Historical Timeline */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-8 h-8 text-purple-400" />
                  <h2 className="text-3xl font-bold text-white">Historical Timeline</h2>
                </div>
                <div className="space-y-6">
                  {practical.timeline?.map((event: any, idx: number) => (
                    <div key={idx} className="flex gap-6 items-start">
                      <div className="w-28 bg-gradient-to-br from-cyan-500 to-blue-500 text-white font-bold px-5 py-4 rounded-lg text-center border-4 border-gray-900">
                        <div className="text-xl font-black">{event.year}</div>
                      </div>
                      <div className="flex-1 bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-cyan-500/20 rounded-xl p-7">
                        <h3 className="text-xl font-bold text-white mb-3">{event.title}</h3>
                        <p className="text-gray-400">{event.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* ==================== PROCEDURE TAB ==================== */}
          {activeTab === 'procedure' && (
            <div className="space-y-10">
              <div className="mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Beaker className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Procedure & Setup</h1>
                    <p className="text-gray-400 text-lg">Follow these steps carefully</p>
                  </div>
                </div>
              </div>

              {/* Circuit / Apparatus Diagram — only here in Procedure */}
              {practical.circuitDiagram && (
                <section className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Target className="w-8 h-8 text-cyan-400" />
                    <h2 className="text-3xl font-bold text-white">Circuit / Apparatus Setup</h2>
                  </div>
                  <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
                    <p className="text-gray-300 whitespace-pre-line leading-relaxed text-lg">{practical.circuitDiagram}</p>
                  </div>
                </section>
              )}

              {/* Materials */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                  <h2 className="text-3xl font-bold text-white">Materials Required</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {practical.materials.map((material: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 bg-gradient-to-r from-gray-800/40 to-gray-900/40 border border-green-500/20 rounded-lg p-5">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 font-medium">{material}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Step-by-Step Procedure */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Star className="w-8 h-8 text-yellow-400" />
                  <h2 className="text-3xl font-bold text-white">Step-by-Step Procedure</h2>
                </div>
                <div className="space-y-5">
                  {practical.procedure.map((step: string, idx: number) => (
                    <div key={idx} className="flex gap-6 items-start bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-cyan-500/20 rounded-xl p-7">
                      <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 text-white font-bold rounded-lg flex items-center justify-center flex-shrink-0 border-4 border-gray-900">
                        <span className="text-xl">{idx + 1}</span>
                      </div>
                      <p className="text-gray-300 pt-3 leading-relaxed flex-1 text-lg">{step}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Safety Precautions */}
              <section className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">⚠️</span>
                  <h2 className="text-3xl font-bold text-white">Safety Precautions</h2>
                </div>
                <div className="space-y-4">
                  {practical.precautions.map((precaution: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-4 bg-gray-900/40 border border-yellow-500/20 p-5 rounded-lg">
                      <span className="text-yellow-400 text-2xl">⚠</span>
                      <span className="text-gray-300 leading-relaxed pt-1">{precaution}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* ==================== OBSERVATIONS TAB ==================== */}
          {activeTab === 'observations' && (
            <div className="space-y-10">
              <div className="mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Observations & Results</h1>
                    <p className="text-gray-400 text-lg">Record your measurements and analyze data</p>
                  </div>
                </div>
              </div>

              {/* Observation Tables — fully generic, handles all data shapes */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="w-8 h-8 text-orange-400" />
                  <h2 className="text-3xl font-bold text-white">Observation Tables</h2>
                </div>

                {Object.entries(practical.observations).map(([key, value]: [string, any], entryIdx: number) => {
                  const tableColors = [
                    { border: 'border-orange-500/20', head: 'from-orange-900/50 to-red-900/50',     text: 'text-orange-300' },
                    { border: 'border-purple-500/20', head: 'from-purple-900/50 to-pink-900/50',     text: 'text-purple-300' },
                    { border: 'border-cyan-500/20',   head: 'from-cyan-900/50 to-blue-900/50',       text: 'text-cyan-300'   },
                    { border: 'border-green-500/20',  head: 'from-green-900/50 to-emerald-900/50',   text: 'text-green-300'  },
                    { border: 'border-pink-500/20',   head: 'from-pink-900/50 to-rose-900/50',       text: 'text-pink-300'   },
                    { border: 'border-yellow-500/20', head: 'from-yellow-900/50 to-amber-900/50',    text: 'text-yellow-300' },
                  ];
                  const color = tableColors[entryIdx % tableColors.length];
                  const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim();

                  // ── 1. Array of objects → render as table ──────────────────────
                  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
                    return (
                      <div key={key} className={`mb-8 overflow-x-auto bg-gradient-to-br from-gray-800/40 to-gray-900/40 border ${color.border} rounded-xl`}>
                        <div className={`px-6 py-3 bg-gradient-to-r ${color.head}`}>
                          <h3 className={`font-bold text-base ${color.text} uppercase tracking-wider`}>{label}</h3>
                        </div>
                        <table className="w-full">
                          <thead className={`bg-gradient-to-r ${color.head}`}>
                            <tr>
                              {Object.keys(value[0]).map((header) => (
                                <th key={header} className={`border-b border-gray-700 px-6 py-4 text-left ${color.text} font-bold uppercase text-xs tracking-wider`}>
                                  {header.replace(/([A-Z])/g, ' $1').trim()}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {value.map((row: any, idx: number) => (
                              <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-900/40' : 'bg-gray-800/40'}>
                                {Object.values(row).map((val: any, i: number) => (
                                  <td key={i} className="border-b border-gray-800 px-6 py-4 text-gray-300 font-medium text-sm">{val}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }

                  // ── 2. Nested plain object (e.g. summaryObservations, pHScaleSummary) ──
                  if (
                    typeof value === 'object' &&
                    value !== null &&
                    !Array.isArray(value)
                  ) {
                    return (
                      <div key={key} className={`mb-8 bg-gradient-to-br from-gray-800/40 to-gray-900/40 border ${color.border} rounded-xl overflow-hidden`}>
                        <div className={`px-6 py-3 bg-gradient-to-r ${color.head}`}>
                          <h3 className={`font-bold text-base ${color.text} uppercase tracking-wider`}>{label}</h3>
                        </div>
                        <div className="p-6 space-y-4">
                          {Object.entries(value).map(([k, v]) => (
                            <div key={k} className="flex flex-col sm:flex-row sm:gap-4">
                              <span className={`font-bold text-sm ${color.text} sm:min-w-[200px] capitalize`}>
                                {k.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <span className="text-gray-300 leading-relaxed">{String(v)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  // ── 3. graphDescription string ─────────────────────────────────
                  if (key === 'graphDescription' && typeof value === 'string') {
                    return (
                      <div key={key} className="mb-6 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-xl p-8">
                        <div className="flex items-center gap-3 mb-4">
                          <TrendingUp className="w-6 h-6 text-cyan-400" />
                          <h3 className="text-xl font-bold text-cyan-300">Graph Analysis</h3>
                        </div>
                        <p className="text-gray-300 leading-relaxed text-lg">{value}</p>
                      </div>
                    );
                  }

                  // ── 4. Any other string summary ────────────────────────────────
                  if (typeof value === 'string') {
                    return (
                      <div key={key} className={`mb-6 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border ${color.border} rounded-xl p-6`}>
                        <h3 className={`text-base font-bold ${color.text} mb-2`}>{label}:</h3>
                        <p className="text-gray-200 text-lg">{value}</p>
                      </div>
                    );
                  }

                  return null;
                })}

                {Object.keys(practical.observations).length === 0 && (
                  <p className="text-gray-500 italic">No observation data available.</p>
                )}
              </section>

              {/* Final Result */}
              <section className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/40 rounded-xl p-10">
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-12 h-12 text-green-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-green-300 mb-2">Final Result</h3>
                    <p className="text-gray-200 text-2xl font-bold">{practical.result}</p>
                  </div>
                </div>
              </section>

              {/* Sources of Error */}
              {practical.sourcesOfError && practical.sourcesOfError.length > 0 && (
                <section className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">🔍</span>
                    <h2 className="text-3xl font-bold text-white">Sources of Error</h2>
                  </div>
                  <div className="space-y-4">
                    {practical.sourcesOfError.map((error: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-4 bg-gray-900/40 border border-red-500/20 p-5 rounded-lg">
                        <span className="text-red-400 text-xl">•</span>
                        <span className="text-gray-300 leading-relaxed">{error}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* ==================== QUIZ TAB ==================== */}
          {activeTab === 'quiz' && practical.quiz && (
            <QuizTab quiz={practical.quiz} />
          )}

          {/* ==================== FAQs TAB ==================== */}
          {activeTab === 'faqs' && (
            <div className="space-y-8">
              <div className="mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                    <HelpCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Frequently Asked Questions</h1>
                    <p className="text-gray-400 text-lg">Common questions and answers</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {practical.faqs?.map((faq: any) => (
                  <CollapsibleSection key={faq.id} title={faq.q} icon={HelpCircle}>
                    <p className="text-gray-300 leading-relaxed text-lg">{faq.a}</p>
                  </CollapsibleSection>
                ))}
              </div>

              <div className="mt-16">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="w-8 h-8 text-purple-400" />
                  <h2 className="text-3xl font-bold text-white">Viva Questions & Answers</h2>
                </div>
                <div className="space-y-4">
                  {practical.vivaQuestions?.map((viva: any, idx: number) => (
                    <CollapsibleSection key={idx} title={viva.q} icon={MessageSquare}>
                      <p className="text-gray-300 leading-relaxed text-lg">{viva.a}</p>
                    </CollapsibleSection>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Floating Start Experiment Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => setShowStartModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 text-white font-bold py-4 px-8 rounded-full transition-all shadow-2xl hover:scale-105"
        >
          <Rocket className="w-5 h-5" />
          <span className="hidden sm:inline">Start Virtual Lab</span>
          <span className="sm:hidden">Start</span>
        </button>
      </div>

      {/* Start Modal */}
      {showStartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm" onClick={() => setShowStartModal(false)}>
          <div className="relative max-w-2xl w-full p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 border border-cyan-500/30" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowStartModal(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-2xl text-gray-400 hover:text-cyan-400">×</button>
            <div className="mb-6">
              <div className="inline-block px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-white mb-4">VIRTUAL LAB</div>
              <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{practical.title}</h2>
              <p className="text-gray-400">{practical.description}</p>
            </div>
            <div className="mb-8 p-6 rounded-2xl border border-gray-800 bg-gray-900/30">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                What You'll Learn
              </h3>
              <ul className="space-y-3">
                {practical.keyConcepts?.slice(0, 5).map((c: any, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">✓</div>
                    <span>{c.title}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setShowStartModal(false)}
              className="w-full py-4 rounded-xl font-bold text-black bg-gradient-to-r from-cyan-500 to-blue-500 transition-all hover:scale-105"
            >
              Launch Virtual Lab
            </button>
          </div>
        </div>
      )}
    </div>
  );
}