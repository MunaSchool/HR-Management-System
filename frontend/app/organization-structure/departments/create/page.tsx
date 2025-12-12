//this page will display a form(name,code,status)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateDepartmentPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    code: "",
    status: "Active",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:4000/organization-structure/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create department");
      }

      router.push("/organization-structure/departments");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Department</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Code</label>
          <input
            type="text"
            required
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

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Creating..." : "Create Department"}
        </button>
      </form>
    </div>
  );
}
