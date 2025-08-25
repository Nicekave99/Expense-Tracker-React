// src/hooks/useFirestore.js
import { useState, useEffect } from "react";
import { database } from "../config/firebase";
import { ref, onValue, push, set, remove, update } from "firebase/database";

/**
 * Custom hook สำหรับจัดการข้อมูล Firebase Realtime Database
 */
export const useFirestore = (collectionPath) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen to data changes
  useEffect(() => {
    const dataRef = ref(database, collectionPath);

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
  }, [collectionPath]);

  // Add new document
  const addDocument = async (document) => {
    try {
      setLoading(true);
      const collectionRef = ref(database, collectionPath);
      await push(collectionRef, {
        ...document,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (err) {
      setError(err);
      console.error("Error adding document:", err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Update existing document
  const updateDocument = async (documentId, updates) => {
    try {
      setLoading(true);
      const documentRef = ref(database, `${collectionPath}/${documentId}`);
      await update(documentRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (err) {
      setError(err);
      console.error("Error updating document:", err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Delete document
  const deleteDocument = async (documentId) => {
    try {
      setLoading(true);
      const documentRef = ref(database, `${collectionPath}/${documentId}`);
      await remove(documentRef);
      return { success: true };
    } catch (err) {
      setError(err);
      console.error("Error deleting document:", err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Set entire document (overwrite)
  const setDocument = async (documentId, document) => {
    try {
      setLoading(true);
      const documentRef = ref(database, `${collectionPath}/${documentId}`);
      await set(documentRef, {
        ...document,
        createdAt: document.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (err) {
      setError(err);
      console.error("Error setting document:", err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
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
  };
};

/**
 * Custom hook สำหรับ transactions เฉพาะ
 */
export const useTransactions = () => {
  const {
    data: transactions,
    loading,
    error,
    addDocument,
    updateDocument,
    deleteDocument,
  } = useFirestore("transactions");

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

  // Calculate totals
  const totals = {
    income: transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0),
    expense: transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0),
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
  };
};

/**
 * Custom hook สำหรับ real-time listener เฉพาะ
 */
export const useRealtimeListener = (path) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const dataRef = ref(database, path);

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
        console.error(`Error listening to ${path}:`, err);
      }
    );

    return () => unsubscribe();
  }, [path]);

  return { data, loading, error };
};
