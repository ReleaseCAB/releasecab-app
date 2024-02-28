import {
  Box,
  Button,
  Select as ChakraSelect,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { AlertMessage } from "@components/AlertMessage";
import {
  GetReleaseEnvs,
  GetReleaseTypes,
  UpdateRelease,
} from "@services/ReleaseApi";
import { GetTeams } from "@services/TeamApi";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

export const EditReleaseForm = ({ release }) => {
  const [name, setName] = useState(release.name);
  const [description, setDescription] = useState(release.description);
  const [startDate, setStartDate] = useState(
    release.start_date ? new Date(release.start_date) : null,
  );
  const [endDate, setEndDate] = useState(
    release.end_date ? new Date(release.end_date) : null,
  );
  const [ticketLink, setTicketLink] = useState(release.ticket_link);
  const [envs, setEnvs] = useState([]);
  const [teams, setTeams] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedEnvironments, setSelectedEnvironments] = useState(
    release.release_environment,
  );
  const [selectedTeams, setSelectedTeams] = useState(release.affected_teams);
  const [selectedReleaseType, setSelectedReleaseType] = useState(
    release.release_type.value,
  );
  const [selectedStage, setSelectedStage] = useState(release.current_stage);
  const [teamLoading, setTeamLoading] = useState(true);
  const [envLoading, setEnvLoading] = useState(true);
  const [typeLoading, setTypeLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchReleaseEnvs = async () => {
      setEnvLoading(true);
      const response = await GetReleaseEnvs(true);
      setError(null);
      if (response.ok) {
        const data = await response.json();
        const mappedData = data.map(({ id, name }) => ({
          value: id,
          label: name,
        }));
        setEnvs(mappedData);
      } else {
        setError(
          "Unable to fetch release envs, please try again later or contact support.",
        );
      }
      setEnvLoading(false);
    };

    const fetchReleaseTypes = async () => {
      setTypeLoading(true);
      const response = await GetReleaseTypes(true);
      setError(null);
      if (response.ok) {
        const data = await response.json();
        setTypes(data);
      } else {
        setError(
          "Unable to fetch release types, please try again later or contact support.",
        );
      }
      setTypeLoading(false);
    };
    const fetchTeam = async () => {
      setTeamLoading(true);
      const response = await GetTeams(true);
      if (response.ok) {
        const data = await response.json();
        const mappedData = data.map(({ id, name }) => ({
          value: id,
          label: name,
        }));
        setTeams(mappedData);
        setError(null);
      } else {
        setError("Error fetching teams");
      }
      setTeamLoading(false);
    };
    fetchTeam();
    fetchReleaseTypes();
    fetchReleaseEnvs();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (endDate && startDate) {
      if (endDate <= startDate) {
        setError("End date must be after start date");
        return;
      }
    }
    const updatedRelease = {
      name,
      description,
      start_date: startDate ? startDate.toISOString() : null,
      end_date: endDate ? endDate.toISOString() : null,
      ticket_link: ticketLink,
      release_type: selectedReleaseType,
      release_environment: selectedEnvironments.map((env) => env.value),
      affected_teams: selectedTeams.map((team) => team.value),
    };
    const response = await UpdateRelease(updatedRelease, release.id);
    if (response.ok) {
      toast({
        title: "Release Updated",
        status: "success",
        isClosable: true,
        duration: 5000,
      });
    } else {
      if (response.status === 400) {
        const data = await response.json();
        toast({
          title: data.non_field_errors[0],
          status: "error",
          isClosable: true,
          duration: 5000,
        });
      } else {
        toast({
          title: "Error Updating Release",
          status: "error",
          isClosable: true,
          duration: 5000,
        });
      }
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  return (
    <Box p={4}>
      {error && <AlertMessage message={error} type="error" title="Error" />}
      {!typeLoading && !envLoading && !teamLoading && (
        <form onSubmit={handleFormSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Release Name</FormLabel>
              <Input
                required
                type="text"
                placeholder="Enter release name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Enter description"
                required
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Release Type</FormLabel>
              <ChakraSelect
                placeholder="Select release type"
                required
                value={selectedReleaseType}
                onChange={(event) => setSelectedReleaseType(event.target.value)}
              >
                {types.map((type) => (
                  <option key={type.name} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </ChakraSelect>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Release Environment</FormLabel>
              <Select
                options={envs}
                isMulti
                required
                placeholder="Select release environment"
                value={selectedEnvironments}
                onChange={(selectedOptions) =>
                  setSelectedEnvironments(selectedOptions)
                }
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Affected Teams</FormLabel>
              <Select
                options={teams}
                isMulti
                required
                placeholder="Select affected teams"
                value={selectedTeams}
                onChange={(selectedOptions) =>
                  setSelectedTeams(selectedOptions)
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Start Date</FormLabel>
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                required
                showTimeSelect
                dateFormat="Pp"
                placeholderText="Select start date and time"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>End Date</FormLabel>
              <DatePicker
                selected={endDate}
                required
                onChange={handleEndDateChange}
                showTimeSelect
                dateFormat="Pp"
                placeholderText="Select end date and time"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Ticket Link</FormLabel>
              <Input
                placeholder="Enter ticket link"
                value={ticketLink}
                onChange={(event) => setTicketLink(event.target.value)}
              />
            </FormControl>

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
          </VStack>
        </form>
      )}
    </Box>
  );
};
