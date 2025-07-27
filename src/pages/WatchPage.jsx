import Basic_layout from "../layout/basic_layout";
import VideoPlayer from "../components/VideoPlayer";
import SideRecommendation from "../components/SideRecommendation";
import IconButton from "../components/IconButton";
import { SidebarProvider } from "../context/SidebarContext";
import { Flex, Box, Text, Button, HStack, VStack } from "@chakra-ui/react";
import { useState } from "react";

// Number formatter function
const formatNumber = (num) => {
  if (!num) return "0";
  const number = typeof num === "string" ? parseInt(num) : num;

  if (number >= 1000000) {
    return (number / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return number.toString();
};

// Time formatter function
const formatTimeAgo = (dateString) => {
  if (!dateString) return "Unknown";

  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
};

export default function WatchPage({
  videoUrl,
  title,
  channelName,
  subscriberCount,
  description,
  likes,
  dislikes,
  views,
  uploadDate,
}) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Use provided description or default message
  const videoDescription =
    description || "No description added by the channel owner.";
  return (
    <SidebarProvider>
      <Basic_layout>
        <Flex direction="row" minH="100vh">
          {/* Video Player Section - Left Side */}
          <Box w="75%" p="24px" bg="black">
            <VideoPlayer src={videoUrl} type="application/x-mpegURL" />
            <Box mt="16px" color="white">
              {/* Video Title */}
              <Text fontSize="20px" fontWeight="600" mb="12px" lineHeight="1.3">
                {title || "I Mastered Minecraft Combat"}
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
                        src="/src/assets/images/profilePicture.jpg"
                        alt={channelName || "Wermbu"}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = (channelName ||
                            "W")[0];
                          e.target.parentElement.style.color = "white";
                          e.target.parentElement.style.fontSize = "16px";
                          e.target.parentElement.style.fontWeight = "600";
                        }}
                      />
                    </Box>

                    {/* Channel Name and Subscribers */}
                    <VStack align="start" spacing="0">
                      <HStack spacing="4px">
                        <Text fontSize="16px" fontWeight="600" color="white">
                          {channelName || "Wermbu"}
                        </Text>
                        {/* Verified Badge */}
                        <Box
                          w="14px"
                          h="14px"
                          bg="gray.400"
                          borderRadius="50%"
                        />
                      </HStack>
                      <Text fontSize="12px" color="gray.400">
                        {subscriberCount || "1.02M subscribers"}
                      </Text>
                    </VStack>

                    {/* Subscribe Button */}
                    <Button
                      bg="white"
                      color="black"
                      fontSize="14px"
                      fontWeight="600"
                      px="16px"
                      py="10px"
                      h="36px"
                      borderRadius="18px"
                      ml="16px"
                      _hover={{ bg: "gray.200" }}>
                      Subscribe
                    </Button>
                  </HStack>

                  {/* Action Buttons */}
                  <HStack spacing="8px">
                    {/* Like Button */}
                    <HStack
                      spacing="0"
                      bg="gray.800"
                      borderRadius="18px"
                      overflow="hidden">
                      <IconButton
                        icon="/src/assets/icons/white_icons/liked.svg"
                        text={formatNumber(likes) || "0"}
                        bg="transparent"
                        color="white"
                        fontSize="14px"
                        px="12px"
                        py="8px"
                        h="36px"
                        borderRadius="18px 0 0 18px"
                        _hover={{ bg: "gray.700" }}
                      />
                      <Box w="1px" h="24px" bg="gray.600" />
                      <IconButton
                        icon="/src/assets/icons/white_icons/DisLiked.svg"
                        text={formatNumber(dislikes) || "0"}
                        bg="transparent"
                        color="white"
                        fontSize="14px"
                        px="12px"
                        py="8px"
                        h="36px"
                        borderRadius="0 18px 18px 0"
                        _hover={{ bg: "gray.700" }}
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
                bg="gray.900"
                borderRadius="12px"
                position="relative"
                overflow="hidden"
                maxH={isDescriptionExpanded ? "none" : "80px"}
                transition="max-height 0.3s ease"
                cursor={!isDescriptionExpanded ? "pointer" : "default"}
                _hover={!isDescriptionExpanded ? { bg: "gray.800" } : {}}
                onClick={!isDescriptionExpanded ? () => setIsDescriptionExpanded(true) : undefined}
              >
                {/* Video stats (views and upload date) */}
                <Text fontSize="14px" color="white" fontWeight="600" mb="8px">
                  {formatNumber(views) || "253K"} views •{" "}
                  {formatTimeAgo(uploadDate) || "7 days ago"}
                </Text>

                <Text
                  fontSize="14px"
                  color="gray.300"
                  lineHeight="1.4"
                  whiteSpace="pre-wrap"
                  overflow="hidden">
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
                      background="linear-gradient(transparent, #1A202C)"
                      pointerEvents="none"
                    />
                    {/* Show more indicator */}
                    <Text
                      fontSize="14px"
                      color="white"
                      fontWeight="600"
                      mt="8px"
                      position="relative"
                      zIndex="1"
                      bg="gray.900"
                      pointerEvents="none"
                    >
                      ...more
                    </Text>
                  </>
                )}

                {/* Show less button - only visible when expanded */}
                {isDescriptionExpanded && (
                  <Text
                    fontSize="14px"
                    color="white"
                    fontWeight="600"
                    mt="16px"
                    cursor="pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDescriptionExpanded(false);
                    }}
                    _hover={{ textDecoration: "underline" }}
                  >
                    Show less
                  </Text>
                )}
              </Box>

              {/* Remove duplicate description section */}
            </Box>
          </Box>
          {/* Side Recommendation Section - Right Side */}
          <Box w="25%" h="100vh" overflowY="auto" bg="#121212">
            <SideRecommendation />
          </Box>
        </Flex>
      </Basic_layout>
    </SidebarProvider>
  );
}
