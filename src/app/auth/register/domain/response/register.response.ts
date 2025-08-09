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
