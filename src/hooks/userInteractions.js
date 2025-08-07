// Local Storage utilities for user interactions

// Liked Videos
export const getLikedVideos = () => {
  try {
    const liked = localStorage.getItem("likedVideos");
    return liked ? JSON.parse(liked) : [];
  } catch (error) {
    console.error("Error getting liked videos:", error);
    return [];
  }
};

export const addLikedVideo = (videoId) => {
  try {
    const liked = getLikedVideos();
    if (!liked.includes(videoId)) {
      liked.push(videoId);
      localStorage.setItem("likedVideos", JSON.stringify(liked));
    }
    // Remove from disliked if it was there
    removeLikedVideo(videoId, "disliked");
    return true;
  } catch (error) {
    console.error("Error adding liked video:", error);
    return false;
  }
};

export const removeLikedVideo = (videoId, type = "liked") => {
  try {
    const storageKey = type === "liked" ? "likedVideos" : "dislikedVideos";
    const items = type === "liked" ? getLikedVideos() : getDislikedVideos();
    const updated = items.filter((id) => id !== videoId);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error(`Error removing ${type} video:`, error);
    return false;
  }
};

export const isVideoLiked = (videoId) => {
  const liked = getLikedVideos();
  return liked.includes(videoId);
};

// Disliked Videos
export const getDislikedVideos = () => {
  try {
    const disliked = localStorage.getItem("dislikedVideos");
    return disliked ? JSON.parse(disliked) : [];
  } catch (error) {
    console.error("Error getting disliked videos:", error);
    return [];
  }
};

export const addDislikedVideo = (videoId) => {
  try {
    const disliked = getDislikedVideos();
    if (!disliked.includes(videoId)) {
      disliked.push(videoId);
      localStorage.setItem("dislikedVideos", JSON.stringify(disliked));
    }
    // Remove from liked if it was there
    removeLikedVideo(videoId, "liked");
    return true;
  } catch (error) {
    console.error("Error adding disliked video:", error);
    return false;
  }
};

export const isVideoDisliked = (videoId) => {
  const disliked = getDislikedVideos();
  return disliked.includes(videoId);
};

// Subscribed Channels
export const getSubscribedChannels = () => {
  try {
    const subscribed = localStorage.getItem("subscribedChannels");
    return subscribed ? JSON.parse(subscribed) : [];
  } catch (error) {
    console.error("Error getting subscribed channels:", error);
    return [];
  }
};

export const addSubscribedChannel = (channelName) => {
  try {
    const subscribed = getSubscribedChannels();
    if (!subscribed.includes(channelName)) {
      subscribed.push(channelName);
      localStorage.setItem("subscribedChannels", JSON.stringify(subscribed));
      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent("subscriptionChange"));
    }
    return true;
  } catch (error) {
    console.error("Error adding subscribed channel:", error);
    return false;
  }
};

export const removeSubscribedChannel = (channelName) => {
  try {
    const subscribed = getSubscribedChannels();
    const updated = subscribed.filter((name) => name !== channelName);
    localStorage.setItem("subscribedChannels", JSON.stringify(updated));
    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent("subscriptionChange"));
    return true;
  } catch (error) {
    console.error("Error removing subscribed channel:", error);
    return false;
  }
};

export const isChannelSubscribed = (channelName) => {
  const subscribed = getSubscribedChannels();
  return subscribed.includes(channelName);
};

// Toggle functions for easier use
export const toggleLikeVideo = (videoId) => {
  if (isVideoLiked(videoId)) {
    removeLikedVideo(videoId, "liked");
    return false; // Now unliked
  } else {
    addLikedVideo(videoId);
    return true; // Now liked
  }
};

export const toggleDislikeVideo = (videoId) => {
  if (isVideoDisliked(videoId)) {
    removeLikedVideo(videoId, "disliked");
    return false; // Now undisliked
  } else {
    addDislikedVideo(videoId);
    return true; // Now disliked
  }
};

export const toggleSubscribeChannel = (channelName) => {
  if (isChannelSubscribed(channelName)) {
    removeSubscribedChannel(channelName);
    return false; // Now unsubscribed
  } else {
    addSubscribedChannel(channelName);
    return true; // Now subscribed
  }
};
