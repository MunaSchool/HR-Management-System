"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/(system)/context/authContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [employeeNumber, setEmployeeNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(employeeNumber, password);
      router.push("/home");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 shadow-xl rounded-2xl p-6 sm:p-8">
        
        {/* Title */}
        <h1 className="text-3xl font-semibold text-white text-center mb-2">
          Welcome back
        </h1>
        <p className="text-center text-neutral-400 text-sm mb-6">
          Login to continue
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Employee Number */}
          <div className="space-y-1">
            <label
              htmlFor="employeeNumber"
              className="text-sm text-neutral-300 block"
            >
              Employee Number
            </label>
            <input
              id="employeeNumber"
              value={employeeNumber}
              onChange={(e) => setEmployeeNumber(e.target.value)}
              type="text"
              required
              className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
              placeholder="EMP12345"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="text-sm text-neutral-300 block"
            >
              Password
            </label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
              placeholder="••••••••"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-600 bg-red-950/40 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white text-black font-semibold py-2 transition hover:bg-neutral-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
   </button>        </form>

        {/* Footer */}
        <p className="mt-5 text-center text-neutral-400 text-sm">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-white underline hover:text-neutral-300"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}