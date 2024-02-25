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
import { GetRoles } from "@services/RoleApi";
import { AddUsersToTeam, GetTeams } from "@services/TeamApi";
import { UpdateOtherUser } from "@services/UserApi";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Select from "react-select";

export const EditUser = ({ user }) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [roles, setRoles] = useState([]);
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [isOwner, setIsOwner] = useState(user.is_tenant_owner);
  const [isActive, setIsActive] = useState(user.is_active);
  const [selectedRoles, setSelectedRoles] = useState(user.role);
  const [selectedTeams, setSelectedTeams] = useState(
    user.teams.map(({ id, name }) => ({
      value: id,
      label: name,
    })),
  );
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const toast = useToast();

  const fetchTeams = async () => {
    setLoading(true);
    const response = await GetTeams(true);
    if (response.ok) {
      const data = await response.json();
      const mappedData = data.map(({ id, name }) => ({
        value: id,
        label: name,
      }));
      setTeams(mappedData);
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  const fetchRoles = async () => {
    const response = await GetRoles(true);
    setError(null);
    if (response.ok) {
      const data = await response.json();
      const mappedData = data.map(({ id, name }) => ({
        value: id,
        label: name,
      }));
      setRoles(mappedData);
    } else {
      setError(
        "Unable to fetch roles, please try again later or contact support.",
      );
    }
  };
  useEffect(() => {
    fetchTeams();
    fetchRoles();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const userObj = {
      first_name: firstName,
      last_name: lastName,
      is_tenant_owner: isOwner,
      role: selectedRoles.map((role) => role.value),
      is_active: isActive,
    };
    const teamObj = {
      team_ids: selectedTeams.map((item) => item.value),
      user_id: user.id,
    };
    const teamUpdateResult = AddUsersToTeam(teamObj);
    const newUser = await UpdateOtherUser(userObj, user.id);
    if (newUser.ok) {
      toast({
        title: "User Updated",
        status: "success",
        isClosable: true,
        duration: 5000,
      });
    } else {
      toast({
        title: "Error Updating User",
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
            <FormLabel>First Name</FormLabel>
            <Input
              required
              type="text"
              placeholder="Enter user first name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Last Name</FormLabel>
            <Input
              required
              type="text"
              placeholder="Enter user last name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Teams</FormLabel>
            <Select
              options={teams}
              isMulti
              placeholder="Select user's teams"
              value={selectedTeams}
              onChange={(selectedOptions) => setSelectedTeams(selectedOptions)}
            />
          </FormControl>
          {roles && (
            <FormControl>
              <FormLabel>Roles</FormLabel>
              <Select
                options={roles}
                value={selectedRoles}
                isMulti
                placeholder="Select user roles"
                onChange={(selectedOptions) =>
                  setSelectedRoles(selectedOptions)
                }
              />
            </FormControl>
          )}
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="isActive" mb="0">
              Is Active
            </FormLabel>
            <Switch
              colorScheme="teal"
              size="lg"
              isChecked={isActive}
              onChange={() => setIsActive(!isActive)}
            />
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="isOwner" mb="0">
              Owner Status
            </FormLabel>
            <Switch
              colorScheme="teal"
              size="lg"
              isChecked={isOwner}
              onChange={() => setIsOwner(!isOwner)}
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
