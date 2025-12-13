"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/ApiClient";
import { useParams, useRouter } from "next/navigation";

export default function ChangeRequestDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRequest = async () => {
    try {
      const res = await axiosInstance.get(
        `/organization-structure/change-requests/${id}`
      );
      setRequest(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load change request");
      router.push("/organization-structure/change-requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  const approve = async () => {
    try {
      await axiosInstance.put(
        `/organization-structure/change-requests/${id}/approve`
      );
      alert("Request approved");
      router.push("/organization-structure/change-requests");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to approve");
    }
  };

  const reject = async () => {
    const msg = prompt("Reason for rejection:");
    if (!msg) return;

    try {
      await axiosInstance.put(
        `/organization-structure/change-requests/${id}/reject`,
        { reason: msg }
      );
      alert("Request rejected");
      router.push("/organization-structure/change-requests");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to reject");
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  if (!request) return <p>Request not found.</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Change Request Details</h1>

      <p><strong>Requested By:</strong> {request.requestedByEmployeeId?.fullName}</p>
      <p><strong>Type:</strong> {request.type}</p>
      <p><strong>Status:</strong> {request.status}</p>
      <p><strong>Requested At:</strong> {new Date(request.createdAt).toLocaleString()}</p>

      <h3>Request Data</h3>
      <pre style={{ background: "#eee", padding: 20 }}>
        {JSON.stringify(request.data, null, 2)}
      </pre>

{request.status === "SUBMITTED" && (
  <div style={{ marginTop: 20 }}>
    <button onClick={approve} style={{ marginRight: 10 }}>
      Approve
    </button>

    <button onClick={reject} style={{ color: "red" }}>
      Reject
    </button>
  </div>
)}

    </div>
  );
}
