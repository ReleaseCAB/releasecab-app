import {
  Avatar,
  Box,
  Flex,
  HStack,
  Img,
  useMenuButton,
} from "@chakra-ui/react";
import { HiSelector } from "react-icons/hi";
export const AccountSwitcherButton = (props) => {
  const buttonProps = useMenuButton(props);
  return (
    <Flex
      as="button"
      {...buttonProps}
      w="full"
      display="flex"
      alignItems="center"
      rounded="lg"
      bg="gray.700"
      px="3"
      py="2"
      fontSize="sm"
      userSelect="none"
      cursor="pointer"
      outline="0"
      transition="all 0.2s"
      _active={{
        bg: "gray.600",
      }}
      _focus={{
        shadow: "outline",
      }}
    >
      <HStack flex="1" spacing="3">
        <Avatar
          w="8"
          h="8"
          name={props.profile.first_name + " " + props.profile.last_name}
          src={props.profile.profile_link}
          alt="Profile Picture"
        />
        <Box textAlign="start">
          <Box noOfLines={1} fontWeight="semibold">
            {props.profile.first_name + " " + props.profile.last_name}
          </Box>
        </Box>
      </HStack>
      <Box fontSize="lg" color="gray.400">
        <HiSelector />
      </Box>
    </Flex>
  );
};
