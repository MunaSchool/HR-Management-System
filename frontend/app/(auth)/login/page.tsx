"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axiosInstance from "@/app/utils/ApiClient";

export default function LoginPage() {
  const router = useRouter();

  const [loginType, setLoginType] = useState<"employee" | "candidate">("employee");
  const [identifier, setIdentifier] = useState(""); // Employee number or email
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (loginType === "employee") {
        await axiosInstance.post("/auth/login", {
          employeeNumber: identifier,
          password,
        });
      } else {
        await axiosInstance.post("/auth/candidate-login", {
          email: identifier,
          password,
        });
      }
      router.push("/home");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left pane */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10 flex flex-col gap-6">
            <div>
              <p className="text-sm uppercase tracking-wide opacity-80">
                Payroll & HR Suite
              </p>
              <h1 className="text-4xl font-bold mt-2 leading-tight">
                Welcome back
              </h1>
              <p className="mt-3 text-sm text-blue-50 leading-relaxed">
                Sign in with your employee number and password to manage payroll, insurance, and other subsystems.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20 shadow-lg">
              <p className="text-sm font-semibold mb-3">What you can do (by role):</p>
              <ul className="space-y-2 text-sm text-blue-50">
                <li>• Payroll Manager: view/edit draft payroll configs, approve/reject, delete</li>
                <li>• HR Manager: create/edit drafts, approve/reject insurance brackets</li>
                <li>• Payroll Specialist: create/edit/delete insurance drafts</li>
              </ul>
            </div>
          </div>

          {/* Right pane */}
          <div className="p-10 lg:p-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-sm text-gray-500">Login to continue</p>
                <h2 className="text-3xl font-semibold text-gray-900">Sign in</h2>
              </div>
              <div className="flex gap-2 bg-gray-100 rounded-full p-1">
                <button
                  type="button"
                  onClick={() => {
                    setLoginType("employee");
                    setIdentifier("");
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    loginType === "employee"
                      ? "bg-white shadow text-gray-900"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Employee
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginType("candidate");
                    setIdentifier("");
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    loginType === "candidate"
                      ? "bg-white shadow text-gray-900"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Candidate
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="identifier"
                  className="text-sm text-gray-700 block font-medium"
                >
                  {loginType === "employee" ? "Employee Number" : "Email"}
                </label>
                <input
                  id="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  type={loginType === "employee" ? "text" : "email"}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={loginType === "employee" ? "EMP12345" : "you@example.com"}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm text-gray-700 block font-medium"
                >
                  Password
                </label>
                <input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 text-white font-semibold py-3 transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {loginType === "candidate" && (
              <p className="mt-6 text-center text-gray-500 text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Register
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
