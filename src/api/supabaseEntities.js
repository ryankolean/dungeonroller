import { supabase } from '@/lib/supabase';

export const Character = {
  async list() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async get(id) {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async filter(filters, orderBy) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    let query = supabase
      .from('characters')
      .select('*')
      .eq('user_id', user.id);

    if (orderBy) {
      const isDescending = orderBy.startsWith('-');
      const field = isDescending ? orderBy.substring(1) : orderBy;
      query = query.order(field, { ascending: !isDescending });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async create(characterData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('characters')
      .insert([{ ...characterData, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('characters')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  }
};

export const Adventure = {
  async list() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('adventures')
      .select('*, characters!inner(*)')
      .eq('characters.user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async get(id) {
    const { data, error } = await supabase
      .from('adventures')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async filter(filters) {
    let query = supabase
      .from('adventures')
      .select('*');

    Object.keys(filters).forEach(key => {
      query = query.eq(key, filters[key]);
    });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async create(adventureData) {
    const { data, error } = await supabase
      .from('adventures')
      .insert([adventureData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('adventures')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('adventures')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  }
};

export const DiceRoll = {
  async list() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('dice_rolls')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data;
  },

  async create(rollData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('dice_rolls')
      .insert([{ ...rollData, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const CombatLog = {
  async list(adventureId) {
    const { data, error } = await supabase
      .from('combat_logs')
      .select('*')
      .eq('adventure_id', adventureId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(logData) {
    const { data, error } = await supabase
      .from('combat_logs')
      .insert([logData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const PublicAdventure = {
  async list() {
    const { data, error } = await supabase
      .from('public_adventures')
      .select('*')
      .order('rating', { ascending: false });

    if (error) throw error;
    return data;
  },

  async get(id) {
    const { data, error } = await supabase
      .from('public_adventures')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async filter(filters) {
    let query = supabase
      .from('public_adventures')
      .select('*');

    Object.keys(filters).forEach(key => {
      query = query.eq(key, filters[key]);
    });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async create(adventureData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('public_adventures')
      .insert([{ ...adventureData, creator_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('public_adventures')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async incrementPlays(id) {
    const { data, error } = await supabase.rpc('increment_plays', { adventure_id: id });
    if (error) throw error;
    return data;
  }
};

export const AdventureReview = {
  async list(adventureId) {
    const { data, error } = await supabase
      .from('adventure_reviews')
      .select('*')
      .eq('adventure_id', adventureId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(reviewData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('adventure_reviews')
      .insert([{ ...reviewData, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('adventure_reviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const User = {
  async me() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    if (!user) throw new Error('Not authenticated');
    return {
      id: user.id,
      email: user.email,
      ...user.user_metadata
    };
  },

  async signUp(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  },

  async updateProfile(updates) {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    });
    if (error) throw error;
    return data;
  }
};
