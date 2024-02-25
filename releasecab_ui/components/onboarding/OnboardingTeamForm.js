import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Stack,
  StackDivider,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { CreateTeam, DeleteTeam, GetTeams } from "@services/TeamApi";
import { UpdateUserProfileOnboardingStep } from "@services/UserApi";
import { useEffect, useState } from "react";
import { BiHelpCircle, BiPlus, BiX } from "react-icons/bi";
import { AlertMessage } from "../AlertMessage";
import { Dropzone } from "../Dropzone";
import { OnboardingPageHeader } from "./OnboardingPageHeader";

export const OnboardingTeamForm = (props) => {
  const [teams, setTeams] = useState([]);
  const [dataTeams, setDataTeams] = useState([]);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [file, setFile] = useState(null);
  const toast = useToast();

  // TODO: This list could become very long, especially if they import a csv. Add pagination
  useEffect(() => {
    const fetchTeam = async () => {
      const response = await GetTeams(true);
      if (response.ok) {
        const data = await response.json();
        const teamData = data.map((team) => team.name);
        setTeams(teamData);
        setDataTeams(data);
        setError(null);
      } else {
        setError("Error fetching teams");
      }
    };
    fetchTeam();
  }, []);

  // TODO: Probably try to find a way to remove any empty ones first, but
  // They throw an error when progressing so it's fine for now
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target.result;
        const allTextLines = csv.split(/\r\n|\n/);
        const newTeams = [];
        for (let i = 0; i < allTextLines.length; i++) {
          const data = allTextLines[i]
            .split(",")
            .map((entry) => entry.trim().replace(/'/g, ""));
          for (let j = 0; j < data.length; j++) {
            const team = data[j];
            if (
              team &&
              team !== "" &&
              !teams.includes(team) &&
              !newTeams.includes(team)
            ) {
              newTeams.push(team);
            }
          }
        }
        const updatedTeams = [...teams, ...newTeams];
        setTeams(updatedTeams);
        toast({
          title: "Successfully uploaded teams",
          status: "success",
          isClosable: true,
          duration: 5000,
        });
      };
      reader.readAsText(file);
    }
  }, [file, setTeams]);

  const handleTeamChange = (e, index) => {
    const newTeams = [...teams];
    newTeams[index] = e.target.value;
    setTeams(newTeams);
  };

  const handleAddTeam = () => {
    setTeams([...teams, ""]);
  };

  const handleRemoveTeam = (index) => {
    const newTeams = [...teams];
    newTeams.splice(index, 1);
    setTeams(newTeams);
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTeam();
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (teams.length === 0) {
      // TODO: Add an message that says they can go somewhere to add them later
    }
    await UpdateUserProfileOnboardingStep(props.currentStep + 1);
    for (var team in dataTeams) {
      await DeleteTeam(dataTeams[team].id);
    }
    for (var team in teams) {
      await CreateTeam(teams[team]);
    }
    props.goToNextStep();
  };

  return (
    <Container maxW="75%">
      {error && <AlertMessage message={error} type="error" title="Error" />}
      {warning && (
        <AlertMessage message={warning} type="warning" title="Warning" />
      )}
      <Stack spacing="5">
        <OnboardingPageHeader
          title="Add Teams"
          description={"Add teams so users can be associated with their teams"}
        />

        <form onSubmit={handleFormSubmit} onKeyPress={handleEnterPress}>
          <Stack spacing="5" divider={<StackDivider />}>
            <Box>
              <Stack spacing={2}>
                {teams.map((team, index) => (
                  <Stack direction="row" key={index} spacing={2} align="center">
                    <Input
                      type="team"
                      value={team}
                      onChange={(e) => handleTeamChange(e, index)}
                      placeholder="Team"
                      flex="1"
                      maxW="25%"
                      mr={2}
                      required
                    />
                    <Button
                      leftIcon={<BiX />}
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveTeam(index)}
                    >
                      Remove
                    </Button>
                  </Stack>
                ))}
              </Stack>
              <Button
                leftIcon={<BiPlus />}
                onClick={handleAddTeam}
                mt={2}
                maxW="25%"
              >
                Add New Team
              </Button>
            </Box>
            <Stack spacing={2} align="start">
              <Box as="section" bg="bg.surface" py={{ base: "4", md: "8" }}>
                <Container maxW="lg">
                  <FormControl id="file">
                    <FormLabel>
                      Upload Team CSV File
                      <Tooltip label="Upload a .csv file to add a list of teams to the form. Note: The CSV should have no headers and should be in the format of team1, team2...">
                        <IconButton
                          icon={<BiHelpCircle />}
                          colorScheme="gray"
                          aria-label="Upload a .csv file to add a list of teams to the form. Note: The CSV should have no headers and should be in the format of team1, team2..."
                          size="xs"
                          fontSize="16px"
                          p={1}
                          ml={1}
                        />
                      </Tooltip>
                    </FormLabel>
                    <Dropzone
                      acceptedfiletypes=".csv"
                      setfile={setFile}
                      seterror={setError}
                    />
                  </FormControl>
                </Container>
              </Box>
            </Stack>
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
