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

  /*-------------------- User --------------------*/
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
    console.log(authData);

    return { auth: authData, profile: data };
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { data, error };
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async getUser() {
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
  }

  async getSession(): Promise<Session | null> {
    const {
      data: { session },
      error,
    } = await this.supabase.auth.getSession();

    if (error) {
      console.error('Error al obtener la sesión:', error.message);
      return null;
    }

    return session;
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    this.supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }

  /*-------------------- Messages --------------------*/

  async getMessages() {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    this.messages.set(data || []);
    return data;
  }

  async sendMessage(email: string, content: string) {
    if (!content) return;
    const { data, error } = await this.supabase
      .from('messages')
      .insert({ email, content })
      .select();
    if (error) console.error(error);
  }

  setupRealtime() {
    this.realtimeChannel = this.supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload: any) => {
          const eventType = payload.eventType;

          if (eventType === 'INSERT') {
            const newMessage = payload.new;
            this.messages.update((arr) => [...arr, newMessage]);
          }
        }
      )
      .subscribe();
  }

  removeRealtime() {
    if (this.realtimeChannel) {
      this.supabase.removeChannel(this.realtimeChannel);
      this.realtimeChannel = null;
    }
  }

  /*-------------------- Score --------------------*/

  async registerScore(id: string, score: number, table: string) {
    const { data, error } = await this.supabase
      .from(`${table}`)
      .insert([{ score: score, id_user: id }])
      .select()
      .single();

    if (error) throw error;

    return { data, error };
  }
}
