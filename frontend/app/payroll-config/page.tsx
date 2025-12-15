"use client";
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "@/app/utils/ApiClient";
import { useAuth } from "../(system)/context/authContext";

type PayrollConfig = {
  _id: string;
  policyName?: string;
  description?: string;
  status?: string;
  ruleDefinition?: {
    percentage?: number;
    fixedAmount?: number;
    thresholdAmount?: number;
  };
};

export default function PayrollConfigPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<PayrollConfig[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiBase, setApiBase] = useState<string | null>(null);

  const isPayrollManager = useMemo(
    () => user?.roles?.some((r) => r.toLowerCase() === "payroll manager"),
    [user?.roles]
  );

  const fetchList = async () => {
    try {
      const res = await axiosInstance.get<PayrollConfig[]>(
        "/payroll-configuration"
      );
      setItems(res.data);
      setStatusMsg(null);
    } catch (e: any) {
      const msg =
        e?.response?.status === 404
          ? "Backend endpoint not reachable. Please ensure the backend is running on http://localhost:4000 and you are logged in."
          : e?.response?.data?.message || "Failed to load payroll configs";
      setError(msg);
    }
  };

  useEffect(() => {
    setApiBase(process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000");
    fetchList();
  }, []);

  const handleEdit = (item: PayrollConfig) => {
    if (item.status !== "draft") return;
    setEditId(item._id);
    setDescription(item.description || "");
  };

  const saveEdit = async () => {
    if (!editId) return;
    setLoading(true);
    setError(null);
    setStatusMsg(null);
    try {
      await axiosInstance.put(`/payroll-configuration/${editId}`, {
        description,
      });
      setEditId(null);
      setDescription("");
      await fetchList();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id: string) => {
    try {
      await axiosInstance.put(`/payroll-configuration/${id}/approve`);
      await fetchList();
      setStatusMsg("Approved successfully");
    } catch (e: any) {
      setError(e?.response?.data?.message || "Approve failed");
    }
  };

  const reject = async (id: string) => {
    try {
      await axiosInstance.put(`/payroll-configuration/${id}/reject`);
      await fetchList();
      setStatusMsg("Rejected successfully");
    } catch (e: any) {
      setError(e?.response?.data?.message || "Reject failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/payroll-configuration/${id}`);
      await fetchList();
      setStatusMsg("Deleted successfully");
    } catch (e: any) {
      setError(e?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-gray-900">
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500">Payroll Configurations</p>
            <h1 className="text-2xl font-bold">Manage Payroll Config</h1>
          </div>
          <div className="text-sm text-gray-500 flex flex-col items-end">
            <span>Role: {user?.roles?.join(", ")}</span>
            {apiBase && <span className="text-xs text-gray-400">API: {apiBase}</span>}
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}
        {statusMsg && (
          <div className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            {statusMsg}
          </div>
        )}

        {isPayrollManager && editId && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Edit Draft</h2>
            <textarea
              className="w-full rounded border px-3 py-2"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="mt-3 flex gap-3">
              <button
                onClick={saveEdit}
                disabled={loading}
                className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setEditId(null);
                  setDescription("");
                }}
                className="rounded border px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Configurations</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="py-2 font-medium">
                      {item.policyName || "Config"}
                    </td>
                    <td>{item.description}</td>
                    <td>
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs capitalize">
                        {item.status}
                      </span>
                    </td>
                    <td className="space-x-2 py-2">
                      {isPayrollManager && item.status === "draft" && (
                        <>
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => approve(item._id)}
                            className="text-green-600 hover:underline"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => reject(item._id)}
                            className="text-orange-600 hover:underline"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {isPayrollManager && (
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

