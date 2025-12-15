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

// HR roles (management and admin)
export function isHRAdmin(userProfile: any): boolean {
  return hasRole(userProfile, ['HR_ADMIN', 'HR_MANAGER']);
}

// Manager roles (department heads and managers)
export function isManager(userProfile: any): boolean {
  return hasRole(userProfile, ['DEPARTMENT_HEAD', 'DEPARTMENT_MANAGER', 'HR_MANAGER', 'MANAGER']);
}

// System admin
export function isSystemAdmin(userProfile: any): boolean {
  return hasRole(userProfile, ['SYSTEM_ADMIN']);
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
  console.log('isManager:', isManager(userProfile));
  console.log('isSystemAdmin:', isSystemAdmin(userProfile));
  console.log('isRegularEmployee:', isRegularEmployee(userProfile));
  console.log('isHROnly:', isHROnly(userProfile));
  console.log('isManagerOnly:', isManagerOnly(userProfile));
  console.log('isHRAndManager:', isHRAndManager(userProfile));
  
  // Test individual roles
  console.log('\n--- Individual Role Checks ---');
  const allRoles = [
    'DEPARTMENT_EMPLOYEE', 'DEPARTMENT_HEAD', 'DEPARTMENT_MANAGER',
    'HR_MANAGER', 'HR_EMPLOYEE', 'HR_ADMIN',
    'PAYROLL_SPECIALIST', 'PAYROLL_MANAGER', 'SYSTEM_ADMIN',
    'LEGAL_POLICY_ADMIN', 'RECRUITER', 'FINANCE_STAFF', 'JOB_CANDIDATE'
  ];
  
  allRoles.forEach(role => {
    console.log(`Has ${role}:`, hasRole(userProfile, [role]));
  });
  
  console.log('======================');
}