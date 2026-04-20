import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useBCPStore } from "@/store/bcpStore";
import { Eye } from "lucide-react";
import type { Resource } from "@/data/interfaces";
import { ResourceDetail } from "./ResourceDetail";
import { resourceSchema } from "@/schemas/resourceSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type ResourceFormValues = z.infer<typeof resourceSchema>;

interface ResourceActionsProps {
  resourceId: string;
}

export function ResourceActions({ resourceId }: ResourceActionsProps) {
  const { deleteResource, updateResource, resources } = useBCPStore();
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
  });

  const handleViewDetails = () => {
    const resource = resources.find(r => r.id === resourceId);
    setSelectedResource(resource ?? null);
    setIsDetailOpen(true);
  };

  const handleEdit = () => {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    reset({
      name: resource.name,
      type: resource.type,
      source_ip: resource.source_ip,
      target_ip: resource.target_ip,
      hostname: resource.hostname,
      port: resource.port,
      environment: resource.environment,
      priority_tier: resource.priority_tier,
      dependencies: resource.dependencies.join(", ") as unknown as string[],
      notes: resource.notes ?? "",
    });
    setIsEditOpen(true);
  };

  const onEditSubmit = (data: ResourceFormValues) => {
    updateResource(resourceId, data);
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      deleteResource(resourceId);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger variant="outline" size="sm">
          <Eye className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="right">
          <DropdownMenuItem onClick={handleViewDetails}>View Details</DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ResourceDetail
        resource={selectedResource}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="w-full max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 text-sm font-medium text-muted-foreground block">Resource Name</label>
                <Input {...register("name")} className={errors.name ? "border-destructive" : ""} />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div>
                <label className="mb-1 text-sm font-medium text-muted-foreground block">Resource Type</label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Application Server">Application Server</SelectItem>
                        <SelectItem value="Database Server">Database Server</SelectItem>
                        <SelectItem value="Load Balancer">Load Balancer</SelectItem>
                        <SelectItem value="Message Broker">Message Broker</SelectItem>
                        <SelectItem value="Storage Volume">Storage Volume</SelectItem>
                        <SelectItem value="Network Appliance">Network Appliance</SelectItem>
                        <SelectItem value="Microservice">Microservice</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <label className="mb-1 text-sm font-medium text-muted-foreground block">Source IP</label>
                <Input {...register("source_ip")} className={errors.source_ip ? "border-destructive" : ""} />
                {errors.source_ip && <p className="mt-1 text-xs text-destructive">{errors.source_ip.message}</p>}
              </div>
              <div>
                <label className="mb-1 text-sm font-medium text-muted-foreground block">Target IP</label>
                <Input {...register("target_ip")} className={errors.target_ip ? "border-destructive" : ""} />
                {errors.target_ip && <p className="mt-1 text-xs text-destructive">{errors.target_ip.message}</p>}
              </div>
              <div>
                <label className="mb-1 text-sm font-medium text-muted-foreground block">Hostname</label>
                <Input {...register("hostname")} className={errors.hostname ? "border-destructive" : ""} />
                {errors.hostname && <p className="mt-1 text-xs text-destructive">{errors.hostname.message}</p>}
              </div>
              <div>
                <label className="mb-1 text-sm font-medium text-muted-foreground block">Port</label>
                <Input type="number" {...register("port", { valueAsNumber: true })} className={errors.port ? "border-destructive" : ""} />
                {errors.port && <p className="mt-1 text-xs text-destructive">{errors.port.message}</p>}
              </div>
              <div>
                <label className="mb-1 text-sm font-medium text-muted-foreground block">Environment</label>
                <Controller
                  name="environment"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Production">Production</SelectItem>
                        <SelectItem value="Staging">Staging</SelectItem>
                        <SelectItem value="DR">DR</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <label className="mb-1 text-sm font-medium text-muted-foreground block">Priority Tier</label>
                <Controller
                  name="priority_tier"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tier 1 — Critical">Tier 1 — Critical</SelectItem>
                        <SelectItem value="Tier 2 — High">Tier 2 — High</SelectItem>
                        <SelectItem value="Tier 3 — Standard">Tier 3 — Standard</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <div>
              <label className="mb-1 text-sm font-medium text-muted-foreground block">Dependencies (comma-separated)</label>
              <Input
                {...register("dependencies", {
                  setValueAs: (v) =>
                    Array.isArray(v) ? v : typeof v === "string" ? v.split(",").map((s) => s.trim()).filter(Boolean) : [],
                })}
              />
            </div>
            <div>
              <label className="mb-1 text-sm font-medium text-muted-foreground block">Notes</label>
              <Textarea {...register("notes")} rows={2} />
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
