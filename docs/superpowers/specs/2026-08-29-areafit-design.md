# Diseño de la plataforma "AreaFit" (equipo de voleibol)

**Fecha:** 2026-08-29
**Estado:** Aprobado por el usuario

## Resumen

Plataforma web cerrada para el equipo de voleibol con dos secciones principales: un calendario de partidos/eventos con vista mensual y una sección de rutinas de gimnasio. Acceso exclusivo para integrantes del equipo mediante cuenta creada por el personal técnico. Interfaz en español.

## Arquitectura

- **Next.js 14 (App Router) + TypeScript**, UI con Tailwind CSS.
- **Supabase** como backend: Postgres + Auth (email/contraseña) + Row Level Security (RLS).
- **Despliegue en Vercel** con integración continua desde GitHub.
- Mutaciones a través de Server Actions con `revalidatePath`.

## Roles y permisos

- `admin`: gestiona usuarios y roles.
- `entrenador`: gestiona usuarios y roles.
- `deportista`: solo lectura de calendario y rutinas.

**Regla:** `admin` y `entrenador` tienen las mismas capacidades de gestión. No hay diferencias entre ambos más allá del rótulo.

### Alta de usuarios

- El admin o entrenador crea cada cuenta desde el panel (nombre, email, contraseña, rol) y entrega las credenciales al jugador.
- El primer administrador se crea manualmente una sola vez (SQL en Supabase).

### Matriz de permisos

| Acción | admin | entrenador | deportista |
| --- | --- | --- | --- |
| Ver calendario | ✅ | ✅ | ✅ |
| Crear/editar/eliminar eventos | ✅ | ✅ | ❌ |
| Ver rutinas | ✅ | ✅ | ✅ |
| Crear/editar/eliminar rutinas | ✅ | ✅ | ❌ |
| Crear cuentas / cambiar roles | ✅ | ✅ | ❌ |

## Modelo de datos

### `profiles`
- `id uuid PK` → referencia `auth.users(id)`, borrado en cascada.
- `full_name text NOT NULL`
- `role text NOT NULL` — `'admin' | 'entrenador' | 'deportista'`, default `'deportista'`
- `created_at timestamptz`

### `events`
- `id uuid PK`
- `title text NOT NULL`
- `event_type text NOT NULL` — `'partido' | 'entrenamiento' | 'evento'`
- `starts_at timestamptz NOT NULL`
- `location text NOT NULL default ''`
- `description text NOT NULL default ''`
- `created_by uuid` → referencia `profiles(id)`
- `created_at timestamptz`

### `routines`
- `id uuid PK`
- `title text NOT NULL`
- `description text NOT NULL default ''`
- `created_by uuid` → referencia `profiles(id)`
- `created_at timestamptz`

### `routine_exercises`
- `id uuid PK`
- `routine_id uuid NOT NULL` → referencia `routines(id)`, cascada
- `name text NOT NULL`
- `sets integer` (> 0)
- `reps text` (texto libre: "10-12", "2 min", "hasta fallo")
- `notes text NOT NULL default ''`
- `position integer NOT NULL default 0` (orden dentro de la rutina)

## Seguridad

- RLS habilitado en las cuatro tablas.
- Helper `public.is_staff()` (security definer): `true` si el rol del usuario autenticado es `admin` o `entrenador`.
- Lectura: cualquier miembro autenticado ve perfiles, eventos, rutinas y ejercicios.
- Escritura en eventos/rutinas/ejercicios y gestión de perfiles: solo `is_staff()`.
- Un usuario solo puede actualizar su propio perfil.
- `SUPABASE_SERVICE_ROLE_KEY` se usa únicamente en el servidor (alta/baja de cuentas; RLS no aplica a usuarios con rol de servicio).

## Páginas

1. **Login** — pantalla única de acceso con email y contraseña.
2. **Calendario** — vista mensual (semana empieza en lunes, estilo Google Calendar) + lista de próximos eventos. Detalle de evento con fecha larga en español, hora, lugar, tipo y descripción. Botones de editar/eliminar solo para staff.
3. **Rutinas** — lista de rutinas → detalle con ejercicios en orden (nombre, series × reps, notas). CRUD y editor de ejercicios solo para staff.
4. **Usuarios** (solo staff) — crear cuentas, cambiar rol, desactivar/eliminar.

## Reglas de UI

- Idioma: español en toda la interfaz.
- Estados vacíos en español: "No hay eventos este mes", "No hay eventos próximos".
- Errores de login en español: "Correo o contraseña incorrectos".
- Un staff no puede degradarse a sí mismo si es el único admin.

## Variables de entorno

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (solo servidor)

## Fuera de alcance (futuro)

- RSVP / confirmación de asistencia.
- Correos automáticos y notificaciones.
- Fotos/videos por ejercicio en rutinas.
- Chat entre miembros.