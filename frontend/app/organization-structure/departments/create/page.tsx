"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/utils/ApiClient";

export default function CreateDepartmentPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    headEmployeeNumber: "", // ✅ IMPORTANT
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // 📌 SUBMIT
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload: any = {
        name: formData.name,
        code: formData.code,
        description: formData.description || undefined,
      };

      // ✅ only send if provided
      if (formData.headEmployeeNumber.trim()) {
        payload.headEmployeeNumber = formData.headEmployeeNumber.trim();
      }

      await axiosInstance.post(
        "/organization-structure/departments",
        payload
      );

      alert("Department created successfully");
      router.push("/organization-structure/departments");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to create department"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 📌 UI
  // =========================
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Create Department
        </h1>
        <p className="text-neutral-400">
          Create a new department and optionally assign a department head
        </p>
      </div>

      {/* Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
        {error && (
          <div className="mb-4 text-red-400 bg-red-900/20 p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Department Name */}
          <div>
            <label className="block text-sm text-neutral-400 mb-1">
              Department Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
            />
          </div>

          {/* Department Code */}
          <div>
            <label className="block text-sm text-neutral-400 mb-1">
              Department Code *
            </label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              placeholder="FIN, HR, IT"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-neutral-400 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
            />
          </div>

          {/* Head Employee Number */}
          <div>
            <label className="block text-sm text-neutral-400 mb-1">
              Department Head (Employee Number)
            </label>
            <input
              type="text"
              value={formData.headEmployeeNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  headEmployeeNumber: e.target.value,
                })
              }
              className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
              placeholder="EMP001 (optional)"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Must be an existing employee with a primary position
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-white text-black rounded-lg hover:bg-neutral-200 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Department"}
            </button>

            <button
              type="button"
              onClick={() =>
                router.push("/organization-structure/departments")
              }
              className="px-6 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
