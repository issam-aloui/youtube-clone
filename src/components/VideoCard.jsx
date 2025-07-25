import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Image,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
} from "@chakra-ui/react";

const VideoCard = ({
  thumbnail,
  title,
  channelName,
  channelAvatar,
  views,
  uploadDate,
  duration,
  isVerified = false,
  onVideoClick,
  onChannelClick,
  onMoreClick,
  isLoading = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatViews = (count) => {
    try {
      if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`;
      } else if (count >= 1000) {
        return `${Math.floor(count / 1000)}K`;
      }
      return count.toString();
    } catch (error) {
      console.error("Error formatting views:", error);
      return "0";
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <Box w="full">
        <Skeleton borderRadius="12px" w="full" aspectRatio="16/9" mb="12px" />
        <Flex gap="12px" align="start">
          <SkeletonCircle size="32px" flexShrink={0} />
          <Box flex="1" minW="0">
            <SkeletonText noOfLines={2} spacing="2" mb="4px" />
            <SkeletonText noOfLines={1} w="60%" />
          </Box>
        </Flex>
      </Box>
    );
  }

  return (
    <Box
      w="full"
      cursor="pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      transition="all 0.3s ease"
      transform={isHovered ? "translateY(-2px)" : "translateY(0)"}
      _hover={{
        "& .thumbnail-box": {
          transform: "scale(1.02)",
        },
      }}>
      {/* Video Thumbnail */}
      <Box
        className="thumbnail-box"
        position="relative"
        w="full"
        borderRadius="12px"
        overflow="hidden"
        mb="12px"
        transition="transform 0.3s ease"
        boxShadow={
          isHovered
            ? "0 4px 12px rgba(0, 0, 0, 0.3)"
            : "0 1px 3px rgba(0, 0, 0, 0.1)"
        }>
        {!imageLoaded && (
          <Skeleton
            position="absolute"
            top="0"
            left="0"
            w="full"
            h="full"
            aspectRatio="16/9"
          />
        )}
        <Image
          src={thumbnail}
          alt={title}
          onClick={onVideoClick}
          w="full"
          aspectRatio="16/9"
          objectFit="cover"
          cursor="pointer"
          onLoad={() => setImageLoaded(true)}
          opacity={imageLoaded ? 1 : 0}
          transition="opacity 0.3s ease"
        />

        {/* Duration Badge */}
        {duration && (
          <Box
            position="absolute"
            bottom="8px"
            right="8px"
            bg="rgba(0, 0, 0, 0.85)"
            color="white"
            px="6px"
            py="3px"
            borderRadius="6px"
            fontSize="12px"
            fontWeight="600">
            {duration}
          </Box>
        )}
      </Box>

      {/* Video Details */}
      <Flex gap="12px" align="start">
        {/* Channel Avatar - Using Box with Image styling */}
        <Box
          as="img"
          src={channelAvatar}
          alt={channelName}
          w="32px"
          h="32px"
          borderRadius="50%"
          objectFit="cover"
          cursor="pointer"
          onClick={onChannelClick}
          flexShrink={0}
          transition="transform 0.2s ease"
          _hover={{
            transform: "scale(1.1)",
          }}
        />

        {/* Video Info */}
        <Box flex="1" minW="0">
          {/* Title */}
          <Text
            fontSize="14px"
            fontWeight="500"
            color="white"
            lineHeight="20px"
            noOfLines={2}
            cursor="pointer"
            onClick={onVideoClick}
            mb="4px"
            transition="color 0.2s ease"
            _hover={{
              color: "#aaaaaa",
            }}>
            {title}
          </Text>

          {/* Channel Name with Verified Badge */}
          <Flex align="center" gap="4px" mb="2px">
            <Text
              fontSize="13px"
              color="#aaaaaa"
              cursor="pointer"
              onClick={onChannelClick}
              noOfLines={1}
              transition="color 0.2s ease"
              _hover={{
                color: "white",
              }}>
              {channelName}
            </Text>
            {isVerified && (
              <Box
                w="14px"
                h="14px"
                bg="gray.500"
                borderRadius="50%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="10px"
                color="white">
                ✓
              </Box>
            )}
          </Flex>

          {/* Views and Upload Date */}
          <Text fontSize="13px" color="#aaaaaa" noOfLines={1}>
            {formatViews(views)} views • {uploadDate}
          </Text>
        </Box>

        {/* More Options Button */}
        <Box
          as="button"
          onClick={onMoreClick}
          opacity={isHovered ? 1 : 0}
          transition="all 0.2s ease"
          bg="transparent"
          border="none"
          cursor="pointer"
          borderRadius="50%"
          w="24px"
          h="24px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
          color="white"
          transform={isHovered ? "scale(1)" : "scale(0.8)"}
          _hover={{
            bg: "rgba(255, 255, 255, 0.1)",
            opacity: 1,
            transform: "scale(1.1)",
          }}>
          ⋯
        </Box>
      </Flex>
    </Box>
  );
};

export default VideoCard;
