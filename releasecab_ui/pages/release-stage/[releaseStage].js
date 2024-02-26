import { Box, Button, ButtonGroup } from "@chakra-ui/react";
import { Header } from "@components/Header";
import { Layout } from "@components/Layout";
import { AppShell } from "@components/app-shell/AppShell";
import { EditReleaseStage } from "@components/release-configuration/EditReleaseStage";
import { ViewReleaseStage } from "@components/release-configuration/ViewReleaseStage";
import {
  FetchReleaseStageConnectionsForTenant,
  GetReleaseStage,
  GetReleaseStages,
} from "@services/ReleaseApi";
import { WithAuthGuard } from "@utils/auth/AuthGuard";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiEdit2, FiEye } from "react-icons/fi";
import { store } from "../../redux/store";

const ReleaseStage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const releaseStageId = router.query.releaseStage;
  const pageTitle = "Manage Release Stage";
  const [releaseStageTitle, setReleaseStageTitle] = useState(
    "Manage Release Stage",
  );
  const [loading, setLoading] = useState(true);
  const [pageMode, setPageMode] = useState("");
  const [releaseStage, setReleaseStage] = useState(null);
  const [releaseStageConnections, setReleaseStageConnections] = useState([]);
  const [filteredConnections, setFilteredConnections] = useState({});
  const [profile, setProfile] = useState({});
  const [loadCount, setLoadCount] = useState(0);
  const [breadcrumbs, setBreadcrumbs] = useState({});
  const [releaseStages, setReleaseStages] = useState([]);

  const fetchReleaseStage = async () => {
    setLoading(true);
    if (loadCount > 0 || releaseStageId != undefined) {
      const response = await GetReleaseStage(releaseStageId);
      if (response.ok) {
        const data = await response.json();
        setReleaseStage(data);
        setBreadcrumbs([
          { name: "Release Configuration", href: "/release-configuration" },
          { name: "Release Stages" },
          { name: data.name },
        ]);
      } else {
        router.push("/");
      }
    }
    setLoading(false);
  };

  const fetchReleaseStageConnections = async () => {
    if (loadCount > 0 || releaseStageId != undefined) {
      const response = await FetchReleaseStageConnectionsForTenant();
      if (response.ok) {
        const data = await response.json();
        await setReleaseStageConnections(data);
      } else {
        router.push("/");
      }
    }
  };

  const fetchReleaseStages = async () => {
    const response = await GetReleaseStages(true);
    if (response.ok) {
      const data = await response.json();
      setReleaseStages(data);
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    const profileData = store.getState().user;
    if (!profileData.is_tenant_owner) {
      router.push("/");
    }
    setProfile(profileData);
    fetchReleaseStage();
    fetchReleaseStageConnections();
    fetchReleaseStages();
    setLoadCount(loadCount + 1);
  }, [router.query.releaseStage]);

  useEffect(() => {
    if (releaseStage) {
      setReleaseStageTitle("Manage Release Stage: " + releaseStage?.name);
    }
  }, [releaseStage]);

  useEffect(() => {
    if (pageMode === "" && releaseStage) {
      if (releaseStage) {
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
  }, [profile, releaseStage]);

  useEffect(() => {
    if (pageMode === "view") {
      fetchReleaseStage();
      fetchReleaseStageConnections();
      fetchReleaseStages();
    }
  }, [pageMode]);

  useEffect(() => {
    setFilteredConnections(filterStages());
  }, [releaseStageConnections]);

  const filterStages = () => {
    const fromStages = [];
    const toStages = [];
    releaseStageConnections.forEach((item) => {
      const fromStage = releaseStages.find(
        (stage) => stage.id === item.from_stage,
      );
      const toStage = releaseStages.find((stage) => stage.id === item.to_stage);
      if (toStage && item.to_stage.toString() === releaseStageId) {
        fromStages.push({
          label: fromStage ? fromStage.name : "",
          value: item.from_stage,
        });
      }
      if (fromStage && item.from_stage.toString() === releaseStageId) {
        toStages.push({
          label: toStage ? toStage.name : "",
          value: item.to_stage,
        });
      }
    });
    return { fromStages, toStages };
  };

  const renderContent = () => {
    return (
      <>
        <Header
          title={releaseStageTitle}
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
          {releaseStage && pageMode === "view" && (
            <ViewReleaseStage
              releaseStage={releaseStage}
              connections={filteredConnections}
            />
          )}
          {releaseStage && pageMode === "edit" && (
            <EditReleaseStage
              releaseStage={releaseStage}
              connections={filteredConnections}
              releaseStages={releaseStages}
            />
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

export default WithAuthGuard(ReleaseStage);
