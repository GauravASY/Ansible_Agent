import { useBCPStore } from "@/store/bcpStore";

export function ResourcesMigratedCard() {
  const { resources } = useBCPStore();

  const migratedCount = resources.filter(r => r.status === "MIGRATED").length;
  const totalCount = resources.length;
  const progress = totalCount > 0 ? (migratedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-card rounded-lg p-4 text-sm">
      <h3 className="font-medium text-muted-foreground">Resources Migrated</p>
      <p className="mt-1 text-2xl font-mono text-accent">{migratedCount} / {totalCount}</p>
      <p className="mt-1 text-xs text-muted-foreground">Servers, DBs, and services</p>
      <div className="mt-2 w-full">
        <div className="w-full bg-muted/50 rounded-full h-2.5">
          <div className="bg-accent h-2.5 rounded-full transition-width duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow/10 text-yellow">
        PARTIAL
      </span>
    </div>
  );
}