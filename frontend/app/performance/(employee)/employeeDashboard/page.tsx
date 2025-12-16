// app/performance/(employee)/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { performanceApi } from '@/app/utils/performanceApi';
import { useAuth } from '@/app/(system)/context/authContext';
import { AppraisalAssignment, AppraisalAssignmentStatus } from '@/app/types/performance';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  ArrowRight,
  User,
  Calendar,
  Star
} from 'lucide-react';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [appraisals, setAppraisals] = useState<AppraisalAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchAppraisals();
    }
  }, [user]);

  const fetchAppraisals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Debug: Log user object to see what fields you have
      console.log('User object:', user);
      
      // Try different possible ID fields
      let employeeId = user?.userid || user?.employeeNumber || user?.email;
      
      if (!employeeId) {
        setError('No employee ID found in user data');
        return;
      }
      
      console.log('Fetching appraisals for employee ID:', employeeId);
      
      const data = await performanceApi.getEmployeeAppraisals(employeeId);
      setAppraisals(data);
      
    } catch (error: any) {
      console.error('Error fetching appraisals:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch appraisals');
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from appraisals
  const getStats = () => {
    return {
      total: appraisals.length,
      published: appraisals.filter(a => a.status === AppraisalAssignmentStatus.PUBLISHED).length,
      inProgress: appraisals.filter(a => a.status === AppraisalAssignmentStatus.IN_PROGRESS).length,
      notStarted: appraisals.filter(a => a.status === AppraisalAssignmentStatus.NOT_STARTED).length,
    };
  };

  const getStatusBadge = (status: AppraisalAssignmentStatus) => {
    switch (status) {
      case AppraisalAssignmentStatus.PUBLISHED:
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            Published
          </span>
        );
      case AppraisalAssignmentStatus.SUBMITTED:
        return (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            Submitted
          </span>
        );
      case AppraisalAssignmentStatus.IN_PROGRESS:
        return (
          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
            In Progress
          </span>
        );
      case AppraisalAssignmentStatus.NOT_STARTED:
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            Not Started
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = getStats();
  const recentAppraisals = appraisals.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Track your performance reviews and career growth.
          </p>
        </div>
        <div className="flex space-x-3">
          <Link href="/performance/reviews">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <FileText size={16} />
              View All Reviews
            </button>
          </Link>
          <Link href="/performance/employeeDisputes">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
              <AlertCircle size={16} />
              Raise Dispute
            </button>
          </Link>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
          <button 
            onClick={fetchAppraisals}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Appraisals</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.published}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.inProgress}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Not Started</p>
              <p className="text-2xl font-bold text-gray-600 mt-1">{stats.notStarted}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-full">
              <AlertCircle className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appraisals */}
      <div className="bg-white border rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Appraisal Cycles</h2>
            <Link href="/performance/employee/reviews" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          {recentAppraisals.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No appraisal cycles assigned yet</p>
              {!error && (
                <p className="text-sm text-gray-400 mt-1">You'll be notified when cycles are assigned</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {recentAppraisals.map((appraisal) => (
                <div key={appraisal._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <Calendar className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900">
                          {typeof appraisal.cycleId === 'object' && 'name' in appraisal.cycleId 
                            ? appraisal.cycleId.name 
                            : 'Appraisal Cycle'}
                        </h3>
                        {getStatusBadge(appraisal.status)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span className="flex items-center gap-1">
                          <User size={12} />
                          Manager: {typeof appraisal.managerProfileId === 'object' && 'firstName' in appraisal.managerProfileId
                            ? `${appraisal.managerProfileId.firstName} ${appraisal.managerProfileId.lastName}`
                            : 'N/A'}
                        </span>
                        <span>Assigned: {new Date(appraisal.assignedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {appraisal.status === AppraisalAssignmentStatus.PUBLISHED && appraisal.latestAppraisalId && (
                    <Link 
                      href={`/performance/employee/reviews/${appraisal.latestAppraisalId}`}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center gap-1"
                    >
                      View Review <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/performance/reviews">
              <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">View All Reviews</p>
                    <p className="text-sm text-gray-500">Complete performance history</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </button>
            </Link>
            
            <Link href="/performance/employeeDisputes">
              <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium">Raise a Dispute</p>
                    <p className="text-sm text-gray-500">Object to appraisal results</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="font-medium text-gray-900 mb-4">Performance Tips</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Review deadlines are usually 7 days after publication</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span>Disputes must be raised within 7 days of publication</span>
            </li>
            <li className="flex items-start gap-2">
              <User className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <span>Contact your manager for feedback clarification</span>
            </li>
            <li className="flex items-start gap-2">
              <Star className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
              <span>Track your performance trends for career development</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}