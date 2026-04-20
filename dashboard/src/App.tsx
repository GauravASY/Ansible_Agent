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
import { DataFlowTopology } from "@/components/overview/DataFlowTopology";

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
  );
}

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
              <SectionHeader
                title="Overview"
                description="Real-time BCP migration status and key performance metrics"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <RpoCard />
                <RtoCard />
                <ResourcesMigratedCard />
                <EstimatedCompletionCard />
              </div>
              <div className="mt-6">
                <DataFlowTopology />
              </div>
            </section>
          )}

          {activeSection === "migration-map" && (
            <section>
              <SectionHeader
                title="Migration Map"
                description="Corridor progress, latency, and bandwidth across all DC-to-DR routes"
              />
              <MigrationMap />
            </section>
          )}

          {activeSection === "resources" && (
            <section>
              <SectionHeader
                title="Resource Registry"
                description="Manage and track all resources in the migration pipeline"
              />
              <ResourceRegistry />
            </section>
          )}

          {activeSection === "topology" && (
            <section>
              <SectionHeader
                title="System Topology"
                description="Live network graph of source DC and target DR infrastructure"
              />
              <SystemTopology />
            </section>
          )}

          {activeSection === "logs" && (
            <section>
              <SectionHeader
                title="Migration Logs"
                description="Chronological event stream with severity-level filtering"
              />
              <MigrationLogs />
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
