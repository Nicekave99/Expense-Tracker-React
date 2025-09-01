// components/Header.jsx - Updated with PhotoURL avatar + safe fallback
import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  Search,
  ChevronDown,
  Settings as SettingsIcon,
  Check,
  X,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  User,
  LogOut,
  Shield,
  Mail,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

/** Helpers */
const getInitial = (userProfile, currentUser) => {
  const name =
    userProfile?.displayName?.trim() ||
    currentUser?.displayName?.trim() ||
    currentUser?.email?.trim() ||
    "";
  return name ? name.charAt(0).toUpperCase() : "U";
};

/** Avatar component: แสดงรูปถ้ามี photoURL, ถ้า error หรือไม่มี → แสดงวงกลมตัวอักษรย่อ */
const Avatar = ({
  src,
  fallbackText = "U",
  sizeClass = "w-8 h-8",
  theme = "light",
  className = "",
  alt = "avatar",
}) => {
  const [imgErr, setImgErr] = useState(false);
  const showImg = src && !imgErr;

  if (showImg) {
    return (
      <img
        src={src}
        onError={() => setImgErr(true)}
        alt={alt}
        className={`${sizeClass} rounded-full object-cover border ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        } ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} bg-gradient-to-r from-red-500 to-red-400 rounded-full flex items-center justify-center text-white font-semibold ${className}`}
      aria-label="avatar-fallback"
    >
      {fallbackText}
    </div>
  );
};

const Header = ({
  isMobileOpen,
  setIsMobileOpen,
  theme,
  language,
  totals,
  currentPage,
  currentUser,
  userProfile,
  setCurrentPage,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");

  const { logout } = useAuth();
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sample notifications data (เดิม)
  const notifications = [
    {
      id: 1,
      type: "success",
      title: language === "th" ? "เพิ่มรายการสำเร็จ" : "Transaction Added",
      message: language === "th" ? "ค่าอาหาร ฿250" : "Food expense ฿250",
      time: "2 นาทีที่แล้ว",
      read: false,
    },
    {
      id: 2,
      type: "info",
      title: language === "th" ? "รายรับใหม่" : "New Income",
      message: language === "th" ? "เงินเดือน ฿25,000" : "Salary ฿25,000",
      time: "1 ชั่วโมงที่แล้ว",
      read: false,
    },
    {
      id: 3,
      type: "warning",
      title: language === "th" ? "เป้าหมายการออม" : "Savings Goal",
      message:
        language === "th"
          ? "คุณใกล้ถึงเป้าหมายแล้ว 85%"
          : "You are 85% to your goal",
      time: "3 ชั่วโมงที่แล้ว",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = async () => {
    if (
      window.confirm(
        language === "th"
          ? "คุณต้องการออกจากระบบหรือไม่?"
          : "Are you sure you want to logout?"
      )
    ) {
      const result = await logout();
      if (!result.success) {
        console.error("Logout failed:", result.error);
      }
    }
  };

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString(
    language === "th" ? "th-TH" : "en-US",
    { year: "numeric", month: "long", day: "numeric", weekday: "long" }
  );
  const currentTime = currentDate.toLocaleTimeString(
    language === "th" ? "th-TH" : "en-US",
    { hour: "2-digit", minute: "2-digit" }
  );

  const getPageTitle = () => {
    const titles = {
      dashboard: language === "th" ? "แดชบอร์ด" : "Dashboard",
      "add-transaction":
        language === "th" ? "เพิ่มรายการใหม่" : "Add Transaction",
      transactions: language === "th" ? "รายการทั้งหมด" : "All Transactions",
      report: language === "th" ? "รายงาน" : "Reports",
      profile: language === "th" ? "โปรไฟล์" : "Profile",
      settings: language === "th" ? "การตั้งค่า" : "Settings",
    };
    return titles[currentPage] || titles.dashboard;
  };

  const getPageDescription = () => {
    const descriptions = {
      dashboard:
        language === "th" ? "ภาพรวมการเงินของคุณ" : "Your financial overview",
      "add-transaction":
        language === "th" ? "บันทึกรายรับ-รายจ่าย" : "Record income or expense",
      transactions:
        language === "th"
          ? "ดูประวัติรายการทั้งหมด"
          : "View all transaction history",
      report: language === "th" ? "วิเคราะห์การเงิน" : "Financial analysis",
      profile:
        language === "th"
          ? "จัดการข้อมูลส่วนตัว"
          : "Manage personal information",
      settings: language === "th" ? "ปรับแต่งการตั้งค่า" : "Customize settings",
    };
    return descriptions[currentPage] || descriptions.dashboard;
  };

  const NotificationIcon = ({ type }) => {
    switch (type) {
      case "success":
        return <Check className="text-green-600" size={16} />;
      case "warning":
        return <AlertCircle className="text-yellow-600" size={16} />;
      case "error":
        return <X className="text-red-600" size={16} />;
      case "info":
      default:
        return <TrendingUp className="text-blue-600" size={16} />;
    }
  };

  const avatarURL = userProfile?.photoURL || currentUser?.photoURL || "";
  const avatarInitial = getInitial(userProfile, currentUser);

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
                <h2 className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                  {getPageTitle()}
                </h2>
                <p
                  className={`text-sm mt-1 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {getPageDescription()}
                </p>
              </div>
            </div>

            {/* Center Section - Quick Stats (Desktop) */}
            {totals && (
              <div className="hidden xl:flex items-center gap-6 flex-1 max-w-md mx-8">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
                    theme === "dark" ? "bg-gray-800/50" : "bg-green-50"
                  }`}
                >
                  <TrendingUp className="text-green-600" size={16} />
                  <span className={`text-sm font-medium text-green-500`}>
                    ฿ {totals.income?.toLocaleString() || "0"}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
                    theme === "dark" ? "bg-gray-800/50" : "bg-red-50"
                  }`}
                >
                  <TrendingDown className="text-red-600" size={16} />
                  <span className={`text-sm font-medium text-red-500`}>
                    ฿ {totals.expense?.toLocaleString() || "0"}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
                    theme === "dark" ? "bg-gray-800/50" : "bg-blue-50"
                  }`}
                >
                  <span
                    className={`text-sm font-medium ${
                      (totals.balance || 0) >= 0
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    ฿ {Math.abs(totals.balance || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

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

              {/* Search Button (Mobile)
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={`md:hidden p-2 rounded-xl ${
                  theme === "dark"
                    ? "hover:bg-gray-800 text-gray-300"
                    : "hover:bg-gray-100 text-gray-600"
                } transition-all duration-300 border ${
                  theme === "dark" ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <Search size={20} />
              </button> */}

              {/* User Profile Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-2 p-2 rounded-xl ${
                    theme === "dark"
                      ? "hover:bg-gray-800 text-gray-300 border-gray-700"
                      : "hover:bg-gray-100 text-gray-600 border-gray-200 hover:border-gray-300"
                  } transition-all duration-300 border`}
                >
                  {/* ✅ แทนที่วงกลมตัวอักษรด้วย Avatar (ใช้ photoURL ถ้ามี) */}
                  <Avatar
                    src={avatarURL}
                    fallbackText={avatarInitial}
                    sizeClass="w-8 h-8"
                    theme={theme}
                  />

                  <div className="hidden md:block text-left">
                    <div
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      {userProfile?.displayName || "User"}
                    </div>
                    <div
                      className={`text-xs ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {currentUser?.email}
                    </div>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      showUserMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <div
                    className={`absolute right-0 top-full mt-2 w-64 ${
                      theme === "dark" ? "bg-gray-800" : "bg-white"
                    } rounded-2xl shadow-2xl border ${
                      theme === "dark" ? "border-gray-700" : "border-gray-100"
                    } overflow-hidden z-50`}
                  >
                    {/* User Info */}
                    <div
                      className={`p-4 border-b ${
                        theme === "dark" ? "border-gray-700" : "border-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* ✅ ใช้ Avatar ขนาดใหญ่ใน dropdown */}
                        <Avatar
                          src={avatarURL}
                          fallbackText={avatarInitial}
                          sizeClass="w-12 h-12"
                          theme={theme}
                        />
                        <div>
                          <div
                            className={`font-medium ${
                              theme === "dark"
                                ? "text-gray-200"
                                : "text-gray-800"
                            }`}
                          >
                            {userProfile?.displayName || "User"}
                          </div>
                          <div
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {currentUser?.email}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            {currentUser?.emailVerified ? (
                              <>
                                <Shield className="text-green-600" size={12} />
                                <span className="text-xs text-green-600">
                                  {language === "th"
                                    ? "ยืนยันแล้ว"
                                    : "Verified"}
                                </span>
                              </>
                            ) : (
                              <>
                                <Mail className="text-yellow-600" size={12} />
                                <span className="text-xs text-yellow-600">
                                  {language === "th"
                                    ? "รอยืนยัน"
                                    : "Pending verification"}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setCurrentPage && setCurrentPage("profile");
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 ${
                          theme === "dark"
                            ? "hover:bg-gray-700 text-gray-300"
                            : "hover:bg-gray-50 text-gray-700"
                        } transition-colors`}
                      >
                        <User size={18} />
                        <span>{language === "th" ? "โปรไฟล์" : "Profile"}</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setCurrentPage && setCurrentPage("settings");
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 ${
                          theme === "dark"
                            ? "hover:bg-gray-700 text-gray-300"
                            : "hover:bg-gray-50 text-gray-700"
                        } transition-colors`}
                      >
                        <SettingsIcon size={18} />
                        <span>
                          {language === "th" ? "การตั้งค่า" : "Settings"}
                        </span>
                      </button>
                    </div>

                    {/* Logout */}
                    <div
                      className={`border-t ${
                        theme === "dark" ? "border-gray-700" : "border-gray-100"
                      } py-2`}
                    >
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut size={18} />
                        <span>
                          {language === "th" ? "ออกจากระบบ" : "Logout"}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar
        {showSearch && (
          <div className="md:hidden px-6 pb-4">
            <div className="relative">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-400"
                }`}
                size={18}
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder={
                  language === "th"
                    ? "ค้นหารายการ..."
                    : "Search transactions..."
                }
                className={`w-full pl-10 pr-4 py-2 rounded-xl border ${
                  theme === "dark"
                    ? "border-gray-600 bg-gray-800/50 text-gray-200 placeholder-gray-400"
                    : "border-gray-200 bg-white/50 text-gray-800"
                } focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none transition-all`}
              />
            </div>
          </div>
        )} */}
      </div>
    </header>
  );
};

export default Header;
