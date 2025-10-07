import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://krvvcmhozcmlckjhuxoh.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtydnZjbWhvemNtbGNramh1eG9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NDQ0MDcsImV4cCI6MjA3MzEyMDQwN30.KDnEyvu0UGI_KFdlTV84XMq5KO5JZjj-I3d7NJxPTrk';

@Injectable({
  providedIn: 'root',
})
export class Supabase {
  private supabase: SupabaseClient;
  messages = signal<any[]>([]);
  private realtimeChannel: any = null;

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {});
    this.setupRealtime();
  }

  // Auth y usuarios
  async register(email: string, password: string, name: string, lastname: string, age: number) {
    try {
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

      console.log(authData);
      return { auth: authData, profile: data };
    } catch (error) {
      console.error('Error en register:', error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { data, error };
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  async logout() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  }

  async getUser() {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await this.supabase.auth.getSession();
      if (sessionError) throw sessionError;

      const authId = session?.user?.id;
      if (!authId) return null;

      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('auth_id', authId)
        .maybeSingle();
      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error en getUser:', error);
      return null;
    }
  }

  async getSession(): Promise<Session | null> {
    try {
      const {
        data: { session },
        error,
      } = await this.supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Error en getSession:', error);
      return null;
    }
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    try {
      this.supabase.auth.onAuthStateChange((event, session) => callback(event, session));
    } catch (error) {
      console.error('Error en onAuthStateChange:', error);
    }
  }

  // Mensajes
  async getMessages() {
    try {
      const { data, error } = await this.supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;

      this.messages.set(data || []);
      return data;
    } catch (error) {
      console.error('Error en getMessages:', error);
      return [];
    }
  }

  async sendMessage(email: string, content: string) {
    try {
      if (!content) return;
      const { data, error } = await this.supabase
        .from('messages')
        .insert({ email, content })
        .select();
      if (error) throw error;
    } catch (error) {
      console.error('Error en sendMessage:', error);
    }
  }

  setupRealtime() {
    try {
      this.realtimeChannel = this.supabase
        .channel('public:messages')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'messages' },
          (payload: any) => {
            if (payload.eventType === 'INSERT') {
              const newMessage = payload.new;
              this.messages.update((arr) => [...arr, newMessage]);
            }
          }
        )
        .subscribe();
    } catch (error) {
      console.error('Error en setupRealtime:', error);
    }
  }

  removeRealtime() {
    try {
      if (this.realtimeChannel) {
        this.supabase.removeChannel(this.realtimeChannel);
        this.realtimeChannel = null;
      }
    } catch (error) {
      console.error('Error en removeRealtime:', error);
    }
  }

  // Puntaje
  async registerScore(email: string, score: number, time: number | null, game: string) {
    try {
      const { data, error } = await this.supabase
        .from('scores')
        .insert([{ email, score, time, game }])
        .select()
        .single();
      if (error) throw error;
      return { data, error };
    } catch (error) {
      console.error('Error en registerScore:', error);
      return null;
    }
  }

  async getScores() {
    try {
      const { data, error } = await this.supabase
        .from('scores')
        .select('*')
        .order('score', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error en getScores:', error);
      return [];
    }
  }
}
