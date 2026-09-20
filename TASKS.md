# checkit → gestor de tareas — task list

Reglas de esta ejecución: sin commits, seguir SOLID y buenas prácticas. Condición de fin: todo marcado.

## Fase 0 — Seguridad
- [ ] ⚠️ **PENDIENTE — requiere acción tuya**: rotar el password de MongoDB Atlas desde el panel de Atlas. El código ya no lo usa (ahora usa Mongo local vía Docker), pero la credencial vieja sigue en el historial de git y debe darse por comprometida hasta que la rotes.
- [x] Sacar `config.json` de git tracking y agregarlo a `.gitignore`
- [x] Mover `MONGODB_URI` y `SECRET` a variables de entorno (`.env` + `.env.example`)

## Fase 1 — Docker
- [x] Arreglar typo `evironment` → `environment` en docker-compose.yml
- [x] Agregar servicio `mongo` con volumen de persistencia
- [x] Conectar backend a mongo por red interna de compose, leyendo `.env`
- [x] Verificar que `docker-compose up` levanta todo sin nada instalado localmente

## Fase 2 — Autorización
- [x] Campo `owner` (ref User) en modelo `Task`
- [x] `verifyToken` en todas las rutas de tasks (incluido GET)
- [x] Filtrar find/update/delete por `owner`
- [x] Middleware `isAdmin` real usando el modelo `Role`

## Fase 3 — Core de gestor de tareas
- [x] `status` enum (`pending`/`in_progress`/`done`) reemplaza `done: Boolean`
- [x] Campos `dueDate`, `priority`
- [x] Campo `tags`
- [x] Paginación + filtros/orden en `findAllTask`

## Fase 4 — Calidad
- [x] Node LTS en Dockerfile, Mongoose actualizado
- [x] Quitar Babel/nodemon-exec, usar ESM nativo de Node
- [x] Validación de input con zod
- [x] README con instrucciones de arranque
- [x] Tests mínimos con `node:test` (signup/signin, create/update/delete task, ownership)

## Fase 5 — Frontend básico
Decisión: Vite + JS vanilla + Tailwind v4, sin framework (React/Astro descartados — la app es 100% interactiva, un framework de islas no aporta, y vanilla es más liviano que cargar un runtime que no se necesita).
- [x] Reestructurar repo en `backend/` + `frontend/`, `docker-compose.yml` orquestando ambos + mongo
- [x] Scaffold Vite vanilla + Tailwind v4 (`@tailwindcss/vite`, sin postcss.config)
- [x] Vista de login/signup contra `/api/auth`
- [x] Vista de tareas: crear, listar con filtro por status, avanzar status, borrar — contra `/api/tasks`
- [x] Token en localStorage, `VITE_API_URL` configurable por `.env`
- [x] Verificar `docker compose up` levanta frontend+backend+mongo juntos y el flujo funciona en el navegador (probado: signup, crear tarea, avanzar estado — CORS fue el único bug real, ya corregido con el paquete `cors`)

## Fase 6 — Backend a TypeScript
Decisión: TS en backend (Node 22+ corre `.ts` nativo, sin build step ni `ts-node`); frontend se queda en JS por ahora — Vite lo migra gratis cuando haga falta.
- [x] `tsconfig.json` (strict, NodeNext, `allowImportingTsExtensions` + `noEmit` — se ejecuta el `.ts` directo, `tsc` solo para type-check)
- [x] Modelos tipados (`InferSchemaType` de Mongoose) + tipos compartidos (`RoleName`, `TaskStatus`, `TaskPriority`) para que Mongoose/zod no diverjan
- [x] `Request`/`Response` tipados en controllers y middlewares; `req.userId` vía augmentation de Express
- [x] Statics de password (`encryptPassword`/`comparePassword`) movidos a `utils/password.ts` — más fácil de tipar y de testear que statics de Mongoose
- [x] `npm run typecheck` (`tsc --noEmit`) + `npm test` corriendo ambos, 0 errores
- [x] Verificado en Docker (`node:22-alpine` corre `.ts` nativo sin flags) y contra el stack real

## Fase 7 — UX/UI del frontend (revisado en navegador real)
- [x] `<label>` visibles en el form de auth, `sr-only` en el de tareas (antes solo placeholder — gap de accesibilidad real)
- [x] Botones de submit se deshabilitan y muestran estado de carga mientras la petición está en curso (evita doble-submit)
- [x] Confirmación nativa antes de borrar una tarea (acción irreversible)
- [x] Mensajes de error de red amigables en vez de "Failed to fetch" crudo
- [x] El email se mantiene en el form tras un login fallido (la contraseña se limpia, por seguridad)
- [x] `aria-pressed`/`aria-selected`/`role="alert"` en filtros, tabs y errores
- [x] Verificado responsive a 375px y foco de teclado visible
