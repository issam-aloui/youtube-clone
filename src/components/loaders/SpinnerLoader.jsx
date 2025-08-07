import React from "react";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";

const SpinnerLoader = ({
  size = "xl",
  thickness = "4px",
  speed = "0.8s",
  color = "red.500",
  emptyColor = "gray.200",
  text = "Loading...",
  textColor = "gray.600",
  textSize = "sm",
  direction = "column",
  gap = 4,
  fullHeight = false,
  minHeight = "50vh",
  centerContent = true,
  gridColumn = null, // For grid layouts
  py = 8,
}) => {
  const content = (
    <Flex
      direction={direction}
      align="center"
      justify="center"
      gap={gap}
      minH={fullHeight ? "100vh" : minHeight}
      py={py}>
      <Spinner
        thickness={thickness}
        speed={speed}
        emptyColor={emptyColor}
        color={color}
        size={size}
      />
      {text && (
        <Text color={textColor} fontSize={textSize}>
          {text}
        </Text>
      )}
    </Flex>
  );

  // For grid layouts (like "loading more" in grids)
  if (gridColumn) {
    return (
      <Box gridColumn={gridColumn} py={py}>
        {content}
      </Box>
    );
  }

  // For centered full-screen loading
  if (centerContent) {
    return content;
  }

  // For inline loading
  return <Box py={py}>{content}</Box>;
};

export default SpinnerLoader;
