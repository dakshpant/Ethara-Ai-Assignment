import { cn } from "../../lib/utils";
import { TaskStatus } from "../../types";

const statusStyles: Record<TaskStatus, string> = {
  TODO: "bg-indigo-100 text-indigo-700",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  DONE: "bg-emerald-100 text-emerald-700",
};

const statusLabels: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={cn(
        "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
        statusStyles[status]
      )}
    >
      {statusLabels[status]}
    </span>
  );
}