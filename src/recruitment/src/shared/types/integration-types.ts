// Shared type definitions for integration
// These are TypeScript interfaces ONLY, not database models

export interface DepartmentReference {
  id: string;
  name: string;
  description?: string;
}

export interface PositionReference {
  id: string;
  title: string;
  departmentId: string;
  level?: string;
}

export interface UserReference {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Mock data for Milestone 1
export const MOCK_DEPARTMENTS: DepartmentReference[] = [
  { id: 'dept-001', name: 'Engineering', description: 'Software Development' },
  { id: 'dept-002', name: 'Marketing', description: 'Marketing & Sales' },
  { id: 'dept-003', name: 'HR', description: 'Human Resources' },
  { id: 'dept-004', name: 'Finance', description: 'Finance & Accounting' },
  { id: 'dept-005', name: 'Operations', description: 'Operations & Support' },
];

export const MOCK_POSITIONS: PositionReference[] = [
  { id: 'pos-001', title: 'Senior Software Engineer', departmentId: 'dept-001', level: 'Senior' },
  { id: 'pos-002', title: 'Software Engineer', departmentId: 'dept-001', level: 'Mid' },
  { id: 'pos-003', title: 'Junior Software Engineer', departmentId: 'dept-001', level: 'Junior' },
  { id: 'pos-004', title: 'Marketing Manager', departmentId: 'dept-002', level: 'Manager' },
  { id: 'pos-005', title: 'Marketing Specialist', departmentId: 'dept-002', level: 'Mid' },
  { id: 'pos-006', title: 'HR Manager', departmentId: 'dept-003', level: 'Manager' },
  { id: 'pos-007', title: 'HR Employee', departmentId: 'dept-003', level: 'Mid' },
  { id: 'pos-008', title: 'Financial Analyst', departmentId: 'dept-004', level: 'Mid' },
];

export const MOCK_USERS: UserReference[] = [
  { id: 'user-001', name: 'Sarah Johnson', email: 'sarah.johnson@company.com', role: 'HR Manager' },
  { id: 'user-002', name: 'Mike Chen', email: 'mike.chen@company.com', role: 'HR Employee' },
  { id: 'user-003', name: 'Emily Davis', email: 'emily.davis@company.com', role: 'Department Manager' },
  { id: 'user-004', name: 'John Smith', email: 'john.smith@company.com', role: 'System Admin' },
];