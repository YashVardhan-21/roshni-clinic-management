// Central Supabase service for all database operations
import { supabase } from '../utils/supabase';

class SupabaseService {
  constructor() {
    this.client = supabase;
  }

  // Generic CRUD operations
  async create(table, data) {
    try {
      const { data: result, error } = await this.client
        .from(table)
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: result };
    } catch (error) {
      console.error(`Error creating ${table}:`, error);
      return { success: false, error: error.message };
    }
  }

  async read(table, filters = {}, options = {}) {
    try {
      let query = this.client.from(table).select(options.select || '*');

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          query = query.eq(key, value);
        }
      });

      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy, { ascending: options.ascending !== false });
      }

      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error(`Error reading ${table}:`, error);
      return { success: false, error: error.message };
    }
  }

  async update(table, id, updates) {
    try {
      const { data, error } = await this.client
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      return { success: false, error: error.message };
    }
  }

  async delete(table, id) {
    try {
      const { error } = await this.client
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Real-time subscriptions
  subscribeToTable(table, callback, filters = {}) {
    let query = this.client
      .channel(`${table}_changes`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: table,
        filter: Object.keys(filters).length > 0 ? 
          Object.entries(filters).map(([key, value]) => `${key}=eq.${value}`).join(',') : 
          undefined
      }, callback)
      .subscribe();

    return () => this.client.removeChannel(query);
  }

  // File upload
  async uploadFile(bucket, file, path, options = {}) {
    try {
      const { data, error } = await this.client.storage
        .from(bucket)
        .upload(path, file, options);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('File upload error:', error);
      return { success: false, error: error.message };
    }
  }

  // File download
  async downloadFile(bucket, path) {
    try {
      const { data, error } = await this.client.storage
        .from(bucket)
        .download(path);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('File download error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new SupabaseService();
