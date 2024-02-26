import { Box } from "@chakra-ui/react";
import { Header } from "@components/Header";
import { Layout } from "@components/Layout";
import { AppShell } from "@components/app-shell/AppShell";
import { WorkflowDiagram } from "@components/workflow/WorkflowDiagram";
import {
  FetchReleaseConfigForTenant,
  FetchReleaseStageConnectionsForTenant,
  GetReleaseStages,
} from "@services/ReleaseApi";
import { GetRoles } from "@services/RoleApi";
import { GetTeams } from "@services/TeamApi";
import { WithAuthGuard } from "@utils/auth/AuthGuard";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Workflows = () => {
  const pageTitle = "Workflows";
  const router = useRouter();
  const [releaseStages, setReleaseStages] = useState([]);
  const [releaseStageConnections, setReleaseStageConnections] = useState([]);
  const [releaseConfig, setReleaseConfig] = useState();
  const [roles, setRoles] = useState();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teamsLoading, setTeamsLoading] = useState(true);

  const fetchReleaseStages = async () => {
    setLoading(true);
    const response = await GetReleaseStages(true);
    if (response.ok) {
      const data = await response.json();
      setReleaseStages(data);
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  const fetchReleaseStageConnections = async () => {
    const response = await FetchReleaseStageConnectionsForTenant(true);
    if (response.ok) {
      const data = await response.json();
      setReleaseStageConnections(data);
    } else {
      router.push("/");
    }
  };

  const fetchReleaseConfig = async () => {
    const response = await FetchReleaseConfigForTenant(true);
    if (response.ok) {
      const data = await response.json();
      setReleaseConfig(data);
    } else {
      router.push("/");
    }
  };

  const fetchRoles = async () => {
    const response = await GetRoles(true);
    if (response.ok) {
      const data = await response.json();
      const mappedData = data.map((item) => ({
        value: item.id,
        label: item.name,
        description: item.description,
      }));
      setRoles(mappedData);
    }
  };

  const fetchTeams = async () => {
    setTeamsLoading(true);
    const response = await GetTeams(true);
    if (response.ok) {
      const data = await response.json();
      const mappedData = data.map(({ id, name }) => ({
        value: id,
        label: name,
      }));
      await setTeams(mappedData);
      setTeamsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchTeams();
    fetchReleaseStages();
    fetchReleaseStageConnections();
    fetchReleaseConfig();
  }, []);

  const renderContent = () => {
    return (
      <>
        <Header title="Workflows" secondaryTitle="" showSearchBox="true" />
        <Box
          bg="bg.surface"
          boxShadow={{ base: "none", md: "sm" }}
          borderRadius={{ base: "none", md: "lg" }}
          pt={5}
          pl={10}
        >
          {!loading &&
            !teamsLoading &&
            releaseConfig &&
            releaseStageConnections &&
            releaseStages &&
            roles &&
            teams && (
              <WorkflowDiagram
                releaseConfig={releaseConfig}
                releaseStageConnections={releaseStageConnections}
                releaseStages={releaseStages}
                roles={roles}
                teams={teams}
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

export default WithAuthGuard(Workflows);
