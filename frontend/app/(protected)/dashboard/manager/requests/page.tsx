"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { toast } from "sonner";
import axiosInstance from "@/app/utils/ApiClient";
import { CheckCircle, XCircle } from "lucide-react";

interface LeaveRequest {
  _id: string;
  employeeId: {
    fullName: string;
    workEmail?: string;
  };
  leaveTypeId: {
    name: string;
  };
  dates: {
    from: string;
    to: string;
  };
  status: string; // 'pending' | 'approved' | 'rejected'
  justification?: string;
  createdAt?: string;

  // NEW: auto-escalation / delegation info
  isEscalated?: boolean;
  delegateTo?: { fullName: string } | null;
}

export default function ManagerRequestsPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get<LeaveRequest[]>("/leaves/requests");

      // Filter only pending requests for manager
      const pending = res.data.filter(
        (r) => (r.status || "").toLowerCase() === "pending"
      );

      setRequests(pending);
    } catch (err: any) {
      console.error("Error loading manager requests", err);
      const msg =
        err?.response?.data?.message || "Failed to load leave requests";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (id: string, decision: "approved" | "rejected") => {
    setActionLoadingId(id);
    try {
      await axiosInstance.patch(`/leaves/requests/${id}/manager-decision`, {
        decision,
      });

      toast.success(`Request ${decision}`);
      await loadRequests();
    } catch (err: any) {
      console.error("Error submitting manager decision", err);
      const msg =
        err?.response?.data?.message || "Failed to submit decision";
      toast.error(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-2 text-gray-500">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pending Leave Requests</CardTitle>
          <Badge variant="secondary">{requests.length} pending</Badge>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No pending requests at the moment.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Justification</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req._id}>
                    <TableCell>
                      <div className="font-medium">{req.employeeId.fullName}</div>
                      {req.employeeId.workEmail && (
                        <div className="text-xs text-gray-500">{req.employeeId.workEmail}</div>
                      )}
                    </TableCell>
                    <TableCell>{req.leaveTypeId.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(req.dates.from).toLocaleDateString()} –{" "}
                        {new Date(req.dates.to).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <span className="text-sm text-gray-600 line-clamp-2">
                        {req.justification || "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {(req.isEscalated && <Badge variant="destructive">Escalated</Badge>) ||
                        (req.delegateTo && (
                          <Badge variant="secondary">
                            Delegated to {req.delegateTo.fullName}
                          </Badge>
                        )) || <Badge variant="outline">{req.status}</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionLoadingId === req._id || req.isEscalated}
                          onClick={() => handleDecision(req._id, "rejected")}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          disabled={actionLoadingId === req._id || req.isEscalated}
                          onClick={() => handleDecision(req._id, "approved")}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                      </div>
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
