"use client";

import { useAuth } from "@/app/(system)/context/authContext";
import Link from "next/link";

export default function HomePage() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  function getNormalizedRoles(user: any): string[] {
  if (!user) return [];
  if (Array.isArray(user.roles)) return user.roles.map((r: string) => r.toLowerCase());
  if (user.role) return [String(user.role).toLowerCase()];
  return [];
}
  const roles = getNormalizedRoles(user);

  // Check both roles array AND userType for different user types
  const userRoles = user?.roles || [];
  const userType = user?.userType;

  const isHR =
    userRoles.includes("HR Manager") ||
    userRoles.includes("HR Employee");

  const isEmployee =
    userRoles.includes("department employee");

  const isCandidate =
    userRoles.includes("candidate") ||
    userType === "candidate";

  const isHRAdmin =
    userRoles.includes("candidate") ||
    userType === "candidate";
      const isManager =
    roles.includes("department head") ||
    roles.includes("department_head") ||
    roles.includes("department manager") ||
    roles.includes("department_manager");

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <nav className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-white">
                HR Management System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white">
                Welcome,
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Alert Message */}
        <div className="rounded-lg border-l-4 border-red-600 bg-red-950/40 px-4 py-3 text-white mb-6">
          <p className="text-sm">
            Note: The "Create User" button is for testing purposes only and will be removed later.
          </p>
        </div>

        {/* Dashboard Section */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-6">
            Dashboard
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Employee Profile */}
            <Link href="/employee-profile-management">
              <DashboardCard
                title="Employee Profile"
                description="View and manage employee information"
                icon="👤"
              />
            </Link>

            {/* Recruitment */}
            <Link
              href={
                isHR
                  ? "/recruitment/hr/dashboard"
                  : isEmployee
                  ? "/recruitment/newHire/dashboard"
                  : isCandidate
                  ? "/recruitment/candidate/dashboard"
                  : "/recruitment/hr/dashboard"
              }
            >
              <DashboardCard
                title="Recruitment"
                description="Manage job postings and applications"
                icon="🎯"
              />
            </Link>

            {/* Time Management */}
            <Link href="/time-management">
              <DashboardCard
                title="Time Management"
                description="Track attendance and work hours"
                icon="⏰"
              />
            </Link>

            {/* Leave Management */}
            <DashboardCard
              title="Leave Management"
              description="Handle leave requests and balances"
              icon="🏖️"
            />

            {/* Payroll */}
            <DashboardCard
              title="Payroll"
              description="Process salaries and payroll"
              icon="💰"
            />

            {/* Performance */}
            <Link href="/performance">
              <DashboardCard
                title="Performance"
                description="Track goals and reviews"
                icon="📈"
              />
            </Link>

            {/* Organization Structure */}
            <Link href="/organization-structure">
              <DashboardCard
                title="Organization Structure"
                description="Manage departments and positions"
                icon="🏛️"
              />
            </Link>
                      {/* NORMAL EMPLOYEE DASHBOARD */}
          {!isHRAdmin && isEmployee && (
              <Link href={"/dashboard/employee/leaves"}>
              <DashboardCard
                title="Leave Requests"
                description="Submit and track your leave requests"
                icon="✉️"
              />
              </Link>
          )}

          {/* MANAGER / DEPARTMENT HEAD DASHBOARD */}
          {!isHRAdmin && !isEmployee && isManager && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href={"/dashboard/manager"}>
                            <DashboardCard
                title="Team Leave Requests"
                description="Review and approve your team’s leave requests"
                icon="👥"
                
              />
              </Link>
            </div>
          )}

          </div>
        </div>

        {/* Your Information Section */}
        <div className="mt-8 bg-slate-800 border border-slate-700 shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Your Information
          </h3>
          <div className="space-y-2 text-slate-200">
            <p>
              <strong className="text-white">Role:</strong> {user.roles?.join(", ") || user.role || "N/A"}
            </p>
            <p>
              <strong className="text-white">Email:</strong> {user.email || "N/A"}
            </p>
            {user.age && (
              <p>
                <strong className="text-white">Age:</strong> {user.age}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardCard({ title, description, icon }: { title: string; description: string; icon: string; }) {
  return (
    <div className="bg-slate-800 border border-slate-700 shadow rounded-lg p-6 hover:bg-slate-700 hover:border-slate-600 transition cursor-pointer">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">
        {title}
      </h3>
      <p className="text-slate-300 text-sm">
        {description}
      </p>
    </div>
  );
}

