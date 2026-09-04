import { Link } from 'react-router-dom';
import { BookOpen, FlaskConical, ClipboardList, UserCheck, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

/**
 * Componente de página Dashboard (Inicio)
 * Presenta un resumen del sistema y accesos rápidos usando iconos profesionales.
 */
const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="dashboard-container">
      <section className="dashboard-hero">
        <h1>Sistema de Laboratorio y Biblioteca</h1>
        <p>
          Gestiona inventario de cursos, disponibilidad de materiales, reservas de mesas y
          seguimiento de tareas de laboratorio de forma centralizada.
        </p>
        <div className="hero-user-badge">
          {isAuthenticated ? (
            <span className="badge-text-with-icon">
              <UserCheck size={16} />
              <span>Sesión activa: <strong>{user?.name}</strong> ([{user?.role}])</span>
            </span>
          ) : (
            <span className="badge-text-with-icon">
              <Lock size={16} />
              <span>
                Modo invitado —{' '}
                <Link to="/login" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
                  Inicia sesión
                </Link>{' '}
                para acceder a todas las funciones
              </span>
            </span>
          )}
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <div>
            <div className="card-icon-wrapper icon-blue">
              <BookOpen size={28} />
            </div>
            <h3>Inventario de Cursos</h3>
            <p>
              Consulta el catálogo de cursos disponibles y comprueba la disponibilidad en tiempo real
              de materiales de laboratorio.
            </p>
          </div>
          <Link to="/courses" className="card-link-btn">
            <span>Ver Cursos</span>
            <ArrowRight size={16} />
          </Link>
        </article>

        <article className="dashboard-card">
          <div>
            <div className="card-icon-wrapper icon-indigo">
              <FlaskConical size={28} />
            </div>
            <h3>Reservas de Laboratorio</h3>
            <p>
              Solicita espacios y equipos para prácticas y sesiones de estudio presenciales.
            </p>
          </div>
          <Link to="/reservations" className="card-link-btn">
            <span>Ir a Reservas</span>
            <ArrowRight size={16} />
          </Link>
        </article>

        <article className="dashboard-card">
          <div>
            <div className="card-icon-wrapper icon-emerald">
              <ClipboardList size={28} />
            </div>
            <h3>Tareas y Prácticas</h3>
            <p>
              Revisa tus entregas pendientes, guías de práctica asignadas y fechas límite.
            </p>
          </div>
          <Link to="/tasks" className="card-link-btn">
            <span>Ver Tareas</span>
            <ArrowRight size={16} />
          </Link>
        </article>
      </section>
    </div>
  );
};

export default Dashboard;
