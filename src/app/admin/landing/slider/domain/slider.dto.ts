export interface ApiListResponse<T> {
  success: boolean;
  data: { items: T[]; total: number; page: number; limit: number };
}

export interface ApiOneResponse<T> {
  success: boolean;
  data: T;
}

export interface SliderDto {
  id: number;
  url: string;
  name_file: string;
  status: boolean;
}

export interface SliderCreateDto {
  url: string;
  name_file: string;
  status?: boolean;
}

export interface SliderUpdateDto {
  url?: string;
  name_file?: string;
  status?: boolean;
}
