const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface FetchOptions extends RequestInit {
    token?: string;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
        const { token, ...fetchOptions } = options;

        const headers: any = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        } else {
            // Try to get token from localStorage
            const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (storedToken) {
                headers['Authorization'] = `Bearer ${storedToken}`;
            }
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...fetchOptions,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'An error occurred' }));

            // Handle FastAPI validation errors (422)
            if (response.status === 422 && error.detail && Array.isArray(error.detail)) {
                const messages = error.detail.map((err: any) => `${err.loc.join('.')}: ${err.msg}`);
                throw new Error(messages.join(', '));
            }

            throw new Error(typeof error.detail === 'string' ? error.detail : JSON.stringify(error.detail) || 'An error occurred');
        }

        return response.json();
    }

    // Auth
    async register(email: string, password: string, businessName: string) {
        return this.request('/auth/register/reseller', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
                role: 'reseller',
                business_name: businessName,
            }),
        });
    }

    async login(email: string, password: string) {
        return this.request<{ access_token: string }>('/auth/login/json', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async getCurrentUser() {
        return this.request('/auth/me');
    }

    // Reseller
    async getResellerProfile() {
        return this.request('/resellers/profile');
    }

    async updateResellerProfile(data: any) {
        return this.request('/resellers/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async updateBranding(data: any) {
        return this.request('/resellers/branding', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async uploadLogo(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('token');
        const response = await fetch(`${this.baseUrl}/resellers/logo`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to upload logo');
        }

        return response.json();
    }

    async uploadBanner(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('token');
        const response = await fetch(`${this.baseUrl}/resellers/banner`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to upload banner');
        }

        return response.json();
    }

    async updateStorefrontConfig(data: any) {
        return this.request('/resellers/storefront-config', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async getStorefrontConfig() {
        return this.request('/resellers/storefront-config');
    }

    getMediaUrl(path: string | null | undefined) {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        // The path usually starts with /uploads, so we just prepend the base URL
        const backendBase = this.baseUrl.replace(/\/api$/, '');
        return `${backendBase}${path.startsWith('/') ? '' : '/'}${path}`;
    }

    async getDashboardStats() {
        return this.request('/resellers/dashboard/stats');
    }

    async getOnboardingStatus() {
        return this.request('/resellers/onboarding-status');
    }

    async publishStore() {
        return this.request('/resellers/publish', { method: 'POST' });
    }

    // Products
    async getCatalog(params: Record<string, any> = {}) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                searchParams.append(key, String(value));
            }
        });
        return this.request(`/products/catalog?${searchParams.toString()}`);
    }

    async getCategories() {
        return this.request<string[]>('/products/catalog/categories');
    }

    async getMaterials() {
        return this.request<string[]>('/products/catalog/materials');
    }

    async updateDomain(data: { subdomain: string; custom_domain?: string }) {
        return this.request('/resellers/domain', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async getMyProducts(params: Record<string, any> = {}) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                searchParams.append(key, String(value));
            }
        });
        return this.request(`/products/my-products?${searchParams.toString()}`);
    }

    async addProduct(productId: number, retailPrice: number, options: any = {}) {
        return this.request('/products/my-products', {
            method: 'POST',
            body: JSON.stringify({
                product_id: productId,
                retail_price: retailPrice,
                ...options,
            }),
        });
    }

    async updateMyProduct(resellerProductId: number, data: any) {
        return this.request(`/products/my-products/${resellerProductId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async removeMyProduct(resellerProductId: number) {
        return this.request(`/products/my-products/${resellerProductId}`, {
            method: 'DELETE',
        });
    }

    // Orders
    async getOrders(params: Record<string, any> = {}) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                searchParams.append(key, String(value));
            }
        });
        return this.request(`/orders?${searchParams.toString()}`);
    }

    async getOrder(orderId: number) {
        return this.request(`/orders/${orderId}`);
    }

    // Payouts
    async getPayoutBalance() {
        return this.request('/payouts/balance');
    }

    async getPayouts() {
        return this.request('/payouts');
    }

    async requestPayout(amount?: number) {
        return this.request('/payouts/request', {
            method: 'POST',
            body: JSON.stringify({ amount }),
        });
    }

    // Storefront
    async getStorefront(slug: string) {
        return this.request(`/store/${slug}`);
    }

    async getStorefrontProducts(slug: string, params: Record<string, any> = {}) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                searchParams.append(key, String(value));
            }
        });
        return this.request(`/store/${slug}/products?${searchParams.toString()}`);
    }

    async getStorefrontProduct(slug: string, productSlug: string) {
        return this.request(`/store/${slug}/products/${productSlug}`);
    }

    async createOrder(resellerSlug: string, orderData: any) {
        return this.request(`/orders/storefront/${resellerSlug}`, {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    }
}

export const api = new ApiClient(API_URL);

export default api;
