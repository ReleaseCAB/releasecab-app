import { Box, Container, SimpleGrid } from "@chakra-ui/react";
import { Header } from "@components/Header";
import { Layout } from "@components/Layout";
import { Stat } from "@components/Stat";
import { AppShell } from "@components/app-shell/AppShell";
import { FetchReleaseStatsForMe } from "@services/ReleaseApi";
import { WithAuthGuard } from "@utils/auth/AuthGuard";
import { useEffect, useState } from "react";

const Index = () => {
  const pageTitle = "Dashboard";
  const [myReleaseStats, setMyReleaseStats] = useState();

  const getUserData = async () => {
    const response = await FetchReleaseStatsForMe();
    if (response.ok) {
      const stats = await response.json();
      setMyReleaseStats(stats);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const renderContent = () => {
    return (
      <>
        <Header title={pageTitle} secondaryTitle="" showSearchBox="true" />
        <Box
          bg="bg.surface"
          boxShadow={{ base: "none", md: "sm" }}
          borderRadius={{ base: "none", md: "lg" }}
          pt={5}
          pl={10}
        >
          {myReleaseStats && (
            <Container>
              <SimpleGrid
                columns={{
                  base: 1,
                  md: 3,
                }}
                gap={{
                  base: "5",
                  md: "6",
                }}
              >
                <Stat
                  key={"myOpenReleases"}
                  label={"My Open Releases"}
                  value={myReleaseStats.my_open_releases}
                />
                <Stat
                  key={"allOpenReleases"}
                  label={"All Open Releases"}
                  value={myReleaseStats.all_open_releases}
                />
                <Stat
                  key={"currentBlackout"}
                  label={"Current Blackout"}
                  value={myReleaseStats.current_blackout ? "Yes" : "No"}
                />
              </SimpleGrid>
            </Container>
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

export default WithAuthGuard(Index);
