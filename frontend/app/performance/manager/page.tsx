// app/performance/manager/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/(system)/context/authContext';
import { performanceApi } from '@/app/utils/performanceApi';
import { AppraisalAssignment, AppraisalAssignmentStatus, AppraisalCycle } from '@/app/types/performance';
import Link from 'next/link';
import { 
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  Search,
  Filter,
  ChevronRight,
  PlusCircle
} from 'lucide-react';

export default function ManagerDashboardPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<AppraisalAssignment[]>([]);
  const [cycles, setCycles] = useState<AppraisalCycle[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<AppraisalAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppraisalAssignmentStatus | 'ALL'>('ALL');
  const [cycleFilter, setCycleFilter] = useState<string>('ALL');

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch manager's assignments
      if (user?.id) {
        const assignmentsData = await performanceApi.getManagerAppraisalAssignments(user.id);
        setAssignments(assignmentsData);
        setFilteredAssignments(assignmentsData);
      }
      
      // Fetch active cycles
      const cyclesData = await performanceApi.getAllAppraisalCycles();
      const activeCycles = cyclesData.filter(cycle => 
        cycle.status === 'ACTIVE' || cycle.status === 'PLANNED'
      );
      setCycles(activeCycles);
      
    } catch (error) {
      console.error('Error fetching manager data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    filterAssignments();
  }, [searchTerm, statusFilter, cycleFilter, assignments]);

  const filterAssignments = () => {
    let filtered = [...assignments];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(assignment => {
        const employee = assignment.employeeProfileId as any;
        const employeeName = employee?.firstName + ' ' + employee?.lastName;
        return employeeName?.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(assignment => assignment.status === statusFilter);
    }

    // Apply cycle filter
    if (cycleFilter !== 'ALL') {
      filtered = filtered.filter(assignment => {
        if (typeof assignment.cycleId === 'object') {
          return (assignment.cycleId as any)._id === cycleFilter;
        }
        return assignment.cycleId === cycleFilter;
      });
    }

    setFilteredAssignments(filtered);
  };

  const getAssignmentStatusIcon = (status: AppraisalAssignmentStatus) => {
    switch (status) {
      case AppraisalAssignmentStatus.PUBLISHED:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case AppraisalAssignmentStatus.SUBMITTED:
        return <FileText className="h-5 w-5 text-blue-500" />;
      case AppraisalAssignmentStatus.IN_PROGRESS:
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case AppraisalAssignmentStatus.NOT_STARTED:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
      case AppraisalAssignmentStatus.ACKNOWLEDGED:
        return <CheckCircle className="h-5 w-5 text-purple-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAssignmentStatusColor = (status: AppraisalAssignmentStatus) => {
    switch (status) {
      case AppraisalAssignmentStatus.PUBLISHED:
        return 'bg-green-100 text-green-800';
      case AppraisalAssignmentStatus.SUBMITTED:
        return 'bg-blue-100 text-blue-800';
      case AppraisalAssignmentStatus.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-800';
      case AppraisalAssignmentStatus.NOT_STARTED:
        return 'bg-gray-100 text-gray-800';
      case AppraisalAssignmentStatus.ACKNOWLEDGED:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEmployeeName = (assignment: AppraisalAssignment) => {
    const employee = assignment.employeeProfileId as any;
    if (employee && typeof employee === 'object') {
      return `${employee.firstName || ''} ${employee.lastName || ''}`.trim();
    }
    return 'Unknown Employee';
  };

  const getCycleName = (assignment: AppraisalAssignment) => {
    if (typeof assignment.cycleId === 'object') {
      return (assignment.cycleId as any).name || 'Unknown Cycle';
    }
    return 'Unknown Cycle';
  };

  const getTemplateName = (assignment: AppraisalAssignment) => {
    if (typeof assignment.templateId === 'object') {
      return (assignment.templateId as any).name || 'Unknown Template';
    }
    return 'Unknown Template';
  };

  const getStats = () => {
    const total = assignments.length;
    const published = assignments.filter(a => a.status === AppraisalAssignmentStatus.PUBLISHED).length;
    const submitted = assignments.filter(a => a.status === AppraisalAssignmentStatus.SUBMITTED).length;
    const inProgress = assignments.filter(a => a.status === AppraisalAssignmentStatus.IN_PROGRESS).length;
    const notStarted = assignments.filter(a => a.status === AppraisalAssignmentStatus.NOT_STARTED).length;
    const completionRate = total > 0 ? Math.round((published / total) * 100) : 0;

    return { total, published, submitted, inProgress, notStarted, completionRate };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading manager dashboard...</p>
            </div>
          </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Manage performance appraisals for your team members
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Assignments</p>
                <p className="text-3xl font-bold mt-2">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completion Rate</p>
                <p className="text-3xl font-bold mt-2">{stats.completionRate}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">In Progress</p>
                <p className="text-3xl font-bold mt-2">{stats.inProgress + stats.submitted}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Not Started</p>
                <p className="text-3xl font-bold mt-2">{stats.notStarted}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <AlertCircle className="text-gray-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Assignments List */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search by employee name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <Filter size={20} className="text-gray-500" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as AppraisalAssignmentStatus | 'ALL')}
                      className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="ALL">All Status</option>
                      <option value={AppraisalAssignmentStatus.NOT_STARTED}>Not Started</option>
                      <option value={AppraisalAssignmentStatus.IN_PROGRESS}>In Progress</option>
                      <option value={AppraisalAssignmentStatus.SUBMITTED}>Submitted</option>
                      <option value={AppraisalAssignmentStatus.PUBLISHED}>Published</option>
                      <option value={AppraisalAssignmentStatus.ACKNOWLEDGED}>Acknowledged</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar size={20} className="text-gray-500" />
                    <select
                      value={cycleFilter}
                      onChange={(e) => setCycleFilter(e.target.value)}
                      className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="ALL">All Cycles</option>
                      {cycles.map((cycle) => (
                        <option key={cycle._id} value={cycle._id}>
                          {cycle.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignments List */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Team Appraisal Assignments</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {filteredAssignments.length} assignment(s) found
                </p>
              </div>

              {filteredAssignments.length === 0 ? (
                <div className="p-8 text-center">
                  <FileText className="mx-auto text-gray-400" size={64} />
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">No assignments found</h3>
                  <p className="text-gray-600 mt-2">
                    {searchTerm || statusFilter !== 'ALL' || cycleFilter !== 'ALL'
                      ? 'Try adjusting your filters'
                      : 'No appraisal assignments assigned to you yet'}
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredAssignments.map((assignment) => (
                    <div key={assignment._id} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getAssignmentStatusIcon(assignment.status)}
                            <span className={`px-2 py-1 text-xs rounded-full ${getAssignmentStatusColor(assignment.status)}`}>
                              {assignment.status.replace('_', ' ')}
                            </span>
                          </div>
                          
                          <h3 className="font-semibold text-gray-900">
                            {getEmployeeName(assignment)}
                          </h3>
                          
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>{getCycleName(assignment)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText size={14} />
                              <span>{getTemplateName(assignment)}</span>
                            </div>
                            {assignment.dueDate && (
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Link
                            href={`/performance/manager/assignments/${assignment._id}`}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                              assignment.status === AppraisalAssignmentStatus.NOT_STARTED
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                            }`}
                          >
                            {assignment.status === AppraisalAssignmentStatus.NOT_STARTED
                              ? 'Start Evaluation'
                              : 'View Details'}
                          </Link>
                          
                          {assignment.status === AppraisalAssignmentStatus.IN_PROGRESS && (
                            <button
                              onClick={() => {/* Handle continue evaluation */}}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                              Continue
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Quick Actions and Stats */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/performance/manager/assignments"
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition"
                >
                  <FileText size={20} className="text-blue-600" />
                  <div>
                    <div className="font-medium">All Assignments</div>
                    <div className="text-sm text-gray-600">View all team appraisals</div>
                  </div>
                </Link>

                <Link
                  href="/performance/cycles"
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition"
                >
                  <Calendar size={20} className="text-green-600" />
                  <div>
                    <div className="font-medium">Active Cycles</div>
                    <div className="text-sm text-gray-600">View appraisal cycles</div>
                  </div>
                </Link>

                <div className="p-3 border rounded-lg bg-blue-50">
                  <div className="flex items-center gap-3">
                    <PlusCircle size={20} className="text-blue-600" />
                    <div>
                      <div className="font-medium text-blue-900">Need Help?</div>
                      <div className="text-sm text-blue-700">
                        Contact HR for appraisal guidelines
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Breakdown</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Published</span>
                    <span className="font-medium">{stats.published} ({stats.completionRate}%)</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${(stats.published / stats.total) * 100 || 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Submitted</span>
                    <span className="font-medium">{stats.submitted}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${(stats.submitted / stats.total) * 100 || 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">In Progress</span>
                    <span className="font-medium">{stats.inProgress}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 rounded-full" 
                      style={{ width: `${(stats.inProgress / stats.total) * 100 || 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Not Started</span>
                    <span className="font-medium">{stats.notStarted}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-400 rounded-full" 
                      style={{ width: `${(stats.notStarted / stats.total) * 100 || 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Total Team Members</span>
                  <span className="text-2xl font-bold">{stats.total}</span>
                </div>
              </div>
            </div>

            {/* Upcoming Due Dates */}
            {assignments.some(a => a.dueDate && a.status !== AppraisalAssignmentStatus.PUBLISHED) && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Due Dates</h3>
                <div className="space-y-3">
                  {assignments
                    .filter(a => a.dueDate && a.status !== AppraisalAssignmentStatus.PUBLISHED)
                    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
                    .slice(0, 3)
                    .map((assignment) => (
                      <div key={assignment._id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{getEmployeeName(assignment)}</div>
                          <div className="text-sm text-gray-600">
                            Due: {new Date(assignment.dueDate!).toLocaleDateString()}
                          </div>
                        </div>
                        <Link
                          href={`/performance/manager/assignments/${assignment._id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Evaluate
                        </Link>
                      </div>
                    ))}
                  
                  {assignments.filter(a => a.dueDate && a.status !== AppraisalAssignmentStatus.PUBLISHED).length > 3 && (
                    <div className="text-center">
                      <Link
                        href="/performance/manager/assignments"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View all due assignments
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}