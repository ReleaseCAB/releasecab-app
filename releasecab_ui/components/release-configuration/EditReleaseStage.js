import { useEffect, useState } from "react";
import Select from "react-select";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Switch,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { AlertMessage } from "@components/AlertMessage";
import { UpdateReleaseStage } from "@services/ReleaseApi";

export const EditReleaseStage = ({ releaseStage }) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [releaseStageName, setReleaseStageName] = useState(releaseStage.name);
  const [releaseStageDescription, setReleaseStageDescription] = useState(
    releaseStage.description,
  );
  const toast = useToast();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const releaseStageObj = {
      description: releaseStageDescription,
    };
    const newReleaseStage = await UpdateReleaseStage(
      releaseStageObj,
      releaseStage.id,
    );
    if (newReleaseStage.ok) {
      toast({
        title: "Release Stage Updated",
        status: "success",
        isClosable: true,
        duration: 5000,
      });
    } else {
      toast({
        title: "Error Updating Release Stage",
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
            <FormLabel>Release Stage Name</FormLabel>
            <Input isDisabled={true} type="text" value={releaseStageName} />
          </FormControl>
          <FormControl>
            <FormLabel>Release Stage Description</FormLabel>
            <Input
              type="text"
              placeholder="Enter release stage description"
              value={releaseStageDescription}
              onChange={(event) =>
                setReleaseStageDescription(event.target.value)
              }
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
