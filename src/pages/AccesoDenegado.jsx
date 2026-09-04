import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

/**
 * Página AccesoDenegado (Error 403)
 *
 * Se muestra cuando un usuario autenticado intenta acceder a una ruta
 * para la que no tiene el rol requerido (ej. un estudiante intenta entrar al /admin-panel).
 *
 * Diseño:
 *   - Icono de advertencia con ShieldAlert
 *   - Código de error 403 prominente
 *   - Mensaje explicativo claro y sin tecnicismos
 *   - Botón para volver al inicio (/)
 */
const AccesoDenegado = () => {
  // useNavigate permite navegar programáticamente sin recargar la página
  const navigate = useNavigate();

  // Estilos definidos como objetos (evitamos un archivo CSS extra para mantener el componente autocontenido)
  const styles = {
    page: {
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
      background: 'transparent',
    },
    card: {
      background: 'var(--bg-card)',
      borderRadius: '20px',
      padding: '3rem 2.5rem',
      maxWidth: '480px',
      width: '100%',
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--border-color)',
    },
    iconWrapper: {
      fontSize: '5rem',
      lineHeight: 1,
      marginBottom: '1rem',
      animation: 'none',
    },
    errorCode: {
      fontSize: '5rem',
      fontWeight: '800',
      color: '#ef4444',
      lineHeight: 1,
      margin: '0 0 0.25rem',
      letterSpacing: '-2px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    errorLabel: {
      fontSize: '0.85rem',
      fontWeight: '600',
      color: '#f87171',
      letterSpacing: '3px',
      textTransform: 'uppercase',
      margin: '0 0 1.5rem',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: 'var(--text-primary)',
      margin: '0 0 0.75rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    description: {
      fontSize: '1rem',
      color: 'var(--text-secondary)',
      lineHeight: '1.6',
      margin: '0 0 2rem',
    },
    highlight: {
      color: '#ef4444',
      fontWeight: '600',
    },
    divider: {
      width: '48px',
      height: '3px',
      background: 'linear-gradient(90deg, #ef4444, #f87171)',
      borderRadius: '2px',
      margin: '0 auto 1.5rem',
      border: 'none',
    },
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 2rem',
      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease',
      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.35)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    note: {
      marginTop: '1.5rem',
      fontSize: '0.8rem',
      color: '#94a3b8',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Ícono visual de advertencia */}
        <div style={styles.iconWrapper} aria-hidden="true">
          <ShieldAlert size={72} color="#ef4444" />
        </div>

        {/* Código de error */}
        <p style={styles.errorCode}>403</p>
        <p style={styles.errorLabel}>Acceso Denegado</p>

        {/* Separador decorativo */}
        <hr style={styles.divider} />

        {/* Título y descripción */}
        <h1 style={styles.title}>Sin privilegios de administrador</h1>
        <p style={styles.description}>
          Tu cuenta <span style={styles.highlight}>no tiene permisos</span> para acceder
          a esta sección. Este contenido está reservado exclusivamente para administradores
          del sistema.
        </p>

        {/*
          Botón de navegación: usamos navigate('/') en lugar de un <Link>
          para poder aplicar estilos de botón sin conflictos de CSS de ancla.
          navigate(-1) sería una alternativa para volver a la página anterior.
        */}
        <button
          style={styles.button}
          onClick={() => navigate('/')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.35)';
          }}
          aria-label="Volver al inicio de la aplicación"
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Home size={18} />
            <span>Volver al Inicio</span>
          </span>
        </button>

        {/* Nota informativa */}
        <p style={styles.note}>
          Si crees que esto es un error, contacta al administrador del sistema.
        </p>
      </div>
    </div>
  );
};

export default AccesoDenegado;
