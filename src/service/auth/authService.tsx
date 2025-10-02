const API_URL = "http://localhost:8080/auth/signin";

export const login = async (cpf: string, password: string) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

export const HasEnvBypass = () => {
  if (import.meta.env.VITE_BYPASS_AUTH === "true") return true;
  
  const token = localStorage.getItem("token");
  return token !== null;
};
