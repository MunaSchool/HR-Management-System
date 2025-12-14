"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/ApiClient";
import Link from "next/link";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDepartments = async () => {
    try {
      const res = await axiosInstance.get(
        "/organization-structure/departments?includeInactive=true"
      );

      setDepartments(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };
  // ⭐ NEW FUNCTION — deactivate or activate a department
  const toggleDepartmentStatus = async (id: string, isActive: boolean) => {
  const action = isActive ? "deactivate" : "activate";

  const confirmed = confirm(
    `Are you sure you want to ${action} this department?`
  );

  if (!confirmed) return;

  try {
      const endpoint = isActive
      ? `/organization-structure/departments/${id}/deactivate`
      : `/organization-structure/departments/${id}/activate`;

    await axiosInstance.patch(endpoint);

    fetchDepartments(); // Refresh list
  } catch (err: any) {
    console.error(err);
    alert(err.response?.data?.message || "Failed to update status");
  }
};


  useEffect(() => {
    fetchDepartments();
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading departments...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Departments</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* CREATE BUTTON */}
      <div style={{ margin: "20px 0" }}>
        <Link href="/organization-structure/departments/create">
          <button>Create New Department</button>
        </Link>
      </div>

      {/* LIST */}
      {departments.length === 0 ? (
        <p>No departments found.</p>
      ) : (
        <table border={1} cellPadding={10} style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Status</th>
              <th>Edit</th>
            </tr>
          </thead>

          <tbody>
            {departments.map((dept: any) => (
              <tr key={dept._id}>
                <td>{dept.name}</td>
                <td>{dept.code}</td>
                <td>{dept.isActive ? "Active" : "Inactive"}</td>

                <td>
                  <Link
                    href={`/organization-structure/departments/${dept._id}/edit`}
                  >
                    <button>Edit</button>
                  </Link>
                  {/* Deactivate button */}
      <button
  onClick={() => toggleDepartmentStatus(dept._id, dept.isActive)}
  style={{ marginLeft: 10, color: "red" }}
>
  {dept.isActive ? "Deactivate" : "Activate"}
</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
