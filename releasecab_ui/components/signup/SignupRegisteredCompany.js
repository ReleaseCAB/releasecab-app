import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  StackDivider,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { CreateNewUser } from "@services/SignupService";
import { FindTenantByInviteCode } from "@services/TenantApi";
import { GetUserProfile, LoginUser } from "@services/UserApi";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AlertMessage } from "../AlertMessage";
import { PasswordField } from "../fields/PasswordField";

export const SignupRegisteredCompany = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [errorMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const isLoginFormValid =
    props.email.trim() !== "" &&
    props.firstName.trim() !== "" &&
    props.lastName.trim() !== "" &&
    props.password.trim() !== "" &&
    props.companyKey.trim() !== "";

  const setUser = (profile) => {
    dispatch({ type: "SET_USER", payload: profile });
  };

  const goHome = () => {
    router.replace("/");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!isLoginFormValid) {
      setAlertMessage("Please enter an email and password.");
      return;
    }
    if (props.password !== props.confirmPassword) {
      setAlertMessage("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const tenantResult = await FindTenantByInviteCode(props.companyKey);
      if (!tenantResult.ok) {
        setAlertMessage("Invalid Company ID");
        return;
      }
      const tenantData = await tenantResult.json();
      await CreateNewUser(
        props.email,
        props.password,
        props.firstName,
        props.lastName,
        false,
        true,
        tenantData.id,
      );
      setAlertMessage("");
      // If user was created successfully, log them in and get the token
      const userCreateResponse = await LoginUser(props.email, props.password);
      if (userCreateResponse.ok) {
        const responseData = await userCreateResponse.json();
        localStorage.setItem("access_token", responseData.access);
        localStorage.setItem("refresh_token", responseData.refresh);
        await dispatch({ type: "RESET" });
        await dispatch({ type: "CLEAR_USER" });
        const userProfileResponse = await GetUserProfile();
        if (userProfileResponse.ok) {
          const userProfile = await userProfileResponse.json();
          setUser(userProfile);
          router.replace("/");
        } else {
          setAlertMessage("Error, Please Contact Support.");
        }
      } else {
        onOpen();
        setAlertMessage("Error, Please Contact Support.");
      }
    } catch (error) {
      setAlertMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Container py={{ base: "4", md: "8" }}>
        <Stack spacing="5">
          <Stack
            spacing="4"
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
          >
            <Box>
              <Text textStyle="xl">Your Information</Text>
              <Text textStyle="xs">Tell us a little about yourself</Text>
            </Box>
          </Stack>
          <Divider />
          {errorMessage && (
            <AlertMessage message={errorMessage} type="error" title="Error" />
          )}
          <form onSubmit={handleFormSubmit}>
            <Stack spacing="5" divider={<StackDivider />}>
              <FormControl id="companyKey" isRequired>
                <Stack
                  direction={{ base: "column", md: "row" }}
                  spacing={{ base: "1.5", md: "8" }}
                  justify="space-between"
                >
                  <FormLabel variant="inline" minW="85px">
                    Company ID
                  </FormLabel>
                  <Input
                    isDisabled={props.companyKeyProvided === "true"}
                    value={props.companyKey}
                    mb={4}
                    required
                    onChange={(e) => props.setCompanyKey(e.target.value)}
                    maxW={{ md: "3xl" }}
                    placeholder="Company ID"
                  />
                </Stack>
              </FormControl>
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
                    value={props.firstName}
                    mb={4}
                    required
                    onChange={(e) => props.setFirstName(e.target.value)}
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
                    value={props.lastName}
                    mb={4}
                    onChange={(e) => props.setLastName(e.target.value)}
                  />
                </Stack>
              </FormControl>
              <FormControl id="email" isRequired>
                <Stack
                  direction={{ base: "column", md: "row" }}
                  spacing={{ base: "1.5", md: "8" }}
                  justify="space-between"
                >
                  <FormLabel variant="inline" minW="85px">
                    Email
                  </FormLabel>
                  <Input
                    type="email"
                    value={props.email}
                    mb={4}
                    required
                    onChange={(e) => props.setEmail(e.target.value)}
                    maxW={{ md: "3xl" }}
                    placeholder="you@yourcompany.com"
                  />
                </Stack>
              </FormControl>
              <FormControl id="password" isRequired>
                <Stack
                  direction={{ base: "column", md: "row" }}
                  spacing={{ base: "1.5", md: "8" }}
                  justify="space-between"
                >
                  <FormLabel variant="inline" minW="85px">
                    Password
                  </FormLabel>
                  <PasswordField
                    password={props.password}
                    setPassword={props.setPassword}
                    showheader="false"
                  />
                </Stack>
              </FormControl>
              <FormControl id="confirmPassword" isRequired>
                <Stack
                  direction={{ base: "column", md: "row" }}
                  spacing={{ base: "1.5", md: "8" }}
                  justify="space-between"
                >
                  <FormLabel variant="inline" minW="85px" marginRight={"-20px"}>
                    Confirm Password
                  </FormLabel>
                  <PasswordField
                    password={props.confirmPassword}
                    setPassword={props.setConfirmPassword}
                    showheader="false"
                  />
                </Stack>
              </FormControl>
              <Flex justify="flex-end">
                <Button
                  type="submit"
                  bg="brand.button_enabled"
                  color="brand.white_text"
                  mt="10px"
                  isLoading={isLoading}
                  loadingText="Submitting"
                >
                  Submit
                </Button>
              </Flex>
            </Stack>
          </form>
        </Stack>
      </Container>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Account Created
            </AlertDialogHeader>
            <AlertDialogBody>
              Your account has been created, but you won't be able to log in
              until you have been approved by management.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => goHome()}>
                Continue
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
