// src/utils/toastUtils.js
import { toast } from "react-toastify";

export const showSuccess = (message) =>
  toast.success(message, {
    icon: "✅",
    className: "!bg-black !text-white !font-semibold !rounded-lg",
    progressClassName: "!bg-green-500",
  });

export const showError = (message) =>
  toast.error(message, {
    icon: "❌",
    className: "!bg-black !text-white !font-semibold !rounded-lg",
    progressClassName: "!bg-red-500",
  });

export const showInfo = (message) =>
  toast.info(message, {
    icon: "ℹ️",
    className: "!bg-blue-600 !text-white !font-semibold !rounded-lg",
    progressClassName: "!bg-blue-500",
  });

export const showWarning = (message) =>
  toast.warning(message, {
    icon: "⚠️",
    className: "!bg-yellow-500 !text-white !font-semibold !rounded-lg",
    progressClassName: "!bg-yellow-500",
  });
