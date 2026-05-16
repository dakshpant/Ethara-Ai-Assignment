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
  let isMounted = true;

  async function fetchStats() {
    try {
      // LOAD CACHED DATA FIRST
      const cached =
        sessionStorage.getItem(
          "dashboardStats",
        );

      if (cached && isMounted) {
        setStats(
          JSON.parse(cached),
        );

        setIsLoading(false);
      }

      // FETCH LATEST DATA
      const data =
        await getDashboardData();

      if (isMounted) {
        setStats(data);

        // CACHE DATA
        sessionStorage.setItem(
          "dashboardStats",
          JSON.stringify(data),
        );
      }
    } catch (error) {
      console.error(
        "Failed to fetch dashboard stats",
        error,
      );
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  }

  fetchStats();

  return () => {
    isMounted = false;
  };
}, []);

  if (isLoading && !stats) {
    return <Loader />;
  }

  if (!stats) return null;

  const completionRate =
    stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

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
      label: "Pending",
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
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: i * 0.1,
            }}
            className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${
              card.label === "Overdue" && card.value > 0
                ? "border-l-4 border-l-red-500"
                : ""
            }`}
          >
            <div className="mb-4 flex items-start justify-between">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.bg} ${card.color}`}
              >
                <card.icon className="h-5 w-5" />
              </div>
            </div>

            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {card.label}
            </p>

            <h3
              className={`mt-1 text-3xl font-bold tracking-tight ${
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

      {/* Completion */}
      {/* <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Task Completion
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Overall productivity
              progress
            </p>
          </div>

          <span className="text-3xl font-bold text-indigo-600">
            {completionRate}%
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-500"
            style={{
              width: `${completionRate}%`,
            }}
          />
        </div>
      </motion.div> */}

      {/* Recent Tasks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Recent Tasks
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest activity across projects
            </p>
          </div>

          <Link
            to="/tasks"
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Task
                  </th>

                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Priority
                  </th>

                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Assignee
                  </th>

                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right">
                    Due Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {stats.recentTasks?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-sm text-slate-400"
                    >
                      No recent tasks found
                    </td>
                  </tr>
                ) : (
                  stats.recentTasks?.map((task, i) => (
                    <motion.tr
                      key={task.id}
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      transition={{
                        delay: i * 0.05,
                      }}
                      className="transition-colors hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {task.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {task.project?.name}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={task.status} />
                      </td>

                      <td className="px-6 py-4">
                        <PriorityBadge priority={task.priority} />
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-700">
                          {task.assignedTo?.name}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <p className="text-xs font-medium text-slate-500">
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "No due date"}
                        </p>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
