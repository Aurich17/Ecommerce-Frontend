export interface StoreItem {
  id: string;
  name: string;
  welcome: string;
  address?: string;
  city?: string;
  province?: string;
  country?: string;
  representative?: string;
  avatarText?: string;   // inicial para avatar
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;          // url o base64
  discount?: number;      // %
  category?: string;
}

export interface CartItem {
  product: Product;
  qty: number;
}
