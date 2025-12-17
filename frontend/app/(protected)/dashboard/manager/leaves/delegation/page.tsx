'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axiosInstance from '@/app/utils/ApiClient';
import Select from 'react-select';

interface Employee {
  _id: string;
  fullName: string;
  workEmail?: string;
}

interface Delegation {
  delegateId: string;
  delegateName: string;
  startDate: string;
  endDate: string;
}

export default function ManagerDelegationPage() {
  const [team, setTeam] = useState<Employee[]>([]);
  const [currentDelegation, setCurrentDelegation] = useState<Delegation | null>(null);
  const [selectedDelegate, setSelectedDelegate] = useState<Employee | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTeamAndDelegation();
  }, []);

  const fetchTeamAndDelegation = async () => {
    setLoading(true);
    try {
      // Fetch manager's team by extracting unique employees from leave requests
      const res = await axiosInstance.get('/leaves/requests');
      const allRequests = res.data || [];

      const membersMap: Record<string, Employee> = {};
      allRequests.forEach((r: any) => {
        if (r.employeeId && !membersMap[r.employeeId._id]) {
          membersMap[r.employeeId._id] = r.employeeId;
        }
      });
      setTeam(Object.values(membersMap));

      // Fetch current delegation
      const delegationRes = await axiosInstance.get<Delegation | null>('/leaves/delegation');
      setCurrentDelegation(delegationRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load delegation data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDelegate = async () => {
    if (!selectedDelegate || !startDate || !endDate) {
      toast.error('Please select a delegate and set start/end dates');
      return;
    }

    setSaving(true);
    try {
      await axiosInstance.post('/leaves/delegation', {
        delegateManagerId: selectedDelegate._id, // ✅ fixed field name
        startDate,
        endDate,
      });

      toast.success('Delegate assigned successfully');
      setCurrentDelegation({
        delegateId: selectedDelegate._id,
        delegateName: selectedDelegate.fullName,
        startDate,
        endDate,
      });

      setSelectedDelegate(null);
      setStartDate('');
      setEndDate('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to assign delegate');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-2 text-gray-500">Loading delegation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Delegation Settings</h1>
        <p className="text-gray-500">Assign a delegate during your absence</p>
      </div>

      {/* Current Delegation */}
      {currentDelegation && (
        <Card>
          <CardHeader>
            <CardTitle>Current Delegate</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Name:</strong> {currentDelegation.delegateName}</p>
            <p><strong>Start:</strong> {new Date(currentDelegation.startDate).toLocaleDateString()}</p>
            <p><strong>End:</strong> {new Date(currentDelegation.endDate).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      )}

      {/* Assign Delegate Form */}
      <Card>
        <CardHeader>
          <CardTitle>Assign New Delegate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Delegate</Label>
            <Select
              options={team.map(emp => ({ value: emp._id, label: emp.fullName }))}
              value={selectedDelegate ? { value: selectedDelegate._id, label: selectedDelegate.fullName } : null}
              onChange={(option: any) => {
                const emp = team.find(e => e._id === option.value) || null;
                setSelectedDelegate(emp);
              }}
            />
          </div>

          <div>
            <Label>Start Date</Label>
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>

          <div>
            <Label>End Date</Label>
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>

          <Button onClick={handleAssignDelegate} disabled={saving}>
            Assign Delegate
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
