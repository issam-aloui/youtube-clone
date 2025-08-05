import { Box, VStack, Text, Flex, Image, HStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import data_fetch from "../hooks/data_fetch";
import { loadVideoById } from "../hooks/videoDataLoader";
import { getLikedVideos } from "../hooks/userInteractions";
import { useFormatDuration, useFormatViews } from "../hooks/formatters";

const PlaylistSidebar = ({ playlistId, currentVideoId }) => {
  const [playlist, setPlaylist] = useState(null);
  const [playlistVideos, setPlaylistVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const formatDuration = useFormatDuration();
  const formatViews = useFormatViews();

  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        setLoading(true);

        // Fetch playlist info from individual file
        const currentPlaylist = await data_fetch(
          `/data/playlists/${playlistId}.json`
        );

        if (currentPlaylist) {
          // Handle dynamic playlists (like liked videos)
          let videoIds = currentPlaylist.videoIds;
          if (currentPlaylist.isDynamic && playlistId === "liked-videos") {
            videoIds = getLikedVideos();
          }

          // Make videoIds unique and update count
          const uniqueVideoIds = [...new Set(videoIds)];
          const updatedPlaylist = {
            ...currentPlaylist,
            videoIds: uniqueVideoIds,
            videoCount: uniqueVideoIds.length,
          };

          setPlaylist(updatedPlaylist);

          // Fetch all videos in the playlist
          const videos = await Promise.all(
            uniqueVideoIds.map(async (videoId, index) => {
              try {
                const video = await loadVideoById(videoId);
                return { ...video, playlistIndex: index + 1 };
              } catch (error) {
                console.error(`Error loading video ${videoId}:`, error);
                return null;
              }
            })
          );

          setPlaylistVideos(videos.filter(Boolean));
        }
      } catch (error) {
        console.error("Error loading playlist:", error);
      } finally {
        setLoading(false);
      }
    };

    if (playlistId) {
      fetchPlaylistData();
    }
  }, [playlistId]);

  const handleVideoClick = (videoId) => {
    navigate(`/watch/${videoId}?playlist=${playlistId}`);
  };

  if (loading) {
    return (
      <Box w="350px" bg="#181818" p="16px" borderRadius="8px">
        <Text color="gray.400">Loading playlist...</Text>
      </Box>
    );
  }

  if (!playlist) {
    return null;
  }

  const currentVideoIndex = playlistVideos.findIndex(
    (v) => v.id == currentVideoId
  );

  return (
    <Box
      w="100%"
      h="100vh"
      bg="#0f0f0f"
      border="1px solid #323232"
      display="flex"
      flexDirection="column">
      {/* Playlist Header */}
      <Box p="16px" borderBottom="1px solid #323232" flexShrink={0}>
        <Text
          fontSize="16px"
          fontWeight="600"
          color="white"
          mb="8px"
          noOfLines={2}>
          {playlist.title}
        </Text>

        <HStack spacing="8px" mb="12px">
          <Text fontSize="14px" color="#aaaaaa">
            {playlist.status}
          </Text>
          <Text fontSize="14px" color="#aaaaaa">
            •
          </Text>
          <Text fontSize="14px" color="#aaaaaa">
            {playlist.videoCount} videos
          </Text>
        </HStack>

        {/* Playlist Controls */}
        <HStack spacing="8px">
          <Flex
            align="center"
            gap="6px"
            bg={playlist.videoCount === 0 ? "#1a1a1a" : "#323232"}
            px="12px"
            py="6px"
            borderRadius="18px"
            cursor={playlist.videoCount === 0 ? "not-allowed" : "pointer"}
            fontSize="12px"
            opacity={playlist.videoCount === 0 ? 0.5 : 1}
            _hover={playlist.videoCount > 0 ? { bg: "#474747" } : {}}>
            <Box
              as="svg"
              width="14px"
              height="14px"
              viewBox="0 0 24 24"
              fill="currentColor"
              color="white">
              <path d="M8 5v14l11-7z" />
            </Box>
            <Text fontSize="12px" color="white" fontWeight="500">
              {playlist.videoCount === 0 ? "No videos" : "Play all"}
            </Text>
          </Flex>

          <Flex
            align="center"
            gap="6px"
            bg={playlist.videoCount === 0 ? "#1a1a1a" : "#323232"}
            px="12px"
            py="6px"
            borderRadius="18px"
            cursor={playlist.videoCount === 0 ? "not-allowed" : "pointer"}
            fontSize="12px"
            opacity={playlist.videoCount === 0 ? 0.5 : 1}
            _hover={playlist.videoCount > 0 ? { bg: "#474747" } : {}}>
            <Box
              as="svg"
              width="14px"
              height="14px"
              viewBox="0 0 24 24"
              fill="currentColor"
              color="white">
              <path d="M18.4 7.7L16.6 6l-6.7 6.7-6.7-6.7L1.6 7.7l8.4 8.4 8.4-8.4z" />
            </Box>
            <Text fontSize="12px" color="white" fontWeight="500">
              Shuffle
            </Text>
          </Flex>
        </HStack>
      </Box>

      {/* Video List - Scrollable */}
      <Box
        flex="1"
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#0f0f0f",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#323232",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#474747",
          },
        }}>
        {playlistVideos.length === 0 ? (
          <Flex
            justify="center"
            align="center"
            h="200px"
            direction="column"
            gap="12px">
            <Text color="gray.400" fontSize="14px" textAlign="center">
              This playlist is empty
            </Text>
            <Text color="gray.500" fontSize="12px" textAlign="center">
              No videos have been added yet.
            </Text>
          </Flex>
        ) : (
          <VStack spacing="0" align="stretch">
            {playlistVideos.map((video, index) => {
              const isCurrentVideo = video.id == currentVideoId;

              return (
                <Flex
                  key={video.id}
                  p="6px 12px"
                  cursor="pointer"
                  bg={isCurrentVideo ? "#323232" : "transparent"}
                  borderLeft={
                    isCurrentVideo
                      ? "3px solid #ff0000"
                      : "3px solid transparent"
                  }
                  _hover={{ bg: isCurrentVideo ? "#323232" : "#1f1f1f" }}
                  onClick={() => !isCurrentVideo && handleVideoClick(video.id)}>
                  {/* Video Index */}
                  <Box minW="20px" pt="2px" mr="8px">
                    <Text
                      fontSize="12px"
                      color={isCurrentVideo ? "#ff0000" : "#aaaaaa"}
                      fontWeight={isCurrentVideo ? "600" : "400"}>
                      {index + 1}
                    </Text>
                  </Box>

                  {/* Thumbnail */}
                  <Box
                    position="relative"
                    w="80px"
                    h="45px"
                    borderRadius="6px"
                    overflow="hidden"
                    flexShrink={0}
                    mr="8px">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      w="full"
                      h="full"
                      objectFit="cover"
                    />

                    {/* Duration */}
                    <Box
                      position="absolute"
                      bottom="2px"
                      right="2px"
                      bg="rgba(0, 0, 0, 0.8)"
                      color="white"
                      px="3px"
                      py="1px"
                      borderRadius="3px"
                      fontSize="10px"
                      fontWeight="600">
                      {formatDuration(video.duration)}
                    </Box>
                  </Box>

                  {/* Video Info */}
                  <Box flex="1" minW="0">
                    <Text
                      fontSize="12px"
                      fontWeight="500"
                      color={isCurrentVideo ? "#ff0000" : "white"}
                      lineHeight="16px"
                      noOfLines={2}
                      mb="2px">
                      {video.title}
                    </Text>

                    <Text fontSize="11px" color="#aaaaaa" noOfLines={1}>
                      {video.channelName}
                    </Text>
                  </Box>
                </Flex>
              );
            })}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default PlaylistSidebar;
