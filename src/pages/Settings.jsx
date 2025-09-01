import React, { useEffect, useMemo, useState } from "react";
import {
  User,
  KeyRound,
  Image as ImageIcon,
  Camera,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { auth, storage } from "../config/firebase"; // ✅ ใช้ storage ที่ export มาแล้ว
import { useAuth } from "../contexts/AuthContext";
import Notification from "../components/Notification";

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from "firebase/auth";

// ✅ ไม่ต้อง import getStorage อีกแล้ว
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const Settings = ({ theme = "light", language = "th" }) => {
  const { currentUser, userProfile, updateUserProfile, resetPassword } =
    useAuth();

  // ----- Local Notification -----
  const [toast, setToast] = useState(null);
  const notify = (message, type = "info") =>
    setToast({ message, type, id: Date.now() });

  // ----- Display name -----
  const initialName =
    userProfile?.displayName || currentUser?.displayName || "";
  const [displayName, setDisplayName] = useState(initialName);
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    setDisplayName(initialName);
  }, [initialName]);

  const saveDisplayName = async () => {
    if (!currentUser) return;
    if (!displayName.trim()) {
      notify(
        language === "th"
          ? "กรุณากรอกชื่อแสดงผล"
          : "Please enter a display name",
        "warning"
      );
      return;
    }
    try {
      setSavingName(true);

      // อัปเดตลง Realtime DB + (Auth displayName ผ่าน AuthContext)
      await updateUserProfile({ displayName: displayName.trim() });

      notify(
        language === "th" ? "บันทึกชื่อเรียบร้อย ✅" : "Display name saved ✅",
        "success"
      );
    } catch (err) {
      console.error(err);
      notify(
        language === "th" ? "บันทึกชื่อไม่สำเร็จ" : "Failed to save name",
        "error"
      );
    } finally {
      setSavingName(false);
    }
  };

  // ----- Profile photo -----
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview(null);
      return;
    }
    const url = URL.createObjectURL(photoFile);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  const uploadPhoto = async () => {
    if (!currentUser || !photoFile) return;
    try {
      setUploadingPhoto(true);

      const ext = photoFile.name.split(".").pop() || "jpg";
      const path = `users/${
        currentUser.uid
      }/profile/avatar_${Date.now()}.${ext}`;
      const ref = storageRef(storage, path);

      await uploadBytes(ref, photoFile, { contentType: photoFile.type });
      const url = await getDownloadURL(ref);

      // อัปเดต photoURL ใน Firebase Auth
      await updateProfile(currentUser, { photoURL: url });
      // และบันทึกลง Realtime DB ผ่าน context
      await updateUserProfile({ photoURL: url });

      setPhotoFile(null);
      setPhotoPreview(null);

      notify(
        language === "th"
          ? "อัปเดตรูปโปรไฟล์เรียบร้อย ✅"
          : "Profile photo updated ✅",
        "success"
      );
    } catch (err) {
      console.error(err);
      notify(
        language === "th"
          ? "อัปโหลดรูปไม่สำเร็จ"
          : "Failed to upload profile photo",
        "error"
      );
    } finally {
      setUploadingPhoto(false);
    }
  };

  // ----- Password change -----
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  const isPasswordProvider = useMemo(
    () => currentUser?.providerData?.some((p) => p.providerId === "password"),
    [currentUser]
  );

  const changePassword = async () => {
    if (!currentUser) return;

    if (!isPasswordProvider) {
      // ถ้าลงทะเบียนด้วย provider อื่น → ให้ส่งลิงก์ reset แทน
      await resetPassword(currentUser.email);
      notify(
        language === "th"
          ? "ส่งอีเมลสำหรับตั้งค่ารหัสผ่านแล้ว"
          : "Password reset email sent",
        "info"
      );
      return;
    }

    if (!currentPw || !newPw || !confirmPw) {
      notify(
        language === "th"
          ? "กรุณากรอกรหัสผ่านให้ครบ"
          : "Please fill out all password fields",
        "warning"
      );
      return;
    }
    if (newPw.length < 6) {
      notify(
        language === "th"
          ? "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร"
          : "New password must be at least 6 characters",
        "warning"
      );
      return;
    }
    if (newPw !== confirmPw) {
      notify(
        language === "th" ? "รหัสผ่านใหม่ไม่ตรงกัน" : "Passwords do not match",
        "warning"
      );
      return;
    }

    try {
      setSavingPw(true);
      // re-authenticate ก่อน
      const cred = EmailAuthProvider.credential(currentUser.email, currentPw);
      await reauthenticateWithCredential(currentUser, cred);

      // อัปเดตรหัสผ่าน
      await updatePassword(currentUser, newPw);

      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");

      notify(
        language === "th" ? "เปลี่ยนรหัสผ่านสำเร็จ ✅" : "Password updated ✅",
        "success"
      );
    } catch (err) {
      console.error(err);
      let msg =
        language === "th"
          ? "เปลี่ยนรหัสผ่านไม่สำเร็จ"
          : "Failed to change password";
      if (err.code === "auth/wrong-password") {
        msg =
          language === "th"
            ? "รหัสผ่านปัจจุบันไม่ถูกต้อง"
            : "Current password is incorrect";
      } else if (err.code === "auth/requires-recent-login") {
        msg =
          language === "th"
            ? "โปรดลงชื่อเข้าใช้อีกครั้งเพื่อความปลอดภัย"
            : "Please sign in again to continue";
      }
      notify(msg, "error");
    } finally {
      setSavingPw(false);
    }
  };

  // ----- UI helpers -----
  const textMuted = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const cardClass =
    theme === "dark"
      ? "bg-gray-800/80 border-gray-700/50"
      : "bg-white/80 border-white/20";

  return (
    <div
      className={`p-6 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
    >
      {/* Header */}
      <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent mb-6">
        {language === "th" ? "การตั้งค่า" : "Settings"}
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* CARD: Profile (name + photo) */}
        <section
          className={`${cardClass} backdrop-blur-sm rounded-2xl p-6 shadow-lg border relative overflow-hidden`}
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-red-500/10 rounded-full blur-2xl" />
          <header className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg">
              <User size={22} />
            </div>
            <h2 className="text-xl font-bold">
              {language === "th" ? "โปรไฟล์" : "Profile"}
            </h2>
          </header>

          {/* Display name */}
          <div className="space-y-2 mb-5">
            <label className={`text-sm font-medium ${textMuted}`}>
              {language === "th" ? "ชื่อที่แสดง" : "Display name"}
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={`flex-1 px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 ${
                  theme === "dark"
                    ? "bg-gray-900/60 border-gray-700 text-gray-100"
                    : "bg-white border-gray-200"
                }`}
                placeholder={
                  language === "th" ? "กรอกชื่อที่จะแสดง" : "Enter display name"
                }
              />
              <button
                onClick={saveDisplayName}
                className={`px-5 rounded-xl font-semibold shadow-md transition-all bg-gradient-to-r from-red-500 to-pink-500 text-white hover:brightness-110 ${
                  savingName ? "opacity-80" : ""
                }`}
                disabled={savingName}
              >
                {savingName ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="animate-spin" size={16} />
                    {language === "th" ? "กำลังบันทึก..." : "Saving..."}
                  </span>
                ) : language === "th" ? (
                  "บันทึก"
                ) : (
                  "Save"
                )}
              </button>
            </div>
            <p className={`text-xs ${textMuted}`}>
              {language === "th"
                ? "ชื่อที่แสดงจะถูกใช้ในระบบและอุปกรณ์ของคุณ"
                : "This name will appear across your account."}
            </p>
          </div>

          {/* Profile photo */}
          {/* <div className="space-y-2">
            <label className={`text-sm font-medium ${textMuted}`}>
              {language === "th" ? "รูปโปรไฟล์" : "Profile photo"}
            </label>

            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={
                    photoPreview ||
                    currentUser?.photoURL ||
                    "https://i.pravatar.cc/100?img=3"
                  }
                  alt="avatar"
                  className="w-20 h-20 rounded-2xl object-cover shadow-md"
                />
                <div className="absolute -bottom-2 -right-2">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold shadow hover:brightness-110">
                    <Camera size={14} />
                    {language === "th" ? "เลือกรูป" : "Choose"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setPhotoFile(e.target.files?.[0] || null)
                      }
                    />
                  </label>
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <p className={`text-xs ${textMuted}`}>
                  {language === "th"
                    ? "รองรับ .jpg .png .webp (แนะนำ ≤ 2MB)"
                    : "Supported: .jpg .png .webp (≤ 2MB recommended)"}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={!photoFile || uploadingPhoto}
                    onClick={uploadPhoto}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shadow-md transition-all
                      ${uploadingPhoto ? "opacity-80" : "hover:brightness-110"}
                      bg-gradient-to-r from-rose-500 to-orange-500 text-white`}
                  >
                    {uploadingPhoto ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        {language === "th" ? "กำลังอัปโหลด..." : "Uploading..."}
                      </>
                    ) : (
                      <>
                        <ImageIcon size={16} />
                        {language === "th" ? "อัปเดตรูป" : "Update photo"}
                      </>
                    )}
                  </button>
                  {photoFile && (
                    <button
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview(null);
                      }}
                      className={`px-3 py-2 rounded-xl text-sm font-semibold ${
                        theme === "dark"
                          ? "bg-gray-700 text-gray-200"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {language === "th" ? "ยกเลิก" : "Cancel"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div> */}
        </section>

        {/* CARD: Password */}
        <section
          className={`${cardClass} backdrop-blur-sm rounded-2xl p-6 shadow-lg border relative overflow-hidden`}
        >
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full blur-2xl" />
          <header className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-lg">
              <KeyRound size={22} />
            </div>
            <h2 className="text-xl font-bold">
              {language === "th" ? "ความปลอดภัย" : "Security"}
            </h2>
          </header>

          {!isPasswordProvider ? (
            <div
              className={`p-4 rounded-xl border ${
                theme === "dark"
                  ? "bg-gray-900/40 border-gray-700"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className="text-amber-500 flex-shrink-0 mt-0.5"
                  size={18}
                />
                <div>
                  <p className="font-semibold">
                    {language === "th"
                      ? "บัญชีของคุณเข้าสู่ระบบผ่านผู้ให้บริการภายนอก"
                      : "Your account uses an external provider"}
                  </p>
                  <p className={`text-sm ${textMuted}`}>
                    {language === "th"
                      ? "หากต้องการตั้งรหัสผ่าน กดปุ่มเพื่อรับอีเมลสำหรับตั้งค่า"
                      : "To set a password, send yourself a password reset email."}
                  </p>
                  <button
                    onClick={async () => {
                      await resetPassword(currentUser.email);
                      notify(
                        language === "th"
                          ? "ส่งอีเมลตั้งค่ารหัสผ่านแล้ว"
                          : "Password reset email sent",
                        "info"
                      );
                    }}
                    className="mt-3 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold shadow-md hover:brightness-110"
                  >
                    {language === "th"
                      ? "ส่งอีเมลตั้งรหัสผ่าน"
                      : "Send reset email"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className={`text-sm font-medium ${textMuted}`}>
                  {language === "th" ? "รหัสผ่านปัจจุบัน" : "Current password"}
                </label>
                <input
                  type="password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 ${
                    theme === "dark"
                      ? "bg-gray-900/60 border-gray-700 text-gray-100"
                      : "bg-white border-gray-200"
                  }`}
                  placeholder={language === "th" ? "••••••••" : "••••••••"}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${textMuted}`}>
                    {language === "th" ? "รหัสผ่านใหม่" : "New password"}
                  </label>
                  <input
                    type="password"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 ${
                      theme === "dark"
                        ? "bg-gray-900/60 border-gray-700 text-gray-100"
                        : "bg-white border-gray-200"
                    }`}
                    placeholder={
                      language === "th" ? "อย่างน้อย 6 ตัวอักษร" : "min 6 chars"
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${textMuted}`}>
                    {language === "th"
                      ? "ยืนยันรหัสผ่านใหม่"
                      : "Confirm new password"}
                  </label>
                  <input
                    type="password"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 ${
                      theme === "dark"
                        ? "bg-gray-900/60 border-gray-700 text-gray-100"
                        : "bg-white border-gray-200"
                    }`}
                    placeholder={
                      language === "th" ? "พิมพ์ซ้ำอีกครั้ง" : "Type again"
                    }
                  />
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={changePassword}
                  disabled={savingPw}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white shadow-md bg-gradient-to-r from-yellow-500 to-orange-500 hover:brightness-110 ${
                    savingPw ? "opacity-80" : ""
                  }`}
                >
                  {savingPw ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      {language === "th" ? "กำลังบันทึก..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <KeyRound size={16} />
                      {language === "th"
                        ? "เปลี่ยนรหัสผ่าน"
                        : "Change password"}
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </section>
      </div>

      {/* Toast */}
      {toast && (
        <Notification
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          theme={theme}
          language={language}
        />
      )}
    </div>
  );
};

export default Settings;
