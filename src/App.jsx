// App.jsx - Final Updated Version
import React, { useState, useEffect } from "react";

// Import Components
import AnimatedBackground from "./components/AnimatedBackground";
import LoadingSpinner from "./components/LoadingSpinner";
import Notification from "./components/Notification";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import AddTransaction from "./pages/AddTransaction";
import TransactionList from "./pages/TransactionList";
import Report from "./pages/Report";

// Import Custom Hooks and Utils
import { useTransactions } from "./hooks/useFirestore";
import { formatThaiDate, getRelativeTime } from "./utils/dateUtils";

const App = () => {
  // Main States
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Theme and Language States
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("expense-tracker-theme") || "light";
  });
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("expense-tracker-language") || "th";
  });

  // Use custom hook for transactions
  const {
    transactions,
    loading: isLoading,
    error,
    totals,
    addTransaction: addTransactionHook,
    editTransaction: editTransactionHook,
    removeTransaction: removeTransactionHook,
  } = useTransactions();

  // Theme toggle function
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("expense-tracker-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Language toggle function
  const toggleLanguage = () => {
    const newLanguage = language === "th" ? "en" : "th";
    setLanguage(newLanguage);
    localStorage.setItem("expense-tracker-language", newLanguage);
  };

  // Apply theme on component mount and change
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Enhanced transaction functions with notifications
  const addTransaction = async (transactionData) => {
    try {
      const result = await addTransactionHook(transactionData);

      if (result.success) {
        showNotification(
          language === "th"
            ? "เพิ่มรายการสำเร็จ! 🎉"
            : "Transaction added successfully! 🎉",
          "success"
        );
      } else {
        showNotification(
          language === "th"
            ? "เกิดข้อผิดพลาดในการเพิ่มรายการ"
            : "Error adding transaction",
          "error"
        );
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      showNotification(
        language === "th"
          ? "เกิดข้อผิดพลาดในการเพิ่มรายการ"
          : "Error adding transaction",
        "error"
      );
    }
  };

  const editTransaction = async (transactionId, updatedData) => {
    try {
      const result = await editTransactionHook(transactionId, updatedData);

      if (result.success) {
        showNotification(
          language === "th"
            ? "แก้ไขรายการสำเร็จ! ✅"
            : "Transaction updated successfully! ✅",
          "success"
        );
      } else {
        showNotification(
          language === "th"
            ? "เกิดข้อผิดพลาดในการแก้ไขรายการ"
            : "Error updating transaction",
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      showNotification(
        language === "th"
          ? "เกิดข้อผิดพลาดในการแก้ไขรายการ"
          : "Error updating transaction",
        "error"
      );
    }
  };

  const deleteTransaction = async (transactionId) => {
    // Find transaction for confirmation message
    const transaction = transactions.find((t) => t.id === transactionId);
    const confirmMessage = transaction
      ? language === "th"
        ? `คุณแน่ใจหรือไม่ที่จะลบรายการ "${
            transaction.title
          }" จำนวน ฿${transaction.amount.toLocaleString()}?`
        : `Are you sure you want to delete "${
            transaction.title
          }" for ฿${transaction.amount.toLocaleString()}?`
      : language === "th"
      ? "คุณแน่ใจหรือไม่ที่จะลบรายการนี้?"
      : "Are you sure you want to delete this transaction?";

    if (window.confirm(confirmMessage)) {
      try {
        const result = await removeTransactionHook(transactionId);

        if (result.success) {
          showNotification(
            language === "th"
              ? "ลบรายการสำเร็จ! 🗑️"
              : "Transaction deleted successfully! 🗑️",
            "success"
          );
        } else {
          showNotification(
            language === "th"
              ? "เกิดข้อผิดพลาดในการลบรายการ"
              : "Error deleting transaction",
            "error"
          );
        }
      } catch (error) {
        console.error("Error deleting transaction:", error);
        showNotification(
          language === "th"
            ? "เกิดข้อผิดพลาดในการลบรายการ"
            : "Error deleting transaction",
          "error"
        );
      }
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ message, type, timestamp: Date.now() });
  };

  // Hide notification
  const hideNotification = () => {
    setNotification(null);
  };

  // Handle error from useTransactions hook
  useEffect(() => {
    if (error) {
      console.error("Firebase error:", error);
      showNotification(
        language === "th"
          ? "เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล"
          : "Database connection error",
        "error"
      );
    }
  }, [error, language]);

  // Close mobile menu when clicking outside or changing page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Render current page based on route
  const renderCurrentPage = () => {
    const pageProps = {
      transactions,
      totals,
      isLoading,
      formatThaiDate,
      getRelativeTime,
      theme,
      language,
    };

    switch (currentPage) {
      case "dashboard":
        return <Dashboard {...pageProps} />;

      case "add-transaction":
        return (
          <AddTransaction
            onAddTransaction={addTransaction}
            isLoading={isLoading}
            theme={theme}
            language={language}
          />
        );

      case "transactions":
        return (
          <TransactionList
            transactions={transactions}
            onEditTransaction={editTransaction}
            onDeleteTransaction={deleteTransaction}
            isLoading={isLoading}
            theme={theme}
            language={language}
          />
        );

      case "report":
        return (
          <Report
            transactions={transactions}
            totals={totals}
            formatThaiDate={formatThaiDate}
            theme={theme}
            language={language}
          />
        );

      case "settings":
        return (
          <div
            className={`p-6 ${
              theme === "dark" ? "text-gray-100" : "text-gray-900"
            }`}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent mb-6">
              {language === "th" ? "การตั้งค่า" : "Settings"}
            </h1>
            <div
              className={`${
                theme === "dark" ? "bg-gray-800/80" : "bg-white/80"
              } backdrop-blur-sm rounded-2xl p-8 shadow-lg border ${
                theme === "dark" ? "border-gray-700/50" : "border-white/20"
              }`}
            >
              <p
                className={`text-center ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {language === "th"
                  ? "หน้าการตั้งค่ากำลังพัฒนา..."
                  : "Settings page is under development..."}
              </p>
            </div>
          </div>
        );

      default:
        return <Dashboard {...pageProps} />;
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-white via-gray-50 to-gray-100"
      }`}
    >
      {/* Animated Background */}
      <AnimatedBackground theme={theme} />

      {/* Loading Spinner */}
      {isLoading && <LoadingSpinner theme={theme} />}

      {/* Notification */}
      {notification && (
        <Notification
          key={notification.timestamp} // Force re-render for each notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
          theme={theme}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        theme={theme}
        toggleTheme={toggleTheme}
        language={language}
        toggleLanguage={toggleLanguage}
      />

      {/* Header */}
      <Header
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        totals={totals}
        currentPage={currentPage}
        theme={theme}
        language={language}
      />

      {/* Main Content */}
      <main className="lg:ml-80 pt-20">
        {/* Error Boundary for Pages */}
        <ErrorBoundary theme={theme} language={language}>
          {renderCurrentPage()}
        </ErrorBoundary>
      </main>

      {/* Debug Info (Development Only) */}
      {process.env.NODE_ENV === "development" && (
        <DebugPanel
          transactions={transactions}
          totals={totals}
          isLoading={isLoading}
          error={error}
          theme={theme}
          language={language}
        />
      )}
    </div>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Page Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const { theme, language } = this.props;

      return (
        <div className="flex items-center justify-center min-h-[400px] p-6">
          <div
            className={`text-center p-8 ${
              theme === "dark" ? "bg-gray-800/80" : "bg-white/80"
            } backdrop-blur-sm rounded-2xl shadow-lg border ${
              theme === "dark" ? "border-gray-700/50" : "border-white/20"
            } max-w-md w-full`}
          >
            <div className="text-6xl mb-4">😵</div>
            <h2
              className={`text-xl font-bold mb-2 ${
                theme === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {language === "th" ? "เกิดข้อผิดพลาด" : "Something went wrong"}
            </h2>
            <p
              className={`mb-4 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {language === "th"
                ? "กรุณาลองรีเฟรชหน้าเว็บใหม่"
                : "Please try refreshing the page"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              {language === "th" ? "รีเฟรชหน้าเว็บ" : "Refresh Page"}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Debug Panel Component (Development Only)
const DebugPanel = ({
  transactions,
  totals,
  isLoading,
  error,
  theme,
  language,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 ${
          theme === "dark"
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white p-3 rounded-full shadow-lg transition-colors z-50`}
        title="Debug Panel"
      >
        🐛
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-4 right-4 ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      } rounded-lg shadow-2xl p-4 max-w-sm z-50 border`}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className={`font-bold text-blue-600`}>Debug Panel</h3>
        <button
          onClick={() => setIsOpen(false)}
          className={`${
            theme === "dark"
              ? "text-gray-400 hover:text-gray-200"
              : "text-gray-500 hover:text-gray-700"
          } transition-colors`}
        >
          ✕
        </button>
      </div>

      <div
        className={`space-y-2 text-xs ${
          theme === "dark" ? "text-gray-300" : "text-gray-700"
        }`}
      >
        <div>
          <strong>Theme:</strong> {theme}
        </div>
        <div>
          <strong>Language:</strong> {language}
        </div>
        <div>
          <strong>Loading:</strong> {isLoading ? "Yes" : "No"}
        </div>
        <div>
          <strong>Transactions:</strong> {transactions.length}
        </div>
        <div>
          <strong>Total Income:</strong> ฿{totals.income.toLocaleString()}
        </div>
        <div>
          <strong>Total Expense:</strong> ฿{totals.expense.toLocaleString()}
        </div>
        <div>
          <strong>Balance:</strong> ฿{totals.balance.toLocaleString()}
        </div>
        {error && (
          <div className="text-red-500">
            <strong>Error:</strong> {error.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
