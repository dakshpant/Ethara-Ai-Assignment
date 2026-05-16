import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signupUser } from "../services/auth.service";
import { toast } from "react-hot-toast";
import { UserPlus } from "lucide-react";
import { motion } from "motion/react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      await signupUser({
        name,
        email,
        password, //role not passes as there is a check for admin role in backend and by default it will be user only one admin can exist rest all members automatically assigned user role
      });

      toast.success("Account created successfully!");

      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
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
            <UserPlus className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Join TeamFlow
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Create your account to start managing tasks
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 ml-1"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full rounded-xl border border-neutral-100 bg-neutral-50/50 px-4 py-3 text-sm transition-all focus:border-neutral-900 focus:bg-white focus:outline-none"
              />
            </div>
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
                placeholder="john@example.com"
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
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-neutral-900 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
