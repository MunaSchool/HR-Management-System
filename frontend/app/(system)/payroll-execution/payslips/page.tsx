// frontend/app/(system)/payroll-execution/payslips/page.tsx
"use client";

import { useState } from "react";
import RoleGate from "../components/RoleGate";
import { payrollExecutionService } from "@/app/(system)/services/payrollExecutionService";

export default function PayslipsPage() {
  const [runId, setRunId] = useState("run-1");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setMsg(null);
    setLoading(true);
    try {
      await payrollExecutionService.generatePayslips({ payrollRunId: runId });
      setMsg("Payslips generated successfully.");
    } catch (e: any) {
      setMsg(e?.message || "Payslips generation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Payslips</h2>

      <div style={{ display: "grid", gap: 10 }}>
        <label>
          <div style={{ fontSize: 12, color: "#666" }}>Payroll Run ID</div>
          <input value={runId} onChange={(e) => setRunId(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }} />
        </label>

        <RoleGate allow={["PAYROLL_SPECIALIST"]}>
          <button
            onClick={generate}
            disabled={loading}
            style={{ padding: "10px 14px", borderRadius: 10, background: "#2563eb", color: "white", border: "none" }}
          >
            {loading ? "Generating..." : "Generate Payslips"}
          </button>
        </RoleGate>

        {msg && <div style={{ fontSize: 13 }}>{msg}</div>}
      </div>
    </div>
  );
}
