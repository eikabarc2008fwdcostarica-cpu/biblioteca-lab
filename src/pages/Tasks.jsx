import { useState, useEffect } from 'react';
import {
  ListTodo,
  PlusCircle,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  AlertTriangle,
  FolderKanban,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import './Tasks.css';

/**
 * Componente de página Tasks
 * Módulo de tareas operativas y prácticas de laboratorio.
 * Soporta filtrado personal/general, alternancia en tiempo real con PATCH,
 * y panel de administración para creación y eliminación.
 */
const Tasks = () => {
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  // ── Estados generales de tareas ──────────────────────────────────────────
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'mine'
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  // ── Estados del formulario admin (Crear tarea) ───────────────────────────
  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // ── 1. Cargar tareas al montar ───────────────────────────────────────────
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:3001/tasks');

        if (!response.ok) {
          throw new Error(`Error en el servidor al consultar tareas (${response.status})`);
        }

        const data = await response.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err instanceof TypeError && err.message.toLowerCase().includes('fetch')
            ? 'No se pudo conectar con el servidor. ¿Está activo JSON Server en http://localhost:3001?'
            : err.message || 'Error al obtener la lista de tareas.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // ── 2. Alternar estado 'completed' mediante PATCH ────────────────────────
  const handleToggleStatus = async (taskId, currentCompleted) => {
    setUpdatingTaskId(taskId);

    try {
      const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !currentCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar el estado de la tarea.');
      }

      const updatedTask = await response.json();

      // Actualizamos el estado local sin recargar la página
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === taskId ? { ...t, completed: updatedTask.completed } : t))
      );
    } catch (err) {
      alert(`Error al actualizar la tarea: ${err.message}`);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // ── 3. Solo Admin: Crear nueva tarea (POST) ──────────────────────────────
  const handleCreateTask = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim() || !assignedTo.trim()) {
      setFormError('Por favor, ingresa el título y el responsable de la tarea.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newTaskData = {
        title: title.trim(),
        assignedTo: assignedTo.trim(),
        completed: false,
      };

      const response = await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTaskData),
      });

      if (!response.ok) {
        throw new Error('Error al registrar la tarea en el servidor.');
      }

      const createdTask = await response.json();

      // Actualización reactiva del estado local
      setTasks((prevTasks) => [...prevTasks, createdTask]);

      // Resetear inputs
      setTitle('');
      setAssignedTo('');
    } catch (err) {
      setFormError(err.message || 'Ocurrió un error al intentar crear la tarea.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── 4. Solo Admin: Eliminar tarea (DELETE) ────────────────────────────────
  const handleDeleteTask = async (taskId, taskTitle) => {
    const isConfirmed = window.confirm(
      `¿Confirmas que deseas eliminar la tarea "${taskTitle}"? Esta acción es irreversible.`
    );

    if (!isConfirmed) return;

    setUpdatingTaskId(taskId);

    try {
      const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('No se pudo eliminar la tarea del servidor.');
      }

      // Filtrar y actualizar estado local
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
    } catch (err) {
      alert(`Error al eliminar: ${err.message}`);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // ── 5. Filtrado de tareas según tab activo ────────────────────────────────
  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'mine') {
      const userName = user?.name?.toLowerCase() || '';
      const userEmail = user?.email?.toLowerCase() || '';
      const assigned = task.assignedTo?.toLowerCase() || '';

      return (
        assigned === userName ||
        assigned === userEmail ||
        assigned.includes(userName) ||
        (userName && assigned.includes(userName.split(' ')[0]))
      );
    }
    return true;
  });

  const totalPending = tasks.filter((t) => !t.completed).length;
  const totalCompleted = tasks.filter((t) => t.completed).length;

  return (
    <div className="tasks-container">
      <header className="tasks-header">
        <h1>Gestión de Tareas Operativas</h1>
        <p>
          Seguimiento de labores de mantenimiento, preparación de laboratorios y actividades asignadas.
        </p>
      </header>

      {/* RENDERIZADO CONDICIONAL: Formulario solo para Administradores */}
      {isAdmin && (
        <section className="admin-task-card">
          <h2 className="admin-task-title">
            <PlusCircle size={20} className="admin-icon" />
            <span>Crear Nueva Tarea (Panel Admin)</span>
          </h2>

          {formError && (
            <div className="tasks-alert error" role="alert">
              <AlertCircle size={18} />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleCreateTask} className="admin-task-form">
            <div className="task-form-field">
              <label htmlFor="task-title-input">Título o Descripción de la Tarea</label>
              <input
                id="task-title-input"
                type="text"
                placeholder="Ej. Revisión y limpieza de multímetros"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="task-form-field">
              <label htmlFor="task-assigned-input">Asignada a (Nombre o Correo)</label>
              <input
                id="task-assigned-input"
                type="text"
                placeholder="Ej. Juan Estudiante"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-create-task"
              disabled={isSubmitting}
            >
              <Plus size={18} />
              <span>{isSubmitting ? 'Guardando...' : 'Crear Tarea'}</span>
            </button>
          </form>
        </section>
      )}

      {/* Alerta de Error de conexión o API */}
      {error && (
        <div className="tasks-alert error" role="alert">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Barra de herramientas y filtros */}
      <div className="tasks-toolbar">
        <div className="tasks-filter-tabs">
          <button
            type="button"
            className={`filter-tab-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            <ListTodo size={15} />
            <span>Todas las tareas ({tasks.length})</span>
          </button>

          <button
            type="button"
            className={`filter-tab-btn ${activeFilter === 'mine' ? 'active' : ''}`}
            onClick={() => setActiveFilter('mine')}
          >
            <Filter size={15} />
            <span>Mis tareas asignadas</span>
          </button>
        </div>

        <div className="tasks-stats-summary">
          <span className="stat-pill">
            <Clock size={14} color="#d97706" />
            <span>Pendientes: <strong>{totalPending}</strong></span>
          </span>
          <span className="stat-pill">
            <CheckCircle2 size={14} color="#059669" />
            <span>Completadas: <strong>{totalCompleted}</strong></span>
          </span>
        </div>
      </div>

      {/* Estado de carga */}
      {loading ? (
        <div className="tasks-loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando lista de tareas...</p>
        </div>
      ) : (
        /* Lista renderizada */
        <div className="tasks-list">
          {filteredTasks.length === 0 ? (
            <div className="tasks-empty">
              <FolderKanban size={44} className="tasks-empty-icon" />
              <p>
                {activeFilter === 'mine'
                  ? 'No tienes tareas asignadas en este momento.'
                  : 'No hay tareas registradas en el sistema.'}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteTask}
                isAdmin={isAdmin}
                isUpdating={updatingTaskId === task.id}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;
