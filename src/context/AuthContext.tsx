import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface LoginData {
  emailOrUsername: string;
  password: string;
}

interface RegisterData {
  fullName: string;
  studentId: string;
  email: string;
  password: string;
  classLevel: string;
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

interface AuthContextType {
  user: User | null;
  login: (data: LoginData) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to detect device and browser
export const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  let device = 'Unknown Device';
  let browser = 'Unknown Browser';

  if (/Mobile|Android|iPhone|iPad|iPod/.test(userAgent)) {
    if (/iPhone/.test(userAgent)) device = 'iPhone';
    else if (/iPad/.test(userAgent)) device = 'iPad';
    else if (/Android/.test(userAgent)) device = 'Android Device';
    else device = 'Mobile Device';
  } else {
    device = 'Desktop/Laptop';
  }

  if (/Chrome/.test(userAgent) && !/Edg/.test(userAgent)) browser = 'Chrome';
  else if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) browser = 'Safari';
  else if (/Firefox/.test(userAgent)) browser = 'Firefox';
  else if (/Edg/.test(userAgent)) browser = 'Edge';
  else if (/Opera|OPR/.test(userAgent)) browser = 'Opera';

  return { device, browser };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (data: LoginData) => {
    const usersStr = localStorage.getItem('users');
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];

    if (data.emailOrUsername === 'ahmed' && data.password === '25092005') {
      const adminUser: User = {
        id: 'admin-001',
        fullName: 'ADNAN',
        studentId: '01',
        email: 'ahmed.adnan@gmail.com',
        classLevel: 'DYOD',
        role: 'admin',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      setUser(adminUser);
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      recordLoginSession(adminUser);
      return adminUser;
    }

    const foundUser = users.find(
      (u) => (u.email === data.emailOrUsername || u.studentId === data.emailOrUsername)
    );

    if (!foundUser) throw new Error('User not found');

    const passwords = JSON.parse(localStorage.getItem('passwords') || '{}');
    if (passwords[foundUser.id] !== data.password) {
      throw new Error('Invalid password');
    }

    foundUser.lastLogin = new Date().toISOString();
    const updatedUsers = users.map((u) => (u.id === foundUser.id ? foundUser : u));
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    setUser(foundUser);
    localStorage.setItem('currentUser', JSON.stringify(foundUser));
    recordLoginSession(foundUser);
    return foundUser;
  };

  const recordLoginSession = (user: User) => {
    const { device, browser } = getDeviceInfo();
    const session: LoginSession = {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      device,
      browser,
      loginTime: new Date().toISOString(),
      ipAddress: 'N/A',
    };

    const sessionsStr = localStorage.getItem('loginSessions');
    const sessions: LoginSession[] = sessionsStr ? JSON.parse(sessionsStr) : [];
    sessions.push(session);
    localStorage.setItem('loginSessions', JSON.stringify(sessions));
  };

  const register = async (data: RegisterData) => {
    const usersStr = localStorage.getItem('users');
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];

    const exists = users.find(
      (u) => u.email === data.email || u.studentId === data.studentId
    );

    if (exists) throw new Error('Email or Student ID already registered');

    const newUser: User = {
      id: `user-${Date.now()}`,
      fullName: data.fullName,
      studentId: data.studentId,
      email: data.email,
      classLevel: data.classLevel,
      role: 'student',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const passwords = JSON.parse(localStorage.getItem('passwords') || '{}');
    passwords[newUser.id] = data.password;
    localStorage.setItem('passwords', JSON.stringify(passwords));

    // Send email via Formspree
    try {
      fetch('https://formspree.io/f/xojnqdyz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          subject: 'New Student Registration - Shikara Lab',
          fullName: newUser.fullName,
          email: newUser.email,
          studentId: newUser.studentId,
          classLevel: newUser.classLevel,
          registrationTime: new Date(newUser.createdAt).toLocaleString()
        })
      });
    } catch (err) {
      console.error('Failed to send registration email:', err);
    }

    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    recordLoginSession(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
