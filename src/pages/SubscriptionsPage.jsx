import VideoCard from "../components/VideoCard";
import { SimpleGrid, Box, Heading, Text, VStack, Flex } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loadAllVideos } from "../hooks/videoDataLoader";
import { getSubscribedChannels } from "../hooks/userInteractions";
import { SpinnerLoader } from "../components/loaders";

export default function SubscriptionsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allVideos, setAllVideos] = useState([]); // Store all fetched videos
  const [displayedVideos, setDisplayedVideos] = useState([]); // Currently displayed videos
  const [subscribedChannels, setSubscribedChannels] = useState([]); // Store subscribed channel names
  const [page, setPage] = useState(1);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const VIDEOS_PER_PAGE = 10;

  // Fetch subscribed channels and videos
  useEffect(() => {
    const fetchSubscriptionVideos = async () => {
      try {
        setIsLoading(true);
        
        // Get subscribed channels from localStorage
        const subscribed = getSubscribedChannels();
        setSubscribedChannels(subscribed);
        
        if (subscribed.length === 0) {
          // No subscriptions
          setAllVideos([]);
          setDisplayedVideos([]);
          setIsLoading(false);
          return;
        }

        // Fetch all videos
        const data = await loadAllVideos();
        if (data && Array.isArray(data)) {
          // Assign random channel names from subscriptions to all videos
          const videosWithSubscriptionChannels = data.map((video, index) => {
            // Use a random subscribed channel name for each video
            const randomChannelIndex = Math.floor(Math.random() * subscribed.length);
            const randomChannel = subscribed[randomChannelIndex];
            
            return {
              ...video,
              channelName: randomChannel,
              id: `sub-${video.id}-${index}` // Ensure unique IDs
            };
          });

          setAllVideos(videosWithSubscriptionChannels);
          const firstBatch = videosWithSubscriptionChannels.slice(0, VIDEOS_PER_PAGE);
          setDisplayedVideos(firstBatch);
        } else {
          console.error("Invalid data format received");
          setAllVideos([]);
          setDisplayedVideos([]);
        }
      } catch (error) {
        console.error("Error fetching subscription videos:", error);
        setAllVideos([]);
        setDisplayedVideos([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionVideos();
  }, []);

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
    <Box
      ref={scrollContainerRef}
      className="custom-scrollbar"
      overflowY="auto"
      h="full"
      w="full"
      p="20px">
      
      {/* Show loading state */}
      {isLoading ? (
        <Box>
          <Heading
            as="h1"
            size="2xl"
            color="white"
            mb="24px"
            fontSize={{ base: "24px", md: "28px", lg: "36px" }}
            fontWeight="600">
            Subscriptions
          </Heading>
          <SimpleGrid
            columns={{ base: 1, sm: 1, md: 2, lg: 3, xl: 4 }}
            spacing="20px"
            gap={4}
            w="full">
            {Array.from({ length: 10 }, (_, index) => (
              <VideoCard key={`loading-${index}`} isLoading={true} />
            ))}
          </SimpleGrid>
        </Box>
      ) : subscribedChannels.length === 0 ? (
        /* Show "no subscriptions" message */
        <Flex 
          direction="column" 
          align="center" 
          justify="center" 
          h="60vh" 
          textAlign="center">
          <VStack spacing="24px">
            {/* Icon */}
            <Box
              w="80px"
              h="80px"
              bg="gray.700"
              borderRadius="50%"
              display="flex"
              alignItems="center"
              justifyContent="center">
              <Text fontSize="32px" color="gray.400">📺</Text>
            </Box>
            
            {/* No subscriptions message */}
            <VStack spacing="8px">
              <Heading
                as="h2"
                size="lg"
                color="white"
                fontWeight="600">
                No subscriptions yet
              </Heading>
              <Text
                fontSize="16px"
                color="gray.400"
                maxW="400px"
                lineHeight="1.5">
                Start exploring and subscribe to your favorite channels to see their latest videos here.
              </Text>
            </VStack>
          </VStack>
        </Flex>
      ) : (
        /* Show subscription videos */
        <Box>
          <Heading
            as="h1"
            size="2xl"
            color="white"
            mb="24px"
            fontSize={{ base: "24px", md: "28px", lg: "36px" }}
            fontWeight="600">
            Subscriptions
          </Heading>

          <SimpleGrid
            columns={{ base: 1, sm: 1, md: 2, lg: 3, xl: 4 }}
            spacing="20px"
            gap={4}
            w="full">
            {displayedVideos.map((video) => (
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
      )}
    </Box>
  );
}
