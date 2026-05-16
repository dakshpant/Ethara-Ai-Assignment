import { useAuth } from "../context/AuthContext";
import {
  User,
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
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage your account information and workspace identity.
        </p>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        {/* Banner */}
        <div className="relative h-44 overflow-hidden bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600">
          <div className="absolute inset-0 bg-black/10" />

          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="relative px-8 pb-8">
          {/* Avatar */}
          <div className="-mt-10 mb-6 flex items-end justify-between">
            <div className="flex items-end gap-5">
              <div className="flex h-32 w-32 items-center justify-center rounded-3xl border-4 border-white bg-white shadow-xl">
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-4xl font-bold text-white">
                  {initials}
                </div>
              </div>

              <div className="pb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-3xl font-bold text-slate-900">
                    {user.name}
                  </h2>

                  <BadgeCheck className="h-6 w-6 text-indigo-600" />
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
                    <Shield className="h-3.5 w-3.5" />
                    {user.role}
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <Activity className="h-3.5 w-3.5" />
                    Active
                  </div>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="hidden items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition-all hover:bg-red-100 active:scale-95 md:flex"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Email */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Mail className="h-5 w-5 text-indigo-600" />
              </div>

              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Email Address
              </p>

              <p className="mt-2 break-all text-base font-semibold text-slate-900">
                {user.email}
              </p>
            </div>

            {/* Joined */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Calendar className="h-5 w-5 text-violet-600" />
              </div>

              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Joined Date
              </p>

              <p className="mt-2 text-base font-semibold text-slate-900">
                {joinedDate}
              </p>
            </div>
          </div>

          {/* Mobile Logout */}
          <button
            onClick={logout}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition-all hover:bg-red-100 active:scale-95 md:hidden"
          >
            <LogOut className="h-4 w-4" />
            Logout Account
          </button>
        </div>
      </motion.div>
    </div>
  );
}