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
import { AddNewReleaseType, GetReleaseTypes } from "@services/ReleaseApi";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiEdit2, FiEye } from "react-icons/fi";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";

// TODO: We don't allow delete from here. We need to figure out
// The best way to do that
export const ReleaseTypesTable = () => {
  const [releaseTypes, setReleaseTypes] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState("name");
  const [orderBy, setOrderBy] = useState("asc");
  const [update, setUpdate] = useState(true);
  const [newReleaseType, setNewReleaseType] = useState("");
  const router = useRouter();

  const fetchReleaseTypes = async () => {
    setLoading(true);
    const response = await GetReleaseTypes(false, page, sortBy, orderBy);
    if (response.ok) {
      const data = await response.json();
      setReleaseTypes(data);
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReleaseTypes();
  }, []);

  const viewReleaseType = (id, e) => {
    router.push("/release-type/" + id);
  };

  const editReleaseType = (id, e) => {
    router.push("/release-type/" + id + "/?mode=edit");
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
    fetchReleaseTypes();
  }, [page, orderBy, sortBy, update]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const response = await AddNewReleaseType(newReleaseType);
    if (response.ok) {
      setNewReleaseType("");
      setUpdate(!update);
      setErrorMessage("");
    } else {
      setErrorMessage("Release type already exists");
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
              <FormLabel>Add New Release Type</FormLabel>
              <Input
                required
                type="text"
                placeholder="Release Type"
                value={newReleaseType}
                onChange={(event) => setNewReleaseType(event.target.value)}
              />
              <Button
                type="submit"
                bg="brand.button_enabled"
                color="brand.white_text"
                size={"sm"}
                mt={5}
              >
                Add Release Type
              </Button>
            </FormControl>
          </SimpleGrid>
        </form>
      </Box>
      <Divider mb={5} />
      {releaseTypes && releaseTypes.count > 0 && (
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
              {releaseTypes.results.map((releaseType) => (
                <Tr key={releaseType.id}>
                  <Td>
                    <HStack spacing="3">
                      <Box>
                        <Text fontWeight="medium">{releaseType.name}</Text>
                      </Box>
                    </HStack>
                  </Td>
                  <Td></Td>
                  <Td>
                    <HStack spacing="1">
                      <IconButton
                        icon={<FiEye />}
                        variant="tertiary"
                        aria-label="View release type"
                        onClick={() => viewReleaseType(releaseType.id)}
                      />
                      <IconButton
                        icon={<FiEdit2 />}
                        variant="tertiary"
                        aria-label="Edit release type"
                        onClick={() => editReleaseType(releaseType.id)}
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
                count={releaseTypes.count}
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
      {releaseTypes?.count === 0 && <Text>No release types found</Text>}
    </>
  );
};
