# checkit backend

API de gestor de tareas (Node.js + Express + MongoDB). Ver el README raíz para levantar backend + frontend juntos con Docker.

## Arranque local (sin Docker)

Requiere Node 22+ y una URI de MongoDB accesible.

```bash
cd backend
npm install
cp .env.example .env   # ajusta MONGODB_URI si no usas Docker para la BD
npm start
```

## Autenticación

Todas las rutas de `/api/tasks` requieren un JWT en el header `x-access-token`, obtenido de `/api/auth/signin` o `/api/auth/signup`.

- `POST /api/auth/signup` — `{ username, email, password, roles? }` (`roles` opcional, por defecto `["user"]`)
- `POST /api/auth/signin` — `{ email, password }`

## Tareas

Cada tarea pertenece a quien la creó — nadie más puede leerla, editarla ni borrarla.

- `POST /api/tasks` — `{ title, description?, status?, priority?, dueDate?, tags? }`
- `GET /api/tasks?status=&priority=&page=&limit=&sort=` — paginado, filtrable
- `GET /api/tasks/search?title=`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

`status`: `pending` | `in_progress` | `done`. `priority`: `low` | `medium` | `high`.

## Tests

```bash
npm test
```

Corre validaciones unitarias (zod, sin red) y un test de integración de ownership que requiere el stack corriendo (`docker compose up` desde la raíz) — si no está arriba, se salta solo en vez de fallar.

## Seguridad

Las credenciales viven en `.env` (ignorado por git), nunca en el código. Si en algún momento este repo tuvo un `config.json` con credenciales reales commiteadas, esas credenciales deben considerarse comprometidas y rotarse, sin importar que ya no estén en el working tree — siguen visibles en el historial de git.
