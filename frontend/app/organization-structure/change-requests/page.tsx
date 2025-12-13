"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/ApiClient";
import Link from "next/link";

export default function ChangeRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get(
        "/organization-structure/change-requests"
      );
      setRequests(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load change requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading change requests...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Change Requests</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {requests.length === 0 ? (
        <p>No change requests found.</p>
      ) : (
        <table border={1} cellPadding={10} style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Requested By</th>
              <th>Type</th>
              <th>Status</th>
              <th>Requested At</th>
              <th>View</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((req: any) => (
              <tr key={req._id}>
                <td>{req.requestedByEmployeeId?.fullName || "—"}</td>
                <td>{req.type}</td>
                <td>{req.status}</td>
                <td>{new Date(req.createdAt).toLocaleString()}</td>

                <td>
                  <Link href={`/organization-structure/change-requests/${req._id}`}>
                    <button>Open</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
