import {
  Badge,
  Box,
  Center,
  Checkbox,
  Divider,
  FormControl,
  HStack,
  Heading,
  IconButton,
  Select,
  SimpleGrid,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Pagination } from "@components/paginiation";
import {
  FetchReleaseForTenant,
  GetReleaseEnvs,
  GetReleaseTypes,
} from "@services/ReleaseApi";
import { ConvertTimeToLocale } from "@utils/TimeConverter";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiEdit2, FiEye } from "react-icons/fi";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";
import { store } from "../../redux/store";

export const ReleaseTable = () => {
  const router = useRouter();
  const [releases, setReleases] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState("name");
  const [orderBy, setOrderBy] = useState("asc");
  const [envLoading, setEnvLoading] = useState(true);
  const [typeLoading, setTypeLoading] = useState(true);
  const [teamLoading, setTeamLoading] = useState(true);
  const [envs, setEnvs] = useState(null);
  const [types, setTypes] = useState(null);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [environments, setEnvironments] = useState("");
  const [releaseType, setReleaseType] = useState("");
  const [filterMyReleases, setFilterMyReleases] = useState(false);

  const checkIsOwner = (releaseOwner) => {
    return releaseOwner && releaseOwner === profile.id;
  };

  const fetchRelease = async () => {
    setLoading(true);
    const response = await FetchReleaseForTenant(
      page,
      sortBy,
      orderBy,
      filterMyReleases,
      releaseType,
      environments,
    );
    if (response.ok) {
      const data = await response.json();
      setReleases(data);
    }
    setLoading(false);
  };

  const fetchReleaseEnvs = async () => {
    setEnvLoading(true);
    const response = await GetReleaseEnvs(true);
    setError(null);
    if (response.ok) {
      const data = await response.json();
      setEnvs(data);
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

  useEffect(() => {
    fetchReleaseTypes();
    fetchReleaseEnvs();
    fetchRelease();
    const profileData = store.getState().user;
    setProfile(profileData);
  }, []);

  useEffect(() => {
    fetchRelease();
  }, [page, orderBy, sortBy, filterMyReleases, releaseType, environments]);

  const viewRelease = (identifier, e) => {
    router.push("/release/" + identifier);
  };

  const editRelease = (identifier, e) => {
    router.push("/release/" + identifier + "/?mode=edit");
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setOrderBy(orderBy === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrderBy("desc");
    }
  };

  const filterByType = (e) => {
    setReleaseType(e);
  };

  const filterByEnv = (e) => {
    setEnvironments(e);
  };

  const filterReleaseByMe = (e) => {
    setFilterMyReleases(e);
  };

  return (
    <>
      <>
        {!typeLoading && !envLoading && (
          <Box mb={4}>
            <Heading size={"sm"} pb={"5"}>
              Filter By:
            </Heading>
            <Checkbox
              size={"md"}
              mb={5}
              isChecked={filterMyReleases}
              onChange={(e) => filterReleaseByMe(e.target.checked)}
            >
              My Releases
            </Checkbox>
            <SimpleGrid columns={4} spacing={10}>
              <FormControl>
                <Select
                  placeholder="Filter Release Type"
                  value={releaseType}
                  onChange={(event) => filterByType(event.target.value)}
                >
                  {types.map((type) => (
                    <option key={type.name} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <Select
                  placeholder="Filter Release Environment"
                  value={environments}
                  onChange={(event) => filterByEnv(event.target.value)}
                >
                  {envs.map((env) => (
                    <option key={env.name} value={env.id}>
                      {env.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </SimpleGrid>
          </Box>
        )}
        <Divider />
        {loading && <Spinner></Spinner>}
        {releases && releases.count > 0 && (
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
                  <Th>
                    <HStack spacing="3">
                      <HStack spacing="1">
                        <Text
                          cursor="pointer"
                          onClick={() => toggleSort("current_stage")}
                        >
                          Status
                        </Text>
                        {sortBy === "current_stage" && (
                          <IconButton
                            icon={
                              sortBy === "current_stage" &&
                              orderBy === "desc" ? (
                                <IoArrowUp />
                              ) : (
                                <IoArrowDown />
                              )
                            }
                            boxSize="4"
                            background={"unset"}
                            onClick={() => toggleSort("current_stage")}
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
                          onClick={() => toggleSort("start_date")}
                        >
                          Start Date
                        </Text>
                        {sortBy === "start_date" && (
                          <IconButton
                            icon={
                              sortBy === "start_date" && orderBy === "asc" ? (
                                <IoArrowUp />
                              ) : (
                                <IoArrowDown />
                              )
                            }
                            boxSize="4"
                            background={"unset"}
                            onClick={() => toggleSort("start_date")}
                          />
                        )}
                      </HStack>
                    </HStack>
                  </Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {releases.results.map((release) => (
                  <Tr key={release.id}>
                    <Td>
                      <HStack spacing="3">
                        <Box>
                          <Text fontWeight="medium">{release.name}</Text>
                        </Box>
                      </HStack>
                    </Td>
                    <Td>
                      <Badge size="sm">{release.current_stage}</Badge>
                    </Td>
                    <Td>
                      <HStack spacing="3">
                        <Box>
                          <Text fontWeight="medium">
                            {ConvertTimeToLocale(release.start_date) || "TBD"}
                          </Text>
                        </Box>
                      </HStack>
                    </Td>
                    <Td>
                      <HStack spacing="1">
                        <IconButton
                          icon={<FiEye />}
                          variant="tertiary"
                          aria-label="View Release"
                          onClick={() => viewRelease(release.identifier)}
                        />
                        {checkIsOwner(release.owner) && (
                          <IconButton
                            icon={<FiEdit2 />}
                            variant="tertiary"
                            aria-label="Edit Release"
                            onClick={() => editRelease(release.identifier)}
                          />
                        )}
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Center>
              <Box bg="bg.surface" width={"30%"}>
                <Pagination
                  count={releases.count}
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
      </>
      {!loading && releases?.count === 0 && <Text>No Releases Found</Text>}
    </>
  );
};
