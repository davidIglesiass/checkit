# checkit

Gestor de tareas: API en Node.js/Express/MongoDB (`backend/`) + frontend en JS vanilla + Tailwind (`frontend/`, sin framework — la app es pequeña y no lo necesita).

## Arranque rápido (Docker, sin nada instalado localmente)

```bash
cp backend/.env.example backend/.env   # y reemplaza JWT_SECRET por un valor propio
cp frontend/.env.example frontend/.env
docker compose up
```

- Frontend: http://localhost:5173
- API: http://localhost:4000
- MongoDB: persistida en un volumen, con roles `user`/`admin` sembrados al primer arranque

## Detalles por paquete

- [`backend/README.md`](backend/README.md) — endpoints, autenticación, tests
- `frontend/` — Vite + JS vanilla + Tailwind v4, sin router ni framework de UI; habla con el backend vía `VITE_API_URL`

## Seguridad

Las credenciales viven en `.env` (ignorado por git en cualquier subcarpeta), nunca en el código.
