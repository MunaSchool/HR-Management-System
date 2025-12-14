"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/axiosInstance";

export default function SystemAdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    pendingChangeRequests: 0,
    activeWorkflowRules: 3,
    auditLogsToday: 12,
    totalUsers: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch actual stats from APIs
      // For now using mock data
      setStats({
        pendingChangeRequests: 5,
        activeWorkflowRules: 3,
        auditLogsToday: 12,
        totalUsers: 45,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const cards = [
    {
      title: "Workflow Configuration",
      description: "Configure approval workflows for system changes (BR 36)",
      icon: "⚙️",
      stats: `${stats.activeWorkflowRules} Active Rules`,
      action: () => router.push("/system-admin/workflow-config"),
      color: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
    },
    {
      title: "Audit Trail",
      description: "View complete audit log of all system changes (BR 22)",
      icon: "📋",
      stats: `${stats.auditLogsToday} Logs Today`,
      action: () => router.push("/system-admin/audit-trail"),
      color: "from-green-500/20 to-green-600/20 border-green-500/30",
    },
    {
      title: "Pending Approvals",
      description: "Review and process pending change requests",
      icon: "✓",
      stats: `${stats.pendingChangeRequests} Pending`,
      action: () => router.push("/change-requests"),
      color: "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30",
    },
    {
      title: "User Management",
      description: "Manage system users, roles, and permissions",
      icon: "👥",
      stats: `${stats.totalUsers} Total Users`,
      action: () => router.push("/hr-admin"),
      color: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">System Administration</h1>
          <p className="text-neutral-400 text-lg">
            Configure workflows, review audit trails, and manage system settings
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <div className="text-sm text-neutral-400 mb-1">Active Workflow Rules</div>
            <div className="text-3xl font-bold">{stats.activeWorkflowRules}</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <div className="text-sm text-neutral-400 mb-1">Pending Requests</div>
            <div className="text-3xl font-bold text-yellow-400">{stats.pendingChangeRequests}</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <div className="text-sm text-neutral-400 mb-1">Audit Logs (Today)</div>
            <div className="text-3xl font-bold text-green-400">{stats.auditLogsToday}</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <div className="text-sm text-neutral-400 mb-1">Total Users</div>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
          </div>
        </div>

        {/* Main Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${card.color} border rounded-lg p-6 cursor-pointer hover:scale-105 transition-transform`}
              onClick={card.action}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{card.icon}</div>
                <div className="text-sm font-medium px-3 py-1 bg-black/30 rounded-full">
                  {card.stats}
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">{card.title}</h2>
              <p className="text-neutral-300">{card.description}</p>
            </div>
          ))}
        </div>

        {/* BR Compliance Section */}
        <div className="mt-8 bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Compliance Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">BR 36: Workflow Approval</div>
                <div className="text-sm text-neutral-400">All changes must be made via workflow approval</div>
              </div>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                ✓ Compliant
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">BR 22: Audit Trail</div>
                <div className="text-sm text-neutral-400">Timestamped tracking of all editing, changes, and cancellations</div>
              </div>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                ✓ Compliant
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push("/system-admin/workflow-config")}
              className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 hover:bg-neutral-800 text-left"
            >
              <div className="font-medium mb-1">Create Workflow Rule</div>
              <div className="text-sm text-neutral-400">Add new approval workflow</div>
            </button>
            <button
              onClick={() => router.push("/system-admin/audit-trail")}
              className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 hover:bg-neutral-800 text-left"
            >
              <div className="font-medium mb-1">Export Audit Logs</div>
              <div className="text-sm text-neutral-400">Download audit trail reports</div>
            </button>
            <button
              onClick={() => router.push("/change-requests")}
              className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 hover:bg-neutral-800 text-left"
            >
              <div className="font-medium mb-1">Review Pending Requests</div>
              <div className="text-sm text-neutral-400">Process change requests</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
