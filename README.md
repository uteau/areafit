# AreaFit

Plataforma web cerrada para el equipo de voleibol: calendario mensual de partidos y eventos, y rutinas de gimnasio. Acceso exclusivo para integrantes mediante cuenta creada por el personal técnico. Interfaz en español.

## Requisitos

- Node.js 20+.
- Proyecto Supabase (Postgres + Auth + RLS).

## Variables de entorno

Copia `.env.example` a `.env.local` y completa los valores desde el panel de Supabase:

| Variable | Dónde encontrarla en Supabase |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Project Settings → API → Project API keys → Publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → Project API keys → Service role key (solo se usa en el servidor; nunca la expongas al cliente) |

## Base de datos

1. Ejecuta el contenido de `supabase/migrations/0001_init.sql` en el SQL editor del panel de Supabase (o `supabase db push` si usas la CLI).
2. Crea el primer administrador:
   - Crea una cuenta en `Authentication → Users → Add user`.
   - Inserta su perfil con rol `admin`:

     ```sql
     insert into public.profiles (id, full_name, role)
     select id, 'Administrador', 'admin' from auth.users limit 1;
     ```

3. Verifica: `select * from public.profiles;` devuelve al menos el admin y `select public.is_staff();` devuelve `true` con su sesión.

## Comandos

```bash
npm run dev      # desarrollo
npm test         # tests (Vitest)
npm run lint     # ESLint
npm run build    # build de producción
```

## Despliegue en Vercel

1. Importa el repositorio desde GitHub en [vercel.com/new](https://vercel.com/new).
2. Añade las 3 variables de entorno (`Next.js` como framework, build por defecto).
3. Aplica la migración en la base de datos de producción y crea el primer admin (pasos de la sección Base de datos).