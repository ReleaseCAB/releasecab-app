import { useCallback, useEffect, useState } from "react";
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
  const proOptions = { hideAttribution: true };

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onEdgeConnect = (params) => {
    console.log("New edge created:", params);
  };

  const onEdgeUpdate = (params) => {
    console.log("Edge updated:", params);
  };

  const onEdgeUpdateEnd = (params) => {
    console.log("Edge ended:", params);
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
        edgeTypes={edgeTypes}
        proOptions={proOptions}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
