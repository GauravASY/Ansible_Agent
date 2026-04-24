import { useBCPStore } from "@/store/bcpStore";
import type { Resource } from "@/data/interfaces";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ResourceActions } from "./ResourceActions";
import { Search } from "lucide-react";

const statusStyles: Record<Resource["status"], string> = {
  "MIGRATED": "bg-green-500/15 text-green-400",
  "IN PROGRESS": "bg-blue-500/15 text-blue-400",
  "PENDING": "bg-yellow-500/15 text-yellow-400",
  "FAILED": "bg-red-500/15 text-red-400",
};

const tierStyles: Record<Resource["priority_tier"], string> = {
  "Tier 1 — Critical": "bg-red-500/15 text-red-400",
  "Tier 2 — High": "bg-orange-500/15 text-orange-400",
  "Tier 3 — Standard": "bg-muted/60 text-muted-foreground",
};

const selectClass =
  "h-9 w-full rounded-md border border-border/40 bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent/50 cursor-pointer";

export function ResourceTable() {
  const { resources } = useBCPStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredType, setFilteredType] = useState<"all" | Resource["type"]>("all");
  const [filteredStatus, setFilteredStatus] = useState<"all" | Resource["status"]>("all");
  const [filteredTier, setFilteredTier] = useState<"all" | Resource["priority_tier"]>("all");

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.resource_ip.includes(searchTerm);
    const matchesType = filteredType === "all" || resource.type === filteredType;
    const matchesStatus = filteredStatus === "all" || resource.status === filteredStatus;
    const matchesTier = filteredTier === "all" || resource.priority_tier === filteredTier;
    return matchesSearch && matchesType && matchesStatus && matchesTier;
  });

  const types = [...new Set(resources.map((r) => r.type))];
  const statuses = [...new Set(resources.map((r) => r.status))];
  const tiers = [...new Set(resources.map((r) => r.priority_tier))];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by name, hostname, IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={filteredType}
          onChange={(e) => setFilteredType(e.target.value as Resource["type"] | "all")}
          className={selectClass}
        >
          <option value="all">All Types</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          value={filteredStatus}
          onChange={(e) => setFilteredStatus(e.target.value as Resource["status"] | "all")}
          className={selectClass}
        >
          <option value="all">All Status</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={filteredTier}
          onChange={(e) => setFilteredTier(e.target.value as Resource["priority_tier"] | "all")}
          className={selectClass}
        >
          <option value="all">All Tiers</option>
          {tiers.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {filteredResources.length} of {resources.length} resources
      </p>

      <div className="rounded-lg border border-border/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/20 bg-muted/30">
                {["Name", "Type", "Resource IP", "Tier", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {filteredResources.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No resources match the current filters.
                  </td>
                </tr>
              ) : (
                filteredResources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{resource.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{resource.type}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{resource.resource_ip}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${tierStyles[resource.priority_tier]}`}>
                        {resource.priority_tier}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[resource.status]}`}>
                        {resource.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ResourceActions resourceId={resource.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
