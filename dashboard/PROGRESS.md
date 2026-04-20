# Dashboard Development Progress

## Project Overview

A BCP (Business Continuity Planning) Command Center dashboard for DC-to-DR (Data Center to Disaster Recovery) migration automation. Built with React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, Zustand, and Recharts.

---

## Session 1 — Foundation

### Dependencies Added (`package.json`)
- `@xyflow/react` ^12.10.2 — interactive node graph for system topology
- `recharts` ^3.8.1 — charts for migration metrics
- `zustand` ^5.0.12 — global state management
- `react-hook-form` ^7.72.1 — form handling for resource registry
- `radix-ui` ^1.4.3 — headless UI primitives
- `@fontsource-variable/geist` — variable font

### Data Layer (`src/data/`)

**`interfaces.ts`** — Core TypeScript interfaces:
- `MigrationCorridor` — source/target datacenters, status, progress, latency, bandwidth
- `Resource` — servers/databases/LBs with IP, hostname, environment, priority tier, dependencies, status
- `SystemNode` — topology node with type, position, and status data
- `SystemEdge` — directed edge between nodes with migration status
- `MigrationPhase` enum — ASSESSMENT → PREPARATION → CUTOVER → VALIDATION → COMPLETE
- `LogEntry` — timestamped log with level (info/success/warning/error)

**`mockBcpData.ts`** — Realistic mock data:
- 3 migration corridors: Delhi→Hyderabad (active 65%), Mumbai→Chennai (pending), Bangalore→Pune (completed)
- 10+ resources across app servers, databases, load balancers, message brokers, microservices
- 18 topology nodes split across Delhi DC (source) and Hyderabad DR (target)
- 29 edges: internal DC connections + cross-site migration links
- 5 sample log entries covering info, success, warning, and error levels

### State Management (`src/store/bcpStore.ts`)
Zustand store with full CRUD and computed getters:

**State:**
- `corridors`, `resources`, `nodes`, `edges`, `migrationPhase`, `logEntries`
- `selectedResourceId` — tracks selected resource for detail panel
- `activeSection` — drives sidebar navigation

**Actions:**
- `addResource`, `updateResource`, `deleteResource`
- `updateCorridorProgress`, `updateCorridorStatus`
- `updateNodeStatus`, `updateEdgeStatus`
- `addLogEntry`, `setMigrationPhase`
- `setSelectedResourceId`, `setActiveSection`

**Computed Getters:**
- `getResourcesByType`, `getResourcesByStatus`, `getResourcesByTier`
- `getCompletedCorridorsCount`, `getActiveCorridorsCount`, `getOverallProgress`
- `getSelectedResource`

---

## Session 2 — Core UI Components

### Layout

**`src/components/layout/TopBar.tsx`**
- Sticky header with current section label (dynamic, reads `activeSection` from store)
- Migration phase progress bar showing all 5 phases with active phase highlighted
- Notifications bell with badge count
- "INITIATE FAILOVER" destructive action button
- Last sync timestamp

**`src/components/layout/Sidebar.tsx`**
- Fixed left sidebar (w-64)
- BCP Command Center branding
- State-driven navigation — clicking a nav item calls `setActiveSection` in the store
- Active item highlighted with accent background
- Nav items: Overview, Migration Map, Resources, System Topology, Logs
- Bottom panel shows current migration phase and ACTIVE/STANDBY badge

### Metric Cards (`src/components/metrics/`)

**`RpoCard.tsx`** — Recovery Point Objective display

**`RtoCard.tsx`** — Recovery Time Objective display

**`ResourcesMigratedCard.tsx`** — Count of migrated vs total resources

**`EstimatedCompletionCard.tsx`** — Estimated migration completion time

### Migration Map (`src/components/map/MigrationMap.tsx`)
- Bar chart (Recharts) showing corridor progress overview
- Corridor details table: source city, target city, status badge, progress bar, latency, bandwidth

### Resource Registry (`src/components/resources/`)

**`ResourceRegistry.tsx`** — Container orchestrating the registry view

**`ResourceTable.tsx`** — Paginated table of all resources with status badges and priority tier indicators

**`ResourceDetail.tsx`** — Side panel showing full resource details (IPs, hostname, port, dependencies, notes)

**`ResourceForm.tsx`** — Add/edit form using react-hook-form with all resource fields

**`ResourceActions.tsx`** — Edit and delete action buttons per resource row

### Topology Node Stubs (`src/components/topology/nodes/`)
- `ServerNode.tsx` and `DatabaseNode.tsx` — initial node card designs (not yet wired to React Flow at this stage)

---

## Session 3 — Navigation & Missing Sections

### Sidebar Navigation Fix
Replaced static `<a href="#">` anchor links with `<button>` elements that call `setActiveSection`. Active section is now visually highlighted based on store state rather than hardcoded CSS.

### App Layout Fix (`src/App.tsx`)
- Added `ml-64` to `<main>` so content is not hidden behind the fixed sidebar
- Replaced always-on sections with conditional rendering: only the active section is mounted
- Imported and wired up `SystemTopology` and `MigrationLogs`

### System Topology (`src/components/topology/SystemTopology.tsx`)
Full interactive React Flow canvas using `@xyflow/react` v12:

**Custom node types (5):**
| Type | Icon | Covers |
|------|------|--------|
| `server` | Server | Application servers |
| `database` | Database | PostgreSQL, MySQL |
| `load-balancer` | Scale | HAProxy / cloud LBs |
| `service` | Cpu | Microservices |
| `network` | Network | Message brokers, network appliances |

Each node card shows: label, IP (monospace), optional details, status dot + label, latency.

**Edge styling by migration status:**
| Status | Color |
|--------|-------|
| `active` | Accent (blue) — animated |
| `completed` | Green |
| `inactive` | Muted foreground |
| `failed` | Red |

**React Flow features enabled:** Background grid, Controls panel, MiniMap with status-colored nodes, fitView on load.

### Migration Logs (`src/components/logs/MigrationLogs.tsx`)
Terminal-style log viewer:
- Level filter buttons: all / info / success / warning / error
- Full-text search input filtering log messages
- Color-coded rows per level with icon (Info, CheckCircle, AlertTriangle, XCircle)
- Monospace font, timestamp + level + message columns
- Entry count indicator ("X of Y entries")
- Scrollable list capped at 480px height

---

## File Tree (current state)

```
dashboard/src/
├── App.tsx                          # Section switcher, layout root
├── main.tsx                         # React entry point
├── index.css                        # Global styles
├── components/
│   ├── layout/
│   │   ├── TopBar.tsx               # Sticky header + phase progress
│   │   └── Sidebar.tsx              # Fixed nav sidebar
│   ├── metrics/
│   │   ├── RpoCard.tsx
│   │   ├── RtoCard.tsx
│   │   ├── ResourcesMigratedCard.tsx
│   │   └── EstimatedCompletionCard.tsx
│   ├── map/
│   │   └── MigrationMap.tsx         # Recharts bar chart + corridor table
│   ├── resources/
│   │   ├── ResourceRegistry.tsx
│   │   ├── ResourceTable.tsx
│   │   ├── ResourceDetail.tsx
│   │   ├── ResourceForm.tsx
│   │   └── ResourceActions.tsx
│   ├── topology/
│   │   ├── SystemTopology.tsx       # React Flow canvas (NEW)
│   │   └── nodes/
│   │       ├── ServerNode.tsx       # Legacy stub
│   │       └── DatabaseNode.tsx     # Legacy stub
│   ├── logs/
│   │   └── MigrationLogs.tsx        # Log viewer (NEW)
│   ├── theme-provider.tsx
│   └── ui/
│       └── button.tsx
├── store/
│   └── bcpStore.ts                  # Zustand store
├── data/
│   ├── interfaces.ts                # TypeScript types
│   └── mockBcpData.ts               # Mock corridors, resources, nodes, edges, logs
├── schemas/
│   └── resourceSchema.ts
└── lib/
```

---

## What Remains / Next Steps

- [ ] Real-time data integration (WebSocket or polling) to replace mock data
- [ ] Topology node drag-and-drop with position persistence
- [ ] Playbook trigger integration — connect "INITIATE FAILOVER" to the Ansible agent backend
- [ ] Resource dependency graph visualization
- [ ] Notifications panel (bell icon already present)
- [ ] Dark/light theme toggle
- [ ] Export logs to CSV/JSON
- [ ] Migration phase transition controls
