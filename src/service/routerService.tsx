import { getToken, HasEnvBypass } from './authService';
import { testAPI } from './apiService';

export const canAccessRoute = async (path: string): Promise<boolean> => {
  const envBypass = await HasEnvBypass();
  if (envBypass) {
    console.log("Bypass active - granting access to:", path);
    return true;
  }

  const token = getToken();
  if (!token) {
    console.log("No token found - redirecting to login");
    return false;
  }

  try {
    if (path === '/atrasos' || path === '/relatorios' || path === '/configuracao') {
      await testAPI.getAdminContent();
    } else {
      await testAPI.getUserContent();
    }
    console.log("Backend access verified for:", path);
    return true;
  } catch (error) {
    console.log("Backend access denied for:", path, error);
    return false;
  }
};
