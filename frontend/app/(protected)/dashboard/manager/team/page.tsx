'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { toast } from 'sonner';
import axiosInstance from '@/app/utils/ApiClient';
import { Users, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

interface CurrentLeave {
  from: string;
  to: string;
  leaveTypeName: string;
}

interface TeamMember {
  _id: string;
  fullName: string;
  workEmail?: string;
  departmentName?: string;
  positionTitle?: string;
  onLeaveToday: boolean;
  pendingRequestsCount: number;
  currentLeave?: CurrentLeave | null;
  remainingAnnualDays?: number;
}

export default function ManagerTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    setLoading(true);
    try {
      // Backend to implement: GET /leaves/manager/team
      const res = await axiosInstance.get<TeamMember[]>('/leaves/manager/team');
      setTeam(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load team information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-2 text-gray-500">Loading team overview...</p>
        </div>
      </div>
    );
  }

  const totalMembers = team.length;
  const onLeaveCount = team.filter((m) => m.onLeaveToday).length;
  const pendingCount = team.reduce(
    (sum, m) => sum + (m.pendingRequestsCount || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Team</h1>
          <p className="text-gray-500">
            Overview of your direct reports and their leave status
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Team Members</p>
                <p className="text-2xl font-bold">{totalMembers}</p>
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
                <p className="text-sm text-gray-500">On Leave Today</p>
                <p className="text-2xl font-bold text-red-600">{onLeaveCount}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Requests</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team table */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Team Leave Status</CardTitle>
          <Button size="sm" variant="outline" onClick={loadTeam}>
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {team.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No team members found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department / Position</TableHead>
                  <TableHead>Status Today</TableHead>
                  <TableHead>Current / Upcoming Leave</TableHead>
                  <TableHead>Pending Requests</TableHead>
                  <TableHead>Annual Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.map((m) => (
                  <TableRow key={m._id}>
                    <TableCell>
                      <div className="font-medium">{m.fullName}</div>
                      {m.workEmail && (
                        <div className="text-xs text-gray-500">
                          {m.workEmail}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {m.departmentName || '-'}
                      </div>
                      {m.positionTitle && (
                        <div className="text-xs text-gray-500">
                          {m.positionTitle}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {m.onLeaveToday ? (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          On Leave
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 text-green-700 border-green-300"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          Available
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {m.currentLeave ? (
                        <div className="text-sm">
                          <div className="font-medium">
                            {m.currentLeave.leaveTypeName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(m.currentLeave.from).toLocaleDateString()}{' '}
                            –{' '}
                            {new Date(m.currentLeave.to).toLocaleDateString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {m.pendingRequestsCount > 0 ? (
                        <Badge variant="secondary">
                          {m.pendingRequestsCount} pending
                        </Badge>
                      ) : (
                        <span className="text-sm text-gray-400">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {m.remainingAnnualDays != null ? (
                        <span className="text-sm">
                          {m.remainingAnnualDays} days
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
