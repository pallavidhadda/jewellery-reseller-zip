'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Diamond, LayoutDashboard, Users, Package, CreditCard,
    Settings, LogOut, Menu, X, Store, TrendingUp,
    DollarSign, ShoppingCart, AlertCircle, CheckCircle,
    Clock, ArrowRight
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';

interface AdminStats {
    resellers: { total: number; active: number; new_this_month: number };
    manufacturers: { total: number };
    products: { total: number };
    orders: { total: number; pending: number; this_month: number };
    revenue: { total: number; this_month: number; total_commission: number };
    payouts: { pending: number };
}

export default function AdminPage() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/dashboard', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                if (response.status === 403) {
                    setError('Admin access required. Please login with an admin account.');
                    return;
                }
                throw new Error('Failed to load stats');
            }

            const data = await response.json();
            setStats(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        logout();
        router.push('/');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/admin', active: true },
        { icon: Users, label: 'Resellers', href: '/admin/resellers' },
        { icon: Store, label: 'Manufacturers', href: '/admin/manufacturers' },
        { icon: Package, label: 'Orders', href: '/admin/orders' },
        { icon: CreditCard, label: 'Payouts', href: '/admin/payouts' },
        { icon: Settings, label: 'Settings', href: '/admin/settings' },
    ];

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="card max-w-md w-full text-center">
                    <AlertCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                    <p className="text-white/60 mb-6">{error}</p>
                    <div className="space-y-3">
                        <Link href="/login" className="btn-primary block">
                            Login as Admin
                        </Link>
                        <p className="text-sm text-white/40">
                            Admin: admin@jewelryplatform.com / admin123
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/5 backdrop-blur-lg border-r border-white/10 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center gap-3 p-6 border-b border-white/10">
                    <Diamond className="w-8 h-8 text-purple-400" />
                    <div>
                        <span className="font-display text-xl font-bold">JewelryHub</span>
                        <span className="block text-xs text-purple-400">Admin Panel</span>
                    </div>
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
                                <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                                <p className="text-sm text-white/50">Platform overview and management</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-4 lg:p-8">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : stats ? (
                        <>
                            {/* Stats Grid */}
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                <div className="card">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-white/50 mb-1">Total Revenue</p>
                                            <p className="text-2xl font-bold">₹{stats.revenue.total.toLocaleString()}</p>
                                            <p className="text-xs text-emerald-400 mt-1">
                                                ₹{stats.revenue.this_month.toLocaleString()} this month
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                            <DollarSign className="w-5 h-5 text-emerald-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-white/50 mb-1">Active Resellers</p>
                                            <p className="text-2xl font-bold">{stats.resellers.active}</p>
                                            <p className="text-xs text-purple-400 mt-1">
                                                +{stats.resellers.new_this_month} this month
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                            <Users className="w-5 h-5 text-purple-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-white/50 mb-1">Total Orders</p>
                                            <p className="text-2xl font-bold">{stats.orders.total}</p>
                                            <p className="text-xs text-pink-400 mt-1">
                                                {stats.orders.pending} pending
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                                            <ShoppingCart className="w-5 h-5 text-pink-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-white/50 mb-1">Products</p>
                                            <p className="text-2xl font-bold">{stats.products.total}</p>
                                            <p className="text-xs text-amber-400 mt-1">
                                                From {stats.manufacturers.total} manufacturer(s)
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                            <Package className="w-5 h-5 text-amber-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Secondary Stats */}
                            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                                <div className="card">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-purple-400" />
                                        Platform Summary
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between py-2 border-b border-white/10">
                                            <span className="text-white/60">Total Resellers</span>
                                            <span className="font-semibold">{stats.resellers.total}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-white/10">
                                            <span className="text-white/60">Active Stores</span>
                                            <span className="font-semibold">{stats.resellers.active}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-white/10">
                                            <span className="text-white/60">Manufacturers</span>
                                            <span className="font-semibold">{stats.manufacturers.total}</span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-white/60">Products in Catalog</span>
                                            <span className="font-semibold">{stats.products.total}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-pink-400" />
                                        Payouts
                                    </h3>
                                    <div className="text-center py-6">
                                        <p className="text-4xl font-bold gradient-text mb-2">
                                            ₹{stats.payouts.pending.toLocaleString()}
                                        </p>
                                        <p className="text-white/50 text-sm mb-4">Pending payouts</p>
                                        <Link href="/admin/payouts" className="btn-secondary text-sm">
                                            Manage Payouts
                                        </Link>
                                    </div>
                                </div>

                                <div className="card">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-amber-400" />
                                        Orders This Month
                                    </h3>
                                    <div className="text-center py-6">
                                        <p className="text-4xl font-bold text-amber-400 mb-2">
                                            {stats.orders.this_month}
                                        </p>
                                        <p className="text-white/50 text-sm mb-4">Orders processed</p>
                                        <Link href="/admin/orders" className="btn-secondary text-sm">
                                            View All Orders
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="card">
                                <h3 className="font-semibold mb-4">Quick Actions</h3>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <Link href="/admin/resellers" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                                        <Users className="w-8 h-8 text-purple-400 mb-2" />
                                        <p className="font-medium">Manage Resellers</p>
                                        <p className="text-sm text-white/50">View and manage stores</p>
                                    </Link>
                                    <Link href="/admin/orders" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                                        <Package className="w-8 h-8 text-pink-400 mb-2" />
                                        <p className="font-medium">View Orders</p>
                                        <p className="text-sm text-white/50">Track all platform orders</p>
                                    </Link>
                                    <Link href="/admin/payouts" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                                        <CreditCard className="w-8 h-8 text-emerald-400 mb-2" />
                                        <p className="font-medium">Process Payouts</p>
                                        <p className="text-sm text-white/50">Approve pending payouts</p>
                                    </Link>
                                    <Link href="/" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                                        <Store className="w-8 h-8 text-amber-400 mb-2" />
                                        <p className="font-medium">View Platform</p>
                                        <p className="text-sm text-white/50">See the main site</p>
                                    </Link>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="card text-center py-16">
                            <AlertCircle className="w-16 h-16 mx-auto text-white/20 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No data available</h3>
                            <p className="text-white/50">Unable to load dashboard statistics</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
