import { createBrowserRouter } from "react-router-dom";
import { Dashboard, Login, Acervo, Emprestimos, Atrasos, Relatorios, Perfil, Configuracao } from "../pages";
import ProtectedRoute from "../components/protectedRoute";
import ProtectedLayout from "./ProtectedLayout";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <ProtectedLayout>
          <Dashboard />
        </ProtectedLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/acervo",
    element: (
      <ProtectedRoute>
        <ProtectedLayout>
          <Acervo />
        </ProtectedLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/emprestimos",
    element: (
      <ProtectedRoute>
        <ProtectedLayout>
          <Emprestimos />
        </ProtectedLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/atrasos",
    element: (
      <ProtectedRoute>
        <ProtectedLayout>
          <Atrasos />
        </ProtectedLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/relatorios",
    element: (
      <ProtectedRoute>
        <ProtectedLayout>
          <Relatorios />
        </ProtectedLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/perfil",
    element: (
      <ProtectedRoute>
        <ProtectedLayout>
          <Perfil />
        </ProtectedLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/configuracao",
    element: (
      <ProtectedRoute>
        <ProtectedLayout>
          <Configuracao />
        </ProtectedLayout>
      </ProtectedRoute>
    )
  }
]);