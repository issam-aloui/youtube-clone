import { useCallback } from "react";

// Hook for formatting numbers (likes, views, subscribers, etc.)
export const useFormatNumber = () => {
  return useCallback((num) => {
    if (!num) return "0";
    const number = typeof num === "string" ? parseInt(num) : num;

    if (number >= 1000000) {
      return (number / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (number >= 1000) {
      return (number / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return number.toString();
  }, []);
};

// Hook for formatting time ago (e.g., "3 days ago")
export const useFormatTimeAgo = () => {
  return useCallback((dateString) => {
    if (!dateString) return "Unknown";

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "Just now";
  }, []);
};

// Hook for formatting views (similar to formatNumber but specific for views display)
export const useFormatViews = () => {
  return useCallback((count) => {
    try {
      if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`;
      } else if (count >= 1000) {
        return `${Math.floor(count / 1000)}K`;
      }
      return count.toString();
    } catch (error) {
      console.error("Error formatting views:", error);
      return "0";
    }
  }, []);
};

// Hook for formatting duration (e.g., "10:30", "1:05:30")
export const useFormatDuration = () => {
  return useCallback((seconds) => {
    if (!seconds || seconds < 0) return "0:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
  }, []);
};
