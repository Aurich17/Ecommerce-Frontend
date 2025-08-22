export interface FeaturesRequest{
  icono: string,
  titulo: string,
  descripcion: string,
  orden: number,
  activo: boolean
}

export interface FaqRequest {
  pregunta: string;
  respuesta: string;
  orden: number;
  activo: boolean;
}