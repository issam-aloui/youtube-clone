import { Button, Text, Flex } from "@chakra-ui/react";

const IconButton = ({
  icon,
  src,
  text,
  size = "md",
  variant = "ghost",
  onClick,
  "aria-label": ariaLabel = "Menu button",
  alt = "Icon",
  iconSize = "24px",
  fontSize = "14px",
  gap = 2,
  ...props
}) => {
  // Use icon prop, then src prop
  const iconSrc = icon || src;
  if (!iconSrc) {
    console.error("IconButton requires either 'icon' or 'src' prop.");
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      aria-label={ariaLabel}
      display="flex"
      alignItems="center"
      justifyContent="center"
      minW="auto"
      h="40px"
      w={text ? "auto" : "40px"}
      px={text ? 3 : 2}
      py={2}
      borderRadius="3xl"
      bg="transparent"
      color="white"
      _hover={{
        bg: "rgba(255, 255, 255, 0.1)",
        transform: "scale(1.05)",
        transition: "all 0.2s ease-in-out",
      }}
      _active={{
        bg: "rgba(255, 255, 255, 0.4)",
        transform: "scale(0.95)",
        transition: "all 0.1s ease-in-out",
      }}
      transition="all 0.2s ease-in-out"
      {...props}>
      <Flex align="center" gap={gap}>
        <img
          src={iconSrc}
          alt={alt}
          style={{
            width: iconSize,
            height: iconSize,
            flexShrink: 0,
          }}
        />
        {text && (
          <Text
            fontSize={fontSize}
            fontWeight="400"
            whiteSpace="nowrap"
            color="inherit">
            {text}
          </Text>
        )}
      </Flex>
    </Button>
  );
};

export default IconButton;
