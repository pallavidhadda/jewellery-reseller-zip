'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: number;
    email: string;
    role: string;
    is_verified: boolean;
}

interface Reseller {
    id: number;
    business_name: string;
    slug: string;
    description?: string;
    logo_url?: string;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    subdomain?: string;
    phone?: string;
    address?: string;
    is_published: boolean;
    is_onboarded: boolean;
}

interface AuthState {
    token: string | null;
    user: User | null;
    reseller: Reseller | null;
    isLoading: boolean;
    setToken: (token: string | null) => void;
    setUser: (user: User | null) => void;
    setReseller: (reseller: Reseller | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            reseller: null,
            isLoading: true,
            setToken: (token) => set({ token }),
            setUser: (user) => set({ user }),
            setReseller: (reseller) => set({ reseller }),
            setLoading: (isLoading) => set({ isLoading }),
            logout: () => set({ token: null, user: null, reseller: null }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ token: state.token }),
        }
    )
);

// Cart store for storefront
interface CartItem {
    product_id: number;
    reseller_product_id: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

interface CartState {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    total: () => number;
    itemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) =>
                set((state) => {
                    const existingItem = state.items.find((i) => i.product_id === item.product_id);
                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.product_id === item.product_id
                                    ? { ...i, quantity: i.quantity + 1 }
                                    : i
                            ),
                        };
                    }
                    return { items: [...state.items, { ...item, quantity: 1 }] };
                }),
            removeItem: (productId) =>
                set((state) => ({
                    items: state.items.filter((i) => i.product_id !== productId),
                })),
            updateQuantity: (productId, quantity) =>
                set((state) => ({
                    items: state.items.map((i) =>
                        i.product_id === productId ? { ...i, quantity } : i
                    ).filter((i) => i.quantity > 0),
                })),
            clearCart: () => set({ items: [] }),
            total: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
            itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
        }),
        {
            name: 'cart-storage',
        }
    )
);
