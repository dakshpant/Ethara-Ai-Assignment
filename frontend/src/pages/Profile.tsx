import { useAuth } from "../context/AuthContext";
import { User, LogOut, Shield, Mail, Calendar } from "lucide-react";
import { motion } from "motion/react";

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Personal Profile</h2>
        <p className="mt-1 text-sm text-slate-500">Manage your identity and preferences.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="h-32 bg-indigo-600" />
        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-6">
            <div className="h-24 w-24 rounded-2xl bg-white p-1 border border-slate-100 shadow-sm">
              <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-200 border-2 border-white ring-1 ring-slate-200 text-2xl font-bold text-slate-600 uppercase tracking-wider">
                {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{user.name}</h1>
            <p className="text-sm text-slate-500 uppercase tracking-tighter flex items-center gap-1 mt-1 font-mono">
               <Shield className="h-3 w-3" />
               {user.role}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 border border-slate-50">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 border border-slate-50">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Joined Date</p>
                  <p className="font-medium text-slate-900">Oct 12, 2024</p>
                </div>
              </div>
            </div>

            <div className="flex items-end justify-end">
              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-6 py-2.5 text-xs font-bold text-red-600 transition-all hover:bg-red-100 active:scale-95 shadow-sm"
              >
                <LogOut className="h-4 w-4" />
                Logout Account
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
