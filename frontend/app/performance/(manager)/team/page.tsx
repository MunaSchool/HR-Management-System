// app/performance/team/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { performanceApi } from '@/app/utils/performanceApi';
import { useAuth } from '@/app/(system)/context/authContext';
import { DepartmentAnalytics, AppraisalAssignmentStatus } from '@/app/types/performance';
import { 
  Users,
  BarChart,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  Search,
  Download,
  User,
  Calendar
} from 'lucide-react';

export default function ManagerTeamPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<DepartmentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<string>('current');
  
  // Mock department ID - you'll need to get this from user context or API
  const departmentId = 'mock-department-id';

  useEffect(() => {
    fetchTeamAnalytics();
  }, [timeframe]);

  const fetchTeamAnalytics = async () => {
    try {
      setLoading(true);
      // Use current cycle or all cycles based on timeframe
      const cycleId = timeframe === 'current' ? 'current' : undefined;
      const data = await performanceApi.getDepartmentPerformanceAnalytics(departmentId, cycleId);
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching team analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceTrend = () => {
    if (!analytics || analytics.assignments.length === 0) return 'stable';
    
    const publishedCount = analytics.assignments.filter(a => 
      a.status === AppraisalAssignmentStatus.PUBLISHED
    ).length;
    
    const completionRate = analytics.totalEmployees > 0 
      ? (publishedCount / analytics.totalEmployees) * 100 
      : 0;
    
    return completionRate > 75 ? 'improving' : completionRate > 50 ? 'stable' : 'declining';
  };

  const getStatusIcon = (status: AppraisalAssignmentStatus) => {
    switch (status) {
      case AppraisalAssignmentStatus.PUBLISHED:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case AppraisalAssignmentStatus.SUBMITTED:
      case AppraisalAssignmentStatus.IN_PROGRESS:
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case AppraisalAssignmentStatus.NOT_STARTED:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: AppraisalAssignmentStatus) => {
    switch (status) {
      case AppraisalAssignmentStatus.PUBLISHED: return 'Published';
      case AppraisalAssignmentStatus.SUBMITTED: return 'Submitted';
      case AppraisalAssignmentStatus.IN_PROGRESS: return 'In Progress';
      case AppraisalAssignmentStatus.NOT_STARTED: return 'Not Started';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const trend = getPerformanceTrend();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Performance</h1>
          <p className="text-gray-600 mt-1">
            Overview of your team's performance evaluations and trends
          </p>
        </div>
        <div className="flex space-x-3">
          <select
            className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="current">Current Cycle</option>
            <option value="all">All Cycles</option>
            <option value="last-quarter">Last Quarter</option>
            <option value="last-year">Last Year</option>
          </select>
          <button
            onClick={fetchTeamAnalytics}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{analytics?.totalEmployees || 0}</p>
            <p className="text-sm text-gray-500">Team Members</p>
          </div>
        </div>
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{analytics?.completedEvaluations || 0}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
        </div>
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{analytics?.pendingEvaluations || 0}</p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
        </div>
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{analytics?.completionRate || '0%'}</p>
            <p className="text-sm text-gray-500">Completion Rate</p>
          </div>
        </div>
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="text-center">
            <div className="flex items-center justify-center">
              {trend === 'improving' ? (
                <TrendingUp className="h-6 w-6 text-green-500" />
              ) : trend === 'declining' ? (
                <TrendingDown className="h-6 w-6 text-red-500" />
              ) : (
                <BarChart className="h-6 w-6 text-blue-500" />
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {trend === 'improving' ? 'Improving' : trend === 'declining' ? 'Needs Attention' : 'Stable'}
            </p>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="bg-white border rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search team members..."
                className="pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Link href="/performance/assignments">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                Manage Evaluations
              </button>
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          {analytics?.assignments?.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No team members found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Team Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {analytics?.assignments?.map((assignment) => (
                    <tr key={assignment.employeeId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {assignment.employeeName}
                            </div>
                            <div className="text-sm text-gray-500">
                              Employee ID: {assignment.employeeId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(assignment.status)}
                          <span className="ml-2 text-sm text-gray-900">
                            {getStatusText(assignment.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(assignment.assignedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {assignment.completedAt 
                          ? new Date(assignment.completedAt).toLocaleDateString()
                          : 'Not completed'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {assignment.status === AppraisalAssignmentStatus.NOT_STARTED && (
                          <Link href={`/performance/assignments/evaluate/${assignment.employeeId}`}>
                            <button className="text-blue-600 hover:text-blue-900">
                              Start Evaluation
                            </button>
                          </Link>
                        )}
                        {assignment.status === AppraisalAssignmentStatus.IN_PROGRESS && (
                          <Link href={`/performance/assignments/evaluate/${assignment.employeeId}`}>
                            <button className="text-blue-600 hover:text-blue-900">
                              Continue Evaluation
                            </button>
                          </Link>
                        )}
                        {assignment.status === AppraisalAssignmentStatus.PUBLISHED && (
                          <Link href={`/performance/assignments/view/${assignment.employeeId}`}>
                            <button className="text-green-600 hover:text-green-900">
                              View Results
                            </button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="font-medium text-gray-900 mb-4">Performance Insights</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Completion Time</span>
              <span className="text-sm font-medium">14 days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">On-time Submissions</span>
              <span className="text-sm font-medium text-green-600">85%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Overdue Evaluations</span>
              <span className="text-sm font-medium text-red-600">
                {analytics?.assignments?.filter(a => {
                  if (!a.completedAt && a.assignedAt) {
                    const assignedDate = new Date(a.assignedAt);
                    const daysSince = Math.floor((Date.now() - assignedDate.getTime()) / (1000 * 60 * 60 * 24));
                    return daysSince > 30;
                  }
                  return false;
                }).length || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Score</span>
              <span className="text-sm font-medium">{analytics?.averageScore || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/performance/assignments">
              <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">View All Evaluations</p>
                    <p className="text-sm text-gray-500">Complete evaluation list</p>
                  </div>
                </div>
              </button>
            </Link>
            
            <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Export Team Report</p>
                  <p className="text-sm text-gray-500">Download performance data</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}