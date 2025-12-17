// app/offboarding/checklists/create/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/utils/ApiClient";

type TerminationRequest = {
  _id: string;
  employeeId: string;
  status: string;
  reason: string;
};

type ChecklistItem = {
  department: string;
  status: "pending" | "approved" | "rejected";  // ← lowercase
  comments: string;
};

type EquipmentItem = {
  name: string;
  returned: boolean;
  condition: string;
};

export default function CreateChecklistPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [terminationRequests, setTerminationRequests] = useState<TerminationRequest[]>([]);
  
  const [formData, setFormData] = useState({
    terminationId: "",
    cardReturned: false
  });

  const [items, setItems] = useState<ChecklistItem[]>([
    { department: "IT", status: "pending", comments: "Return laptop, access cards, and all IT equipment" },
    { department: "HR", status: "pending", comments: "Complete exit interview and submit required documents" },
    { department: "Finance", status: "pending", comments: "Clear all outstanding expenses and return company credit card" },
    { department: "Facilities", status: "pending", comments: "Return office keys, parking pass, and clear workspace" }
  ]);

  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([
    { name: "Laptop", returned: false, condition: "" },
    { name: "Access Card", returned: false, condition: "" }
  ]);

  useEffect(() => {
    loadTerminationRequests();
  }, []);

  const loadTerminationRequests = async () => {
    try {
      const response = await axiosInstance.get("/offboarding/requests");
      const approved = (response.data || []).filter(
        (req: TerminationRequest) => req.status === "APPROVED" || req.status === "approved"
      );
      setTerminationRequests(approved);
    } catch (err) {
      console.error("Failed to load termination requests:", err);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { department: "", status: "pending", comments: "" }]);  // ← lowercase
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof ChecklistItem, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const handleAddEquipment = () => {
    setEquipmentList([...equipmentList, { name: "", returned: false, condition: "" }]);
  };

  const handleRemoveEquipment = (index: number) => {
    setEquipmentList(equipmentList.filter((_, i) => i !== index));
  };

  const handleEquipmentChange = (index: number, field: keyof EquipmentItem, value: any) => {
    const updatedEquipment = [...equipmentList];
    updatedEquipment[index] = { ...updatedEquipment[index], [field]: value };
    setEquipmentList(updatedEquipment);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.terminationId) {
      setError("Please select a termination request");
      return;
    }

    for (const item of items) {
      if (!item.department) {
        setError("All checklist items must have a department");
        return;
      }
    }

    for (const equipment of equipmentList) {
      if (!equipment.name) {
        setError("All equipment items must have a name");
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        terminationId: formData.terminationId,
        items: items,
        equipmentList: equipmentList,
        cardReturned: formData.cardReturned
      };

      console.log('Creating checklist with payload:', JSON.stringify(payload, null, 2));

      await axiosInstance.post("/offboarding/checklists", payload);

      alert('Clearance checklist created successfully!');
      router.push("/recruitment/offboarding/checklists");
    } catch (err: any) {
      console.error('Error creating checklist:', err);
      setError(err.response?.data?.message || "Failed to create checklist");
    } finally {
      setLoading(false);
    }
  };

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
            onClick={() => router.back()}
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

        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          background: 'linear-gradient(90deg, #60a5fa, #a78bfa, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '2.5rem'
        }}>
          Create Clearance Checklist
        </h1>

        <form onSubmit={handleSubmit}>
          
          {/* Basic Information Card */}
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
              📋 Basic Information
            </h2>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#cbd5e1',
                marginBottom: '0.5rem'
              }}>
                Termination Request <span style={{ color: '#f87171' }}>*</span>
              </label>
              <select
                value={formData.terminationId}
                onChange={(e) => setFormData({ ...formData, terminationId: e.target.value })}
                required
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
                <option value="">Select approved termination request</option>
                {terminationRequests.map((req) => (
                  <option key={req._id} value={req._id}>
                    Employee: {req.employeeId} | Status: {req.status}
                  </option>
                ))}
              </select>
              {terminationRequests.length === 0 && (
                <small style={{ color: '#94a3b8', display: 'block', marginTop: '0.5rem' }}>
                  ⚠️ No approved termination requests found
                </small>
              )}
            </div>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              padding: '1rem',
              background: 'rgba(15, 23, 42, 0.3)',
              borderRadius: '0.5rem',
              border: '1px solid rgba(148, 163, 184, 0.2)'
            }}>
              <input
                type="checkbox"
                checked={formData.cardReturned}
                onChange={(e) => setFormData({ ...formData, cardReturned: e.target.checked })}
                style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  cursor: 'pointer',
                  accentColor: '#3b82f6'
                }}
              />
              <span style={{ fontSize: '0.875rem', color: '#e2e8f0', fontWeight: '500' }}>
                🎫 Access Card Returned
              </span>
            </label>
          </div>

          {/* Department Clearance Items */}
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
              {items.map((item, index) => (
                <div key={index} style={{
                  padding: '1.25rem',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05))',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(96, 165, 250, 0.2)'
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
                    {items.length > 1 && (
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
                          value={item.status}
                          onChange={(e) => handleItemChange(index, "status", e.target.value as any)}
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
                          value={item.comments}
                          onChange={(e) => handleItemChange(index, "comments", e.target.value)}
                          placeholder="Requirements and instructions"
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
              {equipmentList.map((equipment, index) => (
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
                    {equipmentList.length > 1 && (
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

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 200px', gap: '1rem', alignItems: 'end' }}>
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
                      <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Returned</span>
                      <input
                        type="checkbox"
                        checked={equipment.returned}
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
                        value={equipment.condition}
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
              ))}
            </div>
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
              disabled={loading}
              style={{
                flex: 1,
                padding: '1rem',
                background: loading ? 'rgba(148, 163, 184, 0.3)' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(59, 130, 246, 0.4)'
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {loading ? '⏳ Creating...' : '✅ Create Checklist'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              style={{
                flex: 1,
                padding: '1rem',
                background: 'rgba(148, 163, 184, 0.1)',
                color: '#e2e8f0',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '0.75rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = 'rgba(148, 163, 184, 0.2)')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.background = 'rgba(148, 163, 184, 0.1)')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}