import { supabase } from '@/integrations/supabase/client';
import { CustomDrinkType } from '@/hooks/useCustomDrinkTypes';

export async function fetchCustomDrinkTypes(userId: string): Promise<CustomDrinkType[]> {
  const { data, error } = await supabase
    .from('custom_drink_types')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []).map((d) => ({
    id: d.id,
    name: d.name,
    icon: d.icon,
    color: d.color,
  }));
}

export async function addCustomDrinkType(
  userId: string,
  name: string,
  icon = '🍹',
  color = '#8B5CF6'
): Promise<CustomDrinkType> {
  const { data, error } = await supabase
    .from('custom_drink_types')
    .insert({
      user_id: userId,
      name: name.trim(),
      icon,
      color,
    })
    .select()
    .single();

  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    icon: data.icon,
    color: data.color,
  };
}

export async function updateCustomDrinkType(
  id: string,
  userId: string,
  updates: { name?: string; icon?: string; color?: string }
): Promise<CustomDrinkType> {
  const { data, error } = await supabase
    .from('custom_drink_types')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    icon: data.icon,
    color: data.color,
  };
}

export async function deleteCustomDrinkType(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('custom_drink_types')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}
