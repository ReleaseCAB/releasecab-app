import {
  Box,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { Header } from "@components/Header";
import { Layout } from "@components/Layout";
import { AppShell } from "@components/app-shell/AppShell";
import { ReleaseEnvTable } from "@components/release-configuration/ReleaseEnvTable";
import { ReleaseStageTable } from "@components/release-configuration/ReleaseStageTable";
import { ReleaseTypesTable } from "@components/release-configuration/ReleaseTypesTable";
import { WithAuthGuard } from "@utils/auth/AuthGuard";

// TODO: Add breadcrumbs to this and all child pages to they can redirect back easily
const ReleaseConfig = () => {
  const pageTitle = "Release Configuration";

  const renderContent = () => {
    return (
      <>
        <Header
          title="Release Configuration"
          secondaryTitle=""
          showSearchBox="true"
        />
        <Box
          bg="bg.surface"
          boxShadow={{ base: "none", md: "sm" }}
          borderRadius={{ base: "none", md: "lg" }}
          pt={5}
          pl={10}
        >
          <Stack spacing="16">
            <Tabs variant="enclosed" isLazy={true}>
              <TabList>
                <Tab>Release Types</Tab>
                <Tab>Release Environments</Tab>
                <Tab>Release Stages</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <ReleaseTypesTable />
                </TabPanel>
                <TabPanel>
                  <ReleaseEnvTable />
                </TabPanel>
                <TabPanel>
                  <ReleaseStageTable />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Stack>
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

export default WithAuthGuard(ReleaseConfig);
