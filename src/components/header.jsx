import IconButton from "./IconButton";
import HamburgerIcon from "../assets/icons/white_icons/hambarger.svg";
import YouTubeLogo from "../assets/icons/black_icons/YouTube_logo.svg";
import SearchBar from "./SearchBar";
import notificationsIcon from "../assets/icons/white_icons/notifications.svg";
import createIcon from "../assets/icons/white_icons/create-1.svg";
import profileIcon from "../assets/images/profilePicture.jpg";

export default function Header() {
  return (
    <header className="flex flex-row items-center justify-between w-full fixed top-0 left-0 right-0 z-50 bg-yt-black-12 !px-6 !py-3 ">
      <div className="flex items-center gap-4">
        <IconButton
          icon={HamburgerIcon}
          alt="Menu Icon"
          iconSize="24px"
          h="44px"
          w="44px"
        />
        <img src={YouTubeLogo} alt="YouTube Logo" style={{ height: "24px" }} />
      </div>
      <SearchBar />
      <div className="flex items-center gap-3">
        <IconButton
          src={createIcon}
          alt="Create Icon"
          text="Create"
          iconSize="24px"
          h="40px"
          fontSize="14px"
          bg="rgba(255, 255, 255, 0.05)"
          _hover={{
            bg: "rgba(255, 255, 255, 0.1)",
          }}
        />
        <IconButton
          src={notificationsIcon}
          alt="Notifications Icon"
          iconSize="24px"
          h="44px"
          w="44px"
        />
        <IconButton
          src={profileIcon}
          alt="Profile Icon"
          iconSize="36px"
          h="36px"
          w="36px"
          borderRadius="50%"
          border="2px solid transparent"
          _hover={{
            bg: "rgba(255, 255, 255, 0.1)",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            transform: "scale(1.05)",
          }}
          _active={{
            transform: "scale(0.95)",
          }}
          overflow="hidden"
          sx={{
            "& img": {
              borderRadius: "50%",
              objectFit: "cover",
              width: "100%",
              height: "100%",
            },
          }}
        />
      </div>
    </header>
  );
}
