import { Box, Button, ButtonGroup } from "@chakra-ui/react";
import { Header } from "@components/Header";
import { Layout } from "@components/Layout";
import { AppShell } from "@components/app-shell/AppShell";
import { EditReleaseType } from "@components/release-configuration/EditReleaseType";
import { ViewReleaseType } from "@components/release-configuration/ViewReleaseType";
import { GetReleaseType } from "@services/ReleaseApi";
import { WithAuthGuard } from "@utils/auth/AuthGuard";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiEdit2, FiEye } from "react-icons/fi";
import { store } from "../../redux/store";

const ReleaseType = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const releaseTypeId = router.query.releaseType;
  const pageTitle = "Manage Release Type";
  const [releaseTypeTitle, setReleaseTypeTitle] = useState(
    "Manage Release Type",
  );
  const [loading, setLoading] = useState(true);
  const [pageMode, setPageMode] = useState("");
  const [releaseType, setReleaseType] = useState(null);
  const [profile, setProfile] = useState({});
  const [loadCount, setLoadCount] = useState(0);
  const [breadcrumbs, setBreadcrumbs] = useState({});

  const fetchReleaseType = async () => {
    setLoading(true);
    if (loadCount > 0 || releaseTypeId != undefined) {
      const response = await GetReleaseType(releaseTypeId);
      if (response.ok) {
        const data = await response.json();
        setReleaseType(data);
        setBreadcrumbs([
          { name: "Release Configuration", href: "/release-configuration" },
          { name: "Release Types" },
          { name: data.name },
        ]);
      } else {
        router.push("/");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const profileData = store.getState().user;
    if (!profileData.is_tenant_owner) {
      router.push("/");
    }
    setProfile(profileData);
    fetchReleaseType();
    setLoadCount(loadCount + 1);
  }, [router.query.releaseType]);

  useEffect(() => {
    if (releaseType) {
      setReleaseTypeTitle("Manage Release Type: " + releaseType?.name);
    }
  }, [releaseType]);

  useEffect(() => {
    if (pageMode === "" && releaseType) {
      if (releaseType) {
        setPageMode("view");
      }
      const paramMode = searchParams.get("mode");
      if (
        paramMode &&
        paramMode !== "" &&
        (paramMode === "edit" || paramMode === "view")
      ) {
        setPageMode(paramMode);
      }
    }
  }, [profile, releaseType]);

  useEffect(() => {
    if (pageMode === "view") {
      fetchReleaseType();
    }
  }, [pageMode]);

  const renderContent = () => {
    return (
      <>
        <Header
          title={releaseTypeTitle}
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
          <ButtonGroup pt={5}>
            {pageMode === "view" && (
              <Button
                leftIcon={<FiEdit2 />}
                size="sm"
                variant="outline"
                onClick={() => setPageMode("edit")}
              >
                Edit
              </Button>
            )}
            {pageMode === "edit" && (
              <Button
                leftIcon={<FiEye />}
                size="sm"
                variant="outline"
                onClick={() => setPageMode("view")}
              >
                View
              </Button>
            )}
          </ButtonGroup>
          {releaseType && pageMode === "view" && (
            <ViewReleaseType releaseType={releaseType} />
          )}
          {releaseType && pageMode === "edit" && (
            <EditReleaseType releaseType={releaseType} />
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

export default WithAuthGuard(ReleaseType);
