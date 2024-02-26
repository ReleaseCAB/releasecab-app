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
import { Pagination } from "@components/paginiation";
import { GetUsers } from "@services/UserApi";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiEdit2, FiEye } from "react-icons/fi";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";

export const UserManagementTable = () => {
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState("last_name");
  const [orderBy, setOrderBy] = useState("asc");
  const router = useRouter();

  const fetchUsers = async () => {
    setLoading(true);
    const response = await GetUsers(page, sortBy, orderBy);
    if (response.ok) {
      const data = await response.json();
      setUsers(data);
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const viewUser = (id, e) => {
    router.push("/user/" + id);
  };

  const editUser = (id, e) => {
    router.push("/user/" + id + "/?mode=edit");
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
    fetchUsers();
  }, [page, orderBy, sortBy]);

  return (
    <>
      {loading && <Spinner></Spinner>}
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
                        onClick={() => toggleSort("last_name")}
                      >
                        Name
                      </Text>
                      {sortBy === "last_name" && (
                        <IconButton
                          icon={
                            sortBy === "last_name" && orderBy === "desc" ? (
                              <IoArrowUp />
                            ) : (
                              <IoArrowDown />
                            )
                          }
                          boxSize="4"
                          background={"unset"}
                          onClick={() => toggleSort("last_name")}
                        />
                      )}
                    </HStack>
                  </HStack>
                </Th>
                <Th>
                  <HStack spacing="3">
                    <HStack spacing="1">
                      <Text>Email</Text>
                    </HStack>
                  </HStack>
                </Th>
                <Th>
                  <HStack spacing="3">
                    <HStack spacing="1">
                      <Text
                        cursor="pointer"
                        onClick={() => toggleSort("is_tenant_owner")}
                      >
                        Owner Status
                      </Text>
                      {sortBy === "is_tenant_owner" && (
                        <IconButton
                          icon={
                            sortBy === "is_tenant_owner" &&
                            orderBy === "desc" ? (
                              <IoArrowUp />
                            ) : (
                              <IoArrowDown />
                            )
                          }
                          boxSize="4"
                          background={"unset"}
                          onClick={() => toggleSort("is_tenant_owner")}
                        />
                      )}
                    </HStack>
                  </HStack>
                </Th>
                <Th>
                  <HStack spacing="3">
                    <HStack spacing="1">
                      <Text>Is Approved/Active</Text>
                    </HStack>
                  </HStack>
                </Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.results.map((user) => (
                <Tr key={user.id}>
                  <Td>
                    <HStack spacing="3">
                      <Box>
                        <Text fontWeight="medium">
                          {user.last_name}, {user.first_name}
                        </Text>
                      </Box>
                    </HStack>
                  </Td>
                  <Td>{user.email}</Td>
                  <Td>{user.is_tenant_owner ? "Owner" : "User"}</Td>
                  <Td>
                    <Badge>
                      {user.is_active
                        ? "Approved/Active"
                        : "Not Approved/Active"}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing="1">
                      <IconButton
                        icon={<FiEye />}
                        variant="tertiary"
                        aria-label="View user"
                        onClick={() => viewUser(user.id)}
                      />
                      <IconButton
                        icon={<FiEdit2 />}
                        variant="tertiary"
                        aria-label="Edit user"
                        onClick={() => editUser(user.id)}
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
      {users?.count === 0 && <Text>No users found</Text>}
    </>
  );
};
