import { useState } from "react";
import { useBCPStore } from "@/store/bcpStore";
import type { DCLayer, LayerMigrationStatus, MigrationCorridor, Resource } from "@/data/interfaces";
import { ArrowLeftRight, Globe, Cpu, Database, Network, Server, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// --- Layer definitions ---

const LAYERS: DCLayer[] = ["Web", "Application", "Storage", "Network"];

const LAYER_TYPES: Record<DCLayer, Resource["type"][]> = {
  Web: ["Load Balancer"],
  Application: ["Application Server", "Microservice", "Message Broker"],
  Storage: ["Database Server", "Storage Volume"],
  Network: ["Network Appliance"],
};

const LAYER_ICON: Record<DCLayer, LucideIcon> = {
  Web: Globe,
  Application: Cpu,
  Storage: Database,
  Network: Network,
};

const LAYER_COLOR = {
  Web:         { text: "text-sky-400",     border: "border-sky-500/40",     selBg: "bg-sky-500/10",     dot: "bg-sky-400",     stroke: "oklch(0.65 0.15 220)" },
  Application: { text: "text-violet-400",  border: "border-violet-500/40",  selBg: "bg-violet-500/10",  dot: "bg-violet-400",  stroke: "oklch(0.6 0.18 280)"  },
  Storage:     { text: "text-amber-400",   border: "border-amber-500/40",   selBg: "bg-amber-500/10",   dot: "bg-amber-400",   stroke: "oklch(0.75 0.15 80)"  },
  Network:     { text: "text-emerald-400", border: "border-emerald-500/40", selBg: "bg-emerald-500/10", dot: "bg-emerald-400", stroke: "oklch(0.65 0.18 150)" },
} satisfies Record<DCLayer, { text: string; border: string; selBg: string; dot: string; stroke: string }>;

const STATUS_LINE = {
  idle:      { stroke: "oklch(0.556 0 0)", dasharray: "6 4", animated: false },
  migrating: { stroke: "oklch(0.65 0.22 215)", dasharray: "8 5", animated: true },
  migrated:  { stroke: "oklch(0.68 0.2 142)", dasharray: "none", animated: false },
};

// --- Sub-components ---

function LayerDCRow({
  layer,
  resources,
  selected,
  status,
  onToggle,
}: {
  layer: DCLayer;
  resources: Resource[];
  selected: boolean;
  status: LayerMigrationStatus;
  onToggle: () => void;
}) {
  const Icon = LAYER_ICON[layer];
  const c = LAYER_COLOR[layer];
  const locked = status !== "idle";

  return (
    <button
      onClick={onToggle}
      disabled={locked}
      className={`w-full text-left px-3 py-2.5 rounded-md border transition-all duration-150 flex items-start gap-2.5 group
        ${locked ? "opacity-40 cursor-not-allowed border-border/10 bg-transparent" :
          selected
            ? `${c.selBg} ${c.border} cursor-pointer`
            : "border-border/10 hover:border-border/30 hover:bg-muted/20 cursor-pointer"
        }`}
    >
      {/* Selection indicator */}
      <div className={`mt-0.5 w-3.5 h-3.5 shrink-0 rounded-sm border transition-all duration-150 flex items-center justify-center
        ${locked ? "border-border/30" :
          selected ? `${c.dot.replace("bg-", "bg-")} border-transparent` : "border-border/50 group-hover:border-border"
        }`}
      >
        {selected && !locked && (
          <svg viewBox="0 0 10 8" className="w-2 h-2 fill-background">
            <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <Icon className={`h-3.5 w-3.5 shrink-0 ${c.text}`} />
          <span className={`text-xs font-semibold ${c.text}`}>{layer} Layer</span>
        </div>
        <div className="mt-1 flex flex-wrap gap-1">
          {resources.length === 0 ? (
            <span className="text-[10px] text-muted-foreground/50 italic">No resources</span>
          ) : (
            resources.slice(0, 3).map(r => (
              <span key={r.id} className="text-[10px] font-mono text-muted-foreground bg-muted/30 rounded px-1 py-0.5 truncate max-w-[90px]">
                {r.name}
              </span>
            ))
          )}
          {resources.length > 3 && (
            <span className="text-[10px] text-muted-foreground">+{resources.length - 3}</span>
          )}
        </div>
      </div>
    </button>
  );
}

function LayerDRRow({ layer, status }: { layer: DCLayer; status: LayerMigrationStatus }) {
  const Icon = LAYER_ICON[layer];
  const c = LAYER_COLOR[layer];

  return (
    <div className="px-3 py-2.5 rounded-md border border-border/10 flex items-center justify-between gap-2 h-full">
      <div className="flex items-center gap-1.5">
        <Icon className={`h-3.5 w-3.5 shrink-0 ${status === "idle" ? "text-muted-foreground/40" : c.text}`} />
        <span className={`text-xs font-semibold ${status === "idle" ? "text-muted-foreground/40" : c.text}`}>{layer}</span>
      </div>
      {status === "idle" && (
        <span className="text-[10px] font-mono text-muted-foreground/40">— IDLE</span>
      )}
      {status === "migrating" && (
        <span className={`flex items-center gap-1 text-[10px] font-mono font-semibold text-accent`}>
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          ACTIVE
        </span>
      )}
      {status === "migrated" && (
        <span className="flex items-center gap-1 text-[10px] font-mono font-semibold text-green-400">
          <svg viewBox="0 0 10 8" className="w-2.5 h-2.5"><path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          DONE
        </span>
      )}
    </div>
  );
}

function LayerConnectionLine({ layer, status }: { layer: DCLayer; status: LayerMigrationStatus }) {
  const s = STATUS_LINE[status];
  return (
    <div className="flex items-center w-full h-full">
      <svg width="100%" height="24" preserveAspectRatio="none">
        <defs>
          <marker id={`arr-${layer}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill={s.stroke} />
          </marker>
        </defs>
        <line
          x1="0" y1="12" x2="95%" y2="12"
          stroke={s.stroke}
          strokeWidth={1.5}
          strokeDasharray={s.dasharray === "none" ? undefined : s.dasharray}
          markerEnd={`url(#arr-${layer})`}
          style={s.animated ? { animation: "flowAnim 1.4s linear infinite" } : undefined}
        />
      </svg>
    </div>
  );
}

function CorridorCard({
  corridor,
  resources,
  layerStatuses,
  onMigrate,
}: {
  corridor: MigrationCorridor;
  resources: Resource[];
  layerStatuses: Record<DCLayer, LayerMigrationStatus>;
  onMigrate: (layers: DCLayer[]) => void;
}) {
  const [selected, setSelected] = useState<Set<DCLayer>>(new Set());

  function toggle(layer: DCLayer) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(layer) ? next.delete(layer) : next.add(layer);
      return next;
    });
  }

  function confirm() {
    if (selected.size === 0) return;
    onMigrate([...selected]);
    setSelected(new Set());
  }

  const layerResources = (layer: DCLayer) =>
    resources.filter(r => LAYER_TYPES[layer].includes(r.type));

  const selectedCount = selected.size;

  return (
    <div className="relative bg-card rounded-lg border border-border/20 p-5 flex flex-col gap-4 min-w-[680px] flex-shrink-0">
      <div className="absolute inset-x-0 top-0 h-px bg-accent/50 rounded-t-lg" />

      {/* Corridor header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Server className="h-3.5 w-3.5 text-accent" />
          <span className="text-xs font-mono font-bold text-foreground">{corridor.source.datacenter}</span>
          <span className="text-[10px] text-muted-foreground font-mono">{corridor.source.city.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
          <span className="border border-accent/30 rounded px-1.5 py-0.5 text-accent font-semibold">
            {corridor.bandwidth_gbps} Gbps
          </span>
          <span>{corridor.latency_ms}ms RTT</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-3.5 w-3.5 text-yellow-400" />
          <span className="text-xs font-mono font-bold text-foreground">{corridor.target.datacenter}</span>
          <span className="text-[10px] text-muted-foreground font-mono">{corridor.target.city.toUpperCase()}</span>
        </div>
      </div>

      {/* Flat grid: each layer row spans all 3 columns so heights align */}
      <div className="grid gap-x-3 gap-y-1.5" style={{ gridTemplateColumns: "1fr 80px 1fr" }}>
        {/* Header labels */}
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pb-0.5">
          Primary DC — Select layers
        </p>
        <div />
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pb-0.5">
          DR Site — Status
        </p>

        {/* One grid row per layer — shared height keeps DC and DR aligned */}
        {LAYERS.flatMap(layer => [
          <LayerDCRow
            key={`dc-${layer}`}
            layer={layer}
            resources={layerResources(layer)}
            selected={selected.has(layer)}
            status={layerStatuses[layer]}
            onToggle={() => toggle(layer)}
          />,
          <div key={`line-${layer}`} className="flex items-center justify-center">
            <LayerConnectionLine layer={layer} status={layerStatuses[layer]} />
          </div>,
          <LayerDRRow key={`dr-${layer}`} layer={layer} status={layerStatuses[layer]} />,
        ])}
      </div>

      {/* Confirm bar */}
      <div className={`flex items-center justify-between pt-2 border-t border-border/15 transition-opacity duration-200 ${selectedCount > 0 ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <span className="text-[11px] text-muted-foreground">
          {selectedCount} layer{selectedCount !== 1 ? "s" : ""} selected
        </span>
        <button
          onClick={confirm}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-accent/40 text-accent hover:bg-accent/10 transition-colors"
        >
          Migrate {selectedCount > 0 ? `${selectedCount} ` : ""}layer{selectedCount !== 1 ? "s" : ""} →
        </button>
      </div>
    </div>
  );
}

// --- Main export ---

export function DataFlowTopology() {
  const { corridors, resources, layerMigrationState, initiateLayerMigration } = useBCPStore();
  const activeCount = corridors.filter(c => c.status === "active").length;

  return (
    <div>
      <style>{`@keyframes flowAnim{from{stroke-dashoffset:0}to{stroke-dashoffset:-52}}`}</style>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Data Flow Topology
          </span>
        </div>
        <span className="text-xs font-mono font-semibold text-accent border border-accent/30 rounded px-2 py-0.5">
          {activeCount} ACTIVE
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {corridors.map(corridor => (
          <CorridorCard
            key={corridor.id}
            corridor={corridor}
            resources={resources}
            layerStatuses={layerMigrationState[corridor.id] ?? {
              Web: "idle", Application: "idle", Storage: "idle", Network: "idle"
            }}
            onMigrate={layers => initiateLayerMigration(corridor.id, layers)}
          />
        ))}
      </div>
    </div>
  );
}
