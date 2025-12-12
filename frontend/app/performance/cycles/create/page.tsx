// app/performance/cycles/create/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/(system)/context/authContext';
import { performanceApi } from '@/app/utils/performanceApi';
import { AppraisalTemplate, AppraisalTemplateType, AppraisalCycleStatus  } from '@/app/types/performance';
import Link from 'next/link';
import { 
  ArrowLeft,
  Save,
  Calendar,
  Users,
  AlertCircle
} from 'lucide-react';

export default function CreateAppraisalCyclePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [templates, setTemplates] = useState<AppraisalTemplate[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
  name: '',
  description: '',
  cycleType: AppraisalTemplateType.ANNUAL, // Use enum value
  startDate: '',
  endDate: '',
  managerDueDate: '',
  employeeAcknowledgementDueDate: '',
  templateAssignments: [{
    templateId: '',
    departmentIds: [] as string[]
  }]
});

  useEffect(() => {
    // Fetch templates and departments
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch templates
        const templatesData = await performanceApi.getAllAppraisalTemplates();
        setTemplates(templatesData.filter(t => t.isActive));
        
        // TODO: Fetch departments from organization-structure API
        // For now, we'll use dummy data
        setDepartments([
          { _id: '1', name: 'Engineering' },
          { _id: '2', name: 'Marketing' },
          { _id: '3', name: 'Sales' },
          { _id: '4', name: 'HR' },
          { _id: '5', name: 'Finance' },
        ]);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load templates and departments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTemplateAssignmentChange = (index: number, field: string, value: any) => {
    const updatedAssignments = [...formData.templateAssignments];
    
    if (field === 'departmentIds') {
      // Handle department multi-select
      if (Array.isArray(value)) {
        updatedAssignments[index].departmentIds = value;
      } else {
        // Toggle selection
        const deptIndex = updatedAssignments[index].departmentIds.indexOf(value);
        if (deptIndex === -1) {
          updatedAssignments[index].departmentIds.push(value);
        } else {
          updatedAssignments[index].departmentIds.splice(deptIndex, 1);
        }
      }
    } else {
      updatedAssignments[index] = {
        ...updatedAssignments[index],
        [field]: value
      };
    }
    
    setFormData(prev => ({
      ...prev,
      templateAssignments: updatedAssignments
    }));
  };

  const addTemplateAssignment = () => {
    setFormData(prev => ({
      ...prev,
      templateAssignments: [
        ...prev.templateAssignments,
        { templateId: '', departmentIds: [] }
      ]
    }));
  };

  const removeTemplateAssignment = (index: number) => {
    if (formData.templateAssignments.length === 1) {
      alert('At least one template assignment is required');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      templateAssignments: prev.templateAssignments.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'Cycle name is required';
    }
    if (!formData.startDate) {
      return 'Start date is required';
    }
    if (!formData.endDate) {
      return 'End date is required';
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      return 'End date must be after start date';
    }
    
    for (const assignment of formData.templateAssignments) {
      if (!assignment.templateId) {
        return 'Template is required for all assignments';
      }
      if (assignment.departmentIds.length === 0) {
        return 'At least one department is required for template assignment';
      }
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Create the cycle data with correct types
      const cycleData = {
        name: formData.name,
        description: formData.description || undefined,
        cycleType: formData.cycleType, // This should already be AppraisalTemplateType enum value
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        managerDueDate: formData.managerDueDate ? new Date(formData.managerDueDate) : undefined,
        employeeAcknowledgementDueDate: formData.employeeAcknowledgementDueDate ? new Date(formData.employeeAcknowledgementDueDate) : undefined,
        templateAssignments: formData.templateAssignments,
        status: AppraisalCycleStatus.PLANNED
      };
      
      console.log('Submitting cycle data:', cycleData); // For debugging
      
      await performanceApi.createAppraisalCycle(cycleData);
      
      router.push('/performance/cycles');
    } catch (error: any) {
      console.error('Error creating cycle:', error);
      setError(error.response?.data?.message || 'Failed to create appraisal cycle');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading form data...</p>
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
        <div className="mb-8">
          <Link
            href="/performance/cycles"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Cycles
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Appraisal Cycle</h1>
          <p className="text-gray-600 mt-2">
            Set up a new performance appraisal cycle with templates and departments
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cycle Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Q4 2024 Performance Review"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cycle Type *
                  </label>
                  <select
                    name="cycleType"
                    value={formData.cycleType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={AppraisalTemplateType.ANNUAL}>Annual</option>
                    <option value={AppraisalTemplateType.SEMI_ANNUAL}>Semi-Annual</option>
                    <option value={AppraisalTemplateType.PROBATIONARY}>Probationary</option>
                    <option value={AppraisalTemplateType.PROJECT}>Project</option>
                    <option value={AppraisalTemplateType.AD_HOC}>Ad Hoc</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of this appraisal cycle..."
                  />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manager Due Date
                  </label>
                  <input
                    type="date"
                    name="managerDueDate"
                    value={formData.managerDueDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Acknowledgement Due
                  </label>
                  <input
                    type="date"
                    name="employeeAcknowledgementDueDate"
                    value={formData.employeeAcknowledgementDueDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Template Assignments */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Template Assignments</h3>
                <button
                  type="button"
                  onClick={addTemplateAssignment}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  + Add Template
                </button>
              </div>

              {formData.templateAssignments.map((assignment, index) => (
                <div key={index} className="border rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium text-gray-900">Assignment {index + 1}</h4>
                    {formData.templateAssignments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTemplateAssignment(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template *
                      </label>
                      <select
                        value={assignment.templateId}
                        onChange={(e) => handleTemplateAssignmentChange(index, 'templateId', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select a template</option>
                        {templates.map((template) => (
                          <option key={template._id} value={template._id}>
                            {template.name} ({template.templateType})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Departments *
                      </label>
                      <div className="border rounded-lg p-2 max-h-32 overflow-y-auto">
                        {departments.map((dept) => (
                          <div key={dept._id} className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              id={`dept-${index}-${dept._id}`}
                              checked={assignment.departmentIds.includes(dept._id)}
                              onChange={(e) => handleTemplateAssignmentChange(index, 'departmentIds', dept._id)}
                              className="h-4 w-4 text-blue-600 rounded"
                            />
                            <label
                              htmlFor={`dept-${index}-${dept._id}`}
                              className="ml-2 text-sm text-gray-700"
                            >
                              {dept.name}
                            </label>
                          </div>
                        ))}
                      </div>
                      {assignment.departmentIds.length === 0 && (
                        <p className="text-red-500 text-xs mt-1">Select at least one department</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
            <Link
              href="/performance/cycles"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Create Appraisal Cycle
                </>
              )}
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600 mt-0.5" size={20} />
            <div>
              <h4 className="font-medium text-blue-900">About Appraisal Cycles</h4>
              <ul className="text-blue-800 text-sm mt-2 space-y-1">
                <li>• <strong>Planned</strong> cycles can be edited before activation</li>
                <li>• <strong>Active</strong> cycles allow managers to submit appraisals</li>
                <li>• <strong>Closed</strong> cycles prevent new submissions</li>
                <li>• <strong>Archived</strong> cycles are for historical reference</li>
                <li>• Each template can be assigned to multiple departments</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}