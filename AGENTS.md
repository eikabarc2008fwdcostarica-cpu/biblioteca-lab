# Agent Guidelines — Biblioteca Lab

## Comandos de verificación

| Acción | Comando |
| --- | --- |
| Levantar JSON Server | `npm run server` (http://localhost:3001) |
| Levantar dev server | `npm run dev` (http://localhost:5173) |
| Linter | `npm run lint` (oxlint) |
| Build de producción | `npm run build` |

## Workflow de verificación local

1. Abrir **una terminal** y ejecutar `npm run server` para levantar JSON Server.
2. Abrir **otra terminal** y ejecutar `npm run dev` para levantar Vite.
3. Correr `npm run lint` y `npm run build` para validar antes de commitear.

## Estructura clave

```
src/
├── components/   # TaskCard.jsx (reutilizable)
├── config/api.js # API_URL centralizado
├── context/      # AuthContext.jsx + useAuth
├── pages/        # Dashboard, Tasks, Courses, Reservations, Login, NotFound
├── router/       # Router.jsx (rutas protegidas)
├── layout/       # RootLayout.jsx
└── lib/api.js    # fetchJSON helper
```

## Autenticación simulada

- Login contra `GET /users?email=...&password=...`.
- El usuario se persiste en `localStorage` (`libraryUser`).
- `role` admin/user se controla del lado cliente (NO seguro en prod — ver README).
