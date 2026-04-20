import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { RpoCard } from "@/components/metrics/RpoCard";
import { RtoCard } from "@/components/metrics/RtoCard";
import { ResourcesMigratedCard } from "@/components/metrics/ResourcesMigratedCard";
import { EstimatedCompletionCard } from "@/components/metrics/EstimatedCompletionCard";
import { MigrationMap } from "@/components/map/MigrationMap";
import { ResourceRegistry } from "@/components/resources/ResourceRegistry";

export function App() {
  return (
    <div className="flex min-h-svh flex-col">
      <TopBar />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          {/* Sections will be rendered here based on active tab */}
          <div className="space-y-6">
            {/* Overview Section */}
            <section id="overview">
              <h2 className="text-2xl font-bold text-foreground mb-4">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <RpoCard />
                <RtoCard />
                <ResourcesMigratedCard />
                <EstimatedCompletionCard />
              </div>
            </section>

            {/* Migration Map Section */}
            <section id="migration-map">
              <h2 className="text-2xl font-bold text-foreground mb-4">Migration Map</h2>
              <MigrationMap />
            </section>

            {/* Resources Section */}
            <section id="resources">
              <h2 className="text-2xl font-bold text-foreground mb-4">Resources</h2>
              <ResourceRegistry />
            </section>

            {/* System Topology Section */}
            <section id="topology" className="hidden">
              <h2 className="text-2xl font-bold text-foreground mb-4">System Topology</h2>
              <p className="text-muted-foreground">Interactive topology diagram will be implemented here.</p>
            </section>

            {/* Logs Section */}
            <section id="logs" className="hidden">
              <h2 className="text-2xl font-bold text-foreground mb-4">Migration Logs</h2>
              <p className="text-muted-foreground">Live log feed will be implemented here.</p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}