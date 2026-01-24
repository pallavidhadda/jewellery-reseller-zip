'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard, ShoppingBag, Package,
    CreditCard, Settings, LogOut, Menu, X, Search,
    Plus, Minus, Check, AlertCircle, Gem, ExternalLink
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    short_description: string;
    base_price: number;
    msrp: number;
    category: string;
    material: string;
    primary_image: string;
    stock_quantity: number;
    is_featured: boolean;
}

interface MyProduct {
    id: number;
    product_id: number;
    retail_price: number;
    margin: number;
    margin_percent: number;
    is_active: boolean;
    is_featured: boolean;
    product: Product;
}

export default function ProductsPage() {
    const router = useRouter();
    const { reseller, logout } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'catalog' | 'my-products'>('catalog');
    const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
    const [myProducts, setMyProducts] = useState<MyProduct[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [materials, setMaterials] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [addingProduct, setAddingProduct] = useState<number | null>(null);
    const [priceInput, setPriceInput] = useState<{ [key: number]: string }>({});
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        loadData();
    }, [activeTab, categoryFilter]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Always fetch my products to know what's already added
            const myProductsResponse = await api.getMyProducts({ search: '' });
            const myProductList = Array.isArray(myProductsResponse) ? myProductsResponse : (myProductsResponse as any).items || [];
            setMyProducts(myProductList as MyProduct[]);

            if (activeTab === 'catalog') {
                const [products, cats, mats] = await Promise.all([
                    api.getCatalog({ category: categoryFilter, search }),
                    api.getCategories(),
                    api.getMaterials(),
                ]);

                // Safe data handling
                const productList = Array.isArray(products) ? products : (products as any).items || [];
                setCatalogProducts(productList as Product[]);
                setCategories(cats);
                setMaterials(mats);
            }
        } catch (err) {
            console.error('Failed to load products:', err);
        } finally {
            setLoading(false);
        }
    };

    const isProductAdded = (productId: number) => {
        return myProducts.some(mp => mp.product_id === productId);
    };

    const handleAddProduct = async (product: Product) => {
        const priceStr = priceInput[product.id];
        const price = parseFloat(priceStr);

        if (!priceStr || isNaN(price)) {
            setMessage({ type: 'error', text: 'Please enter a valid price' });
            return;
        }

        const minPrice = product.base_price;
        if (price < minPrice) {
            setMessage({ type: 'error', text: `Price must be at least equal to base price (₹${minPrice})` });
            return;
        }

        setAddingProduct(product.id);
        try {
            await api.addProduct(product.id, price);
            setMessage({ type: 'success', text: 'Product added to your store!' });
            setPriceInput({ ...priceInput, [product.id]: '' });

            // Refresh logic - update local state immediately for better UX
            setTimeout(() => loadData(), 500);
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to add product' });
        } finally {
            setAddingProduct(null);
        }
    };

    const handleRemoveProduct = async (resellerProductId: number) => {
        try {
            await api.removeMyProduct(resellerProductId);
            setMessage({ type: 'success', text: 'Product removed from your store' });
            loadData();
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to remove product' });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        logout();
        router.push('/');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
        { icon: ShoppingBag, label: 'Products', href: '/dashboard/products', active: true },
        { icon: Package, label: 'Orders', href: '/dashboard/orders' },
        { icon: CreditCard, label: 'Payouts', href: '/dashboard/payouts' },
        { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ];

    return (
        <div className="min-h-screen flex bg-bg-secondary font-body theme-jaipur">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-jaipur-burgundy text-white transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl`}>
                <div className="flex items-center gap-3 p-6 border-b border-white/5">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <Gem className="w-5 h-5 text-jaipur-gold" />
                    </div>
                    <div>
                        <span className="font-display text-xl font-medium tracking-tight">JewelryHub</span>
                        <span className="block text-[10px] text-jaipur-gold/70 uppercase tracking-[0.2em] font-bold">Reseller</span>
                    </div>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 ${item.active
                                ? 'bg-white/10 text-white border border-white/10 shadow-lg'
                                : 'text-white/50 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-4 h-4 ${item.active ? 'text-jaipur-gold' : ''}`} />
                            <span className="text-sm font-medium tracking-wide">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-6 left-0 right-0 p-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all duration-300"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main content */}
            <main className="flex-1 lg:ml-64 relative min-h-screen">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border-light px-6 lg:px-10 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <button className="lg:hidden text-text-primary p-2 hover:bg-bg-secondary rounded-lg transition-colors" onClick={() => setSidebarOpen(!sidebarOpen)}>
                                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                            <div>
                                <h1 className="text-2xl font-display font-medium text-text-primary tracking-tight">Products</h1>
                                <p className="text-xs text-text-muted font-light uppercase tracking-widest mt-1">Manage your boutique catalog</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-6 lg:p-10 relative z-10 max-w-7xl mx-auto">
                    {/* Message */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600'
                            : 'bg-red-500/10 border border-red-500/20 text-red-600'
                            }`}>
                            {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            {message.text}
                            <button onClick={() => setMessage(null)} className="ml-auto">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => setActiveTab('catalog')}
                            className={`px-8 py-3 rounded-full font-display font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'catalog'
                                ? 'bg-jaipur-burgundy text-white shadow-lg shadow-jaipur-burgundy/20'
                                : 'bg-white text-text-muted hover:bg-white/80 border border-transparent'
                                }`}
                        >
                            Catalog
                        </button>
                        <button
                            onClick={() => setActiveTab('my-products')}
                            className={`px-8 py-3 rounded-full font-display font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'my-products'
                                ? 'bg-jaipur-burgundy text-white shadow-lg shadow-jaipur-burgundy/20'
                                : 'bg-white text-text-muted hover:bg-white/80 border border-transparent'
                                }`}
                        >
                            My Products <span className="ml-2 w-5 h-5 inline-flex items-center justify-center bg-white/20 rounded-full text-[9px]">{myProducts.length}</span>
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 mb-8">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && loadData()}
                                placeholder="Search products..."
                                className="w-full h-[50px] pl-11 pr-4 rounded-2xl bg-white border border-border-light text-sm outline-none focus:border-jaipur-gold/30 transition-all font-light"
                            />
                        </div>
                        {activeTab === 'catalog' && (
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="h-[50px] px-4 rounded-2xl bg-white border border-border-light text-sm outline-none focus:border-jaipur-gold/30 transition-all min-w-[180px] font-light"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-8 h-8 border-[3px] border-jaipur-gold/20 border-t-jaipur-gold rounded-full animate-spin" />
                        </div>
                    ) : activeTab === 'my-products' ? (
                        myProducts.length === 0 ? (
                            <div className="bg-white rounded-[2rem] border border-border-light p-16 text-center">
                                <div className="w-20 h-20 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ShoppingBag className="w-8 h-8 text-text-muted" />
                                </div>
                                <h3 className="text-xl font-display font-medium text-text-primary mb-2">No products yet</h3>
                                <p className="text-text-secondary mb-8 font-light">Use the "Catalog" tab to build your collection.</p>
                                <button onClick={() => setActiveTab('catalog')} className="px-8 py-3 bg-jaipur-burgundy text-white rounded-full font-bold uppercase tracking-widest text-xs hover:shadow-lg transition-all">
                                    Browse Catalog
                                </button>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {myProducts.map((item) => (
                                    <div key={item.id} className="bg-white rounded-[2rem] border border-border-light p-4 hover:shadow-xl hover:border-jaipur-gold/20 transition-all duration-300 group">
                                        <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-bg-secondary">
                                            <img
                                                src={api.getMediaUrl(item.product.primary_image)}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                        <h3 className="font-display font-medium text-lg text-text-primary mb-1 line-clamp-1">{item.product.name}</h3>
                                        <p className="text-[10px] text-jaipur-gold font-bold uppercase tracking-widest mb-4">{item.product.category}</p>

                                        <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-bg-secondary rounded-xl">
                                            <div>
                                                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Price</p>
                                                <p className="text-base font-bold text-text-primary">₹{item.retail_price.toLocaleString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Profit</p>
                                                <p className="text-sm font-medium text-emerald-600">
                                                    ₹{item.margin.toFixed(0)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <a
                                                href={`/store/${reseller?.slug}/product/${item.product.slug}`}
                                                target="_blank"
                                                className="flex-1 py-2.5 rounded-xl border border-border-light text-text-muted hover:bg-bg-secondary hover:text-text-primary transition-colors flex items-center justify-center"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                            <button
                                                onClick={() => handleRemoveProduct(item.id)}
                                                className="flex-1 py-2.5 rounded-xl border border-red-100 text-red-400 hover:bg-red-50 hover:border-red-200 transition-colors text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {catalogProducts.map((product) => {
                                const isAdded = isProductAdded(product.id);
                                return (
                                    <div key={product.id} className="bg-white rounded-[2rem] border border-border-light p-4 hover:shadow-xl hover:border-jaipur-gold/20 transition-all duration-300 group">
                                        <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-bg-secondary">
                                            <img
                                                src={api.getMediaUrl(product.primary_image)}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            {isAdded && (
                                                <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                                    <Check size={10} strokeWidth={3} /> Added
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="font-display font-medium text-lg text-text-primary mb-1 line-clamp-1">{product.name}</h3>
                                        <p className="text-[10px] text-jaipur-gold font-bold uppercase tracking-widest mb-4">{product.category}</p>

                                        <div className="flex items-center justify-between mb-4 px-1">
                                            <span className="text-xs text-text-secondary">
                                                Base Price
                                            </span>
                                            <span className="text-sm font-bold text-text-primary">
                                                ₹{product.base_price.toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            {isAdded ? (
                                                <div className="h-10 flex items-center justify-center text-xs font-medium text-text-muted italic">
                                                    Available in your store
                                                </div>
                                            ) : (
                                                <>
                                                    <input
                                                        type="number"
                                                        placeholder={`Set Price (Min ₹${product.base_price})`}
                                                        value={priceInput[product.id] || ''}
                                                        onChange={(e) => setPriceInput({ ...priceInput, [product.id]: e.target.value })}
                                                        className="w-full h-10 px-4 rounded-xl border border-border-light bg-bg-secondary text-sm outline-none focus:border-jaipur-gold/30 transition-all font-light"
                                                    />
                                                    <button
                                                        onClick={() => handleAddProduct(product)}
                                                        disabled={addingProduct === product.id}
                                                        className="w-full py-2.5 rounded-xl bg-text-primary text-white hover:bg-jaipur-burgundy transition-colors text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-black/5"
                                                    >
                                                        {addingProduct === product.id ? (
                                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        ) : (
                                                            <>
                                                                <Plus className="w-4 h-4" />
                                                                Add to Store
                                                            </>
                                                        )}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
