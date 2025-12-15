"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/ApiClient";

export default function OrganizationHierarchyPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================
  // FETCH ORGANIZATION HIERARCHY
  // ============================
  const fetchHierarchy = async () => {
    try {
      const res = await axiosInstance.get(
        "/organization-structure/hierarchy/organization"
      );

      setDepartments(res.data.departments || []);
      setPositions(res.data.positions || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load organization hierarchy");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHierarchy();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <p className="text-gray-700 dark:text-gray-300">
          Loading organization hierarchy...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Organization Hierarchy
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View departments and their positions
          </p>
        </div>

        {error && (
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error}
          </p>
        )}

        {/* Departments */}
        {departments.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300">
            No departments found.
          </p>
        ) : (
          <div className="space-y-6">
            {departments.map((dept: any) => {
              const deptPositions = positions.filter(
                (pos: any) => pos.departmentId?._id === dept._id
              );

              return (
                <div
                  key={dept._id}
                  className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
                >
                  {/* Department */}
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    📁 {dept.name}
                  </h2>

                  {/* Positions */}
                  {deptPositions.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 italic ml-4">
                      No positions in this department
                    </p>
                  ) : (
                    <ul className="ml-6 space-y-1 list-disc text-gray-700 dark:text-gray-300">
                      {deptPositions.map((pos: any) => (
                        <li key={pos._id}>
                          {pos.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
