// app/performance/employee/disputes/create/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/(system)/context/authContext';
import { performanceApi } from '@/app/utils/performanceApi';
import {
  AppraisalRecord,
  AppraisalAssignment,
  AppraisalCycle
} from '@/app/types/performance';
import Link from 'next/link';
import {
  ArrowLeft,
  AlertCircle,
  FileText,
  Calendar,
  User,
  Send,
  X,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function CreateDisputePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const [record, setRecord] = useState<AppraisalRecord | null>(null);
  const [assignment, setAssignment] = useState<AppraisalAssignment | null>(null);
  const [cycle, setCycle] = useState<AppraisalCycle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [disputeDeadline, setDisputeDeadline] = useState<Date | null>(null);
  const [canDispute, setCanDispute] = useState(true);
  const [error, setError] = useState('');
  
  const appraisalId = searchParams.get('appraisalId');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (appraisalId) {
      fetchAppraisalDetails();
    } else {
      setError('No appraisal specified. Please go back and select an appraisal to dispute.');
      setIsLoading(false);
    }
  }, [appraisalId, user]);

  const fetchAppraisalDetails = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Fetch appraisal record
      const recordData = await performanceApi.getAppraisalRecordById(appraisalId!);
      setRecord(recordData);
      
      // Check if dispute is within 7-day window
      if (recordData.hrPublishedAt) {
        const daysSincePublished = Math.floor(
          (new Date().getTime() - new Date(recordData.hrPublishedAt).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (daysSincePublished > 7) {
          setCanDispute(false);
          const deadline = new Date(recordData.hrPublishedAt);
          deadline.setDate(deadline.getDate() + 7);
          setDisputeDeadline(deadline);
        }
      }
      
      // Fetch assignment details
      if (recordData.assignmentId && typeof recordData.assignmentId === 'string') {
        try {
          const assignmentData = await performanceApi.getAppraisalAssignmentById(recordData.assignmentId);
          setAssignment(assignmentData);
          
          // Fetch cycle details
          if (assignmentData.cycleId && typeof assignmentData.cycleId === 'string') {
            try {
              const cycleData = await performanceApi.getAppraisalCycleById(assignmentData.cycleId);
              setCycle(cycleData);
            } catch (error) {
              console.error('Error fetching cycle:', error);
            }
          }
        } catch (error) {
          console.error('Error fetching assignment:', error);
        }
      }
      
    } catch (error) {
      console.error('Error fetching appraisal details:', error);
      setError('Failed to load appraisal details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!record || !assignment || !user) {
      setError('Missing required information.');
      return;
    }
    
    if (!reason.trim()) {
      setError('Please provide a reason for the dispute.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const disputeData = {
        appraisalId: record._id,
        assignmentId: assignment._id as string,
        cycleId: assignment.cycleId as string,
        raisedByEmployeeId: user.id || '',
        reason: reason.trim(),
        details: details.trim() || undefined
      };
      
      await performanceApi.createAppraisalDispute(disputeData);
      
      // Redirect to employee disputes page or show success
      alert('Dispute submitted successfully! HR will review your case.');
      router.push('/performance/employee');
      
    } catch (error: any) {
      console.error('Error creating dispute:', error);
      setError(error.response?.data?.message || 'Failed to submit dispute. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-700">Loading appraisal details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !record) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <AlertCircle className="mx-auto text-red-400" size={64} />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">Error</h3>
            <p className="text-gray-700 mt-2">{error}</p>
            <Link
              href="/performance/employee"
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Back to Employee Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!canDispute && record) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <X className="text-red-600" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dispute Period Expired</h1>
                <p className="text-gray-700 mt-1">
                  The window for raising disputes has closed for this appraisal.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="text-red-600" size={18} />
                  <span className="font-medium text-red-800">7-Day Dispute Window</span>
                </div>
                <p className="text-red-700 mt-2 text-sm">
                  Employees have 7 days from the date of publication to raise disputes about their performance appraisal.
                </p>
                {disputeDeadline && (
                  <p className="text-red-700 mt-2 text-sm">
                    The dispute deadline for this appraisal was {disputeDeadline.toLocaleDateString()}.
                  </p>
                )}
              </div>
              
              {record && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Appraisal Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-700">Total Score:</span>
                      <span className="ml-2 font-medium">{record.totalScore?.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-700">Published Date:</span>
                      <span className="ml-2 font-medium">
                        {record.hrPublishedAt ? new Date(record.hrPublishedAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-4 pt-6">
                <Link
                  href="/performance/employee"
                  className="flex-1 text-center bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition"
                >
                  Back to Dashboard
                </Link>
                <Link
                  href={`/performance/review/${record?._id}`}
                  className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition"
                >
                  View Appraisal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/performance/review/${record?._id}`}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Back to Review
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Raise Performance Dispute</h1>
            </div>
            <p className="text-gray-700 mt-2">
              Submit a formal dispute regarding your performance appraisal
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6">
              {/* Dispute Notice */}
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-red-600 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-medium text-red-800">Important Information</h4>
                    <ul className="mt-2 text-red-700 text-sm space-y-1">
                      <li>• Disputes must be raised within 7 days of appraisal publication</li>
                      <li>• Provide clear reasons and evidence for your dispute</li>
                      <li>• HR will review your case and respond within 5 business days</li>
                      <li>• All disputes are treated confidentially</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Reason for Dispute *
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Briefly state the reason for your dispute"
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
                <p className="text-sm text-gray-600 mt-2">
                  Be specific about what you're disputing (e.g., "Inaccurate rating for 'Teamwork' criterion")
                </p>
              </div>

              {/* Details */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Detailed Explanation
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={6}
                  placeholder="Provide detailed explanation, evidence, or context for your dispute..."
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Include specific examples, dates, or any supporting information
                </p>
              </div>

              {/* Specific Rating Selection (Optional) */}
              {record?.ratings && record.ratings.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Specific Rating in Dispute (Optional)
                  </label>
                  <select
                    value={selectedRating || ''}
                    onChange={(e) => setSelectedRating(e.target.value || null)}
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Select a specific rating (optional)</option>
                    {record.ratings.map((rating, index) => (
                      <option key={rating.key} value={rating.key}>
                        {rating.title}: {rating.ratingValue} points
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !reason.trim()}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Submit Dispute
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Appraisal Summary */}
          <div className="space-y-6">
            {/* Appraisal Summary */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={20} />
                Appraisal Summary
              </h3>
              
              {record && (
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Total Score</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {record.totalScore?.toFixed(2)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-700">Overall Rating</div>
                    <div className="text-lg font-medium text-gray-900">
                      {record.overallRatingLabel || 'Not specified'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-700">Published Date</div>
                    <div className="text-gray-900">
                      {record.hrPublishedAt ? new Date(record.hrPublishedAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  
                  {record.managerSummary && (
                    <div>
                      <div className="text-sm font-medium text-gray-700">Manager Summary</div>
                      <div className="text-gray-900 text-sm line-clamp-3">
                        {record.managerSummary}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t">
                <Link
                  href={`/performance/review/${record?._id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  View Full Review
                  <ArrowLeft className="rotate-180" size={16} />
                </Link>
              </div>
            </div>

            {/* Cycle Information */}
            {cycle && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar size={20} />
                  Appraisal Cycle
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Cycle Name</div>
                    <div className="text-gray-900">{cycle.name}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-700">Period</div>
                    <div className="text-gray-900">
                      {new Date(cycle.startDate).toLocaleDateString()} - {new Date(cycle.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-700">Cycle Type</div>
                    <div className="text-gray-900">{cycle.cycleType}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Dispute Timeline */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispute Process</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-red-600"></div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Submit Dispute</div>
                    <div className="text-sm text-gray-700">You are here</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">HR Review</div>
                    <div className="text-sm text-gray-700">HR will review within 5 business days</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Resolution</div>
                    <div className="text-sm text-gray-700">HR will communicate the outcome</div>
                  </div>
                </div>
                
                {record?.hrPublishedAt && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-700">Dispute Deadline</div>
                    <div className="text-sm text-gray-700">
                      {new Date(new Date(record.hrPublishedAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}