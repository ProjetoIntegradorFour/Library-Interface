// pages/acesso-negado.tsx
import { useNavigate } from 'react-router-dom';

export default function AcessoNegadoPage() {
  const navigate = useNavigate();
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: 'calc(100vh - 120px)',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ color: '#dc3545', fontSize: '3rem' }}>⛔</h1>
      <h2>Acesso Negado</h2>
      <p style={{ marginBottom: '2rem', maxWidth: '500px' }}>
        Você não tem permissão para acessar esta página.
        Entre em contato com o administrador do sistema se acredita
        que isto é um erro.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Voltar
        </button>
        
        <button 
          onClick={() => navigate('/acervo')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Ir para o Acervo
        </button>
      </div>
    </div>
  );
}