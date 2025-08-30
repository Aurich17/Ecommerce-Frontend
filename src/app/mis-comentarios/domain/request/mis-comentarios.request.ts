export interface TestimonialInsert {
  comment: string;
  client_name: string | null;
  occupation_text: string | null;
  occupation_tab?: string | null; // si lo usas
  occupation_cod?: string | null; // si lo usas
  user_id?: string | null; // si manejas auth de supabase
  enabled?: boolean; // por defecto false (lo apruebas tú)
}

export interface DetalleCompraInsert {
  id_producto: number; // bigint
  cantidad: number; // bigint
  total_producto: number; // double precision
  id_orden: number; // bigint
  id_cliente?: string | null; // 👈 nuevo
  id_empresa?: string | null;
}
