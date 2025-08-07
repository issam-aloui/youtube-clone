import { Box, Text, Flex } from "@chakra-ui/react";
import { memo } from "react";

const AnchorButton = memo(({
  icon,
  text,
  href = "#",
  bg = "transparent",
  isActive = false,
  onClick,
  iconSize = "24px",
  fontSize = "14px",
  ...props
}) => {
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Box
      as="a"
      href={href}
      onClick={handleClick}
      display="flex"
      alignItems="center"
      w="full"
      bg={isActive ? "rgba(255, 255, 255, 0.1)" : bg}
      color="white"
      textDecoration="none"
      borderRadius="md"
      transition="all 0.2s ease-in-out"
      _hover={{
        bg: "rgba(255, 255, 255, 0.1)",
        textDecoration: "none",
      }}
      _active={{
        bg: "rgba(255, 255, 255, 0.15)",
      }}
      _focus={{
        outline: "none",
        boxShadow: "0 0 0 2px rgba(61, 166, 255, 0.3)",
      }}
      className="!px-3 !py-2"
      {...props}>
      <Flex align="center" gap={6} w="full">
        {icon && (
          <img
            src={icon}
            alt={text || "Icon"}
            style={{
              width: iconSize,
              height: iconSize,
              flexShrink: 0,
            }}
          />
        )}
        {text && (
          <Text
            fontSize={fontSize}
            fontWeight="400"
            whiteSpace="nowrap"
            color="inherit"
            overflow="hidden"
            textOverflow="ellipsis">
            {text}
          </Text>
        )}
      </Flex>
    </Box>
  );
});

export default AnchorButton;
