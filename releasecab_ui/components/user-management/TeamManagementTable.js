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
import { DeleteAlertDialog } from "@components/DeleteAlertDialog";
import { Dropzone } from "@components/Dropzone";
import { Pagination } from "@components/paginiation";
import { CreateTeam, DeleteTeam, GetTeams } from "@services/TeamApi";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiHelpCircle } from "react-icons/bi";
import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";

export const TeamManagementTable = () => {
  const [teams, setTeams] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState("name");
  const [orderBy, setOrderBy] = useState("asc");
  const [update, setUpdate] = useState(true);
  const [teamFile, setTeamFile] = useState(null);
  const [newTeam, setNewTeam] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState();
  const router = useRouter();
  const toast = useToast();

  const handleClose = () => setIsDialogOpen(false);

  const fetchTeams = async () => {
    setLoading(true);
    const response = await GetTeams(false, page, sortBy, orderBy);
    if (response.ok) {
      const data = await response.json();
      setTeams(data);
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const viewTeam = (id, e) => {
    router.push("/team/" + id);
  };

  const editTeam = (id, e) => {
    router.push("/team/" + id + "/?mode=edit");
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setOrderBy(orderBy === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrderBy("desc");
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [page, orderBy, sortBy, update]);

  useEffect(() => {
    if (teamFile) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csv = e.target.result;
        const allTextLines = csv.split(/\r\n|\n/);
        const newTeams = [];
        for (let i = 0; i < allTextLines.length; i++) {
          const data = allTextLines[i]
            .split(",")
            .map((entry) => entry.trim().replace(/'/g, ""));
          for (let j = 0; j < data.length; j++) {
            const team = data[j];
            if (team && team !== "") {
              newTeams.push(team);
            }
          }
        }
        var response;
        for (var team in newTeams) {
          response = await CreateTeam(newTeams[team]);
        }
        if (response.ok) {
          setUpdate(!update);
          const data = await response.json();
          toast({
            title: "Successfully uploaded " + data.new_teams_count + " teams",
            status: "success",
            isClosable: true,
            duration: 5000,
          });
        } else {
          toast({
            title: "Error uploading teams",
            status: "error",
            isClosable: true,
            duration: 5000,
          });
        }
      };
      reader.readAsText(teamFile);
    }
  }, [teamFile]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const response = await CreateTeam(newTeam);
    if (response.ok) {
      setNewTeam("");
      setUpdate(!update);
      setErrorMessage("");
    } else {
      setErrorMessage("Team already exists");
    }
  };

  const deleteTeam = async (e) => {
    setIsDialogOpen(true);
    setTeamToDelete(e);
  };

  const onDeleteAction = async (action) => {
    if (action === "delete") {
      const deleteResult = await DeleteTeam(teamToDelete);
      if (deleteResult.ok) {
        toast({
          title: "Team Deleted",
          status: "success",
          isClosable: true,
          duration: 5000,
        });
      } else {
        toast({
          title: "Unable To Delete Team",
          status: "error",
          isClosable: true,
          duration: 5000,
        });
      }
      setUpdate(!update);
      setTeamToDelete();
    } else {
      setTeamToDelete();
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
              <FormLabel>Add New Team</FormLabel>
              <Input
                required
                type="text"
                placeholder="Team"
                value={newTeam}
                onChange={(event) => setNewTeam(event.target.value)}
              />
              <Button
                type="submit"
                bg="brand.button_enabled"
                color="brand.white_text"
                size={"sm"}
                mt={5}
              >
                Add Team
              </Button>
            </FormControl>
            <Container maxW="lg">
              <FormControl id="teamFile">
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
                  setfile={setTeamFile}
                  seterror={setErrorMessage}
                />
              </FormControl>
            </Container>
          </SimpleGrid>
        </form>
      </Box>
      <Divider mb={5} />
      {teams && teams.count > 0 && (
        <>
          <Table>
            <Thead>
              <Tr>
                <Th>
                  <HStack spacing="3">
                    <HStack spacing="1">
                      <Text cursor="pointer" onClick={() => toggleSort("name")}>
                        Name
                      </Text>
                      {sortBy === "name" && (
                        <IconButton
                          icon={
                            sortBy === "name" && orderBy === "desc" ? (
                              <IoArrowUp />
                            ) : (
                              <IoArrowDown />
                            )
                          }
                          boxSize="4"
                          background={"unset"}
                          onClick={() => toggleSort("name")}
                        />
                      )}
                    </HStack>
                  </HStack>
                </Th>
                <Th></Th>
                <Th></Th>
                <Th></Th>
                <Th></Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {teams.results.map((team) => (
                <Tr key={team.id}>
                  <Td>
                    <HStack spacing="3">
                      <Box>
                        <Text fontWeight="medium">{team.name}</Text>
                      </Box>
                    </HStack>
                  </Td>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                  <Td>
                    <HStack spacing="1">
                      <IconButton
                        icon={<FiEye />}
                        variant="tertiary"
                        aria-label="View team"
                        onClick={() => viewTeam(team.id)}
                      />
                      <IconButton
                        icon={<FiEdit2 />}
                        variant="tertiary"
                        aria-label="Edit team"
                        onClick={() => editTeam(team.id)}
                      />
                      <IconButton
                        icon={<FiTrash2 />}
                        variant="tertiary"
                        aria-label="Delete team"
                        onClick={() => deleteTeam(team.id)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Center>
            <Box bg="bg.surface" width={"30%"}>
              <Pagination
                count={teams.count}
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
      {teams?.count === 0 && <Text>No teams found</Text>}
      <DeleteAlertDialog
        isOpen={isDialogOpen}
        onClose={handleClose}
        title="Delete Team"
        onDelete={onDeleteAction}
      />
    </>
  );
};
