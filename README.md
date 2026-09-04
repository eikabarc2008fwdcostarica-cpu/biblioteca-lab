# 📚 Biblioteca Lab — Sistema de Gestión de Laboratorio

Aplicación web construida con **React + Vite** que permite gestionar cursos, reservas y tareas de un laboratorio académico. Incluye autenticación por roles, rutas protegidas y un backend simulado con JSON Server.

---

## 🚀 Tecnologías utilizadas

| Tecnología | Versión | Propósito |
|---|---|---|
| React | 19.x | Biblioteca de UI |
| Vite | 8.x | Bundler y servidor de desarrollo |
| react-router-dom | v6 | Enrutamiento SPA |
| JSON Server | — | Backend REST simulado |
| lucide-react | — | Iconografía profesional |

---

## ⚙️ Instalación y arranque

### 1. Clonar el repositorio
```bash
git clone https://github.com/eikabarc2008fwdcostarica-cpu/biblioteca-lab.git
cd biblioteca-lab
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Levantar el backend simulado (JSON Server)
> Abre una terminal separada para este comando.
```bash
npx json-server db.json --port 3001
```
JSON Server estará disponible en: `http://localhost:3001`

### 4. Levantar el servidor de desarrollo
```bash
npm run dev
```
La aplicación estará disponible en: `http://localhost:5173` (o el siguiente puerto libre).

---

## 🗄️ Estructura del proyecto

```
biblioteca-lab/
├── db.json                    # Base de datos simulada (JSON Server)
├── src/
│   ├── context/
│   │   └── AuthContext.jsx    # Contexto global de autenticación
│   ├── components/
│   │   ├── Login.jsx          # Formulario de inicio de sesión
│   │   ├── Navbar.jsx         # Barra de navegación con menú por rol
│   │   └── RutaProtegida.jsx  # Guardia de rutas (auth + roles) ← NUEVO
│   ├── pages/
│   │   ├── Dashboard.jsx      # Página de inicio / bienvenida
│   │   ├── CoursesInventory.jsx # Catálogo de cursos (CRUD admin)
│   │   ├── Reservations.jsx   # Módulo de reservas ← NUEVO (reemplazado)
│   │   ├── Tasks.jsx          # Página de tareas
│   │   └── AccesoDenegado.jsx # Pantalla de error 403 ← NUEVO
│   ├── App.jsx                # Configuración de rutas ← MODIFICADO
│   └── main.jsx               # Punto de entrada
```

---

## 👤 Usuarios de prueba

Definidos en `db.json`. Credenciales para usar en `/login`:

| Nombre | Email | Contraseña | Rol |
|---|---|---|---|
| Profesor Admin | `admin@lab.com` | `123` | `admin` |
| Juan Estudiante | `estudiante@lab.com` | `123` | `estudiante` |

---

## 🔐 Sistema de autenticación

### AuthContext (`src/context/AuthContext.jsx`)

- Expone `{ user, isAuthenticated, login, logout }` a toda la app mediante Context API.
- El estado `user` contiene `{ id, name, email, role }` si hay sesión activa, o `null` si no.
- **Persistencia:** el usuario se guarda en `localStorage` para sobrevivir recargas de página. La inicialización es **síncrona** (lazy initializer), por lo que no existe ventana de `null` temporal.
- **Sincronización entre pestañas:** escucha el evento `storage` para cerrar sesión en tiempo real si el usuario cierra sesión en otra pestaña del navegador.

```jsx
// Consumo del contexto en cualquier componente
import { useAuth } from '../context/AuthContext';

const { user, login, logout } = useAuth();
```

---

## 🛡️ RutaProtegida (`src/components/RutaProtegida.jsx`)

Componente guardia de ruta que trabaja con **react-router-dom v6**.

### Flujo de decisión

```
user === null            →  <Navigate to="/login" replace />
rolPermitido !== user.role  →  <AccesoDenegado />
✅ OK                    →  children || <Outlet />
```

### Props

| Prop | Tipo | Descripción |
|---|---|---|
| `rolPermitido` | `string` (opcional) | Si se pasa, solo usuarios con ese rol pueden acceder |
| `children` | `ReactNode` (opcional) | Contenido a renderizar si el usuario tiene acceso |

### Uso

```jsx
// Ruta que requiere sesión (cualquier rol)
<Route path="/courses" element={
  <RutaProtegida>
    <CoursesInventory />
  </RutaProtegida>
} />

// Ruta exclusiva para administradores
<Route path="/admin-panel" element={
  <RutaProtegida rolPermitido="admin">
    <AdminPanel />
  </RutaProtegida>
} />

// Como Layout Route con Outlet (agrupa varias rutas hijas)
<Route element={<RutaProtegida />}>
  <Route path="/courses" element={<CoursesInventory />} />
  <Route path="/reservations" element={<Reservations />} />
</Route>
```

### ¿Por qué `replace` en `<Navigate>`?

El prop `replace` evita que la URL protegida quede en el historial del navegador:

- **Sin `replace`:** historial = `['/courses', '/login']` → el botón "Atrás" regresa a `/courses` generando un bucle.
- **Con `replace`:** historial = `['/login']` → el botón "Atrás" va a la página anterior real.

---

## ❌ AccesoDenegado (`src/pages/AccesoDenegado.jsx`)

Pantalla de error **403** mostrada automáticamente por `<RutaProtegida>` cuando el usuario autenticado no tiene el rol requerido.

- Ícono 🚫 prominente
- Código de error **403** en tipografía grande
- Mensaje explicativo sin tecnicismos
- Botón **"🏠 Volver al Inicio"** con efecto hover animado
- También accesible directamente en la ruta `/403`

---

## 📅 Reservations (`src/pages/Reservations.jsx`)

Módulo interactivo completo de reservas de laboratorio.

### Comportamiento por rol

| Rol | Qué ve | Puede hacer |
|---|---|---|
| `admin` | **Todas** las reservas del sistema | Crear y **Eliminar** cualquier reserva |
| `estudiante` | **Solo sus** reservas | Crear y **Cancelar** sus propias reservas |

### Operaciones HTTP

```
GET  /reservations              → Admin: todas las reservas
GET  /reservations?userId=X     → Usuario: solo sus reservas (filtrado en servidor)
POST /reservations              → Crear nueva reserva
DELETE /reservations/:id        → Cancelar/Eliminar una reserva
```

### ¿Filtrado en servidor vs `.filter()` en frontend?

Se usa la query string `?userId=${user.id}` para que **JSON Server filtre en el origen**. Esto es preferible a traer todos los datos y filtrarlos con `.filter()` en el cliente porque:
1. Menos datos en la red (más eficiente y escalable).
2. El servidor es la fuente de verdad.
3. En una API real, el filtro ocurre a nivel de base de datos (con índice).

### Actualización de estado local optimista

Tras cada mutación exitosa, el estado local se actualiza **sin hacer un segundo GET**:

```js
// Después de POST exitoso
setReservations(prev => [...prev, reservaCreada]);

// Después de DELETE exitoso
setReservations(prev => prev.filter(r => r.id !== idEliminado));
```

---

## 🗺️ Mapa de rutas (`src/App.jsx`)

| Ruta | Acceso | Componente |
|---|---|---|
| `/` | Pública | `Dashboard` |
| `/login` | Pública | `Login` |
| `/403` | Pública | `AccesoDenegado` |
| `/courses` | Autenticado (cualquier rol) | `CoursesInventory` |
| `/reservations` | Autenticado (cualquier rol) | `Reservations` |
| `/tasks` | Autenticado (cualquier rol) | `Tasks` |
| `/admin-panel` | Solo rol `admin` | *(placeholder: Dashboard)* |
| `*` | — | Redirige a `/` |

---

## 🌐 Endpoints del backend simulado

JSON Server expone los siguientes endpoints en `http://localhost:3001`:

| Endpoint | Descripción |
|---|---|
| `GET /users` | Lista de usuarios (para login) |
| `GET /courses` | Catálogo de cursos |
| `POST /courses` | Crear curso (admin) |
| `DELETE /courses/:id` | Eliminar curso (admin) |
| `GET /reservations` | Todas las reservas (admin) |
| `GET /reservations?userId=X` | Reservas de un usuario |
| `POST /reservations` | Crear nueva reserva |
| `DELETE /reservations/:id` | Cancelar reserva |

---

## 🌿 Rama de trabajo

Este desarrollo se realizó en la rama:
```
feature-oscar
```

Para subir los cambios:
```bash
git add .
git commit -m "feat: RutaProtegida, AccesoDenegado, Reservations module, App.jsx routes"
git push origin feature-oscar
```
