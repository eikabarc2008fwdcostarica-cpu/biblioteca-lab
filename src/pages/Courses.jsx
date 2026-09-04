import { useEffect, useState } from 'react'
import { useAuth } from '../context/useAuth'
import { fetchJSON } from '../lib/api'

export default function Courses() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ title: '', category: '', stock: '', description: '' })
  const [submitting, setSubmitting] = useState(false)
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchJSON('/courses')
        setCourses(data)
      } catch (err) {
        setError(err.message || 'No se pudieron cargar los cursos.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.category.trim() || form.stock === '') {
      setError('Completa todos los campos obligatorios.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const created = await fetchJSON('/courses', {
        method: 'POST',
        body: {
          title: form.title.trim(),
          category: form.category.trim(),
          stock: Number(form.stock),
          description: form.description.trim(),
        },
      })
      setCourses((prev) => [created, ...prev])
      setForm({ title: '', category: '', stock: '', description: '' })
    } catch (err) {
      setError(err.message || 'No se pudo crear el curso.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="courses-page">
      <h1>Cursos</h1>

      {isAdmin && (
        <section className="card" style={{ marginBottom: '20px' }}>
          <h2>Nuevo curso</h2>
          <form
            onSubmit={handleCreate}
            style={{
              display: 'grid',
              gap: '14px',
              gridTemplateColumns: '1fr 1fr',
            }}
          >
            <div className="form-group">
              <label htmlFor="c-title">Título *</label>
              <input
                id="c-title"
                className="form-control"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Ej: Álgebra Avanzada"
                disabled={submitting}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="c-category">Categoría *</label>
              <input
                id="c-category"
                className="form-control"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="Ej: Matemáticas"
                disabled={submitting}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="c-stock">Stock *</label>
              <input
                id="c-stock"
                type="number"
                min="0"
                className="form-control"
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                placeholder="Ej: 5"
                disabled={submitting}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="c-desc">Descripción</label>
              <input
                id="c-desc"
                className="form-control"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Breve descripción"
                disabled={submitting}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Creando...' : 'Crear curso'}
              </button>
            </div>
          </form>
        </section>
      )}

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="status-row">
          <span className="spinner" />
          <span>Cargando cursos...</span>
        </div>
      ) : courses.length === 0 ? (
        <div className="status-row">No hay cursos registrados.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.title}</td>
                <td>{c.category}</td>
                <td>{c.stock}</td>
                <td>
                  <span className={`badge ${c.stock === 0 ? 'badge-red' : 'badge-green'}`}>
                    {c.stock === 0 ? 'Agotado' : 'Disponible'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
