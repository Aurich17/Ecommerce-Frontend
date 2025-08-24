// Interfaces para la API de Monedas (Currencies)

// Entidad principal Currency
export interface Currency {
  id: number;
  description: string;
  prefijo: string;
  signo: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

// DTO para crear una nueva moneda
export interface CreateCurrencyDto {
  description: string;
  prefijo: string;
  signo: string;
  status?: boolean; // opcional, default: true
}

// DTO para actualizar una moneda existente
export interface UpdateCurrencyDto {
  description?: string;
  prefijo?: string;
  signo?: string;
  status?: boolean;
}

// Response para la lista de monedas
export interface CurrencyListResponse {
  currencies: Currency[];
  total?: number;
}

// Response para operaciones individuales
export interface CurrencyResponse {
  currency: Currency;
}

// Filtros para la búsqueda de monedas
export interface CurrencyFilters {
  status?: boolean;
  description?: string;
  prefijo?: string;
}