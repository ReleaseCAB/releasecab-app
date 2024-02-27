import { useToast } from "@chakra-ui/react";
import { DeleteAlertDialog } from "@components/DeleteAlertDialog";
import {
  CreateReleaseStageConnection,
  DeleteReleaseStageConnection,
} from "@services/ReleaseApi";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import ButtonEdge from "./ButtonEdge";

const edgeTypes = {
  buttonedge: ButtonEdge,
};

export const WorkflowDiagram = (props) => {
  const [nodes, setNodes] = useState();
  const [edges, setEdges] = useState();
  const [deleteEdge, setDeleteEdge] = useState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const proOptions = { hideAttribution: true };
  const edgeUpdateSuccessful = useRef(true);
  const toast = useToast();

  const handleClose = () => setIsDialogOpen(false);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  //Handle a new connection
  const onEdgeConnect = async (params) => {
    const matchingConnection = props.releaseStageConnections.find(
      (connection) => {
        return (
          connection.from_stage.toString() === params.source &&
          connection.to_stage.toString() === params.target
        );
      },
    );
    if (matchingConnection) {
      //Connection already exists, just leave it alone
    } else {
      const newReleaseStageConnection = {
        from_stage: params.source,
        to_stage: params.target,
      };
      const createResult = await CreateReleaseStageConnection(
        newReleaseStageConnection,
      );
      if (createResult.ok) {
        props.setUpdateConnections(!props.updateConnections);
        toast({
          title: "Stage Connection Created",
          status: "success",
          isClosable: true,
          duration: 5000,
        });
      } else {
        toast({
          title: "Unable To Create Connection",
          status: "error",
          isClosable: true,
          duration: 5000,
        });
      }
    }
  };

  //Handle an edge update
  const onEdgeUpdate = useCallback(
    async (oldEdge, newConnection) => {
      edgeUpdateSuccessful.current = true;
      const matchingConnection = props.releaseStageConnections.find(
        (connection) => {
          return (
            connection.from_stage.toString() === newConnection.source &&
            connection.to_stage.toString() === newConnection.target
          );
        },
      );
      if (matchingConnection) {
        // Existing connection, nothing to update
      } else {
        //Delete old connection
        const matchingConnectionToDelete = props.releaseStageConnections.find(
          (connection) => {
            return (
              connection.from_stage.toString() === oldEdge.source &&
              connection.to_stage.toString() === oldEdge.target
            );
          },
        );
        if (matchingConnectionToDelete) {
          const deleteResult = await DeleteReleaseStageConnection(
            matchingConnectionToDelete.id,
          );
          if (deleteResult.ok) {
            const newReleaseStageConnection = {
              from_stage: newConnection.source,
              to_stage: newConnection.target,
            };
            const createResult = await CreateReleaseStageConnection(
              newReleaseStageConnection,
            );
            if (createResult.ok) {
              props.setUpdateConnections(!props.updateConnections);
              toast({
                title: "Stage Connection Updated",
                status: "success",
                isClosable: true,
                duration: 5000,
              });
            } else {
              toast({
                title: "Unable To Update Connection",
                status: "error",
                isClosable: true,
                duration: 5000,
              });
            }
          } else {
            toast({
              title: "Unable To Update Connection",
              status: "error",
              isClosable: true,
              duration: 5000,
            });
          }
        } else {
          toast({
            title: "Unable To Update Connection",
            status: "error",
            isClosable: true,
            duration: 5000,
          });
        }
      }
    },
    [props.releaseStageConnections],
  );

  //Handle an edge delete
  const onEdgeUpdateEnd = useCallback(async (_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setDeleteEdge(edge);
      setIsDialogOpen(true);
    }
  }, []);

  const onDeleteAction = async (action) => {
    if (action === "delete") {
      const matchingConnection = props.releaseStageConnections.find(
        (connection) => {
          return (
            connection.from_stage.toString() === deleteEdge.source &&
            connection.to_stage.toString() === deleteEdge.target
          );
        },
      );
      if (matchingConnection) {
        const deleteResult = await DeleteReleaseStageConnection(
          matchingConnection.id,
        );
        if (deleteResult.ok) {
          props.setUpdateConnections(!props.updateConnections);
          toast({
            title: "Stage Connection Deleted",
            status: "success",
            isClosable: true,
            duration: 5000,
          });
        } else {
          toast({
            title: "Unable To Delete Connection",
            status: "error",
            isClosable: true,
            duration: 5000,
          });
        }
      } else {
        toast({
          title: "Unable To Delete Connection",
          status: "error",
          isClosable: true,
          duration: 5000,
        });
      }
    } else {
      // Take no action on cancel
    }
    setDeleteEdge();
  };

  const createNodes = async () => {
    const spacingX = 200;
    const spacingY = 300;
    const initialX = 100;
    // Sort the props.releaseStages to make sure the initial_stage comes first
    props.releaseStages.sort((a, b) => {
      if (a.id === props.releaseConfig[0].initial_stage) return -1;
      if (b.id === props.releaseConfig[0].initial_stage) return 1;
      return 0;
    });
    const nodes = await props.releaseStages.map((node, index) => ({
      id: node.id.toString(),
      data: {
        label: node.name,
      },
      position: {
        x: initialX + index * spacingX,
        y: node.is_end_stage ? spacingY : 100,
      },
    }));
    setNodes(nodes);
  };

  const createEdges = async () => {
    const edges = await props.releaseStageConnections.map((edge) => ({
      id: edge.id.toString(),
      source: edge.from_stage.toString(),
      target: edge.to_stage.toString(),
      type: "buttonedge",
      data: {
        id: edge.id,
        roles: props.roles,
        teams: props.teams,
      },
      markerEnd: {
        type: "arrow",
      },
      animated: true,
    }));
    setEdges(edges);
  };

  useEffect(() => {
    createNodes();
  }, [props.releaseStages]);

  useEffect(() => {
    createEdges();
  }, [props.releaseStageConnections]);

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onConnect={onEdgeConnect}
        onEdgesChange={onEdgesChange}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        onEdgeUpdateStart={onEdgeUpdateStart}
        edgeTypes={edgeTypes}
        proOptions={proOptions}
      >
        <Background />
        <Controls />
      </ReactFlow>
      <DeleteAlertDialog
        isOpen={isDialogOpen}
        onClose={handleClose}
        title="Delete Connection?"
        onDelete={onDeleteAction}
      />
    </div>
  );
};
