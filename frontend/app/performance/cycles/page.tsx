// app/performance/cycles/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/(system)/context/authContext';
import { performanceApi } from '@/app/utils/performanceApi';
import { AppraisalCycle, AppraisalCycleStatus } from '@/app/types/performance';
import Link from 'next/link';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight,
  Clock,
  CheckCircle,
  Archive,
  PlayCircle
} from 'lucide-react';

export default function AppraisalCyclesPage() {
  const { user } = useAuth();
  const [cycles, setCycles] = useState<AppraisalCycle[]>([]);
  const [filteredCycles, setFilteredCycles] = useState<AppraisalCycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppraisalCycleStatus | 'ALL'>('ALL');

  const isHR = user?.roles?.includes('HR_MANAGER') || user?.roles?.includes('HR_ADMIN') || user?.roles?.includes('SYSTEM_ADMIN');

  useEffect(() => {
    fetchCycles();
  }, []);

  useEffect(() => {
    filterCycles();
  }, [searchTerm, statusFilter, cycles]);

  const fetchCycles = async () => {
    try {
      setIsLoading(true);
      const data = await performanceApi.getAllAppraisalCycles();
      setCycles(data);
      setFilteredCycles(data);
    } catch (error) {
      console.error('Error fetching cycles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCycles = () => {
    let filtered = [...cycles];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(cycle =>
        cycle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cycle.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(cycle => cycle.status === statusFilter);
    }

    setFilteredCycles(filtered);
  };

  const updateCycleStatus = async (cycleId: string, status: AppraisalCycleStatus) => {
    try {
      await performanceApi.updateAppraisalCycleStatus(cycleId, status);
      fetchCycles(); // Refresh list
    } catch (error) {
      console.error('Error updating cycle status:', error);
    }
  };

  const getStatusIcon = (status: AppraisalCycleStatus) => {
    switch (status) {
      case AppraisalCycleStatus.PLANNED:
        return <Clock className="h-4 w-4 text-blue-600" />;
      case AppraisalCycleStatus.ACTIVE:
        return <PlayCircle className="h-4 w-4 text-green-600" />;
      case AppraisalCycleStatus.CLOSED:
        return <CheckCircle className="h-4 w-4 text-gray-600" />;
      case AppraisalCycleStatus.ARCHIVED:
        return <Archive className="h-4 w-4 text-purple-600" />;
    }
  };

  const getStatusColor = (status: AppraisalCycleStatus) => {
    switch (status) {
      case AppraisalCycleStatus.PLANNED: return 'bg-blue-100 text-blue-800';
      case AppraisalCycleStatus.ACTIVE: return 'bg-green-100 text-green-800';
      case AppraisalCycleStatus.CLOSED: return 'bg-gray-100 text-gray-800';
      case AppraisalCycleStatus.ARCHIVED: return 'bg-purple-100 text-purple-800';
    }
  };

  const getActionsForStatus = (cycle: AppraisalCycle) => {
    const actions = [];
    
    switch (cycle.status) {
      case AppraisalCycleStatus.PLANNED:
        actions.push({
          label: 'Activate',
          action: () => updateCycleStatus(cycle._id, AppraisalCycleStatus.ACTIVE),
          color: 'bg-green-600 hover:bg-green-700'
        });
        break;
      case AppraisalCycleStatus.ACTIVE:
        actions.push({
          label: 'Close',
          action: () => updateCycleStatus(cycle._id, AppraisalCycleStatus.CLOSED),
          color: 'bg-gray-600 hover:bg-gray-700'
        });
        break;
      case AppraisalCycleStatus.CLOSED:
        actions.push({
          label: 'Archive',
          action: () => updateCycleStatus(cycle._id, AppraisalCycleStatus.ARCHIVED),
          color: 'bg-purple-600 hover:bg-purple-700'
        });
        break;
    }

    return actions;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-700">Loading appraisal cycles...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Appraisal Cycles</h1>
            <p className="text-gray-700 mt-2">
              Manage and track all performance appraisal cycles
            </p>
          </div>
          {isHR && (
            <Link
              href="/performance/cycles/create"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              <Plus size={20} />
              New Cycle
            </Link>
          )}
        </div>
        {/* Statistics */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cycle Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {cycles.filter(c => c.status === AppraisalCycleStatus.PLANNED).length}
              </div>
              <div className="text-sm text-gray-700">Planned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {cycles.filter(c => c.status === AppraisalCycleStatus.ACTIVE).length}
              </div>
              <div className="text-sm text-gray-700">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {cycles.filter(c => c.status === AppraisalCycleStatus.CLOSED).length}
              </div>
              <div className="text-sm text-gray-700">Closed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {cycles.filter(c => c.status === AppraisalCycleStatus.ARCHIVED).length}
              </div>
              <div className="text-sm text-gray-700">Archived</div>
            </div>
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
                  placeholder="Search cycles by name or description..."
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
                  onChange={(e) => setStatusFilter(e.target.value as AppraisalCycleStatus | 'ALL')}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                >
                  <option value="ALL">All Status</option>
                  <option value={AppraisalCycleStatus.PLANNED}>Planned</option>
                  <option value={AppraisalCycleStatus.ACTIVE}>Active</option>
                  <option value={AppraisalCycleStatus.CLOSED}>Closed</option>
                  <option value={AppraisalCycleStatus.ARCHIVED}>Archived</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Cycles List */}
        {filteredCycles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <Calendar className="mx-auto text-gray-500" size={64} />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">No cycles found</h3>
            <p className="text-gray-700 mt-2">
              {searchTerm || statusFilter !== 'ALL' 
                ? 'Try adjusting your filters'
                : 'Get started by creating your first appraisal cycle'}
            </p>
            {isHR && !searchTerm && statusFilter === 'ALL' && (
              <Link
                href="/performance/cycles/create"
                className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Create First Cycle
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCycles.map((cycle) => {
              const actions = getActionsForStatus(cycle);
              
              return (
                <div key={cycle._id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(cycle.status)}
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(cycle.status)}`}>
                            {cycle.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mt-2">{cycle.name}</h3>
                        {cycle.description && (
                          <p className="text-gray-700 text-sm mt-1">{cycle.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">Start Date</span>
                        <span className="font-medium text-gray-900">
                          {new Date(cycle.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">End Date</span>
                        <span className="font-medium text-gray-900">
                          {new Date(cycle.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">Type</span>
                        <span className="font-medium text-gray-900">{cycle.cycleType}</span>
                      </div>
                      {cycle.managerDueDate && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">Manager Due</span>
                          <span className="font-medium text-gray-900">
                            {new Date(cycle.managerDueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-6 border-t">
                      <div className="flex justify-between items-center">
                        <Link
                          href={`/performance/cycles/${cycle._id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        >
                          View Details
                          <ChevronRight size={16} />
                        </Link>
                        
                        {isHR && actions.length > 0 && (
                          <div className="flex gap-2">
                            {actions.map((action, index) => (
                              <button
                                key={index}
                                onClick={action.action}
                                className={`${action.color} text-white px-3 py-1 text-sm rounded-lg transition`}
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        
      </div>
    </div>
  );
}