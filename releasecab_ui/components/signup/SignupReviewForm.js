import {
  Box,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { PasswordField } from "../fields/PasswordField";

export const SigupReviewForm = (props) => (
  <Container py={{ base: "4", md: "8" }}>
    <Stack spacing="5">
      <Stack
        spacing="4"
        direction={{ base: "column", sm: "row" }}
        justify="space-between"
      >
        <Box>
          <Text textStyle="xl" fontWeight="medium">
            Your Information
          </Text>
        </Box>
      </Stack>
      <Divider />
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
      </Stack>
    </Stack>

    <Stack spacing="5" pt="50px">
      <Stack
        spacing="4"
        direction={{ base: "column", sm: "row" }}
        justify="space-between"
      >
        <Box>
          <Text textStyle="xl" fontWeight="medium">
            Your Company's Information
          </Text>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing="5" divider={<StackDivider />}>
        <FormControl id="firstName" isRequired>
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={{ base: "1.5", md: "8" }}
            justify="space-between"
          >
            <FormLabel variant="inline" minW="120px">
              Company Name
            </FormLabel>
            <Input
              value={props.companyName}
              mb={4}
              required
              onChange={(e) => props.setCompanyName(e.target.value)}
              maxW={{ md: "3xl" }}
              placeholder="Company Name"
            />
          </Stack>
        </FormControl>
        <FormControl id="numEmployees" isRequired>
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={{ base: "1.5", md: "8" }}
            justify="space-between"
          >
            <FormLabel variant="inline" minW="120px">
              Number of Employees
            </FormLabel>
            <Input
              value={props.numberOfEmployees}
              mb={4}
              required
              type="number"
              onChange={(e) => props.setNumberOfEmployees(e.target.value)}
              maxW={{ md: "3xl" }}
              placeholder="Number of Employees"
            />
          </Stack>
        </FormControl>
      </Stack>
    </Stack>
  </Container>
);
