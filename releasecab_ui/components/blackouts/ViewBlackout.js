import { Badge, Box, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import { ConvertTimeToLocale } from "@utils/TimeConverter";

export const ViewBlackout = ({ blackout }) => {
  return (
    <Box p={4}>
      <Heading size="lg">{blackout.name}</Heading>
      <Grid templateColumns="repeat(2, 15%)" gap={4} mt={4}>
        <GridItem>
          <Badge size="sm">{blackout.active_status}</Badge>
        </GridItem>
        <GridItem></GridItem>
        <GridItem>
          <Text fontWeight="bold">Start Date:</Text>
        </GridItem>
        <GridItem>
          <Text>{ConvertTimeToLocale(blackout.start_date)}</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="bold">End Date:</Text>
        </GridItem>
        <GridItem>
          <Text>{ConvertTimeToLocale(blackout.end_date)}</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="bold">Description:</Text>
        </GridItem>
        <GridItem>
          <Text>{blackout.description || "N/A"}</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="bold">Release Environment:</Text>
        </GridItem>
        <GridItem>
          {blackout.release_environment.map((env) => (
            <Badge mr={2} key={env.value}>
              {env.label}
            </Badge>
          ))}
        </GridItem>
        <GridItem>
          <Text fontWeight="bold">Created By:</Text>
        </GridItem>
        <GridItem>
          <Text>{blackout.owner_name}</Text>
        </GridItem>
      </Grid>
    </Box>
  );
};
