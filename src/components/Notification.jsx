// components/Notification.jsx
import React, { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const Notification = ({ message, type = "info", onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show notification with animation
    setIsVisible(true);

    // Auto hide after 3 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for animation to finish before calling onClose
    setTimeout(onClose, 300);
  };

  const getNotificationConfig = () => {
    switch (type) {
      case "success":
        return {
          bgColor: "bg-gradient-to-r from-green-500 to-green-400",
          icon: CheckCircle,
          borderColor: "border-green-300",
        };
      case "error":
        return {
          bgColor: "bg-gradient-to-r from-red-500 to-red-400",
          icon: AlertCircle,
          borderColor: "border-red-300",
        };
      case "info":
      default:
        return {
          bgColor: "bg-gradient-to-r from-blue-500 to-blue-400",
          icon: Info,
          borderColor: "border-blue-300",
        };
    }
  };

  const config = getNotificationConfig();
  const Icon = config.icon;

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        isVisible
          ? "translate-x-0 opacity-100 scale-100"
          : "translate-x-full opacity-0 scale-95"
      }`}
    >
      <div
        className={`${config.bgColor} text-white px-6 py-4 rounded-2xl shadow-xl border ${config.borderColor} backdrop-blur-sm min-w-80 max-w-md`}
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            <Icon size={20} />
          </div>

          {/* Message */}
          <div className="flex-1">
            <p className="font-medium">{message}</p>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/40 rounded-full animate-pulse"
            style={{
              animation: "shrink 3s linear forwards",
            }}
          ></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default Notification;
