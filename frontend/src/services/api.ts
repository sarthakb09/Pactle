import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  Product, 
  CartItem, 
  Order, 
  AuthTokens, 
  LoginCredentials, 
  RegisterCredentials,
  CartTotal,
  PaginatedResponse,
  Review,
  CreateReviewData,
  UpdateReviewData
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
                refresh: refreshToken,
              });

              const { access } = response.data;
              localStorage.setItem('access_token', access);

              originalRequest.headers.Authorization = `Bearer ${access}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const response: AxiosResponse<AuthTokens> = await this.api.post('/token/', credentials);
    return response.data;
  }

  async register(credentials: RegisterCredentials): Promise<AuthTokens> {
    const response: AxiosResponse<AuthTokens> = await this.api.post('/register/', credentials);
    return response.data;
  }

  // Product endpoints
  async getProducts(page: number = 1, search?: string, ordering?: string): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams();
    if (page > 1) params.append('page', page.toString());
    if (search) params.append('search', search);
    if (ordering) params.append('ordering', ordering);

    const response: AxiosResponse<PaginatedResponse<Product>> = await this.api.get(`/products/?${params}`);
    return response.data;
  }

  async getProduct(id: number): Promise<Product> {
    const response: AxiosResponse<Product> = await this.api.get(`/products/${id}/`);
    return response.data;
  }

  // Cart endpoints
  async getCart(): Promise<CartItem[]> {
    const response: AxiosResponse<CartItem[]> = await this.api.get('/cart/');
    return response.data;
  }

  async addToCart(productId: number, quantity: number = 1): Promise<CartItem> {
    const response: AxiosResponse<CartItem> = await this.api.post('/cart/', {
      product_id: productId,
      quantity,
    });
    return response.data;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem> {
    const response: AxiosResponse<CartItem> = await this.api.put(`/cart/${id}/`, {
      quantity,
    });
    return response.data;
  }

  async removeFromCart(id: number): Promise<void> {
    await this.api.delete(`/cart/${id}/`);
  }

  async clearCart(): Promise<void> {
    await this.api.delete('/cart/clear/');
  }

  async getCartTotal(): Promise<CartTotal> {
    const response: AxiosResponse<CartTotal> = await this.api.get('/cart/total/');
    return response.data;
  }

  // Order endpoints
  async getOrders(): Promise<Order[]> {
    const response: AxiosResponse<Order[] | PaginatedResponse<Order>> = await this.api.get('/orders/');
    const data = response.data;
    
    // Handle both direct array and paginated response
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object' && 'results' in data) {
      return (data as PaginatedResponse<Order>).results;
    } else {
      console.error('Unexpected orders response format:', data);
      return [];
    }
  }

  async getOrder(id: number): Promise<Order> {
    const response: AxiosResponse<Order> = await this.api.get(`/orders/${id}/`);
    return response.data;
  }

  async createOrder(shippingAddress: string): Promise<Order> {
    const response: AxiosResponse<Order> = await this.api.post('/orders/', {
      shipping_address: shippingAddress,
    });
    return response.data;
  }

  async confirmPayment(orderId: number): Promise<{ status: string }> {
    const response: AxiosResponse<{ status: string }> = await this.api.post(`/orders/${orderId}/confirm_payment/`);
    return response.data;
  }

  // Review endpoints
  async getProductReviews(productId: number): Promise<Review[]> {
    const response: AxiosResponse<Review[]> = await this.api.get(`/reviews/product_reviews/?product_id=${productId}`);
    return response.data;
  }

  async getMyReviews(): Promise<Review[]> {
    const response: AxiosResponse<Review[]> = await this.api.get('/reviews/my_reviews/');
    return response.data;
  }

  async createReview(reviewData: CreateReviewData): Promise<Review> {
    const response: AxiosResponse<Review> = await this.api.post('/reviews/', reviewData);
    return response.data;
  }

  async updateReview(reviewId: number, reviewData: UpdateReviewData): Promise<Review> {
    const response: AxiosResponse<Review> = await this.api.put(`/reviews/${reviewId}/`, reviewData);
    return response.data;
  }

  async deleteReview(reviewId: number): Promise<void> {
    await this.api.delete(`/reviews/${reviewId}/`);
  }
}

export const apiService = new ApiService();
export default apiService; 