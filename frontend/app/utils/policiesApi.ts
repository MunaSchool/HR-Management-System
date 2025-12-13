import axiosInstance from './ApiClient';

export type CreatePolicyPayload = {
  policyName: string;
  policyType: string;
  description: string;
  effectiveDate: string; // ISO
  ruleDefinition: {
    percentage: number;
    fixedAmount: number;
    thresholdAmount: number;
  };
  applicability: string;
  status?: string;
};

export const createPolicy = async (payload: CreatePolicyPayload) => {
  const res = await axiosInstance.post('/payroll-configuration/policies', payload);
  return res.data;
};

export const updatePolicy = async (id: string, payload: Partial<CreatePolicyPayload>) => {
  const res = await axiosInstance.put(`/payroll-configuration/policies/${id}`, payload);
  return res.data;
};

export const getPolicyById = async (id: string) => {
  const res = await axiosInstance.get(`/payroll-configuration/policies/${id}`);
  return res.data;
};
