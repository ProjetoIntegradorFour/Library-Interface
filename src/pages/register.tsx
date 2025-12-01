import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const BYPASS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0Iiwicm9sZXMiOlsiUk9MRV9VU0VSIl0sImlhdCI6MTc2MDQ4ODUzOCwiZXhwIjoxNzYwNTc0OTM4fQ.D3lsMpGlZ3VkDGHne-G0tV2-HRlauWmU87hmFC01v5U";
  const BYPASS_ROLE = "ADMIN";

  const handleSaveToken = () => {
    localStorage.setItem("token", BYPASS_TOKEN);
    localStorage.setItem("role", BYPASS_ROLE);

    alert(`Token e role salvos com sucesso!\nToken: ${BYPASS_TOKEN}\nRole: ${BYPASS_ROLE}`);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    if (savedToken && savedRole) {
      console.log("Token já salvo:", savedToken);
      console.log("Role já salvo:", savedRole);
    }
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Página de Bypass para Testes</h2>

      <p style={styles.subtitle}>
        Esta página é apenas para testes de desenvolvimento
      </p>

      <div style={styles.card}>
        <button
          onClick={handleSaveToken}
          style={styles.button}
        >
          Salvar Token e Role
        </button>

        <div style={styles.buttonGroup}>
          <button
            onClick={() => navigate('/home')}
            style={{ ...styles.button, ...styles.secondaryButton }}
          >
            Ir para Home
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            style={{ ...styles.button, ...styles.secondaryButton }}
          >
            Ir para Dashboard
          </button>
        </div>

        <div style={styles.info}>
          <p><strong>Token:</strong> {BYPASS_TOKEN.substring(0, 30)}...</p>
          <p><strong>Role:</strong> {BYPASS_ROLE}</p>
          <p><strong>Status:</strong> {localStorage.getItem("auth_token") ? "Salvo" : "Não salvo"}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5'
  },
  title: {
    color: '#333',
    marginBottom: '10px',
    textAlign: 'center' as const
  },
  subtitle: {
    color: '#666',
    fontSize: '14px',
    marginBottom: '30px',
    textAlign: 'center' as const
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px'
  },
  button: {
    backgroundColor: '#2196F3',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '16px',
    marginBottom: '15px',
    fontWeight: 'bold' as const
  },
  secondaryButton: {
    backgroundColor: '#4CAF50',
    marginBottom: '10px'
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    marginTop: '20px'
  },
  info: {
    marginTop: '25px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#333'
  }
};