// app/performance/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/(system)/context/authContext';
import { performanceApi } from '../utils/performanceApi';
import { 
  AppraisalCycle, 
  PerformanceAnalytics, 
  AppraisalAssignment,
  AppraisalAssignmentStatus 
} from '../types/performance'; // FIXED: Changed from '../../app/types/performance'
import Link from 'next/link';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  ArrowRight
} from 'lucide-react';

export default function PerformanceDashboard() {
  const { user, loading } = useAuth();
  const [cycles, setCycles] = useState<AppraisalCycle[]>([]);
  const [analytics, setAnalytics] = useState<PerformanceAnalytics | null>(null);
  const [myAssignments, setMyAssignments] = useState<AppraisalAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isHR = user?.roles?.includes('HR_MANAGER') || user?.roles?.includes('HR_ADMIN') || user?.roles?.includes('SYSTEM_ADMIN');
  const isManager = user?.roles?.includes('DEPARTMENT_HEAD');
  const isEmployee = !isHR && !isManager;

  useEffect(() => {
    if (user && !loading) {
      fetchData();
    }
  }, [user, loading]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch cycles
      const cyclesData = await performanceApi.getAllAppraisalCycles();
      setCycles(cyclesData.slice(0, 5)); // Show only recent 5
      
      // Fetch analytics (HR/Managers only)
      if (isHR || isManager) {
        try {
          const analyticsData = await performanceApi.getPerformanceAnalytics();
          setAnalytics(analyticsData);
        } catch (error) {
          console.error('Error fetching analytics:', error);
        }
      }
      
      // Fetch my assignments
      if (user?.id) {
        try {
          if (isManager) {
            const assignments = await performanceApi.getManagerAppraisalAssignments(user.id);
            setMyAssignments(assignments);
          } else if (isEmployee) {
            const assignments = await performanceApi.getEmployeeAppraisals(user.id);
            setMyAssignments(assignments);
          }
        } catch (error) {
          console.error('Error fetching assignments:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PLANNED': return 'bg-blue-100 text-blue-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      case 'ARCHIVED': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssignmentStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800';
      case 'SUBMITTED': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'NOT_STARTED': return 'bg-gray-100 text-gray-800';
      case 'DISPUTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading performance dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Performance Management</h1>
            <p className="text-gray-700 mt-2">
              Welcome back, {user?.name || user?.email}! Manage appraisals and track performance.
            </p>
          </div>
          {isHR && (
            <div className="flex gap-4">
              <Link
                href="/performance/cycles/create"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                <Plus size={20} />
                New Appraisal Cycle
              </Link>
              <Link
                href="/performance/templates/create"
                className="flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition"
              >
                <Plus size={20} />
                New Template
              </Link>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 text-sm">Total Assignments</p>
                  <p className="text-3xl font-bold mt-2 text-gray-900">{analytics.totalAssignments}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 text-sm">Completion Rate</p>
                  <p className="text-3xl font-bold mt-2 text-gray-900">{analytics.completionRate}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 text-sm">Average Score</p>
                  <p className="text-3xl font-bold mt-2 text-gray-900">{analytics.averageScore}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText className="text-purple-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 text-sm">Pending Actions</p>
                  <p className="text-3xl font-bold mt-2 text-gray-900">{analytics.inProgressAssignments}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <AlertCircle className="text-yellow-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Recent Cycles */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Appraisal Cycles</h2>
                <Link href="/performance/cycles" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                  View All <ArrowRight size={16} />
                </Link>
              </div>

              {cycles.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto text-gray-500" size={48} />
                  <p className="text-gray-700 mt-4">No appraisal cycles found</p>
                  {isHR && (
                    <Link
                      href="/performance/cycles/create"
                      className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Create your first cycle
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {cycles.map((cycle) => (
                    <div key={cycle._id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{cycle.name}</h3>
                          <p className="text-sm text-gray-700 mt-1">{cycle.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-gray-700">
                              {new Date(cycle.startDate).toLocaleDateString()} - {new Date(cycle.endDate).toLocaleDateString()}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(cycle.status)}`}>
                              {cycle.status}
                            </span>
                          </div>
                        </div>
                        <Link
                          href={`/performance/cycles/${cycle._id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Assignments */}
            {myAssignments.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">My Appraisal Assignments</h2>
                <div className="space-y-4">
                  {myAssignments.slice(0, 3).map((assignment) => (
                    <div key={assignment._id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-3">
                            {typeof assignment.cycleId === 'object' && (
                              <h4 className="font-medium text-gray-900">{(assignment.cycleId as any).name}</h4>
                            )}
                            <span className={`px-2 py-1 text-xs rounded-full ${getAssignmentStatusColor(assignment.status)}`}>
                              {assignment.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-700 mt-2">
                            Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}
                            {assignment.dueDate && ` • Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
                          </div>
                        </div>
                        <Link
                          href={`/performance/assignments/${assignment._id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                        >
                          {assignment.status === 'NOT_STARTED' ? 'Start Evaluation' : 'View'}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <Link 
                    href={isManager ? "/performance/manager" : "/performance/employee"} 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all {myAssignments.length} assignments
                  </Link>
                </div>
              </div>
            )}

            {/* No Assignments Message */}
            {!myAssignments.length && (
              <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">My Appraisal Assignments</h2>
                <div className="text-center py-8">
                  <FileText className="mx-auto text-gray-400" size={48} />
                  <p className="text-gray-700 mt-4">
                    {isManager 
                      ? 'You don\'t have any team members to evaluate yet.'
                      : 'You don\'t have any performance appraisals assigned yet.'
                    }
                  </p>
                  {isManager && (
                    <p className="text-gray-600 mt-2 text-sm">
                      Appraisals will appear here when HR assigns them to your team.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Quick Actions */}
          <div className="space-y-6">
            {/* Role-based Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {isHR && (
                  <>
                    <Link
                      href="/performance/templates"
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition"
                    >
                      <FileText size={20} className="text-blue-600" />
                      <span className="text-gray-800">Manage Templates</span>
                    </Link>
                    <Link
                      href="/performance/analytics"
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition"
                    >
                      <TrendingUp size={20} className="text-purple-600" />
                      <span className="text-gray-800">View Analytics</span>
                    </Link>
                    <Link
                      href="/performance/hr"
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition"
                    >
                      <AlertCircle size={20} className="text-red-600" />
                      <span className="text-gray-800">Review Disputes</span>
                    </Link>
                  </>
                )}

                {isManager && (
                  <>
                    <Link
                      href="/performance/manager"
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition"
                    >
                      <Users size={20} className="text-blue-600" />
                      <span className="text-gray-800">Team Appraisals</span>
                    </Link>
                    <Link
                      href="/performance/manager"
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition"
                    >
                      <FileText size={20} className="text-green-600" />
                      <span className="text-gray-800">Pending Evaluations</span>
                    </Link>
                  </>
                )}

                {isEmployee && (
                  <>
                    <Link
                      href="/performance/employee"
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition"
                    >
                      <FileText size={20} className="text-blue-600" />
                      <span className="text-gray-800">My Appraisals</span>
                    </Link>
                    {myAssignments.some(a => a.status === 'PUBLISHED') && (
                      <Link
                        href="/performance/employee/disputes/create"
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition"
                      >
                        <AlertCircle size={20} className="text-yellow-600" />
                        <span className="text-gray-800">Raise Dispute</span>
                      </Link>
                    )}
                  </>
                )}

                <Link
                  href="/performance/analytics"
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition"
                >
                  <TrendingUp size={20} className="text-gray-600" />
                  <span className="text-gray-800">Performance Reports</span>
                </Link>
              </div>
            </div>

            {/* Status Summary */}
            {analytics && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="text-gray-800">Completed</span>
                    </div>
                    <span className="font-semibold text-gray-900">{analytics.completedAssignments}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-blue-600" />
                      <span className="text-gray-800">In Progress</span>
                    </div>
                    <span className="font-semibold text-gray-900">{analytics.inProgressAssignments}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-yellow-600" />
                      <span className="text-gray-800">Not Started</span>
                    </div>
                    <span className="font-semibold text-gray-900">{analytics.notStartedAssignments}</span>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 font-medium">Total</span>
                      <span className="font-bold text-lg text-gray-900">{analytics.totalAssignments}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}