// pages/AddTransaction.jsx - Updated with Language Support
import React, { useState } from "react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  FileText,
  Save,
  RotateCcw,
  Sparkles,
} from "lucide-react";

const AddTransaction = ({
  onAddTransaction,
  isLoading,
  theme = "light",
  language = "th",
}) => {
  const [formData, setFormData] = useState({
    type: "income",
    title: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Translation object
  const t = {
    th: {
      pageTitle: "เพิ่มรายการใหม่",
      pageSubtitle: "บันทึกรายรับหรือรายจ่ายของคุณ",
      success: "สำเร็จ!",
      successMessage: "เพิ่มรายการเรียบร้อยแล้ว",
      transactionType: "ประเภทรายการ",
      income: "รายรับ",
      incomeDesc: "เงินเข้า",
      expense: "รายจ่าย",
      expenseDesc: "เงินออก",
      details: "รายละเอียด",
      detailsRequired: "รายละเอียด *",
      detailsPlaceholder: "เช่น ค่าอาหารเช้า, เงินเดือน...",
      detailsError: "กรุณาใส่รายละเอียด",
      category: "หมวดหมู่",
      selectCategory: "เลือกหมวดหมู่",
      amount: "จำนวนเงิน",
      amountRequired: "จำนวนเงิน *",
      amountError: "กรุณาใส่จำนวนเงินที่ถูกต้อง",
      date: "วันที่",
      dateRequired: "วันที่ *",
      dateError: "กรุณาเลือกวันที่",
      note: "หมายเหตุ",
      noteOptional: "หมายเหตุ (ไม่บังคับ)",
      notePlaceholder: "เพิ่มรายละเอียดเพิ่มเติม...",
      saveButton: "บันทึกรายการ",
      saving: "กำลังบันทึก...",
      resetButton: "รีเซ็ต",
      tips: "เคล็ดลับ",
      tip1: "ใส่รายละเอียดให้ชัดเจนเพื่อง่ายต่อการค้นหา",
      tip2: "เลือกหมวดหมู่ให้ถูกต้องเพื่อการรายงานที่แม่นยำ",
      tip3: "บันทึกทันทีหลังจากใช้จ่ายเพื่อไม่ให้ลืม",
      preview: "ตัวอย่าง",
      newTransaction: "รายการใหม่",
      categories: {
        income: [
          "เงินเดือน",
          "โบนัส",
          "ค่าจ้างพิเศษ",
          "เงินปันผล",
          "รายได้จากการลงทุน",
          "ขายของ",
          "อื่นๆ",
        ],
        expense: [
          "อาหาร",
          "เครื่องดื่ม",
          "ค่าเดินทาง",
          "ช้อปปิ้ง",
          "ค่าใช้จ่ายในบ้าน",
          "ค่ารักษาพยาบาล",
          "ความบันเทิง",
          "การศึกษา",
          "ประกันภัย",
          "อื่นๆ",
        ],
      },
    },
    en: {
      pageTitle: "Add New Transaction",
      pageSubtitle: "Record your income or expense",
      success: "Success!",
      successMessage: "Transaction added successfully",
      transactionType: "Transaction Type",
      income: "Income",
      incomeDesc: "Money In",
      expense: "Expense",
      expenseDesc: "Money Out",
      details: "Details",
      detailsRequired: "Details *",
      detailsPlaceholder: "e.g., Breakfast, Salary...",
      detailsError: "Please enter details",
      category: "Category",
      selectCategory: "Select Category",
      amount: "Amount",
      amountRequired: "Amount *",
      amountError: "Please enter a valid amount",
      date: "Date",
      dateRequired: "Date *",
      dateError: "Please select a date",
      note: "Note",
      noteOptional: "Note (Optional)",
      notePlaceholder: "Add additional details...",
      saveButton: "Save Transaction",
      saving: "Saving...",
      resetButton: "Reset",
      tips: "Tips",
      tip1: "Enter clear details for easy searching",
      tip2: "Choose the right category for accurate reporting",
      tip3: "Record immediately after spending to avoid forgetting",
      preview: "Preview",
      newTransaction: "New Transaction",
      categories: {
        income: [
          "Salary",
          "Bonus",
          "Freelance",
          "Dividends",
          "Investment Income",
          "Sales",
          "Others",
        ],
        expense: [
          "Food",
          "Beverages",
          "Transportation",
          "Shopping",
          "Household",
          "Healthcare",
          "Entertainment",
          "Education",
          "Insurance",
          "Others",
        ],
      },
    },
  };

  // Get current language translations
  const lang = t[language] || t.th;

  // Predefined categories based on language
  const categories = lang.categories;

  // Quick amount buttons
  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = lang.detailsError;
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = lang.amountError;
    }

    if (!formData.date) {
      newErrors.date = lang.dateError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onAddTransaction({
        ...formData,
        amount: parseFloat(formData.amount),
      });

      // Show success animation
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      // Reset form
      setFormData({
        type: "income",
        title: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        category: "",
        description: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error submitting transaction:", error);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      type: "income",
      title: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      category: "",
      description: "",
    });
    setErrors({});
  };

  // Format currency based on language
  const formatCurrency = (amount) => {
    const currency = language === "th" ? "฿" : "฿";
    return `${currency}${amount.toLocaleString()}`;
  };

  // Format date based on language
  const formatDate = (dateString) => {
    if (!dateString) return lang.date;
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "th" ? "th-TH" : "en-US");
  };

  return (
    <div
      className={`p-6 max-w-4xl mx-auto ${
        theme === "dark" ? "text-white" : "text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-red-500 to-red-400 rounded-2xl shadow-lg">
            <Plus className="text-white" size={28} />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
            {lang.pageTitle}
          </h1>
        </div>
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
          {lang.pageSubtitle}
        </p>
      </div>

      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className={`${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } rounded-2xl p-8 shadow-2xl text-center`}
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="text-green-600" size={24} />
            </div>
            <h3
              className={`text-xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-800"
              } mb-2`}
            >
              {lang.success}
            </h3>
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
              {lang.successMessage}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div
            className={`${
              theme === "dark" ? "bg-gray-800/90" : "bg-white/90"
            } backdrop-blur-sm rounded-3xl p-8 shadow-xl border ${
              theme === "dark" ? "border-gray-700/20" : "border-white/20"
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Transaction Type */}
              <div>
                <label
                  className={`block ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  } font-semibold mb-4`}
                >
                  {lang.transactionType}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="income"
                      checked={formData.type === "income"}
                      onChange={(e) =>
                        handleInputChange("type", e.target.value)
                      }
                      className="sr-only"
                    />
                    <div
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${
                        formData.type === "income"
                          ? "border-green-400 bg-green-50 text-green-700 shadow-lg scale-105"
                          : `border-${
                              theme === "dark" ? "gray-600" : "gray-200"
                            } ${
                              theme === "dark"
                                ? "bg-gray-700 text-gray-300"
                                : "bg-white text-gray-600"
                            } hover:border-green-300 ${
                              theme === "dark"
                                ? "hover:bg-green-900/20"
                                : "hover:bg-green-50/30"
                            }`
                      }`}
                    >
                      <TrendingUp size={24} />
                      <div>
                        <div className="font-semibold">{lang.income}</div>
                        <div className="text-sm opacity-70">
                          {lang.incomeDesc}
                        </div>
                      </div>
                    </div>
                  </label>

                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="expense"
                      checked={formData.type === "expense"}
                      onChange={(e) =>
                        handleInputChange("type", e.target.value)
                      }
                      className="sr-only"
                    />
                    <div
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${
                        formData.type === "expense"
                          ? "border-red-400 bg-red-50 text-red-700 shadow-lg scale-105"
                          : `border-${
                              theme === "dark" ? "gray-600" : "gray-200"
                            } ${
                              theme === "dark"
                                ? "bg-gray-700 text-gray-300"
                                : "bg-white text-gray-600"
                            } hover:border-red-300 ${
                              theme === "dark"
                                ? "hover:bg-red-900/20"
                                : "hover:bg-red-50/30"
                            }`
                      }`}
                    >
                      <TrendingDown size={24} />
                      <div>
                        <div className="font-semibold">{lang.expense}</div>
                        <div className="text-sm opacity-70">
                          {lang.expenseDesc}
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Title */}
              <div>
                <label
                  className={`block ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  } font-semibold mb-2`}
                >
                  {lang.detailsRequired}
                </label>
                <div className="relative">
                  <FileText
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                      theme === "dark" ? "text-gray-500" : "text-gray-400"
                    }`}
                    size={20}
                  />
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 focus:ring-4 outline-none transition-all ${
                      theme === "dark"
                        ? "bg-gray-700/70 text-white"
                        : "bg-white/70 text-gray-900"
                    } ${
                      errors.title
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : `border-${
                            theme === "dark" ? "gray-600" : "gray-200"
                          } focus:border-red-400 focus:ring-red-100`
                    }`}
                    placeholder={lang.detailsPlaceholder}
                  />
                </div>
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label
                  className={`block ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  } font-semibold mb-2`}
                >
                  {lang.category}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className={`w-full px-4 py-4 rounded-2xl border-2 border-${
                    theme === "dark" ? "gray-600" : "gray-200"
                  } focus:border-red-400 focus:ring-4 focus:ring-red-100 outline-none transition-all ${
                    theme === "dark"
                      ? "bg-gray-700/70 text-white"
                      : "bg-white/70 text-gray-900"
                  }`}
                >
                  <option value="">{lang.selectCategory}</option>
                  {categories[formData.type].map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label
                  className={`block ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  } font-semibold mb-2`}
                >
                  {lang.amountRequired}
                </label>
                <div className="relative">
                  <DollarSign
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                      theme === "dark" ? "text-gray-500" : "text-gray-400"
                    }`}
                    size={20}
                  />
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      handleInputChange("amount", e.target.value)
                    }
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 focus:ring-4 outline-none transition-all text-xl font-semibold ${
                      theme === "dark"
                        ? "bg-gray-700/70 text-white"
                        : "bg-white/70 text-gray-900"
                    } ${
                      errors.amount
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : `border-${
                            theme === "dark" ? "gray-600" : "gray-200"
                          } focus:border-red-400 focus:ring-red-100`
                    }`}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                )}

                {/* Quick Amount Buttons */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() =>
                        handleInputChange("amount", amount.toString())
                      }
                      className={`px-4 py-2 ${
                        theme === "dark"
                          ? "bg-gray-700 hover:bg-red-900/30 hover:text-red-400 text-gray-300"
                          : "bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-700"
                      } rounded-xl text-sm font-medium transition-all duration-200`}
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div>
                <label
                  className={`block ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  } font-semibold mb-2`}
                >
                  {lang.dateRequired}
                </label>
                <div className="relative">
                  <Calendar
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                      theme === "dark" ? "text-gray-500" : "text-gray-400"
                    }`}
                    size={20}
                  />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 focus:ring-4 outline-none transition-all ${
                      theme === "dark"
                        ? "bg-gray-700/70 text-white"
                        : "bg-white/70 text-gray-900"
                    } ${
                      errors.date
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : `border-${
                            theme === "dark" ? "gray-600" : "gray-200"
                          } focus:border-red-400 focus:ring-red-100`
                    }`}
                  />
                </div>
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  className={`block ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  } font-semibold mb-2`}
                >
                  {lang.noteOptional}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className={`w-full px-4 py-4 rounded-2xl border-2 border-${
                    theme === "dark" ? "gray-600" : "gray-200"
                  } focus:border-red-400 focus:ring-4 focus:ring-red-100 outline-none transition-all ${
                    theme === "dark"
                      ? "bg-gray-700/70 text-white"
                      : "bg-white/70 text-gray-900"
                  } resize-none`}
                  rows="3"
                  placeholder={lang.notePlaceholder}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-semibold text-white transition-all duration-300 ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-500 to-red-400 hover:from-red-600 hover:to-red-500 hover:shadow-xl hover:scale-105 active:scale-95"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {lang.saving}
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      {lang.saveButton}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className={`px-6 py-4 rounded-2xl border-2 border-${
                    theme === "dark" ? "gray-600" : "gray-200"
                  } ${
                    theme === "dark"
                      ? "text-gray-300 hover:border-gray-500 hover:bg-gray-800"
                      : "text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  } transition-all duration-300 flex items-center gap-2 font-semibold`}
                >
                  <RotateCcw size={20} />
                  {lang.resetButton}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Tips */}
          <div
            className={`${
              theme === "dark"
                ? "bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border-blue-800"
                : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100"
            } rounded-2xl p-6 border`}
          >
            <h3
              className={`text-lg font-semibold ${
                theme === "dark" ? "text-blue-300" : "text-blue-800"
              } mb-4 flex items-center gap-2`}
            >
              <Sparkles
                className={`${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
                size={20}
              />
              {lang.tips}
            </h3>
            <ul
              className={`space-y-3 text-sm ${
                theme === "dark" ? "text-blue-300" : "text-blue-700"
              }`}
            >
              <li className="flex items-start gap-2">
                <div
                  className={`w-1.5 h-1.5 ${
                    theme === "dark" ? "bg-blue-400" : "bg-blue-400"
                  } rounded-full mt-2 flex-shrink-0`}
                ></div>
                <span>{lang.tip1}</span>
              </li>
              <li className="flex items-start gap-2">
                <div
                  className={`w-1.5 h-1.5 ${
                    theme === "dark" ? "bg-blue-400" : "bg-blue-400"
                  } rounded-full mt-2 flex-shrink-0`}
                ></div>
                <span>{lang.tip2}</span>
              </li>
              <li className="flex items-start gap-2">
                <div
                  className={`w-1.5 h-1.5 ${
                    theme === "dark" ? "bg-blue-400" : "bg-blue-400"
                  } rounded-full mt-2 flex-shrink-0`}
                ></div>
                <span>{lang.tip3}</span>
              </li>
            </ul>
          </div>

          {/* Transaction Preview */}
          {(formData.title || formData.amount) && (
            <div
              className={`${
                theme === "dark" ? "bg-gray-800/90" : "bg-white/90"
              } backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${
                theme === "dark" ? "border-gray-700/20" : "border-white/20"
              }`}
            >
              <h3
                className={`text-lg font-semibold ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                } mb-4`}
              >
                {lang.preview}
              </h3>
              <div
                className={`p-4 rounded-2xl border-2 ${
                  formData.type === "income"
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`p-2 rounded-xl ${
                      formData.type === "income"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {formData.type === "income" ? (
                      <TrendingUp size={20} />
                    ) : (
                      <TrendingDown size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {formData.title || lang.newTransaction}
                    </p>
                    {formData.category && (
                      <p className="text-sm text-gray-500">
                        {formData.category}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {formatDate(formData.date)}
                  </span>
                  <span
                    className={`text-lg font-bold ${
                      formData.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formData.type === "income" ? "+" : "-"}
                    {formatCurrency(parseFloat(formData.amount) || 0)}
                  </span>
                </div>
                {formData.description && (
                  <p className="text-sm text-gray-600 mt-2 italic">
                    "{formData.description}"
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;
