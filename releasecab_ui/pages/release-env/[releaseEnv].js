import { Box, Button, ButtonGroup } from "@chakra-ui/react";
import { Header } from "@components/Header";
import { Layout } from "@components/Layout";
import { AppShell } from "@components/app-shell/AppShell";
import { EditReleaseEnv } from "@components/release-configuration/EditReleaseEnv";
import { ViewReleaseEnv } from "@components/release-configuration/ViewReleaseEnv";
import { GetReleaseEnv } from "@services/ReleaseApi";
import { WithAuthGuard } from "@utils/auth/AuthGuard";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiEdit2, FiEye } from "react-icons/fi";
import { store } from "../../redux/store";

const ReleaseEnv = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const releaseEnvId = router.query.releaseEnv;
  const pageTitle = "Manage Release Environment";
  const [releaseEnvTitle, setReleaseEnvTitle] = useState(
    "Manage Release Environment",
  );
  const [loading, setLoading] = useState(true);
  const [pageMode, setPageMode] = useState("");
  const [releaseEnv, setReleaseEnv] = useState(null);
  const [profile, setProfile] = useState({});
  const [loadCount, setLoadCount] = useState(0);
  const [breadcrumbs, setBreadcrumbs] = useState({});

  const fetchReleaseEnv = async () => {
    setLoading(true);
    if (loadCount > 0 || releaseEnvId != undefined) {
      const response = await GetReleaseEnv(releaseEnvId);
      if (response.ok) {
        const data = await response.json();
        setReleaseEnv(data);
        setBreadcrumbs([
          { name: "Release Configuration", href: "/release-configuration" },
          { name: "Release Environments" },
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
    fetchReleaseEnv();
    setLoadCount(loadCount + 1);
  }, [router.query.releaseEnv]);

  useEffect(() => {
    if (releaseEnv) {
      setReleaseEnvTitle("Manage Release Env: " + releaseEnv?.name);
    }
  }, [releaseEnv]);

  useEffect(() => {
    if (pageMode === "" && releaseEnv) {
      if (releaseEnv) {
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
  }, [profile, releaseEnv]);

  useEffect(() => {
    if (pageMode === "view") {
      fetchReleaseEnv();
    }
  }, [pageMode]);

  const renderContent = () => {
    return (
      <>
        <Header
          title={releaseEnvTitle}
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
          {releaseEnv && pageMode === "view" && (
            <ViewReleaseEnv releaseEnv={releaseEnv} />
          )}
          {releaseEnv && pageMode === "edit" && (
            <EditReleaseEnv releaseEnv={releaseEnv} />
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

export default WithAuthGuard(ReleaseEnv);
