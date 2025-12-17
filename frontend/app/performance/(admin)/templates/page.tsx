// app/performance/templates/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { performanceApi } from '@/app/utils/performanceApi';
import { AppraisalTemplate, AppraisalTemplateType } from '@/app/types/performance';
import { 
  Plus,
  Search,
  Filter,
  FileText,
  Calendar,
  Users,
  Edit,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Copy
} from 'lucide-react';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<AppraisalTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<AppraisalTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [searchTerm, typeFilter, statusFilter, templates]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await performanceApi.getAllAppraisalTemplates();
      setTemplates(data);
      setFilteredTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = [...templates];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(term) ||
        template.description?.toLowerCase().includes(term) ||
        template.templateType.toLowerCase().includes(term)
      );
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(template => template.templateType === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(template => 
        statusFilter === 'active' ? template.isActive : !template.isActive
      );
    }

    setFilteredTemplates(filtered);
  };

  const getTemplateTypeLabel = (type: AppraisalTemplateType) => {
    switch (type) {
      case AppraisalTemplateType.ANNUAL: return 'Annual';
      case AppraisalTemplateType.SEMI_ANNUAL: return 'Semi-Annual';
      case AppraisalTemplateType.PROBATIONARY: return 'Probationary';
      case AppraisalTemplateType.PROJECT: return 'Project';
      case AppraisalTemplateType.AD_HOC: return 'Ad Hoc';
      default: return type;
    }
  };

  const getTemplateTypeIcon = (type: AppraisalTemplateType) => {
    switch (type) {
      case AppraisalTemplateType.ANNUAL:
      case AppraisalTemplateType.SEMI_ANNUAL:
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case AppraisalTemplateType.PROBATIONARY:
        return <Users className="h-4 w-4 text-green-500" />;
      case AppraisalTemplateType.PROJECT:
        return <FileText className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      try {
        // Note: You'll need to add a delete endpoint to your API
        // await performanceApi.deleteTemplate(templateId);
        setTemplates(templates.filter(t => t._id !== templateId));
        alert('Template deleted successfully');
      } catch (error) {
        console.error('Error deleting template:', error);
        alert('Failed to delete template');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appraisal Templates</h1>
          <p className="text-gray-600 mt-1">
            Create and manage performance appraisal templates
          </p>
        </div>
        <Link href="/performance/templates/create">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
            <Plus size={16} />
            Create Template
          </button>
        </Link>
      </div>

      {/* Template Stats */}
      {templates.length > 0 && (
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
              <p className="text-sm text-gray-500">Total Templates</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {templates.filter(t => t.isActive).length}
              </p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {templates.filter(t => t.templateType === AppraisalTemplateType.ANNUAL).length}
              </p>
              <p className="text-sm text-gray-500">Annual</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {templates.reduce((acc, t) => acc + (t.criteria?.length || 0), 0)}
              </p>
              <p className="text-sm text-gray-500">Total Criteria</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search templates..."
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value={AppraisalTemplateType.ANNUAL}>Annual</option>
                <option value={AppraisalTemplateType.SEMI_ANNUAL}>Semi-Annual</option>
                <option value={AppraisalTemplateType.PROBATIONARY}>Probationary</option>
                <option value={AppraisalTemplateType.PROJECT}>Project</option>
                <option value={AppraisalTemplateType.AD_HOC}>Ad Hoc</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <select
                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="bg-white border rounded-lg p-12 text-center shadow-sm">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-500 mb-4">
            {templates.length === 0 
              ? "You haven't created any appraisal templates yet."
              : "No templates match your search criteria."}
          </p>
          <Link href="/performance/templates/create">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2 mx-auto">
              <Plus size={16} />
              Create Your First Template
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div key={template._id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    {getTemplateTypeIcon(template.templateType)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{template.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {getTemplateTypeLabel(template.templateType)}
                      </span>
                      {template.isActive ? (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {template.description && (
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              )}

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Criteria Items</span>
                  <span className="font-medium">{template.criteria?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Rating Scale</span>
                  <span className="font-medium">
                    {template.ratingScale?.min}-{template.ratingScale?.max} points
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Created</span>
                  <span className="font-medium">
                    {new Date(template.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex space-x-2">
                  <Link href={`/performance/templates/view/${template._id}`}>
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md" title="View">
                      <Eye size={16} />
                    </button>
                  </Link>
                  <Link href={`/performance/templates/edit/${template._id}`}>
                    <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md" title="Edit">
                      <Edit size={16} />
                    </button>
                  </Link>
                  <button 
                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-md" 
                    title="Duplicate"
                    onClick={() => console.log('Duplicate template:', template._id)}
                  >
                    <Copy size={16} />
                  </button>
                </div>
                <button 
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md" 
                  title="Delete"
                  onClick={() => handleDeleteTemplate(template._id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      
    </div>
  );
}