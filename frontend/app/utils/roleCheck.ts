// Utility to check user roles with flexible data structure handling

// Normalize role names to handle both "HR Admin" and "HR_ADMIN" formats
function normalizeRole(role: string): string {
  return role.toUpperCase().replace(/\s+/g, '_');
}

export function hasRole(userProfile: any, requiredRoles: string[]): boolean {
  if (!userProfile) return false;

  // Normalize required roles
  const normalizedRequiredRoles = requiredRoles.map(normalizeRole);

  // Method 1: Check systemRoles array
  if (userProfile.systemRoles && Array.isArray(userProfile.systemRoles)) {
    for (const roleObj of userProfile.systemRoles) {
      // Check if it's an object with roles array
      if (roleObj.roles && Array.isArray(roleObj.roles)) {
        if (roleObj.roles.some((r: string) => normalizedRequiredRoles.includes(normalizeRole(r)))) {
          return true;
        }
      }
      // Check if it's an object with roleName property
      if (roleObj.roleName && normalizedRequiredRoles.includes(normalizeRole(roleObj.roleName))) {
        return true;
      }
      // Check if it's just a string
      if (typeof roleObj === 'string' && normalizedRequiredRoles.includes(normalizeRole(roleObj))) {
        return true;
      }
    }
  }

  // Method 2: Check accessProfileId (populated)
  if (userProfile.accessProfileId) {
    const accessProfile = userProfile.accessProfileId;
    if (accessProfile.roles && Array.isArray(accessProfile.roles)) {
      if (accessProfile.roles.some((r: string) => normalizedRequiredRoles.includes(normalizeRole(r)))) {
        return true;
      }
    }
  }

  // Method 3: Check direct roles property
  if (userProfile.roles && Array.isArray(userProfile.roles)) {
    if (userProfile.roles.some((r: string) => normalizedRequiredRoles.includes(normalizeRole(r)))) {
      return true;
    }
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

  // Department Employee can only edit non-critical fields
  if (isDepartmentEmployee(userProfile)) {
    return nonCriticalFields.includes(fieldName);
  }

  return false;
}

/**
 * Check if user needs to submit a change request for a field
 * Critical fields require change request: Name, National ID, Position, Marital Status, etc.
 */
export function requiresChangeRequest(userProfile: any, fieldName: string): boolean {
  const criticalFields = ['firstName', 'middleName', 'lastName', 'nationalId', 'maritalStatus',
                          'dateOfBirth', 'gender', 'primaryPositionId', 'primaryDepartmentId',
                          'contractType', 'workType', 'bankName', 'bankAccountNumber'];

  // HR Admin never needs change requests (can edit directly)
  if (isHRAdmin(userProfile)) {
    return false;
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