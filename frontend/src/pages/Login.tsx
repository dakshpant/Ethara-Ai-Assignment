import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { LogIn } from "lucide-react";
import { motion } from "motion/react";
import { loginUser } from "../services/auth.service";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await loginUser(email, password);
      login(data.token, data.user);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 select-none">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px]"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-white shadow-xl shadow-neutral-900/10">
            <LogIn className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Login to TeamFlow
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Enter your credentials to access your account
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 ml-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full rounded-xl border border-neutral-100 bg-neutral-50/50 px-4 py-3 text-sm transition-all focus:border-neutral-900 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 ml-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-neutral-100 bg-neutral-50/50 px-4 py-3 text-sm transition-all focus:border-neutral-900 focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white transition-all hover:bg-neutral-800 focus:outline-none active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-neutral-900 hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-neutral-100/50 p-4 text-center">
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-2">
            Demo Accounts
          </p>
          <div className="flex justify-center gap-4 text-[10px] text-neutral-500 font-mono">
            <span>Admin: admin@example.com / admin123</span>
            <span className="text-neutral-300">|</span>
            <span>Member: member@example.com / member123</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
