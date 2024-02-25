import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { AlertMessage } from "@components/AlertMessage";
import { UpdateRole } from "@services/RoleApi";
import { useRouter } from "next/router";
import { useState } from "react";

export const EditRole = ({ role }) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [roleName, setRoleName] = useState(role.name);
  const toast = useToast();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const roleObj = {
      name: roleName,
    };
    const newRole = await UpdateRole(roleObj, role.id);
    if (newRole.ok) {
      toast({
        title: "Role Updated",
        status: "success",
        isClosable: true,
        duration: 5000,
      });
    } else {
      toast({
        title: "Error Updating Role",
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
            <FormLabel>Role Name</FormLabel>
            <Input
              required
              type="text"
              placeholder="Enter role name"
              value={roleName}
              onChange={(event) => setRoleName(event.target.value)}
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
