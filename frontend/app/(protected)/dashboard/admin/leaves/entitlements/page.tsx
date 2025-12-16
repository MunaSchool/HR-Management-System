// app/(protected)/dashboard/admin/leaves/entitlements/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Search, Filter, Download, Upload, 
  RefreshCw, User, Calendar, Calculator, Eye, AlertCircle,
  ChevronDown, ChevronUp, Users, FileText, CheckCircle,
  XCircle, Clock, TrendingUp, TrendingDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import axiosInstance from '@/app/utils/ApiClient';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

// ---------------- Types ----------------

type AdjustmentType = 'add' | 'deduct' | 'encashment';

interface Employee {
  _id: string;
  employeeId?: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  department?: string;
  position?: string;
  grade?: string;
  tenure?: number;
  contractType?: string;
  status?: string;
}

interface LeaveType {
  _id: string;
  name: string;
  code: string;
  category?: any;
}

interface LeaveEntitlement {
  _id: string;
  employeeId: Employee;
  leaveTypeId: LeaveType;
  yearlyEntitlement: number;
  accruedActual: number;
  accruedRounded: number;
  carryForward: number;
  taken: number;
  pending: number;
  remaining: number;
  lastAccrualDate?: string;
  nextResetDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface Adjustment {
  _id: string;
  employeeId: string;
  leaveTypeId: string;
  adjustmentType: AdjustmentType;
}

interface AdjustFormState {
  adjustmentType: AdjustmentType;
  amount: string;
  reason: string;
}

// ---------------- Component ----------------

export default function LeaveEntitlementsPage() {
  // States
  const [entitlements, setEntitlements] = useState<LeaveEntitlement[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [selectedLeaveType, setSelectedLeaveType] = useState<string>('all');
  const [showLowBalance, setShowLowBalance] = useState(false);
  const [sortField, setSortField] = useState<'employee' | 'remaining' | 'taken'>('employee');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Dialog states
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Selected items
  const [selectedEntitlement, setSelectedEntitlement] = useState<LeaveEntitlement | null>(null);
  const [selectedForAdjustment, setSelectedForAdjustment] = useState<LeaveEntitlement | null>(null);
  
  // Form states
  const [generateEmployeeId, setGenerateEmployeeId] = useState('');
  const [adjustForm, setAdjustForm] = useState<AdjustFormState>({
    adjustmentType: 'add',
    amount: '',
    reason: '',
  });
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('all'); // all, low, high, expiring
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Initialize
  useEffect(() => {
    fetchEntitlements();
    fetchEmployees();
  }, []);

  // Fetch entitlements
  const fetchEntitlements = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/leaves/entitlements');
      setEntitlements(response.data);
      toast.success('Entitlements loaded successfully');
    } catch (error: any) {
      console.error('Error fetching entitlements:', error);
      toast.error(error.response?.data?.message || 'Failed to load entitlements');
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees for dropdown
  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const response = await axiosInstance.get('/employee-profile'); // Adjust endpoint if needed
      setEmployees(response.data);
    } catch (error: any) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoadingEmployees(false);
    }
  };

  // Generate entitlements for an employee
  const handleGenerateEntitlements = async () => {
    if (!generateEmployeeId) {
      toast.error('Please select an employee');
      return;
    }

    try {
      await axiosInstance.post(`/leaves/entitlements/${generateEmployeeId}`);
      toast.success('Entitlements generated successfully');
      setIsGenerateDialogOpen(false);
      setGenerateEmployeeId('');
      fetchEntitlements(); // Refresh list
    } catch (error: any) {
      console.error('Error generating entitlements:', error);
      if (error.response?.status === 404) {
        toast.error('Employee not found');
      } else if (error.response?.status === 400) {
        toast.error('Entitlements already exist for this employee');
      } else {
        toast.error(error.response?.data?.message || 'Failed to generate entitlements');
      }
    }
  };

  // Manual adjustment
  const handleAdjustEntitlement = async () => {
    if (
      !selectedForAdjustment ||
      !adjustForm.amount ||
      parseFloat(adjustForm.amount) <= 0
    ) {
      toast.error('Please enter valid adjustment amount');
      return;
    }

    try {
      const payload = {
        employeeId: selectedForAdjustment.employeeId._id,
        leaveTypeId: selectedForAdjustment.leaveTypeId._id,
        adjustmentType: adjustForm.adjustmentType,
        amount: parseFloat(adjustForm.amount),
        reason: adjustForm.reason,
      };

      await axiosInstance.post('/leaves/adjustments', payload);
      toast.success('Adjustment applied successfully');
      setIsAdjustDialogOpen(false);
      setSelectedForAdjustment(null);
      setAdjustForm({ adjustmentType: 'add', amount: '', reason: '' });
      fetchEntitlements(); // Refresh list
    } catch (error: any) {
      console.error('Error adjusting entitlement:', error);
      toast.error(error.response?.data?.message || 'Failed to apply adjustment');
    }
  };

  // Calculate utilization percentage
  const calculateUtilization = (entitlement: LeaveEntitlement) => {
    const totalAvailable = entitlement.yearlyEntitlement + entitlement.carryForward;
    if (totalAvailable === 0) return 0;
    return Math.round((entitlement.taken / totalAvailable) * 100);
  };

  // Get status color
  const getStatusColor = (entitlement: LeaveEntitlement) => {
    const utilization = calculateUtilization(entitlement);
    if (utilization >= 80) return 'text-red-600 bg-red-50';
    if (utilization >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  // Get leave type color
  const getLeaveTypeColor = (typeName: string) => {
    const colors: Record<string, string> = {
      Annual: 'bg-blue-100 text-blue-800',
      Sick: 'bg-red-100 text-red-800',
      Maternity: 'bg-pink-100 text-pink-800',
      Paternity: 'bg-teal-100 text-teal-800',
      Emergency: 'bg-orange-100 text-orange-800',
      Unpaid: 'bg-gray-100 text-gray-800',
    };
    return colors[typeName] || 'bg-gray-100 text-gray-800';
  };

  // Filter and sort entitlements
  const filteredEntitlements = entitlements
    .filter((ent) => {
      // Employee filter
      if (selectedEmployee !== 'all' && ent.employeeId._id !== selectedEmployee) {
        return false;
      }
      
      // Leave type filter
      if (selectedLeaveType !== 'all' && ent.leaveTypeId._id !== selectedLeaveType) {
        return false;
      }
      
      // Search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const employeeName = `${ent.employeeId.firstName} ${ent.employeeId.lastName}`.toLowerCase();
        const leaveTypeName = ent.leaveTypeId.name.toLowerCase();
        if (!employeeName.includes(searchLower) && !leaveTypeName.includes(searchLower)) {
          return false;
        }
      }
      
      // Low balance filter
      if (showLowBalance && ent.remaining > 5) {
        return false;
      }
      
      // Status filter
      if (statusFilter !== 'all') {
        const utilization = calculateUtilization(ent);
        if (statusFilter === 'low' && utilization < 50) return false;
        if (statusFilter === 'high' && utilization < 80) return false;
        if (statusFilter === 'expiring') {
          if (!ent.nextResetDate) return false;
          const resetDate = new Date(ent.nextResetDate);
          const today = new Date();
          const daysUntilReset = Math.ceil(
            (resetDate.getTime() - today.getTime()) / (1000 * 3600 * 24),
          );
          if (daysUntilReset > 30) return false;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      let aVal: any;
      let bVal: any;
      
      switch (sortField) {
        case 'employee':
          aVal = `${a.employeeId.firstName} ${a.employeeId.lastName}`;
          bVal = `${b.employeeId.firstName} ${b.employeeId.lastName}`;
          break;
        case 'remaining':
          aVal = a.remaining;
          bVal = b.remaining;
          break;
        case 'taken':
          aVal = a.taken;
          bVal = b.taken;
          break;
        default:
          return 0;
      }
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  // Get unique leave types
 const leaveTypesMap = new Map<string, LeaveType>();

entitlements.forEach((e) => {
  const lt = e.leaveTypeId;
  if (lt && !leaveTypesMap.has(lt._id)) {
    leaveTypesMap.set(lt._id, lt);
  }
});

const leaveTypes = Array.from(leaveTypesMap.values());


  // Handle sort click
  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get employee full name
  const getEmployeeName = (employee: Employee) => {
    return employee.fullName || `${employee.firstName} ${employee.lastName}`;
  };

  // Calculate low balance (less than 20% remaining)
  const isLowBalance = (entitlement: LeaveEntitlement) => {
    const total = entitlement.yearlyEntitlement + entitlement.carryForward;
    return total > 0 && entitlement.remaining / total < 0.2;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Leave Entitlements</h1>
          <p className="text-gray-500">
            Manage employee leave balances, accruals, and adjustments
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={fetchEntitlements} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setIsGenerateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Generate Entitlements
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(entitlements.map((e) => e.employeeId._id)).size}
            </div>
            <p className="text-xs text-gray-500">With leave entitlements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {entitlements.filter(isLowBalance).length}
            </div>
            <p className="text-xs text-gray-500">Need attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {entitlements.length > 0
                ? Math.round(
                    entitlements.reduce(
                      (sum, e) => sum + calculateUtilization(e),
                      0,
                    ) / entitlements.length,
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-gray-500">Across all entitlements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {entitlements.reduce((sum, e) => sum + e.pending, 0)}
            </div>
            <p className="text-xs text-gray-500">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by employee name or leave type..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger className="w-[180px]">
                  <User className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {employees.map((emp, index) => (
                    <SelectItem key={`${emp._id}-${index}`} value={emp._id}>
                      {getEmployeeName(emp)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLeaveType} onValueChange={setSelectedLeaveType}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Leave Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Leave Types</SelectItem>
                  {leaveTypes.map((type, index) => (
                    <SelectItem key={`${type._id}-${index}`} value={type._id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="low">Low Balance (&lt;20%)</SelectItem>
                  <SelectItem value="high">High Utilization (&gt;80%)</SelectItem>
                  <SelectItem value="expiring">Expiring Soon</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={showLowBalance ? 'default' : 'outline'}
                onClick={() => setShowLowBalance(!showLowBalance)}
                className="flex items-center"
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Low Balance
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entitlements Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Leave Entitlements</span>
            <Badge variant="secondary">
              {filteredEntitlements.length} record
              {filteredEntitlements.length !== 1 ? 's' : ''}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            // Skeleton loader
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : filteredEntitlements.length === 0 ? (
            <div className="text-center py-10">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No entitlements found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedEmployee !== 'all' || selectedLeaveType !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Get started by generating entitlements for employees'}
              </p>
              {!searchTerm &&
                selectedEmployee === 'all' &&
                selectedLeaveType === 'all' && (
                  <Button className="mt-4" onClick={() => setIsGenerateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Generate Entitlements
                  </Button>
                )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('employee')}
                    >
                      <div className="flex items-center">
                        Employee
                        {sortField === 'employee' &&
                          (sortDirection === 'asc' ? (
                            <ChevronUp className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronDown className="ml-1 h-4 w-4" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Yearly</TableHead>
                    <TableHead>Carry Forward</TableHead>
                    <TableHead>Taken</TableHead>
                    <TableHead>Pending</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('remaining')}
                    >
                      <div className="flex items-center">
                        Remaining
                        {sortField === 'remaining' &&
                          (sortDirection === 'asc' ? (
                            <ChevronUp className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronDown className="ml-1 h-4 w-4" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead>Utilization</TableHead>
                    <TableHead>Last Accrual</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntitlements.map((entitlement, index) => {
                    const utilization = calculateUtilization(entitlement);
                    const isLow = isLowBalance(entitlement);
                    
                    return (
                      <TableRow
                        key={`${entitlement._id}-${index}`}
                        className={isLow ? 'bg-red-50' : ''}
                      >
                        <TableCell>
                          <div className="font-medium">
                            {getEmployeeName(entitlement.employeeId)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {entitlement.employeeId.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getLeaveTypeColor(entitlement.leaveTypeId.name)}
                          >
                            {entitlement.leaveTypeId.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {entitlement.yearlyEntitlement} days
                        </TableCell>
                        <TableCell>
                          {entitlement.carryForward > 0 ? (
                            <Badge
                              variant="outline"
                              className="text-green-600 border-green-200"
                            >
                              +{entitlement.carryForward}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">0</span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {entitlement.taken}
                            {entitlement.taken > 0 && (
                              <TrendingUp className="ml-1 h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {entitlement.pending > 0 ? (
                            <Badge
                              variant="outline"
                              className="text-yellow-600 border-yellow-200"
                            >
                              {entitlement.pending}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">0</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div
                            className={`font-bold ${
                              isLow ? 'text-red-600' : 'text-green-600'
                            }`}
                          >
                            {entitlement.remaining} days
                          </div>
                          {isLow && (
                            <div className="text-xs text-red-500 flex items-center">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              Low balance
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{utilization}%</span>
                            </div>
                            <Progress
                              value={utilization}
                              className={`h-2 ${
                                utilization >= 80
                                  ? 'bg-red-200'
                                  : utilization >= 50
                                  ? 'bg-yellow-200'
                                  : 'bg-green-200'
                              }`}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-500">
                            {formatDate(entitlement.lastAccrualDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedEntitlement(entitlement);
                                setIsDetailsDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  •••
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedForAdjustment(entitlement);
                                    setIsAdjustDialogOpen(true);
                                  }}
                                >
                                  <Calculator className="mr-2 h-4 w-4" />
                                  Adjust Balance
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    // TODO: view employee's leave requests
                                  }}
                                >
                                  <FileText className="mr-2 h-4 w-4" />
                                  View Requests
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setSelectedEntitlement(entitlement);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Entitlement
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate Entitlements Dialog */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate Leave Entitlements</DialogTitle>
            <DialogDescription>
              Create leave entitlements for an employee based on their grade, tenure,
              and contract type.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Select Employee *</Label>
              <Select 
                value={generateEmployeeId} 
                onValueChange={setGenerateEmployeeId}
                disabled={loadingEmployees}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an employee" />
                </SelectTrigger>
                <SelectContent>
                  {loadingEmployees ? (
                    <SelectItem value="loading" disabled>
                      Loading employees...
                    </SelectItem>
                  ) : employees.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No employees found
                    </SelectItem>
                  ) : (
                    employees.map((emp, index) => (
                      <SelectItem key={`${emp._id}-${index}`} value={emp._id}>
                        {getEmployeeName(emp)} ({emp.email})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Entitlements will be calculated based on employee&apos;s grade and tenure
              </p>
            </div>
            
            {generateEmployeeId && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Calculated Entitlements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">
                    <p>The system will generate entitlements for all leave types:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Annual Leave: Based on grade and tenure</li>
                      <li>Sick Leave: Standard policy</li>
                      <li>Other leave types as configured</li>
                    </ul>
                    <p className="mt-2 text-xs text-yellow-600">
                      Note: If entitlements already exist, this action will fail.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleGenerateEntitlements} 
              disabled={!generateEmployeeId || loadingEmployees}
            >
              Generate Entitlements
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Adjust Balance Dialog */}
      <Dialog
        open={isAdjustDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedForAdjustment(null);
            setAdjustForm({ adjustmentType: 'add', amount: '', reason: '' });
          }
          setIsAdjustDialogOpen(open);
        }}
      >
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Adjust Leave Balance</DialogTitle>
            <DialogDescription>
              Manually adjust leave balance for{' '}
              {selectedForAdjustment &&
                `${getEmployeeName(selectedForAdjustment.employeeId)} - ${
                  selectedForAdjustment.leaveTypeId.name
                }`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedForAdjustment && (
           <div className="space-y-4 flex-1 overflow-y-auto pr-1">
              {/* Current balance summary */}
              <Card>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Current Balance</p>
                      <p className="font-bold text-lg">
                        {selectedForAdjustment.remaining} days
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Yearly Entitlement</p>
                      <p className="font-medium">
                        {selectedForAdjustment.yearlyEntitlement} days
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-2">
                <Label htmlFor="adjustmentType">Adjustment Type</Label>
                <Select 
                  value={adjustForm.adjustmentType}
                  onValueChange={(value: AdjustmentType) =>
                    setAdjustForm((prev) => ({ ...prev, adjustmentType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Add Days</SelectItem>
                    <SelectItem value="deduct">Deduct Days</SelectItem>
                    <SelectItem value="encashment">Encashment (Pay Out)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">
                  {adjustForm.adjustmentType === 'add'
                    ? 'Days to Add'
                    : adjustForm.adjustmentType === 'deduct'
                    ? 'Days to Deduct'
                    : 'Days to Encash (deduct from balance)'}
                </Label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={adjustForm.amount}
                  onChange={(e) =>
                    setAdjustForm((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  placeholder="Enter number of days"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Adjustment *</Label>
                <Input
                  value={adjustForm.reason}
                  onChange={(e) =>
                    setAdjustForm((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  placeholder="e.g., Manual correction, Special approval, etc."
                />
              </div>
              
              {adjustForm.amount && (
                <Card className="bg-gray-50">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <div className="text-sm space-y-1">
                      <p>Current: {selectedForAdjustment.remaining} days</p>
                      <p>
                        Adjustment: {adjustForm.adjustmentType}{' '}
                        {adjustForm.amount} days
                      </p>
                      <p className="font-bold">
                        New Balance:{' '}
                        {(() => {
                          const current = selectedForAdjustment.remaining;
                          const amt = parseFloat(adjustForm.amount || '0');

                          if (adjustForm.adjustmentType === 'add') {
                            return current + amt;
                          }

                          // both deduct and encashment reduce balance
                          return Math.max(0, current - amt);
                        })()}{' '}
                        days
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdjustDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAdjustEntitlement}
              disabled={
                !adjustForm.amount ||
                !adjustForm.reason ||
                parseFloat(adjustForm.amount) <= 0
              }
            >
              Apply Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Entitlement Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Entitlement Details</DialogTitle>
          </DialogHeader>
          
          {selectedEntitlement && (
            <div className="space-y-6">
              <Tabs defaultValue="overview">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  {/* Employee Info */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Employee Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Name</p>
                          <p className="font-medium">
                            {getEmployeeName(selectedEntitlement.employeeId)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Email</p>
                          <p className="font-medium">
                            {selectedEntitlement.employeeId.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Grade</p>
                          <p className="font-medium">
                            {selectedEntitlement.employeeId.grade || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Tenure</p>
                          <p className="font-medium">
                            {selectedEntitlement.employeeId.tenure || 0} years
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Balance Details */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Balance Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">Leave Type</p>
                            <Badge
                              className={getLeaveTypeColor(
                                selectedEntitlement.leaveTypeId.name,
                              )}
                            >
                              {selectedEntitlement.leaveTypeId.name}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">
                              Yearly Entitlement
                            </p>
                            <p className="font-bold">
                              {selectedEntitlement.yearlyEntitlement} days
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2 pt-4 border-t">
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <p className="text-xs text-blue-700">Carry Forward</p>
                            <p className="text-lg font-bold">
                              {selectedEntitlement.carryForward}
                            </p>
                          </div>
                          <div className="text-center p-2 bg-red-50 rounded">
                            <p className="text-xs text-red-700">Taken</p>
                            <p className="text-lg font-bold">
                              {selectedEntitlement.taken}
                            </p>
                          </div>
                          <div className="text-center p-2 bg-yellow-50 rounded">
                            <p className="text-xs text-yellow-700">Pending</p>
                            <p className="text-lg font-bold">
                              {selectedEntitlement.pending}
                            </p>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded">
                            <p className="text-xs text-green-700">Remaining</p>
                            <p className="text-lg font-bold">
                              {selectedEntitlement.remaining}
                            </p>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t">
                          <div className="flex justify-between text-sm mb-1">
                            <span>
                              Utilization:{' '}
                              {calculateUtilization(selectedEntitlement)}%
                            </span>
                            <span>
                              {selectedEntitlement.taken} of{' '}
                              {selectedEntitlement.yearlyEntitlement +
                                selectedEntitlement.carryForward}{' '}
                              days
                            </span>
                          </div>
                          <Progress
                            value={calculateUtilization(selectedEntitlement)}
                            className="h-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Accrual Info */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Accrual Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Last Accrual</p>
                          <p className="font-medium">
                            {formatDate(selectedEntitlement.lastAccrualDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Next Reset</p>
                          <p className="font-medium">
                            {formatDate(selectedEntitlement.nextResetDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Accrued (Actual)</p>
                          <p className="font-medium">
                            {selectedEntitlement.accruedActual.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Accrued (Rounded)</p>
                          <p className="font-medium">
                            {selectedEntitlement.accruedRounded}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="history" className="space-y-4">
                  <p className="text-sm text-gray-500">
                    Adjustment history will be shown here once adjustments are
                    made.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedForAdjustment(selectedEntitlement);
                      setIsAdjustDialogOpen(true);
                      setIsDetailsDialogOpen(false);
                    }}
                  >
                    <Calculator className="mr-2 h-4 w-4" />
                    Make Adjustment
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the leave
              entitlement for{' '}
              <span className="font-semibold">
                {selectedEntitlement &&
                  getEmployeeName(selectedEntitlement.employeeId)}
              </span>{' '}
              for leave type{' '}
              <span className="font-semibold">
                {selectedEntitlement?.leaveTypeId.name}
              </span>
              .
              <br />
              <br />
              <span className="text-red-600 font-medium">
                Warning: This will remove all accrual history and cannot be
                recovered. The employee will need new entitlements generated.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedEntitlement(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!selectedEntitlement) return;
                // Backend delete endpoint not implemented yet
                toast.error('Delete endpoint not implemented in backend');
                setIsDeleteDialogOpen(false);
                setSelectedEntitlement(null);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Entitlement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
