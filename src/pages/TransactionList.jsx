// pages/TransactionList.jsx
import React, { useState, useMemo } from "react";
import {
  Edit3,
  Trash2,
  Save,
  X,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Calendar,
  FileText,
  DollarSign,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Download,
} from "lucide-react";

const TransactionList = ({
  transactions,
  onEditTransaction,
  onDeleteTransaction,
  isLoading,
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

  // Filter and sort transactions
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

    // Sort transactions
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
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [transactions, searchTerm, filterType, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handle edit
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

  // Handle delete
  const handleDelete = (transactionId) => {
    onDeleteTransaction(transactionId);
  };

  // Handle sort
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
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">รายละเอียดรายการ</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
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
                <p className="font-semibold text-gray-800">
                  {transaction.title}
                </p>
                {transaction.category && (
                  <p className="text-sm text-gray-500">
                    {transaction.category}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {new Date(transaction.date).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
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
              <h4 className="font-medium text-gray-700 mb-2">หมายเหตุ</h4>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-xl">
                {transaction.description}
              </p>
            </div>
          )}

          <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-100">
            รายการนี้ถูกสร้างเมื่อ{" "}
            {transaction.createdAt
              ? new Date(transaction.createdAt).toLocaleDateString("th-TH")
              : "ไม่ทราบ"}
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
            รายการทั้งหมด
          </h1>
          <p className="text-gray-600 mt-2">จัดการและดูประวัติรายรับ-รายจ่าย</p>
        </div>

        <div className="flex items-center gap-3">
          {/* <button className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors">
            <Download size={18} />
            Export
          </button> */}
          <div className="text-sm text-gray-500">
            {filteredTransactions.length} รายการ
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="ค้นหารายการ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none transition-all bg-white/50"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none bg-white/50"
          >
            <option value="all">ทุกประเภท</option>
            <option value="income">รายรับ</option>
            <option value="expense">รายจ่าย</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none bg-white/50"
          >
            <option value="date">เรียงตามวันที่</option>
            <option value="amount">เรียงตามจำนวน</option>
            <option value="title">เรียงตามชื่อ</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all bg-white/50"
          >
            <ArrowUpDown size={18} />
            {sortOrder === "asc" ? "น้อย → มาก" : "มาก → น้อย"}
          </button>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  <button
                    onClick={() => handleSort("type")}
                    className="flex items-center gap-1 hover:text-red-600 transition-colors"
                  >
                    ประเภท
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  <button
                    onClick={() => handleSort("title")}
                    className="flex items-center gap-1 hover:text-red-600 transition-colors"
                  >
                    รายละเอียด
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  <button
                    onClick={() => handleSort("amount")}
                    className="flex items-center gap-1 hover:text-red-600 transition-colors"
                  >
                    จำนวนเงิน
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  <button
                    onClick={() => handleSort("date")}
                    className="flex items-center gap-1 hover:text-red-600 transition-colors"
                  >
                    วันที่
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((transaction, index) => (
                <tr
                  key={transaction.id}
                  className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${
                    index % 2 === 0 ? "bg-white/30" : "bg-gray-50/30"
                  }`}
                >
                  <td className="px-6 py-4">
                    {editingTransaction === transaction.id ? (
                      <div className="flex gap-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="editType"
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
                            className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 cursor-pointer transition-all ${
                              editFormData.type === "income"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500 hover:bg-green-50"
                            }`}
                          >
                            <TrendingUp size={14} />
                            รายรับ
                          </div>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="editType"
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
                            className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 cursor-pointer transition-all ${
                              editFormData.type === "expense"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-500 hover:bg-red-50"
                            }`}
                          >
                            <TrendingDown size={14} />
                            รายจ่าย
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
                        {transaction.type === "income" ? "รายรับ" : "รายจ่าย"}
                      </span>
                    )}
                  </td>

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
                          className="w-full px-3 py-1 rounded-lg border border-gray-200 focus:border-red-400 outline-none"
                        />
                        {editFormData.category && (
                          <input
                            type="text"
                            value={editFormData.category}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                category: e.target.value,
                              })
                            }
                            placeholder="หมวดหมู่"
                            className="w-full px-3 py-1 text-sm rounded-lg border border-gray-200 focus:border-red-400 outline-none"
                          />
                        )}
                      </div>
                    ) : (
                      <div>
                        <span className="font-medium text-gray-800">
                          {transaction.title}
                        </span>
                        {transaction.category && (
                          <p className="text-sm text-gray-500">
                            {transaction.category}
                          </p>
                        )}
                      </div>
                    )}
                  </td>

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
                        className="w-full px-3 py-1 rounded-lg border border-gray-200 focus:border-red-400 outline-none"
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
                        className="px-3 py-1 rounded-lg border border-gray-200 focus:border-red-400 outline-none"
                      />
                    ) : (
                      <span className="text-gray-600">
                        {new Date(transaction.date).toLocaleDateString("th-TH")}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {editingTransaction === transaction.id ? (
                        <>
                          <button
                            onClick={handleSaveEdit}
                            disabled={isLoading}
                            className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors disabled:opacity-50"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setSelectedTransaction(transaction)}
                            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                            title="ดูรายละเอียด"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors"
                            title="แก้ไข"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                            title="ลบ"
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
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="text-gray-400" size={24} />
              </div>
              <p className="text-gray-500 font-medium">
                ไม่พบรายการที่ตรงกับการค้นหา
              </p>
              <p className="text-sm text-gray-400 mt-1">
                ลองเปลี่ยนเงื่อนไขการค้นหา
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              แสดง {startIndex + 1}-
              {Math.min(startIndex + itemsPerPage, filteredTransactions.length)}{" "}
              จาก {filteredTransactions.length} รายการ
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
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
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
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
