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
import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";
import { Pagination } from "@components/paginiation";
import { GetRoles } from "@services/RoleApi";
import { DeleteRole } from "@services/RoleApi";
import { CreateRole } from "@services/RoleApi";
import { AlertMessage } from "@components/AlertMessage";

export const RolesManagementTable = () => {
  const [roles, setRoles] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState("name");
  const [orderBy, setOrderBy] = useState("asc");
  const [update, setUpdate] = useState(true);
  const [newRole, setNewRole] = useState("");
  const router = useRouter();

  const fetchRoles = async () => {
    setLoading(true);
    const response = await GetRoles(false, page, sortBy, orderBy);
    if (response.ok) {
      const data = await response.json();
      setRoles(data);
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const viewRole = (id, e) => {
    router.push("/role/" + id);
  };

  const editRole = (id, e) => {
    router.push("/role/" + id + "/?mode=edit");
  };

  const deleteRole = async (e) => {
    //TODO: Add confirm modal and let them know what happens to users
    // that were part of that team. Also, they may not be able to delete
    // ones that users are referencing. Figure that out
    //TODO: Add toast
    await DeleteRole(e);
    setUpdate(!update);
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
    fetchRoles();
  }, [page, orderBy, sortBy, update]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const response = await CreateRole(newRole);
    if (response.ok) {
      setNewRole("");
      setUpdate(!update);
      setErrorMessage("");
    } else {
      setErrorMessage("Role already exists");
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
              <FormLabel>Add New Role</FormLabel>
              <Input
                required
                type="text"
                placeholder="Role"
                value={newRole}
                onChange={(event) => setNewRole(event.target.value)}
              />
              <Button
                type="submit"
                bg="brand.button_enabled"
                color="brand.white_text"
                size={"sm"}
                mt={5}
              >
                Add Role
              </Button>
            </FormControl>
          </SimpleGrid>
        </form>
      </Box>
      <Divider mb={5} />
      {roles && roles.count > 0 && (
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
              {roles.results.map((role) => (
                <Tr key={role.id}>
                  <Td>
                    <HStack spacing="3">
                      <Box>
                        <Text fontWeight="medium">{role.name}</Text>
                      </Box>
                    </HStack>
                  </Td>
                  <Td></Td>
                  <Td>
                    <HStack spacing="1">
                      <IconButton
                        icon={<FiEye />}
                        variant="tertiary"
                        aria-label="View role"
                        onClick={() => viewRole(role.id)}
                      />
                      <IconButton
                        icon={<FiEdit2 />}
                        variant="tertiary"
                        aria-label="Edit role"
                        onClick={() => editRole(role.id)}
                      />
                      <IconButton
                        icon={<FiTrash2 />}
                        variant="tertiary"
                        aria-label="Delete role"
                        onClick={() => deleteRole(role.id)}
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
                count={roles.count}
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
      {roles?.count === 0 && <Text>No roles found</Text>}
    </>
  );
};