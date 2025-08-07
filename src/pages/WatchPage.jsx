import VideoPlayer from "../components/VideoPlayer";
import SideRecommendation from "../components/SideRecommendation";
import PlaylistSidebar from "../components/PlaylistSidebar";
import IconButton from "../components/IconButton";
import CommentSection from "../components/CommentSection";
import { useFormatNumber, useFormatTimeAgo } from "../hooks/formatters";
import { addToWatchHistory } from "../hooks/watchHistory";
import {
  toggleLikeVideo,
  toggleDislikeVideo,
  toggleSubscribeChannel,
  isVideoLiked,
  isVideoDisliked,
  isChannelSubscribed,
} from "../hooks/userInteractions";
import { Flex, Box, Text, Button, HStack, VStack } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";

// Import assets
import profilePicture from "../assets/images/profilePicture.jpg";
import likedIcon from "../assets/icons/white_icons/liked.svg";
import dislikedIcon from "../assets/icons/white_icons/DisLiked.svg";

export default function WatchPage({
  videoId,
  videoUrl,
  title,
  channelName,
  subscriberCount,
  description,
  likes,
  dislikes,
  views,
  uploadDate,
  playlistId,
}) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const watchPageRef = useRef(null);
  const formatNumber = useFormatNumber();
  const formatTimeAgo = useFormatTimeAgo();

  // Check user interactions status on component mount
  useEffect(() => {
    if (videoId) {
      setIsLiked(isVideoLiked(videoId));
      setIsDisliked(isVideoDisliked(videoId));
    }
    if (channelName) {
      setIsSubscribed(isChannelSubscribed(channelName));
    }
  }, [videoId, channelName]);

  // Handle video play for watch history
  const handleVideoPlay = (playedVideoId) => {
    addToWatchHistory(playedVideoId);
  };

  // Handle like button click
  const handleLikeClick = () => {
    if (videoId) {
      const newLikedState = toggleLikeVideo(videoId);
      setIsLiked(newLikedState);
      if (newLikedState && isDisliked) {
        setIsDisliked(false);
      }
    }
  };

  // Handle dislike button click
  const handleDislikeClick = () => {
    if (videoId) {
      const newDislikedState = toggleDislikeVideo(videoId);
      setIsDisliked(newDislikedState);
      if (newDislikedState && isLiked) {
        setIsLiked(false);
      }
    }
  };

  // Handle subscribe button click
  const handleSubscribeClick = () => {
    if (fallbackData.channelName) {
      const newSubscribedState = toggleSubscribeChannel(
        fallbackData.channelName
      );
      setIsSubscribed(newSubscribedState);
    }
  };

  // Check for critical missing data
  const isMissingCriticalData = !videoUrl || !title;

  // Provide fallbacks for all data
  const fallbackData = {
    videoUrl: videoUrl || "",
    title: title || "Video Title Unavailable",
    channelName: channelName || "Unknown Channel",
    subscriberCount: subscriberCount || 0, // Keep as number
    description: description || "No description available for this video.",
    likes: likes || 0,
    dislikes: dislikes || 0,
    views: views || 0,
    uploadDate: uploadDate || new Date().toISOString(),
  };

  // Check which data is missing (for optional warnings)
  const missingOptionalData = {
    channelName: !channelName,
    subscriberCount: !subscriberCount && subscriberCount !== 0,
    description: !description,
    likes: !likes && likes !== 0,
    dislikes: !dislikes && dislikes !== 0,
    views: !views && views !== 0,
    uploadDate: !uploadDate,
  };

  const hasMissingOptionalData =
    Object.values(missingOptionalData).some(Boolean);

  // Use provided description or default message
  const videoDescription = fallbackData.description;

  // If critical data is missing, show error state
  if (isMissingCriticalData) {
    return (
      <Flex
        direction="column"
        h="full"
        w="full"
        justify="center"
        align="center"
        p="24px">
        <Box
          bg="red.900"
          borderColor="red.500"
          border="1px solid"
          borderRadius="12px"
          p="32px"
          maxW="500px"
          textAlign="center">
          {/* Error Icon */}
          <Box
            w="60px"
            h="60px"
            bg="red.500"
            borderRadius="50%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mx="auto"
            mb="16px">
            <Text fontSize="24px" color="white" fontWeight="bold">
              ⚠️
            </Text>
          </Box>

          {/* Error Title */}
          <Text fontSize="lg" fontWeight="600" color="white" mb="8px">
            Video Not Available!
          </Text>

          {/* Error Description */}
          <Text fontSize="sm" color="gray.300" mb="24px" lineHeight="1.5">
            {!videoUrl && !title
              ? "Both video URL and title are missing. Please check the video link."
              : !videoUrl
              ? "Video URL is missing. Cannot load the video."
              : "Video title is missing. Cannot display video information."}
          </Text>

          {/* Go Back Button */}
          <Button
            colorScheme="red"
            variant="outline"
            size="md"
            color="white"
            onClick={() => window.history.back()}>
            Go Back
          </Button>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex direction="row" ref={watchPageRef} h="full" w="full">
      {/* Optional Data Warning */}
      {hasMissingOptionalData && (
        <Box
          position="fixed"
          top="70px"
          right="20px"
          zIndex="1000"
          bg="orange.500"
          color="white"
          px="12px"
          py="6px"
          borderRadius="8px"
          fontSize="12px"
          fontWeight="500"
          boxShadow="0 2px 8px rgba(0,0,0,0.3)"
          opacity="0.9"
          cursor="pointer"
          title={`Missing: ${Object.entries(missingOptionalData)
            .filter(([_, isMissing]) => isMissing)
            .map(([key, _]) => key)
            .join(", ")}`}>
          ⚠️ Some video data is missing
        </Box>
      )}

      {/* Video Player Section - Left Side */}
      <Box w="75%" p="24px" fontFamily="Roboto, sans-serif">
        {/* Video Player with Error Handling */}
        {videoError ? (
          <Box
            w="100%"
            h="400px"
            bg="gray.900"
            borderRadius="12px"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            border="1px solid"
            borderColor="gray.700">
            <Text fontSize="18px" color="white" mb="8px" fontWeight="600">
              Video Unavailable
            </Text>
            <Text fontSize="14px" color="gray.400" textAlign="center" mb="16px">
              This video cannot be played. It may be unavailable or there might
              be a connection issue.
            </Text>
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              onClick={() => setVideoError(false)}>
              Try Again
            </Button>
          </Box>
        ) : (
          <Box onError={() => setVideoError(true)} style={{ width: "100%" }}>
            <VideoPlayer
              src={fallbackData.videoUrl}
              type="application/x-mpegURL"
              videoId={videoId}
              onPlay={handleVideoPlay}
            />
          </Box>
        )}

        <Box mt="16px" color="white">
          {/* Video Title */}
          <Text
            fontSize="20px"
            fontWeight="600"
            mb="12px"
            lineHeight="1.3"
            fontFamily="Roboto, sans-serif">
            {fallbackData.title}
          </Text>

          {/* Channel Info and Action Buttons */}
          <Box w="100%">
            <Flex justify="space-between" align="center" w="100%">
              <HStack spacing="12px">
                {/* Channel Avatar */}
                <Box
                  w="40px"
                  h="40px"
                  borderRadius="50%"
                  overflow="hidden"
                  bg="purple.500"
                  display="flex"
                  alignItems="center"
                  justifyContent="center">
                  <img
                    src={profilePicture}
                    alt={fallbackData.channelName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML =
                        fallbackData.channelName[0];
                      e.target.parentElement.style.color = "white";
                      e.target.parentElement.style.fontSize = "16px";
                      e.target.parentElement.style.fontWeight = "600";
                    }}
                  />
                </Box>

                {/* Channel Name and Subscribers */}
                <VStack align="start" spacing="0">
                  <HStack spacing="4px">
                    <Text
                      fontSize="16px"
                      fontWeight="600"
                      color="white"
                      fontFamily="Roboto, sans-serif">
                      {fallbackData.channelName}
                    </Text>
                    {/* Verified Badge */}
                    <Box w="14px" h="14px" bg="gray.400" borderRadius="50%" />
                  </HStack>
                  <Text
                    fontSize="12px"
                    color="gray.400"
                    fontFamily="Roboto, sans-serif">
                    {formatNumber(fallbackData.subscriberCount)} subscribers
                  </Text>
                </VStack>

                {/* Subscribe Button */}
                <Button
                  bg={isSubscribed ? "gray.600" : "white"}
                  color={isSubscribed ? "white" : "black"}
                  fontSize="14px"
                  fontWeight="600"
                  px="16px"
                  py="10px"
                  h="36px"
                  borderRadius="18px"
                  ml="16px"
                  onClick={handleSubscribeClick}
                  _hover={{
                    bg: isSubscribed ? "gray.700" : "gray.200",
                  }}>
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </Button>
              </HStack>

              {/* Action Buttons */}
              <HStack spacing="8px">
                {/* Like/Dislike Button */}
                <HStack
                  spacing="0"
                  bg="gray.800"
                  borderRadius="18px"
                  overflow="hidden">
                  <IconButton
                    icon={likedIcon}
                    text={formatNumber(fallbackData.likes)}
                    bg={isLiked ? "red.600" : "transparent"}
                    color="white"
                    fontSize="14px"
                    px="12px"
                    py="8px"
                    h="36px"
                    borderRadius="18px 0 0 18px"
                    _hover={{ bg: isLiked ? "red.700" : "gray.700" }}
                    onClick={handleLikeClick}
                  />
                  <Box w="1px" h="24px" bg="gray.600" />
                  <IconButton
                    icon={dislikedIcon}
                    text={formatNumber(fallbackData.dislikes)}
                    bg={isDisliked ? "red.600" : "transparent"}
                    color="white"
                    fontSize="14px"
                    px="12px"
                    py="8px"
                    h="36px"
                    borderRadius="0 18px 18px 0"
                    _hover={{ bg: isDisliked ? "red.700" : "gray.700" }}
                    onClick={handleDislikeClick}
                  />
                </HStack>

                {/* Share Button */}
                <HStack
                  bg="gray.800"
                  color="white"
                  fontSize="14px"
                  px="12px"
                  py="8px"
                  h="36px"
                  borderRadius="18px"
                  _hover={{ bg: "gray.700" }}
                  cursor="pointer"
                  spacing="8px">
                  <Box
                    w="16px"
                    h="16px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    <img
                      src="https://img.icons8.com/material-outlined/24/ffffff/share.png"
                      alt="Share"
                      style={{ width: "16px", height: "16px" }}
                    />
                  </Box>
                  <Text fontSize="14px">Share</Text>
                </HStack>

                {/* Download Button */}
                <HStack
                  bg="gray.800"
                  color="white"
                  fontSize="14px"
                  px="12px"
                  py="8px"
                  h="36px"
                  borderRadius="18px"
                  _hover={{ bg: "gray.700" }}
                  cursor="pointer"
                  spacing="8px">
                  <Box
                    w="16px"
                    h="16px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    <img
                      src="https://img.icons8.com/material-outlined/24/ffffff/download.png"
                      alt="Download"
                      style={{ width: "16px", height: "16px" }}
                    />
                  </Box>
                  <Text fontSize="14px">Download</Text>
                </HStack>

                {/* More Button - Three Dots */}
                <Box
                  bg="gray.800"
                  color="white"
                  fontSize="14px"
                  px="8px"
                  py="8px"
                  h="36px"
                  w="36px"
                  borderRadius="18px"
                  _hover={{ bg: "gray.700" }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer">
                  <img
                    src="https://img.icons8.com/material-outlined/24/ffffff/more.png"
                    alt="More"
                    style={{ width: "16px", height: "16px" }}
                  />
                </Box>
              </HStack>
            </Flex>
          </Box>

          {/* Video Description */}
          <Box
            mt="16px"
            p="12px"
            bg="#272727"
            borderRadius="12px"
            position="relative"
            overflow="hidden"
            maxH={isDescriptionExpanded ? "none" : "80px"}
            transition="max-height 0.3s ease"
            cursor={!isDescriptionExpanded ? "pointer" : "default"}
            _hover={!isDescriptionExpanded ? { bg: "#323232" } : {}}
            onClick={
              !isDescriptionExpanded
                ? () => setIsDescriptionExpanded(true)
                : undefined
            }>
            {/* Video stats (views and upload date) */}

            <Text
              fontSize="14px"
              color="#ffffff"
              fontWeight="600"
              mb="8px"
              fontFamily="Roboto, sans-serif">
              {formatNumber(fallbackData.views)} views •{" "}
              {formatTimeAgo(fallbackData.uploadDate)}
            </Text>

            <Text
              fontSize="14px"
              color="#ffffff"
              lineHeight="1.4"
              whiteSpace="pre-wrap"
              overflow="hidden"
              fontFamily="Roboto, sans-serif">
              {videoDescription}
            </Text>

            {/* Gradient overlay when collapsed */}
            {!isDescriptionExpanded && videoDescription.length > 100 && (
              <>
                <Box
                  position="absolute"
                  bottom="0"
                  left="0"
                  right="0"
                  height="20px"
                  background="linear-gradient(transparent, #272727)"
                  pointerEvents="none"
                />
                {/* Show more indicator */}
                <Text
                  fontSize="14px"
                  color="#ffffff"
                  fontWeight="600"
                  mt="8px"
                  position="relative"
                  zIndex="1"
                  bg="#272727"
                  pointerEvents="none"
                  fontFamily="Roboto, sans-serif">
                  ...more
                </Text>
              </>
            )}

            {/* Show less button - only visible when expanded */}
            {isDescriptionExpanded && (
              <Text
                fontSize="14px"
                color="#ffffff"
                fontWeight="600"
                mt="16px"
                cursor="pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDescriptionExpanded(false);
                }}
                _hover={{ textDecoration: "underline" }}
                fontFamily="Roboto, sans-serif">
                Show less
              </Text>
            )}
          </Box>

          {/* Comments Section */}
          <CommentSection />

          {/* Remove duplicate description section */}
        </Box>
      </Box>
      {/* Side Section - Right Side */}
      <Box w="25%" h="100vh" bg="#121212">
        {playlistId ? (
          <PlaylistSidebar playlistId={playlistId} currentVideoId={videoId} />
        ) : (
          <SideRecommendation
            scrollContainerRef={watchPageRef}
            currentVideoId={videoId}
          />
        )}
      </Box>
    </Flex>
  );
}
