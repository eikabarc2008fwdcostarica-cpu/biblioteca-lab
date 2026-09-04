import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  LogOut,
  LogIn,
  Menu,
  X,
  Shield,
  User,
  UserPlus,
  AlertTriangle,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

/**
 * Componente funcional Navbar
 * Barra de navegación profesional con iconos modernos de Lucide,
 * renderizado condicional por rol, selector de modo oscuro/claro
 * y diálogo de confirmación previa para cerrar sesión.
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Cierre de sesión definitivo tras la segunda verificación
  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate('/login');
  };

  // Cierra el menú desplegable al hacer clic en un enlace en móviles
  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  // Asigna clase CSS temática según el rol del usuario
  const getBadgeRoleClass = (role) => {
    const normalizedRole = role?.toLowerCase();
    if (normalizedRole === 'admin') return 'role-admin';
    if (normalizedRole === 'estudiante' || normalizedRole === 'user') return 'role-estudiante';
    return 'role-default';
  };

  return (
    <>
      <header className="navbar-header">
        <nav className="navbar" aria-label="Navegación principal">
          {/* Marca / Logo con icono profesional */}
          <div className="navbar-brand">
            <Link to="/" onClick={handleCloseMenu} className="brand-logo">
              <BookOpen size={24} className="brand-icon" />
              <span>Biblioteca Lab</span>
            </Link>
          </div>

          {/* Botón hamburguesa para dispositivos móviles */}
          <button
            type="button"
            className="navbar-toggle"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Menú principal de enlaces y sesión */}
          <div className={`navbar-menu ${isMenuOpen ? 'is-open' : ''}`}>
            {/* Rutas principales del sistema */}
            <ul className="navbar-links">
              <li>
                <Link to="/" onClick={handleCloseMenu}>
                  Inicio/Dashboard
                </Link>
              </li>
              <li>
                <Link to="/courses" onClick={handleCloseMenu}>
                  Inventario de Cursos
                </Link>
              </li>
              <li>
                <Link to="/reservations" onClick={handleCloseMenu}>
                  Reservas
                </Link>
              </li>
              <li>
                <Link to="/tasks" onClick={handleCloseMenu}>
                  Tareas
                </Link>
              </li>
            </ul>

            {/* Sección de autenticación y controles de tema */}
            <div className="navbar-auth">
              {/* Botón de alternancia Modo Oscuro / Claro */}
              <button
                type="button"
                className="theme-toggle-btn"
                onClick={toggleTheme}
                aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                title={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
              >
                {isDark ? (
                  <Sun size={18} className="theme-icon sun" />
                ) : (
                  <Moon size={18} className="theme-icon moon" />
                )}
              </button>

              {user ? (
                // 1. Vista cuando el usuario SÍ ha iniciado sesión
                <div className="user-profile">
                  <div className="user-details">
                    <span className="user-name">{user.name}</span>
                    <span className={`role-badge ${getBadgeRoleClass(user.role)}`}>
                      {user.role?.toLowerCase() === 'admin' ? (
                        <Shield size={13} className="badge-icon" />
                      ) : (
                        <User size={13} className="badge-icon" />
                      )}
                      <span>{user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Usuario'}</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleCloseMenu();
                      setShowLogoutConfirm(true);
                    }}
                    className="logout-btn"
                    title="Cerrar sesión"
                  >
                    <LogOut size={16} />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              ) : (
                // 2. Vista cuando NO hay sesión activa (Iniciar sesión y Registro)
                <div className="guest-nav-actions">
                  <Link
                    to="/login"
                    onClick={handleCloseMenu}
                    className="nav-secondary-btn"
                  >
                    <LogIn size={15} />
                    <span>Iniciar sesión</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={handleCloseMenu}
                    className="login-nav-btn"
                  >
                    <UserPlus size={15} />
                    <span>Registrarse</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* ── Modal de Segunda Verificación para Cerrar Sesión ─────────────── */}
      {showLogoutConfirm && (
        <div
          className="logout-modal-backdrop"
          onClick={() => setShowLogoutConfirm(false)}
          role="presentation"
        >
          <div
            className="logout-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-dialog-title"
          >
            <div className="logout-modal-icon">
              <AlertTriangle size={28} color="#dc2626" />
            </div>

            <h3 id="logout-dialog-title" className="logout-modal-title">
              ¿Cerrar Sesión?
            </h3>

            <p className="logout-modal-text">
              ¿Estás seguro de que deseas salir de tu cuenta, <strong>{user?.name}</strong>?
              Tendrás que volver a ingresar tus credenciales para acceder a tus reservas y tareas.
            </p>

            <div className="logout-modal-actions">
              <button
                type="button"
                className="logout-modal-btn cancel"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="logout-modal-btn confirm"
                onClick={handleConfirmLogout}
              >
                <LogOut size={16} />
                <span>Sí, cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
