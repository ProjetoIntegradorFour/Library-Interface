const API_URL = "http://localhost:8080/api/auth";

export const login = async (cpf: string, password: string) => {
  const response = await fetch(`${API_URL}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cpf, password }),
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

export const HasEnvBypass = (): boolean => {
  const bypass = import.meta.env.VITE_BYPASS_AUTH === "true";
  console.log("Env bypass:", bypass);
  return bypass;
};

export const isAuthenticated = (): boolean => {
  if (HasEnvBypass()) {
    console.log("Bypass enabled - automatically authenticated");

    if (!localStorage.getItem("token")) {
      const fakeToken = generateBypassToken();
      localStorage.setItem("token", fakeToken);
      localStorage.setItem("userRole", "ADMIN");
      console.log("Bypass token set:", fakeToken);      
  }

    return true;

  }

  const token = getToken();
  const hasToken = !!token;
  console.log("Auth check - Token exists:", hasToken);
  return hasToken;
  
};


const generateBypassToken = (): string => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));

  const payload = btoa(JSON.stringify({
    sub: "bypass-user",
    roles: ["ADMIN"],
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
  }));

  const signature = btoa("bypass-signature");

  return `${header}.${payload}.${signature}`;
};