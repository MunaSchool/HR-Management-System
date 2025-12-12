"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/app/utils/ApiClient";
import { isHRAdmin } from "@/app/utils/roleCheck";

interface EmployeeProfile {
  _id: string;
  employeeNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  nationalId?: string;
  hireDate?: string;
  status: string;
  payGrade?: string;
  departmentId?: string;
  positionId?: string;
}

export default function EditEmployeePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [employee, setEmployee] = useState<EmployeeProfile | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkAccess();
  }, [params.id]);

  const checkAccess = async () => {
    try {
      const response = await axiosInstance.get("/employee-profile/me");

      // Use flexible role checking
      if (!isHRAdmin(response.data)) {
        alert("Access Denied: You don't have permission to access this page");
        router.push("/profile");
        return;
      }

      setHasAccess(true);
      fetchEmployee();
    } catch (error) {
      console.error("Error checking access:", error);
      router.push("/profile");
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await axiosInstance.get(`/employee-profile/${params.id}`);
      setEmployee(response.data);
      setFormData({
        firstName: response.data.firstName || "",
        middleName: response.data.middleName || "",
        lastName: response.data.lastName || "",
        workEmail: response.data.workEmail || response.data.email || "",
        personalEmail: response.data.personalEmail || "",
        mobilePhone: response.data.mobilePhone || "",
        homePhone: response.data.homePhone || "",
        address: {
          streetAddress: response.data.address?.streetAddress || "",
          city: response.data.address?.city || "",
          country: response.data.address?.country || "",
        },
        dateOfBirth: response.data.dateOfBirth
          ? new Date(response.data.dateOfBirth).toISOString().split("T")[0]
          : "",
        gender: response.data.gender || "",
        maritalStatus: response.data.maritalStatus || "",
        nationalId: response.data.nationalId || "",
        dateOfHire: response.data.dateOfHire || response.data.hireDate
          ? new Date(response.data.dateOfHire || response.data.hireDate).toISOString().split("T")[0]
          : "",
        status: response.data.status || "ACTIVE",
        payGradeId: response.data.payGradeId || "",
      });
    } catch (error) {
      console.error("Error fetching employee:", error);
      alert("Failed to load employee data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axiosInstance.put(`/employee-profile/${params.id}`, formData);
      alert("Employee profile updated successfully");
      router.push("/hr-admin");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to update employee");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) {
      return;
    }

    try {
      await axiosInstance.patch(`/employee-profile/${params.id}/status`, {
        status: newStatus,
        effectiveDate: new Date(),
      });
      alert("Status updated successfully");
      fetchEmployee();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to update status");
    }
  };

  if (loading || !hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">
          {loading ? "Loading..." : "Checking access..."}
        </div>
      </div>
    );
  }

  if (!employee) {
    return <div className="text-white">Employee not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Edit Employee Profile</h1>
          <p className="text-neutral-400">
            {employee.firstName} {employee.lastName} ({employee.employeeNumber})
          </p>
        </div>
        <button
          onClick={() => router.push("/hr-admin")}
          className="text-neutral-400 hover:text-white"
        >
          ← Back to HR Admin
        </button>
      </div>

      {/* Status Management */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Status Management</h2>
        <div className="flex items-center space-x-4">
          <span className="text-neutral-400">Current Status:</span>
          <span
            className={`px-3 py-1 rounded font-medium ${
              employee.status === "ACTIVE"
                ? "bg-green-900 text-green-300"
                : employee.status === "ON_LEAVE"
                ? "bg-yellow-900 text-yellow-300"
                : "bg-red-900 text-red-300"
            }`}
          >
            {employee.status}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => handleStatusChange("ACTIVE")}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            Set Active
          </button>
          <button
            onClick={() => handleStatusChange("ON_LEAVE")}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg"
          >
            Set On Leave
          </button>
          <button
            onClick={() => handleStatusChange("SUSPENDED")}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
          >
            Suspend
          </button>
          <button
            onClick={() => handleStatusChange("TERMINATED")}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Terminate
          </button>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-neutral-400 block mb-1">
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-neutral-400 block mb-1">
                Middle Name
              </label>
              <input
                type="text"
                value={formData.middleName}
                onChange={(e) =>
                  setFormData({ ...formData, middleName: e.target.value })
                }
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-neutral-400 block mb-1">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-neutral-400 block mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-neutral-400 block mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-neutral-400 block mb-1">
                Marital Status
              </label>
              <select
                value={formData.maritalStatus}
                onChange={(e) =>
                  setFormData({ ...formData, maritalStatus: e.target.value })
                }
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              >
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-neutral-400 block mb-1">
                National ID
              </label>
              <input
                type="text"
                value={formData.nationalId}
                onChange={(e) =>
                  setFormData({ ...formData, nationalId: e.target.value })
                }
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-neutral-400 block mb-1">Work Email *</label>
              <input
                type="email"
                value={formData.workEmail}
                onChange={(e) =>
                  setFormData({ ...formData, workEmail: e.target.value })
                }
                required
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-neutral-400 block mb-1">Personal Email</label>
              <input
                type="email"
                value={formData.personalEmail}
                onChange={(e) =>
                  setFormData({ ...formData, personalEmail: e.target.value })
                }
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-neutral-400 block mb-1">Mobile Phone</label>
              <input
                type="tel"
                value={formData.mobilePhone}
                onChange={(e) =>
                  setFormData({ ...formData, mobilePhone: e.target.value })
                }
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-neutral-400 block mb-1">Home Phone</label>
              <input
                type="tel"
                value={formData.homePhone}
                onChange={(e) =>
                  setFormData({ ...formData, homePhone: e.target.value })
                }
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-neutral-400 block mb-1">Street Address</label>
              <input
                type="text"
                value={formData.address?.streetAddress}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, streetAddress: e.target.value }
                  })
                }
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-neutral-400 block mb-1">City</label>
              <input
                type="text"
                value={formData.address?.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value }
                  })
                }
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-neutral-400 block mb-1">Country</label>
              <input
                type="text"
                value={formData.address?.country}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, country: e.target.value }
                  })
                }
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Employment Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-neutral-400 block mb-1">
                Hire Date
              </label>
              <input
                type="date"
                value={formData.dateOfHire}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfHire: e.target.value })
                }
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-neutral-400 block mb-1">
                Pay Grade ID
              </label>
              <input
                type="text"
                value={formData.payGradeId}
                onChange={(e) =>
                  setFormData({ ...formData, payGradeId: e.target.value })
                }
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
                placeholder="MongoDB ObjectId"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-white text-black rounded-lg hover:bg-neutral-200 disabled:opacity-50 font-medium"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/hr-admin")}
            className="px-6 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
