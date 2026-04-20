import { ResourceForm } from "./ResourceForm";
import { ResourceTable } from "./ResourceTable";

export function ResourceRegistry() {
  return (
    <div className="space-y-6">
      <ResourceForm />
      <ResourceTable />
    </div>
  );
}