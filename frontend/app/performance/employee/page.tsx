// app/performance/employee/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/(system)/context/authContext';
import { performanceApi } from '@/app/utils/performanceApi';
import {
  AppraisalAssignment,
  AppraisalAssignmentStatus,
  AppraisalRecordStatus
} from '@/app/types/performance';
import Link from 'next/link';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Calendar,
  User,
  TrendingUp,
  BarChart3,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';

export default function EmployeePage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<AppraisalAssignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<AppraisalAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    if (user?.id) {
      fetchEmployeeAppraisals();
    }
  }, [user]);

  useEffect(() => {
    filterAssignments();
  }, [searchTerm, statusFilter, assignments]);

  const fetchEmployeeAppraisals = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Use the employee's profile ID to fetch their appraisals
      const data = await performanceApi.getEmployeeAppraisals(user?.id || '');
      setAssignments(data);
      setFilteredAssignments(data);
      
    } catch (error: any) {
      console.error('Error fetching employee appraisals:', error);
      setError(error.response?.data?.message || 'Failed to load your appraisals. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterAssignments = () => {
    let filtered = [...assignments];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(assignment => {
        const cycleName = assignment.cycleId && typeof assignment.cycleId === 'object'
          ? assignment.cycleId.name.toLowerCase()
          : '';
        
        const templateName = assignment.templateId && typeof assignment.templateId === 'object'
          ? assignment.templateId.name.toLowerCase()
          : '';
        
        return (
          cycleName.includes(searchTerm.toLowerCase()) ||
          templateName.includes(searchTerm.toLowerCase())
        );
      });
    }

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(assignment => assignment.status === statusFilter);
    }

    setFilteredAssignments(filtered);
  };

  const getStatusColor = (status: AppraisalAssignmentStatus) => {
    switch (status) {
      case AppraisalAssignmentStatus.NOT_STARTED: return 'bg-red-100 text-red-800';
      case AppraisalAssignmentStatus.IN_PROGRESS: return 'bg-yellow-100 text-yellow-800';
      case AppraisalAssignmentStatus.SUBMITTED: return 'bg-blue-100 text-blue-800';
      case AppraisalAssignmentStatus.PUBLISHED: return 'bg-green-100 text-green-800';
      case AppraisalAssignmentStatus.ACKNOWLEDGED: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: AppraisalAssignmentStatus) => {
    switch (status) {
      case AppraisalAssignmentStatus.NOT_STARTED: return <AlertCircle className="h-4 w-4" />;
      case AppraisalAssignmentStatus.IN_PROGRESS: return <Clock className="h-4 w-4" />;
      case AppraisalAssignmentStatus.SUBMITTED: return <FileText className="h-4 w-4" />;
      case AppraisalAssignmentStatus.PUBLISHED: return <CheckCircle className="h-4 w-4" />;
      case AppraisalAssignmentStatus.ACKNOWLEDGED: return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusDescription = (status: AppraisalAssignmentStatus) => {
    switch (status) {
      case AppraisalAssignmentStatus.NOT_STARTED: return 'Awaiting manager review';
      case AppraisalAssignmentStatus.IN_PROGRESS: return 'Manager is evaluating';
      case AppraisalAssignmentStatus.SUBMITTED: return 'Submitted to HR for review';
      case AppraisalAssignmentStatus.PUBLISHED: return 'Published - Ready to view';
      case AppraisalAssignmentStatus.ACKNOWLEDGED: return 'Acknowledged by you';
      default: return 'In progress';
    }
  };

  const getActionForAssignment = (assignment: AppraisalAssignment) => {
    switch (assignment.status) {
      case AppraisalAssignmentStatus.PUBLISHED:
        return {
          label: 'View Results',
          href: `/performance/review/${assignment.latestAppraisalId || assignment._id}`,
          color: 'bg-green-600 hover:bg-green-700'
        };
      case AppraisalAssignmentStatus.ACKNOWLEDGED:
        return {
          label: 'View Details',
          href: `/performance/review/${assignment.latestAppraisalId || assignment._id}`,
          color: 'bg-blue-600 hover:bg-blue-700'
        };
      default:
        return {
          label: 'View Status',
          href: '#',
          color: 'bg-gray-600 hover:bg-gray-700'
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-700">Loading your appraisals...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <AlertCircle className="mx-auto text-red-400" size={64} />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">Error Loading Appraisals</h3>
            <p className="text-gray-700 mt-2">{error}</p>
            <button
              onClick={fetchEmployeeAppraisals}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const publishedCount = assignments.filter(a => a.status === AppraisalAssignmentStatus.PUBLISHED).length;
  const pendingCount = assignments.filter(a => 
    a.status === AppraisalAssignmentStatus.NOT_STARTED || 
    a.status === AppraisalAssignmentStatus.IN_PROGRESS ||
    a.status === AppraisalAssignmentStatus.SUBMITTED
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="text-blue-600" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Performance Appraisals</h1>
                <p className="text-gray-700 mt-1">
                  View and manage your performance reviews
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{assignments.length}</div>
              <div className="text-sm text-gray-700">Total Appraisals</div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{publishedCount}</div>
                <div className="text-sm text-gray-700">Published</div>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={20} />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Appraisals ready for your review
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{pendingCount}</div>
                <div className="text-sm text-gray-700">Pending</div>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="text-yellow-600" size={20} />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Awaiting manager or HR review
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {assignments.length > 0 ? Math.round((publishedCount / assignments.length) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-700">Completion Rate</div>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="text-blue-600" size={20} />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Percentage of completed cycles
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
                <input
                  type="text"
                  placeholder="Search by cycle name or template..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-600"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-600" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                >
                  <option value="ALL">All Status</option>
                  <option value={AppraisalAssignmentStatus.NOT_STARTED}>Not Started</option>
                  <option value={AppraisalAssignmentStatus.IN_PROGRESS}>In Progress</option>
                  <option value={AppraisalAssignmentStatus.SUBMITTED}>Submitted</option>
                  <option value={AppraisalAssignmentStatus.PUBLISHED}>Published</option>
                  <option value={AppraisalAssignmentStatus.ACKNOWLEDGED}>Acknowledged</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Appraisals List */}
        {filteredAssignments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <FileText className="mx-auto text-gray-400" size={64} />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">No Appraisals Found</h3>
            <p className="text-gray-700 mt-2 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'ALL' 
                ? 'Try adjusting your search or filters'
                : 'You don\'t have any performance appraisals assigned yet.'}
            </p>
            {!searchTerm && statusFilter === 'ALL' && (
              <p className="text-gray-600 mt-4">
                Appraisals will appear here when your manager assigns them.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => {
              const action = getActionForAssignment(assignment);
              const cycle = assignment.cycleId && typeof assignment.cycleId === 'object' ? assignment.cycleId : null;
              const template = assignment.templateId && typeof assignment.templateId === 'object' ? assignment.templateId : null;
              const manager = assignment.managerProfileId && typeof assignment.managerProfileId === 'object' ? assignment.managerProfileId : null;
              
              return (
                <div key={assignment._id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {getStatusIcon(assignment.status)}
                        <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(assignment.status)}`}>
                          {assignment.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900">
                        {cycle?.name || 'Performance Appraisal'}
                      </h3>
                      
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-4 text-sm text-gray-700">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>
                              {cycle?.startDate ? new Date(cycle.startDate).toLocaleDateString() : 'N/A'} - {cycle?.endDate ? new Date(cycle.endDate).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                          
                          {template && (
                            <div className="flex items-center gap-1">
                              <FileText size={14} />
                              <span>{template.name}</span>
                            </div>
                          )}
                        </div>
                        
                        {manager && (
                          <div className="text-sm text-gray-700">
                            Reviewer: {manager.firstName} {manager.lastName}
                          </div>
                        )}
                        
                        <p className="text-sm text-gray-600 mt-2">
                          {getStatusDescription(assignment.status)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-between items-end">
                      <div className="text-right">
                        <div className="text-sm text-gray-700">Assigned</div>
                        <div className="text-gray-900 font-medium">
                          {new Date(assignment.assignedAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {action.href !== '#' ? (
                        <Link
                          href={action.href}
                          className={`${action.color} text-white px-4 py-2 rounded-lg font-medium transition inline-flex items-center gap-2`}
                        >
                          {action.label}
                          <ChevronRight size={16} />
                        </Link>
                      ) : (
                        <span className="text-gray-600 text-sm">
                          {action.label}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Additional Details */}
                  <div className="mt-6 pt-6 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-700">Cycle Type</div>
                      <div className="text-gray-900 font-medium">
                        {cycle?.cycleType || 'N/A'}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-700">Template Type</div>
                      <div className="text-gray-900 font-medium">
                        {template?.templateType || 'N/A'}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-700">Department</div>
                      <div className="text-gray-900 font-medium">
                        {assignment.departmentId && typeof assignment.departmentId === 'object'
                          ? assignment.departmentId.name
                          : 'N/A'}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-700">Due Date</div>
                      <div className="text-gray-900 font-medium">
                        {assignment.dueDate 
                          ? new Date(assignment.dueDate).toLocaleDateString()
                          : 'Not specified'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle size={20} />
            About Performance Appraisals
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">What to Expect</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Managers evaluate performance based on set criteria</li>
                <li>• HR reviews and publishes finalized appraisals</li>
                <li>• You have 7 days to raise disputes after publication</li>
                <li>• Historical records are maintained for reference</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Your Actions</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <strong>Published</strong>: View results and raise disputes if needed</li>
                <li>• <strong>Acknowledged</strong>: You've reviewed and accepted the appraisal</li>
                <li>• <strong>Other statuses</strong>: Awaiting review process completion</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}