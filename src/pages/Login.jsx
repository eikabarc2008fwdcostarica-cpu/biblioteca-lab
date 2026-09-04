import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Login() {
  const [email, setEmail] = useState('user@demo.com')
  const [password, setPassword] = useState('1234')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: '420px', margin: '48px auto 0' }}>
      <div className="card" style={{ padding: '32px' }}>
        <h1 style={{ fontSize: '28px', margin: '0 0 4px' }}>Biblioteca Lab</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: '0 0 22px' }}>
          Inicia sesión para continuar
        </p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="form-group">
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@demo.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="1234"
              required
              minLength={4}
            />
          </div>

          <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            <strong>Admin:</strong> admin@demo.com / 1234 &middot;{' '}
            <strong>User:</strong> user@demo.com / 1234
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ marginTop: '18px', width: '100%' }}
            disabled={submitting}
          >
            {submitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
