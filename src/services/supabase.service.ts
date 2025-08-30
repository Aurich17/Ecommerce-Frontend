import { Injectable } from '@angular/core';
import { supabase } from './supabaseClient';
import {
  DetalleCompraInsert,
  TestimonialInsert,
} from '../app/mis-comentarios/domain/request/mis-comentarios.request';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  // ya no crees el cliente aquí
  // usa el import singleton
  // private supabase = supabase;  // opcional: alias

  // COMENTARIOS CLIENTES ------------------=====================================================================================================
  async insertTestimonial(payload: {
    comment: string;
    user_id: string;
    client_name?: string | null;
    occupation_text: string;
    occupation_tab: string;
    occupation_cod: string;
    enabled: boolean;
  }) {
    const { data, error } = await supabase
      .from('landing_testimonials')
      .insert([payload]) // 👈 ya sin enabled:false forzado
      .select('*') // trae todo para debug
      .single();

    if (error) {
      console.error('SUPABASE INSERT ERROR:', error);
      throw error; // deja que suba el mensaje real
    }
    console.log('SUPABASE INSERT OK:', data);
    return data;
  }

  async updateTestimonial(id: number, payload: Partial<TestimonialInsert>) {
    const { data, error } = await supabase
      .from('landing_testimonials')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async listTestimonialsByUser(userId: string) {
    const { data, error } = await supabase
      .from('landing_testimonials')
      .select('id, comment, enabled, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async listPublicTestimonials() {
    const { data, error } = await supabase
      .from('landing_testimonials')
      .select('id, comment, client_name, created_at')
      .eq('enabled', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  }

  async insertDetallesCompra(items: DetalleCompraInsert[]) {
    const { data, error } = await supabase
      .from('detalle_compra')
      .insert(items)
      .select('id'); // opcional, para confirmar

    if (error) throw error;
    return data ?? [];
  }

  // ÓRDENES (agrupadas por id_orden) filtradas por empresa
  async listOrderRowsByEmpresa(empresaId?: string) {
    const { data, error } = await supabase
      .from('detalle_compra')
      .select('id_orden,total_producto')
      .eq('id_empresa', empresaId);
    if (error) throw error;
    return data ?? [];
  }

  async listOrderItems(orderId: number) {
    const { data, error } = await supabase
      .from('detalle_compra')
      .select('id_producto,cantidad,total_producto')
      .eq('id_orden', orderId);
    if (error) throw error;
    return data ?? [];
  }
}
