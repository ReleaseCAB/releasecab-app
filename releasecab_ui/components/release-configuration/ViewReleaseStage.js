import { Badge, Box, Grid, GridItem, Heading, Text } from "@chakra-ui/react";

export const ViewReleaseStage = ({ releaseStage, connections }) => {
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
          <Text fontWeight="bold">From Stages:</Text>
        </GridItem>
        <GridItem>
          <Text>
            {connections?.toStages.map((stage, index) => (
              <Badge key={stage.value}>{stage.label}</Badge>
            ))}
          </Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="bold">To Stages:</Text>
        </GridItem>
        <GridItem>
          <Text>
            {connections?.fromStages.map((stage, index) => (
              <Badge key={stage.value}>{stage.label}</Badge>
            ))}
          </Text>
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
