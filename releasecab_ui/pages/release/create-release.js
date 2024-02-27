import { Box } from "@chakra-ui/react";
import { Header } from "@components/Header";
import { Layout } from "@components/Layout";
import { AppShell } from "@components/app-shell/AppShell";
import { CreateReleaseForm } from "@components/releases/CreateReleaseForm";
import { WithAuthGuard } from "@utils/auth/AuthGuard";
import "react-datepicker/dist/react-datepicker.css";

const CreateRelease = () => {
  const pageTitle = "Create Release";

  const renderContent = () => {
    return (
      <>
        <Header title="Create Release" secondaryTitle="" showSearchBox="true" />
        <Box
          bg="bg.surface"
          boxShadow={{ base: "none", md: "sm" }}
          borderRadius={{ base: "none", md: "lg" }}
          pt={5}
          pl={10}
        >
          <CreateReleaseForm />
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

export default WithAuthGuard(CreateRelease);
