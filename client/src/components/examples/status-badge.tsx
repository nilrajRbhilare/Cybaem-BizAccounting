import { StatusBadge } from "../status-badge";

export default function StatusBadgeExample() {
  return (
    <div className="p-8 flex flex-wrap gap-2">
      <StatusBadge status="draft" />
      <StatusBadge status="sent" />
      <StatusBadge status="paid" />
      <StatusBadge status="overdue" />
      <StatusBadge status="pending" />
      <StatusBadge status="received" />
      <StatusBadge status="cancelled" />
    </div>
  );
}
