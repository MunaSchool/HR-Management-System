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

export function isHRAdmin(userProfile: any): boolean {
  return hasRole(userProfile, ['HR_ADMIN', 'HR_MANAGER']);
}

export function isManager(userProfile: any): boolean {
  return hasRole(userProfile, ['DEPARTMENT_HEAD', 'HR_MANAGER', 'HR_ADMIN']);
}

export function isSystemAdmin(userProfile: any): boolean {
  return hasRole(userProfile, ['HR_ADMIN']);
}

// Debug function to log role structure
export function debugRoles(userProfile: any): void {
  console.log('=== ROLE DEBUG INFO ===');
  console.log('Full profile:', userProfile);
  console.log('systemRoles:', userProfile?.systemRoles);
  console.log('accessProfileId:', userProfile?.accessProfileId);
  console.log('roles:', userProfile?.roles);
  console.log('isHRAdmin:', isHRAdmin(userProfile));
  console.log('isManager:', isManager(userProfile));
  console.log('isSystemAdmin:', isSystemAdmin(userProfile));
  console.log('======================');
}
