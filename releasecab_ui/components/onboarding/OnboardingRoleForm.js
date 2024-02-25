import {
  Box,
  Button,
  Container,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  StackDivider,
  Tooltip,
} from "@chakra-ui/react";
import { CreateRole, DeleteRole, GetRoles } from "@services/RoleApi";
import { UpdateUserProfileOnboardingStep } from "@services/UserApi";
import { useEffect, useState } from "react";
import { BiHelpCircle, BiPlus, BiX } from "react-icons/bi";
import { AlertMessage } from "../AlertMessage";
import { OnboardingPageHeader } from "./OnboardingPageHeader";

export const OnboardingRoleForm = (props) => {
  const [roles, setRoles] = useState([]);
  const [dataRoles, setDataRoles] = useState([]);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      const response = await GetRoles(true);
      setError(null);
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
        setDataRoles(data);
      } else {
        setError(
          "Unable to fetch roles, please try again later or contact support.",
        );
      }
    };
    fetchRoles();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (roles.length === 0) {
      setWarning(
        "Please add at least one role. You can always add more later.",
      );
      return;
    }
    for (var role in dataRoles) {
      await DeleteRole(dataRoles[role].id);
    }
    var roleResult;
    for (var role in roles) {
      roleResult = await CreateRole(roles[role].name);
    }
    if (roleResult.ok) {
      setWarning(null);
      await UpdateUserProfileOnboardingStep(props.currentStep + 1);
      props.goToNextStep();
    } else {
      setError(
        "Unable to add roles, please try again later or contact support.",
      );
    }
  };

  const handleRoleNameChange = (id, value) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.id === id ? { ...role, name: value } : role,
      ),
    );
  };

  const handleAddRole = () => {
    if (roles.length > 0) {
      const newRoleId = roles[roles.length - 1].id + 1;
      setRoles([...roles, { id: newRoleId, name: "" }]);
    } else {
      setRoles([{ id: 1, name: "" }]);
    }
  };

  const handleRemoveRole = (id) => {
    setRoles((prevRole) => {
      const updatedRoles = prevRole.filter((role) => role.id !== id);
      return updatedRoles.map((role, index) => ({ ...role, id: index + 1 }));
    });
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddRole();
    }
  };

  return (
    <Container maxW="75%">
      {error && <AlertMessage message={error} type="error" title="Error" />}
      {warning && (
        <AlertMessage message={warning} type="warning" title="Warning" />
      )}
      <Stack spacing="5">
        <OnboardingPageHeader
          title="Add Roles"
          description="Create some roles. These will be used to determine user permissions later on. We've added some default roles for you to get started. Feel free to delete any that are not applicable to your organization."
        />
        <form onSubmit={handleFormSubmit} onKeyPress={handleEnterPress}>
          <Stack spacing="5" divider={<StackDivider />}>
            <Box>
              <Stack spacing={2}>
                {roles?.map((role) => (
                  <Box display="flex" alignItems="center" key={role.id}>
                    <InputGroup flex="1" maxW="25%" mr={2}>
                      <Input
                        value={role.name}
                        onChange={(e) =>
                          handleRoleNameChange(role.id, e.target.value)
                        }
                        placeholder="Role Name"
                        required
                      />
                      {role.description && (
                        <InputRightElement>
                          <Tooltip label={role.description}>
                            <IconButton
                              icon={<BiHelpCircle />}
                              colorScheme="gray"
                              aria-label={role.description}
                              size="xs"
                              fontSize="16px"
                              p={1}
                            />
                          </Tooltip>
                        </InputRightElement>
                      )}
                    </InputGroup>

                    <Button
                      leftIcon={<BiX />}
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveRole(role.id)}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
              </Stack>
              <Button leftIcon={<BiPlus />} onClick={handleAddRole} mt={2}>
                Add New Role
              </Button>
            </Box>
            <Flex justify="flex-end">
              <Button
                type="submit"
                bg="brand.button_enabled"
                color="brand.white_text"
                mt="10px"
              >
                Next
              </Button>
            </Flex>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
};
