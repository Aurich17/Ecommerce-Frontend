// Interfaces para requests de la API de Monedas

// Filtros para la consulta de monedas
export interface CurrencyFilters {
  status?: boolean; // Filtrar por estado activo/inactivo
  page?: number;
  limit?: number;
  q?: string; // Búsqueda por texto
}

// Request para toggle status
export interface ToggleStatusRequest {
  id: number;
}