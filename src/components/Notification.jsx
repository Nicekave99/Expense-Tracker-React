// components/Notification.jsx - Enhanced Version
import React, { useEffect, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const Notification = ({
  message,
  type = "info",
  onClose,
  theme = "light",
  language = "th",
  duration = 4000,
  position = "top-right",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  // Language-specific close button text
  const closeText = language === "th" ? "ปิด" : "Close";

  // Get notification configuration based on type
  const getNotificationConfig = useCallback(() => {
    switch (type) {
      case "success":
        return {
          bgGradient: "from-emerald-500 via-green-500 to-emerald-600",
          shadowColor: "shadow-green-500/25",
          icon: CheckCircle,
          borderColor: "border-green-400/30",
          glowColor: "shadow-green-400/20",
          iconBg: "bg-green-400/20",
          progressBg: "bg-green-300/30",
        };
      case "error":
        return {
          bgGradient: "from-rose-500 via-red-500 to-rose-600",
          shadowColor: "shadow-red-500/25",
          icon: AlertCircle,
          borderColor: "border-red-400/30",
          glowColor: "shadow-red-400/20",
          iconBg: "bg-red-400/20",
          progressBg: "bg-red-300/30",
        };
      case "warning":
        return {
          bgGradient: "from-amber-500 via-yellow-500 to-orange-500",
          shadowColor: "shadow-yellow-500/25",
          icon: AlertTriangle,
          borderColor: "border-yellow-400/30",
          glowColor: "shadow-yellow-400/20",
          iconBg: "bg-yellow-400/20",
          progressBg: "bg-yellow-300/30",
        };
      case "info":
      default:
        return {
          bgGradient: "from-sky-500 via-blue-500 to-indigo-500",
          shadowColor: "shadow-blue-500/25",
          icon: Info,
          borderColor: "border-blue-400/30",
          glowColor: "shadow-blue-400/20",
          iconBg: "bg-blue-400/20",
          progressBg: "bg-blue-300/30",
        };
    }
  }, [type]);

  // Get position classes
  const getPositionClasses = useCallback(() => {
    switch (position) {
      case "top-left":
        return "top-4 left-4";
      case "top-center":
        return "top-4 left-1/2 -translate-x-1/2";
      case "top-right":
      default:
        return "top-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "bottom-center":
        return "bottom-4 left-1/2 -translate-x-1/2";
      case "bottom-right":
        return "bottom-4 right-4";
    }
  }, [position]);

  // Handle close with animation
  const handleClose = useCallback(() => {
    setIsVisible(false);
    // Wait for exit animation to complete
    setTimeout(() => {
      onClose?.();
    }, 300);
  }, [onClose]);

  // Progress animation
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - 100 / (duration / 50);
          if (newProgress <= 0) {
            handleClose();
            return 0;
          }
          return newProgress;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isPaused, duration, handleClose]);

  // Show notification on mount
  useEffect(() => {
    // Small delay for smooth entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const config = getNotificationConfig();
  const Icon = config.icon;
  const positionClasses = getPositionClasses();

  return (
    <div
      className={`fixed z-[9999] transition-all duration-300 ease-out transform ${positionClasses} ${
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : position.includes("top")
          ? "-translate-y-4 opacity-0 scale-95"
          : "translate-y-4 opacity-0 scale-95"
      }`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="alert"
      aria-live="polite"
    >
      {/* Main notification container */}
      <div
        className={`
          relative overflow-hidden
          bg-gradient-to-r ${config.bgGradient}
          backdrop-blur-xl
          border ${config.borderColor}
          rounded-2xl
          shadow-2xl ${config.shadowColor}
          hover:${config.glowColor}
          min-w-[320px] max-w-[420px]
          transform transition-all duration-300
          hover:scale-[1.02] hover:shadow-3xl
        `}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent animate-pulse"></div>
          <div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent 
                       transform -skew-x-12 animate-shimmer"
            style={{
              animation: "shimmer 3s ease-in-out infinite",
            }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative p-5">
          <div className="flex items-start gap-4">
            {/* Icon with subtle animation */}
            <div
              className={`
              flex-shrink-0 p-2.5 rounded-xl ${config.iconBg}
              transform transition-all duration-300
              hover:scale-110 hover:rotate-3
            `}
            >
              <Icon size={22} className="text-white drop-shadow-sm" />
            </div>

            {/* Message content */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium leading-relaxed break-words">
                {message}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className={`
                flex-shrink-0 p-1.5 rounded-lg
                text-white/80 hover:text-white
                hover:bg-white/20 active:bg-white/30
                transform transition-all duration-200
                hover:scale-110 active:scale-95
                focus:outline-none focus:ring-2 focus:ring-white/30
              `}
              aria-label={closeText}
              title={closeText}
            >
              <X size={16} />
            </button>
          </div>

          {/* Progress bar */}
          <div
            className={`
            mt-4 h-1 bg-white/20 rounded-full overflow-hidden
            transition-opacity duration-300
            ${isPaused ? "opacity-50" : "opacity-100"}
          `}
          >
            <div
              className={`h-full ${config.progressBg} rounded-full transition-all duration-75 ease-linear`}
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 100%)`,
              }}
            />
          </div>
        </div>

        {/* Subtle border glow */}
        <div
          className={`
          absolute inset-0 rounded-2xl
          bg-gradient-to-r from-white/20 via-transparent to-white/20
          opacity-0 hover:opacity-100 transition-opacity duration-300
          pointer-events-none
        `}
        />
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          50% {
            transform: translateX(100%) skewX(-12deg);
          }
          100% {
            transform: translateX(100%) skewX(-12deg);
          }
        }

        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// Enhanced Notification Manager for multiple notifications
export const NotificationManager = ({
  notifications = [],
  onRemove,
  theme = "light",
  language = "th",
  maxVisible = 5,
  position = "top-right",
}) => {
  // Limit visible notifications to prevent performance issues
  const visibleNotifications = notifications.slice(0, maxVisible);

  return (
    <div className="pointer-events-none">
      {visibleNotifications.map((notification, index) => (
        <div
          key={notification.id}
          className="pointer-events-auto"
          style={{
            zIndex: 9999 - index,
            transform: position.includes("top")
              ? `translateY(${index * 10}px)`
              : `translateY(${-index * 10}px)`,
          }}
        >
          <Notification
            message={notification.message}
            type={notification.type}
            theme={theme}
            language={language}
            duration={notification.duration || 4000}
            position={position}
            onClose={() => onRemove(notification.id)}
          />
        </div>
      ))}
    </div>
  );
};

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback(
    (message, type = "info", options = {}) => {
      const id = Date.now() + Math.random();
      const notification = {
        id,
        message,
        type,
        timestamp: Date.now(),
        ...options,
      };

      setNotifications((prev) => [notification, ...prev]);

      // Auto-remove after duration
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, options.duration || 4000);

      return id;
    },
    []
  );

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
  };
};

export default Notification;
