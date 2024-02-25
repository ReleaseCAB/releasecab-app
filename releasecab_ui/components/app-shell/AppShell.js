import { Box, Flex, Stack, useColorModeValue as mode } from "@chakra-ui/react";
import { navConstants } from "@constants/NavConstants";
import { GetUserProfile } from "@services/UserApi";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { store } from "../../redux/store";
import { AccountSwitcher } from "./AccountSwitcher";
import { NavGroup } from "./NavGroup";
import { NavItem } from "./NavItem";

export const AppShell = (props) => {
  const [profile, setProfile] = useState({});
  const [finalNav, setFinalNav] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const setUser = (profile) => {
    dispatch({ type: "SET_USER", payload: profile });
  };

  const getUserData = async () => {
    const userProfileResponse = await GetUserProfile();
    if (userProfileResponse.ok) {
      const userProfile = await userProfileResponse.json();
      setUser(userProfile);
      setProfile(userProfile);
    }
  };

  useEffect(() => {
    const profileData = store.getState().user;
    if (profileData === null) {
      getUserData();
    }
    setProfile(profileData);
  }, []);

  useEffect(() => {
    if (profile !== null && profile.is_onboarding_complete !== undefined) {
      if (profile.is_onboarding_complete) {
        navConstants.mainNav = navConstants.mainNav.filter(
          (item) => item.url !== "/onboarding",
        );
      }
      setFinalNav(navConstants);
    }
  }, [profile]);

  const isActive = (url) => {
    return router.pathname === url;
  };

  // endElement={<Circle size="2" bg="blue.400"
  return (
    <Box height="100vh" overflow="hidden" position="relative">
      {profile && (
        <Flex h="full" id="app-container">
          <Box w="64" bg="gray.900" color="white" fontSize="sm">
            <Flex h="full" direction="column" px="4" py="4">
              <AccountSwitcher profile={profile} />
              {finalNav !== null && (
                <Stack spacing="8" flex="1" overflow="auto" pt="8">
                  <Stack spacing="1">
                    {navConstants.mainNav.map((item) => (
                      <NavItem
                        key={item.label}
                        icon={<item.icon />}
                        label={item.label}
                        active={isActive(item.url)}
                        href={item.url}
                      />
                    ))}
                  </Stack>
                  <NavGroup label="Releases">
                    {navConstants.releasesNav.map((item) => (
                      <NavItem
                        key={item.label}
                        icon={<item.icon />}
                        label={item.label}
                        active={isActive(item.url)}
                        href={item.url}
                      />
                    ))}
                    {profile.can_create_releases &&
                      navConstants.releasesNavCreate.map((item) => (
                        <NavItem
                          key={item.label}
                          icon={<item.icon />}
                          label={item.label}
                          active={isActive(item.url)}
                          href={item.url}
                        />
                      ))}
                  </NavGroup>
                  <NavGroup label="Blackouts">
                    {navConstants.blackoutNav.map((item) => (
                      <NavItem
                        key={item.label}
                        icon={<item.icon />}
                        label={item.label}
                        active={isActive(item.url)}
                        href={item.url}
                      />
                    ))}
                    {profile.can_create_blackouts &&
                      navConstants.blackoutNavCreate.map((item) => (
                        <NavItem
                          key={item.label}
                          icon={<item.icon />}
                          label={item.label}
                          active={isActive(item.url)}
                          href={item.url}
                        />
                      ))}
                  </NavGroup>
                  {profile.is_manager && (
                    <NavGroup label="Management">
                      {navConstants.managerNav.map((item) => (
                        <NavItem
                          key={item.label}
                          icon={<item.icon />}
                          label={item.label}
                          active={isActive(item.url)}
                          href={item.url}
                        />
                      ))}
                    </NavGroup>
                  )}
                  {profile.is_tenant_owner && (
                    <NavGroup label="Administration">
                      {navConstants.adminNav.map((item) => (
                        <NavItem
                          key={item.label}
                          icon={<item.icon />}
                          label={item.label}
                          active={isActive(item.url)}
                          href={item.url}
                        />
                      ))}
                    </NavGroup>
                  )}
                </Stack>
              )}
              <Box>
                <Stack spacing="1">
                  {navConstants.bottomNav.map((item) => (
                    <NavItem
                      key={item.label}
                      icon={<item.icon />}
                      label={item.label}
                      active={isActive(item.url)}
                      href={item.url}
                    />
                  ))}
                </Stack>
              </Box>
            </Flex>
          </Box>
          <Box bg={mode("white", "gray.800")} flex="1" p="6" overflowY="auto">
            {props.pageContent}
          </Box>
        </Flex>
      )}
    </Box>
  );
};
