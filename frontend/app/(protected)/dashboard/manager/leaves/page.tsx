// app/(protected)/dashboard/manager/leaves/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';
import axiosInstance from '@/app/utils/ApiClient';
import Link from 'next/link';

interface TeamLeaveStats {
  totalTeamMembers: number;
  pendingApprovals: number;
  approvedThisMonth: number;
  onLeaveToday: number;
}

interface LeaveRequest {
  _id: string;
  employeeId: { fullName: string; workEmail?: string };
  leaveTypeId: { name: string };
  dates: { from: string; to: string };
  status: string;          // e.g. 'PENDING', 'APPROVED', 'REJECTED'
  createdAt?: string;      // from mongoose timestamps
}

export default function ManagerLeavesOverview() {
  const [stats, setStats] = useState<TeamLeaveStats>({
    totalTeamMembers: 0,
    pendingApprovals: 0,
    approvedThisMonth: 0,
    onLeaveToday: 0,
  });

  const [pendingRequests, setPendingRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchManagerData();
  }, []);

  const fetchManagerData = async () => {
    setLoading(true);
    try {
      // USE EXISTING ENDPOINT: /leaves/requests
      const res = await axiosInstance.get<LeaveRequest[]>('/leaves/requests');
      const allRequests = res.data;

      // For now: manager sees all non-final requests.
      const pending = allRequests.filter(r => r.status === 'PENDING');

      // ---- derive simple stats on the frontend ----
      const memberSet = new Set(
        allRequests.map(r => r.employeeId?.fullName ?? r.employeeId)
      );
      const totalTeamMembers = memberSet.size;

      const pendingApprovals = pending.length;

      const now = new Date();
      const approvedThisMonth = allRequests.filter(r => {
        if (r.status !== 'APPROVED' || !r.createdAt) return false;
        const d = new Date(r.createdAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length;

      const onLeaveToday = allRequests.filter(r => {
        if (r.status !== 'APPROVED') return false;
        const from = new Date(r.dates.from);
        const to = new Date(r.dates.to);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        from.setHours(0, 0, 0, 0);
        to.setHours(0, 0, 0, 0);
        return today >= from && today <= to;
      }).length;

      setStats({
        totalTeamMembers,
        pendingApprovals,
        approvedThisMonth,
        onLeaveToday,
      });
      setPendingRequests(pending);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load manager data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-2 text-gray-500">Loading manager dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Team Leave Management</h1>
          <p className="text-gray-500">
            Manage your team&apos;s leave requests and approvals
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/manager/leaves/calendar">
              <Calendar className="mr-2 h-4 w-4" />
              Team Calendar
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Team Members</p>
                <p className="text-2xl font-bold">{stats.totalTeamMembers}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Approvals</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pendingApprovals}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Approved This Month</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.approvedThisMonth}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">On Leave Today</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.onLeaveToday}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Pending Approvals</CardTitle>
              <Badge variant="secondary">
                {pendingRequests.length} requests
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No pending approvals
                </p>
              ) : (
                pendingRequests.map(request => (
                  <div
                    key={request._id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">
                        {request.employeeId.fullName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {request.leaveTypeId.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(request.dates.from).toLocaleDateString()} -{' '}
                        {new Date(request.dates.to).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link
                          href={`/dashboard/manager/requests/${request._id}`}
                        >
                          Review
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              )}
              <Button className="w-full" asChild>
                <Link href="/dashboard/manager/requests">
                  View All Requests
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4"
                asChild
              >
                <Link href="/dashboard/manager/requests">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <p className="font-medium">Review Approvals</p>
                    <p className="text-sm text-gray-500">
                      Approve / reject leave requests
                    </p>
                  </div>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4"
                asChild
              >
                <Link href="/dashboard/manager/leaves/calendar">
                  <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium">Team Calendar</p>
                    <p className="text-sm text-gray-500">
                      View team leave schedule
                    </p>
                  </div>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4"
                asChild
              >
                <Link href="/dashboard/manager/leaves/reports">
                  <FileText className="mr-2 h-5 w-5 text-purple-600" />
                  <div className="text-left">
                    <p className="font-medium">Team Reports</p>
                    <p className="text-sm text-gray-500">
                      View leave analytics
                    </p>
                  </div>
                </Link>
              </Button>

              {/* View Team button */}
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4"
                asChild
              >
                <Link href="/dashboard/manager/team">
                  <Users className="mr-2 h-5 w-5 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium">View Team</p>
                    <p className="text-sm text-gray-500">
                      See all direct reports &amp; status
                    </p>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
