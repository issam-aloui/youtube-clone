import React, { useState, useEffect } from "react";
import { Box, Text, HStack, VStack, Flex, Input, Button } from "@chakra-ui/react";
import CommentCard from "./CommentCard";
import { useFormatNumber } from "../hooks/formatters";
import moreIcon from "../assets/icons/white_icons/more.svg";
import profilePicture from "../assets/images/profilePicture.jpg";

const CommentSection = ({ channelName = "Unknown Channel", videoId }) => {
  const formatNumber = useFormatNumber();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Local storage key for comments
  const getStorageKey = () => `youtube-comments-${videoId}`;

  // Load comments from JSON file or localStorage
  useEffect(() => {
    const loadComments = async () => {
      try {
        // First try to load from JSON file - account for base path
        const basePath = import.meta.env.BASE_URL || '/';
        const url = `${basePath}data/comments/${videoId}.json`;
        console.log(`Attempting to fetch: ${url}`);
        const response = await fetch(url);
        console.log(`Fetch response status: ${response.status}`);
        
        if (response.ok) {
          const commentsData = await response.json();
          console.log(`Successfully loaded ${commentsData.length} comments for video ${videoId}`);
          setComments(commentsData);
          
          // Also save to localStorage for persistence of user interactions
          const storageKey = getStorageKey();
          localStorage.setItem(storageKey, JSON.stringify(commentsData));
        } else {
          throw new Error(`JSON file not found - Status: ${response.status}`);
        }
      } catch (error) {
        console.log(`No comment file found for video ${videoId}, checking localStorage...`, error.message);
        
        // Fallback to localStorage
        const storageKey = getStorageKey();
        const savedComments = localStorage.getItem(storageKey);
        
        if (savedComments) {
          try {
            const parsedComments = JSON.parse(savedComments);
            console.log(`Loaded ${parsedComments.length} comments from localStorage for video ${videoId}`);
            setComments(parsedComments);
          } catch (parseError) {
            console.error('Error parsing saved comments:', parseError);
            // Create initial channel comment if parsing fails
            createInitialComment();
          }
        } else {
          // Create initial channel comment if no saved comments
          console.log(`No saved comments found, creating initial comment for video ${videoId}`);
          createInitialComment();
        }
      }
    };

    if (videoId) {
      loadComments();
    }
  }, [channelName, videoId]);

  // Save comments to localStorage whenever comments change
  useEffect(() => {
    if (comments.length > 0) {
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(comments));
    }
  }, [comments, videoId]);

  const createInitialComment = () => {
    // Only create the threatening subscription comment if the current user is the channel owner
    const currentUser = "gigachad"; // This could be retrieved from user context/auth in a real app
    
    if (channelName.toLowerCase() === currentUser.toLowerCase()) {
      const channelComment = {
        id: `channel-${videoId}-${Date.now()}`,
        username: channelName,
        userAvatar: profilePicture,
        commentText: "You better subscribe... I know where you live 😈",
        timestamp: new Date().toISOString(),
        likes: Math.floor(Math.random() * 1000) + 100,
        dislikes: Math.floor(Math.random() * 10),
        replies: [],
        isPinned: true,
        isChannelOwner: true,
        isLiked: false,
        isDisliked: false,
      };

      setComments([channelComment]);
    } else {
      // If user is not the channel owner, just set empty comments array
      setComments([]);
    }
  };

  // Helper function to create basic avatar based on username
  const createBasicAvatar = (username) => {
    const initial = username.charAt(0).toUpperCase();
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
    const colorIndex = username.length % colors.length;
    const bgColor = colors[colorIndex];
    
    return `data:image/svg+xml,%3csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='40' height='40' fill='${encodeURIComponent(bgColor)}'/%3e%3ctext x='50%25' y='50%25' font-size='18' fill='white' text-anchor='middle' dy='.3em' font-family='Arial'%3e${initial}%3c/text%3e%3c/svg%3e`;
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const currentUser = "gigachad";
    const userComment = {
      id: `user-${Date.now()}-${Math.random()}`,
      username: currentUser,
      userAvatar: createBasicAvatar(currentUser),
      commentText: newComment.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      replies: [],
      isPinned: false,
      isChannelOwner: false,
      isLiked: false,
      isDisliked: false,
    };

    setComments(prev => [userComment, ...prev]);
    setNewComment("");
    setIsInputFocused(false);
  };

  const handleLike = (commentId) => {
    setComments(prev => prev.map(comment => 
      updateCommentLike(comment, commentId)
    ));
  };

  const handleDislike = (commentId) => {
    setComments(prev => prev.map(comment => 
      updateCommentDislike(comment, commentId)
    ));
  };

  const updateCommentLike = (comment, targetId) => {
    if (comment.id === targetId) {
      const wasLiked = comment.isLiked;
      const wasDisliked = comment.isDisliked;
      
      return {
        ...comment,
        isLiked: !wasLiked,
        isDisliked: false,
        likes: wasLiked ? comment.likes - 1 : comment.likes + 1,
        dislikes: wasDisliked ? comment.dislikes - 1 : comment.dislikes,
      };
    }
    
    // Check replies
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: comment.replies.map(reply => updateCommentLike(reply, targetId))
      };
    }
    
    return comment;
  };

  const updateCommentDislike = (comment, targetId) => {
    if (comment.id === targetId) {
      const wasLiked = comment.isLiked;
      const wasDisliked = comment.isDisliked;
      
      return {
        ...comment,
        isLiked: false,
        isDisliked: !wasDisliked,
        likes: wasLiked ? comment.likes - 1 : comment.likes,
        dislikes: wasDisliked ? comment.dislikes - 1 : comment.dislikes + 1,
      };
    }
    
    // Check replies
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: comment.replies.map(reply => updateCommentDislike(reply, targetId))
      };
    }
    
    return comment;
  };

  const handleReply = (parentId, replyText) => {
    const currentUser = "gigachad";
    const reply = {
      id: `reply-${Date.now()}-${Math.random()}`,
      username: currentUser,
      userAvatar: createBasicAvatar(currentUser),
      commentText: replyText,
      timestamp: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      replies: [],
      isPinned: false,
      isChannelOwner: false,
      isLiked: false,
      isDisliked: false,
    };

    setComments(prev => prev.map(comment => 
      addReplyToComment(comment, parentId, reply)
    ));
  };

  const addReplyToComment = (comment, parentId, reply) => {
    if (comment.id === parentId) {
      return {
        ...comment,
        replies: [...comment.replies, reply]
      };
    }
    
    // Check replies for nested replies
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: comment.replies.map(r => addReplyToComment(r, parentId, reply))
      };
    }
    
    return comment;
  };

  const getTotalCommentsCount = (comments) => {
    return comments.reduce((total, comment) => {
      return total + 1 + (comment.replies ? comment.replies.length : 0);
    }, 0);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };
  return (
    <Box mt="24px" fontFamily="Roboto, sans-serif">
      {/* Comments Header */}
      <HStack spacing="24px" mb="24px" align="center">
        <Text fontSize="20px" color="white" fontWeight="600">
          {formatNumber(getTotalCommentsCount(comments))} Comments
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
            src={createBasicAvatar("gigachad")}
            alt="GigaChad"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%",
            }}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.innerHTML = "G";
              e.target.parentElement.style.color = "white";
              e.target.parentElement.style.fontSize = "16px";
              e.target.parentElement.style.fontWeight = "600";
            }}
          />
        </Box>

        {/* Comment Input */}
        <VStack flex="1" align="stretch" spacing="8px">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onKeyPress={handleKeyPress}
            placeholder="Add a comment..."
            fontSize="14px"
            color="white"
            bg="transparent"
            border="none"
            borderBottom="1px solid #333"
            borderRadius="0"
            _placeholder={{ color: "#aaa" }}
            _focus={{
              borderBottom: "2px solid white",
              boxShadow: "none",
            }}
            _hover={{
              borderBottom: "1px solid #555",
            }}
          />
          
          {/* Action buttons - only show when input is focused or has content */}
          {(isInputFocused || newComment.trim()) && (
            <HStack justify="flex-end" spacing="8px">
              <Button
                size="sm"
                variant="ghost"
                color="white"
                onClick={() => {
                  setNewComment("");
                  setIsInputFocused(false);
                }}
                _hover={{ bg: "rgba(255,255,255,0.1)" }}>
                Cancel
              </Button>
              <Button
                size="sm"
                bg={newComment.trim() ? "blue.500" : "gray.600"}
                color="white"
                isDisabled={!newComment.trim()}
                onClick={handleAddComment}
                _hover={{
                  bg: newComment.trim() ? "blue.600" : "gray.600",
                }}>
                Comment
              </Button>
            </HStack>
          )}
        </VStack>
      </Flex>

      {/* Comments List */}
      <VStack spacing="0" align="stretch">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onLike={handleLike}
              onDislike={handleDislike}
              onReply={handleReply}
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
