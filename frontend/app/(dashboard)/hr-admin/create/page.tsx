"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/utils/ApiClient";
import { isSystemAdmin } from "@/app/utils/roleCheck";

export default function CreateEmployeePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    employeeNumber: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    address: {
      streetAddress: "",
      city: "",
      country: "",
    },
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    nationalId: "",
    dateOfHire: "",
    status: "ACTIVE",
    payGrade: "",
    password: "",
    role: "department employee", // Single role
  });

  const handleRoleChange = (role: string) => {
    setFormData({ ...formData, role });
  };

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const response = await axiosInstance.get("/employee-profile/me");

      // Use flexible role checking
      if (!isSystemAdmin(response.data)) {
        alert("Access Denied: You don't have permission to access this page");
        router.push("/profile");
        return;
      }

      setHasAccess(true);
    } catch (error) {
      console.error("Error checking access:", error);
      router.push("/profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Convert role (string) to systemRoles (array) for backend
      const payload = {
        ...formData,
        systemRoles: [formData.role], // Backend expects systemRoles as array
      };
      delete (payload as any).role; // Remove singular role field

      await axiosInstance.post("/employee-profile", payload);
      alert("Employee created successfully");
      router.push("/hr-admin");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to create employee");
    } finally {
      setSaving(false);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Create New Employee</h1>
          <p className="text-neutral-400">Add a new employee to the system</p>
        </div>
        <button
          onClick={() => router.push("/hr-admin")}
          className="text-neutral-400 hover:text-white"
        >
          ← Back to HR Admin
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-neutral-400 block mb-1">
                Employee Number *
              </label>
              <input
                type="text"
                value={formData.employeeNumber}
                onChange={(e) =>
                  setFormData({ ...formData, employeeNumber: e.target.value })
                }
                required
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
                placeholder="EMP12345"
              />
            </div>
            <div>
              <label className="text-sm text-neutral-400 block mb-1">
                Password *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
                placeholder="Initial password"
              />
            </div>
          </div>
        </div>

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
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
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
                <option value="SINGLE">Single</option>
                <option value="MARRIED">Married</option>
                <option value="DIVORCED">Divorced</option>
                <option value="WIDOWED">Widowed</option>
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
              <label className="text-sm text-neutral-400 block mb-1">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-neutral-400 block mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-neutral-400 block mb-1">Street Address</label>
              <input
                type="text"
                value={formData.address.streetAddress}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, streetAddress: e.target.value },
                  })
                }
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-neutral-400 block mb-1">City</label>
              <input
                type="text"
                value={formData.address.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value },
                  })
                }
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-neutral-400 block mb-1">Country</label>
              <input
                type="text"
                value={formData.address.country}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, country: e.target.value },
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
                Hire Date *
              </label>
              <input
                type="date"
                value={formData.dateOfHire}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfHire: e.target.value })
                }
                required
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-neutral-400 block mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              >
                <option value="ACTIVE">Active</option>
                <option value="ON_LEAVE">On Leave</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-neutral-400 block mb-1">
                Pay Grade
              </label>
              <input
                type="text"
                value={formData.payGrade}
                onChange={(e) =>
                  setFormData({ ...formData, payGrade: e.target.value })
                }
                className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
                placeholder="e.g., G5, L3"
              />
            </div>
          </div>
        </div>

        {/* System Role */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">System Role *</h2>
          <p className="text-neutral-400 text-sm mb-4">
            Select one role for this employee.
          </p>

          <div className="space-y-3">
            {[
              { value: "department employee", label: "Department Employee" },
              { value: "department head", label: "Department Head" },
              { value: "DEPARTMENT_MANAGER", label: "Department Manager" },
              { value: "HR Admin", label: "HR Admin" },
              { value: "HR Manager", label: "HR Manager" },
              { value: "HR Employee", label: "HR Employee" },
              { value: "Payroll Specialist", label: "Payroll Specialist" },
              { value: "Payroll Manager", label: "Payroll Manager" },
              { value: "System Admin", label: "System Admin" },
              { value: "Legal & Policy Admin", label: "Legal & Policy Admin" },
              { value: "Recruiter", label: "Recruiter" },
              { value: "Finance Staff", label: "Finance Staff" },
            ].map((roleOption) => (
              <label
                key={roleOption.value}
                className="flex items-center space-x-3 cursor-pointer hover:bg-neutral-800 p-2 rounded"
              >
                <input
                  type="radio"
                  name="role"
                  checked={formData.role === roleOption.value}
                  onChange={() => handleRoleChange(roleOption.value)}
                  className="w-4 h-4 border-neutral-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-neutral-900"
                />
                <span className="text-white">{roleOption.label}</span>
              </label>
            ))}
          </div>

          <div className="mt-4 p-3 bg-neutral-800 rounded">
            <p className="text-sm text-neutral-400">
              Selected role: {formData.role}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-white text-black rounded-lg hover:bg-neutral-200 disabled:opacity-50 font-medium"
          >
            {saving ? "Creating..." : "Create Employee"}
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
