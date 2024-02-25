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

export const SignupCompanyForm = (props) => {
  const isLoginFormValid =
    props.companyName.trim() !== "" && props.numberOfEmployees.trim() !== "";

  const handleFormSubmit = (e) => {
    e.preventDefault();
    props.goToNextStep();
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
            <Text textStyle="xl">Your Company's Information</Text>
            <Text textStyle="xs">
              Tell us a little about your place of work
            </Text>
          </Box>
        </Stack>
        <Divider />
        <form onSubmit={handleFormSubmit}>
          <Stack spacing="5" divider={<StackDivider />}>
            <FormControl id="companyName" isRequired>
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
                  ml="-5px"
                  required
                  type="number"
                  onChange={(e) => props.setNumberOfEmployees(e.target.value)}
                  maxW={{ md: "3xl" }}
                  placeholder="Number of Employees"
                />
              </Stack>
            </FormControl>
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
                Next
              </Button>
            </Flex>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
};
