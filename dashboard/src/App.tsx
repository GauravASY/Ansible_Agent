import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { RpoCard } from "@/components/metrics/RpoCard";
import { RtoCard } from "@/components/metrics/RtoCard";
import { ResourcesMigratedCard } from "@/components/metrics/ResourcesMigratedCard";
import { EstimatedCompletionCard } from "@/components/metrics/EstimatedCompletionCard";
import { MigrationMap } from "@/components/map/MigrationMap";
import { ResourceRegistry } from "@/components/resources/ResourceRegistry";
import { SystemTopology } from "@/components/topology/SystemTopology";
import { MigrationLogs } from "@/components/logs/MigrationLogs";
import { useBCPStore } from "@/store/bcpStore";

export function App() {
  const { activeSection } = useBCPStore();

  return (
    <div className="flex min-h-svh flex-col">
      <TopBar />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto ml-64">
          {activeSection === "overview" && (
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <RpoCard />
                <RtoCard />
                <ResourcesMigratedCard />
                <EstimatedCompletionCard />
              </div>
            </section>
          )}

          {activeSection === "migration-map" && (
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Migration Map</h2>
              <MigrationMap />
            </section>
          )}

          {activeSection === "resources" && (
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Resources</h2>
              <ResourceRegistry />
            </section>
          )}

          {activeSection === "topology" && (
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">System Topology</h2>
              <SystemTopology />
            </section>
          )}

          {activeSection === "logs" && (
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Migration Logs</h2>
              <MigrationLogs />
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
