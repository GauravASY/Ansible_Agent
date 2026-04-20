import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Resource } from "@/data/interfaces";

interface ResourceDetailProps {
  resource: Resource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResourceDetail({ resource, open, onOpenChange }: ResourceDetailProps) {
  if (!resource) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg">
        <DialogHeader>
          <DialogTitle>{resource.name}</DialogTitle>
          <DialogDescription>
            {resource.type} • {resource.hostname}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 pb-4">
          <div className="space-y-2">
            <h3 className="font-medium text-lg text-foreground">Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Source IP</span>
                <p className="font-mono">{resource.source_ip}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Target IP</span>
                <p className="font-mono">{resource.target_ip}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Port</span>
                <p>{resource.port}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Environment</span>
                <p>{resource.environment}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Priority Tier</span>
                <p>{resource.priority_tier}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Dependencies</span>
                <p>{resource.dependencies.length > 0 ? resource.dependencies.join(", ") : "None"}</p>
              </div>
              {resource.notes && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Notes</span>
                  <p>{resource.notes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-lg text-foreground">Migration Status</h3>
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full
                ${resource.status === "MIGRATED" ? "bg-green-500" :
                  resource.status === "IN PROGRESS" ? "bg-blue-500" :
                  resource.status === "PENDING" ? "bg-yellow-500" :
                  "bg-red-500"}`} />
              <span className="font-medium text-foreground">{resource.status}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
