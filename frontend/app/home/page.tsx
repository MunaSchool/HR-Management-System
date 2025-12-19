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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Dashboard
          </h2>

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

          {/* User Info */}
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
    </div>
  );
}

function DashboardCard({ title, description, icon }: { title: string; description: string; icon: string; }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition cursor-pointer">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}