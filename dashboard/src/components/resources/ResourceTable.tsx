import { useBCPStore } from "@/store/bcpStore";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ResourceActions } from "./ResourceActions";
import { ResourceDetail } from "./ResourceDetail";

export function ResourceTable() {
  const { resources, deleteResource } = useBCPStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredType, setFilteredType] = useState<"all" | Resource["type"]>("all");
  const [filteredStatus, setFilteredStatus] = useState<"all" | Resource["status"]>("all");
  const [filteredTier, setFilteredTier] = useState<"all" | Resource["priority_tier"]>("all");

  // Filter resources based on search and filters
  const filteredResources = resources.filter(resource => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.source_ip.includes(searchTerm) ||
      resource.target_ip.includes(searchTerm);

    const matchesType =
      filteredType === "all" || resource.type === filteredType;

    const matchesStatus =
      filteredStatus === "all" || resource.status === filteredStatus;

    const matchesTier =
      filteredTier === "all" || resource.priority_tier === filteredTier;

    return matchesSearch && matchesType && matchesStatus && matchesTier;
  });

  // Get unique types, statuses, and tiers for filter dropdowns
  const types = [...new Set(resources.map(r => r.type))];
  const statuses = [...new Set(resources.map(r => r.status))];
  const tiers = [...new Set(resources.map(r => r.priority_tier))];

  return (
    <div className="space-y-6">
      {/* Header with title and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-foreground">Resource Registry</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              // Open add resource form (we'll implement this later)
              alert("Add resource form would open here");
            }}
            className="btn btn-primary btn-sm"
          >
            Add Resource
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="mb-2 text-sm font-medium text-muted-foreground block">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by name, hostname, or IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="mb-2 text-sm font-medium text-muted-foreground block">
            Type
          </label>
          <select
            value={filteredType}
            onChange={(e) => setFilteredType(e.target.value as any)}
            className="select select-bordered w-full"
          >
            <option value="all">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 text-sm font-medium text-muted-foreground block">
            Status
          </label>
          <select
            value={filteredStatus}
            onChange={(e) => setFilteredStatus(e.target.value as any)}
            className="select select-bordered w-full"
          >
            <option value="all">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 text-sm font-medium text-muted-foreground block">
            Priority Tier
          </label>
          <select
            value={filteredTier}
            onChange={(e) => setFilteredTier(e.target.value as any)}
            className="select select-bordered w-full"
          >
            <option value="all">All Tiers</option>
            {tiers.map(tier => (
              <option key={tier} value={tier}>
                {tier}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-sm table-compact">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Source IP</th>
              <th>Target IP</th>
              <th>Tier</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResources.length === 0 ? (
              <tr>
                <td colspan="7" className="text-center py-6">
                  No resources found matching the filters.
                </td>
              </tr>
            ) : (
              filteredResources.map((resource) => (
                <tr key={resource.id} className="hover:bg-muted/50 transition-colors">
                  <td>{resource.name}</td>
                  <td>{resource.type}</td>
                  <td className="font-mono">{resource.source_ip}</td>
                  <td className="font-mono">{resource.target_ip}</td>
                  <td>
                    <span className={`badge badge-outline
                      ${resource.priority_tier === "Tier 1 — Critical" ? "badge-error" :
                        resource.priority_tier === "Tier 2 — High" ? "badge-warning" :
                        "badge-secondary"}`}>
                      {resource.priority_tier}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-outline
                      ${resource.status === "MIGRATED" ? "badge-success" :
                        resource.status === "IN PROGRESS" ? "badge-info" :
                        resource.status === "PENDING" ? "badge-warning" :
                        "badge-error"}`}>
                      {resource.status}
                    </span>
                  </td>
                  <td>
                    <ResourceActions resourceId={resource.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Resource Detail Modal/Drawer */}
      <ResourceDetail />
    </div>
  );
}