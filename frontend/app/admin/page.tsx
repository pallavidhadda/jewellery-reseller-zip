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
                    <AlertCircle className="w-16 h-16 mx-auto text-jaipur-burgundy mb-4" />
                    <h1 className="text-2xl font-display font-medium mb-2 text-text-primary">Access Denied</h1>
                    <p className="text-text-secondary font-light mb-6">{error}</p>
                    <div className="space-y-3">
                        <Link href="/login" className="btn-primary block shadow-gold">
                            Login as Admin
                        </Link>
                        <p className="text-[11px] text-text-muted font-bold uppercase tracking-widest">
                            Admin: admin@jewelryplatform.com / admin123
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-bg-secondary">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-jaipur-burgundy text-white transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl`}>
                <div className="flex items-center gap-3 p-6 border-b border-white/5">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <Gem className="w-5 h-5 text-jaipur-gold" />
                    </div>
                    <div>
                        <span className="font-display text-xl font-medium tracking-tight">JewelryHub</span>
                        <span className="block text-[10px] text-jaipur-gold/70 uppercase tracking-[0.2em] font-bold">Registry</span>
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

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
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
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none"
                    style={{ backgroundImage: 'url("/lib/patterns/geometric-jali.svg")', backgroundSize: '180px' }} />

                {/* Header */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border-light px-6 lg:px-10 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <button className="lg:hidden text-text-primary p-2 hover:bg-bg-secondary rounded-lg transition-colors" onClick={() => setSidebarOpen(!sidebarOpen)}>
                                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                            <div>
                                <h1 className="text-2xl font-display font-medium text-text-primary tracking-tight">Overview</h1>
                                <p className="text-xs text-text-muted font-light uppercase tracking-widest mt-1">Platform Orchestration</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-6 lg:p-10 relative z-10 max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-[60vh]">
                            <div className="w-8 h-8 border-[3px] border-jaipur-gold/20 border-t-jaipur-gold rounded-full animate-spin" />
                        </div>
                    ) : stats ? (
                        <>
                            {/* Stats Grid */}
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                                <div className="bg-white p-7 rounded-[2rem] border border-border-light shadow-sm hover:shadow-xl hover:border-jaipur-gold/20 transition-all duration-500 group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-jaipur-gold/5 rounded-2xl group-hover:bg-jaipur-gold/10 transition-colors">
                                            <DollarSign className="w-5 h-5 text-jaipur-gold" />
                                        </div>
                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
                                    </div>
                                    <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1">Gross Revenue</p>
                                    <p className="text-2xl font-bold text-text-primary font-display">₹{stats.revenue.total.toLocaleString()}</p>
                                </div>

                                <div className="bg-white p-7 rounded-[2rem] border border-border-light shadow-sm hover:shadow-xl hover:border-jaipur-gold/20 transition-all duration-500 group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-jaipur-burgundy/5 rounded-2xl group-hover:bg-jaipur-burgundy/10 transition-colors">
                                            <Users className="w-5 h-5 text-jaipur-burgundy" />
                                        </div>
                                    </div>
                                    <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1">Active Resellers</p>
                                    <p className="text-2xl font-bold text-text-primary font-display">{stats.resellers.active}</p>
                                </div>

                                <div className="bg-white p-7 rounded-[2rem] border border-border-light shadow-sm hover:shadow-xl hover:border-jaipur-gold/20 transition-all duration-500 group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-neutral-900/5 rounded-2xl group-hover:bg-neutral-900/10 transition-colors">
                                            <ShoppingCart className="w-5 h-5 text-neutral-900" />
                                        </div>
                                    </div>
                                    <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1">Total Orders</p>
                                    <p className="text-2xl font-bold text-text-primary font-display">{stats.orders.total}</p>
                                </div>

                                <div className="bg-white p-7 rounded-[2rem] border border-border-light shadow-sm hover:shadow-xl hover:border-jaipur-gold/20 transition-all duration-500 group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-jaipur-gold/5 rounded-2xl group-hover:bg-jaipur-gold/10 transition-colors">
                                            <Package className="w-5 h-5 text-jaipur-gold" />
                                        </div>
                                    </div>
                                    <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1">Jewelry Library</p>
                                    <p className="text-2xl font-bold text-text-primary font-display">{stats.products.total}</p>
                                </div>
                            </div>

                            {/* Secondary Sections */}
                            <div className="grid lg:grid-cols-3 gap-8 mb-10">
                                <div className="bg-white p-8 rounded-[2.5rem] border border-border-light shadow-sm lg:col-span-1">
                                    <h3 className="font-display text-xl font-medium mb-6 text-text-primary">Platform Pulse</h3>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Total Resellers', value: stats.resellers.total },
                                            { label: 'Verified Manufacturers', value: stats.manufacturers.total },
                                            { label: 'Published Stores', value: stats.resellers.active },
                                            { label: 'Global Catalog', value: stats.products.total },
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center py-4 border-b border-bg-secondary last:border-0">
                                                <span className="text-sm text-text-secondary font-light">{item.label}</span>
                                                <span className="font-medium text-text-primary">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-jaipur-burgundy p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                    <h3 className="font-display text-xl font-medium mb-2 text-white/90">Pending Settlements</h3>
                                    <p className="text-xs text-jaipur-gold font-bold uppercase tracking-widest mb-10">Reseller Payouts</p>

                                    <div className="mb-10">
                                        <p className="text-4xl font-display font-medium text-white mb-2">
                                            ₹{stats.payouts.pending.toLocaleString()}
                                        </p>
                                        <p className="text-white/50 text-xs font-light">Accrued over the last 14 days</p>
                                    </div>

                                    <Link href="/admin/payouts" className="inline-flex items-center gap-2 px-6 py-3 bg-jaipur-gold text-jaipur-burgundy rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white transition-all shadow-lg active:scale-95">
                                        Process Payouts <ArrowRight size={14} />
                                    </Link>
                                </div>

                                <div className="bg-white p-8 rounded-[2.5rem] border border-border-light shadow-sm flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-display text-xl font-medium mb-2 text-text-primary">Monthly Velocity</h3>
                                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-8">Performance Snapshot</p>

                                        <div className="text-center py-4">
                                            <p className="text-4xl font-display font-medium text-text-primary mb-2">
                                                {stats.orders.this_month}
                                            </p>
                                            <p className="text-text-secondary text-xs font-light italic">Successful conversions this cycle</p>
                                        </div>
                                    </div>

                                    <Link href="/admin/orders" className="w-full flex items-center justify-center gap-2 py-4 bg-bg-secondary hover:bg-bg-accent text-text-primary rounded-2xl text-xs font-bold uppercase tracking-widest transition-all">
                                        Audit History
                                    </Link>
                                </div>
                            </div>

                            {/* Orchestration Tools */}
                            <div className="bg-white p-10 rounded-[3rem] border border-border-light shadow-sm">
                                <h3 className="font-display text-2xl font-medium mb-10 text-text-primary">Registry Coordination</h3>

                                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        { label: 'Resellers', sub: 'Audit & Enable', icon: Users, color: 'text-jaipur-gold', href: '/admin/resellers' },
                                        { label: 'Inventory', sub: 'Standardize Stock', icon: Package, color: 'text-text-primary', href: '/admin/orders' },
                                        { label: 'Settlements', sub: 'Payout Queue', icon: CreditCard, color: 'text-emerald-600', href: '/admin/payouts' },
                                        { label: 'Concierge', sub: 'Support Flux', icon: Gem, color: 'text-jaipur-burgundy', href: '/' },
                                    ].map((action, i) => (
                                        <Link key={i} href={action.href} className="group p-6 rounded-[2rem] bg-bg-secondary hover:bg-white border border-transparent hover:border-jaipur-gold/20 hover:shadow-xl transition-all duration-500">
                                            <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-bg-secondary flex items-center justify-center mb-6 shadow-sm transition-transform duration-500 group-hover:rotate-12">
                                                <action.icon className={`w-6 h-6 ${action.color}`} />
                                            </div>
                                            <p className="font-display text-lg font-medium text-text-primary tracking-tight">{action.label}</p>
                                            <p className="text-xs text-text-muted font-light mt-1">{action.sub}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-white rounded-[3rem] border border-border-light shadow-xl text-center py-20">
                            <AlertCircle className="w-16 h-16 mx-auto text-jaipur-gold/20 mb-6" />
                            <h3 className="text-2xl font-display font-medium text-text-primary mb-2">Vault Synchronizing</h3>
                            <p className="text-text-secondary font-light">Unable to retrieve registry data at this moment.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

