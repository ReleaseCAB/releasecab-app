import {
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
} from "@chakra-ui/react";
import { ValidateUser } from "@services/UserApi";
import { useState } from "react";
import { AlertMessage } from "../AlertMessage";
import { PasswordField } from "../fields/PasswordField";

export const SignupUserForm = (props) => {
  const [error, setError] = useState("");
  const isLoginFormValid =
    props.email.trim() !== "" &&
    props.firstName.trim() !== "" &&
    props.lastName.trim() !== "" &&
    props.password.trim() !== "" &&
    props.confirmPassword.trim() !== "";

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!isLoginFormValid) {
      return;
    }
    if (props.password !== props.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const validateResult = await ValidateUser(props.email, props.password);
    if (validateResult.ok) {
      props.goToNextStep();
    } else {
      setError("Email is already associated with an account.");
    }
  };

  return (
    <Container py={{ base: "4", md: "8" }}>
      {error && <AlertMessage message={error} type="error" title="Error" />}
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
        <form onSubmit={handleFormSubmit}>
          <Stack spacing="5" divider={<StackDivider />}>
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
              >
                Next
              </Button>
            </Flex>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
};
