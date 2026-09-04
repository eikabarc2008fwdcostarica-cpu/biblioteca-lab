import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '56px 16px' }}>
      <h1 style={{ fontSize: '48px', margin: '0 0 8px' }}>404</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
        Página no encontrada
      </p>
      <Link to="/" className="btn btn-outline">
        Volver al Dashboard
      </Link>
    </div>
  )
}
