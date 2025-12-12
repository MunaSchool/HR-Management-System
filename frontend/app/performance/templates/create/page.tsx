// app/performance/templates/create/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/(system)/context/authContext';
import { performanceApi } from '@/app/utils/performanceApi';
import { 
  AppraisalTemplateType, 
  AppraisalRatingScaleType,
  CreateAppraisalTemplateDto,
} from '@/app/types/performance';
import Link from 'next/link';
import { 
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  File 
} from 'lucide-react';

export default function CreateAppraisalTemplatePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateAppraisalTemplateDto>({
    name: '',
    description: '',
    templateType: AppraisalTemplateType.ANNUAL,
    ratingScale: {
      type: AppraisalRatingScaleType.FIVE_POINT,
      min: 1,
      max: 5,
      step: 1,
      labels: ['Poor', 'Below Average', 'Average', 'Good', 'Excellent']
    },
    criteria: [],
    instructions: '',
    applicableDepartmentIds: [],
    applicablePositionIds: [],
    isActive: true
  });

  const [newCriterion, setNewCriterion] = useState({
    key: '',
    title: '',
    details: '',
    weight: 0,
    maxScore: 5,
    required: true
  });

  const ratingScaleOptions = [
    { 
      value: AppraisalRatingScaleType.THREE_POINT, 
      label: '3-Point Scale',
      config: { min: 1, max: 3, step: 1, labels: ['Needs Improvement', 'Meets Expectations', 'Exceeds Expectations'] }
    },
    { 
      value: AppraisalRatingScaleType.FIVE_POINT, 
      label: '5-Point Scale',
      config: { min: 1, max: 5, step: 1, labels: ['Poor', 'Below Average', 'Average', 'Good', 'Excellent'] }
    },
    { 
      value: AppraisalRatingScaleType.TEN_POINT, 
      label: '10-Point Scale',
      config: { min: 1, max: 10, step: 1 }
    },
  ];

  const templateTypeOptions = [
    { value: AppraisalTemplateType.ANNUAL, label: 'Annual Review' },
    { value: AppraisalTemplateType.SEMI_ANNUAL, label: 'Semi-Annual Review' },
    { value: AppraisalTemplateType.PROBATIONARY, label: 'Probationary Review' },
    { value: AppraisalTemplateType.PROJECT, label: 'Project Review' },
    { value: AppraisalTemplateType.AD_HOC, label: 'Ad Hoc Review' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isActive' ? value === 'true' : value
    }));
  };

  const handleRatingScaleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      ratingScale: {
        ...prev.ratingScale,
        [field]: value
      }
    }));
  };

  const handleRatingScaleTypeChange = (type: AppraisalRatingScaleType) => {
    const selectedOption = ratingScaleOptions.find(opt => opt.value === type);
    if (selectedOption) {
      setFormData(prev => ({
        ...prev,
        ratingScale: {
          type,
          ...selectedOption.config
        }
      }));
    }
  };

    // FIX THIS FUNCTION in app/performance/templates/create/page.tsx
    const handleCriterionChange = (index: number, field: string, value: any) => {
    const updatedCriteria = [...formData.criteria];
  
    // Create a new object with the updated field
    updatedCriteria[index] = {
        ...updatedCriteria[index],
        [field]: field === 'weight' || field === 'maxScore' 
        ? Number(value) 
        : field === 'required' 
            ? value === 'true' 
            : value
    };
    
    setFormData(prev => ({
        ...prev,
        criteria: updatedCriteria
    }));
    };

  const addCriterion = () => {
    if (!newCriterion.key.trim() || !newCriterion.title.trim()) {
      setError('Key and title are required for criteria');
      return;
    }

    // Check if key already exists
    if (formData.criteria.some(c => c.key === newCriterion.key)) {
      setError('A criterion with this key already exists');
      return;
    }

    setFormData(prev => ({
      ...prev,
      criteria: [...prev.criteria, { ...newCriterion }]
    }));

    // Reset new criterion form
    setNewCriterion({
      key: '',
      title: '',
      details: '',
      weight: 0,
      maxScore: 5,
      required: true
    });
    setError(null);
  };

  const removeCriterion = (index: number) => {
    const updatedCriteria = [...formData.criteria];
    updatedCriteria.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      criteria: updatedCriteria
    }));
  };

  const moveCriterion = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === formData.criteria.length - 1)
    ) {
      return;
    }

    const updatedCriteria = [...formData.criteria];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [updatedCriteria[index], updatedCriteria[newIndex]] = [updatedCriteria[newIndex], updatedCriteria[index]];
    
    setFormData(prev => ({
      ...prev,
      criteria: updatedCriteria
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'Template name is required';
    }
    if (!formData.templateType) {
      return 'Template type is required';
    }
    if (formData.criteria.length === 0) {
      return 'At least one evaluation criterion is required';
    }

    // Validate criteria weights sum to 100% if any weights are set
    const totalWeight = formData.criteria.reduce((sum, c) => sum + (c.weight || 0), 0);
    const hasWeights = formData.criteria.some(c => c.weight && c.weight > 0);
    
    if (hasWeights && Math.abs(totalWeight - 100) > 0.01) {
      return 'Criteria weights must sum to 100% when using weighted scoring';
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
      
      // Ensure all criteria have required fields
      const validatedCriteria = formData.criteria.map(criterion => ({
        ...criterion,
        required: criterion.required !== undefined ? criterion.required : true,
        weight: criterion.weight || 0,
        maxScore: criterion.maxScore || 5
      }));
      
      const templateData = {
        ...formData,
        criteria: validatedCriteria
      };
      
      await performanceApi.createAppraisalTemplate(templateData);
      
      router.push('/performance/templates');
    } catch (error: any) {
      console.error('Error creating template:', error);
      setError(error.response?.data?.message || 'Failed to create appraisal template');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/performance/templates"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Templates
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Appraisal Template</h1>
          <p className="text-gray-600 mt-2">
            Define a new template for performance evaluations
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
          <div className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Annual Performance Review"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Type *
                  </label>
                  <select
                    name="templateType"
                    value={formData.templateType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {templateTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of this template..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions for Managers
                  </label>
                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Guidelines for managers when using this template..."
                  />
                </div>

                // FIX 1: Update the status select to handle optional boolean
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                </label>
                <select
                    name="isActive"
                    value={formData.isActive?.toString() || 'true'} // Handle optional
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>
                </div>
              </div>
            </div>

            {/* Rating Scale Configuration */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Scale Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scale Type *
                  </label>
                  <div className="space-y-2">
                    {ratingScaleOptions.map(option => (
                      <div key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          id={`scale-${option.value}`}
                          name="ratingScaleType"
                          checked={formData.ratingScale.type === option.value}
                          onChange={() => handleRatingScaleTypeChange(option.value)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <label
                          htmlFor={`scale-${option.value}`}
                          className="ml-2 text-sm text-gray-700"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Range: {formData.ratingScale.min} to {formData.ratingScale.max}
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500">Minimum</label>
                        <input
                          type="number"
                          value={formData.ratingScale.min}
                          onChange={(e) => handleRatingScaleChange('min', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="1"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500">Maximum</label>
                        <input
                          type="number"
                          value={formData.ratingScale.max}
                          onChange={(e) => handleRatingScaleChange('max', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="2"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500">Step</label>
                        <input
                          type="number"
                          value={formData.ratingScale.step || 1}
                          onChange={(e) => handleRatingScaleChange('step', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="0.1"
                          step="0.1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Labels for each point */}
                  {formData.ratingScale.labels && formData.ratingScale.labels.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating Labels
                      </label>
                      <div className="space-y-2">
                        {formData.ratingScale.labels.map((label, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 w-6">{index + 1}:</span>
                            <input
                              type="text"
                              value={label}
                              onChange={(e) => {
                                const newLabels = [...formData.ratingScale.labels!];
                                newLabels[index] = e.target.value;
                                handleRatingScaleChange('labels', newLabels);
                              }}
                              className="flex-1 px-3 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder={`Label for rating ${index + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Evaluation Criteria */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Evaluation Criteria</h3>
                <span className="text-sm text-gray-600">
                  {formData.criteria.length} criteria added
                </span>
              </div>

              {/* Add New Criterion Form */}
              <div className="bg-gray-50 border rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-4">Add New Criterion</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Key *
                    </label>
                    <input
                      type="text"
                      value={newCriterion.key}
                      onChange={(e) => setNewCriterion(prev => ({ ...prev, key: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., communication_skills"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={newCriterion.title}
                      onChange={(e) => setNewCriterion(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Communication Skills"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Details
                    </label>
                    <input
                      type="text"
                      value={newCriterion.details}
                      onChange={(e) => setNewCriterion(prev => ({ ...prev, details: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Description of what is being evaluated"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weight (%)
                      </label>
                      <input
                        type="number"
                        value={newCriterion.weight}
                        onChange={(e) => setNewCriterion(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        max="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Score
                      </label>
                      <input
                        type="number"
                        value={newCriterion.maxScore}
                        onChange={(e) => setNewCriterion(prev => ({ ...prev, maxScore: parseInt(e.target.value) || 5 }))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="required-criterion"
                      checked={newCriterion.required}
                      onChange={(e) => setNewCriterion(prev => ({ ...prev, required: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label htmlFor="required-criterion" className="ml-2 text-sm text-gray-700">
                      Required for evaluation
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={addCriterion}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    <Plus size={20} />
                    Add Criterion
                  </button>
                </div>
              </div>

              {/* Criteria List */}
              {formData.criteria.length > 0 ? (
                <div className="space-y-4">
                  {formData.criteria.map((criterion, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-medium text-gray-900">
                              {index + 1}. {criterion.title}
                            </span>
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                              {criterion.key}
                            </span>
                            {criterion.required && (
                              <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                                Required
                              </span>
                            )}
                          </div>
                          {criterion.details && (
                            <p className="text-sm text-gray-600 mb-2">{criterion.details}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => moveCriterion(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveCriterion(index, 'down')}
                            disabled={index === formData.criteria.length - 1}
                            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => removeCriterion(index)}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Weight</label>
                          <input
                            type="number"
                            value={criterion.weight || 0}
                            onChange={(e) => handleCriterionChange(index, 'weight', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                            max="100"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Max Score</label>
                          <input
                            type="number"
                            value={criterion.maxScore || 5}
                            onChange={(e) => handleCriterionChange(index, 'maxScore', parseInt(e.target.value) || 5)}
                            className="w-full px-3 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="1"
                          />
                        </div>
                        // FIX 2: Update the required select to handle optional boolean
                        <div>
                        <label className="block text-xs text-gray-500 mb-1">Required</label>
                        <select
                            value={criterion.required?.toString() || 'true'} // Handle optional
                            onChange={(e) => handleCriterionChange(index, 'required', e.target.value === 'true')}
                            className="w-full px-3 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Total Weight Summary */}
                  <div className="bg-gray-50 border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Total Weight</span>
                      <span className={`text-lg font-bold ${
                        Math.abs(formData.criteria.reduce((sum, c) => sum + (c.weight || 0), 0) - 100) <= 0.01
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {formData.criteria.reduce((sum, c) => sum + (c.weight || 0), 0)}%
                      </span>
                    </div>
                    {Math.abs(formData.criteria.reduce((sum, c) => sum + (c.weight || 0), 0) - 100) > 0.01 && (
                      <p className="text-red-500 text-sm mt-2">
                        Criteria weights should sum to 100% for weighted scoring
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <File className="mx-auto text-gray-400" size={48} />
                    <p className="text-gray-500 mt-4">No criteria added yet</p>
                    <p className="text-gray-400 text-sm mt-2">
                        Add evaluation criteria using the form above
                    </p>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
            <Link
              href="/performance/templates"
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
                  Create Template
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}