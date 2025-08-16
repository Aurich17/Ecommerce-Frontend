export interface paisesResponse {
  int:number;
  name:string;
}

export interface provinciasResponse {
  id: number,
  paisId: number,
  nombre: string,
  pais: paisesResponse[]
}


export interface ciudadesResponse {
  id: number;
  nombre: string;
  provinciaId: number;
}


export interface tiposResponse {
  id: number,
  descripcion: string
}

export interface RegisterClienteResponse {
  social_security: string;
  user_id: string;          // útil en el front
}
