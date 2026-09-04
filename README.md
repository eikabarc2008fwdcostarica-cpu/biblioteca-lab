# Sistema de Gestion de Biblioteca y Laboratorio Academico

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-v6-CA4245?logo=react-router&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?logo=google&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-2563eb.svg)

Plataforma web Single Page Application (SPA) para la administracion centralizada de inventarios tecnicos, catalogos de cursos academicos, reserva de puestos de laboratorio, gestion de tareas operativas y asistencia virtual con Inteligencia Artificial.

---

## Indice de Contenidos

1. [Descripcion General del Sistema](#descripcion-general-del-sistema)
2. [Arquitectura Tecnica](#arquitectura-tecnica)
3. [Modulos del Sistema](#modulos-del-sistema)
4. [Requisitos Previos e Instalacion](#requisitos-previos-e-instalacion)
5. [Configuracion de Variables de Entorno (Gemini AI)](#configuracion-de-variables-de-entorno-gemini-ai)
6. [Credenciales y Usuarios de Prueba](#credenciales-y-usuarios-de-prueba)
7. [Reflexion Tecnica: Simulacion de Autenticacion en Frontend](#reflexion-tecnica-simulacion-de-autenticacion-en-frontend)
8. [Comandos Disponibles](#comandos-disponibles)

---

## Descripcion General del Sistema

El Sistema de Gestion de Biblioteca y Laboratorio Academico resuelve las necesidades de control de material, prestamos y espacios fisicos para instituciones de educacion tecnica y superior. Permite a los estudiantes y docentes consultar disponibilidad de recursos en tiempo real, programar sesiones presenciales y recibir asistencia interactiva mediante un agente de IA integrado basado en Google Gemini.

---

## Arquitectura Tecnica

El proyecto se encuentra estructurado bajo el paradigma de componentes funcionales de React, aprovechando la reactividad swncrona del estado y la desacoplacion mediante Context API y React Router v6.

```
biblioteca-lab/
|-- db.json                     # Base de datos simulada (JSON Server)
|-- index.html                  # Punto de entrada HTML
|-- package.json                # Dependencias y scripts de ejecucion
|-- vite.config.js              # Configuracion de compilacion Vite
|-- src/
    |-- main.jsx                # Renderizado raiz en el DOM
    |-- App.jsx                 # Enrutador principal y guardias de seguridad
    |-- index.css               # Estilos globales y variables de diseno
    |-- context/
    |   `-- AuthContext.jsx     # Contexto global de sesion y sincronizacion
    |-- components/
    |   |-- Navbar.jsx          # Barra de navegacion responsiva con roles
    |   |-- Login.jsx           # Formulario controlado de acceso
    |   |-- TaskCard.jsx        # Tarjeta individual con acciones de tarea
    |   |-- GeminiChatbot.jsx   # Widget flotante con IA y guardrails estrictos
    |   `-- RutaProtegida.jsx   # Guardia de rutas autenticadas y autorizadas
    `-- pages/
        |-- Dashboard.jsx       # Panel de control con metricas concurrentes
        |-- Register.jsx        # Registro de usuarios con validacion de correo
        |-- CoursesInventory.jsx# Catalogo e inventario de insumos (CRUD Admin)
        |-- Reservations.jsx    # Solicitud y gestion de reservas de laboratorio
        |-- Tasks.jsx           # Gestion y filtrado de tareas operativas
        `-- AccesoDenegado.jsx  # Vista de respuesta HTTP 403 Forbidden
```

### Tecnologias y Bibliotecas Principales

- **React 19**: Biblioteca fundamental para construccion de interfaces de usuario mediante hooks (`useState`, `useEffect`, `useContext`, `useRef`).
- **Vite 8**: Herramienta de compilacion rapida con Hot Module Replacement (HMR).
- **React Router v6**: Sistema de enrutamiento declarativo para navegacion SPA.
- **JSON Server**: Servidor REST simulado sobre el puerto `3001` con persistencia en `db.json`.
- **Lucide React**: Biblioteca de iconos vectoriales para diseno grafico coherente.
- **Google Gemini API**: Modelo `gemini-2.5-flash` con directrices de sistema para soporte contextual.

---

## Modulos del Sistema

### 1. Autenticacion y Registro de Usuarios
- Inicio de sesion contra endpoint de usuarios con persistencia en `localStorage`.
- Registro controlado con validacion de unicidad de correo y asignacion automatica de rol `user`.
- Cierre de sesion con limpieza completa de credenciales en memoria y almacenamiento local.

### 2. Panel de Control (Dashboard)
- Banner institucional con descripcion formal del sistema.
- Carga concurrente de indicadores mediante `Promise.all` desde `/courses`, `/reservations` y `/tasks`.
- Metricas en vivo: total de cursos, cursos con stock agotado, reservas activas y balance de tareas pendientes frente a completadas.

### 3. Catalogo e Inventario de Cursos
- Visualizacion publica o autenticada de cursos categorizados con estado de materiales.
- Panel administrativo exclusivo (`admin`) para creacion (POST) y eliminacion (DELETE) de cursos.

### 4. Reservas de Laboratorio
- Filtrado por URL en el servidor: usuarios regulares acceden a sus reservas especificas (`?userId=X`), mientras que los administradores supervisan la totalidad del laboratorio.
- Creacion y cancelacion reactiva de reservas sin recarga de pagina.

### 5. Gestion de Tareas Operativas
- Tablero de actividades con alternancia de estado (Pendiente / Completada) via peticiones `PATCH`.
- Pestañas de filtrado para visualizar "Todas las tareas" o "Mis tareas asignadas".
- Creacion y eliminacion protegidas bajo rol administrativo.

### 6. Asistente Virtual con Inteligencia Artificial (Gemini)
- Widget flotante en la esquina inferior derecha con soporte conversacional.
- Inyeccion de contexto operativo y delimitacion de alcance (guardrails): el asistente declina cordialmente cualquier solicitud que escape a la gestion bibliotecaria y academica.

---

## Requisitos Previos e Instalacion

### Requisitos del Sistema
- Node.js v18.0.0 o superior
- npm v9.0.0 o superior

### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/eikabarc2008fwdcostarica-cpu/biblioteca-lab.git
cd biblioteca-lab
```

### Paso 2: Instalar dependencias
```bash
npm install
```

### Paso 3: Iniciar el servidor backend simulado (JSON Server)
En una ventana de terminal dedicada, ejecuta:
```bash
npm run server
```
El servicio REST estara disponible en `http://localhost:3001`.

### Paso 4: Iniciar el servidor de desarrollo Vite
En una segunda terminal, ejecuta:
```bash
npm run dev
```
Accede a la aplicacion desde tu navegador en `http://localhost:5173` (o el puerto asignado por Vite).

---

## Configuracion de Variables de Entorno (Gemini AI)

Para habilitar las respuestas del Asistente Virtual Gemini, crea un archivo nombrado `.env.local` en la raiz del proyecto:

```env
VITE_GEMINI_API_KEY=tu_clave_de_api_aqui
```

> Nota: Si la variable de entorno no se encuentra definida, el widget desplegara una advertencia orientativa sin interrumpir el funcionamiento del resto de la aplicacion.

---

## Credenciales y Usuarios de Prueba

La base de datos `db.json` incluye usuarios preconfigurados para verificar las politicas de control de acceso:

| Nombre | Correo Electronico | Contrasena | Rol Asignado | Alcance de Permisos |
|---|---|---|---|---|
| Profesor Admin | `admin@lab.com` | `123` | `admin` | Administracion completa: cursos, tareas y reservas globales. |
| Juan Estudiante | `estudiante@lab.com` | `123` | `estudiante` | Usuario estudiantil: consulta, reservas personales y marcado de tareas. |
| Nuevo Usuario | Registro dinamico | Definida por usuario | `user` | Usuario general registrado mediante `/register`. |

---

## Reflexion Tecnica: Simulacion de Autenticacion en Frontend

La presente implementacion utiliza JSON Server para emular un flujo de autenticacion consultando `GET /users?email=...&password=...` y preservando el objeto resultante en `localStorage`. Desde la perspectiva de arquitectura de software, es fundamental precisar que este esquema constituye una **simulacion de caracter puramente pedagogico** y no un sistema de seguridad apto para entornos de produccion.

### Riesgos y limitaciones del enfoque actual

1. **Exposicion de Credenciales en Transito y Reposo**:
   - Enviar la contrasena como parametro de consulta (query string) en una peticion `GET` provoca que las credenciales queden expuestas en los historiales del navegador, registros de proxy, balanceadores de carga y logs del servidor.
   - JSON Server almacena las contrasenas en texto plano dentro de un archivo JSON accesible, sin funciones criptograficas de derivacion de claves.

2. **Vulnerabilidad de `localStorage`**:
   - La informacion almacenada en `localStorage` es accesible por cualquier script JavaScript que se ejecute en el mismo origen. Cualquier inyeccion de codigo malicioso (Cross-Site Scripting, XSS) compromete de inmediato la identidad del usuario activo.

3. **Inexistencia de Verificacion Criptografica (Tokens JWT)**:
   - En una arquitectura robusta, el servidor emite un JSON Web Token (JWT) firmado con una clave asimetrica o secreta que certifica los claims (identidad, expiracion y roles). En la simulacion actual, cualquier usuario puede modificar los valores de su `localStorage` en las herramientas de desarrollo para atribuirse el rol `admin`.

### Arquitectura recomendada para un entorno real de produccion

1. **Protocolo y Metodos Seguros**:
   - Uso estricto de HTTPS (Transport Layer Security, TLS).
   - Solicitudes de autenticacion enviadas exclusivamente mediante `POST` con cuerpos JSON cifrados en transito.
2. **Almacenamiento de Contrasenas con Salt y Hash**:
   - Empleo de algoritmos adaptativos lentos en el backend como **Argon2id** o **bcrypt** con factores de trabajo adecuados para neutralizar ataques de fuerza bruta y tablas arcoiris.
3. **Manejo de Sesiones con Cookies HttpOnly y SameSite**:
   - Emision de Refresh Tokens y Access Tokens transportados en cookies seguras marcadas con las directivas `HttpOnly` (inmunes a XSS), `Secure` (solo sobre HTTPS) y `SameSite=Strict` (mitigacion de Cross-Site Request Forgery, CSRF).
4. **Validacion de Autorizacion en el Backend (Zero Trust)**:
   - Cada peticion a recursos protegidos (creacion, edicion o eliminacion) debe validar criptograficamente el token de autorizacion en el servidor antes de ejecutar cualquier operacion sobre la base de datos.

---

## Comandos Disponibles

| Comando | Descripcion |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo Vite |
| `npm run server` | Ejecuta JSON Server en el puerto 3001 observando `db.json` |
| `npm run build` | Compila los paquetes optimizados para produccion en `/dist` |
| `npm run lint` | Ejecuta ESLint sobre el codigo fuente |
| `npm run preview` | Previsualiza localmente la compilacion de produccion |
