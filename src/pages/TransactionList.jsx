import React, { useState, useMemo } from "react";
import {
  Edit3,
  Trash2,
  Save,
  X,
  TrendingUp,
  TrendingDown,
  Search,
  FileText,
  DollarSign,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Download,
} from "lucide-react";

// Bilingual + Theme-aware TransactionList
// Props kept intact and extended: transactions, onEditTransaction, onDeleteTransaction, isLoading
// Added: language ("th" | "en"), theme ("light" | "dark")
const TransactionList = ({
  transactions,
  onEditTransaction,
  onDeleteTransaction,
  isLoading,
  language = "th",
  theme = "light",
}) => {
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const itemsPerPage = 10;

  // i18n helper
  const t = (th, en) => (language === "th" ? th : en);

  // Filter & sort
  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter((transaction) => {
      const matchesSearch =
        transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterType === "all" || transaction.type === filterType;
      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "date":
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case "amount":
          aValue = a.amount;
          bValue = b.amount;
          break;
        case "title":
          aValue = (a.title || "").toLowerCase();
          bValue = (b.title || "").toLowerCase();
          break;
        case "type":
          aValue = a.type || "";
          bValue = b.type || "";
          break;
        default:
          return 0;
      }
      if (sortOrder === "asc") return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });

    return filtered;
  }, [transactions, searchTerm, filterType, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handlers
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction.id);
    setEditFormData({ ...transaction });
  };

  const handleSaveEdit = async () => {
    await onEditTransaction(editingTransaction, editFormData);
    setEditingTransaction(null);
    setEditFormData({});
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
    setEditFormData({});
  };

  const handleDelete = (transactionId) => {
    onDeleteTransaction(transactionId);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Transaction Detail Modal
  const TransactionModal = ({ transaction, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800"
        } rounded-3xl max-w-md w-full p-6 shadow-2xl`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">
            {t("รายละเอียดรายการ", "Transaction Details")}
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              theme === "dark"
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-black text-white hover:bg-gray-700"
            }`}
            aria-label={t("ปิดหน้าต่าง", "Close")}
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div
            className={`p-4 rounded-2xl ${
              transaction.type === "income"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`p-2 rounded-xl ${
                  transaction.type === "income"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {transaction.type === "income" ? (
                  <TrendingUp size={20} />
                ) : (
                  <TrendingDown size={20} />
                )}
              </div>
              <div>
                <p className="font-semibold">{transaction.title}</p>
                {transaction.category && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {transaction.category}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(transaction.date).toLocaleDateString(
                  language === "th" ? "th-TH" : "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              </span>
              <span
                className={`text-2xl font-bold ${
                  transaction.type === "income"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}฿
                {transaction.amount.toLocaleString()}
              </span>
            </div>
          </div>

          {transaction.description && (
            <div>
              <h4 className="font-medium mb-2">{t("หมายเหตุ", "Notes")}</h4>
              <p className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
                {transaction.description}
              </p>
            </div>
          )}

          <div className="text-xs text-center pt-2 border-t border-gray-100 dark:border-gray-700">
            {t("รายการนี้ถูกสร้างเมื่อ", "Created on")}{" "}
            {transaction.createdAt
              ? new Date(transaction.createdAt).toLocaleDateString(
                  language === "th" ? "th-TH" : "en-US"
                )
              : t("ไม่ทราบ", "Unknown")}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
            {t("รายการทั้งหมด", "All Transactions")}
          </h1>
          <p
            className={`${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            } mt-2`}
          >
            {t(
              "จัดการและดูประวัติรายรับ-รายจ่าย",
              "Manage and view income-expense history"
            )}
          </p>
        </div>

        <div
          className={`${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          } text-sm`}
        >
          {filteredTransactions.length} {t("รายการ", "items")}
        </div>
      </div>

      {/* Filters & Search */}
      <div
        className={`${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800"
        } backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder={t("ค้นหารายการ...", "Search transactions...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none transition-all ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 placeholder:text-gray-400"
                  : "bg-white border-gray-200"
              }`}
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={`px-4 py-3 rounded-xl border focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <option value="all">{t("ทุกประเภท", "All Types")}</option>
            <option value="income">{t("รายรับ", "Income")}</option>
            <option value="expense">{t("รายจ่าย", "Expense")}</option>
          </select>

          {/* Sort Field */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-4 py-3 rounded-xl border focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <option value="date">{t("เรียงตามวันที่", "Sort by Date")}</option>
            <option value="amount">
              {t("เรียงตามจำนวน", "Sort by Amount")}
            </option>
            <option value="title">{t("เรียงตามชื่อ", "Sort by Title")}</option>
            <option value="type">{t("เรียงตามประเภท", "Sort by Type")}</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                : "bg-white border-gray-200 hover:bg-red-50"
            }`}
          >
            <ArrowUpDown size={18} />
            {sortOrder === "asc"
              ? t("น้อย → มาก", "Low → High")
              : t("มาก → น้อย", "High → Low")}
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        className={`${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800"
        } backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className={`${
                  theme === "dark"
                    ? "bg-gray-800 border-b border-gray-700"
                    : "bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100"
                }`}
              >
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  <button
                    onClick={() => handleSort("type")}
                    className="flex items-center gap-1"
                  >
                    {t("ประเภท", "Type")} <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  <button
                    onClick={() => handleSort("title")}
                    className="flex items-center gap-1"
                  >
                    {t("รายละเอียด", "Details")} <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  <button
                    onClick={() => handleSort("amount")}
                    className="flex items-center gap-1"
                  >
                    {t("จำนวนเงิน", "Amount")} <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  <button
                    onClick={() => handleSort("date")}
                    className="flex items-center gap-1"
                  >
                    {t("วันที่", "Date")} <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold">
                  {t("การจัดการ", "Actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((transaction, index) => (
                <tr
                  key={transaction.id}
                  className={`${
                    index % 2 === 0
                      ? theme === "dark"
                        ? "bg-gray-800"
                        : "bg-white/30"
                      : theme === "dark"
                      ? "bg-gray-700"
                      : "bg-gray-50/30"
                  } border-b ${
                    theme === "dark" ? "border-gray-700" : "border-gray-100"
                  } transition-colors`}
                >
                  {/* Type */}
                  <td className="px-6 py-4">
                    {editingTransaction === transaction.id ? (
                      <div className="flex gap-2">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name={`editType-${transaction.id}`}
                            value="income"
                            checked={editFormData.type === "income"}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                type: e.target.value,
                              })
                            }
                            className="sr-only"
                          />
                          <div
                            className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-all ${
                              editFormData.type === "income"
                                ? "bg-green-100 text-green-700"
                                : theme === "dark"
                                ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                                : "bg-gray-100 text-gray-500 hover:bg-green-50"
                            }`}
                          >
                            <TrendingUp size={14} />
                            {t("รายรับ", "Income")}
                          </div>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name={`editType-${transaction.id}`}
                            value="expense"
                            checked={editFormData.type === "expense"}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                type: e.target.value,
                              })
                            }
                            className="sr-only"
                          />
                          <div
                            className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-all ${
                              editFormData.type === "expense"
                                ? "bg-red-100 text-red-700"
                                : theme === "dark"
                                ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                                : "bg-gray-100 text-gray-500 hover:bg-red-50"
                            }`}
                          >
                            <TrendingDown size={14} />
                            {t("รายจ่าย", "Expense")}
                          </div>
                        </label>
                      </div>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium ${
                          transaction.type === "income"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <TrendingUp size={14} />
                        ) : (
                          <TrendingDown size={14} />
                        )}
                        {transaction.type === "income"
                          ? t("รายรับ", "Income")
                          : t("รายจ่าย", "Expense")}
                      </span>
                    )}
                  </td>

                  {/* Details */}
                  <td className="px-6 py-4">
                    {editingTransaction === transaction.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editFormData.title}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              title: e.target.value,
                            })
                          }
                          className={`w-full px-3 py-1 rounded-lg border outline-none ${
                            theme === "dark"
                              ? "bg-gray-800 border-gray-700"
                              : "bg-white border-gray-200"
                          } focus:border-red-400`}
                        />
                        {typeof editFormData.category !== "undefined" && (
                          <input
                            type="text"
                            value={editFormData.category || ""}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                category: e.target.value,
                              })
                            }
                            placeholder={t("หมวดหมู่", "Category")}
                            className={`w-full px-3 py-1 text-sm rounded-lg border outline-none ${
                              theme === "dark"
                                ? "bg-gray-800 border-gray-700"
                                : "bg-white border-gray-200"
                            } focus:border-red-400`}
                          />
                        )}
                      </div>
                    ) : (
                      <div>
                        <span className="font-medium">{transaction.title}</span>
                        {transaction.category && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.category}
                          </p>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4">
                    {editingTransaction === transaction.id ? (
                      <input
                        type="number"
                        value={editFormData.amount}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            amount: parseFloat(e.target.value),
                          })
                        }
                        className={`w-full px-3 py-1 rounded-lg border outline-none ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700"
                            : "bg-white border-gray-200"
                        } focus:border-red-400`}
                        step="0.01"
                      />
                    ) : (
                      <span
                        className={`text-lg font-semibold ${
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}฿
                        {transaction.amount.toLocaleString()}
                      </span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4">
                    {editingTransaction === transaction.id ? (
                      <input
                        type="date"
                        value={editFormData.date}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            date: e.target.value,
                          })
                        }
                        className={`px-3 py-1 rounded-lg border outline-none ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700"
                            : "bg-white border-gray-200"
                        } focus:border-red-400`}
                      />
                    ) : (
                      <span
                        className={
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }
                      >
                        {new Date(transaction.date).toLocaleDateString(
                          language === "th" ? "th-TH" : "en-US"
                        )}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {editingTransaction === transaction.id ? (
                        <>
                          <button
                            onClick={handleSaveEdit}
                            disabled={isLoading}
                            className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 disabled:opacity-50"
                            title={t("บันทึก", "Save")}
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                            title={t("ยกเลิก", "Cancel")}
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setSelectedTransaction(transaction)}
                            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                            title={t("ดูรายละเอียด", "View details")}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                            title={t("แก้ไข", "Edit")}
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                            title={t("ลบ", "Delete")}
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedTransactions.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="text-gray-400" size={24} />
              </div>
              <p
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-gray-500"
                } font-medium`}
              >
                {t(
                  "ไม่พบรายการที่ตรงกับการค้นหา",
                  "No transactions match your search"
                )}
              </p>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-500" : "text-gray-400"
                } mt-1`}
              >
                {t(
                  "ลองเปลี่ยนเงื่อนไขการค้นหา",
                  "Try changing your filters or search term"
                )}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <div
            className={`flex items-center justify-between px-6 py-4 border-t ${
              theme === "dark" ? "border-gray-700" : "border-gray-100"
            }`}
          >
            <div
              className={`${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              } text-sm`}
            >
              {t("แสดง", "Showing")}{" "}
              {filteredTransactions.length === 0 ? 0 : startIndex + 1}-
              {Math.min(startIndex + itemsPerPage, filteredTransactions.length)}{" "}
              {t("จาก", "of")} {filteredTransactions.length}{" "}
              {t("รายการ", "items")}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  theme === "dark"
                    ? "border-gray-700 hover:bg-gray-800"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                aria-label={t("ก่อนหน้า", "Previous")}
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-red-500 text-white"
                          : theme === "dark"
                          ? "text-gray-300 hover:bg-gray-800"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  theme === "dark"
                    ? "border-gray-700 hover:bg-gray-800"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                aria-label={t("ถัดไป", "Next")}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedTransaction && (
        <TransactionModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
};

export default TransactionList;
