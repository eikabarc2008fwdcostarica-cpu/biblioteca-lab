import { useEffect, useState } from 'react'
import { fetchJSON } from '../lib/api'

export default function Reservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const [rData, cData] = await Promise.all([fetchJSON('/reservations'), fetchJSON('/courses')])
        const byCourse = Object.fromEntries(cData.map((c) => [c.id, c.title]))
        setReservations(rData.map((r) => ({ ...r, courseTitle: byCourse[r.courseId] || `Curso #${r.courseId}` })))
      } catch (err) {
        setError(err.message || 'No se pudieron cargar las reservas.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const statusBadge = (s) => {
    const map = { active: 'badge-blue', completed: 'badge-green', pending: 'badge-yellow' }
    return map[s] || 'badge'
  }

  return (
    <div className="reservations-page">
      <h1>Reservas</h1>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="status-row"><span className="spinner" /> <span>Cargando reservas...</span></div>
      ) : reservations.length === 0 ? (
        <div className="status-row">No hay reservas registradas.</div>
      ) : (
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Curso</th><th>Usuario</th><th>Fecha</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.courseTitle}</td>
                <td>{r.userId}</td>
                <td>{r.date}</td>
                <td><span className={`badge ${statusBadge(r.status)}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
