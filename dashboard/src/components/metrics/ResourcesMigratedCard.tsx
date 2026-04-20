import { useBCPStore } from "@/store/bcpStore";
import { Server } from "lucide-react";

export function ResourcesMigratedCard() {
  const { resources } = useBCPStore();
  const migratedCount = resources.filter((r) => r.status === "MIGRATED").length;
  const totalCount = resources.length;
  const progress = totalCount > 0 ? (migratedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-card rounded-lg p-4 border border-border/20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-accent/50" />
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resources Migrated</h3>
        <Server className="h-4 w-4 text-accent/70" />
      </div>
      <p className="text-3xl font-mono font-bold text-accent">
        {migratedCount}{" "}
        <span className="text-lg font-normal text-muted-foreground">/ {totalCount}</span>
      </p>
      <p className="mt-1 text-xs text-muted-foreground">Servers, DBs, and services</p>
      <div className="mt-3 w-full bg-muted/50 rounded-full h-1.5">
        <div
          className="bg-accent h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
          PARTIAL
        </span>
      </div>
    </div>
  );
}
