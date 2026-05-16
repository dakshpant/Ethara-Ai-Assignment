import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/30 py-16 px-4 text-center">
      <div className="mb-4 rounded-full bg-white p-3 shadow-sm border border-neutral-100">
        <Icon className="h-6 w-6 text-neutral-400" />
      </div>
      <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
      <p className="mt-1 text-xs text-neutral-500 max-w-[240px]">{description}</p>
    </div>
  );
}
