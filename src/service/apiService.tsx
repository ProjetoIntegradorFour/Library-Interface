import { getToken } from './authService';

const API_BASE_URL = "http://localhost:8080/api";

// Generic API call with auth header
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (response.status === 401 || response.status === 403) {
    // Token expired or insufficient permissions
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
    throw new Error("Authentication required");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Test endpoints
export const testAPI = {
  getPublicContent: () => apiCall('/test/all'),
  getUserContent: () => apiCall('/test/user'),
  getAdminContent: () => apiCall('/test/admin'),
};

// Application endpoints
export const appAPI = {
  getDashboard: () => apiCall('/dashboard'),
  getAcervo: () => apiCall('/acervo'),
  getEmprestimos: () => apiCall('/emprestimos'),
  getAtrasos: () => apiCall('/atrasos'),
  getRelatorios: () => apiCall('/relatorios'),
};