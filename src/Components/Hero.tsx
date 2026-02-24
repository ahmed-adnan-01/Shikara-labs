import React, { useEffect, useState } from "react";
import Spline from "@splinetool/react-spline";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function isWebGLAvailable() {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl") ||
      canvas.getContext("webgl2");
    return !!gl;
  } catch {
    return false;
  }
}

const containerVariant = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.45,
    },
  },
};

const slideFromBottom = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function Hero() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [signupData, setSignupData] = useState({
    fullName: "",
    studentId: "",
    email: "",
    password: "",
    confirmPassword: "",
    classLevel: "",
  });
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");
  const [canUseWebGL, setCanUseWebGL] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const glAvailable = isWebGLAvailable();
    setCanUseWebGL(glAvailable);
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  useEffect(() => {
    const root = document.getElementById("glow-orbs");
    if (!root) return;
    root.innerHTML = "";
    for (let i = 0; i < 35; i++) {
      const orb = document.createElement("div");
      const size = 140 + Math.random() * 250;
      orb.style.position = "absolute";
      orb.style.width = size + "px";
      orb.style.height = size + "px";
      orb.style.borderRadius = "50%";
      orb.style.filter = "blur(25px)";
      orb.style.opacity = String(0.08 + Math.random() * 0.1);
      orb.style.left = Math.random() * 100 + "%";
      orb.style.top = Math.random() * 100 + "%";
      const colors = [
        "radial-gradient(circle at 30% 30%, rgba(0,212,255,0.9), transparent 60%)",
        "radial-gradient(circle at 70% 70%, rgba(0,255,136,0.9), transparent 60%)",
        "radial-gradient(circle at 50% 50%, rgba(88,101,242,0.9), transparent 60%)",
      ];
      orb.style.background = colors[Math.floor(Math.random() * colors.length)];
      root.appendChild(orb);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!emailOrUsername || !password) {
      setLoginError("Please fill in all fields");
      return;
    }
    try {
      await login({ emailOrUsername, password });
      setShowLoginModal(false);
      navigate('/dashboard');
    } catch (err: any) {
      setLoginError(err.message || "Invalid username or password");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    setSignupSuccess("");
    if (
      !signupData.fullName ||
      !signupData.studentId ||
      !signupData.email ||
      !signupData.password ||
      !signupData.confirmPassword ||
      !signupData.classLevel
    ) {
      setSignupError("All fields are required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      setSignupError("Please enter a valid email address");
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      setSignupError("Passwords do not match");
      return;
    }
    if (signupData.password.length < 6) {
      setSignupError("Password must be at least 6 characters");
      return;
    }
    try {
      await register({
        fullName: signupData.fullName,
        studentId: signupData.studentId,
        email: signupData.email,
        password: signupData.password,
        classLevel: signupData.classLevel,
      });
      setSignupSuccess("Account created successfully!");
      setTimeout(() => {
        setShowSignupModal(false);
        navigate('/dashboard');
      }, 1500);
    } catch (err: any) {
      setSignupError(err.message || "Signup failed");
    }
  };

  const toggleModal = (show: boolean, type: "login" | "signup") => {
    if (type === "login") setShowLoginModal(show);
    else setShowSignupModal(show);
  };

  const words = ["Revise better", "Understand faster", "Learn smarter"];

  return (
    <section
      id="home"
      className="relative w-full min-h-screen overflow-hidden bg-black"
    >
      {/* Background layers */}
      <div className="absolute inset-0 z-0">
        {canUseWebGL ? (
          <div className="absolute inset-0 w-full h-full">
            <Spline 
              scene="https://prod.spline.design/UiMDkOJtlS5O5Vaz/scene.splinecode" 
              className="w-full h-full"
            />
          </div>
        ) : (
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              background:
                "radial-gradient(1200px 800px at 10% 10%, rgba(0,212,255,0.15), transparent 60%), radial-gradient(1000px 700px at 90% 20%, rgba(0,255,136,0.12), transparent 60%), radial-gradient(900px 900px at 50% 100%, rgba(88,101,242,0.18), transparent 60%), linear-gradient(180deg, #05060a 0%, #070a12 100%)",
            }}
          />
        )}

        <motion.div
          initial={{ scale: 0.98, opacity: 0.22 }}
          animate={{ scale: 1.02, opacity: 0.28 }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] lg:w-[1200px] lg:h-[1200px] rounded-full blur-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(0,212,255,0.35), rgba(0,255,136,0.18) 40%, rgba(88,101,242,0.18) 70%, transparent 75%)",
          }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, ease: "linear", repeat: Infinity }}
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] lg:w-[1000px] lg:h-[1000px] rounded-full opacity-20 pointer-events-none"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(0,212,255,0.6), rgba(0,255,136,0.4), rgba(88,101,242,0.5), rgba(0,212,255,0.6))",
            maskImage:
              "radial-gradient(circle at 50% 50%, transparent 44%, black 46%, black 54%, transparent 56%)",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 50%, transparent 44%, black 46%, black 54%, transparent 56%)",
            filter: "blur(8px)",
          }}
        />
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-20 -left-16 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] lg:w-[900px] lg:h-[900px] rounded-full blur-3xl opacity-20"
            style={{
              background:
                "radial-gradient(circle, rgba(0,212,255,0.35), transparent 60%)",
            }}
          />
          <div
            className="absolute top-40 -right-10 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] lg:w-[800px] lg:h-[800px] rounded-full blur-3xl opacity-20"
            style={{
              background:
                "radial-gradient(circle, rgba(0,255,136,0.28), transparent 60%)",
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div id="glow-orbs" className="absolute inset-0" />
      </div>

      {/* Content with staggered animation */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-10 xl:px-16 py-10 sm:py-14">
        <motion.div
          className="text-center max-w-5xl mx-auto select-none"
          variants={containerVariant}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={slideFromBottom} className="mb-2 flex justify-center">
            <div
              className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold"
              style={{
                background: "rgba(0, 212, 255, 0.15)",
                border: "1px solid rgba(0, 212, 255, 0.4)",
                color: "#00d4ff",
                boxShadow: "0 0 20px rgba(0,212,255,0.25) inset",
              }}
            >
              First Semester Project • For School Students
            </div>
          </motion.div>

          {/* Title - Desktop animation only */}
          {isDesktop ? (
            <motion.h1
              initial={{ opacity: 0, scale: 0.5, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 1.2,
                ease: [0.6, -0.05, 0.01, 0.99],
                delay: 0.2,
              }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-3 leading-tight tracking-tight"
              style={{
                letterSpacing: "-1px",
                background:
                  "linear-gradient(90deg, #00d4ff 0%, #6ee7ff 20%, #7cffc6 50%, #00d4ff 80%, #6ee7ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 0 20px rgba(0,212,255,0.25)",
              }}
            >
              SHIKARA LAB
            </motion.h1>
          ) : (
            <motion.h1
              variants={slideFromBottom}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-3 leading-tight tracking-tight"
              style={{
                letterSpacing: "-1px",
                background:
                  "linear-gradient(90deg, #00d4ff 0%, #6ee7ff 20%, #7cffc6 50%, #00d4ff 80%, #6ee7ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 0 20px rgba(0,212,255,0.25)",
              }}
            >
              SHIKARA LAB
            </motion.h1>
          )}

          {/* Subtitle */}
          <motion.h2
            variants={slideFromBottom}
            className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-4 sm:mb-6"
            style={{
              background: "linear-gradient(90deg, #00ff88 0%, #00d4ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: "1.3",
              letterSpacing: "0.3px",
            }}
          >
            Post-Lab Learning Support System
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={slideFromBottom}
            className="text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-relaxed mb-6 sm:mb-8 mx-auto max-w-2xl px-2 sm:px-0"
            style={{ color: "#dbeafe", textShadow: "0 0 8px rgba(0,212,255,0.15)" }}
          >
            SHIKARA LAB helps school students understand science experiments through
            virtual labs, interactive demonstrations, and simple explanations.
          </motion.p>

          {/* Animated tagline */}
          <div className="h-8 sm:h-10 md:h-12 mb-6 sm:mb-8 flex items-center justify-center">
            <motion.div
              variants={slideFromBottom}
              className="text-base sm:text-lg md:text-xl lg:text-2xl font-black"
              style={{
                background:
                  "linear-gradient(90deg, #ffffff 0%, #00d4ff 50%, #00ff88 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "0.5px",
              }}
            >
              <AnimatedWords words={words} />
            </motion.div>
          </div>

          {/* CTA */}
          <motion.button
            onClick={() => toggleModal(true, "login")}
            variants={slideFromBottom}
            className="px-8 sm:px-10 md:px-14 py-3 sm:py-4 md:py-5 rounded-full font-black text-sm sm:text-base text-black transition-all duration-300 inline-flex items-center gap-2 cursor-pointer uppercase select-none"
            style={{
              background: "linear-gradient(135deg, #00d4ff 0%, #00ff88 100%)",
              boxShadow: "0 12px 35px rgba(0, 212, 255, 0.4)",
              letterSpacing: "0.5px",
              border: "2px solid rgba(255, 255, 255, 0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #00ff88, #00d4ff)";
              e.currentTarget.style.transform = "translateY(-4px) scale(1.04)";
              e.currentTarget.style.boxShadow =
                "0 16px 45px rgba(0, 255, 136, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #00d4ff 0%, #00ff88 100%)";
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow =
                "0 12px 35px rgba(0, 212, 255, 0.4)";
            }}
          >
            Start Learning
          </motion.button>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showLoginModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(8px)" }}
            onClick={() => toggleModal(false, "login")}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl max-h-[90vh] overflow-y-auto"
              style={{
                background: "rgba(10, 12, 18, 0.9)",
                border: "1.5px solid rgba(0, 212, 255, 0.3)",
                backdropFilter: "blur(30px)",
                boxShadow: "0 30px 100px rgba(0, 212, 255, 0.25)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => toggleModal(false, "login")}
                className="absolute top-4 sm:top-5 right-4 sm:right-5 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
              >
                <X size={22} />
              </button>

              <h3 className="text-xl sm:text-2xl font-black mb-2 bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                Start Your Learning
              </h3>
              <p className="text-gray-400 text-sm mb-6">Sign in to your student account</p>

              <form className="space-y-5" onSubmit={handleLogin}>
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">Username or Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
                    <input
                      type="text"
                      value={emailOrUsername}
                      onChange={(e) => setEmailOrUsername(e.target.value)}
                      placeholder="Enter your username or email"
                      className="w-full pl-12 pr-4 py-3 rounded-lg text-sm text-white bg-white/5 border border-cyan-500/20 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-12 pr-12 py-3 rounded-lg text-sm text-white bg-white/5 border border-cyan-500/20 focus:outline-none focus:border-cyan-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {loginError && <p className="text-red-400 text-xs">{loginError}</p>}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-lg font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 uppercase text-sm tracking-widest"
                >
                  Login
                </button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-gray-400">Don't have an account? </span>
                <button
                  onClick={() => { setShowLoginModal(false); setShowSignupModal(true); }}
                  className="text-cyan-400 font-bold hover:underline"
                >
                  Sign up here
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showSignupModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(8px)" }}
            onClick={() => toggleModal(false, "signup")}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl max-h-[90vh] overflow-y-auto"
              style={{
                background: "rgba(10, 12, 18, 0.9)",
                border: "1.5px solid rgba(0, 212, 255, 0.3)",
                backdropFilter: "blur(30px)",
                boxShadow: "0 30px 100px rgba(0, 212, 255, 0.25)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => toggleModal(false, "signup")}
                className="absolute top-4 sm:top-5 right-4 sm:right-5 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
              >
                <X size={22} />
              </button>

              <h3 className="text-xl sm:text-2xl font-black mb-2 bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                Create Account
              </h3>
              <p className="text-gray-400 text-sm mb-6">Join SHIKARA LAB for better learning</p>

              {signupSuccess && <p className="text-green-400 text-sm mb-4">{signupSuccess}</p>}

              <form className="space-y-4" onSubmit={handleSignup}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                      placeholder="Ahmed Adnan"
                      className="w-full px-4 py-2.5 rounded-lg text-xs text-white bg-white/5 border border-cyan-500/20 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Student ID</label>
                    <input
                      type="text"
                      value={signupData.studentId}
                      onChange={(e) => setSignupData({ ...signupData, studentId: e.target.value })}
                      placeholder="S12345"
                      className="w-full px-4 py-2.5 rounded-lg text-xs text-white bg-white/5 border border-cyan-500/20 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    placeholder="ahmed@gmail.com"
                    className="w-full px-4 py-2.5 rounded-lg text-xs text-white bg-white/5 border border-cyan-500/20 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Class</label>
                  <select
                    value={signupData.classLevel}
                    onChange={(e) => setSignupData({ ...signupData, classLevel: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg text-xs text-white bg-black border border-cyan-500/20 focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="" disabled>Choose an option</option>
                    <option value="primary">Primary (1-5)</option>
                    <option value="middle">Middle (6-8)</option>
                    <option value="secondary">Secondary (9-10)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Password</label>
                    <input
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg text-xs text-white bg-white/5 border border-cyan-500/20 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Confirm</label>
                    <input
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg text-xs text-white bg-white/5 border border-cyan-500/20 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                {signupError && <p className="text-red-400 text-[10px]">{signupError}</p>}

                <button
                  type="submit"
                  className="w-full py-3.5 mt-2 rounded-lg font-black text-black bg-gradient-to-r from-cyan-400 to-green-400 hover:from-cyan-300 hover:to-green-300 uppercase text-xs tracking-widest"
                >
                  Create Account
                </button>
              </form>

              <div className="mt-4 text-center text-xs">
                <span className="text-gray-400">Already have an account? </span>
                <button
                  onClick={() => { setShowSignupModal(false); setShowLoginModal(true); }}
                  className="text-cyan-400 font-bold hover:underline"
                >
                  Login here
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

function AnimatedWords({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      2000
    );
    return () => clearInterval(id);
  }, [words.length]);

  return (
    <motion.span
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="select-none inline-block"
    >
      {words[index]}
    </motion.span>
  );
}
