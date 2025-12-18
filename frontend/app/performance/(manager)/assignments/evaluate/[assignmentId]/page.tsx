'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { performanceApi } from '@/app/utils/performanceApi';
import { useAuth } from '@/app/(system)/context/authContext';
import { isLineManager } from '@/app/utils/roleCheck';

export default function EvaluateAssignmentPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [assignment, setAssignment] = useState<any>(null);

  // Manager-only guard (REQ-AE-03 / BR-41)
  useEffect(() => {
    if (!loading && user && !isLineManager(user)) {
      router.replace('/performance');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!assignmentId) return;

    performanceApi
      .getAppraisalAssignmentById(assignmentId) // ✅ FIXED
      .then(setAssignment)
      .catch(() => router.replace('/performance/assignments'));
  }, [assignmentId, router]);

  if (!assignment) return <p>Loading evaluation...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Evaluate Employee</h1>
      <p>
        Employee:{' '}
        <strong>
          {assignment.employeeProfileId?.firstName}{' '}
          {assignment.employeeProfileId?.lastName}
        </strong>
      </p>

      {/* Next step: template sections + ratings */}
    </div>
  );
}
