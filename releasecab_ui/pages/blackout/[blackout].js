import { Box, Button, ButtonGroup, useToast } from "@chakra-ui/react";
import { DeleteAlertDialog } from "@components/DeleteAlertDialog";
import { Header } from "@components/Header";
import { Layout } from "@components/Layout";
import { AppShell } from "@components/app-shell/AppShell";
import { EditBlackout } from "@components/blackouts/EditBlackout";
import { ViewBlackout } from "@components/blackouts/ViewBlackout";
import { DeleteBlackout, FetchBlackout } from "@services/BlackoutApi";
import { WithAuthGuard } from "@utils/auth/AuthGuard";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";
import { store } from "../../redux/store";

const Blackout = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const BlackoutIdentifier = router.query.blackout;
  const pageTitle = "Blackout " + BlackoutIdentifier;
  const blackoutTitle = "Blackout " + BlackoutIdentifier;
  const [breadcrumbs, setBreadcrumbs] = useState({});
  const [loading, setLoading] = useState(true);
  const [pageMode, setPageMode] = useState("");
  const [blackout, setBlackout] = useState(null);
  const [profile, setProfile] = useState({});
  const [loadCount, setLoadCount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const toast = useToast();

  const handleClose = () => setIsDialogOpen(false);

  const fetchBlackout = async () => {
    setLoading(true);
    if (loadCount > 0 || BlackoutIdentifier != undefined) {
      const response = await FetchBlackout(BlackoutIdentifier);
      if (response.ok) {
        const data = await response.json();
        setBlackout(data);
        setBreadcrumbs([
          { name: "Blackouts", href: "/blackout/blackouts" },
          { name: data.name },
        ]);
      } else {
        router.push("/blackout/blackouts");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const profileData = store.getState().user;
    setProfile(profileData);
    fetchBlackout();
    setLoadCount(loadCount + 1);
  }, [router.query.blackout]);

  useEffect(() => {
    if (pageMode === "" && blackout) {
      if (blackout) {
        setPageMode("view");
      }
      const paramMode = searchParams.get("mode");
      if (
        paramMode &&
        paramMode !== "" &&
        (paramMode === "edit" || paramMode === "view")
      ) {
        if (
          !checkIsOwner(blackout?.owner) ||
          blackout.active_status !== "future"
        ) {
          setPageMode("view");
        } else {
          setPageMode(paramMode);
        }
      }
    }
  }, [profile, blackout]);

  useEffect(() => {
    if (pageMode === "view") {
      fetchBlackout();
    }
  }, [pageMode]);

  const checkIsOwner = (blackoutOwner) => {
    return blackoutOwner && blackoutOwner === profile.id;
  };

  const deleteBlackout = async (e) => {
    setIsDialogOpen(true);
  };

  const onDeleteAction = async (action) => {
    if (action === "delete") {
      const deleteResult = await DeleteBlackout(blackout.id);
      if (deleteResult.ok) {
        router.push("/blackout/blackouts");
      } else {
        toast({
          title: "Unable To Delete Blackout",
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
          title={blackoutTitle}
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
            {pageMode === "view" &&
              checkIsOwner(blackout?.owner) &&
              blackout?.active_status === "future" && (
                <Button
                  leftIcon={<FiEdit2 />}
                  size="sm"
                  variant="outline"
                  onClick={() => setPageMode("edit")}
                >
                  Edit
                </Button>
              )}
            {pageMode === "edit" &&
              checkIsOwner(blackout?.owner) &&
              blackout?.active_status === "future" && (
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
                    onClick={() => deleteBlackout()}
                  >
                    Delete Blackout
                  </Button>
                </>
              )}
          </ButtonGroup>
          {blackout && pageMode === "view" && (
            <ViewBlackout blackout={blackout} />
          )}
          {blackout && pageMode === "edit" && (
            <EditBlackout blackout={blackout} />
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

export default WithAuthGuard(Blackout);
