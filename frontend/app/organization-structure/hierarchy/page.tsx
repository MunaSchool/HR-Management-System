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

  useEffect(() => {
    if (user) {
      fetchHierarchy();
    }
  }, [user]);

  const fetchHierarchy = async () => {
    try {
      // Check if user is a manager or HR
      const isManagerUser = isManager(user);

      if (isManagerUser) {
        // Manager/HR: Fetch full organization structure with employees
        const res = await axiosInstance.get("/organization-structure/hierarchy/organization");
        setDepartments(res.data.departments || []);
        setPositions(res.data.positions || []);
        setEmployees(res.data.employees || []);

        console.log("📊 Hierarchy data loaded:");
        console.log("  Departments:", res.data.departments?.length || 0);
        console.log("  Positions:", res.data.positions?.length || 0);
        console.log("  Employees:", res.data.employees?.length || 0);

        if (res.data.employees?.length > 0) {
          console.log("👤 Sample employee:", res.data.employees[0]);
          console.log("   Employee number:", res.data.employees[0].employeeNumber);
          console.log("   Primary position:", res.data.employees[0].primaryPositionId);
        }

        if (res.data.positions?.length > 0) {
          console.log("📍 Sample position:", res.data.positions[0]);
          console.log("   Position ID:", res.data.positions[0]._id);
          console.log("   Position title:", res.data.positions[0].title);
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
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load organization hierarchy");
    } finally {
      setLoading(false);
    }
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

          // Find employees for each position using STRICT position matching
          // ONLY match if employee.primaryPositionId._id === position._id
          const getEmployeeForPosition = (posId: string) => {
            const employee = employees.find(emp => {
              // Handle both populated and unpopulated primaryPositionId
              const empPosId = emp.primaryPositionId?._id || emp.primaryPositionId;
              const matches = empPosId === posId;

              if (matches) {
                console.log(`✅ Matched employee ${emp.employeeNumber} to position ${posId}`);
              }

              return matches;
            });

            // Debug logging for vacant positions
            if (!employee && posId) {
              console.log(`⚠️ Position ${posId} is VACANT (no employee match)`);
              console.log(`   Available employees:`, employees.map(e => ({
                empNum: e.employeeNumber,
                posId: e.primaryPositionId?._id || e.primaryPositionId
              })));
            }

            return employee;
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
              ? "Graphical view of organizational structure and reporting lines"
              : "Your position in the organization"
            }
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Privacy Note */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-6 rounded">
          <p className="text-sm text-blue-700 dark:text-blue-400">
            {isManagerUser
              ? "As a manager/HR, you can view the full organizational structure showing all departments and positions."
              : "As an employee, you can only view your own position and reporting structure for privacy."
            }
          </p>
        </div>

        {/* Organization Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {renderFullOrgChart()}
        </div>
      </div>
    </div>
  );
}
