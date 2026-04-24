import { useEffect, useRef, useState } from "react";
import { useBCPStore } from "@/store/bcpStore";
import { MigrationPhase } from "@/data/interfaces";
import { Bell, Clock, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

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

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative h-7 w-[52px] shrink-0 rounded-full border border-border/40 bg-muted/40 p-0.5 hover:border-border/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
    >
      {/* Sliding thumb */}
      <span
        className={`absolute top-0.5 left-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-accent shadow-sm`}
        style={{
          transform: isDark ? "translateX(24px)" : "translateX(0px)",
          transition: "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <span
          style={{
            display: "flex",
            transition: "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms ease",
            transform: isDark ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.9)",
            opacity: isDark ? 1 : 0,
            position: "absolute",
          }}
        >
          <Moon className="h-3 w-3 text-accent-foreground" />
        </span>
        <span
          style={{
            display: "flex",
            transition: "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms ease",
            transform: isDark ? "rotate(-90deg) scale(0.9)" : "rotate(0deg) scale(1)",
            opacity: isDark ? 0 : 1,
            position: "absolute",
          }}
        >
          <Sun className="h-3 w-3 text-accent-foreground" />
        </span>
      </span>

      {/* Track ghost icons */}
      <span className="pointer-events-none flex h-full items-center justify-between px-1.5">
        <Sun
          className="h-2.5 w-2.5 text-muted-foreground"
          style={{ opacity: isDark ? 0.45 : 0, transition: "opacity 250ms ease" }}
        />
        <Moon
          className="h-2.5 w-2.5 text-muted-foreground"
          style={{ opacity: isDark ? 0 : 0.45, transition: "opacity 250ms ease" }}
        />
      </span>
    </button>
  );
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

  const currentPhaseIndex = phases.indexOf(migrationPhase);

  return (
    <header className="sticky top-0 left-64 right-0 z-20 bg-background/80 dark:bg-background/90 backdrop-blur border-b border-border/20 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="text-xs text-muted-foreground">Section:</span>
        <span className="text-sm font-semibold text-foreground">{sectionLabels[activeSection] ?? activeSection}</span>
      </div>

      <div className="flex items-center">
        {phases.map((phase, index) => {
          const isActive = migrationPhase === phase;
          const isDone = index < currentPhaseIndex;
          return (
            <div key={phase} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-accent ring-2 ring-accent/30 scale-125"
                      : isDone
                      ? "bg-accent/50"
                      : "bg-muted/40"
                  }`}
                />
                <span
                  className={`text-[10px] font-medium whitespace-nowrap ${
                    isActive
                      ? "text-accent"
                      : isDone
                      ? "text-muted-foreground/70"
                      : "text-muted-foreground/40"
                  }`}
                >
                  {phase}
                </span>
              </div>
              {index < phases.length - 1 && (
                <div
                  className={`w-8 h-px self-start mt-1 mx-1 ${
                    isDone ? "bg-accent/40" : "bg-border/40"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center space-x-3">
        <ThemeToggle />
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
        <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Last sync: {syncLabel}</span>
        </div>
      </div>
    </header>
  );
}
