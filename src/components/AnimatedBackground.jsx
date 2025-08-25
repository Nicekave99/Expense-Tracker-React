// components/AnimatedBackground.jsx
import React from "react";

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>

      {/* Animated floating elements */}
      <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-r from-red-200/30 to-pink-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>

      <div
        className="absolute -bottom-8 -right-8 w-72 h-72 bg-gradient-to-r from-red-300/20 to-orange-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-100/20 to-red-100/20 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse"
        style={{ animationDelay: "4s" }}
      ></div>

      {/* Moving wave effect */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-red-50/30 to-transparent">
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-r from-red-100/20 via-pink-100/20 to-red-100/20 animate-pulse"></div>
      </div>

      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(220, 38, 38, 0.3) 1px, transparent 0)`,
          backgroundSize: "20px 20px",
        }}
      ></div>
    </div>
  );
};

export default AnimatedBackground;
