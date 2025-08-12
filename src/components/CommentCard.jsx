import React, { useState } from "react";
import { Box, Text, HStack, VStack, Flex, Input, Button } from "@chakra-ui/react";
import { useFormatNumber, useFormatTimeAgo } from "../hooks/formatters";
import likedIcon from "../assets/icons/white_icons/liked.svg";
import dislikedIcon from "../assets/icons/white_icons/DisLiked.svg";
import downArrowIcon from "../assets/icons/white_icons/down_arrow.svg";

const CommentCard = ({
  comment,
  onLike,
  onDislike,
  onReply,
  isReply = false,
  replyTo = null,
}) => {
  const formatNumber = useFormatNumber();
  const formatTimeAgo = useFormatTimeAgo();
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  // Helper function to create basic avatar if using pravatar or no avatar
  const getAvatarSrc = (userAvatar, username) => {
    if (!userAvatar || userAvatar.includes('pravatar.cc')) {
      const initial = username.charAt(0).toUpperCase();
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
      const colorIndex = username.length % colors.length;
      const bgColor = colors[colorIndex];
      
      return `data:image/svg+xml,%3csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='40' height='40' fill='${encodeURIComponent(bgColor)}'/%3e%3ctext x='50%25' y='50%25' font-size='18' fill='white' text-anchor='middle' dy='.3em' font-family='Arial'%3e${initial}%3c/text%3e%3c/svg%3e`;
    }
    return userAvatar;
  };

  const {
    id,
    username,
    userAvatar,
    commentText,
    timestamp,
    likes = 0,
    dislikes = 0,
    replies = [],
    isPinned = false,
    isChannelOwner = false,
    isLiked = false,
    isDisliked = false,
  } = comment;

  const handleLike = () => {
    onLike(id);
  };

  const handleDislike = () => {
    onDislike(id);
  };

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    onReply(id, replyText.trim());
    setReplyText("");
    setShowReplyInput(false);
    setShowReplies(true); // Show replies after adding one
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleReplySubmit();
    }
  };
  return (
    <Box mb="16px" fontFamily="Roboto, sans-serif" ml={isReply ? "52px" : "0"}>
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
              src={getAvatarSrc(userAvatar, username)}
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
            {isPinned && !isReply && (
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
                  Pinned by {username}
                </Text>
              </HStack>
            )}

            <HStack spacing="4px" align="center">
              <Text fontSize="13px" color="white" fontWeight="600">
                @{username}
              </Text>
              {/* Channel owner badge */}
              {isChannelOwner && (
                <Box
                  bg="gray.600"
                  px="6px"
                  py="1px"
                  borderRadius="2px"
                  fontSize="11px"
                  color="white"
                  fontWeight="500">
                  Creator
                </Box>
              )}
            </HStack>
            
            <Text fontSize="12px" color="#aaa">
              {formatTimeAgo(timestamp)}
            </Text>
          </HStack>

          {/* Reply indicator */}
          {isReply && replyTo && (
            <Text fontSize="12px" color="#aaa" mb="4px">
              Replying to <Text as="span" color="#3ea6ff">@{replyTo}</Text>
            </Text>
          )}

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
              onClick={handleLike}
              _hover={{ bg: "rgba(255,255,255,0.1)" }}
              borderRadius="18px"
              px="8px"
              py="4px"
              transition="background-color 0.2s"
              bg={isLiked ? "rgba(59, 130, 246, 0.1)" : "transparent"}>
              <Box
                w="16px"
                h="16px"
                display="flex"
                alignItems="center"
                justifyContent="center">
                <img
                  src={likedIcon}
                  alt="Like"
                  style={{ 
                    width: "16px", 
                    height: "16px",
                    filter: isLiked ? "brightness(0) saturate(100%) invert(45%) sepia(96%) saturate(1945%) hue-rotate(197deg) brightness(98%) contrast(103%)" : "none"
                  }}
                />
              </Box>
              {likes > 0 && (
                <Text fontSize="12px" color={isLiked ? "#3b82f6" : "#aaa"}>
                  {formatNumber(likes)}
                </Text>
              )}
            </HStack>

            {/* Dislike Button */}
            <HStack
              spacing="6px"
              cursor="pointer"
              onClick={handleDislike}
              _hover={{ bg: "rgba(255,255,255,0.1)" }}
              borderRadius="18px"
              px="8px"
              py="4px"
              transition="background-color 0.2s"
              bg={isDisliked ? "rgba(239, 68, 68, 0.1)" : "transparent"}>
              <Box
                w="16px"
                h="16px"
                display="flex"
                alignItems="center"
                justifyContent="center">
                <img
                  src={dislikedIcon}
                  alt="Dislike"
                  style={{ 
                    width: "16px", 
                    height: "16px",
                    filter: isDisliked ? "brightness(0) saturate(100%) invert(34%) sepia(93%) saturate(1352%) hue-rotate(334deg) brightness(98%) contrast(96%)" : "none"
                  }}
                />
              </Box>
              {dislikes > 0 && (
                <Text fontSize="12px" color={isDisliked ? "#ef4444" : "#aaa"}>
                  {formatNumber(dislikes)}
                </Text>
              )}
            </HStack>

            {/* Reply Button */}
            <Text
              fontSize="12px"
              color="#aaa"
              cursor="pointer"
              onClick={() => setShowReplyInput(!showReplyInput)}
              _hover={{ color: "white" }}
              transition="color 0.2s"
              fontWeight="600">
              Reply
            </Text>
          </HStack>

          {/* Reply Input */}
          {showReplyInput && (
            <Box mt="12px">
              <Flex gap="8px" align="flex-start">
                <Input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Reply to @${username}...`}
                  fontSize="14px"
                  color="white"
                  bg="transparent"
                  border="1px solid #333"
                  borderRadius="18px"
                  px="12px"
                  py="8px"
                  _placeholder={{ color: "#aaa" }}
                  _focus={{
                    borderColor: "white",
                    boxShadow: "none",
                  }}
                />
                <HStack spacing="8px">
                  <Button
                    size="sm"
                    variant="ghost"
                    color="white"
                    onClick={() => {
                      setReplyText("");
                      setShowReplyInput(false);
                    }}
                    _hover={{ bg: "rgba(255,255,255,0.1)" }}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    bg={replyText.trim() ? "blue.500" : "gray.600"}
                    color="white"
                    isDisabled={!replyText.trim()}
                    onClick={handleReplySubmit}
                    _hover={{
                      bg: replyText.trim() ? "blue.600" : "gray.600",
                    }}>
                    Reply
                  </Button>
                </HStack>
              </Flex>
            </Box>
          )}

          {/* Replies Count and Toggle */}
          {replies.length > 0 && (
            <HStack
              mt="12px"
              spacing="8px"
              cursor="pointer"
              onClick={() => setShowReplies(!showReplies)}
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
                justifyContent="center"
                transform={showReplies ? "rotate(180deg)" : "rotate(0deg)"}
                transition="transform 0.2s">
                <img
                  src={downArrowIcon}
                  alt={showReplies ? "Hide replies" : "Show replies"}
                  style={{ width: "16px", height: "16px" }}
                />
              </Box>
              <Text fontSize="14px" color="#3ea6ff" fontWeight="600">
                {showReplies ? "Hide" : "Show"} {replies.length} {replies.length === 1 ? "reply" : "replies"}
              </Text>
            </HStack>
          )}
        </Box>
      </Flex>

      {/* Replies */}
      {showReplies && replies.length > 0 && (
        <Box mt="8px">
          {replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              onLike={onLike}
              onDislike={onDislike}
              onReply={onReply}
              isReply={true}
              replyTo={username}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CommentCard;
