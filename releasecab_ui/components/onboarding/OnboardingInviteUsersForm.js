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
import { Dropzone } from "@components/Dropzone";
import {
  CreateInvitedUser,
  DeleteInvitedUser,
  GetInvitedUser,
  GetMyTenant,
} from "@services/TenantApi";
import { UpdateUserProfileOnboardingStep } from "@services/UserApi";
import { useEffect, useState } from "react";
import { BiHelpCircle, BiPlus, BiX } from "react-icons/bi";
import { AlertMessage } from "../AlertMessage";
import { OnboardingPageHeader } from "./OnboardingPageHeader";

// TODO: Add pagination
// TODO: Add a way to assign teams here and in the csv import
export const OnboardingInviteUsersForm = (props) => {
  const [emails, setEmails] = useState([]);
  const [emailFullResults, setEmailFullResults] = useState({});
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [file, setFile] = useState(null);
  const [tenant, setTenant] = useState(null);
  const toast = useToast();

  const fetchInvitedUser = async () => {
    const response = await GetInvitedUser(true);
    if (response.ok) {
      const data = await response.json();
      setEmailFullResults(data);
      const emails = data.map((user) => user.email);
      setEmails(emails);
      setError(null);
    } else {
      setError("Error fetching invited users");
    }
  };

  useEffect(() => {
    const fetchTenant = async () => {
      const response = await GetMyTenant();
      if (response.ok) {
        const data = await response.json();
        setTenant(data);
        setError(null);
      } else {
        setError("Error fetching tenant");
      }
    };
    fetchTenant();
    fetchInvitedUser();
  }, []);

  // TODO: Probably try to find a way to remove any empty ones first, but
  // They throw an error when progressing so it's fine for now
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target.result;
        const allTextLines = csv.split(/\r\n|\n/);
        const newEmails = [];
        for (let i = 0; i < allTextLines.length; i++) {
          const data = allTextLines[i]
            .split(",")
            .map((entry) => entry.trim().replace(/'/g, ""));
          for (let j = 0; j < data.length; j++) {
            const email = data[j];
            if (
              email &&
              email !== "" &&
              !emails.includes(email) &&
              !newEmails.includes(email)
            ) {
              newEmails.push(email);
            }
          }
        }
        const updatedEmails = [...emails, ...newEmails];
        setEmails(updatedEmails);
        toast({
          title: "Successfully uploaded emails",
          status: "success",
          isClosable: true,
          duration: 5000,
        });
      };
      reader.readAsText(file);
    }
  }, [file, setEmails]);

  const handleEmailChange = (e, index) => {
    const newEmails = [...emails];
    newEmails[index] = e.target.value;
    setEmails(newEmails);
  };

  const handleAddEmail = () => {
    setEmails([...emails, ""]);
  };

  const handleRemoveEmail = (index) => {
    const newEmails = [...emails];
    newEmails.splice(index, 1);
    setEmails(newEmails);
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (emails.length === 0) {
      // TODO: Add an message that says they can go somewhere to add them later
    }
    await UpdateUserProfileOnboardingStep(props.currentStep + 1);
    for (var email in emailFullResults) {
      await DeleteInvitedUser(emailFullResults[email].id);
    }
    for (var email in emails) {
      await CreateInvitedUser(emails[email]);
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
          title="Add Users"
          description={
            "Invite some team members to join in on the release process. You can also have team members join by \
          going to /signup?code=" + tenant?.invite_code
          }
        />

        <form onSubmit={handleFormSubmit} onKeyPress={handleEnterPress}>
          <Stack spacing="5" divider={<StackDivider />}>
            <Box>
              <Stack spacing={2}>
                {emails.map((email, index) => (
                  <Stack direction="row" key={index} spacing={2} align="center">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e, index)}
                      placeholder="Email"
                      flex="1"
                      maxW="25%"
                      mr={2}
                      required
                    />
                    <Button
                      leftIcon={<BiX />}
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveEmail(index)}
                    >
                      Remove
                    </Button>
                  </Stack>
                ))}
              </Stack>
              <Button
                leftIcon={<BiPlus />}
                onClick={handleAddEmail}
                mt={2}
                maxW="25%"
              >
                Add New Email
              </Button>
            </Box>
            <Stack spacing={2} align="start">
              <Box as="section" bg="bg.surface" py={{ base: "4", md: "8" }}>
                <Container maxW="lg">
                  <FormControl id="file">
                    <FormLabel>
                      Upload Email CSV File
                      <Tooltip label="Upload a .csv file to add a list of emails to the form. Note: The CSV should have no headers and should be in the format of email1@test.com, email2@test.com...">
                        <IconButton
                          icon={<BiHelpCircle />}
                          colorScheme="gray"
                          aria-label="Upload a .csv file to add a list of emails to the form. Note: The CSV should have no headers and should be in the format of email1@test.com, email2@test.com..."
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
