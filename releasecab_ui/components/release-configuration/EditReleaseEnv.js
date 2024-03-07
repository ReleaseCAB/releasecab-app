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
import { UpdateReleaseEnv } from "@services/ReleaseApi";
import { useRouter } from "next/router";
import { useState } from "react";

export const EditReleaseEnv = ({ releaseEnv }) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isActive, setIsActive] = useState(releaseEnv.is_active);
  const [releaseEnvName, setReleaseEnvName] = useState(releaseEnv.name);
  const [releaseEnvDescription, setReleaseEnvDescription] = useState(
    releaseEnv.description,
  );
  const toast = useToast();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const releaseEnvObj = {
      description: releaseEnvDescription,
      is_active: isActive,
    };
    const newReleaseEnv = await UpdateReleaseEnv(releaseEnvObj, releaseEnv.id);
    if (newReleaseEnv.ok) {
      toast({
        title: "Release Env Updated",
        status: "success",
        isClosable: true,
        duration: 5000,
      });
    } else {
      toast({
        title: "Error Updating Release Env",
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
            <FormLabel>Release Env Name</FormLabel>
            <Input isDisabled={true} type="text" value={releaseEnvName} />
          </FormControl>
          <FormControl>
            <FormLabel>Release Env Description</FormLabel>
            <Input
              type="text"
              placeholder="Enter release environment description"
              value={releaseEnvDescription}
              onChange={(event) => setReleaseEnvDescription(event.target.value)}
            />
          </FormControl>
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
