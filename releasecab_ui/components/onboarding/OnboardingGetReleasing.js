import {
  Box,
  Button,
  Container,
  Flex,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import {
  GetUserProfile,
  UpdateUserProfileOnboardingComplete,
} from "@services/UserApi";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AlertMessage } from "../AlertMessage";
import { OnboardingPageHeader } from "./OnboardingPageHeader";

export const OnboardingGetReleasing = (props) => {
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const setUser = (profile) => {
    dispatch({ type: "SET_USER", payload: profile });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const updateResult = await UpdateUserProfileOnboardingComplete(true);
    if (!updateResult.ok) {
      setError("Something went wrong. Please try again.");
      return;
    }
    const userProfileResponse = await GetUserProfile();
    if (userProfileResponse.ok) {
      const userProfile = await userProfileResponse.json();
      setUser(userProfile);
    }
    router.replace("/");
  };

  return (
    <Container maxW="75%">
      {error && <AlertMessage message={error} type="error" title="Error" />}
      {warning && (
        <AlertMessage message={warning} type="warning" title="Warning" />
      )}
      <Stack spacing="5">
        <OnboardingPageHeader
          title="Get Started!"
          description="You've completed the basics. Now let's get you releasing!"
        />
        <form onSubmit={handleFormSubmit}>
          <Stack spacing="5" divider={<StackDivider />}>
            <Box>
              <Text>
                Congratulations, you've completed onboarding. From here, you can
                view the dashboard, take a look at our default release
                templates, and customize your team's experience. You get get
                additional help TODO HERE.
              </Text>
            </Box>
            <Flex justify="space-between" alignItems="center">
              <Button
                bg="brand.button_enabled"
                color="brand.white_text"
                onClick={props.goToPrevStep}
              >
                Previous
              </Button>
              <Button
                type="submit"
                bg="brand.button_enabled"
                color="brand.white_text"
                mt="10px"
              >
                Ready, Set, Release!
              </Button>
            </Flex>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
};
