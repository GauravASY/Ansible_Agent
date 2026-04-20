export interface MigrationCorridor {
  id: string;
  source: {
    city: string;
    datacenter: string;
    ip_range: string;
  };
  target: {
    city: string;
    datacenter: string;
    ip_range: string;
  };
  status: "pending" | "active" | "completed" | "failed";
  progress: number; // 0-100
  latency_ms: number;
  bandwidth_gbps: number;
  started_at: string;
}

export interface Resource {
  id: string;
  name: string;
  type: "Application Server" | "Database Server" | "Load Balancer" | "Message Broker" | "Storage Volume" | "Network Appliance" | "Microservice";
  source_ip: string;
  target_ip: string;
  hostname: string;
  port: number;
  environment: "Production" | "Staging" | "DR";
  priority_tier: "Tier 1 — Critical" | "Tier 2 — High" | "Tier 3 — Standard";
  dependencies: string[]; // comma-separated resource names
  notes?: string;
  status: "PENDING" | "IN PROGRESS" | "MIGRATED" | "FAILED";
}

export interface SystemNode {
  id: string;
  type: "server" | "database" | "load-balancer" | "service" | "network";
  data: {
    label: string;
    ip: string;
    hostname?: string;
    status: "online" | "receiving" | "standby" | "offline";
    latency?: number;
    details?: string;
    [key: string]: any;
  };
  position?: { x: number; y: number };
}

export interface SystemEdge {
  id: string;
  source: string;
  target: string;
  type?: "smoothstep" | "step" | "straight";
  animated?: boolean;
  data?: {
    status: "inactive" | "active" | "completed" | "failed";
    label?: string;
    [key: string]: any;
  };
}

export enum MigrationPhase {
  ASSESSMENT = "ASSESSMENT",
  PREPARATION = "PREPARATION",
  CUTOVER = "CUTOVER",
  VALIDATION = "VALIDATION",
  COMPLETE = "COMPLETE"
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "success" | "warning" | "error";
  message: string;
}