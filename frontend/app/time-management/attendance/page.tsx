"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/app/(system)/context/authContext";
import Link from "next/link";

export interface Punch {
  time: Date;
  type: "IN" | "OUT";
}

export interface AttendanceRecord {
  _id: string;
  employeeId: {
    _id: string;
    firstName: string;
    lastName: string;
    workEmail: string;
  };
  punches: Punch[];
  totalWorkMinutes: number;
  hasMissedPunch: boolean;
  exceptionIds?: string[];
  finalisedForPayroll?: boolean;
}

export default function AttendancePage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRecords, setExpandedRecords] = useState<Set<string>>(new Set());
  const [searchEmployeeId, setSearchEmployeeId] = useState("");
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const isAdmin =
    user?.roles?.some((role: string) =>
      [
        "department head", 
        "hr manager", 
        "hr admin",
        "system admin", 
        "payroll manager", 
        "payroll specialist"
      ].includes(role.toLowerCase())
    ) || false;

  const isDepartmentHead =
    user?.roles?.some((role: string) =>
      role.toLowerCase() === "department head"
    ) || false;

  const toggleExpand = (recordId: string) => {
    setExpandedRecords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(recordId)) newSet.delete(recordId);
      else newSet.add(recordId);
      return newSet;
    });
  };

  const fetchRecords = async () => {
    if (!user?.userid) return;
    setLoading(true);

    try {
      let url = "";
      if (isAdmin) {
        // Admin: can view all or filter by employeeId
        const params = searchEmployeeId ? `?employeeId=${encodeURIComponent(searchEmployeeId)}` : "";
        url = `http://localhost:4000/time-management/attendance-record${params}`;
      } else {
        // Employee: only own record
        url = `http://localhost:4000/time-management/attendance-record/${user.userid}`;
      }

      const res = await axios.get(url, { withCredentials: true });

      // Normalize data to an array and ensure punch times are Date objects
      let data: AttendanceRecord[] = [];
      if (Array.isArray(res.data.data)) data = res.data.data;
      else if (res.data.data) data = [res.data.data];

      data = data.map((rec: any) => ({
        ...rec,
        punches: (rec.punches || [])
          .map((p: any) => ({ ...p, time: new Date(p.time) }))
          .sort((a: any, b: any) => new Date(a.time).getTime() - new Date(b.time).getTime()),
      }));

      setRecords(data);
    } catch (err) {
      console.error("Error fetching attendance records:", err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const formatDateTimeForCSV = (date: Date) =>
    date.toLocaleString("en-US", { 
      year: "numeric", 
      month: "2-digit", 
      day: "2-digit",
      hour: "2-digit", 
      minute: "2-digit",
      second: "2-digit",
      hour12: false 
    });

  const exportToCSV = () => {
    if (records.length === 0) {
      alert("No records to export");
      return;
    }

    // Prepare CSV data
    const csvRows: string[] = [];
    
    // Header row
    const headers = [
      "Employee ID",
      "Employee Name",
      "Employee Email",
      "Punch Type",
      "Punch Time",
      "Total Work Minutes",
      "Total Work Hours",
      "Has Missed Punch",
      "Finalized for Payroll"
    ];
    csvRows.push(headers.join(","));

    // Data rows - one row per punch
    records.forEach(record => {
      const employeeName = `${record.employeeId.firstName} ${record.employeeId.lastName}`;
      const totalHours = (record.totalWorkMinutes / 60).toFixed(2);

      if (record.punches.length === 0) {
        // If no punches, still show the record
        csvRows.push([
          record.employeeId._id,
          `"${employeeName}"`,
          record.employeeId.workEmail,
          "No Punches",
          "",
          record.totalWorkMinutes,
          totalHours,
          record.hasMissedPunch ? "Yes" : "No",
          record.finalisedForPayroll ? "Yes" : "No"
        ].join(","));
      } else {
        // Create a row for each punch
        record.punches.forEach(punch => {
          csvRows.push([
            record.employeeId._id,
            `"${employeeName}"`,
            record.employeeId.workEmail,
            punch.type,
            `"${formatDateTimeForCSV(punch.time)}"`,
            record.totalWorkMinutes,
            totalHours,
            record.hasMissedPunch ? "Yes" : "No",
            record.finalisedForPayroll ? "Yes" : "No"
          ].join(","));
        });
      }
    });

    // Create CSV content
    const csvContent = csvRows.join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance-records-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEdit = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedData: Partial<AttendanceRecord>) => {
    if (!editingRecord) return;

    try {
      await axios.patch(
        `http://localhost:4000/time-management/attendance-record/${editingRecord._id}`,
        updatedData,
        { withCredentials: true }
      );
      
      setShowEditModal(false);
      setEditingRecord(null);
      fetchRecords(); // Refresh the records
    } catch (err) {
      console.error("Error updating record:", err);
      alert("Failed to update record");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading attendance records...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Link href="/time-management" className="text-blue-600 hover:underline dark:text-blue-400">
          &larr; Back to Dashboard
        </Link>
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isAdmin ? "All Attendance Records" : "My Attendance Record"}
          </h1>
          
          <div className="flex space-x-2">
            <button
              onClick={exportToCSV}
              disabled={records.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span>📊</span>
              <span>Export to CSV</span>
            </button>
            
            <Link
              href="/time-management/attendance/correction-request"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              Correction Requests
            </Link>
          </div>
        </div>

        {isAdmin && (
          <div className="mb-4 flex space-x-2">
            <input
              type="text"
              placeholder="Filter by Employee ID"
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchEmployeeId}
              onChange={(e) => setSearchEmployeeId(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={fetchRecords}
            >
              Search
            </button>
          </div>
        )}

        {records.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No attendance records found.
            </p>
          </div>
        )}

        {records.map((record) => {
          const isExpanded = expandedRecords.has(record._id);
          return (
            <div
              key={record._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {record.employeeId.firstName} {record.employeeId.lastName}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    📧 {record.employeeId?.workEmail} • 🆔 {record.employeeId?._id}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleExpand(record._id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    {isExpanded ? "▲ Collapse" : "▼ Expand"}
                  </button>
                  {isDepartmentHead && (
                    <button
                      onClick={() => handleEdit(record)}
                      className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm"
                    >
                      ✏️ Edit
                    </button>
                  )}
                </div>
              </div>

              <div className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                ⏱️ Total Work: {Math.round(record.totalWorkMinutes)}m ({(record.totalWorkMinutes / 60).toFixed(2)}h) •
                ⚠️ Missed Punches: {record.hasMissedPunch ? "Yes" : "No"} •
                ✅ Finalized: {record.finalisedForPayroll ? "Yes" : "No"}
              </div>

              {isExpanded && (
                <div className="space-y-2">
                  {record.punches.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      No punches recorded
                    </p>
                  ) : (
                    record.punches.map((p, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          p.type === "IN"
                            ? "bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500"
                            : "bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-bold ${
                              p.type === "IN"
                                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                            }`}
                          >
                            {p.type === "IN" ? "⬇️ Clock In" : "⬆️ Clock Out"}
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white text-lg">
                            {formatTime(p.time)}
                          </span>
                        </div>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          {formatDate(p.time)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingRecord && (
        <EditRecordModal
          record={editingRecord}
          onClose={() => {
            setShowEditModal(false);
            setEditingRecord(null);
          }}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}

// Edit Record Modal Component
function EditRecordModal({
  record,
  onClose,
  onSave,
}: {
  record: AttendanceRecord;
  onClose: () => void;
  onSave: (data: Partial<AttendanceRecord>) => void;
}) {
  const [totalWorkMinutes, setTotalWorkMinutes] = useState(record.totalWorkMinutes);
  const [hasMissedPunch, setHasMissedPunch] = useState(record.hasMissedPunch);
  const [finalisedForPayroll, setFinalisedForPayroll] = useState(record.finalisedForPayroll || false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await onSave({
        totalWorkMinutes,
        hasMissedPunch,
        finalisedForPayroll,
      });
    } catch (err) {
      console.error("Error in modal:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            ✏️ Edit Attendance Record
          </h2>
        </div>

        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Employee:</strong> {record.employeeId.firstName} {record.employeeId.lastName}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Email:</strong> {record.employeeId.workEmail}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
              ⏱️ Total Work Minutes
            </label>
            <input
              type="number"
              min="0"
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={totalWorkMinutes}
              onChange={(e) => setTotalWorkMinutes(Number(e.target.value))}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {totalWorkMinutes > 0 
                ? `Equals ${Math.floor(totalWorkMinutes / 60)}h ${totalWorkMinutes % 60}m`
                : "Enter minutes worked"}
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <input
              type="checkbox"
              id="missedPunch"
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              checked={hasMissedPunch}
              onChange={(e) => setHasMissedPunch(e.target.checked)}
            />
            <label htmlFor="missedPunch" className="text-gray-700 dark:text-gray-300 font-medium">
              ⚠️ Has Missed Punch
            </label>
          </div>

          <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
            <input
              type="checkbox"
              id="finalized"
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              checked={finalisedForPayroll}
              onChange={(e) => setFinalisedForPayroll(e.target.checked)}
            />
            <label htmlFor="finalized" className="text-gray-700 dark:text-gray-300 font-medium">
              ✅ Finalized for Payroll
            </label>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> All changes are audit-tracked with timestamp. 
              Manual corrections should include proper justification in your system logs.
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md"
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                "💾 Save Changes"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 font-medium shadow-md"
            >
              ❌ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}