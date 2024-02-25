import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Switch,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { AlertMessage } from "@components/AlertMessage";
import { UpdateTeam } from "@services/TeamApi";
import { GetUserSearch } from "@services/UserApi";
import { useRouter } from "next/router";
import { useState } from "react";
import AsyncSelect from "react-select/async";

export const EditTeam = ({ team, isTenantOwner }) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [selectedManagers, setSelectedManagers] = useState(team.managers);
  const [selectedMembers, setSelectedMembers] = useState(team.members);
  const [teamName, setTeamName] = useState(team.name);
  const [canCreateBlackouts, setCanCreateBlackouts] = useState(
    team.can_create_blackouts,
  );
  const [canCreateReleases, setCanCreateReleases] = useState(
    team.can_create_releases,
  );
  const toast = useToast();

  const fetchUser = async (userText) => {
    if (userText.length > 2) {
      const response = await GetUserSearch(userText);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        router.push("/");
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const teamObj = {
      name: teamName,
      can_create_blackouts: canCreateBlackouts,
      can_create_releases: canCreateReleases,
      managers: selectedManagers.map((item) => item.value),
      members: selectedMembers.map((item) => item.value),
    };
    const newTeam = await UpdateTeam(teamObj, team.id);
    if (newTeam.ok) {
      toast({
        title: "Team Updated",
        status: "success",
        isClosable: true,
        duration: 5000,
      });
    } else {
      toast({
        title: "Error Updating Team",
        status: "error",
        isClosable: true,
        duration: 5000,
      });
    }
  };

  return (
    <Box p={4}>
      {error && <AlertMessage message={error} type="error" title="Error" />}
      <form onSubmit={handleFormSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Team Name</FormLabel>
            <Input
              required
              type="text"
              placeholder="Enter team name"
              value={teamName}
              onChange={(event) => setTeamName(event.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Team Managers</FormLabel>
            <AsyncSelect
              isClearable
              cacheOptions
              defaultOptions
              isMulti
              isDisabled={!isTenantOwner}
              placeholder="Select Managers (type user's name to search)"
              loadOptions={(inputValue, callback) =>
                fetchUser(inputValue, callback)
              }
              onChange={(selectedOptions) =>
                setSelectedManagers(selectedOptions)
              }
              value={selectedManagers}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Team Members</FormLabel>
            <AsyncSelect
              isClearable
              cacheOptions
              defaultOptions
              isMulti
              placeholder="Select Members (type user's name to search)"
              loadOptions={(inputValue, callback) =>
                fetchUser(inputValue, callback)
              }
              onChange={(selectedOptions) =>
                setSelectedMembers(selectedOptions)
              }
              value={selectedMembers}
            />
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="canCreateReleases" mb="0">
              Can Create Releases
            </FormLabel>
            <Switch
              colorScheme="teal"
              size="lg"
              isChecked={canCreateReleases}
              isDisabled={!isTenantOwner}
              onChange={() => setCanCreateReleases(!canCreateReleases)}
            />
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="canCreateBlackouts" mb="0">
              Can Create Blackouts
            </FormLabel>
            <Switch
              colorScheme="teal"
              size="lg"
              isDisabled={!isTenantOwner}
              isChecked={canCreateBlackouts}
              onChange={() => setCanCreateBlackouts(!canCreateBlackouts)}
            />
          </FormControl>
        </VStack>
        <Flex justify="flex-end">
          <Button
            type="submit"
            bg="brand.button_enabled"
            color="brand.white_text"
            mt="10px"
            maxW="25%"
          >
            Save
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
