import {
  Badge,
  Box,
  Center,
  HStack,
  IconButton,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Pagination } from "@components/Pagination";
import { FetchBlackoutForTenant } from "@services/BlackoutApi";
import { ConvertTimeToLocale } from "@utils/TimeConverter";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiEdit2, FiEye } from "react-icons/fi";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";
import { store } from "../../redux/store";

export const BlackoutTable = (props) => {
  const router = useRouter();
  const [blackouts, setBlackouts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState("name");
  const [orderBy, setOrderBy] = useState("asc");

  const checkIsOwner = (blackoutOwner) => {
    return blackoutOwner && blackoutOwner === profile.id;
  };

  const fetchBlackout = async () => {
    setLoading(true);
    const response = await FetchBlackoutForTenant(page, sortBy, orderBy);
    if (response.ok) {
      const data = await response.json();
      setBlackouts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlackout();
    const profileData = store.getState().user;
    setProfile(profileData);
  }, []);

  useEffect(() => {
    fetchBlackout();
  }, [page, orderBy, sortBy]);

  const viewBlackout = (identifier, e) => {
    router.push("/blackout/" + identifier);
  };

  const editBlackout = (identifier, e) => {
    router.push("/blackout/" + identifier + "/?mode=edit");
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setOrderBy(orderBy === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrderBy("desc");
    }
  };

  return (
    <>
      {loading && <Spinner></Spinner>}
      {blackouts && blackouts.count > 0 && (
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
                <Th>
                  <HStack spacing="3">
                    <HStack spacing="1">
                      <Text>Release Environment</Text>
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
                <Th>
                  <HStack spacing="3">
                    <HStack spacing="1">
                      <Text
                        cursor="pointer"
                        onClick={() => toggleSort("active_status")}
                      >
                        Status
                      </Text>
                      {sortBy === "active_status" && (
                        <IconButton
                          icon={
                            sortBy === "active_status" && orderBy === "desc" ? (
                              <IoArrowUp />
                            ) : (
                              <IoArrowDown />
                            )
                          }
                          boxSize="4"
                          background={"unset"}
                          onClick={() => toggleSort("active_status")}
                        />
                      )}
                    </HStack>
                  </HStack>
                </Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {blackouts.results.map((blackout) => (
                <Tr key={blackout.id}>
                  <Td>
                    <HStack spacing="3">
                      <Box>
                        <Text fontWeight="medium">{blackout.name}</Text>
                      </Box>
                    </HStack>
                  </Td>
                  <Td>
                    {blackout.release_environment.map((release_environment) => (
                      <Badge key={release_environment.value} mr={2}>
                        {release_environment.label}
                      </Badge>
                    ))}
                  </Td>
                  <Td>
                    <HStack spacing="3">
                      <Box>
                        <Text fontWeight="medium">
                          {ConvertTimeToLocale(blackout.start_date) || "TBD"}
                        </Text>
                      </Box>
                    </HStack>
                  </Td>
                  <Td>
                    <HStack spacing="3">
                      <Box>
                        <Badge>{blackout.active_status}</Badge>
                      </Box>
                    </HStack>
                  </Td>
                  <Td>
                    <HStack spacing="1">
                      <IconButton
                        icon={<FiEye />}
                        variant="tertiary"
                        aria-label="View Blackout"
                        onClick={() => viewBlackout(blackout.id)}
                      />
                      {checkIsOwner(blackout.owner) &&
                        blackout.active_status === "future" && (
                          <IconButton
                            icon={<FiEdit2 />}
                            variant="tertiary"
                            aria-label="Edit Blackout"
                            onClick={() => editBlackout(blackout.id)}
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
                count={blackouts.count}
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
      {!loading && blackouts?.count === 0 && <Text>No Blackouts Found</Text>}
    </>
  );
};
