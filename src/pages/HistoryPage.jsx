import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  HStack,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormatTimeAgo } from "../hooks/formatters";
import MiniVideoCard from "../components/MiniVideoCard";
import { SpinnerLoader } from "../components/loaders";
import {
  getWatchHistoryWithDetails,
  clearWatchHistory,
  removeFromWatchHistory,
  isHistoryPaused,
  setHistoryPaused as saveHistoryPausedState,
} from "../hooks/watchHistory";

// Icons (you might need to add these to your assets)
import clearIcon from "../assets/icons/white_icons/library.svg"; // Using library icon as placeholder
import pauseIcon from "../assets/icons/white_icons/watch_later.svg"; // Using watch_later icon as placeholder

// Close icon component
const CloseIcon = () => (
  <Box
    width="16px"
    height="16px"
    position="relative"
    display="flex"
    alignItems="center"
    justifyContent="center">
    <Box
      position="absolute"
      width="12px"
      height="2px"
      bg="white"
      transform="rotate(45deg)"
    />
    <Box
      position="absolute"
      width="12px"
      height="2px"
      bg="white"
      transform="rotate(-45deg)"
    />
  </Box>
);

export default function HistoryPage() {
  const [watchHistory, setWatchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [historyPaused, setHistoryPaused] = useState(false);
  const navigate = useNavigate();
  const formatTimeAgo = useFormatTimeAgo();

  // Load watch history with video details from localStorage
  useEffect(() => {
    const loadWatchHistoryData = async () => {
      try {
        setIsLoading(true);
        const historyWithDetails = await getWatchHistoryWithDetails();
        // No sorting - treat as stack (LIFO - Last In, First Out)
        setWatchHistory(historyWithDetails);
      } catch (error) {
        console.error("Error loading watch history:", error);
        setWatchHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadWatchHistoryData();
    setHistoryPaused(isHistoryPaused());
  }, []);

  const handleVideoClick = (videoId) => {
    navigate(`/watch/${videoId}`);
  };

  // Clear all watch history
  const clearAllHistory = () => {
    clearWatchHistory();
    setWatchHistory([]);
  };

  // Toggle pause watch history
  const togglePauseHistory = () => {
    const newPausedState = !historyPaused;
    setHistoryPaused(newPausedState); // Update local state
    saveHistoryPausedState(newPausedState); // Save to localStorage via utility
  };

  // Remove single item from history
  const removeFromHistoryHandler = (videoId, watchedAt) => {
    removeFromWatchHistory(videoId, watchedAt);
    const updatedHistory = watchHistory.filter(
      (item) => !(item.videoId === videoId && item.watchedAt === watchedAt)
    );
    setWatchHistory(updatedHistory);
  };

  // Group history by date
  const groupHistoryByDate = () => {
    const grouped = {};
    watchHistory.forEach((item) => {
      const date = new Date(item.watchedAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let dateKey;
      if (date.toDateString() === today.toDateString()) {
        dateKey = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = "Yesterday";
      } else {
        dateKey = date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year:
            date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
        });
      }

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(item);
    });

    return grouped;
  };

  const groupedHistory = groupHistoryByDate();

  return (
    <Box h="full" w="full" overflowY="auto" p="20px" maxW="1200px" mx="auto">
      {/* Header */}
      <VStack align="start" spacing="20px" mb="30px">
        <Heading
          as="h1"
          size="2xl"
          color="white"
              fontSize={{ base: "28px", md: "36px" }}
              fontWeight="400">
              Watch history
            </Heading>

            {/* Action buttons */}
            <HStack spacing="12px">
              <Button
                leftIcon={
                  <img
                    src={clearIcon}
                    alt="Clear"
                    style={{ width: "20px", height: "20px" }}
                  />
                }
                variant="ghost"
                color="white"
                fontSize="14px"
                fontWeight="400"
                bg="rgba(255, 255, 255, 0.08)"
                _hover={{ bg: "rgba(255, 255, 255, 0.15)" }}
                onClick={clearAllHistory}>
                Clear all watch history
              </Button>
              <Button
                leftIcon={
                  <img
                    src={pauseIcon}
                    alt="Pause"
                    style={{ width: "20px", height: "20px" }}
                  />
                }
                variant="ghost"
                color="white"
                fontSize="14px"
                fontWeight="400"
                bg="rgba(255, 255, 255, 0.08)"
                _hover={{ bg: "rgba(255, 255, 255, 0.15)" }}
                onClick={togglePauseHistory}>
                {historyPaused ? "Resume watch history" : "Pause watch history"}
              </Button>
            </HStack>
          </VStack>

          {/* History content */}
          {isLoading ? (
            <SpinnerLoader
              text="Loading watch history..."
              textColor="gray.400"
              color="red.500"
              minHeight="30vh"
            />
          ) : watchHistory.length === 0 ? (
            <Box textAlign="center" py="60px">
              <Text color="gray.400" fontSize="16px">
                No watch history yet
              </Text>
            </Box>
          ) : (
            <VStack align="start" spacing="24px">
              {Object.entries(groupedHistory).map(([date, videos]) => (
                <Box key={date} w="full">
                  <Text
                    color="white"
                    fontSize="18px"
                    fontWeight="600"
                    mb="20px"
                    bg="rgba(255, 255, 255, 0.05)"
                    px="12px"
                    py="6px"
                    borderRadius="8px"
                    display="inline-block">
                    {date}
                  </Text>
                  <VStack align="start" spacing="16px" pl="0">
                    {videos.map((historyItem, index) => {
                      const video = historyItem.videoDetails;
                      if (!video) return null;

                      return (
                        <Box
                          key={`${historyItem.videoId}-${historyItem.watchedAt}-${index}`}
                          w="full"
                          position="relative"
                          bg="rgba(255, 255, 255, 0.02)"
                          borderRadius="12px"
                          p="12px"
                          border="1px solid rgba(255, 255, 255, 0.05)"
                          _hover={{
                            bg: "rgba(255, 255, 255, 0.06)",
                            borderColor: "rgba(255, 255, 255, 0.1)",
                          }}
                          transition="all 0.2s ease">
                          <Box position="relative">
                            <Flex gap="16px" align="start">
                              {/* Video Card */}
                              <Box
                                flex="1"
                                transform="scale(1.1)"
                                transformOrigin="left top">
                                <MiniVideoCard
                                  thumbnail={video.thumbnail}
                                  title={video.title}
                                  channelName={video.channelName}
                                  views={video.views}
                                  uploadDate={video.uploadDate}
                                  duration={video.duration}
                                  isVerified={video.isVerified}
                                  onVideoClick={() =>
                                    handleVideoClick(historyItem.videoId)
                                  }
                                  onChannelClick={() => {}}
                                />
                              </Box>

                              {/* X Remove button - positioned top right */}
                              <Box flexShrink={0} pt="8px">
                                <Button
                                  aria-label="Remove from history"
                                  variant="ghost"
                                  color="white"
                                  size="sm"
                                  bg="rgba(255, 255, 255, 0.15)"
                                  border="1px solid rgba(255, 255, 255, 0.3)"
                                  borderRadius="50%"
                                  w="32px"
                                  h="32px"
                                  minW="32px"
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                  p={0}
                                  _hover={{
                                    bg: "rgba(255, 0, 0, 0.4)",
                                    borderColor: "red.400",
                                    transform: "scale(1.1)",
                                  }}
                                  transition="all 0.2s ease"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromHistoryHandler(
                                      historyItem.videoId,
                                      historyItem.watchedAt
                                    );
                                  }}>
                                  <CloseIcon />
                                </Button>
                              </Box>
                            </Flex>

                            {/* Watch time info - positioned bottom right */}
                            <Box
                              position="absolute"
                              bottom="0"
                              right="0"
                              bg="rgba(0, 0, 0, 0.8)"
                              px="8px"
                              py="4px"
                              borderRadius="6px"
                              border="1px solid rgba(255, 255, 255, 0.1)">
                              <Text
                                color="gray.300"
                                fontSize="11px"
                                fontWeight="500"
                                whiteSpace="nowrap">
                                Watched {formatTimeAgo(historyItem.watchedAt)}
                              </Text>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
              </VStack>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}