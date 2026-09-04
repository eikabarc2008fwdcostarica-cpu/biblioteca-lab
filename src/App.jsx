import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import RutaProtegida from './components/RutaProtegida';
import CoursesInventory from './pages/CoursesInventory';
import Dashboard from './pages/Dashboard';
import Reservations from './pages/Reservations';
import Tasks from './pages/Tasks';
import AccesoDenegado from './pages/AccesoDenegado';

/**
 * App.jsx — Configuración de rutas con react-router-dom v6 y RutaProtegida
 *
 * Estructura de acceso:
 *   /              → Pública (Dashboard)
 *   /login         → Pública. Si ya hay sesión activa, podría redirigir al dashboard.
 *   /courses       → Autenticado (cualquier rol)
 *   /reservations  → Autenticado (cualquier rol)
 *   /admin-panel   → Autenticado + solo rol 'admin'
 *   /403           → Página de acceso denegado (puede llegar directamente o desde RutaProtegida)
 *   *              → Redirige a / para URLs no reconocidas
 *
 * Uso de <RutaProtegida>:
 *   ① Sin prop → requiere sesión, acepta cualquier rol
 *   ② Con rolPermitido="admin" → requiere sesión Y rol admin
 *
 * Dos formas de usar RutaProtegida (ambas válidas):
 *
 *   A) Como wrapper directo (children):
 *      <Route path="/courses" element={<RutaProtegida><CoursesInventory /></RutaProtegida>} />
 *
 *   B) Como Layout Route con Outlet (para agrupar múltiples rutas hijas):
 *      <Route element={<RutaProtegida />}>
 *        <Route path="/courses" element={<CoursesInventory />} />
 *        <Route path="/reservations" element={<Reservations />} />
 *      </Route>
 *
 * En este archivo usamos la forma A para mayor claridad en proyectos pequeños.
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Routes>

            {/* ── Rutas públicas ──────────────────────────────────────────── */}

            {/* Página de inicio: pública, cualquiera puede verla */}
            <Route path="/" element={<Dashboard />} />

            {/* Login: pública */}
            <Route path="/login" element={<Login />} />

            {/* Página de acceso denegado: accesible directamente */}
            <Route path="/403" element={<AccesoDenegado />} />


            {/* ── Rutas protegidas: requieren sesión activa (cualquier rol) ─ */}

            {/*
              /courses — Cualquier usuario autenticado puede ver el inventario.
              RutaProtegida sin rolPermitido → solo verifica que user !== null.
            */}
            <Route
              path="/courses"
              element={
                <RutaProtegida>
                  <CoursesInventory />
                </RutaProtegida>
              }
            />

            {/*
              /reservations — Cualquier usuario autenticado puede hacer reservas.
              El componente Reservations internamente diferencia entre admin y user.
            */}
            <Route
              path="/reservations"
              element={
                <RutaProtegida>
                  <Reservations />
                </RutaProtegida>
              }
            />

            {/*
              /tasks — Autenticado (cualquier rol).
            */}
            <Route
              path="/tasks"
              element={
                <RutaProtegida>
                  <Tasks />
                </RutaProtegida>
              }
            />


            {/* ── Rutas protegidas: requieren rol 'admin' ─────────────────── */}

            {/*
              /admin-panel — Solo accesible para usuarios con role === 'admin'.
              Si un usuario autenticado sin ese rol intenta acceder,
              RutaProtegida muestra <AccesoDenegado /> automáticamente.

              NOTA: Actualmente redirige al Dashboard como placeholder.
              Reemplaza <Dashboard /> con tu componente real de panel admin.
            */}
            <Route
              path="/admin-panel"
              element={
                <RutaProtegida rolPermitido="admin">
                  <Dashboard />  {/* ← Reemplazar con <AdminPanel /> cuando exista */}
                </RutaProtegida>
              }
            />


            {/* ── Catch-all: cualquier ruta no definida → inicio ──────────── */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
