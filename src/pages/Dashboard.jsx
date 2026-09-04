import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  FlaskConical,
  ClipboardList,
  UserCheck,
  ArrowRight,
  BarChart3,
  AlertTriangle,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

/**
 * Componente de página Dashboard (Panel de Control Principal)
 * Carga métricas en paralelo con Promise.all desde /courses, /reservations y /tasks.
 * Muestra el banner institucional y accesos directos a los módulos.
 */
const Dashboard = () => {
  const { user } = useAuth();

  const [metrics, setMetrics] = useState({
    totalCourses: 0,
    coursesOutOfStock: 0,
    totalReservations: 0,
    tasksPending: 0,
    tasksCompleted: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);

      try {
        // Carga paralela con Promise.all según requerimiento arquitectónico
        const [resCourses, resReservations, resTasks] = await Promise.all([
          fetch('http://localhost:3001/courses'),
          fetch('http://localhost:3001/reservations'),
          fetch('http://localhost:3001/tasks'),
        ]);

        if (!resCourses.ok || !resReservations.ok || !resTasks.ok) {
          throw new Error('No se pudo obtener la información completa de las métricas.');
        }

        const [coursesData, reservationsData, tasksData] = await Promise.all([
          resCourses.json(),
          resReservations.json(),
          resTasks.json(),
        ]);

        const coursesList = Array.isArray(coursesData) ? coursesData : [];
        const reservationsList = Array.isArray(reservationsData) ? reservationsData : [];
        const tasksList = Array.isArray(tasksData) ? tasksData : [];

        setMetrics({
          totalCourses: coursesList.length,
          coursesOutOfStock: coursesList.filter((c) => Number(c.materialsAvailable) === 0).length,
          totalReservations: reservationsList.length,
          tasksPending: tasksList.filter((t) => !t.completed).length,
          tasksCompleted: tasksList.filter((t) => !!t.completed).length,
        });
      } catch (err) {
        setError(
          err instanceof TypeError && err.message.toLowerCase().includes('fetch')
            ? 'No se pudo conectar con JSON Server. Asegúrate de que esté corriendo en http://localhost:3001'
            : err.message || 'Error al cargar las métricas del sistema.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="dashboard-container">
      {/* ── Banner Institucional Superior ─────────────────────────────────── */}
      <section className="dashboard-hero">
        <h1>Panel de Control - Biblioteca Digital</h1>
        <p className="dashboard-hero-desc">
          Plataforma centralizada para la consulta de material académico, gestión de préstamos,
          reserva de cursos especializados y administración de tareas operativas de la biblioteca.
        </p>
        <div className="dashboard-user-badge">
          <UserCheck size={16} />
          <span>
            Usuario activo: <strong>{user?.name}</strong> ([{user?.role || 'user'}])
          </span>
        </div>
      </section>

      {/* Alerta si falla alguna petición */}
      {error && (
        <div className="dashboard-alert" role="alert">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* ── Sección de Métricas Principales ────────────────────────────────── */}
      <h2 className="dashboard-section-title">
        <BarChart3 size={20} color="#2563eb" />
        <span>Resumen Operativo del Sistema</span>
      </h2>

      {loading ? (
        <div className="dashboard-loading">
          <div className="dashboard-spinner"></div>
          <p>Calculando estadísticas en tiempo real...</p>
        </div>
      ) : (
        <div className="metrics-grid">
          {/* Métrica 1: Cursos */}
          <article className="metric-card">
            <div className="metric-icon-box blue">
              <BookOpen size={24} />
            </div>
            <div className="metric-data">
              <p className="metric-label">Cursos Académicos</p>
              <p className="metric-value">{metrics.totalCourses}</p>
              <p className="metric-subtext">
                {metrics.coursesOutOfStock > 0 ? (
                  <span className="highlight-warning">
                    {metrics.coursesOutOfStock} con material agotado
                  </span>
                ) : (
                  <span className="highlight-success">Todos con material disponible</span>
                )}
              </p>
            </div>
          </article>

          {/* Métrica 2: Reservas */}
          <article className="metric-card">
            <div className="metric-icon-box indigo">
              <FlaskConical size={24} />
            </div>
            <div className="metric-data">
              <p className="metric-label">Reservas de Laboratorio</p>
              <p className="metric-value">{metrics.totalReservations}</p>
              <p className="metric-subtext">
                <span>Registradas en la plataforma</span>
              </p>
            </div>
          </article>

          {/* Métrica 3: Tareas */}
          <article className="metric-card">
            <div className="metric-icon-box emerald">
              <ClipboardList size={24} />
            </div>
            <div className="metric-data">
              <p className="metric-label">Tareas Operativas</p>
              <p className="metric-value">
                {metrics.tasksPending + metrics.tasksCompleted}
              </p>
              <p className="metric-subtext">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} color="#d97706" /> {metrics.tasksPending} pendientes
                </span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={12} color="#059669" /> {metrics.tasksCompleted} listas
                </span>
              </p>
            </div>
          </article>
        </div>
      )}

      {/* ── Accesos Rápidos a los Módulos ─────────────────────────────────── */}
      <h2 className="dashboard-section-title" style={{ marginTop: '1.5rem' }}>
        <span>Módulos de Gestión</span>
      </h2>

      <div className="quick-access-grid">
        <article className="access-card">
          <div>
            <div className="access-card-header">
              <BookOpen size={22} color="#2563eb" />
              <h3>Inventario de Cursos</h3>
            </div>
            <p>
              Consulta el catálogo de cursos ofertados, materias de estudio y el inventario
              de insumos técnicos asignados a cada especialidad.
            </p>
          </div>
          <Link to="/courses" className="access-card-link">
            <span>Explorar Cursos</span>
            <ArrowRight size={16} />
          </Link>
        </article>

        <article className="access-card">
          <div>
            <div className="access-card-header">
              <FlaskConical size={22} color="#4f46e5" />
              <h3>Reservas de Laboratorio</h3>
            </div>
            <p>
              Solicita espacios y puestos de trabajo en el laboratorio de prácticas o administra
              las solicitudes activas del personal estudiantil.
            </p>
          </div>
          <Link to="/reservations" className="access-card-link">
            <span>Gestionar Reservas</span>
            <ArrowRight size={16} />
          </Link>
        </article>

        <article className="access-card">
          <div>
            <div className="access-card-header">
              <ClipboardList size={22} color="#059669" />
              <h3>Tareas y Prácticas</h3>
            </div>
            <p>
              Supervisa asignaciones de mantenimiento, preparación de mesas y entrega
              de reportes con actualización de estado en vivo.
            </p>
          </div>
          <Link to="/tasks" className="access-card-link">
            <span>Ver Tareas</span>
            <ArrowRight size={16} />
          </Link>
        </article>
      </div>
    </div>
  );
};

export default Dashboard;
