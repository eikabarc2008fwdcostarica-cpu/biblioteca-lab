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
  Layers,
  Users,
  RefreshCw,
  TrendingUp,
  Activity,
  Check,
  Shield,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

/**
 * Componente de página Dashboard (Panel de Control y Estadísticas Avanzadas)
 * Carga métricas en paralelo con Promise.all desde /courses, /reservations, /tasks y /users.
 * Muestra KPIs interactivos, distribución de cursos por categoría, estado operativo y actividad reciente.
 */
const Dashboard = () => {
  const { user } = useAuth();

  const [metrics, setMetrics] = useState({
    totalCourses: 0,
    coursesWithStock: 0,
    coursesOutOfStock: 0,
    totalMaterials: 0,
    avgMaterials: '0.0',
    totalReservations: 0,
    reservationsConfirmed: 0,
    reservationsCancelled: 0,
    reservationRate: 0,
    totalTasks: 0,
    tasksPending: 0,
    tasksCompleted: 0,
    taskCompletionRate: 0,
    totalUsers: 0,
    adminsCount: 0,
    studentsCount: 0,
    systemEfficiency: 0,
    categories: [],
    recentReservations: [],
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchMetrics = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      // Carga paralela de todas las fuentes de datos del sistema
      const [resCourses, resReservations, resTasks, resUsers] = await Promise.all([
        fetch('http://localhost:3001/courses'),
        fetch('http://localhost:3001/reservations'),
        fetch('http://localhost:3001/tasks'),
        fetch('http://localhost:3001/users'),
      ]);

      if (!resCourses.ok || !resReservations.ok || !resTasks.ok) {
        throw new Error('No se pudo obtener la información completa de las métricas.');
      }

      const [coursesData, reservationsData, tasksData, usersData] = await Promise.all([
        resCourses.json(),
        resReservations.json(),
        resTasks.json(),
        resUsers.ok ? resUsers.json() : Promise.resolve([]),
      ]);

      const coursesList = Array.isArray(coursesData) ? coursesData : [];
      const reservationsList = Array.isArray(reservationsData) ? reservationsData : [];
      const tasksList = Array.isArray(tasksData) ? tasksData : [];
      const usersList = Array.isArray(usersData) ? usersData : [];

      // Cálculos estadísticos detallados
      const totalCourses = coursesList.length;
      const coursesOutOfStock = coursesList.filter(
        (c) => Number(c.materialsAvailable) === 0
      ).length;
      const coursesWithStock = totalCourses - coursesOutOfStock;
      const totalMaterials = coursesList.reduce(
        (acc, c) => acc + (Number(c.materialsAvailable) || 0),
        0
      );
      const avgMaterials =
        totalCourses > 0 ? (totalMaterials / totalCourses).toFixed(1) : '0.0';

      // Conteo por categorías
      const categoryCounts = {};
      coursesList.forEach((c) => {
        const cat = c.category || 'General';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });
      const categories = Object.entries(categoryCounts).map(([name, count]) => ({
        name,
        count,
        percentage: totalCourses > 0 ? Math.round((count / totalCourses) * 100) : 0,
      }));

      // Reservas
      const totalReservations = reservationsList.length;
      const reservationsConfirmed = reservationsList.filter(
        (r) => (r.status || '').toLowerCase() === 'confirmada'
      ).length;
      const reservationsCancelled = totalReservations - reservationsConfirmed;
      const reservationRate =
        totalReservations > 0
          ? Math.round((reservationsConfirmed / totalReservations) * 100)
          : 100;

      // Tareas
      const totalTasks = tasksList.length;
      const tasksCompleted = tasksList.filter((t) => !!t.completed).length;
      const tasksPending = totalTasks - tasksCompleted;
      const taskCompletionRate =
        totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;

      // Usuarios
      const totalUsers = usersList.length;
      const adminsCount = usersList.filter(
        (u) => (u.role || '').toLowerCase() === 'admin'
      ).length;
      const studentsCount = totalUsers - adminsCount;

      // Eficiencia general ponderada
      const availabilityRate =
        totalCourses > 0 ? (coursesWithStock / totalCourses) * 100 : 100;
      const systemEfficiency = Math.round(
        (availabilityRate * 0.35 + taskCompletionRate * 0.45 + reservationRate * 0.2)
      );

      // Últimas reservas ordenadas
      const recentReservations = [...reservationsList].reverse().slice(0, 4);

      setMetrics({
        totalCourses,
        coursesWithStock,
        coursesOutOfStock,
        totalMaterials,
        avgMaterials,
        totalReservations,
        reservationsConfirmed,
        reservationsCancelled,
        reservationRate,
        totalTasks,
        tasksPending,
        tasksCompleted,
        taskCompletionRate,
        totalUsers,
        adminsCount,
        studentsCount,
        systemEfficiency,
        categories,
        recentReservations,
      });
    } catch (err) {
      setError(
        err instanceof TypeError && err.message.toLowerCase().includes('fetch')
          ? 'No se pudo conectar con JSON Server. Asegúrate de que esté corriendo en http://localhost:3001'
          : err.message || 'Error al cargar las métricas del sistema.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="dashboard-container">
      {/* ── Banner Institucional Superior ─────────────────────────────────── */}
      <section className="dashboard-hero">
        <div className="dashboard-hero-content">
          <h1>Panel de Control y Estadísticas</h1>
          <p className="dashboard-hero-desc">
            Monitor centralizado del ecosistema bibliotecario: disponibilidad de materiales,
            reserva de puestos de laboratorio y progreso de tareas operativas en tiempo real.
          </p>

          <div className="dashboard-hero-meta">
            <div className="dashboard-user-badge">
              <UserCheck size={16} />
              <span>
                Conectado como <strong>{user?.name}</strong> ([{user?.role || 'user'}])
              </span>
            </div>

            <button
              type="button"
              className="refresh-metrics-btn"
              onClick={() => fetchMetrics(true)}
              disabled={refreshing || loading}
              title="Actualizar estadísticas en vivo"
            >
              <RefreshCw
                size={14}
                className={refreshing ? 'spin-icon' : ''}
              />
              <span>{refreshing ? 'Actualizando...' : 'Actualizar'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Alerta si ocurre un error */}
      {error && (
        <div className="dashboard-alert" role="alert">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* ── Indicadores Clave de Rendimiento (KPIs) ────────────────────────── */}
      <div className="dashboard-section-header">
        <h2 className="dashboard-section-title">
          <BarChart3 size={20} color="#2563eb" />
          <span>Métricas Operativas Principales</span>
        </h2>
        <span className="live-pill">
          <span className="live-dot"></span> En vivo
        </span>
      </div>

      {loading ? (
        <div className="dashboard-loading">
          <div className="dashboard-spinner"></div>
          <p>Calculando estadísticas en tiempo real...</p>
        </div>
      ) : (
        <>
          <div className="metrics-grid">
            {/* KPI 1: Cursos */}
            <article className="metric-card">
              <div className="metric-icon-box blue">
                <BookOpen size={24} />
              </div>
              <div className="metric-data">
                <p className="metric-label">Cursos Académicos</p>
                <p className="metric-value">{metrics.totalCourses}</p>
                <div className="metric-progress-wrap">
                  <div
                    className="metric-progress-bar blue"
                    style={{
                      width: `${
                        metrics.totalCourses > 0
                          ? Math.round(
                              (metrics.coursesWithStock / metrics.totalCourses) * 100
                            )
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <p className="metric-subtext">
                  <span className="highlight-success">
                    {metrics.coursesWithStock} con material
                  </span>
                  {metrics.coursesOutOfStock > 0 && (
                    <>
                      <span>•</span>
                      <span className="highlight-warning">
                        {metrics.coursesOutOfStock} agotados
                      </span>
                    </>
                  )}
                </p>
              </div>
            </article>

            {/* KPI 2: Insumos de Laboratorio */}
            <article className="metric-card">
              <div className="metric-icon-box purple">
                <Layers size={24} />
              </div>
              <div className="metric-data">
                <p className="metric-label">Insumos en Inventario</p>
                <p className="metric-value">{metrics.totalMaterials}</p>
                <div className="metric-progress-wrap">
                  <div
                    className="metric-progress-bar purple"
                    style={{
                      width: `${Math.min(100, metrics.totalMaterials * 10)}%`,
                    }}
                  ></div>
                </div>
                <p className="metric-subtext">
                  <span>Promedio: <strong>{metrics.avgMaterials}</strong> por curso</span>
                </p>
              </div>
            </article>

            {/* KPI 3: Reservas */}
            <article className="metric-card">
              <div className="metric-icon-box indigo">
                <FlaskConical size={24} />
              </div>
              <div className="metric-data">
                <p className="metric-label">Reservas de Laboratorio</p>
                <p className="metric-value">{metrics.totalReservations}</p>
                <div className="metric-progress-wrap">
                  <div
                    className="metric-progress-bar indigo"
                    style={{ width: `${metrics.reservationRate}%` }}
                  ></div>
                </div>
                <p className="metric-subtext">
                  <span className="highlight-success">
                    {metrics.reservationsConfirmed} confirmadas ({metrics.reservationRate}%)
                  </span>
                </p>
              </div>
            </article>

            {/* KPI 4: Tareas Operativas */}
            <article className="metric-card">
              <div className="metric-icon-box emerald">
                <ClipboardList size={24} />
              </div>
              <div className="metric-data">
                <p className="metric-label">Cumplimiento de Tareas</p>
                <p className="metric-value">{metrics.taskCompletionRate}%</p>
                <div className="metric-progress-wrap">
                  <div
                    className="metric-progress-bar emerald"
                    style={{ width: `${metrics.taskCompletionRate}%` }}
                  ></div>
                </div>
                <p className="metric-subtext">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <CheckCircle2 size={12} color="#10b981" /> {metrics.tasksCompleted} completas
                  </span>
                  <span>•</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={12} color="#f59e0b" /> {metrics.tasksPending} pendientes
                  </span>
                </p>
              </div>
            </article>
          </div>

          {/* ── Desglose Estadístico Visual (2 Columnas) ────────────────────── */}
          <div className="dashboard-stats-row">
            {/* Columna A: Especialidades / Categorías */}
            <section className="stats-card">
              <div className="stats-card-header">
                <div className="stats-header-title">
                  <TrendingUp size={20} color="#2563eb" />
                  <h3>Distribución de Cursos por Especialidad</h3>
                </div>
                <span className="stats-badge">
                  {metrics.categories.length} categorías
                </span>
              </div>

              <div className="category-bars-list">
                {metrics.categories.length === 0 ? (
                  <p className="empty-stats-msg">No hay cursos catalogados actualmente.</p>
                ) : (
                  metrics.categories.map((cat, idx) => (
                    <div key={idx} className="category-bar-item">
                      <div className="category-bar-info">
                        <span className="category-name">{cat.name}</span>
                        <span className="category-count">
                          <strong>{cat.count}</strong> cursos ({cat.percentage}%)
                        </span>
                      </div>
                      <div className="category-bar-track">
                        <div
                          className={`category-bar-fill fill-${idx % 4}`}
                          style={{ width: `${cat.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Columna B: Rendimiento del Sistema y Comunidad */}
            <section className="stats-card">
              <div className="stats-card-header">
                <div className="stats-header-title">
                  <Activity size={20} color="#10b981" />
                  <h3>Eficiencia Global y Comunidad</h3>
                </div>
                <span className="stats-badge efficiency">
                  {metrics.systemEfficiency}% óptimo
                </span>
              </div>

              <div className="efficiency-breakdown">
                {/* Medidor radial / barra de eficiencia */}
                <div className="efficiency-metric-row">
                  <div className="efficiency-score-box">
                    <span className="efficiency-number">{metrics.systemEfficiency}%</span>
                    <span className="efficiency-label">Índice Operativo</span>
                  </div>
                  <div className="efficiency-details">
                    <p className="efficiency-desc">
                      Puntaje compuesto calculado a partir de la tasa de insumos activos,
                      confirmación de reservas y finalización de tareas de mantenimiento.
                    </p>
                  </div>
                </div>

                {/* Desglose de Usuarios Activos */}
                <div className="community-stats-box">
                  <div className="community-item">
                    <div className="community-icon-box admin">
                      <Shield size={16} />
                    </div>
                    <div>
                      <span className="community-count">{metrics.adminsCount}</span>
                      <span className="community-label">Administradores</span>
                    </div>
                  </div>

                  <div className="community-item">
                    <div className="community-icon-box student">
                      <GraduationCap size={16} />
                    </div>
                    <div>
                      <span className="community-count">{metrics.studentsCount}</span>
                      <span className="community-label">Estudiantes / Usuarios</span>
                    </div>
                  </div>

                  <div className="community-item">
                    <div className="community-icon-box total">
                      <Users size={16} />
                    </div>
                    <div>
                      <span className="community-count">{metrics.totalUsers}</span>
                      <span className="community-label">Total Miembros</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ── Actividad Reciente del Laboratorio ──────────────────────────── */}
          <section className="stats-card recent-activity-section">
            <div className="stats-card-header">
              <div className="stats-header-title">
                <Clock size={20} color="#6366f1" />
                <h3>Últimas Reservas Registradas</h3>
              </div>
              <Link to="/reservations" className="stats-view-all-link">
                Ver todas las reservas <ArrowRight size={14} />
              </Link>
            </div>

            {metrics.recentReservations.length === 0 ? (
              <p className="empty-stats-msg">No hay reservas recientes registradas.</p>
            ) : (
              <div className="recent-table-wrap">
                <table className="recent-activity-table">
                  <thead>
                    <tr>
                      <th>Curso Reservado</th>
                      <th>Usuario Solicitante</th>
                      <th>Fecha de Solicitud</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.recentReservations.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <strong>{r.courseTitle}</strong>
                        </td>
                        <td>{r.userName || 'Usuario del Laboratorio'}</td>
                        <td>
                          {r.createdAt
                            ? new Date(r.createdAt).toLocaleDateString('es-CR', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'Reciente'}
                        </td>
                        <td>
                          <span
                            className={`recent-status-pill ${
                              (r.status || '').toLowerCase() === 'confirmada'
                                ? 'confirmed'
                                : 'cancelled'
                            }`}
                          >
                            <Check size={12} />
                            <span>{r.status || 'Confirmada'}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}

      {/* ── Accesos Rápidos a los Módulos ─────────────────────────────────── */}
      <h2 className="dashboard-section-title" style={{ marginTop: '2.5rem' }}>
        <span>Módulos de Gestión</span>
      </h2>

      <div className="quick-access-grid">
        <article className="access-card">
          <div>
            <div className="access-card-header">
              <div className="access-icon-wrapper blue">
                <BookOpen size={20} />
              </div>
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
              <div className="access-icon-wrapper indigo">
                <FlaskConical size={20} />
              </div>
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
              <div className="access-icon-wrapper emerald">
                <ClipboardList size={20} />
              </div>
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
