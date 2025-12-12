// app/performance/manager/assignments/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/(system)/context/authContext';
import { performanceApi } from '@/app/utils/performanceApi';
import {
  AppraisalAssignment,
  AppraisalRecord,
  AppraisalTemplate,
  AppraisalRecordStatus,
  AppraisalAssignmentStatus
} from '@/app/types/performance';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  FileText,
  CheckCircle,
  Clock,
  User,
  Target,
  BarChart3,
  AlertCircle,
  Send,
  Eye,
  Download,
  Calendar,
  Users,
  ChevronRight
} from 'lucide-react';

export default function ManagerAssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const assignmentId = params.id as string;
  
  const [assignment, setAssignment] = useState<AppraisalAssignment | null>(null);
  const [record, setRecord] = useState<AppraisalRecord | null>(null);
  const [template, setTemplate] = useState<AppraisalTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isManager = user?.roles?.includes('DEPARTMENT_HEAD');

  useEffect(() => {
    if (assignmentId && isManager) {
      fetchAssignmentDetails();
    } else if (!isManager) {
      router.push('/performance/employee');
    }
  }, [assignmentId, isManager]);

  const fetchAssignmentDetails = async () => {
    try {
      setIsLoading(true);
      
      // Fetch assignment
      const assignmentData = await performanceApi.getAppraisalAssignmentById(assignmentId);
      setAssignment(assignmentData);
      
      // Try to fetch existing record
      try {
        if (assignmentData.latestAppraisalId) {
          const recordData = await performanceApi.getAppraisalRecordById(assignmentData.latestAppraisalId);
          setRecord(recordData);
        }
      } catch (error) {
        console.log('No existing record found');
      }
      
      // Fetch template
      if (assignmentData.templateId && typeof assignmentData.templateId === 'string') {
        try {
          const templateData = await performanceApi.getAppraisalTemplateById(assignmentData.templateId);
          setTemplate(templateData);
        } catch (error) {
          console.error('Error fetching template:', error);
        }
      }
      
    } catch (error) {
      console.error('Error fetching assignment details:', error);
      router.push('/performance/manager');
    } finally {
      setIsLoading(false);
    }
  };

  const startReview = () => {
    if (!assignment) return;
    
    // If record exists, go to edit it
    if (record) {
      router.push(`/performance/review/${record._id}`);
    } else {
      // Create a new record and redirect
      // In a real app, you'd create the record first
      // For now, we'll redirect to create a new review
      router.push(`/performance/review/new?assignmentId=${assignment._id}`);
    }
  };

  const submitReview = async () => {
    if (!assignment || !record) return;
    
    try {
      setIsSubmitting(true);
      await performanceApi.submitAppraisalRecord(assignment._id as string);
      fetchAssignmentDetails(); // Refresh data
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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

  const getRecordStatusColor = (status?: AppraisalRecordStatus) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status) {
      case AppraisalRecordStatus.DRAFT: return 'bg-yellow-100 text-yellow-800';
      case AppraisalRecordStatus.MANAGER_SUBMITTED: return 'bg-blue-100 text-blue-800';
      case AppraisalRecordStatus.HR_PUBLISHED: return 'bg-green-100 text-green-800';
      case AppraisalRecordStatus.ARCHIVED: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canStartReview = () => {
    return assignment && 
           (assignment.status === AppraisalAssignmentStatus.NOT_STARTED || 
            assignment.status === AppraisalAssignmentStatus.IN_PROGRESS);
  };

  const canSubmitReview = () => {
    return assignment && 
           record && 
           record.status === AppraisalRecordStatus.DRAFT &&
           assignment.status === AppraisalAssignmentStatus.IN_PROGRESS;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-700">Loading assignment details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isManager) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <AlertCircle className="mx-auto text-gray-400" size={64} />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">Access Denied</h3>
            <p className="text-gray-700 mt-2">Only managers can access this page.</p>
            <Link
              href="/performance/employee"
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Go to Employee Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <AlertCircle className="mx-auto text-gray-400" size={64} />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">Assignment Not Found</h3>
            <p className="text-gray-700 mt-2">The requested assignment could not be found.</p>
            <Link
              href="/performance/manager"
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Back to Manager Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const employeeName = assignment.employeeProfileId && typeof assignment.employeeProfileId === 'object'
    ? `${assignment.employeeProfileId.firstName} ${assignment.employeeProfileId.lastName}`
    : 'Employee';

  const managerName = assignment.managerProfileId && typeof assignment.managerProfileId === 'object'
    ? `${assignment.managerProfileId.firstName} ${assignment.managerProfileId.lastName}`
    : 'Manager';

  const departmentName = assignment.departmentId && typeof assignment.departmentId === 'object'
    ? assignment.departmentId.name
    : 'Department';

  const cycleName = assignment.cycleId && typeof assignment.cycleId === 'object'
    ? assignment.cycleId.name
    : 'Cycle';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-start gap-4">
            <Link
              href="/performance/manager"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mt-1"
            >
              <ArrowLeft size={20} />
              Back to Assignments
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="text-blue-600" size={20} />
                </div>
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(assignment.status)}`}>
                  {assignment.status.replace('_', ' ')}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">
                Review Assignment: {employeeName}
              </h1>
              <p className="text-gray-700 mt-1">
                {cycleName} • Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {canStartReview() && (
              <button
                onClick={startReview}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                {record ? (
                  <>
                    <Edit size={18} />
                    Continue Review
                  </>
                ) : (
                  <>
                    <FileText size={18} />
                    Start Review
                  </>
                )}
              </button>
            )}
            
            {canSubmitReview() && (
              <button
                onClick={submitReview}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Review
                  </>
                )}
              </button>
            )}
            
            <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border px-4 py-2 rounded-lg font-medium transition">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        {/* Assignment Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Employee Information */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={20} />
              Employee Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <p className="mt-1 text-gray-900 font-medium">{employeeName}</p>
              </div>
              
              {assignment.employeeProfileId && typeof assignment.employeeProfileId === 'object' && (
                <>
                  {assignment.employeeProfileId.position && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Position</label>
                      <p className="mt-1 text-gray-900">{assignment.employeeProfileId.position}</p>
                    </div>
                  )}
                  
                  {assignment.employeeProfileId.email && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-gray-900">{assignment.employeeProfileId.email}</p>
                    </div>
                  )}
                </>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-700">Department</label>
                <p className="mt-1 text-gray-900">{departmentName}</p>
              </div>
            </div>
          </div>

          {/* Assignment Status */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              Assignment Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Status</span>
                <span className={`px-2 py-1 text-sm rounded-full ${getStatusColor(assignment.status)}`}>
                  {assignment.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-700">Assigned Date</span>
                <span className="text-gray-900">
                  {new Date(assignment.assignedAt).toLocaleDateString()}
                </span>
              </div>
              
              {assignment.dueDate && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Due Date</span>
                  <span className="text-gray-900">
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              {assignment.submittedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Submitted Date</span>
                  <span className="text-gray-900">
                    {new Date(assignment.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              {assignment.publishedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Published Date</span>
                  <span className="text-gray-900">
                    {new Date(assignment.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Review Progress */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target size={20} />
              Review Progress
            </h3>
            <div className="space-y-4">
              {record ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Review Status</span>
                    <span className={`px-2 py-1 text-sm rounded-full ${getRecordStatusColor(record.status)}`}>
                      {record.status?.replace('_', ' ') || 'Not Started'}
                    </span>
                  </div>
                  
                  {record.totalScore !== undefined && (
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">
                        {record.totalScore.toFixed(2)}
                      </div>
                      <div className="text-gray-700 mt-1">Current Score</div>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <Link
                      href={`/performance/review/${record._id}`}
                      className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <Eye size={18} />
                      View Full Review
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="text-gray-500">No review started yet</div>
                  <button
                    onClick={startReview}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Start Review
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Template & Actions */}
          <div className="lg:col-span-2">
            {/* Template Information */}
            {template && (
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Evaluation Template
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    {template.description && (
                      <p className="text-gray-700 mt-1">{template.description}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Template Type</label>
                      <p className="mt-1 text-gray-900">{template.templateType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Rating Scale</label>
                      <p className="mt-1 text-gray-900">
                        {template.ratingScale.min} - {template.ratingScale.max}
                        {template.ratingScale.labels && template.ratingScale.labels.length > 0 && (
                          <span className="text-gray-600 ml-2">({template.ratingScale.labels.join(', ')})</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Evaluation Criteria</label>
                    <div className="mt-2 space-y-2">
                      {template.criteria.slice(0, 3).map((criterion, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-900">{criterion.title}</span>
                          {criterion.weight && (
                            <span className="text-sm text-gray-600">({criterion.weight}%)</span>
                          )}
                        </div>
                      ))}
                      {template.criteria.length > 3 && (
                        <div className="text-gray-600 text-sm">
                          + {template.criteria.length - 3} more criteria
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {template.instructions && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-1">Instructions:</div>
                      <div className="text-gray-900 text-sm">{template.instructions}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cycle Information */}
            {assignment.cycleId && typeof assignment.cycleId === 'object' && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar size={20} />
                  Appraisal Cycle
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Cycle Name</label>
                    <p className="mt-1 text-gray-900 font-medium">{assignment.cycleId.name}</p>
                    {assignment.cycleId.description && (
                      <p className="text-gray-700 mt-1 text-sm">{assignment.cycleId.description}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Cycle Type</label>
                    <p className="mt-1 text-gray-900">{assignment.cycleId.cycleType}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Start Date</label>
                    <p className="mt-1 text-gray-900">
                      {new Date(assignment.cycleId.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">End Date</label>
                    <p className="mt-1 text-gray-900">
                      {new Date(assignment.cycleId.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-700">Cycle Status</label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 text-sm rounded-full ${
                        assignment.cycleId.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        assignment.cycleId.status === 'PLANNED' ? 'bg-blue-100 text-blue-800' :
                        assignment.cycleId.status === 'CLOSED' ? 'bg-gray-100 text-gray-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {assignment.cycleId.status}
                      </span>
                      {assignment.cycleId.managerDueDate && (
                        <span className="text-sm text-gray-700">
                          Manager due: {new Date(assignment.cycleId.managerDueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Actions & Timeline */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                {canStartReview() && (
                  <button
                    onClick={startReview}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition"
                  >
                    {record ? (
                      <>
                        <Edit size={18} />
                        Continue Review
                      </>
                    ) : (
                      <>
                        <FileText size={18} />
                        Start New Review
                      </>
                    )}
                  </button>
                )}
                
                {canSubmitReview() && (
                  <button
                    onClick={submitReview}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : (
                      <>
                        <Send size={18} />
                        Submit to HR
                      </>
                    )}
                  </button>
                )}
                
                <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border px-4 py-3 rounded-lg font-medium transition">
                  <Download size={18} />
                  Download Template
                </button>
                
                <Link
                  href={`/performance/analytics?employeeId=${assignment.employeeProfileId}`}
                  className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium transition"
                >
                  View Performance History
                </Link>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Timeline</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Assignment Created</div>
                    <div className="text-sm text-gray-700">
                      {new Date(assignment.assignedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                {record && (
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Review Started</div>
                      <div className="text-sm text-gray-700">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
                
                {assignment.submittedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Submitted to HR</div>
                      <div className="text-sm text-gray-700">
                        {new Date(assignment.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
                
                {assignment.publishedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Published to Employee</div>
                      <div className="text-sm text-gray-700">
                        {new Date(assignment.publishedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
              
              <div className="space-y-3">
                {assignment.status === AppraisalAssignmentStatus.NOT_STARTED && (
                  <>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="text-green-600 mt-0.5" size={18} />
                      <div>
                        <div className="font-medium text-gray-900">Start the review</div>
                        <div className="text-sm text-gray-700">Click "Start Review" to begin evaluation</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="text-gray-600 mt-0.5" size={18} />
                      <div>
                        <div className="font-medium text-gray-900">Review due date</div>
                        <div className="text-sm text-gray-700">
                          {assignment.dueDate 
                            ? `Due by ${new Date(assignment.dueDate).toLocaleDateString()}`
                            : 'No specific due date'}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {assignment.status === AppraisalAssignmentStatus.IN_PROGRESS && (
                  <>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="text-green-600 mt-0.5" size={18} />
                      <div>
                        <div className="font-medium text-gray-900">Continue editing</div>
                        <div className="text-sm text-gray-700">Click "Continue Review" to complete evaluation</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Send className="text-blue-600 mt-0.5" size={18} />
                      <div>
                        <div className="font-medium text-gray-900">Submit when ready</div>
                        <div className="text-sm text-gray-700">Submit completed review to HR for publishing</div>
                      </div>
                    </div>
                  </>
                )}
                
                {assignment.status === AppraisalAssignmentStatus.SUBMITTED && (
                  <div className="flex items-start gap-2">
                    <Clock className="text-blue-600 mt-0.5" size={18} />
                    <div>
                      <div className="font-medium text-gray-900">Awaiting HR review</div>
                      <div className="text-sm text-gray-700">Your review is with HR for final approval</div>
                    </div>
                  </div>
                )}
                
                {assignment.status === AppraisalAssignmentStatus.PUBLISHED && (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 mt-0.5" size={18} />
                    <div>
                      <div className="font-medium text-gray-900">Review published</div>
                      <div className="text-sm text-gray-700">The employee can now view their review</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <Link
                  href="/performance/manager"
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                >
                  <ChevronRight size={16} />
                  Back to all assignments
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}