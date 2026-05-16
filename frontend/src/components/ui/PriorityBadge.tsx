import { cn } from "../../lib/utils";
import { Priority } from "../../types";

const priorityStyles: Record<Priority, string> = {
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM: "bg-indigo-100 text-indigo-700",
  HIGH: "bg-red-100 text-red-700",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={cn(
      "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
      priorityStyles[priority]
    )}>
      {priority}
    </span>
  );
}
