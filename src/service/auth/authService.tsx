/* 
    TODO: fix this vibe coded logic, match backend endpoints 
*/

export function HasEnvBypass() {
    // compare .env string to 'bypass' the auth system
    return localStorage.getItem("app_token") !== null || import.meta.env.VITE_BYPASS_AUTH === "true";
}

const API_URL = "http://localhost:8080/api/auth";

const login = async (username: string, password: string) => {
  const response = await fetch(`${API_URL}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();
  // Save token in localStorage
  localStorage.setItem("token", data.token);
  return data;
};

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export default { login, isAuthenticated };
