"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditDepartmentPage() {
  const router = useRouter();
  const params = useParams();

  const id = params?.id; // Get department ID from URL

  const [form, setForm] = useState({
    name: "",
    code: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ===============================
  // 🔥 1. FETCH department details
  // ===============================
  useEffect(() => {
    async function fetchDepartment() {
      try {
        const res = await fetch(
          `http://localhost:4000/organization-structure/departments/${id}`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("Failed to load department");

        const data = await res.json();

        setForm({
          name: data.name,
          code: data.code,
          status: data.status,
        });
      } catch (err: any) {
        setError(err.message);
      }
    }

    if (id) fetchDepartment();
  }, [id]);

  // ===============================
  // 🔥 2. SUBMIT updated department
  // ===============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:4000/organization-structure/departments/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Update failed");
      }

      router.push("/organization-structure/departments");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // 🔥 UI
  // ===============================
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Department</h1>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">

        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Code</label>
          <input
            type="text"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
