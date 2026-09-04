/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

// 1. Creación del contexto de autenticación
const AuthContext = createContext(null);

/**
 * Proveedor de Autenticación (AuthProvider)
 * Envuelve los componentes que necesitan acceso al estado y métodos de autenticación.
 */
export const AuthProvider = ({ children }) => {
  // Estado user inicializado desde localStorage si existe (persistencia básica)
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error al inicializar el usuario desde localStorage:', error);
      return null;
    }
  });

  // Efecto: Sincronización entre pestañas en tiempo real (evento storage)
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'user') {
        try {
          setUser(event.newValue ? JSON.parse(event.newValue) : null);
        } catch {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /**
   * Inicia sesión consultando a JSON Server
   * @param {string} email - Correo electrónico del usuario
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} Datos del usuario autenticado en caso de éxito
   * @throws {Error} Mensaje descriptivo si las credenciales fallan o hay error de conexión
   */
  const login = async (email, password) => {
    try {
      // Petición a JSON Server con parámetros codificados
      const response = await fetch(
        `http://localhost:3001/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
      );

      if (!response.ok) {
        throw new Error(`Error del servidor (${response.status}): no se pudo verificar las credenciales.`);
      }

      const users = await response.json();

      // Si el array devuelto contiene al menos un usuario coincidente
      if (Array.isArray(users) && users.length > 0) {
        const foundUser = users[0];

        // Estructura requerida: objeto con id, name, email, role
        const userData = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
        };

        // Guardamos en el estado y persistimos en localStorage
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));

        return userData;
      }

      // Si el array devuelto está vacío, las credenciales son incorrectas
      throw new Error('Credenciales incorrectas. Verifica el correo y la contraseña.');
    } catch (error) {
      // Manejo específico si JSON Server no está activo o inalcanzable
      if (error instanceof TypeError && error.message.toLowerCase().includes('fetch')) {
        throw new Error(
          'No se pudo conectar con el servidor. Asegúrate de que JSON Server esté activo en http://localhost:3001',
          { cause: error }
        );
      }
      throw error;
    }
  };

  /**
   * Cierra sesión eliminando los datos del estado y de localStorage
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Valor expuesto a los componentes consumidores
  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook useAuth()
 * Facilita el consumo del contexto y asegura que se use dentro del AuthProvider
 * @returns {{ user: Object|null, isAuthenticated: boolean, login: Function, logout: Function }}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth() debe ser utilizado dentro de un <AuthProvider>');
  }

  return context;
};

export default AuthContext;
