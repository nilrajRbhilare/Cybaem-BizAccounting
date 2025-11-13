import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status = "draft" | "sent" | "paid" | "overdue" | "pending" | "received" | "cancelled";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "Draft", variant: "secondary" },
  sent: { label: "Sent", variant: "default" },
  paid: { label: "Paid", variant: "default" },
  overdue: { label: "Overdue", variant: "destructive" },
  pending: { label: "Pending", variant: "outline" },
  received: { label: "Received", variant: "default" },
  cancelled: { label: "Cancelled", variant: "secondary" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant={config.variant} 
      className={cn(
        status === "paid" && "bg-success hover:bg-success text-white",
        status === "sent" && "bg-info hover:bg-info text-white",
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
