// app/performance/analytics/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/(system)/context/authContext';
import { performanceApi } from '@/app/utils/performanceApi';
import { 
  PerformanceAnalytics, 
  DepartmentAnalytics,
  AppraisalCycle,
  AppraisalCycleStatus 
} from '@/app/types/performance';
import Link from 'next/link';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  Calendar, 
  Download,
  Filter,
  PieChart,
  LineChart,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<PerformanceAnalytics | null>(null);
  const [departmentAnalytics, setDepartmentAnalytics] = useState<DepartmentAnalytics[]>([]);
  const [cycles, setCycles] = useState<AppraisalCycle[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('quarter');

  const isHR = user?.roles?.includes('HR_MANAGER') || user?.roles?.includes('HR_ADMIN') || user?.roles?.includes('SYSTEM_ADMIN');
  const isManager = user?.roles?.includes('DEPARTMENT_HEAD');

  useEffect(() => {
    fetchData();
  }, [selectedCycle]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch analytics
      const analyticsData = await performanceApi.getPerformanceAnalytics(selectedCycle || undefined);
      setAnalytics(analyticsData);
      
      // Fetch cycles for filter
      const cyclesData = await performanceApi.getAllAppraisalCycles();
      setCycles(cyclesData);
      
      // If HR or manager, fetch department analytics
      if (isHR || isManager) {
        // In a real app, you'd fetch actual department IDs based on user
        // For now, we'll use a placeholder
        try {
          // This would need proper department IDs from your system
          // const deptAnalytics = await performanceApi.getDepartmentPerformanceAnalytics('dept-id', selectedCycle || undefined);
          // setDepartmentAnalytics([deptAnalytics]);
        } catch (error) {
          console.error('Error fetching department analytics:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportReport = async () => {
    try {
      const report = await performanceApi.exportPerformanceReport(selectedCycle || undefined);
      // Create and download the report
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `performance-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  const getCompletionRateColor = (rate: string) => {
    const numericRate = parseFloat(rate);
    if (numericRate >= 90) return 'text-green-600';
    if (numericRate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreColor = (score: string) => {
    const numericScore = parseFloat(score);
    if (numericScore >= 85) return 'text-green-600';
    if (numericScore >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-700">Loading analytics dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="text-blue-600" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
                <p className="text-gray-700 mt-1">
                  Insights and metrics for performance appraisal cycles
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportReport}
              className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border px-4 py-2 rounded-lg font-medium transition"
            >
              <Download size={18} />
              Export Report
            </button>
            
            {isHR && (
              <Link
                href="/performance/cycles"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                <Calendar size={18} />
                Manage Cycles
              </Link>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter size={20} className="text-gray-600" />
                  <label className="text-sm font-medium text-gray-800">Cycle Filter:</label>
                </div>
                <select
                  value={selectedCycle}
                  onChange={(e) => setSelectedCycle(e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                >
                  <option value="">All Cycles</option>
                  {cycles.map((cycle) => (
                    <option key={cycle._id} value={cycle._id}>
                      {cycle.name} ({cycle.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-2">
              {(['month', 'quarter', 'year'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize ${
                    timeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        {analytics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Completion Rate */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                  <span className={`text-2xl font-bold ${getCompletionRateColor(analytics.completionRate)}`}>
                    {analytics.completionRate}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Completion Rate</h3>
                <p className="text-gray-700 text-sm">
                  {analytics.completedAssignments} of {analytics.totalAssignments} assignments completed
                </p>
              </div>

              {/* Average Score */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="text-blue-600" size={20} />
                  </div>
                  <span className={`text-2xl font-bold ${getScoreColor(analytics.averageScore)}`}>
                    {analytics.averageScore}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Score</h3>
                <p className="text-gray-700 text-sm">
                  Based on {analytics.totalRecords} published appraisals
                </p>
              </div>

              {/* In Progress */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="text-yellow-600" size={20} />
                  </div>
                  <span className="text-2xl font-bold text-yellow-600">
                    {analytics.inProgressAssignments}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">In Progress</h3>
                <p className="text-gray-700 text-sm">
                  Appraisals currently being evaluated
                </p>
              </div>

              {/* Not Started */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="text-red-600" size={20} />
                  </div>
                  <span className="text-2xl font-bold text-red-600">
                    {analytics.notStartedAssignments}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Not Started</h3>
                <p className="text-gray-700 text-sm">
                  Assignments awaiting evaluation
                </p>
              </div>
            </div>

            {/* Charts and Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Status Distribution */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <PieChart className="text-gray-700" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900">Assignment Status Distribution</h3>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { 
                      label: 'Completed', 
                      value: analytics.completedAssignments, 
                      color: 'bg-green-500',
                      percentage: analytics.totalAssignments > 0 
                        ? Math.round((analytics.completedAssignments / analytics.totalAssignments) * 100)
                        : 0
                    },
                    { 
                      label: 'In Progress', 
                      value: analytics.inProgressAssignments, 
                      color: 'bg-yellow-500',
                      percentage: analytics.totalAssignments > 0 
                        ? Math.round((analytics.inProgressAssignments / analytics.totalAssignments) * 100)
                        : 0
                    },
                    { 
                      label: 'Not Started', 
                      value: analytics.notStartedAssignments, 
                      color: 'bg-red-500',
                      percentage: analytics.totalAssignments > 0 
                        ? Math.round((analytics.notStartedAssignments / analytics.totalAssignments) * 100)
                        : 0
                    }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-800 font-medium">{item.label}</span>
                        <span className="text-gray-700">{item.value} ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${item.color} h-2 rounded-full`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cycle Status */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-gray-700" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900">Cycle Status</h3>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {Object.values(AppraisalCycleStatus).map((status) => {
                    const count = cycles.filter(c => c.status === status).length;
                    return (
                      <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            status === AppraisalCycleStatus.ACTIVE ? 'bg-green-500' :
                            status === AppraisalCycleStatus.PLANNED ? 'bg-blue-500' :
                            status === AppraisalCycleStatus.CLOSED ? 'bg-gray-500' :
                            'bg-purple-500'
                          }`}></div>
                          <span className="text-gray-800 font-medium capitalize">{status.toLowerCase()}</span>
                        </div>
                        <span className="text-gray-700 font-semibold">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Department Analytics (for HR/Managers) */}
            {(isHR || isManager) && departmentAnalytics.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Users className="text-gray-700" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900">Department Performance</h3>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-gray-800 font-semibold">Department</th>
                        <th className="text-left py-3 px-4 text-gray-800 font-semibold">Employees</th>
                        <th className="text-left py-3 px-4 text-gray-800 font-semibold">Completed</th>
                        <th className="text-left py-3 px-4 text-gray-800 font-semibold">Completion Rate</th>
                        <th className="text-left py-3 px-4 text-gray-800 font-semibold">Avg Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentAnalytics.map((dept, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-800 font-medium">{dept.departmentId}</td>
                          <td className="py-3 px-4 text-gray-700">{dept.totalEmployees}</td>
                          <td className="py-3 px-4 text-gray-700">{dept.completedEvaluations}</td>
                          <td className="py-3 px-4">
                            <span className={`font-medium ${getCompletionRateColor(dept.completionRate)}`}>
                              {dept.completionRate}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`font-medium ${getScoreColor(dept.averageScore)}`}>
                              {dept.averageScore}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Historical Trends */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <LineChart className="text-gray-700" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900">Historical Trends</h3>
                </div>
                <button
                  onClick={() => performanceApi.getHistoricalTrendAnalysis()}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Full Report
                </button>
              </div>
              
              <div className="text-center py-12">
                <TrendingUp className="mx-auto text-gray-400" size={48} />
                <p className="text-gray-700 mt-4">
                  Historical trend analysis shows performance patterns over time.
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Use the full report to analyze individual or department performance trends.
                </p>
              </div>
            </div>
          </>
        )}

        {/* No Data State */}
        {!analytics && (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <BarChart3 className="mx-auto text-gray-400" size={64} />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">No Analytics Data</h3>
            <p className="text-gray-700 mt-2 max-w-md mx-auto">
              Analytics data will appear once performance appraisals are created and completed.
              Start by creating appraisal cycles and templates.
            </p>
            <div className="mt-6 flex gap-4 justify-center">
              <Link
                href="/performance/cycles"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                View Cycles
              </Link>
              <Link
                href="/performance/templates"
                className="bg-white hover:bg-gray-50 text-gray-800 border px-6 py-2 rounded-lg font-medium"
              >
                View Templates
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}