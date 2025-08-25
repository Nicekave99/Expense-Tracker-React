// pages/Report.jsx
import React, { useState, useMemo } from "react";
import {
  Calendar,
  Filter,
  BarChart2,
  PieChart,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  DollarSign,
  Target,
  Activity,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";

const Report = ({ transactions }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [reportType, setReportType] = useState("monthly");

  const months = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  // Calculate report data
  const reportData = useMemo(() => {
    let filteredTransactions = transactions;

    if (reportType === "monthly") {
      filteredTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate.getMonth() === selectedMonth &&
          transactionDate.getFullYear() === selectedYear
        );
      });
    } else if (reportType === "yearly") {
      filteredTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getFullYear() === selectedYear;
      });
    }

    const income = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;

    // Category breakdown
    const categoryData = {};
    filteredTransactions.forEach((transaction) => {
      const category = transaction.category || "ไม่ระบุหมวดหมู่";
      if (!categoryData[category]) {
        categoryData[category] = { income: 0, expense: 0, count: 0 };
      }
      categoryData[category][transaction.type] += transaction.amount;
      categoryData[category].count += 1;
    });

    // Daily breakdown for monthly report
    const dailyData = {};
    if (reportType === "monthly") {
      const daysInMonth = new Date(
        selectedYear,
        selectedMonth + 1,
        0
      ).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        dailyData[i] = { income: 0, expense: 0 };
      }

      filteredTransactions.forEach((transaction) => {
        const day = new Date(transaction.date).getDate();
        dailyData[day][transaction.type] += transaction.amount;
      });
    }

    return {
      filteredTransactions,
      income,
      expense,
      balance,
      categoryData,
      dailyData,
      transactionCount: filteredTransactions.length,
    };
  }, [transactions, selectedMonth, selectedYear, reportType]);

  // Summary cards data
  const summaryCards = [
    {
      title: "รายรับรวม",
      amount: reportData.income,
      icon: TrendingUp,
      color: "from-green-500 to-green-400",
      textColor: "text-green-600",
    },
    {
      title: "รายจ่ายรวม",
      amount: reportData.expense,
      icon: TrendingDown,
      color: "from-red-500 to-red-400",
      textColor: "text-red-600",
    },
    {
      title: "คงเหลือสุทธิ",
      amount: reportData.balance,
      icon: DollarSign,
      color:
        reportData.balance >= 0
          ? "from-blue-500 to-blue-400"
          : "from-red-500 to-red-400",
      textColor: reportData.balance >= 0 ? "text-blue-600" : "text-red-600",
    },
    {
      title: "จำนวนรายการ",
      amount: reportData.transactionCount,
      icon: Activity,
      color: "from-purple-500 to-purple-400",
      textColor: "text-purple-600",
      isCount: true,
    },
  ];

  // Financial health indicator
  const getFinancialHealth = () => {
    const savingRate =
      reportData.income > 0
        ? (reportData.balance / reportData.income) * 100
        : 0;

    if (savingRate >= 20) {
      return {
        status: "excellent",
        color: "text-green-600",
        icon: CheckCircle,
        message: "สถานะการเงินดีเยี่ยม",
      };
    } else if (savingRate >= 10) {
      return {
        status: "good",
        color: "text-blue-600",
        icon: Info,
        message: "สถานะการเงินดี",
      };
    } else if (savingRate >= 0) {
      return {
        status: "warning",
        color: "text-yellow-600",
        icon: AlertTriangle,
        message: "ควรเพิ่มการออม",
      };
    } else {
      return {
        status: "danger",
        color: "text-red-600",
        icon: AlertTriangle,
        message: "ควรลดรายจ่าย",
      };
    }
  };

  const handleRefresh = () => {
    // วิธีง่ายๆ: รีเซ็ต state ของ transactions หรือแค่ trigger useMemo ใหม่
    setSelectedMonth((prev) => prev); // trigger useMemo
    setSelectedYear((prev) => prev);
    setReportType((prev) => prev);
  };

  const financialHealth = getFinancialHealth();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
            รายงานการเงิน
          </h1>
          <p className="text-gray-600 mt-2">วิเคราะห์รายรับ-รายจ่ายของคุณ</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors"
            onClick={handleRefresh}
          >
            <RefreshCw size={18} />
            รีเฟรช
          </button>
          {/* <button className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-green-700 rounded-xl hover:bg-gray-200 transition-colors">
            <Download size={18} />
            ส่งออก PDF (ใช้งานไม่ได้)
          </button> */}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <Filter className="text-red-500" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">ตัวกรองรายงาน</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              ประเภทรายงาน
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none bg-white/50 transition-all"
            >
              <option value="monthly">รายเดือน</option>
              <option value="yearly">รายปี</option>
              <option value="all">ทั้งหมด</option>
            </select>
          </div>

          {reportType !== "all" && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">ปี</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none bg-white/50 transition-all"
              >
                {Array.from(
                  { length: 5 },
                  (_, i) => new Date().getFullYear() - i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year + 543}
                  </option>
                ))}
              </select>
            </div>
          )}

          {reportType === "monthly" && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                เดือน
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none bg-white/50 transition-all"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-end">
            <div
              className={`p-3 rounded-xl flex items-center gap-2 ${
                financialHealth.status === "excellent"
                  ? "bg-green-100 text-green-700"
                  : financialHealth.status === "good"
                  ? "bg-blue-100 text-blue-700"
                  : financialHealth.status === "warning"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <financialHealth.icon size={20} />
              <span className="text-sm font-medium">
                {financialHealth.message}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${card.color} text-white`}
                >
                  <Icon size={24} />
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">{card.title}</div>
                  <div className={`text-2xl font-bold ${card.textColor}`}>
                    {card.isCount
                      ? card.amount
                      : `฿${card.amount.toLocaleString()}`}
                  </div>
                </div>
              </div>

              {!card.isCount && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    {card.title === "คงเหลือสุทธิ"
                      ? `อัตราการออม: ${
                          reportData.income > 0
                            ? (
                                (reportData.balance / reportData.income) *
                                100
                              ).toFixed(1)
                            : "0"
                        }%`
                      : `เฉลี่ยต่อรายการ: ฿${
                          card.title === "รายรับรวม"
                            ? reportData.filteredTransactions.filter(
                                (t) => t.type === "income"
                              ).length > 0
                              ? (
                                  reportData.income /
                                  reportData.filteredTransactions.filter(
                                    (t) => t.type === "income"
                                  ).length
                                ).toLocaleString()
                              : "0"
                            : reportData.filteredTransactions.filter(
                                (t) => t.type === "expense"
                              ).length > 0
                            ? (
                                reportData.expense /
                                reportData.filteredTransactions.filter(
                                  (t) => t.type === "expense"
                                ).length
                              ).toLocaleString()
                            : "0"
                        }`}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PieChart className="text-red-500" size={24} />
            แยกตามหมวดหมู่
          </h3>

          <div className="space-y-4 max-h-80 overflow-y-auto">
            {Object.entries(reportData.categoryData).map(([category, data]) => {
              const total = data.income + data.expense;
              const percentage =
                reportData.income + reportData.expense > 0
                  ? (
                      (total / (reportData.income + reportData.expense)) *
                      100
                    ).toFixed(1)
                  : "0";

              return (
                <div
                  key={category}
                  className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700">
                      {category}
                    </span>
                    <span className="text-sm text-gray-500">{percentage}%</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="text-green-600 font-semibold">
                        ฿{data.income.toLocaleString()}
                      </div>
                      <div className="text-gray-500">รายรับ</div>
                    </div>
                    <div className="text-center">
                      <div className="text-red-600 font-semibold">
                        ฿{data.expense.toLocaleString()}
                      </div>
                      <div className="text-gray-500">รายจ่าย</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-600 font-semibold">
                        {data.count}
                      </div>
                      <div className="text-gray-500">รายการ</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-400 to-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}

            {Object.keys(reportData.categoryData).length === 0 && (
              <div className="text-center py-8">
                <PieChart className="mx-auto text-gray-400 mb-2" size={32} />
                <p className="text-gray-500">ไม่มีข้อมูลหมวดหมู่</p>
              </div>
            )}
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart2 className="text-red-500" size={24} />
            {reportType === "monthly" ? "แนวโน้มรายวัน" : "สรุปภาพรวม"}
          </h3>

          {reportType === "monthly" &&
          Object.keys(reportData.dailyData).length > 0 ? (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {Object.entries(reportData.dailyData)
                .slice(-10)
                .map(([day, data]) => {
                  const dayTotal = data.income + data.expense;
                  const dayBalance = data.income - data.expense;

                  return dayTotal > 0 ? (
                    <div
                      key={day}
                      className="flex items-center gap-4 p-3 rounded-xl bg-gray-50"
                    >
                      <div className="w-8 text-center text-sm font-medium text-gray-600">
                        {day}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-green-600">
                            ฿{data.income.toLocaleString()}
                          </span>
                          <span className="text-red-600">
                            ฿{data.expense.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-400 h-2 rounded-l-full"
                            style={{
                              width: `${
                                dayTotal > 0
                                  ? (data.income / dayTotal) * 100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div
                        className={`text-sm font-semibold ${
                          dayBalance >= 0 ? "text-blue-600" : "text-red-600"
                        }`}
                      >
                        {dayBalance >= 0 ? "+" : ""}฿
                        {dayBalance.toLocaleString()}
                      </div>
                    </div>
                  ) : null;
                })}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-xl bg-green-50 border border-green-200">
                  <div className="text-2xl font-bold text-green-600">
                    {
                      reportData.filteredTransactions.filter(
                        (t) => t.type === "income"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-gray-600">รายการรายรับ</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-red-50 border border-red-200">
                  <div className="text-2xl font-bold text-red-600">
                    {
                      reportData.filteredTransactions.filter(
                        (t) => t.type === "expense"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-gray-600">รายการรายจ่าย</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-800 mb-2">
                    อัตราการออม
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    {reportData.income > 0
                      ? (
                          (reportData.balance / reportData.income) *
                          100
                        ).toFixed(1)
                      : "0"}
                    %
                  </div>
                  <div className="mt-3 w-full bg-blue-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(
                            100,
                            reportData.income > 0
                              ? (reportData.balance / reportData.income) * 100
                              : 0
                          )
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg border border-purple-100">
        <h3 className="text-xl font-semibold text-purple-800 mb-4 flex items-center gap-2">
          <Target className="text-purple-600" size={24} />
          คำแนะนำการเงิน
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportData.balance < 0 && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
              <AlertTriangle
                className="text-red-500 flex-shrink-0 mt-1"
                size={20}
              />
              <div>
                <div className="font-medium text-red-800">ควรลดรายจ่าย</div>
                <div className="text-sm text-red-600 mt-1">
                  รายจ่ายเกินรายรับ ควรทบทวนการใช้เงิน
                </div>
              </div>
            </div>
          )}

          {reportData.income > 0 &&
            (reportData.balance / reportData.income) * 100 < 10 && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                <Info
                  className="text-yellow-500 flex-shrink-0 mt-1"
                  size={20}
                />
                <div>
                  <div className="font-medium text-yellow-800">เพิ่มการออม</div>
                  <div className="text-sm text-yellow-600 mt-1">
                    ควรออมอย่างน้อย 10% ของรายรับ
                  </div>
                </div>
              </div>
            )}

          {reportData.income > 0 &&
            (reportData.balance / reportData.income) * 100 >= 20 && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
                <CheckCircle
                  className="text-green-500 flex-shrink-0 mt-1"
                  size={20}
                />
                <div>
                  <div className="font-medium text-green-800">ดีเยี่ยม!</div>
                  <div className="text-sm text-green-600 mt-1">
                    คุณมีการออมที่ดี สามารถพิจารณาลงทุนเพิ่มเติม
                  </div>
                </div>
              </div>
            )}

          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
            <Info className="text-blue-500 flex-shrink-0 mt-1" size={20} />
            <div>
              <div className="font-medium text-blue-800">
                ติดตามอย่างสม่ำเสมอ
              </div>
              <div className="text-sm text-blue-600 mt-1">
                บันทึกรายรับ-รายจ่ายทุกวันเพื่อควบคุมการเงิน
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
