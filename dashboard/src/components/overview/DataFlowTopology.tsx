import { useBCPStore } from "@/store/bcpStore";
import { ArrowLeftRight, Server, Shield } from "lucide-react";
import type { MigrationCorridor } from "@/data/interfaces";

type Status = MigrationCorridor["status"];

const STROKE: Record<Status, string> = {
  active: "oklch(0.65 0.22 215)",
  completed: "oklch(0.68 0.2 142)",
  failed: "oklch(0.704 0.191 22.216)",
  pending: "oklch(0.556 0 0)",
};

const DOT: Record<Status, string> = {
  active: "bg-green-500 animate-pulse",
  completed: "bg-green-500 animate-pulse",
  pending: "bg-yellow-500",
  failed: "bg-red-500",
};

const BW_LABEL: Record<Status, (c: MigrationCorridor) => string> = {
  active: (c) => `⇄ ${c.bandwidth_gbps} Gbps`,
  completed: () => "✓ COMPLETE",
  failed: () => "✗ FAILED",
  pending: () => "— PENDING —",
};

export function DataFlowTopology() {
  const { corridors } = useBCPStore();
  const activeCount = corridors.filter((c) => c.status === "active").length;

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
        {corridors.map((corridor) => {
          const mid = `arrowRight-${corridor.id}`;
          const color = STROKE[corridor.status];
          return (
            <div key={corridor.id} className="relative bg-card rounded-lg border border-border/20 p-6 flex items-center gap-4 min-w-fit flex-shrink-0">
              <div className="absolute inset-x-0 top-0 h-px bg-accent/50 rounded-t-lg" />
              {/* Source */}
              <div className="relative w-28">
                <div className="absolute -top-2 -right-2 bg-accent text-[10px] font-bold text-background px-1.5 py-0.5 rounded font-mono z-10">P</div>
                <div className="bg-card border-2 border-accent/60 rounded-lg p-3 flex flex-col items-center gap-1">
                  <Server className="h-6 w-6 text-accent" />
                  <span className="text-xs font-bold text-foreground font-mono text-center leading-tight">{corridor.source.datacenter}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{corridor.source.city.toUpperCase()}</span>
                  <div className="flex items-center gap-1 mt-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${DOT[corridor.status]}`} />
                    <span className="text-[10px] text-muted-foreground">PRIMARY DC</span>
                  </div>
                </div>
              </div>
              {/* Path */}
              <div className="flex flex-col items-center min-w-48 flex-1">
                <div className="flex justify-center mb-1">
                  <span className="bg-card border border-accent/30 rounded px-2 py-0.5 text-xs font-mono font-semibold text-accent">
                    {BW_LABEL[corridor.status](corridor)}
                  </span>
                </div>
                <svg width="100%" height="40" preserveAspectRatio="none">
                  <defs>
                    <marker id={mid} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" fill={color} />
                    </marker>
                  </defs>
                  <line x1="0" y1="20" x2="100%" y2="20" stroke={color} strokeWidth={2} strokeDasharray="8 5" markerEnd={`url(#${mid})`}
                    style={corridor.status === "active" ? { animation: "flowAnim 1.4s linear infinite" } : undefined} />
                </svg>
                {corridor.latency_ms > 0 && (
                  <span className="text-[10px] font-mono text-muted-foreground mt-1">{corridor.latency_ms}ms RTT</span>
                )}
              </div>
              {/* Target */}
              <div className="relative w-28">
                <div className="absolute -top-2 -right-2 bg-yellow-500/80 text-[10px] font-bold text-background px-1.5 py-0.5 rounded font-mono z-10">DR</div>
                <div className="bg-card border-2 border-yellow-500/60 rounded-lg p-3 flex flex-col items-center gap-1">
                  <Shield className="h-6 w-6 text-yellow-400" />
                  <span className="text-xs font-bold text-foreground font-mono text-center leading-tight">{corridor.target.datacenter}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{corridor.target.city.toUpperCase()}</span>
                  <div className="flex items-center gap-1 mt-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${DOT[corridor.status]}`} />
                    <span className="text-[10px] text-muted-foreground">DR SITE</span>
                  </div>
                </div>
                <div className="w-full bg-muted/40 rounded-full h-1 mt-2">
                  <div className="bg-accent h-1 rounded-full transition-all duration-500" style={{ width: `${corridor.progress}%` }} />
                </div>
                <div className="text-[10px] font-mono text-muted-foreground text-center mt-0.5">{corridor.progress}% synced</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
