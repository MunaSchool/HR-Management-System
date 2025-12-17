"use client";

import { useAuth, User } from "@/app/(system)/context/authContext";
import Link from "next/link";
import {
  isSystemAdmin,
  isHRManager,
  isHREmployee,
  isLineManager,
  isEmployee,
} from "@/app/utils/roleCheck";

export default function HomePage() {
  const { user, logout, loading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const getPerformanceRoute = (u: User) => {
    // HR side goes to admin dashboard
    if (isSystemAdmin(u) || isHRManager(u) || isHREmployee(u)) {
      return "/performance/adminDashboard";
    }
    // Line manager goes to manager dashboard
    if (isLineManager(u)) {
      return "/performance/managerDashboard";
    }
    // Regular employee goes to employee dashboard
    if (isEmployee(u)) {
      return "/performance/employeeDashboard";
    }
    return "/performance/unauthorized";
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const userDisplayName = user.firstName || user.email;

  const userRoleLabel =
    (isHREmployee(user) && "HR") ||
    (isLineManager(user) && "Manager") ||
    (isEmployee(user) && "Employee") ||
    "User";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                HR Management System
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 dark:text-gray-300">
                Welcome, {userDisplayName}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Dashboard
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/employee-profile-management">
              <DashboardCard
                title="Employee Profile Management"
                description="Manage profiles, change requests, and team information"
                icon="👥"
              />
            </Link>

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
            />

            <Link href={getPerformanceRoute(user)}>
              <DashboardCard
                title="Performance"
                description="Track goals and reviews"
                icon="📈"
              />
            </Link>

            <Link href="/organization-structure">
              <DashboardCard
                title="Organization Structure"
                description="Manage departments and positions"
                icon="🏛️"
              />
            </Link>
          </div>

          {/* User Info */}
          <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Your Information
            </h3>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p>
                <strong>Role:</strong> {userRoleLabel}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              {"age" in user && user.age && (
                <p>
                  <strong>Age:</strong> {user.age}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition cursor-pointer">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
