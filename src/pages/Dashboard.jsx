import React, { useMemo, useState, useEffect } from "react";
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
  Zap,
  CreditCard,
  DollarSign,
  BarChart3,
  Eye,
  Star,
} from "lucide-react";

const Dashboard = ({
  transactions = [
    {
      id: 1,
      title: "Salary",
      amount: 50000,
      type: "income",
      date: "2025-08-01",
    },
    {
      id: 2,
      title: "Groceries",
      amount: 2500,
      type: "expense",
      date: "2025-08-15",
    },
    {
      id: 3,
      title: "Freelance",
      amount: 15000,
      type: "income",
      date: "2025-08-20",
    },
    {
      id: 4,
      title: "Utilities",
      amount: 3200,
      type: "expense",
      date: "2025-08-25",
    },
    {
      id: 5,
      title: "Investment Return",
      amount: 8000,
      type: "income",
      date: "2025-08-26",
    },
  ],
  theme = "light",
  language = "en",
}) => {
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setTimeout(() => setAnimateCards(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;

    // Calculate this month's data
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });

    const monthlyIncome = thisMonthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const monthlyExpense = thisMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

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

  // Enhanced Pie Chart Component with smooth animations
  const PieChartComponent = () => {
    const [animationProgress, setAnimationProgress] = useState(0);

    useEffect(() => {
      const timer = setTimeout(() => {
        setAnimationProgress(1);
      }, 500);
      return () => clearTimeout(timer);
    }, []);

    const total = stats.totalIncome + stats.totalExpense;
    const incomePercentage = total > 0 ? (stats.totalIncome / total) * 100 : 0;
    const expensePercentage =
      total > 0 ? (stats.totalExpense / total) * 100 : 0;

    const radius = 85;
    const circumference = 2 * Math.PI * radius;
    const incomeStrokeDasharray =
      (incomePercentage / 100) * circumference * animationProgress;
    const expenseStrokeDasharray =
      (expensePercentage / 100) * circumference * animationProgress;

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-52 h-52 mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full animate-pulse"></div>
          <svg
            className="w-full h-full transform -rotate-90 relative z-10"
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
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke={theme === "dark" ? "#374151" : "#f1f5f9"}
              strokeWidth="8"
              fill="transparent"
              className="drop-shadow-sm"
            />

            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="url(#incomeGradient)"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={`${incomeStrokeDasharray} ${circumference}`}
              strokeLinecap="round"
              filter="url(#glow)"
              className="transition-all duration-[2000ms] ease-out drop-shadow-lg"
            />

            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="url(#expenseGradient)"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={`${expenseStrokeDasharray} ${circumference}`}
              strokeDashoffset={-incomeStrokeDasharray}
              strokeLinecap="round"
              filter="url(#glow)"
              className="transition-all duration-[2000ms] ease-out drop-shadow-lg"
              style={{ transitionDelay: "500ms" }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-full p-6 shadow-2xl border border-white/20 dark:border-gray-700/50">
              <div
                className={`text-sm font-semibold mb-1 text-center ${
                  theme === "dark" ? "text-white" : "text-white"
                }`}
              >
                {language === "th" ? "ยอดรวม" : "Total"}
              </div>
              <div
                className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}
              >
                ฿{total.toLocaleString()}
              </div>
              <div className="flex items-center justify-center mt-2">
                <Sparkles className="text-yellow-500 animate-pulse" size={16} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="w-6 h-6 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
            </div>
            <div>
              <span
                className={`text-sm font-semibold ${
                  theme === "dark" ? "text-gray-200" : "text-gray-700"
                }`}
              >
                {language === "th" ? "รายรับ" : "Income"}
              </span>
              <div
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {incomePercentage.toFixed(1)}%
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="w-6 h-6 bg-gradient-to-r from-red-400 to-red-600 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 rounded-full blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
            </div>
            <div>
              <span
                className={`text-sm font-semibold ${
                  theme === "dark" ? "text-gray-200" : "text-gray-700"
                }`}
              >
                {language === "th" ? "รายจ่าย" : "Expense"}
              </span>
              <div
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {expensePercentage.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Stat Card Component
  const StatCard = ({
    title,
    amount,
    icon: Icon,
    gradient,
    trend,
    subtitle,
    isBalance = false,

    index = 0,
  }) => (
    <div
      className={`group relative overflow-hidden ${
        theme === "dark"
          ? "bg-gray-800/90 border-gray-700/50"
          : "bg-white/90 border-white/30"
      } backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] border ${
        animateCards ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
      ></div>

      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-pink-400/10 to-orange-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 delay-200"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div
            className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 relative`}
          >
            <Icon size={28} className="relative z-10" />
            <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          {trend !== undefined && (
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm ${
                trend >= 0
                  ? "bg-gradient-to-r from-emerald-100/80 to-emerald-50/80 text-emerald-700 border border-emerald-200/50 dark:from-emerald-900/30 dark:to-emerald-800/30 dark:text-emerald-400 dark:border-emerald-700/30"
                  : "bg-gradient-to-r from-red-100/80 to-red-50/80 text-red-700 border border-red-200/50 dark:from-red-900/30 dark:to-red-800/30 dark:text-red-400 dark:border-red-700/30"
              } hover:scale-105 transition-transform duration-300`}
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
            className={`text-sm font-semibold tracking-wide ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {title}
          </h3>

          <p
            className={`text-3xl font-bold transition-all duration-300 ${
              title.includes("Income") || title.includes("รายรับ")
                ? "text-transparent bg-gradient-to-r from-emerald-500 to-emerald-400 bg-clip-text"
                : title.includes("Expense") || title.includes("รายจ่าย")
                ? "text-transparent bg-gradient-to-r from-red-500 to-red-400 bg-clip-text"
                : title.includes("Balance") || title.includes("ยอดคงเหลือ")
                ? "text-transparent bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text"
                : `text-transparent bg-gradient-to-r ${gradient
                    .split(" ")
                    .slice(1, 3)
                    .join(" ")} bg-clip-text`
            }`}
          >
            ฿{Math.abs(amount).toLocaleString()}
          </p>
          {subtitle && (
            <p
              className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              } flex items-center gap-2`}
            >
              <Star size={12} className="text-yellow-400" />
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // Enhanced Quick Stats Component
  const QuickStats = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[
        {
          title: language === "th" ? "รายการทั้งหมด" : "Total Transactions",
          value: stats.transactionCount,
          icon: BarChart3,
          color: "text-blue-500",
          bgGradient: "from-blue-500/10 to-cyan-500/10",
        },
        {
          title: language === "th" ? "รายรับเดือนนี้" : "Income This Month",
          value: stats.thisMonthTransactions.filter((t) => t.type === "income")
            .length,
          icon: TrendingUp,
          color: "text-emerald-500",
          bgGradient: "from-emerald-500/10 to-green-500/10",
        },
        {
          title: language === "th" ? "รายจ่ายเดือนนี้" : "Expenses This Month",
          value: stats.thisMonthTransactions.filter((t) => t.type === "expense")
            .length,
          icon: TrendingDown,
          color: "text-red-500",
          bgGradient: "from-red-500/10 to-pink-500/10",
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
          bgGradient: "from-purple-500/10 to-indigo-500/10",
        },
      ].map((stat, index) => (
        <div
          key={index}
          className={`group relative overflow-hidden ${
            theme === "dark"
              ? "bg-gray-800/70 border-gray-700/50"
              : "bg-white/70 border-white/40"
          } backdrop-blur-xl rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{
            transitionDelay: `${index * 75}ms`,
          }}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50 group-hover:opacity-75 transition-opacity duration-300`}
          ></div>

          <div className="relative z-10 text-center">
            <div
              className={`inline-flex p-3 rounded-xl ${stat.color} bg-white/80 dark:bg-gray-700/80 shadow-lg mb-3 group-hover:scale-110 transition-transform duration-300`}
            >
              <stat.icon size={24} />
            </div>
            <div className={`text-2xl font-bold mb-1 ${stat.color}`}>
              {stat.value}
            </div>
            <div
              className={`text-xs font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {stat.title}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Enhanced Recent Transactions Component
  const RecentTransactions = () => {
    const displayTransactions = showAllTransactions
      ? transactions
      : transactions.slice(-5);

    return (
      <div
        className={`${
          theme === "dark"
            ? "bg-gray-800/90 border-gray-700/50"
            : "bg-white/90 border-white/30"
        } backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-2xl border relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-pink-500/5 to-orange-500/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h2
              className={`text-xl lg:text-2xl font-bold flex items-center gap-3 ${
                theme === "dark" ? "text-gray-100" : "text-gray-800"
              }`}
            >
              <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl shadow-lg">
                <Activity className="text-white" size={24} />
              </div>
              {language === "th" ? "รายการล่าสุด" : "Recent Transactions"}
            </h2>
            <button
              onClick={() => setShowAllTransactions(!showAllTransactions)}
              className="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group text-sm lg:text-base"
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
                className={`transition-transform duration-300 group-hover:translate-x-1 ${
                  showAllTransactions ? "rotate-90" : ""
                }`}
              />
            </button>
          </div>

          <div
            className={`space-y-4 ${
              showAllTransactions ? "max-h-96 overflow-y-auto" : ""
            }`}
            style={{
              scrollbarWidth: "thin",
              scrollbarColor:
                theme === "dark" ? "#ef4444 #374151" : "#ef4444 #f1f5f9",
            }}
          >
            {displayTransactions.reverse().map((transaction, index) => (
              <div
                key={transaction.id}
                className={`group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 lg:p-6 rounded-2xl transition-all duration-300 ${
                  theme === "dark"
                    ? "hover:bg-gray-700/50 border border-gray-700/30"
                    : "hover:bg-gray-50/50 border border-gray-100/50"
                } hover:shadow-lg hover:scale-[1.02] backdrop-blur-sm ${
                  isLoaded
                    ? "translate-x-0 opacity-100"
                    : "translate-x-4 opacity-0"
                }`}
                style={{
                  transitionDelay: `${index * 50}ms`,
                }}
              >
                <div className="flex items-center gap-4 lg:gap-5">
                  <div
                    className={`p-3 lg:p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-all duration-300 ${
                      transaction.type === "income"
                        ? "bg-gradient-to-br from-emerald-400 to-green-500 text-white"
                        : "bg-gradient-to-br from-red-400 to-pink-500 text-white"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <TrendingUp size={20} />
                    ) : (
                      <TrendingDown size={20} />
                    )}
                  </div>
                  <div>
                    <p
                      className={`font-bold text-base lg:text-lg mb-1 ${
                        theme === "dark" ? "text-gray-100" : "text-gray-800"
                      }`}
                    >
                      {transaction.title}
                    </p>
                    <p
                      className={`text-sm flex items-center gap-2 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
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
                    className={`text-lg lg:text-xl font-bold mb-2 block ${
                      transaction.type === "income"
                        ? "text-transparent bg-gradient-to-r from-emerald-500 to-green-400 bg-clip-text"
                        : "text-transparent bg-gradient-to-r from-red-500 to-pink-400 bg-clip-text"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}฿
                    {transaction.amount.toLocaleString()}
                  </span>
                  <div
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                      transaction.type === "income"
                        ? "bg-gradient-to-r from-emerald-100/80 to-green-100/80 text-emerald-700 border border-emerald-200/50 dark:from-emerald-900/30 dark:to-green-900/30 dark:text-emerald-400 dark:border-emerald-700/30"
                        : "bg-gradient-to-r from-red-100/80 to-pink-100/80 text-red-700 border border-red-200/50 dark:from-red-900/30 dark:to-pink-900/30 dark:text-red-400 dark:border-red-700/30"
                    }`}
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
              <div className="text-center py-16">
                <div
                  className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 shadow-xl`}
                >
                  <PieChart
                    className={`${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
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
  };

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 ${
        theme === "dark"
          ? "text-gray-100 bg-gray-900"
          : "text-gray-900 bg-gray-50"
      } transition-colors duration-300`}
    >
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div
          className={`${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          } transition-all duration-700`}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p
            className={`text-base lg:text-lg ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            } flex items-center gap-2`}
          >
            <Sparkles className="text-yellow-500 animate-pulse" size={20} />
            {language === "th"
              ? "ภาพรวมการเงินของคุณ"
              : "Your financial overview"}
          </p>
        </div>

        <div
          className={`${
            theme === "dark"
              ? "bg-gray-800/80 border-gray-700/50"
              : "bg-white/80 border-white/50"
          } backdrop-blur-xl rounded-2xl px-4 lg:px-6 py-3 lg:py-4 shadow-xl border flex items-center gap-3 lg:gap-4 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <div className="p-2 lg:p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
            <Calendar className="text-white" size={20} />
          </div>
          <div className="text-right">
            <div
              className={`font-bold text-sm lg:text-lg ${
                theme === "dark" ? "text-gray-200" : "text-gray-700"
              }`}
            >
              {new Date().toLocaleDateString(
                language === "th" ? "th-TH" : "en-US"
              )}
            </div>
            <div
              className={`text-xs lg:text-sm ${
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
      <QuickStats />

      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <StatCard
          title={language === "th" ? "รายรับทั้งหมด" : "Total Income"}
          amount={stats.totalIncome}
          icon={TrendingUp}
          gradient="from-emerald-500 to-green-400"
          trend={12.5}
          subtitle={`${
            language === "th" ? "เดือนนี้" : "This month"
          } ฿${stats.monthlyIncome.toLocaleString()}`}
          index={0}
          isBalance={true}
        />
        <StatCard
          title={language === "th" ? "รายจ่ายทั้งหมด" : "Total Expenses"}
          amount={stats.totalExpense}
          icon={TrendingDown}
          gradient="from-red-500 to-pink-400"
          trend={-8.2}
          subtitle={`${
            language === "th" ? "เดือนนี้" : "This month"
          } ฿${stats.monthlyExpense.toLocaleString()}`}
          index={1}
          isBalance={true}
        />
        <StatCard
          title={language === "th" ? "ยอดคงเหลือ" : "Balance"}
          amount={stats.balance}
          icon={Wallet}
          gradient="from-blue-500 to-purple-400"
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
          isBalance={true}
          index={2}
        />
      </div>

      {/* Charts and Analytics Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Pie Chart */}
        <div
          className={`${
            theme === "dark"
              ? "bg-gray-800/90 border-gray-700/50"
              : "bg-white/90 border-white/30"
          } backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-2xl border relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-3xl"></div>

          <h3
            className={`text-xl lg:text-2xl font-bold mb-8 flex items-center gap-3 relative z-10 ${
              theme === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg">
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
            <PieChartComponent />
          </div>
        </div>

        {/* Enhanced Savings Goal */}
        <div
          className={`${
            theme === "dark"
              ? "bg-gray-800/90 border-gray-700/50"
              : "bg-white/90 border-white/30"
          } backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-2xl border relative overflow-hidden`}
        >
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl"></div>

          <h3
            className={`text-xl lg:text-2xl font-bold mb-8 flex items-center gap-3 relative z-10 ${
              theme === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-lg">
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
            <div
              className={`${
                theme === "dark" ? "bg-gray-700/50" : "bg-gray-50/80"
              } rounded-2xl p-4 lg:p-6 backdrop-blur-sm border ${
                theme === "dark" ? "border-gray-600/30" : "border-gray-200/50"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <span
                  className={`text-sm lg:text-lg font-bold ${
                    theme === "dark" ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {language === "th" ? "เป้าหมายเดือนนี้" : "This Month's Goal"}
                </span>
                <span
                  className={`text-sm lg:text-lg font-bold text-transparent bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text`}
                >
                  ฿10,000
                </span>
              </div>

              <div
                className={`w-full h-3 lg:h-4 rounded-full ${
                  theme === "dark" ? "bg-gray-600" : "bg-gray-200"
                } overflow-hidden shadow-inner`}
              >
                <div
                  className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 h-full rounded-full transition-all duration-1000 ease-out shadow-lg relative"
                  style={{
                    width: `${Math.min(
                      ((stats.monthlyIncome - stats.monthlyExpense) / 10000) *
                        100,
                      100
                    )}%`,
                    transitionDelay: "1s",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div
                  className={`text-sm font-semibold ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {language === "th" ? "ออมได้" : "Saved"}: ฿
                  {(
                    stats.monthlyIncome - stats.monthlyExpense
                  ).toLocaleString()}
                </div>
                <div
                  className={`text-sm font-bold px-3 py-1 rounded-full ${
                    Math.min(
                      ((stats.monthlyIncome - stats.monthlyExpense) / 10000) *
                        100,
                      100
                    ) >= 80
                      ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400"
                      : Math.min(
                          ((stats.monthlyIncome - stats.monthlyExpense) /
                            10000) *
                            100,
                          100
                        ) >= 50
                      ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 dark:from-yellow-900/30 dark:to-orange-900/30 dark:text-yellow-400"
                      : "bg-gradient-to-r from-red-100 to-pink-100 text-red-700 dark:from-red-900/30 dark:to-pink-900/30 dark:text-red-400"
                  }`}
                >
                  {Math.min(
                    ((stats.monthlyIncome - stats.monthlyExpense) / 10000) *
                      100,
                    100
                  ).toFixed(1)}
                  %
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    i <
                    Math.floor(
                      ((stats.monthlyIncome - stats.monthlyExpense) / 10000) * 5
                    )
                      ? "bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg"
                      : theme === "dark"
                      ? "bg-gray-600"
                      : "bg-gray-300"
                  }`}
                  style={{
                    transitionDelay: `${i * 100 + 1200}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  );
};

export default Dashboard;
