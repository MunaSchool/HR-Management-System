"use client";

import { useAuth } from "@/app/(system)/context/authContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="bg-slate-900/90 border-b border-slate-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-lg font-semibold">HR Management System</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-200">Welcome, {user.name || user.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-2xl font-semibold text-slate-50">Dashboard</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <DashboardCard
            title="Employee Profile"
            description="View and manage employee information"
            icon="👤"
          />
          <DashboardCard
            title="Recruitment"
            description="Manage job postings and applications"
            icon="🎯"
          />
          <DashboardCard
            title="Time Management"
            description="Track attendance and work hours"
            icon="⏰"
          />
          <DashboardCard
            title="Leave Management"
            description="Handle leave requests and balances"
            icon="🏖️"
          />
          <DashboardCard
            title="Payroll"
            description="Process salaries and payroll"
            icon="💰"
            onClick={() => router.push("/payroll-configuration")}
          />
          <DashboardCard
            title="Performance"
            description="Track goals and reviews"
            icon="📈"
          />
        </div>

        <div className="mt-8 bg-slate-900 border border-slate-800 shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-3">Your Information</h3>
          <div className="space-y-2 text-slate-200 text-sm">
            <p>
              <span className="text-slate-400">Role:</span> {user.roles?.join(", ") || user.role || "N/A"}
            </p>
            <p>
              <span className="text-slate-400">Email:</span> {user.email}
            </p>
            {user.age && (
              <p>
                <span className="text-slate-400">Age:</span> {user.age}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardCard({ title, description, icon, onClick }: { title: string; description: string; icon: string; onClick?: () => void }) {
  return (
    <div 
      className="bg-slate-800 border border-slate-700 shadow-sm rounded-lg p-6 hover:shadow-md hover:border-slate-600 transition cursor-pointer"
      onClick={onClick}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-100 mb-2">
        {title}
      </h3>
      <p className="text-slate-300 text-sm">
        {description}
      </p>
    </div>
  );
}

