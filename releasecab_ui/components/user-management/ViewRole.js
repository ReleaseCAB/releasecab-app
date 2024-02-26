import { Box, Grid, GridItem, Heading, Text } from "@chakra-ui/react";

export const ViewRole = ({ role }) => {
  return (
    <Box p={4}>
      <Heading size="lg">{role?.name + " " + "Role"}</Heading>
      <Grid templateColumns="repeat(2, 15%)" gap={4} mt={4}>
        <GridItem>
          <Text fontWeight="bold">Role Name:</Text>
        </GridItem>
        <GridItem>
          <Text>{role.name || ""}</Text>
        </GridItem>
      </Grid>
    </Box>
  );
};
