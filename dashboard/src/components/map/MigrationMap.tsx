import { mockCorridors } from "@/data/mockBcpData";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell
} from "recharts";

export function MigrationMap() {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4">Migration Corridors Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockCorridors}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="source.city" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="progress" name="Progress (%)">
              {mockCorridors.map((corridor) => (
                <Cell
                  key={corridor.id}
                  fill={
                    corridor.status === "active" ? "#3b82f6" :
                    corridor.status === "completed" ? "#22c55e" :
                    corridor.status === "failed" ? "#ef4444" :
                    "#6b7280"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4">Corridor Details</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border/20">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Latency (ms)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Bandwidth (Gbps)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {mockCorridors.map((corridor) => (
                <tr key={corridor.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    {corridor.source.city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    {corridor.target.city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${corridor.status === "active" ? "bg-accent/10 text-accent" :
                        corridor.status === "completed" ? "bg-green/10 text-green" :
                        corridor.status === "failed" ? "bg-destructive/10 text-destructive" :
                        "bg-muted/10 text-muted-foreground"}`}>
                      {corridor.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="w-full bg-muted/50 rounded-full h-2">
                      <div className={`bg-accent h-2 rounded-full`} style={{ width: `${corridor.progress}%` }}></div>
                    </div>
                    <span className="ml-2 text-xs">{corridor.progress}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{corridor.latency_ms}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{corridor.bandwidth_gbps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}