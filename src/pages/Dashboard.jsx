import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { fetchJSON } from '../lib/api'
import './Dashboard.css'

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState({ courses: [], reservations: [], tasks: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const roleLabel =
    user?.role === 'admin' ? 'Administrador' : 'Usuario'

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)
      setError('')
      try {
        const [courses, reservations, tasks] = await Promise.all([
          fetchJSON('/courses'),
          fetchJSON('/reservations'),
          fetchJSON('/tasks'),
        ])
        setData({ courses, reservations, tasks })
      } catch (err) {
        setError(err.message || 'No se pudieron cargar los datos del dashboard.')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const totalCourses = data.courses.length
  const outOfStock = data.courses.filter((c) => (c.stock ?? 0) <= 0).length
  const totalReservations = data.reservations.length
  const pendingTasks = data.tasks.filter((t) => !t.completed).length

  const metrics = [
    {
      label: 'Cursos en catálogo',
      value: totalCourses,
      sub: `${outOfStock} material(es) agotado(s)`,
      icon: '📚',
      accent: 'var(--color-accent-blue)',
    },
    {
      label: 'Material agotado',
      value: outOfStock,
      sub: 'Cursos sin stock',
      icon: '📉',
      accent: 'var(--color-accent-red)',
    },
    {
      label: 'Reservas registradas',
      value: totalReservations,
      sub: 'En total',
      icon: '📅',
      accent: 'var(--color-accent-purple)',
    },
    {
      label: 'Tareas pendientes',
      value: pendingTasks,
      sub: 'Por completar',
      icon: '✅',
      accent: 'var(--color-accent-yellow)',
    },
  ]

  const links = [
    { label: 'Ver Cursos', to: '/courses', color: 'var(--color-primary)' },
    { label: 'Ver Reservas', to: '/reservations', color: 'var(--color-accent-purple)' },
    { label: 'Ver Tareas', to: '/tasks', color: 'var(--color-accent-green)' },
  ]

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1>
          Bienvenido, {user?.name ?? 'Invitado'}
          <span className="role-badge role-badge--admin">{roleLabel}</span>
        </h1>
        <p className="dashboard__subtitle">
          Panel general de la biblioteca interactiva. Desde aquí puedes
          consultar cursos, reservas y tareas rápidamente.
        </p>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="status-row">
          <span className="spinner" />
          <span>Cargando datos del dashboard...</span>
        </div>
      ) : (
        <>
          <section>
            <h2>Métricas</h2>
            <div className="grid grid-4 dashboard__metrics">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="metric-card"
                  style={{ borderLeft: `4px solid ${m.accent}` }}
                >
                  <div className="metric-card__head">
                    <span className="metric-card__icon">{m.icon}</span>
                    <span className="metric-card__label">{m.label}</span>
                  </div>
                  <span className="metric-card__value">{m.value}</span>
                  <span className="metric-card__sub">{m.sub}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2>Accesos rápidos</h2>
            <div className="grid grid-4 dashboard__links">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="card dashboard__link"
                  style={{ '--link-color': l.color }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2>Resumen de tareas pendientes</h2>
            {pendingTasks === 0 ? (
              <p className="tasks-empty">
                ¡Todas las tareas están completadas!
              </p>
            ) : (
              <ul className="task-list">
                {data.tasks
                  .filter((t) => !t.completed)
                  .slice(0, 5)
                  .map((t) => (
                    <li key={t.id} className="task-list__item">
                      <span className="badge badge-yellow">Pendiente</span>
                      <span>{t.title}</span>
                    </li>
                  ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  )
}
