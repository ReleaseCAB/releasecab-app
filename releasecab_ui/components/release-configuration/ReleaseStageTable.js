import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Box,
  Center,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Input,
  IconButton,
  Spinner,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FiEdit2, FiEye } from "react-icons/fi";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";
import { Pagination } from "@components/paginiation";
import { GetReleaseStages } from "@services/ReleaseApi";
import { AlertMessage } from "@components/AlertMessage";
import { CreateReleaseStage } from "@services/ReleaseApi";

// TODO: We don't allow delete from here. We need to figure out
// The best way to do that
export const ReleaseStageTable = () => {
  const [releaseStages, setReleaseStages] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState("name");
  const [orderBy, setOrderBy] = useState("asc");
  const [update, setUpdate] = useState(true);
  const [newReleaseStage, setNewReleaseStage] = useState("");
  const router = useRouter();

  const fetchReleaseStages = async () => {
    setLoading(true);
    const response = await GetReleaseStages(false, page, sortBy, orderBy);
    if (response.ok) {
      const data = await response.json();
      setReleaseStages(data);
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReleaseStages();
  }, []);

  const viewReleaseStage = (id, e) => {
    router.push("/release-stage/" + id);
  };

  const editReleaseStage = (id, e) => {
    router.push("/release-stage/" + id + "/?mode=edit");
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
    fetchReleaseStages();
  }, [page, orderBy, sortBy, update]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const response = await CreateReleaseStage(newReleaseStage);
    if (response.ok) {
      setNewReleaseStage("");
      setUpdate(!update);
      setErrorMessage("");
    } else {
      setErrorMessage("Release stage already exists");
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
              <FormLabel>Add New Release Stage</FormLabel>
              <Input
                required
                type="text"
                placeholder="Release Stage"
                value={newReleaseStage}
                onChange={(event) => setNewReleaseStage(event.target.value)}
              />
              <Button
                type="submit"
                bg="brand.button_enabled"
                color="brand.white_text"
                size={"sm"}
                mt={5}
              >
                Add Release Stage
              </Button>
            </FormControl>
          </SimpleGrid>
        </form>
      </Box>
      <Divider mb={5} />
      {releaseStages && releaseStages.count > 0 && (
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
              {releaseStages.results.map((releaseStage) => (
                <Tr key={releaseStage.id}>
                  <Td>
                    <HStack spacing="3">
                      <Box>
                        <Text fontWeight="medium">{releaseStage.name}</Text>
                      </Box>
                    </HStack>
                  </Td>
                  <Td></Td>
                  <Td>
                    <HStack spacing="1">
                      <IconButton
                        icon={<FiEye />}
                        variant="tertiary"
                        aria-label="View release stage"
                        onClick={() => viewReleaseStage(releaseStage.id)}
                      />
                      <IconButton
                        icon={<FiEdit2 />}
                        variant="tertiary"
                        aria-label="Edit release stage"
                        onClick={() => editReleaseStage(releaseStage.id)}
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
                count={releaseStages.count}
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
      {releaseStages?.count === 0 && <Text>No release stages found</Text>}
    </>
  );
};
