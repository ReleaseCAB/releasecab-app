import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { AlertMessage } from "@components/AlertMessage";
import { PasswordField } from "@components/fields/PasswordField";
import { Layout } from "@components/Layout";
import { GetUserProfile, LoginUser } from "@services/UserApi";
import { WithoutAuthGuard } from "@utils/auth/AuthGuard";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";

const LoginPage = () => {
  const pageTitle = "Log In";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoginFormValid = email.trim() !== "" && password.trim() !== "";

  const setUser = (profile) => {
    dispatch({ type: "SET_USER", payload: profile });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoginFormValid) {
      setAlertMessage("Please enter an email and password.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await LoginUser(email, password);
      if (response.ok) {
        const responseData = await response.json();
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
        const nextUrl = router.query.next || "/";
        router.push(nextUrl);
      } else if (response.status === 401) {
        setAlertMessage(
          "Invalid email or password, or account is not active yet."
        );
      } else {
        const errorData = await response.json();
        setAlertMessage(errorData.message);
      }
    } catch (error) {
      setAlertMessage("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title={pageTitle}>
      <Container
        maxW="lg"
        py={{ base: "12", md: "24" }}
        px={{ base: "0", sm: "8" }}
      >
        <Stack spacing="8">
          <Stack spacing="6">
            <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
              <Heading>Release CAB Log In</Heading>
              <HStack spacing="1" justify="center">
                <Text color="fg.muted">Don't have an account?</Text>
                <Link
                  variant="text"
                  size="lg"
                  color="brand.link_blue"
                  href="/signup"
                >
                  Sign up
                </Link>
              </HStack>
            </Stack>
          </Stack>
          <Box
            py={{ base: "0", sm: "8" }}
            px={{ base: "4", sm: "10" }}
            bg={{ base: "transparent" }}
            boxShadow={{ base: "none", sm: "md" }}
            borderRadius={{ base: "none", sm: "xl" }}
          >
            {errorMessage && (
              <AlertMessage message={errorMessage} type="error" title="Error" />
            )}
            <form onSubmit={handleSubmit}>
              <Stack spacing="6">
                <Stack spacing="5">
                  <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      placeholder="Email"
                      mb={4}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormControl>
                  <PasswordField
                    password={password}
                    setPassword={setPassword}
                    showheader="true"
                  />
                </Stack>
                {/* TODO: Remember me functionality */}
                {/* <HStack justify="space-between">
                  <Checkbox defaultChecked>Remember me</Checkbox>
                </HStack> */}
                <Stack spacing="6">
                  <Button
                    type="submit"
                    width="100%"
                    loadingText="Submitting"
                    color="brand.white_text"
                    bg="brand.button_enabled"
                  >
                    Sign In
                  </Button>
                  <Center>
                    <Link
                      variant="text"
                      size="lg"
                      color="brand.link_blue"
                      href="/forgot-password"
                    >
                      Forgot Password?
                    </Link>
                  </Center>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Container>
    </Layout>
  );
};

export default WithoutAuthGuard(LoginPage);
