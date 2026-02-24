import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ChemistryTopicPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [animateLoad, setAnimateLoad] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    setAnimateLoad(true);
  }, []);

  const firstName = user?.fullName?.split(' ')[0] || 'Student';
  const classLevel = user?.classLevel || 'N/A';

  const experiments = [
    { 
      id: 'ph-determination', 
      title: "Acid-Base Indicator Lab", 
      color: 'from-pink-400 to-rose-600', 
      route: '/allexp/ph-determination'
    },
    { 
      id: 'chemical-reactions', 
      title: "Chemical Reactions Interactive Lab", 
      color: 'from-purple-400 to-indigo-600', 
      route: '/allexp/chemical-reactions'
    },
    { 
      id: 'soap-cleansing-action', 
      title: "Soap Cleansing Action Lab", 
      color: 'from-emerald-400 to-teal-600', 
      route: '/allexp/soap-cleansing-action'
    },
  ];

  const filteredExperiments = experiments.filter(exp =>
    exp.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-black text-white overflow-hidden relative pt-20">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-pink-500/30 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob-slow"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob-slow animation-delay-3000"></div>
      </div>

      <div className="relative z-10 w-full px-4 sm:px-8 md:px-12 lg:px-16 py-16">
        {/* Hero Section */}
        <div className={`pt-16 mb-12 transition-all duration-1200 ${animateLoad ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="inline-block mb-4">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-black backdrop-blur-xl border border-pink-400/50 shadow-lg shadow-pink-500/50 inline-block">
              CLASS {classLevel.toUpperCase()} • CHEMISTRY
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-3 leading-tight">
            <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Welcome back, {firstName}!
            </span>
            <span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Explore Chemistry with Shikara Lab Experiments
            </span>
          </h1>
          
          <p className="text-sm md:text-base text-gray-400 max-w-2xl leading-relaxed font-light tracking-wide">
            Conduct chemistry experiments virtually. Master concepts in acids, bases, metals, organic chemistry, and prepare for board examinations.
          </p>
        </div>

        {/* Search Section */}
        <div className={`mb-16 transition-all duration-1200 delay-200 ${animateLoad ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="relative max-w-2xl group">
            <div className="relative flex items-center gap-4 px-6 py-4 rounded-2xl bg-black/50 backdrop-blur-xl border-2 border-white/10 group-focus-within:border-pink-500/50 transition-all duration-300">
              <Search size={24} className="text-gray-400 group-focus-within:text-pink-400 transition-colors" />
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
              style={{ transitionDelay: `${animateLoad ? idx * 80 : 0}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${experiment.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
              <div className={`absolute inset-0 rounded-3xl overflow-hidden p-0.5 bg-gradient-to-br ${experiment.color}`}>
                <div className="w-full h-full bg-black/80 backdrop-blur-2xl rounded-3xl flex flex-col justify-between p-8 border border-white/5">
                  <div className="flex-1 flex items-center justify-center">
                    <h3 className="text-2xl md:text-3xl font-black text-white text-center leading-tight">
                      {experiment.title}
                    </h3>
                  </div>
                  <div className="pt-8 border-t border-white/10 group-hover:border-white/30 transition-colors duration-500">
                    <button className={`w-full relative overflow-hidden rounded-lg py-3 px-6 font-bold text-sm uppercase tracking-widest transition-all duration-500 bg-gradient-to-r ${experiment.color} ${hoveredId === experiment.id ? 'text-black' : 'text-white'}`}>
                      <span>Start Experiment →</span>
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes blob-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, -60px) scale(1.15); }
          66% { transform: translate(-40px, 30px) scale(0.95); }
        }
        .animate-blob-slow { animation: blob-slow 8s infinite ease-in-out; }
        .animation-delay-3000 { animation-delay: 3s; }
        .perspective { perspective: 1000px; }
      `}</style>
    </div>
  );
}
