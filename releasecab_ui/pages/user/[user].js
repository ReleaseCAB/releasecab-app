import { Box, Button, ButtonGroup } from "@chakra-ui/react";
import { Header } from "@components/Header";
import { Layout } from "@components/Layout";
import { AppShell } from "@components/app-shell/AppShell";
import { EditUser } from "@components/user-management/EditUser";
import { ViewUser } from "@components/user-management/ViewUser";
import { GetUser } from "@services/UserApi";
import { WithAuthGuard } from "@utils/auth/AuthGuard";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiEdit2, FiEye } from "react-icons/fi";
import { store } from "../../redux/store";

const User = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const UserId = router.query.user;
  const pageTitle = "Manage User";
  const [userTitle, setUserTitle] = useState("Manage User");
  const [loading, setLoading] = useState(true);
  const [pageMode, setPageMode] = useState("");
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});
  const [loadCount, setLoadCount] = useState(0);
  const [breadcrumbs, setBreadcrumbs] = useState({});

  const fetchUser = async () => {
    setLoading(true);
    if (loadCount > 0 || UserId != undefined) {
      const response = await GetUser(UserId);
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setBreadcrumbs([
          { name: "User Management", href: "/user/user-management" },
          { name: "Users" },
          { name: user?.last_name + ", " + user?.first_name },
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
    fetchUser();
    setLoadCount(loadCount + 1);
  }, [router.query.user]);

  useEffect(() => {
    if (user) {
      setUserTitle(
        "Manage User: " + (user?.last_name + ", " + user?.first_name),
      );
    }
  }, [user]);

  useEffect(() => {
    if (pageMode === "" && user) {
      if (user) {
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
  }, [profile, user]);

  useEffect(() => {
    if (pageMode === "view") {
      fetchUser();
    }
  }, [pageMode]);

  const renderContent = () => {
    return (
      <>
        <Header
          title={userTitle}
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
          {user && pageMode === "view" && <ViewUser user={user} />}
          {user && pageMode === "edit" && <EditUser user={user} />}
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

export default WithAuthGuard(User);
