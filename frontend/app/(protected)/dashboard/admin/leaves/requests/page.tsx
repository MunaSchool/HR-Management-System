'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import axiosInstance from '@/app/utils/ApiClient';
import { Eye, Check, X, RefreshCcw, Search, Clock } from 'lucide-react';

export default function LeaveRequestsAdminPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  // 🔹 Fetch all leave requests
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/leaves/requests');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle approval or rejection
  const handleDecision = async (id: string, action: 'approved' | 'rejected') => {
    setLoading(true);
    try {
      const rawRole = localStorage.getItem('role') || '';
      const normalized = rawRole.toLowerCase();

      const isManager = normalized.includes('manager');
      const isHR = normalized.includes('hr');

      let endpoint: string;
      let payload: any;

      if (isManager && !isHR) {
        // Department / HR manager → dedicated manager endpoint
        endpoint = `/leaves/requests/${id}/manager-decision`;
        payload = { decision: action };
      } else if (isHR) {
        // HR Admin / HR Employee → HR compliance endpoint
        endpoint = `/leaves/requests/${id}/hr-review`;
        payload = { action };
      } else {
        // Fallback: direct status update
        endpoint = `/leaves/requests/${id}`;
        payload = { status: action };
      }

      await axiosInstance.patch(endpoint, payload);

      toast.success(`Request ${action}`);
      await fetchRequests();
      setSelected(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Error updating request');
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Safe helper for employee name
  const getEmployeeName = (emp: any) => {
    if (!emp) return 'Unknown';
    if (typeof emp === 'string') return emp;
    if (emp.fullName) return emp.fullName;
    if (emp.firstName && emp.lastName) return `${emp.firstName} ${emp.lastName}`;
    return emp.firstName || emp.lastName || 'Unknown';
  };

  // 🔹 Filter safely by employee or leave type
  const filtered = requests.filter((r) => {
    const empName = getEmployeeName(r.employeeId)?.toLowerCase() ?? '';
    const leaveName = r?.leaveTypeId?.name?.toLowerCase() ?? '';
    return (
      empName.includes(search.toLowerCase()) ||
      leaveName.includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Leave Requests</h1>
          <p className="text-gray-500">
            Review, approve, or reject employee leave submissions.
          </p>
        </div>
        <Button variant="outline" onClick={fetchRequests} disabled={loading}>
          <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by employee or leave type..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-6 text-gray-500">Loading requests...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-6 text-gray-400">No requests found</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>From → To</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r._id}>
                      <TableCell>{getEmployeeName(r.employeeId)}</TableCell>
                      <TableCell>{r.leaveTypeId?.name || 'Unknown'}</TableCell>
                      <TableCell>
                        {r.dates?.from
                          ? new Date(r.dates.from).toLocaleDateString()
                          : '—'}{' '}
                        →{' '}
                        {r.dates?.to
                          ? new Date(r.dates.to).toLocaleDateString()
                          : '—'}
                      </TableCell>
                      <TableCell>{r.durationDays ?? '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {r.status === 'approved' ? (
                            <Check className="text-green-600 h-4 w-4" />
                          ) : r.status === 'rejected' ? (
                            <X className="text-red-600 h-4 w-4" />
                          ) : (
                            <Clock className="text-yellow-600 h-4 w-4" />
                          )}
                          <Badge
                            className={
                              r.status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : r.status === 'rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }
                          >
                            {r.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelected(r)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {r.status === 'pending' && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() =>
                                handleDecision(r._id, 'approved')
                              }
                              disabled={loading}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleDecision(r._id, 'rejected')
                              }
                              disabled={loading}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Details Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription asChild>
              {selected && (
                <div className="space-y-3 text-sm text-gray-700 mt-3">
                  <p>
                    <b>Employee:</b> {getEmployeeName(selected.employeeId)}
                  </p>
                  <p>
                    <b>Leave Type:</b> {selected.leaveTypeId?.name || 'Unknown'}
                  </p>
                  <p>
                    <b>Duration:</b> {selected.durationDays} days
                  </p>
                  <p>
                    <b>From:</b>{' '}
                    {selected.dates?.from
                      ? new Date(selected.dates.from).toLocaleDateString()
                      : '—'}
                  </p>
                  <p>
                    <b>To:</b>{' '}
                    {selected.dates?.to
                      ? new Date(selected.dates.to).toLocaleDateString()
                      : '—'}
                  </p>
                  <p>
                    <b>Justification:</b> {selected.justification || 'N/A'}
                  </p>

                  {selected.attachmentId && (
                    <p>
                      <b>Attachment:</b>{' '}
                      {selected.attachmentId.fileName || 'Uploaded file'}
                    </p>
                  )}

                  {selected.approvalFlow?.length > 0 && (
                    <div className="mt-4">
                      <p className="font-semibold mb-2">Approval Flow:</p>
                      <ul className="space-y-1 text-sm">
                        {selected.approvalFlow.map((step: any, idx: number) => (
                          <li
                            key={idx}
                            className={`p-2 rounded-md border ${
                              step.status === 'approved'
                                ? 'bg-green-50 border-green-300'
                                : step.status === 'rejected'
                                ? 'bg-red-50 border-red-300'
                                : 'bg-yellow-50 border-yellow-300'
                            }`}
                          >
                            <b>{step.role}</b> — {step.status}
                            {step.decidedAt && (
                              <span className="text-gray-500 ml-2">
                                ({new Date(step.decidedAt).toLocaleString()})
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {selected?.status === 'pending' && (
              <>
                <Button
                  onClick={() => handleDecision(selected._id, 'approved')}
                  disabled={loading}
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDecision(selected._id, 'rejected')}
                  disabled={loading}
                >
                  Reject
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
