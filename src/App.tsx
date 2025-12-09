// App.tsx - COM DASHBOARD NA RAIZ
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedLayout from './routes/ProtectedLayout'

// Páginas
import LoginPage from './pages/login';
import DashboardPage from './pages/dashboard'; // ⭐ IMPORTE DASHBOARD
import AcervoPage from './pages/acervo';
import EmprestimosPage from './pages/emprestimos';
import AtrasosPage from './pages/atrasos';
import AcessoNegadoPage from './pages/acesso-negado';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* ⭐ DASHBOARD na raiz */}
        <Route path="/" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <DashboardPage /> {/* ← DASHBOARD aqui */}
            </ProtectedLayout>
          </ProtectedRoute>
        } />
        
        {/* Rotas protegidas com layout */}
        <Route path="/acervo" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <AcervoPage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/emprestimos" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <EmprestimosPage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/atrasos" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <AtrasosPage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/acesso-negado" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <AcessoNegadoPage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;