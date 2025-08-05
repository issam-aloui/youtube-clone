import {
  Box,
  Flex,
  Image,
  Text,
  HStack,
  VStack,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  useFormatViews,
  useFormatDuration,
  useFormatTimeAgo,
} from "../hooks/formatters";

const MiniVideoCard = ({
  thumbnail,
  title,
  channelName,
  views,
  uploadDate,
  duration,
  isVerified = false,
  isLoading = false,
  onVideoClick,
  onChannelClick,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const formatViews = useFormatViews();
  const formatDuration = useFormatDuration();
  const formatTimeAgo = useFormatTimeAgo();

  // Loading skeleton
  if (isLoading) {
    return (
      <Flex
        w="100%"
        minH={{ base: "120px", md: "94px" }}
        bg="gray.50"
        borderRadius="12px"
        overflow="hidden"
        gap={{ base: 2, md: 3 }}
        p={2}
        direction={{ base: "column", sm: "row" }}>
        {/* Thumbnail skeleton */}
        <Skeleton
          w={{ base: "100%", sm: "168px" }}
          h={{ base: "140px", sm: "94px" }}
          borderRadius="12px"
          flexShrink={0}
        />

        {/* Content skeleton */}
        <VStack align="start" justify="start" flex={1} spacing={2} pt={1}>
          <SkeletonText noOfLines={2} spacing={1} skeletonHeight="3" w="90%" />
          <SkeletonText noOfLines={1} spacing={1} skeletonHeight="2" w="60%" />
        </VStack>
      </Flex>
    );
  }

  return (
    <Flex
      w="100%"
      minH={{ base: "120px", md: "94px" }}
      cursor="pointer"
      borderRadius="12px"
      overflow="hidden"
      transition="all 0.2s ease"
      _hover={{
        transform: "scale(1.02)",
      }}
      gap={{ base: 2, md: 3 }}
      p={2}
      direction={{ base: "column", sm: "row" }}
      onClick={onVideoClick}>
      {/* Thumbnail */}
      <Box
        position="relative"
        w={{ base: "100%", sm: "168px" }}
        h={{ base: "140px", sm: "94px" }}
        borderRadius="12px"
        overflow="hidden"
        flexShrink={0}
        bg="gray.200">
        <Image
          src={thumbnail}
          alt={title}
          w="100%"
          h="100%"
          objectFit="cover"
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
          style={{
            display: imageLoading ? "none" : "block",
          }}
        />

        {imageLoading && (
          <Skeleton w="100%" h="100%" position="absolute" top={0} left={0} />
        )}

        {/* Duration badge */}
        {duration && (
          <Box
            position="absolute"
            bottom="4px"
            right="4px"
            bg="rgba(0, 0, 0, 0.8)"
            color="white"
            px={1}
            py={0.5}
            borderRadius="4px"
            fontSize="xs"
            fontWeight="medium">
            {formatDuration(duration)}
          </Box>
        )}
      </Box>

      {/* Content */}
      <VStack
        align="start"
        justify="start"
        flex={1}
        spacing={1}
        overflow="hidden"
        minW={0}>
        {/* Title */}
        <Text
          fontSize={{ base: "16px", md: "14px" }}
          fontWeight="500"
          color="white"
          lineHeight="20px"
          noOfLines={{ base: 3, md: 2 }}
          cursor="pointer"
          transition="color 0.2s ease"
          wordBreak="break-word">
          {title}
        </Text>

        {/* Channel and metadata */}
        <VStack align="start" spacing={0.5} w="100%">
          <HStack spacing={1} flexWrap="wrap">
            <Text
              fontSize={{ base: "14px", md: "13px" }}
              color="#aaaaaa"
              cursor="pointer"
              transition="color 0.2s ease"
              onClick={(e) => {
                e.stopPropagation();
                onChannelClick?.();
              }}
              noOfLines={1}>
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
                color="white"
                flexShrink={0}>
                ✓
              </Box>
            )}
          </HStack>

          <Text
            fontSize={{ base: "14px", md: "13px" }}
            color="#aaaaaa"
            noOfLines={1}
            wordBreak="break-word">
            {formatViews(views)} • {formatTimeAgo(uploadDate)}
          </Text>
        </VStack>
      </VStack>
    </Flex>
  );
};

export default MiniVideoCard;
