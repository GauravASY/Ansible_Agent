import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useBCPStore } from "@/store/bcpStore";
import { Edit, Trash2, Eye } from "lucide-react";

interface ResourceActionsProps {
  resourceId: string;
}

export function ResourceActions({ resourceId }: ResourceActionsProps) {
  const { deleteResource } = useBCPStore();
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { resources } = useBCPStore();

  const handleViewDetails = () => {
    const resource = resources.find(r => r.id === resourceId);
    setSelectedResource(resource ?? null);
    setIsDetailOpen(true);
  };

  const handleEdit = () => {
    // For now, just alert - we'll implement edit form later
    alert("Edit functionality not yet implemented");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      deleteResource(resourceId);
    }
  };

  return (
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
  );
}