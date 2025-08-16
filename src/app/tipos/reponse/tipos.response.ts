export type TabTipo = 'PAIS' | 'PROVINCIA' | 'MUNICIPIO';

export interface Tipo {
  id: number;
  nombre: string;
}

export interface RequestTipos {
  tab: TabTipo;
  parentId?: number;
}

export interface ResponseTipos {
  data: Tipo[];      // adapta a tu JSON real
  message?: string;  // opcional
}
