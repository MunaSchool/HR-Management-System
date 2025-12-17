// app/offboarding/checklists/[id]/update/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "@/app/utils/ApiClient";

type ChecklistItem = {
  department: string;
  status?: "pending" | "approved" | "rejected";
  comments?: string;
  updatedBy?: string;
  updatedAt?: string;
};

type EquipmentItem = {
  equipmentId?: string;
  name: string;
  returned?: boolean;
  condition?: string;
};

type ClearanceChecklist = {
  _id: string;
  terminationId: string;
  items?: ChecklistItem[];
  equipmentList?: EquipmentItem[];
  cardReturned?: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function UpdateChecklistPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<ClearanceChecklist | null>(null);

  const [formData, setFormData] = useState({
    items: [] as ChecklistItem[],
    equipmentList: [] as EquipmentItem[],
    cardReturned: false
  });

  useEffect(() => {
    if (id) {
      loadChecklist();
    }
  }, [id]);

  const loadChecklist = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/offboarding/checklists/${id}`);
      const data = response.data;
      setChecklist(data);
      
      setFormData({
        items: data.items || [],
        equipmentList: data.equipmentList || [],
        cardReturned: data.cardReturned || false
      });
    } catch (err: any) {
      console.error("Failed to load checklist:", err);
      setError(err.response?.data?.message || "Failed to load checklist");
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (index: number, field: keyof ChecklistItem, value: any) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { 
      ...updatedItems[index], 
      [field]: value,
      updatedAt: new Date().toISOString()
    };
    setFormData({ ...formData, items: updatedItems });
  };

  const handleEquipmentChange = (index: number, field: keyof EquipmentItem, value: any) => {
    const updatedEquipment = [...formData.equipmentList];
    updatedEquipment[index] = { ...updatedEquipment[index], [field]: value };
    setFormData({ ...formData, equipmentList: updatedEquipment });
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { department: "", status: "pending", comments: "" }]
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const handleAddEquipment = () => {
    setFormData({
      ...formData,
      equipmentList: [...formData.equipmentList, { name: "", returned: false, condition: "" }]
    });
  };

  const handleRemoveEquipment = (index: number) => {
    setFormData({
      ...formData,
      equipmentList: formData.equipmentList.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    for (const item of formData.items) {
      if (!item.department) {
        setError("All checklist items must have a department");
        return;
      }
    }

    for (const equipment of formData.equipmentList) {
      if (!equipment.name) {
        setError("All equipment items must have a name");
        return;
      }
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        items: formData.items,
        equipmentList: formData.equipmentList,
        cardReturned: formData.cardReturned
      };

      console.log('Updating checklist with payload:', JSON.stringify(payload, null, 2));

      await axiosInstance.patch(`/offboarding/checklists/${id}`, payload);

      alert('✅ Checklist updated successfully!');
      router.push("/recruitment/offboarding/checklists");
    } catch (err: any) {
      console.error('Error updating checklist:', err);
      setError(err.response?.data?.message || "Failed to update checklist");
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "approved":
        return "#10b981";
      case "rejected":
        return "#ef4444";
      case "pending":
      default:
        return "#f59e0b";
    }
  };

  const getCompletionPercentage = () => {
    if (formData.items.length === 0) return 0;
    const completed = formData.items.filter(i => i.status === "approved").length;
    return Math.round((completed / formData.items.length) * 100);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#e2e8f0',
        fontSize: '1.25rem'
      }}>
        ⏳ Loading checklist...
      </div>
    );
  }

  if (error && !checklist) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            padding: '2rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '1rem',
            color: '#fca5a5',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{ marginBottom: '0.5rem' }}>Error Loading Checklist</h2>
            <p style={{ marginBottom: '1.5rem' }}>{error}</p>
            <button
              onClick={() => router.push("/recruitment/offboarding/checklists")}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                border: 'none',
                padding: '0.875rem 1.75rem',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              ← Back to Checklists
            </button>
          </div>
        </div>
      </div>
    );
  }

  const completionPercentage = getCompletionPercentage();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => router.push("/recruitment/offboarding/checklists")}
            style={{
              background: 'rgba(148, 163, 184, 0.1)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              color: '#e2e8f0',
              padding: '0.75rem 1.5rem',
              cursor: 'pointer',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(148, 163, 184, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(148, 163, 184, 0.1)'}
          >
            ← Back to Checklists
          </button>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              background: 'linear-gradient(90deg, #60a5fa, #a78bfa, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
              marginBottom: '0.5rem'
            }}>
              Update Clearance Checklist
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
              Checklist ID: {checklist?._id} | Termination ID: {checklist?.terminationId}
            </p>
          </div>

          {/* Progress Indicator */}
          <div style={{
            padding: '1rem 1.5rem',
            background: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(20px)',
            borderRadius: '0.75rem',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
              Progress
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#60a5fa' }}>
              {completionPercentage}%
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Progress Bar */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            marginBottom: '1.5rem',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.75rem'
            }}>
              <span style={{ fontSize: '0.875rem', color: '#cbd5e1', fontWeight: '600' }}>
                Overall Completion
              </span>
              <span style={{ fontSize: '0.875rem', color: '#60a5fa', fontWeight: '600' }}>
                {formData.items.filter(i => i.status === "approved").length} / {formData.items.length} approved
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '12px',
              background: 'rgba(15, 23, 42, 0.5)',
              borderRadius: '0.5rem',
              overflow: 'hidden',
              border: '1px solid rgba(148, 163, 184, 0.2)'
            }}>
              <div style={{
                width: `${completionPercentage}%`,
                height: '100%',
                background: completionPercentage === 100 
                  ? 'linear-gradient(90deg, #10b981, #059669)'
                  : 'linear-gradient(90deg, #3b82f6, #2563eb)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {/* Department Clearances */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            marginBottom: '1.5rem',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid rgba(148, 163, 184, 0.2)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#f1f5f9',
                margin: 0
              }}>
                🏢 Department Clearances
              </h2>
              <button
                type="button"
                onClick={handleAddItem}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '0.625rem 1.25rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'transform 0.2s',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                + Add Department
              </button>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {formData.items.map((item, index) => (
                <div key={index} style={{
                  padding: '1.25rem',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05))',
                  borderRadius: '0.75rem',
                  border: `1px solid ${getStatusColor(item.status)}40`
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <h3 style={{
                      margin: 0,
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#93c5fd'
                    }}>
                      Department {index + 1}
                    </h3>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        style={{
                          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.8125rem',
                          fontWeight: '500'
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#cbd5e1',
                        marginBottom: '0.5rem'
                      }}>
                        Department Name <span style={{ color: '#f87171' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={item.department}
                        onChange={(e) => handleItemChange(index, "department", e.target.value)}
                        placeholder="e.g., IT, HR, Finance, Facilities"
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: 'rgba(15, 23, 42, 0.5)',
                          border: '1px solid rgba(148, 163, 184, 0.3)',
                          borderRadius: '0.5rem',
                          color: '#e2e8f0',
                          fontSize: '0.875rem',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#cbd5e1',
                          marginBottom: '0.5rem'
                        }}>
                          Status
                        </label>
                        <select
                          value={item.status || "pending"}
                          onChange={(e) => handleItemChange(index, "status", e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'rgba(15, 23, 42, 0.5)',
                            border: '1px solid rgba(148, 163, 184, 0.3)',
                            borderRadius: '0.5rem',
                            color: '#e2e8f0',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="approved">✅ Approved</option>
                          <option value="rejected">❌ Rejected</option>
                        </select>
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#cbd5e1',
                          marginBottom: '0.5rem'
                        }}>
                          Comments
                        </label>
                        <input
                          type="text"
                          value={item.comments || ""}
                          onChange={(e) => handleItemChange(index, "comments", e.target.value)}
                          placeholder="Add notes or requirements"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'rgba(15, 23, 42, 0.5)',
                            border: '1px solid rgba(148, 163, 184, 0.3)',
                            borderRadius: '0.5rem',
                            color: '#e2e8f0',
                            fontSize: '0.875rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    {item.updatedAt && (
                      <div style={{
                        padding: '0.75rem',
                        background: 'rgba(15, 23, 42, 0.3)',
                        borderRadius: '0.5rem',
                        fontSize: '0.8125rem',
                        color: '#94a3b8',
                        display: 'flex',
                        gap: '1rem'
                      }}>
                        <span>🕒 Last updated: {new Date(item.updatedAt).toLocaleString()}</span>
                        {item.updatedBy && <span>👤 By: {item.updatedBy}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment List */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            marginBottom: '1.5rem',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid rgba(148, 163, 184, 0.2)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#f1f5f9',
                margin: 0
              }}>
                💼 Equipment to Return
              </h2>
              <button
                type="button"
                onClick={handleAddEquipment}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '0.625rem 1.25rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'transform 0.2s',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                + Add Equipment
              </button>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {formData.equipmentList.map((equipment, index) => (
                <div key={index} style={{
                  padding: '1.25rem',
                  background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.05), rgba(168, 85, 247, 0.05))',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(236, 72, 153, 0.2)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <h3 style={{
                      margin: 0,
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#f9a8d4'
                    }}>
                      Equipment {index + 1}
                    </h3>
                    {formData.equipmentList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveEquipment(index)}
                        style={{
                          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.8125rem',
                          fontWeight: '500'
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '1rem' }}>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#cbd5e1',
                          marginBottom: '0.5rem'
                        }}>
                          Equipment Name <span style={{ color: '#f87171' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={equipment.name}
                          onChange={(e) => handleEquipmentChange(index, "name", e.target.value)}
                          placeholder="e.g., Laptop, Access Card, Phone"
                          required
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'rgba(15, 23, 42, 0.5)',
                            border: '1px solid rgba(148, 163, 184, 0.3)',
                            borderRadius: '0.5rem',
                            color: '#e2e8f0',
                            fontSize: '0.875rem',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#cbd5e1',
                          marginBottom: '0.5rem'
                        }}>
                          Equipment ID
                        </label>
                        <input
                          type="text"
                          value={equipment.equipmentId || ""}
                          onChange={(e) => handleEquipmentChange(index, "equipmentId", e.target.value)}
                          placeholder="Optional ID"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'rgba(15, 23, 42, 0.5)',
                            border: '1px solid rgba(148, 163, 184, 0.3)',
                            borderRadius: '0.5rem',
                            color: '#e2e8f0',
                            fontSize: '0.875rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1rem', alignItems: 'end' }}>
                      <label style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        padding: '0.75rem',
                        background: 'rgba(15, 23, 42, 0.3)',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(148, 163, 184, 0.2)'
                      }}>
                        <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: '600' }}>
                          Returned
                        </span>
                        <input
                          type="checkbox"
                          checked={equipment.returned || false}
                          onChange={(e) => handleEquipmentChange(index, "returned", e.target.checked)}
                          style={{
                            width: '1.5rem',
                            height: '1.5rem',
                            cursor: 'pointer',
                            accentColor: '#10b981'
                          }}
                        />
                      </label>

                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#cbd5e1',
                          marginBottom: '0.5rem'
                        }}>
                          Condition
                        </label>
                        <input
                          type="text"
                          value={equipment.condition || ""}
                          onChange={(e) => handleEquipmentChange(index, "condition", e.target.value)}
                          placeholder="Good, Fair, Damaged"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'rgba(15, 23, 42, 0.5)',
                            border: '1px solid rgba(148, 163, 184, 0.3)',
                            borderRadius: '0.5rem',
                            color: '#e2e8f0',
                            fontSize: '0.875rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Access Card */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            marginBottom: '1.5rem',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#f1f5f9',
              marginBottom: '1.5rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid rgba(148, 163, 184, 0.2)'
            }}>
              🎫 Access Card Status
            </h2>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              cursor: 'pointer',
              padding: '1.25rem',
              background: formData.cardReturned
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))'
                : 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))',
              borderRadius: '0.75rem',
              border: formData.cardReturned
                ? '1px solid rgba(16, 185, 129, 0.3)'
                : '1px solid rgba(245, 158, 11, 0.3)',
              transition: 'all 0.2s'
            }}>
              <input
                type="checkbox"
                checked={formData.cardReturned}
                onChange={(e) => setFormData({ ...formData, cardReturned: e.target.checked })}
                style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  cursor: 'pointer',
                  accentColor: '#10b981'
                }}
              />
              <div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: formData.cardReturned ? '#10b981' : '#f59e0b',
                  marginBottom: '0.25rem'
                }}>
                  {formData.cardReturned ? '✅ Access Card Returned' : '⏳ Access Card Not Returned'}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                  Mark this when the employee has returned their access card
                </div>
              </div>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '0.5rem',
              color: '#fca5a5',
              marginBottom: '1.5rem',
              fontSize: '0.875rem'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                flex: 1,
                padding: '1rem',
                background: saving ? 'rgba(148, 163, 184, 0.3)' : 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.2s',
                boxShadow: saving ? 'none' : '0 4px 20px rgba(16, 185, 129, 0.4)'
              }}
              onMouseEnter={(e) => !saving && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => !saving && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {saving ? '⏳ Saving Changes...' : '✅ Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.push("/recruitment/offboarding/checklists")}
              disabled={saving}
              style={{
                flex: 1,
                padding: '1rem',
                background: 'rgba(148, 163, 184, 0.1)',
                color: '#e2e8f0',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '0.75rem',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => !saving && (e.currentTarget.style.background = 'rgba(148, 163, 184, 0.2)')}
              onMouseLeave={(e) => !saving && (e.currentTarget.style.background = 'rgba(148, 163, 184, 0.1)')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}