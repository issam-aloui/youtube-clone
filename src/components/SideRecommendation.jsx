import MiniVideoCard from "./MiniVideoCard";
import { Box, Spinner, Flex, Text, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import data_fetch from "../hooks/data_fetch";

export default function SideRecommendation() {
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

      // Only load when user reaches the exact bottom (no threshold)
      if (scrollBottom >= documentHeight) {
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

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading, isLoadingMore, allVideos.length]);

  const handleVideoClick = (videoId) => {
    console.log("Side recommendation video clicked:", videoId);
  };

  const handleChannelClick = (channelName) => {
    console.log("Side recommendation channel clicked:", channelName);
  };

  return (
    <Box pt="24px" pr="24px" bg="#121212" minH="100vh">
      {/* Videos List */}
      <VStack spacing="8px" w="full" align="stretch">
        {isLoading
          ? // Show initial loading cards
            Array.from({ length: 10 }, (_, index) => (
              <MiniVideoCard key={`loading-${index}`} isLoading={true} />
            ))
          : // Show actual video cards
            displayedVideos.map((video) => (
              <MiniVideoCard
                key={video.id}
                thumbnail={video.thumbnail}
                title={video.title}
                channelName={video.channelName}
                views={`${Math.floor(video.views / 1000)}K views`}
                uploadDate={video.uploadDate}
                duration={video.duration}
                isVerified={video.isVerified}
                onVideoClick={() => handleVideoClick(video.id)}
                onChannelClick={() => handleChannelClick(video.channelName)}
              />
            ))}

        {/* Loading more cards */}
        {isLoadingMore && (
          <Box py={4}>
            <Flex direction="column" align="center" justify="center" gap={2}>
              <Spinner
                thickness="2px"
                speed="0.8s"
                emptyColor="gray.600"
                color="red.500"
                size="md"
              />
              <Text color="gray.400" fontSize="12px">
                Loading more videos...
              </Text>
            </Flex>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
