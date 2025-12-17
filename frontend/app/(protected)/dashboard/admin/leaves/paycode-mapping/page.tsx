'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/app/utils/ApiClient';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Search, Plus, Trash2, Edit3, Save, X as XIcon, RefreshCcw } from 'lucide-react';

type LeaveType = {
  _id: string;
  name: string;
  code?: string;
};

type PaycodeMapping = {
  _id: string;
  leaveTypeId: LeaveType | string;
  payrollCode: string;
  description?: string;
};

export default function PaycodeMappingAdminPage() {
  const [mappings, setMappings] = useState<PaycodeMapping[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // create dialog state
  const [createOpen, setCreateOpen] = useState(false);
  const [newLeaveTypeId, setNewLeaveTypeId] = useState('');
  const [newPayrollCode, setNewPayrollCode] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPayrollCode, setEditPayrollCode] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [mapRes, typesRes] = await Promise.all([
        axiosInstance.get('/leaves/paycode-mapping'),
        axiosInstance.get('/leaves/types'),
      ]);

      setMappings(mapRes.data || []);
      setLeaveTypes(typesRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load paycode mappings');
    } finally {
      setLoading(false);
    }
  };

  // helper for readable leave type name
  const getLeaveTypeName = (mapping: PaycodeMapping) => {
    const lt = mapping.leaveTypeId as any;
    if (typeof lt === 'string') {
      const found = leaveTypes.find((t) => t._id === lt);
      return found ? found.name : 'Unknown';
    }
    return lt?.name || 'Unknown';
  };

  // list filtered
  const filteredMappings = mappings.filter((m) => {
    const name = getLeaveTypeName(m).toLowerCase();
    const code = (m.payrollCode || '').toLowerCase();
    const desc = (m.description || '').toLowerCase();
    const q = search.toLowerCase();

    return name.includes(q) || code.includes(q) || desc.includes(q);
  });

  // ===========================
  // CREATE
  // ===========================
  const handleCreate = async () => {
    if (!newLeaveTypeId || !newPayrollCode.trim()) {
      toast.error('Leave type and payroll code are required');
      return;
    }
    try {
      setLoading(true);
      await axiosInstance.post('/leaves/paycode-mapping', {
        leaveTypeId: newLeaveTypeId,
        payrollCode: newPayrollCode.trim(),
        description: newDescription.trim() || undefined,
      });

      toast.success('Paycode mapping created');
      setCreateOpen(false);
      setNewLeaveTypeId('');
      setNewPayrollCode('');
      setNewDescription('');
      await loadData();
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        'Error creating paycode mapping (maybe mapping already exists for this leave type)';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // EDIT
  // ===========================
  const startEdit = (m: PaycodeMapping) => {
    setEditingId(m._id);
    setEditPayrollCode(m.payrollCode || '');
    setEditDescription(m.description || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditPayrollCode('');
    setEditDescription('');
  };

  const handleUpdate = async (id: string) => {
    try {
      setLoading(true);
      await axiosInstance.patch(`/leaves/paycode-mapping/${id}`, {
        payrollCode: editPayrollCode.trim(),
        description: editDescription.trim() || undefined,
      });
      toast.success('Mapping updated');
      setEditingId(null);
      await loadData();
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || 'Error updating paycode mapping',
      );
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // DELETE
  // ===========================
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this mapping?')) return;
    try {
      setLoading(true);
      await axiosInstance.delete(`/leaves/paycode-mapping/${id}`);
      toast.success('Mapping deleted');
      await loadData();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Error deleting mapping');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leave Paycode Mapping</h1>
          <p className="text-gray-500">
            Map each leave type to its payroll code for downstream payroll
            processing.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Mapping
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by leave type, payroll code, or description..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Paycode Mappings</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-6 text-center text-gray-500">
              Loading...
            </div>
          ) : filteredMappings.length === 0 ? (
            <div className="py-6 text-center text-gray-400">
              No mappings found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Payroll Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMappings.map((m) => (
                    <TableRow key={m._id}>
                      <TableCell>{getLeaveTypeName(m)}</TableCell>
                      <TableCell>
                        {editingId === m._id ? (
                          <Input
                            value={editPayrollCode}
                            onChange={(e) =>
                              setEditPayrollCode(e.target.value)
                            }
                          />
                        ) : (
                          m.payrollCode
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === m._id ? (
                          <Input
                            value={editDescription}
                            onChange={(e) =>
                              setEditDescription(e.target.value)
                            }
                          />
                        ) : (
                          m.description || '—'
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === m._id ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleUpdate(m._id)}
                              disabled={loading}
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEdit}
                              disabled={loading}
                            >
                              <XIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEdit(m)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(m._id)}
                              disabled={loading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>New Paycode Mapping</DialogTitle>
            <DialogDescription>
              Link a leave type to its payroll code.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Leave Type</label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                value={newLeaveTypeId}
                onChange={(e) => setNewLeaveTypeId(e.target.value)}
              >
                <option value="">Select leave type...</option>
                {leaveTypes.map((lt) => (
                  <option key={lt._id} value={lt._id}>
                    {lt.name} {lt.code ? `(${lt.code})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Payroll Code</label>
              <Input
                placeholder="e.g. ANL-PAY"
                value={newPayrollCode}
                onChange={(e) => setNewPayrollCode(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Description (optional)
              </label>
              <Input
                placeholder="Short explanation for HR/Payroll"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={loading}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}