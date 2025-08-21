export interface EncabezadoRequest {
  titulo_principal: string;
  subtitulo: string;
  parrafo_encabezado: string;
  titulo_marketplace: string;
  subtitulo_marketplace: string;
  nota?: string | null;

  logo_url?: string; // 👈 nuevo
  logo_name?: string; // 👈 nuevo
}

export interface AudienceRequest {
  icon: string;
  entity: string;
  description: string;
  position: number;
  enabled: boolean;
}

export interface HowItWorksRequest {
  icon: string;
  description: string;
  step_order: number;
  enabled: boolean;
}

export interface TestimonialsRequest {
  comment: string;
  userId: string;
  clientName: string;
  occupationText: string;
  occupationTab: string;
  occupationCod: string;
  enabled: boolean;
}

export interface FaqRequest {
  pregunta: string;
  respuesta: string;
  orden: number;
  activo: boolean;
}

export interface FeaturesRequest {
  icono: string;
  titulo: string;
  descripcion: string;
  orden: number;
  activo: boolean;
}

export interface FooterRequest {
  contact_email: string;
  contact_phone: string;
  footer_title: string;
  footer_desc: string;
  footer_left_desc: string;
  footer_copy: string;
}
