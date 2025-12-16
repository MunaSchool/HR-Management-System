'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { performanceApi } from '@/app/utils/performanceApi';
import { useAuth } from '@/app/(system)/context/authContext';
import { 
  AppraisalAssignment, 
  AppraisalAssignmentStatus,
  AppraisalCycle,
  PerformanceAnalytics
} from '@/app/types/performance';
import { 
  Users,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  TrendingUp,
  BarChart,
  ArrowRight,
  User,
  Bell,
  Target,
  Award,
  Home,
  ChevronDown,
  Menu,
  X,
  LogOut
} from 'lucide-react';

export default function ManagerDashboardPage() {
  const { user, logout } = useAuth();
  const pathname = window.location.pathname;
  const [assignments, setAssignments] = useState<AppraisalAssignment[]>([]);
  const [cycles, setCycles] = useState<AppraisalCycle[]>([]);
  const [analytics, setAnalytics] = useState<PerformanceAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCycle, setActiveCycle] = useState<AppraisalCycle | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchManagerData();
    }
  }, [user]);

  const fetchManagerData = async () => {
    try {
      setLoading(true);
      
      // Fetch manager assignments
      let managerId = user?.userid || user?.employeeNumber || user?.email;
      if (managerId) {
        const assignmentsData = await performanceApi.getManagerAppraisalAssignments(managerId);
        setAssignments(assignmentsData);
        
        // Get active cycles from assignments
        const cycleIds = [...new Set(assignmentsData.map(a => 
          typeof a.cycleId === 'string' ? a.cycleId : a.cycleId?._id
        ).filter(Boolean))];
        
        if (cycleIds.length > 0) {
          // Get cycle details
          const cyclesData = await performanceApi.getAllAppraisalCycles();
          setCycles(cyclesData);
          
          // Find active cycle (first active cycle in assignments)
          const active = cyclesData.find(c => 
            c.status === 'ACTIVE' && cycleIds.includes(c._id)
          ) || cyclesData[0];
          setActiveCycle(active || null);
          
          // Get analytics for active cycle
          if (active) {
            const analyticsData = await performanceApi.getPerformanceAnalytics(active._id);
            setAnalytics(analyticsData);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching manager data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    const total = assignments.length;
    const notStarted = assignments.filter(a => a.status === AppraisalAssignmentStatus.NOT_STARTED).length;
    const inProgress = assignments.filter(a => a.status === AppraisalAssignmentStatus.IN_PROGRESS).length;
    const submitted = assignments.filter(a => a.status === AppraisalAssignmentStatus.SUBMITTED).length;
    const published = assignments.filter(a => a.status === AppraisalAssignmentStatus.PUBLISHED).length;
    
    const completionRate = total > 0 ? Math.round(((published + submitted) / total) * 100) : 0;
    
    const overdue = assignments.filter(a => {
      if (!a.dueDate) return false;
      return new Date(a.dueDate) < new Date() && 
             a.status !== AppraisalAssignmentStatus.PUBLISHED && 
             a.status !== AppraisalAssignmentStatus.SUBMITTED;
    }).length;

    return { total, notStarted, inProgress, submitted, published, completionRate, overdue };
  };

  const getStatusIcon = (status: AppraisalAssignmentStatus) => {
    switch (status) {
      case AppraisalAssignmentStatus.PUBLISHED:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case AppraisalAssignmentStatus.SUBMITTED:
        return <FileText className="h-5 w-5 text-blue-500" />;
      case AppraisalAssignmentStatus.IN_PROGRESS:
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case AppraisalAssignmentStatus.NOT_STARTED:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: AppraisalAssignmentStatus) => {
    switch (status) {
      case AppraisalAssignmentStatus.PUBLISHED: return 'Published';
      case AppraisalAssignmentStatus.SUBMITTED: return 'Submitted';
      case AppraisalAssignmentStatus.IN_PROGRESS: return 'In Progress';
      case AppraisalAssignmentStatus.NOT_STARTED: return 'Not Started';
      default: return status;
    }
  };

  const getUpcomingDueDates = () => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return assignments
      .filter(a => a.dueDate && new Date(a.dueDate) <= nextWeek && new Date(a.dueDate) >= now)
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 3);
  };

  const getOverdueAssignments = () => {
    return assignments
      .filter(a => {
        if (!a.dueDate) return false;
        return new Date(a.dueDate) < new Date() && 
               a.status !== AppraisalAssignmentStatus.PUBLISHED && 
               a.status !== AppraisalAssignmentStatus.SUBMITTED;
      })
      .slice(0, 3);
  };

  const handleLogout = async () => {
    await logout();
  };

  const navigation = [
    { name: 'Dashboard', href: '/performance', icon: Home },
    { name: 'Team Evaluations', href: '/performance/assignments', icon: Users },
    { name: 'Team Analytics', href: '/performance/team', icon: BarChart },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const stats = getStats();
  const upcomingDueDates = getUpcomingDueDates();
  const overdueAssignments = getOverdueAssignments();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Performance Manager Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Manage and track your team's performance evaluations
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={fetchManagerData}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Active Cycle Info */}
          {activeCycle && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-blue-900">Active Appraisal Cycle</h3>
                    <p className="text-sm text-blue-700">{activeCycle.name}</p>
                  </div>
                </div>
                <div className="text-sm text-blue-700">
                  Ends: {new Date(activeCycle.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-500">Team Members</p>
              </div>
            </div>
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
                <p className="text-sm text-gray-500">Published</p>
              </div>
            </div>
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.submitted}</p>
                <p className="text-sm text-gray-500">Submitted</p>
              </div>
            </div>
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
            </div>
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">{stats.notStarted}</p>
                <p className="text-sm text-gray-500">Not Started</p>
              </div>
            </div>
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                <p className="text-sm text-gray-500">Overdue</p>
              </div>
            </div>
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{stats.completionRate}%</p>
                <p className="text-sm text-gray-500">Completion</p>
              </div>
            </div>
          </div>

          

          {/* Recent Activity */}
          <div className="bg-white border rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <h3 className="font-medium text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {assignments
                  .filter(a => a.status === AppraisalAssignmentStatus.SUBMITTED || a.status === AppraisalAssignmentStatus.PUBLISHED)
                  .sort((a, b) => new Date(b.submittedAt || b.assignedAt).getTime() - new Date(a.submittedAt || a.assignedAt).getTime())
                  .slice(0, 3)
                  .map((assignment) => (
                    <div key={assignment._id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          assignment.status === AppraisalAssignmentStatus.PUBLISHED 
                            ? 'bg-green-100' 
                            : 'bg-blue-100'
                        }`}>
                          {getStatusIcon(assignment.status)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {typeof assignment.employeeProfileId === 'object' && 'firstName' in assignment.employeeProfileId
                              ? `${assignment.employeeProfileId.firstName} ${assignment.employeeProfileId.lastName}`
                              : 'Team Member'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {getStatusText(assignment.status)} • {new Date(assignment.submittedAt || assignment.assignedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Link href={`/performance/assignments/view/${assignment._id}`}>
                        <button className="text-sm text-blue-600 hover:text-blue-800">
                          View Details
                        </button>
                      </Link>
                    </div>
                  ))}
                
                {assignments.filter(a => a.status === AppraisalAssignmentStatus.SUBMITTED || a.status === AppraisalAssignmentStatus.PUBLISHED).length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No recent activity</p>
                    <p className="text-sm text-gray-400">Complete your first evaluation to see activity here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}