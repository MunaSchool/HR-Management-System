// app/performance/templates/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/(system)/context/authContext';
import { performanceApi } from '@/app/utils/performanceApi';
import { AppraisalTemplate, AppraisalTemplateType } from '@/app/types/performance';
import Link from 'next/link';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye,
  CheckCircle,
  XCircle,
  ChevronRight
} from 'lucide-react';

export default function AppraisalTemplatesPage() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<AppraisalTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<AppraisalTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<AppraisalTemplateType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  const isHR = user?.roles?.includes('HR_MANAGER') || user?.roles?.includes('HR_ADMIN') || user?.roles?.includes('SYSTEM_ADMIN');

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [searchTerm, typeFilter, statusFilter, templates]);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const data = await performanceApi.getAllAppraisalTemplates();
      setTemplates(data);
      setFilteredTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = [...templates];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(template => template.templateType === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(template => 
        statusFilter === 'ACTIVE' ? template.isActive : !template.isActive
      );
    }

    setFilteredTemplates(filtered);
  };

  const toggleTemplateStatus = async (templateId: string, currentStatus: boolean) => {
    try {
      const template = templates.find(t => t._id === templateId);
      if (!template) return;

      const updatedTemplate = { ...template, isActive: !currentStatus };
      await performanceApi.updateAppraisalTemplate(templateId, updatedTemplate);
      fetchTemplates(); // Refresh list
    } catch (error) {
      console.error('Error updating template status:', error);
    }
  };

  const getTemplateTypeColor = (type: AppraisalTemplateType) => {
    switch (type) {
      case AppraisalTemplateType.ANNUAL:
        return 'bg-blue-100 text-blue-800';
      case AppraisalTemplateType.SEMI_ANNUAL:
        return 'bg-green-100 text-green-800';
      case AppraisalTemplateType.PROBATIONARY:
        return 'bg-purple-100 text-purple-800';
      case AppraisalTemplateType.PROJECT:
        return 'bg-yellow-100 text-yellow-800';
      case AppraisalTemplateType.AD_HOC:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingScaleLabel = (template: AppraisalTemplate) => {
    const { type, min, max } = template.ratingScale;
    switch (type) {
      case 'THREE_POINT':
        return '3-Point Scale (1-3)';
      case 'FIVE_POINT':
        return '5-Point Scale (1-5)';
      case 'TEN_POINT':
        return '10-Point Scale (1-10)';
      default:
        return `${min}-${max} Point Scale`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading templates...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Appraisal Templates</h1>
            <p className="text-gray-600 mt-2">
              Create and manage evaluation templates for performance appraisals
            </p>
          </div>
          {isHR && (
            <Link
              href="/performance/templates/create"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              <Plus size={20} />
              New Template
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search templates by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-500" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as AppraisalTemplateType | 'ALL')}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ALL">All Types</option>
                  <option value={AppraisalTemplateType.ANNUAL}>Annual</option>
                  <option value={AppraisalTemplateType.SEMI_ANNUAL}>Semi-Annual</option>
                  <option value={AppraisalTemplateType.PROBATIONARY}>Probationary</option>
                  <option value={AppraisalTemplateType.PROJECT}>Project</option>
                  <option value={AppraisalTemplateType.AD_HOC}>Ad Hoc</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE')}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <FileText className="mx-auto text-gray-400" size={64} />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">No templates found</h3>
            <p className="text-gray-600 mt-2">
              {searchTerm || typeFilter !== 'ALL' || statusFilter !== 'ALL'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first appraisal template'}
            </p>
            {isHR && !searchTerm && typeFilter === 'ALL' && statusFilter === 'ALL' && (
              <Link
                href="/performance/templates/create"
                className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Create First Template
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div key={template._id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getTemplateTypeColor(template.templateType)}`}>
                          {template.templateType.replace('_', ' ')}
                        </span>
                        <span className={`flex items-center gap-1 text-xs ${template.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {template.isActive ? (
                            <>
                              <CheckCircle size={12} />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle size={12} />
                              Inactive
                            </>
                          )}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                      {template.description && (
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{template.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Rating Scale</span>
                      <span className="font-medium">{getRatingScaleLabel(template)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Criteria Count</span>
                      <span className="font-medium">{template.criteria.length} items</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Created</span>
                      <span className="font-medium">
                        {new Date(template.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Link
                          href={`/performance/templates/${template._id}`}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          <Eye size={16} />
                          View
                        </Link>
                        {isHR && (
                          <Link
                            href={`/performance/templates/${template._id}/edit`}
                            className="flex items-center gap-1 text-gray-600 hover:text-gray-800 font-medium text-sm"
                          >
                            <Edit size={16} />
                            Edit
                          </Link>
                        )}
                      </div>
                      
                      {isHR && (
                        <button
                          onClick={() => toggleTemplateStatus(template._id, template.isActive)}
                          className={`px-3 py-1 text-sm rounded-lg transition ${
                            template.isActive
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {template.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Criteria Preview */}
                {template.criteria.length > 0 && (
                  <div className="border-t bg-gray-50 p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Evaluation Criteria</h4>
                    <div className="space-y-2">
                      {template.criteria.slice(0, 3).map((criterion, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600 truncate">{criterion.title}</span>
                          {criterion.weight !== undefined && (
                            <span className="text-gray-500">{criterion.weight}%</span>
                          )}
                        </div>
                      ))}
                      {template.criteria.length > 3 && (
                        <div className="text-center text-gray-500 text-sm">
                          +{template.criteria.length - 3} more criteria
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Statistics */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {templates.length}
              </div>
              <div className="text-sm text-gray-600">Total Templates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {templates.filter(t => t.isActive).length}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {templates.filter(t => !t.isActive).length}
              </div>
              <div className="text-sm text-gray-600">Inactive</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {templates.filter(t => t.templateType === AppraisalTemplateType.ANNUAL).length}
              </div>
              <div className="text-sm text-gray-600">Annual</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {templates.filter(t => t.templateType === AppraisalTemplateType.PROBATIONARY).length}
              </div>
              <div className="text-sm text-gray-600">Probationary</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}