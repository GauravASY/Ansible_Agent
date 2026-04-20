import { useEffect, useRef, useState } from "react";
import { useBCPStore } from "@/store/bcpStore";
import { MigrationPhase } from "@/data/interfaces";
import { Bell, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const sectionLabels: Record<string, string> = {
  overview: "Overview",
  "migration-map": "Migration Map",
  resources: "Resources",
  topology: "System Topology",
  logs: "Migration Logs",
};

const phases = [
  MigrationPhase.ASSESSMENT,
  MigrationPhase.PREPARATION,
  MigrationPhase.CUTOVER,
  MigrationPhase.VALIDATION,
  MigrationPhase.COMPLETE,
];

function formatSyncLabel(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return "just now";
  if (minutes === 1) return "1m ago";
  return `${minutes}m ago`;
}

export function TopBar() {
  const { migrationPhase, activeSection, logEntries } = useBCPStore();

  const notificationCount = logEntries.filter(
    (l) => l.level === "error" || l.level === "warning"
  ).length;

  const syncedAt = useRef(Date.now());
  const [syncLabel, setSyncLabel] = useState("just now");

  useEffect(() => {
    const id = setInterval(() => {
      setSyncLabel(formatSyncLabel(Date.now() - syncedAt.current));
    }, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 left-64 right-0 z-20 bg-background/80 dark:bg-background/90 backdrop-blur border-b border-border/20 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <span className="text-xs text-muted-foreground">You are in:</span>
        <span className="text-sm font-medium text-foreground">{sectionLabels[activeSection] ?? activeSection}</span>
      </div>

      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="flex items-center space-x-2">
            {phases.map((phase, index) => (
              <div key={phase} className="flex items-center space-x-1">
                <div className={`w-3 h-3 rounded-full transition-colors
                  ${migrationPhase === phase ? "bg-accent" : "bg-muted/50"}`} />
                {index < phases.length - 1 && <div className="w-px bg-muted/50" />}
                <span className={`text-xs font-medium transition-colors
                  ${migrationPhase === phase ? "text-accent" : "text-muted-foreground"}`}>
                  {phase}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="p-2 rounded-md hover:bg-muted/50 transition-colors" aria-label="Notifications">
            <Bell className="h-4 w-4 text-muted-foreground hover:text-accent" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-xs text-white rounded-full w-4 h-4 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
        </div>
        <Button
          variant="destructive"
          className="px-4 py-2 text-sm"
          onClick={() => alert("Failover initiated! (This is a demo)")}
        >
          INITIATE FAILOVER
        </Button>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Last sync: {syncLabel}</span>
        </div>
      </div>
    </header>
  );
}
