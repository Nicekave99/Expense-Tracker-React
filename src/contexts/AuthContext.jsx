// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { ref, set, get, update } from "firebase/database";
import { auth, database } from "../config/firebase";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setCurrentUser(user);
          await loadUserProfile(user.uid);
        } else {
          setCurrentUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        setAuthError(error.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const loadUserProfile = async (userId) => {
    try {
      const profileRef = ref(database, `users/${userId}/profile`);
      const snapshot = await get(profileRef);

      if (snapshot.exists()) {
        setUserProfile(snapshot.val());
      } else {
        // Create default profile if doesn't exist
        const defaultProfile = {
          uid: userId,
          email: auth.currentUser?.email,
          displayName: auth.currentUser?.displayName || "ผู้ใช้ใหม่",
          createdAt: new Date().toISOString(),
          preferences: {
            theme: "light",
            language: "th",
            currency: "THB",
          },
        };

        await set(profileRef, defaultProfile);
        setUserProfile(defaultProfile);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      setAuthError("ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
    }
  };

  const signup = async (email, password, displayName) => {
    try {
      setAuthError(null);

      // Create user account
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = result.user;

      // Update Firebase Auth profile
      if (displayName) {
        await updateProfile(user, { displayName });
      }

      // Create user profile in database
      const userProfile = {
        uid: user.uid,
        email: user.email,
        displayName: displayName || "ผู้ใช้ใหม่",
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        emailVerified: user.emailVerified,
        preferences: {
          theme: "light",
          language: "th",
          currency: "THB",
        },
        stats: {
          totalTransactions: 0,
          totalIncome: 0,
          totalExpense: 0,
        },
      };

      await set(ref(database, `users/${user.uid}/profile`), userProfile);

      // Send email verification
      if (!user.emailVerified) {
        await sendEmailVerification(user);
      }

      setUserProfile(userProfile);
      return { success: true, user, needsVerification: !user.emailVerified };
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error.code);
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const login = async (email, password) => {
    try {
      setAuthError(null);

      const result = await signInWithEmailAndPassword(auth, email, password);

      // Update last login time
      if (result.user) {
        await update(ref(database, `users/${result.user.uid}/profile`), {
          lastLoginAt: new Date().toISOString(),
        });
      }

      return { success: true, user: result.user };
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error.code);
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      setAuthError(null);
      await signOut(auth);
      return { success: true };
    } catch (error) {
      const errorMessage = "ไม่สามารถออกจากระบบได้";
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const resetPassword = async (email) => {
    try {
      setAuthError(null);
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error.code);
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateUserProfile = async (updates) => {
    try {
      if (!currentUser) {
        throw new Error("ไม่พบผู้ใช้");
      }

      setAuthError(null);

      // Update in Firebase Auth if displayName changed
      if (
        updates.displayName &&
        updates.displayName !== currentUser.displayName
      ) {
        await updateProfile(currentUser, { displayName: updates.displayName });
      }

      // Update in database
      const updatedProfile = {
        ...userProfile,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await update(
        ref(database, `users/${currentUser.uid}/profile`),
        updatedProfile
      );
      setUserProfile(updatedProfile);

      return { success: true };
    } catch (error) {
      const errorMessage = "ไม่สามารถอัพเดทข้อมูลได้";
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const resendEmailVerification = async () => {
    try {
      if (!currentUser) {
        throw new Error("ไม่พบผู้ใช้");
      }

      setAuthError(null);
      await sendEmailVerification(currentUser);
      return { success: true };
    } catch (error) {
      const errorMessage = "ไม่สามารถส่งอีเมลยืนยันได้";
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => {
    setAuthError(null);
  };

  // Helper function to get user-friendly error messages
  const getAuthErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "ไม่พบบัญชีผู้ใช้นี้";
      case "auth/wrong-password":
        return "รหัสผ่านไม่ถูกต้อง";
      case "auth/invalid-email":
        return "รูปแบบอีเมลไม่ถูกต้อง";
      case "auth/user-disabled":
        return "บัญชีผู้ใช้ถูกปิดใช้งาน";
      case "auth/email-already-in-use":
        return "อีเมลนี้ถูกใช้งานแล้ว";
      case "auth/weak-password":
        return "รหัสผ่านอ่อนแอเกินไป ควรมีอย่างน้อย 6 ตัวอักษร";
      case "auth/too-many-requests":
        return "มีการพยายามเข้าสู่ระบบมากเกินไป กรุณารอสักครู่แล้วลองใหม่";
      case "auth/network-request-failed":
        return "เชื่อมต่ออินเทอร์เน็ตไม่ได้ กรุณาตรวจสอบการเชื่อมต่อ";
      case "auth/requires-recent-login":
        return "กรุณาเข้าสู่ระบบใหม่เพื่อดำเนินการต่อ";
      default:
        return "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
    }
  };

  // Get user's full path for database operations
  const getUserPath = (path = "") => {
    if (!currentUser) return null;
    return `users/${currentUser.uid}${path ? `/${path}` : ""}`;
  };

  const value = {
    // User data
    currentUser,
    userProfile,
    loading,
    authError,

    // Auth methods
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    resendEmailVerification,

    // Utility methods
    clearError,
    getUserPath,

    // User status checks
    isAuthenticated: !!currentUser,
    isEmailVerified: currentUser?.emailVerified || false,

    // User preferences (for easy access)
    theme: userProfile?.preferences?.theme || "light",
    language: userProfile?.preferences?.language || "th",
    currency: userProfile?.preferences?.currency || "THB",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
