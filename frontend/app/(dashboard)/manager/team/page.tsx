"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/utils/ApiClient";

interface TeamMember {
  _id: string;
  employeeNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  workEmail: string;
  mobilePhone?: string;
  status: string;
  primaryPositionId?: {
    _id: string;
    title: string;
  };
  primaryDepartmentId?: {
    _id: string;
    name: string;
  };
  profilePictureUrl?: string;
}

export default function ManagerTeamPage() {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/employee-profile/team");
      setTeamMembers(response.data);
    } catch (error: any) {
      console.error("Error fetching team members:", error);
      const errorMessage = error?.response?.status === 403
        ? "Access Denied: You need DEPARTMENT_HEAD or DEPARTMENT_MANAGER role to view team members"
        : error?.response?.data?.message || "Failed to fetch team members";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const viewMemberProfile = (memberId: string) => {
    router.push(`/manager/team/${memberId}`);
  };

  // Get unique departments and positions for filtering
  const departments = Array.from(
    new Set(
      teamMembers
        .filter((m) => m.primaryDepartmentId?.name)
        .map((m) => m.primaryDepartmentId!.name)
    )
  );

  const positions = Array.from(
    new Set(
      teamMembers
        .filter((m) => m.primaryPositionId?.title)
        .map((m) => m.primaryPositionId!.title)
    )
  );

  // Filter team members
  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      !searchQuery ||
      member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.workEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      !selectedDepartment ||
      member.primaryDepartmentId?.name === selectedDepartment;

    const matchesPosition =
      !selectedPosition || member.primaryPositionId?.title === selectedPosition;

    return matchesSearch && matchesDepartment && matchesPosition;
  });

  // Team summary statistics
  const teamSummary = {
    totalMembers: teamMembers.length,
    byDepartment: teamMembers.reduce((acc, member) => {
      const dept = member.primaryDepartmentId?.name || "Unassigned";
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byPosition: teamMembers.reduce((acc, member) => {
      const pos = member.primaryPositionId?.title || "Unassigned";
      acc[pos] = (acc[pos] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Team</h1>
          <p className="text-neutral-400">
            View and manage your direct reports
          </p>
        </div>

        {/* Team Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <div className="text-sm text-neutral-400 mb-1">Total Team Members</div>
            <div className="text-3xl font-bold">{teamSummary.totalMembers}</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <div className="text-sm text-neutral-400 mb-2">By Department</div>
            <div className="space-y-1">
              {Object.entries(teamSummary.byDepartment)
                .slice(0, 3)
                .map(([dept, count]) => (
                  <div key={dept} className="text-sm">
                    <span className="text-neutral-300">{dept}:</span>{" "}
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
            </div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <div className="text-sm text-neutral-400 mb-2">By Position</div>
            <div className="space-y-1">
              {Object.entries(teamSummary.byPosition)
                .slice(0, 3)
                .map(([pos, count]) => (
                  <div key={pos} className="text-sm">
                    <span className="text-neutral-300">{pos}:</span>{" "}
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                placeholder="Name, email, or employee number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Position</label>
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              >
                <option value="">All Positions</option>
                {positions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {(searchQuery || selectedDepartment || selectedPosition) && (
            <div className="mt-4">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDepartment("");
                  setSelectedPosition("");
                }}
                className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-4 text-sm text-neutral-400">
          Showing {filteredMembers.length} of {teamMembers.length} team members
        </div>

        {/* Team Members Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-neutral-400">Loading team members...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-12 bg-neutral-900 border border-neutral-800 rounded-lg">
            <p className="text-neutral-400">
              {teamMembers.length === 0
                ? "No team members found. You may not have any direct reports assigned."
                : "No team members match your filter criteria."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div
                key={member._id}
                className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-neutral-600 transition-colors cursor-pointer"
                onClick={() => viewMemberProfile(member._id)}
              >
                {/* Profile Picture */}
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center text-2xl font-bold mr-4">
                    {member.firstName[0]}
                    {member.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {member.firstName} {member.lastName}
                    </h3>
                    <p className="text-sm text-neutral-500">
                      {member.employeeNumber}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.status === "ACTIVE"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-neutral-700 text-neutral-400"
                    }`}
                  >
                    {member.status}
                  </span>
                </div>

                {/* Details - Excluding sensitive info (BR 18b) */}
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-neutral-500">Position:</span>{" "}
                    <span className="font-medium">
                      {member.primaryPositionId?.title || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Department:</span>{" "}
                    <span className="font-medium">
                      {member.primaryDepartmentId?.name || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Work Email:</span>{" "}
                    <span className="font-medium text-blue-400">
                      {member.workEmail || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Mobile:</span>{" "}
                    <span className="font-medium">
                      {member.mobilePhone || "N/A"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    viewMemberProfile(member._id);
                  }}
                  className="w-full mt-4 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-neutral-200"
                >
                  View Full Profile
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Privacy Notice */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-sm text-blue-400">
            <strong>Privacy Note (BR 18b):</strong> Sensitive information such as national ID, date of birth, personal email, home phone, and address are hidden to protect employee privacy.
          </p>
        </div>
      </div>
    </div>
  );
}
