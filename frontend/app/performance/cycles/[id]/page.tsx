// app/performance/cycles/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/(system)/context/authContext';
import { performanceApi } from '@/app/utils/performanceApi';
import { 
  AppraisalCycle, 
  AppraisalCycleStatus,
  AppraisalAssignment,
  AppraisalTemplate 
} from '@/app/types/performance';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  FileText, 
  CheckCircle,
  Clock,
  PlayCircle,
  Archive,
  Edit,
  MoreVertical,
  Download,
  Send,
  BarChart3,
  AlertCircle
} from 'lucide-react';

export default function CycleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const cycleId = params.id as string;
  
  const [cycle, setCycle] = useState<AppraisalCycle | null>(null);
  const [assignments, setAssignments] = useState<AppraisalAssignment[]>([]);
  const [templates, setTemplates] = useState<AppraisalTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'templates'>('overview');
  const [isCreatingAssignments, setIsCreatingAssignments] = useState(false);

  const isHR = user?.roles?.includes('HR_MANAGER') || user?.roles?.includes('HR_ADMIN') || user?.roles?.includes('SYSTEM_ADMIN');

  useEffect(() => {
    if (cycleId) {
      fetchCycleDetails();
    }
  }, [cycleId]);

  const fetchCycleDetails = async () => {
    try {
      setIsLoading(true);
      
      // Fetch cycle
      const cycleData = await performanceApi.getAppraisalCycleById(cycleId);
      setCycle(cycleData);
      
      // Fetch assignments for this cycle
      try {
        const assignmentsData = await performanceApi.getCycleAssignments(cycleId);
        setAssignments(assignmentsData);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
      
      // Fetch templates (for reference)
      try {
        const templatesData = await performanceApi.getAllAppraisalTemplates();
        setTemplates(templatesData);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
      
    } catch (error) {
      console.error('Error fetching cycle details:', error);
      router.push('/performance/cycles');
    } finally {
      setIsLoading(false);
    }
  };

  const createAssignments = async () => {
    try {
      setIsCreatingAssignments(true);
      await performanceApi.createAppraisalAssignments(cycleId);
      fetchCycleDetails(); // Refresh data
    } catch (error) {
      console.error('Error creating assignments:', error);
    } finally {
      setIsCreatingAssignments(false);
    }
  };

  const updateCycleStatus = async (status: AppraisalCycleStatus) => {
    try {
      await performanceApi.updateAppraisalCycleStatus(cycleId, status);
      fetchCycleDetails(); // Refresh data
    } catch (error) {
      console.error('Error updating cycle status:', error);
    }
  };

  const getStatusIcon = (status: AppraisalCycleStatus) => {
    switch (status) {
      case AppraisalCycleStatus.PLANNED:
        return <Clock className="h-5 w-5 text-blue-600" />;
      case AppraisalCycleStatus.ACTIVE:
        return <PlayCircle className="h-5 w-5 text-green-600" />;
      case AppraisalCycleStatus.CLOSED:
        return <CheckCircle className="h-5 w-5 text-gray-600" />;
      case AppraisalCycleStatus.ARCHIVED:
        return <Archive className="h-5 w-5 text-purple-600" />;
    }
  };

  const getStatusColor = (status: AppraisalCycleStatus) => {
    switch (status) {
      case AppraisalCycleStatus.PLANNED: return 'bg-blue-100 text-blue-800 border-blue-200';
      case AppraisalCycleStatus.ACTIVE: return 'bg-green-100 text-green-800 border-green-200';
      case AppraisalCycleStatus.CLOSED: return 'bg-gray-100 text-gray-800 border-gray-200';
      case AppraisalCycleStatus.ARCHIVED: return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  const getAssignmentStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800';
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'NOT_STARTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCycleActions = () => {
    if (!cycle || !isHR) return [];
    
    const actions = [];
    
    switch (cycle.status) {
      case AppraisalCycleStatus.PLANNED:
        actions.push({
          label: 'Activate Cycle',
          icon: <PlayCircle size={16} />,
          action: () => updateCycleStatus(AppraisalCycleStatus.ACTIVE),
          color: 'bg-green-600 hover:bg-green-700'
        });
        break;
      case AppraisalCycleStatus.ACTIVE:
        actions.push({
          label: 'Close Cycle',
          icon: <CheckCircle size={16} />,
          action: () => updateCycleStatus(AppraisalCycleStatus.CLOSED),
          color: 'bg-gray-600 hover:bg-gray-700'
        });
        break;
      case AppraisalCycleStatus.CLOSED:
        actions.push({
          label: 'Archive Cycle',
          icon: <Archive size={16} />,
          action: () => updateCycleStatus(AppraisalCycleStatus.ARCHIVED),
          color: 'bg-purple-600 hover:bg-purple-700'
        });
        break;
    }

    return actions;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-700">Loading cycle details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cycle) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <AlertCircle className="mx-auto text-gray-400" size={64} />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">Cycle Not Found</h3>
            <p className="text-gray-700 mt-2">The requested appraisal cycle could not be found.</p>
            <Link
              href="/performance/cycles"
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Back to Cycles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const cycleActions = getCycleActions();
  const assignmentStats = {
    total: assignments.length,
    published: assignments.filter(a => a.status === 'PUBLISHED').length,
    submitted: assignments.filter(a => a.status === 'SUBMITTED').length,
    inProgress: assignments.filter(a => a.status === 'IN_PROGRESS').length,
    notStarted: assignments.filter(a => a.status === 'NOT_STARTED').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-start gap-4">
            <Link
              href="/performance/cycles"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mt-1"
            >
              <ArrowLeft size={20} />
              Back
            </Link>
            <div>
              <div className="flex items-center gap-3">
                {getStatusIcon(cycle.status)}
                <span className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(cycle.status)}`}>
                  {cycle.status}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">{cycle.name}</h1>
              {cycle.description && (
                <p className="text-gray-700 mt-1">{cycle.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {isHR && cycleActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`flex items-center gap-2 ${action.color} text-white px-4 py-2 rounded-lg font-medium transition`}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
            
            {isHR && cycle.status === AppraisalCycleStatus.ACTIVE && assignments.length === 0 && (
              <button
                onClick={createAssignments}
                disabled={isCreatingAssignments}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
              >
                {isCreatingAssignments ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Users size={18} />
                    Create Assignments
                  </>
                )}
              </button>
            )}
            
            {isHR && (
              <Link
                href={`/performance/analytics?cycleId=${cycleId}`}
                className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border px-4 py-2 rounded-lg font-medium transition"
              >
                <BarChart3 size={18} />
                Analytics
              </Link>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === 'assignments'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Assignments ({assignments.length})
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === 'templates'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Templates ({cycle.templateAssignments?.length || 0})
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Cycle Details */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cycle Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Cycle Type</label>
                    <p className="mt-1 text-gray-900 font-medium">{cycle.cycleType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Start Date</label>
                    <p className="mt-1 text-gray-900 font-medium">
                      {new Date(cycle.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">End Date</label>
                    <p className="mt-1 text-gray-900 font-medium">
                      {new Date(cycle.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {cycle.managerDueDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Manager Due Date</label>
                      <p className="mt-1 text-gray-900 font-medium">
                        {new Date(cycle.managerDueDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {cycle.employeeAcknowledgementDueDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Employee Acknowledgement Due</label>
                      <p className="mt-1 text-gray-900 font-medium">
                        {new Date(cycle.employeeAcknowledgementDueDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Created</label>
                    <p className="mt-1 text-gray-900 font-medium">
                      {new Date(cycle.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment Statistics */}
            {assignments.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{assignmentStats.total}</div>
                    <div className="text-sm text-gray-700">Total Assignments</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{assignmentStats.published}</div>
                    <div className="text-sm text-gray-700">Published</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{assignmentStats.inProgress}</div>
                    <div className="text-sm text-gray-700">In Progress</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{assignmentStats.notStarted}</div>
                    <div className="text-sm text-gray-700">Not Started</div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {assignments.slice(0, 5).map((assignment) => (
                  <div key={assignment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`px-2 py-1 text-xs rounded-full ${getAssignmentStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </div>
                      <span className="text-gray-800">
                        {typeof assignment.employeeProfileId === 'object' 
                          ? `${assignment.employeeProfileId.firstName} ${assignment.employeeProfileId.lastName}`
                          : 'Employee'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700">
                      Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                
                {assignments.length === 0 && (
                  <div className="text-center py-8 text-gray-700">
                    <Users className="mx-auto text-gray-400" size={32} />
                    <p className="mt-2">No assignments created yet</p>
                    {isHR && cycle.status === AppraisalCycleStatus.ACTIVE && (
                      <button
                        onClick={createAssignments}
                        className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Create assignments to get started
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Appraisal Assignments</h3>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                    <Download size={16} />
                    Export
                  </button>
                </div>
              </div>
            </div>
            
            {assignments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Employee</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Manager</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Assigned Date</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((assignment) => (
                      <tr key={assignment._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">
                            {typeof assignment.employeeProfileId === 'object' 
                              ? `${assignment.employeeProfileId.firstName} ${assignment.employeeProfileId.lastName}`
                              : 'Employee'}
                          </div>
                          {typeof assignment.employeeProfileId === 'object' && assignment.employeeProfileId.position && (
                            <div className="text-sm text-gray-700">{assignment.employeeProfileId.position}</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">
                            {typeof assignment.managerProfileId === 'object' 
                              ? `${assignment.managerProfileId.firstName} ${assignment.managerProfileId.lastName}`
                              : 'Manager'}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getAssignmentStatusColor(assignment.status)}`}>
                            {assignment.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {new Date(assignment.assignedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Link
                              href={`/performance/review/${assignment.latestAppraisalId || assignment._id}`}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View
                            </Link>
                            {isHR && (
                              <button className="text-gray-600 hover:text-gray-900">
                                <MoreVertical size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Users className="mx-auto text-gray-400" size={48} />
                <h4 className="mt-4 text-lg font-semibold text-gray-900">No Assignments</h4>
                <p className="text-gray-700 mt-2">
                  {cycle.status === AppraisalCycleStatus.ACTIVE
                    ? 'Create assignments to start the appraisal process.'
                    : 'Assignments will be available when the cycle is active.'}
                </p>
                {isHR && cycle.status === AppraisalCycleStatus.ACTIVE && (
                  <button
                    onClick={createAssignments}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Create Assignments
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Assigned Templates</h3>
              <p className="text-gray-700 mt-1">
                Templates assigned to departments in this cycle
              </p>
            </div>
            
            {cycle.templateAssignments && cycle.templateAssignments.length > 0 ? (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cycle.templateAssignments.map((assignment, index) => {
                    const template = templates.find(t => t._id === assignment.templateId);
                    return (
                      <div key={index} className="border rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {template?.name || 'Template not found'}
                            </h4>
                            {template && (
                              <p className="text-sm text-gray-700 mt-1">{template.description}</p>
                            )}
                          </div>
                          {template && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              {template.templateType}
                            </span>
                          )}
                        </div>
                        
                        <div className="mt-4">
                          <div className="text-sm font-medium text-gray-800 mb-2">Assigned Departments:</div>
                          <div className="flex flex-wrap gap-2">
                            {assignment.departmentIds.map((deptId, idx) => (
                              <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                                Department {idx + 1}
                              </span>
                            ))}
                            {assignment.departmentIds.length === 0 && (
                              <span className="text-sm text-gray-600">All departments</span>
                            )}
                          </div>
                        </div>
                        
                        {template && (
                          <div className="mt-4 flex items-center justify-between pt-4 border-t">
                            <div className="text-sm text-gray-700">
                              {template.criteria.length} criteria
                            </div>
                            <Link
                              href={`/performance/templates/${template._id}`}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View Template
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <FileText className="mx-auto text-gray-400" size={48} />
                <h4 className="mt-4 text-lg font-semibold text-gray-900">No Templates Assigned</h4>
                <p className="text-gray-700 mt-2">
                  This cycle doesn't have any templates assigned yet.
                </p>
                {isHR && (
                  <Link
                    href="/performance/cycles"
                    className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Edit Cycle
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}