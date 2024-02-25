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

export const SignupSelectPlan = (props) => {
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
            <Text textStyle="xl">Select A Plan</Text>
            <Text textStyle="xs">Don't worry, you can change this later</Text>
          </Box>
        </Stack>
        <Divider />
        <form onSubmit={handleFormSubmit}>
          <Stack spacing="5" divider={<StackDivider />}>
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
