import { Badge, Box, Grid, GridItem, Heading, Text } from "@chakra-ui/react";

export const ViewReleaseStage = ({ releaseStage }) => {
  return (
    <Box p={4}>
      <Heading size="lg">{releaseStage?.name}</Heading>
      <Grid templateColumns="repeat(2, 15%)" gap={4} mt={4}>
        <GridItem>
          <Text fontWeight="bold">Description:</Text>
        </GridItem>
        <GridItem>
          <Text>{releaseStage.description || "N/A"}</Text>
        </GridItem>
      </Grid>
    </Box>
  );
};
