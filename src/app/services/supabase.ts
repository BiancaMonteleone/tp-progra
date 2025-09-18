import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, Session, User, AuthChangeEvent } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://krvvcmhozcmlckjhuxoh.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtydnZjbWhvemNtbGNramh1eG9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NDQ0MDcsImV4cCI6MjA3MzEyMDQwN30.KDnEyvu0UGI_KFdlTV84XMq5KO5JZjj-I3d7NJxPTrk';

@Injectable({
  providedIn: 'root',
})
export class Supabase {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    });
  }

  async register(email: string, password: string, name: string, lastname: string, age: number) {
    const { data: authData, error: authError } = await this.supabase.auth.signUp({
      email,
      password,
    });
    if (authError) throw authError;

    const userId = authData.user?.id;
    if (!userId) throw new Error('No se pudo obtener el ID del usuario');

    const { data, error } = await this.supabase
      .from('users')
      .insert([{ auth_id: userId, name, lastname, age }])
      .select()
      .single();

    if (error) throw error;

    return { auth: authData, profile: data };
  }

  async login(email: string, password: string): Promise<{ user: User | null; session: Session | null }> {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // data.session puede ser null si el email no está confirmado
    return { user: data.user, session: data.session };
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
    localStorage.removeItem('user')
  }

  async getUser(): Promise<User | null> {
    const { data } = await this.supabase.auth.getUser();
    return data.user; // puede ser null si no hay sesión
  }

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }
}
