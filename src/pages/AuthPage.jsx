// src/pages/AuthPage.jsx
import React, { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";

const AuthPage = ({ theme = "light", language = "th" }) => {
  const [currentView, setCurrentView] = useState("login"); // 'login', 'signup', 'forgot'

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-white via-gray-50 to-gray-100"
      }`}
    >
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-r from-red-200/30 to-pink-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div
          className="absolute -bottom-8 -right-8 w-72 h-72 bg-gradient-to-r from-red-300/20 to-orange-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-100/20 to-red-100/20 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Auth Forms Container */}
      <div className="w-full max-w-md">
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

      {/* App Info */}
      <div className="fixed bottom-4 left-4 text-center">
        <div
          className={`text-xs ${
            theme === "dark" ? "text-gray-500" : "text-gray-400"
          }`}
        >
          <p>Expense Tracker v2.0</p>
          <p className="mt-1">Secure • Fast • Beautiful</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
