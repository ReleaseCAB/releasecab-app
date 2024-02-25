import { Box, Heading, Stack, Text } from "@chakra-ui/react";

export const Stat = (props) => {
  const { label, value, ...boxProps } = props;
  return (
    <Box
      px={{
        base: "4",
        md: "6",
      }}
      py={{
        base: "5",
        md: "6",
      }}
      bg="bg.surface"
      borderRadius="lg"
      boxShadow="sm"
      {...boxProps}
    >
      <Stack>
        <Text textStyle="sm" color="fg.muted">
          {label}
        </Text>
        <Heading
          size={{
            base: "sm",
            md: "md",
          }}
        >
          {value}
        </Heading>
      </Stack>
    </Box>
  );
};
