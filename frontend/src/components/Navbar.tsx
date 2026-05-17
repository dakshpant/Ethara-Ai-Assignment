import { Menu, User, LogOut } from "lucide-react";

import { useAuth } from "../context/AuthContext";

import { useState, useRef, useEffect } from "react";

import { useNavigate, useLocation } from "react-router-dom";

import { motion, AnimatePresence } from "motion/react";

import { getDashboardData } from "../services/dashboard.service";

import { DashboardStats } from "../types";

interface NavbarProps {
  onOpenSidebar: () => void;
}

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/projects": "Projects",
  "/tasks": "Tasks",
  "/profile": "Profile",
};

export function Navbar({ onOpenSidebar }: NavbarProps) {
  const { user, logout } = useAuth();

  const location = useLocation();

  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [stats, setStats] = useState<DashboardStats | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const title = pageTitles[location.pathname] || "Task Manager";

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    let isMounted = true;

    async function fetchStats() {
      try {
        const data = await getDashboardData();

        if (isMounted) {
          setStats(data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    // Initial fetch
    fetchStats();

    // Auto refresh every 3 sec
    const interval = setInterval(fetchStats, 3000);

    return () => {
      isMounted = false;

      clearInterval(interval);
    };
  }, []);

  const progress = stats?.totalTasks
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  const radius = 18;

  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="p-2 text-slate-500 transition-colors hover:text-slate-900 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h1 className="text-xl font-semibold tracking-tight text-slate-800">
          {title}
        </h1>
      </div>

      {/* Progress */}
      {stats && (
        <>
          {/* Mobile Progress */}
          <div className="flex items-center justify-center md:hidden">
            <div className="relative flex items-center justify-center">
              <svg width="40" height="40" className="-rotate-90">
                {/* Background */}
                <circle
                  cx="20"
                  cy="20"
                  r={radius}
                  strokeWidth="4"
                  fill="transparent"
                  className="stroke-slate-200"
                />

                {/* Progress */}
                <motion.circle
                  cx="20"
                  cy="20"
                  r={radius}
                  strokeWidth="4"
                  fill="transparent"
                  strokeLinecap="round"
                  className={
                    progress === 100
                      ? "stroke-emerald-500"
                      : progress >= 60
                        ? "stroke-indigo-600"
                        : "stroke-amber-500"
                  }
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  initial={{
                    strokeDashoffset: circumference,
                  }}
                  animate={{
                    strokeDashoffset,
                  }}
                  transition={{
                    duration: 0.8,
                  }}
                />
              </svg>

              <div className="absolute text-[9px] font-bold text-slate-700">
                {progress}%
              </div>
            </div>
          </div>

          {/* Desktop Progress */}
          <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm md:flex">
            <div className="relative flex items-center justify-center">
              <svg width="46" height="46" className="-rotate-90">
                {/* Background */}
                <circle
                  cx="23"
                  cy="23"
                  r={radius}
                  strokeWidth="4"
                  fill="transparent"
                  className="stroke-slate-100"
                />

                {/* Progress */}
                <motion.circle
                  cx="23"
                  cy="23"
                  r={radius}
                  strokeWidth="4"
                  fill="transparent"
                  strokeLinecap="round"
                  className={
                    progress === 100
                      ? "stroke-emerald-500"
                      : progress >= 60
                        ? "stroke-indigo-600"
                        : "stroke-amber-500"
                  }
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  initial={{
                    strokeDashoffset: circumference,
                  }}
                  animate={{
                    strokeDashoffset,
                  }}
                  transition={{
                    duration: 0.8,
                  }}
                />
              </svg>

              <div className="absolute text-[10px] font-bold text-slate-700">
                {progress}%
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {user?.role === "ADMIN" ? "Workspace" : "My Progress"}
              </p>

              <p className="mt-1 text-xs font-medium text-slate-600">
                {stats.completedTasks} / {stats.totalTasks} tasks done
              </p>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
