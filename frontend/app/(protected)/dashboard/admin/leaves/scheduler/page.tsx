'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Eye, Check, X, RefreshCw, Filter, Calendar, Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import axiosInstance from '@/app/utils/ApiClient';

interface LeaveRequest {
  _id: string;
  employee: {
    _id: string;
    name: string;
  };
  leaveTypeId: {
    _id: string;
    name: string;
  };
  dates: {
    from: string;
    to: string;
  };
  durationDays: number;
  justification: string;
  status: 'pending' | 'auto-escalated' | 'manager-approved' | 'manager-rejected' | 'delegation-reviewed' | 'compliance-reviewed';
  attachmentId?: {
    fileName: string;
    url: string;
  };
  approvalFlow: Array<{
    role: string;
    status: string;
    decidedBy?: string;
    decidedAt?: string;
  }>;
  createdAt: string;
}

export default function SchedulerPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, statusFilter]);

  const fetchRequests = async () => {
    try {
      const response = await axiosInstance.get('/leaves/scheduler'); // backend route to get all pending/auto-escalation requests
      setRequests(response.data);
    } catch (error: any) {
      console.error('Error fetching requests:', error);
      toast.error(error.response?.data?.message || 'Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = [...requests];

    if (searchTerm) {
      filtered = filtered.filter(
        req =>
          req.leaveTypeId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.justification.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    setFilteredRequests(filtered);
  };

  const handleApprove = async (requestId: string) => {
    try {
      await axiosInstance.patch(`/leaves/scheduler/${requestId}/approve`);
      toast.success('Request approved successfully');
      fetchRequests();
    } catch (error: any) {
      console.error('Error approving request:', error);
      toast.error(error.response?.data?.message || 'Failed to approve request');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await axiosInstance.patch(`/leaves/scheduler/${requestId}/reject`);
      toast.success('Request rejected successfully');
      fetchRequests();
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      toast.error(error.response?.data?.message || 'Failed to reject request');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
      case 'auto-escalated':
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Auto-Escalated</Badge>;
      case 'manager-approved':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Manager Approved</Badge>;
      case 'manager-rejected':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Manager Rejected</Badge>;
      case 'delegation-reviewed':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Delegation Reviewed</Badge>;
      case 'compliance-reviewed':
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Compliance Reviewed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
          <p className="mt-2 text-gray-500">Loading leave requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Leave Scheduler</h1>
          <p className="text-gray-500">Manage auto-escalations, manager review, and compliance workflow</p>
        </div>
        <Button variant="outline" onClick={fetchRequests}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by employee, leave type or justification..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="auto-escalated">Auto-Escalated</SelectItem>
                <SelectItem value="manager-approved">Manager Approved</SelectItem>
                <SelectItem value="manager-rejected">Manager Rejected</SelectItem>
                <SelectItem value="delegation-reviewed">Delegation Reviewed</SelectItem>
                <SelectItem value="compliance-reviewed">Compliance Reviewed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      {filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No leave requests found for the selected filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRequests.map((req) => (
            <Card key={req._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{req.leaveTypeId.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    {req.employee.name} • {formatDate(req.dates.from)} - {formatDate(req.dates.to)} • {req.durationDays} day{req.durationDays !== 1 ? 's' : ''}
                  </CardDescription>
                </div>
                <div className="flex gap-2 items-center">
                  {getStatusBadge(req.status)}
                  <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(req)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  {(req.status === 'pending' || req.status === 'auto-escalated') && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleApprove(req._id)}>
                        <Check className="h-3 w-3 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleReject(req._id)}>
                        <X className="h-3 w-3 mr-1" /> Reject
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader className="flex justify-between items-start">
              <div>
                <CardTitle>Leave Request Details</CardTitle>
                <CardDescription>ID: {selectedRequest._id}</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(null)}>×</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Employee</p>
                  <p className="font-medium">{selectedRequest.employee.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div>{getStatusBadge(selectedRequest.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="font-medium">{formatDate(selectedRequest.dates.from)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">To</p>
                  <p className="font-medium">{formatDate(selectedRequest.dates.to)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{selectedRequest.durationDays} days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submitted</p>
                  <p className="font-medium">{formatDate(selectedRequest.createdAt)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Justification</p>
                <p className="p-3 bg-gray-50 rounded-md">{selectedRequest.justification}</p>
              </div>

              {selectedRequest.attachmentId && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Attachment</p>
                  <div className="flex items-center p-3 bg-gray-50 rounded-md">
                    {selectedRequest.attachmentId.fileName}
                    <Button variant="ghost" size="sm" className="ml-auto">Download</Button>
                  </div>
                </div>
              )}

              {selectedRequest.approvalFlow.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Approval History</p>
                  <div className="space-y-2">
                    {selectedRequest.approvalFlow.map((step, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-md border ${
                          step.status === 'approved' ? 'bg-green-50 border-green-200' :
                          step.status === 'rejected' ? 'bg-red-50 border-red-200' :
                          'bg-yellow-50 border-yellow-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{step.role}</p>
                            <p className="text-sm text-gray-600">{step.status}</p>
                          </div>
                          {step.decidedAt && (
                            <p className="text-sm text-gray-500">{new Date(step.decidedAt).toLocaleString()}</p>
                          )}
                        </div>
                        {step.decidedBy && <p className="text-sm text-gray-500 mt-1">Decided by: {step.decidedBy}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
