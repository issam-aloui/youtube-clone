// Function to load all videos from individual JSON files
export const loadAllVideos = async () => {
  const videos = [];

  // Use Vite's BASE_URL environment variable for proper base path handling
  const basePath = import.meta.env.BASE_URL || "/";

  // Load videos from files 1-12
  for (let i = 1; i <= 12; i++) {
    try {
      const videoPath = `/data/videos/${i}.json`;
      const fullPath = `${basePath.slice(0, -1)}${videoPath}`;
      const response = await fetch(fullPath);
      if (response.ok) {
        const video = await response.json();
        // Only include necessary data for HomePage
        const homePageVideo = {
          id: video.id,
          thumbnail: video.thumbnail,
          title: video.title,
          channelName: video.channelName,
          channelAvatar: video.channelAvatar,
          views: video.views,
          uploadDate: video.uploadDate,
          duration: video.duration,
          isVerified: video.isVerified,
        };
        videos.push(homePageVideo);
      }
    } catch (error) {
      console.error(`Error loading video ${i}:`, error);
    }
  }

  return videos;
};

// Function to load a specific video by ID
export const loadVideoById = async (id) => {
  try {
    // Use Vite's BASE_URL environment variable for proper base path handling
    const basePath = import.meta.env.BASE_URL || "/";
    const videoPath = `/data/videos/${id}.json`;
    const fullPath = `${basePath.slice(0, -1)}${videoPath}`;
    const response = await fetch(fullPath);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error(`Error loading video ${id}:`, error);
  }
  return null;
};
