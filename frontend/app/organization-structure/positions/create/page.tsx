"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/utils/ApiClient";

export default function CreatePositionPage() {
  const router = useRouter();

  const [departments, setDepartments] = useState([]);

  // ✅ Fix: Include code + correct isActive handling
  const [form, setForm] = useState({
    code: "",
    title: "",
    description: "",
    departmentId: "",
    status: "Active", // convert later to boolean
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ============================
  // LOAD DEPARTMENTS
  // ============================
  const fetchDepartments = async () => {
    try {
      const res = await axiosInstance.get(
        "/organization-structure/departments"
      );
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load departments");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // ============================
  // SUBMIT FORM
  // ============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ Fix: Send EXACT fields backend expects
      const payload = {
        code: form.code,
        title: form.title,
        description: form.description || "",
        departmentId: form.departmentId,
      };

      await axiosInstance.post("/organization-structure/positions", payload);

      router.push("/organization-structure/positions");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create position");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Create Position</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        {/* CODE (REQUIRED) */}
        <div>
          <label>Code</label>
          <input
            type="text"
            required
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* TITLE (REQUIRED) */}
        <div style={{ marginTop: 15 }}>
          <label>Title</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* DESCRIPTION (OPTIONAL) */}
        <div style={{ marginTop: 15 }}>
          <label>Description</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* DEPARTMENT DROPDOWN */}
        <div style={{ marginTop: 15 }}>
          <label>Department</label>
          <select
            required
            value={form.departmentId}
            onChange={(e) =>
              setForm({ ...form, departmentId: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select Department</option>
            {departments.map((d: any) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* STATUS */}
        <div style={{ marginTop: 15 }}>
          <label>Status</label>
          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 20,
            background: "blue",
            color: "white",
            padding: "10px 20px",
            borderRadius: 5,
          }}
        >
          {loading ? "Creating..." : "Create Position"}
        </button>
      </form>
    </div>
  );
}
