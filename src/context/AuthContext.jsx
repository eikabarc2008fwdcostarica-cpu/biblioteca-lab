import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { fetchJSON } from '../lib/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('libraryUser')
    if (!stored) return null
    try {
      return JSON.parse(stored)
    } catch {
      localStorage.removeItem('libraryUser')
      return null
    }
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('libraryUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('libraryUser')
    }
  }, [user])

  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error('Ingresa un correo y una contraseña.')
    }

    const list = await fetchJSON(`/users?email=${encodeURIComponent(email)}`)
    const found = Array.isArray(list) && list.length > 0 ? list[0] : null
    if (!found || found.password !== password) {
      throw new Error('Credenciales inválidas. Verifica tu correo y contraseña.')
    }

    const authUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
    }
    setUser(authUser)
    return authUser
  }

  const logout = useCallback(() => setUser(null), [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
