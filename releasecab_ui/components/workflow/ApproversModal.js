import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import {
  FetchReleaseStageConnectionsForTenant,
  UpdateReleaseStageConnection,
} from "@services/ReleaseApi";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Select from "react-select";

export const ApproversModal = ({ isOpen, onClose, data }) => {
  const [approvers, setApprovers] = useState([]);
  const [onlyOwner, setOnlyOwner] = useState(false);
  const [includeOwner, setIncludeOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      fetchReleaseStageConnections();
    }
  }, [isOpen]);

  const fetchReleaseStageConnections = async () => {
    setLoading(true);
    try {
      const response = await FetchReleaseStageConnectionsForTenant(true);
      if (response.ok) {
        const resp = await response.json();
        const thisConnection = resp.find((item) => item.id === data.id);
        if (thisConnection) {
          setOnlyOwner(thisConnection.owner_only);
          setIncludeOwner(thisConnection.owner_included);
          setApprovers(thisConnection.approvers);
        } else {
          // Handle error
        }
      } else {
        // Handle error
      }
    } catch (error) {
      // Handle error
      console.error("Error fetching release stage connections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setApprovers([]);
  }, [onlyOwner]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const approversList = [];
    approversList.push(
      ...approvers.map((appr) => ({
        roles: appr.roles?.map((role) => role.value),
        teams: appr.teams?.map((team) => team.value),
      })),
    );
    const approversObj = {
      owner_only: onlyOwner,
      owner_included: includeOwner,
      approvers_list: approversList,
    };
    try {
      const approverResp = await UpdateReleaseStageConnection(
        approversObj,
        data.id,
      );
      if (approverResp.ok) {
        toast({
          title: "Approvers Updated",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
      } else {
        toast({
          title: "Error Updating Approvers",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error updating approvers:", error);
      toast({
        title: "Error Updating Approvers",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    !loading && (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Approvers</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              width="100%"
              height="200px"
              border="1px solid #ccc"
              borderRadius="4px"
              overflowY="scroll"
            >
              <form onSubmit={handleFormSubmit}>
                {[...approvers, null].map((approver, index) => (
                  <div key={index}>
                    <FormControl isRequired mt={5}>
                      <Select
                        isDisabled={onlyOwner}
                        required
                        value={onlyOwner ? null : approver?.roles}
                        options={data.roles}
                        isMulti
                        placeholder="Any Role"
                        onChange={(selectedOptions) =>
                          setApprovers((prevApprovers) => {
                            const newApprovers = [...prevApprovers];
                            if (newApprovers[index]) {
                              newApprovers[index].roles = selectedOptions;
                            } else {
                              newApprovers.push({ roles: selectedOptions });
                            }
                            return newApprovers;
                          })
                        }
                      />
                    </FormControl>
                    <Center>from</Center>
                    <FormControl isRequired>
                      <Select
                        isDisabled={onlyOwner}
                        required
                        value={onlyOwner ? null : approver?.teams}
                        options={data.teams}
                        isMulti
                        placeholder="Any Team"
                        onChange={(selectedOptions) =>
                          setApprovers((prevApprovers) => {
                            const newApprovers = [...prevApprovers];
                            if (newApprovers[index]) {
                              newApprovers[index].teams = selectedOptions;
                            } else {
                              newApprovers.push({ teams: selectedOptions });
                            }
                            return newApprovers;
                          })
                        }
                      />
                    </FormControl>
                    <Center pt={5}>OR</Center>
                  </div>
                ))}
                <FormControl pl={2} pt={2}>
                  <Checkbox
                    isChecked={includeOwner}
                    onChange={(e) => setIncludeOwner(e.target.checked)}
                    disabled={onlyOwner}
                  >
                    Release Owner Can Also Approve
                  </Checkbox>
                </FormControl>
                <FormControl pl={2}>
                  <Checkbox
                    isChecked={onlyOwner}
                    onChange={(e) => setOnlyOwner(e.target.checked)}
                    disabled={includeOwner}
                  >
                    Only Release Owner Can Approve
                  </Checkbox>
                </FormControl>
              </form>
            </Box>
          </ModalBody>
          <ModalFooter>
            {approvers.length === 0 && !onlyOwner && !includeOwner ? (
              <Box color="red.500">
                If no approvers are selected, the release can be progressed to
                the next stage by the creator at any point
              </Box>
            ) : null}
            <Flex justify="flex-end">
              <Button
                type="submit"
                bg="brand.button_enabled"
                color="brand.white_text"
                onClick={handleFormSubmit}
              >
                Save
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  );
};
