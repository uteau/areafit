create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'deportista'
    check (role in ('admin','entrenador','deportista')),
  created_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_type text not null check (event_type in ('partido','entrenamiento','evento')),
  starts_at timestamptz not null,
  location text not null default '',
  description text not null default '',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.routines (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.routine_exercises (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references public.routines(id) on delete cascade,
  name text not null,
  sets integer check (sets > 0),
  reps text,
  notes text not null default '',
  position integer not null default 0
);

create index events_starts_at_idx on public.events(starts_at);
create index routine_exercises_routine_idx on public.routine_exercises(routine_id);

create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','entrenador'))
$$;

alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.routines enable row level security;
alter table public.routine_exercises enable row level security;

create policy profiles_select on public.profiles for select to authenticated using (true);
create policy profiles_update_own on public.profiles for update to authenticated using (id = auth.uid());
create policy profiles_update_staff on public.profiles for update to authenticated using (public.is_staff());
create policy profiles_insert_staff on public.profiles for insert to authenticated with check (public.is_staff());
create policy profiles_delete_staff on public.profiles for delete to authenticated using (public.is_staff());

create policy events_select on public.events for select to authenticated using (true);
create policy events_insert_staff on public.events for insert to authenticated with check (public.is_staff());
create policy events_update_staff on public.events for update to authenticated using (public.is_staff());
create policy events_delete_staff on public.events for delete to authenticated using (public.is_staff());

create policy routines_select on public.routines for select to authenticated using (true);
create policy routines_insert_staff on public.routines for insert to authenticated with check (public.is_staff());
create policy routines_update_staff on public.routines for update to authenticated using (public.is_staff());
create policy routines_delete_staff on public.routines for delete to authenticated using (public.is_staff());

create policy exercises_select on public.routine_exercises for select to authenticated using (true);
create policy exercises_insert_staff on public.routine_exercises for insert to authenticated with check (public.is_staff());
create policy exercises_update_staff on public.routine_exercises for update to authenticated using (public.is_staff());
create policy exercises_delete_staff on public.routine_exercises for delete to authenticated using (public.is_staff());