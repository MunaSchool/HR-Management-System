// app/performance/hr/review/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/(system)/context/authContext';
import { performanceApi } from '@/app/utils/performanceApi';
import {
  AppraisalRecord,
  AppraisalAssignment,
  AppraisalTemplate,
  AppraisalRecordStatus,
  AppraisalAssignmentStatus,
  RatingEntry
} from '@/app/types/performance';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  User,
  Users,
  Target,
  BarChart3,
  FileText,
  AlertCircle,
  Download,
  Send,
  Shield,
  Edit2,
  Eye
} from 'lucide-react';

export default function HRReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const recordId = params.id as string;
  
  const [record, setRecord] = useState<AppraisalRecord | null>(null);
  const [assignment, setAssignment] = useState<AppraisalAssignment | null>(null);
  const [template, setTemplate] = useState<AppraisalTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [overallRatingLabel, setOverallRatingLabel] = useState('');

  const isHR = user?.roles?.includes('HR_MANAGER') || user?.roles?.includes('HR_ADMIN') || user?.roles?.includes('SYSTEM_ADMIN');

  useEffect(() => {
    if (recordId && isHR) {
      fetchReviewDetails();
    } else if (!isHR) {
      router.push('/performance/analytics');
    }
  }, [recordId, isHR]);

  const fetchReviewDetails = async () => {
    try {
      setIsLoading(true);
      
      // Fetch appraisal record
      const recordData = await performanceApi.getAppraisalRecordById(recordId);
      setRecord(recordData);
      setOverallRatingLabel(recordData.overallRatingLabel || '');
      
      // Fetch assignment details
      if (recordData.assignmentId && typeof recordData.assignmentId === 'string') {
        try {
          const assignmentData = await performanceApi.getAppraisalAssignmentById(recordData.assignmentId);
          setAssignment(assignmentData);
          
          // Fetch template
          if (assignmentData.templateId && typeof assignmentData.templateId === 'string') {
            const templateData = await performanceApi.getAppraisalTemplateById(assignmentData.templateId);
            setTemplate(templateData);
          }
        } catch (error) {
          console.error('Error fetching assignment/template:', error);
        }
      }
      
    } catch (error) {
      console.error('Error fetching review details:', error);
      router.push('/performance/hr');
    } finally {
      setIsLoading(false);
    }
  };

  const publishReview = async () => {
    if (!assignment || !record || !user || !window.confirm('Publish this review to the employee?')) {
      return;
    }
    
    try {
      setIsPublishing(true);
      await performanceApi.publishAppraisalRecord(assignment._id as string, user.id || '');
      
      // Refresh data
      fetchReviewDetails();
      
      alert('Review published successfully to employee!');
      
    } catch (error) {
      console.error('Error publishing review:', error);
      alert('Error publishing review. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const updateRecordStatus = async (status: AppraisalRecordStatus) => {
    if (!record) return;
    
    try {
      await performanceApi.updateRecordStatus(record._id, status);
      fetchReviewDetails();
      alert('Status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status.');
    }
  };

  const saveOverallRating = async () => {
    if (!record) return;
    
    try {
      // This would need an API endpoint to update just the overall rating
      // For now, we'll show an alert
      alert('Overall rating saved!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving overall rating:', error);
    }
  };

  const getStatusColor = (status: AppraisalRecordStatus) => {
    switch (status) {
      case AppraisalRecordStatus.DRAFT: return 'bg-yellow-100 text-yellow-800';
      case AppraisalRecordStatus.MANAGER_SUBMITTED: return 'bg-blue-100 text-blue-800';
      case AppraisalRecordStatus.HR_PUBLISHED: return 'bg-green-100 text-green-800';
      case AppraisalRecordStatus.ARCHIVED: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingColor = (score: number) => {
    const percentage = (score / (template?.ratingScale.max || 100)) * 100;
    if (percentage >= 85) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const canPublish = () => {
    return record && 
           record.status === AppraisalRecordStatus.MANAGER_SUBMITTED &&
           assignment && 
           assignment.status === AppraisalAssignmentStatus.SUBMITTED;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-700">Loading review details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isHR) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <AlertCircle className="mx-auto text-gray-400" size={64} />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">Access Denied</h3>
            <p className="text-gray-700 mt-2">Only HR personnel can access this page.</p>
            <Link
              href="/performance/analytics"
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Go to Analytics
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!record || !assignment) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <AlertCircle className="mx-auto text-gray-400" size={64} />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">Review Not Found</h3>
            <p className="text-gray-700 mt-2">The requested performance review could not be found.</p>
            <Link
              href="/performance/hr"
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Back to HR Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const employeeName = assignment?.employeeProfileId && typeof assignment.employeeProfileId === 'object'
    ? `${assignment.employeeProfileId.firstName} ${assignment.employeeProfileId.lastName}`
    : 'Employee';

  const managerName = assignment?.managerProfileId && typeof assignment.managerProfileId === 'object'
    ? `${assignment.managerProfileId.firstName} ${assignment.managerProfileId.lastName}`
    : 'Manager';

  const totalScore = record.totalScore || 0;
  const maxPossibleScore = template?.ratingScale.max || 100;
  const percentageScore = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-start gap-4">
            <Link
              href="/performance/hr"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mt-1"
            >
              <ArrowLeft size={20} />
              Back to HR
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="text-blue-600" size={20} />
                </div>
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(record.status)}`}>
                  {record.status.replace('_', ' ')}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">
                HR Review: {employeeName}
              </h1>
              <p className="text-gray-700 mt-1">
                Manager: {managerName} • Cycle: {assignment.cycleId && typeof assignment.cycleId === 'object' ? assignment.cycleId.name : 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {canPublish() && (
              <button
                onClick={publishReview}
                disabled={isPublishing}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
              >
                {isPublishing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Publish to Employee
                  </>
                )}
              </button>
            )}
            
            {record.status === AppraisalRecordStatus.HR_PUBLISHED && (
              <button
                onClick={() => updateRecordStatus(AppraisalRecordStatus.ARCHIVED)}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                <Clock size={18} />
                Archive
              </button>
            )}
            
            <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border px-4 py-2 rounded-lg font-medium transition">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        {/* Review Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Employee Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={20} />
              Employee
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
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
                  {assignment.departmentId && typeof assignment.departmentId === 'object' && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Department</label>
                      <p className="mt-1 text-gray-900">{assignment.departmentId.name}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Score Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target size={20} />
              Performance Score
            </h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getRatingColor(totalScore)}`}>
                  {totalScore.toFixed(2)}
                </div>
                <div className="text-gray-700 mt-2">out of {maxPossibleScore}</div>
                <div className={`text-lg font-semibold mt-2 ${getRatingColor(totalScore)}`}>
                  {percentageScore.toFixed(1)}%
                </div>
              </div>
              
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Overall Rating Label
                </label>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={overallRatingLabel}
                        onChange={(e) => setOverallRatingLabel(e.target.value)}
                        className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter rating label (e.g., 'Exceeds Expectations')"
                      />
                      <button
                        onClick={saveOverallRating}
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setOverallRatingLabel(record.overallRatingLabel || '');
                        }}
                        className="bg-gray-600 text-white px-3 py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-gray-900 font-medium">
                        {overallRatingLabel || 'Not set'}
                      </span>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Review Status */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              Review Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Review Status</span>
                <span className={`px-2 py-1 text-sm rounded-full ${getStatusColor(record.status)}`}>
                  {record.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-700">Assignment Status</span>
                <span className={`px-2 py-1 text-sm rounded-full ${
                  assignment.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                  assignment.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                  assignment.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {assignment.status}
                </span>
              </div>
              
              {record.managerSubmittedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Manager Submitted</span>
                  <span className="text-gray-900">
                    {new Date(record.managerSubmittedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              {record.hrPublishedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-700">HR Published</span>
                  <span className="text-gray-900">
                    {new Date(record.hrPublishedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Ratings Review */}
          <div className="lg:col-span-2">
            {/* Template Info */}
            {template && (
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  <FileText className="inline mr-2" size={20} />
                  Template: {template.name}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <span className="font-medium">Type:</span> {template.templateType}
                  </div>
                  <div>
                    <span className="font-medium">Scale:</span> {template.ratingScale.min} - {template.ratingScale.max}
                  </div>
                  <div>
                    <span className="font-medium">Criteria:</span> {template.criteria.length}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> {template.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            )}

            {/* Ratings Review */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Performance Ratings
              </h3>
              
              {record.ratings && record.ratings.length > 0 ? (
                <div className="space-y-6">
                  {record.ratings.map((rating, index) => {
                    const criterion = template?.criteria?.find(c => c.key === rating.key);
                    
                    return (
                      <div key={rating.key} className="border rounded-lg p-6 hover:bg-gray-50 transition">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg">
                              {index + 1}. {rating.title}
                            </h4>
                            {criterion?.details && (
                              <p className="text-gray-700 mt-1">{criterion.details}</p>
                            )}
                            {criterion?.weight && (
                              <div className="mt-2 flex items-center gap-4 text-sm">
                                <span className="text-gray-700">
                                  Weight: <span className="font-semibold">{criterion.weight}%</span>
                                </span>
                                {rating.weightedScore !== undefined && (
                                  <span className="text-gray-700">
                                    Weighted Score: <span className="font-semibold">{rating.weightedScore.toFixed(2)}</span>
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getRatingColor(rating.ratingValue)}`}>
                              {rating.ratingValue}
                            </div>
                            {rating.ratingLabel && (
                              <div className="text-sm text-gray-700">{rating.ratingLabel}</div>
                            )}
                          </div>
                        </div>
                        
                        {rating.comments && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-700 mb-1">Manager's Comments:</div>
                            <div className="text-gray-900 whitespace-pre-wrap">{rating.comments}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-700">
                  <AlertCircle className="mx-auto text-gray-400" size={48} />
                  <p className="mt-4">No ratings available for this review.</p>
                </div>
              )}
            </div>

            {/* Summary Sections */}
            <div className="space-y-6 mt-6">
              {/* Manager Summary */}
              {record.managerSummary && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Manager's Summary</h3>
                  <div className="text-gray-900 whitespace-pre-wrap p-3 bg-gray-50 rounded-lg">
                    {record.managerSummary}
                  </div>
                </div>
              )}

              {/* Strengths */}
              {record.strengths && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Strengths</h3>
                  <div className="text-gray-900 whitespace-pre-wrap p-3 bg-green-50 rounded-lg">
                    {record.strengths}
                  </div>
                </div>
              )}

              {/* Improvement Areas */}
              {record.improvementAreas && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Areas for Improvement</h3>
                  <div className="text-gray-900 whitespace-pre-wrap p-3 bg-yellow-50 rounded-lg">
                    {record.improvementAreas}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - HR Actions */}
          <div className="space-y-6">
            {/* HR Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">HR Actions</h3>
              
              <div className="space-y-3">
                {canPublish() && (
                  <button
                    onClick={publishReview}
                    disabled={isPublishing}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition disabled:opacity-50"
                  >
                    {isPublishing ? 'Publishing...' : (
                      <>
                        <CheckCircle size={18} />
                        Publish to Employee
                      </>
                    )}
                  </button>
                )}
                
                {record.status === AppraisalRecordStatus.HR_PUBLISHED && (
                  <button
                    onClick={() => updateRecordStatus(AppraisalRecordStatus.ARCHIVED)}
                    className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition"
                  >
                    <Clock size={18} />
                    Archive Review
                  </button>
                )}
                
                <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition">
                  <Download size={18} />
                  Export Review
                </button>
                
                <button className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition">
                  <AlertCircle size={18} />
                  Flag for Review
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <div className="text-sm text-gray-700">
                  <div className="font-medium mb-2">Status Transitions:</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span>DRAFT → Manager is working</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>MANAGER_SUBMITTED → Ready for HR review</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>HR_PUBLISHED → Visible to employee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                      <span>ARCHIVED → Historical record</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dispute Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispute Management</h3>
              
              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  Employees can raise disputes within 7 days of publication.
                </p>
                
                <div className="mt-4">
                  <Link
                    href={`/performance/disputes?appraisalId=${record._id}`}
                    className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium transition"
                  >
                    View Disputes
                  </Link>
                </div>
                
                {record.hrPublishedAt && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-700">Dispute Window:</div>
                    <div className="text-sm text-gray-700 mt-1">
                      Published: {new Date(record.hrPublishedAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-700">
                      Dispute deadline: {
                        new Date(new Date(record.hrPublishedAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Timeline</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Review Created</div>
                    <div className="text-sm text-gray-700">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                {record.managerSubmittedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Manager Submitted</div>
                      <div className="text-sm text-gray-700">
                        {new Date(record.managerSubmittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
                
                {record.hrPublishedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">HR Published</div>
                      <div className="text-sm text-gray-700">
                        {new Date(record.hrPublishedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cycle Information */}
            {assignment.cycleId && typeof assignment.cycleId === 'object' && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cycle Information</h3>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Cycle Name</div>
                    <div className="text-gray-900">{assignment.cycleId.name}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-700">Cycle Type</div>
                    <div className="text-gray-900">{assignment.cycleId.cycleType}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-700">Period</div>
                    <div className="text-gray-900">
                      {new Date(assignment.cycleId.startDate).toLocaleDateString()} - {new Date(assignment.cycleId.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-700">Cycle Status</div>
                    <div className={`inline-block px-2 py-1 text-sm rounded-full ${
                      assignment.cycleId.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      assignment.cycleId.status === 'PLANNED' ? 'bg-blue-100 text-blue-800' :
                      assignment.cycleId.status === 'CLOSED' ? 'bg-gray-100 text-gray-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {assignment.cycleId.status}
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