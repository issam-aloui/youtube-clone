import { useState } from "react";
import { Input, InputGroup, Button, Flex } from "@chakra-ui/react";
import IconButton from "./IconButton";
import SearchIcon from "../assets/icons/white_icons/search.svg";
import VoiceSearchIcon from "../assets/icons/white_icons/voice-search.svg";

export default function SearchBar() {
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = () => {
    console.log("Search for:", searchValue);
  };

  const handleVoiceSearch = () => {
    console.log("Voice search clicked");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Flex align="center" gap={2} maxW="640px" w="full">
      {/* Search Input Container */}
      <Flex align="center" flex={1}>
        <InputGroup size="md">
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyPress={handleKeyPress}
            placeholder="Search"
            bg={isFocused ? "#121212" : "transparent"}
            border="1px solid"
            borderColor={isFocused ? "#3da6ff" : "#323232"}
            borderRightRadius="0"
            borderLeftRadius="20px"
            color="#ffffff"
            fontSize="16px"
            h="40px"
            pl={4}
            pr={4}
            _placeholder={{ color: "#aaaaaa" }}
            _hover={{
              borderColor: isFocused ? "#3da6ff" : "#474747",
            }}
            _focus={{
              borderColor: "#3da6ff",
              boxShadow: "none",
              bg: "#121212",
            }}
            transition="all 0.2s ease-in-out"
          />
        </InputGroup>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          bg="#323232"
          borderLeft="none"
          borderLeftRadius="0"
          borderRightRadius="20px"
          h="40px"
          px={4}
          minW="64px"
          border="1px solid #323232"
          _hover={{
            bg: "#474747",
          }}
          _active={{
            bg: "#383838",
          }}>
          <img
            src={SearchIcon}
            alt="Search"
            style={{ width: "20px", height: "20px" }}
          />
        </Button>
      </Flex>

      {/* Voice Search Button */}
      <IconButton
        icon={VoiceSearchIcon}
        onClick={handleVoiceSearch}
        aria-label="Voice search"
        alt="Voice search"
        iconSize="20px"
        bg="#181818"
        borderRadius="50%"
        h="40px"
        w="40px"
        _hover={{
          bg: "#323232",
        }}
        _active={{
          bg: "#474747",
        }}
      />
    </Flex>
  );
}
