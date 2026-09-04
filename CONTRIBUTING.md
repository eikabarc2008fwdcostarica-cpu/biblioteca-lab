# Guia de Contribucion al Proyecto

Agradecemos el interes en contribuir al Sistema de Gestion de Biblioteca y Laboratorio Academico. Para garantizar la consistencia, estabilidad y calidad del codigo fuente, todos los colaboradores deben adherirse a las siguientes directrices y estandares de ingenieria de software.

---

## 1. Modelo de Trabajo en Git

El repositorio sigue un modelo adaptado de Git Feature Branching para asegurar que la rama principal permanezca en un estado siempre desplegable.

### Estructura de Ramas

- `main`: Rama de produccion. Todo cambio incorporado debe ser estable, probado y haber superado la revision de codigo.
- `feature/<nombre-descriptivo>`: Ramas de corta duracion dedicadas al desarrollo de nuevas caracteristicas o componentes (ejemplo: `feature/register-module`, `feature/tasks-filter`).
- `fix/<nombre-descriptivo>`: Ramas para correccion de defectos reportados (ejemplo: `fix/auth-redirect-loop`).
- `docs/<nombre-descriptivo>`: Modificaciones exclusivas de documentacion tecnica o guias de usuario (ejemplo: `docs/contributing-guidelines`).

### Procedimiento de Trabajo

1. Asegurate de tener la ultima version de `main`:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Crea tu rama de trabajo con un identificador claro:
   ```bash
   git checkout -b feature/nombre-funcionalidad
   ```
3. Desarrolla tus modificaciones asegurando que cada commit sea atomico y autocontenido.
4. Antes de solicitar revision, sincroniza con `main` para resolver cualquier conflicto potencial:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

---

## 2. Estandar de Mensajes de Commit (Conventional Commits)

Todos los mensajes de confirmacion deben seguir la especificacion de **Conventional Commits v1.0.0**.

### Formato Requerido

```
<tipo>(<alcance-opcional>): <descripcion breve en presente e imperativo>

[cuerpo explicativo opcional detallando el motivo y contexto del cambio]
```

### Tipos Permitidos

- `feat`: Incorporacion de una nueva funcionalidad visible para el usuario (ejemplo: `feat(tasks): implementar alternancia de estado con PATCH`).
- `fix`: Correccion de un error de software o bug (ejemplo: `fix(auth): corregir sanitizacion de correo al registrar`).
- `docs`: Modificaciones en documentacion como README, CONTRIBUTING o comentarios de codigo.
- `style`: Ajustes esteticos y de formato (espaciado, CSS, tipografia) que no alteran la logica de ejecucion.
- `refactor`: Modificacion del codigo que no corrige bugs ni anade funcionalidades pero optimiza la arquitectura.
- `test`: Inclusion o ajuste de pruebas unitarias o de integracion.
- `chore`: Tareas de mantenimiento de configuracion, scripts de compilacion o actualizacion de dependencias.

---

## 3. Politica de Revision de Codigo (Pull Requests)

Ningun desarrollador debe integrar codigo directamente en la rama `main`. Toda incorporacion debe canalizarse mediante un **Pull Request (PR)** que cumpla con los siguientes criterios de aceptacion:

### Lista de Comprobacion previa a PR

- [ ] El codigo compila localmente de forma exitosa sin errores (`npm run build`).
- [ ] La verificacion estatica no reporta advertencias ni errores (`npm run lint`).
- [ ] No se incluyen archivos temporales, logs, credenciales ni claves privadas (`.env.local` debe permanecer ignorado).
- [ ] El diseno visual mantiene la coherencia con los lineamientos del sistema (paleta pizarra/azul corporativo, sin emojis, iconos Lucide).
- [ ] Se incluye una descripcion clara del cambio, motivos tecnicos y pasos para su verificacion manual.

### Revision Obligatoria entre Pares (Peer Review)

1. Todo PR debe ser revisado y aprobado por al menos un miembro del equipo antes de ser fusionado.
2. Los revisores deben comprobar la legibilidad del codigo, la adecuada gestion de estados en React y la integridad de las rutas protegidas.
3. Al aprobarse el PR, se realizara la fusion preferentemente mediante `Squash and Merge` o `Rebase and Merge` para conservar un historial lineal y limpio.
