import { SidebarProvider } from "../context/SidebarContext";
import Basic_layout from "../layout/basic_layout";
import VideoCard from "../components/VideoCard";
import { SimpleGrid, Box, Heading } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loadAllVideos } from "../hooks/videoDataLoader";
import data_fetch from "../hooks/data_fetch";
import { SpinnerLoader } from "../components/loaders";

export default function SubscriptionsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allVideos, setAllVideos] = useState([]); // Store all fetched videos
  const [displayedVideos, setDisplayedVideos] = useState([]); // Currently displayed videos
  const [subscriptions, setSubscriptions] = useState([]); // Store subscription data
  const [page, setPage] = useState(1);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const VIDEOS_PER_PAGE = 10;

  // Fetch subscription data
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const data = await data_fetch("/data/subscriptions.json");
        setSubscriptions(data || []);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        setSubscriptions([]);
      }
    };

    fetchSubscriptions();
  }, []);

  // Fetch initial video data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await loadAllVideos();
        if (data && Array.isArray(data)) {
          // Map channel names from subscriptions data
          const videosWithSubscriptionChannels = data.map((video, index) => {
            // Use subscription channel names in a cycling manner
            const subscriptionIndex = index % subscriptions.length;
            const subscription = subscriptions[subscriptionIndex];

            return {
              ...video,
              channelName: subscription?.name || video.channelName,
              channelAvatar: subscription?.avatar || video.channelAvatar,
            };
          });

          setAllVideos(videosWithSubscriptionChannels);
          const firstBatch = videosWithSubscriptionChannels.slice(
            0,
            VIDEOS_PER_PAGE
          );
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

    if (subscriptions.length > 0) {
      fetchInitialData();
    }
  }, [subscriptions]);

  // Load more videos (reusing existing ones)
  const loadMoreVideos = () => {
    if (isLoadingMore || allVideos.length === 0) return;

    setIsLoadingMore(true);

    setTimeout(() => {
      const startIndex = page * VIDEOS_PER_PAGE;
      let endIndex = startIndex + VIDEOS_PER_PAGE;

      // If we've reached the end of allVideos, start from the beginning
      if (startIndex >= allVideos.length) {
        const newStartIndex = 0;
        endIndex = VIDEOS_PER_PAGE;
        const newBatch = allVideos.slice(newStartIndex, endIndex);
        setDisplayedVideos((prev) => [...prev, ...newBatch]);
      } else {
        // If endIndex exceeds allVideos length, wrap around
        if (endIndex > allVideos.length) {
          const firstPart = allVideos.slice(startIndex);
          const secondPart = allVideos.slice(0, endIndex - allVideos.length);
          const newBatch = [...firstPart, ...secondPart];
          setDisplayedVideos((prev) => [...prev, ...newBatch]);
        } else {
          const newBatch = allVideos.slice(startIndex, endIndex);
          setDisplayedVideos((prev) => [...prev, ...newBatch]);
        }
      }

      setPage((prev) => prev + 1);
      setIsLoadingMore(false);
    }, 1000);
  };

  // Infinite scroll handler
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    if (
      scrollPercentage > 0.8 &&
      !isLoadingMore &&
      displayedVideos.length > 0
    ) {
      loadMoreVideos();
    }
  };

  // Set up scroll listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [isLoadingMore, displayedVideos.length]);

  const handleVideoClick = (videoId) => {
    navigate(`/watch/${videoId}`);
  };

  const handleChannelClick = (channelName) => {
    console.log(`Clicked on channel: ${channelName}`);
  };

  const handleMoreClick = (videoId) => {
    console.log(`More options for video: ${videoId}`);
  };

  return (
    <SidebarProvider>
      <Basic_layout ref={scrollContainerRef}>
        <Box p="20px" minH="100vh">
          {/* Latest Heading - Bigger */}
          <Heading
            as="h1"
            size="2xl"
            color="white"
            mb="24px"
            fontSize={{ base: "24px", md: "28px", lg: "36px" }}
            fontWeight="600">
            Latest
          </Heading>

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
      </Basic_layout>
    </SidebarProvider>
  );
}
