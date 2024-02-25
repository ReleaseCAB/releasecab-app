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
import {
  AddNewReleaseEnv,
  GetReleaseEnvs,
  deleteReleaseEnv,
} from "@services/ReleaseApi";
import { UpdateUserProfileOnboardingStep } from "@services/UserApi";
import { useEffect, useState } from "react";
import { BiHelpCircle, BiPlus, BiX } from "react-icons/bi";
import { AlertMessage } from "../AlertMessage";
import { OnboardingPageHeader } from "./OnboardingPageHeader";

export const OnboardingReleaseEnvs = (props) => {
  const [envs, setEnvs] = useState([]);
  const [envsData, setEnvsData] = useState([]);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);

  useEffect(() => {
    const fetchReleaseEnvs = async () => {
      const response = await GetReleaseEnvs(true);
      setError(null);
      if (response.ok) {
        const data = await response.json();
        setEnvs(data);
        setEnvsData(data);
      } else {
        setError(
          "Unable to fetch release envs, please try again later or contact support.",
        );
      }
    };
    fetchReleaseEnvs();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await UpdateUserProfileOnboardingStep(props.currentStep + 1);
    for (let env in envsData) {
      await deleteReleaseEnv(envsData[env].id);
    }
    for (let env in envs) {
      await AddNewReleaseEnv(envs[env].name);
    }
    props.goToNextStep();
  };

  const handleEnvNameChange = (index, value) => {
    setEnvs((preEnvs) => {
      const updatedTypes = [...preEnvs];
      updatedTypes[index] = { ...updatedTypes[index], name: value };
      return updatedTypes;
    });
  };

  const handleAddEnv = () => {
    if (envs.length > 0) {
      const newEnvId = envs[envs.length - 1].id + 1;
      setEnvs([...envs, { id: newEnvId, name: "" }]);
    } else {
      setEnvs([{ id: 1, name: "" }]);
    }
  };

  const handleRemoveEnv = (id) => {
    setEnvs((prevEnvs) => {
      const updatedEnvs = prevEnvs.filter((env) => env.id !== id);
      return updatedEnvs.map((env, index) => ({ ...env, id: index + 1 }));
    });
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEnv();
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
          title="Add Release Environments"
          description="Create release types. These are the different environments you release to.  We've added some default release environments for you to get started. Feel free to delete any that are not applicable to your organization."
        />
        <form onSubmit={handleFormSubmit} onKeyPress={handleEnterPress}>
          <Stack spacing="5" divider={<StackDivider />}>
            <Box>
              <Stack spacing={2}>
                {envs.map((env, index) => (
                  <Box display="flex" alignItems="center" key={index}>
                    <InputGroup flex="1" maxW="25%" mr={2}>
                      <Input
                        value={env.name}
                        onChange={(e) =>
                          handleEnvNameChange(index, e.target.value)
                        }
                        placeholder="Release Type"
                        required
                      />
                      {env.description && (
                        <InputRightElement>
                          <Tooltip label={env.description}>
                            <IconButton
                              icon={<BiHelpCircle />}
                              colorScheme="gray"
                              aria-label={env.description}
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
                      onClick={() => handleRemoveEnv(env.id)}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
              </Stack>
              <Button leftIcon={<BiPlus />} onClick={handleAddEnv} mt={2}>
                Add New Environment
              </Button>
            </Box>
            <Flex justify="space-between" alignItems="center">
              <Button
                bg="brand.button_enabled"
                color="brand.white_text"
                onClick={props.goToPrevStep}
              >
                Previous
              </Button>
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
