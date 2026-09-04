import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, LogIn, Menu, X, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

/**
 * Componente funcional Navbar
 * Barra de navegación profesional con iconos modernos de Lucide
 * y renderizado condicional según la sesión activa.
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Cierre de sesión y redirección a /login
  const handleLogout = () => {
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
    if (normalizedRole === 'estudiante') return 'role-estudiante';
    return 'role-default';
  };

  return (
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
          {/* Rutas requeridas */}
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

          {/* Renderizado condicional basado en 'user' */}
          <div className="navbar-auth">
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
                    handleLogout();
                  }}
                  className="logout-btn"
                >
                  <LogOut size={16} />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            ) : (
              // 2. Vista cuando NO hay sesión activa
              <Link
                to="/login"
                onClick={handleCloseMenu}
                className="login-nav-btn"
              >
                <LogIn size={16} />
                <span>Iniciar sesión</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
