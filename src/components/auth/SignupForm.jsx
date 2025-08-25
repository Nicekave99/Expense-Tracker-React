// src/components/auth/SignupForm.jsx
import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  AlertCircle,
  Loader,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const SignupForm = ({ onSwitchToLogin, theme = "light", language = "th" }) => {
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { signup, authError, clearError } = useAuth();

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

    if (!formData.displayName.trim()) {
      newErrors.displayName =
        language === "th" ? "กรุณาใส่ชื่อผู้ใช้" : "Please enter display name";
    } else if (formData.displayName.trim().length < 2) {
      newErrors.displayName =
        language === "th"
          ? "ชื่อผู้ใช้ต้องมีอย่างน้อย 2 ตัวอักษร"
          : "Display name must be at least 2 characters";
    } else if (formData.displayName.trim().length > 50) {
      newErrors.displayName =
        language === "th"
          ? "ชื่อผู้ใช้ต้องไม่เกิน 50 ตัวอักษร"
          : "Display name must not exceed 50 characters";
    }

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
    } else if (formData.password.length < 6) {
      newErrors.password =
        language === "th"
          ? "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"
          : "Password must be at least 6 characters";
    } else if (formData.password.length > 128) {
      newErrors.password =
        language === "th"
          ? "รหัสผ่านต้องไม่เกิน 128 ตัวอักษร"
          : "Password must not exceed 128 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        language === "th" ? "กรุณายืนยันรหัสผ่าน" : "Please confirm password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword =
        language === "th" ? "รหัสผ่านไม่ตรงกัน" : "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    const result = await signup(
      formData.email,
      formData.password,
      formData.displayName.trim()
    );
    setIsLoading(false);

    if (result.success) {
      setShowSuccess(true);
      // Auto redirect to login after success message
      setTimeout(() => {
        onSwitchToLogin();
      }, 3000);
    }
    // Error handling is done by AuthContext
  };

  const texts = {
    th: {
      title: "สมัครสมาชิก",
      subtitle: "สร้างบัญชีผู้ใช้ใหม่",
      displayName: "ชื่อผู้ใช้",
      email: "อีเมล",
      password: "รหัสผ่าน",
      confirmPassword: "ยืนยันรหัสผ่าน",
      displayNamePlaceholder: "ชื่อของคุณ",
      emailPlaceholder: "your.email@example.com",
      passwordPlaceholder: "••••••••",
      signupButton: "สมัครสมาชิก",
      signingUp: "กำลังสร้างบัญชี...",
      hasAccount: "มีบัญชีอยู่แล้ว?",
      login: "เข้าสู่ระบบ",
      successTitle: "สมัครสมาชิกสำเร็จ!",
      successMessage: "กำลังเข้าสู่ระบบ...",
      emailVerification: "เราได้ส่งอีเมลยืนยันไปแล้ว กรุณาตรวจสอบอีเมลของคุณ",
    },
    en: {
      title: "Sign Up",
      subtitle: "Create your account",
      displayName: "Display Name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      displayNamePlaceholder: "Your name",
      emailPlaceholder: "your.email@example.com",
      passwordPlaceholder: "••••••••",
      signupButton: "Sign Up",
      signingUp: "Creating account...",
      hasAccount: "Already have an account?",
      login: "Sign In",
      successTitle: "Account Created!",
      successMessage: "Signing you in...",
      emailVerification:
        "We sent you a verification email. Please check your inbox.",
    },
  };

  const t = texts[language] || texts.th;

  // Success Screen
  if (showSuccess) {
    return (
      <div
        className={`w-full max-w-md mx-auto ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-2xl p-8 border ${
          theme === "dark" ? "border-gray-700" : "border-gray-100"
        } text-center`}
      >
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-green-600" size={32} />
        </div>
        <h2
          className={`text-2xl font-bold mb-4 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {t.successTitle}
        </h2>
        <p
          className={`mb-6 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {t.emailVerification}
        </p>
        <div className="flex items-center justify-center gap-2 text-blue-600">
          <Loader className="animate-spin" size={20} />
          <span>{t.successMessage}</span>
        </div>
      </div>
    );
  }

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
          <UserPlus className="text-white" size={32} />
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

      {/* Signup Form */}
      <div className="space-y-6">
        {/* Display Name Field */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t.displayName}
          </label>
          <div className="relative">
            <User
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                theme === "dark" ? "text-gray-400" : "text-gray-400"
              }`}
              size={20}
            />
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:ring-4 outline-none transition-all ${
                errors.displayName
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/20"
                  : theme === "dark"
                  ? "border-gray-600 bg-gray-700 text-white focus:border-red-400 focus:ring-red-100/20"
                  : "border-gray-200 bg-white focus:border-red-400 focus:ring-red-100"
              } ${
                theme === "dark"
                  ? "placeholder-gray-400"
                  : "placeholder-gray-500"
              }`}
              placeholder={t.displayNamePlaceholder}
              disabled={isLoading}
              maxLength={50}
            />
          </div>
          {errors.displayName && (
            <p className="text-red-500 text-sm mt-1">{errors.displayName}</p>
          )}
        </div>

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
              maxLength={128}
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

        {/* Confirm Password Field */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t.confirmPassword}
          </label>
          <div className="relative">
            <Lock
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                theme === "dark" ? "text-gray-400" : "text-gray-400"
              }`}
              size={20}
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 focus:ring-4 outline-none transition-all ${
                errors.confirmPassword
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
              maxLength={128}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                theme === "dark"
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-400 hover:text-gray-600"
              } transition-colors`}
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
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
              {t.signingUp}
            </div>
          ) : (
            t.signupButton
          )}
        </button>
      </div>

      {/* Sign In Link */}
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
          {t.hasAccount}{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-red-500 hover:text-red-600 font-medium hover:underline transition-colors"
            disabled={isLoading}
          >
            {t.login}
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
