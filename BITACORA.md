# 📓 Bitácora de desarrollo

Registro colaborativo del desarrollo de **Biblioteca Lab**, llevado a cabo por el
equipo bajo la metodología **Vibe Coding**. Cada integrante registra a continuación
qué se generó con la IA y qué se corrigió manualmente en cada iteración.

> Las fechas/hora están en zona horaria local del equipo. Usar el formato
> `YYYY-MM-DD HH:MM`.

---

## Plantilla de registro

Copiar y rellenar una nueva fila por cada iteración/significant change:

```markdown
| Fecha/Hora | Integrante | Funcionalidad | Prompt Utilizado | Qué Generó la IA | Qué se Corrigió Manualmente |
|------------|------------|---------------|-------------------|-------------------|------------------------------|
| 2025-01-01 10:00 | Ana | AuthContext | "Actúa como..." | [descripción] | [descripción] |
```

---

## Historico

| Fecha/Hora | Integrante | Funcionalidad | Prompt Utilizado | Qué Generó la IA | Qué se Corrigió Manualmente |
|------------|------------|---------------|-------------------|-------------------|------------------------------|
| _pendiente_ | _ — _ | _Estructura base (Vite + React)_ | `_prompt de scaffold_` | `npm create vite@latest`, dependencias base | Añadidos react-router-dom y json-server, creación de carpetas src/context, src/pages, src/components, src/router, src/lib, src/config |
| _pendiente_ | _ — _ | AuthContext simulado | Prompt 1 / Dashboard | Contexto con `user`, `login`, `logout` y persistencia en localStorage | Validaciones de credenciales vacías y manejo de errores de red |
| _pendiente_ | _ — _ | Módulo de Tareas | Prompt 1 | `TaskCard.jsx` + `Tasks.jsx` con filtro, toggle PATCH, formulario admin POST y DELETE | Validaciones de formulario (título/assignee obligatorios), actualización optimista del estado local |
| _pendiente_ | _ — _ | Dashboard general | Prompt 2 | `Dashboard.jsx` con carga paralela (Promise.all) y métricas | Badge de rol, enlaces de navegación con Link, manejo de estados de carga |
| _pendiente_ | _ — _ | Documentación | Prompt 3 | `README.md` y plantilla `BITACORA.md` | Revisión de tabla de credenciales y sección de seguridad |
