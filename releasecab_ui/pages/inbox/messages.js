import {
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
import { Header } from "@components/Header";
import { Layout } from "@components/Layout";
import { AppShell } from "@components/app-shell/AppShell";
import { Pagination } from "@components/paginiation";
import { FetchCommunications } from "@services/CommunicationApi";
import { ConvertTimeToLocale } from "@utils/TimeConverter";
import { WithAuthGuard } from "@utils/auth/AuthGuard";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";

const Inbox = () => {
  const pageTitle = "Inbox";
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const router = useRouter();

  const fetchMessages = async () => {
    setLoading(true);
    const response = await FetchCommunications(page);
    if (response.ok) {
      const data = await response.json();
      setMessages(data);
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, [page]);

  const viewMessage = async (messageId) => {
    router.push("/inbox/" + messageId);
  };

  const renderContent = () => {
    return (
      <>
        <Header title="Inbox" secondaryTitle="" showSearchBox="true" />
        <Box
          bg="bg.surface"
          boxShadow={{ base: "none", md: "sm" }}
          borderRadius={{ base: "none", md: "lg" }}
          pt={5}
          pl={10}
        ></Box>
        {loading && <Spinner></Spinner>}
        {messages && messages.count > 0 && (
          <>
            <Table>
              <Thead>
                <Tr>
                  <Th>
                    <HStack spacing="3">
                      <HStack spacing="1">
                        <Text cursor="pointer">Date</Text>
                      </HStack>
                    </HStack>
                  </Th>
                  <Th>
                    <HStack spacing="3">
                      <HStack spacing="1">
                        <Text cursor="pointer">Title</Text>
                      </HStack>
                    </HStack>
                  </Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {messages.results.map((message) => (
                  <Tr key={message.id}>
                    <Td>
                      <HStack spacing="3">
                        <Box>
                          <Text fontWeight="medium">
                            {ConvertTimeToLocale(message.created_at)}
                          </Text>
                        </Box>
                      </HStack>
                    </Td>
                    <Td>
                      <HStack spacing="3">
                        <Box>
                          <Text fontWeight="medium">
                            {message.message_title}
                          </Text>
                        </Box>
                      </HStack>
                    </Td>
                    <Td>
                      <HStack spacing="1">
                        <IconButton
                          icon={<FiEye />}
                          variant="tertiary"
                          aria-label="View Message"
                          onClick={() => viewMessage(message.id)}
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
                  count={messages.count}
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
        {messages?.count === 0 && <Text>No messages found</Text>}
      </>
    );
  };

  return (
    <Layout title={pageTitle} showfooter="false">
      <AppShell pageContent={renderContent()} />
    </Layout>
  );
};

export default WithAuthGuard(Inbox);
