"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/ApiClient";
import { useRouter } from "next/navigation";

interface PayTypeData {
  _id: string;
  type: string;
  amount: number;
  status: "draft" | "approved" | "rejected";
  createdBy?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ConfigPayTypesPage() {
  const [payTypes, setPayTypes] = useState<PayTypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "approved" | "rejected">("all");
  const [selectedPayType, setSelectedPayType] = useState<PayTypeData | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<Partial<PayTypeData>>({});
  const router = useRouter();

  // Fetch all pay types
  useEffect(() => {
    fetchPayTypes();
  }, []);

  const fetchPayTypes = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/payroll-configuration/pay-types");
      setPayTypes(response.data);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch pay types");
    } finally {
      setLoading(false);
    }
  };

  // View pay type details
  const handleView = async (id: string) => {
    try {
      const response = await axiosInstance.get(`/payroll-configuration/pay-types/${id}`);
      setSelectedPayType(response.data);
      setShowViewModal(true);
    } catch (err: any) {
      setError("Failed to fetch pay type details");
    }
  };

  // Open edit modal
  const handleEditOpen = (payType: PayTypeData) => {
    setEditForm({ ...payType });
    setSelectedPayType(payType);
    setShowEditModal(true);
  };

  // Update pay type
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayType?._id) return;

    try {
      setLoading(true);
      await axiosInstance.put(
        `/payroll-configuration/pay-types/${selectedPayType._id}`,
        {
          type: editForm.type,
          amount: editForm.amount,
          status: editForm.status,
        }
      );
      setSuccess("Pay type updated successfully");
      setShowEditModal(false);
      fetchPayTypes();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update pay type");
    } finally {
      setLoading(false);
    }
  };

  // Delete pay type
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this pay type?")) {
      try {
        setLoading(true);
        await axiosInstance.delete(`/payroll-configuration/pay-types/${id}`);
        setSuccess("Pay type deleted successfully");
        fetchPayTypes();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to delete pay type");
      } finally {
        setLoading(false);
      }
    }
  };

  // Filter pay types
  const filteredPayTypes = statusFilter === "all" 
    ? payTypes 
    : payTypes.filter(p => p.status === statusFilter);

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading && payTypes.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Pay Types Configuration</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Manage salary components and pay types for your organization</p>
        </div>
        <button
          onClick={() => router.push("./config-paytypes/create")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          + Create Pay Type
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg border border-red-300 dark:border-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg border border-green-300 dark:border-green-700">
          {success}
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="w-full text-sm text-gray-900 dark:text-gray-100">
          <thead className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Pay Type</th>
              <th className="px-6 py-3 text-left font-semibold">Amount</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
              <th className="px-6 py-3 text-left font-semibold">Created</th>
              <th className="px-6 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredPayTypes.length > 0 ? (
              filteredPayTypes.map((payType) => (
                <tr key={payType._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="px-6 py-4 font-medium">{payType.type}</td>
                  <td className="px-6 py-4">${payType.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(payType.status)}`}>
                      {payType.status.charAt(0).toUpperCase() + payType.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {payType.createdAt ? new Date(payType.createdAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleView(payType._id)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition text-lg"
                        title="View"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleEditOpen(payType)}
                        className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition text-lg"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(payType._id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition text-lg"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No pay types found. <button onClick={() => router.push("./config-paytypes/create")} className="text-blue-600 hover:underline">Create one now</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {showViewModal && selectedPayType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">{selectedPayType.type}</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Amount</label>
                <p className="mt-1 text-lg font-medium text-gray-900 dark:text-gray-100">${selectedPayType.amount.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Status</label>
                <div className="mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(selectedPayType.status)}`}>
                    {selectedPayType.status.charAt(0).toUpperCase() + selectedPayType.status.slice(1)}
                  </span>
                </div>
              </div>
              {selectedPayType.approvedAt && (
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Approved At</label>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">{new Date(selectedPayType.approvedAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedPayType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">Edit Pay Type</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pay Type Name</label>
                <input
                  type="text"
                  value={editForm.type || ""}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                <input
                  type="number"
                  value={editForm.amount || ""}
                  onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })}
                  min="6000"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  value={editForm.status || ""}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}