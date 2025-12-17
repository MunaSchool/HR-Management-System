// app/(protected)/dashboard/admin/leaves/types/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Search, Filter, Download, Upload, 
  FileText, Calendar, AlertCircle, CheckCircle, XCircle,
  Eye, EyeOff, Lock, Unlock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import axiosInstance from '@/app/utils/ApiClient';

interface LeaveCategory {
  _id: string;
  name: string;
  description?: string;
}

interface LeaveType {
  _id: string;
  code: string;
  name: string;
  categoryId: string;
  category?: LeaveCategory;
  description?: string;
  paid: boolean;
  deductible: boolean;
  requiresAttachment: boolean;
  attachmentType?: 'medical' | 'document' | 'other';
  minTenureMonths?: number;
  maxDurationDays?: number;
  createdAt: string;
  updatedAt: string;
}

export default function LeaveTypesPage() {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [categories, setCategories] = useState<LeaveCategory[]>([]);
  const [filteredLeaveTypes, setFilteredLeaveTypes] = useState<LeaveType[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    categoryId: '',
    description: '',
    paid: true,
    deductible: true,
    requiresAttachment: false,
    attachmentType: '' as 'medical' | 'document' | 'other' | '',
    minTenureMonths: '',
    maxDurationDays: '',
  });

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Filter leave types based on search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredLeaveTypes(leaveTypes);
    } else {
      const filtered = leaveTypes.filter(type =>
        type.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLeaveTypes(filtered);
    }
  }, [leaveTypes, searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch categories for dropdown
      const categoriesResponse = await axiosInstance.get('/leaves/categories');
      setCategories(categoriesResponse.data);

      // Fetch leave types
      const leaveTypesResponse = await axiosInstance.get('/leaves/types');
      setLeaveTypes(leaveTypesResponse.data);
      setFilteredLeaveTypes(leaveTypesResponse.data);
      
      toast.success('Data loaded successfully');
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error(error.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare data for API
      const payload = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        categoryId: formData.categoryId,
        description: formData.description.trim() || undefined,
        paid: formData.paid,
        deductible: formData.deductible,
        requiresAttachment: formData.requiresAttachment,
        attachmentType: formData.requiresAttachment && formData.attachmentType 
          ? formData.attachmentType 
          : undefined,
        minTenureMonths: formData.minTenureMonths ? parseInt(formData.minTenureMonths) : undefined,
        maxDurationDays: formData.maxDurationDays ? parseInt(formData.maxDurationDays) : undefined,
      };

      await axiosInstance.post('/leaves/types', payload);
      toast.success('Leave type created successfully');
      setIsCreateDialogOpen(false);
      resetForm();
      fetchData(); // Refresh the list
    } catch (error: any) {
      console.error('Error creating leave type:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create leave type';
      
      if (errorMessage.includes('already exists')) {
        toast.error('A leave type with this code already exists');
      } else if (error.response?.status === 400) {
        toast.error('Please check your input. All required fields must be valid.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeaveType) return;
    
    setIsSubmitting(true);

    try {
      // Prepare data for API
      const payload = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        categoryId: formData.categoryId,
        description: formData.description.trim() || undefined,
        paid: formData.paid,
        deductible: formData.deductible,
        requiresAttachment: formData.requiresAttachment,
        attachmentType: formData.requiresAttachment && formData.attachmentType 
          ? formData.attachmentType 
          : undefined,
        minTenureMonths: formData.minTenureMonths ? parseInt(formData.minTenureMonths) : undefined,
        maxDurationDays: formData.maxDurationDays ? parseInt(formData.maxDurationDays) : undefined,
      };

      await axiosInstance.patch(`/leaves/types/${selectedLeaveType._id}`, payload);
      toast.success('Leave type updated successfully');
      setIsEditDialogOpen(false);
      setSelectedLeaveType(null);
      resetForm();
      fetchData(); // Refresh the list
    } catch (error: any) {
      console.error('Error updating leave type:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update leave type';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedLeaveType) return;

    try {
      await axiosInstance.delete(`/leaves/types/${selectedLeaveType._id}`);
      toast.success('Leave type deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedLeaveType(null);
      fetchData(); // Refresh the list
    } catch (error: any) {
      console.error('Error deleting leave type:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete leave type';
      
      if (errorMessage.includes('linked')) {
        toast.error('Cannot delete: This leave type is linked to active policies or requests.');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleEditClick = (leaveType: LeaveType) => {
    setSelectedLeaveType(leaveType);
    setFormData({
      code: leaveType.code,
      name: leaveType.name,
      categoryId: leaveType.categoryId,
      description: leaveType.description || '',
      paid: leaveType.paid,
      deductible: leaveType.deductible,
      requiresAttachment: leaveType.requiresAttachment,
      attachmentType: leaveType.attachmentType || '',
      minTenureMonths: leaveType.minTenureMonths?.toString() || '',
      maxDurationDays: leaveType.maxDurationDays?.toString() || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (leaveType: LeaveType) => {
    setSelectedLeaveType(leaveType);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      categoryId: '',
      description: '',
      paid: true,
      deductible: true,
      requiresAttachment: false,
      attachmentType: '',
      minTenureMonths: '',
      maxDurationDays: '',
    });
  };

  const getAttachmentTypeLabel = (type?: string) => {
    switch (type) {
      case 'medical': return 'Medical';
      case 'document': return 'Document';
      case 'other': return 'Other';
      default: return 'Not Required';
    }
  };

  const getAttachmentTypeColor = (type?: string) => {
    switch (type) {
      case 'medical': return 'bg-red-100 text-red-800';
      case 'document': return 'bg-blue-100 text-blue-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Leave Types</h1>
          <p className="text-gray-500">Define different types of leaves (Annual, Sick, Maternity, etc.)</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => {
            resetForm();
            setIsCreateDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Leave Type
          </Button>
        </div>
      </div>

      {/* Search and Filter Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by code, name, category, or description..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leave Types Table Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>All Leave Types</span>
            <Badge variant="secondary">
              {filteredLeaveTypes.length} type{filteredLeaveTypes.length !== 1 ? 's' : ''}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 mt-2">Loading leave types...</p>
            </div>
          ) : filteredLeaveTypes.length === 0 ? (
            <div className="text-center py-10">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <FileText className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No leave types found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating a new leave type'}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Leave Type
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="w-[100px]">Paid</TableHead>
                    <TableHead className="w-[100px]">Attachment</TableHead>
                    <TableHead className="w-[120px]">Created</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeaveTypes.map((type) => (
                    <TableRow key={type._id} className="hover:bg-gray-50">
                      <TableCell className="font-mono font-bold">
                        <Badge variant="outline">{type.code}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <span>{type.name}</span>
                          {type.deductible ? (
                            <Lock className="h-3 w-3 text-gray-400" />
                          ) : (
                            <Unlock className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                        {type.description && (
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {type.description}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {type.category?.name || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {type.paid ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Paid
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">
                            <XCircle className="mr-1 h-3 w-3" />
                            Unpaid
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {type.requiresAttachment ? (
                          <Badge className={getAttachmentTypeColor(type.attachmentType)}>
                            {getAttachmentTypeLabel(type.attachmentType)}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">
                            Not Required
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">
                          {new Date(type.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(type)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClick(type)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Leave Type Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Leave Type</DialogTitle>
            <DialogDescription>
              Define a new type of leave with all necessary parameters.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            {/* Code and Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., ANNUAL, SICK, MATERNITY"
                  required
                  maxLength={10}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500">Unique identifier (uppercase)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Annual Leave, Sick Leave"
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500">Display name for the leave type</p>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                disabled={isSubmitting || categories.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Choose the category this leave type belongs to</p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description of the leave type"
                disabled={isSubmitting}
              />
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="paid"
                  checked={formData.paid}
                  onCheckedChange={(checked) => setFormData({ ...formData, paid: checked === true })}
                  disabled={isSubmitting}
                />
                <Label htmlFor="paid" className="cursor-pointer">
                  Paid Leave
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="deductible"
                  checked={formData.deductible}
                  onCheckedChange={(checked) => setFormData({ ...formData, deductible: checked === true })}
                  disabled={isSubmitting}
                />
                <Label htmlFor="deductible" className="cursor-pointer">
                  Deductible from Balance
                </Label>
              </div>
            </div>

            {/* Attachment Section */}
            <div className="space-y-3 border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requiresAttachment"
                  checked={formData.requiresAttachment}
                  onCheckedChange={(checked) => setFormData({ 
                    ...formData, 
                    requiresAttachment: checked === true,
                    attachmentType: checked === true ? 'medical' : ''
                  })}
                  disabled={isSubmitting}
                />
                <Label htmlFor="requiresAttachment" className="cursor-pointer font-medium">
                  Requires Supporting Attachment
                </Label>
              </div>
              
              {formData.requiresAttachment && (
                <div className="space-y-2 pl-6">
                  <Label htmlFor="attachmentType">Attachment Type *</Label>
                  <Select
                    value={formData.attachmentType}
                    onValueChange={(value: 'medical' | 'document' | 'other') => 
                      setFormData({ ...formData, attachmentType: value })
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select attachment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medical">Medical Certificate</SelectItem>
                      <SelectItem value="document">Official Document</SelectItem>
                      <SelectItem value="other">Other Supporting Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Tenure and Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minTenureMonths">Minimum Tenure (months)</Label>
                <Input
                  id="minTenureMonths"
                  type="number"
                  min="0"
                  value={formData.minTenureMonths}
                  onChange={(e) => setFormData({ ...formData, minTenureMonths: e.target.value })}
                  placeholder="e.g., 6"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500">Minimum months of service required</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxDurationDays">Maximum Duration (days)</Label>
                <Input
                  id="maxDurationDays"
                  type="number"
                  min="1"
                  value={formData.maxDurationDays}
                  onChange={(e) => setFormData({ ...formData, maxDurationDays: e.target.value })}
                  placeholder="e.g., 30"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500">Maximum consecutive days allowed</p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !formData.code || !formData.name || !formData.categoryId}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Creating...
                  </>
                ) : (
                  'Create Leave Type'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Leave Type Dialog (similar to create) */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Leave Type</DialogTitle>
            <DialogDescription>
              Update the leave type details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            {/* Same form fields as create dialog */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-code">Code *</Label>
                <Input
                  id="edit-code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  required
                  maxLength={10}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Category *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-paid"
                  checked={formData.paid}
                  onCheckedChange={(checked) => setFormData({ ...formData, paid: checked === true })}
                  disabled={isSubmitting}
                />
                <Label htmlFor="edit-paid" className="cursor-pointer">
                  Paid Leave
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-deductible"
                  checked={formData.deductible}
                  onCheckedChange={(checked) => setFormData({ ...formData, deductible: checked === true })}
                  disabled={isSubmitting}
                />
                <Label htmlFor="edit-deductible" className="cursor-pointer">
                  Deductible from Balance
                </Label>
              </div>
            </div>

            <div className="space-y-3 border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-requiresAttachment"
                  checked={formData.requiresAttachment}
                  onCheckedChange={(checked) => setFormData({ 
                    ...formData, 
                    requiresAttachment: checked === true,
                    attachmentType: checked === true ? formData.attachmentType || 'medical' : ''
                  })}
                  disabled={isSubmitting}
                />
                <Label htmlFor="edit-requiresAttachment" className="cursor-pointer font-medium">
                  Requires Supporting Attachment
                </Label>
              </div>
              
              {formData.requiresAttachment && (
                <div className="space-y-2 pl-6">
                  <Label htmlFor="edit-attachmentType">Attachment Type *</Label>
                  <Select
                    value={formData.attachmentType}
                    onValueChange={(value: 'medical' | 'document' | 'other') => 
                      setFormData({ ...formData, attachmentType: value })
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select attachment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medical">Medical Certificate</SelectItem>
                      <SelectItem value="document">Official Document</SelectItem>
                      <SelectItem value="other">Other Supporting Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-minTenureMonths">Minimum Tenure (months)</Label>
                <Input
                  id="edit-minTenureMonths"
                  type="number"
                  min="0"
                  value={formData.minTenureMonths}
                  onChange={(e) => setFormData({ ...formData, minTenureMonths: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-maxDurationDays">Maximum Duration (days)</Label>
                <Input
                  id="edit-maxDurationDays"
                  type="number"
                  min="1"
                  value={formData.maxDurationDays}
                  onChange={(e) => setFormData({ ...formData, maxDurationDays: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !formData.code || !formData.name || !formData.categoryId}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Updating...
                  </>
                ) : (
                  'Update Leave Type'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the leave type "
              <span className="font-semibold">{selectedLeaveType?.name}</span>" 
              (Code: <span className="font-mono">{selectedLeaveType?.code}</span>).
              <br />
              <br />
              <span className="font-medium text-red-600">
                Warning: If this leave type is linked to any active policies or requests, deletion will fail.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedLeaveType(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Leave Type
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}