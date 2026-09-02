-- Tabla de grupos de jugadores
create table public.player_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null default '',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- Membresía N:M jugador ↔ grupo
create table public.player_group_members (
  group_id uuid not null references public.player_groups(id) on delete cascade,
  player_id uuid not null references public.profiles(id) on delete cascade,
  primary key (group_id, player_id)
);

-- Columnas de asignación en routines
alter table public.routines
  add column assigned_to_player uuid references public.profiles(id),
  add column assigned_to_group uuid references public.player_groups(id);

-- Constraint: exactamente una asignación
alter table public.routines
  add constraint routine_assignment_check
  check (
    (assigned_to_player is not null and assigned_to_group is null)
    or
    (assigned_to_player is null and assigned_to_group is not null)
  );

-- RLS para player_groups
alter table public.player_groups enable row level security;

create policy player_groups_select on public.player_groups
  for select to authenticated using (true);

create policy player_groups_insert_staff on public.player_groups
  for insert to authenticated with check (public.is_staff());

create policy player_groups_update_staff on public.player_groups
  for update to authenticated using (public.is_staff());

create policy player_groups_delete_staff on public.player_groups
  for delete to authenticated using (public.is_staff());

-- RLS para player_group_members
alter table public.player_group_members enable row level security;

create policy player_group_members_select on public.player_group_members
  for select to authenticated using (true);

create policy player_group_members_insert_staff on public.player_group_members
  for insert to authenticated with check (public.is_staff());

create policy player_group_members_delete_staff on public.player_group_members
  for delete to authenticated using (public.is_staff());

-- Actualizar política SELECT de routines para deportistas
drop policy if exists routines_select on public.routines;

create policy routines_select_staff on public.routines
  for select to authenticated
  using (public.is_staff());

create policy routines_select_player on public.routines
  for select to authenticated
  using (
    assigned_to_player = auth.uid()
    or assigned_to_group in (
      select group_id from public.player_group_members where player_id = auth.uid()
    )
  );
