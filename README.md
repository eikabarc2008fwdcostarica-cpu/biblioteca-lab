# Biblioteca Lab

**Panel de Biblioteca de Cursos, Reservas e Inventario de Tareas** — aplicación
frontend en **React 19 + Vite** con autenticación simulada y roles
(`admin`/`user`) contra **JSON Server**.

---

## Integrantes del equipo

| Nombre | Rol asumido | Responsabilidad |
| --- | --- | --- |
| Ana Admin | Líder técnica / Full-stack | Arquitectura, rutas protegidas, contexto de autenticación y Dashboard. |
| Luis User | Frontend | Módulo de Tareas (`TaskCard`, `Tasks`) y consumo de endpoints. |
| Carlos Pérez | DevOps / Documentación | JSON Server, `db.json`, scripts de levantamiento y bitácora. |

> Los roles `admin` y `user` también son los roles de **autenticación** dentro de
> la aplicación (ver tabla de credenciales).

---

## Tecnologías

- **React 19** con **Vite** como bundler/dev server.
- **React Router DOM v7** para el enrutado y rutas protegidas.
- **JSON Server** como backend mock REST en `http://localhost:3001`.
- **Oxlint** como linter.
- **Vibe Coding** como metodología de trabajo colaborativo.

---

## Instalación y puesta en marcha

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-org/biblioteca-lab.git
cd biblioteca-lab
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Levantar JSON Server (terminal 1)

```bash
json-server --watch db.json --port 3001
```

Esto expondrá los siguientes endpoints REST en `http://localhost:3001`:

| Endpoint | Método | Descripción |
| --- | --- | --- |
| `/users` | GET | Lista de usuarios (incluye roles y passwords). |
| `/courses` | GET / POST | Catálogo de cursos con control de stock. |
| `/reservations` | GET | Reservas registradas. |
| `/tasks` | GET / POST / PATCH / DELETE | Inventario de tareas. |

### 4. Levantar Vite (terminal 2)

```bash
npm run dev
```

La aplicación quedará disponible en <http://localhost:5173>.

---

## Estructura de carpetas

```
biblioteca-lab/
├── public/                 # Archivos estáticos (favicon, icons.svg)
├── src/
│   ├── assets/             # Imágenes y recursos
│   ├── components/         # Componentes reutilizables (TaskCard.jsx)
│   ├── config/             # Configuración (api.js)
│   ├── context/            # AuthContext.jsx (autenticación simulada)
│   ├── hooks/              # Hooks personalizados
│   ├── layout/             # RootLayout.jsx (navegación + header)
│   ├── lib/                # Utilidades (api.js)
│   ├── pages/              # Vistas por ruta (Dashboard, Tasks, ...)
│   ├── router/             # Router.jsx (rutas protegidas)
│   ├── styles/             # Estilos globales (index.css)
│   ├── App.jsx             # Punto de entrada del router
│   └── main.jsx            # Render principal + providers
├── db.json                 # Base de datos mock de JSON Server
├── README.md
├── BITACORA.md
├── vite.config.js
└── package.json
```

---

## Rutas de la aplicación

| Ruta | Página | Requiere auth | Requiere admin |
| --- | --- | --- | --- |
| `/login` | Inicio de sesión | No | No |
| `/` (Dashboard) | `/dashboard` | Sí | No |
| `/tasks` | Tareas | Sí | Formulario de creación y botón de eliminación solo para admin. |
| `/courses` | Cursos | Sí | Formulario de creación solo para admin. |
| `/reservations` | Reservas | Sí | No |

---

## Credenciales de prueba

> Las credenciales están **hardcodeadas** en `db.json` únicamente para
> desarrollo y pruebas locales.

| Email | Password | Role | Nombre |
| --- | --- | --- | --- |
| `admin@demo.com` | `1234` | `admin` | Ana Admin |
| `user@demo.com` | `1234` | `user` | Luis User |
| `carlos@demo.com` | `1234` | `user` | Carlos Pérez |

---

## Comandos útiles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Levanta el servidor de Vite. |
| `npm run build` | Genera la versión de producción. |
| `npm run preview` | Sirve localmente la build de producción. |
| `npm run lint` | Ejecuta Oxlint. |

---

## Reflexión de seguridad: ¿por qué este sistema de roles NO es seguro en producción?

Este prototipo valida el rol del usuario consumiendo directamente el endpoint
`/users` de JSON Server desde el cliente y confiando en el campo `role` que
viene guardado en `localStorage`. Ese enfoque **no es seguro** para producción
por varias razones:

1. **`localStorage` es volátil y manipulable.** Cualquier usuario puede abrir
   las herramientas de desarrollo y cambiar el valor de `libraryUser`, por
   ejemplo modificando `role` de `"user"` a `"admin"`. El cliente no debe ser
   la fuente de verdad de los permisos.
2. **Las contraseñas viajan y se comparan en texto plano.** JSON Server
   compara strings sin hashing. Un backend real debe almacenar contraseñas con
   un algoritmo de *hashing* fuerte (bcrypt, Argon2) y nunca enviar la password
   al cliente.
3. **No hay validación ni autorización del lado del servidor.** El cliente
   decide qué endpoint llamar y con qué datos. El servidor debe validar en cada
   request quién es el usuario autenticado (middleware/JWT) y si está autorizado
   a realizar la operación (p. ej. solo un `admin` puede `DELETE /tasks/:id`).
4. **No hay sesión ni token firmado.** No se invalida sesiones al cerrar, no
   hay expiración ni revocación.

### ¿Qué haría falta en un backend real?

- **JWT (JSON Web Tokens)** firmados con una clave secreta: el servidor
  autentica al iniciar sesión, devuelve un token con el `id` y `role`, y el
  cliente lo envía en cada request (`Authorization: Bearer <token>`).
- **Hashing de contraseñas** con `bcrypt`/`Argon2` y comparación segura.
- **Validación y sanitización en el servidor** de todo lo recibido en los
  *bodies* de las peticiones.
- **Autorización basada en roles (RBAC)** en el backend: un *middleware* que
  verifique `req.user.role` antes de permitir `POST`/`DELETE`.
- **HTTP-only cookies** con `SameSite` para almacenar el token y evitar
  vulnerabilidades XSS/CSRF.
- **Rate limiting** y bloqueo de intentos fallidos para mitigar fuerza bruta.

---

## Bitácora de desarrollo

Este proyecto se documenta iteración a iteración en
[`BITACORA.md`](./BITACORA.md) (metodología **Vibe Coding**).
