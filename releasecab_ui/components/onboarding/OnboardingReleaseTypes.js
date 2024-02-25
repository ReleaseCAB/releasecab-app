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
  AddNewReleaseType,
  DeleteReleaseType,
  GetReleaseTypes,
} from "@services/ReleaseApi";
import { UpdateUserProfileOnboardingStep } from "@services/UserApi";
import { useEffect, useState } from "react";
import { BiHelpCircle, BiPlus, BiX } from "react-icons/bi";
import { AlertMessage } from "../AlertMessage";
import { OnboardingPageHeader } from "./OnboardingPageHeader";

export const OnboardingReleaseTypes = (props) => {
  const [types, setTypes] = useState([]);
  const [typesData, setTypesData] = useState([]);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);

  useEffect(() => {
    const fetchReleaseTypes = async () => {
      const response = await GetReleaseTypes(true);
      setError(null);
      if (response.ok) {
        const data = await response.json();
        setTypes(data);
        setTypesData(data);
      } else {
        setError(
          "Unable to fetch release types, please try again later or contact support.",
        );
      }
    };
    fetchReleaseTypes();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await UpdateUserProfileOnboardingStep(props.currentStep + 1);
    for (var type in typesData) {
      await DeleteReleaseType(types[type].id);
    }
    for (var type in types) {
      await AddNewReleaseType(types[type].name);
    }
    props.goToNextStep();
  };

  const handleTypeNameChange = (index, value) => {
    setTypes((prevTypes) => {
      const updatedTypes = [...prevTypes];
      updatedTypes[index] = { ...updatedTypes[index], name: value };
      return updatedTypes;
    });
  };

  const handleAddType = () => {
    if (types.length > 0) {
      const newType = types[types.length - 1].id + 1;
      setTypes([...types, { id: newType, name: "" }]);
    } else {
      setTypes([{ id: 1, name: "" }]);
    }
  };

  const handleRemoveType = (id) => {
    setTypes((prevType) => {
      const updatedTypes = prevType.filter((type) => type.id !== id);
      return updatedTypes.map((type, index) => ({ ...type, id: index + 1 }));
    });
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddType();
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
          title="Add Release Types"
          description="Create release types. These are the different types of releases that may be deployed to your Environment.  We've added some default release types for you to get started. Feel free to delete any that are not applicable to your organization."
        />
        <form onSubmit={handleFormSubmit} onKeyPress={handleEnterPress}>
          <Stack spacing="5" divider={<StackDivider />}>
            <Box>
              <Stack spacing={2}>
                {types.map((type, index) => (
                  <Box display="flex" alignItems="center" key={index}>
                    <InputGroup flex="1" maxW="25%" mr={2}>
                      <Input
                        value={type.name}
                        onChange={(e) =>
                          handleTypeNameChange(index, e.target.value)
                        }
                        placeholder="Release Type"
                        required
                      />
                      {type.description && (
                        <InputRightElement>
                          <Tooltip label={type.description}>
                            <IconButton
                              icon={<BiHelpCircle />}
                              colorScheme="gray"
                              aria-label={type.description}
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
                      onClick={() => handleRemoveType(type.id)}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
              </Stack>
              <Button leftIcon={<BiPlus />} onClick={handleAddType} mt={2}>
                Add New Release Type
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
