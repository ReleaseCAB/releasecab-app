import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { CreateNewUser } from "@services/SignupService";
import { CreateTenant } from "@services/TenantApi";
import { GetUserProfile, LoginUser } from "@services/UserApi";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AlertMessage } from "../AlertMessage";
import { SigupReviewForm } from "./SignupReviewForm";

export const SignupReview = (props) => {
  const [errorMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const isLoginFormValid =
    props.email.trim() !== "" &&
    props.firstName.trim() !== "" &&
    props.lastName.trim() !== "" &&
    props.password.trim() !== "" &&
    props.companyName.trim() !== "" &&
    props.numberOfEmployees.trim() !== "";

  const setUser = (profile) => {
    dispatch({ type: "SET_USER", payload: profile });
  };

  const handleSubmitSignup = async (e) => {
    e.preventDefault();
    if (!isLoginFormValid) {
      setAlertMessage("Please ensure all the fields are filled out.");
      return;
    }
    try {
      setIsLoading(true);
      // First, create the tenant
      const tenantCreateResponse = await CreateTenant(
        props.companyName,
        props.numberOfEmployees,
      );
      if (tenantCreateResponse.ok) {
        const tenantResponseData = await tenantCreateResponse.json();
        // Tenant created successfully, now create the user
        await CreateNewUser(
          props.email,
          props.password,
          props.firstName,
          props.lastName,
          true,
          false,
          tenantResponseData.id,
        );
        // User created successfully, log them in
        const userCreateResponse = await LoginUser(props.email, props.password);
        if (userCreateResponse.ok) {
          const responseData = await userCreateResponse.json();
          localStorage.setItem("access_token", responseData.access);
          localStorage.setItem("refresh_token", responseData.refresh);
          await dispatch({ type: "RESET" });
          await dispatch({ type: "CLEAR_USER" });
          // Fetch user data and store in redux
          const userProfileResponse = await GetUserProfile();
          if (userProfileResponse.ok) {
            const userProfile = await userProfileResponse.json();
            setUser(userProfile);
          }
          // Once the user is created and logged in, route them to onboarding
          router.push("/onboarding");
        } else {
          setAlertMessage("Error, Please Contact Support.");
        }
      } else {
        setAlertMessage("Error, Please Contact Support.");
      }
    } catch (error) {
      setAlertMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container py={{ base: "4", md: "8" }}>
      <Stack spacing="5">
        <Stack
          spacing="4"
          direction={{ base: "column", sm: "row" }}
          justify="space-between"
        >
          <Box>
            <Text textStyle="xl">Review Your Information</Text>
            <Text textStyle="xs">
              Once you confirm, we'll create your account
            </Text>
          </Box>
        </Stack>
        <Divider />
        {errorMessage && (
          <AlertMessage message={errorMessage} type="error" title="Error" />
        )}
        <form onSubmit={handleSubmitSignup}>
          <SigupReviewForm {...props} />
          <Stack spacing="5" divider={<StackDivider />}>
            <Flex justify="space-between" alignItems="center">
              <Button
                bg="brand.button_enabled"
                color="brand.white_text"
                onClick={props.goToPrevStep}
              >
                Previous
              </Button>
              <Flex justify="space-between" mt={4}>
                <Button
                  bg="brand.button_enabled"
                  color="brand.white_text"
                  isLoading={isLoading}
                  loadingText="Submitting"
                  type="submit"
                >
                  Create Account
                </Button>
              </Flex>
            </Flex>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
};
