import VideoCard from "../components/VideoCard";
import { SimpleGrid, Box } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loadAllVideos } from "../hooks/videoDataLoader";
import { CardLoader, SpinnerLoader } from "../components/loaders";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allVideos, setAllVideos] = useState([]); // Store all fetched videos
  const [displayedVideos, setDisplayedVideos] = useState([]); // Currently displayed videos
  const [page, setPage] = useState(1);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const VIDEOS_PER_PAGE = 10;

  // Fetch initial video data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await loadAllVideos();
        if (data && Array.isArray(data)) {
          setAllVideos(data);
          const firstBatch = data.slice(0, VIDEOS_PER_PAGE);
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
    const scrollContainer = scrollContainerRef.current;
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
  }, [isLoading, isLoadingMore, allVideos.length, page]);

  const handleVideoClick = (videoId) => {
    navigate(`/watch/${videoId}`);
  };

  const handleChannelClick = (channelName) => {
    console.log("Channel clicked:", channelName);
  };

  const handleMoreClick = (videoId) => {
    console.log("More options clicked:", videoId);
  };

  return (
    <Box
      ref={scrollContainerRef}
      className="custom-scrollbar"
      overflowY="auto"
      h="full"
      w="full"
      p="20px">
      <SimpleGrid
        columns={{ base: 1, sm: 1, md: 2, lg: 3, xl: 4 }}
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
          <SpinnerLoader
            gridColumn="1 / -1"
            text="Loading more videos..."
            textColor="gray.600"
          />
        )}
      </SimpleGrid>
    </Box>
  );
}
