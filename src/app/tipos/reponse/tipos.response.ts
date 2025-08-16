export type TabTipo = 'PAIS' | 'PROVINCIA' | 'MUNICIPIO' | 'OCU' | 'GEN';

export interface Tipo {
  id: number;
  nombre: string;
}

export type RequestTipos =
  | { tab: 'PAIS' | 'OCU' | 'GEN' }
  | { tab: 'PROVINCIA' | 'MUNICIPIO'; parentId: number };

export interface ResponseTipos {
  data: Tipo[];
  message?: string;
}
