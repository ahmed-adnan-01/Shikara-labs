import { useState, useMemo } from 'react';
import { 
  Users, MessageSquare, Star, Clock, Beaker, 
  Search, ChevronLeft, ChevronRight, Monitor, Smartphone, Tablet
} from 'lucide-react';
import { generateLogins, generateFeedback } from '../data/generateData';

const TABS = ["stats", "sessions", "feedback"] as const;
type Tab = typeof TABS[number];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("stats");
  const [sessionPage, setSessionPage] = useState(1);
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");

  const logins = useMemo(() => generateLogins(), []);
  const feedback = useMemo(() => generateFeedback(), []);

  const itemsPerPage = 20;

  // Stats calculations
  const stats = useMemo(() => {
    const physics = feedback.filter(f => f.subject === "Physics");
    const chemistry = feedback.filter(f => f.subject === "Chemistry");
    const biology = feedback.filter(f => f.subject === "Biology");

    const avg = (arr: any[]) => arr.length ? (arr.reduce((acc, curr) => acc + curr.rating, 0) / arr.length).toFixed(1) : "0";

    return {
      totalLogins: logins.length,
      totalFeedback: feedback.length,
      avgRating: avg(feedback),
      physicsAvg: avg(physics),
      chemistryAvg: avg(chemistry),
      biologyAvg: avg(biology),
      ratings: [5, 4, 3, 2, 1].map(r => ({
        stars: r,
        count: feedback.filter(f => f.rating === r).length
      }))
    };
  }, [logins, feedback]);

  const filteredSessions = logins.filter(s => 
    s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFeedback = feedback.filter(f => 
    (subjectFilter === "All" || f.subject === subjectFilter) &&
    (f.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
     f.message.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pagedSessions = filteredSessions.slice((sessionPage - 1) * itemsPerPage, sessionPage * itemsPerPage);
  const pagedFeedback = filteredFeedback.slice((feedbackPage - 1) * itemsPerPage, feedbackPage * itemsPerPage);

  return (
    <div className="mt-12 min-h-screen bg-black text-white p-4 sm:p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
              ADMIN CONTROL PANEL
            </h1>
            <p className="text-gray-400 text-sm"> 2026  Data</p>
          </div>
          
          <div className="flex bg-gray-900/50 p-1 rounded-xl border border-white/10">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "stats" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Users} label="Total Logins" value={stats.totalLogins} color="cyan" />
              <StatCard icon={MessageSquare} label="Total Feedback" value={stats.totalFeedback} color="green" />
              <StatCard icon={Star} label="Avg Rating" value={`${stats.avgRating}/5.0`} color="yellow" />
              <StatCard icon={Clock} label="Days Active" value="59" color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-900/30 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Beaker className="text-cyan-400" size={20} /> Subject Performance
                </h3>
                <div className="space-y-6">
                  <SubjectProgress label="Physics" avg={stats.physicsAvg} color="from-blue-500 to-cyan-400" status="Excellent" />
                  <SubjectProgress label="Chemistry" avg={stats.chemistryAvg} color="from-purple-500 to-pink-400" status="Good" />
                  <SubjectProgress label="Biology" avg={stats.biologyAvg} color="from-emerald-500 to-green-400" status="Needs Improvement" />
                </div>
              </div>

              <div className="bg-gray-900/30 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Star className="text-yellow-400" size={20} /> Rating Distribution
                </h3>
                <div className="space-y-3">
                  {stats.ratings.map(r => (
                    <div key={r.stars} className="flex items-center gap-4">
                      <span className="text-xs font-bold w-4">{r.stars}★</span>
                      <div className="flex-grow h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-400" 
                          style={{ width: `${(r.count / stats.totalFeedback) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8">{r.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "sessions" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by first name or email..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <Pagination current={sessionPage} total={Math.ceil(filteredSessions.length / itemsPerPage)} onPageChange={setSessionPage} />
            </div>

            <div className="bg-gray-900/30 border border-white/10 rounded-2xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-white/5 text-gray-400 uppercase text-[10px] tracking-widest border-b border-white/10">
                    <th className="px-6 py-4">First Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Device</th>
                    <th className="px-6 py-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pagedSessions.map(s => (
                    <tr key={s.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-bold">{s.firstName}</td>
                      <td className="px-6 py-4 text-gray-400">{s.email}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <DeviceIcon name={s.device} />
                          <span className="text-xs truncate max-w-[150px]">{s.device}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-cyan-400 font-mono text-xs">
                        {new Date(s.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "feedback" && (
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4 justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-grow max-w-2xl">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search feedback..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-900/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <select 
                  value={subjectFilter}
                  onChange={e => setSubjectFilter(e.target.value)}
                  className="bg-gray-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none"
                >
                  <option value="All">All Subjects</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>
              <Pagination current={feedbackPage} total={Math.ceil(filteredFeedback.length / itemsPerPage)} onPageChange={setFeedbackPage} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pagedFeedback.map(f => (
                <div key={f.id} className="bg-gray-900/30 border border-white/10 rounded-2xl p-5 hover:border-cyan-500/30 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-cyan-400">
                        {f.firstName[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{f.firstName}</h4>
                        <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{f.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        f.subject === "Physics" ? "bg-blue-500/10 text-blue-400" :
                        f.subject === "Chemistry" ? "bg-purple-500/10 text-purple-400" :
                        "bg-emerald-500/10 text-emerald-400"
                      }`}>
                        {f.subject}
                      </span>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} fill={i < f.rating ? "currentColor" : "none"} strokeWidth={i < f.rating ? 0 : 2} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4 italic">"{f.message}"</p>
                  <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
                    <span>{new Date(f.timestamp).toLocaleDateString()}</span>
                    <span>{new Date(f.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  const colors: any = {
    cyan: "text-cyan-400 border-cyan-400/20 bg-cyan-400/5",
    green: "text-green-400 border-green-400/20 bg-green-400/5",
    yellow: "text-yellow-400 border-yellow-400/20 bg-yellow-400/5",
    purple: "text-purple-400 border-purple-400/20 bg-purple-400/5"
  };

  return (
    <div className={`p-6 rounded-2xl border transition-all hover:scale-105 duration-300 ${colors[color]}`}>
      <Icon size={24} className="mb-4 opacity-50" />
      <p className="text-2xl font-black mb-1">{value}</p>
      <p className="text-xs uppercase tracking-widest font-bold opacity-70">{label}</p>
    </div>
  );
}

function SubjectProgress({ label, avg, color, status }: any) {
  const score = parseFloat(avg);
  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <div>
          <span className="text-sm font-bold">{label}</span>
          <span className={`ml-3 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
            score >= 4 ? 'bg-green-500/10 text-green-400' :
            score >= 3 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
          }`}>
            {status}
          </span>
        </div>
        <span className="text-sm font-black">{avg}/5.0</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${color}`} style={{ width: `${(score / 5) * 100}%` }} />
      </div>
    </div>
  );
}

function Pagination({ current, total, onPageChange }: any) {
  return (
    <div className="flex items-center gap-2">
      <button 
        disabled={current === 1}
        onClick={() => onPageChange(current - 1)}
        className="p-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="text-xs font-bold text-gray-500 px-2">{current} / {total}</span>
      <button 
        disabled={current === total}
        onClick={() => onPageChange(current + 1)}
        className="p-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

function DeviceIcon({ name }: { name: string }) {
  if (name.includes("iPhone") || name.includes("Samsung") || name.includes("Xiaomi") || name.includes("OnePlus") || name.includes("Realme") || name.includes("Vivo")) {
    return <Smartphone size={14} className="text-gray-500" />;
  }
  if (name.includes("iPad")) {
    return <Tablet size={14} className="text-gray-500" />;
  }
  return <Monitor size={14} className="text-gray-500" />;
}
