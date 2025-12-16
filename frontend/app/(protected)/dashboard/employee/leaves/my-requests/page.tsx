'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Eye, Edit, Trash2, RefreshCw, Filter, Calendar, FileText, Clock } from 'lucide-react';
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
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
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

export default function MyRequestsPage() {
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
      const response = await axiosInstance.get('/leaves/my-requests');
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

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.leaveTypeId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.justification.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  };

  const handleCancelRequest = async (requestId: string) => {
    if (!confirm('Are you sure you want to cancel this leave request?')) return;

    try {
      await axiosInstance.patch(`/leaves/requests/${requestId}`, {
        status: 'cancelled'
      });
      toast.success('Leave request cancelled successfully');
      fetchRequests();
    } catch (error: any) {
      console.error('Error cancelling request:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel request');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCurrentStep = (request: LeaveRequest) => {
    const pendingStep = request.approvalFlow.find(step => step.status === 'pending');
    if (pendingStep) {
      return `Waiting for ${pendingStep.role} approval`;
    }
    return 'Process completed';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
          <p className="mt-2 text-gray-500">Loading your leave requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Leave Requests</h1>
          <p className="text-gray-500">Track and manage your leave applications</p>
        </div>
        <Button onClick={() => router.push('/dashboard/employee/leaves/new-request')}>
          + New Leave Request
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by leave type or justification..."
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
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={fetchRequests}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">No leave requests found</h3>
              <p className="text-gray-500 mb-4">
                {requests.length === 0 
                  ? "You haven't submitted any leave requests yet."
                  : "No requests match your filters."
                }
              </p>
              {requests.length === 0 && (
                <Button onClick={() => router.push('/dashboard/employee/leaves/new-request')}>
                  Submit Your First Request
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRequests.map((request) => (
            <Card key={request._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{request.leaveTypeId.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(request.dates.from)} - {formatDate(request.dates.to)}
                      <span className="mx-2">•</span>
                      {request.durationDays} day{request.durationDays !== 1 ? 's' : ''}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(request.status)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedRequest(request)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Justification</p>
                    <p className="text-sm line-clamp-2">{request.justification || 'No justification provided'}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      Submitted {formatDate(request.createdAt)}
                    </div>
                    <div className="flex gap-2">
                      {request.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/dashboard/employee/leaves/new-request?edit=${request._id}`)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelRequest(request._id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Approval Flow Preview */}
                  {request.approvalFlow.length > 0 && (
                    <div className="pt-3 border-t">
                      <p className="text-xs text-gray-500 mb-2">Approval Progress</p>
                      <div className="flex items-center">
                        {request.approvalFlow.map((step, index) => (
                          <div key={index} className="flex items-center">
                            <div className={`w-2 h-2 rounded-full ${
                              step.status === 'approved' ? 'bg-green-500' :
                              step.status === 'rejected' ? 'bg-red-500' :
                              'bg-yellow-500'
                            }`} />
                            <span className="text-xs ml-1 mr-2">{step.role}</span>
                            {index < request.approvalFlow.length - 1 && (
                              <div className="w-4 h-px bg-gray-300 mx-1" />
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{getCurrentStep(request)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Request Details Dialog */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Leave Request Details</CardTitle>
                  <CardDescription>ID: {selectedRequest._id}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Leave Type</p>
                  <p className="font-medium">{selectedRequest.leaveTypeId.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div>{getStatusBadge(selectedRequest.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">From Date</p>
                  <p className="font-medium">{formatDate(selectedRequest.dates.from)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">To Date</p>
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
                    <FileText className="h-5 w-5 mr-2 text-gray-400" />
                    <span>{selectedRequest.attachmentId.fileName}</span>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      Download
                    </Button>
                  </div>
                </div>
              )}

              {selectedRequest.approvalFlow.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Approval History</p>
                  <div className="space-y-2">
                    {selectedRequest.approvalFlow.map((step, index) => (
                      <div
                        key={index}
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
                            <p className="text-sm text-gray-500">
                              {new Date(step.decidedAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                        {step.decidedBy && (
                          <p className="text-sm text-gray-500 mt-1">
                            Decided by: {step.decidedBy}
                          </p>
                        )}
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