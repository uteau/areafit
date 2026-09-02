# Rutinas Asignadas con Grupos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminar rutinas generales y agregar sistema de asignación de rutinas a jugadores individuales o grupos de jugadores, con CRUD de grupos y visibilidad filtrada por asignación.

**Architecture:** Nuevas tablas `player_groups` y `player_group_members` en Supabase; columnas `assigned_to_player` y `assigned_to_group` en `routines`; RLS filtrado por asignación para deportistas; CRUD completo de grupos con UI dedicada; formulario de rutina extendido con selector de asignación.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, `@supabase/ssr`, `@supabase/supabase-js`.

**Spec:** `/home/uteau/.opencode/plans/2026-09-02-rutinas-asignadas-design.md`

## Global Constraints

- Interfaz completa en español.
- Roles: `admin`, `entrenador`, `deportista`. `admin` y `entrenador` comparten todas las capacidades de gestión.
- Deportista: solo ve rutinas asignadas a él o a sus grupos; nunca ve botones de escritura.
- Una rutina tiene exactamente una asignación: a 1 jugador O a 1 grupo (mutuamente exclusivo).
- Estados vacíos y errores en español.
- Seguir los patrones existentes de `lib/db/*.ts`, `actions/*.ts`, componentes y pages.

---

### Task 1: Migración de BD — tablas de grupos y columnas de asignación

**Files:**
- Create: `supabase/migrations/0002_routine_assignments.sql`

**Interfaces:**
- Consumes: esquema actual (`profiles`, `routines`, `routine_exercises`, función `is_staff()`).
- Produces: tablas `player_groups`, `player_group_members`; columnas `assigned_to_player`, `assigned_to_group` en `routines`; RLS actualizado.

- [ ] **Step 1: Crear archivo de migración**

Create `supabase/migrations/0002_routine_assignments.sql`:

```sql
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
```

- [ ] **Step 2: Verificar que la migración es válida**

Run: `ls supabase/migrations/0002_routine_assignments.sql`
Expected: file exists.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/0002_routine_assignments.sql
git commit -m "feat(db): add player groups and routine assignment columns"
```

---

### Task 2: Tipos TypeScript — PlayerGroup, PlayerGroupMember, Routine actualizado

**Files:**
- Modify: `lib/types.ts`

**Interfaces:**
- Consumes: esquema de tablas de Task 1.
- Produces: tipos `PlayerGroup`, `PlayerGroupMember`, tipo `Routine` actualizado (usados por todas las Tasks siguientes).

- [ ] **Step 1: Agregar tipos de grupos y actualizar Routine**

Add to `lib/types.ts` (después de `Exercise`):

```ts
export interface PlayerGroup {
  id: string
  name: string
  description: string
  created_by: string | null
  created_at: string
}

export interface PlayerGroupMember {
  group_id: string
  player_id: string
}
```

Modify the `Routine` interface to add assignment fields:

```ts
export interface Routine {
  id: string
  title: string
  description: string
  created_by: string | null
  assigned_to_player: string | null
  assigned_to_group: string | null
  created_at: string
}
```

- [ ] **Step 2: Verificar que TypeScript compila**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "feat(types): add PlayerGroup, PlayerGroupMember, update Routine"
```

---

### Task 3: DB functions para grupos (`lib/db/groups.ts`)

**Files:**
- Create: `lib/db/groups.ts`

**Interfaces:**
- Consumes: tipos de Task 2, `createClient` de `@/lib/supabase/server`.
- Produces: funciones `listGroups`, `getGroup`, `createGroup`, `updateGroup`, `deleteGroup`, `addGroupMember`, `removeGroupMember`, `getPlayerGroups` (usadas por Actions en Task 5 y Pages en Tasks 11-13).

- [ ] **Step 1: Crear archivo con todas las funciones de DB para grupos**

Create `lib/db/groups.ts`:

```ts
import { createClient } from '@/lib/supabase/server'
import type { PlayerGroup, Profile } from '@/lib/types'

export async function listGroups(): Promise<(PlayerGroup & { member_count: number })[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('player_groups')
    .select('*, member_count:player_group_members(count)')
    .order('name', { ascending: true })
  return ((data as unknown) ?? []).map((g: any) => ({
    ...g,
    member_count: g.member_count?.count ?? 0,
  })) as (PlayerGroup & { member_count: number })[]
}

export async function getGroup(id: string): Promise<(PlayerGroup & { members: Profile[] }) | null> {
  const supabase = await createClient()
  const { data: group } = await supabase
    .from('player_groups')
    .select('*')
    .eq('id', id)
    .single()
  if (!group) return null
  const { data: memberships } = await supabase
    .from('player_group_members')
    .select('player_id')
    .eq('group_id', id)
  if (!memberships || memberships.length === 0) {
    return { ...(group as PlayerGroup), members: [] }
  }
  const playerIds = memberships.map((m) => m.player_id)
  const { data: players } = await supabase
    .from('profiles')
    .select('*')
    .in('id', playerIds)
  return {
    ...(group as PlayerGroup),
    members: (players as Profile[]) ?? [],
  }
}

export async function createGroup(input: { name: string; description: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('player_groups').insert({
    ...input,
    created_by: user?.id ?? null,
  })
  if (error) throw new Error('No se pudo crear el grupo')
}

export async function updateGroup(id: string, input: { name: string; description: string }) {
  const supabase = await createClient()
  const { error } = await supabase.from('player_groups').update(input).eq('id', id)
  if (error) throw new Error('No se pudo actualizar el grupo')
}

export async function deleteGroup(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('player_groups').delete().eq('id', id)
  if (error) throw new Error('No se pudo eliminar el grupo')
}

export async function addGroupMember(groupId: string, playerId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('player_group_members')
    .insert({ group_id: groupId, player_id: playerId })
  if (error) throw new Error('No se pudo agregar el miembro')
}

export async function removeGroupMember(groupId: string, playerId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('player_group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('player_id', playerId)
  if (error) throw new Error('No se pudo eliminar el miembro')
}

export async function getPlayerGroups(playerId: string): Promise<PlayerGroup[]> {
  const supabase = await createClient()
  const { data: memberships } = await supabase
    .from('player_group_members')
    .select('group_id')
    .eq('player_id', playerId)
  if (!memberships || memberships.length === 0) return []
  const groupIds = memberships.map((m) => m.group_id)
  const { data: groups } = await supabase
    .from('player_groups')
    .select('*')
    .in('id', groupIds)
  return (groups as PlayerGroup[]) ?? []
}
```

- [ ] **Step 2: Verificar que TypeScript compila**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add lib/db/groups.ts
git commit -m "feat(db): add player groups query functions"
```

---

### Task 4: DB functions para rutinas — actualizar para soporte de asignación

**Files:**
- Modify: `lib/db/routines.ts`

**Interfaces:**
- Consumes: tipos de Task 2.
- Produces: `listRoutines` actualizada, nueva `listRoutinesForPlayer`, `createRoutine`/`updateRoutine` con asignación (usadas por Actions en Task 5 y Pages en Tasks 14-17).

- [ ] **Step 1: Actualizar funciones existentes y agregar listRoutinesForPlayer**

Modify `lib/db/routines.ts` — update `createRoutine` and `updateRoutine` to accept assignment fields, and add `listRoutinesForPlayer`:

Replace the `createRoutine` function:

```ts
export async function createRoutine(input: {
  title: string
  description: string
  assigned_to_player?: string | null
  assigned_to_group?: string | null
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('routines').insert({
    title: input.title,
    description: input.description,
    created_by: user?.id ?? null,
    assigned_to_player: input.assigned_to_player ?? null,
    assigned_to_group: input.assigned_to_group ?? null,
  })
  if (error) throw new Error('No se pudo crear la rutina')
}
```

Replace the `updateRoutine` function:

```ts
export async function updateRoutine(
  id: string,
  input: {
    title: string
    description: string
    assigned_to_player?: string | null
    assigned_to_group?: string | null
  }
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('routines')
    .update({
      title: input.title,
      description: input.description,
      assigned_to_player: input.assigned_to_player ?? null,
      assigned_to_group: input.assigned_to_group ?? null,
    })
    .eq('id', id)
  if (error) throw new Error('No se pudo actualizar la rutina')
}
```

Add the new `listRoutinesForPlayer` function (after `listRoutines`):

```ts
export async function listRoutinesForPlayer(
  playerId: string
): Promise<(Routine & { exercise_count: number })[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('routines')
    .select('*, exercise_count:routine_exercises(count)')
    .or(`assigned_to_player.eq.${playerId},assigned_to_group.in.(select group_id from player_group_members where player_id='${playerId}')`)
    .order('created_at', { ascending: false })
  return ((data as unknown) ?? []).map((r: any) => ({
    ...r,
    exercise_count: r.exercise_count?.count ?? 0,
  })) as (Routine & { exercise_count: number })[]
}
```

- [ ] **Step 2: Verificar que TypeScript compila**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add lib/db/routines.ts
git commit -m "feat(db): update routines to support player/group assignment"
```

---

### Task 5: Server Actions — acciones para grupos y actualización de acciones de rutinas

**Files:**
- Create: `actions/groups.ts`
- Modify: `actions/routines.ts`

**Interfaces:**
- Consumes: funciones de DB de Tasks 3-4, `currentProfile` de `@/lib/db/users`, `isStaff` de `@/lib/access`.
- Produces: server actions `createGroup`, `updateGroup`, `deleteGroup`, `addGroupMember`, `removeGroupMember` (usadas por Pages en Tasks 11-13); actions de rutinas actualizadas (usadas por Pages en Tasks 14-17).

- [ ] **Step 1: Crear server actions para grupos**

Create `actions/groups.ts`:

```ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile } from '@/lib/db/users'
import {
  createGroup as dbCreateGroup,
  updateGroup as dbUpdateGroup,
  deleteGroup as dbDeleteGroup,
  addGroupMember as dbAddGroupMember,
  removeGroupMember as dbRemoveGroupMember,
} from '@/lib/db/groups'
import type { Role } from '@/lib/types'

function assertStaff(role: Role | null | undefined) {
  if (!isStaff(role)) throw new Error('No tienes permisos')
}

export async function createGroup(formData: FormData) {
  const profile = await currentProfile()
  assertStaff(profile?.role)

  const name = String(formData.get('name')).trim()
  if (!name) throw new Error('El nombre es obligatorio')
  await dbCreateGroup({
    name,
    description: String(formData.get('description') ?? ''),
  })
  revalidatePath('/grupos')
  redirect('/grupos')
}

export async function updateGroup(id: string, formData: FormData) {
  const profile = await currentProfile()
  assertStaff(profile?.role)

  const name = String(formData.get('name')).trim()
  if (!name) throw new Error('El nombre es obligatorio')
  await dbUpdateGroup(id, {
    name,
    description: String(formData.get('description') ?? ''),
  })
  revalidatePath('/grupos')
  revalidatePath(`/grupos/${id}`)
  redirect(`/grupos/${id}`)
}

export async function deleteGroup(id: string) {
  const profile = await currentProfile()
  assertStaff(profile?.role)

  await dbDeleteGroup(id)
  revalidatePath('/grupos')
  redirect('/grupos')
}

export async function addGroupMember(groupId: string, playerId: string) {
  const profile = await currentProfile()
  assertStaff(profile?.role)

  await dbAddGroupMember(groupId, playerId)
  revalidatePath(`/grupos/${groupId}`)
}

export async function removeGroupMember(groupId: string, playerId: string) {
  const profile = await currentProfile()
  assertStaff(profile?.role)

  await dbRemoveGroupMember(groupId, playerId)
  revalidatePath(`/grupos/${groupId}`)
}
```

- [ ] **Step 2: Actualizar actions de rutinas para aceptar asignación**

Modify `actions/routines.ts` — update `createRoutine` and `updateRoutine` to parse and pass assignment fields:

Replace the `createRoutine` function:

```ts
export async function createRoutine(formData: FormData) {
  const profile = await currentProfile()
  assertStaff(profile?.role)

  const title = String(formData.get('title'))
  if (!title) throw new Error('El título es obligatorio')

  const assignmentType = formData.get('assignment_type') as string | null
  const assignedToPlayer = assignmentType === 'player'
    ? (String(formData.get('assigned_to_player')) || null)
    : null
  const assignedToGroup = assignmentType === 'group'
    ? (String(formData.get('assigned_to_group')) || null)
    : null

  await dbCreateRoutine({
    title,
    description: String(formData.get('description') ?? ''),
    assigned_to_player: assignedToPlayer,
    assigned_to_group: assignedToGroup,
  })
  revalidatePath('/rutinas')
  redirect('/rutinas')
}
```

Replace the `updateRoutine` function:

```ts
export async function updateRoutine(id: string, formData: FormData) {
  const profile = await currentProfile()
  assertStaff(profile?.role)

  const assignmentType = formData.get('assignment_type') as string | null
  const assignedToPlayer = assignmentType === 'player'
    ? (String(formData.get('assigned_to_player')) || null)
    : null
  const assignedToGroup = assignmentType === 'group'
    ? (String(formData.get('assigned_to_group')) || null)
    : null

  await dbUpdateRoutine(id, {
    title: String(formData.get('title')),
    description: String(formData.get('description') ?? ''),
    assigned_to_player: assignedToPlayer,
    assigned_to_group: assignedToGroup,
  })
  revalidatePath('/rutinas')
  revalidatePath(`/rutinas/${id}`)
  redirect(`/rutinas/${id}`)
}
```

- [ ] **Step 3: Verificar que TypeScript compila**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 4: Commit**

```bash
git add actions/groups.ts actions/routines.ts
git commit -m "feat(actions): add group CRUD and update routine actions for assignment"
```

---

### Task 6: Icono para grupos

**Files:**
- Modify: `components/icons.tsx`

**Interfaces:**
- Consumes: nada.
- Produces: `IconUsersGroup` (usado por Sidebar en Task 7 y GroupForm en Task 8).

- [ ] **Step 1: Agregar icono IconUsersGroup**

Add to `components/icons.tsx` (before `IconMenu`):

```tsx
export function IconUsersGroup({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="7" cy="9" r="3" />
      <path d="M2.5 18a4 4 0 0 1 8 0" />
      <circle cx="17" cy="9" r="3" />
      <path d="M14 18a4 4 0 0 1 8 0" />
    </svg>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/icons.tsx
git commit -m "feat(ui): add IconUsersGroup icon"
```

---

### Task 7: Sidebar — agregar enlace "Grupos"

**Files:**
- Modify: `components/sidebar.tsx`

**Interfaces:**
- Consumes: `IconUsersGroup` de Task 6.
- Produces: sidebar con enlace "Grupos" visible para staff.

- [ ] **Step 1: Agregar import de IconUsersGroup y enlace en navItems**

In `components/sidebar.tsx`, update the imports to include `IconUsersGroup`:

```tsx
import {
  IconCalendar,
  IconDumbbell,
  IconLogOut,
  IconMenu,
  IconUsers,
  IconUsersGroup,
  IconX,
} from '@/components/icons'
```

Update the `navItems` function to include "Grupos":

```tsx
function navItems(role: Role) {
  const base: { href: string; label: string; icon: typeof IconCalendar }[] = [
    { href: '/calendario', label: 'Calendario', icon: IconCalendar },
    { href: '/rutinas', label: 'Rutinas', icon: IconDumbbell },
  ]
  if (isStaff(role)) {
    base.push({ href: '/grupos', label: 'Grupos', icon: IconUsersGroup })
    base.push({ href: '/usuarios', label: 'Equipo', icon: IconUsers })
  }
  return base
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sidebar.tsx
git commit -m "feat(ui): add Grupos link to sidebar for staff"
```

---

### Task 8: Componente GroupForm

**Files:**
- Create: `components/group-form.tsx`

**Interfaces:**
- Consumes: tipo `PlayerGroup` de Task 2.
- Produces: componente `GroupForm` (usado por pages de crear/editar grupo en Tasks 11-12).

- [ ] **Step 1: Crear componente GroupForm**

Create `components/group-form.tsx`:

```tsx
import type { PlayerGroup } from '@/lib/types'

export function GroupForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (formData: FormData) => void
  defaults?: Pick<PlayerGroup, 'name' | 'description'>
  submitLabel: string
}) {
  return (
    <form action={action} className="panel max-w-lg space-y-4 p-6">
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
        <span>Nombre</span>
        <input name="name" required defaultValue={defaults?.name ?? ''} className="field" />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
        <span>Descripción</span>
        <textarea
          name="description"
          rows={3}
          defaultValue={defaults?.description ?? ''}
          className="field"
        />
      </label>

      <button type="submit" className="btn btn-primary">
        {submitLabel}
      </button>
    </form>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/group-form.tsx
git commit -m "feat(ui): add GroupForm component"
```

---

### Task 9: Componente GroupMemberManager

**Files:**
- Create: `components/group-member-manager.tsx`

**Interfaces:**
- Consumes: tipo `Profile` de Task 2, server actions `addGroupMember`/`removeGroupMember` de Task 5.
- Produces: componente `GroupMemberManager` (usado por page de detalle de grupo en Task 13).

- [ ] **Step 1: Crear componente GroupMemberManager**

Create `components/group-member-manager.tsx`:

```tsx
'use client'

import { useTransition } from 'react'
import { addGroupMember, removeGroupMember } from '@/actions/groups'
import type { Profile } from '@/lib/types'

export function GroupMemberManager({
  groupId,
  members,
  allPlayers,
}: {
  groupId: string
  members: Profile[]
  allPlayers: Profile[]
}) {
  const [pending, startTransition] = useTransition()

  const memberIds = new Set(members.map((m) => m.id))
  const available = allPlayers.filter((p) => !memberIds.has(p.id))

  function handleAdd(playerId: string) {
    startTransition(async () => {
      await addGroupMember(groupId, playerId)
    })
  }

  function handleRemove(playerId: string) {
    startTransition(async () => {
      await removeGroupMember(groupId, playerId)
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="readout text-xl">Miembros</h2>

      {members.length === 0 ? (
        <p className="text-sm font-medium text-lit/45">No hay miembros en este grupo</p>
      ) : (
        <ul className="space-y-2">
          {members.map((player) => (
            <li
              key={player.id}
              className="flex items-center justify-between rounded-lg border border-seam bg-cabinet p-3"
            >
              <span className="text-sm font-semibold text-lit">{player.full_name}</span>
              <button
                type="button"
                disabled={pending}
                onClick={() => handleRemove(player.id)}
                className="btn btn-ghost text-xs text-red-400 hover:text-red-300"
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}

      {available.length > 0 ? (
        <div className="rounded-lg border border-dashed border-seam-bright bg-cabinet/60 p-4">
          <p className="mb-3 text-sm font-bold text-lit/80">Agregar miembro</p>
          <div className="flex flex-wrap gap-2">
            {available.map((player) => (
              <button
                key={player.id}
                type="button"
                disabled={pending}
                onClick={() => handleAdd(player.id)}
                className="btn btn-ghost text-xs"
              >
                + {player.full_name}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/group-member-manager.tsx
git commit -m "feat(ui): add GroupMemberManager component"
```

---

### Task 10: Componentes de asignación de rutina (RoutineAssignmentSelect, RoutineAssignmentBadge)

**Files:**
- Create: `components/routine-assignment-select.tsx`
- Create: `components/routine-assignment-badge.tsx`

**Interfaces:**
- Consumes: tipos `PlayerGroup`, `Profile` de Task 2.
- Produces: `RoutineAssignmentSelect` (formulario, usado por Task 16), `RoutineAssignmentBadge` (visual, usado por Tasks 14-15, 17).

- [ ] **Step 1: Crear RoutineAssignmentSelect**

Create `components/routine-assignment-select.tsx`:

```tsx
'use client'

import { useState } from 'react'
import type { PlayerGroup, Profile } from '@/lib/types'

export function RoutineAssignmentSelect({
  players,
  groups,
  defaults,
}: {
  players: Profile[]
  groups: PlayerGroup[]
  defaults?: {
    assigned_to_player: string | null
    assigned_to_group: string | null
  }
}) {
  const initialType = defaults?.assigned_to_player
    ? 'player'
    : defaults?.assigned_to_group
      ? 'group'
      : 'none'

  const [assignmentType, setAssignmentType] = useState<string>(initialType)

  return (
    <div className="space-y-3">
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
        <span>Asignar a</span>
        <select
          name="assignment_type"
          value={assignmentType}
          onChange={(e) => setAssignmentType(e.target.value)}
          className="field"
        >
          <option value="none">Sin asignar</option>
          <option value="player">Jugador individual</option>
          <option value="group">Grupo</option>
        </select>
      </label>

      {assignmentType === 'player' ? (
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
          <span>Jugador</span>
          <select
            name="assigned_to_player"
            defaultValue={defaults?.assigned_to_player ?? ''}
            className="field"
          >
            <option value="">Seleccionar jugador…</option>
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.full_name}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {assignmentType === 'group' ? (
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
          <span>Grupo</span>
          <select
            name="assigned_to_group"
            defaultValue={defaults?.assigned_to_group ?? ''}
            className="field"
          >
            <option value="">Seleccionar grupo…</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 2: Crear RoutineAssignmentBadge**

Create `components/routine-assignment-badge.tsx`:

```tsx
import type { PlayerGroup, Profile } from '@/lib/types'

export function RoutineAssignmentBadge({
  assignedToPlayer,
  assignedToGroup,
  playerMap,
  groupMap,
}: {
  assignedToPlayer: string | null
  assignedToGroup: string | null
  playerMap?: Map<string, string>
  groupMap?: Map<string, string>
}) {
  if (!assignedToPlayer && !assignedToGroup) {
    return (
      <span className="inline-flex items-center rounded-full bg-plate px-2.5 py-0.5 text-xs font-semibold text-lit/50">
        Sin asignar
      </span>
    )
  }

  if (assignedToPlayer) {
    const name = playerMap?.get(assignedToPlayer) ?? 'Jugador'
    return (
      <span className="inline-flex items-center rounded-full bg-lamp/15 px-2.5 py-0.5 text-xs font-semibold text-lamp">
        Personal · {name}
      </span>
    )
  }

  if (assignedToGroup) {
    const name = groupMap?.get(assignedToGroup) ?? 'Grupo'
    return (
      <span className="inline-flex items-center rounded-full bg-sky-500/15 px-2.5 py-0.5 text-xs font-semibold text-sky-400">
        Grupo · {name}
      </span>
    )
  }

  return null
}
```

- [ ] **Step 3: Commit**

```bash
git add components/routine-assignment-select.tsx components/routine-assignment-badge.tsx
git commit -m "feat(ui): add routine assignment select and badge components"
```

---

### Task 11: Página lista de grupos (`/grupos`)

**Files:**
- Create: `app/(app)/grupos/page.tsx`

**Interfaces:**
- Consumes: `listGroups` de Task 3, `currentProfile` de `@/lib/db/users`, `isStaff` de `@/lib/access`.
- Produces: página de lista de grupos.

- [ ] **Step 1: Crear page de lista de grupos**

Create `app/(app)/grupos/page.tsx`:

```tsx
import Link from 'next/link'
import { listGroups } from '@/lib/db/groups'
import { currentProfile } from '@/lib/db/users'
import { isStaff } from '@/lib/access'
import { PageHeader } from '@/components/page-header'
import { IconPlus } from '@/components/icons'

export default async function GruposPage() {
  const [groups, profile] = await Promise.all([listGroups(), currentProfile()])
  const staff = isStaff(profile?.role ?? null)

  return (
    <div>
      <PageHeader title="Grupos">
        {staff ? (
          <Link href="/grupos/new" className="btn btn-primary">
            <IconPlus size={16} />
            Nuevo grupo
          </Link>
        ) : null}
      </PageHeader>

      {groups.length === 0 ? (
        <p className="text-sm font-medium text-lit/45">No hay grupos todavía</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((group) => (
            <Link
              key={group.id}
              href={`/grupos/${group.id}`}
              className="rounded-xl border border-seam bg-cabinet p-5 transition-colors hover:border-seam-bright"
            >
              <h2 className="readout text-lg">{group.name}</h2>
              {group.description ? (
                <p className="mt-1 truncate text-sm text-lit/55">{group.description}</p>
              ) : null}
              <p className="mt-3 text-xs font-semibold text-lit/45">
                {group.member_count} {group.member_count === 1 ? 'miembro' : 'miembros'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
mkdir -p app/\(app\)/grupos
git add app/\(app\)/grupos/page.tsx
git commit -m "feat(pages): add groups list page"
```

---

### Task 12: Página crear grupo (`/grupos/new`)

**Files:**
- Create: `app/(app)/grupos/new/page.tsx`

**Interfaces:**
- Consumes: `createGroup` de Task 5, `GroupForm` de Task 8.
- Produces: página de creación de grupo.

- [ ] **Step 1: Crear page de crear grupo**

Create `app/(app)/grupos/new/page.tsx`:

```tsx
import { redirect } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile } from '@/lib/db/users'
import { createGroup } from '@/actions/groups'
import { GroupForm } from '@/components/group-form'
import { BackLink } from '@/components/back-link'

export default async function NewGroupPage() {
  const profile = await currentProfile()
  if (!isStaff(profile?.role ?? null)) redirect('/no-autorizado')

  return (
    <div className="mx-auto max-w-lg">
      <BackLink href="/grupos">Grupos</BackLink>
      <h1 className="mb-6 readout text-3xl">Nuevo grupo</h1>
      <GroupForm action={createGroup} submitLabel="Crear grupo" />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
mkdir -p app/\(app\)/grupos/new
git add app/\(app\)/grupos/new/page.tsx
git commit -m "feat(pages): add create group page"
```

---

### Task 13: Página detalle de grupo (`/grupos/[id]`)

**Files:**
- Create: `app/(app)/grupos/[id]/page.tsx`

**Interfaces:**
- Consumes: `getGroup` de Task 3, `listProfiles` de `@/lib/db/users`, `deleteGroup` de Task 5, `GroupMemberManager` de Task 9.
- Produces: página de detalle de grupo con gestión de miembros.

- [ ] **Step 1: Crear page de detalle de grupo**

Create `app/(app)/grupos/[id]/page.tsx`:

```tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile, listProfiles } from '@/lib/db/users'
import { getGroup } from '@/lib/db/groups'
import { deleteGroup } from '@/actions/groups'
import { GroupMemberManager } from '@/components/group-member-manager'
import { ConfirmDelete } from '@/components/confirm-delete'
import { BackLink } from '@/components/back-link'

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [group, profile, allProfiles] = await Promise.all([
    getGroup(id),
    currentProfile(),
    listProfiles(),
  ])
  if (!group) notFound()

  const staff = isStaff(profile?.role ?? null)
  const allPlayers = allProfiles.filter((p) => p.role === 'deportista')

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href="/grupos">Grupos</BackLink>

      <div className="panel p-6 sm:p-8">
        <h1 className="readout text-3xl">{group.name}</h1>
        {group.description ? (
          <p className="mt-5 whitespace-pre-line border-t border-seam pt-5 text-[15px] leading-relaxed text-lit/80">
            {group.description}
          </p>
        ) : null}
      </div>

      {staff ? (
        <div className="mt-6">
          <GroupMemberManager
            groupId={id}
            members={group.members}
            allPlayers={allPlayers}
          />
        </div>
      ) : null}

      {staff ? (
        <div className="mt-6 flex gap-3">
          <Link href={`/grupos/${group.id}/edit`} className="btn btn-primary">
            Editar
          </Link>
          <ConfirmDelete
            action={deleteGroup.bind(null, group.id)}
            message="¿Eliminar este grupo y su membresía?"
          />
        </div>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
mkdir -p app/\(app\)/grupos/\[id\]
git add app/\(app\)/grupos/\[id\]/page.tsx
git commit -m "feat(pages): add group detail page with member manager"
```

---

### Task 14: Página lista de rutinas — filtrar por asignación para deportistas

**Files:**
- Modify: `app/(app)/rutinas/page.tsx`

**Interfaces:**
- Consumes: `listRoutines`/`listRoutinesForPlayer` de Task 4, `RoutineAssignmentBadge` de Task 10.
- Produces: lista de rutinas filtrada y con badges de asignación.

- [ ] **Step 1: Actualizar página de rutinas para filtrar y mostrar asignación**

Replace the entire content of `app/(app)/rutinas/page.tsx`:

```tsx
import Link from 'next/link'
import { listRoutines, listRoutinesForPlayer } from '@/lib/db/routines'
import { currentProfile } from '@/lib/db/users'
import { isStaff } from '@/lib/access'
import { PageHeader } from '@/components/page-header'
import { RoutineAssignmentBadge } from '@/components/routine-assignment-badge'
import { IconPlus } from '@/components/icons'

export default async function RutinasPage() {
  const profile = await currentProfile()
  const staff = isStaff(profile?.role ?? null)

  const routines = staff
    ? await listRoutines()
    : await listRoutinesForPlayer(profile?.id ?? '')

  return (
    <div>
      <PageHeader title="Rutinas">
        {staff ? (
          <Link href="/rutinas/new" className="btn btn-primary">
            <IconPlus size={16} />
            Nueva rutina
          </Link>
        ) : null}
      </PageHeader>

      {routines.length === 0 ? (
        <p className="text-sm font-medium text-lit/45">
          {staff ? 'No hay rutinas todavía' : 'No tienes rutinas asignadas'}
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {routines.map((routine) => (
            <Link
              key={routine.id}
              href={`/rutinas/${routine.id}`}
              className="rounded-xl border border-seam bg-cabinet p-5 transition-colors hover:border-seam-bright"
            >
              <h2 className="readout text-lg">{routine.title}</h2>
              {routine.description ? (
                <p className="mt-1 truncate text-sm text-lit/55">{routine.description}</p>
              ) : null}
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs font-semibold text-lit/45">
                  {routine.exercise_count} {routine.exercise_count === 1 ? 'ejercicio' : 'ejercicios'}
                </p>
                {!staff ? (
                  <RoutineAssignmentBadge
                    assignedToPlayer={routine.assigned_to_player}
                    assignedToGroup={routine.assigned_to_group}
                  />
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(app\)/rutinas/page.tsx
git commit -m "feat(pages): filter routines by assignment for players, show badge"
```

---

### Task 15: Página detalle de rutina — mostrar asignación

**Files:**
- Modify: `app/(app)/rutinas/[id]/page.tsx`

**Interfaces:**
- Consumes: `getRoutine` de Task 4, `getGroup` de Task 3, `listProfiles` de `@/lib/db/users`, `RoutineAssignmentBadge` de Task 10.
- Produces: detalle de rutina con info de asignación.

- [ ] **Step 1: Actualizar página de detalle para mostrar asignación**

Replace the content of `app/(app)/rutinas/[id]/page.tsx`:

```tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile, listProfiles } from '@/lib/db/users'
import { getRoutine } from '@/lib/db/routines'
import { getGroup } from '@/lib/db/groups'
import { deleteRoutine } from '@/actions/routines'
import { ExerciseList } from '@/components/exercise-list'
import { RoutineAssignmentBadge } from '@/components/routine-assignment-badge'
import { ConfirmDelete } from '@/components/confirm-delete'
import { BackLink } from '@/components/back-link'

export default async function RoutineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [routine, profile] = await Promise.all([getRoutine(id), currentProfile()])
  if (!routine) notFound()

  const staff = isStaff(profile?.role ?? null)

  // Build maps for badge labels
  let playerMap: Map<string, string> | undefined
  let groupMap: Map<string, string> | undefined

  if (routine.assigned_to_player) {
    const profiles = await listProfiles()
    playerMap = new Map(profiles.map((p) => [p.id, p.full_name]))
  }
  if (routine.assigned_to_group) {
    const group = await getGroup(routine.assigned_to_group)
    groupMap = group ? new Map([[group.id, group.name]]) : undefined
  }

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href="/rutinas">Rutinas</BackLink>

      <div className="panel p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="readout text-3xl">{routine.title}</h1>
          <RoutineAssignmentBadge
            assignedToPlayer={routine.assigned_to_player}
            assignedToGroup={routine.assigned_to_group}
            playerMap={playerMap}
            groupMap={groupMap}
          />
        </div>
        {routine.description ? (
          <p className="mt-5 whitespace-pre-line border-t border-seam pt-5 text-[15px] leading-relaxed text-lit/80">
            {routine.description}
          </p>
        ) : null}
      </div>

      <div className="mt-6">
        <ExerciseList exercises={routine.exercises} />
      </div>

      {staff ? (
        <div className="mt-6 flex gap-3">
          <Link href={`/rutinas/${routine.id}/edit`} className="btn btn-primary">
            Editar
          </Link>
          <ConfirmDelete
            action={deleteRoutine.bind(null, routine.id)}
            message="¿Eliminar esta rutina y sus ejercicios?"
          />
        </div>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(app\)/rutinas/\[id\]/page.tsx
git commit -m "feat(pages): show assignment badge on routine detail"
```

---

### Task 16: Página crear rutina — agregar selector de asignación

**Files:**
- Modify: `app/(app)/rutinas/new/page.tsx`
- Modify: `components/routine-form.tsx`

**Interfaces:**
- Consumes: `RoutineAssignmentSelect` de Task 10, `listProfiles` de `@/lib/db/users`, `listGroups` de Task 3.
- Produces: formulario de creación de rutina con selector de asignación.

- [ ] **Step 1: Actualizar RoutineForm para incluir RoutineAssignmentSelect**

Modify `components/routine-form.tsx` — add optional assignment props:

```tsx
import type { PlayerGroup, Profile, Routine } from '@/lib/types'
import { RoutineAssignmentSelect } from '@/components/routine-assignment-select'

export function RoutineForm({
  action,
  defaults,
  submitLabel,
  players,
  groups,
}: {
  action: (formData: FormData) => void
  defaults?: Pick<Routine, 'title' | 'description' | 'assigned_to_player' | 'assigned_to_group'>
  submitLabel: string
  players?: Profile[]
  groups?: PlayerGroup[]
}) {
  return (
    <form action={action} className="panel max-w-lg space-y-4 p-6">
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
        <span>Título</span>
        <input name="title" required defaultValue={defaults?.title ?? ''} className="field" />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
        <span>Descripción</span>
        <textarea
          name="description"
          rows={3}
          defaultValue={defaults?.description ?? ''}
          className="field"
        />
      </label>

      {players && groups ? (
        <RoutineAssignmentSelect
          players={players}
          groups={groups}
          defaults={
            defaults
              ? {
                  assigned_to_player: defaults.assigned_to_player ?? null,
                  assigned_to_group: defaults.assigned_to_group ?? null,
                }
              : undefined
          }
        />
      ) : null}

      <button type="submit" className="btn btn-primary">
        {submitLabel}
      </button>
    </form>
  )
}
```

- [ ] **Step 2: Actualizar página new para pasar players y groups**

Replace the content of `app/(app)/rutinas/new/page.tsx`:

```tsx
import { redirect } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile, listProfiles } from '@/lib/db/users'
import { listGroups } from '@/lib/db/groups'
import { createRoutine } from '@/actions/routines'
import { RoutineForm } from '@/components/routine-form'
import { BackLink } from '@/components/back-link'

export default async function NewRoutinePage() {
  const profile = await currentProfile()
  if (!isStaff(profile?.role ?? null)) redirect('/no-autorizado')

  const [allProfiles, groups] = await Promise.all([listProfiles(), listGroups()])
  const players = allProfiles.filter((p) => p.role === 'deportista')

  return (
    <div className="mx-auto max-w-lg">
      <BackLink href="/rutinas">Rutinas</BackLink>
      <h1 className="mb-6 readout text-3xl">Nueva rutina</h1>
      <RoutineForm
        action={createRoutine}
        submitLabel="Crear rutina"
        players={players}
        groups={groups}
      />
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/routine-form.tsx app/\(app\)/rutinas/new/page.tsx
git commit -m "feat(pages): add assignment selector to create routine page"
```

---

### Task 17: Página editar rutina — agregar selector de asignación

**Files:**
- Modify: `app/(app)/rutinas/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: `RoutineForm` actualizado de Task 16, `listProfiles`, `listGroups`.
- Produces: formulario de edición de rutina con selector de asignación.

- [ ] **Step 1: Actualizar página edit para pasar players y groups**

Replace the content of `app/(app)/rutinas/[id]/edit/page.tsx`:

```tsx
import { notFound, redirect } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile, listProfiles } from '@/lib/db/users'
import { listGroups } from '@/lib/db/groups'
import { getRoutine } from '@/lib/db/routines'
import { updateRoutine } from '@/actions/routines'
import { RoutineForm } from '@/components/routine-form'
import { ExerciseEditor } from '@/components/exercise-editor'
import { BackLink } from '@/components/back-link'

export default async function EditRoutinePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const profile = await currentProfile()
  if (!isStaff(profile?.role ?? null)) redirect('/no-autorizado')

  const [routine, allProfiles, groups] = await Promise.all([
    getRoutine(id),
    listProfiles(),
    listGroups(),
  ])
  if (!routine) notFound()

  const players = allProfiles.filter((p) => p.role === 'deportista')

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href={`/rutinas/${id}`}>{routine.title}</BackLink>
      <h1 className="mb-6 readout text-3xl">Editar rutina</h1>
      <RoutineForm
        action={async (fd) => updateRoutine(id, fd)}
        defaults={routine}
        submitLabel="Guardar cambios"
        players={players}
        groups={groups}
      />
      <ExerciseEditor routineId={id} exercises={routine.exercises} />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(app\)/rutinas/\[id\]/edit/page.tsx
git commit -m "feat(pages): add assignment selector to edit routine page"
```

---

### Task 18: Página editar grupo (`/grupos/[id]/edit`)

**Files:**
- Create: `app/(app)/grupos/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: `getGroup` de Task 3, `updateGroup` de Task 5, `GroupForm` de Task 8.
- Produces: página de edición de grupo.

- [ ] **Step 1: Crear page de editar grupo**

Create `app/(app)/grupos/[id]/edit/page.tsx`:

```tsx
import { notFound, redirect } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile } from '@/lib/db/users'
import { getGroup } from '@/lib/db/groups'
import { updateGroup } from '@/actions/groups'
import { GroupForm } from '@/components/group-form'
import { BackLink } from '@/components/back-link'

export default async function EditGroupPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const profile = await currentProfile()
  if (!isStaff(profile?.role ?? null)) redirect('/no-autorizado')

  const group = await getGroup(id)
  if (!group) notFound()

  return (
    <div className="mx-auto max-w-lg">
      <BackLink href={`/grupos/${id}`}>{group.name}</BackLink>
      <h1 className="mb-6 readout text-3xl">Editar grupo</h1>
      <GroupForm
        action={async (fd) => updateGroup(id, fd)}
        defaults={group}
        submitLabel="Guardar cambios"
      />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
mkdir -p app/\(app\)/grupos/\[id\]/edit
git add app/\(app\)/grupos/\[id\]/edit/page.tsx
git commit -m "feat(pages): add edit group page"
```

---

### Task 19: Verificación final

**Files:** Ninguno nuevo.

- [ ] **Step 1: Verificar que TypeScript compila**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 2: Verificar que la app compila**

Run: `npm run build`
Expected: build exitoso sin errores.

- [ ] **Step 3: Commit final si hay correcciones**

```bash
git add -A
git commit -m "fix: resolve type/build issues after routine assignment feature"
```
