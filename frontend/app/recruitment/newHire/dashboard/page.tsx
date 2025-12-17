"use client";

import Link from "next/link";
import styles from '@/app/recruitment/component/shared-hr-styles.module.css';
import axiosInstance from "@/app/utils/ApiClient";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function NewHireDashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [terminationRequests, setTerminationRequests] = useState<any[]>([]);
  const [employeeInfo, setEmployeeInfo] = useState<any>(null);
  const [employeeId, setEmployeeId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Hardcoded token - replace with your actual token
  const HARDCODED_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2OTNkZDZkYTY0MzJkMmM3YThmMjAyZjUiLCJyb2xlcyI6WyJkZXBhcnRtZW50IGVtcGxveWVlIl0sImVtcGxveWVlTnVtYmVyIjoiRU1QLTE4OTMiLCJlbWFpbCI6IkVNUDE4OTNAZ21haWwuY29tIiwic3RhdHVzIjoiQUNUSVZFIiwiaWF0IjoxNzY1NjgxNDA0LCJleHAiOjE3NjU3Njc4MDR9.IM2ta_Adza2F4zhcZ_FbE094_-OQ9LiWW2JqhQBPClE";

  useEffect(() => {
    async function loadDashboard() {
      try {
        // Use hardcoded token instead of localStorage
        const decoded: any = jwtDecode(HARDCODED_TOKEN);
        const userId = decoded.userid;
        setEmployeeId(userId);

        if (!userId) {
          console.error("❌ No user ID in token!");
          return;
        }

        // Set token in axios instance
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${HARDCODED_TOKEN}`;

        // Get current user info
        const userResponse = await axiosInstance.get("/auth/me");
        setEmployeeInfo(userResponse.data);

        // Load employee onboarding data
        await Promise.all([
          loadTasks(userId),
          loadDocuments(userId),
          loadNotifications(userId),
          loadTerminationRequests(userId),
        ]);

      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

   const loadTasks = async (userId: string) => {
    try {
      const allTasks = await axiosInstance.get(`/onboarding/tasks/employee/${userId}`);
      setTasks(allTasks.data);
    } catch (err) {
      console.error("Error loading tasks:", err);
    }
  };

  const loadDocuments = async (userId: string) => {
    try {
      const response = await axiosInstance.get(`/onboarding/documents/${userId}`);
      setDocuments(response.data);
    } catch (err: any) {
      console.error('❌ Error loading documents:', err);
      setDocuments([]);
    }
  };

  const loadNotifications = async (userId: string) => {
    try {
      const response = await axiosInstance.get(`/time-management/notification-log/employee/${userId}`);
      const notifData = Array.isArray(response.data) 
        ? response.data 
        : response.data?.data || [];
      setNotifications(notifData);
    } catch (err: any) {
      console.error('❌ Error loading notifications:', err);
      setNotifications([]);
    }
  };

  const loadTerminationRequests = async (userId: string) => {
    try {
      const response = await axiosInstance.get(`/offboarding/requests/employee/${userId}`);
      const requestData = Array.isArray(response.data)
        ? response.data
        : [response.data];

      setTerminationRequests(requestData);
    } catch (err: any) {
      console.error('❌ Error loading termination requests:', err);
      setTerminationRequests([]);
    }
  };

  const handleTaskToggle = async (taskId: string, taskIndex: number, currentStatus: string) => {
    const newStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    
    try {
      await axiosInstance.patch(`/onboarding/tasks/${taskId}`, {
        [`tasks.${taskIndex}.status`]: newStatus,
        [`tasks.${taskIndex}.completedAt`]: newStatus === 'COMPLETED' ? new Date().toISOString() : null,
      });
      
      alert(`Task marked as ${newStatus}!`);
      loadTasks(employeeId);
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Failed to update task");
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading onboarding...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      {employeeInfo && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px',
          backgroundColor: '#7C40A9',
          borderRadius: '12px',
          marginBottom: '30px',
          color: '#ffffff',
          border: '2px solid #9570DD'
        }}>
          <div>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Logged in as</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: '700' }}>{employeeInfo.email}</p>
          </div>
          <span style={{
            padding: '8px 16px',
            backgroundColor: '#10b981',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            New Employee
          </span>
        </div>
      )}

      {/* Quick Actions */}
      <div className={styles.actions} style={{ marginBottom: '30px' }}>
        <Link href={`/recruitment/documents/create?candidateId=${employeeId}`} className={styles.createButton}>
          Upload Document
        </Link>
      </div>

      {/* Notifications Section */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className={styles.pageTitle} style={{ margin: 0 }}>Notifications</h2>
          <button
            onClick={() => loadNotifications(employeeId)}
            className={styles.button}
          >
            Refresh
          </button>
        </div>
        <div className={styles.fullLine} style={{ marginBottom: '20px' }}></div>
        
        {notifications.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: '#7C40A9',
            borderRadius: '12px',
            color: '#ffffff',
            border: '2px solid #9570DD'
          }}>
            <p>No notifications</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {notifications.map((notif) => (
              <div 
                key={notif._id} 
                className={styles.card}
                style={{
                  backgroundColor: notif.readStatus ? '#7C40A9' : '#9570DD',
                  border: notif.readStatus ? '2px solid #9570DD' : '3px solid #693699'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      padding: '4px 12px',
                      backgroundColor: '#ffffff',
                      color: '#7C40A9',
                      borderRadius: '12px',
                      textTransform: 'uppercase'
                    }}>
                      {notif.type}
                    </span>
                    {!notif.readStatus && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        padding: '4px 8px',
                        backgroundColor: '#ef4444',
                        color: '#ffffff',
                        borderRadius: '10px'
                      }}>
                        NEW
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '12px', color: '#ffffff', opacity: 0.9 }}>
                    {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.5', color: '#ffffff' }}>
                  {notif.message || 'No message'}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Termination Requests Section */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className={styles.pageTitle} style={{ margin: 0 }}>My Termination Requests</h2>
          <div className={styles.actions}>
            <button
              onClick={() => loadTerminationRequests(employeeId)}
              className={styles.button}
            >
              Refresh
            </button>
            <Link href="/recruitment/hr/termination/create" className={styles.createButton}>
              Create Termination Request
            </Link>
          </div>
        </div>
        <div className={styles.fullLine} style={{ marginBottom: '20px' }}></div>
        
        {terminationRequests.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: '#7C40A9',
            borderRadius: '12px',
            color: '#ffffff',
            border: '2px solid #9570DD'
          }}>
            <p style={{ marginBottom: '15px' }}>No termination requests found</p>
            <Link href="/recruitment/offboarding/termination/create" className={styles.createButton}>
              Create Request
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
            {terminationRequests.map((request) => (
              <div key={request._id} className={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                  <span style={{ fontSize: '18px', fontWeight: '700' }}>Request #{request._id.slice(-8)}</span>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    ...getTerminationStatusColor(request.status)
                  }}>
                    {request.status}
                  </span>
                </div>
                <p><strong>Initiator:</strong> {request.initiator}</p>
                <p><strong>Reason:</strong> {request.reason}</p>
                {request.terminationDate && (
                  <p><strong>Termination Date:</strong> {new Date(request.terminationDate).toLocaleDateString()}</p>
                )}
                <p><strong>Created:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
                {request.hrComments && (
                  <p><strong>HR Comments:</strong> {request.hrComments}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Onboarding Tasks Section */}
      <section style={{ marginBottom: '40px' }}>
        <h2 className={styles.pageTitle}>Onboarding Tasks</h2>
        <div className={styles.fullLine}></div>
        
        {tasks.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: '#7C40A9',
            borderRadius: '12px',
            color: '#ffffff',
            border: '2px solid #9570DD'
          }}>
            <p>No tasks assigned yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {tasks.map((taskGroup) => (
              <div key={taskGroup._id} className={styles.card}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '15px', color: '#ffffff' }}>Task Group</h3>
                {taskGroup.tasks.map((task: any, index: number) => (
                  <div 
                    key={index} 
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <input
                        type="checkbox"
                        checked={task.status === 'COMPLETED'}
                        onChange={() => handleTaskToggle(taskGroup._id, index, task.status)}
                        style={{ width: '20px', height: '20px', cursor: 'pointer', marginTop: '2px' }}
                      />
                      <div>
                        <p style={{ fontSize: '16px', fontWeight: '500', margin: 0, color: '#ffffff' }}>{task.name}</p>
                        <p style={{ fontSize: '14px', margin: '4px 0', opacity: 0.8 }}>{task.department}</p>
                        {task.deadline && (
                          <p style={{ fontSize: '12px', color: '#f59e0b', margin: 0 }}>
                            Due: {new Date(task.deadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      ...getStatusColor(task.status)
                    }}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Documents Section */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className={styles.pageTitle} style={{ margin: 0 }}>My Documents</h2>
          <button
            onClick={() => loadDocuments(employeeId)}
            className={styles.button}
          >
            Refresh
          </button>
        </div>
        <div className={styles.fullLine} style={{ marginBottom: '20px' }}></div>
        
        {documents.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: '#7C40A9',
            borderRadius: '12px',
            color: '#ffffff',
            border: '2px solid #9570DD'
          }}>
            <p style={{ marginBottom: '15px' }}>No documents uploaded yet</p>
            <Link href={`/recruitment/documents/create?employeeId=${employeeId}`} className={styles.createButton}>
              Upload Document
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
            {documents.map((doc) => (
              <div key={doc._id} className={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                  <span style={{ fontSize: '18px', fontWeight: '700' }}>{doc.documentName}</span>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    ...getStatusColor(doc.type?.toUpperCase() || 'DOCUMENT')
                  }}>
                    {doc.type}
                  </span>
                </div>
                <p><strong>File:</strong> {doc.filePath}</p>
                <p><strong>Uploaded:</strong> {new Date(doc.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Helper function for status colors
function getStatusColor(status: string) {
  const colors: Record<string, any> = {
    PENDING: { backgroundColor: '#6b7280', color: 'white' },
    COMPLETED: { backgroundColor: '#10b981', color: 'white' },
    ID: { backgroundColor: '#8b5cf6', color: 'white' },
    CERTIFICATE: { backgroundColor: '#ec4899', color: 'white' },
    CONTRACT: { backgroundColor: '#3b82f6', color: 'white' },
    DOCUMENT: { backgroundColor: '#6b7280', color: 'white' },
  };
  return colors[status] || { backgroundColor: '#6b7280', color: 'white' };
}

// Helper function for termination status colors
function getTerminationStatusColor(status: string) {
  const colors: Record<string, any> = {
    PENDING: { backgroundColor: '#f59e0b', color: 'white' },
    UNDER_REVIEW: { backgroundColor: '#3b82f6', color: 'white' },
    APPROVED: { backgroundColor: '#10b981', color: 'white' },
    REJECTED: { backgroundColor: '#ef4444', color: 'white' },
    COMPLETED: { backgroundColor: '#6366f1', color: 'white' },
  };
  return colors[status] || { backgroundColor: '#6b7280', color: 'white' };
}