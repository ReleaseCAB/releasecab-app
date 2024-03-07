import {
  Box,
  Center,
  HStack,
  IconButton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Header } from "@components/Header";
import { Layout } from "@components/Layout";
import { Pagination } from "@components/Pagination";
import { AppShell } from "@components/app-shell/AppShell";
import { FetchUserManagedTeams } from "@services/TeamApi";
import { WithAuthGuard } from "@utils/auth/AuthGuard";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiEdit2, FiEye } from "react-icons/fi";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";

//TODO: Only pull teams we are managers of
const ManageTeam = () => {
  const pageTitle = "Manage Team";
  const [teams, setTeams] = useState();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState("name");
  const [orderBy, setOrderBy] = useState("asc");
  const [update, setUpdate] = useState(true);
  const router = useRouter();

  const fetchTeams = async () => {
    setLoading(true);
    const response = await FetchUserManagedTeams(false, page, sortBy, orderBy);
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
    router.push("/manage/" + id);
  };

  const editTeam = (id, e) => {
    router.push("/manage/" + id + "/?mode=edit");
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

  const renderContent = () => {
    return (
      <>
        <Header
          title="Team Management"
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
          <Stack spacing="16">
            {teams && teams.count > 0 && (
              <>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>
                        <HStack spacing="3">
                          <HStack spacing="1">
                            <Text
                              cursor="pointer"
                              onClick={() => toggleSort("name")}
                            >
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
            {teams?.count === 0 && <Text>No teams found</Text>}{" "}
          </Stack>
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

export default WithAuthGuard(ManageTeam);
