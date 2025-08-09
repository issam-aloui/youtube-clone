import { Box, VStack, Text, Avatar, Flex } from "@chakra-ui/react";
import { useSidebar } from "../context/SidebarContext";
import { useLocation, useNavigate } from "react-router-dom";
import AnchorButton from "./AnchorButton";
import { useEffect, useState, memo, useMemo } from "react";
import IconButton from "./IconButton";

// Import icons
import homeIcon from "../assets/icons/white_icons/home.svg";
import subscriptionIcon from "../assets/icons/white_icons/subscription.svg";
import shortsIcon from "../assets/icons/white_icons/shorts.svg";
import historyIcon from "../assets/icons/white_icons/history.svg";
import playlistIcon from "../assets/icons/white_icons/playlist.svg";
import yourVideoIcon from "../assets/icons/white_icons/your_video.svg";
import watchLaterIcon from "../assets/icons/white_icons/watch_later.svg";
import likedIcon from "../assets/icons/white_icons/liked.svg";
import downloadsIcon from "../assets/icons/white_icons/library.svg"; // Changed from down_arrow to library
import exploreIcon from "../assets/icons/white_icons/explore.svg";
import down_arrow from "../assets/icons/white_icons/down_arrow.svg";
import HamburgerIcon from "../assets/icons/white_icons/hambarger.svg";
import YouTubeLogo from "../assets/icons/black_icons/Youtube_logo.svg";
//import hooks
import data_fetch from "../hooks/data_fetch";
import { getSubscribedChannels } from "../hooks/userInteractions";

const Sidebar = memo(() => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllSubscriptions, setShowAllSubscriptions] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Don't show active states on watch pages
  const isWatchPage = location.pathname.startsWith("/watch");

  useEffect(() => {
    // Load subscriptions from localStorage
    const loadSubscriptions = () => {
      try {
        setLoading(true);
        const subscribedChannelNames = getSubscribedChannels();

        // Create subscription objects from channel names
        const subscriptionData = subscribedChannelNames.map((channelName) => ({
          name: channelName,
          avatar: `data:image/svg+xml,%3csvg width='32' height='32' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='32' height='32' fill='%23666'/%3e%3ctext x='50%25' y='50%25' font-size='12' fill='white' text-anchor='middle' dy='.3em'%3e${channelName
            .charAt(0)
            .toUpperCase()}%3c/text%3e%3c/svg%3e`,
          isLive: Math.random() > 0.7, // Random live status for demo
        }));

        setSubscriptions(subscriptionData);
      } catch (error) {
        console.error("Error loading subscriptions");
        setSubscriptions([]);
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptions();

    // Listen for localStorage changes to update subscriptions in real-time
    const handleStorageChange = (e) => {
      if (e.key === "subscribedChannels") {
        loadSubscriptions();
      }
    };

    // Listen for custom subscription events (for same-tab updates)
    const handleSubscriptionChange = () => {
      loadSubscriptions();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("subscriptionChange", handleSubscriptionChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "subscriptionChange",
        handleSubscriptionChange
      );
    };
  }, []);

  const { isCollapsed, toggleSidebar } = useSidebar();

  // Function to handle show more/less subscriptions
  const handleShowMoreSubscriptions = () => {
    setShowAllSubscriptions(!showAllSubscriptions);
  };

  // Get displayed subscriptions (first 6 or all)
  const displayedSubscriptions = showAllSubscriptions
    ? subscriptions
    : subscriptions.slice(0, 6);

  // Memoized collapsed sidebar item component
  const CollapsedSidebarItem = memo(
    ({ icon, text, href, isActive = false }) => {
      const handleClick = (e) => {
        e.preventDefault();
        if (href !== "#") {
          navigate(href);
        }
      };

      return (
        <Box
          as="button"
          onClick={handleClick}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          w="full"
          py={3}
          px={2}
          bg={isActive ? "rgba(255, 255, 255, 0.1)" : "transparent"}
          color="white"
          textDecoration="none"
          borderRadius="md"
          border="none"
          cursor="pointer"
          transition="all 0.2s ease-in-out"
          _hover={{
            bg: "rgba(255, 255, 255, 0.1)",
            textDecoration: "none",
          }}>
          <img
            src={icon}
            alt={text}
            style={{ width: "24px", height: "24px", marginBottom: "4px" }}
          />
          <Text
            fontSize="10px"
            fontWeight="400"
            textAlign="center"
            lineHeight="1.2">
            {text}
          </Text>
        </Box>
      );
    }
  );

  // Memoize collapsed navigation items to prevent re-renders
  const collapsedNavItems = useMemo(
    () => [
      {
        icon: homeIcon,
        text: "Home",
        href: "/",
        isActive: !isWatchPage && location.pathname === "/",
      },
      {
        icon: shortsIcon,
        text: "Shorts",
        href: "/shorts",
        isActive: !isWatchPage && location.pathname === "/shorts",
      },
      {
        icon: subscriptionIcon,
        text: "Subscriptions",
        href: "/subscriptions",
        isActive: !isWatchPage && location.pathname === "/subscriptions",
      },
      {
        icon: exploreIcon,
        text: "Explore",
        href: "/explore",
        isActive: !isWatchPage && location.pathname === "/explore",
      },
    ],
    [isWatchPage, location.pathname]
  );

  if (isCollapsed) {
    return (
      <Box
        h="full"
        w="full"
        bg="#121212"
        borderRight="1px solid #323232"
        overflowY="auto"
        className="!p-2">
        <VStack spacing={3} align="stretch">
          {collapsedNavItems.map((item) => (
            <CollapsedSidebarItem
              key={item.href}
              icon={item.icon}
              text={item.text}
              href={item.href}
              isActive={item.isActive}
            />
          ))}
        </VStack>
      </Box>
    );
  }

  // Memoized Subscription Section Component
  const SubscriptionSection = memo(
    ({
      loading,
      subscriptions,
      displayedSubscriptions,
      showAllSubscriptions,
      handleShowMoreSubscriptions,
    }) => (
      <>
        {/* Subscriptions */}
        <Text
          fontSize="16px"
          fontWeight="500"
          color="white"
          className="!px-3 !py-2">
          Subscriptions
        </Text>

        {loading ? (
          <Box className="!px-3 !py-2">
            <Text fontSize="14px" color="#aaaaaa">
              Loading subscriptions...
            </Text>
          </Box>
        ) : subscriptions.length === 0 ? (
          <Box className="!px-3 !py-2">
            <Text fontSize="14px" color="#aaaaaa">
              No subscriptions found
            </Text>
          </Box>
        ) : (
          displayedSubscriptions.map((sub, index) => (
            <AnchorButton
              key={`${sub.name}-${index}`}
              icon={sub.avatar}
              text={sub.name}
              href={`/channel/${sub.name}`}
              className="!px-3 !py-2">
              <Flex align="center" className="!gap-3" w="full">
                <Avatar size="sm" src={sub.avatar} />
                <Text
                  fontSize="14px"
                  color="white"
                  flex={1}
                  overflow="hidden"
                  textOverflow="ellipsis">
                  {sub.name}
                </Text>
                {sub.isLive && (
                  <Box w="8px" h="8px" bg="#ff0000" borderRadius="50%" />
                )}
              </Flex>
            </AnchorButton>
          ))
        )}

        {!loading && subscriptions.length > 6 && (
          <Box
            as="button"
            onClick={handleShowMoreSubscriptions}
            display="flex"
            alignItems="center"
            className="!gap-3 !py-2 !px-3"
            w="full"
            bg="transparent"
            color="white"
            textDecoration="none"
            borderRadius="md"
            border="none"
            cursor="pointer"
            transition="all 0.2s ease-in-out"
            _hover={{
              bg: "rgba(255, 255, 255, 0.1)",
            }}>
            <img
              src={down_arrow}
              alt="Show more"
              style={{
                width: "20px",
                height: "20px",
                transform: showAllSubscriptions
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
                transition: "transform 0.2s ease-in-out",
              }}
            />
            <Text fontSize="14px" fontWeight="400">
              {showAllSubscriptions ? "Show less" : "Show more"}
            </Text>
          </Box>
        )}
      </>
    )
  );

  return (
    <Box
      h="full"
      w="full"
      bg="#121212"
      borderRight="1px solid #323232"
      overflowY="auto"
      className="!p-3">
      {/* Mobile Header - Only visible on mobile screens */}
      <div className="sm:hidden flex items-center justify-between !mb-4 !pb-3 border-b border-yt-black-32">
        <div className="flex items-center !gap-3">
          <IconButton
            icon={HamburgerIcon}
            alt="Close Menu"
            iconSize="24px"
            h="40px"
            w="40px"
            onClick={toggleSidebar}
          />
          <img src={YouTubeLogo} alt="YouTube Logo" className="h-6" />
        </div>
      </div>

      <VStack spacing={1} align="stretch">
        {/* Main Navigation */}
        <AnchorButton
          icon={homeIcon}
          text="Home"
          href="/"
          isActive={!isWatchPage && location.pathname === "/"}
          className="!px-3 !py-2"
        />
        <AnchorButton
          icon={subscriptionIcon}
          text="Subscriptions"
          href="/subscriptions"
          isActive={!isWatchPage && location.pathname === "/subscriptions"}
          className="!px-3 !py-2"
        />

        <Box h="1px" bg="#323232" className="!my-3" />

        {/* You Section */}
        <Flex align="center" className="!px-3 !py-2">
          <Text fontSize="16px" fontWeight="500" color="white">
            You
          </Text>
        </Flex>

        <AnchorButton
          icon={historyIcon}
          text="History"
          href="/history"
          isActive={!isWatchPage && location.pathname === "/history"}
          className="!px-3 !py-2"
        />
        <AnchorButton
          icon={playlistIcon}
          text="Playlists"
          href="/playlists"
          isActive={!isWatchPage && location.pathname === "/playlists"}
          className="!px-3 !py-2"
        />
        <AnchorButton
          icon={yourVideoIcon}
          text="Your videos"
          href="/your-videos"
          className="!px-3 !py-2"
        />
        <AnchorButton
          icon={watchLaterIcon}
          text="Watch later"
          href="/watch-later"
          className="!px-3 !py-2"
        />
        <AnchorButton
          icon={likedIcon}
          text="Liked videos"
          href="/playlist?id=liked-videos"
          className="!px-3 !py-2"
        />
        <AnchorButton
          icon={downloadsIcon}
          text="Downloads"
          href="/downloads"
          className="!px-3 !py-2"
        />

        <Box h="1px" bg="#323232" className="!my-3" />

        <SubscriptionSection
          loading={loading}
          subscriptions={subscriptions}
          displayedSubscriptions={displayedSubscriptions}
          showAllSubscriptions={showAllSubscriptions}
          handleShowMoreSubscriptions={handleShowMoreSubscriptions}
        />

        <Box h="1px" bg="#323232" className="!my-3" />

        {/* Explore */}
        <Text
          fontSize="16px"
          fontWeight="500"
          color="white"
          className="!px-3 !py-2">
          Explore
        </Text>

        <AnchorButton
          icon={exploreIcon}
          text="Music"
          href="/music"
          className="!px-3 !py-2"
        />
        <AnchorButton
          icon={exploreIcon}
          text="Gaming"
          href="/gaming"
          className="!px-3 !py-2"
        />
      </VStack>
    </Box>
  );
});

export default Sidebar;
