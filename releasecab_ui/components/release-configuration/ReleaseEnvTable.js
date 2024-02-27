import {
  Box,
  Button,
  Center,
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
  Tr,
} from "@chakra-ui/react";
import { AlertMessage } from "@components/AlertMessage";
import { Pagination } from "@components/paginiation";
import { AddNewReleaseEnv, GetReleaseEnvs } from "@services/ReleaseApi";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiEdit2, FiEye } from "react-icons/fi";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";

// TODO: We don't allow delete from here. We need to figure out
// The best way to do that
export const ReleaseEnvTable = () => {
  const [releaseEnvs, setreleaseEnvs] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState("name");
  const [orderBy, setOrderBy] = useState("asc");
  const [update, setUpdate] = useState(true);
  const [newReleaseEnv, setNewReleaseEnv] = useState("");
  const router = useRouter();

  const fetchReleaseEnvs = async () => {
    setLoading(true);
    const response = await GetReleaseEnvs(false, page, sortBy, orderBy);
    if (response.ok) {
      const data = await response.json();
      setreleaseEnvs(data);
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReleaseEnvs();
  }, []);

  const viewReleaseEnv = (id, e) => {
    router.push("/release-env/" + id);
  };

  const editReleaseEnv = (id, e) => {
    router.push("/release-env/" + id + "/?mode=edit");
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
    fetchReleaseEnvs();
  }, [page, orderBy, sortBy, update]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const response = await AddNewReleaseEnv(newReleaseEnv);
    if (response.ok) {
      setNewReleaseEnv("");
      setUpdate(!update);
      setErrorMessage("");
    } else {
      setErrorMessage("Release Environment already exists");
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
              <FormLabel>Add New Release Environment</FormLabel>
              <Input
                required
                type="text"
                placeholder="Release Environment"
                value={newReleaseEnv}
                onChange={(event) => setNewReleaseEnv(event.target.value)}
              />
              <Button
                type="submit"
                bg="brand.button_enabled"
                color="brand.white_text"
                size={"sm"}
                mt={5}
              >
                Add Release Environment
              </Button>
            </FormControl>
          </SimpleGrid>
        </form>
      </Box>
      <Divider mb={5} />
      {releaseEnvs && releaseEnvs.count > 0 && (
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
              </Tr>
            </Thead>
            <Tbody>
              {releaseEnvs.results.map((releaseEnv) => (
                <Tr key={releaseEnv.id}>
                  <Td>
                    <HStack spacing="3">
                      <Box>
                        <Text fontWeight="medium">{releaseEnv.name}</Text>
                      </Box>
                    </HStack>
                  </Td>
                  <Td></Td>
                  <Td>
                    <HStack spacing="1">
                      <IconButton
                        icon={<FiEye />}
                        variant="tertiary"
                        aria-label="View release env"
                        onClick={() => viewReleaseEnv(releaseEnv.id)}
                      />
                      <IconButton
                        icon={<FiEdit2 />}
                        variant="tertiary"
                        aria-label="Edit release env"
                        onClick={() => editReleaseEnv(releaseEnv.id)}
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
                count={releaseEnvs.count}
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
      {releaseEnvs?.count === 0 && <Text>No release environments found</Text>}
    </>
  );
};
