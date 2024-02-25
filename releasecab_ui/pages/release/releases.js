import { useState } from "react";
import { Box, Button, ButtonGroup, Stack } from "@chakra-ui/react";
import { Layout } from "@components/Layout";
import { AppShell } from "@components/app-shell/AppShell";
import { WithAuthGuard } from "@utils/auth/AuthGuard";
import { Header } from "@components/Header";
import { BiCalendarWeek, BiListUl } from "react-icons/bi";
import { ReleaseTable } from "@components/releases/ReleaseTable";
import { ReleaseCalendar } from "@components/releases/ReleaseCalendar";

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
