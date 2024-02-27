import { Box, Text } from "@chakra-ui/react";
import { Header } from "@components/Header";
import { Layout } from "@components/Layout";
import { AppShell } from "@components/app-shell/AppShell";
import { FetchCommunication } from "@services/CommunicationApi";
import { WithAuthGuard } from "@utils/auth/AuthGuard";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Message = () => {
  const router = useRouter();
  const messageId = router.query.message;
  const pageTitle = "View Message";
  const [messageTitle, setMessageTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState({});
  const [loadCount, setLoadCount] = useState(0);

  const fetchMessage = async () => {
    setLoading(true);
    if (loadCount > 0 || messageId != undefined) {
      const response = await FetchCommunication(messageId);
      if (response.ok) {
        const data = await response.json();
        setMessage(data);
        setBreadcrumbs([
          { name: "Inbox", href: "/inbox/messages" },
          { name: router.query.message },
        ]);
      } else {
        router.push("/");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessage();
    setLoadCount(loadCount + 1);
  }, [router.query.message]);

  useEffect(() => {
    if (message) {
      setMessageTitle("View Message: " + message?.id);
    }
  }, [message]);

  const renderContent = () => {
    return (
      message && (
        <>
          <Header
            title={messageTitle}
            secondaryTitle=""
            showSearchBox="true"
            crumbs={breadcrumbs}
          />
          <Box
            bg="bg.surface"
            boxShadow={{ base: "none", md: "sm" }}
            borderRadius={{ base: "none", md: "lg" }}
            pt={5}
            pl={10}
          >
            <Text as="b">{message.message_title}</Text>
            <hr />
            <Text pt="5">{message.message_body}</Text>
          </Box>
        </>
      )
    );
  };

  return (
    <Layout title={pageTitle} showfooter="false">
      <AppShell pageContent={renderContent()} />
    </Layout>
  );
};

export default WithAuthGuard(Message);
