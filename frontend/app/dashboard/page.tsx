'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard, ShoppingBag, Package,
    CreditCard, Settings, LogOut, Menu, X, Store,
    TrendingUp, DollarSign, ShoppingCart, Eye, Gem, ArrowRight
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
        { icon: LayoutDashboard, label: 'Overview', href: '/dashboard', active: true },
        { icon: ShoppingBag, label: 'Products', href: '/dashboard/products' },
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
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none"
                    style={{ backgroundImage: 'url("/lib/patterns/mandala-1.svg")', backgroundSize: '400px', backgroundPosition: 'center center' }} />

                {/* Header */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border-light px-6 lg:px-10 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <button className="lg:hidden text-text-primary p-2 hover:bg-bg-secondary rounded-lg transition-colors" onClick={() => setSidebarOpen(!sidebarOpen)}>
                                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                            <div>
                                <h1 className="text-2xl font-display font-medium text-text-primary tracking-tight">Dashboard</h1>
                                <p className="text-xs text-text-muted font-light uppercase tracking-widest mt-1">Managing {reseller?.business_name || 'Your Boutique'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {reseller?.is_published && reseller?.slug && (
                                <a
                                    href={`/store/${reseller.slug}`}
                                    target="_blank"
                                    className="px-5 py-2.5 bg-neutral-900 text-white rounded-full flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest hover:bg-jaipur-burgundy transition-all active:scale-95 shadow-lg shadow-black/10"
                                >
                                    <Eye className="w-4 h-4" />
                                    Launch Store
                                </a>
                            )}
                        </div>
                    </div>
                </header>

                <div className="p-6 lg:p-10 relative z-10 max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-[60vh]">
                            <div className="w-8 h-8 border-[3px] border-jaipur-gold/20 border-t-jaipur-gold rounded-full animate-spin" />
                        </div>
                    ) : (
                        <>
                            {/* Stats Grid */}
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                                {[
                                    {
                                        label: 'Total Revenue',
                                        value: `₹${(stats?.total_revenue || 0).toLocaleString()}`,
                                        icon: DollarSign,
                                        color: 'text-text-primary',
                                        bg: 'bg-bg-secondary'
                                    },
                                    {
                                        label: 'Total Orders',
                                        value: stats?.total_orders || 0,
                                        icon: ShoppingCart,
                                        color: 'text-jaipur-burgundy',
                                        bg: 'bg-jaipur-burgundy/5'
                                    },
                                    {
                                        label: 'Total Earnings',
                                        value: `₹${(stats?.total_commission || 0).toLocaleString()}`,
                                        icon: TrendingUp,
                                        color: 'text-jaipur-gold',
                                        bg: 'bg-jaipur-gold/5'
                                    },
                                    {
                                        label: 'Live Products',
                                        value: stats?.total_products || 0,
                                        icon: ShoppingBag,
                                        color: 'text-text-primary',
                                        bg: 'bg-bg-secondary'
                                    },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white p-7 rounded-[2rem] border border-border-light shadow-sm hover:shadow-xl hover:border-jaipur-gold/20 transition-all duration-500 group">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`p-3 ${stat.bg} rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                            </div>
                                        </div>
                                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">{stat.label}</p>
                                        <p className="text-2xl font-bold font-display text-text-primary">{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Secondary Sections */}
                            <div className="grid lg:grid-cols-2 gap-8 mb-10">
                                <div className="bg-white p-8 rounded-[2.5rem] border border-border-light shadow-sm">
                                    <h3 className="font-display text-xl font-medium mb-6 text-text-primary flex items-center gap-2">
                                        Monthly Performance
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between py-4 border-b border-bg-secondary">
                                            <span className="text-sm text-text-secondary font-light">Total Conversions</span>
                                            <span className="font-semibold text-text-primary">{stats?.orders_this_month || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-4 border-b border-bg-secondary">
                                            <span className="text-sm text-text-secondary font-light">Gross Sales</span>
                                            <span className="font-semibold text-text-primary">₹{(stats?.revenue_this_month || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-4">
                                            <span className="text-sm text-text-secondary font-light">Net Commission</span>
                                            <span className="font-display text-lg font-medium text-jaipur-gold">₹{(stats?.commission_this_month || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-jaipur-burgundy p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />

                                    <h3 className="font-display text-xl font-medium mb-2 text-white/90">Wallet Balance</h3>
                                    <p className="text-xs text-jaipur-gold font-bold uppercase tracking-widest mb-10">Available</p>

                                    <div className="mb-10">
                                        <p className="text-4xl font-display font-medium text-white mb-2">
                                            ₹{(stats?.pending_payout || 0).toLocaleString()}
                                        </p>
                                        <p className="text-white/40 text-xs font-light tracking-wide">Ready for concierge withdrawal</p>
                                    </div>

                                    <Link href="/dashboard/payouts" className="inline-flex items-center gap-2 px-6 py-3 bg-jaipur-gold text-jaipur-burgundy rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white transition-all shadow-lg active:scale-95">
                                        Withdraw Funds <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>

                            {/* Boutique Actions */}
                            <div className="bg-white p-10 rounded-[3rem] border border-border-light shadow-sm">
                                <h3 className="font-display text-2xl font-medium mb-10 text-text-primary">Quick Actions</h3>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        { label: 'Products', sub: 'Manage Catalog', icon: ShoppingBag, color: 'text-jaipur-burgundy', href: '/dashboard/products' },
                                        { label: 'Orders', sub: 'Track Shipments', icon: Package, color: 'text-text-primary', href: '/dashboard/orders' },
                                        { label: 'Settings', sub: 'Configure Store', icon: Settings, color: 'text-jaipur-gold', href: '/dashboard/settings' },
                                        { label: 'My Store', sub: 'Visit Public Page', icon: Store, color: 'text-text-muted', href: `/store/${reseller?.slug}`, external: true },
                                    ].map((action, i) => (
                                        action.external ? (
                                            <a key={i} href={action.href} target="_blank" className="group p-6 rounded-[2rem] bg-bg-secondary hover:bg-white border border-transparent hover:border-jaipur-gold/20 hover:shadow-xl transition-all duration-500">
                                                <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-bg-secondary flex items-center justify-center mb-6 shadow-sm transition-transform duration-500 group-hover:rotate-12">
                                                    <action.icon className={`w-6 h-6 ${action.color}`} />
                                                </div>
                                                <p className="font-display text-lg font-medium text-text-primary tracking-tight">{action.label}</p>
                                                <p className="text-xs text-text-muted font-light mt-1">{action.sub}</p>
                                            </a>
                                        ) : (
                                            <Link key={i} href={action.href} className="group p-6 rounded-[2rem] bg-bg-secondary hover:bg-white border border-transparent hover:border-jaipur-gold/20 hover:shadow-xl transition-all duration-500">
                                                <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-bg-secondary flex items-center justify-center mb-6 shadow-sm transition-transform duration-500 group-hover:rotate-12">
                                                    <action.icon className={`w-6 h-6 ${action.color}`} />
                                                </div>
                                                <p className="font-display text-lg font-medium text-text-primary tracking-tight">{action.label}</p>
                                                <p className="text-xs text-text-muted font-light mt-1">{action.sub}</p>
                                            </Link>
                                        )
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

