"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/utils/ApiClient";
import { isHRAdmin } from "@/app/utils/roleCheck";

interface Department {
  _id: string;
  name: string;
}

interface Position {
  _id: string;
  title: string;
}

interface PayGrade {
  _id: string;
  grade: string;
}

export default function CreateEmployeePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [payGrades, setPayGrades] = useState<PayGrade[]>([]);

  const [formData, setFormData] = useState({
    employeeNumber: "",
    password: "",
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    nationalId: "",

    workEmail: "",
    personalEmail: "",
    mobilePhone: "",
    homePhone: "",
    address: {
      streetAddress: "",
      city: "",
      country: "",
    },

    primaryDepartmentId: "",
    primaryPositionId: "",
    supervisorPositionId: "",

    dateOfHire: "",
    status: "ACTIVE",
    contractType: "",
    workType: "",
    contractStartDate: "",
    contractEndDate: "",

    payGrade: "",
    bankName: "",
    bankAccountNumber: "",

    role: "department employee",
  });

  /* =========================
     ACCESS CONTROL
  ========================= */

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const res = await axiosInstance.get("/employee-profile/me");

      if (!isHRAdmin(res.data)) {
        alert("Access denied");
        router.push("/profile");
        return;
      }

      setHasAccess(true);
      await fetchLookups();
    } catch {
      router.push("/profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchLookups = async () => {
    const [deptRes, posRes] = await Promise.all([
      axiosInstance.get("/organization-structure/departments"),
      axiosInstance.get("/organization-structure/positions"),
    ]);

    setDepartments(deptRes.data || []);
    setPositions(posRes.data || []);

    try {
      const pgRes = await axiosInstance.get("/payroll-configuration/pay-grades");
      setPayGrades(pgRes.data || []);
    } catch {
      setPayGrades([]);
    }
  };

  /* =========================
     VALIDATION (CRITICAL)
  ========================= */

  const validateRequiredFields = () => {
    if (!formData.primaryDepartmentId) {
      return "Department is required";
    }

    if (!formData.primaryPositionId) {
      return "Position is required";
    }

    if (!formData.contractType) {
      return "Contract Type is required (Full Time / Part Time)";
    }

    if (!formData.workType) {
      return "Work Type is required (Full Time / Part Time)";
    }

    return null;
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateRequiredFields();
    if (error) {
      alert(error);
      return;
    }

    setSaving(true);

    try {
      const payload: any = {
        ...formData,
        systemRoles: [formData.role],
      };

      delete payload.role;

      // Clean empty optional fields
      if (!payload.supervisorPositionId) delete payload.supervisorPositionId;
      if (!payload.payGrade) delete payload.payGrade;

      await axiosInstance.post("/employee-profile", payload);

      alert("Employee created successfully");
      router.push("/hr-admin");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to create employee");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !hasAccess) {
    return <div className="p-10 text-white">Loading...</div>;
  }

  /* =========================
     UI
  ========================= */

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8 text-white">

      <h1 className="text-3xl font-bold">Create New Employee</h1>

      {/* Employee Number & Password */}
      <input
        placeholder="Employee Number"
        value={formData.employeeNumber}
        onChange={e => setFormData({ ...formData, employeeNumber: e.target.value })}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={e => setFormData({ ...formData, password: e.target.value })}
        required
      />

      {/* Department */}
      <select
        value={formData.primaryDepartmentId}
        onChange={e => setFormData({ ...formData, primaryDepartmentId: e.target.value })}
      >
        <option value="">Select Department *</option>
        {departments.map(d => (
          <option key={d._id} value={d._id}>{d.name}</option>
        ))}
      </select>

      {/* Position */}
      <select
        value={formData.primaryPositionId}
        onChange={e => setFormData({ ...formData, primaryPositionId: e.target.value })}
      >
        <option value="">Select Position *</option>
        {positions.map(p => (
          <option key={p._id} value={p._id}>{p.title}</option>
        ))}
      </select>

      {/* Supervisor Position */}
      <select
        value={formData.supervisorPositionId}
        onChange={e => setFormData({ ...formData, supervisorPositionId: e.target.value })}
      >
        <option value="">No Supervisor (Top Level)</option>
        {positions.map(p => (
          <option key={p._id} value={p._id}>{p.title}</option>
        ))}
      </select>

      {/* Contract Type */}
      <select
        value={formData.contractType}
        onChange={e => setFormData({ ...formData, contractType: e.target.value })}
      >
        <option value="">Contract Type *</option>
        <option value="FULL_TIME_CONTRACT">Full Time</option>
        <option value="PART_TIME_CONTRACT">Part Time</option>
      </select>

      {/* Work Type */}
      <select
        value={formData.workType}
        onChange={e => setFormData({ ...formData, workType: e.target.value })}
      >
        <option value="">Work Type *</option>
        <option value="FULL_TIME">Full Time</option>
        <option value="PART_TIME">Part Time</option>
      </select>

      {/* Hire Date */}
      <input
        type="date"
        value={formData.dateOfHire}
        onChange={e => setFormData({ ...formData, dateOfHire: e.target.value })}
        required
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={saving}
        className="bg-white text-black px-6 py-2 rounded"
      >
        {saving ? "Creating..." : "Create Employee"}
      </button>

    </form>
  );
}
