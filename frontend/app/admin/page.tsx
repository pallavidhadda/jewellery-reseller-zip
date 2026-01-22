'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard, Users, Package, CreditCard,
    Settings, LogOut, Menu, X, Store, TrendingUp,
    DollarSign, ShoppingCart, AlertCircle, CheckCircle,
    Clock, ArrowRight, Gem
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
            <div className="min-h-screen flex items-center justify-center px-4 bg-bg-primary">
                <div className="card max-w-md w-full text-center bg-white shadow-xl">
                    <AlertCircle className="w-16 h-16 mx-auto text-jaipur-terra mb-4" />
                    <h1 className="text-2xl font-display font-bold mb-2 text-text-primary">Access Denied</h1>
                    <p className="text-text-secondary mb-6">{error}</p>
                    <div className="space-y-3">
                        <Link href="/login" className="btn-primary block shadow-gold">
                            Login as Admin
                        </Link>
                        <p className="text-sm text-text-muted">
                            Admin: admin@jewelryplatform.com / admin123
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-bg-primary">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-jaipur-burgundy text-white transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl`}>
                <div className="flex items-center gap-3 p-6 border-b border-white/10">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                        <Gem className="w-5 h-5 text-jaipur-gold" />
                    </div>
                    <div>
                        <span className="font-display text-xl font-bold tracking-wide">JewelryHub</span>
                        <span className="block text-xs text-jaipur-gold opacity-80 uppercase tracking-widest">Admin Panel</span>
                    </div>
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
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main content */}
            <main className="flex-1 lg:ml-64 relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'url("/lib/patterns/geometric-jali.svg")', backgroundSize: '150px' }} />

                {/* Header */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border-light px-4 lg:px-8 py-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button className="lg:hidden text-text-primary p-2 hover:bg-bg-secondary rounded-lg transition-colors" onClick={() => setSidebarOpen(!sidebarOpen)}>
                                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                            <div>
                                <h1 className="text-xl font-display font-semibold text-text-primary">Overview</h1>
                                <p className="text-sm text-text-secondary">Platform statistics and management</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-4 lg:p-8 relative z-10">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-10 h-10 border-2 border-jaipur-terra border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : stats ? (
                        <>
                            {/* Stats Grid */}
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                <div className="card bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-jaipur-peacock">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-text-secondary mb-1 font-medium">Total Revenue</p>
                                            <p className="text-2xl font-bold text-text-primary font-display">₹{stats.revenue.total.toLocaleString()}</p>
                                            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                                <TrendingUp className="w-3 h-3" />
                                                ₹{stats.revenue.this_month.toLocaleString()} this month
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-jaipur-peacock/10 flex items-center justify-center text-jaipur-peacock">
                                            <DollarSign className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>

                                <div className="card bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-jaipur-terra">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-text-secondary mb-1 font-medium">Active Resellers</p>
                                            <p className="text-2xl font-bold text-text-primary font-display">{stats.resellers.active}</p>
                                            <p className="text-xs text-jaipur-terra mt-1">
                                                +{stats.resellers.new_this_month} new accounts
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-jaipur-terra/10 flex items-center justify-center text-jaipur-terra">
                                            <Users className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>

                                <div className="card bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-jaipur-pink">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-text-secondary mb-1 font-medium">Total Orders</p>
                                            <p className="text-2xl font-bold text-text-primary font-display">{stats.orders.total}</p>
                                            <p className="text-xs text-jaipur-burgundy mt-1">
                                                {stats.orders.pending} pending fulfillment
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-jaipur-pink/30 flex items-center justify-center text-jaipur-burgundy">
                                            <ShoppingCart className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>

                                <div className="card bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-jaipur-gold">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-text-secondary mb-1 font-medium">Products</p>
                                            <p className="text-2xl font-bold text-text-primary font-display">{stats.products.total}</p>
                                            <p className="text-xs text-jaipur-gold-dark mt-1">
                                                From {stats.manufacturers.total} manufacturer(s)
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-jaipur-gold/20 flex items-center justify-center text-jaipur-gold-dark">
                                            <Package className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Secondary Stats */}
                            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                                <div className="card bg-white shadow-lg border-border-light">
                                    <h3 className="font-display font-semibold mb-4 flex items-center gap-2 text-text-primary">
                                        <TrendingUp className="w-5 h-5 text-jaipur-peacock" />
                                        Platform Summary
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between py-2 border-b border-border-light">
                                            <span className="text-text-secondary">Total Resellers</span>
                                            <span className="font-semibold text-text-primary">{stats.resellers.total}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-border-light">
                                            <span className="text-text-secondary">Active Stores</span>
                                            <span className="font-semibold text-text-primary">{stats.resellers.active}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-border-light">
                                            <span className="text-text-secondary">Manufacturers</span>
                                            <span className="font-semibold text-text-primary">{stats.manufacturers.total}</span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-text-secondary">Products in Catalog</span>
                                            <span className="font-semibold text-text-primary">{stats.products.total}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card bg-white shadow-lg border-border-light relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-jaipur-pink/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />

                                    <h3 className="font-display font-semibold mb-4 flex items-center gap-2 text-text-primary relative z-10">
                                        <CreditCard className="w-5 h-5 text-jaipur-terra" />
                                        Payouts
                                    </h3>
                                    <div className="text-center py-6 relative z-10">
                                        <p className="text-4xl font-display font-bold text-jaipur-terra mb-2">
                                            ₹{stats.payouts.pending.toLocaleString()}
                                        </p>
                                        <p className="text-text-secondary text-sm mb-6">Pending payouts to resellers</p>
                                        <Link href="/admin/payouts" className="btn-secondary text-sm px-6 hover:bg-jaipur-terra hover:text-white hover:border-jaipur-terra transition-all">
                                            Manage Payouts
                                        </Link>
                                    </div>
                                </div>

                                <div className="card bg-white shadow-lg border-border-light relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-jaipur-gold/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />

                                    <h3 className="font-display font-semibold mb-4 flex items-center gap-2 text-text-primary relative z-10">
                                        <Clock className="w-5 h-5 text-jaipur-gold-dark" />
                                        Orders This Month
                                    </h3>
                                    <div className="text-center py-6 relative z-10">
                                        <p className="text-4xl font-display font-bold text-jaipur-gold-dark mb-2">
                                            {stats.orders.this_month}
                                        </p>
                                        <p className="text-text-secondary text-sm mb-6">Orders processed successfully</p>
                                        <Link href="/admin/orders" className="btn-secondary text-sm px-6 hover:bg-jaipur-gold hover:text-white hover:border-jaipur-gold transition-all">
                                            View All Orders
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="card bg-white shadow-lg border-border-light">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-display font-semibold text-lg text-text-primary">Quick Actions</h3>
                                </div>

                                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <Link href="/admin/resellers" className="p-4 rounded-xl bg-bg-secondary hover:bg-jaipur-pink/20 border border-transparent hover:border-jaipur-pink/50 transition-all group">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                            <Users className="w-5 h-5 text-jaipur-peacock" />
                                        </div>
                                        <p className="font-medium text-text-primary">Manage Resellers</p>
                                        <p className="text-sm text-text-secondary mt-1">View and approve stores</p>
                                    </Link>

                                    <Link href="/admin/orders" className="p-4 rounded-xl bg-bg-secondary hover:bg-jaipur-pink/20 border border-transparent hover:border-jaipur-pink/50 transition-all group">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                            <Package className="w-5 h-5 text-jaipur-terra" />
                                        </div>
                                        <p className="font-medium text-text-primary">View Orders</p>
                                        <p className="text-sm text-text-secondary mt-1">Track platform orders</p>
                                    </Link>

                                    <Link href="/admin/payouts" className="p-4 rounded-xl bg-bg-secondary hover:bg-jaipur-pink/20 border border-transparent hover:border-jaipur-pink/50 transition-all group">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                            <CreditCard className="w-5 h-5 text-green-600" />
                                        </div>
                                        <p className="font-medium text-text-primary">Process Payouts</p>
                                        <p className="text-sm text-text-secondary mt-1">Approve pending payouts</p>
                                    </Link>

                                    <Link href="/" className="p-4 rounded-xl bg-bg-secondary hover:bg-jaipur-pink/20 border border-transparent hover:border-jaipur-pink/50 transition-all group">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                            <Store className="w-5 h-5 text-jaipur-gold-dark" />
                                        </div>
                                        <p className="font-medium text-text-primary">View Platform</p>
                                        <p className="text-sm text-text-secondary mt-1">Visit the main site</p>
                                    </Link>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="card bg-white shadow-xl text-center py-16">
                            <AlertCircle className="w-16 h-16 mx-auto text-text-muted mb-4" />
                            <h3 className="text-xl font-semibold mb-2 text-text-primary">No data available</h3>
                            <p className="text-text-secondary">Unable to load dashboard statistics</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
