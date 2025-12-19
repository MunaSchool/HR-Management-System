  "use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useAuth } from "@/app/(system)/context/authContext";

/* ===================== ENUM TYPES (MATCH BACKEND) ===================== */

export type TimeExceptionType =
  | "MISSED_PUNCH"
  | "LATE"
  | "EARLY_LEAVE"
  | "SHORT_TIME"
  | "OVERTIME_REQUEST"
  | "MANUAL_ADJUSTMENT";

export type TimeExceptionStatus =
  | "OPEN"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ESCALATED"
  | "RESOLVED";

/* ===================== MODEL ===================== */

export interface TimeException {
  _id: string;
  employeeId: string;
  attendanceRecordId?: string;
  assignedTo?: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
  } | string;
  type: TimeExceptionType;
  reason: string;
  status: TimeExceptionStatus;
  createdAt: Date;
  updatedAt: Date;
}

/* ===================== PAGE ===================== */

export default function TimeExceptionPage() {
  const { user } = useAuth();

  const employeeId = user?.userid; // ✅ ONLY SOURCE OF TRUTH

  const [requests, setRequests] = useState<TimeException[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TimeException | null>(null);
  const [filterStatus, setFilterStatus] = useState<"ALL" | TimeExceptionStatus>("ALL");

  /* ===================== ROLES ===================== */

  const roles = (user?.roles || []).map((r: string) => r.toLowerCase().trim());

  const isEmployee =
    roles.includes("hr employee") || roles.includes("department employee");

  const canWrite =
    roles.includes("hr admin") || roles.includes("department head");

  const canRead =
    roles.includes("payroll manager") || roles.includes("payroll specialist");

  /* ===================== FETCH ===================== */

  const fetchRequests = async () => {
    if (!employeeId) return;

    setLoading(true);
    try {
      const url =
        canWrite || canRead
          ? "http://localhost:4000/time-management/time-exception"
          : `http://localhost:4000/time-management/time-exception/my-exceptions/${employeeId}`;

      const res = await axios.get(url, { withCredentials: true });
      const data = res.data?.data ?? res.data ?? [];

      setRequests(
        data.map((r: any) => ({
          ...r,
          createdAt: new Date(r.createdAt),
          updatedAt: new Date(r.updatedAt),
        }))
      );
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!employeeId) return;
    fetchRequests();
  }, [employeeId]);

  /* ===================== FILTER ===================== */

  const visibleRequests = (() => {
    if (isEmployee && !canRead && !canWrite) return requests;
    if (canRead && !canWrite)
      return requests.filter(
        r => r.status === "APPROVED" || r.status === "REJECTED"
      );
    if (canWrite) return requests;
    return [];
  })();

  const filteredRequests =
    filterStatus === "ALL"
      ? visibleRequests
      : visibleRequests.filter(r => r.status === filterStatus);

  /* ===================== ACTIONS ===================== */

  const handleApprove = async (id: string) => {
  await axios.patch(
    `http://localhost:4000/time-management/time-exception/${id}/approve`,
    {},
    { withCredentials: true }
  );
  fetchRequests();
};
  const handleOpen = async (id: string) => {
  await axios.patch(
    `http://localhost:4000/time-management/time-exception/${id}/open`,
    {},
    { withCredentials: true }
  );
  fetchRequests();
};



   const handleReject = async (id: string) => {
  const reason = prompt("Reject reason?");
  if (!reason) return;

  await axios.patch(
    `http://localhost:4000/time-management/time-exception/${id}/reject`,
    { reason },
    { withCredentials: true }
  );
  fetchRequests();
};
 const handleEscalate = async (id: string) => {
  await axios.patch(
    `http://localhost:4000/time-management/time-exception/${id}/escalate`,
    {},
    { withCredentials: true }
  );
  fetchRequests();
};

  /* ===================== UI ===================== */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
const exportToCSV = () => {
  if (visibleRequests.length === 0) {
    alert("No requests to export");
    return;
  }

  const csvRows: string[] = [];

  csvRows.push([
    "Request ID",
    "Employee ID",
    "Type",
    "Reason",
    "Status",
    "Created At",
    "Updated At",
  ].join(","));

  visibleRequests.forEach(req => {
    csvRows.push([
      req._id,
      req.employeeId,
      req.type,
      `"${req.reason.replace(/"/g, '""')}"`,
      req.status,
      `"${new Date(req.createdAt).toLocaleString()}"`,
      `"${new Date(req.updatedAt).toLocaleString()}"`,
    ].join(","));
  });

  const blob = new Blob([csvRows.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = `time-exceptions-${new Date()
    .toISOString()
    .split("T")[0]}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/time-management/attendance" className="text-blue-400">
          ← Back to Attendance Records
        </Link>
 <div className="flex justify-between items-center mt-4">
  <h1 className="text-3xl font-bold text-white">
    Time Exception Requests
  </h1>

  <div className="flex gap-2">
    {canRead && (
      <button
        onClick={exportToCSV}
        className="bg-green-600 px-4 py-2 text-white rounded"
      >
        📊 Export CSV
      </button>
    )}

    {isEmployee && (
      <button
        onClick={() => setShowCreateModal(true)}
        className="bg-blue-600 px-4 py-2 text-white rounded"
      >
        ➕ Submit Request
      </button>
    )}
  </div>
</div>

        <div className="mt-4">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as any)}
            className="p-2 rounded bg-gray-800 text-white"
          >
            <option value="ALL">All</option>
            <option value="OPEN">Open</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="ESCALATED">Escalated</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>

        <div className="space-y-4 mt-6">
          {filteredRequests.map(req => (
            <div key={req._id} className="bg-gray-800 p-5 rounded">
              <div className="flex justify-between">
                <span className="text-white font-semibold">
                  Request #{req._id.slice(-6)}
                </span>
                <span className="text-sm text-gray-300">{req.status}</span>
              </div>

              <p className="text-gray-300 mt-2">
                <strong>Type:</strong> {req.type}
              </p>

              <p className="text-gray-300">
                <strong>Reason:</strong> {req.reason}
              </p>

              {canWrite && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleApprove(req._id)}
                    className="bg-green-600 px-3 py-1 text-white rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(req._id)}
                    className="bg-red-600 px-3 py-1 text-white rounded"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleEscalate(req._id)}
                    className="bg-purple-600 px-3 py-1 text-white rounded"
                  >
                    Escalate
                  </button>
                    <button
                    onClick={() => handleOpen(req._id)}
                    className="bg-pink-600 px-3 py-1 text-white rounded"
                  >
                    Open
                  </button>
                </div>
              )}

   
            </div>
          ))}
        </div>
      </div>

      {(showCreateModal || selectedRequest) && (
        <TimeExceptionModal
          request={selectedRequest}
          employeeId={employeeId!}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedRequest(null);
          }}
          onSuccess={() => {
            fetchRequests();
            setShowCreateModal(false);
            setSelectedRequest(null);
          }}
        />
      )}
    </div>
  );
}

/* ===================== MODAL ===================== */

function TimeExceptionModal({
  request,
  employeeId,
  onClose,
  onSuccess,
}: {
  request: TimeException | null;
  employeeId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [type, setType] = useState<TimeExceptionType>(
    request?.type || "MISSED_PUNCH"
  );
  const [reason, setReason] = useState(request?.reason || "");
  const [submitting, setSubmitting] = useState(false);

     const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);

  try {
     if (request) {
  await axios.patch(
    `http://localhost:4000/time-management/time-exception/${request._id}`,
    {
      type,
      reason,
    },
    { withCredentials: true }
  );
}
else {
      // ✅ CREATE
      await axios.post(
        `http://localhost:4000/time-management/time-exception`,
        { employeeId, type, reason },
        { withCredentials: true }
      );
    }

    onSuccess();
  } catch (err: any) {
    console.error("Edit error:", err);
    alert(err.response?.data?.message || "Failed to submit request");
  } finally {
    setSubmitting(false);
  }
};



  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded w-full max-w-md"
      >
        <h2 className="text-white text-xl mb-4">
          {request ? "Edit Time Exception" : "Submit Time Exception"}
        </h2>

        <select
          value={type}
          onChange={e => setType(e.target.value as TimeExceptionType)}
          className="w-full p-2 mb-3 bg-gray-700 text-white"
        >
          <option value="MISSED_PUNCH">Missed Punch</option>
          <option value="LATE">Late</option>
          <option value="EARLY_LEAVE">Early Leave</option>
          <option value="SHORT_TIME">Short Time</option>
          <option value="OVERTIME_REQUEST">Overtime</option>
          <option value="MANUAL_ADJUSTMENT">Manual Adjustment</option>
        </select>

        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          required
          rows={4}
          className="w-full p-2 bg-gray-700 text-white mb-4"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-600 text-white py-2 rounded"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-600 text-white py-2 rounded"
          >
            Cancel
          </button>
          
        </div>
      </form>
    </div>
  );
}