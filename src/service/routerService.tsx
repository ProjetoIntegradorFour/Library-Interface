const API_URL = "http://localhost:8080/api/router";

export async function canAccessRoute(path: string): Promise<boolean> {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;

    const res = await fetch(`${API_URL}/can-access?path=${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return false;
    const data = await res.json();
    return data.allowed;
  } catch (err) {
    console.error("Error checking route access", err);
    return false;
  }
}

export async function fetchAllowedRoutes(): Promise<string[]> {
  try {
    const token = localStorage.getItem("token");
    if (!token) return [];

    const res = await fetch(`${API_URL}/allowed`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Error fetching allowed routes", err);
    return [];
  }
}
