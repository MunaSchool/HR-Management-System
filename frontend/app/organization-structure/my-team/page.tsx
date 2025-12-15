"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/ApiClient";

export default function MyTeamHierarchyPage() {
  const [manager, setManager] = useState<any>(null);
  const [teamPositions, setTeamPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyTeam = async () => {
    try {
      const res = await axiosInstance.get(
        "/organization-structure/hierarchy/my-team"
      );

      setManager(res.data.manager);
      setTeamPositions(res.data.teamPositions || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load team hierarchy");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTeam();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-gray-600 dark:text-gray-400">
        Loading my team...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            My Team Hierarchy
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View your team structure and reporting lines
          </p>
        </div>

        {/* Manager Card */}
        {manager && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Manager:</strong>{" "}
              {manager.firstName} {manager.lastName}
            </p>
            {manager.primaryPosition?.title && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Position: {manager.primaryPosition.title}
              </p>
            )}
          </div>
        )}

        {/* Team Members */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Team Members
          </h2>

          {error && (
            <p className="mb-3 text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          {teamPositions.length === 0 ? (
            <p className="italic text-gray-600 dark:text-gray-400">
              No team members reporting to you.
            </p>
          ) : (
            <ul className="space-y-3">
              {teamPositions.map((pos: any) => (
                <li
                  key={pos._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2"
                >
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {pos.title}
                    </p>

                    {pos.departmentId?.name && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {pos.departmentId.name}
                      </p>
                    )}
                  </div>

                  <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                    → reports to{" "}
                    {manager?.primaryPosition?.title || "Manager"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}
