import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useBCPStore } from "@/store/bcpStore";
import { Server, Database, Scale, Network, Cpu } from "lucide-react";
import { useMemo } from "react";

type FlowNodeData = {
  label: string;
  ip: string;
  hostname?: string;
  status: "online" | "receiving" | "standby" | "offline";
  latency?: number;
  details?: string;
  [key: string]: unknown;
};

const statusDot: Record<string, string> = {
  online: "bg-green-500",
  receiving: "bg-blue-500",
  standby: "bg-yellow-400",
  offline: "bg-red-500",
};

function NodeCard({
  data,
  Icon,
}: {
  data: FlowNodeData;
  Icon: React.ElementType;
}) {
  return (
    <div className="w-44 bg-card border border-border/40 rounded-lg p-3 shadow-sm">
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-accent/60 !border-accent/40"
      />
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="h-3.5 w-3.5 text-accent shrink-0" />
        <span className="font-medium text-xs text-foreground truncate">
          {data.label}
        </span>
      </div>
      <div className="text-[10px] text-muted-foreground font-mono">{data.ip}</div>
      {data.details && (
        <div className="text-[10px] text-muted-foreground">{data.details}</div>
      )}
      <div className="mt-1.5 flex items-center gap-1.5">
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot[data.status] ?? "bg-muted"}`}
        />
        <span className="text-[10px] capitalize">{data.status}</span>
        {data.latency !== undefined && (
          <span className="text-[10px] text-muted-foreground ml-auto">
            {data.latency}ms
          </span>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-accent/60 !border-accent/40"
      />
    </div>
  );
}

function ServerFlowNode({ data }: NodeProps) {
  return <NodeCard data={data as FlowNodeData} Icon={Server} />;
}

function DatabaseFlowNode({ data }: NodeProps) {
  return <NodeCard data={data as FlowNodeData} Icon={Database} />;
}

function LoadBalancerFlowNode({ data }: NodeProps) {
  return <NodeCard data={data as FlowNodeData} Icon={Scale} />;
}

function ServiceFlowNode({ data }: NodeProps) {
  return <NodeCard data={data as FlowNodeData} Icon={Cpu} />;
}

function NetworkFlowNode({ data }: NodeProps) {
  return <NodeCard data={data as FlowNodeData} Icon={Network} />;
}

const nodeTypes = {
  server: ServerFlowNode,
  database: DatabaseFlowNode,
  "load-balancer": LoadBalancerFlowNode,
  service: ServiceFlowNode,
  network: NetworkFlowNode,
};

const edgeStatusStyle: Record<string, { stroke: string }> = {
  active: { stroke: "hsl(var(--accent))" },
  completed: { stroke: "#22c55e" },
  inactive: { stroke: "hsl(var(--muted-foreground))" },
  failed: { stroke: "#ef4444" },
};

export function SystemTopology() {
  const { nodes: storeNodes, edges: storeEdges } = useBCPStore();

  const nodes = useMemo(
    () =>
      storeNodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: n.position ?? { x: 0, y: 0 },
        data: n.data,
      })),
    [storeNodes],
  );

  const edges = useMemo(
    () =>
      storeEdges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        animated: e.animated ?? false,
        type: e.type ?? "smoothstep",
        label: e.data?.label,
        style: edgeStatusStyle[e.data?.status ?? "inactive"],
        labelStyle: { fontSize: 9, fill: "hsl(var(--muted-foreground))" },
        labelBgStyle: { fill: "hsl(var(--card))", fillOpacity: 0.8 },
      })),
    [storeEdges],
  );

  return (
    <div className="bg-card rounded-lg overflow-hidden" style={{ height: 600 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={2}
      >
        <Background gap={16} size={1} color="hsl(var(--border))" />
        <Controls className="!bg-card !border-border/40 !shadow-sm" />
        <MiniMap
          className="!bg-card !border-border/40"
          nodeColor={(n) => {
            const d = n.data as FlowNodeData;
            return statusDot[d?.status]?.replace("bg-", "") ?? "#888";
          }}
          maskColor="hsl(var(--background) / 0.7)"
        />
      </ReactFlow>
    </div>
  );
}
