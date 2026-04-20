import { useState } from "react";
import { ResourceForm } from "./ResourceForm";
import { ResourceTable } from "./ResourceTable";
import { Button } from "@/components/ui/button";
import { Plus, ChevronUp } from "lucide-react";

export function ResourceRegistry() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant={showForm ? "outline" : "default"}
          size="sm"
          onClick={() => setShowForm((prev) => !prev)}
          className="gap-2"
        >
          {showForm ? (
            <><ChevronUp className="h-4 w-4" /> Hide Form</>
          ) : (
            <><Plus className="h-4 w-4" /> Register Resource</>
          )}
        </Button>
      </div>

      {showForm && (
        <div className="bg-card rounded-lg border border-border/20 p-6">
          <h3 className="text-sm font-semibold text-foreground mb-5">Register New Resource</h3>
          <ResourceForm />
        </div>
      )}

      <ResourceTable />
    </div>
  );
}
