import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const navLinks = [
  { label: 'Dashboard', to: '/' },
  { label: 'Tareas', to: '/tasks' },
  { label: 'Cursos', to: '/courses' },
  { label: 'Reservas', to: '/reservations' },
]

export default function RootLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container">
          <NavLink to="/" className="brand">
            <span className="dot" />
            <span>Biblioteca Lab</span>
          </NavLink>

          <nav className="nav">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={isActive(to) ? 'active' : undefined}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="user-menu">
            {user && (
              <span
                className="badge"
                style={{
                  background:
                    user.role === 'admin'
                      ? 'rgba(124,59,238,0.12)'
                      : 'rgba(14,165,233,0.12)',
                  color: user.role === 'admin' ? '#4b0082' : '#0c4a6d',
                  borderColor:
                    user.role === 'admin'
                      ? 'rgba(124,59,238,0.4)'
                      : 'rgba(14,165,233,0.4)',
                }}
              >
                {user.role}
              </span>
            )}
            <button type="button" className="logout" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
