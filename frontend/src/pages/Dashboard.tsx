import { useState, useEffect } from "react";
import { getDashboardData } from "../services/dashboard.service";
import { DashboardStats } from "../types";
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Monitor tasks, progress, and recent activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md ${
              card.label === "Overdue" && card.value > 0
                ? "border-l-4 border-l-red-500"
                : ""
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.bg} ${card.color}`}
              >
                <card.icon className="h-6 w-6" />
              </div>
            </div>

            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              {card.label}
            </p>

            <h3
              className={`mt-2 text-3xl font-bold tracking-tight ${
                card.label === "Overdue" && card.value > 0
                  ? "text-red-600"
                  : "text-slate-900"
              }`}
            >
              {card.value}
            </h3>
          </motion.div>
        ))}
      </div>

      {/* Recent Tasks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
              Recent Tasks
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Latest task activity overview
            </p>
          </div>

          <Link
            to="/tasks"
            className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Task
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Priority
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Due Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {stats.recentTasks.map((task, i) => (
                  <motion.tr
                    key={task.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">
                        {task.title}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={task.status} />
                    </td>

                    <td className="px-6 py-4">
                      <PriorityBadge priority={task.priority} />
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "No Due Date"}
                      </p>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-4 lg:hidden">
          {stats.recentTasks.length > 0 ? (
            stats.recentTasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {task.title}
                    </h3>

                    <p className="mt-2 text-xs text-slate-500">
                      Due:
                      {" "}
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "No Due Date"}
                    </p>
                  </div>

                  <PriorityBadge priority={task.priority} />
                </div>

                <div className="mt-4">
                  <StatusBadge status={task.status} />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-10 text-center text-sm text-slate-500">
              No recent tasks found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}