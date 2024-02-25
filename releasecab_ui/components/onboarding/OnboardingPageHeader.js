import { Box, Divider, Stack, Text } from "@chakra-ui/react";

export const OnboardingPageHeader = (props) => {
  return (
    <>
      <Stack
        spacing="4"
        direction={{ base: "column", sm: "row" }}
        justify="space-between"
      >
        <Box>
          <Text textStyle="xl">{props.title}</Text>
          <Text textStyle="xs">{props.description}</Text>
        </Box>
      </Stack>
      <Divider />
    </>
  );
};
