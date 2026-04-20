import { ReactFlowNode } from "@xyflow/react";
import { Server } from "lucide-react";

interface ServerNodeData {
  label: string;
  ip: string;
  hostname?: string;
  status: "online" | "receiving" | "standby" | "offline";
  latency?: number;
  details?: string;
}

export function ServerNode({ data, nodeId, selected, position }: {
  data: ServerNodeData;
  nodeId: string;
  selected: boolean;
  position: { x: number; y: number };
}) {
  const statusColors: Record<ServerNodeData["status"], string> = {
    online: "bg-green-500",
    receiving: "bg-blue-500",
    standby: "bg-yellow-500",
    offline: "bg-red-500"
  };

  return (
    <div
      data-id={nodeId}
      data-selected={selected}
      className={`w-48 h-32 bg-card/80 dark:bg-card/60 border border-border/20 rounded-lg p-4 flex flex-col items-center
        ${selected ? "ring-2 ring-accent/50" : ""}
        transition-all duration-200`}
    >
      <div className="flex items-center space-x-2 mb-2">
        <Server className="h-4 w-4 text-accent" />
        <h4 className="font-medium text-sm text-foreground">{data.label}</h4>
      </div>

      <div className="text-xs text-muted-foreground">
        {data.ip}
      </div>

      {data.hostname && (
        <div className="text-xs text-muted-foreground truncate max-w-full">
          {data.hostname}
        </div>
      )}

      <div className="mt-2 flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${statusColors[data.status] || "bg-muted-foreground"}`} />
        <span className="text-xs">{data.status}</span>
      </div>

      {data.latency !== undefined && (
        <div className="mt-1 text-xs text-muted-foreground">
          {data.latency}ms latency
        </div>
      )}
    </div>
  );
}