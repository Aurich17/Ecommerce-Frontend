export interface StoreItem {
  id: string;
  name: string;
  welcome: string;
  address?: string;
  province?: string;
  city?: string;
  representative?: string;
  avatarText?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string; // url o base64
  discount?: number; // %
  category?: string;
}

export interface CartItem {
  product: Product;
  qty: number;
}
