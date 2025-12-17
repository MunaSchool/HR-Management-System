"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/utils/ApiClient";
import Link from "next/link";
import { isSystemAdmin, isHRAdmin } from "@/app/utils/roleCheck";
import { Settings, ArrowLeft, Users, CheckCircle, FileText, Info, Clock, Activity, TrendingUp } from "lucide-react";

interface ChangeRequest {
  _id: string;
  requestId: string;
  status: string;
  submittedAt: string;
  processedAt?: string;
  employeeProfileId: any;
}

export default function WorkflowConfigPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    avgProcessingTime: "N/A"
  });

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const response = await axiosInstance.get("/employee-profile/me");

      if (!isSystemAdmin(response.data) && !isHRAdmin(response.data)) {
        alert("Access Denied: You need System Admin or HR Admin permissions");
        router.push("/hr-admin");
        return;
      }

      setHasAccess(true);
      await fetchWorkflowData();
    } catch (error) {
      console.error("Error checking access:", error);
      router.push("/hr-admin");
    }
  };

  const fetchWorkflowData = async () => {
    try {
      // Fetch all change requests to calculate statistics
      const pendingResponse = await axiosInstance.get("/employee-profile/change-requests/pending");
      const allChangeRequests = pendingResponse.data || [];

      // Calculate statistics
      const pending = allChangeRequests.filter((r: ChangeRequest) => r.status === "PENDING").length;
      const approved = allChangeRequests.filter((r: ChangeRequest) => r.status === "APPROVED").length;
      const rejected = allChangeRequests.filter((r: ChangeRequest) => r.status === "REJECTED").length;

      // Calculate average processing time
      const processedRequests = allChangeRequests.filter((r: ChangeRequest) =>
        r.processedAt && r.submittedAt
      );

      let avgTime = "N/A";
      if (processedRequests.length > 0) {
        const totalMs = processedRequests.reduce((sum: number, r: ChangeRequest) => {
          const submitted = new Date(r.submittedAt).getTime();
          const processed = new Date(r.processedAt!).getTime();
          return sum + (processed - submitted);
        }, 0);
        const avgMs = totalMs / processedRequests.length;
        const hours = Math.round(avgMs / (1000 * 60 * 60));
        avgTime = hours < 24 ? `${hours} hours` : `${Math.round(hours / 24)} days`;
      }

      setStats({
        totalRequests: allChangeRequests.length,
        pendingRequests: pending,
        approvedRequests: approved,
        rejectedRequests: rejected,
        avgProcessingTime: avgTime
      });
    } catch (error) {
      console.error("Error fetching workflow data:", error);
    } finally {
      setLoading(false);
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
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/hr-admin" className="text-neutral-400 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Settings className="h-8 w-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Workflow Configuration</h1>
          </div>
          <p className="text-neutral-400">
            View and manage approval workflow settings for employee profile changes
          </p>
        </div>
        <Link
          href="/change-requests"
          className="px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-200 transition flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          View Pending Requests
        </Link>
      </div>

      {/* Workflow Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-5 w-5 text-blue-400" />
            <h3 className="text-sm text-neutral-400">Total Requests</h3>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalRequests}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-5 w-5 text-yellow-400" />
            <h3 className="text-sm text-neutral-400">Pending</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-400">{stats.pendingRequests}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <h3 className="text-sm text-neutral-400">Approved</h3>
          </div>
          <p className="text-3xl font-bold text-green-400">{stats.approvedRequests}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-purple-400" />
            <h3 className="text-sm text-neutral-400">Avg Processing Time</h3>
          </div>
          <p className="text-2xl font-bold text-white">{stats.avgProcessingTime}</p>
        </div>
      </div>

      {/* Current Workflow Rules */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Info className="h-6 w-6 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">
            Current Workflow Rules (US-E2-03, BR 36, BR 22)
          </h2>
        </div>

        <div className="space-y-4">
          {/* Employee Profile Changes Rule */}
          <div className="border border-neutral-700 rounded-lg p-5 bg-black">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-white font-semibold text-lg">Employee Profile Changes</h3>
              <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded-full flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Active
              </span>
            </div>
            <p className="text-neutral-400 text-sm mb-4">
              All employee-submitted profile changes require approval from HR Admin or HR Manager before being applied to the system.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span className="text-neutral-500">Module:</span>
                <span className="text-white ml-2">Employee Profile Management</span>
              </div>
              <div>
                <span className="text-neutral-500">Change Types:</span>
                <span className="text-white ml-2">All Profile Data Changes</span>
              </div>
              <div>
                <span className="text-neutral-500">Audit Trail:</span>
                <span className="text-white ml-2">Timestamped & Logged (BR 22)</span>
              </div>
              <div>
                <span className="text-neutral-500">Approval Workflow:</span>
                <span className="text-white ml-2">Required (BR 36)</span>
              </div>
            </div>

            <div>
              <span className="text-neutral-500 text-sm">Authorized Approvers:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-3 py-1 bg-neutral-800 text-neutral-300 text-sm rounded flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  HR Admin
                </span>
                <span className="px-3 py-1 bg-neutral-800 text-neutral-300 text-sm rounded flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  HR Manager
                </span>
              </div>
            </div>
          </div>

          {/* Organization Structure Changes Rule */}
          <div className="border border-neutral-700 rounded-lg p-5 bg-black">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-white font-semibold text-lg">Position & Department Changes</h3>
              <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded-full flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Active
              </span>
            </div>
            <p className="text-neutral-400 text-sm mb-4">
              Changes to employee position or department are validated with the Organization Structure module and require approval.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span className="text-neutral-500">Module:</span>
                <span className="text-white ml-2">Employee Profile + Org Structure</span>
              </div>
              <div>
                <span className="text-neutral-500">Change Types:</span>
                <span className="text-white ml-2">Position/Department Updates</span>
              </div>
              <div>
                <span className="text-neutral-500">Validation:</span>
                <span className="text-white ml-2">Cross-module validation enabled</span>
              </div>
              <div>
                <span className="text-neutral-500">Approval Workflow:</span>
                <span className="text-white ml-2">Required (BR 36)</span>
              </div>
            </div>

            <div>
              <span className="text-neutral-500 text-sm">Authorized Approvers:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-3 py-1 bg-neutral-800 text-neutral-300 text-sm rounded flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  HR Admin
                </span>
                <span className="px-3 py-1 bg-neutral-800 text-neutral-300 text-sm rounded flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  HR Manager
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Trail Features */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="h-6 w-6 text-green-400" />
          <h2 className="text-xl font-semibold text-white">
            Audit Trail & Compliance (BR 22)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-neutral-700 rounded-lg p-4 bg-black">
            <h3 className="text-white font-medium mb-2">Request Tracking</h3>
            <ul className="text-sm text-neutral-400 space-y-2">
              <li>✓ Unique request IDs for all change requests</li>
              <li>✓ Timestamp when request is submitted</li>
              <li>✓ Timestamp when request is processed</li>
              <li>✓ Status tracking (PENDING, APPROVED, REJECTED)</li>
            </ul>
          </div>

          <div className="border border-neutral-700 rounded-lg p-4 bg-black">
            <h3 className="text-white font-medium mb-2">Change Logging</h3>
            <ul className="text-sm text-neutral-400 space-y-2">
              <li>✓ Original vs requested changes recorded</li>
              <li>✓ Reason for change request captured</li>
              <li>✓ Approver/Rejector identity tracked</li>
              <li>✓ Comments and feedback preserved</li>
            </ul>
          </div>

          <div className="border border-neutral-700 rounded-lg p-4 bg-black">
            <h3 className="text-white font-medium mb-2">Notifications</h3>
            <ul className="text-sm text-neutral-400 space-y-2">
              <li>✓ Employee notified on request submission</li>
              <li>✓ HR notified of pending requests</li>
              <li>✓ Employee notified on approval/rejection</li>
              <li>✓ All notifications timestamped</li>
            </ul>
          </div>

          <div className="border border-neutral-700 rounded-lg p-4 bg-black">
            <h3 className="text-white font-medium mb-2">Database Timestamps</h3>
            <ul className="text-sm text-neutral-400 space-y-2">
              <li>✓ Auto timestamps on all records (createdAt/updatedAt)</li>
              <li>✓ LastModifiedBy field tracks changes</li>
              <li>✓ LastModifiedAt timestamp preserved</li>
              <li>✓ Full audit trail in MongoDB</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Implementation Details */}
      <div className="bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-white font-semibold mb-2">Implementation Details</h3>
            <p className="text-neutral-300 text-sm">
              This system implements <strong>US-E2-03</strong> (HR Admin approval workflow),
              <strong> BR 36</strong> (all changes via workflow approval), and
              <strong> BR 22</strong> (timestamped audit trail).
              All employee-submitted changes are stored as change requests with PENDING status.
              Only HR Admins and HR Managers can approve or reject these requests.
              Upon approval, changes are applied to the employee profile and full audit trail is maintained.
            </p>
            <p className="text-neutral-400 text-xs mt-3">
              Backend: <code className="bg-black px-2 py-1 rounded">change-request.service.ts</code> •
              Frontend: <code className="bg-black px-2 py-1 rounded ml-2">change-requests/page.tsx</code> •
              Schema: <code className="bg-black px-2 py-1 rounded ml-2">ep-change-request.schema.ts</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
