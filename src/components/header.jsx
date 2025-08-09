import IconButton from "./IconButton";
import HamburgerIcon from "../assets/icons/white_icons/hambarger.svg";
import YouTubeLogo from "../assets/icons/black_icons/Youtube_logo.svg";
import SearchBar from "./SearchBar";
import notificationsIcon from "../assets/icons/white_icons/notifications.svg";
import createIcon from "../assets/icons/white_icons/create-1.svg";
import profileIcon from "../assets/images/profilePicture.jpg";
import { useSidebar } from "../context/SidebarContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const handleHamburgerClick = () => {
    toggleSidebar();
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <header className="flex flex-row items-center justify-between w-full bg-yt-black-12 !px-3 sm:!px-6 !py-2 sm:!py-3 h-full border-b border-yt-black-32">
      <div className="flex items-center !gap-2 sm:!gap-4">
        <IconButton
          icon={HamburgerIcon}
          alt="Menu Icon"
          iconSize="20px"
          h="36px"
          w="36px"
          onClick={handleHamburgerClick}
          className="sm:!h-[44px] sm:!w-[44px]"
        />
        <img
          src={YouTubeLogo}
          alt="YouTube Logo"
          className="!hidden sm:!block h-5 sm:h-6 cursor-pointer"
          onClick={handleLogoClick}
        />
      </div>
      <div className="flex-1 max-w-2xl !mx-2 sm:!mx-4">
        <SearchBar />
      </div>
      <div className="flex items-center !gap-1 sm:!gap-3">
        {/* Create button - hidden on mobile */}
        <div className="hidden md:block">
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
        </div>

        {/* Notifications - smaller on mobile */}
        <IconButton
          src={notificationsIcon}
          alt="Notifications Icon"
          iconSize="20px"
          h="36px"
          w="36px"
          className="sm:!h-[44px] sm:!w-[44px]"
        />

        {/* Profile - smaller on mobile */}
        <IconButton
          src={profileIcon}
          alt="Profile Icon"
          iconSize="28px"
          h="28px"
          w="28px"
          borderRadius="50%"
          border="2px solid transparent"
          className="sm:!h-[36px] sm:!w-[36px]"
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
