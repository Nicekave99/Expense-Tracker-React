// components/LoadingSpinner.jsx
import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        {/* Main spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-red-300 rounded-full animate-ping"></div>
        </div>

        {/* Loading text with animation */}
        <div className="flex items-center gap-2">
          <span className="text-red-600 font-medium">กำลังโหลด</span>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
            <div
              className="w-1 h-1 bg-red-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-1 h-1 bg-red-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1 bg-red-100 rounded-full overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
