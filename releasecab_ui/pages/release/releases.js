import { Box, Button, ButtonGroup, Stack } from "@chakra-ui/react";
import { Header } from "@components/Header";
import { Layout } from "@components/Layout";
import { AppShell } from "@components/app-shell/AppShell";
import { ReleaseCalendar } from "@components/releases/ReleaseCalendar";
import { ReleaseTable } from "@components/releases/ReleaseTable";
import { WithAuthGuard } from "@utils/auth/AuthGuard";
import { useState } from "react";
import { BiCalendarWeek, BiListUl } from "react-icons/bi";

const Releases = () => {
  const [view, setView] = useState("list");
  const pageTitle = "Releases";

  const renderContent = () => {
    return (
      <>
        <Header title="Releases" secondaryTitle="" showSearchBox="true" />
        <Box
          bg="bg.surface"
          boxShadow={{ base: "none", md: "sm" }}
          borderRadius={{ base: "none", md: "lg" }}
          pt={5}
          pl={10}
        >
          <ButtonGroup pt={5}>
            {view === "list" && (
              <Button
                leftIcon={<BiCalendarWeek />}
                size="sm"
                variant="outline"
                onClick={() => setView("calendar")}
              >
                Switch To Calendar View
              </Button>
            )}
            {view === "calendar" && (
              <Button
                leftIcon={<BiListUl />}
                size="sm"
                variant="outline"
                onClick={() => setView("list")}
              >
                Switch To List View
              </Button>
            )}
          </ButtonGroup>
          {view === "list" && (
            <Stack spacing="5" pt={10}>
              <ReleaseTable />
            </Stack>
          )}
          {view === "calendar" && (
            <Stack pt={10}>
              <ReleaseCalendar />
            </Stack>
          )}
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

export default WithAuthGuard(Releases);
