import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { loadVideoById } from "../hooks/videoDataLoader";
import WatchPage from "../pages/WatchPage";
import { Box, Spinner, Text, Center } from "@chakra-ui/react";

const WatchPageWrapper = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      setError(null);

      try {
        const videoData = await loadVideoById(id);
        if (videoData) {
          setVideo(videoData);
        } else {
          setError(`Video with ID ${id} not found`);
        }
      } catch (err) {
        setError("Failed to load video");
        console.error("Error loading video:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVideo();
    } else {
      setError("No video ID provided");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <Center minH="100vh" bg="black">
        <Box textAlign="center">
          <Spinner
            thickness="4px"
            speed="0.8s"
            emptyColor="gray.200"
            color="red.500"
            size="xl"
            mb={4}
          />
          <Text color="white">Loading video...</Text>
        </Box>
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="100vh" bg="black">
        <Box textAlign="center">
          <Text color="white" fontSize="xl" mb={4}>
            {error}
          </Text>
          <Text color="gray.400">Please check the video ID and try again.</Text>
        </Box>
      </Center>
    );
  }

  if (!video) {
    return (
      <Center minH="100vh" bg="black">
        <Text color="white" fontSize="xl">
          Video not found
        </Text>
      </Center>
    );
  }

  return (
    <WatchPage
      videoId={id}
      videoUrl={video.videoUrl}
      title={video.title}
      channelName={video.channelName}
      subscriberCount="1M" // You can add this to video data later
      description={video.description}
      likes="100" // You can add this to video data later
      dislikes="5" // You can add this to video data later
      views={video.views}
      uploadDate={video.uploadDate}
    />
  );
};

export default WatchPageWrapper;
