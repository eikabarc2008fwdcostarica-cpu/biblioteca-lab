import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import './Register.css';

/**
 * Componente de página Register
 * Permite el registro de nuevos usuarios en la plataforma.
 * Valida unicidad de correo en JSON Server y asigna el rol predeterminado "user".
 */
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validación 1: Campos obligatorios no vacíos
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMsg('Por favor, completa todos los campos del formulario.');
      return;
    }

    // Validación 2: Coincidencia de contraseñas
    if (password !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden. Por favor, verifícalas.');
      return;
    }

    // Validación 3: Longitud mínima de contraseña
    if (password.length < 3) {
      setErrorMsg('La contraseña debe contener al menos 3 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      // Validación 4: Consultar si el correo ya está registrado en JSON Server
      const checkResponse = await fetch(
        `http://localhost:3001/users?email=${encodeURIComponent(normalizedEmail)}`
      );

      if (!checkResponse.ok) {
        throw new Error('Error al verificar la disponibilidad del correo.');
      }

      const existingUsers = await checkResponse.json();

      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        setErrorMsg('El correo electrónico ya se encuentra registrado. Intenta iniciar sesión.');
        setLoading(false);
        return;
      }

      // Registro: Crear usuario con rol predeterminado "user"
      const newUser = {
        name: name.trim(),
        email: normalizedEmail,
        password: password,
        role: 'user',
      };

      const createResponse = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!createResponse.ok) {
        throw new Error('No se pudo completar el registro en el servidor.');
      }

      setSuccessMsg('Registro exitoso. Redirigiendo al inicio de sesión...');

      // Limpiar formulario y redirigir después de breve pausa para leer feedback
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/login');
      }, 1600);
    } catch (err) {
      if (err instanceof TypeError && err.message.toLowerCase().includes('fetch')) {
        setErrorMsg('No se pudo conectar con el servidor. Verifica que JSON Server esté activo en http://localhost:3001');
      } else {
        setErrorMsg(err.message || 'Ocurrió un error inesperado al registrar el usuario.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Crear Cuenta</h2>
        <p className="register-subtitle">Únete al Sistema de Biblioteca y Laboratorio Académico</p>

        {/* Mensaje de Error */}
        {errorMsg && (
          <div className="register-alert error" role="alert">
            <AlertCircle size={18} className="register-alert-icon" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Mensaje de Éxito */}
        {successMsg && (
          <div className="register-alert success" role="alert">
            <CheckCircle2 size={18} className="register-alert-icon" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form" noValidate>
          {/* Nombre completo */}
          <div className="form-group">
            <label htmlFor="reg-name">
              <span className="label-with-icon">
                <User size={15} />
                <span>Nombre Completo</span>
              </span>
            </label>
            <input
              id="reg-name"
              type="text"
              placeholder="Ej. María Rodríguez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading || !!successMsg}
              required
            />
          </div>

          {/* Correo Electrónico */}
          <div className="form-group">
            <label htmlFor="reg-email">
              <span className="label-with-icon">
                <Mail size={15} />
                <span>Correo Electrónico</span>
              </span>
            </label>
            <input
              id="reg-email"
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || !!successMsg}
              autoComplete="email"
              required
            />
          </div>

          {/* Contraseña */}
          <div className="form-group">
            <label htmlFor="reg-password">
              <span className="label-with-icon">
                <Lock size={15} />
                <span>Contraseña</span>
              </span>
            </label>
            <input
              id="reg-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || !!successMsg}
              autoComplete="new-password"
              required
            />
          </div>

          {/* Confirmar Contraseña */}
          <div className="form-group">
            <label htmlFor="reg-confirm-password">
              <span className="label-with-icon">
                <Lock size={15} />
                <span>Confirmar Contraseña</span>
              </span>
            </label>
            <input
              id="reg-confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading || !!successMsg}
              autoComplete="new-password"
              required
            />
          </div>

          {/* Botón de Enviar */}
          <button
            type="submit"
            className="register-submit-btn"
            disabled={loading || !!successMsg}
          >
            {loading ? (
              <span className="btn-content-wrapper">
                <span className="spinner"></span>
                <span>Registrando...</span>
              </span>
            ) : (
              <span className="btn-content-wrapper">
                <UserPlus size={18} />
                <span>Registrarse</span>
              </span>
            )}
          </button>
        </form>

        <div className="register-footer">
          <span>¿Ya tienes una cuenta?</span>
          <Link to="/login" className="register-link">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
