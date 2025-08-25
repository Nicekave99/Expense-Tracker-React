// src/hooks/useFirestore.js - Updated with User Authentication
import { useState, useEffect } from "react";
import { database } from "../config/firebase";
import { ref, onValue, push, set, remove, update } from "firebase/database";
import { useAuth } from "../contexts/AuthContext";

/**
 * Custom hook สำหรับจัดการข้อมูล Firebase Realtime Database (รองรับ user-specific paths)
 */
export const useFirestore = (collectionPath, requireAuth = true) => {
  const { currentUser, getUserPath } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Build full path with user context
  const fullPath =
    requireAuth && currentUser
      ? getUserPath(collectionPath) // users/{userId}/{collectionPath}
      : collectionPath; // direct path (for public data)

  // Listen to data changes
  useEffect(() => {
    // Don't fetch if requireAuth is true but user is not authenticated
    if (requireAuth && !currentUser) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }

    if (!fullPath) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }

    const dataRef = ref(database, fullPath);

    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        try {
          const snapshotData = snapshot.val();
          if (snapshotData) {
            const dataList = Object.keys(snapshotData).map((key) => ({
              id: key,
              ...snapshotData[key],
            }));
            // Sort by createdAt descending (newest first)
            dataList.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setData(dataList);
          } else {
            setData([]);
          }
          setError(null);
        } catch (err) {
          setError(err);
          console.error("Error fetching data:", err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(err);
        setLoading(false);
        console.error("Database error:", err);
      }
    );

    return () => unsubscribe();
  }, [fullPath, currentUser, requireAuth]);

  // Add new document
  const addDocument = async (document) => {
    if (requireAuth && !currentUser) {
      return { success: false, error: "User not authenticated" };
    }

    if (!fullPath) {
      return { success: false, error: "Invalid path" };
    }

    try {
      setLoading(true);
      const collectionRef = ref(database, fullPath);
      const newDocRef = await push(collectionRef, {
        ...document,
        userId: currentUser?.uid, // Add userId for reference
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Update user stats if this is a transaction
      if (collectionPath === "transactions" && currentUser) {
        await updateUserStats(document.type, document.amount, "add");
      }

      return { success: true, id: newDocRef.key };
    } catch (err) {
      setError(err);
      console.error("Error adding document:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update existing document
  const updateDocument = async (documentId, updates) => {
    if (requireAuth && !currentUser) {
      return { success: false, error: "User not authenticated" };
    }

    if (!fullPath) {
      return { success: false, error: "Invalid path" };
    }

    try {
      setLoading(true);
      const documentRef = ref(database, `${fullPath}/${documentId}`);

      // Get original document for stats update
      const originalDoc = data.find((d) => d.id === documentId);

      await update(documentRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });

      // Update user stats if this is a transaction and amount/type changed
      if (collectionPath === "transactions" && currentUser && originalDoc) {
        if (
          originalDoc.amount !== updates.amount ||
          originalDoc.type !== updates.type
        ) {
          // Remove old stats
          await updateUserStats(originalDoc.type, originalDoc.amount, "remove");
          // Add new stats
          await updateUserStats(
            updates.type || originalDoc.type,
            updates.amount || originalDoc.amount,
            "add"
          );
        }
      }

      return { success: true };
    } catch (err) {
      setError(err);
      console.error("Error updating document:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete document
  const deleteDocument = async (documentId) => {
    if (requireAuth && !currentUser) {
      return { success: false, error: "User not authenticated" };
    }

    if (!fullPath) {
      return { success: false, error: "Invalid path" };
    }

    try {
      setLoading(true);

      // Get document data for stats update
      const documentToDelete = data.find((d) => d.id === documentId);

      const documentRef = ref(database, `${fullPath}/${documentId}`);
      await remove(documentRef);

      // Update user stats if this is a transaction
      if (
        collectionPath === "transactions" &&
        currentUser &&
        documentToDelete
      ) {
        await updateUserStats(
          documentToDelete.type,
          documentToDelete.amount,
          "remove"
        );
      }

      return { success: true };
    } catch (err) {
      setError(err);
      console.error("Error deleting document:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Set entire document (overwrite)
  const setDocument = async (documentId, document) => {
    if (requireAuth && !currentUser) {
      return { success: false, error: "User not authenticated" };
    }

    if (!fullPath) {
      return { success: false, error: "Invalid path" };
    }

    try {
      setLoading(true);
      const documentRef = ref(database, `${fullPath}/${documentId}`);
      await set(documentRef, {
        ...document,
        userId: currentUser?.uid,
        createdAt: document.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (err) {
      setError(err);
      console.error("Error setting document:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Helper function to update user stats
  const updateUserStats = async (type, amount, operation) => {
    if (!currentUser) return;

    try {
      const userStatsRef = ref(
        database,
        `users/${currentUser.uid}/profile/stats`
      );
      const currentStats = data.reduce(
        (acc, transaction) => {
          if (transaction.type === "income")
            acc.totalIncome += transaction.amount;
          if (transaction.type === "expense")
            acc.totalExpense += transaction.amount;
          acc.totalTransactions += 1;
          return acc;
        },
        { totalIncome: 0, totalExpense: 0, totalTransactions: 0 }
      );

      // Adjust stats based on operation
      let adjustment = operation === "add" ? amount : -amount;

      if (type === "income") {
        currentStats.totalIncome += adjustment;
      } else if (type === "expense") {
        currentStats.totalExpense += adjustment;
      }

      currentStats.totalTransactions += operation === "add" ? 1 : -1;

      await update(userStatsRef, currentStats);
    } catch (error) {
      console.error("Error updating user stats:", error);
    }
  };

  return {
    data,
    loading,
    error,
    addDocument,
    updateDocument,
    deleteDocument,
    setDocument,
    path: fullPath, // Expose the full path for debugging
  };
};

/**
 * Custom hook สำหรับ transactions เฉพาะ (Updated for user-specific data)
 */
export const useTransactions = () => {
  const { currentUser } = useAuth();

  const {
    data: transactions,
    loading,
    error,
    addDocument,
    updateDocument,
    deleteDocument,
  } = useFirestore("transactions", true); // requireAuth = true

  // Helper functions for transactions
  const addTransaction = async (transactionData) => {
    return await addDocument(transactionData);
  };

  const editTransaction = async (transactionId, updates) => {
    return await updateDocument(transactionId, updates);
  };

  const removeTransaction = async (transactionId) => {
    return await deleteDocument(transactionId);
  };

  // Calculate totals (only for current user's transactions)
  const totals = {
    income: transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + (t.amount || 0), 0),
    expense: transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + (t.amount || 0), 0),
    balance: 0,
    count: transactions.length,
  };
  totals.balance = totals.income - totals.expense;

  // Get transactions by date range
  const getTransactionsByDateRange = (startDate, endDate) => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return transactionDate >= start && transactionDate <= end;
    });
  };

  // Get transactions by month/year
  const getTransactionsByMonth = (month, year) => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === month &&
        transactionDate.getFullYear() === year
      );
    });
  };

  // Get transactions by type
  const getTransactionsByType = (type) => {
    return transactions.filter((transaction) => transaction.type === type);
  };

  // Get transactions by category
  const getTransactionsByCategory = (category) => {
    return transactions.filter(
      (transaction) => transaction.category === category
    );
  };

  // Get monthly summary (for charts and reports)
  const getMonthlySummary = (months = 6) => {
    const now = new Date();
    const summaries = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthTransactions = getTransactionsByMonth(
        date.getMonth(),
        date.getFullYear()
      );

      const income = monthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      summaries.push({
        month: date.toISOString().substring(0, 7), // YYYY-MM format
        monthName: date.toLocaleDateString("th-TH", {
          month: "long",
          year: "numeric",
        }),
        income,
        expense,
        balance: income - expense,
        transactionCount: monthTransactions.length,
      });
    }

    return summaries;
  };

  // Get category summary
  const getCategorySummary = () => {
    const categoryMap = {};

    transactions.forEach((transaction) => {
      const category = transaction.category || "ไม่ระบุหมวดหมู่";

      if (!categoryMap[category]) {
        categoryMap[category] = {
          name: category,
          income: 0,
          expense: 0,
          count: 0,
        };
      }

      categoryMap[category][transaction.type] += transaction.amount;
      categoryMap[category].count += 1;
    });

    return Object.values(categoryMap)
      .map((cat) => ({
        ...cat,
        total: cat.income + cat.expense,
      }))
      .sort((a, b) => b.total - a.total);
  };

  return {
    transactions,
    loading,
    error,
    totals,
    addTransaction,
    editTransaction,
    removeTransaction,
    getTransactionsByDateRange,
    getTransactionsByMonth,
    getTransactionsByType,
    getTransactionsByCategory,
    getMonthlySummary,
    getCategorySummary,
    // Expose user info for debugging
    currentUser: currentUser?.uid || null,
  };
};

/**
 * Custom hook สำหรับ user categories
 */
export const useCategories = () => {
  const {
    data: categories,
    loading,
    error,
    addDocument,
    updateDocument,
    deleteDocument,
  } = useFirestore("categories", true);

  const addCategory = async (categoryData) => {
    return await addDocument(categoryData);
  };

  const editCategory = async (categoryId, updates) => {
    return await updateDocument(categoryId, updates);
  };

  const removeCategory = async (categoryId) => {
    return await deleteDocument(categoryId);
  };

  const getCategoriesByType = (type) => {
    return categories.filter((category) => category.type === type);
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    editCategory,
    removeCategory,
    getCategoriesByType,
  };
};

/**
 * Custom hook สำหรับ real-time listener เฉพาะ (Updated for user context)
 */
export const useRealtimeListener = (path, requireAuth = false) => {
  const { currentUser, getUserPath } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Build full path with user context if needed
  const fullPath = requireAuth && currentUser ? getUserPath(path) : path;

  useEffect(() => {
    if (requireAuth && !currentUser) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    if (!fullPath) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const dataRef = ref(database, fullPath);

    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        const snapshotData = snapshot.val();
        setData(snapshotData);
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
        console.error(`Error listening to ${fullPath}:`, err);
      }
    );

    return () => unsubscribe();
  }, [fullPath, currentUser, requireAuth]);

  return { data, loading, error };
};
