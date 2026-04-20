import { useBCPStore } from "@/store/bcpStore";
import { MigrationPhase } from "@/data/interfaces";
import { Badge } from "@/components/ui/badge";
import { type LucideIcon, LayoutDashboard, Map, ServerCog, Network, Activity, Clock } from "lucide-react";

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
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-border/10 dark:bg-background/50 backdrop-blur border-r border-border/20 px-4 py-6 flex flex-col z-10">
      <div className="flex items-center space-x-3 mb-8">
        <div className="h-8 w-8 bg-accent/20 rounded-lg flex items-center justify-center">
          <span className="text-accent font-mono text-lg">BCP</span>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Command Center</h1>
          <p className="text-xs text-muted-foreground">DC to DR Automation</p>
        </div>
      </div>

      <nav className="flex-0 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium
                       hover:bg-accent/10 hover:text-accent transition-colors text-left
                       ${activeSection === item.id ? "bg-accent/20 text-accent" : "text-muted-foreground"}`}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="mt-6 pt-4 border-t border-border/20">
        <div className="flex items-center space-x-3 mb-2">
          <div className="h-5 w-5 bg-accent/20 rounded flex items-center justify-center">
            <Clock className="h-3 w-3 text-accent" />
          </div>
          <span className="text-xs text-muted-foreground">Migration Phase</span>
        </div>
        <div className="text-xl font-mono font-bold text-accent">
          {migrationPhase}
        </div>
        <Badge variant="secondary" className="text-xs mt-1">
          {migrationPhase === MigrationPhase.CUTOVER ? "ACTIVE" : "STANDBY"}
        </Badge>
      </div>
    </aside>
  );
}
