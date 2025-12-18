"use client";

import { useEffect, useMemo, useState } from "react";
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
import { CheckCircle, XCircle, RefreshCcw } from "lucide-react";

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

  // auto-escalation / delegation info
  isEscalated?: boolean;
  delegateTo?: { fullName: string } | null;
}

export default function ManagerRequestsPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // per-row loading (existing)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // ✅ NEW: bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get<LeaveRequest[]>("/leaves/requests");

      // manager page shows only pending
      const pending = res.data.filter(
        (r) => (r.status || "").toLowerCase() === "pending"
      );

      setRequests(pending);

      // ✅ keep selection only for still-visible rows
      setSelectedIds((prev) => {
        const next = new Set<string>();
        const ids = new Set(pending.map((p) => p._id));
        prev.forEach((id) => {
          if (ids.has(id)) next.add(id);
        });
        return next;
      });
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
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err: any) {
      console.error("Error submitting manager decision", err);
      const msg = err?.response?.data?.message || "Failed to submit decision";
      toast.error(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  // ✅ NEW: selection helpers
  const selectableIds = useMemo(() => {
    // allow bulk select only for non-escalated
    return requests
      .filter((r) => !r.isEscalated)
      .map((r) => r._id);
  }, [requests]);

  const allSelectableSelected =
    selectableIds.length > 0 && selectableIds.every((id) => selectedIds.has(id));

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelectableSelected) {
        selectableIds.forEach((id) => next.delete(id));
      } else {
        selectableIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleBulkDecision = async (decision: "approved" | "rejected") => {
    const ids = requests
      .filter((r) => selectedIds.has(r._id) && !r.isEscalated)
      .map((r) => r._id);

    if (ids.length === 0) {
      toast.error("Select at least 1 request (non-escalated)");
      return;
    }

    setBulkLoading(true);
    try {
      const results = await Promise.allSettled(
        ids.map((id) =>
          axiosInstance.patch(`/leaves/requests/${id}/manager-decision`, { decision })
        )
      );

      const ok = results.filter((r) => r.status === "fulfilled").length;
      const fail = results.length - ok;

      toast.success(`Bulk ${decision}: ${ok} succeeded${fail ? `, ${fail} failed` : ""}`);

      clearSelection();
      await loadRequests();
    } catch (err: any) {
      console.error("Bulk decision failed", err);
      toast.error(err?.response?.data?.message || "Bulk action failed");
    } finally {
      setBulkLoading(false);
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
        <CardHeader className="flex flex-row items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <CardTitle>Pending Leave Requests</CardTitle>
            <Badge variant="secondary">{requests.length} pending</Badge>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {selectedIds.size > 0 && (
              <>
                <Button
                  onClick={() => handleBulkDecision("approved")}
                  disabled={bulkLoading || !!actionLoadingId}
                >
                  Approve Selected ({selectedIds.size})
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleBulkDecision("rejected")}
                  disabled={bulkLoading || !!actionLoadingId}
                >
                  Reject Selected ({selectedIds.size})
                </Button>
                <Button
                  variant="outline"
                  onClick={clearSelection}
                  disabled={bulkLoading || !!actionLoadingId}
                >
                  Clear
                </Button>
              </>
            )}

            <Button variant="outline" onClick={loadRequests} disabled={loading || bulkLoading}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
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
                  {/* ✅ NEW: select all (non-escalated only) */}
                  <TableHead className="w-[50px]">
                    <input
                      type="checkbox"
                      checked={allSelectableSelected}
                      onChange={toggleSelectAll}
                      title="Select all non-escalated requests"
                    />
                  </TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Justification</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {requests.map((req) => {
                  const disabledRow = !!req.isEscalated; // cannot approve/reject escalated

                  return (
                    <TableRow key={req._id}>
                      {/* ✅ NEW: per-row checkbox (disabled if escalated) */}
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(req._id)}
                          onChange={() => toggleOne(req._id)}
                          disabled={disabledRow}
                          title={disabledRow ? "Escalated requests can't be bulk processed" : ""}
                        />
                      </TableCell>

                      <TableCell>
                        <div className="font-medium">{req.employeeId.fullName}</div>
                        {req.employeeId.workEmail && (
                          <div className="text-xs text-gray-500">
                            {req.employeeId.workEmail}
                          </div>
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
                        {(req.isEscalated && (
                          <Badge variant="destructive">Escalated</Badge>
                        )) ||
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
                            disabled={
                              actionLoadingId === req._id || disabledRow || bulkLoading
                            }
                            onClick={() => handleDecision(req._id, "rejected")}
                          >
                            <XCircle className="mr-1 h-4 w-4" />
                            Reject
                          </Button>

                          <Button
                            size="sm"
                            disabled={
                              actionLoadingId === req._id || disabledRow || bulkLoading
                            }
                            onClick={() => handleDecision(req._id, "approved")}
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
