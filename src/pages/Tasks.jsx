import { useEffect, useState } from 'react'
import { useAuth } from '../context/useAuth'
import { fetchJSON } from '../lib/api'
import TaskCard from '../components/TaskCard'
import './Tasks.css'

const initialState = { title: '', assignedTo: '' }

export default function Tasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState(initialState)
  const [submitting, setSubmitting] = useState(false)

  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tasksData, usersData] = await Promise.all([
          fetchJSON('/tasks'),
          fetchJSON('/users'),
        ])
        setTasks(tasksData)
        setUsers(usersData)
      } catch (err) {
        setError(err.message || 'No se pudieron cargar las tareas.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const assigneeName = (id) => {
    const found = users.find((u) => u.id === id || u.id === Number(id))
    return found ? found.name : `#${id}`
  }

  const toggleCompleted = async (task) => {
    try {
      const updated = await fetchJSON(`/tasks/${task.id}`, {
        method: 'PATCH',
        body: { completed: !task.completed },
      })
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, ...updated } : t)),
      )
      setError('')
    } catch (err) {
      setError(err.message || 'No se pudo actualizar la tarea.')
    }
  }

  const handleDelete = async (task) => {
    if (!confirm(`¿Eliminar la tarea "${task.title}"?`)) return
    try {
      await fetchJSON(`/tasks/${task.id}`, { method: 'DELETE' })
      setTasks((prev) => prev.filter((t) => t.id !== task.id))
      setError('')
    } catch (err) {
      setError(err.message || 'No se pudo eliminar la tarea.')
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    const title = form.title.trim()
    if (!title) {
      setError('El título de la tarea es obligatorio.')
      return
    }
    if (!form.assignedTo) {
      setError('Selecciona un usuario al que asignar la tarea.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const created = await fetchJSON('/tasks', {
        method: 'POST',
        body: { title, assignedTo: Number(form.assignedTo), completed: false },
      })
      setTasks((prev) => [created, ...prev])
      setForm(initialState)
    } catch (err) {
      setError(err.message || 'No se pudo crear la tarea.')
    } finally {
      setSubmitting(false)
    }
  }

  const visibleTasks =
    filter === 'mine' ? tasks.filter((t) => t.assignedTo === user?.id) : tasks

  return (
    <div className="tasks-page">
      <header className="tasks-page__header">
        <div>
          <h1>Mis Tareas</h1>
          <p className="tasks-page__subtitle">
            Gestiona las tareas asignadas en la biblioteca.
          </p>
        </div>

        <div className="filter-toggle">
          <button
            type="button"
            className={filter === 'all' ? 'active' : undefined}
            onClick={() => setFilter('all')}
          >
            Todas
          </button>
          <button
            type="button"
            className={filter === 'mine' ? 'active' : undefined}
            onClick={() => setFilter('mine')}
          >
            Mis tareas
          </button>
        </div>
      </header>

      {isAdmin && (
        <section className="card create-form">
          <h2>Crear nueva tarea</h2>
          <form onSubmit={handleCreate} className="create-form__grid">
            <div className="form-group">
              <label htmlFor="task-title">Título *</label>
              <input
                id="task-title"
                type="text"
                className="form-control"
                placeholder="Ej: Revisar inventario de libros"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                disabled={submitting}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="task-assignee">Asignar a *</label>
              <select
                id="task-assignee"
                className="form-control select-control"
                value={form.assignedTo}
                onChange={(e) =>
                  setForm((f) => ({ ...f, assignedTo: e.target.value }))
                }
                disabled={submitting}
                required
              >
                <option value="">Selecciona un usuario</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="create-form__actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Creando...' : 'Crear tarea'}
              </button>
            </div>
          </form>
        </section>
      )}

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="status-row">
          <span className="spinner" />
          <span>Cargando tareas...</span>
        </div>
      ) : visibleTasks.length === 0 ? (
        <div className="status-row">
          {filter === 'mine'
            ? 'No tienes tareas asignadas.'
            : 'Aún no hay tareas registradas.'}
        </div>
      ) : (
        <div className="tasks-grid">
          {visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              assigneeName={assigneeName(task.assignedTo)}
              isAdmin={isAdmin}
              onToggle={toggleCompleted}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
