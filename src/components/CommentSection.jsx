import React from "react";
import { Box, Text, HStack, VStack, Flex } from "@chakra-ui/react";
import CommentCard from "./CommentCard";
import { useFormatNumber } from "../hooks/formatters";
import moreIcon from "../assets/icons/white_icons/more.svg";
import profilePicture from "../assets/images/profilePicture.jpg";

const CommentSection = ({ commentCount = 0, comments = [] }) => {
  const formatNumber = useFormatNumber();
  return (
    <Box mt="24px" fontFamily="Roboto, sans-serif">
      {/* Comments Header */}
      <HStack spacing="24px" mb="24px" align="center">
        <Text fontSize="20px" color="white" fontWeight="600">
          {formatNumber(commentCount)} Comments
        </Text>

        {/* Sort by dropdown */}
        <HStack
          spacing="8px"
          cursor="pointer"
          _hover={{ bg: "rgba(255,255,255,0.1)" }}
          borderRadius="8px"
          px="8px"
          py="4px">
          <Box
            w="16px"
            h="16px"
            display="flex"
            alignItems="center"
            justifyContent="center">
            <img
              src={moreIcon}
              alt="Sort"
              style={{ width: "16px", height: "16px" }}
            />
          </Box>
          <Text fontSize="14px" color="white" fontWeight="600">
            Sort by
          </Text>
        </HStack>
      </HStack>

      {/* Add Comment Section */}
      <Flex gap="12px" mb="32px">
        {/* User Avatar */}
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
          <img
            src={profilePicture}
            alt="Your avatar"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%",
            }}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.innerHTML = "Y";
              e.target.parentElement.style.color = "white";
              e.target.parentElement.style.fontSize = "16px";
              e.target.parentElement.style.fontWeight = "600";
            }}
          />
        </Box>

        {/* Comment Input */}
        <Box flex="1" borderBottom="1px solid #333" pb="8px">
          <Text
            fontSize="14px"
            color="#aaa"
            cursor="text"
            _hover={{ color: "white" }}
            transition="color 0.2s">
            Add a comment...
          </Text>
        </Box>
      </Flex>

      {/* Comments List */}
      <VStack spacing="0" align="stretch">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentCard
              key={comment.id}
              username={comment.username}
              userAvatar={comment.userAvatar}
              commentText={comment.commentText}
              timestamp={comment.timestamp}
              likes={comment.likes}
              dislikes={comment.dislikes}
              replyCount={comment.replyCount}
              isPinned={comment.isPinned}
            />
          ))
        ) : (
          <Box py="40px" textAlign="center">
            <Text fontSize="16px" color="#aaa" fontFamily="Roboto, sans-serif">
              No comments yet. Be the first to comment!
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default CommentSection;
