import { Box, Grid, GridItem, Heading, Text } from "@chakra-ui/react";

export const ViewReleaseType = ({ releaseType }) => {
  return (
    <Box p={4}>
      <Heading size="lg">{releaseType?.name}</Heading>
      <Grid templateColumns="repeat(2, 15%)" gap={4} mt={4}>
        <GridItem>
          <Text fontWeight="bold">Description:</Text>
        </GridItem>
        <GridItem>
          <Text>{releaseType.description || "N/A"}</Text>
        </GridItem>
      </Grid>
    </Box>
  );
};
