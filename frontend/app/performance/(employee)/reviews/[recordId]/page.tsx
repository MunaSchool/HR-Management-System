'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { performanceApi } from '@/app/utils/performanceApi';
import { useAuth } from '@/app/(system)/context/authContext';
import {
  ArrowLeft,
  User,
  Calendar,
  Building2,
  FileText,
  Award,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  Flag
} from 'lucide-react';

export default function ViewAppraisalRecordPage() {
  const { recordId } = useParams<{ recordId: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const [record, setRecord] = useState<any>(null);
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDisputeModal, setShowDisputeModal] = useState(false);

  useEffect(() => {
    if (!recordId) return;
    fetchRecord();
  }, [recordId]);

  const fetchRecord = async () => {
    try {
      setLoading(true);
      const recordData = await performanceApi.getAppraisalRecordById(recordId);
      setRecord(recordData);

      // Template is already populated in the record
      if (typeof recordData.templateId === 'object' && recordData.templateId) {
        setTemplate(recordData.templateId);
      }
    } catch (error) {
      console.error('Error fetching record:', error);
      alert('Failed to load appraisal record');
      router.replace('/performance/reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleRaiseDispute = () => {
    setShowDisputeModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!record || !template) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600">Appraisal record not found</p>
      </div>
    );
  }

  const employee = record.employeeProfileId;
  const manager = record.managerProfileId;
  const cycle = record.cycleId;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/performance/reviews"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Performance Appraisal Results
              </h1>
            </div>
            <p className="text-gray-600">
              Review your performance evaluation and feedback
            </p>
          </div>
          <button
            onClick={handleRaiseDispute}
            className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50"
          >
            <Flag className="h-4 w-4 mr-2" />
            Raise Concern
          </button>
        </div>

        {/* Employee & Cycle Info Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Appraisal Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Employee</p>
                <p className="font-medium text-gray-900">
                  {employee?.firstName} {employee?.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  {employee?.employeeNumber && `ID: ${employee.employeeNumber}`}
                  {employee?.position && employee?.employeeNumber ? ' • ' : ''}
                  {employee?.position}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Evaluated By</p>
                <p className="font-medium text-gray-900">
                  {manager?.firstName} {manager?.lastName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Appraisal Cycle</p>
                <p className="font-medium text-gray-900">
                  {cycle?.name || 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Template</p>
                <p className="font-medium text-gray-900">
                  {template.name}
                </p>
              </div>
            </div>
          </div>

          {record.managerSubmittedAt && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-800">
                Submitted: {new Date(record.managerSubmittedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Overall Score */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Overall Score</p>
              <p className="text-4xl font-bold text-blue-600 mt-1">
                {record.totalScore?.toFixed(1) || 'N/A'}
              </p>
              {record.overallRatingLabel && (
                <p className="text-sm text-blue-700 mt-1">{record.overallRatingLabel}</p>
              )}
            </div>
            <TrendingUp className="h-16 w-16 text-blue-300" />
          </div>
        </div>

        {/* Ratings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Performance Ratings
          </h2>

          <div className="space-y-6">
            {record.ratings && record.ratings.map((rating: any, index: number) => (
              <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{rating.title}</h3>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-blue-600">{rating.ratingValue}/{template.ratingScale?.max || 5}</p>
                    {rating.ratingLabel && (
                      <p className="text-xs text-gray-500">{rating.ratingLabel}</p>
                    )}
                  </div>
                </div>

                {rating.comments && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{rating.comments}</p>
                  </div>
                )}

                {rating.weightedScore !== undefined && (
                  <p className="text-xs text-gray-500 mt-2">
                    Weighted Score: {rating.weightedScore.toFixed(2)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Manager Feedback */}
        {(record.managerSummary || record.strengths || record.improvementAreas) && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Manager Feedback
            </h2>

            {record.managerSummary && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Overall Summary</h3>
                <p className="text-gray-900">{record.managerSummary}</p>
              </div>
            )}

            {record.strengths && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Strengths</h3>
                <p className="text-gray-900">{record.strengths}</p>
              </div>
            )}

            {record.improvementAreas && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Areas for Improvement</h3>
                <p className="text-gray-900">{record.improvementAreas}</p>
              </div>
            )}
          </div>
        )}

        {/* Acknowledgement Section */}
        {!record.employeeAcknowledgedAt && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-yellow-900 mb-2">Acknowledgement Required</h3>
                <p className="text-sm text-yellow-800 mb-4">
                  Please acknowledge that you have reviewed this appraisal.
                </p>
                <Link href={`/performance/acknowledge/${recordId}`}>
                  <button className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Acknowledge & Provide Feedback
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {record.employeeAcknowledgedAt && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-800">
                Acknowledged on {new Date(record.employeeAcknowledgedAt).toLocaleDateString()}
              </p>
            </div>
            {record.employeeAcknowledgementComment && (
              <div className="mt-3 p-3 bg-white rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">Your Comment:</p>
                <p className="text-gray-900">{record.employeeAcknowledgementComment}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dispute Modal (placeholder) */}
      {showDisputeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Raise a Concern</h3>
            <p className="text-sm text-gray-600 mb-4">
              This feature is under development. Please contact HR directly to raise concerns about your appraisal.
            </p>
            <button
              onClick={() => setShowDisputeModal(false)}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
