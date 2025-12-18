"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/ApiClient";
import Link from "next/link";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
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
      fetchDepartments();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        Loading departments...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Departments
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage company departments
            </p>
          </div>

          <Link href="/organization-structure/departments/create">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              + New Department
            </button>
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Table Card */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-x-auto">
          {departments.length === 0 ? (
            <p className="p-6 text-gray-600 dark:text-gray-300">
              No departments found.
            </p>
          ) : (
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {departments.map((dept) => (
                  <tr
                    key={dept._id}
                    className="border-t dark:border-gray-700"
                  >
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      {dept.name}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {dept.code}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          dept.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {dept.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-3">
                      <Link
                        href={`/organization-structure/departments/${dept._id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() =>
                          toggleDepartmentStatus(dept._id, dept.isActive)
                        }
                        className="text-red-600 hover:underline"
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
      </div>
    </div>
  );
}
