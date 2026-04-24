import { z } from "zod";

export const resourceSchema = z.object({
  name: z.string().min(1, "Resource name is required"),
  type: z.enum([
    "Application Server",
    "Database Server",
    "Load Balancer",
    "Message Broker",
    "Storage Volume",
    "Network Appliance",
    "Microservice",
  ]),
  resource_ip: z.string().regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, "Resource IP must be a valid IP address"),
  hostname: z.string().min(1, "Hostname is required"),
  port: z.number().min(1, "Port must be at least 1").max(65535, "Port must not exceed 65535"),
  environment: z.enum(["Production", "Staging", "DR"]),
  priority_tier: z.enum([
    "Tier 1 — Critical",
    "Tier 2 — High",
    "Tier 3 — Standard",
  ]),
  dependencies: z.array(z.string()).optional(),
  notes: z.string().optional(),
});