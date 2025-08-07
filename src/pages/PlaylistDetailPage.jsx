import {
  Box,
  Flex,
  Text,
  Image,
  VStack,
  HStack,
  Button,
  SimpleGrid,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import data_fetch from "../hooks/data_fetch";
import { loadVideoById } from "../hooks/videoDataLoader";
import { getLikedVideos } from "../hooks/userInteractions";
import { SpinnerLoader } from "../components/loaders";
import {
  useFormatTimeAgo,
  useFormatDuration,
  useFormatViews,
} from "../hooks/formatters";

export default function PlaylistDetailPage() {
  const [playlist, setPlaylist] = useState(null);
  const [playlistVideos, setPlaylistVideos] = useState([]);
  const [firstVideoThumbnail, setFirstVideoThumbnail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const formatTimeAgo = useFormatTimeAgo();
  const formatDuration = useFormatDuration();
  const formatViews = useFormatViews();

  const playlistId = searchParams.get("id");

  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!playlistId) {
          setError("No playlist ID provided");
          return;
        }

        // Fetch playlist info
        const playlistData = await data_fetch(
          `/data/playlists/${playlistId}.json`
        );

        if (playlistData) {
          // Handle dynamic playlists (like liked videos)
          let videoIds = playlistData.videoIds;
          if (playlistData.isDynamic && playlistId === "liked-videos") {
            videoIds = getLikedVideos();
          }

          // Make videoIds unique
          const uniqueVideoIds = [...new Set(videoIds)];
          const updatedPlaylist = {
            ...playlistData,
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

          const validVideos = videos.filter(Boolean);
          setPlaylistVideos(validVideos);

          // Set first video thumbnail if playlist thumbnail is null
          if (!playlistData.thumbnail && validVideos.length > 0) {
            setFirstVideoThumbnail(validVideos[0].thumbnail);
          }
        }
      } catch (error) {
        console.error("Error loading playlist:", error);
        setError("Failed to load playlist");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylistData();
  }, [playlistId]);

  const handleVideoClick = (videoId) => {
    navigate(`/watch/${videoId}?playlist=${playlistId}`);
  };

  const handlePlayAll = () => {
    if (playlistVideos.length > 0) {
      navigate(`/watch/${playlistVideos[0].id}?playlist=${playlistId}`);
    }
  };

  if (isLoading) {
    return (
      <SpinnerLoader
        color="white"
        thickness="3px"
        fullHeight={true}
        text="Loading playlist..."
        textColor="white"
      />
    );
  }

  if (error || !playlist) {
    return (
      <Flex
        justify="center"
        align="center"
        minH="50vh"
        direction="column"
        gap="16px">
        <Text color="red.400" fontSize="18px">
          {error || "Playlist not found"}
        </Text>
        <Button
          colorScheme="red"
          variant="outline"
          onClick={() => navigate("/playlists")}>
          Back to Playlists
        </Button>
      </Flex>
    );
  }

  const displayThumbnail = playlist.thumbnail || firstVideoThumbnail;

  return (
    <Flex direction="row" h="full" w="full" p="20px" gap="20px">
      {/* Left Side - Playlist Info (33% width) */}
      <Box w="33%" flexShrink={0}>
        <Box
          bg="#0f0f0f"
          borderRadius="12px"
              overflow="hidden"
              border="1px solid #323232">
              {/* Playlist Thumbnail */}
              <Box
                position="relative"
                w="100%"
                aspectRatio="16/9"
                bg="gray.700">
                {displayThumbnail ? (
                  <Image
                    src={displayThumbnail}
                    alt={playlist.title}
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
                    <Text color="gray.400" fontSize="16px">
                      No thumbnail
                    </Text>
                  </Box>
                )}

                {/* Video Count Badge */}
                <Box
                  position="absolute"
                  bottom="12px"
                  right="12px"
                  bg="rgba(0, 0, 0, 0.85)"
                  color="white"
                  px="12px"
                  py="6px"
                  borderRadius="8px"
                  fontSize="14px"
                  fontWeight="600"
                  display="flex"
                  alignItems="center"
                  gap="6px">
                  <Box
                    as="svg"
                    width="16px"
                    height="16px"
                    viewBox="0 0 24 24"
                    fill="currentColor">
                    <path d="M22 7H2v1h20V7zm-9 5H2v-1h11v1zm0 4H2v-1h11v1zm2 3H2v-1h13v1zm0-4H2v-1h13v1zm8-3.5L19 14v-4l4-2.5z" />
                  </Box>
                  {playlist.videoCount} videos
                </Box>
              </Box>

              {/* Playlist Details */}
              <Box p="20px">
                {/* Title */}
                <Text
                  fontSize="24px"
                  fontWeight="600"
                  color="white"
                  lineHeight="1.3"
                  mb="12px">
                  {playlist.title}
                </Text>

                {/* Status */}
                <Text
                  fontSize="16px"
                  color="#aaaaaa"
                  mb="8px"
                  textTransform="capitalize"
                  fontWeight="500">
                  {playlist.status} playlist
                </Text>

                {/* Last Updated */}
                <Text fontSize="14px" color="#aaaaaa" mb="16px">
                  Updated {formatTimeAgo(playlist.lastTimeUpdate)}
                </Text>

                {/* Description */}
                <Text
                  fontSize="14px"
                  color="#cccccc"
                  lineHeight="1.5"
                  mb="20px"
                  whiteSpace="pre-wrap">
                  {playlist.description}
                </Text>

                {/* Play All Button */}
                <Button
                  colorScheme="red"
                  size="lg"
                  w="full"
                  leftIcon={
                    <Box
                      as="svg"
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                      fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </Box>
                  }
                  onClick={handlePlayAll}
                  isDisabled={playlistVideos.length === 0}>
                  {playlistVideos.length === 0 ? "No videos" : "Play all"}
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Right Side - Videos (66% width) */}
          <Box w="66%" flex="1">
            {playlistVideos.length === 0 ? (
              <Flex
                justify="center"
                align="center"
                h="full"
                direction="column"
                gap="16px">
                <Text color="gray.400" fontSize="18px">
                  This playlist is empty
                </Text>
                <Text color="gray.500" fontSize="14px">
                  No videos have been added to this playlist yet.
                </Text>
              </Flex>
            ) : (
              <VStack spacing="0" align="stretch">
                {playlistVideos.map((video, index) => (
                  <Flex
                    key={video.id}
                    p="12px"
                    cursor="pointer"
                    borderRadius="8px"
                    _hover={{ bg: "#1f1f1f" }}
                    onClick={() => handleVideoClick(video.id)}
                    gap="12px">
                    {/* Video Index */}
                    <Box minW="24px" pt="4px">
                      <Text
                        fontSize="14px"
                        color="#aaaaaa"
                        fontWeight="500"
                        textAlign="center">
                        {index + 1}
                      </Text>
                    </Box>

                    {/* Video Thumbnail */}
                    <Box
                      position="relative"
                      w="168px"
                      h="94px"
                      borderRadius="8px"
                      overflow="hidden"
                      flexShrink={0}>
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
                        bottom="4px"
                        right="4px"
                        bg="rgba(0, 0, 0, 0.8)"
                        color="white"
                        px="4px"
                        py="2px"
                        borderRadius="4px"
                        fontSize="12px"
                        fontWeight="600">
                        {formatDuration(video.duration)}
                      </Box>
                    </Box>

                    {/* Video Info */}
                    <Box flex="1" minW="0">
                      <Text
                        fontSize="16px"
                        fontWeight="500"
                        color="white"
                        lineHeight="1.4"
                        noOfLines={2}
                        mb="4px"
                        _hover={{ color: "#aaaaaa" }}>
                        {video.title}
                      </Text>

                      <Text fontSize="14px" color="#aaaaaa" mb="2px">
                        {video.channelName}
                      </Text>

                      <Text fontSize="14px" color="#aaaaaa">
                        {formatViews(video.views)} views •{" "}
                        {formatTimeAgo(video.uploadDate)}
                      </Text>
                    </Box>
                  </Flex>
                ))}
              </VStack>
            )}
          </Box>
        </Flex>
  );
}
