import { useBCPStore } from "@/store/bcpStore";
import { MigrationPhase } from "@/data/interfaces";
import { Badge } from "@/components/ui/badge";
import { type LucideIcon, LayoutDashboard, Map, ServerCog, Network, Activity, Zap } from "lucide-react";

const navItems: { name: string; icon: LucideIcon; id: string }[] = [
  { name: "Overview", icon: LayoutDashboard, id: "overview" },
  { name: "Migration Map", icon: Map, id: "migration-map" },
  { name: "Resources", icon: ServerCog, id: "resources" },
  { name: "System Topology", icon: Network, id: "topology" },
  { name: "Logs", icon: Activity, id: "logs" },
];

export function Sidebar() {
  const { migrationPhase, activeSection, setActiveSection } = useBCPStore();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-background/95 dark:bg-background/98 border-r border-border/20 px-4 py-6 flex flex-col z-10">
      <div className="flex items-center gap-3 mb-8 px-1">
        <div className="h-9 w-9 bg-accent/15 border border-accent/30 rounded-lg flex items-center justify-center shrink-0">
          <Zap className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-foreground leading-tight">BCP Command</h1>
          <p className="text-[11px] text-muted-foreground leading-tight">DC to DR Automation</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all text-left border-l-2
                ${isActive
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-border/20">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Migration Phase</p>
        <div className="text-lg font-mono font-bold text-accent leading-tight">{migrationPhase}</div>
        <Badge variant="secondary" className="mt-1.5 text-xs">
          {migrationPhase === MigrationPhase.CUTOVER ? "ACTIVE" : "STANDBY"}
        </Badge>
      </div>
    </aside>
  );
}
