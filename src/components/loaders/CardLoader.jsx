import React from "react";
import {
  Box,
  Flex,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
} from "@chakra-ui/react";

const CardLoader = ({
  count = 1,
  aspectRatio = "16/9",
  showAvatar = true,
  titleLines = 2,
  metaLines = 1,
  metaWidth = "60%",
  gap = "12px",
  mb = "12px",
}) => {
  const loaderCards = Array.from({ length: count }, (_, index) => (
    <Box key={`card-loader-${index}`} w="full">
      {/* Thumbnail */}
      <Skeleton
        borderRadius="12px"
        w="full"
        aspectRatio={aspectRatio}
        mb={mb}
      />

      {/* Content */}
      <Flex gap={gap} align="start">
        {/* Avatar */}
        {showAvatar && <SkeletonCircle size="32px" flexShrink={0} />}

        {/* Text content */}
        <Box flex="1" minW="0">
          <SkeletonText noOfLines={titleLines} spacing="2" mb="4px" />
          <SkeletonText noOfLines={metaLines} w={metaWidth} />
        </Box>
      </Flex>
    </Box>
  ));

  if (count === 1) {
    return loaderCards[0];
  }

  return <>{loaderCards}</>;
};

export default CardLoader;
