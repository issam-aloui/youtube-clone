import { Box, Flex, Text, Image } from "@chakra-ui/react";
import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormatTimeAgo } from "../hooks/formatters";
import { loadVideoById } from "../hooks/videoDataLoader";

const PlaylistCard = ({
  id,
  title,
  status,
  lastTimeUpdate,
  videoIds,
  thumbnail,
  description,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [firstVideoThumbnail, setFirstVideoThumbnail] = useState(null);
  const formatTimeAgo = useFormatTimeAgo();
  const navigate = useNavigate();

  // Get first video thumbnail if playlist thumbnail is null
  React.useEffect(() => {
    if (!thumbnail && videoIds && videoIds.length > 0) {
      const firstVideoId = videoIds[0];
      loadVideoById(firstVideoId).then((video) => {
        if (video && video.thumbnail) {
          setFirstVideoThumbnail(video.thumbnail);
        }
      });
    }
  }, [thumbnail, videoIds]);

  const displayThumbnail = thumbnail || firstVideoThumbnail;
  const videoCount = videoIds ? videoIds.length : 0;

  const handleViewFullPlaylist = (e) => {
    e.stopPropagation(); // Prevent triggering the main onClick
    navigate(`/playlist?id=${id}`);
  };

  const handleMainClick = () => {
    if (videoCount > 0) {
      onClick(id);
    } else {
      // If no videos, just navigate to the playlist detail page
      navigate(`/playlist?id=${id}`);
    }
  };

  return (
    <Box
      cursor="pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleMainClick}
      transition="all 0.2s ease"
      transform={isHovered ? "translateY(-2px)" : "translateY(0)"}
      _hover={{
        "& .playlist-thumbnail": {
          transform: "scale(1.05)",
        },
      }}>
      {/* Thumbnail Container */}
      <Box
        className="playlist-thumbnail"
        position="relative"
        w="full"
        aspectRatio="16/9"
        borderRadius="12px"
        overflow="hidden"
        mb="12px"
        bg="gray.700"
        transition="transform 0.3s ease">
        {/* Thumbnail Image */}
        {displayThumbnail ? (
          <Image
            src={displayThumbnail}
            alt={title}
            w="full"
            h="full"
            objectFit="cover"
          />
        ) : (
          <Box
            w="full"
            h="full"
            bg="gray.600"
            display="flex"
            alignItems="center"
            justifyContent="center">
            <Text color="gray.400" fontSize="14px">
              No thumbnail
            </Text>
          </Box>
        )}

        {/* Video Count Badge - Right Bottom Corner */}
        <Box
          position="absolute"
          bottom="8px"
          right="8px"
          bg="rgba(0, 0, 0, 0.85)"
          color="white"
          px="8px"
          py="4px"
          borderRadius="6px"
          fontSize="12px"
          fontWeight="600"
          display="flex"
          alignItems="center"
          gap="4px">
          <Box
            as="svg"
            width="12px"
            height="12px"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path d="M22 7H2v1h20V7zm-9 5H2v-1h11v1zm0 4H2v-1h11v1zm2 3H2v-1h13v1zm0-4H2v-1h13v1zm8-3.5L19 14v-4l4-2.5z" />
          </Box>
          {videoCount}
        </Box>

        {/* Hover Play All Button */}
        {isHovered && videoCount > 0 && (
          <Box
            position="absolute"
            bottom="8px"
            left="8px"
            bg="rgba(0, 0, 0, 0.85)"
            color="white"
            px="12px"
            py="6px"
            borderRadius="6px"
            fontSize="14px"
            fontWeight="600"
            display="flex"
            alignItems="center"
            gap="6px"
            transition="all 0.2s ease"
            opacity={isHovered ? 1 : 0}>
            <Box
              as="svg"
              width="14px"
              height="14px"
              viewBox="0 0 24 24"
              fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </Box>
            Play all
          </Box>
        )}

        {/* Empty Playlist Message */}
        {isHovered && videoCount === 0 && (
          <Box
            position="absolute"
            bottom="8px"
            left="8px"
            bg="rgba(0, 0, 0, 0.85)"
            color="gray.400"
            px="12px"
            py="6px"
            borderRadius="6px"
            fontSize="14px"
            fontWeight="600"
            display="flex"
            alignItems="center"
            gap="6px"
            transition="all 0.2s ease"
            opacity={isHovered ? 1 : 0}>
            No videos
          </Box>
        )}
      </Box>

      {/* Playlist Info */}
      <Box>
        {/* Title */}
        <Text
          fontSize="16px"
          fontWeight="600"
          color="white"
          lineHeight="22px"
          noOfLines={2}
          mb="4px"
          transition="color 0.2s ease"
          _hover={{
            color: "#aaaaaa",
          }}>
          {title}
        </Text>

        {/* Status */}
        <Text
          fontSize="14px"
          color="#aaaaaa"
          mb="2px"
          textTransform="capitalize">
          {status}
        </Text>

        {/* Last Time Update (ago format) */}
        <Text fontSize="14px" color="#aaaaaa" mb="4px">
          {formatTimeAgo(lastTimeUpdate)}
        </Text>

        {/* View Full Playlist */}
        <Text
          fontSize="14px"
          color="#3ea6ff"
          cursor="pointer"
          onClick={handleViewFullPlaylist}
          _hover={{ textDecoration: "underline" }}>
          View full playlist
        </Text>
      </Box>
    </Box>
  );
};

export default PlaylistCard;
