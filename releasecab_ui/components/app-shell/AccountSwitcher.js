import {
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { BlacklistToken } from "@services/UserApi";
import { useRouter } from "next/router";
import { AccountSwitcherButton } from "./AccountSwitcherButton";

export const AccountSwitcher = (props) => {
  const router = useRouter();

  const handleLogout = async (e) => {
    e.preventDefault();
    const refreshResponse = await BlacklistToken();
    // I mean what can we do if the response fails lol?
    await localStorage.clear();
    router.push("/login");
  };

  const handleProfileNavigate = (e) => {
    e.preventDefault();
    router.push("/profile");
  };

  return (
    <Menu>
      <>
        <AccountSwitcherButton profile={props.profile} />
        <MenuList
          shadow="lg"
          py="4"
          color={useColorModeValue("gray.600", "gray.200")}
          px="3"
        >
          <Text fontWeight="medium" mb="2">
            {props.profile?.tenant}
          </Text>
          <MenuDivider />
          <MenuItem rounded="md" onClick={handleProfileNavigate}>
            Your Profile
          </MenuItem>
          <MenuDivider />
          <MenuItem rounded="md" onClick={handleLogout}>
            Logout
          </MenuItem>
        </MenuList>
      </>
    </Menu>
  );
};
