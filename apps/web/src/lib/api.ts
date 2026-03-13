import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/api/v1`,
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
    });

    this.client.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response.data.data ?? response.data,
      async (error) => {
        const original = error.config;
        if (error.response?.status === 401 && !original._retry) {
          original._retry = true;
          try {
            const refreshToken = this.getRefreshToken();
            if (!refreshToken) throw new Error('No refresh token');
            const response = await axios.post(`${API_URL}/api/v1/auth/refresh`, { refreshToken });
            const { accessToken } = response.data.data;
            this.setToken(accessToken);
            original.headers.Authorization = `Bearer ${accessToken}`;
            return this.client(original);
          } catch {
            this.clearTokens();
            window.location.href = '/auth/login';
          }
        }
        return Promise.reject(error.response?.data || error);
      }
    );
  }

  private getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  private getRefreshToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  }

  setToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  setRefreshToken(token: string) {
    localStorage.setItem('refresh_token', token);
  }

  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  // Auth
  async register(data: { name: string; email: string; password: string; phone?: string }) {
    return this.client.post('/auth/register', data);
  }

  async login(email: string, password: string) {
    return this.client.post('/auth/login', { email, password });
  }

  async logout(refreshToken: string) {
    return this.client.post('/auth/logout', { refreshToken });
  }

  async getMe() {
    return this.client.get('/auth/me');
  }

  // Products
  async getProducts(params?: Record<string, any>) {
    return this.client.get('/products', { params });
  }

  async getProduct(slug: string) {
    return this.client.get(`/products/${slug}`);
  }

  async getFeaturedProducts() {
    return this.client.get('/products/featured');
  }

  async calculatePrice(productId: string, variantId: string, quantity: number) {
    return this.client.get(`/products/${productId}/price`, {
      params: { variantId, quantity },
    });
  }

  // Categories
  async getCategories() {
    return this.client.get('/categories');
  }

  // Cart
  async getCart() {
    return this.client.get('/cart');
  }

  async addToCart(data: {
    productId: string;
    variantId?: string;
    designId?: string;
    quantity: number;
    customization?: object;
  }) {
    return this.client.post('/cart', data);
  }

  async updateCartItem(itemId: string, quantity: number) {
    return this.client.put(`/cart/${itemId}`, { quantity });
  }

  async removeFromCart(itemId: string) {
    return this.client.delete(`/cart/${itemId}`);
  }

  // Orders
  async createOrder(data: { addressId?: string; couponCode?: string; notes?: string }) {
    return this.client.post('/orders', data);
  }

  async getOrders(page?: number, limit?: number) {
    return this.client.get('/orders', { params: { page, limit } });
  }

  async getOrder(id: string) {
    return this.client.get(`/orders/${id}`);
  }

  async cancelOrder(id: string) {
    return this.client.post(`/orders/${id}/cancel`);
  }

  async reorder(id: string) {
    return this.client.post(`/orders/${id}/reorder`);
  }

  // Designs
  async createDesign(data: object) {
    return this.client.post('/designs', data);
  }

  async getDesigns() {
    return this.client.get('/designs');
  }

  async getDesign(id: string) {
    return this.client.get(`/designs/${id}`);
  }

  async updateDesign(id: string, data: object) {
    return this.client.put(`/designs/${id}`, data);
  }

  async saveDesign(id: string, data: object) {
    return this.client.post(`/designs/${id}/save`, data);
  }

  async generatePreview(id: string, imageData: string) {
    return this.client.post(`/designs/${id}/preview`, { imageData });
  }

  async duplicateDesign(id: string) {
    return this.client.post(`/designs/${id}/duplicate`);
  }

  async deleteDesign(id: string) {
    return this.client.delete(`/designs/${id}`);
  }

  // Templates
  async getTemplates(productId?: string, category?: string) {
    return this.client.get('/templates', { params: { productId, category } });
  }

  async getTemplate(id: string) {
    return this.client.get(`/templates/${id}`);
  }

  // Payments
  async createRazorpayOrder(orderId: string) {
    return this.client.post(`/payments/razorpay/create/${orderId}`);
  }

  async verifyRazorpayPayment(data: object) {
    return this.client.post('/payments/razorpay/verify', data);
  }

  async createStripeIntent(orderId: string) {
    return this.client.post(`/payments/stripe/create/${orderId}`);
  }

  // User
  async getProfile() {
    return this.client.get('/users/profile');
  }

  async updateProfile(data: object) {
    return this.client.put('/users/profile', data);
  }

  async getAddresses() {
    return this.client.get('/users/addresses');
  }

  async createAddress(data: object) {
    return this.client.post('/users/addresses', data);
  }

  async updateAddress(id: string, data: object) {
    return this.client.put(`/users/addresses/${id}`, data);
  }

  async deleteAddress(id: string) {
    return this.client.delete(`/users/addresses/${id}`);
  }

  async getWishlist() {
    return this.client.get('/users/wishlist');
  }

  async toggleWishlist(productId: string) {
    return this.client.post(`/users/wishlist/${productId}`);
  }

  // Uploads
  async uploadImage(file: File, folder?: string) {
    const formData = new FormData();
    formData.append('file', file);
    return this.client.post(folder === 'design' ? '/uploads/design-asset' : '/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  // Coupons
  async validateCoupon(code: string, amount: number) {
    return this.client.post('/coupons/validate', { code, amount });
  }

  // Shipping
  async checkServiceability(pincode: string) {
    return this.client.get('/shipping/serviceability', { params: { pincode } });
  }

  async trackShipment(orderId: string) {
    return this.client.get(`/shipping/track/${orderId}`);
  }

  // Analytics (Admin)
  async getDashboardStats() {
    return this.client.get('/analytics/dashboard');
  }

  async getRevenueChart(days?: number) {
    return this.client.get('/analytics/revenue', { params: { days } });
  }

  // Admin
  async getAdminOrders(params?: Record<string, any>) {
    return this.client.get('/admin/orders', { params });
  }

  async updateAdminOrderStatus(id: string, status: string, note: string) {
    return this.client.put(`/admin/orders/${id}/status`, { status, note });
  }

  async getCustomers(params?: Record<string, any>) {
    return this.client.get('/admin/customers', { params });
  }

  async getPrintQueue(params?: Record<string, any>) {
    return this.client.get('/production/queue', { params });
  }

  async generatePrintFile(orderId: string) {
    return this.client.post(`/production/${orderId}/generate-file`);
  }
}

export const api = new ApiClient();
export default api;
