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
import { InvitedUserManagementTable } from "@components/user-management/InvitedUserManagementTable";
import { RolesManagementTable } from "@components/user-management/RolesManagementTable";
import { TeamManagementTable } from "@components/user-management/TeamManagementTable";
import { UserManagementTable } from "@components/user-management/UserManagementTable";
import { WithAuthGuard } from "@utils/auth/AuthGuard";

const UserManagement = () => {
  const pageTitle = "User Management";

  const renderContent = () => {
    return (
      <>
        <Header
          title="User Management"
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
                <Tab>Current Users</Tab>
                <Tab>Invited Users</Tab>
                <Tab>Teams</Tab>
                <Tab>Roles</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <UserManagementTable />
                </TabPanel>
                <TabPanel>
                  <InvitedUserManagementTable />
                </TabPanel>
                <TabPanel>
                  <TeamManagementTable />
                </TabPanel>
                <TabPanel>
                  <RolesManagementTable />
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

export default WithAuthGuard(UserManagement);
