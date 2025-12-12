"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/ApiClient";
import Link from "next/link";

export default function PositionsPage() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all positions
  const fetchPositions = async () => {
    try {
      const res = await axiosInstance.get(
        "/organization-structure/positions"
      );
      setPositions(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load positions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading positions...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Positions</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* CREATE BUTTON */}
      <div style={{ margin: "20px 0" }}>
        <Link href="/organization-structure/positions/create">
          <button>Create New Position</button>
        </Link>
      </div>

      {/* LIST */}
      {positions.length === 0 ? (
        <p>No positions found.</p>
      ) : (
        <table border={1} cellPadding={10} style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Department</th>
              <th>Status</th>
              <th>Edit</th>
            </tr>
          </thead>

          <tbody>
            {positions.map((pos: any) => (
              <tr key={pos._id}>
                <td>{pos.title}</td>
                <td>{pos.departmentId?.name || "—"}</td>
                <td>{pos.isActive ? "Active" : "Inactive"}</td>

                <td>
                  <Link
                    href={`/organization-structure/positions/${pos._id}/edit`}
                  >
                    <button>Edit</button>
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
