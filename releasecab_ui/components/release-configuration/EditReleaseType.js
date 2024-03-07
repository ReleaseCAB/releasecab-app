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
import { UpdateReleaseType } from "@services/ReleaseApi";
import { useRouter } from "next/router";
import { useState } from "react";

export const EditReleaseType = ({ releaseType }) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [releaseTypeName, setReleaseTypeName] = useState(releaseType.name);
  const [isActive, setIsActive] = useState(releaseType.is_active);
  const [releaseTypeDescription, setReleaseTypeDescription] = useState(
    releaseType.description,
  );
  const toast = useToast();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const releaseTypeObj = {
      description: releaseTypeDescription,
      is_active: isActive,
    };
    const newReleaseType = await UpdateReleaseType(
      releaseTypeObj,
      releaseType.id,
    );
    if (newReleaseType.ok) {
      toast({
        title: "Release Type Updated",
        status: "success",
        isClosable: true,
        duration: 5000,
      });
    } else {
      toast({
        title: "Error Updating Release Type",
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
            <FormLabel>Release Type Name</FormLabel>
            <Input isDisabled={true} type="text" value={releaseTypeName} />
          </FormControl>
          <FormControl>
            <FormLabel>Release Type Description</FormLabel>
            <Input
              type="text"
              placeholder="Enter release type description"
              value={releaseTypeDescription}
              onChange={(event) =>
                setReleaseTypeDescription(event.target.value)
              }
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
