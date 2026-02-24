import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  fullName: string;
  email: string;
  studentId: string;
  classLevel: string;
  role: 'student' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('shikara_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const isAdmin = user?.email === 'admin@shikara.com';

  const login = async (data: any) => {
    const { emailOrUsername, password } = data;

    // Admin default
    if (emailOrUsername === 'admin@shikara.com' && password === 'admin123') {
      const adminUser: User = {
        fullName: 'Administrator',
        email: 'admin@shikara.com',
        studentId: 'ADMIN001',
        classLevel: 'All',
        role: 'admin'
      };
      setUser(adminUser);
      localStorage.setItem('shikara_user', JSON.stringify(adminUser));
      return;
    }

    // Check local students
    const students = JSON.parse(localStorage.getItem('shikara_students') || '[]');
    const student = students.find((s: any) => (s.email === emailOrUsername || s.fullName === emailOrUsername) && s.password === password);

    if (student) {
      const studentUser: User = { ...student, role: 'student' };
      setUser(studentUser);
      localStorage.setItem('shikara_user', JSON.stringify(studentUser));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (data: any) => {
    const students = JSON.parse(localStorage.getItem('shikara_students') || '[]');
    if (students.find((s: any) => s.email === data.email)) {
      throw new Error('Email already exists');
    }
    
    const newStudent = { ...data, role: 'student' };
    students.push(newStudent);
    localStorage.setItem('shikara_students', JSON.stringify(students));
    
    setUser(newStudent);
    localStorage.setItem('shikara_user', JSON.stringify(newStudent));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shikara_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
