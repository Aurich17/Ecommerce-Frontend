export interface ProductListResponse {
  data: ProductListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductListItem {
  id: number;
  seller_user_id: string;
  name: string;
  description: string;
  price_amount: number;
  currency_tab: string;
  currency_cod: string;
  stock: number;
  discount_percent: number;
  enabled: boolean;
  url_img: string | null;
}

export interface ProductDetail {
  id: number;
  sellerUserId: string;
  name: string;
  description: string;
  priceAmount: number;
  currencyTab: string;
  currencyCod: string;
  stock: number;
  discountPercent: number;
  enabled: boolean;
  urlImg: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  sellerUserId: string;
  name: string;
  description: string;
  priceAmount: number;
  currencyTab: string;
  currencyCod: string;
  stock: number;
  discountPercent?: number;
  urlImg?: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  priceAmount?: number;
  currencyTab?: string;
  currencyCod?: string;
  stock?: number;
  discountPercent?: number;
  urlImg?: string;
}