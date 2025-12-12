"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "@/app/utils/ApiClient";

export default function EditPositionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    code: "",
    title: "",
    description: "",
    departmentId: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch position details
  const fetchPosition = async () => {
    try {
      const res = await axiosInstance.get(
        `/organization-structure/positions/${id}`
      );
      const pos = res.data;
      setForm({
        code: pos.code,
        title: pos.title,
        description: pos.description || "",
        departmentId: pos.departmentId?._id || pos.departmentId || "",
        status: pos.isActive ? "Active" : "Inactive",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load position");
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments
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
    fetchPosition();
    fetchDepartments();
  }, [id]);

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        code: form.code,
        title: form.title,
        description: form.description || "",
        departmentId: form.departmentId,
      };

      await axiosInstance.put(
        `/organization-structure/positions/${id}`,
        payload
      );

      router.push("/organization-structure/positions");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update position");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Edit Position</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        {/* CODE */}
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

        {/* TITLE */}
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

        {/* DESCRIPTION */}
        <div style={{ marginTop: 15 }}>
          <label>Description</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* DEPARTMENT */}
        <div style={{ marginTop: 15 }}>
          <label>Department</label>
          <select
            required
            value={form.departmentId}
            onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
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

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={saving}
          style={{
            marginTop: 20,
            background: "blue",
            color: "white",
            padding: "10px 20px",
            borderRadius: 5,
          }}
        >
          {saving ? "Saving..." : "Update Position"}
        </button>
      </form>
    </div>
  );
}
