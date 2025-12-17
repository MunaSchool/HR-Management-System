// rolecheck.ts
// Role + permission utilities aligned to Performance Appraisal flow responsibilities.

type UserProfile = any;

// Normalize role names to handle both "HR Admin" and "HR_ADMIN" formats
function normalizeRole(role: string): string {
  return String(role || "").toUpperCase().replace(/\s+/g, "_");
}

export function hasRole(userProfile: UserProfile, requiredRoles: string[]): boolean {
  if (!userProfile) return false;

  const normalizedRequired = requiredRoles.map(normalizeRole);

  const roleMatches = (r: unknown) =>
    typeof r === "string" && normalizedRequired.includes(normalizeRole(r));

  // Method 1: systemRoles array can be: string | { roleName } | { roles: [] }
  const systemRoles = userProfile.systemRoles;
  if (Array.isArray(systemRoles)) {
    for (const roleObj of systemRoles) {
      if (typeof roleObj === "string" && roleMatches(roleObj)) return true;

      if (roleObj && typeof roleObj === "object") {
        if (Array.isArray(roleObj.roles) && roleObj.roles.some(roleMatches)) return true;
        if (typeof roleObj.roleName === "string" && roleMatches(roleObj.roleName)) return true;
      }
    }
  }

  // Method 2: accessProfileId populated object: { roles: [] }
  const accessProfile = userProfile.accessProfileId;
  if (accessProfile && Array.isArray(accessProfile.roles)) {
    if (accessProfile.roles.some(roleMatches)) return true;
  }

  // Method 3: direct roles property: []
  const directRoles = userProfile.roles;
  if (Array.isArray(directRoles)) {
    if (directRoles.some(roleMatches)) return true;
  }

  return false;
}

// ============================
// ROLE CHECKS (Appraisal Flow)
// ============================

// System-level (optional, keep if your app has it)
export function isSystemAdmin(userProfile: UserProfile): boolean {
  return hasRole(userProfile, ["SYSTEM_ADMIN"]);
}

// HR Manager: owns templates, fairness, dashboards, dispute resolution, final authority
export function isHRManager(userProfile: UserProfile): boolean {
  // Keep HR_ADMIN as a superset if it exists in your org.
  return hasRole(userProfile, ["HR_MANAGER", "HR_ADMIN"]) || isSystemAdmin(userProfile);
}

// HR Employee: operates cycles, assignments, reminders, publishing step
export function isHREmployee(userProfile: UserProfile): boolean {
  return hasRole(userProfile, ["HR_EMPLOYEE"]) || isHRManager(userProfile);
}

// Line Manager / Department Head: completes evaluations for direct reports
export function isLineManager(userProfile: UserProfile): boolean {
  return hasRole(userProfile, ["DEPARTMENT_HEAD", "DEPARTMENT_MANAGER"]);
}

// Regular employee
export function isEmployee(userProfile: UserProfile): boolean {
  // Most systems treat everyone as an employee. Keep your existing enum too.
  return hasRole(userProfile, ["DEPARTMENT_EMPLOYEE", "EMPLOYEE"]);
}

// Convenience
export function isAnyManager(userProfile: UserProfile): boolean {
  return isLineManager(userProfile) || isHRManager(userProfile);
}

// =====================================
// PERFORMANCE APPRAISAL PERMISSIONS
// =====================================
// These are the only checks your Performance UI should use.

// Step 1: Template Definition (HR Manager)
export function canManageAppraisalTemplates(userProfile: UserProfile): boolean {
  return isHRManager(userProfile);
}

// Step 2: Cycle Creation & Setup (HR Employee / HR Manager)
export function canCreateAndScheduleCycles(userProfile: UserProfile): boolean {
  return isHREmployee(userProfile);
}

// Step 3A: Assignment & Manager Access (HR Employee assigns, Manager views)
export function canAssignAppraisalsInBulk(userProfile: UserProfile): boolean {
  return isHREmployee(userProfile);
}

export function canViewAssignedAppraisalsAsManager(userProfile: UserProfile): boolean {
  return isLineManager(userProfile) || isHRManager(userProfile);
}

// Step 3B: Manager fills form (Line Manager)
export function canFillManagerRatings(userProfile: UserProfile): boolean {
  return isLineManager(userProfile);
}

// Step 4: HR monitors progress & publishes (HR Employee / HR Manager)
export function canMonitorAppraisalProgress(userProfile: UserProfile): boolean {
  return isHREmployee(userProfile);
}

export function canViewCompletionDashboard(userProfile: UserProfile): boolean {
  return isHRManager(userProfile);
}

export function canPublishAppraisalResults(userProfile: UserProfile): boolean {
  // In your flow HR Employee publishes after manager completes.
  // Keep HR Manager allowed as well.
  return isHREmployee(userProfile);
}

// Step 5: Employee receives rating (Employee)
export function canViewOwnFinalRating(userProfile: UserProfile): boolean {
  return true; // Usually everyone can view their own record, enforced by backend ownership.
}

// Step 6: Employee objects (Employee or HR Employee)
export function canRaiseAppraisalDispute(userProfile: UserProfile): boolean {
  return isEmployee(userProfile) || isHREmployee(userProfile);
}

// Step 7: HR Manager resolves objection (HR Manager)
export function canResolveAppraisalDispute(userProfile: UserProfile): boolean {
  return isHRManager(userProfile);
}

// ============================
// PROFILE EDITING (NON-PERF)
// ============================
// Keep this if you still use it elsewhere, but do not mix it with Performance rules.

const NON_CRITICAL_PROFILE_FIELDS = [
  "mobilePhone",
  "homePhone",
  "personalEmail",
  "address",
  "profilePictureUrl",
] as const;

const CRITICAL_PROFILE_FIELDS = [
  "firstName",
  "middleName",
  "lastName",
  "nationalId",
  "maritalStatus",
  "dateOfBirth",
  "gender",
  "primaryPositionId",
  "primaryDepartmentId",
  "contractType",
  "workType",
  "bankName",
  "bankAccountNumber",
] as const;

export function canDirectlyEditProfile(userProfile: UserProfile, fieldName: string): boolean {
  if (isHRManager(userProfile)) return true; // HR Manager/Admin can edit anything
  if (isEmployee(userProfile)) return (NON_CRITICAL_PROFILE_FIELDS as readonly string[]).includes(fieldName);
  return false;
}

export function requiresChangeRequest(userProfile: UserProfile, fieldName: string): boolean {
  if (isHRManager(userProfile)) return false;
  return (CRITICAL_PROFILE_FIELDS as readonly string[]).includes(fieldName);
}

  // Department Employees need change request for critical fields
  return criticalFields.includes(fieldName);
}

/**
 * Check if user can view team profiles
 * Department Managers can view their direct reports (non-sensitive data)
 */
export function canViewTeamProfiles(userProfile: any): boolean {
  return isDepartmentManager(userProfile) || isHRAdmin(userProfile);
}

/**
 * Check if user can review and approve change requests
 * Only HR Admin and HR Manager can do this
 */
export function canReviewChangeRequests(userProfile: any): boolean {
  return isHRAdmin(userProfile);
}

/**
 * Check if user can access all employee profiles (not just their team)
 * Only HR Admin/Manager have this access
 */
export function canAccessAllEmployees(userProfile: any): boolean {
  return isHRAdmin(userProfile);
}

// Regular employee roles (based on your enums)
export function isRegularEmployee(userProfile: any): boolean {
  const regularEmployeeRoles = [
    'DEPARTMENT_EMPLOYEE',
    'HR_EMPLOYEE', 
    'PAYROLL_SPECIALIST',
    'PAYROLL_MANAGER',
    'LEGAL_POLICY_ADMIN',
    'RECRUITER',
    'FINANCE_STAFF',
    'JOB_CANDIDATE'
  ];
  
  // Check if user has ANY regular employee role
  const hasRegularRole = hasRole(userProfile, regularEmployeeRoles);
  
  // Also check if they don't have admin/manager roles
  const hasAdminOrManagerRole = isHRAdmin(userProfile) || isManager(userProfile) || isSystemAdmin(userProfile);
  
  return hasRegularRole && !hasAdminOrManagerRole;
}

// Check if user is HR but not a manager
export function isHROnly(userProfile: any): boolean {
  const isHR = isHRAdmin(userProfile);
  const isMgr = isManager(userProfile);
  const isSysAdmin = isSystemAdmin(userProfile);
  
  return isHR && !isMgr && !isSysAdmin;
}

// Check if user is a manager but not HR
export function isManagerOnly(userProfile: any): boolean {
  const isMgr = isManager(userProfile);
  const isHR = isHRAdmin(userProfile);
  const isSysAdmin = isSystemAdmin(userProfile);
  
  return isMgr && !isHR && !isSysAdmin;
}

// Check if user is HR and Manager (has both)
export function isHRAndManager(userProfile: any): boolean {
  return isHRAdmin(userProfile) && isManager(userProfile);
}

// Enhanced debug function
export function debugRoles(userProfile: any): void {
  console.log('=== ROLE DEBUG INFO ===');
  console.log('Full profile:', userProfile);
  console.log('systemRoles:', userProfile?.systemRoles);
  console.log('accessProfileId:', userProfile?.accessProfileId);
  console.log('roles:', userProfile?.roles);
  
  console.log('\n--- Role Check Results ---');
  console.log('isHRAdmin:', isHRAdmin(userProfile));
  console.log('isDepartmentManager:', isDepartmentManager(userProfile));
  console.log('isDepartmentEmployee:', isDepartmentEmployee(userProfile));
  console.log('isManager:', isManager(userProfile));
  console.log('isSystemAdmin:', isSystemAdmin(userProfile));
  console.log('canViewTeamProfiles:', canViewTeamProfiles(userProfile));
  console.log('canReviewChangeRequests:', canReviewChangeRequests(userProfile));
  console.log('canAccessAllEmployees:', canAccessAllEmployees(userProfile));
  console.log('======================');
}
