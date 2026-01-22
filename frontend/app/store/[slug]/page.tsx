'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ShoppingCart, Search, Filter, Star, Heart,
    ChevronDown, X, Plus, Minus, ShoppingBag, Menu,
    Instagram, Facebook, Twitter, Mail, Phone, MapPin, Send
} from 'lucide-react';
import api from '@/lib/api';
import { useCartStore } from '@/lib/store';

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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

            // Load categories
            const cats = await fetch(`/api/store/${slug}/categories`).then(r => r.json());
            setCategories(cats);
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

    const handleAddToCart = (product: Product) => {
        addItem({
            product_id: product.id,
            reseller_product_id: product.reseller_product_id,
            name: product.name,
            price: product.price,
            image: product.primary_image,
        });
        setCartOpen(true);
    };

    if (!store) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const primaryColor = store.store.primary_color || '#8B5CF6';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            {store.store.logo_url ? (
                                <img src={api.getMediaUrl(store.store.logo_url)} alt={store.store.name} className="h-10 w-auto" />
                            ) : (
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    {store.store.name.charAt(0)}
                                </div>
                            )}
                            <span className="font-bold text-xl text-gray-900">{store.store.name}</span>
                        </div>

                        {/* Desktop Search */}
                        <div className="hidden md:flex flex-1 max-w-md mx-8">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search jewelry..."
                                    className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Cart Button */}
                            <button
                                onClick={() => setCartOpen(true)}
                                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ShoppingCart className="w-6 h-6 text-gray-700" />
                                {itemCount() > 0 && (
                                    <span
                                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs text-white flex items-center justify-center"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        {itemCount()}
                                    </span>
                                )}
                            </button>

                            {/* Mobile Menu */}
                            <button
                                className="md:hidden p-2"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                <Menu className="w-6 h-6 text-gray-700" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Search */}
                {mobileMenuOpen && (
                    <div className="md:hidden px-4 pb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search jewelry..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full"
                            />
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section
                className="relative py-20 px-4 text-white overflow-hidden"
                style={{
                    background: store.config?.hero_image
                        ? `url(${api.getMediaUrl(store.config.hero_image)}) center/cover no-repeat`
                        : `linear-gradient(135deg, ${primaryColor} 0%, ${store.store.secondary_color || '#EC4899'} 100%)`
                }}
            >
                {store.config?.hero_image && <div className="absolute inset-0 bg-black/40" />}
                <div className="relative max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        {store.config?.hero_title || store.store.homepage_title || `Welcome to ${store.store.name}`}
                    </h1>
                    <p className="text-xl opacity-90 mb-8">
                        {store.config?.hero_subtitle || store.store.homepage_tagline || store.store.description}
                    </p>
                    <a
                        href="#products"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                    >
                        {store.config?.hero_cta_text || 'Shop Now'}
                        <ChevronDown className="w-5 h-5" />
                    </a>
                </div>
            </section>

            {/* Categories */}
            {categories.length > 0 && (
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                            <button
                                onClick={() => setSelectedCategory('')}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === ''
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                All Products
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Products */}
            <section id="products" className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {selectedCategory || 'All Products'}
                        </h2>
                        <span className="text-gray-500">{products.length} items</span>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-16">
                            <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                            <p className="text-gray-500">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white rounded-2xl shadow-sm overflow-hidden group hover:shadow-lg transition-shadow">
                                    <div className="relative">
                                        <img
                                            src={api.getMediaUrl(product.primary_image) || 'https://via.placeholder.com/400'}
                                            alt={product.name}
                                            className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {product.compare_at_price && product.compare_at_price > product.price && (
                                            <span className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                                                Sale
                                            </span>
                                        )}
                                        <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                                            <Heart className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>

                                    <div className="p-4">
                                        <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>

                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-lg font-bold" style={{ color: primaryColor }}>
                                                ₹{product.price.toLocaleString()}
                                            </span>
                                            {product.compare_at_price && product.compare_at_price > product.price && (
                                                <span className="text-sm text-gray-400 line-through">
                                                    ₹{product.compare_at_price.toLocaleString()}
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            disabled={!product.in_stock}
                                            className="w-full py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                            style={{
                                                backgroundColor: product.in_stock ? primaryColor : '#E5E7EB',
                                                color: product.in_stock ? 'white' : '#9CA3AF'
                                            }}
                                        >
                                            {product.in_stock ? (
                                                <>
                                                    <ShoppingCart className="w-4 h-4" />
                                                    Add to Cart
                                                </>
                                            ) : (
                                                'Out of Stock'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-12 mb-12">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">{store.store.name}</h3>
                            <p className="text-gray-400 leading-relaxed">{store.store.description}</p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-6">Contact Us</h4>
                            <div className="space-y-4">
                                {store.store.phone && (
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <Phone className="w-5 h-5 text-purple-400" />
                                        <span>{store.store.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-gray-400">
                                    <Mail className="w-5 h-5 text-purple-400" />
                                    <span>Contact Seller</span>
                                </div>
                                <Link
                                    href={`/store/${slug}/contact`}
                                    className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mt-2"
                                >
                                    <Send className="w-4 h-4" />
                                    Send Message
                                </Link>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-6">Follow Us</h4>
                            <div className="flex items-center gap-4">
                                {store.config?.social_links?.instagram && (
                                    <a href={store.config.social_links.instagram} target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-pink-500 transition-all">
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                )}
                                {store.config?.social_links?.facebook && (
                                    <a href={store.config.social_links.facebook} target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-blue-500 transition-all">
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                )}
                                {store.config?.social_links?.twitter && (
                                    <a href={store.config.social_links.twitter} target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-sky-500 transition-all">
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                )}
                                {store.config?.social_links?.whatsapp && (
                                    <a href={`https://wa.me/${store.config.social_links.whatsapp.replace(/\D/g, '')}`} target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-emerald-500 transition-all">
                                        <Phone className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/10 text-center">
                        <p className="text-sm text-gray-500 uppercase tracking-widest">
                            Powered by JewelryHub
                        </p>
                    </div>
                </div>
            </footer>

            {/* Cart Sidebar */}
            {cartOpen && (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setCartOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-bold">Shopping Cart ({itemCount()})</h2>
                            <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {items.length === 0 ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-500">Your cart is empty</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {items.map((item) => (
                                        <div key={item.product_id} className="flex gap-4">
                                            <img
                                                src={api.getMediaUrl(item.image) || 'https://via.placeholder.com/100'}
                                                alt={item.name}
                                                className="w-20 h-20 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                                                <p className="text-sm" style={{ color: primaryColor }}>
                                                    ₹{item.price.toLocaleString()}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-8 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => removeItem(item.product_id)}
                                                        className="ml-auto text-red-500 hover:text-red-600"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t p-4 space-y-4">
                                    <div className="flex items-center justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>₹{total().toLocaleString()}</span>
                                    </div>
                                    <Link
                                        href={`/store/${slug}/checkout`}
                                        className="block w-full py-3 rounded-lg font-semibold text-center text-white transition-colors"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        Proceed to Checkout
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
