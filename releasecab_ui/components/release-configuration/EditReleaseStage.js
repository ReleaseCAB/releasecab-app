import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Switch,
  Tooltip,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { AlertMessage } from "@components/AlertMessage";
import { UpdateReleaseStage } from "@services/ReleaseApi";
import { useRouter } from "next/router";
import { useState } from "react";
import { BiHelpCircle } from "react-icons/bi";
import Select from "react-select";

export const EditReleaseStage = ({
  releaseStage,
  connections,
  releaseStages,
}) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [releaseStageName, setReleaseStageName] = useState(releaseStage.name);
  const [selectedFromStages, setSelectedFromStages] = useState(
    connections.fromStages,
  );
  const [selectedToStages, setSelectedToStages] = useState(
    connections.toStages,
  );
  const [releaseStageDescription, setReleaseStageDescription] = useState(
    releaseStage.description,
  );
  const [isEndStage, setIsEndStage] = useState(releaseStage.is_end_stage);
  const [isDeletable, setIsDeletable] = useState(
    releaseStage.allow_release_delete,
  );
  const [isUpdatable, setIsUpdatable] = useState(
    releaseStage.allow_release_update,
  );
  const toast = useToast();

  const formatReleaseStages = () => {
    return releaseStages?.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const releaseStageObj = {
      description: releaseStageDescription,
      is_end_stage: isEndStage,
      allow_release_delete: isDeletable,
      allow_release_update: isUpdatable,
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
          <FormControl>
            <FormLabel>
              From Stages
              <Tooltip
                label={"To change 'from stages', go to Workflow Designer"}
              >
                <IconButton
                  icon={<BiHelpCircle />}
                  colorScheme="gray"
                  aria-label={"From Stages Help Text"}
                  size="xs"
                  fontSize="16px"
                  p={1}
                />
              </Tooltip>
            </FormLabel>
            <Select
              isDisabled
              options={formatReleaseStages()}
              value={selectedFromStages}
              isMulti
              placeholder="Select From Stages"
              onChange={(selectedOptions) =>
                setSelectedFromStages(selectedOptions)
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>
              To Stages
              <Tooltip label={"To change 'to stages', go to Workflow Designer"}>
                <IconButton
                  icon={<BiHelpCircle />}
                  colorScheme="gray"
                  aria-label={"To Stages Help Text"}
                  size="xs"
                  fontSize="16px"
                  p={1}
                />
              </Tooltip>
            </FormLabel>
            <Select
              isDisabled
              options={formatReleaseStages()}
              value={selectedToStages}
              isMulti
              placeholder="Select To Stages"
              onChange={(selectedOptions) =>
                setSelectedToStages(selectedOptions)
              }
            />
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="isUpdatable" mb="0">
              Can Update Release In This Stage
            </FormLabel>
            <Switch
              colorScheme="teal"
              size="lg"
              isChecked={isUpdatable}
              onChange={() => setIsUpdatable(!isUpdatable)}
            />
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="isDeletable" mb="0">
              Can Delete Release In This Stage
            </FormLabel>
            <Switch
              colorScheme="teal"
              size="lg"
              isChecked={isDeletable}
              onChange={() => setIsDeletable(!isDeletable)}
            />
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="isEndStage" mb="0">
              Is End Stage
            </FormLabel>
            <Switch
              colorScheme="teal"
              size="lg"
              isChecked={isEndStage}
              onChange={() => setIsEndStage(!isEndStage)}
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
