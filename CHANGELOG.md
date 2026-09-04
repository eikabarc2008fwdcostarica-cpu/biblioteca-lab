# Historial de Cambios (Changelog)

Todos los cambios notables realizados en este proyecto seran documentados en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y este proyecto se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [1.1.0] - 2026-09-04

### Added
- **Modulo de Registro de Usuarios (`Register.jsx`)**: Formulario controlado con validacion de unicidad de correo electronico contra JSON Server y asignacion predeterminada del rol `user`.
- **Acceso directo de Registro en Login**: Enlace de navegacion entre inicio de sesion y creacion de cuenta.
- **Modulo Completo de Tareas (`Tasks.jsx` y `TaskCard.jsx`)**:
  - Renderizado reactivo de tareas de laboratorio con alternancia de estado (Pendiente / Completada) via peticiones `PATCH /tasks/:id`.
  - Pestañas de filtrado para alternar entre todas las actividades y asignaciones personales.
  - Panel administrativo condicional para creacion (`POST /tasks`) y eliminacion (`DELETE /tasks/:id`).
- **Dashboard con Metricas Concurrentes (`Dashboard.jsx`)**:
  - Implementacion de `Promise.all` para consulta paralela de `/courses`, `/reservations` y `/tasks`.
  - Tarjetas de metricas en vivo: total de cursos, stock agotado, reservas activas y balance de tareas.
  - Banner de bienvenida con descripcion institucional formal del sistema.
- **Asistente Virtual con Inteligencia Artificial (`GeminiChatbot.jsx`)**:
  - Widget conversacional flotante integrado con el modelo `gemini-2.5-flash`.
  - Guardrails estrictos de sistema para delimitar respuestas al entorno bibliotecario y academico.
  - Deteccion automatica y notificacion en interfaz si la variable `VITE_GEMINI_API_KEY` no se encuentra definida.
- **Gobernanza del Repositorio**: Archivos formales `CONTRIBUTING.md`, `CHANGELOG.md` y `BITACORA.md`.

### Changed
- **Proteccion de Rutas en `App.jsx`**:
  - El Dashboard (`/`) ahora opera como ruta protegida principal bajo el componente `RutaProtegida`.
  - Integracion global del componente `GeminiChatbot` condicionado a la sesion del usuario.
- **Rediseno Estetico Cohesivo**:
  - Eliminacion total de emojis en toda la plataforma.
  - Adopcion de la biblioteca vectorial `lucide-react` para estandarizar la iconografia.
  - Homogeneizacion de colores hacia una paleta sobria basada en azul pizarra (`#1e293b`), azul corporativo (`#2563eb`), esmeralda y ambar.
- **Barra de Navegacion (`Navbar.jsx`)**: Incorporacion de botones diferenciados para inicio de sesion y registro en estado de invitado, e inclusion de badge para rol `user`.

### Fixed
- Correccion de estilos restrictivos globales en `index.css` que impedian el diseno fluido en dispositivos moviles.
- Eliminacion de bucles de redireccion mediante la directiva `replace` en el componente `RutaProtegida`.

---

## [1.0.0] - 2026-09-04

### Added
- Inicializacion del proyecto con React 19 y Vite 8.
- Configuracion del enrutador SPA con `react-router-dom` v6.
- Contexto global de autenticacion `AuthContext.jsx` con persistencia en `localStorage` y sincronizacion multi-pestana.
- Custom hook `useAuth` para consumo seguro de la sesion.
- Formulario de autenticacion `Login.jsx` con manejo de estados de carga, error y redireccion.
- Modulo de Inventario de Cursos `CoursesInventory.jsx` con soporte de lectura publica y gestion CRUD exclusiva para administradores.
- Modulo de Reservas de Laboratorio `Reservations.jsx` con filtrado por URL y administracion por roles.
- Componente `RutaProtegida.jsx` con validacion de sesion y permisos por rol.
- Pagina de autorizacion `AccesoDenegado.jsx` para codigos de estado HTTP 403.
- Base de datos simulada `db.json` para ejecucion local con JSON Server.
