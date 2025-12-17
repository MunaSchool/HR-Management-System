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

// ============================================
// ROLE PERMISSION FUNCTIONS (Per Requirements)
// ============================================

/**
 * Check if user is HR Admin or HR Manager
 * Permissions:
 * - Review and approve/reject change requests
 * - Direct access to edit ANY employee profile field (PII, Pay Grade, Status, Hire Date)
 * - Configure system rules
 * - Access all employee profiles
 */
export function isHRAdmin(userProfile: any): boolean {
  return hasRole(userProfile, ['HR_ADMIN', 'HR_MANAGER']);
}

/**
 * Check if user is Department Manager (Department Head)
 * Permissions:
 * - Secure access to team list
 * - View non-sensitive, summarized profile data of direct reports
 * - Filtered by direct reporting line hierarchy
 */
export function isDepartmentManager(userProfile: any): boolean {
  return hasRole(userProfile, ['DEPARTMENT_HEAD']);
}

/**
 * Check if user is a regular Department Employee
 * Permissions:
 * - Direct modification of non-critical data (Profile Picture, Phone, Email, Address)
 * - Submit change requests for critical data (Name, National ID, Position, Marital Status)
 * - Access and view own PII and employment details
 */
export function isDepartmentEmployee(userProfile: any): boolean {
  return hasRole(userProfile, ['DEPARTMENT_EMPLOYEE', 'department employee']);
}

/**
 * Check if user has Manager-level access (includes HR Admin/Manager + Department Managers)
 * Use this when you want to show features to ANY type of manager
 */
export function isManager(userProfile: any): boolean {
  return hasRole(userProfile, ['DEPARTMENT_HEAD', 'HR_MANAGER', 'HR_ADMIN']);
}

/**
 * Check if user is System Admin (highest level)
 * Permissions: All HR Admin permissions + system configuration
 */
export function isSystemAdmin(userProfile: any): boolean {
  return hasRole(userProfile, ['SYSTEM_ADMIN', 'HR_ADMIN']);
}

/**
 * Check if user can edit profile fields directly (without change request)
 * - Department Employees: Can edit non-critical fields only (Phone, Email, Address, Profile Picture)
 * - HR Admin/Manager: Can edit ALL fields
 */
export function canDirectlyEditProfile(userProfile: any, fieldName: string): boolean {
  const nonCriticalFields = ['mobilePhone', 'homePhone', 'personalEmail', 'address', 'profilePictureUrl'];

  // HR Admin can edit everything
  if (isHRAdmin(userProfile)) {
    return true;
  }

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

// Debug helper (kept)
export function debugRoles(userProfile: UserProfile): void {
  console.log("=== ROLE DEBUG INFO ===");
  console.log("Full profile:", userProfile);
  console.log("systemRoles:", userProfile?.systemRoles);
  console.log("accessProfileId:", userProfile?.accessProfileId);
  console.log("roles:", userProfile?.roles);

  console.log("\n--- Role Check Results ---");
  console.log("isSystemAdmin:", isSystemAdmin(userProfile));
  console.log("isHRManager:", isHRManager(userProfile));
  console.log("isHREmployee:", isHREmployee(userProfile));
  console.log("isLineManager:", isLineManager(userProfile));
  console.log("isEmployee:", isEmployee(userProfile));

  console.log("\n--- Performance Permissions ---");
  console.log("canManageAppraisalTemplates:", canManageAppraisalTemplates(userProfile));
  console.log("canCreateAndScheduleCycles:", canCreateAndScheduleCycles(userProfile));
  console.log("canAssignAppraisalsInBulk:", canAssignAppraisalsInBulk(userProfile));
  console.log("canViewAssignedAppraisalsAsManager:", canViewAssignedAppraisalsAsManager(userProfile));
  console.log("canFillManagerRatings:", canFillManagerRatings(userProfile));
  console.log("canMonitorAppraisalProgress:", canMonitorAppraisalProgress(userProfile));
  console.log("canViewCompletionDashboard:", canViewCompletionDashboard(userProfile));
  console.log("canPublishAppraisalResults:", canPublishAppraisalResults(userProfile));
  console.log("canRaiseAppraisalDispute:", canRaiseAppraisalDispute(userProfile));
  console.log("canResolveAppraisalDispute:", canResolveAppraisalDispute(userProfile));
  console.log("======================");
}
