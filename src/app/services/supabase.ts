import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://krvvcmhozcmlckjhuxoh.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtydnZjbWhvemNtbGNramh1eG9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NDQ0MDcsImV4cCI6MjA3MzEyMDQwN30.KDnEyvu0UGI_KFdlTV84XMq5KO5JZjj-I3d7NJxPTrk';

@Injectable({
  providedIn: 'root',
})
export class Supabase {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  async register(email: string, password: string, name: string, lastname: string, age: number) {
    const { data: authData, error: authError } = await this.client.auth.signUp({
      email,
      password,
    });
    if (authError) throw authError;

    const userId = authData.user?.id;
    if (!userId) throw new Error('No se pudo obtener el ID del usuario');

    const { data, error } = await this.client
      .from('users')
      .insert([{ auth_id: userId, name, lastname, age }])
      .select()
      .single();

    if (error) throw error;

    return { auth: authData, profile: data };
  }

  async login(email: string, password: string) {
    const { data: authData, error: authError } = await this.client.auth.signInWithPassword({
      email,
      password,
    });
    if (authError) throw authError;

    const userId = authData.user?.id;
    if (!userId) throw new Error('No se pudo obtener el ID del usuario');

    const { data: profile, error: profileError } = await this.client
      .from('users')
      .select('*')
      .eq('auth_id', userId)
      .maybeSingle();

    if (profileError) throw profileError;

    return { authData, profile };
  }
}
