import { Box, Button, ButtonGroup, useToast } from "@chakra-ui/react";
import { DeleteAlertDialog } from "@components/DeleteAlertDialog";
import { Header } from "@components/Header";
import { Layout } from "@components/Layout";
import { AppShell } from "@components/app-shell/AppShell";
import { EditReleaseForm } from "@components/releases/EditReleaseForm";
import { ViewRelease } from "@components/releases/ViewRelease";
import { DeleteRelease, FetchRelease } from "@services/ReleaseApi";
import { WithAuthGuard } from "@utils/auth/AuthGuard";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";
import { store } from "../../redux/store";

const Release = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const releaseIdentifier = router.query.release;
  const pageTitle = "Release " + releaseIdentifier;
  const breadcrumbs = [
    { name: "Releases", href: "/release/releases" },
    { name: router.query.release },
  ];
  const releaseTitle = "Release " + releaseIdentifier;
  const [loading, setLoading] = useState(true);
  const [pageMode, setPageMode] = useState("");
  const [release, setRelease] = useState(null);
  const [profile, setProfile] = useState({});
  const [loadCount, setLoadCount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const toast = useToast();

  const handleClose = () => setIsDialogOpen(false);

  const fetchRelease = async () => {
    setLoading(true);
    if (loadCount > 0 || releaseIdentifier != undefined) {
      const response = await FetchRelease(releaseIdentifier);
      if (response.ok) {
        const data = await response.json();
        setRelease(data);
      } else {
        router.push("/release/releases");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const profileData = store.getState().user;
    setProfile(profileData);
    fetchRelease();
    setLoadCount(loadCount + 1);
  }, [router.query.release]);

  useEffect(() => {
    if (pageMode === "" && release) {
      if (release) {
        setPageMode("view");
      }
      const paramMode = searchParams.get("mode");
      if (
        paramMode &&
        paramMode !== "" &&
        (paramMode === "edit" || paramMode === "view")
      ) {
        if (!checkIsOwner(release?.owner)) {
          setPageMode("view");
        } else {
          setPageMode(paramMode);
        }
      }
    }
  }, [profile, release]);

  useEffect(() => {
    if (pageMode === "view") {
      fetchRelease();
    }
  }, [pageMode]);

  const checkIsOwner = (releaseOwner) => {
    return releaseOwner && releaseOwner === profile.id;
  };

  const deleteRelease = async (e) => {
    setIsDialogOpen(true);
  };

  const onDeleteAction = async (action) => {
    if (action === "delete") {
      const deleteResult = await DeleteRelease(release.id);
      if (deleteResult.ok) {
        router.push("/release/releases");
      } else {
        toast({
          title: "Unable To Delete Release",
          status: "error",
          isClosable: true,
          duration: 5000,
        });
      }
    } else {
      // Take no action on cancel
    }
  };

  const renderContent = () => {
    return (
      <>
        <Header
          title={releaseTitle}
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
            {pageMode === "view" && checkIsOwner(release?.owner) && (
              <Button
                leftIcon={<FiEdit2 />}
                size="sm"
                variant="outline"
                onClick={() => setPageMode("edit")}
              >
                Edit
              </Button>
            )}
            {pageMode === "edit" && checkIsOwner(release?.owner) && (
              <>
                <Button
                  leftIcon={<FiEye />}
                  size="sm"
                  variant="outline"
                  onClick={() => setPageMode("view")}
                >
                  View
                </Button>
                <Button
                  leftIcon={<FiTrash2 />}
                  size="sm"
                  variant="outline"
                  color="brand.warning"
                  onClick={() => deleteRelease()}
                >
                  Delete Release
                </Button>
              </>
            )}
          </ButtonGroup>
          {release && pageMode === "view" && <ViewRelease release={release} />}
          {release && pageMode === "edit" && (
            <EditReleaseForm release={release} />
          )}
        </Box>
      </>
    );
  };

  return (
    <Layout title={pageTitle} showfooter="false">
      <AppShell pageContent={renderContent()} />
      <DeleteAlertDialog
        isOpen={isDialogOpen}
        onClose={handleClose}
        title="Delete Release"
        onDelete={onDeleteAction}
      />
    </Layout>
  );
};

export default WithAuthGuard(Release);
