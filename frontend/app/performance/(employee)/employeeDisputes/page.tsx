// app/performance/employeeDisputes/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { performanceApi } from '@/app/utils/performanceApi';
import { useAuth } from '@/app/(system)/context/authContext';
import { AppraisalDispute, AppraisalDisputeStatus } from '@/app/types/performance';
import { 
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Calendar,
  User,
  Search,
  Filter
} from 'lucide-react';

export default function EmployeeDisputesPage() {
  const { user } = useAuth();
  const [disputes, setDisputes] = useState<AppraisalDispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      fetchDisputes();
    }
  }, [user]);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      
      // First, get all appraisals to find disputes
      let employeeId = user?.userid || user?.employeeNumber || user?.email;
      
      if (!employeeId) {
        console.error('No employee ID found in user data');
        return;
      }
      
      // Note: You might need to adjust this API call based on your backend
      // This is a placeholder - you might need a different endpoint
      const allDisputes = await performanceApi.getAppraisalDisputes();
      
      // Filter disputes raised by this employee
      const employeeDisputes = allDisputes.filter(dispute => 
        typeof dispute.raisedByEmployeeId === 'object' && 
        'userid' in dispute.raisedByEmployeeId &&
        dispute.raisedByEmployeeId.userid === employeeId
      );
      
      setDisputes(employeeDisputes);
    } catch (error: any) {
      console.error('Error fetching disputes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: AppraisalDisputeStatus) => {
    switch (status) {
      case AppraisalDisputeStatus.OPEN:
        return (
          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Open
          </span>
        );
      case AppraisalDisputeStatus.UNDER_REVIEW:
        return (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Under Review
          </span>
        );
      case AppraisalDisputeStatus.ADJUSTED:
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Adjusted
          </span>
        );
      case AppraisalDisputeStatus.REJECTED:
        return (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            {status}
          </span>
        );
    }
  };

  const filteredDisputes = disputes.filter(dispute => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    const reason = dispute.reason?.toLowerCase() || '';
    const details = dispute.details?.toLowerCase() || '';
    const status = dispute.status.toLowerCase();
    
    return reason.includes(term) || details.includes(term) || status.includes(term);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Performance Disputes</h1>
          <p className="text-gray-600 mt-1">
            Track and manage your performance appraisal disputes
          </p>
        </div>
        <Link href="/performance/reviews">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <FileText size={16} />
            Back to Reviews
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{disputes.length}</p>
            <p className="text-sm text-gray-500">Total Disputes</p>
          </div>
        </div>
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {disputes.filter(d => d.status === AppraisalDisputeStatus.OPEN).length}
            </p>
            <p className="text-sm text-gray-500">Open</p>
          </div>
        </div>
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {disputes.filter(d => d.status === AppraisalDisputeStatus.ADJUSTED).length}
            </p>
            <p className="text-sm text-gray-500">Resolved</p>
          </div>
        </div>
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {disputes.filter(d => d.status === AppraisalDisputeStatus.REJECTED).length}
            </p>
            <p className="text-sm text-gray-500">Rejected</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search disputes..."
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchDisputes}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Disputes List */}
      {filteredDisputes.length === 0 ? (
        <div className="bg-white border rounded-lg p-12 text-center shadow-sm">
          <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No disputes found</h3>
          <p className="text-gray-500 mb-4">
            {disputes.length === 0 
              ? "You haven't raised any performance disputes yet."
              : "No disputes match your search criteria."}
          </p>
          <div className="flex justify-center space-x-3">
            <Link href="/performance/reviews">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                View Reviews
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDisputes.map((dispute) => (
            <div key={dispute._id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left Section */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {dispute.reason}
                      </h3>
                      {dispute.details && (
                        <p className="text-sm text-gray-500 mt-1">
                          {dispute.details}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(dispute.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span>Submitted: {new Date(dispute.submittedAt).toLocaleDateString()}</span>
                    </div>
                    {dispute.resolvedAt && (
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Resolved: {new Date(dispute.resolvedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                    {dispute.resolutionSummary && (
                      <div className="flex items-center text-gray-600">
                        <FileText className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="truncate">Resolution: {dispute.resolutionSummary}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Section - Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href={`/performance/disputes/${dispute._id}`}>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Important Information */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-medium text-yellow-800 mb-2">Important Information</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Disputes must be raised within 7 days of appraisal publication</li>
          <li>• HR will review your dispute and provide a resolution</li>
          <li>• You will be notified when your dispute status changes</li>
          <li>• For urgent matters, contact HR directly</li>
        </ul>
      </div>
    </div>
  );
}