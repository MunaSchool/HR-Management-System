'use client';

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/app/utils/ApiClient';
import { toast } from 'sonner';

interface Adjustment {
  _id: string;
  employeeId: { _id: string; firstName: string; lastName: string; email: string };
  leaveTypeId: { _id: string; name: string };
  adjustmentType: string;
  amount: number;
  reason: string;
  createdAt: string;
}

export default function LeaveAdjustmentsPage() {
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdjustments();
  }, []);

  const fetchAdjustments = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/leaves/adjustments');
      setAdjustments(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load adjustments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Leave Adjustments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : adjustments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No adjustments found
                    </TableCell>
                  </TableRow>
                ) : (
                  adjustments.map((adj) => (
                    <TableRow key={adj._id}>
                      <TableCell>{`${adj.employeeId.firstName} ${adj.employeeId.lastName}`}</TableCell>
                      <TableCell>{adj.leaveTypeId.name}</TableCell>
                      <TableCell>{adj.adjustmentType}</TableCell>
                      <TableCell>{adj.amount}</TableCell>
                      <TableCell>{adj.reason}</TableCell>
                      <TableCell>{new Date(adj.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
