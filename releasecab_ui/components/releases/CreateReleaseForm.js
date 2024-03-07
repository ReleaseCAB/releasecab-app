import {
  Button,
  Select as ChakraSelect,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { AlertMessage } from "@components/AlertMessage";
import {
  CreateRelease,
  GetReleaseEnvs,
  GetReleaseTypes,
} from "@services/ReleaseApi";
import { GetTeams } from "@services/TeamApi";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

export const CreateReleaseForm = () => {
  const router = useRouter();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [envs, setEnvs] = useState(null);
  const [types, setTypes] = useState(null);
  const [error, setError] = useState(null);
  const [envLoading, setEnvLoading] = useState(true);
  const [typeLoading, setTypeLoading] = useState(true);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [releaseType, setReleaseType] = useState("");
  const [environments, setEnvironments] = useState([]);
  const [affectedTeams, setAffectedTeams] = useState([]);
  const [ticketLink, setTicketLink] = useState("");

  useEffect(() => {
    const fetchReleaseEnvs = async () => {
      setEnvLoading(true);
      const response = await GetReleaseEnvs(true);
      setError(null);
      if (response.ok) {
        const data = await response.json();
        const mappedData = data
          .filter((item) => item.is_active)
          .map(({ id, name }) => ({
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
        setTypes(data.filter((item) => item.is_active));
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

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (endDate && startDate) {
      if (endDate <= startDate) {
        setError("End date must be after start date");
        return;
      }
    }
    const releaseObj = {
      name: name,
      description: description,
      release_type: parseInt(releaseType),
      release_environment: environments.map((env) => env.value),
      affected_teams: affectedTeams.map((team) => team.value),
      start_date: startDate ? startDate.toISOString() : null,
      end_date: endDate ? endDate.toISOString() : null,
      ticket_link: ticketLink,
    };
    const newRelease = await CreateRelease(releaseObj);
    if (newRelease.ok) {
      const data = await newRelease.json();
      router.push("/release/" + data.identifier);
    } else {
      const data = await newRelease.json();
      if (data.non_field_errors) {
        setError(data.non_field_errors[0]);
      } else {
        setError("Error creating release");
      }
    }
  };

  return (
    <>
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
                required
                placeholder="Enter description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Release Type</FormLabel>
              <ChakraSelect
                required
                placeholder="Select release type"
                value={releaseType}
                onChange={(event) => setReleaseType(event.target.value)}
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
                required
                options={envs}
                isMulti
                placeholder="Select release environment"
                onChange={(selectedOptions) => setEnvironments(selectedOptions)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Affected Teams</FormLabel>
              <Select
                required
                options={teams}
                isMulti
                placeholder="Select affected teams"
                onChange={(selectedOptions) =>
                  setAffectedTeams(selectedOptions)
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Start Date</FormLabel>
              <DatePicker
                required
                selected={startDate}
                onChange={handleStartDateChange}
                showTimeSelect
                dateFormat="Pp"
                placeholderText="Select start date and time"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>End Date</FormLabel>
              <DatePicker
                required
                selected={endDate}
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
    </>
  );
};
