import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBCPStore } from "@/store/bcpStore";
import { resourceSchema } from "@/schemas/resourceSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type ResourceFormValues = z.infer<typeof resourceSchema>;

export function ResourceForm() {
  const { addResource } = useBCPStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      name: "",
      type: "Application Server",
      source_ip: "",
      target_ip: "",
      hostname: "",
      port: 80,
      environment: "Production",
      priority_tier: "Tier 1 — Critical",
      dependencies: [],
      notes: "",
    },
  });

  const onSubmit = (data: ResourceFormValues) => {
    addResource(data);
    reset();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="mb-2 text-sm font-medium text-muted-foreground block">
            Resource Name
          </label>
          <Input
            {...register("name")}
            placeholder="Enter resource name"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 text-sm font-medium text-muted-foreground block">
            Resource Type
          </label>
          <Select
            {...register("type")}
            className={errors.type ? "border-destructive" : ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
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
          {errors.type && (
            <p className="mt-1 text-xs text-destructive">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 text-sm font-medium text-muted-foreground block">
            Source IP Address
          </label>
          <Input
            {...register("source_ip")}
            placeholder="192.168.1.10"
            className={errors.source_ip ? "border-destructive" : ""}
          />
          {errors.source_ip && (
            <p className="mt-1 text-xs text-destructive">{errors.source_ip.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 text-sm font-medium text-muted-foreground block">
            Target IP Address
          </label>
          <Input
            {...register("target_ip")}
            placeholder="10.10.1.10"
            className={errors.target_ip ? "border-destructive" : ""}
          />
          {errors.target_ip && (
            <p className="mt-1 text-xs text-destructive">{errors.target_ip.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="mb-2 text-sm font-medium text-muted-foreground block">
            Hostname
          </label>
          <Input
            {...register("hostname")}
            placeholder="app01.example.com"
            className={errors.hostname ? "border-destructive" : ""}
          />
          {errors.hostname && (
            <p className="mt-1 text-xs text-destructive">{errors.hostname.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 text-sm font-medium text-muted-foreground block">
            Port
          </label>
          <Input
            type="number"
            {...register("port")}
            placeholder="8080"
            className={errors.port ? "border-destructive" : ""}
          />
          {errors.port && (
            <p className="mt-1 text-xs text-destructive">{errors.port.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 text-sm font-medium text-muted-foreground block">
            Environment
          </label>
          <Select
            {...register("environment")}
            className={errors.environment ? "border-destructive" : ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select environment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Production">Production</SelectItem>
              <SelectItem value="Staging">Staging</SelectItem>
              <SelectItem value="DR">DR</SelectItem>
            </SelectContent>
          </Select>
          {errors.environment && (
            <p className="mt-1 text-xs text-destructive">{errors.environment.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 text-sm font-medium text-muted-foreground block">
            Priority Tier
          </label>
          <Select
            {...register("priority_tier")}
            className={errors.priority_tier ? "border-destructive" : ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tier 1 — Critical">Tier 1 — Critical</SelectItem>
              <SelectItem value="Tier 2 — High">Tier 2 — High</SelectItem>
              <SelectItem value="Tier 3 — Standard">Tier 3 — Standard</SelectItem>
            </SelectContent>
          </Select>
          {errors.priority_tier && (
            <p className="mt-1 text-xs text-destructive">{errors.priority_tier.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-2 text-sm font-medium text-muted-foreground block">
            Dependencies (comma-separated resource names)
          </label>
          <Input
            {...register("dependencies")}
            placeholder="res-001, res-002"
            className={errors.dependencies ? "border-destructive" : ""}
          />
          {errors.dependencies && (
            <p className="mt-1 text-xs text-destructive">{errors.dependencies.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 text-sm font-medium text-muted-foreground block">
            Notes (optional)
          </label>
          <Textarea
            {...register("notes")}
            placeholder="Additional notes..."
            className={errors.notes ? "border-destructive" : ""}
            rows={3}
          />
          {errors.notes && (
            <p className="mt-1 text-xs text-destructive">{errors.notes.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full mt-4">
        Register Resource
      </Button>
    </form>
  );
}