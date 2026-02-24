import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PhysicsTopicsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [animateLoad, setAnimateLoad] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    setAnimateLoad(true);
  }, []);

  // Get actual student data from AuthContext
  const firstName = user?.fullName?.split(' ')[0] || 'Student';
  const classLevel = user?.classLevel || 'N/A';

  const experiments = [
    { 
      id: 'faradays-law', 
      title: "Verification of Faraday's Law", 
      color: 'from-cyan-400 to-blue-600', 
      accent: 'cyan',
      route: '/allexp/faradays-law'
    },
    { 
      id: 'ohms-law', 
      title: "Verification of Ohm's Law", 
      color: 'from-amber-400 to-orange-600', 
      accent: 'amber',
      route: '/allexp/ohms-law'
    },
    { 
      id: 'equivalent-resistance', 
      title: "Determination of Equivalent Resistance", 
      color: 'from-violet-400 to-purple-600', 
      accent: 'violet',
      route: '/allexp/equivalent-resistance'
    },
  ];

  const filteredExperiments = experiments.filter(exp =>
    exp.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-black text-white overflow-hidden relative pt-20">
      {/* Dynamic animated background hexagon pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-15">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexagons" width="60" height="60" patternUnits="userSpaceOnUse">
              <polygon points="30,0 60,15 60,45 30,60 0,45 0,15" fill="none" stroke="url(#hexGradient)" strokeWidth="1.5" opacity="0.6"/>
            </pattern>
            <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="33%" stopColor="#3b82f6" />
              <stop offset="66%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>

      {/* Animated gradient orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-cyan-500/30 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob-slow"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob-slow animation-delay-3000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob-slow animation-delay-5000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full px-4 sm:px-8 md:px-12 lg:px-16 py-16">
        
        {/* Hero Section */}
        <div className={`pt-16 mb-12 transition-all duration-1200 ${animateLoad ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-8 -left-8 w-24 h-24 border-2 border-cyan-500/30 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 border border-purple-500/20 rounded-3xl opacity-40 animate-spin-slow"></div>
            
            <div className="relative z-10">
              <div className="inline-block mb-4">
                <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-black backdrop-blur-xl border border-cyan-400/50 shadow-lg shadow-cyan-500/50 inline-block">
                  CLASS {classLevel.toUpperCase()} • PHYSICS
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-3 leading-tight">
                <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-shift">
                  Welcome back, {firstName}!
                </span>
                <span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Discover Physics Laws with Shikara Lab Experiments
                </span>
              </h1>
              
              <p className="text-sm md:text-base text-gray-400 max-w-2xl leading-relaxed font-light tracking-wide">
                Transform theory into thrilling discoveries through immersive virtual labs. Build intuition, test hypotheses, and witness physics in action—anytime, anywhere.
              </p>
            </div>
          </div>
        </div>

        {/* Search Section with glow */}
        <div className={`mb-16 transition-all duration-1200 delay-200 ${animateLoad ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="relative max-w-2xl group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/50 to-purple-500/50 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center gap-4 px-6 py-4 rounded-2xl bg-black/50 backdrop-blur-xl border-2 border-white/10 group-focus-within:border-cyan-500/50 transition-all duration-300">
              <Search size={24} className="text-gray-400 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="text"
                placeholder="Search experiments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent text-white text-lg placeholder-gray-500 focus:outline-none font-light tracking-wide"
              />
            </div>
          </div>
        </div>

        {/* Experiments Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 transition-all duration-1200 delay-300 ${
          animateLoad ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}>
          {filteredExperiments.map((experiment, idx) => (
            <Link
              to={experiment.route}
              key={experiment.id}
              onMouseEnter={() => setHoveredId(experiment.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative group cursor-pointer h-80 perspective transform transition-all duration-500 hover:scale-105"
              style={{
                transitionDelay: `${animateLoad ? idx * 80 : 0}ms`
              }}
            >
              {/* Card background with gradient border */}
              <div className={`absolute inset-0 bg-gradient-to-br ${experiment.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
              
              {/* Animated border gradient */}
              <div className={`absolute inset-0 rounded-3xl overflow-hidden p-0.5 bg-gradient-to-br ${experiment.color}`}>
                <div className="w-full h-full bg-black/80 backdrop-blur-2xl rounded-3xl flex flex-col justify-between p-8 border border-white/5">
                  
                  {/* Top decorative element */}
                  <div className="absolute top-6 right-6 w-20 h-20 rounded-full border-2 border-white/10 group-hover:border-white/30 transition-all duration-500 opacity-40 group-hover:opacity-100">
                    <div className="w-full h-full rounded-full border border-white/20 mt-2 ml-2"></div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex items-center justify-center">
                    <h3 className="text-2xl md:text-3xl font-black text-white group-hover:text-white transition-all duration-500 text-center leading-tight">
                      {experiment.title}
                    </h3>
                  </div>

                  {/* Bottom action */}
                  <div className="pt-8 border-t border-white/10 group-hover:border-white/30 transition-colors duration-500">
                    <button className={`w-full relative overflow-hidden rounded-lg py-3 px-6 font-bold text-sm uppercase tracking-widest transition-all duration-500 group-hover:shadow-2xl bg-gradient-to-r ${experiment.color} ${hoveredId === experiment.id ? 'text-black' : 'text-white'}`}>
                      <span>
                        Start Experiment →
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Glow effect on hover */}
              <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl -z-10 bg-gradient-to-br ${experiment.color}`}
                style={{
                  boxShadow: hoveredId === experiment.id ? '0 0 40px 10px rgba(0, 0, 0, 0.3)' : 'none'
                }}
              ></div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredExperiments.length === 0 && (
          <div className={`text-center py-32 transition-all duration-500 ${animateLoad ? 'opacity-100' : 'opacity-0'}`}>
            <div className="mb-6">
              <div className="inline-block">
                <div className="w-24 h-24 rounded-full border-4 border-white/20 flex items-center justify-center mx-auto">
                  <span className="text-4xl">🔍</span>
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">No experiments found</h2>
            <p className="text-lg text-gray-400">Try adjusting your search</p>
          </div>
        )}

        {/* Footer accent */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-600/20 to-transparent rounded-full filter blur-3xl pointer-events-none opacity-50"></div>
      </div>

      <style>{`
        @keyframes blob-slow {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(50px, -60px) scale(1.15);
          }
          66% {
            transform: translate(-40px, 30px) scale(0.95);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-blob-slow {
          animation: blob-slow 8s infinite ease-in-out;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 6s ease infinite;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }

        .animation-delay-5000 {
          animation-delay: 5s;
        }

        .perspective {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
