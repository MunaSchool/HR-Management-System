// app/(protected)/dashboard/manager/leaves/reports/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axiosInstance from '@/app/utils/ApiClient';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface LeaveRequest {
  _id: string;
  employeeId: { fullName: string; workEmail?: string };
  leaveTypeId: { name: string };
  dates: { from: string; to: string };
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt?: string;
}

interface TypeSummary {
  leaveTypeName: string;
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

export default function ManagerTeamReportsPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [summaries, setSummaries] = useState<TypeSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get<LeaveRequest[]>('/leaves/requests');
      const all = res.data || [];
      setRequests(all);

      // Aggregate per leave type
      const map = new Map<string, TypeSummary>();

      all.forEach((r) => {
        const typeName = r.leaveTypeId?.name ?? 'Unknown';
        if (!map.has(typeName)) {
          map.set(typeName, {
            leaveTypeName: typeName,
            total: 0,
            approved: 0,
            pending: 0,
            rejected: 0,
          });
        }
        const entry = map.get(typeName)!;
        entry.total += 1;
        if (r.status === 'APPROVED') entry.approved += 1;
        else if (r.status === 'PENDING') entry.pending += 1;
        else if (r.status === 'REJECTED') entry.rejected += 1;
      });

      setSummaries(Array.from(map.values()));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load team reports');
    } finally {
      setLoading(false);
    }
  };

  // Top-level quick stats
  const totalRequests = requests.length;
  const totalApproved = requests.filter((r) => r.status === 'APPROVED').length;
  const totalPending = requests.filter((r) => r.status === 'PENDING').length;
  const totalRejected = requests.filter((r) => r.status === 'REJECTED').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-2 text-gray-500">Loading team reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Leave Reports</h1>
          <p className="text-gray-500">
            Overview of your team&apos;s leave usage by type and status.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/manager/leaves">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Manager Dashboard
          </Link>
        </Button>
      </div>

      {/* High level stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Total Requests</p>
            <p className="text-2xl font-bold">{totalRequests}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Approved</p>
            <p className="text-2xl font-bold text-green-600">{totalApproved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{totalPending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Rejected</p>
            <p className="text-2xl font-bold text-red-600">{totalRejected}</p>
          </CardContent>
        </Card>
      </div>

      {/* Summary by leave type */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Requests by Leave Type</CardTitle>
          <Badge variant="outline">{summaries.length} leave types</Badge>
        </CardHeader>
        <CardContent>
          {summaries.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No leave data available yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-2 px-3">Leave Type</th>
                    <th className="text-center py-2 px-3">Total</th>
                    <th className="text-center py-2 px-3">Approved</th>
                    <th className="text-center py-2 px-3">Pending</th>
                    <th className="text-center py-2 px-3">Rejected</th>
                  </tr>
                </thead>
                <tbody>
                  {summaries.map((s) => (
                    <tr key={s.leaveTypeName} className="border-b last:border-0">
                      <td className="py-2 px-3 font-medium">{s.leaveTypeName}</td>
                      <td className="py-2 px-3 text-center">{s.total}</td>
                      <td className="py-2 px-3 text-center text-green-600">
                        {s.approved}
                      </td>
                      <td className="py-2 px-3 text-center text-yellow-600">
                        {s.pending}
                      </td>
                      <td className="py-2 px-3 text-center text-red-600">
                        {s.rejected}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
