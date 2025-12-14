"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/axiosInstance";

interface AuditLogEntry {
  _id: string;
  action: string;
  entityType: string;
  entityId: string;
  entityName?: string; // User-friendly name instead of ID
  performedBy: {
    _id: string;
    firstName: string;
    lastName: string;
    employeeNumber: string;
  };
  summary: string;
  beforeSnapshot?: any;
  afterSnapshot?: any;
  createdAt: string;
  updatedAt: string;
}

export default function AuditTrailPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    entityType: "",
    action: "",
    dateFrom: "",
    dateTo: "",
    search: "",
  });
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      // This would call actual API endpoints once implemented
      // For now, using mock data
      setAuditLogs([
        {
          _id: "1",
          action: "UPDATED",
          entityType: "Employee Profile",
          entityId: "673d20d3a4df7cbd97e21d32",
          entityName: "John Doe (EMP001)",
          performedBy: {
            _id: "user1",
            firstName: "John",
            lastName: "Doe",
            employeeNumber: "EMP001",
          },
          summary: "Updated employee personal information",
          beforeSnapshot: {
            mobilePhone: "+1234567890",
            address: { city: "New York" },
          },
          afterSnapshot: {
            mobilePhone: "+0987654321",
            address: { city: "Los Angeles" },
          },
          createdAt: "2025-12-14T10:30:00Z",
          updatedAt: "2025-12-14T10:30:00Z",
        },
        {
          _id: "2",
          action: "CREATED",
          entityType: "Department",
          entityId: "dept123",
          entityName: "Engineering Department",
          performedBy: {
            _id: "user2",
            firstName: "Jane",
            lastName: "Smith",
            employeeNumber: "EMP002",
          },
          summary: "Created new department: Engineering",
          afterSnapshot: {
            name: "Engineering",
            code: "ENG",
            status: "ACTIVE",
          },
          createdAt: "2025-12-13T15:20:00Z",
          updatedAt: "2025-12-13T15:20:00Z",
        },
        {
          _id: "3",
          action: "APPROVED",
          entityType: "Change Request",
          entityId: "cr456",
          entityName: "Profile Change Request #456",
          performedBy: {
            _id: "user3",
            firstName: "Admin",
            lastName: "User",
            employeeNumber: "EMP003",
          },
          summary: "Approved profile change request for employee updates",
          beforeSnapshot: { status: "PENDING" },
          afterSnapshot: { status: "APPROVED" },
          createdAt: "2025-12-12T09:15:00Z",
          updatedAt: "2025-12-12T09:15:00Z",
        },
      ]);
    } catch (error: any) {
      console.error("Error fetching audit logs:", error);
      alert("Failed to fetch audit logs");
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesEntityType = !filters.entityType || log.entityType === filters.entityType;
    const matchesAction = !filters.action || log.action === filters.action;
    const matchesSearch = !filters.search ||
      log.summary.toLowerCase().includes(filters.search.toLowerCase()) ||
      log.performedBy.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
      log.performedBy.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
      log.performedBy.employeeNumber.toLowerCase().includes(filters.search.toLowerCase());

    let matchesDate = true;
    if (filters.dateFrom) {
      matchesDate = matchesDate && new Date(log.createdAt) >= new Date(filters.dateFrom);
    }
    if (filters.dateTo) {
      matchesDate = matchesDate && new Date(log.createdAt) <= new Date(filters.dateTo);
    }

    return matchesEntityType && matchesAction && matchesSearch && matchesDate;
  });

  const viewDetails = (log: AuditLogEntry) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case "CREATED":
        return "bg-green-500/20 text-green-400";
      case "UPDATED":
        return "bg-blue-500/20 text-blue-400";
      case "DELETED":
      case "DEACTIVATED":
        return "bg-red-500/20 text-red-400";
      case "APPROVED":
        return "bg-green-500/20 text-green-400";
      case "REJECTED":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-neutral-700 text-neutral-300";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Audit Trail</h1>
          <p className="text-neutral-400">
            Complete audit log of all system changes (BR 22)
          </p>
        </div>

        {/* Filters */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Entity Type</label>
              <select
                value={filters.entityType}
                onChange={(e) => setFilters({ ...filters, entityType: e.target.value })}
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              >
                <option value="">All Types</option>
                <option value="employee_profile">Employee Profile</option>
                <option value="department">Department</option>
                <option value="position">Position</option>
                <option value="payroll_config">Payroll Config</option>
                <option value="change_request">Change Request</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Action</label>
              <select
                value={filters.action}
                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              >
                <option value="">All Actions</option>
                <option value="CREATED">Created</option>
                <option value="UPDATED">Updated</option>
                <option value="DELETED">Deleted</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">From Date</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">To Date</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                placeholder="Search logs..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setFilters({ entityType: "", action: "", dateFrom: "", dateTo: "", search: "" })}
              className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700"
            >
              Clear Filters
            </button>
            <button
              onClick={fetchAuditLogs}
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-200"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4 text-sm text-neutral-400">
          Showing {filteredLogs.length} of {auditLogs.length} entries
        </div>

        {/* Audit Logs Table */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-neutral-400">Loading audit logs...</p>
          </div>
        ) : (
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Timestamp</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Action</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">What Changed</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Performed By</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Summary</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {filteredLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-neutral-800/50">
                      <td className="px-4 py-3 text-sm text-neutral-300">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionBadgeColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <div className="font-medium">{log.entityName || log.entityType}</div>
                          <div className="text-xs text-neutral-500">{log.entityType}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <div className="font-medium">{log.performedBy.firstName} {log.performedBy.lastName}</div>
                          <div className="text-xs text-neutral-500">{log.performedBy.employeeNumber}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-300">
                        {log.summary}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => viewDetails(log)}
                          className="px-3 py-1 bg-white text-black rounded text-xs hover:bg-neutral-200"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredLogs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-neutral-400">No audit logs found matching your filters</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedLog && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Audit Log Details</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-neutral-400">Action</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getActionBadgeColor(selectedLog.action)}`}>
                        {selectedLog.action}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400">What Changed</p>
                      <p className="font-medium mt-1">{selectedLog.entityName || selectedLog.entityType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400">Type</p>
                      <p className="font-medium mt-1">{selectedLog.entityType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400">Timestamp</p>
                      <p className="font-medium mt-1">{formatDate(selectedLog.createdAt)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-neutral-400">Performed By</p>
                    <p className="font-medium mt-1">
                      {selectedLog.performedBy.firstName} {selectedLog.performedBy.lastName} ({selectedLog.performedBy.employeeNumber})
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-neutral-400">Summary</p>
                    <p className="mt-1">{selectedLog.summary}</p>
                  </div>

                  {/* User-Friendly Change Display */}
                  {(selectedLog.beforeSnapshot || selectedLog.afterSnapshot) && (
                    <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4">
                      <h3 className="font-semibold mb-3">Changes Made</h3>
                      <div className="space-y-2">
                        {Object.keys(selectedLog.afterSnapshot || {}).map((key) => {
                          const before = selectedLog.beforeSnapshot?.[key];
                          const after = selectedLog.afterSnapshot?.[key];

                          // Skip if values are the same
                          if (JSON.stringify(before) === JSON.stringify(after)) return null;

                          return (
                            <div key={key} className="bg-black/30 rounded p-3">
                              <p className="text-sm font-medium text-neutral-300 mb-1">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </p>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-xs text-neutral-500 mb-1">Before</p>
                                  <p className="text-red-400">
                                    {typeof before === 'object' && before !== null
                                      ? Object.entries(before).map(([k, v]) => `${k}: ${v}`).join(', ')
                                      : before || '(empty)'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-neutral-500 mb-1">After</p>
                                  <p className="text-green-400">
                                    {typeof after === 'object' && after !== null
                                      ? Object.entries(after).map(([k, v]) => `${k}: ${v}`).join(', ')
                                      : after || '(empty)'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="w-full px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-neutral-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
