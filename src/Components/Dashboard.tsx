import { useState, useEffect } from 'react';
import { Zap, Beaker, Microscope, ArrowRight, Clock, TrendingUp, CheckCircle, Sparkles, LogOut, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [animateLoad, setAnimateLoad] = useState(false);

  useEffect(() => {
    setAnimateLoad(true);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  const displayName = user?.fullName || 'Student';
  const classLevel = user?.classLevel || 'N/A';
  const studentId = user?.studentId || 'N/A';

  const subjects = [
    { 
      id: 'physics', 
      name: 'Physics', 
      icon: Zap,
      color: 'from-blue-500 to-cyan-400',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      accentColor: 'rgb(59, 130, 246)',
      labs: 3,
      progress: 75,
      route: '/physics'
    },
    { 
      id: 'chemistry', 
      name: 'Chemistry', 
      icon: Beaker,
      color: 'from-purple-500 to-pink-400',
      bgColor: 'rgba(168, 85, 247, 0.1)',
      borderColor: 'rgba(168, 85, 247, 0.3)',
      accentColor: 'rgb(168, 85, 247)',
      labs: 3,
      progress: 60,
      route: '/chemistry'
    },
    {
      id: 'biology', 
      name: 'Biology', 
      icon: Microscope,
      color: 'from-emerald-500 to-green-400',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      accentColor: 'rgb(16, 185, 129)',
      labs: 3,
      progress: 85,
      route: '/biology'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-black text-white overflow-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
               <span className="font-black text-white text-lg">{displayName[0]}</span>
             </div>
             <div>
               <span className="font-black text-white tracking-tighter text-xl block leading-none">SHIKARA</span>
               <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase">Virtual Lab</span>
             </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="px-3 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs sm:text-sm font-bold flex items-center gap-2 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-0.5 transition-all"
              >
                <Shield size={16} className="text-purple-200" />
                <span className="hidden md:inline">Admin Control</span>
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-3 sm:px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-xs sm:text-sm font-bold flex items-center gap-2 hover:bg-white/10 hover:text-white transition-all"
            >
              <LogOut size={16} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-[500px] h-[500px] bg-cyan-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full px-4 sm:px-8 md:px-12 lg:px-[70px] py-8 pt-28 max-w-7xl mx-auto">
        <div className={`mb-12 transition-all duration-1000 ${animateLoad ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative rounded-[2rem] overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 via-transparent to-blue-600/10 backdrop-blur-md"></div>
            <div className="absolute inset-0 border border-white/10 rounded-[2rem]"></div>
            <div className="relative p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <p className="text-xs font-black text-cyan-400 uppercase tracking-[0.2em]">Welcome back, {displayName}</p>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight leading-none">
                    Ready to master your <br className="hidden sm:block" />
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">curriculum?</span>
                  </h1>
                  <p className="text-lg text-gray-400 font-medium">Class {classLevel} • Student ID: <span className="text-white">{studentId}</span></p>
                </div>
                <div className="hidden md:block w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 opacity-20"></div>
              </div>
              <p className="text-gray-300 max-w-4xl leading-relaxed">
                Continue mastering your curriculum through interactive virtual experiments. You're on track to excel in your exams!
              </p>
            </div>
          </div>
        </div>

        <div className={`mb-12 transition-all duration-1000 delay-200 ${animateLoad ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-black mb-2">Lab Sessions</h2>
            <p className="text-gray-400">Choose your subject and start experimenting</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subjects.map((subject, idx) => {
              const IconComponent = subject.icon;
              return (
                <Link
                  to={subject.route}
                  key={subject.id}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer transform transition-all duration-500"
                  style={{ transitionDelay: `${300 + idx * 100}ms` }}
                >
                  <div className="absolute inset-0" style={{ background: subject.bgColor }}></div>
                  <div className="absolute inset-0 border rounded-2xl" style={{ borderColor: subject.borderColor }}></div>
                  <div className="relative p-6 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className={`text-2xl font-black mb-1 bg-gradient-to-r ${subject.color} bg-clip-text text-transparent`}>{subject.name}</h3>
                          <p className="text-sm text-gray-400">{subject.labs} Labs Available</p>
                        </div>
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${subject.color} bg-clip-padding text-white/20`}>
                          <IconComponent size={24} />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-gray-400">PROGRESS</span>
                          <span className="text-xs font-bold" style={{ color: subject.accentColor }}>{subject.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${subject.color} rounded-full`} style={{ width: `${subject.progress}%` }}></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold group-hover:translate-x-1 transition-transform" style={{ color: subject.accentColor }}>
                        <span>Explore Labs</span>
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-1000 delay-500 ${animateLoad ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {[
            { label: 'Total Hours', value: '48h', icon: Clock },
            { label: 'Avg. Score', value: '85%', icon: TrendingUp },
            { label: 'Completed', value: '24', icon: CheckCircle },
            { label: 'In Progress', value: '12', icon: Sparkles }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="relative rounded-xl overflow-hidden border border-gray-800/50 hover:border-cyan-500/30 transition-all duration-300 p-4">
                <Icon size={20} className="text-cyan-400 mb-2 opacity-50" />
                <p className="text-2xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}
