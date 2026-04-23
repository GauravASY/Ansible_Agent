import { create } from "zustand";
import { MigrationPhase } from "../data/interfaces";
import type {
  MigrationCorridor,
  Resource,
  SystemNode,
  SystemEdge,
  LogEntry,
  DCLayer,
  LayerMigrationStatus
} from "../data/interfaces";
import {
  mockCorridors,
  mockResources,
  mockNodes,
  mockEdges,
  mockMigrationPhase,
  mockLogs
} from "../data/mockBcpData";

interface BCPState {
  // State
  corridors: MigrationCorridor[];
  resources: Resource[];
  nodes: SystemNode[];
  edges: SystemEdge[];
  migrationPhase: MigrationPhase;
  logEntries: LogEntry[];
  selectedResourceId: string | null;
  activeSection: string;

  // Actions
  setActiveSection: (section: string) => void;
  addResource: (resource: Omit<Resource, "id">) => void;
  updateResource: (id: string, updates: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
  updateCorridorProgress: (corridorId: string, progress: number) => void;
  updateCorridorStatus: (corridorId: string, status: MigrationCorridor["status"]) => void;
  updateNodeStatus: (nodeId: string, status: SystemNode["data"]["status"]) => void;
  updateEdgeStatus: (edgeId: string, status: SystemEdge["data"]["status"]) => void;
  addLogEntry: (log: Omit<LogEntry, "id">) => void;
  setMigrationPhase: (phase: MigrationPhase) => void;
  setSelectedResourceId: (id: string | null) => void;

  layerMigrationState: Record<string, Record<DCLayer, LayerMigrationStatus>>;
  initiateLayerMigration: (corridorId: string, layers: DCLayer[]) => void;

  // Getters (computed values)
  getResourcesByType: (type: Resource["type"]) => Resource[];
  getResourcesByStatus: (status: Resource["status"]) => Resource[];
  getResourcesByTier: (tier: Resource["priority_tier"]) => Resource[];
  getCompletedCorridorsCount: () => number;
  getActiveCorridorsCount: () => number;
  getOverallProgress: () => number;
  getSelectedResource: () => Resource | null;
}

export const useBCPStore = create<BCPState>((set, get) => ({
  // Initial state with mock data
  corridors: mockCorridors,
  resources: mockResources,
  nodes: mockNodes,
  edges: mockEdges,
  migrationPhase: mockMigrationPhase,
  logEntries: mockLogs,
  selectedResourceId: null,
  activeSection: "overview",
  layerMigrationState: Object.fromEntries(
    mockCorridors.map(c => [
      c.id,
      { Web: "idle", Application: "idle", Storage: "idle", Network: "idle" } as Record<DCLayer, LayerMigrationStatus>
    ])
  ),

  setActiveSection: (section) => set({ activeSection: section }),

  // Actions
  addResource: (resource) => {
    const newResource = {
      ...resource,
      id: `res-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: "PENDING" // Default status for new resources
    };
    set(state => ({ resources: [...state.resources, newResource] }));
  },

  updateResource: (id, updates) => {
    set(state => ({
      resources: state.resources.map(resource =>
        resource.id === id ? { ...resource, ...updates } : resource
      )
    }));
  },

  deleteResource: (id) => {
    set(state => ({
      resources: state.resources.filter(resource => resource.id !== id)
    }));
  },

  updateCorridorProgress: (corridorId, progress) => {
    set(state => ({
      corridors: state.corridors.map(corridor =>
        corridor.id === corridorId ? { ...corridor, progress } : corridor
      )
    }));
  },

  updateCorridorStatus: (corridorId, status) => {
    set(state => ({
      corridors: state.corridors.map(corridor =>
        corridor.id === corridorId ? { ...corridor, status } : corridor
      )
    }));
  },

  updateNodeStatus: (nodeId, status) => {
    set(state => ({
      nodes: state.nodes.map(node =>
        node.id === nodeId ? { ...node, data: { ...node.data, status } } : node
      )
    }));
  },

  updateEdgeStatus: (edgeId, status) => {
    set(state => ({
      edges: state.edges.map(edge =>
        edge.id === edgeId ? { ...edge, data: { ...edge.data, status } } : edge
      )
    }));
  },

  addLogEntry: (log) => {
    const newLog = {
      ...log,
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    set(state => ({
      logEntries: [newLog, ...state.logEntries].slice(0, 100) // Keep last 100 entries
    }));
  },

  setMigrationPhase: (phase) => {
    set({ migrationPhase: phase });
  },

  setSelectedResourceId: (id) => {
    set({ selectedResourceId: id });
  },

  initiateLayerMigration: (corridorId, layers) => {
    set(state => ({
      layerMigrationState: {
        ...state.layerMigrationState,
        [corridorId]: {
          ...state.layerMigrationState[corridorId],
          ...Object.fromEntries(layers.map(l => [l, "migrating" as LayerMigrationStatus]))
        }
      }
    }));
    layers.forEach(layer =>
      get().addLogEntry({
        level: "info",
        message: `${layer} Layer migration initiated for ${corridorId}`
      })
    );
  },

  // Getters
  getResourcesByType: (type) => {
    return get().resources.filter(resource => resource.type === type);
  },

  getResourcesByStatus: (status) => {
    return get().resources.filter(resource => resource.status === status);
  },

  getResourcesByTier: (tier) => {
    return get().resources.filter(resource => resource.priority_tier === tier);
  },

  getCompletedCorridorsCount: () => {
    return get().corridors.filter(c => c.status === "completed").length;
  },

  getActiveCorridorsCount: () => {
    return get().corridors.filter(c => c.status === "active").length;
  },

  getOverallProgress: () => {
    const corridors = get().corridors;
    if (corridors.length === 0) return 0;
    const totalProgress = corridors.reduce((sum, c) => sum + c.progress, 0);
    return Math.round(totalProgress / corridors.length);
  },

  getSelectedResource: () => {
    const { selectedResourceId, resources } = get();
    if (!selectedResourceId) return null;
    return resources.find(resource => resource.id === selectedResourceId) || null;
  }
}));