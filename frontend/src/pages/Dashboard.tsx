import { useState, useEffect } from "react";
import { getDashboardData } from "../services/dashboard.service";
import { DashboardStats, Task } from "../types";
import { Loader } from "../components/ui/Loader";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ListTodo,
  ArrowRight,
} from "lucide-react";
import { StatusBadge } from "../components/ui/StatusBadge";
import { PriorityBadge } from "../components/ui/PriorityBadge";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getDashboardData();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (isLoading) return <Loader />;
  if (!stats) return null;

  const cards = [
    {
      label: "Total Tasks",
      value: stats.totalTasks,
      icon: ListTodo,
      color: "text-slate-600",
      bg: "bg-slate-100",
    },
    {
      label: "Completed",
      value: stats.completedTasks,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      label: "In Progress",
      value: stats.pendingTasks,
      icon: Clock,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    {
      label: "Overdue",
      value: stats.overdueTasks,
      icon: AlertCircle,
      color: "text-red-600",
      bg: "bg-red-100",
    },
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(cards || []).map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${card.label === "Overdue" && card.value > 0 ? "border-l-4 border-l-red-500" : ""}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} ${card.color}`}
              >
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {card.label}
            </p>
            <h3
              className={`mt-1 text-2xl font-bold tracking-tight ${card.label === "Overdue" && card.value > 0 ? "text-red-600" : "text-slate-900"}`}
            >
              {card.value}
            </h3>
          </motion.div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
            Recent Tasks
          </h2>
          <Link
            to="/tasks"
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Task Name
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right">
                    Assignee
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(stats?.recentTasks || []).map((task, i) => (
                  <motion.tr
                    key={task.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="group transition-colors hover:bg-slate-50/50"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-900">
                        {task.title}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="px-6 py-4">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-[11px] text-slate-500 font-medium">
                        {new Date(task.dueDate).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </td>
                  </motion.tr>
                ))}
                {(!stats?.recentTasks || stats.recentTasks.length === 0) && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-xs text-neutral-400"
                    >
                      No recent tasks found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
