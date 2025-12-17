"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Link from "next/link";
import { useAuth } from "@/app/(system)/context/authContext";

/* ===================== TYPES ===================== */

interface Punch { type: string; time: string; }

interface AttendanceRecord {
  _id: string;
  punches: Punch[];
  totalWorkMinutes: number;
  hasMissedPunch: boolean;
  finalisedForPayroll: boolean;
}

interface TimeException {
  _id: string;
  type: string;
  reason: string;
  status: string;
  assignedTo: { firstName: string; lastName: string; workEmail?: string; email?: string };
  attendanceRecordId: string;
  employeeId?: { _id: string; firstName: string; lastName: string };
}

interface TimeExceptionForm {
  type: string;
  attendanceRecordId: string;
  assignedTo: string;
  reason: string;
}

/* ===================== PAGE ===================== */

export default function TimeExceptionsPage() {
  const { user } = useAuth();
  const [attendanceRecord, setAttendanceRecord] = useState<AttendanceRecord | null>(null);
  const [exceptions, setExceptions] = useState<TimeException[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<TimeExceptionForm>({
    type: "", attendanceRecordId: "", assignedTo: "", reason: "",
  });

  /* ===================== ROLES ===================== */
  const isAdmin = useMemo(() =>
    !!user?.roles?.some(role =>
      ["department head", "hr manager", "system admin"].includes(role.toLowerCase())
    ), [user?.roles]);

  const isSystemAdmin = useMemo(() =>
    !!user?.roles?.includes("System Admin"), [user?.roles]);

  const isHRManager = useMemo(() =>
    !!user?.roles?.includes("HR Manager"), [user?.roles]);  

    const isManagerOrAdmin = user?.roles?.some(role =>
    ['hr admin', 'system admin',].includes(role.toLowerCase())
  );
  /* ===================== FETCH DATA ===================== */

  const fetchAttendanceRecord = async () => {
    const res = await axios.get(
      `http://localhost:4000/time-management/attendance-record/${user?.userid}`,
      { withCredentials: true }
    );
    setAttendanceRecord(res.data.data);
    setForm(prev => ({ ...prev, attendanceRecordId: res.data.data._id }));
  };

  const fetchExceptions = async () => {
    try {
      let res;
      if (isAdmin) {
        res = await axios.get("http://localhost:4000/time-management/time-exception/", { withCredentials: true });
        setExceptions(res.data);
      } else {
        res = await axios.get(
          `http://localhost:4000/time-management/time-exception/my-exceptions/${user?.userid}`,
          { withCredentials: true }
        );
        setExceptions(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user?.userid) return;
    Promise.all([fetchAttendanceRecord(), fetchExceptions()])
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user?.userid, isAdmin]);

  /* ===================== SUBMIT ===================== */

  const submitTimeException = async () => {
    try {
      const payload = {
        employeeId: user?.userid,
        type: form.type,
        attendanceRecordId: form.attendanceRecordId,
        assignedTo: form.assignedTo,
        reason: form.reason,
      };
      await axios.post(
        "http://localhost:4000/time-management/time-exception",
        payload,
        { withCredentials: true }
      );
      await fetchExceptions();
      setShowModal(false);
      setForm(prev => ({ ...prev, type: "", reason: "" }));
    } catch (err) {
      console.error(err);
      alert("Failed to submit exception");
    }
  };

  /* ===================== ADMIN ACTIONS ===================== */

  const approveException = async (id: string) => {
    try {
      await axios.patch(
        `http://localhost:4000/time-management/time-exception/${id}/approve`,
        {},
        { withCredentials: true }
      );
      await fetchExceptions();
    } catch (err) { console.error(err); }
  };

  const rejectException = async (id: string, reason: string) => {
    try {
      await axios.patch(
        `http://localhost:4000/time-management/time-exception/${id}/reject`,
        { reason },
        { withCredentials: true }
      );
      await fetchExceptions();
    } catch (err) { console.error(err); }
  };

    const openException = async (id: string) => {
    try {
      await axios.patch(
        `http://localhost:4000/time-management/time-exception/${id}/open`,
        {},
        { withCredentials: true }
      );
      await fetchExceptions();
    } catch (err) { console.error(err); }
  };

  const autoEscalate = async () => {
    try {
      await axios.post(
        `http://localhost:4000/time-management/time-exception/auto-escalate`,
        {},
        { withCredentials: true }
      );
      await fetchExceptions();
      alert("Auto-escalation completed");
    } catch (err) {
      console.error(err);
      alert("Failed to auto-escalate");
    }
  };

  /* ===================== RENDER ===================== */

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading exceptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Link href="/time-management" className="text-blue-600 hover:underline dark:text-blue-400">
          &larr; Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-5">Time Exceptions</h1>

        {exceptions.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No time exceptions submitted yet.
            </p>
          </div>
        )}
              {isManagerOrAdmin&& (
                <button
                  onClick={autoEscalate}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                  Auto-Escalate Pending
                </button>
              )}
        {exceptions.map((ex) => (
          <div
            key={ex._id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-2">
              
              <div>
                <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                  Employee Name: {ex.employeeId ? `${ex.employeeId.firstName} ${ex.employeeId.lastName}` : "—"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Type: {ex.type} • Status: {ex.status}
                </p>
              </div>

            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-4">Reason: {ex.reason}</p>

            {isAdmin && ex.status !== "APPROVED" && ex.status!=="REJECTED" && (
              <div className="flex space-x-2">
                <button
                  onClick={() => approveException(ex._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    const reason = prompt("Enter rejection reason:") || "No reason";
                    rejectException(ex._id, reason);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Reject
                </button>
                                <button
                  onClick={() => {
                    openException(ex._id);
                  }}
                  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-orange-300 transition"
                >
                  Open
                </button>
              </div>
            )}
          </div>
        ))}

        {!isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Submit Time Exception
          </button>
        )}

        {/* ===================== MODAL ===================== */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-xl p-6 relative">
              <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-xl">×</button>

              <h3 className="text-lg font-semibold mb-4">Submit Time Exception</h3>

              <div className="space-y-4">
                <select
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="">Select type</option>
                  <option value="LATE">Late Arrival</option>
                  <option value="EARLY_LEAVE">Early Leave</option>
                  <option value="MISSED_PUNCH">Missed Punch</option>
                  <option value="OTHER">Other</option>
                </select>

                <input
                  className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                  value={form.attendanceRecordId}
                  disabled
                />

                <input
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  placeholder="Assigned To (Manager / HR ID)"
                  value={form.assignedTo}
                  onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                />

                <textarea
                  rows={3}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  placeholder="Reason"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                />
              </div>

              <button
                onClick={submitTimeException}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
