'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Diamond, LayoutDashboard, ShoppingBag, Package,
    CreditCard, Settings, LogOut, Menu, X, Store,
    TrendingUp, DollarSign, ShoppingCart, Eye, Gem
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
        <div className="min-h-screen flex bg-bg-primary">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-jaipur-burgundy text-white transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl`}>
                <div className="flex items-center gap-3 p-6 border-b border-white/10">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                        <Gem className="w-5 h-5 text-jaipur-gold" />
                    </div>
                    <span className="font-display text-xl font-bold tracking-wide">JewelryHub</span>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${item.active
                                ? 'bg-white text-jaipur-burgundy shadow-lg font-medium'
                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${item.active ? 'text-jaipur-terra' : ''}`} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <main className="flex-1 lg:ml-64 relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'url("/lib/patterns/mandala-1.svg")', backgroundSize: '400px', backgroundPosition: 'center center' }} />

                {/* Header */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border-light px-4 lg:px-8 py-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                className="lg:hidden text-text-primary p-2 hover:bg-bg-secondary rounded-lg transition-colors"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            >
                                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                            <div>
                                <h1 className="text-xl font-display font-semibold text-text-primary">Dashboard</h1>
                                <p className="text-sm text-text-secondary">Welcome back, {reseller?.business_name || 'Reseller'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {reseller?.is_published && (
                                <a
                                    href={`/store/${reseller.slug}`}
                                    target="_blank"
                                    className="btn-secondary flex items-center gap-2 text-sm px-4 py-2 hover:bg-bg-secondary transition-colors"
                                >
                                    <Eye className="w-4 h-4" />
                                    View Store
                                </a>
                            )}
                        </div>
                    </div>
                </header>

                <div className="p-4 lg:p-8 relative z-10">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-10 h-10 border-2 border-jaipur-terra border-t-transparent rounded-full animate-spin" />
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
                                        color: 'jaipur-peacock',
                                        bg: 'bg-jaipur-peacock/10'
                                    },
                                    {
                                        label: 'Total Orders',
                                        value: stats?.total_orders || 0,
                                        icon: ShoppingCart,
                                        color: 'jaipur-burgundy',
                                        bg: 'bg-jaipur-pink/30'
                                    },
                                    {
                                        label: 'Your Commission',
                                        value: `₹${(stats?.total_commission || 0).toLocaleString()}`,
                                        icon: TrendingUp,
                                        color: 'jaipur-gold-dark',
                                        bg: 'bg-jaipur-gold/20'
                                    },
                                    {
                                        label: 'Active Products',
                                        value: stats?.total_products || 0,
                                        icon: ShoppingBag,
                                        color: 'jaipur-terra',
                                        bg: 'bg-jaipur-terra/10'
                                    },
                                ].map((stat, i) => (
                                    <div key={i} className="card bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-2 border-transparent hover:border-jaipur-gold">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm text-text-secondary mb-1 font-medium">{stat.label}</p>
                                                <p className="text-2xl font-bold font-display text-text-primary">{stat.value}</p>
                                            </div>
                                            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                                <stat.icon className={`w-5 h-5 text-${stat.color}`} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* This Month */}
                            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                                <div className="card bg-white shadow-lg border-border-light">
                                    <h3 className="font-display font-semibold mb-4 text-text-primary flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-jaipur-peacock" />
                                        Performance This Month
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between py-3 border-b border-border-light">
                                            <span className="text-text-secondary">Orders</span>
                                            <span className="font-semibold text-text-primary">{stats?.orders_this_month || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-3 border-b border-border-light">
                                            <span className="text-text-secondary">Revenue</span>
                                            <span className="font-semibold text-text-primary">₹{(stats?.revenue_this_month || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-3">
                                            <span className="text-text-secondary">Commission</span>
                                            <span className="font-semibold text-jaipur-peacock">₹{(stats?.commission_this_month || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card bg-white shadow-lg border-border-light relative overflow-hidden">
                                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-jaipur-gold/10 rounded-full blur-xl" />

                                    <h3 className="font-display font-semibold mb-4 text-text-primary flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-jaipur-terra" />
                                        Pending Payout
                                    </h3>
                                    <div className="text-center py-8 relative z-10">
                                        <p className="text-4xl font-display font-bold text-jaipur-terra mb-2">
                                            ₹{(stats?.pending_payout || 0).toLocaleString()}
                                        </p>
                                        <p className="text-text-secondary text-sm mb-6">Available for withdrawal</p>
                                        <Link href="/dashboard/payouts" className="btn-primary text-sm shadow-gold">
                                            Request Payout
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="card bg-white shadow-lg border-border-light">
                                <h3 className="font-display font-semibold mb-4 text-text-primary">Quick Actions</h3>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <Link href="/dashboard/products" className="p-4 rounded-xl bg-bg-secondary hover:bg-jaipur-pink/20 border border-transparent hover:border-jaipur-pink/50 transition-all text-center group">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform">
                                            <ShoppingBag className="w-5 h-5 text-jaipur-burgundy" />
                                        </div>
                                        <span className="text-sm font-medium text-text-primary block">Add Products</span>
                                    </Link>

                                    <Link href="/dashboard/orders" className="p-4 rounded-xl bg-bg-secondary hover:bg-jaipur-pink/20 border border-transparent hover:border-jaipur-pink/50 transition-all text-center group">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform">
                                            <Package className="w-5 h-5 text-jaipur-peacock" />
                                        </div>
                                        <span className="text-sm font-medium text-text-primary block">View Orders</span>
                                    </Link>

                                    <Link href="/dashboard/settings" className="p-4 rounded-xl bg-bg-secondary hover:bg-jaipur-pink/20 border border-transparent hover:border-jaipur-pink/50 transition-all text-center group">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform">
                                            <Settings className="w-5 h-5 text-jaipur-gold-dark" />
                                        </div>
                                        <span className="text-sm font-medium text-text-primary block">Store Settings</span>
                                    </Link>

                                    {reseller?.slug && (
                                        <a href={`/store/${reseller.slug}`} target="_blank" className="p-4 rounded-xl bg-bg-secondary hover:bg-jaipur-pink/20 border border-transparent hover:border-jaipur-pink/50 transition-all text-center group">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform">
                                                <Store className="w-5 h-5 text-jaipur-terra" />
                                            </div>
                                            <span className="text-sm font-medium text-text-primary block">Visit Store</span>
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
