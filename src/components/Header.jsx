// components/Header.jsx - Updated with Mobile Search Toggle
import React, { useState } from "react";
import {
  Menu,
  Bell,
  Search,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  Settings,
  Check,
  X,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
} from "lucide-react";

const Header = ({
  isMobileOpen,
  setIsMobileOpen,
  theme,
  language,
  totals,
  currentPage,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");

  // 👉 ฟังก์ชันค้นหา
  const handleSearch = () => {
    console.log("Searching:", query);
    // TODO: เพิ่ม logic ค้นหาจริงๆ ตรงนี้
  };

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString(
    language === "th" ? "th-TH" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }
  );

  const currentTime = currentDate.toLocaleTimeString(
    language === "th" ? "th-TH" : "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <header className={`fixed top-0 left-0 right-0 lg:ml-80 z-20`}>
      <div
        className={`${
          theme === "dark" ? "bg-gray-900/90" : "bg-white/90"
        } backdrop-blur-xl shadow-sm border-b ${
          theme === "dark" ? "border-gray-700" : "border-red-100"
        }`}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className={`lg:hidden p-2 rounded-xl ${
                  theme === "dark"
                    ? "hover:bg-gray-800 text-gray-300"
                    : "hover:bg-red-50 text-gray-600"
                } hover:text-red-600 transition-all duration-300 border ${
                  theme === "dark" ? "border-gray-700" : "border-gray-200"
                } hover:border-red-200`}
              >
                <Menu size={24} />
              </button>

              {/* Page Title */}
              <div className="hidden sm:block">
                <h2
                  className={`text-xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent`}
                >
                  {/* title */}
                </h2>
                <p
                  className={`text-sm mt-1 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {/* description */}
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Date & Time */}
              <div className="hidden lg:block text-right mr-4">
                <div
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  } flex items-center gap-1`}
                >
                  <Calendar size={14} />
                  {formattedDate}
                </div>
                <div
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  } flex items-center gap-1 justify-end`}
                >
                  <Clock size={12} />
                  {currentTime} {language === "th" ? "น." : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
