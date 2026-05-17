import { useAuth } from "../context/AuthContext";

import {
  LogOut,
  Shield,
  Mail,
  Calendar,
  BadgeCheck,
  Activity,
} from "lucide-react";

import { motion } from "motion/react";

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(
        "en-US",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        },
      )
    : "N/A";

  return (
    <div className="mx-auto w-full max-w-5xl px-1 sm:px-2">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage your account information and workspace identity.
        </p>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
        }}
        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        {/* Banner */}
        <div className="relative h-32 overflow-hidden bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 sm:h-40 md:h-44">
          <div className="absolute inset-0 bg-black/10" />

          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="relative px-4 pb-6 sm:px-6 sm:pb-8 md:px-8">
          {/* Profile Top */}
          <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 md:-mt-12 lg:flex-row lg:items-end lg:justify-between">
            {/* Left */}
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:text-left">
              {/* Avatar */}
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border-4 border-white bg-white shadow-xl sm:h-28 sm:w-28 md:h-32 md:w-32">
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                  {initials}
                </div>
              </div>

              {/* User Info */}
              <div className="pb-1">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <h2 className="break-words text-2xl font-bold text-slate-900 sm:text-3xl">
                    {user.name}
                  </h2>

                  <BadgeCheck className="h-5 w-5 text-indigo-600 sm:h-6 sm:w-6" />
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-indigo-700 sm:text-xs">
                    <Shield className="h-3.5 w-3.5" />
                    {user.role}
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] font-semibold text-emerald-700 sm:text-xs">
                    <Activity className="h-3.5 w-3.5" />
                    Active
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Logout */}
            <button
              onClick={logout}
              className="hidden items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition-all hover:bg-red-100 active:scale-95 lg:flex"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>

          {/* Info Cards */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {/* Email */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm sm:h-12 sm:w-12">
                <Mail className="h-5 w-5 text-indigo-600" />
              </div>

              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:text-xs">
                Email Address
              </p>

              <p className="mt-2 break-all text-sm font-semibold text-slate-900 sm:text-base">
                {user.email}
              </p>
            </div>

            {/* Joined */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm sm:h-12 sm:w-12">
                <Calendar className="h-5 w-5 text-violet-600" />
              </div>

              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:text-xs">
                Joined Date
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-900 sm:text-base">
                {joinedDate}
              </p>
            </div>
          </div>

          {/* Mobile Logout */}
          <button
            onClick={logout}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition-all hover:bg-red-100 active:scale-95 lg:hidden"
          >
            <LogOut className="h-4 w-4" />
            Logout Account
          </button>
        </div>
      </motion.div>
    </div>
  );
}