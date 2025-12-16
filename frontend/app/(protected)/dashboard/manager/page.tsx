// frontend/app/(protected)/dashboard/manager/page.tsx
'use client';

import { useAuth } from '@/app/(system)/context/authContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function ManagerHomePage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Manager Dashboard</h1>
        <p className="text-gray-600 mb-4">
          Welcome, {user?.name || user?.email}. Manage your team’s leaves and requests.
        </p>

        {/* Payroll button */}
        <Button
          onClick={() => router.push('/dashboard/manager/payroll')}
          className="mb-4"
        >
          View Payroll
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Team Leave Calendar"
          description="See all team leaves in one view"
          href="/dashboard/manager/leaves/calendar"
        />
        <DashboardCard
          title="Pending Requests"
          description="Approve or reject leave requests"
          href="/dashboard/manager/requests"
        />
        <DashboardCard
          title="My Team"
          description="View your direct reports"
          href="/dashboard/manager/team"
        />
        {/* ✅ NEW: Delegation Settings */}
        <DashboardCard
          title="Delegation Settings"
          description="Assign a delegate during your absence"
          href="/dashboard/manager/leaves/delegation"
        />
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(href)}
      className="bg-white shadow rounded-lg p-6 hover:shadow-lg cursor-pointer transition"
    >
      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
