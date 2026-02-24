import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  LogOut, 
  ArrowLeft, 
  Monitor, 
  Chrome,
  Smartphone,
  Clock,
  Mail,
  GraduationCap,
  UserCheck,
  Activity
} from 'lucide-react';

interface User {
  id: string;
  fullName: string;
  studentId: string;
  email: string;
  classLevel: string;
  role: 'student' | 'admin';
  createdAt: string;
  lastLogin: string;
}

interface LoginSession {
  userId: string;
  email: string;
  fullName: string;
  device: string;
  browser: string;
  loginTime: string;
  ipAddress: string;
}

export default function AdminPanel() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [sessions, setSessions] = useState<LoginSession[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'sessions'>('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/dashboard');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const usersStr = localStorage.getItem('users');
        const sessionsStr = localStorage.getItem('loginSessions');

        if (usersStr) setUsers(JSON.parse(usersStr));
        if (sessionsStr) setSessions(JSON.parse(sessionsStr));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAdmin, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDeviceIcon = (device: string) => {
    if (device.includes('Mobile') || device.includes('iPhone') || device.includes('Android')) {
      return <Smartphone size={16} className="text-cyan-400" />;
    }
    return <Monitor size={16} className="text-emerald-400" />;
  };

  const getBrowserIcon = () => {
    return <Chrome size={16} className="text-blue-400" />;
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
    };
  };

  const stats = {
    totalUsers: users.length,
    totalSessions: sessions.length,
    primaryStudents: users.filter(u => u.classLevel === 'primary').length,
    middleStudents: users.filter(u => u.classLevel === 'middle').length,
    secondaryStudents: users.filter(u => u.classLevel === 'secondary').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-lg border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-lg bg-purple-600/20 border border-purple-500/50 text-purple-400 hover:bg-purple-600/30 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1
                  className="text-2xl font-black flex items-center gap-2"
                  style={{
                    background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Admin Panel
                </h1>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
               Adnan
                  <span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded text-[10px] font-bold">
                    
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-600/20 border border-red-500/50 text-red-400 font-semibold flex items-center gap-2 hover:bg-red-600/30 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div
            className="p-6 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(168,85,247,0.05))',
              border: '1px solid rgba(168, 85, 247, 0.3)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <Users size={24} className="text-purple-400" />
            </div>
            <p className="text-3xl font-black text-white mb-1">{stats.totalUsers}</p>
            <p className="text-sm text-purple-300">Total Users</p>
          </div>

          <div
            className="p-6 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(236,72,153,0.05))',
              border: '1px solid rgba(236, 72, 153, 0.3)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <Activity size={24} className="text-pink-400" />
            </div>
            <p className="text-3xl font-black text-white mb-1">{stats.totalSessions}</p>
            <p className="text-sm text-pink-300">Login Sessions</p>
          </div>

          <div
            className="p-6 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,212,255,0.05))',
              border: '1px solid rgba(0, 212, 255, 0.3)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <GraduationCap size={24} className="text-cyan-400" />
            </div>
            <p className="text-3xl font-black text-white mb-1">{stats.primaryStudents}</p>
            <p className="text-sm text-cyan-300">Primary (1-5)</p>
          </div>

          <div
            className="p-6 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,255,136,0.05))',
              border: '1px solid rgba(0, 255, 136, 0.3)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <GraduationCap size={24} className="text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-white mb-1">{stats.middleStudents}</p>
            <p className="text-sm text-emerald-300">Middle (6-8)</p>
          </div>

          <div
            className="p-6 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(88,101,242,0.2), rgba(88,101,242,0.05))',
              border: '1px solid rgba(88, 101, 242, 0.3)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <GraduationCap size={24} className="text-indigo-400" />
            </div>
            <p className="text-3xl font-black text-white mb-1">{stats.secondaryStudents}</p>
            <p className="text-sm text-indigo-300">Secondary (9-10)</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 font-bold transition-all ${
                activeTab === 'users'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Registered Users
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`px-6 py-3 font-bold transition-all ${
                activeTab === 'sessions'
                  ? 'text-pink-400 border-b-2 border-pink-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Login Sessions
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="w-full py-20 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {/* Users Table */}
            {activeTab === 'users' && (
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-purple-900/20">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-purple-300 uppercase tracking-wider">
                          Student Info
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-purple-300 uppercase tracking-wider">
                          Student ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-purple-300 uppercase tracking-wider">
                          Class Level
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-purple-300 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-purple-300 uppercase tracking-wider">
                          Joined Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-purple-300 uppercase tracking-wider">
                          Last Login
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                            No users registered yet
                          </td>
                        </tr>
                      ) : (
                        users.map((u) => {
                          const joined = formatDateTime(u.createdAt);
                          const lastLogin = formatDateTime(u.lastLogin);
                          return (
                            <tr
                              key={u.id}
                              className="hover:bg-purple-900/10 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                                    style={{
                                      background: u.role === 'admin' 
                                        ? 'linear-gradient(135deg, #a855f7, #ec4899)'
                                        : 'linear-gradient(135deg, #00d4ff, #00ff88)',
                                    }}
                                  >
                                    <span className="text-black font-bold">
                                      {u.fullName.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold text-white">{u.fullName}</div>
                                    <div className="text-xs text-gray-400 flex items-center gap-1">
                                      <Mail size={12} />
                                      {u.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm font-mono text-cyan-400">{u.studentId}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-900/30 text-emerald-400 capitalize">
                                  {u.classLevel}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 w-fit ${
                                    u.role === 'admin'
                                      ? 'bg-purple-900/30 text-purple-400'
                                      : 'bg-blue-900/30 text-blue-400'
                                  }`}
                                >
                                  <UserCheck size={12} />
                                  {u.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-white">{joined.date}</div>
                                <div className="text-xs text-gray-500">{joined.time}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-white">{lastLogin.date}</div>
                                <div className="text-xs text-gray-500">{lastLogin.time}</div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sessions Table */}
            {activeTab === 'sessions' && (
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-pink-900/20">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-pink-300 uppercase tracking-wider">
                          User Info
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-pink-300 uppercase tracking-wider">
                          Device
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-pink-300 uppercase tracking-wider">
                          Browser
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-pink-300 uppercase tracking-wider">
                          Login Time
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-pink-300 uppercase tracking-wider">
                          IP Address
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {sessions.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                            No login sessions recorded yet
                          </td>
                        </tr>
                      ) : (
                        sessions.map((session, idx) => {
                          const loginTime = formatDateTime(session.loginTime);
                          return (
                            <tr
                              key={idx}
                              className="hover:bg-pink-900/10 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-bold text-white">{session.fullName}</div>
                                  <div className="text-xs text-gray-400 flex items-center gap-1">
                                    <Mail size={12} />
                                    {session.email}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  {getDeviceIcon(session.device)}
                                  <span className="text-sm text-gray-300">{session.device}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  {getBrowserIcon()}
                                  <span className="text-sm text-gray-300">{session.browser}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <Clock size={14} className="text-pink-400" />
                                  <div>
                                    <div className="text-sm text-white">{loginTime.date}</div>
                                    <div className="text-xs text-gray-500">{loginTime.time}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm font-mono text-gray-400">{session.ipAddress}</span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
