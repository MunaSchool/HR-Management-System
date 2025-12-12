"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/ApiClient";
import { useRouter } from "next/navigation";

interface ChangeRequest {
  _id: string;
  fieldName: string;
  currentValue: string;
  requestedValue: string;
  reason: string;
  status: string;
  createdAt: string;
}

export default function ChangeRequestPage() {
  const router = useRouter();
  const [myRequests, setMyRequests] = useState<ChangeRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fieldName: "",
    requestedValue: "",
    reason: "",
  });

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const response = await axiosInstance.get("/employee-profile/me/change-requests");
      setMyRequests(response.data);
    } catch (error) {
      console.error("Error fetching change requests:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/employee-profile/me/change-requests", formData);
      alert("Change request submitted successfully");
      setShowForm(false);
      setFormData({ fieldName: "", requestedValue: "", reason: "" });
      fetchMyRequests();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to submit change request");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "text-green-400";
      case "rejected":
        return "text-red-400";
      case "pending":
        return "text-yellow-400";
      default:
        return "text-neutral-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Profile Change Requests</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-200 transition"
        >
          {showForm ? "Cancel" : "New Request"}
        </button>
      </div>

      {/* New Request Form */}
      {showForm && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Submit Change Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-neutral-400 block mb-1">
                Field to Change
              </label>
              <select
                value={formData.fieldName}
                onChange={(e) =>
                  setFormData({ ...formData, fieldName: e.target.value })
                }
                required
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              >
                <option value="">Select a field</option>
                <option value="firstName">First Name</option>
                <option value="middleName">Middle Name</option>
                <option value="lastName">Last Name</option>
                <option value="nationalId">National ID</option>
                <option value="maritalStatus">Marital Status</option>
                <option value="dateOfBirth">Date of Birth</option>
                <option value="gender">Gender</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-neutral-400 block mb-1">
                Requested Value
              </label>
              <input
                type="text"
                value={formData.requestedValue}
                onChange={(e) =>
                  setFormData({ ...formData, requestedValue: e.target.value })
                }
                required
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
                placeholder="Enter new value"
              />
            </div>

            <div>
              <label className="text-sm text-neutral-400 block mb-1">
                Reason for Change
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                required
                rows={4}
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
                placeholder="Explain why this change is needed"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-200 transition"
            >
              Submit Request
            </button>
          </form>
        </div>
      )}

      {/* My Requests List */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">My Requests</h2>
        {myRequests.length === 0 ? (
          <p className="text-neutral-400">No change requests found</p>
        ) : (
          <div className="space-y-4">
            {myRequests.map((request) => (
              <div
                key={request._id}
                className="border border-neutral-700 rounded-lg p-4 bg-black"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-semibold capitalize">
                    {request.fieldName.replace(/([A-Z])/g, " $1").trim()}
                  </h3>
                  <span
                    className={`text-sm font-medium ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.status.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="text-xs text-neutral-500">Current Value</label>
                    <p className="text-white text-sm">{request.currentValue || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">Requested Value</label>
                    <p className="text-white text-sm">{request.requestedValue}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-neutral-500">Reason</label>
                  <p className="text-white text-sm">{request.reason}</p>
                </div>
                <div className="mt-2">
                  <label className="text-xs text-neutral-500">Submitted</label>
                  <p className="text-neutral-400 text-xs">
                    {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => router.push("/profile")}
        className="text-neutral-400 hover:text-white"
      >
        ← Back to Profile
      </button>
    </div>
  );
}
