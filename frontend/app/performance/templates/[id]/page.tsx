// app/performance/templates/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/(system)/context/authContext';
import { performanceApi } from '@/app/utils/performanceApi';
import { 
  AppraisalTemplate,
  AppraisalTemplateType,
  AppraisalRatingScaleType
} from '@/app/types/performance';
import Link from 'next/link';
import { 
  ArrowLeft, 
  FileText, 
  Edit, 
  Copy, 
  Trash2, 
  CheckCircle,
  AlertCircle,
  BarChart3,
  Target,
  ListChecks,
  Info,
  Users,
  Calendar
} from 'lucide-react';

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const templateId = params.id as string;
  
  const [template, setTemplate] = useState<AppraisalTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const isHR = user?.roles?.includes('HR_MANAGER') || user?.roles?.includes('HR_ADMIN') || user?.roles?.includes('SYSTEM_ADMIN');

  useEffect(() => {
    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      setIsLoading(true);
      const data = await performanceApi.getAppraisalTemplateById(templateId);
      setTemplate(data);
    } catch (error) {
      console.error('Error fetching template:', error);
      router.push('/performance/templates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!template || !isHR) return;
    
    if (!window.confirm(`Are you sure you want to delete template "${template.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsDeleting(true);
      // Note: You might need to add a delete endpoint in your API
      // For now, we'll just redirect
      router.push('/performance/templates');
    } catch (error) {
      console.error('Error deleting template:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const duplicateTemplate = async () => {
    if (!template) return;
    
    try {
      const duplicateData = {
        ...template,
        name: `${template.name} (Copy)`,
        _id: undefined,
        createdAt: undefined,
        updatedAt: undefined
      };
      
      const newTemplate = await performanceApi.createAppraisalTemplate(duplicateData);
      router.push(`/performance/templates/${newTemplate._id}`);
    } catch (error) {
      console.error('Error duplicating template:', error);
    }
  };

  const getRatingScaleDescription = () => {
    if (!template) return '';
    
    const { ratingScale } = template;
    let description = `${ratingScale.type.replace('_', ' ')} scale`;
    
    if (ratingScale.labels && ratingScale.labels.length > 0) {
      description += ` (${ratingScale.labels.join(', ')})`;
    } else {
      description += ` (${ratingScale.min} to ${ratingScale.max})`;
    }
    
    return description;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-700">Loading template details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <AlertCircle className="mx-auto text-gray-400" size={64} />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">Template Not Found</h3>
            <p className="text-gray-700 mt-2">The requested appraisal template could not be found.</p>
            <Link
              href="/performance/templates"
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Back to Templates
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-start gap-4">
            <Link
              href="/performance/templates"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mt-1"
            >
              <ArrowLeft size={20} />
              Back
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="text-blue-600" size={20} />
                </div>
                <div>
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    template.isActive 
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                    {template.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">{template.name}</h1>
              {template.description && (
                <p className="text-gray-700 mt-1">{template.description}</p>
              )}
            </div>
          </div>
          
          {isHR && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={duplicateTemplate}
                className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border px-4 py-2 rounded-lg font-medium transition"
              >
                <Copy size={18} />
                Duplicate
              </button>
              
              <Link
                href={`/performance/templates/create?edit=${templateId}`}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                <Edit size={18} />
                Edit
              </Link>
              
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Template Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Info size={20} />
                Template Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">Template Type</label>
                  <p className="mt-1 text-gray-900 font-medium">{template.templateType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Rating Scale</label>
                  <p className="mt-1 text-gray-900 font-medium">{getRatingScaleDescription()}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Instructions</label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                    {template.instructions || 'No specific instructions provided.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Evaluation Criteria */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ListChecks size={20} />
                Evaluation Criteria ({template.criteria.length})
              </h3>
              
              {template.criteria.length > 0 ? (
                <div className="space-y-4">
                  {template.criteria.map((criterion, index) => (
                    <div key={criterion.key} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{index + 1}. {criterion.title}</span>
                            {criterion.required && (
                              <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Required</span>
                            )}
                          </div>
                          {criterion.details && (
                            <p className="text-gray-700 mt-2">{criterion.details}</p>
                          )}
                        </div>
                        <div className="text-right">
                          {criterion.weight && (
                            <div className="text-sm text-gray-700">
                              Weight: <span className="font-semibold">{criterion.weight}%</span>
                            </div>
                          )}
                          {criterion.maxScore && (
                            <div className="text-sm text-gray-700">
                              Max Score: <span className="font-semibold">{criterion.maxScore}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                        <div>Key: <code className="bg-gray-100 px-2 py-1 rounded">{criterion.key}</code></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-700">
                  <Target className="mx-auto text-gray-400" size={32} />
                  <p className="mt-2">No evaluation criteria defined</p>
                  {isHR && (
                    <Link
                      href={`/performance/templates/create?edit=${templateId}`}
                      className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Add criteria to make this template usable
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Applicability */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users size={20} />
                Applicability
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Applicable Departments</label>
                  <div className="mt-2">
                    {template.applicableDepartmentIds && template.applicableDepartmentIds.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {template.applicableDepartmentIds.map((deptId, index) => (
                          <span key={index} className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded">
                            Department {index + 1}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-700">All departments</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Applicable Positions</label>
                  <div className="mt-2">
                    {template.applicablePositionIds && template.applicablePositionIds.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {template.applicablePositionIds.map((posId, index) => (
                          <span key={index} className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded">
                            Position {index + 1}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-700">All positions</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Template Stats */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 size={20} />
                Template Stats
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Criteria Count</span>
                  <span className="font-semibold text-gray-900">{template.criteria.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Required Criteria</span>
                  <span className="font-semibold text-gray-900">
                    {template.criteria.filter(c => c.required).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Weighted Criteria</span>
                  <span className="font-semibold text-gray-900">
                    {template.criteria.filter(c => c.weight && c.weight > 0).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Total Weight</span>
                  <span className="font-semibold text-gray-900">
                    {template.criteria.reduce((sum, c) => sum + (c.weight || 0), 0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Rating Scale Details */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Scale</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Type</span>
                  <span className="font-semibold text-gray-900">{template.ratingScale.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Range</span>
                  <span className="font-semibold text-gray-900">
                    {template.ratingScale.min} - {template.ratingScale.max}
                  </span>
                </div>
                {template.ratingScale.step && template.ratingScale.step !== 1 && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Step</span>
                    <span className="font-semibold text-gray-900">{template.ratingScale.step}</span>
                  </div>
                )}
              </div>
              
              {template.ratingScale.labels && template.ratingScale.labels.length > 0 && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Rating Labels</label>
                  <div className="space-y-2">
                    {template.ratingScale.labels.map((label, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg font-semibold">
                          {template.ratingScale.min + (index * (template.ratingScale.step || 1))}
                        </div>
                        <span className="text-gray-800">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Created</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(template.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Last Updated</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(template.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Status</span>
                  <span className={`font-semibold ${
                    template.isActive ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {template.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <Link
                  href="/performance/cycles/create"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  <Calendar size={16} />
                  Use this template in a new cycle
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}