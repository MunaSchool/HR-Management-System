"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/ApiClient";
import { useAuth } from "@/app/(system)/context/authContext";
import { isManager } from "@/app/utils/roleCheck";

interface Position {
  _id: string;
  title: string;
  departmentId?: { _id: string; name: string };
  reportsToPositionId?: string;
  employeeName?: string;
  employeeNumber?: string;
}

interface Department {
  _id: string;
  name: string;
  headPositionId?: string;
}

export default function OrganizationHierarchyPage() {
  const { user } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<"full" | "my-team">("full");

  useEffect(() => {
    if (user) {
      fetchHierarchy();
    }
  }, [user]);

  const fetchHierarchy = async () => {
    try {
      // Check if user is a manager
      const isManagerUser = isManager(user);

      if (isManagerUser) {
        // Manager can choose to see full org or just their team
        // Fetch full organization
        const res = await axiosInstance.get("/organization-structure/hierarchy/organization");
        setDepartments(res.data.departments || []);
        setPositions(res.data.positions || []);

        // Fetch employees to populate the org chart
        try {
          const empRes = await axiosInstance.get("/employee-profile");
          setEmployees(empRes.data || []);
        } catch (empErr: any) {
          console.warn("Could not fetch all employees, org chart may show vacant positions:", empErr.message);
          // Continue without employees - positions will show as vacant
        }
      } else {
        // Regular employee: only see their own structure (BR 41)
        const res = await axiosInstance.get("/organization-structure/hierarchy/my-structure");

        // Create a simplified view showing only their reporting line
        if (res.data.employee) {
          setEmployees([res.data.employee]);

          if (res.data.position) {
            setPositions([res.data.position]);
          }

          if (res.data.department) {
            setDepartments([res.data.department]);
          }
        }
        setViewMode("my-team");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load organization hierarchy");
    } finally {
      setLoading(false);
    }
  };

  // New function to fetch only team members
  const fetchMyTeam = async () => {
    try {
      setLoading(true);
      const teamRes = await axiosInstance.get("/employee-profile/team");
      setEmployees(teamRes.data || []);
      console.log("Fetched team members:", teamRes.data?.length);
    } catch (err: any) {
      console.error("Error fetching team:", err);
      setError("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  const renderOrgChart = () => {
    if (viewMode === "my-team" && employees.length > 0) {
      return renderMyTeamChart();
    }
    return renderFullOrgChart();
  };

  const renderMyTeamChart = () => {
    return (
      <div className="flex flex-col items-center space-y-8">
        {employees.map((emp) => (
          <div key={emp._id} className="relative">
            {/* Employee Card */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 min-w-[300px] border-2 border-blue-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {emp.firstName?.[0]}{emp.lastName?.[0]}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {emp.firstName} {emp.lastName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {emp.primaryPositionId?.title || "No Position"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {emp.primaryDepartmentId?.name || "No Department"}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">
                  {emp.employeeNumber}
                </p>
              </div>
            </div>

            {/* Reports To Indicator */}
            {emp.supervisorPositionId && (
              <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                ↑ Reports to Manager
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderFullOrgChart = () => {
    if (departments.length === 0) {
      return (
        <p className="text-gray-700 dark:text-gray-300 text-center">
          No departments found.
        </p>
      );
    }

    return (
      <div className="space-y-12">
        {departments.map((dept) => {
          const deptPositions = positions.filter(
            (pos) => pos.departmentId?._id === dept._id
          );

          const headPosition = deptPositions.find(
            (pos) => pos._id === dept.headPositionId
          );

          const subordinatePositions = deptPositions.filter(
            (pos) => pos._id !== dept.headPositionId
          );

          // Find employees for each position
          const getEmployeeForPosition = (posId: string) => {
            return employees.find(emp => emp.primaryPositionId?._id === posId || emp.primaryPositionId === posId);
          };

          return (
            <div key={dept._id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8">
              {/* Department Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  📁 {dept.name}
                </h2>
              </div>

              {/* Department Head */}
              {headPosition && (
                <div className="flex flex-col items-center mb-8">
                  <div className="bg-blue-600 text-white shadow-xl rounded-lg p-6 min-w-[280px] relative">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white text-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-xl">
                        {getEmployeeForPosition(headPosition._id) ? (
                          `${getEmployeeForPosition(headPosition._id)?.firstName?.[0]}${getEmployeeForPosition(headPosition._id)?.lastName?.[0]}`
                        ) : (
                          "?"
                        )}
                      </div>
                      <h3 className="text-lg font-bold mb-1">{headPosition.title}</h3>
                      {getEmployeeForPosition(headPosition._id) && (
                        <>
                          <p className="text-sm opacity-90">
                            {getEmployeeForPosition(headPosition._id)?.firstName}{" "}
                            {getEmployeeForPosition(headPosition._id)?.lastName}
                          </p>
                          <p className="text-xs opacity-75 mt-1">
                            {getEmployeeForPosition(headPosition._id)?.employeeNumber}
                          </p>
                        </>
                      )}
                      <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                        HEAD
                      </div>
                    </div>
                  </div>

                  {/* Connection Line Down */}
                  {subordinatePositions.length > 0 && (
                    <div className="w-0.5 h-12 bg-gray-400 dark:bg-gray-600"></div>
                  )}
                </div>
              )}

              {/* Subordinate Positions */}
              {subordinatePositions.length > 0 && (
                <div className="relative">
                  {/* Horizontal Line */}
                  {subordinatePositions.length > 1 && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-400 dark:bg-gray-600"
                         style={{
                           left: `${100 / subordinatePositions.length / 2}%`,
                           right: `${100 / subordinatePositions.length / 2}%`
                         }}>
                    </div>
                  )}

                  {/* Position Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
                    {subordinatePositions.map((pos) => {
                      const emp = getEmployeeForPosition(pos._id);
                      return (
                        <div key={pos._id} className="flex flex-col items-center">
                          {/* Vertical Line */}
                          <div className="w-0.5 h-8 bg-gray-400 dark:bg-gray-600"></div>

                          {/* Position Card */}
                          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 min-w-[240px] border border-gray-200 dark:border-gray-700">
                            <div className="text-center">
                              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-2 flex items-center justify-center">
                                <span className="text-gray-700 dark:text-gray-300 font-semibold">
                                  {emp ? `${emp.firstName?.[0]}${emp.lastName?.[0]}` : "?"}
                                </span>
                              </div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                {pos.title}
                              </h4>
                              {emp ? (
                                <>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {emp.firstName} {emp.lastName}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                    {emp.employeeNumber}
                                  </p>
                                </>
                              ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-500 italic">
                                  Vacant
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
        <p className="text-gray-700 dark:text-gray-300">
          Loading organization hierarchy...
        </p>
      </div>
    );
  }

  const isManagerUser = isManager(user);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Organization Hierarchy Chart
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {isManagerUser
              ? "Graphical view of organizational structure and reporting lines (BR 24)"
              : "Your position in the organization (BR 41)"
            }
          </p>

          {/* View Mode Toggle for Managers */}
          {isManagerUser && (
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => {
                  setViewMode("full");
                  fetchHierarchy();
                }}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  viewMode === "full"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                }`}
              >
                Full Organization
              </button>
              <button
                onClick={() => {
                  setViewMode("my-team");
                  fetchMyTeam();
                }}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  viewMode === "my-team"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                }`}
              >
                My Team Only
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Privacy Note (BR 41) */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-6 rounded">
          <p className="text-sm text-blue-700 dark:text-blue-400">
            <strong>BR 41:</strong> {isManagerUser
              ? "As a manager, you can view the full organizational structure or focus on your direct reports."
              : "As an employee, you can only view your own position and reporting structure for privacy."
            }
          </p>
        </div>

        {/* Organization Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {renderOrgChart()}
        </div>
      </div>
    </div>
  );
}
