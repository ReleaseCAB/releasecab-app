import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { AlertMessage } from "@components/AlertMessage";
import { UpdateBlackout } from "@services/BlackoutApi";
import { GetReleaseEnvs } from "@services/ReleaseApi";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

export const EditBlackout = ({ blackout }) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [name, setName] = useState(blackout.name);
  const [description, setDescription] = useState(blackout.description);
  const [startDate, setStartDate] = useState(
    blackout.start_date ? new Date(blackout.start_date) : null,
  );
  const [endDate, setEndDate] = useState(
    blackout.end_date ? new Date(blackout.end_date) : null,
  );
  const [envs, setEnvs] = useState(null);
  const [envLoading, setEnvLoading] = useState(true);
  const [environments, setEnvironments] = useState(
    blackout.release_environment,
  );
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
    const blackoutObj = {
      name: name,
      description: description,
      start_date: startDate ? startDate.toISOString() : null,
      end_date: endDate ? endDate.toISOString() : null,
      release_environment: environments.map((env) => env.value),
    };
    const newBlackout = await UpdateBlackout(blackoutObj, blackout.id);
    if (newBlackout.ok) {
      toast({
        title: "Blackout Updated",
        status: "success",
        isClosable: true,
        duration: 5000,
      });
    } else {
      toast({
        title: "Error Updating Blackout",
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
            <FormLabel>Blackout Name</FormLabel>
            <Input
              required
              type="text"
              placeholder="Enter blackout name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea
              placeholder="Enter blackout description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Release Environment</FormLabel>
            <Select
              required
              value={environments}
              options={envs}
              isMulti
              placeholder="Select release environment"
              onChange={(selectedOptions) => setEnvironments(selectedOptions)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Start Date</FormLabel>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              showTimeSelect
              dateFormat="Pp"
              placeholderText="Select start date and time"
              required
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>End Date</FormLabel>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              showTimeSelect
              dateFormat="Pp"
              placeholderText="Select end date and time"
              required
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
