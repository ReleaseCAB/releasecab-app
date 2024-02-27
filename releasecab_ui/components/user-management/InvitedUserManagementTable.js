import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  SimpleGrid,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { AlertMessage } from "@components/AlertMessage";
import { Dropzone } from "@components/Dropzone";
import { Pagination } from "@components/paginiation";
import {
  CreateInvitedUser,
  DeleteInvitedUser,
  GetInvitedUser,
  GetMyTenant,
} from "@services/TenantApi";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiHelpCircle } from "react-icons/bi";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";

export const InvitedUserManagementTable = () => {
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState("email");
  const [orderBy, setOrderBy] = useState("asc");
  const [newInvitedUser, setNewInvitedUser] = useState("");
  const [tenant, setTenant] = useState(null);
  const [update, setUpdate] = useState(true);
  const [file, setFile] = useState(null);
  const router = useRouter();
  const toast = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    const response = await GetInvitedUser(false, page, sortBy, orderBy);
    if (response.ok) {
      const data = await response.json();
      setUsers(data);
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  const fetchTenant = async () => {
    const response = await GetMyTenant();
    if (response.ok) {
      const data = await response.json();
      setTenant(data);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTenant();
  }, []);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setOrderBy(orderBy === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrderBy("desc");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, orderBy, sortBy, update]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const response = await CreateInvitedUser(newInvitedUser);
    if (response.ok) {
      setNewInvitedUser("");
      setUpdate(!update);
      setErrorMessage("");
    } else {
      setErrorMessage("Email already exists");
    }
  };

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csv = e.target.result;
        const allTextLines = csv.split(/\r\n|\n/);
        const newEmails = [];
        for (let i = 0; i < allTextLines.length; i++) {
          const data = allTextLines[i]
            .split(",")
            .map((entry) => entry.trim().replace(/'/g, ""));
          for (let j = 0; j < data.length; j++) {
            const email = data[j];
            if (email && email !== "") {
              newEmails.push(email);
            }
          }
        }
        var response;
        for (var email in newEmails) {
          response = await CreateInvitedUser(newEmails[email]);
        }
        if (response.ok) {
          setUpdate(!update);
          const data = await response.json();
          toast({
            title: "Successfully uploaded " + data.new_emails_count + " emails",
            status: "success",
            isClosable: true,
            duration: 5000,
          });
        } else {
          toast({
            title: "Error uploading emails",
            status: "error",
            isClosable: true,
            duration: 5000,
          });
        }
      };
      reader.readAsText(file);
    }
  }, [file]);

  const uninviteUser = async (userId) => {
    const deletedResult = await DeleteInvitedUser(userId);
    if (deletedResult.ok) {
      setUpdate(!update);
      toast({
        title: "Successfully Uninvited User",
        status: "success",
        isClosable: true,
        duration: 5000,
      });
    } else {
      toast({
        title: "Error Uninviting User",
        status: "error",
        isClosable: true,
        duration: 5000,
      });
    }
  };

  return (
    <>
      {loading && <Spinner></Spinner>}
      <Box mb={4}>
        {errorMessage && (
          <AlertMessage message={errorMessage} type="warning" title="Warning" />
        )}
        <form onSubmit={handleFormSubmit}>
          <SimpleGrid columns={3} spacing={10}>
            <FormControl isRequired>
              <FormLabel>Invite New User</FormLabel>
              <Input
                required
                type="email"
                placeholder="Work Email Address"
                value={newInvitedUser}
                onChange={(event) => setNewInvitedUser(event.target.value)}
              />
              <Button
                type="submit"
                bg="brand.button_enabled"
                color="brand.white_text"
                size={"sm"}
                mt={5}
              >
                Invite New User
              </Button>
            </FormControl>
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
                  seterror={setErrorMessage}
                />
              </FormControl>
            </Container>
          </SimpleGrid>
        </form>
        <Text textStyle="xs" mt={4}>
          You can also have team members join by going to /signup?code=
          {tenant?.invite_code}
        </Text>
      </Box>
      <Divider mb={5} />
      {users && users.count > 0 && (
        <>
          <Table>
            <Thead>
              <Tr>
                <Th>
                  <HStack spacing="3">
                    <HStack spacing="1">
                      <Text
                        cursor="pointer"
                        onClick={() => toggleSort("email")}
                      >
                        Email
                      </Text>
                      {sortBy === "email" && (
                        <IconButton
                          icon={
                            sortBy === "email" && orderBy === "desc" ? (
                              <IoArrowUp />
                            ) : (
                              <IoArrowDown />
                            )
                          }
                          boxSize="4"
                          background={"unset"}
                          onClick={() => toggleSort("email")}
                        />
                      )}
                    </HStack>
                  </HStack>
                </Th>
                <Th>
                  <HStack spacing="3">
                    <HStack spacing="1">
                      <Text
                        cursor="pointer"
                        onClick={() => toggleSort("has_joined")}
                      >
                        Has Signed Up
                      </Text>
                      {sortBy === "has_joined" && (
                        <IconButton
                          icon={
                            sortBy === "has_joined" && orderBy === "desc" ? (
                              <IoArrowUp />
                            ) : (
                              <IoArrowDown />
                            )
                          }
                          boxSize="4"
                          background={"unset"}
                          onClick={() => toggleSort("has_joined")}
                        />
                      )}
                    </HStack>
                  </HStack>
                </Th>
                <Th></Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.results.map((user) => (
                <Tr key={user.id}>
                  <Td>
                    <HStack spacing="3">
                      <Box>
                        <Text fontWeight="medium">{user.email}</Text>
                      </Box>
                    </HStack>
                  </Td>
                  <Td>{user.has_joined ? "true" : "false"}</Td>
                  <Td></Td>
                  <Td>
                    {!user.has_joined && (
                      <Button
                        bg="brand.button_enabled"
                        color="brand.white_text"
                        size={"sm"}
                        mt={5}
                        onClick={() => uninviteUser(user.id)}
                      >
                        Uninvite User
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Center>
            <Box bg="bg.surface" width={"30%"}>
              <Pagination
                count={users.count}
                pageSize={pageSize}
                siblingCount={2}
                page={page}
                setPage={setPage}
                onChange={(e) => setPage(e.page)}
              />
            </Box>
          </Center>
        </>
      )}
      {users?.count === 0 && <Text>No invited users found</Text>}
    </>
  );
};
