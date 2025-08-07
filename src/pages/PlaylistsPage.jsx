import PlaylistCard from "../components/PlaylistCard";
import {
  SimpleGrid,
  Box,
  Flex,
  Text,
  Heading,
  HStack,
  Button,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SpinnerLoader } from "../components/loaders";
import data_fetch from "../hooks/data_fetch";
import { getLikedVideos } from "../hooks/userInteractions";
import { loadVideoById } from "../hooks/videoDataLoader";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylistsData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch playlist index
        const playlistIds = await data_fetch("/data/playlists/index.json");

        // Fetch each playlist individually
        const playlistsData = await Promise.all(
          playlistIds.map(async (playlistId) => {
            try {
              const playlist = await data_fetch(
                `/data/playlists/${playlistId}.json`
              );
              // Handle dynamic playlists (like liked videos)
              let videoIds = playlist.videoIds;
              if (playlist.isDynamic && playlistId === "liked-videos") {
                videoIds = getLikedVideos();
              }

              // Make videoIds unique
              const uniqueVideoIds = [...new Set(videoIds)];
              return {
                ...playlist,
                videoIds: uniqueVideoIds,
              };
            } catch (error) {
              console.error(`Error loading playlist ${playlistId}:`, error);
              return null;
            }
          })
        );

        // Filter out failed loads
        const validPlaylists = playlistsData.filter(Boolean);

        setPlaylists(validPlaylists);
      } catch (error) {
        console.error("Error loading playlists:", error);
        setError("Failed to load playlists");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylistsData();
  }, []);

  const handlePlaylistClick = (playlistId) => {
    // Find the playlist and navigate to the first video
    const playlist = playlists.find((p) => p.id === playlistId);
    if (playlist && playlist.videoIds && playlist.videoIds.length > 0) {
      const firstVideoId = playlist.videoIds[0];
      navigate(`/watch/${firstVideoId}?playlist=${playlistId}`);
    } else {
      // If no videos, navigate to playlist detail page
      navigate(`/playlist?id=${playlistId}`);
    }
  };

  if (error) {
    return (
      <Box h="full" w="full" overflowY="auto" p="20px">
        <Flex
          justify="center"
          align="center"
          minH="50vh"
          direction="column"
          gap="16px">
          <Text color="red.400" fontSize="18px">
            {error}
          </Text>
          <Button
            colorScheme="red"
            variant="outline"
            onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Flex>
      </Box>
    );
  }
  return (
    <Box h="full" w="full" overflowY="auto" p="20px">
      {/* Header */}
      <Box mb="32px">
        <Heading
          as="h1"
          size="2xl"
          color="white"
          fontSize={{ base: "28px", md: "36px" }}
          fontWeight="400"
          mb="24px">
          Playlists
        </Heading>
      </Box>

      {/* Content */}
      {isLoading ? (
        <SpinnerLoader
          color="white"
          thickness="3px"
          text="Loading playlists..."
          textColor="white"
        />
      ) : playlists.length === 0 ? (
        <Flex
          justify="center"
          align="center"
          minH="50vh"
          direction="column"
          gap="16px">
          <Text color="gray.400" fontSize="18px">
            No playlists found
          </Text>
        </Flex>
      ) : (
        <SimpleGrid
          columns={{ base: 1, sm: 1, md: 2, lg: 3, xl: 4 }}
          spacing="20px"
          gap={4}
          w="full">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              id={playlist.id}
              title={playlist.title}
              status={playlist.status}
              lastTimeUpdate={playlist.lastTimeUpdate}
              videoIds={playlist.videoIds}
              thumbnail={playlist.thumbnail}
              description={playlist.description}
              onClick={handlePlaylistClick}
            />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
