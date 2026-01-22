'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Diamond, LayoutDashboard, ShoppingBag, Package,
    CreditCard, Settings, LogOut, Menu, X, Search,
    Plus, Filter, Minus, Check, AlertCircle
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
    const [activeTab, setActiveTab] = useState<'catalog' | 'my-products'>('my-products');
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
            if (activeTab === 'catalog') {
                const [products, cats, mats] = await Promise.all([
                    api.getCatalog({ category: categoryFilter, search }),
                    api.getCategories(),
                    api.getMaterials(),
                ]);
                setCatalogProducts(products as Product[]);
                setCategories(cats);
                setMaterials(mats);
            } else {
                const response = await api.getMyProducts({ search });
                setMyProducts((response as any).items || []);
            }
        } catch (err) {
            console.error('Failed to load products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async (product: Product) => {
        const priceStr = priceInput[product.id];
        const price = parseFloat(priceStr);

        if (!priceStr || isNaN(price)) {
            setMessage({ type: 'error', text: 'Please enter a valid price' });
            return;
        }

        const minPrice = product.base_price * 1.2; // 20% minimum markup
        if (price < minPrice) {
            setMessage({ type: 'error', text: `Price must be at least ₹${minPrice.toFixed(0)} (20% markup)` });
            return;
        }

        setAddingProduct(product.id);
        try {
            await api.addProduct(product.id, price);
            setMessage({ type: 'success', text: 'Product added to your store!' });
            setPriceInput({ ...priceInput, [product.id]: '' });
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
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: ShoppingBag, label: 'Products', href: '/dashboard/products', active: true },
        { icon: Package, label: 'Orders', href: '/dashboard/orders' },
        { icon: CreditCard, label: 'Payouts', href: '/dashboard/payouts' },
        { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/5 backdrop-blur-lg border-r border-white/10 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center gap-3 p-6 border-b border-white/10">
                    <Diamond className="w-8 h-8 text-purple-400" />
                    <span className="font-display text-xl font-bold">JewelryHub</span>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${item.active
                                    ? 'bg-purple-500/20 text-purple-300'
                                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main content */}
            <main className="flex-1 lg:ml-64">
                {/* Header */}
                <header className="sticky top-0 z-30 glass border-b border-white/10 px-4 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button className="lg:hidden text-white p-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
                                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                            <div>
                                <h1 className="text-xl font-semibold">Products</h1>
                                <p className="text-sm text-white/50">Manage your product catalog</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-4 lg:p-8">
                    {/* Message */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
                                ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                                : 'bg-red-500/20 border border-red-500/50 text-red-300'
                            }`}>
                            {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            {message.text}
                            <button onClick={() => setMessage(null)} className="ml-auto">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setActiveTab('my-products')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'my-products'
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                                }`}
                        >
                            My Products ({myProducts.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('catalog')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'catalog'
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                                }`}
                        >
                            Browse Catalog
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 mb-6">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && loadData()}
                                placeholder="Search products..."
                                className="input pl-10"
                            />
                        </div>
                        {activeTab === 'catalog' && (
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="input w-auto min-w-[150px]"
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
                            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : activeTab === 'my-products' ? (
                        myProducts.length === 0 ? (
                            <div className="card text-center py-16">
                                <ShoppingBag className="w-16 h-16 mx-auto text-white/20 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No products yet</h3>
                                <p className="text-white/50 mb-6">Browse the catalog and add products to your store</p>
                                <button onClick={() => setActiveTab('catalog')} className="btn-primary">
                                    Browse Catalog
                                </button>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {myProducts.map((item) => (
                                    <div key={item.id} className="card card-hover">
                                        <img
                                            src={item.product.primary_image || 'https://via.placeholder.com/300'}
                                            alt={item.product.name}
                                            className="w-full h-48 object-cover rounded-xl mb-4"
                                        />
                                        <h3 className="font-semibold mb-1 line-clamp-1">{item.product.name}</h3>
                                        <p className="text-sm text-white/50 mb-3">{item.product.category}</p>

                                        <div className="flex items-end justify-between mb-3">
                                            <div>
                                                <p className="text-xs text-white/40">Your Price</p>
                                                <p className="text-xl font-bold gradient-text">₹{item.retail_price.toLocaleString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-white/40">Margin</p>
                                                <p className="text-sm font-medium text-emerald-400">
                                                    ₹{item.margin.toFixed(0)} ({item.margin_percent.toFixed(0)}%)
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleRemoveProduct(item.id)}
                                            className="w-full py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Minus className="w-4 h-4" />
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {catalogProducts.map((product) => (
                                <div key={product.id} className="card card-hover">
                                    <img
                                        src={product.primary_image || 'https://via.placeholder.com/300'}
                                        alt={product.name}
                                        className="w-full h-48 object-cover rounded-xl mb-4"
                                    />
                                    <h3 className="font-semibold mb-1 line-clamp-1">{product.name}</h3>
                                    <p className="text-sm text-white/50 mb-2">{product.category} • {product.material}</p>

                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs px-2 py-1 rounded-full bg-white/10">
                                            Base: ₹{product.base_price.toLocaleString()}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${product.stock_quantity > 5 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                            }`}>
                                            {product.stock_quantity > 5 ? 'In Stock' : `Only ${product.stock_quantity} left`}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        <input
                                            type="number"
                                            placeholder={`Min ₹${Math.ceil(product.base_price * 1.2)}`}
                                            value={priceInput[product.id] || ''}
                                            onChange={(e) => setPriceInput({ ...priceInput, [product.id]: e.target.value })}
                                            className="input text-sm py-2"
                                        />
                                        <button
                                            onClick={() => handleAddProduct(product)}
                                            disabled={addingProduct === product.id}
                                            className="w-full py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-2"
                                        >
                                            {addingProduct === product.id ? (
                                                <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <Plus className="w-4 h-4" />
                                                    Add to Store
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
