import { Injectable } from '@angular/core';
import { supabase } from '../../../../services/supabaseClient'; // <-- ajusta la ruta

export interface CategoriaRow {
  id: number;
  tab_tabla: string; // 'CAT'
  des_tipo: string; // nombre
  cod_tipo: string; // '001'
  created_at?: string;
}

@Injectable({ providedIn: 'root' })
export class SupabaseNegociosService {
  private readonly TABLE = 'e_tipos';
  private readonly TAB = 'NEG';

  /** Lista todas las categorías (CAT) */
  async list(): Promise<CategoriaRow[]> {
    const { data, error } = await supabase
      .from(this.TABLE)
      .select('id, tab_tabla, des_tipo, cod_tipo, created_at')
      .eq('tab_tabla', this.TAB)
      .order('des_tipo', { ascending: true });
    if (error) throw error;
    return data ?? [];
  }

  /** Inserta una categoría. Si no pasas cod_tipo, genera el siguiente (max+1) en formato 3 dígitos */
  async create(payload: {
    nombre: string;
    codigo?: string;
  }): Promise<CategoriaRow> {
    const cod = payload.codigo ?? (await this.nextCode());
    const row = {
      tab_tabla: this.TAB,
      des_tipo: payload.nombre.trim(),
      cod_tipo: cod,
    };
    const { data, error } = await supabase
      .from(this.TABLE)
      .insert([row])
      .select('id, tab_tabla, des_tipo, cod_tipo, created_at')
      .single();
    if (error) throw error;
    return data!;
  }

  /** Actualiza nombre y/o código */
  async update(
    id: number,
    payload: { nombre?: string; codigo?: string }
  ): Promise<CategoriaRow> {
    const patch: any = {};
    if (payload.nombre !== undefined) patch.des_tipo = payload.nombre.trim();
    if (payload.codigo !== undefined) patch.cod_tipo = payload.codigo;

    const { data, error } = await supabase
      .from(this.TABLE)
      .update(patch)
      .eq('id', id)
      .eq('tab_tabla', this.TAB)
      .select('id, tab_tabla, des_tipo, cod_tipo, created_at')
      .single();
    if (error) throw error;
    return data!;
  }

  /** Borra la categoría (valida que sea CAT). Si la usas con product_category_map, puedes bloquear si está en uso. */
  async remove(id: number): Promise<void> {
    // OPCIONAL: bloquear si está en uso
    // const inUse = await this.isInUse(id);
    // if (inUse) throw new Error('La categoría está asignada a productos');

    const { error } = await supabase
      .from(this.TABLE)
      .delete()
      .eq('id', id)
      .eq('tab_tabla', this.TAB);
    if (error) throw error;
  }

  /** (Opcional) true si hay productos con esta categoría */
  async isInUse(tipoId: number): Promise<boolean> {
    const { count, error } = await supabase
      .from('product_category_map')
      .select('product_id', { count: 'exact', head: true })
      .eq('tipo_id', tipoId);
    if (error) throw error;
    return (count ?? 0) > 0;
  }

  /** Genera el siguiente cod_tipo (max + 1) con 3 dígitos */
  async nextCode(): Promise<string> {
    const { data, error } = await supabase
      .from(this.TABLE)
      .select('cod_tipo')
      .eq('tab_tabla', this.TAB)
      .order('cod_tipo', { ascending: false })
      .limit(1);
    if (error) throw error;

    const max = data?.[0]?.cod_tipo ?? '000';
    const n = Math.min(999, (parseInt(max, 10) || 0) + 1);
    return n.toString().padStart(3, '0');
  }
}
