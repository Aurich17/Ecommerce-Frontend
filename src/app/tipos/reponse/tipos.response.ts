export type TabTipo = 'PAIS' | 'PROVINCIA' | 'MUNICIPIO' | 'OCU' | 'GEN';

export interface Tipo {
  tab: string;
  cod: string;
  desc: string;
}

export type RequestTipos =
  | { tab: 'PAIS' | 'OCU' | 'GEN' }
  | { tab: 'PROVINCIA' | 'MUNICIPIO'; parentId: number };

export interface ResponseTipos {
  data: Tipo[];
  message?: string;
}
