import { MigrationPhase } from "./interfaces";
import type { MigrationCorridor, Resource, SystemNode, SystemEdge, LogEntry } from "./interfaces";

// Mock migration corridors
export const mockCorridors: MigrationCorridor[] = [
  {
    id: "corridor-1",
    source: {
      city: "Delhi",
      datacenter: "DC-DELHI-01",
      ip_range: "192.168.10.0/24"
    },
    target: {
      city: "Hyderabad",
      datacenter: "DR-HYD-01",
      ip_range: "10.10.10.0/24"
    },
    status: "active",
    progress: 65,
    latency_ms: 42,
    bandwidth_gbps: 10,
    started_at: "2026-04-15T08:00:00Z"
  },
  {
    id: "corridor-2",
    source: {
      city: "Mumbai",
      datacenter: "DC-MUMBAI-01",
      ip_range: "192.168.20.0/24"
    },
    target: {
      city: "Chennai",
      datacenter: "DR-CHENNAI-01",
      ip_range: "10.10.20.0/24"
    },
    status: "pending",
    progress: 0,
    latency_ms: 35,
    bandwidth_gbps: 5,
    started_at: "2026-04-20T10:00:00Z"
  },
  {
    id: "corridor-3",
    source: {
      city: "Bangalore",
      datacenter: "DC-BANG-01",
      ip_range: "192.168.30.0/24"
    },
    target: {
      city: "Pune",
      datacenter: "DR-PUNE-01",
      ip_range: "10.10.30.0/24"
    },
    status: "completed",
    progress: 100,
    latency_ms: 28,
    bandwidth_gbps: 15,
    started_at: "2026-04-10T06:00:00Z"
  }
];

// Mock resources
export const mockResources: Resource[] = [
  {
    id: "res-001",
    name: "Application Server 1",
    type: "Application Server",
    resource_ip: "192.168.10.10",
    hostname: "app01.delhi.example.com",
    port: 8080,
    environment: "Production",
    priority_tier: "Tier 1 — Critical",
    dependencies: ["res-005", "res-006"],
    status: "IN PROGRESS"
  },
  {
    id: "res-002",
    name: "Application Server 2",
    type: "Application Server",
    resource_ip: "192.168.10.11",
    hostname: "app02.delhi.example.com",
    port: 8080,
    environment: "Production",
    priority_tier: "Tier 1 — Critical",
    dependencies: ["res-005", "res-006"],
    status: "PENDING"
  },
  {
    id: "res-003",
    name: "Application Server 3",
    type: "Application Server",
    resource_ip: "192.168.10.12",
    hostname: "app03.delhi.example.com",
    port: 8080,
    environment: "Staging",
    priority_tier: "Tier 2 — High",
    dependencies: [],
    status: "MIGRATED"
  },
  {
    id: "res-004",
    name: "PostgreSQL Primary",
    type: "Database Server",
    resource_ip: "192.168.10.20",
    hostname: "db-postgres01.delhi.example.com",
    port: 5432,
    environment: "Production",
    priority_tier: "Tier 1 — Critical",
    dependencies: [],
    status: "IN PROGRESS"
  },
  {
    id: "res-005",
    name: "MySQL Secondary",
    type: "Database Server",
    resource_ip: "192.168.10.21",
    hostname: "db-mysql01.delhi.example.com",
    port: 3306,
    environment: "Production",
    priority_tier: "Tier 1 — Critical",
    dependencies: [],
    status: "PENDING"
  },
  {
    id: "res-006",
    name: "Load Balancer",
    type: "Load Balancer",
    resource_ip: "192.168.10.30",
    hostname: "lb01.delhi.example.com",
    port: 443,
    environment: "Production",
    priority_tier: "Tier 1 — Critical",
    dependencies: [],
    status: "IN PROGRESS"
  },
  {
    id: "res-007",
    name: "RabbitMQ Broker",
    type: "Message Broker",
    resource_ip: "192.168.10.40",
    hostname: "mq01.delhi.example.com",
    port: 5672,
    environment: "Production",
    priority_tier: "Tier 2 — High",
    dependencies: [],
    status: "PENDING"
  },
  {
    id: "res-008",
    name: "Microservice-Auth",
    type: "Microservice",
    resource_ip: "192.168.10.50",
    hostname: "auth.delhi.example.com",
    port: 8000,
    environment: "Production",
    priority_tier: "Tier 1 — Critical",
    dependencies: ["res-004", "res-005"],
    status: "IN PROGRESS"
  },
  {
    id: "res-009",
    name: "Microservice-Payment",
    type: "Microservice",
    resource_ip: "192.168.10.51",
    hostname: "payment.delhi.example.com",
    port: 8001,
    environment: "Production",
    priority_tier: "Tier 2 — High",
    dependencies: ["res-004"],
    status: "PENDING"
  },
  {
    id: "res-010",
    name: "Storage Volume",
    type: "Storage Volume",
    resource_ip: "192.168.10.60",
    hostname: "storage01.delhi.example.com",
    port: 445,
    environment: "Production",
    priority_tier: "Tier 3 — Standard",
    dependencies: [],
    status: "MIGRATED"
  }
];

// Mock system topology nodes
export const mockNodes: SystemNode[] = [
  // Delhi DC nodes (left cluster)
  {
    id: "server-1",
    type: "server",
    data: {
      label: "Application Server 1",
      ip: "192.168.10.10",
      hostname: "app01.delhi.example.com",
      status: "receiving",
      latency: 12
    },
    position: { x: 100, y: 100 }
  },
  {
    id: "server-2",
    type: "server",
    data: {
      label: "Application Server 2",
      ip: "192.168.10.11",
      hostname: "app02.delhi.example.com",
      status: "standby",
      latency: 8
    },
    position: { x: 100, y: 200 }
  },
  {
    id: "server-3",
    type: "server",
    data: {
      label: "Application Server 3",
      ip: "192.168.10.12",
      hostname: "app03.delhi.example.com",
      status: "online",
      latency: 5
    },
    position: { x: 100, y: 300 }
  },
  {
    id: "db-1",
    type: "database",
    data: {
      label: "PostgreSQL Primary",
      ip: "192.168.10.20",
      hostname: "db-postgres01.delhi.example.com",
      status: "receiving",
      latency: 15,
      details: "PostgreSQL 14, 500GB"
    },
    position: { x: 100, y: 400 }
  },
  {
    id: "db-2",
    type: "database",
    data: {
      label: "MySQL Secondary",
      ip: "192.168.10.21",
      hostname: "db-mysql01.delhi.example.com",
      status: "standby",
      latency: 10,
      details: "MySQL 8.0, 300GB"
    },
    position: { x: 100, y: 500 }
  },
  {
    id: "lb-1",
    type: "load-balancer",
    data: {
      label: "Load Balancer",
      ip: "192.168.10.30",
      status: "receiving",
      latency: 8
    },
    position: { x: 100, y: 600 }
  },
  {
    id: "mq-1",
    type: "network",
    data: {
      label: "RabbitMQ Broker",
      ip: "192.168.10.40",
      status: "standby",
      latency: 12
    },
    position: { x: 100, y: 700 }
  },
  {
    id: "svc-1",
    type: "service",
    data: {
      label: "Microservice-Auth",
      ip: "192.168.10.50",
      hostname: "auth.delhi.example.com",
      status: "receiving",
      latency: 6
    },
    position: { x: 100, y: 800 }
  },
  {
    id: "svc-2",
    type: "service",
    data: {
      label: "Microservice-Payment",
      ip: "192.168.10.51",
      hostname: "payment.delhi.example.com",
      status: "standby",
      latency: 7
    },
    position: { x: 100, y: 900 }
  },
  // Hyderabad DR nodes (right cluster)
  {
    id: "dr-server-1",
    type: "server",
    data: {
      label: "Application Server 1",
      ip: "10.10.10.10",
      hostname: "app01.hyd.example.com",
      status: "standby",
      latency: 42
    },
    position: { x: 800, y: 100 }
  },
  {
    id: "dr-server-2",
    type: "server",
    data: {
      label: "Application Server 2",
      ip: "10.10.10.11",
      hostname: "app02.hyd.example.com",
      status: "standby",
      latency: 42
    },
    position: { x: 800, y: 200 }
  },
  {
    id: "dr-server-3",
    type: "server",
    data: {
      label: "Application Server 3",
      ip: "10.10.10.12",
      hostname: "app03.hyd.example.com",
      status: "online",
      latency: 42
    },
    position: { x: 800, y: 300 }
  },
  {
    id: "dr-db-1",
    type: "database",
    data: {
      label: "PostgreSQL Replica",
      ip: "10.10.10.20",
      hostname: "db-postgres01.hyd.example.com",
      status: "standby",
      latency: 42,
      details: "PostgreSQL 14, 500GB"
    },
    position: { x: 800, y: 400 }
  },
  {
    id: "dr-db-2",
    type: "database",
    data: {
      label: "MySQL Replica",
      ip: "10.10.10.21",
      hostname: "db-mysql01.hyd.example.com",
      status: "standby",
      latency: 42,
      details: "MySQL 8.0, 300GB"
    },
    position: { x: 800, y: 500 }
  },
  {
    id: "dr-lb-1",
    type: "load-balancer",
    data: {
      label: "Load Balancer",
      ip: "10.10.10.30",
      status: "standby",
      latency: 42
    },
    position: { x: 800, y: 600 }
  },
  {
    id: "dr-mq-1",
    type: "network",
    data: {
      label: "RabbitMQ Broker",
      ip: "10.10.10.40",
      hostname: "mq01.hyd.example.com",
      status: "standby",
      latency: 42
    },
    position: { x: 800, y: 700 }
  },
  {
    id: "dr-svc-1",
    type: "service",
    data: {
      label: "Microservice-Auth",
      ip: "10.10.10.50",
      hostname: "auth.hyd.example.com",
      status: "standby",
      latency: 42
    },
    position: { x: 800, y: 800 }
  },
  {
    id: "dr-svc-2",
    type: "service",
    data: {
      label: "Microservice-Payment",
      ip: "10.10.10.51",
      hostname: "payment.hyd.example.com",
      status: "standby",
      latency: 42
    },
    position: { x: 800, y: 900 }
  }
];

// Mock system topology edges
export const mockEdges: SystemEdge[] = [
  // Delhi internal connections
  { id: "e1", source: "lb-1", target: "server-1", animated: true, data: { status: "active" } },
  { id: "e2", source: "lb-1", target: "server-2", animated: true, data: { status: "active" } },
  { id: "e3", source: "lb-1", target: "server-3", animated: true, data: { status: "active" } },
  { id: "e4", source: "server-1", target: "db-1", animated: true, data: { status: "active" } },
  { id: "e5", source: "server-2", target: "db-2", animated: true, data: { status: "active" } },
  { id: "e6", source: "server-3", target: "db-1", animated: true, data: { status: "active" } },
  { id: "e7", source: "db-1", target: "mq-1", animated: true, data: { status: "active" } },
  { id: "e8", source: "db-2", target: "mq-1", animated: true, data: { status: "active" } },
  { id: "e9", source: "mq-1", target: "svc-1", animated: true, data: { status: "active" } },
  { id: "e10", source: "mq-1", target: "svc-2", animated: true, data: { status: "active" } },

  // Migration connections (Delhi to Hyderabad)
  { id: "e11", source: "server-1", target: "dr-server-1", animated: true, data: { status: "active", label: "Migrating" } },
  { id: "e12", source: "server-2", target: "dr-server-2", animated: false, data: { status: "inactive" } },
  { id: "e13", source: "server-3", target: "dr-server-3", animated: false, data: { status: "completed" } },
  { id: "e14", source: "db-1", target: "dr-db-1", animated: true, data: { status: "active", label: "Syncing" } },
  { id: "e15", source: "db-2", target: "dr-db-2", animated: false, data: { status: "inactive" } },
  { id: "e16", source: "lb-1", target: "dr-lb-1", animated: true, data: { status: "active", label: "Config Sync" } },
  { id: "e17", source: "mq-1", target: "dr-mq-1", animated: false, data: { status: "inactive" } },
  { id: "e18", source: "svc-1", target: "dr-svc-1", animated: true, data: { status: "active", label: "Deploying" } },
  { id: "e19", source: "svc-2", target: "dr-svc-2", animated: false, data: { status: "inactive" } },

  // Hyderabad internal connections
  { id: "e20", source: "dr-lb-1", target: "dr-server-1", animated: true, data: { status: "active" } },
  { id: "e21", source: "dr-lb-1", target: "dr-server-2", animated: true, data: { status: "active" } },
  { id: "e22", source: "dr-lb-1", target: "dr-server-3", animated: true, data: { status: "active" } },
  { id: "e23", source: "dr-server-1", target: "dr-db-1", animated: true, data: { status: "active" } },
  { id: "e24", source: "dr-server-2", target: "dr-db-2", animated: true, data: { status: "active" } },
  { id: "e25", source: "dr-server-3", target: "dr-db-1", animated: true, data: { status: "active" } },
  { id: "e26", source: "dr-db-1", target: "dr-mq-1", animated: true, data: { status: "active" } },
  { id: "e27", source: "dr-db-2", target: "dr-mq-1", animated: true, data: { status: "active" } },
  { id: "e28", source: "dr-mq-1", target: "dr-svc-1", animated: true, data: { status: "active" } },
  { id: "e29", source: "dr-mq-1", target: "dr-svc-2", animated: true, data: { status: "active" } }
];

// Mock migration phase
export const mockMigrationPhase: MigrationPhase = MigrationPhase.CUTOVER;

// Mock log entries
export const mockLogs: LogEntry[] = [
  {
    id: "log-001",
    timestamp: "2026-04-20T10:00:00Z",
    level: "info",
    message: "Migration corridor Delhi-Hyderabad activated"
  },
  {
    id: "log-002",
    timestamp: "2026-04-20T09:45:00Z",
    level: "success",
    message: "Application Server 3 migration completed successfully"
  },
  {
    id: "log-003",
    timestamp: "2026-04-20T09:30:00Z",
    level: "warning",
    message: "Latency spike detected on Mumbai-Chennai corridor"
  },
  {
    id: "log-004",
    timestamp: "2026-04-20T09:15:00Z",
    level: "error",
    message: "Failed to connect to Storage Volume res-010 for verification"
  },
  {
    id: "log-005",
    timestamp: "2026-04-20T09:00:00Z",
    level: "info",
    message: "Load balancer configuration synchronized to DR site"
  }
];