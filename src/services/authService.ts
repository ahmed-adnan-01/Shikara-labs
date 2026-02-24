export type UserRole = "student" | "admin";

export interface User {
  id: string;
  fullName: string;
  studentId: string;
  email: string;
  classLevel: string;
  password: string; // plain for demo; replace with hashing in real backend
  role: UserRole;
  createdAt: string;
}

const STORAGE_KEY = "shikara_users";
const CURRENT_USER_KEY = "shikara_current_user";

function loadUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as User[];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function setCurrentUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (!user) {
    localStorage.removeItem(CURRENT_USER_KEY);
  } else {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }
}

export async function registerUser(input: {
  fullName: string;
  studentId: string;
  email: string;
  password: string;
  classLevel: string;
}): Promise<User> {
  const users = loadUsers();

  const exists = users.find(
    (u) => u.email.toLowerCase() === input.email.toLowerCase()
  );
  if (exists) {
    throw new Error("An account with this email already exists");
  }

  const now = new Date().toISOString();
  const newUser: User = {
    id: crypto.randomUUID(),
    fullName: input.fullName,
    studentId: input.studentId,
    email: input.email,
    password: input.password,
    classLevel: input.classLevel,
    role: "student",
    createdAt: now,
  };

  const updated = [...users, newUser];
  saveUsers(updated);
  setCurrentUser(newUser);
  return newUser;
}

export async function loginUser(input: {
  emailOrUsername: string;
  password: string;
}): Promise<User> {
  const users = loadUsers();

  const emailOrUser = input.emailOrUsername.trim();
  let user: User | undefined;

  // Track login attempt
  const loginAttempt = {
    id: Date.now().toString(),
    email: emailOrUser,
    success: false,
    timestamp: new Date().toISOString(),
    role: 'unknown'
  };

  // allow login via email or studentId or demo user
  user = users.find(
    (u) =>
      u.email.toLowerCase() === emailOrUser.toLowerCase() ||
      u.studentId.toLowerCase() === emailOrUser.toLowerCase()
  );

  // demo admin fallback (only you should know these credentials)
  if (!user && emailOrUser === "adnan" && input.password === "adnan123") {
    user = {
      id: "demo-admin",
      fullName: "Demo Admin",
      studentId: "ADMIN",
      email: "admin@shikara.lab",
      password: "adnan123",
      classLevel: "admin",
      role: "admin",
      createdAt: new Date().toISOString(),
    };
  }

  if (!user || user.password !== input.password) {
    // Save failed login attempt
    saveLoginAttempt(loginAttempt);
    throw new Error("Invalid username/email or password");
  }

  // Save successful login attempt
  loginAttempt.success = true;
  loginAttempt.role = user.role;
  saveLoginAttempt(loginAttempt);

  setCurrentUser(user);
  return user;
}

function saveLoginAttempt(attempt: any) {
  try {
    const stored = localStorage.getItem('shikara_login_attempts');
    const attempts: any[] = stored ? JSON.parse(stored) : [];
    attempts.push(attempt);
    localStorage.setItem('shikara_login_attempts', JSON.stringify(attempts));
  } catch (e) {
    console.error('Failed to save login attempt:', e);
  }
}

export async function logoutUser(): Promise<void> {
  setCurrentUser(null);
}

export async function getAllUsers(): Promise<User[]> {
  return loadUsers();
}

// Helper to set admin user from password modal
export function setAdminUser() {
  const adminUser: User = {
    id: "demo-admin",
    fullName: "Demo Admin",
    studentId: "ADMIN",
    email: "admin@shikara.lab",
    password: "adnan123",
    classLevel: "admin",
    role: "admin",
    createdAt: new Date().toISOString(),
  };
  setCurrentUser(adminUser);
  return adminUser;
}

// Get all login attempts
export function getAllLoginAttempts() {
  try {
    const stored = localStorage.getItem('shikara_login_attempts');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Get all page visits
export function getAllPageVisits() {
  try {
    const stored = localStorage.getItem('shikara_page_visits');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}
