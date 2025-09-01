// src/pages/AuthPage.jsx
import React, { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";

const AuthPage = () => {
  const [theme, setTheme] = useState("light"); // light | dark
  const [language, setLanguage] = useState("th"); // th | en
  const [currentView, setCurrentView] = useState("login"); // login | signup | forgot

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "th" ? "en" : "th"));
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-all duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 -z-10">
        {/* Floating Orbs */}
        <div
          className={`absolute top-20 left-10 w-32 h-32 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float ${
            theme === "dark"
              ? "bg-gradient-to-r from-purple-400 to-pink-400"
              : "bg-gradient-to-r from-blue-200 to-cyan-200"
          }`}
        ></div>

        <div
          className={`absolute top-40 right-20 w-24 h-24 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float-delayed ${
            theme === "dark"
              ? "bg-gradient-to-r from-blue-400 to-indigo-400"
              : "bg-gradient-to-r from-purple-200 to-pink-200"
          }`}
        ></div>

        <div
          className={`absolute bottom-32 left-1/4 w-40 h-40 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float-slow ${
            theme === "dark"
              ? "bg-gradient-to-r from-teal-400 to-blue-400"
              : "bg-gradient-to-r from-indigo-200 to-blue-200"
          }`}
        ></div>

        <div
          className={`absolute bottom-20 right-1/3 w-28 h-28 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float ${
            theme === "dark"
              ? "bg-gradient-to-r from-rose-400 to-orange-400"
              : "bg-gradient-to-r from-rose-200 to-orange-200"
          }`}
        ></div>

        {/* Grid Pattern Overlay */}
        <div
          className={`absolute inset-0 opacity-10 ${
            theme === "dark" ? "opacity-5" : "opacity-10"
          }`}
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        ></div>

        {/* Subtle Gradient Overlay */}
        <div
          className={`absolute inset-0 ${
            theme === "dark"
              ? "bg-gradient-to-t from-black/20 via-transparent to-transparent"
              : "bg-gradient-to-t from-white/30 via-transparent to-transparent"
          }`}
        ></div>
      </div>

      {/* Main Content Area with Glassmorphism Effect */}
      <div className="relative z-10 w-full max-w-md">
        <div
          className={`backdrop-blur-sm rounded-3xl p-8 shadow-2xl border transition-all duration-500 ${
            theme === "dark"
              ? "bg-white/5 border-white/10 shadow-purple-900/20"
              : "bg-white/40 border-white/20 shadow-blue-900/10"
          }`}
        >
          {currentView === "login" && (
            <LoginForm
              onSwitchToSignup={() => setCurrentView("signup")}
              onForgotPassword={() => setCurrentView("forgot")}
              theme={theme}
              language={language}
            />
          )}

          {currentView === "signup" && (
            <SignupForm
              onSwitchToLogin={() => setCurrentView("login")}
              theme={theme}
              language={language}
            />
          )}

          {currentView === "forgot" && (
            <ForgotPasswordForm
              onBackToLogin={() => setCurrentView("login")}
              theme={theme}
              language={language}
            />
          )}
        </div>
      </div>

      {/* Enhanced Controls */}
      <div className="fixed top-6 right-6 flex gap-3 z-20">
        <button
          onClick={toggleTheme}
          className={`px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-md transition-all duration-300 hover:scale-105 shadow-lg ${
            theme === "dark"
              ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
              : "bg-white/30 hover:bg-white/50 text-gray-800 border border-white/30"
          }`}
        >
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
        <button
          onClick={toggleLanguage}
          className={`px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-md transition-all duration-300 hover:scale-105 shadow-lg ${
            theme === "dark"
              ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
              : "bg-white/30 hover:bg-white/50 text-gray-800 border border-white/30"
          }`}
        >
          {language === "th" ? "EN" : "TH"}
        </button>
      </div>

      {/* Enhanced App Info */}
      <div className="fixed bottom-6 left-6 z-20">
        <div
          className={`backdrop-blur-md rounded-2xl px-4 py-3 ${
            theme === "dark"
              ? "bg-white/5 border border-white/10"
              : "bg-white/30 border border-white/20"
          }`}
        >
          <div
            className={`text-sm font-medium ${
              theme === "dark" ? "text-white/90" : "text-gray-700"
            }`}
          >
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Expense Tracker v2.0
            </p>
            <p
              className={`mt-1 text-xs ${
                theme === "dark" ? "text-white/70" : "text-gray-600"
              }`}
            >
              {language === "th"
                ? "ปลอดภัย • เร็ว • สวยงาม"
                : "Secure • Fast • Beautiful"}
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-1/4 left-8 opacity-20">
        <div
          className={`w-1 h-16 rounded-full ${
            theme === "dark" ? "bg-purple-400" : "bg-blue-400"
          } animate-pulse`}
        ></div>
      </div>

      <div className="fixed bottom-1/4 right-12 opacity-20">
        <div
          className={`w-1 h-12 rounded-full ${
            theme === "dark" ? "bg-pink-400" : "bg-indigo-400"
          } animate-pulse`}
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-3deg);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }

        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
