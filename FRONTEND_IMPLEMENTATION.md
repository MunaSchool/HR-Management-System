# Employee Profile Management - Frontend Implementation

## Overview

This document describes the complete frontend implementation for the Employee Profile Management system, covering all 6 use cases as specified in the requirements.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios
- **Authentication**: Cookie-based session management

## Features Implemented

### Use Case 1: View Personal Profile (Self-Service)
**Location**: [/profile/page.tsx](frontend/app/(dashboard)/profile/page.tsx)

**Features**:
- View complete employee profile including PII
- Display employment details (Position, Department, Pay Grade)
- View appraisal history (future integration)
- Secure role-based access control
- Profile picture display

**API Endpoint**: `GET /employee-profile/me`

### Use Case 2: Update Self-Service Data (Immediate Update)
**Location**: [/profile/page.tsx](frontend/app/(dashboard)/profile/page.tsx)

**Features**:
- Direct update of non-critical fields:
  - Profile Picture upload
  - Phone number
  - Email address
  - Physical address
- Immediate save without approval workflow
- Real-time validation

**API Endpoints**:
- `PATCH /employee-profile/me/contact-info`
- `POST /employee-profile/me/profile-picture`

### Use Case 3: Submit Request for Correction/Change
**Location**: [/profile/change-request/page.tsx](frontend/app/(dashboard)/profile/change-request/page.tsx)

**Features**:
- Submit formal requests for critical HR-governed fields:
  - Legal name (First, Middle, Last)
  - National ID
  - Marital Status
  - Date of Birth
  - Gender
- View submission history
- Track request status (Pending, Approved, Rejected)
- View rejection reasons

**API Endpoints**:
- `POST /employee-profile/me/change-requests`
- `GET /employee-profile/me/change-requests`

### Use Case 4: View Team Brief (Manager Insight)
**Location**: [/team/page.tsx](frontend/app/(dashboard)/team/page.tsx)

**Features**:
- View team member list with summary data
- Search and filter team members
- Team statistics dashboard
- Privacy-compliant data display (excludes sensitive info)
- View individual team member details

**API Endpoints**:
- `GET /employee-profile/team`
- `GET /employee-profile/team/:id`

**Role Required**: `DEPARTMENT_HEAD`

### Use Case 5: Review and Process Change Request
**Location**: [/change-requests/page.tsx](frontend/app/(dashboard)/change-requests/page.tsx)

**Features**:
- View all pending change requests
- Review request details and justification
- Approve or reject requests
- Provide rejection reasons
- Real-time queue updates
- Audit trail tracking

**API Endpoints**:
- `GET /employee-profile/change-requests/pending`
- `PATCH /employee-profile/change-requests/:id/process`

**Roles Required**: `HR_ADMIN`, `HR_MANAGER`

**Business Rules Enforced**:
- BR 36: All changes via workflow approval
- BR 22: Timestamped audit trail
- Automatic notifications (N-037, N-040)

### Use Case 6: Master Data Edit/Management
**Location**: [/hr-admin/page.tsx](frontend/app/(dashboard)/hr-admin/page.tsx)

**Features**:
- View all employees with advanced filtering
- Search by name, employee number, email
- Filter by status
- Employee statistics dashboard
- Direct edit access to all profile fields
- Status management (Active, On Leave, Suspended, Terminated)
- Create new employees
- Configure system rules and roles

**Sub-pages**:
- `/hr-admin/edit/[id]` - Full profile editing
- `/hr-admin/create` - New employee creation

**API Endpoints**:
- `GET /employee-profile` - List all employees
- `GET /employee-profile/:id` - Get employee details
- `PUT /employee-profile/:id` - Update master data
- `POST /employee-profile` - Create employee
- `PATCH /employee-profile/:id/status` - Update status
- `POST /employee-profile/:id/roles/assign` - Assign roles

**Roles Required**: `HR_ADMIN`, `HR_MANAGER`, `SYSTEM_ADMIN`

## Navigation & Routing

### Route Structure

```
/
├── login (public)
├── register (public - candidates)
├── home → redirects to /profile
└── (dashboard) - authenticated routes
    ├── profile
    │   └── change-request
    ├── team (managers only)
    │   └── [id] - team member detail
    ├── change-requests (HR only)
    └── hr-admin (HR only)
        ├── create
        └── edit/[id]
```

### Role-Based Access Control

The dashboard layout ([/layout.tsx](frontend/app/(dashboard)/layout.tsx)) implements role-based navigation:

- **All Employees**: Can access `/profile`
- **Department Heads/Managers**: Can access `/team` in addition
- **HR Admin/Manager**: Can access `/hr-admin` and `/change-requests` in addition

Navigation menu items are dynamically shown based on user roles.

## Authentication Flow

1. User logs in via `/login`
2. Backend sets HTTP-only session cookie
3. Frontend stores user data in AuthContext
4. Axios interceptor handles 401/403 responses
5. Automatic redirect to login on unauthorized access

## Data Flow & Integration

### Workflow Approvals
1. Employee submits change request → `POST /employee-profile/me/change-requests`
2. Request enters pending queue
3. HR reviews in `/change-requests`
4. HR approves/rejects → `PATCH /employee-profile/change-requests/:id/process`
5. On approval: Master data updated automatically
6. Notifications triggered (N-037, N-040)

### Cross-Module Dependencies

As per requirements, the system integrates with:

- **Organizational Structure Module** (Dependency 13)
  - Position/Department changes trigger structure updates

- **Payroll Module** (Dependency 40)
  - Pay Grade changes sync to payroll
  - Status changes (Terminated/Suspended) block payments

- **Time Management Module**
  - Status changes sync automatically

- **Performance Module**
  - Appraisal history retrieved and displayed

## Key Components

### Shared Components
- Dashboard Layout with role-based navigation
- Authentication context provider
- Axios instance with interceptors

### Styling Standards
- Dark theme (black/neutral color palette)
- Consistent spacing and borders
- Responsive grid layouts
- Accessible form controls
- Status badges with color coding

## Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`
Backend expected at: `http://localhost:4000`

## Security Features

1. **Authentication**: Session-based with HTTP-only cookies
2. **Authorization**: Role-based access control on both frontend and backend
3. **CSRF Protection**: Credentials included in requests
4. **Input Validation**: Client-side validation before submission
5. **Privacy Compliance**: Sensitive data hidden from unauthorized roles (BR 18b)

## Business Rules Compliance

- **BR 2a-r**: All required profile data fields captured
- **BR 2n, 2o, 2g**: Phone, Email, Address validation
- **BR 3j**: Employee status controls system access
- **BR 17, 20**: Auto-sync with Payroll and Time Management
- **BR 18b**: Privacy restrictions for managers
- **BR 20a**: Authorized role checks for modifications
- **BR 22**: Audit trail for all changes
- **BR 36**: Workflow approval for critical changes
- **BR 41b**: Managers see only their direct reports
- **NFR-14**: Secure login and RBAC

## Future Enhancements

1. Real-time notifications using WebSockets
2. Document attachment support for change requests
3. Advanced search with filters
4. Export functionality (CSV, PDF)
5. Batch operations for HR admin
6. Performance appraisal integration
7. Organization chart visualization
8. Mobile responsive improvements
