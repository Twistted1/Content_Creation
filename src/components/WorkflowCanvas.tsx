import { useCallback } from 'react';
import ReactFlow, {
  addEdge, Background, Controls, MiniMap,
  useNodesState, useEdgesState,
  Connection, Edge, Node,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

const nodeStyle = {
  background: '#1a1d2e', // darker background
  border: '1px solid rgba(139, 92, 246, 0.4)', // purple border
  borderRadius: '10px',
  color: '#e2e8f0', // light text
  fontSize: '13px',
  padding: '10px 16px',
  width: 180,
};

const initialNodes: Node[] = [
  { id: '1', position: { x: 250, y: 50 }, data: { label: '💡 Idea Generator' }, style: nodeStyle },
  { id: '2', position: { x: 250, y: 150 }, data: { label: '✍️ Script Writer' },  style: nodeStyle },
  { id: '3', position: { x: 250, y: 250 }, data: { label: '🎙️ Voice Over' },     style: nodeStyle },
  { id: '4', position: { x: 250, y: 350 }, data: { label: '🚀 Publisher' },       style: nodeStyle },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#8b5cf6' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#8b5cf6' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' } },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#8b5cf6' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' } },
];

export const WorkflowCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges(eds => addEdge({ 
        ...params, 
        animated: true, 
        style: { stroke: '#8b5cf6' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' }
    }, eds)),
    [setEdges]
  );

  return (
    <div style={{ height: 500 }} className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 shadow-inner">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        attributionPosition="bottom-right"
      >
        <Background color="#8b5cf6" gap={20} size={1} style={{ opacity: 0.1 }} />
        <Controls className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700 !shadow-sm" />
        <MiniMap 
            nodeColor="#8b5cf6" 
            maskColor="rgba(0, 0, 0, 0.1)"
            className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700 !shadow-sm" 
        />
      </ReactFlow>
    </div>
  );
};
