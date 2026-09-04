import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Página Reservations — Módulo interactivo de reservas de laboratorio
 *
 * Comportamiento según rol:
 *   - admin     → Ve TODAS las reservas + botón "Cancelar" (DELETE)
 *   - cualquier → Ve SOLO SUS reservas (filtradas por userId en la URL, no en el frontend)
 *
 * Operaciones:
 *   - GET  /reservations?userId=X  (usuarios normales)
 *   - GET  /reservations            (admins)
 *   - POST /reservations            (crear nueva reserva)
 *   - DELETE /reservations/:id     (cancelar una reserva — admin o dueño)
 *
 * ─── NOTA CLAVE: filtrado por URL vs .filter() en frontend ───────────────────
 * Usamos la query string `?userId=${user.id}` para que JSON Server devuelva
 * únicamente los documentos que le pertenecen al usuario conectado. Esto es
 * PREFERIBLE a traer TODAS las reservas y usar .filter() en el frontend porque:
 *   1. Menos datos en la red (más eficiente y escalable).
 *   2. El servidor es la fuente de verdad; no dependemos del cliente para filtrar.
 *   3. Con una API real, el filtro ocurre a nivel de base de datos (índice).
 * El .filter() en frontend solo tiene sentido cuando ya tienes los datos en memoria
 * y quieres hacer una búsqueda/filtrado visual sin llamadas extra.
 *
 * ─── NOTA: Actualización del estado local tras DELETE o POST ─────────────────
 * En lugar de hacer un segundo GET después de cada mutación, actualizamos el estado
 * local directamente:
 *   - POST exitoso → setReservations(prev => [...prev, nuevaReserva])
 *   - DELETE exitoso → setReservations(prev => prev.filter(r => r.id !== id))
 * Esto evita una vuelta de red innecesaria y hace la UI instantáneamente reactiva.
 */

const API = 'http://localhost:3001';

// ── Estilos ──────────────────────────────────────────────────────────────────
const S = {
  page: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2.5rem 1.5rem',
  },
  header: {
    marginBottom: '2rem',
  },
  h1: {
    fontSize: '1.85rem',
    fontWeight: '800',
    color: '#1e293b',
    margin: '0 0 0.4rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  subtitle: {
    color: '#64748b',
    margin: 0,
    fontSize: '1rem',
  },
  // ── Formulario ──────────────────────────────────────────────────────────
  formCard: {
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '14px',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  formTitle: {
    margin: '0 0 1.25rem',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#15803d',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  formRow: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    flex: '1 1 200px',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#374151',
  },
  select: {
    padding: '0.6rem 0.85rem',
    borderRadius: '8px',
    border: '1px solid #d1fae5',
    fontSize: '0.95rem',
    background: '#fff',
    color: '#1e293b',
    outline: 'none',
    cursor: 'pointer',
  },
  btnSubmit: {
    padding: '0.6rem 1.4rem',
    background: 'linear-gradient(135deg, #16a34a, #15803d)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    boxShadow: '0 3px 8px rgba(22,163,74,0.3)',
    transition: 'opacity 0.2s',
  },
  // ── Alertas ─────────────────────────────────────────────────────────────
  alertError: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  alertInfo: {
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    color: '#1d4ed8',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  // ── Lista ────────────────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  th: {
    background: '#1e293b',
    color: '#f8fafc',
    padding: '0.75rem 1rem',
    textAlign: 'left',
    fontSize: '0.85rem',
    fontWeight: '600',
    letterSpacing: '0.03em',
  },
  td: {
    padding: '0.85rem 1rem',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '0.9rem',
    color: '#334155',
  },
  trEven: {
    background: '#f8fafc',
  },
  badgeConfirmada: {
    display: 'inline-block',
    padding: '0.2rem 0.65rem',
    borderRadius: '999px',
    background: '#dcfce7',
    color: '#15803d',
    fontWeight: '600',
    fontSize: '0.78rem',
  },
  badgeCancelada: {
    display: 'inline-block',
    padding: '0.2rem 0.65rem',
    borderRadius: '999px',
    background: '#fee2e2',
    color: '#dc2626',
    fontWeight: '600',
    fontSize: '0.78rem',
  },
  btnDelete: {
    padding: '0.35rem 0.85rem',
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '600',
    transition: 'opacity 0.2s',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem 1rem',
    color: '#94a3b8',
    background: '#f8fafc',
    borderRadius: '12px',
    border: '1px dashed #cbd5e1',
  },
  spinner: {
    textAlign: 'center',
    padding: '3rem',
    color: '#64748b',
  },
};

// ─────────────────────────────────────────────────────────────────────────────

const Reservations = () => {
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  // ── Estado: lista de reservas ────────────────────────────────────────────
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // ── Estado: cursos disponibles para el formulario ────────────────────────
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');

  // ── Estado: formulario de nueva reserva ─────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // ── Estado: cancelación en curso ─────────────────────────────────────────
  const [deletingId, setDeletingId] = useState(null);

  // ── 1. Cargar reservas al montar (y cuando cambia el usuario) ────────────
  useEffect(() => {
    const fetchReservations = async () => {
      setLoadingReservations(true);
      setFetchError(null);

      try {
        /**
         * FILTRADO POR URL (no por .filter() en frontend):
         * Admin → GET /reservations          (todas)
         * User  → GET /reservations?userId=X (solo las suyas)
         *
         * Ventaja: el servidor filtra a nivel de datos, menos carga de red y cliente.
         */
        const url = isAdmin
          ? `${API}/reservations`
          : `${API}/reservations?userId=${user.id}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error del servidor (${res.status})`);
        const data = await res.json();
        setReservations(Array.isArray(data) ? data : []);
      } catch (err) {
        setFetchError(
          err instanceof TypeError && err.message.toLowerCase().includes('fetch')
            ? 'No se pudo conectar con JSON Server. ¿Está activo en http://localhost:3001?'
            : err.message
        );
      } finally {
        setLoadingReservations(false);
      }
    };

    fetchReservations();
  }, [user, isAdmin]);

  // ── 2. Cargar cursos para el <select> del formulario ─────────────────────
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API}/courses`);
        if (!res.ok) return;
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : []);
        // Seleccionar el primero por defecto si hay cursos
        if (data.length > 0) setSelectedCourseId(data[0].id);
      } catch {
        // Si no cargan los cursos, el formulario quedará vacío (se maneja en la UI)
      }
    };

    fetchCourses();
  }, []);

  // ── 3. Crear nueva reserva (POST) ────────────────────────────────────────
  const handleCreateReservation = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const selectedCourse = courses.find((c) => c.id === selectedCourseId);
    if (!selectedCourse) {
      setFormError('Selecciona un curso válido antes de continuar.');
      return;
    }

    setIsSubmitting(true);

    try {
      const nuevaReserva = {
        courseId: selectedCourse.id,
        courseTitle: selectedCourse.title,
        userId: user.id,
        userName: user.name,
        status: 'Confirmada',
        createdAt: new Date().toISOString(),
      };

      const res = await fetch(`${API}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaReserva),
      });

      if (!res.ok) throw new Error('No se pudo guardar la reserva.');

      const creada = await res.json();

      /**
       * Actualización del estado local sin recargar la página:
       * Agregamos la reserva devuelta por el servidor (que incluye el `id` generado)
       * al estado local con el spread operator.
       */
      setReservations((prev) => [...prev, creada]);
      setFormSuccess(`✅ Reserva para "${selectedCourse.title}" creada correctamente.`);
    } catch (err) {
      setFormError(err.message || 'Error al crear la reserva.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── 4. Cancelar/Eliminar reserva (DELETE) — admin o usuario dueño ────────
  const handleDeleteReservation = async (reservationId, courseTitle) => {
    const confirmed = window.confirm(
      `¿Deseas cancelar la reserva de "${courseTitle}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    setDeletingId(reservationId);

    try {
      const res = await fetch(`${API}/reservations/${reservationId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('No se pudo eliminar la reserva del servidor.');

      /**
       * Actualización del estado local tras DELETE exitoso:
       * Filtramos la reserva eliminada del array sin hacer un segundo GET.
       */
      setReservations((prev) => prev.filter((r) => r.id !== reservationId));
    } catch (err) {
      alert(`Error al cancelar: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={S.page}>
      {/* Encabezado */}
      <header style={S.header}>
        <h1 style={S.h1}>
          📅 Reservas de Laboratorio
        </h1>
        <p style={S.subtitle}>
          {isAdmin
            ? 'Panel de administrador — Todas las reservas del sistema.'
            : `Mis reservas — Conectado como ${user?.name}`}
        </p>
      </header>

      {/* ── Formulario: crear nueva reserva ─────────────────────────────── */}
      <section style={S.formCard}>
        <h2 style={S.formTitle}>
          ➕ Nueva Reserva
        </h2>

        {/* Mensajes del formulario */}
        {formError && <div style={S.alertError} role="alert">{formError}</div>}
        {formSuccess && <div style={S.alertInfo} role="status">{formSuccess}</div>}

        <form onSubmit={handleCreateReservation}>
          <div style={S.formRow}>
            {/* Selector de curso */}
            <div style={S.formGroup}>
              <label htmlFor="curso-select" style={S.label}>
                Curso disponible
              </label>
              {courses.length === 0 ? (
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>
                  Cargando cursos...
                </p>
              ) : (
                <select
                  id="curso-select"
                  style={S.select}
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  disabled={isSubmitting}
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} {c.materialsAvailable === 0 ? '(Sin material)' : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              style={S.btnSubmit}
              disabled={isSubmitting || courses.length === 0}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? 'Reservando...' : '✔ Confirmar Reserva'}
            </button>
          </div>
        </form>
      </section>

      {/* ── Lista de reservas ────────────────────────────────────────────── */}
      <section>
        <h2 style={S.sectionTitle}>
          📋 {isAdmin ? 'Todas las Reservas' : 'Mis Reservas'}
        </h2>

        {/* Error al cargar */}
        {fetchError && <div style={S.alertError} role="alert">{fetchError}</div>}

        {/* Spinner de carga */}
        {loadingReservations ? (
          <div style={S.spinner} aria-live="polite">
            <p>⏳ Cargando reservas...</p>
          </div>
        ) : reservations.length === 0 ? (
          /* Estado vacío */
          <div style={S.emptyState}>
            <p style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>📭</p>
            <p style={{ margin: 0 }}>
              {isAdmin
                ? 'No hay reservas registradas en el sistema.'
                : 'Aún no tienes reservas. ¡Crea una desde el formulario de arriba!'}
            </p>
          </div>
        ) : (
          /* Tabla de reservas */
          <table style={S.table} aria-label="Lista de reservas">
            <thead>
              <tr>
                {/* Admin ve la columna de usuario */}
                {isAdmin && <th style={S.th}>Usuario</th>}
                <th style={S.th}>Curso</th>
                <th style={S.th}>Estado</th>
                <th style={S.th}>Fecha</th>
                <th style={S.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reserva, index) => (
                <tr
                  key={reserva.id}
                  style={index % 2 !== 0 ? S.trEven : {}}
                >
                  {isAdmin && (
                    <td style={S.td}>{reserva.userName || '—'}</td>
                  )}
                  <td style={S.td}>{reserva.courseTitle}</td>
                  <td style={S.td}>
                    <span
                      style={
                        reserva.status === 'Confirmada'
                          ? S.badgeConfirmada
                          : S.badgeCancelada
                      }
                    >
                      {reserva.status}
                    </span>
                  </td>
                  <td style={S.td}>
                    {reserva.createdAt
                      ? new Date(reserva.createdAt).toLocaleDateString('es-CR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : '—'}
                  </td>
                  <td style={S.td}>
                    {/*
                      Admins pueden cancelar cualquier reserva.
                      Usuarios normales solo pueden cancelar las suyas
                      (ya filtradas por userId en el GET, así que todas son suyas).
                    */}
                    <button
                      style={{
                        ...S.btnDelete,
                        opacity: deletingId === reserva.id ? 0.6 : 1,
                      }}
                      onClick={() =>
                        handleDeleteReservation(reserva.id, reserva.courseTitle)
                      }
                      disabled={deletingId === reserva.id}
                      aria-label={`Cancelar reserva de ${reserva.courseTitle}`}
                    >
                      {deletingId === reserva.id ? '...' : isAdmin ? '🗑 Eliminar' : '✖ Cancelar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default Reservations;
