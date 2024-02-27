import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { AlertMessage } from "@components/AlertMessage";
import { Header } from "@components/Header";
import { Layout } from "@components/Layout";
import { AppShell } from "@components/app-shell/AppShell";
import { AddBlackout } from "@services/BlackoutApi";
import { GetReleaseEnvs } from "@services/ReleaseApi";
import { WithAuthGuard } from "@utils/auth/AuthGuard";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

const CreateBlackout = () => {
  const pageTitle = "Create Blackout";
  const router = useRouter();
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [envs, setEnvs] = useState(null);
  const [envLoading, setEnvLoading] = useState(true);
  const [environments, setEnvironments] = useState([]);

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
    const currentDate = new Date();
    if (endDate && startDate) {
      if (endDate <= startDate) {
        setError("End date must be after start date");
        return;
      }
      if (endDate < currentDate || startDate < currentDate) {
        setError("Dates cannot be in the past");
        return;
      }
    }
    const releaseObj = {
      name: name,
      description: description,
      start_date: startDate ? startDate.toISOString() : null,
      end_date: endDate ? endDate.toISOString() : null,
      release_environment: environments.map((env) => env.value),
    };
    const newRelease = await AddBlackout(releaseObj);
    if (newRelease.ok) {
      const data = await newRelease.json();
      router.push("/blackout/" + data.id);
    } else {
      setError("Error creating blackout");
    }
  };

  const renderContent = () => {
    return (
      <>
        <Header
          title="Create Blackout"
          secondaryTitle=""
          showSearchBox="true"
        />
        <Box
          bg="bg.surface"
          boxShadow={{ base: "none", md: "sm" }}
          borderRadius={{ base: "none", md: "lg" }}
          pt={5}
          pl={10}
        >
          {error && <AlertMessage message={error} type="error" title="Error" />}
          {!envLoading && (
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
                    options={envs}
                    isMulti
                    placeholder="Select release environment"
                    onChange={(selectedOptions) =>
                      setEnvironments(selectedOptions)
                    }
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
          )}
        </Box>
      </>
    );
  };

  return (
    <Layout title={pageTitle} showfooter="false">
      <AppShell pageContent={renderContent()} />
    </Layout>
  );
};

export default WithAuthGuard(CreateBlackout);
