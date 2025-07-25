import { SidebarProvider } from "../context/SidebarContext";
import Basic_layout from "../layout/basic_layout";
import VideoCard from "../components/VideoCard";
import { SimpleGrid, Box, Spinner, Flex, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import data_fetch from "../hooks/data_fetch";

// Sample video data

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allVideos, setAllVideos] = useState([]); // Store all fetched videos
  const [displayedVideos, setDisplayedVideos] = useState([]); // Currently displayed videos
  const [page, setPage] = useState(1);

  const VIDEOS_PER_PAGE = 10;

  // Fetch initial video data
  useEffect(() => {
    try {
      let firstBatch;
      data_fetch("/data/videos.json").then((data) => {
        setAllVideos(data);
        firstBatch = data.slice(0, VIDEOS_PER_PAGE);
        setDisplayedVideos(firstBatch);
      });
      setIsLoading(false);
      // Show first 10 videos
    } catch (error) {
      console.error("Error fetching video data:", error);
      setAllVideos([]);
      setDisplayedVideos([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load more videos (reusing existing ones)
  const loadMoreVideos = () => {
    if (isLoadingMore || allVideos.length === 0) return;

    setIsLoadingMore(true);

    // Simulate loading delay - 2 seconds for more noticeable loading
    setTimeout(() => {
      const startIndex = (page * VIDEOS_PER_PAGE) % allVideos.length;
      const newVideos = [];

      // Get next 10 videos, cycling through the original data
      for (let i = 0; i < VIDEOS_PER_PAGE; i++) {
        const videoIndex = (startIndex + i) % allVideos.length;
        const originalVideo = allVideos[videoIndex];

        // Create a new video with unique ID to avoid key conflicts
        const newVideo = {
          ...originalVideo,
          id: `${originalVideo.id}-page-${page}-${i}`, // More unique ID
        };
        newVideos.push(newVideo);
      }

      setDisplayedVideos((prev) => [...prev, ...newVideos]);
      setPage((prev) => prev + 1);
      setIsLoadingMore(false);
    }, 2000); // 2 seconds loading time
  };

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || isLoadingMore) {
        return;
      }

      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollBottom = scrollTop + windowHeight;
      const threshold = 300; // Increased threshold for easier triggering

      // Check if user scrolled near bottom
      if (scrollBottom >= documentHeight - threshold) {
        loadMoreVideos();
      }
    };

    // Add throttling to prevent too many calls
    let timeoutId = null;
    const throttledScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        handleScroll();
        timeoutId = null;
      }, 100);
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });

    // Also trigger on initial load to check if content is short
    setTimeout(handleScroll, 1000);

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading, isLoadingMore, allVideos.length]);

  const handleVideoClick = (videoId) => {
    console.log("Video clicked:", videoId);
  };

  const handleChannelClick = (channelName) => {
    console.log("Channel clicked:", channelName);
  };

  const handleMoreClick = (videoId) => {
    console.log("More options clicked:", videoId);
  };

  return (
    <SidebarProvider>
      <Basic_layout>
        <Box p="20px" minH="100vh">
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 2, lg: 3, xl: 4 }}
            spacing="20px"
            gap={4}
            w="full">
            {isLoading
              ? // Show initial loading cards
                Array.from({ length: 10 }, (_, index) => (
                  <VideoCard key={`loading-${index}`} isLoading={true} />
                ))
              : // Show actual video cards
                displayedVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    thumbnail={video.thumbnail}
                    title={video.title}
                    channelName={video.channelName}
                    channelAvatar={video.channelAvatar}
                    views={video.views}
                    uploadDate={video.uploadDate}
                    duration={video.duration}
                    isVerified={video.isVerified}
                    onVideoClick={() => handleVideoClick(video.id)}
                    onChannelClick={() => handleChannelClick(video.channelName)}
                    onMoreClick={() => handleMoreClick(video.id)}
                  />
                ))}

            {/* Loading more cards */}
            {isLoadingMore && (
              <Box gridColumn="1 / -1" py={8}>
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  gap={4}>
                  <Spinner
                    thickness="4px"
                    speed="0.8s"
                    emptyColor="gray.200"
                    color="red.500"
                    size="xl"
                  />
                  <Text color="gray.600" fontSize="sm">
                    Loading more videos...
                  </Text>
                </Flex>
              </Box>
            )}
          </SimpleGrid>
        </Box>
      </Basic_layout>
    </SidebarProvider>
  );
}
