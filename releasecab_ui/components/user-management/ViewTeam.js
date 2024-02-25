import { Box, Grid, GridItem, Heading, Tag, Text } from "@chakra-ui/react";

export const ViewTeam = ({ team }) => {
  return (
    <Box p={4}>
      <Heading size="lg">{team?.name + " " + "Team"}</Heading>
      <Grid templateColumns="repeat(2, 15%)" gap={4} mt={4}>
        <GridItem>
          <Text fontWeight="bold">Team Name:</Text>
        </GridItem>
        <GridItem>
          <Text>{team.name || ""}</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="bold">Managers:</Text>
        </GridItem>
        <GridItem>
          {team.managers.map((item) => (
            <Tag mt="2" key={item.value}>
              {item.label}
            </Tag>
          ))}
        </GridItem>
        <GridItem>
          <Text fontWeight="bold">Can Create Releases:</Text>
        </GridItem>
        <GridItem>
          <Text>{team.can_create_releases ? "true" : "false"}</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="bold">Can Create Blackouts:</Text>
        </GridItem>
        <GridItem>
          <Text>{team.can_create_blackouts ? "true" : "false"}</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="bold">Members:</Text>
        </GridItem>
        <GridItem>
          {team.members.map((item) => (
            <Tag mt="2" key={item.value}>
              {item.label}
            </Tag>
          ))}
        </GridItem>
      </Grid>
    </Box>
  );
};
