import { Box, Button, ButtonGroup } from "@chakra-ui/react";
import { Header } from "@components/Header";
import { Layout } from "@components/Layout";
import { AppShell } from "@components/app-shell/AppShell";
import { EditTeam } from "@components/user-management/EditTeam";
import { ViewTeam } from "@components/user-management/ViewTeam";
import { FetchTeam } from "@services/TeamApi";
import { WithAuthGuard } from "@utils/auth/AuthGuard";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiEdit2, FiEye } from "react-icons/fi";
import { store } from "../../redux/store";

const Team = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const teamId = router.query.team;
  const pageTitle = "Manage Team";
  const [teamTitle, setTeamTitle] = useState("Manage Team");
  const [loading, setLoading] = useState(true);
  const [pageMode, setPageMode] = useState("");
  const [team, setTeam] = useState(null);
  const [profile, setProfile] = useState({});
  const [loadCount, setLoadCount] = useState(0);
  const [breadcrumbs, setBreadcrumbs] = useState({});
  const [isTenantOwner, setIsTenantOwner] = useState(false);

  const fetchTeam = async () => {
    setLoading(true);
    if (loadCount > 0 || teamId != undefined) {
      const response = await FetchTeam(teamId);
      if (response.ok) {
        const data = await response.json();
        setTeam(data);
        setBreadcrumbs([
          { name: "Team Management", href: "/manage/manage-team" },
          { name: "Teams" },
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
    setIsTenantOwner(profileData.is_tenant_owner);
    if (!profileData.is_tenant_owner && !profileData.is_manager) {
      router.push("/");
    }
    if (team && !profileData.teams_managed.includes(parseInt(teamId))) {
      router.push("/");
    }
    setProfile(profileData);
    fetchTeam();
    setLoadCount(loadCount + 1);
  }, [router.query.team]);

  useEffect(() => {
    if (team) {
      setTeamTitle("Manage Team: " + team?.name);
    }
  }, [team]);

  useEffect(() => {
    if (pageMode === "" && team) {
      if (team) {
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
  }, [profile, team]);

  useEffect(() => {
    if (pageMode === "view") {
      fetchTeam();
    }
  }, [pageMode]);

  const renderContent = () => {
    return (
      <>
        <Header
          title={teamTitle}
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
          {team && pageMode === "view" && <ViewTeam team={team} />}
          {team && pageMode === "edit" && (
            <EditTeam team={team} isTenantOwner={isTenantOwner} />
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

export default WithAuthGuard(Team);
