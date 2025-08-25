// src/components/auth/LoginForm.jsx
import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Loader,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const LoginForm = ({
  onSwitchToSignup,
  onForgotPassword,
  theme = "light",
  language = "th",
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { login, authError, clearError } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific errors
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear auth errors
    if (authError) {
      clearError();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email =
        language === "th" ? "กรุณาใส่อีเมล" : "Please enter email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email =
        language === "th" ? "รูปแบบอีเมลไม่ถูกต้อง" : "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password =
        language === "th" ? "กรุณาใส่รหัสผ่าน" : "Please enter password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    const result = await login(formData.email, formData.password);
    setIsLoading(false);

    // If login fails, error will be handled by AuthContext
    // Success case is handled by AuthContext state change
  };

  const texts = {
    th: {
      title: "เข้าสู่ระบบ",
      subtitle: "เข้าสู่บัญชีผู้ใช้ของคุณ",
      email: "อีเมล",
      password: "รหัสผ่าน",
      emailPlaceholder: "your.email@example.com",
      passwordPlaceholder: "••••••••",
      loginButton: "เข้าสู่ระบบ",
      loggingIn: "กำลังเข้าสู่ระบบ...",
      forgotPassword: "ลืมรหัสผ่าน?",
      noAccount: "ยังไม่มีบัญชี?",
      signup: "สมัครสมาชิก",
    },
    en: {
      title: "Sign In",
      subtitle: "Access your account",
      email: "Email",
      password: "Password",
      emailPlaceholder: "your.email@example.com",
      passwordPlaceholder: "••••••••",
      loginButton: "Sign In",
      loggingIn: "Signing in...",
      forgotPassword: "Forgot Password?",
      noAccount: "Don't have an account?",
      signup: "Sign Up",
    },
  };

  const t = texts[language] || texts.th;

  return (
    <div
      className={`w-full max-w-md mx-auto ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      } rounded-2xl shadow-2xl p-8 border ${
        theme === "dark" ? "border-gray-700" : "border-gray-100"
      }`}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <LogIn className="text-white" size={32} />
        </div>
        <h2
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {t.title}
        </h2>
        <p
          className={`mt-2 text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {t.subtitle}
        </p>
      </div>

      {/* Error Display */}
      {authError && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
            <span className="text-red-700 dark:text-red-400 text-sm">
              {authError}
            </span>
          </div>
        </div>
      )}

      {/* Login Form */}
      <div className="space-y-6">
        {/* Email Field */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t.email}
          </label>
          <div className="relative">
            <Mail
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                theme === "dark" ? "text-gray-400" : "text-gray-400"
              }`}
              size={20}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:ring-4 outline-none transition-all ${
                errors.email
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/20"
                  : theme === "dark"
                  ? "border-gray-600 bg-gray-700 text-white focus:border-red-400 focus:ring-red-100/20"
                  : "border-gray-200 bg-white focus:border-red-400 focus:ring-red-100"
              } ${
                theme === "dark"
                  ? "placeholder-gray-400"
                  : "placeholder-gray-500"
              }`}
              placeholder={t.emailPlaceholder}
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t.password}
          </label>
          <div className="relative">
            <Lock
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                theme === "dark" ? "text-gray-400" : "text-gray-400"
              }`}
              size={20}
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 focus:ring-4 outline-none transition-all ${
                errors.password
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/20"
                  : theme === "dark"
                  ? "border-gray-600 bg-gray-700 text-white focus:border-red-400 focus:ring-red-100/20"
                  : "border-gray-200 bg-white focus:border-red-400 focus:ring-red-100"
              } ${
                theme === "dark"
                  ? "placeholder-gray-400"
                  : "placeholder-gray-500"
              }`}
              placeholder={t.passwordPlaceholder}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                theme === "dark"
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-400 hover:text-gray-600"
              } transition-colors`}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-red-500 to-red-400 hover:from-red-600 hover:to-red-500 hover:shadow-xl hover:scale-105 active:scale-95"
          } focus:outline-none focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/20`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader className="animate-spin" size={20} />
              {t.loggingIn}
            </div>
          ) : (
            t.loginButton
          )}
        </button>
      </div>

      {/* Forgot Password Link */}
      <div className="mt-6 text-center">
        <button
          onClick={onForgotPassword}
          className="text-red-500 hover:text-red-600 text-sm font-medium hover:underline transition-colors"
          disabled={isLoading}
        >
          {t.forgotPassword}
        </button>
      </div>

      {/* Sign Up Link */}
      <div
        className={`mt-6 pt-6 border-t ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        } text-center`}
      >
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {t.noAccount}{" "}
          <button
            onClick={onSwitchToSignup}
            className="text-red-500 hover:text-red-600 font-medium hover:underline transition-colors"
            disabled={isLoading}
          >
            {t.signup}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
