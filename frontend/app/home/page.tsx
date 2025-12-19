"use client";

import { useAuth } from "@/app/(system)/context/authContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axiosInstance from "@/app/utils/ApiClient";

// ----------------- Helpers -----------------
function getNormalizedRoles(user: any): string[] {
  if (!user) return [];
  if (Array.isArray(user.roles)) return user.roles.map((r: string) => r.toLowerCase());
  if (user.role) return [String(user.role).toLowerCase()];
  return [];
}
import Link from "next/link";

export default function HomePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showCreateUser, setShowCreateUser] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  // Check both roles array AND userType for different user types
  const userRoles = user?.roles || [];
  const userType = user?.userType;

  const isHR =
    userRoles.includes("HR Manager") ||
    userRoles.includes("HR Employee") ;


  const isEmployee =
    userRoles.includes("department employee");

  const isCandidate =
    userRoles.includes("candidate") ||
    userType === "candidate";

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const roles = getNormalizedRoles(user);

  const isHRAdmin =
    roles.includes("hr admin") || roles.includes("system admin");

  //  pure employees only
  const isEmployee = roles.includes("department employee");

  //  department heads / managers
  const isManager =
    roles.includes("department head") ||
    roles.includes("department_head") ||
    roles.includes("department manager") ||
    roles.includes("department_manager");

  const isCandidate = roles.includes("job candidate");

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Dashboard
          </h2>

          {/* HR ADMIN / SYSTEM ADMIN DASHBOARD */}
          {isHRAdmin && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard
                title="Employee Profile"
                description="View and manage employee information"
                icon="👤"
                href="/employee-profile"
              />
              <DashboardCard
                title="Recruitment"
                description="Manage job postings and applications"
                icon="🎯"
                href="/recruitment"
              />
              <DashboardCard
                title="Time Management"
                description="Track attendance and work hours"
                icon="⏰"
                href="/time-management"
              />

              <DashboardCard
                title="Payroll"
                description="Process salaries and payroll"
                icon="💰"
                href="/payroll"
              />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Employee Profile Management - Role-based access */}
            <Link href="/employee-profile-management">
              <DashboardCard
                title="Employee Profile Management"
                description="Manage profiles, change requests, and team information"
                icon="👥"
              />
            </Link>

              {/* Recruitment */}
            {(isHR || isEmployee || isCandidate) && (
              <Link
                href={
                  isHR
                    ? "/recruitment/hr/dashboard"
                    : isEmployee
                    ? "/recruitment/newHire/dashboard"
                    : "/recruitment/candidate/dashboard"
                }
              >
                <DashboardCard
                  title="Recruitment"
                  description="Manage job postings and applications"
                  icon="🎯"
                />
              </Link>
            )}


            {/* Time Management */}
            <Link href='/time-management'>
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
                href="/performance"
              />
            </div>
          )}
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

          </div>

          {/* NORMAL EMPLOYEE DASHBOARD */}
          {!isHRAdmin && isEmployee && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard
                title="Leave Requests"
                description="Submit and track your leave requests"
                icon="✉️"
                href="/dashboard/employee/leaves"
              />
            </div>
          )}

          {/* MANAGER / DEPARTMENT HEAD DASHBOARD */}
          {!isHRAdmin && !isEmployee && isManager && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard
                title="Team Leave Requests"
                description="Review and approve your team’s leave requests"
                icon="👥"
                href="/dashboard/manager"
              />
            </div>
          )}

          {/* CANDIDATE DASHBOARD */}
          {!isHRAdmin && !isEmployee && !isManager && isCandidate && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard
                title="My Applications"
                description="View your job applications and their status"
                icon="📄"
                href="/recruitment/my-applications"
              />
            </div>
          )}

          {/* FALLBACK FOR ANY OTHER ROLE */}
          {!isHRAdmin && !isEmployee && !isManager && !isCandidate && (
            <p className="text-gray-600 dark:text-gray-300">
              No dashboard is configured for your role.
            </p>
          )}

          {/* USER INFO */}
          <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Your Information
            </h3>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p><strong>Role:</strong> {user.roles}</p>
              <p><strong>Email:</strong> {user.email}</p>
              {user.age && <p><strong>Age:</strong> {user.age}</p>}
            </div>
          </div>
        </div>
      </main>

      {isHRAdmin && showCreateUser && (
        <CreateUserModal onClose={() => setShowCreateUser(false)} />
      )}
    </div>
  );
}

// ----------------- CreateUserModal (HR Admin only) -----------------
function CreateUserModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    employeeNumber: "",
    workEmail: "",
    password: "",
    firstName: "",
    lastName: "",
    nationalId: "",
    dateOfHire: "",
    department: "",
    jobTitle: "",
    roles: [] as string[],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const availableRoles = [
    { label: "HR Admin", value: "hr manager" }, // matches SystemRole.HR_MANAGER
    { label: "System Admin", value: "system admin" },
    { label: "Department Employee", value: "department employee" },
    { label: "Department Head", value: "department head" },
    { label: "Department Manager", value: "department manager" },
    { label: "Job Candidate", value: "job candidate" },
  ];

  const toggleRole = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.includes(value)
        ? prev.roles.filter((r) => r !== value)
        : [...prev.roles, value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const normalizedRoles = formData.roles.map((r) => r.trim().toLowerCase());
    const payload = { ...formData, roles: normalizedRoles };

    try {
      const res = await axiosInstance.post("/employee-profile", payload);
      console.log("Created employee:", res.data);
      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create user";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create New User
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {success ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-500 text-green-700 dark:text-green-400 p-4 rounded-lg">
            User created successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* BASIC FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* employeeNumber */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Employee Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.employeeNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, employeeNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="EMP001"
                />
              </div>

              {/* workEmail */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.workEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, workEmail: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="employee@company.com"
                />
              </div>

              {/* firstName */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* lastName */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* nationalId */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  National ID *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nationalId}
                  onChange={(e) =>
                    setFormData({ ...formData, nationalId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* dateOfHire */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date of Hire *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dateOfHire}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfHire: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* department (optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* jobTitle (optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, jobTitle: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* password */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* ROLES */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Roles (select at least one)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableRoles.map((r) => (
                  <label
                    key={r.value}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.roles.includes(r.value)}
                      onChange={() => toggleRole(r.value)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {r.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-500 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading || formData.roles.length === 0}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "Creating..." : "Create User"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ----------------- DashboardCard -----------------
function DashboardCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: string;
  href?: string;
}) {
  const router = useRouter();
  return (
    <div
      onClick={() => href && router.push(href)}
      className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}