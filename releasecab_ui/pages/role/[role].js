import { Box, Button, ButtonGroup } from "@chakra-ui/react";
import { Header } from "@components/Header";
import { Layout } from "@components/Layout";
import { AppShell } from "@components/app-shell/AppShell";
import { EditRole } from "@components/user-management/EditRole";
import { ViewRole } from "@components/user-management/ViewRole";
import { GetRole } from "@services/RoleApi";
import { WithAuthGuard } from "@utils/auth/AuthGuard";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiEdit2, FiEye } from "react-icons/fi";
import { store } from "../../redux/store";

const Role = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleId = router.query.role;
  const pageTitle = "Manage Role";
  const [roleTitle, setRoleTitle] = useState("Manage Role");
  const [loading, setLoading] = useState(true);
  const [pageMode, setPageMode] = useState("");
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState({});
  const [loadCount, setLoadCount] = useState(0);
  const [breadcrumbs, setBreadcrumbs] = useState({});

  const fetchRole = async () => {
    setLoading(true);
    if (loadCount > 0 || roleId != undefined) {
      const response = await GetRole(roleId);
      if (response.ok) {
        const data = await response.json();
        setRole(data);
        setBreadcrumbs([
          { name: "User Management", href: "/user/user-management" },
          { name: "Roles" },
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
    fetchRole();
    setLoadCount(loadCount + 1);
  }, [router.query.role]);

  useEffect(() => {
    if (role) {
      setRoleTitle("Manage Role: " + role?.name);
    }
  }, [role]);

  useEffect(() => {
    if (pageMode === "" && role) {
      if (role) {
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
  }, [profile, role]);

  useEffect(() => {
    if (pageMode === "view") {
      fetchRole();
    }
  }, [pageMode]);

  const renderContent = () => {
    return (
      <>
        <Header
          title={roleTitle}
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
          {role && pageMode === "view" && <ViewRole role={role} />}
          {role && pageMode === "edit" && <EditRole role={role} />}
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

export default WithAuthGuard(Role);
