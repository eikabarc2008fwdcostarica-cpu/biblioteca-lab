import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

/**
 * Componente funcional Login
 * Formulario con validación, feedback con iconos profesionales
 * y autenticación simulada contra JSON Server.
 */
const Login = () => {
  // 1. Estados controlados para los inputs del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 2. Estados para el feedback visual (error y carga)
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // 3. Hooks de contexto y navegación
  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * Manejador del envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validación básica: verificar que los campos no estén vacíos
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);

    try {
      // Invocamos login() provisto por AuthContext
      await login(email.trim(), password);

      // Redirección a la ruta principal en caso de éxito
      navigate('/');
    } catch (error) {
      // Despliega el error lanzado por AuthContext
      setErrorMsg(error.message || 'Ocurrió un error inesperado al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>
        <p className="login-subtitle">Ingresa tus credenciales para acceder a la biblioteca</p>

        {/* Mensaje de error con icono profesional AlertCircle */}
        {errorMsg && (
          <div className="login-error-alert" role="alert">
            <AlertCircle size={18} className="alert-icon" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {/* Campo Email */}
          <div className="form-group">
            <label htmlFor="email">
              <span className="label-with-icon">
                <Mail size={15} />
                <span>Correo Electrónico</span>
              </span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
              required
            />
          </div>

          {/* Campo Password */}
          <div className="form-group">
            <label htmlFor="password">
              <span className="label-with-icon">
                <Lock size={15} />
                <span>Contraseña</span>
              </span>
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
              required
            />
          </div>

          {/* Botón de envío deshabilitado durante la petición */}
          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner-wrapper">
                <span className="spinner"></span>
                <span>Iniciando sesión...</span>
              </span>
            ) : (
              <span className="btn-content-wrapper">
                <LogIn size={18} />
                <span>Entrar</span>
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
