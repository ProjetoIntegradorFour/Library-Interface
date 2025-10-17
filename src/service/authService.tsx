const API_URL = "http://localhost:8080/api/auth/signin";

export const login = async (cpf: string, password: string) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", 'Accept': 'application/json' },
    body: JSON.stringify({ cpf, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Login failed");
  }

  const data = await response.json();
  localStorage.setItem("token", data.accessToken);
  localStorage.setItem("userRole", data.roles[0]);
  return data;
};

export async function HasEnvBypass(): Promise<boolean> {
  const raw = import.meta.env.VITE_BYPASS_AUTH;
  console.log("VITE_BYPASS_AUTH raw value:", raw);
  return raw === "true";
}

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const getUserRole = (): string | null => {
  return localStorage.getItem("userRole");
};