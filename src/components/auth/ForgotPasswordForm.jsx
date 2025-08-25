// src/components/auth/ForgotPasswordForm.jsx
import React, { useState } from "react";
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader,
  Send,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const ForgotPasswordForm = ({
  onBackToLogin,
  theme = "light",
  language = "th",
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const { resetPassword, authError, clearError } = useAuth();

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
    if (authError) clearError();
  };

  const validateEmail = () => {
    if (!email.trim()) {
      const message =
        language === "th" ? "กรุณาใส่อีเมล" : "Please enter your email";
      setError(message);
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      const message =
        language === "th" ? "รูปแบบอีเมลไม่ถูกต้อง" : "Invalid email format";
      setError(message);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) return;

    setIsLoading(true);
    const result = await resetPassword(email.trim());
    setIsLoading(false);

    if (result.success) {
      setIsSuccess(true);
    }
    // Error handling is done by AuthContext
  };

  const texts = {
    th: {
      title: "ลืมรหัสผ่าน",
      subtitle: "ใส่อีเมลของคุณเพื่อรีเซ็ตรหัสผ่าน",
      email: "อีเมล",
      emailPlaceholder: "your.email@example.com",
      sendButton: "ส่งลิงก์รีเซ็ตรหัสผ่าน",
      sending: "กำลังส่งอีเมล...",
      backToLogin: "กลับไปเข้าสู่ระบบ",
      successTitle: "ส่งอีเมลแล้ว!",
      successMessage: "เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปยัง",
      checkEmail: "กรุณาตรวจสอบอีเมลของคุณ (รวมถึงในโฟลเดอร์สแปม)",
      didNotReceive: "ไม่ได้รับอีเมล?",
      resend: "ส่งใหม่",
      backToLoginAfter: "กลับไปเข้าสู่ระบบ",
    },
    en: {
      title: "Forgot Password",
      subtitle: "Enter your email to reset your password",
      email: "Email",
      emailPlaceholder: "your.email@example.com",
      sendButton: "Send Reset Link",
      sending: "Sending email...",
      backToLogin: "Back to Sign In",
      successTitle: "Email Sent!",
      successMessage: "We sent a password reset link to",
      checkEmail: "Please check your email (including spam folder)",
      didNotReceive: "Didn't receive the email?",
      resend: "Resend",
      backToLoginAfter: "Back to Sign In",
    },
  };

  const t = texts[language] || texts.th;

  // Success Screen
  if (isSuccess) {
    return (
      <div
        className={`w-full max-w-md mx-auto ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-2xl p-8 border ${
          theme === "dark" ? "border-gray-700" : "border-gray-100"
        }`}
      >
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h2
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {t.successTitle}
          </h2>
        </div>

        {/* Success Message */}
        <div className="text-center space-y-4 mb-8">
          <p
            className={`${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {t.successMessage}
          </p>
          <p
            className={`font-semibold ${
              theme === "dark" ? "text-blue-400" : "text-blue-600"
            }`}
          >
            {email}
          </p>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {t.checkEmail}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-4 text-sm">
            <span
              className={theme === "dark" ? "text-gray-400" : "text-gray-500"}
            >
              {t.didNotReceive}
            </span>
            <button
              onClick={() => {
                setIsSuccess(false);
                setEmail("");
              }}
              className="text-blue-500 hover:text-blue-600 font-medium hover:underline transition-colors"
            >
              {t.resend}
            </button>
          </div>

          <button
            onClick={onBackToLogin}
            className="w-full py-3 px-6 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-red-400 text-white hover:from-red-600 hover:to-red-500 transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
          >
            {t.backToLoginAfter}
          </button>
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
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Mail className="text-white" size={32} />
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
      {(authError || error) && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
            <span className="text-red-700 dark:text-red-400 text-sm">
              {authError || error}
            </span>
          </div>
        </div>
      )}

      {/* Reset Form */}
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
              value={email}
              onChange={handleChange}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:ring-4 outline-none transition-all ${
                error || authError
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/20"
                  : theme === "dark"
                  ? "border-gray-600 bg-gray-700 text-white focus:border-blue-400 focus:ring-blue-100/20"
                  : "border-gray-200 bg-white focus:border-blue-400 focus:ring-blue-100"
              } ${
                theme === "dark"
                  ? "placeholder-gray-400"
                  : "placeholder-gray-500"
              }`}
              placeholder={t.emailPlaceholder}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 hover:shadow-xl hover:scale-105 active:scale-95"
          } focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader className="animate-spin" size={20} />
              {t.sending}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Send size={20} />
              {t.sendButton}
            </div>
          )}
        </button>
      </div>

      {/* Back to Login */}
      <div className="mt-6 text-center">
        <button
          onClick={onBackToLogin}
          className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${
            theme === "dark"
              ? "text-gray-400 hover:text-gray-300"
              : "text-gray-500 hover:text-gray-700"
          } hover:underline`}
          disabled={isLoading}
        >
          <ArrowLeft size={16} />
          {t.backToLogin}
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
