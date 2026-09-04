import { Check, Clock, User, Trash2, CheckCircle2 } from 'lucide-react';
import './TaskCard.css';

/**
 * Componente TaskCard
 * Representa una tarea individual con título, responsable, estado
 * y acciones para alternar completado o eliminar (si es admin).
 */
const TaskCard = ({ task, onToggleStatus, onDelete, isAdmin, isUpdating }) => {
  const isCompleted = !!task.completed;

  return (
    <article className={`task-card ${isCompleted ? 'is-completed' : ''}`}>
      <div className="task-card-left">
        {/* Botón interactivo para alternar estado */}
        <button
          type="button"
          className={`task-toggle-btn ${isCompleted ? 'completed' : ''}`}
          onClick={() => onToggleStatus(task.id, isCompleted)}
          disabled={isUpdating}
          aria-label={isCompleted ? 'Marcar como pendiente' : 'Marcar como completada'}
          title={isCompleted ? 'Marcar como pendiente' : 'Marcar como completada'}
        >
          {isCompleted && <Check size={16} strokeWidth={3} />}
        </button>

        <div className="task-info">
          <h3 className={`task-title ${isCompleted ? 'completed' : ''}`}>
            {task.title}
          </h3>

          <div className="task-meta">
            <span className="task-assigned">
              <User size={13} />
              <span>Asignada a: <strong>{task.assignedTo || 'Sin asignar'}</strong></span>
            </span>

            {/* Etiqueta de estado sobria */}
            <span className={`task-status-badge ${isCompleted ? 'completed' : 'pending'}`}>
              {isCompleted ? (
                <>
                  <CheckCircle2 size={12} />
                  <span>Completada</span>
                </>
              ) : (
                <>
                  <Clock size={12} />
                  <span>Pendiente</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Botón de eliminación solo visible para el rol admin */}
      {isAdmin && (
        <div className="task-card-right">
          <button
            type="button"
            className="task-delete-btn"
            onClick={() => onDelete(task.id, task.title)}
            disabled={isUpdating}
            title="Eliminar tarea"
          >
            <Trash2 size={14} />
            <span>Eliminar</span>
          </button>
        </div>
      )}
    </article>
  );
};

export default TaskCard;
