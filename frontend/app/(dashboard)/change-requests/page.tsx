"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/utils/ApiClient";
import { isHRAdmin } from "@/app/utils/roleCheck";

interface ChangeRequest {
  _id: string;
  requestId: string;
  employeeProfileId: {
    _id: string;
    employeeNumber: string;
    firstName: string;
    lastName: string;
  };
  requestDescription: string;
  reason?: string;
  requestedChanges?: Record<string, any>;
  status: string;
  submittedAt: string;
  processedAt?: string;
}

export default function ChangeRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<ChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ChangeRequest | null>(null);
  const [processingAction, setProcessingAction] = useState<"approve" | "reject" | null>(
    null
  );
  const [comments, setComments] = useState("");
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const response = await axiosInstance.get("/employee-profile/me");

      // Use flexible role checking
      if (!isHRAdmin(response.data)) {
        alert("Access Denied: You don't have permission to access this page");
        router.push("/profile");
        return;
      }

      setHasAccess(true);
      fetchPendingRequests();
    } catch (error) {
      console.error("Error checking access:", error);
      router.push("/profile");
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await axiosInstance.get(
        "/employee-profile/change-requests/pending"
      );
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching change requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessRequest = async (
    requestId: string,
    action: "approve" | "reject"
  ) => {
    try {
      await axiosInstance.patch(
        `/employee-profile/change-requests/${requestId}/process`,
        {
          approved: action === "approve",
          comments: comments || undefined,
        }
      );

      alert(`Request ${action}d successfully`);
      setSelectedRequest(null);
      setProcessingAction(null);
      setComments("");
      fetchPendingRequests();
    } catch (error: any) {
      alert(error?.response?.data?.message || `Failed to ${action} request`);
    }
  };

  if (loading || !hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">
          {loading ? "Loading..." : "Checking access..."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Pending Change Requests
        </h1>
        <p className="text-neutral-400">
          Review and process employee profile change requests
        </p>
      </div>

      {/* Stats */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
        <div className="flex items-center space-x-6">
          <div>
            <h3 className="text-sm text-neutral-400 mb-1">Pending Requests</h3>
            <p className="text-3xl font-bold text-yellow-400">{requests.length}</p>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Requests Queue</h2>
        {requests.length === 0 ? (
          <p className="text-neutral-400">No pending change requests</p>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request._id}
                className="border border-neutral-700 rounded-lg p-4 bg-black"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-semibold">
                      {request.employeeProfileId?.firstName || "N/A"} {request.employeeProfileId?.lastName || ""}
                    </h3>
                    <p className="text-neutral-400 text-sm">
                      {request.employeeProfileId?.employeeNumber || "N/A"}
                    </p>
                  </div>
                  <span className="text-xs text-neutral-500">
                    {new Date(request.submittedAt).toLocaleString()}
                  </span>
                </div>

                <div className="mb-4">
                  <label className="text-xs text-neutral-500 block mb-1">Description</label>
                  <p className="text-white text-sm">{request.requestDescription || "N/A"}</p>
                </div>

                <div className="mb-4">
                  <label className="text-xs text-neutral-500 block mb-1">Requested Changes</label>
                  <div className="bg-neutral-900 rounded p-3 space-y-2">
                    {request.requestedChanges && Object.keys(request.requestedChanges).length > 0 ? (
                      Object.entries(request.requestedChanges).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-neutral-400 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}:
                          </span>
                          <span className="text-white font-medium">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-neutral-400 text-sm">No changes specified</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-xs text-neutral-500 block mb-1">Reason</label>
                  <p className="text-white text-sm">{request.reason || "N/A"}</p>
                </div>

                {/* Audit Trail Timeline (BR 22) */}
                <div className="mb-4 border-t border-neutral-700 pt-4">
                  <label className="text-xs text-neutral-500 block mb-3 font-semibold">
                    📋 Audit Trail (BR 22 - Timestamped & Traced)
                  </label>
                  <div className="space-y-3">
                    {/* Request Submitted */}
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white text-sm font-medium">Request Submitted</p>
                            <p className="text-neutral-400 text-xs">
                              By: {request.employeeProfileId?.firstName} {request.employeeProfileId?.lastName}
                            </p>
                            <p className="text-neutral-400 text-xs">
                              Employee #: {request.employeeProfileId?.employeeNumber}
                            </p>
                          </div>
                          <span className="text-xs text-neutral-500">
                            {new Date(request.submittedAt).toLocaleString('en-US', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Request Status */}
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        request.status === 'PENDING' ? 'bg-yellow-500' :
                        request.status === 'APPROVED' ? 'bg-green-500' :
                        'bg-red-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white text-sm font-medium">
                              Current Status: <span className={`${
                                request.status === 'PENDING' ? 'text-yellow-400' :
                                request.status === 'APPROVED' ? 'text-green-400' :
                                'text-red-400'
                              }`}>{request.status}</span>
                            </p>
                            {request.processedAt && (
                              <p className="text-neutral-400 text-xs">
                                Processed at: {new Date(request.processedAt).toLocaleString('en-US', {
                                  dateStyle: 'medium',
                                  timeStyle: 'short'
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Request ID for tracking */}
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-neutral-400 text-xs">
                          Request ID: <span className="text-white font-mono">{request.requestId}</span>
                        </p>
                        <p className="text-neutral-400 text-xs">
                          Database ID: <span className="text-white font-mono text-xs">{request._id}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedRequest?._id === request._id && processingAction ? (
                  <div className="space-y-4 mt-4 p-4 bg-neutral-900 rounded">
                    <div>
                      <label className="text-sm text-neutral-400 block mb-1">
                        {processingAction === "approve" ? "Comments (Optional)" : "Rejection Comments"}
                      </label>
                      <textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        rows={3}
                        className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
                        placeholder={
                          processingAction === "approve"
                            ? "Add any comments..."
                            : "Explain why this request is being rejected..."
                        }
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() =>
                          handleProcessRequest(request._id, processingAction)
                        }
                        className={`px-4 py-2 rounded-lg font-medium ${
                          processingAction === "approve"
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        }`}
                      >
                        Confirm {processingAction === "approve" ? "Approval" : "Rejection"}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRequest(null);
                          setProcessingAction(null);
                          setComments("");
                        }}
                        className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setProcessingAction("approve");
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setProcessingAction("reject");
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
