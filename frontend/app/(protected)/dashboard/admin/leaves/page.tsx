'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  FolderPlus,
  ClipboardList,
  Settings,
  FileText,
  PieChart,
  Wallet,
  Calendar,
  Clock,
  Link as LinkIcon,
} from 'lucide-react';

export default function LeavesOverviewPage() {
  const cards = [
    {
      title: 'Leave Categories',
      description: 'Organize leaves into categories (Paid, Unpaid, Medical, etc.)',
      icon: FolderPlus,
      href: '/dashboard/admin/leaves/categories',
    },
    {
      title: 'Leave Types',
      description: 'Define specific types under each category (Annual, Sick, etc.)',
      icon: ClipboardList,
      href: '/dashboard/admin/leaves/types',
    },
    {
      title: 'Leave Policies',
      description: 'Configure leave rules, approvals, and entitlements',
      icon: Settings,
      href: '/dashboard/admin/leaves/policies',
    },
    {
      title: 'Leave ↔ Payroll Mapping',
      description: 'Link leave types with payroll pay types',
      icon: LinkIcon,
      href: '/dashboard/admin/leaves/paycode-mapping',
    },
    {
      title: 'Leave Entitlements',
      description: 'View and adjust employees’ annual leave balances',
      icon: Wallet,
      href: '/dashboard/admin/leaves/entitlements',
    },
    {
      title: 'Leave Calendar',
      description: 'View all approved and pending leaves in a calendar view',
      icon: Calendar,
      href: '/dashboard/admin/leaves/calendar',
    },
    {
      title: 'Leave Scheduler',
      description: 'Manage auto-escalation, manager review, and compliance workflow',
      icon: Clock,
      href: '/dashboard/admin/leaves/scheduler',
    },
    {
      title: 'Leave Requests',
      description: 'View and manage employee leave requests',
      icon: FileText,
      href: '/dashboard/admin/leaves/requests',
    },
    {
      title: 'Reports',
      description: 'Analyze leave trends and employee statistics',
      icon: PieChart,
      href: '/dashboard/admin/leaves/reports',
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Leave Management</h1>
      <p className="text-gray-500">
        Select a section below to manage your organization’s leave system.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(({ title, description, icon: Icon, href }) => (
          <Link key={href} href={href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center space-x-3">
                <Icon className="h-6 w-6 text-green-600" />
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-sm">{description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
