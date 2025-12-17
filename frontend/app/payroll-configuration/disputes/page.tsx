"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/ApiClient";

type Dispute = { _id: string; employeeId: string; description: string; status: string; amount?: number };

export default function DisputesPage() {
  const [employeeId, setEmployeeId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [list, setList] = useState<Dispute[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchMine = async () => {
    if (!employeeId) return;
    try {
      const res = await axiosInstance.get<Dispute[]>(`/payroll-configuration/disputes/my/${employeeId}`);
      setList(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load disputes");
    }
  };

  useEffect(() => {
    fetchMine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const create = async () => {
    setError(null);
    try {
      await axiosInstance.post("/payroll-configuration/disputes", { employeeId, description, amount });
      setDescription("");
      fetchMine();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Create dispute failed");
    }
  };

  return (
    <main className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Payroll Disputes</h1>
        <p className="text-sm text-gray-600">Employees can file disputes; managers can resolve.</p>
      </div>
      {error && <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-red-700">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border rounded-lg p-4">
        <input
          className="rounded border px-3 py-2"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />
        <input
          className="rounded border px-3 py-2"
          placeholder="Amount (optional)"
          type="number"
          value={amount ?? ""}
          onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : undefined)}
        />
        <textarea
          className="rounded border px-3 py-2 md:col-span-3"
          placeholder="Describe the issue"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <div className="md:col-span-3 flex gap-3">
          <button onClick={create} className="rounded bg-blue-600 text-white px-4 py-2">
            Submit Dispute
          </button>
          <button onClick={fetchMine} className="rounded border px-4 py-2">
            Refresh
          </button>
        </div>
      </div>

      <div className="border rounded-lg">
        <div className="border-b px-4 py-2 font-semibold">My Disputes</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-4 py-2">Employee</th>
              <th>Description</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {list.map((d) => (
              <tr key={d._id} className="border-b">
                <td className="px-4 py-2">{d.employeeId}</td>
                <td>{d.description}</td>
                <td>
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs capitalize">{d.status}</span>
                </td>
                <td>{d.amount ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

