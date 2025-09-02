import React, { useMemo, useState, useEffect, useCallback, memo } from "react";
import {
  Calendar,
  PieChart,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Activity,
  ChevronRight,
  Sparkles,
  BarChart3,
  Star,
  Zap,
  Gift,
  Award,
} from "lucide-react";

/* -----------------------------
 * Enhanced Typing Text Effect
 * ----------------------------- */
const TypingText = memo(
  ({ text = "Dashboard", speed = 60, className = "" }) => {
    const [display, setDisplay] = useState("");

    useEffect(() => {
      setDisplay("");
      let i = 0;
      const timer = setInterval(() => {
        i += 1;
        setDisplay(text.slice(0, i));
        if (i >= text.length) clearInterval(timer);
      }, speed);
      return () => clearInterval(timer);
    }, [text, speed]);

    return (
      <span className={`inline-flex items-baseline ${className}`}>
        <span>{display}</span>
        <span className="ml-1 animate-pulse">|</span>
      </span>
    );
  }
);

/* -----------------------------
 * Optimized Stat Card Component
 * ----------------------------- */
const StatCard = memo(
  ({
    title,
    amount,
    icon: Icon,
    gradient,
    trend,
    subtitle,
    index = 0,
    amountClassName = "",
    theme = "light",
  }) => (
    <div
      className={`group relative overflow-hidden transform transition-all duration-700 ease-out hover:scale-[1.02] ${
        theme === "dark"
          ? "bg-gray-800/80 border-gray-700/30"
          : "bg-white/80 border-white/20"
      } backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:shadow-3xl border animate-fade-in-up`}
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: "both",
      }}
    >
      {/* Enhanced Background Effects */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-700`}
      />
      <div
        className={`absolute -inset-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 blur-xl transition-all duration-700`}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div
            className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-xl transform group-hover:scale-110 transition-transform duration-500`}
          >
            <Icon size={28} />
          </div>
          {typeof trend === "number" && (
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm transition-all duration-300 transform hover:scale-105 ${
                trend >= 0
                  ? "bg-emerald-50/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 shadow-emerald-500/20"
                  : "bg-red-50/80 text-red-700 dark:bg-red-900/30 dark:text-red-400 shadow-red-500/20"
              } shadow-lg`}
            >
              {trend >= 0 ? (
                <ArrowUpRight size={16} className="animate-bounce" />
              ) : (
                <ArrowDownRight size={16} className="animate-bounce" />
              )}
              {Math.abs(trend).toFixed(1)}%
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h3
            className={`text-sm font-semibold tracking-wide transition-colors duration-300 ${
              theme === "dark"
                ? "text-gray-300 group-hover:text-gray-200"
                : "text-gray-600 group-hover:text-gray-700"
            }`}
          >
            {title}
          </h3>

          <p
            className={`text-3xl font-bold transform transition-all duration-500 group-hover:scale-105 ${amountClassName}`}
          >
            ฿{Math.abs(amount).toLocaleString()}
          </p>

          {subtitle && (
            <p
              className={`text-sm font-medium transition-colors duration-300 ${
                theme === "dark"
                  ? "text-gray-400 group-hover:text-gray-300"
                  : "text-gray-500 group-hover:text-gray-600"
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  )
);

/* -----------------------------
 * Enhanced Quick Stats Component
 * ----------------------------- */
const QuickStats = memo(({ stats, theme, language, isLoaded }) => {
  const quickStatsData = useMemo(
    () => [
      {
        title: language === "th" ? "รายการทั้งหมด" : "Total Transactions",
        value: stats.transactionCount,
        icon: BarChart3,
        color: "text-blue-500",
        bgGradient: "from-blue-500/10 via-blue-400/5 to-cyan-500/10",
        glowColor: "shadow-blue-500/20",
      },
      {
        title: language === "th" ? "รายรับเดือนนี้" : "Income This Month",
        value: stats.thisMonthTransactions.filter((t) => t.type === "income")
          .length,
        icon: TrendingUp,
        color: "text-emerald-500",
        bgGradient: "from-emerald-500/10 via-emerald-400/5 to-green-500/10",
        glowColor: "shadow-emerald-500/20",
      },
      {
        title: language === "th" ? "รายจ่ายเดือนนี้" : "Expenses This Month",
        value: stats.thisMonthTransactions.filter((t) => t.type === "expense")
          .length,
        icon: TrendingDown,
        color: "text-red-500",
        bgGradient: "from-red-500/10 via-red-400/5 to-pink-500/10",
        glowColor: "shadow-red-500/20",
      },
      {
        title: language === "th" ? "อัตราใช้จ่าย" : "Expense Ratio",
        value: `${
          stats.monthlyIncome > 0
            ? ((stats.monthlyExpense / stats.monthlyIncome) * 100).toFixed(1)
            : "0"
        }%`,
        icon: Target,
        color: "text-purple-500",
        bgGradient: "from-purple-500/10 via-purple-400/5 to-indigo-500/10",
        glowColor: "shadow-purple-500/20",
      },
    ],
    [stats, language]
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {quickStatsData.map((stat, index) => (
        <div
          key={index}
          className={`group relative overflow-hidden transform transition-all duration-700 ease-out hover:scale-105 ${
            theme === "dark"
              ? "bg-gray-800/70 border-gray-700/30"
              : "bg-white/70 border-white/30"
          } backdrop-blur-xl rounded-2xl p-5 shadow-lg hover:shadow-2xl border animate-fade-in-up ${
            stat.glowColor
          }`}
          style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: "both",
          }}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity duration-500`}
          />
          <div className="relative z-10 text-center">
            <div
              className={`inline-flex p-3 rounded-xl ${stat.color} bg-white/80 dark:bg-gray-700/80 shadow-lg mb-3 transform group-hover:scale-110 transition-transform duration-500`}
            >
              <stat.icon size={24} />
            </div>
            <div
              className={`text-2xl font-bold mb-1 ${stat.color} transform transition-all duration-300 group-hover:scale-105`}
            >
              {stat.value}
            </div>
            <div
              className={`text-xs font-medium transition-colors duration-300 ${
                theme === "dark"
                  ? "text-gray-300 group-hover:text-gray-200"
                  : "text-gray-600 group-hover:text-gray-700"
              }`}
            >
              {stat.title}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

/* -----------------------------
 * Enhanced Pie Chart Component
 * ----------------------------- */
const PieChartComponent = memo(({ stats, theme, language }) => {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationProgress(1), 800);
    return () => clearTimeout(timer);
  }, []);

  const chartData = useMemo(() => {
    const total = stats.totalIncome + stats.totalExpense;
    const incomePercentage = total > 0 ? (stats.totalIncome / total) * 100 : 0;
    const expensePercentage =
      total > 0 ? (stats.totalExpense / total) * 100 : 0;

    const radius = 85;
    const circumference = 2 * Math.PI * radius;

    return {
      incomePercentage,
      expensePercentage,
      radius,
      circumference,
      incomeStrokeDasharray:
        (incomePercentage / 100) * circumference * animationProgress,
      expenseStrokeDasharray:
        (expensePercentage / 100) * circumference * animationProgress,
      total,
    };
  }, [stats, animationProgress]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-52 h-52 mb-6">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-full animate-pulse" />
        <div className="absolute inset-2 bg-gradient-to-br from-white/50 to-transparent dark:from-gray-800/50 rounded-full backdrop-blur-sm" />

        <svg
          className="w-full h-full -rotate-90 relative z-10 drop-shadow-2xl"
          viewBox="0 0 200 200"
        >
          <defs>
            <linearGradient
              id="incomeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#6ee7b7" />
            </linearGradient>
            <linearGradient
              id="expenseGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#fca5a5" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle
            cx="100"
            cy="100"
            r={chartData.radius}
            stroke={theme === "dark" ? "#374151" : "#f1f5f9"}
            strokeWidth="6"
            fill="transparent"
            className="drop-shadow-sm"
          />

          <circle
            cx="100"
            cy="100"
            r={chartData.radius}
            stroke="url(#incomeGradient)"
            strokeWidth="14"
            fill="transparent"
            strokeDasharray={`${chartData.incomeStrokeDasharray} ${chartData.circumference}`}
            strokeLinecap="round"
            filter="url(#glow)"
            className="transition-all duration-[2500ms] ease-out"
          />

          <circle
            cx="100"
            cy="100"
            r={chartData.radius}
            stroke="url(#expenseGradient)"
            strokeWidth="14"
            fill="transparent"
            strokeDasharray={`${chartData.expenseStrokeDasharray} ${chartData.circumference}`}
            strokeDashoffset={-chartData.incomeStrokeDasharray}
            strokeLinecap="round"
            filter="url(#glow)"
            className="transition-all duration-[2500ms] ease-out"
            style={{ transitionDelay: "800ms" }}
          />
        </svg>

        {/* Enhanced Center Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full p-6 shadow-2xl border-2 border-white/30 dark:border-gray-700/30 transform hover:scale-105 transition-transform duration-500">
            <div className="text-sm font-semibold mb-1 text-center text-gray-700 dark:text-gray-300">
              {language === "th" ? "ยอดรวม" : "Total"}
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              ฿{chartData.total.toLocaleString()}
            </div>
            <div className="flex items-center justify-center mt-2">
              <Sparkles className="text-yellow-500 animate-spin" size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Legend */}
      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
        <div className="flex items-center gap-3 group">
          <span className="relative w-6 h-6 rounded-full shadow-lg bg-gradient-to-r from-emerald-400 to-emerald-600 group-hover:scale-110 transition-transform duration-300" />
          <div>
            <span
              className={`text-sm font-semibold transition-colors duration-300 ${
                theme === "dark"
                  ? "text-gray-200 group-hover:text-emerald-400"
                  : "text-gray-700 group-hover:text-emerald-600"
              }`}
            >
              {language === "th" ? "รายรับ" : "Income"}
            </span>
            <div
              className={`text-xs transition-colors duration-300 ${
                theme === "dark"
                  ? "text-gray-400 group-hover:text-gray-300"
                  : "text-gray-500 group-hover:text-gray-600"
              }`}
            >
              {chartData.incomePercentage.toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 group">
          <span className="relative w-6 h-6 rounded-full shadow-lg bg-gradient-to-r from-red-400 to-red-600 group-hover:scale-110 transition-transform duration-300" />
          <div>
            <span
              className={`text-sm font-semibold transition-colors duration-300 ${
                theme === "dark"
                  ? "text-gray-200 group-hover:text-red-400"
                  : "text-gray-700 group-hover:text-red-600"
              }`}
            >
              {language === "th" ? "รายจ่าย" : "Expense"}
            </span>
            <div
              className={`text-xs transition-colors duration-300 ${
                theme === "dark"
                  ? "text-gray-400 group-hover:text-gray-300"
                  : "text-gray-500 group-hover:text-gray-600"
              }`}
            >
              {chartData.expensePercentage.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

/* -----------------------------
 * Enhanced Recent Transactions Component
 * ----------------------------- */
const RecentTransactions = memo(
  ({
    transactions,
    showAllTransactions,
    setShowAllTransactions,
    theme,
    language,
    isLoaded,
  }) => {
    const displayTransactions = useMemo(
      () => (showAllTransactions ? transactions : transactions.slice(-5)),
      [transactions, showAllTransactions]
    );

    const handleToggleTransactions = useCallback(() => {
      setShowAllTransactions((prev) => !prev);
    }, [setShowAllTransactions]);

    return (
      <div
        className={`${
          theme === "dark"
            ? "bg-gray-800/90 border-gray-700/30"
            : "bg-white/90 border-white/20"
        } backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-2xl border relative overflow-hidden animate-fade-in-up`}
      >
        {/* Enhanced Background Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-pink-500/5 via-orange-500/5 to-red-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h2
              className={`text-xl lg:text-2xl font-bold flex items-center gap-3 ${
                theme === "dark" ? "text-gray-100" : "text-gray-800"
              }`}
            >
              <div className="p-3 bg-gradient-to-br from-red-500 via-pink-500 to-purple-500 rounded-2xl shadow-lg transform hover:scale-110 transition-transform duration-500">
                <Activity className="text-white" size={24} />
              </div>
              {language === "th" ? "รายการล่าสุด" : "Recent Transactions"}
            </h2>

            <button
              onClick={handleToggleTransactions}
              className="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-500 group text-sm lg:text-base transform hover:rotate-1"
            >
              {showAllTransactions
                ? language === "th"
                  ? "ดูน้อยลง"
                  : "Show Less"
                : language === "th"
                ? "ดูทั้งหมด"
                : "View All"}
              <ChevronRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:rotate-12"
              />
            </button>
          </div>

          <div
            className={`${
              showAllTransactions
                ? "max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500"
                : ""
            } space-y-4`}
          >
            {[...displayTransactions].reverse().map((transaction, index) => (
              <div
                key={transaction.id}
                className={`group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 lg:p-6 rounded-2xl transition-all duration-500 transform hover:scale-[1.02] animate-fade-in-right ${
                  theme === "dark"
                    ? "hover:bg-gray-700/50 border border-gray-700/20 hover:border-gray-600/50"
                    : "hover:bg-gray-50/50 border border-gray-100/30 hover:border-gray-200/50"
                } hover:shadow-lg backdrop-blur-sm`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "both",
                }}
              >
                <div className="flex items-center gap-4 lg:gap-5">
                  <div
                    className={`p-3 lg:p-4 rounded-2xl shadow-lg transform group-hover:scale-110 transition-all duration-500 ${
                      transaction.type === "income"
                        ? "bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 text-white shadow-emerald-500/30"
                        : "bg-gradient-to-br from-red-400 via-pink-500 to-rose-500 text-white shadow-red-500/30"
                    } group-hover:rotate-12`}
                  >
                    {transaction.type === "income" ? (
                      <TrendingUp size={20} />
                    ) : (
                      <TrendingDown size={20} />
                    )}
                  </div>

                  <div>
                    <p
                      className={`font-bold text-base lg:text-lg mb-1 transition-colors duration-300 ${
                        theme === "dark"
                          ? "text-gray-100 group-hover:text-white"
                          : "text-gray-800 group-hover:text-gray-900"
                      }`}
                    >
                      {transaction.title}
                    </p>
                    <p
                      className={`text-sm flex items-center gap-2 transition-colors duration-300 ${
                        theme === "dark"
                          ? "text-gray-400 group-hover:text-gray-300"
                          : "text-gray-500 group-hover:text-gray-600"
                      }`}
                    >
                      <Calendar size={14} />
                      {new Date(transaction.date).toLocaleDateString(
                        language === "th" ? "th-TH" : "en-US"
                      )}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-lg lg:text-xl font-bold mb-2 block transition-all duration-300 group-hover:scale-105 ${
                      transaction.type === "income"
                        ? "text-emerald-500 group-hover:text-emerald-400"
                        : "text-red-500 group-hover:text-red-400"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}฿
                    {Number(transaction.amount || 0).toLocaleString()}
                  </span>

                  <div
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all duration-300 transform group-hover:scale-105 ${
                      transaction.type === "income"
                        ? "bg-emerald-50/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 shadow-emerald-500/20"
                        : "bg-red-50/80 text-red-700 dark:bg-red-900/30 dark:text-red-400 shadow-red-500/20"
                    } shadow-lg`}
                  >
                    {transaction.type === "income"
                      ? language === "th"
                        ? "รายรับ"
                        : "Income"
                      : language === "th"
                      ? "รายจ่าย"
                      : "Expense"}
                  </div>
                </div>
              </div>
            ))}

            {transactions.length === 0 && (
              <div className="text-center py-16 animate-fade-in">
                <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 shadow-2xl transform hover:scale-110 transition-transform duration-500">
                  <PieChart
                    className={`${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    } animate-pulse`}
                    size={32}
                  />
                </div>
                <p
                  className={`text-xl font-semibold mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {language === "th" ? "ยังไม่มีรายการ" : "No transactions yet"}
                </p>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {language === "th"
                    ? "เพิ่มรายการแรกของคุณ"
                    : "Add your first transaction"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

/* -----------------------------
 * Main Dashboard Component
 * ----------------------------- */
const Dashboard = ({
  transactions = [],
  theme = "light",
  language = "en",
  monthlyGoal = 10000,
}) => {
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [goal, setGoal] = useState(Number(monthlyGoal) || 0);
  const [goalInput, setGoalInput] = useState(String(Number(monthlyGoal) || 0));
  const [savingGoal, setSavingGoal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Optimized stats calculation with useMemo
  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const balance = totalIncome - totalExpense;

    const now = new Date();
    const cm = now.getMonth();
    const cy = now.getFullYear();

    const thisMonthTransactions = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === cm && d.getFullYear() === cy;
    });

    const monthlyIncome = thisMonthTransactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const monthlyExpense = thisMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + (Number(t.amount) || 0), 0);

    return {
      totalIncome,
      totalExpense,
      balance,
      monthlyIncome,
      monthlyExpense,
      transactionCount: transactions.length,
      thisMonthTransactions,
    };
  }, [transactions]);

  // Optimized goal calculations
  const goalStats = useMemo(() => {
    const netSaved = stats.monthlyIncome - stats.monthlyExpense;
    const progressPct = goal > 0 ? Math.min((netSaved / goal) * 100, 100) : 0;
    const filledDots = goal > 0 ? Math.floor((netSaved / goal) * 5) : 0;

    return { netSaved, progressPct, filledDots };
  }, [stats.monthlyIncome, stats.monthlyExpense, goal]);

  const handleSaveGoal = useCallback(() => {
    setSavingGoal(true);
    const n = Math.max(0, Math.floor(Number(goalInput) || 0));
    setGoal(n);
    setGoalInput(String(n));
    setTimeout(() => setSavingGoal(false), 350);
  }, [goalInput]);

  return (
    <>
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-in-right {
          animation: fade-in-right 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.8);
        }
        
        .dark .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.5);
        }
        
        .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(75, 85, 99, 0.8);
        }
      `}</style>

      <div
        className={`min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 transition-all duration-700 ease-out ${
          theme === "dark"
            ? "text-gray-100 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
            : "text-gray-900 bg-gradient-to-br from-gray-50 via-white to-gray-100"
        }`}
      >
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div
            className={`transform transition-all duration-1000 ease-out ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-red-500 via-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-2 animate-gradient">
              <TypingText text="Dashboard" speed={60} />
            </h1>
            <p
              className={`text-base lg:text-lg flex items-center gap-2 transition-colors duration-500 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <Sparkles className="text-yellow-500 animate-pulse" size={20} />
              {language === "th"
                ? "ภาพรวมการเงินของคุณ"
                : "Your financial overview"}
            </p>
          </div>

          {/* Enhanced Date Display */}
          <div
            className={`transform transition-all duration-1000 ease-out ${
              theme === "dark"
                ? "bg-gray-800/80 border-gray-700/30"
                : "bg-white/80 border-white/30"
            } backdrop-blur-xl rounded-2xl px-4 lg:px-6 py-3 lg:py-4 shadow-2xl border flex items-center gap-3 lg:gap-4 hover:scale-105 hover:shadow-3xl ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="p-2 lg:p-3 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-lg transform hover:rotate-12 transition-transform duration-500">
              <Calendar className="text-white" size={20} />
            </div>
            <div className="text-right">
              <div
                className={`font-bold text-sm lg:text-lg transition-colors duration-300 ${
                  theme === "dark" ? "text-gray-200" : "text-gray-700"
                }`}
              >
                {new Date().toLocaleDateString(
                  language === "th" ? "th-TH" : "en-US"
                )}
              </div>
              <div
                className={`text-xs lg:text-sm transition-colors duration-300 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {new Date().toLocaleDateString(
                  language === "th" ? "th-TH" : "en-US",
                  { weekday: "long" }
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <QuickStats
          stats={stats}
          theme={theme}
          language={language}
          isLoaded={isLoaded}
        />

        {/* Enhanced Main Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <StatCard
            title={language === "th" ? "รายรับทั้งหมด" : "Total Income"}
            amount={stats.totalIncome}
            icon={TrendingUp}
            gradient="from-emerald-500 via-green-500 to-teal-500"
            trend={12.5}
            subtitle={`${
              language === "th" ? "เดือนนี้" : "This month"
            } ฿${stats.monthlyIncome.toLocaleString()}`}
            index={0}
            amountClassName="text-emerald-600 dark:text-emerald-400"
            theme={theme}
          />

          <StatCard
            title={language === "th" ? "รายจ่ายทั้งหมด" : "Total Expenses"}
            amount={stats.totalExpense}
            icon={TrendingDown}
            gradient="from-red-500 via-pink-500 to-rose-500"
            trend={-8.2}
            subtitle={`${
              language === "th" ? "เดือนนี้" : "This month"
            } ฿${stats.monthlyExpense.toLocaleString()}`}
            index={1}
            amountClassName="text-red-600 dark:text-red-400"
            theme={theme}
          />

          <StatCard
            title={language === "th" ? "ยอดคงเหลือ" : "Balance"}
            amount={stats.balance}
            icon={Wallet}
            gradient="from-blue-500 via-purple-500 to-indigo-500"
            trend={stats.balance >= 0 ? 5.3 : -3.1}
            subtitle={
              stats.balance >= 0
                ? language === "th"
                  ? "สถานะการเงินดี"
                  : "Financial status is good"
                : language === "th"
                ? "ควรควบคุมรายจ่าย"
                : "Should control expenses"
            }
            index={2}
            amountClassName={
              stats.balance >= 0
                ? "text-blue-600 dark:text-blue-400"
                : "text-amber-600 dark:text-amber-400"
            }
            theme={theme}
          />
        </div>

        {/* Enhanced Charts + Savings Goal */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Enhanced Pie Chart */}
          <div
            className={`transform transition-all duration-1000 ease-out animate-fade-in-up ${
              theme === "dark"
                ? "bg-gray-800/90 border-gray-700/30"
                : "bg-white/90 border-white/20"
            } backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-2xl border relative overflow-hidden hover:shadow-3xl hover:scale-[1.01]`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />

            <h3
              className={`text-xl lg:text-2xl font-bold mb-8 flex items-center gap-3 relative z-10 transition-colors duration-300 ${
                theme === "dark" ? "text-gray-100" : "text-gray-800"
              }`}
            >
              <div className="p-3 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg transform hover:scale-110 hover:rotate-12 transition-all duration-500">
                <PieChart className="text-white" size={24} />
              </div>
              <span className="hidden sm:inline">
                {language === "th"
                  ? "สัดส่วนรายรับ-รายจ่าย"
                  : "Income-Expense Ratio"}
              </span>
              <span className="sm:hidden">
                {language === "th" ? "สัดส่วน" : "Ratio"}
              </span>
            </h3>

            <div className="relative z-10">
              <PieChartComponent
                stats={stats}
                theme={theme}
                language={language}
              />
            </div>
          </div>

          {/* Enhanced Savings Goal */}
          <div
            className={`transform transition-all duration-1000 ease-out animate-fade-in-up ${
              theme === "dark"
                ? "bg-gray-800/90 border-gray-700/30"
                : "bg-white/90 border-white/20"
            } backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-2xl border relative overflow-hidden hover:shadow-3xl hover:scale-[1.01]`}
            style={{ transitionDelay: "200ms" }}
          >
            <div
              className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-yellow-500/10 via-orange-500/10 to-red-500/10 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            />

            <h3
              className={`text-xl lg:text-2xl font-bold mb-8 flex items-center gap-3 relative z-10 transition-colors duration-300 ${
                theme === "dark" ? "text-gray-100" : "text-gray-800"
              }`}
            >
              <div className="p-3 bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 rounded-2xl shadow-lg transform hover:scale-110 hover:rotate-12 transition-all duration-500">
                <Target className="text-white" size={24} />
              </div>
              <span className="hidden sm:inline">
                {language === "th" ? "เป้าหมายการออม" : "Savings Goal"}
              </span>
              <span className="sm:hidden">
                {language === "th" ? "เป้าหมาย" : "Goal"}
              </span>
            </h3>

            <div className="space-y-6 relative z-10">
              {/* Enhanced Goal Input */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
                <div className="flex-1">
                  <label
                    className={`block text-xs font-semibold mb-2 transition-colors duration-300 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {language === "th"
                      ? "ตั้งค่าเป้าหมาย (บาท)"
                      : "Set goal (THB)"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300 focus:ring-4 focus:ring-orange-200/50 focus:border-orange-400 focus:scale-105 ${
                      theme === "dark"
                        ? "bg-gray-800/80 border-gray-700/50 text-gray-100 focus:bg-gray-700/80"
                        : "bg-white/80 border-gray-200/50 focus:bg-white"
                    } shadow-lg backdrop-blur-sm`}
                    placeholder="10000"
                  />
                </div>
                <button
                  onClick={handleSaveGoal}
                  className={`px-5 py-3 rounded-xl font-semibold shadow-lg transition-all duration-500 transform hover:scale-105 hover:shadow-xl ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white hover:brightness-110"
                      : "bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white hover:brightness-105"
                  } ${
                    savingGoal ? "scale-95 opacity-80 rotate-12" : "scale-100"
                  } active:scale-95`}
                >
                  {savingGoal ? (
                    <Zap className="animate-spin" size={20} />
                  ) : language === "th" ? (
                    "บันทึก"
                  ) : (
                    "Save"
                  )}
                </button>
              </div>

              {/* Enhanced Goal Progress */}
              <div
                className={`transform transition-all duration-700 ${
                  theme === "dark" ? "bg-gray-700/50" : "bg-gray-50/80"
                } rounded-2xl p-4 lg:p-6 backdrop-blur-sm border hover:scale-[1.02] ${
                  theme === "dark" ? "border-gray-600/30" : "border-gray-200/50"
                } shadow-lg hover:shadow-xl`}
              >
                <div className="flex justify-between items-center mb-4">
                  <span
                    className={`text-sm lg:text-lg font-bold transition-colors duration-300 ${
                      theme === "dark" ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    {language === "th"
                      ? "เป้าหมายเดือนนี้"
                      : "This Month's Goal"}
                  </span>
                  <span className="text-sm lg:text-lg font-bold text-transparent bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text animate-pulse">
                    ฿{goal.toLocaleString()}
                  </span>
                </div>

                {/* Enhanced Progress Bar */}
                <div
                  className={`w-full h-4 lg:h-5 rounded-full overflow-hidden shadow-inner relative ${
                    theme === "dark" ? "bg-gray-600" : "bg-gray-200"
                  }`}
                >
                  <div
                    className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 h-full rounded-full transition-all duration-[2000ms] ease-out shadow-lg relative overflow-hidden"
                    style={{
                      width: `${goalStats.progressPct}%`,
                      transitionDelay: "500ms",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-full animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-shimmer" />
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div
                    className={`text-sm font-semibold transition-colors duration-300 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {language === "th" ? "ออมได้" : "Saved"}: ฿
                    {goalStats.netSaved.toLocaleString()}
                  </div>
                  <div
                    className={`text-sm font-bold px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
                      goalStats.progressPct >= 100
                        ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400 shadow-green-500/20 animate-pulse"
                        : goalStats.progressPct >= 80
                        ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400 shadow-green-500/20"
                        : goalStats.progressPct >= 50
                        ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 dark:from-yellow-900/30 dark:to-orange-900/30 dark:text-yellow-400 shadow-yellow-500/20"
                        : "bg-gradient-to-r from-red-100 to-pink-100 text-red-700 dark:from-red-900/30 dark:to-pink-900/30 dark:text-red-400 shadow-red-500/20"
                    } shadow-lg`}
                  >
                    {goalStats.progressPct >= 100 && (
                      <Award className="inline-block mr-1" size={14} />
                    )}
                    {goalStats.progressPct.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Enhanced Progress Dots */}
              <div className="flex justify-center gap-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full transition-all duration-700 ease-out transform hover:scale-125 ${
                      i < goalStats.filledDots
                        ? "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 shadow-lg shadow-orange-500/30 animate-pulse"
                        : theme === "dark"
                        ? "bg-gray-600 hover:bg-gray-500"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    style={{ transitionDelay: `${i * 150 + 800}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Recent Transactions */}
        <RecentTransactions
          transactions={transactions}
          showAllTransactions={showAllTransactions}
          setShowAllTransactions={setShowAllTransactions}
          theme={theme}
          language={language}
          isLoaded={isLoaded}
        />
      </div>
    </>
  );
};

export default Dashboard;
