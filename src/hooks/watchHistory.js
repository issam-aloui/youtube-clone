// Utility functions for managing watch history in localStorage

// Function to fetch individual video details by ID
export const fetchVideoById = async (videoId) => {
  try {
    // Use Vite's BASE_URL environment variable for proper base path handling
    const basePath = import.meta.env.BASE_URL || "/";
    const videoPath = `/data/videos/${videoId}.json`;
    const fullPath = `${basePath.slice(0, -1)}${videoPath}`;
    const response = await fetch(fullPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch video ${videoId}`);
    }
    const videoData = await response.json();
    return videoData;
  } catch (error) {
    console.error(`Error fetching video ${videoId}:`, error);
    return null;
  }
};

export const addToWatchHistory = (videoId) => {
  try {
    // Check if history is paused
    const historyPaused = localStorage.getItem("historyPaused") === "true";
    if (historyPaused) {
      return;
    }

    // Get existing history
    const existingHistory = localStorage.getItem("watchHistory");
    let watchHistory = [];

    if (existingHistory) {
      watchHistory = JSON.parse(existingHistory);
    }

    // Create new history entry
    const newEntry = {
      videoId: videoId,
      watchedAt: new Date().toISOString(),
    };

    // Remove any existing entries for this video (to avoid duplicates)
    watchHistory = watchHistory.filter((item) => item.videoId !== videoId);

    // Add new entry at the end (LIFO - Last In, First Out)
    watchHistory.push(newEntry);

    // Keep only the last 1000 entries to prevent localStorage from getting too large
    if (watchHistory.length > 1000) {
      watchHistory = watchHistory.slice(-1000); // Keep the last 1000 entries
    }

    // Save back to localStorage
    localStorage.setItem("watchHistory", JSON.stringify(watchHistory));
  } catch (error) {
    console.error("Error adding to watch history:", error);
  }
};

export const getWatchHistory = () => {
  try {
    const savedHistory = localStorage.getItem("watchHistory");
    if (savedHistory) {
      return JSON.parse(savedHistory);
    }
    return [];
  } catch (error) {
    console.error("Error loading watch history:", error);
    return [];
  }
};

// Function to get watch history with video details
export const getWatchHistoryWithDetails = async () => {
  try {
    const watchHistory = getWatchHistory();

    // Reverse to show most recent first (since we use push for LIFO)
    const reversedHistory = watchHistory.reverse();

    // Fetch video details for each history item
    const historyWithDetails = await Promise.all(
      reversedHistory.map(async (historyItem) => {
        const videoDetails = await fetchVideoById(historyItem.videoId);
        return {
          ...historyItem,
          videoDetails,
        };
      })
    );

    // Filter out items where video details couldn't be fetched
    return historyWithDetails.filter((item) => item.videoDetails !== null);
  } catch (error) {
    console.error("Error loading watch history with details:", error);
    return [];
  }
};

export const clearWatchHistory = () => {
  try {
    localStorage.removeItem("watchHistory");
  } catch (error) {
    console.error("Error clearing watch history:", error);
  }
};

export const removeFromWatchHistory = (videoId, watchedAt) => {
  try {
    const existingHistory = localStorage.getItem("watchHistory");
    if (existingHistory) {
      let watchHistory = JSON.parse(existingHistory);
      watchHistory = watchHistory.filter(
        (item) => !(item.videoId === videoId && item.watchedAt === watchedAt)
      );
      localStorage.setItem("watchHistory", JSON.stringify(watchHistory));
    }
  } catch (error) {
    console.error("Error removing from watch history:", error);
  }
};

export const isHistoryPaused = () => {
  return localStorage.getItem("historyPaused") === "true";
};

export const setHistoryPaused = (paused) => {
  localStorage.setItem("historyPaused", paused.toString());
};
