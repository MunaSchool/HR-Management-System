"use client";

import { useState } from "react";
import GenericForm, { FieldConfig } from "@/app/recruitment/component/generic-form";
import styles from '@/app/recruitment/component/shared-hr-styles.module.css';
import axiosInstance from "@/app/utils/ApiClient";
import { useRouter } from "next/navigation";

export default function CreateApplicationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Consent state
  const [consents, setConsents] = useState({
    dataProcessing: false,
    backgroundCheck: false,
  });

  // Document upload state
  const [documents, setDocuments] = useState<{ file: File; type: string }[]>([]);

  const applicationFields: FieldConfig[] = [
    {
      name: "candidateId",
      label: "Candidate ID",
      type: "text",
      placeholder: "Enter MongoDB candidate ID",
      required: true,
    },
    {
      name: "requisitionId",
      label: "Job Requisition ID",
      type: "text",
      placeholder: "Enter MongoDB requisition ID",
      required: true,
    },
    {
      name: "ownerId",
      label: "Owner ID",
      type: "text",
      placeholder: "Enter MongoDB owner ID",
      required: true,
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocuments((prev) => [...prev, { file: e.target.files![0], type: "cv" }]);
    }
  };

  const removeFile = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (data: Record<string, any>) => {
    setError(null);

    // Validate consents
    if (!consents.dataProcessing || !consents.backgroundCheck) {
      setError("Please provide all required consents");
      alert("Please provide all required consents");
      return;
    }

    // Validate document upload
    if (documents.length === 0) {
      setError("Please upload at least one document (CV)");
      alert("Please upload at least one document");
      return;
    }

    setLoading(true);

    try {
      // Create the application first
      const applicationResponse = await axiosInstance.post("/recruitment/applications", {
        candidateId: data.candidateId.trim(),
        requisitionId: data.requisitionId.trim(),
      });
      
      const applicationId = applicationResponse.data._id;
      console.log("Application created:", applicationResponse.data);

      // Create document with consents
      const documentData = {
        candidateId: data.candidateId.trim(),
        applicationId: applicationId,
        filePath: "/uploads/resume.pdf", // Path where file is stored
        type: "cv",
        uploadedAt: new Date(),
        consents: {
          dataProcessing: consents.dataProcessing,
          backgroundCheck: consents.backgroundCheck,
          timestamp: new Date().toISOString(),
        }
      };

      await axiosInstance.post('/onboarding/documents', documentData);

      alert("✅ Application and documents submitted successfully!");
      router.push("/recruitment/candidate/dashboard");
    } catch (err: any) {
      console.error("Error submitting application:", err);
      const errorMsg = err.response?.data?.message || err.message || "Submission failed";
      setError(errorMsg);
      alert("❌ " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <div className={styles.formContainer}>
        
        <h1 className={styles.formTitle}>Create Job Application</h1>
        <div className={styles.formDivider}></div>

        <div className={styles.formDescription}>
          <h3>Application Information</h3>
          <p>Create a new job application by providing candidate and requisition details.</p>
          <p><strong>Note:</strong> All required fields must be completed, including document upload and consent checkboxes.</p>
        </div>

        {error && (
          <div style={{ 
            padding: '16px', 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '2px solid #ef4444', 
            borderRadius: '8px',
            color: '#dc2626',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            ⚠️ {error}
          </div>
        )}

        <div className={styles.formContentWrapper}>
          {/* Main Form Fields */}
          <GenericForm
            fields={applicationFields}
            onSubmit={handleSubmit}
            submitButtonText={loading ? "Submitting..." : "Submit Application"}
            showResetButton={false}
          />

          {/* Document Upload Section */}
          <div style={{
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#e9d5ff',
            borderRadius: '8px',
            border: '2px solid #7C40A9'
          }}>
            <h3 style={{ 
              margin: '0 0 15px 0', 
              fontSize: '18px',
              fontWeight: '700',
              color: '#2d1b4e'
            }}>
              Upload Documents
            </h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#2d1b4e',
                marginBottom: '8px'
              }}>
                CV/Resume <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                style={{
                  padding: '10px',
                  backgroundColor: '#ffffff',
                  border: '2px solid #7C40A9',
                  borderRadius: '6px',
                  width: '100%',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              />
            </div>

            {documents.length > 0 && (
              <div style={{
                padding: '15px',
                backgroundColor: '#ffffff',
                borderRadius: '6px',
                border: '2px solid #9570DD'
              }}>
                <h4 style={{ 
                  margin: '0 0 10px 0', 
                  fontSize: '16px',
                  color: '#2d1b4e'
                }}>
                  Selected Documents:
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {documents.map((doc, i) => (
                    <li key={i} style={{ 
                      marginBottom: '8px',
                      color: '#2d1b4e',
                      fontSize: '14px'
                    }}>
                      <strong>{doc.type.toUpperCase()}:</strong> {doc.file.name}{" "}
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        style={{
                          marginLeft: '10px',
                          padding: '4px 12px',
                          backgroundColor: '#ef4444',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Consent Section */}
          <div style={{ 
            border: '2px solid #7C40A9', 
            padding: '20px', 
            borderRadius: '8px', 
            backgroundColor: '#e9d5ff',
            marginTop: '30px'
          }}>
            <h3 style={{ 
              marginBottom: '16px', 
              fontSize: '18px', 
              fontWeight: '700',
              color: '#2d1b4e'
            }}>
              Consent & Authorization
            </h3>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'start', 
                gap: '10px', 
                cursor: 'pointer' 
              }}>
                <input
                  type="checkbox"
                  checked={consents.dataProcessing}
                  onChange={(e) => setConsents({ ...consents, dataProcessing: e.target.checked })}
                  required
                  style={{ 
                    marginTop: '4px', 
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    accentColor: '#7C40A9'
                  }}
                />
                <span style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.5',
                  color: '#2d1b4e',
                  fontWeight: '500'
                }}>
                  I consent to the processing of my personal data for recruitment purposes in accordance with applicable privacy laws. <span style={{ color: '#ef4444' }}>*</span>
                </span>
              </label>
            </div>

            <div>
              <label style={{ 
                display: 'flex', 
                alignItems: 'start', 
                gap: '10px', 
                cursor: 'pointer' 
              }}>
                <input
                  type="checkbox"
                  checked={consents.backgroundCheck}
                  onChange={(e) => setConsents({ ...consents, backgroundCheck: e.target.checked })}
                  required
                  style={{ 
                    marginTop: '4px', 
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    accentColor: '#7C40A9'
                  }}
                />
                <span style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.5',
                  color: '#2d1b4e',
                  fontWeight: '500'
                }}>
                  I authorize the company to conduct background checks as part of the hiring process. <span style={{ color: '#ef4444' }}>*</span>
                </span>
              </label>
            </div>

            <p style={{ 
              fontSize: '12px', 
              color: '#693699', 
              marginTop: '12px',
              marginBottom: 0,
              fontStyle: 'italic'
            }}>
              * Required fields - Both consents must be checked to submit
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={() => router.back()}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              color: '#7C40A9',
              border: '2px solid #7C40A9',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(124, 64, 169, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            ← Back to Applications
          </button>
        </div>
      </div>
    </div>
  );
}