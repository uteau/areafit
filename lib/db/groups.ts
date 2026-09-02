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
