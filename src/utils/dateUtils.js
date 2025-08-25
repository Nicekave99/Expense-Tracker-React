// src/utils/dateUtils.js

/**
 * Utility functions สำหรับจัดการวันที่
 */

// Thai month names
export const THAI_MONTHS = [
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

// Thai month names (short)
export const THAI_MONTHS_SHORT = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

// Thai day names
export const THAI_DAYS = [
  "อาทิตย์",
  "จันทร์",
  "อังคาร",
  "พุธ",
  "พฤหัสบดี",
  "ศุกร์",
  "เสาร์",
];

// Thai day names (short)
export const THAI_DAYS_SHORT = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];

/**
 * แปลงวันที่เป็นรูปแบบไทย
 * @param {Date|string} date - วันที่ที่ต้องการแปลง
 * @param {Object} options - ตัวเลือกการแสดงผล
 * @returns {string} วันที่ในรูปแบบไทย
 */
export const formatThaiDate = (date, options = {}) => {
  const {
    showYear = true,
    showDay = false,
    shortMonth = false,
    shortDay = false,
    buddhistYear = true,
  } = options;

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "วันที่ไม่ถูกต้อง";

  const day = dateObj.getDate();
  const month = shortMonth
    ? THAI_MONTHS_SHORT[dateObj.getMonth()]
    : THAI_MONTHS[dateObj.getMonth()];
  const year = buddhistYear
    ? dateObj.getFullYear() + 543
    : dateObj.getFullYear();
  const dayName = shortDay
    ? THAI_DAYS_SHORT[dateObj.getDay()]
    : THAI_DAYS[dateObj.getDay()];

  let result = "";

  if (showDay) {
    result += `วัน${dayName} `;
  }

  result += `${day} ${month}`;

  if (showYear) {
    result += ` ${year}`;
  }

  return result;
};

/**
 * แปลงเวลาเป็นรูปแบบไทย
 * @param {Date|string} date - วันที่และเวลา
 * @param {boolean} show24Hour - แสดงเวลา 24 ชั่วโมง
 * @returns {string} เวลาในรูปแบบไทย
 */
export const formatThaiTime = (date, show24Hour = true) => {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "เวลาไม่ถูกต้อง";

  if (show24Hour) {
    return (
      dateObj.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }) + " น."
    );
  } else {
    return dateObj.toLocaleTimeString("th-TH", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
};

/**
 * แปลงวันที่และเวลาเป็นรูปแบบไทยแบบเต็ม
 * @param {Date|string} date - วันที่และเวลา
 * @param {Object} options - ตัวเลือก
 * @returns {string} วันที่และเวลาในรูปแบบไทย
 */
export const formatThaiDateTime = (date, options = {}) => {
  const dateStr = formatThaiDate(date, options);
  const timeStr = formatThaiTime(date, options.show24Hour);
  return `${dateStr} เวลา ${timeStr}`;
};

/**
 * คำนวณระยะเวลาที่ผ่านมา (relative time)
 * @param {Date|string} date - วันที่ที่ต้องการคำนวณ
 * @returns {string} ระยะเวลาที่ผ่านมาในรูปแบบไทย
 */
export const getRelativeTime = (date) => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffTime = now - targetDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.ceil(diffTime / (1000 * 60));
  const diffSeconds = Math.ceil(diffTime / 1000);

  if (diffSeconds < 60) {
    return "เพิ่งเกิดขึ้น";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} นาทีที่แล้ว`;
  } else if (diffHours < 24) {
    return `${diffHours} ชั่วโมงที่แล้ว`;
  } else if (diffDays === 1) {
    return "เมื่อวาน";
  } else if (diffDays < 7) {
    return `${diffDays} วันที่แล้ว`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} สัปดาห์ที่แล้ว`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} เดือนที่แล้ว`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} ปีที่แล้ว`;
  }
};

/**
 * ตรวจสอบว่าเป็นวันเดียวกันหรือไม่
 * @param {Date|string} date1 - วันที่แรก
 * @param {Date|string} date2 - วันที่สอง
 * @returns {boolean} true ถ้าเป็นวันเดียวกัน
 */
export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.toDateString() === d2.toDateString();
};

/**
 * ตรวจสอบว่าเป็นเดือนเดียวกันหรือไม่
 * @param {Date|string} date1 - วันที่แรก
 * @param {Date|string} date2 - วันที่สอง
 * @returns {boolean} true ถ้าเป็นเดือนเดียวกัน
 */
export const isSameMonth = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()
  );
};

/**
 * ตรวจสอบว่าเป็นปีเดียวกันหรือไม่
 * @param {Date|string} date1 - วันที่แรก
 * @param {Date|string} date2 - วันที่สอง
 * @returns {boolean} true ถ้าเป็นปีเดียวกัน
 */
export const isSameYear = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getFullYear() === d2.getFullYear();
};

/**
 * รับวันแรกของเดือน
 * @param {Date|string} date - วันที่
 * @returns {Date} วันแรกของเดือน
 */
export const getStartOfMonth = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

/**
 * รับวันสุดท้ายของเดือน
 * @param {Date|string} date - วันที่
 * @returns {Date} วันสุดท้ายของเดือน
 */
export const getEndOfMonth = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
};

/**
 * รับจำนวนวันในเดือน
 * @param {Date|string} date - วันที่
 * @returns {number} จำนวนวันในเดือน
 */
export const getDaysInMonth = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
};

/**
 * เพิ่มวัน
 * @param {Date|string} date - วันที่เริ่มต้น
 * @param {number} days - จำนวนวันที่ต้องการเพิ่ม
 * @returns {Date} วันที่ใหม่
 */
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * เพิ่มเดือน
 * @param {Date|string} date - วันที่เริ่มต้น
 * @param {number} months - จำนวนเดือนที่ต้องการเพิ่ม
 * @returns {Date} วันที่ใหม่
 */
export const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

/**
 * เพิ่มปี
 * @param {Date|string} date - วันที่เริ่มต้น
 * @param {number} years - จำนวนปีที่ต้องการเพิ่ม
 * @returns {Date} วันที่ใหม่
 */
export const addYears = (date, years) => {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
};

/**
 * แปลงวันที่เป็น format สำหรับ input[type="date"]
 * @param {Date|string} date - วันที่
 * @returns {string} วันที่ในรูปแบบ YYYY-MM-DD
 */
export const formatDateForInput = (date) => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

/**
 * แปลงวันที่เป็น format สำหรับ input[type="datetime-local"]
 * @param {Date|string} date - วันที่และเวลา
 * @returns {string} วันที่และเวลาในรูปแบบ YYYY-MM-DDTHH:mm
 */
export const formatDateTimeForInput = (date) => {
  const d = new Date(date);
  return d.toISOString().slice(0, 16);
};

/**
 * สร้างช่วงวันที่
 * @param {Date|string} startDate - วันเริ่มต้น
 * @param {Date|string} endDate - วันสิ้นสุด
 * @returns {Date[]} array ของวันที่ในช่วงที่กำหนด
 */
export const getDateRange = (startDate, endDate) => {
  const dates = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

/**
 * ตรวจสอบว่าวันที่อยู่ในช่วงที่กำหนดหรือไม่
 * @param {Date|string} date - วันที่ที่ต้องการตรวจสอบ
 * @param {Date|string} startDate - วันเริ่มต้น
 * @param {Date|string} endDate - วันสิ้นสุด
 * @returns {boolean} true ถ้าอยู่ในช่วงที่กำหนด
 */
export const isDateInRange = (date, startDate, endDate) => {
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  return d >= start && d <= end;
};

/**
 * รับปีปัจจุบันในรูปแบบพุทธศักราช
 * @returns {number} ปี พ.ศ.
 */
export const getCurrentBuddhistYear = () => {
  return new Date().getFullYear() + 543;
};

/**
 * แปลงปี ค.ศ. เป็น พ.ศ.
 * @param {number} christianYear - ปี ค.ศ.
 * @returns {number} ปี พ.ศ.
 */
export const toBuddhistYear = (christianYear) => {
  return christianYear + 543;
};

/**
 * แปลงปี พ.ศ. เป็น ค.ศ.
 * @param {number} buddhistYear - ปี พ.ศ.
 * @returns {number} ปี ค.ศ.
 */
export const toChristianYear = (buddhistYear) => {
  return buddhistYear - 543;
};
