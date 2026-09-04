import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import RutaProtegida from './components/RutaProtegida';
import GeminiChatbot from './components/GeminiChatbot';
import Register from './pages/Register';
import CoursesInventory from './pages/CoursesInventory';
import Dashboard from './pages/Dashboard';
import Reservations from './pages/Reservations';
import Tasks from './pages/Tasks';
import AccesoDenegado from './pages/AccesoDenegado';

/**
 * AppContent
 * Componente interno que consume useAuth para renderizado global
 * de componentes dependientes de sesión como GeminiChatbot.
 */
function AppContent() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* ── Rutas públicas ──────────────────────────────────────────── */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/403" element={<AccesoDenegado />} />

          {/* ── Rutas protegidas: requieren sesión activa ───────────────── */}
          {/* Dashboard como ruta principal protegida */}
          <Route
            path="/"
            element={
              <RutaProtegida>
                <Dashboard />
              </RutaProtegida>
            }
          />

          {/* Inventario de cursos */}
          <Route
            path="/courses"
            element={
              <RutaProtegida>
                <CoursesInventory />
              </RutaProtegida>
            }
          />

          {/* Reservas de laboratorio */}
          <Route
            path="/reservations"
            element={
              <RutaProtegida>
                <Reservations />
              </RutaProtegida>
            }
          />

          {/* Tareas operativas y de laboratorio */}
          <Route
            path="/tasks"
            element={
              <RutaProtegida>
                <Tasks />
              </RutaProtegida>
            }
          />

          {/* ── Catch-all: redirección a raíz ───────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Asistente IA disponible globalmente cuando el usuario haya iniciado sesión */}
      {user && <GeminiChatbot />}
    </BrowserRouter>
  );
}

/**
 * App principal envuelta en AuthProvider
 */
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
