/**
 * Decode JWT token to get user info
 * @param token JWT token string
 * @returns Decoded token payload
 */
export const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

/**
 * Get user info from JWT token
 * @param token JWT token string
 * @returns User info object
 */
export const getUserFromToken = (token: string) => {
  const decoded = decodeJWT(token);
  
  if (!decoded) return null;

  console.log('🔍 Decoded JWT:', decoded);

  // Try different possible claim names for role
  const roleClaim = 
    decoded.role || 
    decoded.Role ||
    decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
    decoded.RoleId ||
    decoded.roleId ||
    '3'; // Default to Student

  console.log('📌 Role claim:', roleClaim);

  // Try different possible claim names for user ID
  const userId = 
    decoded.nameid || 
    decoded.sub || 
    decoded.userId || 
    decoded.UserId ||
    decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
    '0';

  // Try different possible claim names for email
  const email = 
    decoded.email || 
    decoded.Email ||
    decoded.unique_name || 
    decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
    '';

  // Try different possible claim names for name
  const fullName = 
    decoded.name || 
    decoded.Name ||
    decoded.fullName || 
    decoded.FullName ||
    decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
    email.split('@')[0] ||
    '';

  return {
    id: parseInt(userId.toString()),
    email: email.toString(),
    fullName: fullName.toString(),
    role: roleClaim,
    isActive: true,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Check if token is expired
 * @param token JWT token string
 * @returns true if expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  
  if (!decoded || !decoded.exp) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};