import React from "react";
import { Box, Text, HStack, VStack, Flex } from "@chakra-ui/react";
import { useFormatNumber, useFormatTimeAgo } from "../hooks/formatters";

const CommentCard = ({
  username,
  userAvatar,
  commentText,
  timestamp,
  likes = 0,
  dislikes = 0,
  replyCount = 0,
  isPinned = false,
}) => {
  const formatNumber = useFormatNumber();
  const formatTimeAgo = useFormatTimeAgo();
  return (
    <Box mb="16px" fontFamily="Roboto, sans-serif">
      <Flex align="flex-start" gap="12px">
        {/* Avatar */}
        <Box
          w="40px"
          h="40px"
          borderRadius="50%"
          overflow="hidden"
          bg="gray.600"
          flexShrink={0}
          display="flex"
          alignItems="center"
          justifyContent="center">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={username}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML = (username ||
                  "U")[0].toUpperCase();
                e.target.parentElement.style.color = "white";
                e.target.parentElement.style.fontSize = "16px";
                e.target.parentElement.style.fontWeight = "600";
              }}
            />
          ) : (
            <Text color="white" fontSize="16px" fontWeight="600">
              {(username || "U")[0].toUpperCase()}
            </Text>
          )}
        </Box>

        {/* Comment Content */}
        <Box flex="1" minW="0">
          {/* Username and Time */}
          <HStack spacing="8px" mb="4px" align="center">
            {/* Pinned indicator */}
            {isPinned && (
              <HStack spacing="4px" align="center">
                <Box
                  w="16px"
                  h="16px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center">
                  <img
                    src="https://img.icons8.com/material-outlined/16/ffffff/pin.png"
                    alt="Pinned"
                    style={{ width: "14px", height: "14px" }}
                  />
                </Box>
                <Text fontSize="13px" color="#aaa" fontWeight="500">
                  Pinned by
                </Text>
              </HStack>
            )}

            <Text fontSize="13px" color="white" fontWeight="600">
              @{username}
            </Text>
            <Text fontSize="12px" color="#aaa">
              {formatTimeAgo(timestamp)}
            </Text>
          </HStack>

          {/* Comment Text */}
          <Text
            fontSize="14px"
            color="white"
            lineHeight="1.4"
            mb="8px"
            whiteSpace="pre-wrap">
            {commentText}
          </Text>

          {/* Like/Dislike and Reply Section */}
          <HStack spacing="16px" align="center">
            {/* Like Button */}
            <HStack
              spacing="6px"
              cursor="pointer"
              _hover={{ bg: "rgba(255,255,255,0.1)" }}
              borderRadius="18px"
              px="8px"
              py="4px"
              transition="background-color 0.2s">
              <Box
                w="16px"
                h="16px"
                display="flex"
                alignItems="center"
                justifyContent="center">
                <img
                  src="/src/assets/icons/white_icons/liked.svg"
                  alt="Like"
                  style={{ width: "16px", height: "16px" }}
                />
              </Box>
              {likes > 0 && (
                <Text fontSize="12px" color="#aaa">
                  {formatNumber(likes)}
                </Text>
              )}
            </HStack>

            {/* Dislike Button */}
            <HStack
              spacing="6px"
              cursor="pointer"
              _hover={{ bg: "rgba(255,255,255,0.1)" }}
              borderRadius="18px"
              px="8px"
              py="4px"
              transition="background-color 0.2s">
              <Box
                w="16px"
                h="16px"
                display="flex"
                alignItems="center"
                justifyContent="center">
                <img
                  src="/src/assets/icons/white_icons/DisLiked.svg"
                  alt="Dislike"
                  style={{ width: "16px", height: "16px" }}
                />
              </Box>
              {dislikes > 0 && (
                <Text fontSize="12px" color="#aaa">
                  {formatNumber(dislikes)}
                </Text>
              )}
            </HStack>

            {/* Reply Button */}
            <Text
              fontSize="12px"
              color="#aaa"
              cursor="pointer"
              _hover={{ color: "white" }}
              transition="color 0.2s"
              fontWeight="600">
              Reply
            </Text>
          </HStack>

          {/* Replies Count */}
          {replyCount > 0 && (
            <HStack
              mt="12px"
              spacing="8px"
              cursor="pointer"
              _hover={{ bg: "rgba(255,255,255,0.1)" }}
              borderRadius="18px"
              px="8px"
              py="6px"
              w="fit-content"
              transition="background-color 0.2s">
              <Box
                w="16px"
                h="16px"
                display="flex"
                alignItems="center"
                justifyContent="center">
                <img
                  src="/src/assets/icons/white_icons/down_arrow.svg"
                  alt="Show replies"
                  style={{ width: "16px", height: "16px" }}
                />
              </Box>
              <Text fontSize="14px" color="#3ea6ff" fontWeight="600">
                {replyCount} {replyCount === 1 ? "reply" : "replies"}
              </Text>
            </HStack>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default CommentCard;
