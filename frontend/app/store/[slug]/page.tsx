'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { X, ShoppingBag, Minus, Plus, Loader2, ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import api from '@/lib/api';
import { useCartStore } from '@/lib/store';

// Lazily load templates based on theme
const RoyalHeritageTemplate = dynamic(() => import('@/components/storefront/templates/RoyalHeritage'), {
    loading: () => <TemplateLoader />
});
const MinimalistChicTemplate = dynamic(() => import('@/components/storefront/templates/MinimalistChic'), {
    loading: () => <TemplateLoader />
});
const ArtisanBloomTemplate = dynamic(() => import('@/components/storefront/templates/ArtisanBloom'), {
    loading: () => <TemplateLoader />
});
const ModernDecoTemplate = dynamic(() => import('@/components/storefront/templates/ModernDeco'), {
    loading: () => <TemplateLoader />
});
import CartSidebar from '@/components/storefront/CartSidebar';

function TemplateLoader() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-bg-secondary">
            <div className="w-12 h-12 rounded-full border-[3px] border-jaipur-gold/20 border-t-jaipur-gold animate-spin mb-4" />
        </div>
    );
}

interface StoreData {
    store: {
        name: string;
        slug: string;
        description: string;
        logo_url: string;
        primary_color: string;
        secondary_color: string;
        accent_color: string;
        homepage_title: string;
        homepage_tagline: string;
        phone: string;
        address: string;
    };
    config: {
        theme: string;
        hero_title: string;
        hero_subtitle: string;
        hero_cta_text: string;
        hero_image: string;
        social_links: {
            instagram?: string;
            facebook?: string;
            twitter?: string;
            whatsapp?: string;
        };
    };
    product_count: number;
}

interface Product {
    id: number;
    reseller_product_id: number;
    name: string;
    slug: string;
    description: string;
    short_description: string;
    price: number;
    compare_at_price: number;
    category: string;
    material: string;
    primary_image: string;
    images: string[];
    is_featured: boolean;
    in_stock: boolean;
}

export default function StorefrontPage() {
    const params = useParams();
    const slug = params.slug as string;
    const { items, addItem, removeItem, updateQuantity, total, itemCount } = useCartStore();

    const [store, setStore] = useState<StoreData | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [search, setSearch] = useState('');
    const [cartOpen, setCartOpen] = useState(false);

    useEffect(() => {
        loadStore();
    }, [slug]);

    useEffect(() => {
        if (store) {
            loadProducts();
        }
    }, [store, selectedCategory, search]);

    const loadStore = async () => {
        try {
            const data = await api.getStorefront(slug);
            setStore(data as StoreData);

            // Load categories - handle potential API failure gracefully
            try {
                const catsResponse = await fetch(`/api/store/${slug}/categories`);
                if (catsResponse.ok) {
                    const cats = await catsResponse.json();
                    setCategories(cats);
                }
            } catch (e) {
                console.warn('Failed to load categories');
            }
        } catch (err) {
            console.error('Failed to load store:', err);
        }
    };

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await api.getStorefrontProducts(slug, {
                category: selectedCategory,
                search,
            });
            setProducts((data as any).products || []);
        } catch (err) {
            console.error('Failed to load products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = useCallback((product: Product) => {
        addItem({
            product_id: product.id,
            reseller_product_id: product.reseller_product_id,
            name: product.name,
            price: product.price,
            image: product.primary_image,
        });
        setCartOpen(true);
    }, [addItem]);

    const onCategoryChange = useCallback((cat: string) => {
        setSelectedCategory(cat);
    }, []);

    const onSearchChange = useCallback((text: string) => {
        setSearch(text);
    }, []);

    // Template selection logic
    const theme = store?.config?.theme || 'heritage';

    const props = useMemo(() => ({
        store,
        products,
        categories,
        selectedCategory,
        onCategoryChange,
        onSearchChange,
        onAddToCart: handleAddToCart,
        cartItemCount: itemCount(),
        setCartOpen: setCartOpen,
        primaryColor: store?.store?.primary_color,
        accentColor: store?.store?.accent_color
    }), [store, products, categories, selectedCategory, onCategoryChange, onSearchChange, handleAddToCart, itemCount, setCartOpen]);

    if (!store) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-bg-secondary">
                <div className="w-12 h-12 rounded-full border-[3px] border-jaipur-gold/20 border-t-jaipur-gold animate-spin mb-4" />
                <p className="font-display text-jaipur-burgundy/40 text-[10px] uppercase tracking-widest font-bold">Synchronizing Boutique</p>
            </div>
        );
    }

    const renderTemplate = () => {
        switch (theme.toLowerCase()) {
            case 'minimalist':
            case 'chic':
                return <MinimalistChicTemplate {...props} />;
            case 'artisan':
            case 'bloom':
                return <ArtisanBloomTemplate {...props} />;
            case 'deco':
            case 'modern':
                return <ModernDecoTemplate {...props} />;
            case 'heritage':
            case 'royal':
            default:
                return <RoyalHeritageTemplate {...props} />;
        }
    };

    return (
        <>
            {renderTemplate()}

            {/* Shared Cart Sidebar */}
            <CartSidebar
                open={cartOpen}
                onClose={() => setCartOpen(false)}
                slug={slug}
                primaryColor={store.store.accent_color || store.store.primary_color}
                theme={theme}
            />
        </>
    );
}

// Simple Link placeholder
function Link({ children, href, className }: any) {
    return <a href={href} className={className}>{children}</a>;
}

