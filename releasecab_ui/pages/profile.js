import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  StackDivider,
  useToast,
} from "@chakra-ui/react";
import { Header } from "@components/Header";
import { Layout } from "@components/Layout";
import { AppShell } from "@components/app-shell/AppShell";
import { GetUserProfile, UpdateUserProfile } from "@services/UserApi";
import { WithAuthGuard } from "@utils/auth/AuthGuard";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { store } from "../redux/store";

const Index = () => {
  const pageTitle = "Profile";
  const [profile, setProfile] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const dispatch = useDispatch();

  const isLoginFormValid =
    email.trim() !== "" &&
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    password.trim() !== "";

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
    const getProfileData = async () => {
      await GetUserProfile();
    };
    getProfileData();
    const profileData = store.getState().user;
    if (profileData === null) {
      getUserData();
    }
    setProfile(profileData);
    setFirstName(profileData.first_name);
    setLastName(profileData.last_name);
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const saveProfileResult = await UpdateUserProfile(firstName, lastName);
    if (saveProfileResult.ok) {
      const saveProfileBody = await saveProfileResult.json();
      if (saveProfileBody.message === "User updated successfully") {
        toast({
          title: saveProfileBody.message,
          status: "success",
          isClosable: true,
          duration: 5000,
        });
        await dispatch({ type: "CLEAR_USER" });
        getUserData();
      }
    } else {
      toast({
        title: "Error Updating Profile",
        status: "error",
        isClosable: true,
        duration: 5000,
      });
    }
  };

  const renderContent = () => {
    return (
      <>
        <Header title="Your Profile" secondaryTitle="" showSearchBox="true" />
        <Box
          bg="bg.surface"
          boxShadow={{ base: "none", md: "sm" }}
          borderRadius={{ base: "none", md: "lg" }}
          pt={5}
          pl={10}
        >
          <form onSubmit={handleFormSubmit}>
            <Stack spacing="5" mt="5" mdivider={<StackDivider />}>
              <FormControl id="firstName" isRequired>
                <Stack
                  direction={{ base: "column", md: "row" }}
                  spacing={{ base: "1.5", md: "8" }}
                  justify="space-between"
                >
                  <FormLabel variant="inline" minW="85px">
                    First Name
                  </FormLabel>
                  <Input
                    value={firstName}
                    mb={4}
                    required
                    onChange={(e) => setFirstName(e.target.value)}
                    maxW={{ md: "3xl" }}
                    placeholder="First Name"
                  />
                </Stack>
              </FormControl>
              <FormControl id="lastName" isRequired>
                <Stack
                  direction={{ base: "column", md: "row" }}
                  spacing={{ base: "1.5", md: "8" }}
                  justify="space-between"
                >
                  <FormLabel variant="inline" minW="85px">
                    Last Name
                  </FormLabel>
                  <Input
                    maxW={{ md: "3xl" }}
                    placeholder="Last Name"
                    required
                    value={lastName}
                    mb={4}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Stack>
              </FormControl>
              <Flex justify="flex-end">
                <Button
                  type="submit"
                  bg="brand.button_enabled"
                  color="brand.white_text"
                  mt="10px"
                >
                  Save
                </Button>
              </Flex>
            </Stack>
          </form>
        </Box>
      </>
    );
  };

  return (
    <Layout title={pageTitle} showfooter="false">
      <AppShell pageContent={renderContent()} />
    </Layout>
  );
};

export default WithAuthGuard(Index);
