'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Diamond, LayoutDashboard, ShoppingBag, Package,
    CreditCard, Settings, LogOut, Menu, X, Store,
    TrendingUp, DollarSign, ShoppingCart, Eye
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';

interface DashboardStats {
    total_products: number;
    total_orders: number;
    total_revenue: number;
    total_commission: number;
    pending_payout: number;
    orders_this_month: number;
    revenue_this_month: number;
    commission_this_month: number;
}

export default function DashboardPage() {
    const router = useRouter();
    const { user, reseller, logout } = useAuthStore();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await api.getDashboardStats();
            setStats(data as DashboardStats);
        } catch (err) {
            console.error('Failed to load dashboard stats:', err);
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
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', active: true },
        { icon: ShoppingBag, label: 'Products', href: '/dashboard/products' },
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
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <main className="flex-1 lg:ml-64">
                {/* Header */}
                <header className="sticky top-0 z-30 glass border-b border-white/10 px-4 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                className="lg:hidden text-white p-2"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            >
                                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                            <div>
                                <h1 className="text-xl font-semibold">Dashboard</h1>
                                <p className="text-sm text-white/50">Welcome back, {reseller?.business_name || 'Reseller'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {reseller?.is_published && (
                                <a
                                    href={`/store/${reseller.slug}`}
                                    target="_blank"
                                    className="btn-secondary flex items-center gap-2 text-sm"
                                >
                                    <Eye className="w-4 h-4" />
                                    View Store
                                </a>
                            )}
                        </div>
                    </div>
                </header>

                <div className="p-4 lg:p-8">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <>
                            {/* Stats Grid */}
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                {[
                                    {
                                        label: 'Total Revenue',
                                        value: `₹${(stats?.total_revenue || 0).toLocaleString()}`,
                                        icon: DollarSign,
                                        color: 'purple'
                                    },
                                    {
                                        label: 'Total Orders',
                                        value: stats?.total_orders || 0,
                                        icon: ShoppingCart,
                                        color: 'pink'
                                    },
                                    {
                                        label: 'Your Commission',
                                        value: `₹${(stats?.total_commission || 0).toLocaleString()}`,
                                        icon: TrendingUp,
                                        color: 'amber'
                                    },
                                    {
                                        label: 'Active Products',
                                        value: stats?.total_products || 0,
                                        icon: ShoppingBag,
                                        color: 'emerald'
                                    },
                                ].map((stat, i) => (
                                    <div key={i} className="card">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm text-white/50 mb-1">{stat.label}</p>
                                                <p className="text-2xl font-bold">{stat.value}</p>
                                            </div>
                                            <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center`}>
                                                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* This Month */}
                            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                                <div className="card">
                                    <h3 className="font-semibold mb-4">This Month</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between py-3 border-b border-white/10">
                                            <span className="text-white/60">Orders</span>
                                            <span className="font-semibold">{stats?.orders_this_month || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-3 border-b border-white/10">
                                            <span className="text-white/60">Revenue</span>
                                            <span className="font-semibold">₹{(stats?.revenue_this_month || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-3">
                                            <span className="text-white/60">Commission</span>
                                            <span className="font-semibold text-purple-400">₹{(stats?.commission_this_month || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <h3 className="font-semibold mb-4">Pending Payout</h3>
                                    <div className="text-center py-8">
                                        <p className="text-4xl font-bold gradient-text mb-2">
                                            ₹{(stats?.pending_payout || 0).toLocaleString()}
                                        </p>
                                        <p className="text-white/50 text-sm mb-4">Available for withdrawal</p>
                                        <Link href="/dashboard/payouts" className="btn-primary text-sm">
                                            Request Payout
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="card">
                                <h3 className="font-semibold mb-4">Quick Actions</h3>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <Link href="/dashboard/products" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-center">
                                        <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                                        <span className="text-sm">Add Products</span>
                                    </Link>
                                    <Link href="/dashboard/orders" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-center">
                                        <Package className="w-8 h-8 mx-auto mb-2 text-pink-400" />
                                        <span className="text-sm">View Orders</span>
                                    </Link>
                                    <Link href="/dashboard/settings" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-center">
                                        <Settings className="w-8 h-8 mx-auto mb-2 text-amber-400" />
                                        <span className="text-sm">Store Settings</span>
                                    </Link>
                                    {reseller?.slug && (
                                        <a href={`/store/${reseller.slug}`} target="_blank" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-center">
                                            <Store className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                                            <span className="text-sm">Visit Store</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
