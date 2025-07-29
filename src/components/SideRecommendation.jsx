import MiniVideoCard from "./MiniVideoCard";
import { Box, Spinner, Flex, Text, VStack } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loadAllVideos } from "../hooks/videoDataLoader";

export default function SideRecommendation({
  scrollContainerRef,
  currentVideoId,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allVideos, setAllVideos] = useState([]); // Store all fetched videos
  const [displayedVideos, setDisplayedVideos] = useState([]); // Currently displayed videos
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const VIDEOS_PER_PAGE = 10;

  // Fetch initial video data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await loadAllVideos();
        if (data && Array.isArray(data)) {
          // Filter out the current video if currentVideoId is provided
          const filteredVideos = currentVideoId
            ? data.filter((video) => video.id !== parseInt(currentVideoId))
            : data;

          setAllVideos(filteredVideos);
          const firstBatch = filteredVideos.slice(0, VIDEOS_PER_PAGE);
          setDisplayedVideos(firstBatch);
        } else {
          console.error("Invalid data format received");
          setAllVideos([]);
          setDisplayedVideos([]);
        }
      } catch (error) {
        console.error("Error fetching video data:", error);
        setAllVideos([]);
        setDisplayedVideos([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [currentVideoId]);

  // Load more videos (reusing existing ones)
  const loadMoreVideos = () => {
    if (isLoadingMore || allVideos.length === 0 || isLoading) return;

    setIsLoadingMore(true);

    // Simulate loading delay - 1 second for better UX
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
          id: `${originalVideo.id}-side-page-${page}-${i}`, // More unique ID for side recommendations
        };
        newVideos.push(newVideo);
      }

      setDisplayedVideos((prev) => [...prev, ...newVideos]);
      setPage((prev) => prev + 1);
      setIsLoadingMore(false);
    }, 1000); // 1 second loading time
  };

  // Scroll detection using external scroll container
  useEffect(() => {
    // If no scroll container is provided, don't set up scroll detection
    if (!scrollContainerRef) {
      return;
    }

    const scrollContainer = scrollContainerRef?.current;
    if (!scrollContainer || isLoading || allVideos.length === 0) {
      return;
    }

    const handleScroll = () => {
      if (isLoadingMore) {
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const scrollBottom = scrollTop + clientHeight;
      const threshold = 100; // Distance from bottom to trigger loading

      // Check if user scrolled near bottom of the scrollable container
      if (scrollBottom >= scrollHeight - threshold) {
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
      }, 200);
    };

    scrollContainer.addEventListener("scroll", throttledScroll, {
      passive: true,
    });

    return () => {
      scrollContainer.removeEventListener("scroll", throttledScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading, isLoadingMore, allVideos.length, page, scrollContainerRef]);

  const handleVideoClick = (videoId) => {
    // Extract the original video ID (remove page suffix if present)
    const originalId = videoId.toString().split("-side-page-")[0];
    navigate(`/watch/${originalId}`);
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
                views={video.views}
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
