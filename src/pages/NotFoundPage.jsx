import { Flex, Box, Text, Button } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Flex
      direction="column"
      h="full"
      w="full"
      justify="center"
      align="center"
      p="24px">
      <Box
        bg="gray.900"
        borderColor="gray.700"
        border="1px solid"
        borderRadius="12px"
        p="32px"
        maxW="500px"
        textAlign="center">
        {/* Icon */}
        <Box
          w="80px"
          h="80px"
          bg="red.500"
          borderRadius="50%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          mx="auto"
          mb="24px">
          <Text fontSize="32px" color="white" fontWeight="bold">
            404
          </Text>
        </Box>

        {/* Title */}
        <Text fontSize="24px" fontWeight="600" color="white" mb="12px">
          Page Not Found
        </Text>

        {/* Description */}
        <Text fontSize="16px" color="gray.300" mb="8px" lineHeight="1.5">
          The page{" "}
          <code
            style={{
              background: "#1a1a1a",
              padding: "2px 6px",
              borderRadius: "4px",
            }}>
            {location.pathname}
          </code>{" "}
          is not built yet.
        </Text>

        <Text fontSize="14px" color="gray.400" mb="32px" lineHeight="1.5">
          This feature is coming soon!
        </Text>

        {/* Actions */}
        <Box display="flex" gap="12px" justifyContent="center" flexWrap="wrap">
          <Button colorScheme="red" size="md" onClick={() => navigate("/")}>
            Go Home
          </Button>
          <Button
            variant="outline"
            color="white"
            __hover={{ bg: "white", color: "black" }}
            size="md"
            onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Box>
      </Box>
    </Flex>
  );
}
