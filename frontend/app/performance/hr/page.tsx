// app/performance/hr/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/(system)/context/authContext';
import { performanceApi } from '@/app/utils/performanceApi';
import {
  AppraisalCycle,
  AppraisalTemplate,
  AppraisalDispute,
  AppraisalRecord,
  AppraisalCycleStatus,
  AppraisalDisputeStatus,
  PerformanceAnalytics
} from '@/app/types/performance';
import Link from 'next/link';
import {
  BarChart3,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  TrendingUp,
  Shield,
  Filter,
  Search,
  Download,
  Plus,
  Eye,
  ChevronRight
} from 'lucide-react';

export default function HROverviewPage() {
  const { user } = useAuth();
  const [cycles, setCycles] = useState<AppraisalCycle[]>([]);
  const [templates, setTemplates] = useState<AppraisalTemplate[]>([]);
  const [disputes, setDisputes] = useState<AppraisalDispute[]>([]);
  const [analytics, setAnalytics] = useState<PerformanceAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'cycles' | 'disputes' | 'templates'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const isHR = user?.roles?.includes('HR_MANAGER') || user?.roles?.includes('HR_ADMIN') || user?.roles?.includes('SYSTEM_ADMIN');

  useEffect(() => {
    if (isHR) {
      fetchData();
    }
  }, [isHR]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all data in parallel
      const [
        cyclesData,
        templatesData,
        disputesData,
        analyticsData
      ] = await Promise.all([
        performanceApi.getAllAppraisalCycles(),
        performanceApi.getAllAppraisalTemplates(),
        performanceApi.getAppraisalDisputes(),
        performanceApi.getPerformanceAnalytics()
      ]);
      
      setCycles(cyclesData);
      setTemplates(templatesData);
      setDisputes(disputesData);
      setAnalytics(analyticsData);
      
    } catch (error) {
      console.error('Error fetching HR data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PLANNED': return 'bg-blue-100 text-blue-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      case 'ARCHIVED': return 'bg-purple-100 text-purple-800';
      case 'OPEN': return 'bg-red-100 text-red-800';
      case 'UNDER_REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'ADJUSTED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFilteredCycles = () => {
    let filtered = [...cycles];
    
    if (searchTerm) {
      filtered = filtered.filter(cycle =>
        cycle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cycle.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(cycle => cycle.status === statusFilter);
    }
    
    return filtered;
  };

  const getFilteredDisputes = () => {
    let filtered = [...disputes];
    
    if (searchTerm) {
      filtered = filtered.filter(dispute =>
        dispute.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof dispute.raisedByEmployeeId === 'object' && 
         `${dispute.raisedByEmployeeId.firstName} ${dispute.raisedByEmployeeId.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(dispute => dispute.status === statusFilter);
    }
    
    return filtered;
  };

  const getFilteredTemplates = () => {
    let filtered = [...templates];
    
    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(template => 
        statusFilter === 'ACTIVE' ? template.isActive : !template.isActive
      );
    }
    
    return filtered;
  };

  if (!isHR) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <Shield className="mx-auto text-gray-400" size={64} />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">HR Access Required</h3>
            <p className="text-gray-700 mt-2">Only HR personnel can access this dashboard.</p>
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-700">Loading HR dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeCycles = cycles.filter(c => c.status === AppraisalCycleStatus.ACTIVE);
  const openDisputes = disputes.filter(d => d.status === AppraisalDisputeStatus.OPEN);
  const pendingSubmissions = 0; // This would come from your API

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="text-blue-600" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">HR Performance Dashboard</h1>
                <p className="text-gray-700 mt-1">
                  Manage performance cycles, templates, and disputes
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Link
              href="/performance/cycles/create"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              <Plus size={18} />
              New Cycle
            </Link>
            
            <Link
              href="/performance/templates/create"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              <Plus size={18} />
              New Template
            </Link>
            
            <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border px-4 py-2 rounded-lg font-medium transition">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 min-w-max py-4 px-6 text-center font-medium ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BarChart3 size={18} />
                Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab('cycles')}
              className={`flex-1 min-w-max py-4 px-6 text-center font-medium ${
                activeTab === 'cycles'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Calendar size={18} />
                Cycles ({cycles.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('disputes')}
              className={`flex-1 min-w-max py-4 px-6 text-center font-medium ${
                activeTab === 'disputes'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <AlertCircle size={18} />
                Disputes ({disputes.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex-1 min-w-max py-4 px-6 text-center font-medium ${
                activeTab === 'templates'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText size={18} />
                Templates ({templates.length})
              </div>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-600"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-600" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                >
                  <option value="ALL">All Status</option>
                  {activeTab === 'cycles' && (
                    <>
                      <option value={AppraisalCycleStatus.PLANNED}>Planned</option>
                      <option value={AppraisalCycleStatus.ACTIVE}>Active</option>
                      <option value={AppraisalCycleStatus.CLOSED}>Closed</option>
                      <option value={AppraisalCycleStatus.ARCHIVED}>Archived</option>
                    </>
                  )}
                  {activeTab === 'disputes' && (
                    <>
                      <option value={AppraisalDisputeStatus.OPEN}>Open</option>
                      <option value={AppraisalDisputeStatus.UNDER_REVIEW}>Under Review</option>
                      <option value={AppraisalDisputeStatus.ADJUSTED}>Adjusted</option>
                      <option value={AppraisalDisputeStatus.REJECTED}>Rejected</option>
                    </>
                  )}
                  {activeTab === 'templates' && (
                    <>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="text-blue-600" size={20} />
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {activeCycles.length}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Cycles</h3>
                <p className="text-gray-700 text-sm">
                  Currently running performance cycles
                </p>
                <Link
                  href="/performance/cycles"
                  className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  View all cycles →
                </Link>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {analytics?.completionRate || '0%'}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Completion Rate</h3>
                <p className="text-gray-700 text-sm">
                  {analytics?.completedAssignments || 0} of {analytics?.totalAssignments || 0} assignments
                </p>
                <Link
                  href="/performance/analytics"
                  className="inline-block mt-4 text-green-600 hover:text-green-800 font-medium text-sm"
                >
                  View analytics →
                </Link>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="text-red-600" size={20} />
                  </div>
                  <span className="text-2xl font-bold text-red-600">
                    {openDisputes.length}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Open Disputes</h3>
                <p className="text-gray-700 text-sm">
                  Performance reviews requiring attention
                </p>
                <Link
                  href="/performance/disputes"
                  className="inline-block mt-4 text-red-600 hover:text-red-800 font-medium text-sm"
                >
                  Resolve disputes →
                </Link>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="text-yellow-600" size={20} />
                  </div>
                  <span className="text-2xl font-bold text-yellow-600">
                    {pendingSubmissions}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Reviews</h3>
                <p className="text-gray-700 text-sm">
                  Awaiting HR approval and publishing
                </p>
                <Link
                  href="/performance/hr/reviews"
                  className="inline-block mt-4 text-yellow-600 hover:text-yellow-800 font-medium text-sm"
                >
                  Review submissions →
                </Link>
              </div>
            </div>

            {/* Recent Cycles */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Cycles</h3>
                <Link
                  href="/performance/cycles"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View all
                </Link>
              </div>
              
              {cycles.slice(0, 5).length > 0 ? (
                <div className="space-y-4">
                  {cycles.slice(0, 5).map((cycle) => (
                    <div key={cycle._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
                      <div>
                        <div className="font-medium text-gray-900">{cycle.name}</div>
                        <div className="text-sm text-gray-700">
                          {new Date(cycle.startDate).toLocaleDateString()} - {new Date(cycle.endDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(cycle.status)}`}>
                          {cycle.status}
                        </span>
                        <Link
                          href={`/performance/cycles/${cycle._id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye size={16} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-700">
                  <Calendar className="mx-auto text-gray-400" size={32} />
                  <p className="mt-2">No cycles created yet</p>
                  <Link
                    href="/performance/cycles/create"
                    className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Create First Cycle
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Disputes */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Disputes</h3>
                <Link
                  href="/performance/disputes"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View all
                </Link>
              </div>
              
              {disputes.slice(0, 5).length > 0 ? (
                <div className="space-y-4">
                  {disputes.slice(0, 5).map((dispute) => (
                    <div key={dispute._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{dispute.reason}</div>
                        <div className="text-sm text-gray-700">
                          Raised by: {typeof dispute.raisedByEmployeeId === 'object' 
                            ? `${dispute.raisedByEmployeeId.firstName} ${dispute.raisedByEmployeeId.lastName}`
                            : 'Employee'}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(dispute.status)}`}>
                          {dispute.status}
                        </span>
                        <Link
                          href={`/performance/disputes/${dispute._id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye size={16} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-700">
                  <AlertCircle className="mx-auto text-gray-400" size={32} />
                  <p className="mt-2">No disputes raised yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'cycles' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Performance Cycles</h3>
                <Link
                  href="/performance/cycles/create"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  <Plus size={18} />
                  New Cycle
                </Link>
              </div>
            </div>
            
            {getFilteredCycles().length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Cycle Name</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Type</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Period</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredCycles().map((cycle) => (
                      <tr key={cycle._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{cycle.name}</div>
                          {cycle.description && (
                            <div className="text-sm text-gray-700">{cycle.description}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-700">{cycle.cycleType}</td>
                        <td className="py-3 px-4 text-gray-700">
                          {new Date(cycle.startDate).toLocaleDateString()} - {new Date(cycle.endDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(cycle.status)}`}>
                            {cycle.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Link
                              href={`/performance/cycles/${cycle._id}`}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View
                            </Link>
                            <Link
                              href={`/performance/analytics?cycleId=${cycle._id}`}
                              className="text-green-600 hover:text-green-800 text-sm font-medium"
                            >
                              Analytics
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Calendar className="mx-auto text-gray-400" size={48} />
                <h4 className="mt-4 text-lg font-semibold text-gray-900">No Cycles Found</h4>
                <p className="text-gray-700 mt-2">
                  {searchTerm || statusFilter !== 'ALL' 
                    ? 'Try adjusting your filters'
                    : 'Get started by creating your first performance cycle'}
                </p>
                <Link
                  href="/performance/cycles/create"
                  className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Create First Cycle
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'disputes' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Performance Disputes</h3>
                <div className="text-sm text-gray-700">
                  {openDisputes.length} open disputes
                </div>
              </div>
            </div>
            
            {getFilteredDisputes().length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Reason</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Raised By</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Cycle</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Submitted</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredDisputes().map((dispute) => (
                      <tr key={dispute._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{dispute.reason}</div>
                          {dispute.details && (
                            <div className="text-sm text-gray-700 truncate max-w-xs">{dispute.details}</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {typeof dispute.raisedByEmployeeId === 'object' 
                            ? `${dispute.raisedByEmployeeId.firstName} ${dispute.raisedByEmployeeId.lastName}`
                            : 'Employee'}
                        </td>
                        <td className="py-3 px-4">
                          {dispute.cycleId && typeof dispute.cycleId === 'object' 
                            ? dispute.cycleId.name
                            : 'Cycle'}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {new Date(dispute.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(dispute.status)}`}>
                            {dispute.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Link
                              href={`/performance/disputes/${dispute._id}`}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Review
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <AlertCircle className="mx-auto text-gray-400" size={48} />
                <h4 className="mt-4 text-lg font-semibold text-gray-900">No Disputes Found</h4>
                <p className="text-gray-700 mt-2">
                  {searchTerm || statusFilter !== 'ALL' 
                    ? 'Try adjusting your filters'
                    : 'No performance disputes have been raised yet'}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Appraisal Templates</h3>
                <Link
                  href="/performance/templates/create"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  <Plus size={18} />
                  New Template
                </Link>
              </div>
            </div>
            
            {getFilteredTemplates().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {getFilteredTemplates().map((template) => (
                  <div key={template._id} className="border rounded-lg p-6 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{template.name}</h4>
                        {template.description && (
                          <p className="text-sm text-gray-700 mt-1">{template.description}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {template.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {template.templateType}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">Criteria</span>
                        <span className="font-medium text-gray-900">{template.criteria.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">Rating Scale</span>
                        <span className="font-medium text-gray-900">
                          {template.ratingScale.min} - {template.ratingScale.max}
                        </span>
                      </div>
                      {template.applicableDepartmentIds && template.applicableDepartmentIds.length > 0 && (
                        <div className="text-sm text-gray-700">
                          Departments: {template.applicableDepartmentIds.length}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex justify-between items-center">
                        <Link
                          href={`/performance/templates/${template._id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        >
                          View Details
                          <ChevronRight size={16} />
                        </Link>
                        
                        <Link
                          href={`/performance/cycles/create?templateId=${template._id}`}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Use in Cycle
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <FileText className="mx-auto text-gray-400" size={48} />
                <h4 className="mt-4 text-lg font-semibold text-gray-900">No Templates Found</h4>
                <p className="text-gray-700 mt-2">
                  {searchTerm || statusFilter !== 'ALL' 
                    ? 'Try adjusting your filters'
                    : 'Get started by creating your first appraisal template'}
                </p>
                <Link
                  href="/performance/templates/create"
                  className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Create First Template
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}