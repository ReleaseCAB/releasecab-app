import { Badge, Box, Grid, GridItem, Heading, Text } from "@chakra-ui/react";

export const ViewUser = ({ user }) => {
  return (
    <Box p={4}>
      <Heading size="lg">{user?.last_name + ", " + user?.first_name}</Heading>
      <Grid templateColumns="repeat(2, 15%)" gap={4} mt={4}>
        <GridItem>
          {user.role.map((role) => (
            <Badge mr={2} key={role.value}>
              {role.label}
            </Badge>
          ))}
        </GridItem>
        <GridItem></GridItem>
        <GridItem>
          <Text fontWeight="bold">First Name:</Text>
        </GridItem>
        <GridItem>
          <Text>{user.first_name || ""}</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="bold">Last Name:</Text>
        </GridItem>
        <GridItem>
          <Text>{user.last_name || ""}</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="bold">Teams:</Text>
        </GridItem>
        <GridItem>
          <Text>
            {user.teams.map((team) => (
              <span key={team.id}>{team.name} </span>
            ))}
          </Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="bold">Owner Status:</Text>
        </GridItem>
        <GridItem>
          <Text>{user.is_tenant_owner ? "true" : "false"}</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="bold">Is Approved/Active:</Text>
        </GridItem>
        <GridItem>
          <Text>{user.is_active ? "true" : "false"}</Text>
        </GridItem>
      </Grid>
    </Box>
  );
};
