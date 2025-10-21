// src/routes/router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Dashboard, Login, Acervo, Emprestimos, Atrasos, Relatorios, Perfil, Configuracao } from "../pages";
import ProtectedRoute from "../components/protectedRoute";
import ProtectedLayout from "./ProtectedLayout";

// Layout wrapper component
const LayoutWrapper = ({ children }: { children: React.ReactNode }) => (
  <ProtectedLayout>{children}</ProtectedLayout>
);

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <LayoutWrapper>
          <Dashboard />
        </LayoutWrapper>
      </ProtectedRoute>
    )
  },
  {
    path: "/acervo",
    element: (
      <ProtectedRoute>
        <LayoutWrapper>
          <Acervo />
        </LayoutWrapper>
      </ProtectedRoute>
    )
  },
  {
    path: "/emprestimos",
    element: (
      <ProtectedRoute>
        <LayoutWrapper>
          <Emprestimos />
        </LayoutWrapper>
      </ProtectedRoute>
    )
  },
  {
    path: "/atrasos",
    element: (
      <ProtectedRoute>
        <LayoutWrapper>
          <Atrasos />
        </LayoutWrapper>
      </ProtectedRoute>
    )
  },
  {
    path: "/relatorios",
    element: (
      <ProtectedRoute>
        <LayoutWrapper>
          <Relatorios />
        </LayoutWrapper>
      </ProtectedRoute>
    )
  },
  {
    path: "/perfil",
    element: (
      <ProtectedRoute>
        <LayoutWrapper>
          <Perfil />
        </LayoutWrapper>
      </ProtectedRoute>
    )
  },
  {
    path: "/configuracao",
    element: (
      <ProtectedRoute>
        <LayoutWrapper>
          <Configuracao />
        </LayoutWrapper>
      </ProtectedRoute>
    )
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);