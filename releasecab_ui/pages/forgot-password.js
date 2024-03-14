import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { AlertMessage } from "@components/AlertMessage";
import { Layout } from "@components/Layout";
import { PasswordField } from "@components/fields/PasswordField";
import {
  PasswordResetRequest,
  PasswordResetRequestConfirm,
} from "@services/UserApi";
import { WithoutAuthGuard } from "@utils/auth/AuthGuard";
import { useRouter } from "next/router";
import { useState } from "react";

const ForgotPasswordPage = () => {
  const pageTitle = "Forgot Password";
  const [email, setEmail] = useState("");
  const [errorMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isLoginFormValid = email.trim() !== "";
  const router = useRouter();
  const token = router.query.token;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoginFormValid) {
      setAlertMessage("Please enter a valid email.");
      return;
    }
    setAlertMessage("");
    setIsLoading(true);
    await PasswordResetRequest(email);
    setSubmitted(true);
    setIsLoading(false);
  };

  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password && !confirmPassword) {
      setAlertMessage("Please enter a password.");
      return;
    }
    if (password !== confirmPassword) {
      setAlertMessage("Passwords do not match.");
      return;
    }
    setAlertMessage();
    await PasswordResetRequestConfirm(token, password);
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
              <Heading>Forgot Password</Heading>
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
            {!submitted && !token && (
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
                  </Stack>
                  <Stack spacing="6">
                    <Button
                      type="submit"
                      width="100%"
                      isLoading={isLoading}
                      loadingText="Submitting"
                      color="brand.white_text"
                      bg="brand.button_enabled"
                    >
                      Send Password Reset Link
                    </Button>
                  </Stack>
                </Stack>
              </form>
            )}
            {submitted && !token && (
              <>
                <Center>
                  <Text fontWeight="bold">
                    Password Reset Request Received!
                  </Text>
                </Center>
                <Text>
                  If a matching email address is found in our system, an email
                  will be sent with a reset link.
                </Text>
              </>
            )}
            {token && (
              <form onSubmit={handleNewPasswordSubmit}>
                <Stack spacing="6">
                  <Stack spacing="5">
                    <FormControl id="password" isRequired>
                      <FormLabel variant="inline" minW="85px">
                        Password
                      </FormLabel>
                      <PasswordField
                        password={password}
                        setPassword={setPassword}
                        showheader="false"
                      />
                    </FormControl>
                    <FormControl id="confirmPassword" isRequired>
                      <FormLabel
                        variant="inline"
                        minW="85px"
                        marginRight={"-20px"}
                      >
                        Confirm Password
                      </FormLabel>
                      <PasswordField
                        password={confirmPassword}
                        setPassword={setConfirmPassword}
                        showheader="false"
                      />
                    </FormControl>
                  </Stack>
                  <Stack spacing="6">
                    <Button
                      type="submit"
                      width="100%"
                      isLoading={isLoading}
                      loadingText="Submitting"
                      color="brand.white_text"
                      bg="brand.button_enabled"
                    >
                      Send Password Reset Link
                    </Button>
                  </Stack>
                </Stack>
              </form>
            )}
          </Box>
          <Center>
            <Link
              variant="text"
              size="lg"
              color="brand.link_blue"
              href="/login"
            >
              Back to Sign In
            </Link>
          </Center>
        </Stack>
      </Container>
    </Layout>
  );
};

export default WithoutAuthGuard(ForgotPasswordPage);
