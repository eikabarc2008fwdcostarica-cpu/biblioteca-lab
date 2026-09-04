import './TaskCard.css'

export default function TaskCard({ task, assigneeName, isAdmin, onToggle, onDelete }) {
  const { title, completed } = task

  return (
    <div className="task-card">
      <div className="task-card__body">
        <h3 className="task-card__title">{title}</h3>

        <div className="task-card__meta">
          <span className="task-card__assignee">
            Asignada a:{' '}
            <strong>{assigneeName || `#${task.assignedTo}`}</strong>
          </span>
          <span className={completed ? 'badge badge-green' : 'badge badge-yellow'}>
            {completed ? 'Completada' : 'Pendiente'}
          </span>
        </div>

        <div className="task-card__actions">
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={() => onToggle(task)}
            aria-label={completed ? 'Marcar como pendiente' : 'Marcar como completada'}
          >
            {completed ? 'Desmarcar' : 'Completar'}
          </button>

          {isAdmin && (
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={() => onDelete(task)}
              aria-label={`Eliminar tarea ${title}`}
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
