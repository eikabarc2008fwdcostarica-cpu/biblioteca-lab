import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AccesoDenegado from '../pages/AccesoDenegado';

/**
 * Componente RutaProtegida
 *
 * Actúa como guardia de ruta para react-router-dom v6.
 * Puede usarse de dos formas:
 *   1. Como wrapper con children:  <RutaProtegida><MiPagina /></RutaProtegida>
 *   2. Como layout route con Outlet: <Route element={<RutaProtegida />}><Route path="..." .../></Route>
 *
 * Props:
 *   - rolPermitido (string, opcional): si se pasa, solo usuarios con ese rol pueden ver la ruta.
 *   - children (ReactNode, opcional): contenido a renderizar si se usa como wrapper directo.
 *
 * Flujo de decisión:
 *   1. Si user === null → redirige a /login (con replace para no romper historial)
 *   2. Si rolPermitido está definido y user.role !== rolPermitido → muestra <AccesoDenegado/>
 *   3. Si cumple condiciones → renderiza children o <Outlet/>
 *
 * ─── NOTA SOBRE RECARGA DE PÁGINA ─────────────────────────────────────────────
 * El AuthContext inicializa `user` de forma SÍNCRONA desde localStorage:
 *
 *   const [user, setUser] = useState(() => {
 *     const stored = localStorage.getItem('user');
 *     return stored ? JSON.parse(stored) : null;
 *   });
 *
 * Gracias al lazy initializer, en el primer render ya tenemos el valor correcto.
 * NO existe una ventana de tiempo donde user === null por un instante mientras
 * "se lee" el storage, por lo que no es necesario un estado `isLoading` extra.
 * Si en el futuro el contexto se volviera ASÍNCRONO (ej. verificación con backend),
 * habría que agregar: if (isAuthLoading) return <Spinner />;
 *
 * ─── SOBRE replace EN <Navigate> ──────────────────────────────────────────────
 * Usamos `replace` para que la ruta protegida NO quede en el historial del navegador.
 * Sin `replace`: historial = ['/courses', '/login']  → botón "Atrás" vuelve a /courses (bucle)
 * Con `replace`:  historial = ['/login']             → botón "Atrás" va a la página anterior real
 */
const RutaProtegida = ({ rolPermitido, children }) => {
  const { user } = useAuth();

  // ── Caso 1: No hay sesión activa ──────────────────────────────────────────
  if (user === null) {
    // `replace` evita que la ruta protegida quede en el historial (ver nota arriba)
    return <Navigate to="/login" replace />;
  }

  // ── Caso 2: El rol del usuario no coincide con el rol requerido ───────────
  // La comparación es insensible a mayúsculas para mayor robustez
  if (rolPermitido && user.role?.toLowerCase() !== rolPermitido.toLowerCase()) {
    return <AccesoDenegado />;
  }

  // ── Caso 3: Usuario autenticado y con el rol correcto ─────────────────────
  // Renderizamos los hijos directos si los hay, o el <Outlet/> de react-router
  return children ? children : <Outlet />;
};

export default RutaProtegida;
