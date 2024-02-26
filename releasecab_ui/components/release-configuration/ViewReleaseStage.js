import { Box, Grid, GridItem, Heading, Text } from "@chakra-ui/react";

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
        <GridItem>
          <Text fontWeight="bold">Is End Stage:</Text>
        </GridItem>
        <GridItem>
          <Text>{releaseStage.is_end_stage ? "true" : "false"}</Text>
        </GridItem>
      </Grid>
    </Box>
  );
};
