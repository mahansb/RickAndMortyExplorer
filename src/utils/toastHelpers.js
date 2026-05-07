import toast from "react-hot-toast";

// Your portal theme colors
const theme = {
  success: "#00FFB2", // portal-500
  error: "#EF4444", // red-500
  loading: "#A855F7", // alien-500
};

// Rick & Morty flavored error messages
const getErrorMessage = (error) => {
  const status = error.response?.status;

  switch (status) {
    case 404:
      return "🔍 Nothing found in this dimension!";
    case 429:
      return "🐉 Portal overloaded! Too many requests. Slow down!";
    case 500:
    case 502:
    case 503:
      return "💀 Citadel servers are glitching. Try again?";
    case 408:
      return "⏰ Portal timeout! The dimension is taking too long to respond.";
    default:
      if (error.message === "Network Error") {
        return "🔌 Portal disconnected! Check your internet connection.";
      }
      return "🪐 Something went wrong with the portal!";
  }
};

// Main toast functions you'll use
export const showErrorToast = (error) => {
  const message = typeof error === "object" ? getErrorMessage(error) : error;
  toast.error(message, {
    duration: 5000,
    style: {
      background: "#1A2238", // surface-700
      color: "#E2E8F0", // text-primary
      border: "1px solid #EF4444",
      borderRadius: "12px",
      padding: "12px 16px",
    },
  });
};

export const showSuccessToast = (message) => {
  toast.success(message, {
    duration: 2000,
    style: {
      background: "#1A2238",
      color: "#E2E8F0",
      border: `1px solid ${theme.success}`,
      borderRadius: "12px",
      padding: "12px 16px",
    },
    iconTheme: {
      primary: theme.success,
      secondary: "#0B0F1A",
    },
  });
};

export const showLoadingToast = (message) => {
  return toast.loading(message, {
    style: {
      background: "#1A2238",
      color: "#E2E8F0",
      border: `1px solid ${theme.loading}`,
      borderRadius: "12px",
      padding: "12px 16px",
    },
  });
};

// Special toast for rate limiting with retry
export const showRateLimitToast = (onRetry) => {
  toast.error("🐉 Portal overloaded! Waiting 3 seconds...", {
    duration: 3000,
    style: {
      background: "#1A2238",
      color: "#E2E8F0",
      border: "1px solid #F59E0B",
      borderRadius: "12px",
    },
  });

  // Auto retry after 3 seconds
  setTimeout(() => {
    if (onRetry) onRetry();
  }, 3000);
};

// ADD THIS - Info toast for 404s and other non-error notifications
export const showInfoToast = (message) => {
  toast(message, {
    duration: 3000,
    icon: "🔍",
    style: {
      background: "#1A2238",
      color: "#E2E8F0",
      border: "1px solid #00E5FF",
      borderRadius: "12px",
      padding: "12px 16px",
    },
  });
};
