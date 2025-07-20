export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  inventory_count: number;
  image_url: string;
  is_in_stock: boolean;
  average_rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
  reviews?: Review[];
}

export interface Review {
  id: number;
  user: string;
  user_full_name: string;
  product: number;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewData {
  product: number;
  rating: number;
  title?: string;
  comment?: string;
}

export interface UpdateReviewData {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface CartItem {
  id: number;
  product: Product;
  product_id: number;
  quantity: number;
  total_price: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface Order {
  id: number;
  user: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  stripe_payment_intent_id: string;
  client_secret?: string;
  shipping_address: string;
  order_items: OrderItem[];
  items_count: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface CartTotal {
  total_amount: number;
  total_items: number;
  item_count: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
} 