const API_URL = "http://localhost:8080/api/auth";

export const login = async (cpf: string, password: string) => {
  const response = await fetch(`${API_URL}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cpf,  }),
  });

  if (!response.ok) throw new Error("Login failed");

  const data = await response.json();
  localStorage.setItem("token", data.accessToken);
  localStorage.setItem("userRole", data.roles?.[0] || "USER");
  return data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
};

export const getToken = (): string | null => localStorage.getItem("token");
export const getUserRole = (): string | null => localStorage.getItem("userRole");

export const isAuthenticated = (): boolean => {
  const token = getToken();
  const hasToken = !!token;
  console.log("Auth check - Token exists:", hasToken);
  return hasToken;
};

export const HasEnvBypass = (): boolean => {
  const bypass = import.meta.env.VITE_BYPASS_AUTH === "true";
  console.log("Env bypass:", bypass);
  return bypass;
};