// components/Sidebar.jsx - Updated Version
import React from "react";
import {
  ChevronRight,
  Plus,
  Home,
  FileText,
  BarChart2,
  Wallet,
  Settings,
  Globe,
  Moon,
  Sun,
  LogOut,
  X,
} from "lucide-react";

const Sidebar = ({
  currentPage,
  setCurrentPage,
  isMobileOpen,
  setIsMobileOpen,
  theme,
  toggleTheme,
  language,
  toggleLanguage,
}) => {
  const menuItems = [
    {
      id: "dashboard",
      label: language === "th" ? "Dashboard" : "Dashboard",
      icon: Home,
      description: language === "th" ? "ภาพรวมการเงิน" : "Financial Overview",
    },
    {
      id: "add-transaction",
      label: language === "th" ? "เพิ่มรายการ" : "Add Transaction",
      icon: Plus,
      description:
        language === "th" ? "บันทึกรายรับ-รายจ่าย" : "Record Income-Expense",
    },
    {
      id: "transactions",
      label: language === "th" ? "รายการทั้งหมด" : "All Transactions",
      icon: FileText,
      description:
        language === "th" ? "ดูประวัติรายการ" : "View Transaction History",
    },
    {
      id: "report",
      label: language === "th" ? "รายงาน" : "Reports",
      icon: BarChart2,
      description:
        language === "th" ? "วิเคราะห์การเงิน" : "Financial Analysis",
    },
  ];

  const handleMenuClick = (id) => {
    setCurrentPage(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-80 ${
          theme === "dark" ? "bg-gray-900/95" : "bg-white/95"
        } backdrop-blur-xl shadow-2xl border-r ${
          theme === "dark" ? "border-gray-700" : "border-red-100"
        } z-40 transform transition-all duration-300 lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button for Mobile */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Logo Section */}
        <div
          className={`p-6 border-b ${
            theme === "dark" ? "border-gray-700" : "border-red-100"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-red-400 rounded-2xl flex items-center justify-center shadow-lg">
                <Wallet className="text-white" size={28} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h1
                className={`text-xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent`}
              >
                Expense Tracker
              </h1>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {language === "th"
                  ? "จัดการการเงินอย่างง่ายดาย"
                  : "Manage your finances easily"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          <div
            className={`text-xs font-semibold ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            } uppercase tracking-wider mb-4 px-2`}
          >
            {language === "th" ? "เมนูหลัก" : "Main Menu"}
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`group w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-105 ${
                  isActive
                    ? "bg-gradient-to-r from-red-500 to-red-400 text-white shadow-lg shadow-red-200"
                    : `${
                        theme === "dark"
                          ? "text-gray-300 hover:bg-gray-800"
                          : "text-gray-600 hover:bg-red-50"
                      } hover:text-red-600 hover:shadow-md`
                }`}
              >
                <div
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-white/20"
                      : `${
                          theme === "dark"
                            ? "bg-gray-800 group-hover:bg-gray-700"
                            : "bg-gray-100 group-hover:bg-red-100"
                        }`
                  }`}
                >
                  <Icon size={20} />
                </div>

                <div className="flex-1 text-left">
                  <div className="font-semibold">{item.label}</div>
                  <div
                    className={`text-xs transition-colors ${
                      isActive
                        ? "text-white/80"
                        : `${
                            theme === "dark" ? "text-gray-600" : "text-gray-400"
                          } group-hover:text-red-400`
                    }`}
                  >
                    {item.description}
                  </div>
                </div>

                {isActive && (
                  <ChevronRight size={18} className="animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Settings Section */}
        <div
          className={`p-4 border-t ${
            theme === "dark" ? "border-gray-700" : "border-red-100"
          } space-y-2`}
        >
          <div
            className={`text-xs font-semibold ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            } uppercase tracking-wider mb-3 px-2`}
          >
            {language === "th" ? "การตั้งค่า" : "Settings"}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl ${
              theme === "dark"
                ? "text-gray-300 hover:bg-gray-800"
                : "text-gray-600 hover:bg-red-50"
            } hover:text-red-600 transition-all duration-300`}
          >
            <div
              className={`p-2 rounded-xl ${
                theme === "dark" ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </div>
            <span className="font-medium">
              {language === "th"
                ? theme === "dark"
                  ? "โหมดสว่าง"
                  : "โหมดมืด"
                : theme === "dark"
                ? "Light Mode"
                : "Dark Mode"}
            </span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl ${
              theme === "dark"
                ? "text-gray-300 hover:bg-gray-800"
                : "text-gray-600 hover:bg-red-50"
            } hover:text-red-600 transition-all duration-300`}
          >
            <div
              className={`p-2 rounded-xl ${
                theme === "dark" ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <Globe size={18} />
            </div>
            <div className="flex-1 text-left">
              <span className="font-medium">
                {language === "th" ? "ภาษา" : "Language"}
              </span>
              <div className="text-xs text-gray-500">
                {language === "th" ? "ไทย" : "English"}
              </div>
            </div>
          </button>

          {/* General Settings
          <button
            onClick={() => handleMenuClick("settings")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl ${
              currentPage === "settings"
                ? "bg-gradient-to-r from-red-500 to-red-400 text-white shadow-lg"
                : `${
                    theme === "dark"
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-600 hover:bg-red-50"
                  } hover:text-red-600`
            } transition-all duration-300`}
          >
            <div
              className={`p-2 rounded-xl ${
                currentPage === "settings"
                  ? "bg-white/20"
                  : theme === "dark"
                  ? "bg-gray-800"
                  : "bg-gray-100"
              }`}
            >
              <Settings size={18} />
            </div>
            <span className="font-medium">
              {language === "th" ? "ตั้งค่าทั่วไป" : "General Settings"}
            </span>
          </button> */}
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t ${
            theme === "dark" ? "border-gray-700" : "border-red-100"
          }`}
        >
          <div
            className={`text-center text-xs ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            <p>Expense Tracker v2.0</p>
            <p className="mt-1">© 2025</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
